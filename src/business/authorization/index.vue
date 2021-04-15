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
          <span class="custom-tree-node"  slot-scope="{ node,data }">
              <i v-if="data.type ==='CLUSTER'" class="el-icon-c-scale-to-original"></i>
              <i v-if="data.type !=='CLUSTER'" class="el-icon-s-data"></i>
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
      expendKey: [0],
      currentKey: 0,
      loading: false,
      authObj: {
        type: "PROJECT_LIST",
        projectName: "",
        clusterName: "",
      }
    }
  },
  methods: {
    toPage (data) {
      this.setParam(data.type, data.label)
      this.type = data.type
      this.name = data.label
    },
    getTree () {
      this.loading = true
      getResourceTree().then(data => {
        this.loading = false
        this.resources[0].children = data
        if (this.expendName !== undefined && this.expendType !== undefined) {
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
        for (const resource of this.resources[0].children) {
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