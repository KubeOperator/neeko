<template>
  <layout-content :header="$t('backup_account.name')">
    <complex-table :data="data" :columns="columns" :search-config="searchConfig" :selects.sync="selects"
                   :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()" v-permission="['ADMIN']">{{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()" v-permission="['ADMIN']" :disabled="selects.length===0">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('backup_account.table.name')" mix-width="80" fix prop="name"/>
      <el-table-column :label="$t('backup_account.table.bucket')" mix-width="30" prop="bucket"/>
      <el-table-column :label="$t('backup_account.table.type')" min-width="100" prop="credentialVars.type">
        <template v-slot:default="{row}">
          <svg v-if="row.type === 'OSS'" class="icon" aria-hidden="true">
            <use xlink:href="#iconoss"></use>
          </svg>
          <svg v-if="row.type === 'AZURE'" class="icon" aria-hidden="true">
            <use xlink:href="#iconAzure"></use>
          </svg>
          <svg v-if="row.type === 'SFTP'" class="icon" aria-hidden="true">
            <use xlink:href="#iconSFTP"></use>
          </svg>
          <svg v-if="row.type === 'S3'" class="icon" aria-hidden="true">
            <use xlink:href="#icons3"></use>
          </svg>
          &nbsp;&nbsp;&nbsp;&nbsp;<span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('backup_account.table.status')" min-width="100" prop="status">
        <template v-slot:default="{row}">
          <div v-if="row.status === 'VALID'">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("commons.status.normal") }}
          </div>
          <div v-else>
            <span class="iconfont iconerror" style="color: #FA4147"></span>
            {{ $t("commons.status.failure") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('backup_account.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>
  </layout-content>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import LayoutContent from "@/components/layout/LayoutContent"
import {deleteBackupAccounts, searchBackupAccounts} from "@/api/backup-account"
import {checkPermission} from "@/utils/permisstion"

export default {
  name: "BackupAccountList",
  components: {
    LayoutContent,
    ComplexTable
  },
  data () {
    return {
      columns: [],
      selects: [],
      formLabelWidth: "120px",
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          disabled: !checkPermission("ADMIN"),
          click: (row) => {
            this.$router.push({ name: "BackupAccountEdit", params: { data: row } })
          }
        }, {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          disabled: !checkPermission("ADMIN"),
          click: (row) => {
            this.del(row.name)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          {
            field: "name",
            label: this.$t("backup_account.table.name"),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "bucket",
            label: this.$t("backup_account.table.bucket"),
            component: "FuComplexInput",
            defaultOperator: "eq",
          },
          {
            field: "type",
            label: this.$t("backup_account.table.type"),
            component: "FuComplexSelect",
            options: [
              { label: "OSS", value: "OSS" },
              { label: "S3", value: "S3" },
              { label: "SFTP", value: "SFTP" },
              { label: "AZURE", value: "AZURE" },
            ],
            multiple: true
          },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
    }
  },
  methods: {
    search (conditions) {
      const { currentPage, pageSize } = this.paginationConfig
      searchBackupAccounts(currentPage, pageSize, conditions).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create () {
      this.$router.push({ name: "BackupAccountCreate" })
    },
    del (name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning"
      }).then(() => {
        if (name) {
          deleteBackupAccounts(name).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: `${name}${this.$t("commons.msg.delete_success")}!`
            })
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteBackupAccounts(item.name))
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
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>
