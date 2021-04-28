<template>
  <layout-content :header="$t('cluster.cluster')">
    <complex-table :selects.sync="clusterSelection" @selection-change="selectChange" :search-config="searchConfig"
                   :data="data" :pagination-config="paginationConfig" @search="search" v-loading="loading">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="onCreate()" v-permission="['ADMIN','PROJECT_MANAGER']">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" :disabled="clusterSelection.length < 1 || isDeleteButtonDisable"
                     @click="onDelete()" v-permission="['ADMIN','PROJECT_MANAGER']">
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
          <el-button v-if="row.status === 'Running'" @click="goForDetail(row)" type="text" style="color: #0033FF;"><span
                  style="text-decoration:underline">{{ row.name }}</span></el-button>
          <span v-if="row.status !== 'Running'">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="spec.version" fix/>
      <el-table-column :label="$t('cluster.node_size')" min-width="50" prop="nodeSize"/>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status">
        <template v-slot:default="{row}">
          <ko-status :status="row.status" :other="row.provider" @detail="getStatus(row)">
          </ko-status>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog :before-close="closeDialogLog" :title="$t('cluster.condition.condition_detail')" width="50%"
               :visible.sync="dialogLogVisible">
      <div style="height: 400px">
        <el-scrollbar style="height:100%">
          <span v-if="log.conditions&&log.conditions.length === 0">{{ log.message | errorFormat }}</span>
          <div>
            <el-steps direction="vertical" :active="activeName">
              <div v-for="condition in log.conditions" :key="condition.name">
                <div v-if="condition.status === 'True'">
                  <el-step icon="el-icon-success" :title="$t('cluster.condition.' +condition.name)"></el-step>
                </div>
                <div v-if="condition.status === 'False'">
                  <el-step icon="el-icon-error" :title="$t('cluster.condition.' +condition.name)"
                           :description="condition.message | errorFormat "></el-step>
                </div>
                <div v-if="condition.status === 'Unknown'">
                  <el-step icon="el-icon-loading" :title="$t('cluster.condition.' +condition.name)"></el-step>
                </div>
              </div>
            </el-steps>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goForLogs()">{{ $t("commons.button.history") }}</el-button>
        <el-button v-if="log.phase === 'Failed'" :v-loading="retryLoadding" type="primary" @click="onRetry()">
          {{ $t("commons.button.retry") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.import.import_cluster')" width="30%" :visible.sync="dialogImportVisible">
      <el-form :model="importForm" ref="importFormRules" :rules="importFormRules" label-width="120px">
        <el-form-item :label="$t('commons.table.name')" prop="name">
          <el-input style="width: 80%" v-model="importForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.project')" prop="projectName">
          <el-select filterable style="width: 80%" v-model.number="importForm.projectName" clearable>
            <el-option v-for="item of projects" :key="item.name" :value="item.name">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="apiServer" prop="apiServer">
          <el-input style="width: 80%" v-model="importForm.apiServer" clearable></el-input>
          <div><span class="input-help">{{ $t("cluster.import.api_server_help") }}</span></div>
        </el-form-item>
        <el-form-item label="router" prop="router">
          <el-input style="width: 80%" v-model="importForm.router" clearable></el-input>
          <div><span class="input-help">{{ $t("cluster.import.router_help") }}</span></div>
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input type="textarea" style="width: 80%" v-model="importForm.token" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button :v-loading="importLoadding" type="primary" @click="submitImport()">
          {{ $t("commons.button.submit") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.delete.delete_cluster')" width="30%" :visible.sync="dialogDeleteVisible">
      <el-form label-width="120px">
        <el-form-item :label="$t('cluster.delete.is_force')">
          <el-switch v-model="isForce"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button :v-loading="deleteLoadding" type="primary" @click="submitDelete()">
          {{ $t("commons.button.submit") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.health_check.health_check')" width="30%" :visible.sync="dialogCheckVisible">
      <table v-loading="checkLoading" style="width: 90%" class="myTable" v-if="!isRecover">
        <thead>
        <tr>
          <th class="left">{{ $t("commons.table.name") }}</th>
          <th class="left">{{ $t("cluster.health_check.level") }}</th>
          <th class="left">{{ $t("cluster.health_check.message") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="hook in checkData.hooks" :key="hook.name">
          <td>{{ hook.name }}</td>
          <td>{{ hook.level }}</td>
          <td class="left">{{ hook.msg }}</td>
        </tr>
        </tbody>
      </table>
      <table v-loading="checkLoading" class="table" v-if="isRecover">
        <thead>
        <tr>
          <th>{{ $t("commons.table.name") }}</th>
          <th class="left">{{ $t("cluster.health_check.method") }}</th>
          <th class="left">{{ $t("cluster.health_check.result") }}</th>
          <th class="left">{{ $t("cluster.health_check.message") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in recoverItems" :key="r.name">
          <td>{{ r.hookName }}</td>
          <td>{{ r.name }}</td>
          <td>{{ r.result }}</td>
          <td class="left">{{ r.msg }}</td>
        </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="checkData.level=='error'" type="primary" @click="onRecover()">
          {{ $t("cluster.health_check.recover") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.upgrade')" width="50%" :visible.sync="dialogUpgradeVisible">
      <el-form :model="upgradeForm" ref="upgradeFormRules" :rules="upgradeFormRules" label-width="120px">
        <el-form-item :label="$t('cluster.version')" prop="version">
          <el-select style="width: 80%" @change="changeUpgradeVersions" v-model="upgradeForm.version" clearable>
            <el-option v-for="item of upgradeVersions" :key="item" :value="item">{{ item }}</el-option>
          </el-select>
          <div v-if="upgradeVersions.length === 0"><span class="input-help">{{
              $t("cluster.upgrade.upgrade_help")
            }}</span></div>
        </el-form-item>
      </el-form>
      <div v-if="newManifest.coreVars.length !== 0 && oldManifest.coreVars !== 0">
        <table style="width: 90%" class="myTable">
          <thead>
          <tr>
            <th class="left">{{ $t("commons.table.name") }}</th>
            <th class="left">{{ $t("cluster.upgrade.current_version") }}</th>
            <th class="left">{{ $t("cluster.upgrade.upgrade_version") }}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="left">Kubernetes</td>
            <td class="left">{{ getVersion("kubernetes", oldManifest.coreVars) }}</td>
            <td class="left">{{ getVersion("kubernetes", newManifest.coreVars) }}</td>
          </tr>
          <tr v-if="getVersion('etcd', oldManifest.coreVars)!==getVersion('etcd', newManifest.coreVars)">
            <td class="left">ETCD</td>
            <td class="left">{{ getVersion("etcd", oldManifest.coreVars) }}</td>
            <td class="left">{{ getVersion("etcd", newManifest.coreVars) }}</td>
          </tr>
          <tr v-if="currentCluster.runtimeType=='docker'&& getVersion('docker', oldManifest.coreVars)!==getVersion('docker', newManifest.coreVars)">
            <td class="left">Docker</td>
            <td class="left">{{ getVersion("docker", oldManifest.coreVars) }}</td>
            <td class="left">{{ getVersion("docker", newManifest.coreVars) }}</td>
          </tr>
          <tr v-if="currentCluster.runtimeType=='containerd'&& getVersion('containerd', oldManifest.coreVars)!==getVersion('containerd', newManifest.coreVars)">
            <td class="left">Containerd</td>
            <td class="left">{{ getVersion("containerd", oldManifest.coreVars) }}</td>
            <td class="left">{{ getVersion("containerd", newManifest.coreVars) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" style="margin-top: 50px" class="dialog-footer">
        <el-button @click="dialogUpgradeVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button :v-loading="uploadLoadding" type="primary" @click="submitUpgrade()">
          {{ $t("commons.button.submit") }}
        </el-button>
      </div>
    </el-dialog>

  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {
  getClusterStatus,
  initCluster,
  upgradeCluster,
  openLogger,
  importCluster,
  deleteCluster,
  healthCheck,
  clusterRecover,
  searchClusters
} from "@/api/cluster"
import {listActive} from "@/api/manifest"
import {allProjects} from "@/api/projects"
import KoStatus from "@/components/ko-status"

export default {
  name: "ClusterList",
  components: { KoStatus, ComplexTable, LayoutContent },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.upgrade"),
          icon: "el-icon-upload2",
          click: (row) => {
            this.upgradeVersion(row)
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
            return row.status !== "Running" && row.status.status !== "Failed"
          },
        },
        {
          label: this.$t("commons.button.check"),
          icon: "el-icon-data-line",
          click: (row) => {
            this.onHealthCheck(row)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status.status !== "Failed"
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
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

      // cluster import
      dialogImportVisible: false,
      importLoadding: false,
      projects: [],
      importForm: {
        name: "",
        apiServer: "",
        token: "",
        router: "",
        projectName: "kubeoperator",
      },
      importFormRules: {
        name: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" }],
        apiServer: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" }],
        token: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" }],
        projectName: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "change" }],
        router: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" }],
      },

      // cluster delete
      isForce: false,
      deleteLoadding: false,
      dialogDeleteVisible: false,
      isDeleteButtonDisable: false,
      deleteName: "",

      // cluster upgrade
      dialogUpgradeVisible: false,
      uploadLoadding: false,
      upgradeForm: {
        clusterName: "",
        version: "",
      },
      upgradeFormRules: {
        version: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "change" }],
      },
      oldManifest: {
        coreVars: [],
      },
      newManifest: {
        coreVars: [],
      },
      upgradeVersions: [],
      manifestList: [],
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
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchClusters(currentPage, pageSize, condition).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    onCreate () {
      this.$router.push({ name: "ClusterCreate" })
    },
    goForDetail (row) {
      this.$router.push({ name: "ClusterOverview", params: { name: row.name } })
    },
    selectChange () {
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
    onDelete (row) {
      this.isForce = false
      this.dialogDeleteVisible = true
      if (row) {
        this.deleteName = row.name
      }
    },
    submitDelete () {
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
    onHealthCheck (row) {
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
    onRecover () {
      this.checkLoading = true
      this.isRecover = true
      this.checkData = { hooks: [], level: "" }
      clusterRecover(this.currentCluster.name).then((data) => {
        this.recoverItems = data
        this.checkLoading = false
      })
    },

    // cluster import
    onImport () {
      allProjects().then((data) => {
        this.projects = data.items
        this.dialogImportVisible = true
      }),
        (error) => {
          this.$message({ type: "error", message: error })
        }
    },

    submitImport () {
      this.importLoadding = true
      this.$refs["importFormRules"].validate((valid) => {
        if (valid) {
          importCluster(this.importForm).then(() => {
            this.importLoadding = false
            this.dialogImportVisible = false
          }),
            (error) => {
              this.importLoadding = false
              this.dialogImportVisible = false
              this.$message({ type: "error", message: error })
            }
        } else {
          return false
        }
      })
    },

    // cluster upgrade
    upgradeVersion (row) {
      this.currentCluster = row
      this.upgradeForm.clusterName = row.name
      this.dialogUpgradeVisible = true
      const currentVersion = row.spec.version
      const currentVersions = currentVersion.split(".")
      const version1 = currentVersions[0]
      const version2 = currentVersions[1]
      const versions = currentVersions[2].split("-ko")
      const version3 = Number(versions[0])
      const koVersion = Number(versions[1])
      this.upgradeVersions = []
      listActive().then((res) => {
        this.manifestList = res
        for (const manifest of res) {
          const manifestKoVersions = manifest.name.split("-ko")
          const manifestVersions = manifestKoVersions[0].split(".")
          const manifestKoVersion = Number(manifestKoVersions[1])
          const manifestVersion1 = manifestVersions[0]
          const manifestVersion2 = manifestVersions[1]
          const manifestVersion3 = Number(manifestVersions[2])
          if (version1 === manifestVersion1 && version2 === manifestVersion2) {
            if (manifestVersion3 > version3) {
              this.upgradeVersions.push(manifest.name)
            }
            if (manifestVersion3 === version3 && koVersion < manifestKoVersion) {
              this.upgradeVersions.push(manifest.name)
            }
          }
        }
      })
    },
    changeUpgradeVersions () {
      for (const m of this.manifestList) {
        if (m.name.indexOf(this.currentCluster.spec.version) !== -1) {
          this.oldManifest = m
        }
        if (m.name === this.upgradeForm.version) {
          this.newManifest = m
        }
      }
    },
    getVersion (component, ns) {
      for (const n of ns) {
        if (n.name === component) {
          return n.version
        }
      }
    },
    dialogUpgradeCancel () {
      this.dialogUpgradeVisible = false
      this.upgradeVersions = []
      this.oldManifest = { coreVars: [] }
      this.newManifest = { coreVars: [] }
      this.upgradeForm.clusterName = ""
      this.upgradeForm.version = ""
    },
    submitUpgrade () {
      this.uploadLoadding = true
      this.$refs["upgradeFormRules"].validate((valid) => {
        if (valid) {
          upgradeCluster(this.upgradeForm.clusterName, this.upgradeForm.version).then(
            () => {
              this.uploadLoadding = false
              this.dialogUpgradeCancel()
              this.$message({ type: "success", message: this.$t("commons.msg.upgrade_start_success") })
            },
            (error) => {
              this.uploadLoadding = false
              this.dialogUpgradeCancel()
              this.$message({ type: "error", message: error })
            }
          )
        }
      })
    },

    // cluster logs
    getStatus (row) {
      this.currentCluster = row
      this.dialogLogVisible = true
      this.clusterName = row.name
      this.dialogPolling()
      getClusterStatus(row.name).then((data) => {
        this.log = data
        this.activeName = this.log.conditions.length + 1
      })
    },
    getCurrentCondition () {
      if (this.log.phase !== "Running" && this.log.phase !== "Failed") {
        for (const item of this.log.conditions) {
          if (this.log.status === "Unknown") {
            return item
          }
        }
      }
      return null
    },
    goForLogs () {
      openLogger(this.clusterName)
    },
    onRetry () {
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
    closeDialogLog () {
      clearInterval(this.timer2)
      this.dialogLogVisible = false
    },
    dialogPolling () {
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
            (error) => {
              console.log(error)
              this.opened = false
            }
          )
        }
      }, 3000)
    },

    polling () {
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
          this.search()
        }
      }, 10000)
    },
  },
  created () {
    this.search()
    this.polling()
  },
  destroyed () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
}
</script>

<style scoped>
</style>