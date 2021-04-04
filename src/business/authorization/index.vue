<template>

  <layout-content :header="$t('project.project')" :description="$t('')" v-loading="loading">
    <el-row>
      <el-col :span="6">
        <el-tree
                class="filter-tree"
                :data="resources"
                :props="props"
                node-key="id"
                :default-expanded-keys="expendKey"
                :current-node-key="currentKey"
                ref="tree"
                :highlight-current="true"
                @node-click="toPage">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <management :name="name" :type="type" v-if="type!=='PROJECT_LIST'"></management>
        <project-list @refresh="getTree" v-if="type==='PROJECT_LIST'"></project-list>
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
  props: ["expendType", "expendName"],
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
      type: "PROJECT_LIST",
      name: "",
      expendKey: [0],
      currentKey: 0,
      loading:false
    }
  },
  methods: {
    toPage (data) {
      this.type = data.type
      this.name = data.label
    },
    getTree () {
      this.loading = true
      getResourceTree().then(data => {
        this.loading = false
        this.resources[0].children = data
        this.expendKey = [7]
        if (this.expendName !== undefined && this.expendType !== undefined) {
          this.type = this.expendType
          this.name = this.expendName
          this.getExpendItem(data)
        }
      })
    },
    getExpendItem(data){
      for (const d of data) {
        if (d.type === this.expendType && d.label === this.expendName) {
          this.expendKey = [d.id]
          this.currentKey = d.id
          this.$nextTick(function(){
            this.$refs["tree"].setCurrentKey(this.currentKey);
          })
        }else {
          if (d.children !== null) {
            this.getExpendItem(d.children)
          }
        }
      }
    }
  },
  watch: {
  },
  created () {
    this.getTree()
  },
}
</script>

<style scoped>

</style>