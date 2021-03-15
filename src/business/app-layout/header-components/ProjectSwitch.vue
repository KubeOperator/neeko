<template>
  <el-menu :unique-opened="true"
           class="header-menu"
           text-color="inherit"
           mode="horizontal">
    <el-submenu index="1" popper-class="header-menu-popper">
      <template slot="title">
        <font-awesome-icon class="language-icon" :icon="['fas', 'globe']"/>
        <span>项目1</span>
      </template>
      <!--          <el-menu-item v-for="(value, key) in languageMap" :key="key" :index="key" @click="setLanguage(key)">-->
      <!--            <span>{{ value }}</span>-->
      <!--            <i class="el-icon-check" v-if="key === language"/>-->
      <!--          </el-menu-item>-->
      <el-menu-item>
        <span>项目1</span>
        <!--        <i class="el-icon-check" v-if="key === language"/>-->
      </el-menu-item>
      <el-menu-item>
        <span>项目2</span>
        <!--        <i class="el-icon-check" v-if="key === language"/>-->
      </el-menu-item>
      <el-menu-item>
        <span>项目3</span>
        <!--        <i class="el-icon-check" v-if="key === language"/>-->
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "ProjectSwitch"
  }
</script>

<style scoped>

</style>
