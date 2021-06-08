<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item>
        <el-select size="small" @change="changeNamespace()" allow-create filterable v-model="currentNamespace">
          <el-option v-for="item in namespaces" :key="item['metadata'].name" :label="item['metadata'].name" :value="item['metadata'].name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-switch v-model="isNPDon" @change="changeNpd()" :active-text="$t('cluster.detail.event.enable_npd')">
        </el-switch>
      </el-form-item>
    </el-form>

    <complex-table :data="data">
      <el-table-column :label="$t('cluster.detail.event.msg_info')" show-overflow-tooltip min-width="150" prop="message" fix />
      <el-table-column :label="$t('cluster.detail.event.msg_type')" min-width="80" prop="type" fix />
      <el-table-column :label="$t('cluster.detail.event.component')" min-width="80" prop="source.component" fix />
      <el-table-column label="Namespace" min-width="80" prop="metadata.namespace" fix />
      <el-table-column :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.firstTimestamp | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
    <k8s-page @pageChange="pageChange" :currentPage="page.currentPage" :nextToken="page.nextToken" />
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNamespace } from "@/api/cluster/namespace"
import { listPod } from "@/api/cluster/cluster"
import K8sPage from "@/components/k8s-page"
import { listEvents, changeNpd } from "@/api/cluster/event"

export default {
  name: "ClusterEvent",
  components: { ComplexTable, K8sPage },
  data() {
    return {
      loading: false,
      page: {
        continueToken: "",
        currentPage: 1,
        nextToken: "",
      },
      clusterName: "",
      namespaces: [],
      currentNamespace: "",
      isNPDon: false,
      data: [],
    }
  },
  methods: {
    search() {
      this.loading = true
      listNamespace(this.clusterName)
        .then((data) => {
          this.namespaces = data.items
          if (data.items.length > 0) {
            this.currentNamespace = this.currentNamespace ? this.currentNamespace : this.namespaces[0].metadata.name
            this.loadEvents(this.currentNamespace)
          }
        })
        .catch(() => {
          this.loading = false
        })
      this.getNpdExists()
    },
    pageChange(continueToken) {
      this.page.continueToken = continueToken.token
      this.page.currentPage = continueToken.page
      this.search()
    },
    loadEvents(namespace) {
      listEvents(this.clusterName, this.page.continueToken, namespace)
        .then((data) => {
          this.loading = false
          this.data = data.items
          this.page.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
        })
        .catch(() => {
          this.loading = false
        })
    },
    getNpdExists() {
      listPod(this.clusterName).then((data) => {
        const pods = data.items
        let isOn = false
        for (const pod of pods) {
          if (pod.metadata.generateName === "node-problem-detector-") {
            isOn = true
            if (pod.status.phase === "Terminating") {
              this.isNPDon = false
              isOn = false
              break
            }
          }
        }
        if (isOn) {
          this.isNPDon = true
        }
      })
    },
    changeNpd() {
      let op = this.isNPDon ? "create" : "delete"
      changeNpd(this.clusterName, op).then(() => {
        if (op !== "delete") {
          this.$message({ type: "success", message: this.$t("cluster.detail.event.enable_npd_success") })
        } else {
          this.$message({ type: "success", message: this.$t("cluster.detail.event.disable_npd_success") })
        }
        // this.search()
      })
    },
    changeNamespace() {
      this.loading = true
      this.page.currentPage = 1
      this.page.continueToken = ""
      this.loadEvents(this.currentNamespace)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
