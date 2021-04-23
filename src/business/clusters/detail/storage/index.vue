<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;">
      <el-tab-pane :label="$t('cluster.detail.storage.pv')" :name="$t('cluster.detail.storage.pv')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="pvCreate()">{{$t('commons.button.create')}}</el-button>
              <el-button size="small" :disabled="pvSelection.length < 1" type="danger" @click="onBatchDelete('pv')">{{$t('commons.button.delete')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" :selects.sync="pvSelection" :data="pvDatas">
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
            <el-table-column fixed="right" :label="$t('commons.table.action')">
              <template slot-scope="scope">
                <el-button @click="onDelete(scope.row, 'pv', false)" type="danger" circle icon="el-icon-delete" size="small" />
              </template>
            </el-table-column>
          </complex-table>

          <k8s-page @pageChange="pvPageChange" :nextToken="pvPage.nextToken" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('cluster.detail.storage.storage_class')" :name="$t('cluster.detail.storage.storage_class')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="classCreate()">{{$t('commons.button.create')}}</el-button>
              <el-button size="small" :disabled="classSelection.length < 1" type="danger" @click="onBatchDelete('class')">{{$t('commons.button.delete')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" :selects.sync="classSelection" :data="storageClassDatas">
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
            <el-table-column fixed="right" :label="$t('commons.table.action')">
              <template slot-scope="scope">
                <el-button @click="onDelete(scope.row, 'class', false)" type="danger" circle icon="el-icon-delete" size="small" />
              </template>
            </el-table-column>
          </complex-table>

          <k8s-page @pageChange="classPageChange" :nextToken="classPage.nextToken" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('cluster.detail.storage.provisioner')" :name="$t('cluster.detail.storage.provisioner')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="provisionerCreate()">{{$t('commons.button.create')}}</el-button>
              <el-button size="small" :disabled="provisionerSelection.length < 1" @click="onSync()">{{$t('commons.button.sync')}}</el-button>
              <el-button size="small" :disabled="provisionerSelection.length < 1" type="danger" @click="onBatchDelete('provisioner')">{{$t('commons.button.delete')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" :selects.sync="provisionerSelection" :data="provisionerDatas">
            <el-table-column type="selection" fix></el-table-column>
            <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
            <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type" fix />
            <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
              <template v-slot:default="{row}">
                
                <el-button v-if="row.status === 'Initializing'" size="mini" round @click="openXterm(row)" plain type="primary" icon="el-icon-loading">
                  {{ $t("commons.status.initializing") }}
                </el-button>
                <el-button v-if="row.status === 'Failed'" size="mini" round @click="getErrorInfo(row)" plain type="danger">
                  {{ $t("commons.status.failed") }}
                </el-button>
                <el-button v-if="row.status === 'Terminating'" size="mini" round @click="openXterm(row)" type="primary" plain icon="el-icon-loading">
                  {{ $t("commons.status.terminating") }}
                </el-button>

                <el-tag v-if="row.status === 'Running'" type="success">{{ $t("commons.status.running") }}</el-tag>
                <el-tag v-if="row.status === 'NotReady'" type="info">{{ $t("commons.status.not_ready") }}</el-tag>

                <span v-if="row.status === 'Synchronizing'">
                  <i class="el-icon-loading" />{{ $t("commons.status.synchronizing") }}
                </span>
                <span v-if="row.status === 'Waiting'">
                  <i class="el-icon-loading" />{{ $t("commons.status.waiting") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('commons.table.create_time')">
              <template v-slot:default="{row}">
                {{ row.createdAt | datetimeFormat }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('commons.table.action')">
              <template slot-scope="scope">
                <el-button @click="onDelete(scope.row, 'provisioner', false)" type="danger" circle icon="el-icon-delete" size="small" />
              </template>
            </el-table-column>
          </complex-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

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

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="30%" :visible.sync="dialogErrorVisible">
      <span>{{ errMsg | errorFormat }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import K8sPage from "@/components/k8s-page"
import { openProvisionerLogger } from "@/api/cluster"
import { listProvisioner, listPersistentVolumes, listStorageClass, syncProvisioner, deleteProvisioner, deleteSecret, deleteStorageClass, deletePersistentVolume } from "@/api/cluster/storage"

export default {
  name: "ClusterStorage",
  components: { ComplexTable, K8sPage },
  data() {
    return {
      pvPage: {
        continueToken: "",
        nextToken: "",
      },
      classPage: {
        continueToken: "",
        nextToken: "",
      },
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
      activeName: this.$t("cluster.detail.storage.pv"),
    }
  },
  methods: {
    search() {
      if (this.activeName === this.$t("cluster.detail.storage.pv")) {
        listPersistentVolumes(this.clusterName, this.pvPage.continueToken, false).then((data) => {
          this.pvDatas = data.items
          this.pvPage.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
        })
      } else if (this.activeName === this.$t("cluster.detail.storage.storage_class")) {
        listStorageClass(this.clusterName, this.classPage.continueToken, false).then((data) => {
          this.storageClassDatas = data.items
          this.classPage.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
        })
      } else if (this.activeName === this.$t("cluster.detail.storage.provisioner")) {
        listProvisioner(this.clusterName).then((data) => {
          this.provisionerDatas = data
        })
      }
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    classPageChange(continueToken) {
      this.classPage.continueToken = continueToken
      this.search()
    },
    pvPageChange(continueToken) {
      this.pvPage.continueToken = continueToken
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
                this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
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
            this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
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
              this.onDelete(item, "provisioner", true)
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
        this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
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
      syncProvisioner(this.clusterName, this.provisionerSelection).then(() => {
        this.search()
        this.$message({ type: "success", message: this.$t("cluster.detail.storage.start_provisioner_sync") })
        this.dialogSyncVisible = false
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Synchronizing", "Waiting"]
        for (const item of this.provisionerDatas) {
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
  created() {
    this.clusterName = this.$route.params.name
    if (localStorage.getItem("storage_active_name")) {
      this.activeName = localStorage.getItem("storage_active_name")
    }
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
