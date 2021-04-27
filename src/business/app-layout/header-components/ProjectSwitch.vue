<template>
  <el-menu :unique-opened="true"
           class="header-menu"
           text-color="inherit"
           mode="horizontal">
    <el-submenu index="1" popper-class="header-menu-popper">
      <template slot="title">
        <icon  class="iconfont iconproject ko-color"/>&nbsp;&nbsp;
        <span >{{currentProject}}</span>
      </template>
      <el-menu-item v-for="p in projects" :key="p.name" @click="setCurrentProject(p.name)">
        <span>{{ p.name }}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

import {listProjects} from '@/api/projects'


<script>
  import {allProjects} from "../../../api/projects";

  export default {
    name: "ProjectSwitch",
    data() {
      return {
        projects: []
      }
    }, created() {
      allProjects().then((data) => {
        this.projects = data.items
      })
    }, methods: {
      setCurrentProject(project) {
        this.$store.dispatch('user/setCurrentProject', project).then(() => {
          location.reload();
        })
      }
    }, computed: {
      currentProject() {
        return this.$store.getters.currentProject;
      }
    }
  }
</script>

<style scoped>

</style>
