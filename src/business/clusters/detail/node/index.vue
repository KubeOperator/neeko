<template>
  <div>
    <el-alert v-if="provider === ''" :title="$t('cluster.detail.node.operator_help')" type="info" />
    <complex-table style="margin-top: 20px" :selects.sync="selects" @search="search" :data="data" v-loading="loading" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" :disabled="provider === '' || buttonDisabled()" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1 || provider === '' || buttonDisabled()" @click="onDelete()">{{$t('commons.button.delete')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="onCordon('cordon')">{{$t('commons.button.cordon')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="onCordon('uncordon')">{{$t('commons.button.active')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" show-overflow-tooltip min-width="100" prop="name" fix>
        <template v-slot:default="{row}">
          <el-link v-if="row.status.indexOf('Running') !== -1" type="info" @click="getDetailInfo(row)">{{ row.name }}</el-link>
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
      <el-table-column class="ko-status" :label="$t('commons.table.status')" prop="status" fix>
        <template v-slot:default="{row}">
          <div v-if="row.status.indexOf('Terminating') !== -1">
            <i class="el-icon-loading" /> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)">{{ $t("commons.status.terminating") }} </el-link>
          </div>
          <div v-if="row.status === 'Failed'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getErrorInfo(row)">{{ $t("commons.status.failed") }}</el-link>
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
            <span class="loading" style="color: #32B350"></span>
            {{ $t("commons.status.creating") }}
          </div>
          <div v-if="row.status === 'NotReady'">
            <span class="iconfont iconping" style="color: #FA4147"></span>
            {{ $t("commons.status.not_ready") }}
          </div>
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
      <el-form label-position='left' :model="createForm" ref="createForm" :rules="rules" label-width="110px">
        <el-form-item v-if="provider === 'plan'" prop="increase" :label="$t('cluster.detail.node.increment')">
          <el-input-number style="width: 80%" v-model.number="createForm.increase" clearable />
        </el-form-item>

        <el-form-item v-if="provider === 'bareMetal'" prop="hosts" :label="$t('cluster.detail.node.host')">
          <el-select style="width: 80%" v-model="createForm.hosts" multiple clearable>
            <el-option v-for="item of hosts" :key="item.name" :value="item.name">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="supportGpu === 'disable' && !gpuExist" :label="$t ('cluster.creation.support_gpu')">
          <el-switch style="width: 80%" active-value="enable" inactive-value="diable" v-model="createForm.supportGpu" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="provider === '' || submitLoading" @click="submitCreate()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.node.node_detail')" width="50%" :visible.sync="dialogDetailVisible">
      <div style="height: 450px">
        <el-scrollbar style="height:100%">
          <div style=" text-align: center;">
            <span>{{$t ('cluster.detail.node.base_infomation')}}</span>
            <div align="center" style="margin-top: 15px">
              <table style="width: 90%" class="myTable">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{{detaiInfo.metadata.name}}</td>
                  </tr>
                  <tr>
                    <td>Kernel Version</td>
                    <td>{{detaiInfo.status.nodeInfo.kernelVersion}}</td>
                  </tr>
                  <tr>
                    <td>OS Image</td>
                    <td>{{detaiInfo.status.nodeInfo.osImage}}</td>
                  </tr>
                  <tr>
                    <td>Container Runtime Version</td>
                    <td>{{detaiInfo.status.nodeInfo.containerRuntimeVersion}}</td>
                  </tr>
                  <tr>
                    <td>Kubelet Version</td>
                    <td>{{detaiInfo.status.nodeInfo.kubeletVersion}}</td>
                  </tr>
                  <tr>
                    <td>KubeProxy Version</td>
                    <td>{{detaiInfo.status.nodeInfo.kubeProxyVersion}}</td>
                  </tr>
                  <tr>
                    <td>Operating System</td>
                    <td>{{detaiInfo.status.nodeInfo.operatingSystem}}</td>
                  </tr>
                  <tr>
                    <td>Architecture</td>
                    <td>{{detaiInfo.status.nodeInfo.architecture}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br>

            <span style="margin-top: 30px">{{$t ('cluster.detail.node.label')}}</span>
            <div align="center" style="margin-top: 15px">
              <table style="width: 90%" class="myTable">
                <tbody>
                  <tr v-for="(value, name) in detaiInfo.metadata.labels" :key="name">
                    <td>{{name}}</td>
                    <td>{{value}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br>

            <span style="margin-top: 30px">{{$t('cluster.detail.node.status')}}</span>
            <div align="center" style="margin-top: 15px">
              <el-table :data="detaiInfo.status.conditions" border style="width: 90%">
                <el-table-column prop="type" min-width="80" show-overflow-tooltip label="Type" />
                <el-table-column prop="status" min-width="50" label="Status" />
                <el-table-column prop="lastTransitionTime" min-width="100" label="Time">
                  <template v-slot:default="{row}">
                    {{ row.lastTransitionTime | datetimeFormat }}
                  </template>
                </el-table-column>
                <el-table-column prop="reason" show-overflow-tooltip min-width="100" label="Reason" />
                <el-table-column prop="message" show-overflow-tooltip min-width="100" label="Message" />
              </el-table>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogDetailVisible = false">{{$t('commons.button.cancel')}}</el-button>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="50%" :visible.sync="dialogErrorVisible">
      <div style="margin: 0 50px"><span style="line-height: 30px">{{ errMsg | errorFormat }}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
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

import { listNamespace } from "@/api/cluster/namespace"
import { listNodesByPage, nodeCreate, nodeDelete, cordonNode, evictionNode } from "@/api/cluster/node"
import { listClusterResourcesAll } from "@/api/cluster-resource"
import { getClusterByName, openLogger } from "@/api/cluster"
import { listPod } from "@/api/cluster/cluster"
import Rule from "@/utils/rules"

export default {
  name: "ClusterNode",
  components: { ComplexTable },
  data() {
    return {
      loading: false,
      submitLoading: false,
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row)
          },
          disabled: (row) => {
            return this.provider === '' || this.buttonDisabled(row)
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
      gpuExist: false,
      errMsg: "",
      clusterName: "",
      selects: [],
      data: [],
      createForm: {
        hosts: [],
        nodes: [],
        increase: 1,
        supportGpu: ""
      },
      supportGpu: "",
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
      currentCluster: {},
      hosts: [],
      provider: null,
      dialogCordonVisible: false,
      modeSelect: "safe",
      namespaces: []
    }
  },
  methods: {
    search() {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize)
        .then((data) => {
          this.loading = false
          this.data = data.items
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
      listNamespace(this.clusterName)
        .then((data) => {
          for ( var names of data.items){
            if (names.metadata.name === "gpu-operator-resources"){
              this.gpuExist = true
            }
          }
          this.namespaces = data.items
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchForPolling() {
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.data = data.items
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
      const onPolling = ["Initializing", "Terminating", "Terminating, SchedulingDisabled", "Creating"]
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
    },
    getStatus(row) {
      openLogger(this.clusterName, row.name)
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    getDetailInfo(row) {
      this.detaiInfo = row.info
      this.dialogDetailVisible = true
    },
    submitCreate() {
      this.$refs["createForm"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          nodeCreate(this.clusterName, this.createForm)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              this.dialogCreateVisible = false
              this.search()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
              this.dialogCreateVisible = false
            })
        } else {
          return false
        }
      })
    },
    onDelete(row) {
      if (row) {
        if (row.roles.indexOf("master") !== -1) {
          this.$message({ type: "info", message: this.$t("cluster.detail.node.is_master_node") })
          return
        }
      } else {
        for (const item of this.selects) {
          if (item.roles.indexOf("master") !== -1) {
            this.$message({ type: "info", message: this.$t("cluster.detail.node.is_master_node") })
            return
          }
        }
      }
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
            this.selects = []
          })
          .catch(() => {
            this.search()
            this.selects = []
          })
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
      let data = { spec: { unschedulable: isCordon } }
      const ps = []
      for (const item of this.selects) {
        ps.push(
          cordonNode(this.clusterName, item.name, data).then(() => {
            if (this.modeSelect === "force" && isCordon) {
              listPod(this.clusterName).then((data) => {
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
        if (pod.spec.nodeName === nodeName && pod.metadata.ownerReferences.kind !== "daemonset") {
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
        this.supportGpu = this.currentCluster.spec.supportGpu
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Terminating, SchedulingDisabled", "Creating"]
        for (const item of this.data) {
          if (needPolling.indexOf(item.status) !== -1 && this.selects === 0) {
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
  },
}
</script>

<style scoped>
</style>
