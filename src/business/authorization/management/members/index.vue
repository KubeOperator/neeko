<template>
  <el-row>
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig"
            v-loading="loading"
            @selection-change="handleSelectionChange">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="openCreate()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="openDelete" :disabled="selects.length===0">{{
              $t("commons.button.delete")
            }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.username }}</template>
      </el-table-column>
      <el-table-column :label="$t('user.email')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.email }}</template>
      </el-table-column>
      <el-table-column :label="$t('user.role')">
        <template v-slot:default="{ row }">
          <el-tag type="info" size="small">
            {{ $t("project." + row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
    </complex-table>
    <el-dialog
            :visible="openCreatePage"
            :title="$t('project.add_project_manager')"
            width="30%"
            @close="cancel">
      <el-select
              v-model="form.names"
              size="medium"
              multiple
              filterable
              remote
              reserve-keyword
              :placeholder="$t('project.key_words')"
              :remote-method="getUsers"
              :loading="searchUserLoading"
              style="width:100%">
        <el-option
                v-for="(item,index) in users"
                :key="index"
                :label="item"
                :value="item">
        </el-option>
      </el-select>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="cancel">{{ $t("commons.button.cancel") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("commons.button.save") }}</el-button>
    </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {listProjectMembers, listUsers, createProjectMember, deleteProjectMember} from "@/api/project-member"
import {listClusterMembers, createClusterMember, deleteClusterMember} from "@/api/cluster-member"

export default {
  name: "MemberList",
  components: { ComplexTable },
  props: ["name", "type"],
  data () {
    return {
      columns: [],
      buttons: [],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
      openCreatePage: false,
      searchUserLoading: false,
      users: [],
      form: {
        names: []
      },
      selects: [],
    }
  },
  created () {
    if (this.type === "PROJECT") {
      this.getMemberList()
    }
  },
  methods: {
    getMemberList () {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      if (this.type === "PROJECT") {
        listProjectMembers(this.name, currentPage, pageSize).then(data => {
          this.loading = false
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      }
      if (this.type === "CLUSTER") {
        listClusterMembers(this.name, currentPage, pageSize).then(data => {
          this.loading = false
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      }
    },
    getUsers (query) {
      if (query !== "") {
        this.searchUserLoading = true
        listUsers(this.name, query).then(data => {
          this.searchUserLoading = false
          this.users = data.items
        })
      }
    },
    openCreate () {
      this.openCreatePage = true
    },
    cancel () {
      this.openCreatePage = false
      this.users = []
      this.form.names = []
    },
    submit () {
      if (this.type === "CLUSTER") {
        createClusterMember(this.name, {
          userNames: this.form.names
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.cancel()
          this.getMemberList()
        }).catch(error => {
          this.$message({
            type: "error",
            message: error.error.msg,
          })
        })
      }

      if (this.type === "PROJECT") {
        createProjectMember(this.name, {
          userNames: this.form.names
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.cancel()
          this.getMemberList()
        }).catch(error => {
          this.$message({
            type: "error",
            message: error.error.msg,
          })
        })
      }
    },
    openDelete () {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning"
      }).then(() => {
        const ps = []
        for (const item of this.selects) {
          if (this.type === "PROJECT") {
            ps.push(deleteProjectMember(this.name, item.username))
          }
          if (this.type === "CLUSTER") {
            ps.push(deleteClusterMember(this.name, item.username))
          }
        }
        Promise.all(ps).then(() => {
          this.getMemberList()
          this.$message({
            type: "success",
            message: this.$t("commons.msg.delete_success"),
          })
        })
      })
    },
    handleSelectionChange (val) {
      this.selects = val
    }
  },
  computed: {
    member () {
      const { name, type } = this
      return {
        name, type
      }
    }
  },
  watch: {
    member: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.getMemberList()
        }
      }
    },
  }
}
</script>

<style scoped>

</style>