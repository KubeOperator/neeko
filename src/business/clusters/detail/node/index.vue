<template>
  <div>
    <complex-table @selection-change="handleSelectionChange" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" round @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="clusterSelection.length < 1" round @click="remove()">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
      <el-table-column label="IP" min-width="100" prop="ip" fix>
        <template slot-scope="scope">{{getInternalIp(scope.row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="ip" fix>
        <template slot-scope="scope">{{getVersion(scope.row)}}</template>
      </el-table-column>
      <el-table-column label="Roles" min-width="100" prop="ip" fix>
        <template slot-scope="scope">{{getNodeRoles(scope.row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix />
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNodesByPage } from "@/api/cluster/node"

export default {
  name: "ClusterNode",
  components: { ComplexTable },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      clusterName: "",
      clusterSelection: [],
      data: [],
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      const { currentPage, pageSize } = this.paginationConfig
      listNodesByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    handleSelectionChange(val) {
      this.clusterSelection = val
    },
    create() {},
    remove() {},
    getInternalIp(item) {
      return item.ip ? item.ip : "N/a"
    },
    getVersion(item) {
      let result = "N/A"
      if (item.status === "Running") {
        result = item.info.status.nodeInfo.kubeletVersion
      }
      return result
    },
    getNodeRoles(item) {
      let roles = []
      if (item.status === "Running") {
        for (const key in item.info.metadata.labels) {
          if (key) {
            switch (key) {
              case "node-role.kubernetes.io/master":
                roles.push("master")
                break
              case "node-role.kubernetes.io/etcd":
                roles.push("etcd")
                break
              case "node-role.kubernetes.io/worker":
                roles.push("worker")
                break
              case "node-role.kubernetes.io/control-plane":
                roles.push("control-plane")
                break
            }
          }
        }
      }
      return roles.join(",")
    },
  },
  created() {
    this.search()
  },
}
</script>

<style scoped>
</style>
