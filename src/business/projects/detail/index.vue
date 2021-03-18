<template>
  <layout-content>
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/projects/detail/'+name+'/members'">成员管理</el-menu-item>
      <el-menu-item :index="'/projects/detail/'+name+'/resources'">资源管理</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";


  export default {
    name: "ProjectDetail",
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
