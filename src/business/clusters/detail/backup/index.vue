<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;" v-loading="loading">
      <el-tab-pane :label="'ETCD ' + $t('cluster.detail.backup.backup_recover')" :name="$t('cluster.detail.backup.backup_recover')">
        <el-row type="flex">
          <el-col :span="12">
            <el-form :model="strategyForm" ref="strategyForm" :rules="rules" label-width="150px" label-position="left">
              <el-card style="height: 450px">
                <div slot="header" class="clearfix">
                  <span>{{ $t("cluster.detail.backup.backup_strategy") }}</span>
                </div>
                <el-col :span="20">
                  <el-form-item :label="$t('cluster.detail.backup.backup_interval')" prop="cron">
                    <el-input-number style="width:100%" :step="1" step-strictly :max="300" v-model.number="strategyForm.cron" clearable />
                    <div><span class="input-help">1 - 300</span></div>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.detail.backup.retained_number')" prop="saveNum">
                    <el-input-number style="width:100%" :step="1" step-strictly :max="300" v-model.number="strategyForm.saveNum" clearable />
                    <div><span class="input-help">1 - 300 {{ $t("cluster.detail.backup.backup_help") }} </span></div>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.detail.backup.backup_account')" prop="backupAccountName">
                    <el-select style="width:100%" size="small" allow-create filterable v-model="strategyForm.backupAccountName">
                      <el-option v-for="b in backupAccounts" :key="b.name" :label="b.name" :value="b.name">
                        {{ b.name }}({{ b.bucket }})
                      </el-option>
                    </el-select>
                    <div><span class="input-help">{{ $t("cluster.detail.backup.backup_account_help") }}</span></div>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.detail.backup.status')" prop="status">
                    <el-select style="width:100%" size="small" v-model="strategyForm.status">
                      <el-option :label="$t('commons.button.enable')" value="ENABLE">{{ $t("commons.button.enable") }}
                      </el-option>
                      <el-option :label="$t('commons.button.disable')" value="DISABLE">
                        {{ $t("commons.button.disable") }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="float: right">
                    <el-button :disabled="strategyForm.id == '' || submitLoading" @click="backupNow('strategyForm')">
                      {{ $t("cluster.detail.backup.backup_now") }}
                    </el-button>
                    <el-button type="primary" :disabled="submitLoading" @click="onSubmit('strategyForm')" v-preventReClick>
                      {{ $t("commons.button.submit") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card style="height: 450px">
              <div slot="header" class="clearfix">
                <span>{{ $t("cluster.detail.backup.local_recover") }}</span>
              </div>
              <el-form>
                <el-form-item>
                  <el-row type="flex" justify="center">
                    <el-upload :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">{{ $t("commons.form.file_upload_help") }}</div>
                      <div class="el-upload__tip" slot="tip">{{ $t("cluster.detail.backup.local_recover_tips") }}</div>
                    </el-upload>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-row type="flex" justify="center">
                    <el-button type="primary" :disabled="submitLoading" @click="onUploadFile()">
                      {{ $t("commons.button.submit") }}
                    </el-button>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
        <br>
        <complex-table :header="$t('cluster.detail.backup.backup_list')" :data="data" @search="search" :pagination-config="paginationConfig" :selects.sync="selects">
          <template #header>
            <el-button-group>
              <el-button size="small" :disabled="selects.length!==1" @click="restoreByFiles(selects[0])">
                {{ $t("cluster.detail.backup.recover") }}
              </el-button>
              <el-button size="small" @click="deleteBackupFile()" :disabled="selects.length===0">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
          <el-table-column :label="$t('cluster.detail.backup.backup_location')" min-width="100" prop="folder" fix />
          <el-table-column :label="$t('cluster.detail.log.time')">
            <template v-slot:default="{row}">
              {{ row.createdAt | datetimeFormat }}
            </template>
          </el-table-column>
          <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
        </complex-table>
      </el-tab-pane>

      <el-tab-pane :label="'Velero ' + $t('cluster.detail.backup.backup_recover')" :name="'Velero ' + $t('cluster.detail.backup.backup_log')">
        <el-row type="flex">
          <el-col :span="12">
            <el-card style="height: 400px">
              <div slot="header" class="clearfix">
                <span>{{ $t("cluster.detail.backup.velero_config") }}</span>
              </div>
              <el-col :span="20">
                <velero-config></velero-config>
              </el-col>
            </el-card>
          </el-col>
        </el-row>

        <el-row>
          <velero-backup></velero-backup>
        </el-row>
      </el-tab-pane>

      <el-tab-pane :label="$t('cluster.detail.backup.backup_log')" :name="$t('cluster.detail.backup.backup_log')">
        <backup-logs></backup-logs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { openLoggerWithName, getBackupLogs } from "@/api/cluster/tasks"
import { listBackupByPage, startBackup, createStrategy, getStrategy, localRestore, listBackupAccounts, startRestore, deleteBackupFile } from "@/api/cluster/backup"
import Rule from "@/utils/rules"
import VeleroBackup from "@/business/clusters/detail/backup/velero_backup"
import VeleroConfig from "@/business/clusters/detail/backup/velero_config"
import BackupLogs from "@/business/clusters/detail/backup/logs"

export default {
  name: "ClusterBackup",
  components: { VeleroConfig, VeleroBackup, ComplexTable, BackupLogs },
  data() {
    return {
      loading: false,
      logLoading: false,
      submitLoading: false,
      clusterName: "",
      activeName: this.$t("cluster.detail.backup.backup_recover"),
      data: [],
      strategyForm: {
        id: "",
        cron: 1,
        saveNum: 1,
        backupAccountName: "",
        status: "",
        clusterName: "",
      },
      rules: {
        cron: [Rule.NumberRule],
        saveNum: [Rule.NumberRule],
        backupAccountName: [Rule.RequiredRule],
        status: [Rule.RequiredRule],
      },
      file: {},
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      backupAccounts: [],
      selects: [],
      timer: null,
      buttons: [
        {
          label: this.$t("cluster.detail.backup.recover"),
          icon: "el-icon-refresh-left",
          click: (row) => {
            this.restoreByFiles(row)
          },
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.deleteBackupFile(row.metadata.name)
          },
        },
      ],
    }
  },
  methods: {
    search() {
      if (this.activeName === this.$t("cluster.detail.backup.backup_recover")) {
        const { currentPage, pageSize } = this.paginationConfig
        listBackupByPage(this.clusterName, currentPage, pageSize).then((data) => {
          if (data) {
            this.data = data.items
            this.paginationConfig.total = data.total
          }
        })
      } else if (this.activeName === this.$t("cluster.detail.backup.backup_log")) {
        this.logLoading = true
        getBackupLogs(this.clusterName)
          .then((data) => {
            if (data) {
              this.logs = data
              this.logLoading = false
            }
          })
          .catch(() => {
            this.logLoading = false
          })
      }
    },
    openXterm(row) {
      openLoggerWithName(this.clusterName, row.id)
    },
    backupNow() {
      this.$refs["strategyForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const backupFile = {
            name: "",
            clusterName: this.clusterName,
            clusterBackupStrategyID: this.strategyForm.id,
            folder: "",
          }
          startBackup(backupFile)
            .then(() => {
              this.submitLoading = false
              this.$message({ type: "success", message: this.$t("cluster.detail.backup.backup_start") })
            })
            .finally(() => {
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    handleClick() {
      localStorage.setItem("backup_active_name", this.activeName)
      this.search()
    },
    onSubmit() {
      this.$refs["strategyForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.strategyForm.clusterName = this.clusterName
          createStrategy(this.strategyForm)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
              this.getBackupStrategy()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    getBackupStrategy() {
      this.loading = true
      getStrategy(this.clusterName)
        .then((data) => {
          this.loading = false
          this.strategyForm = data
        })
        .catch(() => {
          this.loading = false
        })
    },
    onUploadChange(file) {
      this.file = file
    },
    onUploadFile() {
      this.submitLoading = true
      const formData = new FormData()
      formData.append("file", this.file.raw)
      formData.append("clusterName", this.clusterName)
      localRestore(formData)
        .then(() => {
          this.submitLoading = false
          this.$message({ type: "success", message: this.$t("cluster.detail.backup.recover_start") })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    restoreByFiles(row) {
      this.$confirm(this.$t("cluster.detail.backup.restore_message"), this.$t("cluster.detail.backup.CLUSTER_RESTORE"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "info",
      }).then(() => {
        startRestore({ name: row.name, clusterName: this.clusterName }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("cluster.detail.backup.recover_success"),
          })
        })
      })
    },
    deleteBackupFile(name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (name) {
          ps.push(deleteBackupFile(name))
        } else {
          for (const item of this.selects) {
            ps.push(deleteBackupFile(item.name))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
          })
          .catch(() => {
            this.search()
          })
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        for (const item of this.logs) {
          if (item.status === "Running") {
            flag = true
            break
          }
        }
        if (flag) {
          this.search()
        }
      }, 10000)
    },
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.clusterName = this.$route.params.name
    listBackupAccounts(this.clusterName).then((res) => {
      this.backupAccounts = res
    })
    if (localStorage.getItem("backup_active_name")) {
      this.activeName = localStorage.getItem("backup_active_name")
    }
    this.search()
    this.getBackupStrategy()
    this.polling()
  },
}
</script>

<style scoped>
</style>
