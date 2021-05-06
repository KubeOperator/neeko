<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
        <i class="iconfont iconproject" style="color: #FA5D50;margin-right: 3px" :icon="['fas', 'globe']"/>
        <span >{{currentProject}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item  v-for="p in projects" :key="p.name" :command="p.name">
        <span>{{ p.name }}</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>
<script>
  import {allProjects} from "@/api/projects";

  export default {
    name: "ProjectSwitch",
    data() {
      return {
        projects: []
      }
    },
    created() {
      allProjects().then((data) => {
        this.projects = data.items
      })
    },
    methods: {
      setCurrentProject(project) {
        this.$store.dispatch('user/setCurrentProject', project).then(() => {
          location.reload();
        })
      },
      handleCommand(command) {
        this.setCurrentProject(command)
      }
    },
    computed: {
      currentProject() {
        return this.$store.getters.currentProject;
      }
    }
  }
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
}
</style>
