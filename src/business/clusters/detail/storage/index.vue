<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick()" style="margin-bottom: 30px;">
      <el-tab-pane :label="$t('cluster.detail.storage.pv')" :name="$t('cluster.detail.storage.pv')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="pvCreate()">{{$t('commons.button.create')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" @selection-change="handleSelectionChange" :data="pvDatas">
            <el-table-column :label="$t('commons.table.name')" min-width="100" prop="metadata.name" fix />
            <el-table-column :label="$t('cluster.detail.storage.capacity')" min-width="100" prop="spec.capacity['storage']" fix />
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
                <el-button @click="goDelete(scope.row, 'pv')" type="danger" circle icon="el-icon-delete" size="small" />
              </template>
            </el-table-column>
          </complex-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('cluster.detail.storage.storage_class')" :name="$t('cluster.detail.storage.storage_class')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="classCreate()">{{$t('commons.button.create')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" @selection-change="handleSelectionChange" :data="storageClassDatas">
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
                <el-button @click="goDelete(scope.row, 'class')" type="danger" circle icon="el-icon-delete" size="small" />
              </template>
            </el-table-column>
          </complex-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('cluster.detail.storage.provisioner')" :name="$t('cluster.detail.storage.provisioner')">
        <el-card>
          <template>
            <el-button-group>
              <el-button size="small" @click="provisionerCreate()">{{$t('commons.button.create')}}</el-button>
              <el-button size="small" :disabled="provisionerSelection.length < 1" @click="goSync()">{{$t('commons.button.sync')}}</el-button>
            </el-button-group>
          </template>
          <complex-table style="margin-top: 20px" @selection-change="handleSelectionChange" :data="provisionerDatas">
            <el-table-column type="selection" fix></el-table-column>
            <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
            <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type" fix />
            <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
              <template slot-scope="scope">
                <span style="margin: 12px">{{scope.row.status}}
                  <i v-if="scope.row.status === 'Initializing' || scope.row.status === 'Terminating' || scope.row.status === 'Synchronizing' || scope.row.status === 'Waiting'" class="el-icon-loading" />
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
                <el-button @click="goDelete(scope.row, 'provisioner')" type="danger" circle icon="el-icon-delete" size="small" />
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
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listProvisioner, listPersistentVolumes, listStorageClass, syncProvisioner, deleteProvisioner, deleteSecret, deleteStorageClass, deletePersistentVolume } from "@/api/cluster/storage"

export default {
  name: "ClusterStorage",
  components: { ComplexTable },
  data() {
    return {
      provisionerDatas: [],
      pvDatas: [],
      storageClassDatas: [],
      clusterName: "",
      provisionerSelection: [],
      dialogDeleteVisible: false,
      dialogSyncVisible: false,
      activeName: this.$t("cluster.detail.storage.pv"),
    }
  },
  methods: {
    search() {
      if (this.activeName === this.$t("cluster.detail.storage.pv")) {
        listPersistentVolumes(this.clusterName).then((data) => {
          this.pvDatas = data.items
        })
      } else if (this.activeName === this.$t("cluster.detail.storage.storage_class")) {
        listStorageClass(this.clusterName).then((data) => {
          this.storageClassDatas = data.items
        })
      } else if (this.activeName === this.$t("cluster.detail.storage.provisioner")) {
        listProvisioner(this.clusterName).then((data) => {
          this.provisionerDatas = data
        })
      }
    },
    handleSelectionChange(val) {
      this.provisionerSelection = val
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
    goDelete(row, type) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
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
                deleteProvisioner(this.clusterName, row).then(this.$message({ type: "success", message: this.$t("commons.msg.delete_success") }))
                this.search()
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
        this.dialogDeleteVisible = false
      })
    },
    deleteClass(deleteName) {
      deleteStorageClass(this.clusterName, deleteName).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
        this.search()
      })
    },
    goSync() {
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
}
</script>

<style scoped>
</style>
