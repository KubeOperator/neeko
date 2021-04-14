<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;">
      <el-tab-pane :label="$t('cluster.detail.backup.backup_recover')" :name="$t('cluster.detail.backup.backup_recover')">
        <el-row type="flex">
          <el-col :span="12">
            <el-form :model="strategyForm" ref="strategyForm" :rules="rules" label-width="150px">
              <el-card style="height: 450px">
                <div slot="header" class="clearfix">
                  <span>{{$t('cluster.detail.backup.backup_strategy')}}</span>
                </div>
                <el-form-item :label="$t('cluster.detail.backup.backup_interval')" prop="cron">
                  <el-input style="width:80%" type="number" v-model.number="strategyForm.cron" clearable />
                  <div><span class="input-help">1 - 300</span></div>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.backup.retained_number')" prop="saveNum">
                  <el-input style="width:80%" type="number" v-model.number="strategyForm.saveNum" clearable />
                  <div><span class="input-help">1 - 300</span></div>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.backup.backup_account')" prop="backupAccountName">
                  <el-select style="width:80%" size="small" allow-create filterable v-model="strategyForm.backupAccountName">
                    <el-option v-for="item in backupAccounts" :key="item.name" :label="item.name" :value="item.name">{{b.name}}({{ b.bucket}})</el-option>
                  </el-select>
                  <div><span class="input-help">{{$t('cluster.detail.backup.backup_account_helper')}}</span></div>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.backup.status')" prop="status">
                  <el-select style="width:80%" size="small" v-model="strategyForm.status">
                    <el-option :label="$t('commons.button.enable')" value="ENABLE">{{$t('commons.button.enable')}}</el-option>
                    <el-option :label="$t('commons.button.disable')" value="DISABLE">{{$t('commons.button.disable')}}</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="strategyForm.id == ''" @click="backupNow('strategyForm')">{{$t('cluster.detail.backup.backup_now')}}</el-button>
                  <el-button type="primary" @click="onSubmit('strategyForm')">{{$t('commons.button.submit')}}</el-button>
                </el-form-item>
              </el-card>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card style="height: 450px">
              <div slot="header" class="clearfix">
                <span>{{$t('cluster.detail.backup.local_recover')}}</span>
              </div>
              <el-form>
                <el-form-item>
                  <el-row type="flex" justify="center">
                    <el-upload :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">{{$t('commons.form.file_upload_helper')}}</div>
                      <div class="el-upload__tip" slot="tip">{{$t('cluster.detail.backup.local_recover_tips')}}</div>
                    </el-upload>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-row type="flex" justify="center">
                    <el-button type="primary" @click="onUploadFile()">{{$t('commons.button.submit')}}</el-button>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>

        <complex-table :header="$t('cluster.detail.backup.backup_list')" :data="data" @search="search" :pagination-config="paginationConfig">
          <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
          <el-table-column :label="$t('cluster.detail.backup.backup_location')" min-width="100" prop="folder" fix />
          <el-table-column :label="$t('cluster.detail.log.time')">
            <template v-slot:default="{row}">
              {{ row.firstTimestamp | datetimeFormat }}
            </template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>

      <el-tab-pane :label="$t('cluster.detail.backup.backup_log')" :name="$t('cluster.detail.backup.backup_log')">
        <complex-table :header="$t('cluster.detail.backup.backup_list')" :data="data">
          <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type" fix />
          <el-table-column :label="$t('cluster.detail.security.start_time')" min-width="100" prop="startTime" fix>
            <template v-slot:default="{row}">
              {{ row.startTime | datetimeFormat }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('cluster.detail.security.end_time')" min-width="100" prop="endTime" fix>
            <template v-slot:default="{row}">
              <span v-if="row.status ==='FAILED' || row.status ==='SUCCESS'">{{ row.endTime | datetimeFormat }}</span>
              <span v-if="row.status !=='FAILED' && row.status !=='SUCCESS'">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
            <template v-slot:default="{row}">
              <el-button v-if="row.status==='FAILED'" type="text" @click="getLogDetail()">{{row.status}}</el-button>
              <span v-if="row.status !== 'FAILED'">{{row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('cluster.detail.log.time')">
            <template v-slot:default="{row}">
              {{ row.createdAt | datetimeFormat }}
            </template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listBackupByPage, startBackup, createStrategy, getStrategy, localRestore, getBackupLog } from "@/api/cluster/backup"

export default {
  name: "ClusterBackup",
  components: { ComplexTable },
  data() {
    return {
      loading: false,
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
        cron: [
          { required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" },
          { pattern: /^([1-9]|[1-9]\d|1\d\d|2\d\d|300)$/, message: "范围在0-300", trigger: "blur" },
        ],
        saveNum: [
          { required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" },
          { pattern: /^([1-9]|[1-9]\d|1\d\d|2\d\d|300)$/, message: "范围在0-300", trigger: "blur" },
        ],
        backupAccountName: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "change" }],
        status: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "change" }],
      },
      file: {},
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      backupAccounts: [],
      logs: [],
    }
  },
  methods: {
    search() {
      if (this.activeName === this.$t("cluster.detail.backup.backup_recover")) {
        const { currentPage, pageSize } = this.paginationConfig
        listBackupByPage(this.clusterName, currentPage, pageSize).then((data) => {
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      } else {
        getBackupLog(this.clusterName).then((data) => {
          this.logs = data
        })
      }
    },
    backupNow() {
      this.$refs['strategyForm'].validate((valid) => {
        if (valid) {
          const backupFile = {
            name: "",
            clusterName: this.clusterName,
            clusterBackupStrategyID: this.strategyForm.id,
            folder: "",
          }
          startBackup(backupFile).then(
            () => {
              this.$message({ type: "success", message: this.$t("commons.msg.backup_start") })
            },
            (error) => {
              this.$message({ type: "error", message: error })
            }
          )
        } else {
          return false
        }
      })
    },
    handleClick() {
      this.search()
    },
    onSubmit() {
      this.$refs['strategyForm'].validate((valid) => {
        if (valid) {
          createStrategy(this.strategyForm).then(
            () => {
              this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              this.getBackupStrategy()
            },
            (error) => {
              this.$message({ type: "error", message: error })
            }
          )
        } else {
          return false
        }
      })
    },
    getBackupStrategy() {
      getStrategy(this.clusterName).then((data) => {
        this.strategyForm = data
      })
    },
    onUploadChange(file) {
      this.file = file
    },
    onUploadFile() {
      const formData = new FormData()
      formData.append("file", this.file.raw)
      formData.append("clusterName", this.clusterName)
      localRestore(formData).then(
        () => {
          this.$message({ type: "success", message: this.$t("commons.msg.backup_start") })
        },
        (error) => {
          this.$message({ type: "error", message: error })
        }
      )
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
