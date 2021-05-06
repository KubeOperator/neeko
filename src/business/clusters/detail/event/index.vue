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
      <el-table-column :label="$t('cluster.detail.event.msg_info')" min-width="100" prop="message" fix />
      <el-table-column :label="$t('cluster.detail.event.msg_type')" min-width="100" prop="type" fix />
      <el-table-column :label="$t('cluster.detail.event.component')" min-width="100" prop="source.component" fix />
      <el-table-column label="Namespave" min-width="100" prop="metadata.namespace" fix />
      <el-table-column :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.firstTimestamp | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
    <k8s-page @pageChange="pageChange" :nextToken="page.nextToken" />
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
        nextToken: "",
      },
      clusterName: "",
      namespaces: [],
      currentNamespace: "",
      isNPDon: false,
      continueToken: "",
      data: [],
    }
  },
  methods: {
    search() {
      this.loading = true
      listNamespace(this.clusterName).then((data) => {
        this.namespaces = data.items
        if (data.items.length > 0) {
          this.currentNamespace = this.currentNamespace ? this.currentNamespace : this.namespaces[0].metadata.name
          this.loadEvents(this.currentNamespace)
        }
      })
      this.getNpdExists()
    },
    pageChange(continueToken) {
      this.page.continueToken = continueToken
      this.search()
    },
    loadEvents(namespace) {
      listEvents(this.clusterName, this.continueToken, namespace)
        .then((data) => {
          this.loading = false
          this.data = data.items
          this.page.nextToken = data.metadata["continue"] ? data.metadata["continue"] : ""
        })
        .finally(() => {
          this.loading = false
        })
    },
    getNpdExists() {
      listPod(this.clusterName).then((data) => {
        const pods = data.items
        for (const pod of pods) {
          if (pod.metadata.generateName === "node-problem-detector-") {
            this.isNPDon = true
            break
          }
        }
      })
    },
    changeNpd() {
      let op = this.isNPDon ? "create" : "delete"
      changeNpd(this.clusterName, op).then(
        () => {
          if (op === "delete") {
            this.isNPDon = false
            this.$message({ type: "success", message: this.$t("cluster.detail.event.enable_npd_success") })
          } else {
            this.isNPDon = true
            this.$message({ type: "success", message: this.$t("cluster.detail.event.disable_npd_success") })
          }
        },
        (error) => {
          this.isNPDon = op === "delete"
          this.$message({ type: "error", message: error })
        }
      )
    },
    changeNamespace() {
      this.loading = true
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
