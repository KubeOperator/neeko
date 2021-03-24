<template>
  <div>
    <el-row>
      <div v-for="tool in tools" :key="tool.name">
        <el-col :span="6">
          <el-card style="margin-left:10px; margin-top:10px; height: 180px" class="box-card">
            <el-row>
              <el-col :span="6">
                <img style="width: 60px; height: 60px" :src="require('@/assets/images/tools/'+ tool.logo)">
              </el-col>
              <el-col :span="18">
                <span>{{tool.name}}</span>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-button type="primary" size="small" style="float:right; margin: 5px">启 用</el-button>
            <el-button type="danger" size="small" style="float:right; margin: 5px">停 用</el-button>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  import { listTools } from "@/api/cluster"

  export default {
    name: "Tool",
    data() {
      return {
        clusterName: "",
        tools: [],
      }
    },
    methods: {
      search() {
        this.clusterName = this.$route.params.name
        listTools(this.clusterName).then(data => {
          this.tools = data
        })
      }
    },
    created() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
