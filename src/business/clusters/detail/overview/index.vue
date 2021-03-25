<template>
  <div>
    <div v-loading="loading">
      <el-row>
        <el-col :span="6">
          <el-card style="height: 350px">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <el-col :span="8">
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
            <el-col :span="8">
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
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 350px">
            <div slot="header" class="clearfix">
              <span>容量信息</span>
            </div>
            <el-row type="flex" justify="center">
              <el-col :span="6">
                <el-progress :stroke-width="12" type="circle" :percentage="cpuUsagePercent"></el-progress>
              </el-col>
              <el-col :span="6">
                <el-progress :stroke-width="12" type="circle" :percentage="memUsagePercent"></el-progress>
              </el-col>
              <el-col :span="6">
                <el-progress :stroke-width="12" type="circle" :percentage="podUsagePercent"></el-progress>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="height: 350px">
          <div slot="header" class="clearfix">
            <span>统计信息</span>
          </div>
            <el-col :span="8">
              <ul>Nodes</ul>
              <ul>Namespaces</ul>
              <ul>Deployments</ul>
              <ul>Pods</ul>
              <ul>Containers</ul>
            </el-col>
            <el-col :span="8">
              <ul>{{nodes.length}}</ul>
              <ul>{{namespaces.length}}</ul>
              <ul>{{deployments.length}}</ul>
              <ul>{{pods.length}}</ul>  
              <ul>{{containerNumber}}</ul>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <el-button v-if="currentCluster.source==='local'" size="small" @click="downloadKubeConfig()">下载KubeConfig</el-button>

    <el-card style="height: 150px;margin-top: 40px">
      <div slot="header" class="clearfix">
        <span>WebKubeCtl</span>
        <el-button v-if="!opened" type="primary" @click="open()" style="float: right;">连 接</el-button>
        <el-button v-if="opened" icon="el-icon-s-platform" type="primary" @click="newWindow()" style="float: right;"></el-button>
      </div>
      <div>
        <div id="xterm" class="xterm" />
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getClusterByName, listNamespaces, listPod, listNodes, listDeployment, listNodesUsage } from "@/api/cluster"

  export default {
    name: "Cluster",
    data() {
      return {
        loading: false,
        clusterName: '',
        currentCluster: {
          name: '',
          spec: {
            version: '',
            architectures: '',
            networkType: '',
            kubeProxyMode: '',
            runtimeType: '',
            flannelBackend: '',
            calicoIpv4PoolIpip: ''
          },
          source: '',
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
        podLimit: 0,
        podUsagePercent: 0.0,
        opened: false,
      }
    },
    methods: {
      downloadKubeConfig() {
        window.open(`/api/v1/clusters/kubeconfig/${this.clusterName}`, "_blank")
      },
      search() {
        this.loading = true
        this.clusterName = this.$route.params.name
        getClusterByName(this.clusterName).then(data => {
          this.currentCluster = data
          this.loading = false
        })
        this.listNameSpaces()
        this.listNodes()
        this.listDeployment()
      },
      open() {
      },
      newWindow() {
      },
      listNameSpaces() {
        listNamespaces(this.clusterName).then(data => {
          this.namespaces = data.items
        })
      },
      listPods() {
        listPod(this.clusterName).then(data => {
          this.pods = data.items
          this.pods.forEach(pod => {
            this.containerNumber = this.containerNumber + pod.spec.containers.length
          })
          this.podUsagePercent = Math.round((this.pods.length / this.podLimit) * 100)
        })
      },
      listNodes() {
        listNodes(this.clusterName).then(data => {
          this.nodes = data.items
          this.nodes.forEach(node => {
            this.cpuTotal = this.cpuTotal + Number(node.status.capacity.cpu)
            const mem = node.status.capacity.memory.replace("Ki", "")
            this.memTotal = this.memTotal + Number(mem)
            this.podLimit = this.podLimit + Number(node.status.capacity.pods)
          })
          this.listNodesUsage()
          this.listPods()
        })
      },
      listDeployment() {
        listDeployment(this.clusterName).then(data => {
          this.deployments = data.items
        })
      },
      listNodesUsage() {
        listNodesUsage(this.clusterName).then(data => {
          let metrics = data.items
          metrics.forEach(me => {
            const c = me.usage.cpu.replace("n", "")
            this.cpuUsage = this.cpuUsage + Number(c)
            const m = me.usage.memory.replace("Ki", "")
            this.memUsage = this.memUsage + Number(m)
          })
          this.cpuUsage = this.cpuUsage / (1000 * 1000 * 1000)
          this.memUsagePercent = Math.round((this.memUsage / this.memTotal) * 100)
          this.cpuUsagePercent = Math.round((this.cpuUsage / this.cpuTotal) * 100)
        })
      }
    },
    mounted() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
