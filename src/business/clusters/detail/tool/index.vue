<template>
  <div>
    <el-row>
      <div v-for="tool in tools" :key="tool.name">
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
              <el-button type="primary" size="small" @click="onEnable(tool)" style="float:right; margin: 5px">{{$t('commons.button.enable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Failed'">
              <el-button type="danger" size="small" @click="onDisable(tool)" style="float:right; margin: 5px">{{$t('commons.button.disable')}}</el-button>
              <el-button type="primary" size="small" @click="onEnable(tool)" style="float:right; margin: 5px">{{$t('commons.button.enable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Running'">
              <span v-if="!tool.frame" style="float:right; margin: 12px">{{$t('commons.status.Running')}}</span>
              <el-button v-if="tool.frame" size="small" @click="openFrame(tool)" style="float:right; margin: 5px">{{$t('commons.button.jump_to')}}</el-button>
              <el-button type="danger" size="small" @click="onDisable(tool)" style="float:right; margin: 5px">{{$t('commons.button.disable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Initializing'">
              <span style="float:right; margin: 12px">{{$t('commons.status.Initializing')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <div v-if="tool.status === 'Upgrading'">
              <span style="float:right; margin: 12px">{{$t('commons.status.Upgrading')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <div v-if="tool.status === 'Terminating'">
              <span style="float:right; margin: 12px">{{$t('commons.status.Terminating')}}
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <el-button v-if="tool.higher_version && tool.status === 'Running'" @click="onUpgrade(tool)" size="small" style="float:right; margin: 5px">{{$t('commons.button.upgrade')}}</el-button>
          </el-card>
        </el-col>
      </div>
    </el-row>

    <el-dialog :title="$t('cluster.detail.tool.enable_title')" width="30%" :visible.sync="dialogEnableVisible">
      <el-form :model="toolForm" label-width="120px">
        <el-form-item :label="$t('cluster.detail.tag.namespace')">
          <el-select style="width: 80%" filterable v-model="toolForm.vars['namespace']" clearable>
            <el-option v-for="item of namespaces" :key="item" :value="item">{{item}}</el-option>
          </el-select>
        </el-form-item>

        <div v-if="toolForm.name === 'chartmuseum'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence.storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['persistence.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'prometheus'">
          <el-form-item :label="$t('cluster.detail.tool.data_retention')">
            <el-input style="width: 80%" v-model="toolForm.vars['server.retention']" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['server.persistentVolume.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['server.persistentVolume.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['server.persistentVolume.storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['server.persistentVolume.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['server.nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'logging'">
          <el-form-item :label="$t('cluster.detail.tool.search_index')">
            <el-input style="width: 80%" v-model="toolForm.vars['fluentd-elasticsearch.elasticsearch.logstashPrefix']" clearable></el-input>
            <div><span class="input-help">{{$t('cluster.detail.tool.search_index_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.replicas')">
            <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['elasticsearch.replicas']" :min="1" :max="nodeNum"></el-input-number>
            <div><span class="input-help">{{$t('cluster.detail.tool.max_replicas_num')}} : {{nodeNum}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.hip_memery')">
            <el-input style="width: 80%" v-model="toolForm.vars['elasticsearch.esJavaOpts.item']" clearable></el-input>
            <div><span class="input-help">{{$t('cluster.detail.tool.default_hip_memery')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['elasticsearch.persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['elasticsearch.persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['elasticsearch.volumeClaimTemplate.storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['elasticsearch.volumeClaimTemplate.resources.requests.storage']" :min="1" :max="500"></el-input-number>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'loki'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['loki.persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['loki.persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['loki.persistence.storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['loki.persistence.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['loki.nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'grafana'">
          <el-form-item :label="$t('cluster.detail.tool.password')">
            <el-input type="password" style="width: 80%" v-model="toolForm.vars['adminPassword']" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.password_re')">
            <el-input type="password" style="width: 80%" v-model="toolForm.vars['adminPasswordRe']" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence.storageClassName']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['persistence.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'registry'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['persistence.storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['persistence.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>

        <div v-if="toolForm.name === 'kubeapps'">
          <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
            <el-switch style="width: 80%" v-model="toolForm.vars['postgresql.persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="toolForm.vars['postgresql.persistence.enabled']">
            <el-form-item :label="$t('cluster.detail.tool.storage_class')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['global.storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tool.storage_size')">
              <el-input-number style="width: 80%" :step="1" step-strictly v-model="toolForm.vars['postgresql.persistence.size']" :min="1" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.tag.node')">
              <el-select style="width: 80%" filterable v-model="toolForm.vars['nodeSelector']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
              <div><span class="input-help">{{$t('cluster.detail.tool.node_select_help')}}</span></div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEnableVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="enable(toolForm)">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.tool.err_title')" width="30%" :visible.sync="dialogFaildVisible">
      <span>{{conditions}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFaildVisible = false">{{$t('commons.button.cancel')}}</el-button>
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
import { getClusterByName } from "@/api/cluster"

export default {
  name: "ClusterTool",
  data() {
    return {
      clusterName: "",
      currentCluster: {
        name: "",
        spec: {
          architectures: "",
        },
      },
      tools: [],
      dialogEnableVisible: false,
      dialogFaildVisible: false,
      dialogDisableVisible: false,
      dialogUpgradeVisible: false,
      conditions: "",
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
      namespaces: [],
      nodes: [],
      nodeNum: 0,
      storages: [],
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      getClusterByName(this.clusterName).then((data) => {
        this.currentCluster = data
      })
      listTool(this.clusterName).then((data) => {
        this.tools = data
      })
    },
    openFrame(item) {
      window.open(item.url.replace("{cluster_name}", this.currentCluster.name), "_blank")
    },
    onEnable(item) {
      this.conditions = ""
      switch (item.name) {
        case "logging":
          for (const tool of this.tools) {
            if (tool.name === "loki") {
              this.conditions = tool.status === "Waiting" ? "" : this.$t("cluster.detailtool.log_err_msg")
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
        this.toolForm = item
        this.setDefaultVars(item)
        this.dialogEnableVisible = true
      } else {
        this.dialogFaildVisible = true
      }
    },
    enable(item) {
      enableTool(this.clusterName, item).then((data) => {
        this.dialogEnableVisible = false
        this.search()
        console.log(data)
      })
    },
    onDisable(item) {
      this.toolForm = item
      this.dialogDisableVisible = true
    },
    disable(item) {
      disableTool(this.clusterName, item).then((data) => {
        this.dialogDisableVisible = false
        this.search()
        console.log(data)
      })
    },
    onUpgrade(item) {
      this.toolForm = item
      this.dialogUpgradeVisible = true
    },
    upgrade(item) {
      upgradeTool(this.clusterName, item).then((data) => {
        this.dialogUpgradeVisible = false
        this.search()
        console.log(data)
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
          this.nodes.push(item.metadata.name)
        })
        this.nodeNum = this.nodes.length
      })
    },
    listStorages() {
      listStorageClass(this.clusterName).then((data) => {
        this.storages = data.items
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
          listTool(this.currentCluster.name).then((data) => {
            this.tools = data
          })
        }
      }, 10000)
    },
    setDefaultVars(item) {
      switch (item.name) {
        case "prometheus":
          item.vars = {
            "server.retention": 10,
            "server.persistentVolume.enabled": false,
            "server.persistentVolume.size": 10,
            "server.persistentVolume.storageClass": "",
          }
          break
        case "chartmuseum":
          item.vars = {
            "persistence.enabled": false,
            "env.open.DISABLE_API": false,
            "persistence.storageClass": "",
            "service.type": "NodePort",
            "persistence.size": 10,
          }
          break
        case "registry":
          item.vars = {
            "persistence.enabled": false,
            "persistence.storageClass": "",
            "service.type": "NodePort",
            "persistence.size": 10,
          }
          break
        case "logging":
          item.vars = {
            "elasticsearch.esJavaOpts.item": 1,
            "elasticsearch.replicas": 1,
            "elasticsearch.persistence.enabled": false,
            "elasticsearch.volumeClaimTemplate.resources.requests.storage": 10,
            "elasticsearch.volumeClaimTemplate.storageClassName": "",
          }
          break
        case "loki":
          item.vars = {
            "loki.persistence.enabled": false,
            "loki.persistence.size": 8,
            "loki.persistence.storageClassName": "",
            "promtail.dockerPath": this.currentCluster.spec.dockerStorageDir,
          }
          break
        case "grafana":
          item.vars = {
            "persistence.enabled": false,
            "persistence.size": 10,
            "persistence.storageClassName": "",
            adminPassword: "",
            adminPasswordRe: "",
          }
          break
        case "kubeapps":
          item.vars = {
            "postgresql.persistence.enabled": false,
            "postgresql.persistence.size": 10,
            "global.storageClass": "",
          }
          break
        case "dashboard":
          item.vars = {}
          break
      }
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
