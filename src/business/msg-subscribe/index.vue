<template>
  <layout-content :header="$t('message.message_subscribe')" v-loading="loading">
    <el-tabs v-model="type" @tab-click="changeType">
      <el-tab-pane :label="$t('message.message_system')" name="SYSTEM"></el-tab-pane>
      <el-tab-pane :label="$t('message.message_cluster')" name="CLUSTER"></el-tab-pane>
    </el-tabs>
    <div v-if="type === 'CLUSTER'">
      {{ $t("cluster.project") }}:
      <el-select v-model="projectName" @change="changeProject(projectName)">
        <el-option v-for="item in projects" :key="item.id" :value="item.name" :label="item.name"></el-option>
      </el-select>
      {{ $t("cluster.cluster") }}:
      <el-select v-model="resourceName" @change="changeCluster(resourceName)">
        <el-option v-for="item in clusters" :key="item.id" :value="item.name" :label="item.name"></el-option>
      </el-select>
    </div>
    <complex-table :data="data" :pagination-config="paginationConfig" @search="search" ref="multipleTable">
      <el-table-column :label="$t('commons.table.name')" show-overflow-tooltip fix prop="name" min-width="100">
        <template v-slot:default="{row}">
          <span>{{ $t("message.title." + row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.message_type')" prop="type" fix/>
      <el-table-column :label="$t('message.message_in_station')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.local" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.mail')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.email" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.work_wechat')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.workWeiXin" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.dingTalk')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.dingTalk" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>


    <el-dialog :visible.sync="openUserPage" :title="$t('message.user')">
      <el-button-group>
        <el-button size="small" @click="addUser()">{{ $t("commons.button.create") }}</el-button>
        <el-button size="small" @click="del()">{{ $t("commons.button.delete") }}
        </el-button>
      </el-button-group>
      <el-table
              ref="multipleTable"
              v-loading="userLoading"
              :data="tableUsers.slice((pageConfig.currentPage-1)*pageConfig.pageSize,pageConfig.currentPage*pageConfig.pageSize)"
              @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column :label="$t('commons.table.name')" prop="name" min-width="100" fix>
        </el-table-column>
        <el-table-column :label="$t('setting.email')" prop="email" min-width="100" fix>
        </el-table-column>
      </el-table>
      <el-pagination
              :current-page.sync="pageConfig.currentPage"
              :page-size="pageConfig.pageSize"
              layout="prev, pager, next"
              :total="tableUsers.length">
      </el-pagination>
    </el-dialog>
    <el-dialog
            :visible="openAddPage"
            :title="$t('message.user')"
            width="30%"
            @close="closeAddUser">
      <el-select
              v-model="form.users"
              size="medium"
              multiple
              filterable
              remote
              reserve-keyword
              :placeholder="$t('project.key_words')"
              :remote-method="getUsers"
              value-key="id"
              :loading="searchUserLoading"
              style="width:100%"
              append-to-body>
        <el-option
                v-for="item in addUsers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
        </el-option>
      </el-select>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="closeAddUser">{{ $t("commons.button.cancel") }}</el-button>
      <el-button type="primary" @click="submit" v-preventReClick>{{ $t("commons.button.submit") }}</el-button>
    </span>
      </template>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {
  addSubscribeUser,
  deleteSubscribeUser, getAddSubscribeUsers,
  searchMsgSubscribe,
  searchMsgSubscribeByName,
  updateMsgSubScribe
} from "@/api/msg-subscribe"
import {getProjectsHasClusters} from "@/api/projects"
import {searchUsersByName} from "@/api/user"

export default {
  name: "",
  components: { LayoutContent, ComplexTable },
  props: {},
  data () {
    return {
      loading: false,
      data: [],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      type: "SYSTEM",
      resourceName: "",
      projectName: "",
      projects: [],
      clusters: [],
      buttons: [
        {
          label: this.$t("message.user"), icon: "el-icon-user", click: (row) => {
            this.openPage(row)
          }
        },
      ],
      openUserPage: false,
      users: [],
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
      },
      delUsers: [],
      openAddPage: false,
      form: {
        msgSubscribeId: "",
        users: []
      },
      searchUserLoading: false,
      addUsers: [],
      subscribeName: "",
      tableUsers: [],
      userLoading: false
    }

  },
  methods: {
    search () {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchMsgSubscribe(currentPage, pageSize, this.type, this.resourceName, {}).then(res => {
        this.data = res.items
        this.paginationConfig.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
    changeType (tab) {
      this.type = tab.name
      this.data = []
      if (this.type === "SYSTEM") {
        this.search()
      } else {
        getProjectsHasClusters().then(res => {
          this.data = []
          this.projects = res
          if (this.projects.length > 0) {
            this.projectName = this.projects[0].name
            this.changeProject(this.projectName)
          }
        })
      }
    },
    changeProject (name) {
      this.clusters = []
      this.resourceName = ""
      this.data = []
      for (const project of this.projects) {
        if (project.name === name) {
          this.clusters = project.clusters
          if (this.clusters.length > 0) {
            this.resourceName = this.clusters[0].name
            this.search()
          }
        }
      }
    },
    changeCluster (name) {
      this.resourceName = name
      this.search()
    },
    changeSubConfig (row) {
      this.loading = true
      updateMsgSubScribe(row).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.update_success")
        })
        this.search()
      }).finally(() => {
        this.loading = false
      })
    },
    openPage (row) {
      this.form.msgSubscribeId = row.id
      this.subscribeName = row.name
      this.tableUsers = row.users
      this.openUserPage = true
    },
    handleSelectionChange (val) {
      this.delUsers = val
    },
    addUser () {
      this.openAddPage = true
    },
    closeAddUser () {
      this.openAddPage = false
      this.form.users = []
    },
    submit () {
      this.userLoading = true
      addSubscribeUser(this.form).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.create_success"),
        })
        this.closeAddUser()
        searchMsgSubscribeByName(this.type, this.resourceName, this.subscribeName).then(res => {
          this.tableUsers = res.items[0].users
        })
      }).finally(() => {
        this.userLoading = false
      })
    },
    del () {
      if (this.delUsers.length === 0) {
        return
      }

      let users = []
      for (const user of this.delUsers) {
        users.push(user.id)
      }
      const form = {
        msgSubscribeId: this.form.msgSubscribeId,
        users: users,
      }
      this.userLoading = true
      deleteSubscribeUser(form).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.delete_success"),
        })
        searchMsgSubscribeByName(this.type, this.resourceName, this.subscribeName).then(res => {
          this.tableUsers = res.items[0].users
        })
      }).finally(() => {
        this.userLoading = false
      })
    },
    getUsers (query) {
      if (query !== "") {
        this.addUsers = []
        this.searchUserLoading = true
        if (this.type === "SYSTEM") {
          searchUsersByName(query).then(data => {
            this.addUsers = data.items
          }).finally(() => {
            this.searchUserLoading = false
          })
        } else {
          getAddSubscribeUsers(query, this.resourceName).then(data => {
            this.addUsers = data.items
          }).finally(() => {
            this.searchUserLoading = false
          })
        }
      }
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>
