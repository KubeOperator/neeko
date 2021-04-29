<template>
  <layout-content>
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/clusters/detail/'+name+'/overview'">{{$t('cluster.detail.tag.overview')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/node'">{{$t('cluster.detail.tag.node')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/namespace'">{{$t('cluster.detail.tag.namespace')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/storage'">{{$t('cluster.detail.tag.storage')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/event'">{{$t('cluster.detail.tag.event')}}</el-menu-item>
      <el-menu-item v-if="isPrometheusOn" :index="'/clusters/detail/'+name+'/monitor'">
        {{$t('cluster.detail.tag.monitor')}}
      </el-menu-item>
      <el-menu-item v-if="isLoggingOn" :index="'/clusters/detail/'+name+'/logging'">{{$t('cluster.detail.tag.log')}}
      </el-menu-item>
      <el-menu-item v-if="isLokiOn" :index="'/clusters/detail/'+name+'/loki'">{{$t('cluster.detail.tag.log')}}
      </el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/tool'">{{$t('cluster.detail.tag.tool')}}</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/istio'">istio</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/backup'">{{$t('cluster.detail.tag.backup')}}</el-menu-item>
      <el-menu-item v-if="hasLicense" :index="'/clusters/detail/'+name+'/f5'">f5</el-menu-item>
      <el-menu-item :index="'/clusters/detail/'+name+'/security'">
        {{$t('cluster.detail.tag.security')}}
      </el-menu-item>
      <el-menu-item v-if="hasLicense" :index="'/clusters/detail/'+name+'/grade'">{{$t('cluster.detail.tag.grade')}}
      </el-menu-item>
    </el-menu>
    <br/>
    <router-view></router-view>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent"
  import {listTool} from "@/api/cluster/tool"

  export default {
    name: "ClusterDetail",
    props: ["name"],
    components: {LayoutContent},
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
              this.isLoggingOn = (item.status === "Running")
            }
            if (item.name === "loki") {
              this.isLokiOn = (item.status === "Running")
            }
            if (item.name === "prometheus") {
              this.isPrometheusOn = (item.status === "Running")
            }
          })
        })
      },
    },
    mounted() {
      this.$store.dispatch('license/getLicense').then(data => {
        this.hasLicense = data.status === 'valid'
      })
    },
  }
</script>

<style scoped>
</style>
