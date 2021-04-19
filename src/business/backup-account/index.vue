<template>
  <layout-content :header="$t('backup_account.name')">
    <complex-table :data="data" :columns="columns" :search-config="searchConfig" :selects.sync="selects"
                   :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
<!--          <el-button size="small" @click="edit()">{{$t('commons.button.edit')}}</el-button>-->
          <el-button size="small" @click="del()" type="danger"  :disabled="selects.length===0">{{$t('commons.button.delete')}}</el-button>
<!--          <el-button size="small" style="left: 20px" @click="create()">{{$t('commons.button.authorize')}}</el-button>-->
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
        <el-table-column :label="$t('backup_account.table.name')" mix-width="80" fix prop="name"/>
        <el-table-column :label="$t('backup_account.table.bucket')" mix-width="30" prop="bucket"/>
        <el-table-column :label="$t('backup_account.table.type')" min-width="100" prop="credentialVars.type"/>
      <el-table-column :label="$t('backup_account.table.status')" min-width="100" prop="status">
        <template v-slot:default="{row}">
          <span v-if="row.status === 'VALID'" style="color: #32B350">
            <svg class="icon"  aria-hidden="true">
              <use xlink:href="#iconform_icon_normal"></use>
            </svg>
            {{ $t('commons.status.normal') }}</span>
          <span v-else style="color: #FA4147">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconcuowu1"></use>
            </svg>
            {{ $t('commons.status.failure') }}</span>
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
import ComplexTable from "@/components/complex-table";
import LayoutContent from "@/components/layout/LayoutContent";
import {deleteBackupAccounts, getBackupAccounts} from "@/api/backup-account";

export default {
  name: "BackupAccount",
  components: {
    LayoutContent,
    ComplexTable
  },
  data() {
    return{
      columns: [],
      selects: [],
      formLabelWidth: '120px',
      buttons: [
        {
          label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
            this.$router.push({name: "BackupAccountEdit", params: {data: row}})
          }
        }, {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete", type: "danger", click: (row) => {
            this.del(row.name)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
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
    search(conditions) {
      const {currentPage, pageSize} = this.paginationConfig
      getBackupAccounts(currentPage, pageSize, conditions).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({name: "BackupAccountCreate"})
    },
    del(name) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (name) {
          deleteBackupAccounts(name).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: `${name}${this.$t('commons.msg.delete_success')}!`
            });
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteBackupAccounts(item.name))
          }
          Promise.all(ps).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: this.$t('commons.msg.delete_success'),
            });
          })
        }
      })
    }
  },
  created() {
    this.search()
  }
}
</script>

<style scoped>

</style>
