<template>
  <div>
    <complex-table @selection-change="handleSelectionChange" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="metadata.name" fix />
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status.phase" fix>
        <template v-slot:default="{row}">
          <span style="margin: 12px">{{row.status.phase}}
            <i v-if="row.status.phase === 'Terminating'" class="el-icon-loading" />
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.metadata.creationTimestamp | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('commons.table.action')">
        <template v-slot:default="{row}">
          <el-button :disabled="isInSystemSpace(row)" @click="goDelete(row)" type="danger" circle icon="el-icon-delete" size="small" />
        </template>
      </el-table-column>
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" width="30%" :close-on-click-modal="false" :visible.sync="dialogCreateVisible">
      <el-form label-width="80px">
        <el-form-item :label="$t('commons.table.name')">
          <el-input style="width: 80%" v-model="namespace" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button :disabled="namespace.length === 0" type="primary" @click="submitCreate()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNamespace, createNamespace, deleteNamespace } from "@/api/cluster/namespace"
import { listTool } from "@/api/cluster/tool"

export default {
  name: "ClusterNamespace",
  components: { ComplexTable },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      form: {
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: "",
        },
      },
      namespace: "",
      dialogCreateVisible: false,
      clusterName: "",
      clusterSelection: [],
      data: [],
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      listNamespace(this.clusterName).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    handleSelectionChange(val) {
      this.clusterSelection = val
    },
    create() {
      this.dialogCreateVisible = true
    },
    submitCreate() {
      this.form.metadata.name = this.namespace
      createNamespace(this.clusterName, this.form).then(
        () => {
          this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
          this.dialogCreateVisible = false
          this.search()
        },
        (error) => {
          this.$message({ type: "error", message: error })
          this.dialogCreateVisible = false
        }
      )
    },
    isInSystemSpace(row) {
      const systemSpaces = ["default", "kube-public", 'kube-operator', "kube-system", "istio-system", "kube-node-lease"]
      return systemSpaces.indexOf(row.metadata.name) !== -1
    },
    goDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        let exitStr = ""
        const namespaceItem = row.metadata.name
        listTool(this.clusterName).then((data) => {
          if (data) {
            for (const tool of data) {
              if (tool.vars["namespace"] === namespaceItem && tool.status !== "Waiting") {
                exitStr += tool.name + ","
              }
            }
            if (exitStr === "") {
              deleteNamespace(this.clusterName, namespaceItem).then(() => {
                  this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
                },(error) => {
                  this.$message({ type: "error", message: error })
                }
              )
            } else {
              exitStr = exitStr.substring(0, exitStr.length - 1)
              this.$message({ type: "info", message: this.$t("cluster.detail.namespace.before_delete") + exitStr })
            }
          }
        })
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Terminating"]
        for (const item of this.provisionerDatas) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          this.search()
        }
      }, 10000)
    },
  },
  created() {
    this.search()
    this.polling()
  },
}
</script>

<style scoped>
</style>
