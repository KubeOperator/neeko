<template>
  <div>
    <el-alert  v-if="alertShow === 'true'">
      <el-button type="text" icon="el-icon-setting" @click="toTools">{{ $t("cluster.detail.log.log_help") }}</el-button>
    </el-alert>
    <div v-if="hasLogging === 'true'">
        <logging :indexPrefix="indexPrefix" />
    </div>
    <div v-if="hasLoki === 'true'">
        <loki />
    </div>
  </div>
</template>

<script>
import { listTool } from "@/api/cluster/tool"
import Loki from "@/business/clusters/detail/log/loki"
import Logging from "@/business/clusters/detail/log/logging"

export default {
  name: "ClusterLogs",
  components: {Loki, Logging},
  data() {
    return {
      loading: false,
      hasLogging: null,
      hasLoki: null,
      alertShow: null,
      indexPrefix: "",
    }
  },
  methods: {
    toTools() {
      this.$router.push({name: "ClusterTool"})
    },
  },
  mounted() {
    this.clusterName = this.$route.params.name
    listTool(this.clusterName).then((data) => {
      this.hasLogging = 'false'
      this.hasLoki = 'false'
      let hasOne = false
      for (const tool of data) {
        if (tool.name === "logging" && tool.status === "Running") {
          this.hasLogging = 'true'
          this.indexPrefix = tool.vars["fluentd-elasticsearch.elasticsearch.logstashPrefix"] + "-"
          hasOne = true
          break
        }
        if (tool.name === "loki" && tool.status === "Running") {
          this.hasLoki = 'true'
          hasOne = true
          break
        }
      }
      this.alertShow = hasOne ? "false" : "true"
    })
  },
}
</script>

<style scoped>
</style>