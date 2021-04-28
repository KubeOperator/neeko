<template>
  <div>
    <complex-table :selects.sync="nsSelection" v-loading="loading" :data="data">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="nsSelection.length < 1" @click="onDelete()">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" :selectable="isInSystemSpace" fix></el-table-column>
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

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
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
      loading: false,
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.onDelete(row.name)
          },
          disabled: (row) => {
            return !this.isInSystemSpace(row)
          },
        },
      ],
      form: {
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: "",
        },
      },
      nsSelection: [],
      namespace: "",
      dialogCreateVisible: false,
      clusterName: "",
      selects: [],
      data: [],
      ps: [],
    }
  },
  methods: {
    search() {
      this.loading = true
      this.clusterName = this.$route.params.name
      listNamespace(this.clusterName)
        .then((data) => {
          this.loading = false
          this.data = data.items
        })
        .finally(() => {
          this.loading = false
        })
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
      const systemSpaces = ["default", "kube-public", "kube-operator", "kube-system", "istio-system", "kube-node-lease"]
      return systemSpaces.indexOf(row.metadata.name) === -1
    },
    onDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        this.ps = []
        if (row) {
          listTool(this.clusterName).then((tools) => {
            this.checkNsToolExist(row.metadata.name, tools)
          })
        } else {
          listTool(this.clusterName).then((tools) => {
            for (const item of this.nsSelection) {
              this.checkNsToolExist(item.metadata.name, tools)
            }
          })
        }
        if (this.ps.length !== 0) {
          Promise.all(this.ps)
            .then(() => {
              this.search()
              this.$message({
                type: "success",
                message: this.$t("commons.msg.delete_success"),
              })
            })
            .catch(() => {
              this.search()
            })
        }
      })
    },
    checkNsToolExist(ns, tools) {
      let exitStr = ""
      for (const tool of tools) {
        if (tool.vars["namespace"] === ns && tool.status !== "Waiting") {
          exitStr += tool.name + ","
        }
      }
      if (exitStr !== "") {
        exitStr = exitStr.substring(0, exitStr.length - 1)
        this.$message({ type: "info", message: ns + this.$t("cluster.detail.namespace.before_delete") + exitStr })
      } else {
        this.ps.push(deleteNamespace(this.clusterName, ns))
      }
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
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
</style>
