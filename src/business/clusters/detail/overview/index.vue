<template>
  <div>
    <div class="example">
      <el-row>
        <el-col :span="6">
          <el-card style="height: 350px">
            <div slot="header" class="clearfix">
              <span>{{$t('cluster.detail.overview.base_info')}}</span>
              <el-button icon="el-icon-info" type="text" style="float: right;font-size: 14px;padding: 0px 0px;" @click="onOpenDetail">{{$t('commons.button.more_info')}}</el-button>
            </div>
            <div>
              <el-col :span="12">
                <ul>{{$t('cluster.creation.name')}}</ul>
                <ul>{{$t('cluster.version')}}</ul>
                <ul>{{$t('cluster.creation.arch')}}</ul>
                <ul>{{$t('cluster.creation.network_type')}}</ul>
                <div v-if="currentCluster.source === 'local'">
                  <ul>{{$t('cluster.creation.flannel_backend')}}</ul>
                  <ul>{{$t('cluster.creation.proxy_mode')}}</ul>
                </div>
                <ul>{{$t('cluster.creation.runtime_type')}}</ul>
                <ul>{{$t('cluster.detail.overview.source')}}</ul>
              </el-col>
              <el-col :span="12">
                <ul>{{currentCluster.name}}</ul>
                <ul>{{currentCluster.spec.version}}</ul>
                <ul>{{currentCluster.spec.architectures}}</ul>
                <ul>{{currentCluster.spec.networkType}}</ul>
                <div v-if="currentCluster.source === 'local'">
                  <ul v-if="currentCluster.spec.networkType === 'flannel'">{{currentCluster.spec.flannelBackend}}</ul>
                  <ul v-if="currentCluster.spec.networkType === 'calico' && currentCluster.spec.calicoIpv4PoolIpip === 'off'">bgp</ul>
                  <ul v-if="currentCluster.spec.networkType === 'calico' && currentCluster.spec.calicoIpv4PoolIpip === 'Always'">ipip</ul>
                  <ul>{{currentCluster.spec.kubeProxyMode}}</ul>
                </div>
                <ul>{{currentCluster.spec.runtimeType}}</ul>
                <ul>{{currentCluster.source}}</ul>
              </el-col>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 350px">
            <div slot="header" class="clearfix">
              <span>{{$t('cluster.detail.overview.capacity_info')}}</span>
            </div>
            <el-row type="flex" justify="center">
              <el-col :span="8">
                <div align="center">
                  <el-progress :stroke-width="20" type="circle" :width="140" :percentage="cpuUsagePercent"></el-progress>
                  <br>
                  <span style="font-size: 24px">{{$t('cluster.detail.overview.cpu')}}</span>
                  <br>
                  <span style="font-size: 12px">({{cpuUsage.toFixed(2)}} / {{cpuTotal.toFixed(2)}}) Core</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div align="center">
                  <el-progress :stroke-width="20" type="circle" :width="140" :percentage="memUsagePercent"></el-progress>
                  <br>
                  <span style="font-size: 24px">{{$t('cluster.detail.overview.memory')}}</span>
                  <br>
                  <span style="font-size: 12px">
                    ({{(memUsage / 1048576).toFixed(2)}} / {{(memTotal / 1048576).toFixed(2)}}) GiB
                    </span>
                </div>
              </el-col>
              <el-col :span="8">
                <div align="center">
                  <el-progress :stroke-width="20" type="circle" :width="140" :percentage="podUsagePercent"></el-progress>
                  <br>
                  <span style="font-size: 24px">{{$t('cluster.detail.overview.docker')}}</span>
                  <br>
                  <span style="font-size: 12px">({{podLength}} / {{podLimit}})</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="height: 350px">
            <div slot="header" class="clearfix">
              <span>{{$t('cluster.detail.overview.statistical_info')}}</span>
            </div>
            <div>
              <el-col :span="12">
                <ul>Nodes</ul>
                <ul>Namespaces</ul>
                <ul>Deployments</ul>
                <ul>Pods</ul>
                <ul>Containers</ul>
              </el-col>
              <el-col :span="12">
                <ul>{{nodes.length}}</ul>
                <ul>{{namespaces.length}}</ul>
                <ul>{{deployments.length}}</ul>
                <ul>{{pods.length}}</ul>
                <ul>{{containerNumber}}</ul>
              </el-col>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="dialogDetailVisible">
      <ko-detail :clusterDetailInfo="currentCluster" @changeVisble="changeVisble" :visible="dialogDetailVisible" />
    </div>

    <el-card style="margin-top: 20px" v-loading="loading_xterm">
      <div slot="header" style="height: 20px">
        <el-button v-if="!opened" @click="onOpen()" style="float: right;">{{$t('cluster.detail.overview.connect')}}</el-button>
        <el-tooltip v-if="opened" effect="dark" :content="$t('cluster.detail.overview.open_in_new_windows')" placement="bottom">
          <el-button @click="newWindow()" style="float: right;">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconchuangkou"></use>
            </svg>
          </el-button>
        </el-tooltip>
        <el-button v-if="currentCluster.source!=='external'" icon="el-icon-document" @click="downloadKubeConfig()" style="float: right; margin-right: 10px">{{$t('cluster.detail.overview.download_kube_config')}}</el-button>
      </div>
      <div v-if="opened">
        <iframe ref="iframe" style="width: 100%;height: 512px;" :src="url"></iframe>
      </div>
    </el-card>
  </div>
