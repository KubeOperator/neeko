<template>
  <layout-content>
   <el-menu router :default-active="$route.path" mode="horizontal">
     <el-menu-item :index="'/clusters/detail/'+name+'/overview'">概览</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/node'">节点</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/namespace'">命名空间</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/storage'">存储</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/event'">事件</el-menu-item>
     <el-menu-item v-if="isPrometheusOn" :index="'/clusters/detail/'+name+'/monitor'">监控</el-menu-item>
     <el-menu-item v-if="isLoggingOn" :index="'/clusters/detail/'+name+'/logging'">日志</el-menu-item>
     <el-menu-item v-if="isLokiOn" :index="'/clusters/detail/'+name+'/loki'">日志</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/tool'">工具</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/istio'">istio</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/backup'">备份</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/f5'">f5</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/security'">csi扫描</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/grade'">集群评分</el-menu-item>
   </el-menu>
   <br/>
   <router-view></router-view>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent"
  import { listTool } from "@/api/cluster/tool"

  export default {
    name: "ClusterDetail",
    props: ['name'],
    components: {LayoutContent},
    data() {
      return {
        isLokiOn: false,
        isLoggingOn: false,
        isPrometheusOn: false,
      }
    },
    methods: {
      search() {
        listTool(this.$route.params.name).then(data => {
          data.forEach(item => {
            if (item.name === "logging") {
              this.isLoggingOn = (item.status === "Running")
            }
            if (item.name === "loki") {
              this.isLokiOn = (item.status === "Running")
            }
            if (item.name === "prometheus") {
              this.isPrometheusOn = (item.status === "Running")
            }
          })
        })
      }
    },
    mounted() {
      this.search()
    },
  }
</script>

<style scoped>
</style>
