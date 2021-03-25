<template>
  <layout-content>
   <el-menu router :default-active="$route.path" mode="horizontal">
     <el-menu-item :index="'/clusters/detail/'+name+'/overview'">概览</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/node'">节点</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/namespace'">命名空间</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/storage'">存储</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/event'">事件</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/monitor'">监控</el-menu-item>
     <el-menu-item :index="'/clusters/detail/'+name+'/log'">日志</el-menu-item>
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
  import LayoutContent from "@/components/layout/LayoutContent";


  export default {
    name: "ClusterDetail",
    props: ['name'],
    components: {LayoutContent},
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped>
</style>
