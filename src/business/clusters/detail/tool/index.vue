<template>
  <div>
    <el-row>
      <div v-loading="loading" v-for="tool in tools" :key="tool.name">
        <el-col :span="6">
          <el-card style="margin-left:10px; margin-top:10px; height: 180px" class="box-card">
            <el-row>
              <el-col :span="8">
                <img style="width: 60px; height: 60px" :src="require('@/assets/images/tools/'+ tool.logo)">
              </el-col>
              <el-col :span="16">
                <span>{{tool.name}} - {{tool.version}}</span>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <div v-if="tool.status === 'Waiting'">
              <el-button size="small" @click="onEnable(tool)" style="float:right; margin: 5px">
                {{$t('commons.button.enable')}}
              </el-button>
            </div>
            <div v-if="tool.status === 'Failed'">
              <el-button size="small" @click="onErrorShow(tool)" style="float:right; margin: 5px">
                {{$t('commons.button.error_msg')}}
              </el-button>
              <el-button size="small" @click="onEnable(tool)" style="float:right; margin: 5px">
                {{$t('commons.button.enable')}}
              </el-button>
            </div>
            <div v-if="tool.status === 'Running'">
              <span v-if="!tool.frame" style="float:right; margin: 12px">{{$t('commons.status.running')}}</span>
              <el-button v-if="tool.frame" size="small" @click="openFrame(tool)" style="float:right; margin: 5px">
                {{$t('commons.button.jump_to')}}
              </el-button>
              <el-button size="small" @click="onDisable(tool)" style="float:right; margin: 5px">
                {{$t('commons.button.disable')}}
              </el-button>
            </div>
            <div v-if="tool.status === 'Initializing'">
              <span style="float:right; margin: 12px">{{$t('commons.status.initializing')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <div v-if="tool.status === 'Upgrading'">
              <span style="float:right; margin: 12px">{{$t('commons.status.upgrading')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <div v-if="tool.status === 'Terminating'">
              <span style="float:right; margin: 12px">{{$t('commons.status.terminating')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <el-button v-if="tool.higher_version && tool.status === 'Running'" @click="onUpgrade(tool)" size="small" style="float:right; margin: 5px">{{$t('commons.button.upgrade')}}
            </el-button>
          </el-card>
        </el-col>
      </div>
    </el-row>

    <el-dialog :title="$t('cluster.detail.tool.enable_title')" width="30%" :visible.sync="dialogEnableVisible">
      <el-form label-position='left' :model="toolForm" ref="toolForm" label-width="160px">

        <el-form-item :label="$t('cluster.detail.tag.namespace')" prop="vars.namespace" :rules="requiredRules">
          <el-select style="width: 80%" filterable v-model="toolForm.vars['namespace']" clearable>
            <el-option v-for="item of namespaces" :key="item" :value="item">{{item}}</el-option>
          </el-select>
        </el-form-item>

        <div v-if="toolForm.name === 'chartmuseum'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.persistence_storageClass" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence_storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.persistence_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['persistence_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector_kubernetes\\_io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'prometheus'">
          <el-form-item :label="$t('cluster.detail.tool.data_retention')" prop="vars.server_retention" :rules="numberRules">
            <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['server_retention']" clearable></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['server_persistentVolume_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['server_persistentVolume_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.server_persistentVolume_storageClass" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['server_persistentVolume_storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.server_persistentVolume_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['server_persistentVolume_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['server_nodeSelector_kubernetes\\_io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'logging'">
          <el-form-item :label="$t('cluster.detail.tool.search_index')" prop="vars.fluentd__elasticsearch_elasticsearch_logstashPrefix" :rules="requiredRules">
            <el-input style="width: 80%" v-model="toolForm.vars['fluentd__elasticsearch_elasticsearch_logstashPrefix']" clearable></el-input>
            <div><span class="input-help">{{$t('cluster.detail.tool.search_index_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.replicas')" prop="vars.elasticsearch_replicas" :rules="numberRules">
            <el-input-number :step="1" step-strictly style="width: 80%" @blur="checkReplicas" v-model="toolForm.vars['elasticsearch_replicas']" clearable></el-input-number>
            <div v-if="isReplicasValid"><span class="input-help">{{$t('cluster.detail.tool.max_replicas_num')}} : {{nodeNum}}</span>
            </div>
            <div v-if="!isReplicasValid"><span class="input-error">{{$t('cluster.detail.tool.max_replicas_num')}} : {{nodeNum}}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.hip_memory')" prop="vars.elasticsearch_esJavaOpts_item" :rules="numberRules">
            <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['elasticsearch_esJavaOpts_item']" clearable></el-input-number>
            <div><span class="input-help">{{$t('cluster.detail.tool.default_hip_memory')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['elasticsearch_persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['elasticsearch_persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.elasticsearch_volumeClaimTemplate_storageClassName" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['elasticsearch_volumeClaimTemplate_storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.elasticsearch_volumeClaimTemplate_resources_requests_storage" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['elasticsearch_volumeClaimTemplate_resources_requests_storage']" clearable></el-input-number>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'loki'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['loki_persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['loki_persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.loki_persistence_storageClassName" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['loki_persistence_storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.loki_persistence_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['loki_persistence_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['loki_nodeSelector_kubernetes\\_io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'grafana'">
          <el-form-item :label="$t('cluster.detail.tool.password')" prop="vars.adminPassword" :rules="passwordRules">
            <el-input @blur="checkPassword" type="password" style="width: 80%" v-model="toolForm.vars['adminPassword']" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.password_re')" prop="vars.adminPasswordRe" :rules="passwordRules">
            <el-input @blur="checkPassword" type="password" style="width: 80%" v-model="toolForm.vars['adminPasswordRe']" clearable></el-input>
            <div v-if="!isPasswordValid"><span class="input-error">{{$t('cluster.detail.tool.grafana_password_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.persistence_storageClassName" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence_storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.persistence_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['persistence_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector_kubernetes\\_io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'registry'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.persistence_storageClass" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence_storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.persistence_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['persistence_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector_kubernetes\\_io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'kubeapps'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['postgresql_persistence_enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['postgresql_persistence_enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')" prop="vars.global_storageClass" :rules="requiredRules">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['global_storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')" prop="vars.postgresql_persistence_size" :rules="numberRules">
              <el-input-number :step="1" step-strictly style="width: 80%" v-model="toolForm.vars['postgresql_persistence_size']" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEnableVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="submitLoading" @click="enable()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="30%" :visible.sync="dialogErrorVisible">
      <div style="margin: 0 50px"><span style="line-height: 30px">{{ conditions | errorFormat }}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.info_title')" width="30%" :visible.sync="dialogDisableVisible">
      <span>{{$t('cluster.detail.tool.disable_show_msg')}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDisableVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="disable(toolForm)">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.upgrade_title')" width="30%" :visible.sync="dialogUpgradeVisible">
      <span>{{toolForm.name}}: {{toolForm.version}} ---> {{toolForm.higher_version}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpgradeVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="upgrade(toolForm)">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTool, enableTool, disableTool, upgradeTool } from "@/api/cluster/tool"
import { listNodeInCluster } from "@/api/cluster/node"
import { listNamespace } from "@/api/cluster/namespace"
import { listStorageClass } from "@/api/cluster/storage"
import { getClusterByName, getSecret } from "@/api/cluster"
import { changeUnderLineToPoint } from "@/utils/format_conversion"
import Rule from "@/utils/rules"

export default {
  name: "ClusterTool",
  data() {
    return {
      loading: false,
      clusterName: "",
      currentCluster: {
        name: "",
        spec: {
          architectures: "",
        },
      },
      tools: [],
      dialogEnableVisible: false,
      dialogErrorVisible: false,
      dialogDisableVisible: false,
      dialogUpgradeVisible: false,
      conditions: "",
      submitLoading: false,
      isPasswordValid: true,
      isReplicasValid: true,
      toolForm: {
        name: "",
        version: "",
        describe: "",
        status: "",
        message: "",
        logo: "",
        url: "",
        frame: false,
        vars: {},
        higher_version: "",
      },
      numberRules: [Rule.NumberRule],
      requiredRules: [Rule.RequiredRule],
      passwordRules: [Rule.PasswordRule],
      namespaces: [],
      nodes: [],
      nodeNum: 0,
      storages: [],
      loadMenu: false,
      timer: {},
    }
  },
  methods: {
    search() {
      this.loading = true
      this.clusterName = this.$route.params.name
      getClusterByName(this.clusterName).then((data) => {
        this.currentCluster = data
      })
      listTool(this.clusterName)
        .then((data) => {
          this.loading = false
          this.tools = data
          const needLoad = ["Initializing", "Terminating", "Upgrading"]
          for (const to of this.tools) {
            if (to.name === "logging" || to.name === "loki" || to.name === "prometheus") {
              if (needLoad.indexOf(to.status) !== -1) {
                this.loadMenu = true
              }
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    openFrame(item) {
      getSecret(this.clusterName).then((data) => {
        localStorage.setItem("kubeapps_auth_token_oidc", "false")
        localStorage.setItem("kubeapps_auth_token", data.kubernetesToken)
        window.open("" + item.url.replace("{cluster_name}", this.clusterName), "_blank")
      })
    },
    onEnable(item) {
      this.conditions = ""
      switch (item.name) {
        case "logging":
          for (const tool of this.tools) {
            if (tool.name === "loki") {
              this.conditions = tool.status === "Waiting" ? "" : this.$t("cluster.detail.tool.log_err_msg")
              break
            }
          }
          break
        case "loki":
          if (this.currentCluster.spec.architectures === "amd64") {
            for (const tool of this.tools) {
              if (tool.name === "logging") {
                this.conditions = tool.status === "Waiting" ? "" : this.$t("cluster.detail.tool.log_err_msg")
                break
              }
            }
          }
          break
        case "grafana":
          for (const tool of this.tools) {
            if (tool.name === "prometheus") {
              this.conditions = tool.status === "Running" ? "" : this.$t("cluster.detail.tool.grafana_err_msg")
              break
            }
          }
          break
      }
      if (this.conditions === "") {
        this.listNamespaces()
        this.listNodes()
        this.listStorages()
        this.setDefaultVars(item)
        this.toolForm = item
        this.isPasswordValid = true
        this.isReplicasValid = true
        this.dialogEnableVisible = true
      } else {
        this.dialogErrorVisible = true
      }
    },
    enable() {
      this.$refs["toolForm"].validate((valid) => {
        if (valid && this.isPasswordValid && this.isReplicasValid) {
          this.loadMenu = this.toolForm.name === "logging" || this.toolForm.name === "loki" || this.toolForm.name === "prometheus"
          this.submitLoading = true
          changeUnderLineToPoint(this.toolForm.vars)
          enableTool(this.clusterName, this.toolForm).then(() => {
            this.dialogEnableVisible = false
            this.search()
            this.submitLoading = false
          })
        } else {
          this.submitLoading = false
          return false
        }
      })
    },
    checkPassword() {
      if (this.toolForm.vars["adminPassword"] && this.toolForm.vars["adminPasswordRe"]) {
        this.isPasswordValid = this.toolForm.vars["adminPassword"] == this.toolForm.vars["adminPasswordRe"]
      }
    },
    checkReplicas() {
      this.isReplicasValid = this.toolForm.vars["elasticsearch_replicas"] <= this.nodeNum
    },
    onErrorShow(item) {
      this.conditions = item.message
      this.dialogErrorVisible = true
    },
    onDisable(item) {
      this.toolForm = item
      this.dialogDisableVisible = true
    },
    disable(item) {
      this.loadMenu = item.name === "logging" || item.name === "loki" || item.name === "prometheus"
      disableTool(this.clusterName, item).then(() => {
        this.dialogDisableVisible = false
        this.search()
      })
    },
    onUpgrade(item) {
      this.toolForm = item
      this.dialogUpgradeVisible = true
    },
    upgrade(item) {
      this.submitLoading = true
      upgradeTool(this.clusterName, item)
        .then(() => {
          this.dialogUpgradeVisible = false
          this.search()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    listNamespaces() {
      listNamespace(this.clusterName).then((data) => {
        this.namespaces = []
        data.items.forEach((item) => {
          this.namespaces.push(item.metadata.name)
        })
      })
    },
    listNodes() {
      listNodeInCluster(this.clusterName).then((data) => {
        this.nodes = []
        data.items.forEach((item) => {
          if (item.spec["unschedulable"] === undefined) {
            this.nodes.push(item.metadata.name)
          }
        })
        this.nodeNum = this.nodes.length
      })
    },
    listStorages() {
      listStorageClass(this.clusterName, null, true).then((data) => {
        this.storages = []
        data.items.forEach((item) => {
          this.storages.push(item.metadata.name)
        })
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Upgrading"]
        for (const item of this.tools) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          listTool(this.clusterName).then((data) => {
            this.tools = data
          })
        } else {
          if (this.loadMenu) {
            window.location.reload()
          }
          this.loadMenu = false
        }
      }, 10000)
    },
    setDefaultVars(item) {
      switch (item.name) {
        case "prometheus":
          item.vars = {
            namespace: "kube-operator",
            server_retention: 10,
            server_persistentVolume_enabled: false,
            server_persistentVolume_size: 10,
            server_persistentVolume_storageClass: "",
          }
          break
        case "chartmuseum":
          item.vars = {
            namespace: "kube-operator",
            persistence_enabled: false,
            env_open_DISABLE_API: false,
            persistence_storageClass: "",
            service_type: "NodePort",
            persistence_size: 10,
          }
          break
        case "registry":
          item.vars = {
            namespace: "kube-operator",
            persistence_enabled: false,
            persistence_storageClass: "",
            service_type: "NodePort",
            persistence_size: 10,
          }
          break
        case "logging":
          item.vars = {
            namespace: "kube-operator",
            elasticsearch_esJavaOpts_item: 1,
            elasticsearch_replicas: 1,
            elasticsearch_persistence_enabled: false,
            elasticsearch_volumeClaimTemplate_resources_requests_storage: 10,
            elasticsearch_volumeClaimTemplate_storageClassName: "",
          }
          break
        case "loki":
          item.vars = {
            namespace: "kube-operator",
            loki_persistence_enabled: false,
            loki_persistence_size: 8,
            loki_persistence_storageClassName: "",
            promtail_dockerPath: this.currentCluster.spec.dockerStorageDir,
          }
          break
        case "grafana":
          item.vars = {
            namespace: "kube-operator",
            persistence_enabled: false,
            persistence_size: 10,
            persistence_storageClassName: "",
            adminPassword: "",
            adminPasswordRe: "",
          }
          break
        case "kubeapps":
          item.vars = {
            namespace: "kube-operator",
            postgresql_persistence_enabled: false,
            postgresql_persistence_size: 10,
            global_storageClass: "",
          }
          break
        case "dashboard":
          item.vars = {
            namespace: "kube-operator",
          }
          break
      }
    },
  },
  created() {
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
