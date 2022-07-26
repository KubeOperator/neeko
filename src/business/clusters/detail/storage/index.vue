<template>
  <div>
    <el-alert v-if="provider === ''" :title="$t('cluster.detail.storage.operator_help')" type="info" />
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;">
        <el-tab-pane :label="$t('cluster.detail.storage.storage_class')" name="storage_class">
          <el-card v-if="!classOnCreate">
            <template>
              <el-button-group>
                <el-button size="small" @click="classOnCreate = true">{{$t('commons.button.create')}}</el-button>
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
          <class-create v-if="classOnCreate" @backTo="backTo" />
        </el-tab-pane>
        <el-tab-pane :label="$t('cluster.detail.storage.provisioner')" name="provisioner">
          <el-card v-if="!provisionerOnCreate">
            <template>
              <el-button-group>
                <el-button size="small" :disabled="provider === ''" @click="provisionerCreate('create')">{{$t('commons.button.create')}}</el-button>
                <el-tooltip :content="$t('cluster.detail.storage.provisioner_exist_help')" placement="top-start">
                  <el-button size="small" :disabled="provider === ''" @click="provisionerCreate('import')">{{$t('commons.button.import_exist')}}</el-button>
                </el-tooltip>
                <el-button size="small" :disabled="isDeleteButtonDisable" @click="onSync()">{{$t('commons.button.sync')}}</el-button>
                <el-button size="small" :disabled="isDeleteButtonDisable" @click="onBatchDelete('provisioner')">{{$t('commons.button.delete')}}</el-button>
              </el-button-group>
            </template>
            <complex-table style="margin-top: 20px" ref="provisionerData" :row-key="getRowKeys" v-loading="loading" :selects.sync="provisionerSelection" @selection-change="selectChange()" :data="provisionerDatas">
              <el-table-column type="selection" :reserve-selection="true" fix></el-table-column>
              <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name">
                <template v-slot:default="{row}">
                  <el-link v-if="detailShow(row)" style="font-size: 12px" type="info" @click="getDetailInfo(row)">{{ row.name }}</el-link>
                  <span v-else>{{ row.name }}</span>
                </template>
              </el-table-column>
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
                    <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
                    <el-link type="info" @click="openXterm(row)">{{ $t("commons.status.not_ready") }}</el-link>
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
          <provisioner-create @backTo="backTo" :operation="operation" v-if="provisionerOnCreate" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="dialogDetailVisible">
      <provisioner-detail :provioner="currentProvisioner" @changeVisble="changeVisble" :visible="dialogDetailVisible" />
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
import { openLoggerWithName } from "@/api/cluster/tasks"
import ProvisionerDetail from "./provisioner-detail"
import ProvisionerCreate from "./provisioner-create"
import ClassCreate from "./class-create"
import { listProvisioner, listStorageClass, syncProvisioner, deleteProvisioner, deleteSecret, deleteStorageClass } from "@/api/cluster/storage"

export default {
  name: "ClusterStorage",
  components: { ComplexTable, K8sPage, ProvisionerDetail, ProvisionerCreate, ClassCreate },
  data() {
    return {
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
      classPage: {
        continueToken: "",
        nextToken: "",
      },
      provider: null,
      loading: false,
      isDeleteButtonDisable: true,
      provisionerOnCreate: false,
      operation: "",
      classOnCreate: false,
      provisionerDatas: [],
      storageClassDatas: [],
      clusterName: "",
      classSelection: [],
      provisionerSelection: [],
      dialogDeleteVisible: false,
      dialogSyncVisible: false,
      dialogErrorVisible: false,
      errMsg: "",
      activeName: "storageclass",
      timer: null,

      dialogDetailVisible: false,
      currentProvisioner: {},
    }
  },
  methods: {
    getRowKeys(row) {
      return row.name
    },
    search() {
      this.loading = true
      if (this.activeName === "storage_class") {
        listStorageClass(this.clusterName, this.classPage.continueToken, false)
          .then((data) => {
            this.loading = false
            this.storageClassDatas = data.items
            this.classPage.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$refs.provisionerData?.clearSelection()
        listProvisioner(this.clusterName)
          .then((data) => {
            this.loading = false
            this.provisionerDatas = data || []
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    backTo(act) {
      this.activeName = act
      this.classOnCreate = false
      this.provisionerOnCreate = false
      this.search()
    },
    changeVisble(val) {
      this.dialogDetailVisible = val
    },
    detailShow(row) {
      return row.type !== "glusterfs" && row.type !== "external-cephfs" && row.type !== "external-ceph-block"
    },
    getDetailInfo(val) {
      this.dialogDetailVisible = true
      this.currentProvisioner = val
    },
    getCluster() {
      getClusterByName(this.clusterName).then((data) => {
        this.provider = data.provider
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
    handleClick() {
      localStorage.setItem("storage_active_name", this.activeName)
      this.provisionerOnCreate = false
      this.classOnCreate = false
      this.search()
    },
    provisionerCreate(operation) {
      this.operation = operation
      this.provisionerOnCreate = true
    },
    selectChange() {
      let isOk = true
      if (this.provisionerSelection.length === 0) {
        this.isDeleteButtonDisable = true
        return
      }
      for (const item of this.provisionerSelection) {
        if (item.status !== "Running" && item.status !== "Failed" && item.status !== "NotReady") {
          isOk = false
          break
        }
      }
      this.isDeleteButtonDisable = !isOk
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
      }
    },
    onBatchDelete(type) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        switch (type) {
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
      if (row.status === "Terminating") {
        openLoggerWithName(this.clusterName, row.id + " (disable)")
      } else{
        openLoggerWithName(this.clusterName, row.id + " (enable)")
      }
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
            this.provisionerDatas = data || []
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
    this.timer = null
  },
}
</script>

<style scoped>
</style>
