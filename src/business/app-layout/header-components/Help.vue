<template>
  <el-menu :unique-opened="true"
           default-active="language"
           class="header-menu"
           text-color="inherit"
           mode="horizontal"
           style="text-align: center">
    <el-submenu index="1" popper-class="header-menu-popper">
      <template slot="title">
        <i class="iconfont iconbangzhu" style="color: #FA5D50"></i>
        <span>{{ $t('commons.help.help') }}</span>
      </template>
      <el-menu-item @click="toKoDocs">
        <span>{{ $t('commons.help.ko_docs') }}</span>
      </el-menu-item>
      <el-menu-item @click="toSupport">
        <span>{{ $t('commons.help.business_support') }}</span>
      </el-menu-item>
      <el-menu-item @click="toAPIDocs">
        <span>{{ $t('commons.help.api_docs') }}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Help",
  methods: {
    toSupport() {
      window.open("https://kubeoperator.io/", "_blank");

    },
    toKoDocs() {
      window.open("https://kubeoperator.io/docs/", "_blank");
    },
    toAPIDocs() {
      window.open("/swagger/index.html", "_blank");
    },
  }
}
</script>

<style scoped>

</style>
