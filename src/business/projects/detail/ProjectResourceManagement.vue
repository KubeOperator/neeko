<template>
  <el-row :gutter="12">
    <el-col :span="8">
      <el-card shadow="hover">
        总是显示
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="hover">
        鼠标悬浮时显示
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="hover">
        从不显示
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "ProjectResourceManagement"
  }
</script>

<style scoped>

</style>
