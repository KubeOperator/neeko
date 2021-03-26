<template>
  <layout-content :header="$t('route.system_setting')">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/setting/registry'">仓库</el-menu-item>
      <el-menu-item :index="'/setting/credential'">凭证</el-menu-item>
      <el-menu-item :index="'/setting/ntp'">NTP</el-menu-item>
      <el-menu-item :index="'/setting/email'">邮箱</el-menu-item>
      <el-menu-item :index="'/setting/ldap'">LDAP</el-menu-item>
      <el-menu-item :index="'/setting/license'">许可</el-menu-item>
      <el-menu-item :index="'/setting/theme'">主题</el-menu-item>
      <el-menu-item :index="'/setting/message'">消息</el-menu-item>
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
    return {}
  },
  methods: {},
  computed: {
  }
}
</script>

<style scoped>
</style>
