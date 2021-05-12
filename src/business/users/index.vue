<template>

  <layout-content :header="$t('user.user')">
    <complex-table :data="data" local-key="user_columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search" v-loading="loading"
                   :selects.sync="selects" :fit="true">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{ $t("commons.button.create") }}</el-button>
          <el-button size="small" :disabled="selects.length===0" @click="del()">{{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="120">
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="18">
              {{ row.name }}<br/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.email')" min-width="120">
        <template v-slot:default="{row}">
          <el-row>
            <el-col>
              {{ row.email | emailFormat }}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')">
        <template v-slot:default="{row}">
          <ko-status :status="row.status"></ko-status>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.type')">
        <template v-slot:default="{row}">
          <span v-if="row.type === 'LDAP'">{{ $t("user.ldap") }}</span>
          <span v-if="row.type === 'LOCAL'">{{ $t("user.local") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.role')" min-width="80">
        <template v-slot:default="{row}">
          <span size="small">{{ $t(`commons.role.${row.role}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')" min-width="100">
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
import {searchUsers, deleteUser, updateUser} from "@/api/user"
import ComplexTable from "@/components/complex-table"
import KoStatus from "@/components/ko-status"
import {getSession} from "@/api/auth"


export default {
  name: "UserList",
  components: { KoStatus, ComplexTable, LayoutContent },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.edit"), icon: "el-icon-edit", click: (row) => {
            this.$router.push({ name: "UserEdit", params: { name: row.name } })
          }, disabled: (row) => {
            return  row.type === "LDAP"
          }
        },
        {
          label: this.$t("commons.button.lock"), icon: "el-icon-lock", click: (row) => {
            this.update(row)
          }, disabled: (row) => {
            return this.currentUser.user.name === row.name || row.name === "admin" || row.type === "LDAP"
          }
        },
        {
          label: this.$t("commons.button.delete"), icon: "el-icon-delete", click: (row) => {
            this.del(row.name)
          }, disabled: (row) => {
            return this.currentUser.user.name === row.name || row.name === "admin"
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
          {
            field: "created_at",
            label: this.$t("commons.table.create_time"),
            component: "FuComplexDateTime",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      loading: false,
      selects: [],
      currentUser: {}
    }
  },
  methods: {
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
    update (row) {
      if (row.status === "active") {
        row.status = "passive"
      } else {
        row.status = "active"
      }
      updateUser(row.name, row).then(() => {
        this.$message({
          type: "success",
          message: `${this.$t("commons.msg.save_success")}!`
        })
        this.search()
      })
    }
  },
  created () {
    getSession().then(res => {
      this.currentUser = res
      this.search()
    })
  },
}
</script>
<style scoped lang="scss">
</style>
