<template>
  <div>
    <complex-table :selects.sync="selects" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="onDelete()">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" :selectable="selectable" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" show-overflow-tooltip min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-button v-if="row.status.indexOf('Running') !== -1" @click="goForDetail(row)" type="text">{{row.name}}</el-button>
          <span v-if="row.status.indexOf('Running') === -1">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="120px" fix>
        <template v-slot:default="{row}">{{getInternalIp(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" width="100px" fix>
        <template v-slot:default="{row}">{{getVersion(row)}}</template>
      </el-table-column>
      <el-table-column label="Roles" show-overflow-tooltip min-width="100" fix>
        <template v-slot:default="{row}">{{getNodeRoles(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" prop="status" fix>
        <template v-slot:default="{row}">

          <el-button v-if="row.status === 'Failed'" size="mini" round @click="getErrorInfo(row)" plain type="danger">
            {{ $t("commons.status.failed") }}
          </el-button>
          <el-button v-if="row.status === 'Terminating'" size="mini" round @click="getStatus(row)" type="primary" plain icon="el-icon-loading">
            {{ $t("commons.status.terminating") }}
          </el-button>
          <el-button v-if="row.status === 'Initializing'" size="mini" round @click="getStatus(row)" type="primary" plain icon="el-icon-loading">
            {{ $t("commons.status.initializing") }}
          </el-button>

          <span v-if="row.status === 'Creating'">
            <i class="el-icon-loading" />{{ $t("commons.status.creating") }}
          </span>

          <el-tag v-if="row.status.indexOf('Running') !== -1" type="success">{{ $t("commons.status.running") }}</el-tag>
          <el-tag v-if="row.status.indexOf('SchedulingDisabled') !== -1" type="primary">{{$t('cluster.detail.node.disable_scheduling')}}</el-tag>
          <el-tag v-if="row.status === 'NotReady'" type="info">{{ $t("commons.status.not_ready") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" width="30%" :visible.sync="dialogCreateVisible">
      <el-form :model="createForm" ref="createForm" :rules="rules" label-width="80px">
        <el-form-item v-if="provider === 'plan'" prop="increase" :label="$t('cluster.detail.node.increment')">
          <el-input style="width: 80%" v-model="createForm.increase" type="number" min="1" clearable />
        </el-form-item>

        <el-form-item v-if="provider === 'bareMetal'" prop="hosts" :label="$t('cluster.detail.node.host')">
          <el-select style="width: 80%" v-model="createForm.hosts" multiple clearable>
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
                <th style="width: 50%">Name</th>
                <td>{{detaiInfo.metadata.name}}</td>
              </tr>
              <tr>
                <th style="width: 50%">Kernel Version</th>
                <td>{{detaiInfo.status.nodeInfo.kernelVersion}}</td>
              </tr>
              <tr>
                <th style="width: 50%">OS Image</th>
                <td>{{detaiInfo.status.nodeInfo.osImage}}</td>
              </tr>
              <tr>
                <th style="width: 50%">Container Runtime Version</th>
                <td>{{detaiInfo.status.nodeInfo.containerRuntimeVersion}}</td>
              </tr>
              <tr>
                <th style="width: 50%">Kubelet Version</th>
                <td>{{detaiInfo.status.nodeInfo.kubeletVersion}}</td>
              </tr>
              <tr>
                <th style="width: 50%">KubeProxy Version</th>
                <td>{{detaiInfo.status.nodeInfo.kubeProxyVersion}}</td>
              </tr>
              <tr>
                <th style="width: 50%">Operating System</th>
                <td>{{detaiInfo.status.nodeInfo.operatingSystem}}</td>
              </tr>
              <tr>
                <th style="width: 50%">Architecture</th>
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
                <th style="width: 50%">{{name}}</th>
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

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="30%" :visible.sync="dialogErrorVisible">
      <span>{{errMsg | errorFormat}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.cordon')" width="30%" :visible.sync="dialogCordonVisible">
      <el-form label-width="120px">
        <el-form-item :label="$t('cluster.detail.node.mode')">
           <el-radio-group v-model="modeSelect">
              <el-radio label="safe">{{$t('cluster.detail.node.safe')}}</el-radio>
              <el-radio label="force">{{$t('cluster.detail.node.force')}}</el-radio>
            </el-radio-group>
            <div v-if="modeSelect === 'safe'"><span class="input-help">{{$t('cluster.detail.node.safe_cordon_help')}}</span></div>
            <div v-if="modeSelect === 'force'">
              <div><span class="input-help">{{$t('cluster.detail.node.force_drain_help1')}}</span></div>
              <div><span class="input-help">{{$t('cluster.detail.node.force_drain_help2')}}</span></div>
              <div><span class="input-help">{{$t('cluster.detail.node.force_drain_help3')}}</span></div>
            </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCordonVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button @click="submitCordon(true)" type="primary">{{$t('commons.button.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"

import { listNodesByPage, nodeCreate, nodeDelete, cordonNode, evictionNode } from "@/api/cluster/node"
import { listClusterResources } from "@/api/cluster-resource"
import { getClusterByName, openLogger } from "@/api/cluster"
import { listPod } from "@/api/cluster/cluster"

export default {
  name: "ClusterNode",
  components: { ComplexTable },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.onDelete(row)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status !== "Failed" && row.status !== "NotReady"
          },
        },
        {
          label: this.$t("cluster.detail.node.cordon"),
          icon: "el-icon-s-unfold",
          type: "primary",
          click: (row) => {
            this.onCordon(row, "cordon")
          },
          disabled: (row) => {
            return row.status !== "Running"
          },
        },
        {
          label: this.$t("cluster.detail.node.uncordon"),
          icon: "el-icon-s-fold",
          type: "primary",
          click: (row) => {
            this.onCordon(row, "uncordon")
          },
          disabled: (row) => {
            return row.status !== "Running, SchedulingDisabled"
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      dialogCreateVisible: false,
      dialogErrorVisible: false,
      errMsg: "",
      clusterName: "",
      selects: [],
      data: [],
      createForm: {
        hosts: [],
        nodes: [],
        increase: 1,
      },
      deleteForm: {
        nodes: "",
      },
      rules: {
        increase: [{ required: true, pattern: /^[1-9][0-9]*$/, message: this.$t("commons.validate.number_limit"), trigger: "blur" }],
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
      dialogCordonVisible: false,
      modeSelect: "safe",
      nodeName: "",
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.data = data.items
        this.data.forEach((item) => {
          if (item.info.spec["unschedulable"]) {
            item.status = "Running, SchedulingDisabled"
          }
        })
        this.paginationConfig.total = data.total
      })
    },
    selectable(row) {
      return this.getNodeRoles(row).indexOf("master") === -1
    },
    create() {
      this.dialogCreateVisible = true
      if (this.provider === "bareMetal") {
        listClusterResources(this.currentCluster.projectName, this.clusterName, "HOST", 1, 10).then((data) => {
          this.hosts = data.items
        })
      }
    },
    getStatus(row) {
      openLogger(this.clusterName, row.name)
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    goForDetail(row) {
      this.detaiInfo = row.info
      this.dialogDetailVisible = true
    },
    submitCreate() {
      this.$refs["createForm"].validate((valid) => {
        if (valid) {
          nodeCreate(this.clusterName, this.createForm).then(
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
        } else {
          return false
        }
      })
    },
    onDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (row) {
          ps.push(nodeDelete(this.clusterName, row.name))
        } else {
          for (const item of this.selects) {
            ps.push(nodeDelete(this.clusterName, item.name))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
          })
          .catch(() => {
            this.search()
          })
      })
    },
    onCordon(row, operation) {
      this.nodeName = row.name
      if (operation === "cordon") {
        this.dialogCordonVisible = true
      } else {
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
      let data = { spec: { unschedulable: isCordon } }
      cordonNode(this.clusterName, this.nodeName, data).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.op_success") })
        this.dialogCordonVisible = false
        if (this.modeSelect === "force" && isCordon) {
          listPod(this.clusterName).then((data) => {
            this.bacthDeletePod(data.items)
          })
        }
        this.search()
      }),
        (error) => {
          this.$message({ type: "error", message: error })
          this.dialogCordonVisible = false
        }
    },
    bacthDeletePod(datas) {
      const ps = []
      for (const pod of datas) {
        if (pod.spec.nodeName === this.nodeName && pod.metadata.ownerReferences.kind !== "daemonset") {
          const rmPod = {
            apiVersion: "policy/v1beta1",
            kind: "Eviction",
            metadata: {
              name: pod.metadata.name,
              namespace: pod.metadata.namespace,
              creationTimestamp: null,
            },
            deleteOptions: {},
          }
          ps.push(evictionNode(this.clusterName, pod.metadata.namespace, pod.metadata.name, rmPod))
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
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating"]
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
    this.clusterName = this.$route.params.name
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
