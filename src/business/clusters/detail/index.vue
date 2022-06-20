<template>
  <layout-content :header="$t('cluster.cluster_detail') + '  -  ' + clusterName" :back-to="{ name: 'ClusterList' }">
    <div v-loading="loading">
      <el-menu @select="search" router :default-active="$route.path" mode="horizontal">
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/overview'">{{$t('cluster.detail.tag.overview')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/node'">{{$t('cluster.detail.tag.node')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/namespace'">{{$t('cluster.detail.tag.namespace')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/storage'">{{$t('cluster.detail.tag.storage')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/event'">{{$t('cluster.detail.tag.event')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/monitor'">{{$t('cluster.detail.tag.monitor')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/log'">{{$t('cluster.detail.tag.log')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/tool'">{{$t('cluster.detail.tag.tool')}}</el-menu-item>
        <el-menu-item v-if="arch === 'amd64'" :index="'/clusters/detail/'+project+'/'+name+'/istio'">Istio</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/backup'">{{$t('cluster.detail.tag.backup')}}</el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/security'">
          {{$t('cluster.detail.tag.security')}}
        </el-menu-item>
        <el-menu-item :index="'/clusters/detail/'+project+'/'+name+'/grade'">{{$t('cluster.detail.tag.grade')}}
        </el-menu-item>
      </el-menu>
      <br />
      <div>
        <router-view></router-view>
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getClusterByName } from "@/api/cluster"

export default {
  name: "ClusterDetail",
  props: ["project", "name"],
  components: { LayoutContent },
  data() {
    return {
      hasLicense: null,
      arch: null,
      loading: false,
      clusterName: "",
    }
  },
  methods: {
    search() {
      this.loading = true
      getClusterByName(this.$route.params.name)
        .then((data) => {
          if (data.spec.architectures) {
            this.arch = data.spec.architectures
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
  mounted() {
    this.$store.dispatch("license/getLicense").then((data) => {
      this.hasLicense = data.status === "valid"
    })
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
