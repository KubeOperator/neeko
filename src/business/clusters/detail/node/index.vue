<template>
  <div>
    <complex-table :selects.sync="selects" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="remove()">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-button v-if="row.status === 'Running'" @click="goForDetail(row)" type="text">{{row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="IP" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getInternalIp(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getVersion(row)}}</template>
      </el-table-column>
      <el-table-column label="Roles" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getNodeRoles(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix />
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" width="30%" :visible.sync="dialogCreateVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item v-if="provider === 'plan'" prop="increase" :label="$t('cluster.detail.node.increment')">
          <el-input style="width: 80%" v-model="form.increase" type="number" min="1" />
        </el-form-item>

        <el-form-item v-if="provider === 'bareMetal'" prop="hosts" :label="$t('cluster.detail.node.increment')">
          <el-select style="width: 80%" v-model="form.hosts" multiple clearable>
            <el-option v-for="item of hosts" :key="item.name" :value="item.name">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="submitCreate()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.node_detail')" width="50%" :visible.sync="dialogDetailVisible">
      <div style="height: 600px">
        <el-scrollbar style="height:100%">
          <span>{{$t('cluster.detail.node.base_infomation')}}</span>
          <el-divider></el-divider>
          <table style="width: 90%" class="myTable">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{{detaiInfo.metadata.name}}</td>
              </tr>
              <tr>
                <th>Kernel Version</th>
                <td>{{detaiInfo.status.nodeInfo.kernelVersion}}</td>
              </tr>
              <tr>
                <th>OS Image</th>
                <td>{{detaiInfo.status.nodeInfo.osImage}}</td>
              </tr>
              <tr>
                <th>Container Runtime Version</th>
                <td>{{detaiInfo.status.nodeInfo.containerRuntimeVersion}}</td>
              </tr>
              <tr>
                <th>Kubelet Version</th>
                <td>{{detaiInfo.status.nodeInfo.kubeletVersion}}</td>
              </tr>
              <tr>
                <th>KubeProxy Version</th>
                <td>{{detaiInfo.status.nodeInfo.kubeProxyVersion}}</td>
              </tr>
              <tr>
                <th>Operating System</th>
                <td>{{detaiInfo.status.nodeInfo.operatingSystem}}</td>
              </tr>
              <tr>
                <th>Architecture</th>
                <td>{{detaiInfo.status.nodeInfo.architecture}}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <span>{{$t('cluster.detail.node.label')}}</span>
          <el-divider></el-divider>
          <table style="width: 90%" class="myTable">
            <tbody>
              <tr v-for="(value, name) in detaiInfo.metadata.labels" :key="name">
                <th>{{name}}</th>
                <td>{{value}}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <span>{{$t('cluster.detail.node.status')}}</span>
          <el-divider></el-divider>
          <table style="width: 90%" class="myTable">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="condition in detaiInfo.status.conditions" :key="condition.key">
                <td class="left">{{condition.type}}</td>
                <td class="left">{{condition.status}}</td>
                <td class="left">{{condition.lastTransitionTime | datetimeFormat}}</td>
                <td class="left">{{condition.reason}}</td>
                <td class="left">{{condition.message}}</td>
              </tr>
            </tbody>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogDetailVisible = false">{{$t('commons.button.cancel')}}</el-button>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"

import { listNodesByPage, nodeCreate } from "@/api/cluster/node"
import { listClusterResourcesOfAll } from "@/api/cluster-resource"
import { getClusterByName } from "@/api/cluster"

export default {
  name: "ClusterNode",
  components: { ComplexTable },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      dialogCreateVisible: false,
      clusterName: "",
      selects: [],
      data: [],
      form: {
        hosts: [],
        nodes: [],
        increase: 1,
        operation: "",
      },
      rules: {
        increase: [{ required: true, message: this.$t("commons.validate.required_msg"), trigger: "blur" }],
        hosts: [{ required: true, message: this.$t("commons.validate.required_msg"), trigger: "change" }],
      },
      dialogDetailVisible: false,
      detaiInfo: {
        metadata: {
          name: "",
          labels: [],
          labelsItem: [],
        },
        status: {
          nodeInfo: {},
          conditions: {},
        },
        spec: {},
      },
      currentCluster: {},
      hosts: [],
      provider: "",
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.dialogCreateVisible = true
      if (this.provider === "bareMetal") {
        listClusterResourcesOfAll("kubeoperator", this.clusterName, "HOST").then((data) => {
          console.log(data)
          // this.hosts = data.items
        })
      }
    },
    goForDetail(row) {
      this.detaiInfo = row.info
      this.dialogDetailVisible = true
    },
    submitCreate() {
      nodeCreate(this.clusterName, this.form).then(
        () => {
          this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
          this.dialogCreateVisible = false
          this.search()
        },
        (error) => {
          this.$message({ type: "error", message: error })
          this.dialogCreateVisible = false
        }
      )
    },
    remove() {},
    getInternalIp(item) {
      return item.ip ? item.ip : "N/a"
    },
    getVersion(item) {
      let result = "N/A"
      if (item.status === "Running") {
        result = item.info.status.nodeInfo.kubeletVersion
      }
      return result
    },
    getNodeRoles(item) {
      let roles = []
      if (item.status === "Running") {
        for (const key in item.info.metadata.labels) {
          if (key) {
            switch (key) {
              case "node-role.kubernetes.io/master":
                roles.push("master")
                break
              case "node-role.kubernetes.io/etcd":
                roles.push("etcd")
                break
              case "node-role.kubernetes.io/worker":
                roles.push("worker")
                break
              case "node-role.kubernetes.io/control-plane":
                roles.push("control-plane")
                break
            }
          }
        }
      }
      return roles.join(",")
    },
    getCluster() {
      getClusterByName(this.clusterName).then((data) => {
        this.currentCluster = data
        this.provider = this.currentCluster.spec.provider
      })
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.getCluster()
    this.search()
  },
}
</script>

<style scoped>
.myTable {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
}

.myTable td,
.myTable th {
  border: 1px solid #cad9ea;
  color: #666;
  height: 30px;
}
</style>
