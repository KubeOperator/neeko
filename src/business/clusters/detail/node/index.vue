<template>
  <div>
    <complex-table :selects.sync="selects" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="selects.length < 1" @click="remove()">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix />
      <el-table-column label="IP" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getInternalIp(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getVersion(row)}}</template>
      </el-table-column>
      <el-table-column label="Roles" min-width="100" prop="ip" fix>
        <template v-slot:default="{row}">{{getNodeRoles(row)}}</template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix />
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" width="30%" :visible.sync="dialogCreateVisible">
      <el-form v-if="spec === 'plan'" label-width="80px">
        <el-form-item :label="$t('cluster.detail.node.increment')">
          <el-input style="width: 80%" v-model="form.increase" type="number" min="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" @click="submitCreate()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNodesByPage, nodeCreate } from "@/api/cluster/node"

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
      dialogCreateVisible: false,
      clusterName: "",
      selects: [],
      data: [],
      form: {
        hosts: [],
        nodes: [],
        increase: 1,
        operation: "",
      },
      spec: "plan"
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
    create() {
      this.dialogCreateVisible = true
    },
    submitCreate() {
      nodeCreate(this.currentCluster.name, this.item).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
        this.dialogCreateVisible = false
        this.search()
      }, error => {
        this.$message({ type: "error", message: error })
        this.dialogCreateVisible = false
      })
    },
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
