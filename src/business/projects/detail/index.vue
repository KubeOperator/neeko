<template>
  <layout-content>
    <el-tabs :tab-position="'top'">
      <el-tab-pane label="成员管理">
        <project-member-management></project-member-management>
      </el-tab-pane>
      <el-tab-pane label="资源管理">
        <project-resource-management></project-resource-management>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import ProjectMemberManagement from "./ProjectMemberManagement";
  import ProjectResourceManagement from "./ProjectResourceManagement";


  export default {
    name: "ProjectDetail",
    components: {ProjectResourceManagement, ProjectMemberManagement, LayoutContent},
    data() {
      return {}
    },
  }
</script>

<style scoped>
</style>
