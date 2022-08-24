<template>
  <div>
    <el-alert v-if="source === 'external'" :title="$t('cluster.detail.node.operator_help')" type="info" />
    <complex-table style="margin-top: 20px" ref="nodeData" :row-key="getRowKeys" :selects.sync="selects" @search="search" :data="data" v-loading="loading" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" :disabled="source === 'external' || buttonDisabled()" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1 || source === 'external' || buttonDisabled()" @click="onDelete()">{{$t('commons.button.delete')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="onCordon('cordon')">{{$t('commons.button.cordon')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="onCordon('uncordon')">{{$t('commons.button.active')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" :reserve-selection="true" fix></el-table-column>
      <el-table-column sortable :label="$t('commons.table.name')" show-overflow-tooltip min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-link v-if="row.status.indexOf('Running') !== -1" type="info" @click="onDetailInfo(row)">{{ row.name }}</el-link>
          <span v-if="row.status.indexOf('Running') === -1">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="120px" fix>
        <template v-slot:default="{row}">{{getInternalIp(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" width="100px" fix>
        <template v-slot:default="{row}">{{getVersion(row)}}</template>
      </el-table-column>
      <el-table-column label="Roles" show-overflow-tooltip min-width="100" prop="roles" fix />
      <el-table-column sortable class="ko-status" :label="$t('commons.table.status')" prop="status" fix>
        <template v-slot:default="{row}">
          <div v-if="row.status.indexOf('Terminating') !== -1 && currentCluster.provider !== 'bareMetal'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            {{ $t("commons.status.terminating") }}
          </div>
          <div v-if="row.status.indexOf('Terminating') !== -1 && currentCluster.provider === 'bareMetal'">
            <i class="el-icon-loading" /> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)">{{ $t("commons.status.terminating") }} </el-link>
          </div>
          <div v-if="row.status === 'Failed'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)">{{ $t("commons.status.failed") }}</el-link>
          </div>
          <div v-if="row.status === 'Lost'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            {{ $t("commons.status.lost") }}
          </div>
          <div v-if="row.status === 'Initializing'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)"> {{ $t("commons.status.initializing") }}</el-link>
          </div>
          <div v-if="row.status.indexOf('Running') !== -1">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("commons.status.running") }}
          </div>
          <div v-if="row.status.indexOf('SchedulingDisabled') !== -1">
            <span class="iconfont icondiable" style="color: #FA4147"></span>
            {{ $t("commons.status.disable_scheduling") }}
          </div>
          <div v-if="row.status === 'Creating'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            {{ $t("commons.status.creating") }}
          </div>
          <div v-if="row.status === 'Waiting'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.waiting") }}</span>
          </div>

          <div v-if="row.status === 'NotReady'">
            <span class="iconfont iconping" style="color: #FA4147"></span>
            {{ $t("commons.status.not_ready") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.create_time')" prop="createdAt">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" width="30%" :visible.sync="dialogCreateVisible">
      <el-form label-position='left' :model="createForm" ref="createForm" :rules="rules" label-width="110px">
        <el-form-item v-if="provider === 'plan'" prop="increase" :label="$t('cluster.detail.node.increment')">
          <el-input-number :max="maxNodeNum" style="width: 80%" v-model.number="createForm.increase" clearable />
          <div><span class="input-help">{{$t('cluster.detail.node.node_expand_help', [currentCluster.specConf.maxNodeNum - data.length])}}</span></div>
        </el-form-item>

        <span v-if="provider === 'bareMetal'">{{$t ('cluster.creation.node_help')}}</span>
        <el-form-item v-if="provider === 'bareMetal'" prop="hosts" :label="$t('cluster.detail.node.host')" style="margin-top:20px">
          <el-select style="width: 80%" v-model="createForm.hosts" multiple clearable>
            <el-option v-for="item of hosts" :key="item.name" :value="item.name">{{item.name}}({{item.ip}})</el-option>
          </el-select>
          <div><span class="input-help">{{$t('cluster.detail.node.node_expand_help', [maxNodeNum])}}</span></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="provider === '' || submitLoading" @click="submitCreate()" v-preventReClick>{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.node_detail')" width="50%" :visible.sync="dialogDetailVisible">
      <node-detail :DetaiInfo="currentNode"></node-detail>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.node_shrink')" width="30%" :visible.sync="dialogDeleteVisible">
      <batch-delete ref="batchDelete" :deleteLists="deleteLists" @submitDelete="submitDelete" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="onSubmitDelete">{{$t('commons.button.submit')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog @close="searchForPolling()" v-if='dialogLogVisible' :title="$t('task.condition_detail')" width="70%" :visible.sync="dialogLogVisible">
      <ko-logs :operation="operationType" :clusterName="clusterName" :nodeName="nodeName" @retry="onRetry" @cancle="cancleLog()" />
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.cordon')" width="50%" :visible.sync="dialogCordonVisible">
      <el-row type="flex" justify="center">
        <el-form label-width="120px">
          <el-form-item :label="$t('cluster.detail.node.mode')">
            <el-radio v-model="modeSelect" label="safe">{{$t('cluster.detail.node.safe')}}</el-radio>
            <div><span class="input-help">{{$t('cluster.detail.node.safe_cordon_help')}}</span></div>
            <el-radio v-model="modeSelect" label="force">{{$t('cluster.detail.node.force')}}</el-radio>
            <div>
              <span class="input-help">{{$t('cluster.detail.node.force_drain_help1')}}</span>
              <div><span class="input-help" style="margin-left: 20px">{{$t('cluster.detail.node.force_drain_help2')}}</span></div>
              <div><span class="input-help" style="margin-left: 20px">{{$t('cluster.detail.node.force_drain_help3')}}</span></div>
            </div>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCordonVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="submitLoading" @click="submitCordon(true)">{{$t('commons.button.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"

import { listNodesByPage, nodeBatchOperation, cordonNode, evictionNode, nodeReCreate } from "@/api/cluster/node"
import { listClusterResourcesAll } from "@/api/cluster-resource"
import { getClusterByName } from "@/api/cluster"
import KoLogs from "@/components/ko-logs/index.vue"
import NodeDetail from "./detail"
import BatchDelete from "@/components/batch-delete"
import { listPod } from "@/api/cluster/cluster"
import Rule from "@/utils/rules"
import { openLoggerWithName } from "@/api/cluster/tasks"

export default {
  name: "ClusterNode",
  components: { ComplexTable, KoLogs, NodeDetail, BatchDelete },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row)
          },
          disabled: (row) => {
            return this.source === "external" || this.buttonDisabled(row)
          },
        },
      ],
      loading: false,
      submitLoading: false,
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      dialogCreateVisible: false,
      clusterName: "",
      selects: [],
      data: [],
      createForm: {
        hosts: [],
        nodes: [],
        increase: 1,
        statusId: "",
      },
      deleteForm: {
        nodes: "",
      },
      rules: {
        increase: [Rule.NumberRule],
        hosts: [Rule.RequiredRule],
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
      // cluster logs
      dialogLogVisible: false,
      nodeName: "",
      operationType: "",
      dialogDeleteVisible: false,
      deleteLists: [],
      deleteLoadding: false,

      currentNode: {},
      currentCluster: {},
      maxNodeNum: 256,
      hosts: [],
      provider: null,
      source: null,
      dialogCordonVisible: false,
      modeSelect: "safe",
      timer: null,
    }
  },
  methods: {
    getRowKeys(row) {
      return row.name
    },
    search() {
      this.loading = true
      this.$refs.nodeData?.clearSelection()
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize, false)
        .then((data) => {
          this.loading = false
          this.data = data.items || []
          this.data.forEach((item) => {
            item.roles = this.getNodeRoles(item)
            if (item.info.spec["unschedulable"]) {
              item.status += ", SchedulingDisabled"
            }
          })
          this.paginationConfig.total = data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchForPolling() {
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize, true).then((data) => {
        this.data = data.items || []
        this.data.forEach((item) => {
          item.roles = this.getNodeRoles(item)
          if (item.info.spec["unschedulable"]) {
            item.status += ", SchedulingDisabled"
          }
        })
        this.paginationConfig.total = data.total
      })
    },
    buttonDisabled(row) {
      const onPolling = ["Initializing", "Terminating", "Waiting", "Terminating, SchedulingDisabled", "Creating"]
      if (row) {
        return onPolling.indexOf(row.status) !== -1
      } else {
        for (const node of this.selects) {
          if (onPolling.indexOf(node.status) !== -1) {
            return true
          }
        }
        return false
      }
    },
    create() {
      this.dialogCreateVisible = true
      if (this.provider === "bareMetal") {
        listClusterResourcesAll(this.projectName, this.clusterName, "HOST").then((data) => {
          this.hosts = []
          data.items.forEach((item) => {
            if (item.status === "Running" && item.clusterId === "") {
              this.hosts.push(item)
            }
          })
        })
      }
      this.maxNodeNum = this.currentCluster.specConf.maxNodeNum - this.data.length
    },
    onDetailInfo(row) {
      this.currentNode = row.info
      this.dialogDetailVisible = true
    },
    submitCreate() {
      if (this.createForm.nodes > this.maxNodeNum) {
        this.$message({ type: "info", message: this.$t("cluster.detail.node.node_expand_help", [this.maxNodeNum]) })
        return
      }
      this.$refs["createForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.createForm.operation = "create"
          nodeBatchOperation(this.clusterName, this.createForm)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              this.resetForm("createForm")
              this.dialogCreateVisible = false
              this.search()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
              this.resetForm("createForm")
              this.dialogCreateVisible = false
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    onDelete(row) {
      this.deleteLists = []
      if (row) {
        if (row.roles.indexOf("master") !== -1) {
          this.$message({ type: "info", message: this.$t("cluster.detail.node.is_master_node") })
          return
        }
        this.deleteLists.push(row.name)
      } else {
        if (this.selects.length === 0) {
          return
        }
        for (const r of this.selects) {
          if (r.roles.indexOf("master") !== -1) {
            this.$message({ type: "info", message: this.$t("cluster.detail.node.is_master_node") })
            return
          }
          this.deleteLists.push(r.name)
        }
      }
      this.dialogDeleteVisible = true
    },
    onSubmitDelete() {
      this.$refs["batchDelete"].submitDelete()
    },
    submitDelete(selects, force) {
      this.deleteLoadding = true
      const delForm = { operation: "delete", isForce: force, nodes: selects }
      nodeBatchOperation(this.clusterName, delForm)
        .then(() => {
          this.$message({ type: "success", message: this.$t("commons.msg.restart_after_delete") })
          this.selects = []
          this.search()
          this.dialogDeleteVisible = false
          this.deleteLoadding = false
        })
        .catch(() => {
          this.search()
          this.dialogDeleteVisible = false
          this.selects = []
          this.deleteLoadding = false
        })
    },
    onCordon(operation) {
      if (operation === "cordon") {
        for (const item of this.selects) {
          if (item.status !== "Running") {
            this.$message({ type: "info", message: this.$t("cluster.detail.node.existing_cordoned") })
            return
          }
        }
        this.dialogCordonVisible = true
      } else {
        for (const item of this.selects) {
          if (item.status !== "Running, SchedulingDisabled") {
            this.$message({ type: "info", message: this.$t("cluster.detail.node.existing_actived") })
            return
          }
        }
        this.$confirm(this.$t("commons.confirm_message.uncordon"), this.$t("commons.message_box.prompt"), {
          confirmButtonText: this.$t("commons.button.confirm"),
          cancelButtonText: this.$t("commons.button.cancel"),
          type: "warning",
        }).then(() => {
          this.submitCordon(false)
        })
      }
    },
    submitCordon(isCordon) {
      this.submitLoading = true
      const ps = []
      for (const item of this.selects) {
        let nodeInfo = {
          name: item.name,
          cluster: this.clusterName,
          setUnschedulable: isCordon
        }
        ps.push(
          cordonNode(nodeInfo).then(() => {
            if (this.modeSelect === "force" && isCordon) {
              listPod(this.clusterName, "").then((data) => {
                this.bacthDeletePod(data.items, item.name)
              })
            }
          })
        )
      }
      Promise.all(ps)
        .then(() => {
          this.search()
          this.dialogCordonVisible = false
          this.submitLoading = false
          this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
          this.selects = []
        })
        .catch(() => {
          this.submitLoading = false
          this.dialogCordonVisible = false
          this.search()
          this.selects = []
        })
    },
    bacthDeletePod(datas, nodeName) {
      const ps = []
      for (const pod of datas) {
        if (pod.spec.nodeName === nodeName) {
          if (pod.metadata.ownerReferences && pod.metadata.ownerReferences[0].kind === "DaemonSet") {
            return
          }
          let evict = {
            name: pod.metadata.name,
            cluster: this.clusterName,
            namespace: pod.metadata.namespace,
          }
          ps.push(evictionNode(evict))
        }
      }
      Promise.all(ps)
        .then(() => {
          this.search()
          this.$message({
            type: "success",
            message: this.$t("cluster.detail.node.drain_success"),
          })
        })
        .catch(() => {
          this.search()
        })
    },

    getInternalIp(item) {
      return item.ip ? item.ip : "N/a"
    },
    getVersion(item) {
      let result = "N/A"
      if (item.status.indexOf("Running") !== -1) {
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
        this.provider = this.currentCluster.provider
        this.source = this.currentCluster.source
      })
    },

    // cluster logs
    getStatus(row) {
      if (row.status === "Terminating") {
        openLoggerWithName(row.name, row.currentTaskID)
        return
      }
      this.operationType = "waiting-poll"
      this.dialogLogVisible = true
      this.currentNode = row
      this.nodeName = row.name
    },
    onRetry(operation, id) {
      switch (operation) {
        case "CLUSTER_NODE_EXTEND":
          nodeReCreate(this.clusterName, { statusID: id })
          break
        case "CLUSTER_NODE_SHRINK":
          nodeBatchOperation(this.clusterName, { operation: "delete", nodes: [this.currentNode.name] })
          break
      }
    },
    cancleLog() {
      this.searchForPolling()
      this.dialogLogVisible = false
    },

    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Waiting", "Terminating, SchedulingDisabled", "Creating"]
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
  created() {
    this.clusterName = this.$route.params.name
    this.projectName = this.$route.params.project
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

<style lang="scss" scoped>
.dialog {
  height: 450px;
  ::v-deep .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
  }
}
</style>
