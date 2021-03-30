<template>
  <el-row>
    {{this.name}}
    {{this.type}}
  </el-row>
</template>

<script>
export default {
  name: "ResourceList",
  props: ["name", "type"],
}
</script>

<style scoped>

</style>