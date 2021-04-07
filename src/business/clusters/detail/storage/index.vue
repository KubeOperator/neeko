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
            <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix />
            <el-table-column :label="$t('commons.table.create_time')">
              <template v-slot:default="{row}">
                {{ row.createdAt | datetimeFormat }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('commons.table.action')">
              <template slot-scope="scope">
                <el-button @click="goDelete(scope.row, 'provisioner')" type="danger" icon="el-icon-delete" size="small">删除</el-button>
              </template>
            </el-table-column>
          </complex-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="$t('cluster.detail.storage.pv_create')" width="30%" :visible.sync="dialogPvVisible">
      <el-form label-width="80px">
        <el-form-item :label="$t('commons.table.type')">
          <el-select style="width: 80%" size="small" v-model="pvCreateType">
            <el-option value="Host Path" label="Host Path">Host Path</el-option>
            <el-option value="Local Volume" label="Local Volume">external-ceph</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="goCreate('pv')">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

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
import { listProvisioner, listPersistentVolumes, listStorageClass, syncProvisioner, deleteProvisioner } from "@/api/cluster/storage"

export default {
  name: "ClusterStorage",
  components: { ComplexTable },
  data() {
    return {
      provisionerDatas: [],
      pvDatas: [],
      dialogPvVisible: false,
      pvCreateType: "",
      storageClassDatas: [],
      classCreateName: "",
      provisioners: "",
      classCreateType: "",
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
      this.search()
    },
    pvCreate() {
      this.dialogPvVisible = true
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
                for(let item of data.items) {
                  if (item.provisioner === item.name) {
                    isClassExist = true
                    break
                  }
                }
                if (isClassExist) {
                  this.$message({ type: "error", message: this.$t("commons.msg.delete_success") })
                } else {
                  deleteProvisioner(this.clusterName, row).then(
                    this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
                  )
                }
              })
              break
            case "class":
              console.log("go class")
              break
            case "pv":
              console.log("go pv")
              break
          }
          this.dialogDeleteVisible = false
        }).catch(() => {
          this.$message({ type: "info", message: this.$t("commons.msg.delete_cancel") })
          this.dialogDeleteVisible = false
        })
        this.search()
    },
    goSync() {
      this.dialogSyncVisible = true
    },
    submitSync() {
      syncProvisioner(this.clusterName, this.provisionerSelection).then((data) => {
        console.log(data)
        this.$message({ type: "success", message: this.$t("cluster.detail.storage.start_provisioner_sync") })
        this.dialogSyncVisible = false
      })
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
