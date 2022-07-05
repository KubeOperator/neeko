<template>
  <layout-content :header="$t('message.message_subscribe')">
    <el-tabs v-model="type" @tab-click="changeType">
      <el-tab-pane :label="$t('message.message_system')" name="SYSTEM"></el-tab-pane>
      <el-tab-pane :label="$t('message.message_cluster')" name="CLUSTER"></el-tab-pane>
    </el-tabs>
    <div v-if="type === 'CLUSTER'">
      {{ $t("cluster.project") }}:
      <el-select v-model="projectName" @change="changeProject(projectName)">
        <el-option v-for="item in projects" :key="item.id" :value="item.name" :label="item.name"></el-option>
      </el-select>
      {{ $t("cluster.cluster") }}:
      <el-select v-model="resourceName" @change="changeCluster(resourceName)">
        <el-option v-for="item in clusters" :key="item.id" :value="item.name" :label="item.name"></el-option>
      </el-select>
    </div>
    <complex-table :data="data" v-loading="loading" :pagination-config="paginationConfig" @search="search">
      <el-table-column :label="$t('commons.table.name')" show-overflow-tooltip fix prop="name" min-width="100">
        <template v-slot:default="{row}">
          <span>{{ $t("message.title." + row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.message_type')" prop="type" fix/>
      <el-table-column :label="$t('message.message_in_station')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.local" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.mail')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.email" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.work_wechat')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.workWeiXin" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.dingTalk')">
        <template v-slot:default="{row}">
          <el-switch v-model="row.subConfig.dingTalk" active-value="ENABLE" inactive-value="DISABLE"
                     @change="changeSubConfig(row)"></el-switch>
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {searchMsgSubscribe, updateMsgSubScribe} from "@/api/msg-subscribe"
import {getProjectsHasClusters} from "@/api/projects"

export default {
  name: "",
  components: { LayoutContent, ComplexTable },
  props: {},
  data () {
    return {
      loading: false,
      data: [],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      type: "SYSTEM",
      resourceName: "",
      projectName: "",
      projects: [],
      clusters: []
    }
  },
  methods: {
    search () {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchMsgSubscribe(currentPage, pageSize, this.type, this.resourceName, {}).then(res => {
        this.data = res.items
        this.paginationConfig.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
    changeType (tab) {
      this.type = tab.name
      this.data = []
      if (this.type === "SYSTEM") {
        this.search()
      } else {
        getProjectsHasClusters().then(res => {
          this.data = []
          this.projects = res
          if (this.projects.length > 0) {
            this.projectName = this.projects[0].name
            this.changeProject(this.projectName)
          }
        })
      }
    },
    changeProject (name) {
      this.clusters = []
      this.resourceName = ""
      this.data = []
      for (const project of this.projects) {
        if (project.name === name) {
          this.clusters = project.clusters
          if (this.clusters.length > 0) {
            this.resourceName = this.clusters[0].name
            this.search()
          }
        }
      }
    },
    changeCluster (name) {
      this.resourceName = name
      this.search()
    },
    changeSubConfig (row) {
      this.loading = true
      updateMsgSubScribe(row).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.update_success")
        })
        this.search()
      }).finally(() => {
        this.loading = false
      })
    },
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>
