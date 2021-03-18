<template>
  <layout-content>
    <el-tabs :tab-position="'top'">
      <el-tab-pane label="概览">概览</el-tab-pane>
      <el-tab-pane label="成员管理">成员管理</el-tab-pane>
      <el-tab-pane label="资源管理">资源管理</el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import {createProject} from "@/api/projects"


  export default {
    name: "ProjectDetail",
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: '',
          description: '',
        }
      }
    },
    methods: {
      onSubmit() {
        createProject(this.form).then(() => {
          this.$message({
            type: 'success',
            message: `创建成功`
          });
          this.$router.push({name: "ProjectList"})
        })
      },
      onCancel() {
        this.$router.push({name: "ProjectList"})
      }
    },

  }
</script>

<style scoped>
</style>
