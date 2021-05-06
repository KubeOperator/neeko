<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
        <i class="iconfont iconbangzhu2" style="color: #FA5D50;margin-right: 3px" ></i>
        <span>{{ $t('commons.help.help') }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="docs">{{ $t('commons.help.ko_docs') }}</el-dropdown-item>
      <el-dropdown-item command="support">{{ $t('commons.help.business_support') }}</el-dropdown-item>
      <el-dropdown-item command="toAPIDocs">{{ $t('commons.help.api_docs') }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Help",
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'support':
          window.open("https://kubeoperator.io/", "_blank");
          break
        case 'docs':
          window.open("https://kubeoperator.io/docs/", "_blank");
          break
        default:
          window.open("/swagger/index.html", "_blank");
          break
      }
    }
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
}
</style>
