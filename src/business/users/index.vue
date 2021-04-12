<template>
  <layout-content :header="$t('user.user')">
    <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                   @selection-change="handleSelectionChange"
                   :pagination-config="paginationConfig" @search="search" v-loading="loading">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{ $t("commons.button.create") }}</el-button>
          <el-button size="small" :disabled="selects.length===0" @click="del()">{{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100" fix>
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="3">
              <font-awesome-icon icon="user" size="3x"/>
            </el-col>
            <el-col :span="18">
              {{ row.name }}<br/>
              {{ row.email }}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status === 'active'" type="success" size="small">{{ $t("commons.status.active") }}</el-tag>
          <el-tag v-if="row.status === 'passive'" type="danger" size="small">{{ $t("commons.status.passive") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.role')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag type="info" size="small">{{ $t(`commons.role.${row.role}`) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {searchUsers, deleteUser} from "@/api/user"
import ComplexTable from "@/components/complex-table"


export default {
  name: "UserList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.edit"), icon: "el-icon-edit", click: (row) => {
            this.$router.push({ name: "UserEdit", params: { name: row.name } })

          }
        },
        {
          label: this.$t("commons.button.delete"), icon: "el-icon-delete", type: "danger", click: (row) => {
            this.del(row.name)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput", defaultOperator: "eq" },
          {
            field: "is_active",
            label: this.$t("commons.table.status"),
            component: "FuComplexSelect",
            options: [
              { label: this.$t("commons.status.active"), value: 1 },
              { label: this.$t("commons.status.passive"), value: 0 },
            ],
            multiple: true
          },
          {
            field: "is_admin",
            label: this.$t("user.role"),
            component: "FuComplexSelect",
            options: [
              { label: this.$t("commons.role.admin"), value: 1 },
              { label: this.$t("commons.role.user"), value: 0 },
            ],
            multiple: true
          },
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      loading: false,
      selects: []
    }
  },
  methods: {
    select (selection) {
      console.log(selection)
    },
    create () {
      this.$router.push({ name: "UserCreate" })
    },
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchUsers(currentPage, pageSize, condition).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    del (name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning"
      }).then(() => {
        if (name) {
          deleteUser(name).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: `${name}${this.$t("commons.msg.delete_success")}!`
            })
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteUser(item.name))
          }
          Promise.all(ps).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.selects = val
    }
  },
  created () {
    this.search()
  },
}
</script>

<style scoped>

</style>
