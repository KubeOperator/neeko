<template>
  <layout-content :header="$t('cluster.cluster')">
    <complex-table :selects.sync="clusterSelection" @selection-change="selectChange" :search-config="searchConfig" :data="data" :pagination-config="paginationConfig" @search="search" v-loading="loading">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="onCreate()" v-permission="['ADMIN','PROJECT_MANAGER']">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" :disabled="clusterSelection.length < 1 || isDeleteButtonDisable" @click="onDelete()" v-permission="['ADMIN','PROJECT_MANAGER']">
            {{ $t("commons.button.delete") }}
          </el-button>
          <el-button size="small" @click="onImport()" v-permission="['ADMIN','PROJECT_MANAGER']">
            {{ $t("commons.button.import") }}
          </el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-link v-if="row.status === 'Running'" type="info" @click="goForDetail(row)">{{ row.name }}</el-link>
          <span v-if="row.status !== 'Running'">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.project')" min-width="100" prop="projectName" fix />
      <el-table-column :label="$t('cluster.version')" min-width="80" prop="spec.version" fix />
      <el-table-column :label="$t('cluster.node_size')" min-width="50" prop="nodeSize" />
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status">
        <template v-slot:default="{row}">
          <ko-status :status="row.status" :other="row.provider" @detail="getStatus(row)">
          </ko-status>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :before-close="closeDialogLog" :title="$t('cluster.condition.condition_detail')" width="50%" :visible.sync="dialogLogVisible">
      <div style="height: 400px">
        <el-scrollbar style="height:100%">
          <span v-if="log.conditions&&log.conditions.length === 0">{{ log.message | errorFormat }}</span>
          <div>
            <el-steps :space="50" style="margin: 0 50px" direction="vertical" :active="activeName">
              <el-step v-for="condition in log.conditions" :key="condition.name" :title="$t('cluster.condition.' +condition.name)" :description="condition.message | errorFormat ">
                <i :class="loadStepIcon(condition.status)" slot="icon"></i>
              </el-step>
            </el-steps>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="goForLogs()">{{ $t("commons.button.history") }}</el-button>
        <el-button size="small" v-if="log.phase === 'Failed'" :v-loading="retryLoadding" @click="onRetry()">
          {{ $t("commons.button.retry") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.delete.delete_cluster')" width="30%" :visible.sync="dialogDeleteVisible">
      <el-form label-width="120px">
        <el-form-item :label="$t('cluster.delete.is_force')">
          <el-switch v-model="isForce" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button size="small" :v-loading="deleteLoadding" @click="submitDelete()">
          {{ $t("commons.button.submit") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.health_check.health_check')" width="50%" :visible.sync="dialogCheckVisible">
      <div align="center" style="margin-top: 15px">
        <el-table v-loading="checkLoading" :data="checkData.hooks" v-if="!isRecover" border style="width: 90%">
          <el-table-column prop="name" :label="$t('commons.table.name')" />
          <el-table-column prop="level" :label="$t('cluster.health_check.level')" />
          <el-table-column prop="msg" :label="$t('cluster.health_check.message')" />
        </el-table>
      </div>
      <div align="center" style="margin-top: 15px">
        <el-table v-loading="checkLoading" :data="recoverItems" v-if="isRecover" border style="width: 90%">
          <el-table-column prop="hookName" :label="$t('commons.table.name')" />
          <el-table-column prop="name" :label="$t('cluster.health_check.method')" />
          <el-table-column prop="result" :label="$t('cluster.health_check.result')" />
          <el-table-column prop="msg" :label="$t('cluster.health_check.message')" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" v-if="checkData.level=='error'" @click="onRecover()">
          {{ $t("cluster.health_check.recover") }}
        </el-button>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import { getClusterStatus, initCluster, upgradeCluster, openLogger, deleteCluster, healthCheck, clusterRecover, searchClusters } from "@/api/cluster"
import KoStatus from "@/components/ko-status"

export default {
  name: "ClusterList",
  components: { KoStatus, ComplexTable, LayoutContent },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.upgrade"),
          icon: "el-icon-upload2",
          click: (row) => {
            this.onUpgrade(row)
          },
          disabled: (row) => {
            return row.status !== "Running"
          },
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status !== "Failed"
          },
        },
        {
          label: this.$t("commons.button.check"),
          icon: "el-icon-data-line",
          click: (row) => {
            this.onHealthCheck(row)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status !== "Failed"
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      clusterName: "",
      currentCluster: {},
      clusterSelection: [],
      data: [],

      // cluster health check
      dialogCheckVisible: false,
      checkLoading: true,
      isRecover: false,
      recoverItems: [],
      checkData: {},

      // cluster logs
      dialogLogVisible: false,
      log: {
        phase: "",
        prePhase: "",
        message: "",
        conditions: [],
      },
      activeName: 1,
      retryLoadding: false,
      keepPolling: true,

      // cluster delete
      isForce: false,
      deleteLoadding: false,
      dialogDeleteVisible: false,
      isDeleteButtonDisable: false,
      deleteName: "",

      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ],
      },
      loading: false,
    }
  },
  methods: {
    search(condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchClusters(currentPage, pageSize, condition).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    searchForPolling(condition) {
      const { currentPage, pageSize } = this.paginationConfig
      searchClusters(currentPage, pageSize, condition).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    onCreate() {
      this.$router.push({ name: "ClusterCreate" })
    },
    onImport() {
      this.$router.push({ name: "ClusterImport" })
    },
    onUpgrade(row) {
      this.$router.push({ name: "ClusterUpgrade", params: { name: row.name } })
    },
    goForDetail(row) {
      this.$router.push({ name: "ClusterOverview", params: { project: row.projectName, name: row.name } })
    },
    selectChange() {
      let isOk = true
      if (this.clusterSelection.length === 0) {
        this.isDeleteButtonDisable = true
        return
      }
      for (const item of this.clusterSelection) {
        if (item.status !== "Running" && item.status !== "Failed") {
          isOk = false
          break
        }
      }
      this.isDeleteButtonDisable = !isOk
    },
    onDelete(row) {
      this.isForce = false
      this.dialogDeleteVisible = true
      if (row) {
        this.deleteName = row.name
      }
    },
    submitDelete() {
      this.deleteLoadding = true
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (this.deleteName) {
          ps.push(deleteCluster(this.deleteName, this.isForce))
        } else {
          for (const item of this.clusterSelection) {
            ps.push(deleteCluster(item.name, this.isForce))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
            this.dialogDeleteVisible = false
            this.deleteLoadding = false
          })
          .catch(() => {
            this.search()
            this.dialogDeleteVisible = false
            this.deleteLoadding = false
          })
      })
    },

    // cluster health check
    onHealthCheck(row) {
      this.currentCluster = row
      this.dialogCheckVisible = true
      this.checkLoading = true
      this.isRecover = false
      this.recoverItems = []
      healthCheck(this.currentCluster.name).then((data) => {
        this.checkData = data
        this.checkLoading = false
      })
    },
    onRecover() {
      this.checkLoading = true
      this.isRecover = true
      this.checkData = { hooks: [], level: "" }
      clusterRecover(this.currentCluster.name).then((data) => {
        this.recoverItems = data
        this.checkLoading = false
      })
    },

    // cluster logs
    getStatus(row) {
      this.currentCluster = row
      this.dialogLogVisible = true
      this.clusterName = row.name
      this.dialogPolling()
      getClusterStatus(row.name).then((data) => {
        this.log = data
        this.activeName = this.log.conditions.length + 1
      })
    },
    loadStepIcon(status) {
      switch (status) {
        case "True":
          return "el-icon-check"
        case "False":
          return "el-icon-close"
        case "Unknown":
          return "el-icon-loading"
      }
    },
    getCurrentCondition() {
      if (this.log.phase !== "Running" && this.log.phase !== "Failed") {
        for (const item of this.log.conditions) {
          if (this.log.status === "Unknown") {
            return item
          }
        }
      }
      return null
    },
    goForLogs() {
      openLogger(this.clusterName)
    },
    onRetry() {
      this.retryLoadding = true
      switch (this.log.prePhase) {
        case "Upgrading":
          upgradeCluster(this.clusterName, this.currentCluster.spec.upgradeVersion).then(() => {
            this.search()
            this.retryLoadding = false
          })
          break
        case "Initializing":
          initCluster(this.clusterName).then(() => {
            this.search()
            this.retryLoadding = false
          })
          break
        case "Creating":
          initCluster(this.clusterName).then(() => {
            this.search()
            this.retryLoadding = false
          })
          break
        case "Waiting":
          initCluster(this.clusterName).then(() => {
            this.search()
            this.retryLoadding = false
          })
          break
      }
    },
    closeDialogLog() {
      clearInterval(this.timer2)
      this.dialogLogVisible = false
    },
    dialogPolling() {
      this.timer2 = setInterval(() => {
        if (this.keepPolling) {
          getClusterStatus(this.clusterName).then(
            (data) => {
              this.activeName = this.log.conditions.length + 1
              if (this.log.phase !== "Running") {
                this.log.conditions = data.conditions
              } else {
                this.keepPolling = false
              }
              if (this.log.phase !== data.phase) {
                this.log.phase = data.phase
              }
              if (this.log.prePhase !== data.prePhase) {
                this.log.prePhase = data.prePhase
              }
            },
            () => {
              this.opened = false
            }
          )
        }
      }, 3000)
    },

    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Creating", "Waiting"]
        for (const item of this.data) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          this.searchForPolling()
        }
      }, 10000)
    },
  },
  mounted() {
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
}
</script>

<style scoped>
</style>
