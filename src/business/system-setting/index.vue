<template>
  <layout-content :header="$t('route.system_setting')">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/setting/registry'">{{$t('setting.registry')}}</el-menu-item>
      <el-menu-item :index="'/setting/credential'">{{$t('setting.credential')}}</el-menu-item>
      <el-menu-item :index="'/setting/ntp'">{{$t('setting.ntp')}}</el-menu-item>
      <el-menu-item :index="'/setting/kubepi'">Dashboard</el-menu-item>
      <el-menu-item :index="'/setting/ldap'">LDAP</el-menu-item>
      <el-menu-item :index="'/setting/message'">{{$t('setting.message')}}</el-menu-item>
      <el-menu-item :index="'/setting/license'">{{$t('setting.license')}}</el-menu-item>
    </el-menu>
    <br/>
    <router-view></router-view>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent";
export default {
  name: "SystemSetting",
  components: {
    LayoutContent,
  },
  data() {
    return {
      hasLicense: false,
    }
  },
  methods: {},
  computed: {
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
