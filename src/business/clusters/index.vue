<template>
  <layout-content>
    <complex-table :header="$t('cluster.cluster')" :selects.sync="clusterSelection" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="clusterSelection.length < 1" @click="remove()">{{$t('commons.button.delete')}}</el-button>
          <el-button size="small" @click="importIn()">{{$t('commons.button.import')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-button v-if="row.status === 'Running'" @click="goForDetail(row)" type="text">{{row.name}}</el-button>
          <span v-if="row.status !== 'Running'">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="spec.version" fix />
      <el-table-column :label="$t('cluster.node_size')" min-width="50" prop="nodeSize" />
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status === 'Running'" type="success" size="small">{{$t('commons.status.running')}}</el-tag>
          <el-tag v-if="row.status === 'Failed'" type="danger" size="small">{{$t('commons.status.failed')}}</el-tag>
          <el-tag @click.native="getStatus(row)" v-if="row.status === 'Initializing'" type="success" size="small">{{$t('commons.status.initializing')}}
            <font-awesome-icon icon="spinner" pulse />
          </el-tag>
          <el-tag v-if="row.status === 'Creating'" type="info" size="small">{{$t('commons.status.creating')}}
            <font-awesome-icon icon="spinner" pulse />
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :title="$t('commons.button.batch_import')" width="50%" :visible.sync="dialogLogVisible">
      <span v-if="log.conditions&&log.conditions.length === 0">{{log.message}}</span>
      <div style="height: 300px;">
        <el-steps finish-status="success" direction="vertical" :active="1">
          <div v-for="condition in log.conditions" :key="condition.name">
            <el-step v-if="condition.status === 'True'" :title="$t('cluster.condition.' +condition.name)"></el-step>
            <el-step v-if="condition.status === 'False'" :title="$t('cluster.condition.' +condition.name)"></el-step>
            <el-step v-if="condition.status === 'Unknown'" :title="$t('cluster.condition.' +condition.name)"></el-step>
          </div>
        </el-steps>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="onUploadFile()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import { listClusters, getClusterStatus } from "@/api/cluster"

export default {
  name: "Cluster",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.upgrade"),
          icon: "el-icon-video-play",
          click: this.upgrade,
        },
        {
          label: this.$t("commons.button.check"),
          icon: "el-icon-delete",
          type: "danger",
          click: this.check,
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      clusterSelection: [],
      data: [],
      clusterName: "",
      log: {
        phase: "",
        prePhase: "",
        message: "",
        conditions: [],
      },
      dialogLogVisible: false,
    }
  },
  methods: {
    upgrade(row) {
      console.log("编辑: ", row)
    },
    check(row) {
      console.log("编辑: ", row)
    },
    handleSelectionChange(val) {
      this.clusterSelection = val
    },
    create() {
      this.$router.push({ name: "ClusterCreate" })
    },
    remove() {},
    importIn() {},
    goForDetail(row) {
      this.$router.push({ name: "ClusterOverview", params: { name: row.name } })
    },
    search() {
      const { currentPage, pageSize } = this.paginationConfig
      listClusters(currentPage, pageSize, "kubeoperator").then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    getStatus(row) {
      this.dialogLogVisible = true
      this.clusterName = row.name
      this.dialogPolling()
      getClusterStatus(row.name).then((data) => {
        this.log = data
      })
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
    dialogPolling() {
      this.timer = setInterval(() => {
        if (this.keepPolling) {
          getClusterStatus(this.clusterName).then(
            (data) => {
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
          this.search()
        }
      }, 10000)
    },
  },
  created() {
    this.search()
    this.polling()
  },
}
</script>

<style scoped>
</style>
