<template>
  <div>
    <el-alert v-if="provider === ''" :title="$t('cluster.detail.storage.operator_help')" type="info" />
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;">
        <el-tab-pane :label="$t('cluster.detail.storage.pv')" name="pv">
          <el-card>
            <template>
              <el-button-group>
                <el-button size="small" @click="pvCreate()">{{$t('commons.button.create')}}</el-button>
                <el-button size="small" :disabled="pvSelection.length < 1" @click="onBatchDelete('pv')">{{$t('commons.button.delete')}}</el-button>
              </el-button-group>
            </template>
            <complex-table style="margin-top: 20px" v-loading="loading" :selects.sync="pvSelection" :data="pvDatas">
              <el-table-column type="selection" fix></el-table-column>
              <el-table-column :label="$t('commons.table.name')" min-width="100" prop="metadata.name" fix />
              <el-table-column :label="$t('cluster.detail.storage.capacity')" min-width="100" prop="spec.capacity.storage" fix />
              <el-table-column label="Access Modes" min-width="100" prop="spec.accessModes" fix />
              <el-table-column :label="$t('cluster.detail.storage.source')" min-width="100" prop="spec.storageClassName" fix />
              <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status.phase" fix />
              <el-table-column :label="$t('commons.table.create_time')">
                <template v-slot:default="{row}">
                  {{ row.metadata.creationTimestamp | datetimeFormat }}
                </template>
              </el-table-column>
              <fu-table-operations :buttons="buttons_pv" :label="$t('commons.table.action')" fix />
            </complex-table>

            <k8s-page @pageChange="pvPageChange" :nextToken="pvPage.nextToken" />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('cluster.detail.storage.storage_class')" name="storage_class">
          <el-card>
            <template>
              <el-button-group>
                <el-button size="small" @click="classCreate()">{{$t('commons.button.create')}}</el-button>
                <el-button size="small" :disabled="classSelection.length < 1" @click="onBatchDelete('class')">{{$t('commons.button.delete')}}</el-button>
              </el-button-group>
            </template>
            <complex-table style="margin-top: 20px" v-loading="loading" :selects.sync="classSelection" :data="storageClassDatas">
              <el-table-column type="selection" fix></el-table-column>
              <el-table-column :label="$t('commons.table.name')" min-width="100" prop="metadata.name" fix />
              <el-table-column :label="$t('cluster.detail.storage.provisioner_short')" min-width="100" prop="provisioner" fix />
              <el-table-column :label="$t('cluster.detail.storage.reclaim_policy')" min-width="100" prop="reclaimPolicy" fix />
              <el-table-column :label="$t('cluster.detail.storage.volume_binding_mode')" min-width="100" prop="volumeBindingMode" fix />
              <el-table-column :label="$t('commons.table.create_time')">
                <template v-slot:default="{row}">
                  {{ row.metadata.creationTimestamp | datetimeFormat }}
                </template>
              </el-table-column>
              <fu-table-operations :buttons="buttons_class" :label="$t('commons.table.action')" fix />
            </complex-table>

            <k8s-page @pageChange="classPageChange" :nextToken="classPage.nextToken" />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('cluster.detail.storage.provisioner')" name="provisioner">
          <el-card>
            <template>
              <el-button-group>
                <el-button size="small" :disabled="provider === ''" @click="provisionerCreate()">{{$t('commons.button.create')}}</el-button>
                <el-button size="small" :disabled="provisionerSelection.length < 1" @click="onSync()">{{$t('commons.button.sync')}}</el-button>
                <el-button size="small" :disabled="provisionerSelection.length < 1" @click="onBatchDelete('provisioner')">{{$t('commons.button.delete')}}</el-button>
              </el-button-group>
            </template>
            <complex-table style="margin-top: 20px" v-loading="loading" :selects.sync="provisionerSelection" :data="provisionerDatas">
              <el-table-column type="selection" fix></el-table-column>
              <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
              <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type" fix />
              <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
                <template v-slot:default="{row}">
                  <div v-if="row.status === 'Initializing'">
                    <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
                    <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.initializing") }}</el-link>
                  </div>
                  <div v-if="row.status === 'Terminating'">
                    <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
                    <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.terminating") }}</el-link>
                  </div>
                  <div v-if="row.status === 'Failed'">
                    <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
                    <el-link type="info" @click="getErrorInfo(row)">{{ $t("commons.status.failed") }}</el-link>
                  </div>
                  <div v-if="row.status == 'Running'">
                    <span class="iconfont iconduihao" style="color: #32B350"></span>
                    {{ $t("commons.status.running") }}
                  </div>
                  <div v-if="row.status == 'NotReady'">
                    <span class="iconfont iconerror" style="color: #FA4147"></span>
                    {{ $t("commons.status.not_ready") }}
                  </div>
                  <div v-if="row.status === 'Synchronizing'">
                    <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
                    <span>{{ $t("commons.status.synchronizing") }}</span>
                  </div>
                  <div v-if="row.status === 'Creating'">
                    <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
                    <span>{{ $t("commons.status.creating") }}</span>
                  </div>
                  <div v-if="row.status === 'Waiting'">
                    <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
                    <span>{{ $t("commons.status.waiting") }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('commons.table.create_time')">
                <template v-slot:default="{row}">
                  {{ row.createdAt | datetimeFormat }}
                </template>
              </el-table-column>
              <fu-table-operations :buttons="buttons_provisioner" :label="$t('commons.table.action')" fix />
            </complex-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :title="$t('commons.button.sync')" width="30%" :visible.sync="dialogSyncVisible">
      <span>{{$t('cluster.detail.storage.ensure_provisioner_sync')}}</span>
      <ul style="margin-left: 5%;" :key="pro.name" v-for="pro of provisionerSelection">
        <li>{{pro.name}} ({{pro.type}})</li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSyncVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="submitSync()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="50%" :visible.sync="dialogErrorVisible">
      <div style="margin: 0 50px"><span style="line-height: 30px">{{ errMsg | errorFormat }}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import K8sPage from "@/components/k8s-page"
import { getClusterByName } from "@/api/cluster"
import { openProvisionerLogger } from "@/api/cluster"
import { listProvisioner, listPersistentVolumes, listStorageClass, syncProvisioner, deleteProvisioner, deleteSecret, deleteStorageClass, deletePersistentVolume } from "@/api/cluster/storage"

export default {
  name: "ClusterStorage",
  components: { ComplexTable, K8sPage },
  data() {
    return {
      buttons_pv: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row, "pv", false)
          },
        },
      ],
      buttons_class: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row, "class", false)
          },
        },
      ],
      buttons_provisioner: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row, "provisioner", false)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status !== "Failed" && row.status !== "NotReady"
          },
        },
      ],
      pvPage: {
        continueToken: "",
        nextToken: "",
      },
      classPage: {
        continueToken: "",
        nextToken: "",
      },
      provider: null,
      loading: false,
      provisionerDatas: [],
      pvDatas: [],
      storageClassDatas: [],
      clusterName: "",
      pvSelection: [],
      classSelection: [],
      provisionerSelection: [],
      dialogDeleteVisible: false,
      dialogSyncVisible: false,
      dialogErrorVisible: false,
      errMsg: "",
      activeName: "pv",
      timer: {},
    }
  },
  methods: {
    search() {
      this.loading = true
      if (this.activeName === "pv") {
        listPersistentVolumes(this.clusterName, this.pvPage.continueToken)
          .then((data) => {
            this.loading = false
            this.pvDatas = data.items
            this.pvPage.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.activeName === "storage_class") {
        listStorageClass(this.clusterName, this.classPage.continueToken, false)
          .then((data) => {
            this.loading = false
            this.storageClassDatas = data.items
            this.classPage.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.activeName === "provisioner") {
        listProvisioner(this.clusterName)
          .then((data) => {
            this.loading = false
            this.provisionerDatas = data
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    getCluster() {
      getClusterByName(this.clusterName).then((data) => {
        this.provider = data.spec.provider
      })
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    classPageChange(continueToken) {
      this.classPage.continueToken = continueToken.token
      this.search()
    },
    pvPageChange(continueToken) {
      this.pvPage.continueToken = continueToken.token
      this.search()
    },
    handleClick() {
      localStorage.setItem("storage_active_name", this.activeName)
      this.search()
    },
    pvCreate() {
      this.$router.push({ name: "ClusterStoragePvCreate" })
    },
    classCreate() {
      this.$router.push({ name: "ClusterStorageClassCreate" })
    },
    provisionerCreate() {
      this.$router.push({ name: "ClusterStorageProvionerCreate" })
    },
    onDelete(row, type, isBatchDelete) {
      if (isBatchDelete) {
        this.submitDelete(row, type)
      } else {
        this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
          confirmButtonText: this.$t("commons.button.ok"),
          cancelButtonText: this.$t("commons.button.cancel"),
          type: "warning",
        }).then(() => {
          this.dialogDeleteVisible = false
          this.submitDelete(row, type)
        })
      }
    },
    submitDelete(row, type) {
      switch (type) {
        case "provisioner":
          listStorageClass(this.clusterName).then((data) => {
            let isClassExist = false
            for (let item of data.items) {
              if (item.provisioner === row.name) {
                isClassExist = true
                break
              }
            }
            if (isClassExist) {
              this.$message({ type: "error", message: this.$t("cluster.detail.storage.storage_class_exist") })
            } else {
              deleteProvisioner(this.clusterName, row).then(() => {
                this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
                this.search()
              })
            }
          })
          break
        case "class":
          if (row.provisioner === "kubernetes.io/glusterfs") {
            const namespace = row.parameters.secretNamespace
            const secretName = row.parameters.secretName
            deleteSecret(this.clusterName, namespace, secretName).then(() => {
              this.deleteClass(row.metadata.name)
            })
          } else {
            this.deleteClass(row.metadata.name)
          }
          break
        case "pv":
          deletePersistentVolume(this.clusterName, row.metadata.name).then(() => {
            this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
            this.search()
          })
          break
      }
    },
    onBatchDelete(type) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        switch (type) {
          case "pv":
            this.pvSelection.forEach((item) => {
              this.onDelete(item, "pv", true)
            })
            break
          case "class":
            this.classSelection.forEach((item) => {
              this.onDelete(item, "class", true)
            })
            break
          case "provisioner":
            this.provisionerSelection.forEach((item) => {
              this.onDelete(item, "provisioner", true)
            })
            break
        }
      })
    },
    deleteClass(deleteName) {
      deleteStorageClass(this.clusterName, deleteName).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
        this.search()
      })
    },
    openXterm(row) {
      openProvisionerLogger(this.clusterName, row.id)
    },
    onSync() {
      this.dialogSyncVisible = true
    },
    submitSync() {
      syncProvisioner(this.clusterName, this.provisionerSelection)
        .then(() => {
          this.search()
          this.$message({ type: "success", message: this.$t("cluster.detail.storage.start_provisioner_sync") })
          this.dialogSyncVisible = false
          this.provisionerSelection = []
        })
        .catch(() => {
          this.provisionerSelection = []
        })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Synchronizing", "Creating", "Waiting"]
        for (const item of this.provisionerDatas) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          listProvisioner(this.clusterName).then((data) => {
            this.provisionerDatas = data
          })
        }
      }, 10000)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    if (localStorage.getItem("storage_active_name")) {
      this.activeName = localStorage.getItem("storage_active_name")
    }
    this.getCluster()
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
</style>
