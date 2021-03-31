<template>

  <layout-content :header="$t('project.project')" :description="$t('')">
    <el-row>
      <el-col :span="6" v-loading="loadingProject">
        <el-tree
                class="filter-tree"
                :data="resources"
                :props="props"
                default-expand-all
                ref="tree"
                @node-click="toPage">
        </el-tree>
      </el-col>
      <el-col :span="18" v-loading="loadingResource">
        <management :name="name" :type="type" v-if="type!=='PROJECT_LIST'"></management>
        <project-list v-if="type==='PROJECT_LIST'"></project-list>
      </el-col>
    </el-row>
  </layout-content>

</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {getResourceTree} from "@/api/authorization"
import Management from "@/business/authorization/management"
import ProjectList from "@/business/authorization/projects"


export default {
  name: "ProjectAuthorizationList",
  components: { ProjectList, Management, LayoutContent },
  data () {
    return {
      resources: [{
        id: 0,
        label: this.$t("route.project"),
        type: "PROJECT_LIST",
        children: []
      }],
      props: {
        children: "children",
        label: "label"
      },
      loadingProject: false,
      loadingResource: false,
      type: "PROJECT",
      name: "",
    }
  },
  methods: {
    toPage (data) {
      this.type = data.type
      this.name = data.label
    },
    getTree () {
      this.loadingProject = true
      getResourceTree().then(data => {
        this.loadingProject = false
        this.resources[0].children = data
      })
    }
  },
  watch: {},
  created () {
    this.getTree()
  },
}
</script>

<style scoped>

</style>