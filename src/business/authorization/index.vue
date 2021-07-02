<template>
  <layout-content :header="$t('project.project')" :description="$t('project.header_description')" v-loading="loading">
    <el-row>
      <el-col :span="6">
        <el-tree
                class="filter-tree"
                :default-expand-all="true"
                :data="resources"
                :props="props"
                node-key="id"
                :default-expanded-keys="expendKey"
                :current-node-key="currentKey"
                ref="tree"
                :highlight-current="true"
                @node-click="toPage"
                style="margin: 5px">
          <span class="custom-tree-node" slot-scope="{ node,data }">
              <i v-if="data.type ==='CLUSTER'" class="iconfont iconcluster"></i>
              <i v-if="data.type ==='PROJECT'" class="iconfont iconproject"></i>
              <i v-if="data.type ==='PROJECT_LIST'" class="iconfont iconprojectmanage"></i>
            &nbsp;&nbsp;&nbsp;&nbsp;<span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <management :auth-obj.sync="authObj" v-if="authObj.type!=='PROJECT_LIST'"></management>
        <project-list @refresh="getTree" v-if="authObj.type==='PROJECT_LIST'"></project-list>
      </el-col>
    </el-row>
  </layout-content>

</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {getResourceTree} from "@/api/authorization"
import Management from "@/business/authorization/management"
import ProjectList from "@/business/authorization/projects"
import store from "@/store"

export default {
  name: "ProjectAuthorizationList",
  components: { ProjectList, Management, LayoutContent },
  props: ["expendType", "expendName"],
  data () {
    return {
      resources: [{
        id: 0,
        label: this.$t("project.list"),
        type: "PROJECT_LIST",
        children: []
      }],
      props: {
        children: "children",
        label: "label"
      },
      expendKey: [0],
      currentKey: 0,
      loading: false,
      authObj: {
        type: "PROJECT_LIST",
        projectName: "",
        clusterName: "",
      },
      permission: ""
    }
  },
  methods: {
    toPage (data) {
      this.setParam(data.type, data.label)
      this.type = data.type
      this.name = data.label
    },
    async getTree () {
      const { roles } = await store.dispatch("user/getCurrentUser")
      this.permission = roles[0]
      this.getResources()
    },
    getResources() {
      this.loading = true
      getResourceTree().then(data => {
        this.loading = false
        if (this.permission === "ADMIN") {
          this.resources[0].children = data
        } else {
          this.resources = data
          this.authObj.type = "PROJECT"
          this.expendType = "PROJECT"
          this.expendName = data[0].label
        }
        if (this.authObj.type !== "PROJECT_LIST" && this.expendName !== undefined && this.expendType !== undefined) {
          this.setParam(this.expendType, this.expendName)
          this.getExpendItem(data)
        }
      })
    },
    getExpendItem (data) {
      for (const d of data) {
        if (d.type === this.expendType && d.label === this.expendName) {
          this.expendKey = [d.id]
          this.currentKey = d.id
          this.$nextTick(function () {
            this.$refs["tree"].setCurrentKey(this.currentKey)
          })
        } else {
          if (d.children !== null) {
            this.getExpendItem(d.children)
          }
        }
      }
    },
    setParam (type, name) {
      if (type !== "CLUSTER") {
        this.authObj = {
          type: type,
          projectName: name
        }
      } else {
        let data = this.resources
        if (this.permission === "ADMIN") {
          data = this.resources[0].children
        }
        for (const resource of data) {
          const projectName = resource.label
          if (resource.children !== null) {
            for (const cluster of resource.children) {
              if (cluster.label === name) {
                this.authObj = {
                  type: type,
                  projectName: projectName,
                  clusterName: name
                }
              }
            }
          }
        }
      }
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