</template>

<script>
import { listPod, listDeployment, getClusterToken } from "@/api/cluster/cluster"
import { listNodeInCluster, listNodesUsage } from "@/api/cluster/node"
import { listNamespace } from "@/api/cluster/namespace"
import { getClusterByName } from "@/api/cluster"
import KoDetail from "./ko-detail.vue"

export default {
  name: "ClusterOverview",
  components: { KoDetail },
  data() {
    return {
      loading_xterm: false,
      dialogDetailVisible: false,
      clusterName: "",
      currentCluster: {
        name: "",
        spec: {
          version: "",
          architectures: "",
          networkType: "",
          kubeProxyMode: "",
          runtimeType: "",
          flannelBackend: "",
          calicoIpv4PoolIpip: "",
        },
        source: "",
      },
      namespaces: [],
      pods: [],
      nodes: [],
      deployments: [],
      containerNumber: 0,
      cpuTotal: 0,
      cpuUsage: 0,
      cpuUsagePercent: 0.0,
      memTotal: 0,
      memUsage: 0,
      memUsagePercent: 0.0,
      podLength: 0,
      podLimit: 0,
      podUsagePercent: 0.0,
      opened: false,
      url: "",
    }
  },
  methods: {
    downloadKubeConfig() {
      window.open(`/api/v1/clusters/kubeconfig/${this.clusterName}`, "_blank")
    },
    search() {
      this.clusterName = this.$route.params.name
      getClusterByName(this.clusterName).then((data) => {
        this.currentCluster = data
      })
      this.loadNameSpaces()
      this.loadNodes()
      this.loadDeployments()
    },
    onOpen() {
      this.loading_xterm = true
      this.opened = true
      getClusterToken(this.clusterName).then((data) => {
        this.url = "/webkubectl/terminal/?token=" + data.token
        this.loading_xterm = false
      })
    },
    changeVisble(val) {
      this.dialogDetailVisible = val
    },
    onOpenDetail() {
      this.dialogDetailVisible = true
    },
    newWindow() {
      this.$refs.iframe.style.display = "none"
      this.opened = false
      getClusterToken(this.clusterName).then((data) => {
        this.url = `/webkubectl/terminal/?token=${data.token}`
        window.open(this.url, "_blank", "weight=300,height=200,alwaysRaised=yes,depended=yes")
      })
    },
    loadNameSpaces() {
      listNamespace(this.clusterName).then((data) => {
        this.namespaces = data.items
      })
    },
    loadPods() {
      listPod(this.clusterName).then((data) => {
        this.pods = data.items
        this.podLength = this.pods.length
        this.pods.forEach((pod) => {
          this.containerNumber = this.containerNumber + pod.spec.containers.length
        })
        this.podUsagePercent = Math.round((this.pods.length / this.podLimit) * 100)
      })
    },
    loadNodes() {
      listNodeInCluster(this.clusterName).then((data) => {
        this.nodes = data.items
        this.nodes.forEach((node) => {
          this.cpuTotal = this.cpuTotal + Number(node.status.capacity.cpu)
          const mem = node.status.capacity.memory.replace("Ki", "")
          this.memTotal = this.memTotal + Number(mem)
          this.podLimit = this.podLimit + Number(node.status.capacity.pods)
        })
        this.loadNodesUsages()
        this.loadPods()
      })
    },
    loadDeployments() {
      listDeployment(this.clusterName).then((data) => {
        this.deployments = data.items
      })
    },
    loadNodesUsages() {
      listNodesUsage(this.clusterName).then((data) => {
        let metrics = data.items
        metrics.forEach((me) => {
          const c = me.usage.cpu.replace("n", "")
          this.cpuUsage = this.cpuUsage + Number(c)
          const m = me.usage.memory.replace("Ki", "")
          this.memUsage = this.memUsage + Number(m)
        })
        this.cpuUsage = this.cpuUsage / (1000 * 1000 * 1000)
        this.memUsagePercent = Math.round((this.memUsage / this.memTotal) * 100)
        this.cpuUsagePercent = Math.round((this.cpuUsage / this.cpuTotal) * 100)
      })
    },
  },
  mounted() {
    this.search()
  },
}
</script>

<style lang="scss" scoped>
.example {
  ul {
    height: 20px;
  }
}
</style>
