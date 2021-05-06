<template>
  <layout-content :header="$t('cluster.cluster_detail')" :back-to="{ name: 'ClusterList' }">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/overview'">{{$t('cluster.detail.tag.overview')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/node'">{{$t('cluster.detail.tag.node')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/namespace'">{{$t('cluster.detail.tag.namespace')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/storage'">{{$t('cluster.detail.tag.storage')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/event'">{{$t('cluster.detail.tag.event')}}</el-menu-item>
      <el-menu-item v-if="isPrometheusOn" :index="'/clusters/detail/'+project+'/'+name+'/monitor'">
        {{$t('cluster.detail.tag.monitor')}}
      </el-menu-item>
      <el-menu-item v-if="isLoggingOn" :index="'/clusters/detail/'+project+'/'+name+'/logging'">{{$t('cluster.detail.tag.log')}}
      </el-menu-item>
      <el-menu-item v-if="isLokiOn" :index="'/clusters/detail/'+project+'/'+name+'/loki'">{{$t('cluster.detail.tag.log')}}
      </el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/tool'">{{$t('cluster.detail.tag.tool')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/istio'">ISTIO</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/backup'">{{$t('cluster.detail.tag.backup')}}</el-menu-item>
      <el-menu-item v-if="hasLicense" :index="'/clusters/detail/'+project+'/'+name+'/f5'">F5</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/security'">
        {{$t('cluster.detail.tag.security')}}
      </el-menu-item>
      <el-menu-item v-if="hasLicense" :index="'/clusters/detail/'+project+'/'+name+'/grade'">{{$t('cluster.detail.tag.grade')}}
      </el-menu-item>
    </el-menu>
    <br />
    <router-view></router-view>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listTool } from "@/api/cluster/tool"

export default {
  name: "ClusterDetail",
  props: ["project", "name"],
  components: { LayoutContent },
  data() {
    return {
      isLokiOn: false,
      isLoggingOn: false,
      isPrometheusOn: false,
      hasLicense: false,
    }
  },
  methods: {
    search() {
      listTool(this.$route.params.name).then((data) => {
        data.forEach((item) => {
          if (item.name === "logging") {
            this.isLoggingOn = item.status === "Running"
          }
          if (item.name === "loki") {
            this.isLokiOn = item.status === "Running"
          }
          if (item.name === "prometheus") {
            this.isPrometheusOn = item.status === "Running"
          }
        })
      })
    },
  },
  mounted() {
    this.$store.dispatch("license/getLicense").then((data) => {
      this.hasLicense = data.status === "valid"
    })
  },
}
</script>

<style scoped>
</style>
