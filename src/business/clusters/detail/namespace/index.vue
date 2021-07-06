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
          <div v-if="row.status.phase !=='Terminating'">
            <span></span>{{row.status.phase}}
          </div>
          <div v-if="row.status.phase === 'Terminating'">
            <i class="el-icon-loading" /> &nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.terminating") }} </span>
          </div>
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
      <el-form :model="form" ref="form" label-position='left' label-width="80px">
        <el-form-item :label="$t('commons.table.name')" prop="metadata.name" :rules="nameRules">
          <el-input style="width: 80%" v-model="form.metadata.name" clearable />
          <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{$t('commons.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="form.metadata.name.length === 0 || submitLoading" @click="submitCreate()">{{$t('commons.button.ok')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNamespace, createNamespace, deleteNamespace } from "@/api/cluster/namespace"
import { listTool } from "@/api/cluster/tool"
import Rule from "@/utils/rules"

export default {
  name: "ClusterNamespace",
  components: { ComplexTable },
  data() {
    return {
      loading: false,
      submitLoading: false,
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row)
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
      nameRules: [Rule.CommonNameRule],
      nsSelection: [],
      toolList: [],
      dialogCreateVisible: false,
      clusterName: "",
      selects: [],
      data: [],
      ps: [],
      timer: {},
    }
  },
  methods: {
    search() {
      this.loading = true
      listNamespace(this.clusterName)
        .then((data) => {
          this.data = data.items
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    create() {
      this.dialogCreateVisible = true
    },
    loadTools() {
      listTool(this.clusterName).then((tools) => {
        this.toolList = tools
      })
    },
    submitCreate() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          createNamespace(this.clusterName, this.form)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              this.dialogCreateVisible = false
              this.search()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
              this.dialogCreateVisible = false
            })
        } else {
          return false
        }
      })
    },
    isInSystemSpace(row) {
      const systemSpaces = ["default", "kube-public", "kube-operator", "kube-system", "istio-system", "kube-node-lease"]
      return systemSpaces.indexOf(row.metadata.name) === -1
    },
    checkIsEmptyNs(row) {
      if (row) {
        let exitStr = ""
        for (const tool of this.toolList) {
          if (tool.vars["namespace"] === row.metadata.name && tool.status !== "Waiting") {
            exitStr += tool.name + ","
          }
        }
        row.toolDetails = exitStr
      } else {
        for (const ns of this.nsSelection) {
          let exitStr = ""
          for (const tool of this.toolList) {
            if (tool.vars["namespace"] === ns.metadata.name && tool.status !== "Waiting") {
              exitStr += tool.name + ","
            }
          }
          ns.toolDetails = exitStr
        }
      }
    },
    onDelete(row) {
      this.checkIsEmptyNs(row)
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        this.ps = []
        if (row) {
          if (row.toolDetails) {
            this.$message({ type: "info", message: row.metadata.name + this.$t("cluster.detail.namespace.before_delete") + row.toolDetails })
          } else {
            this.ps.push(deleteNamespace(this.clusterName, row.metadata.name))
          }
        } else {
          for (const item of this.nsSelection) {
            if (item.toolDetails) {
              this.$message({ type: "info", message: item.metadata.name + this.$t("cluster.detail.namespace.before_delete") + item.toolDetails })
            } else {
              this.ps.push(deleteNamespace(this.clusterName, item.metadata.name))
            }
          }
        }
        if (this.ps.length !== 0) {
          Promise.all(this.ps)
            .then(() => {
              this.search()
              this.$message({
                type: "success",
                message: this.$t("commons.msg.op_success"),
              })
            })
            .catch(() => {
              this.search()
            })
        }
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Terminating"]
        for (const item of this.data) {
          if (needPolling.indexOf(item.status.phase) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          listNamespace(this.clusterName).then((data) => {
            this.data = data.items
          })
        }
      }, 10000)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
    this.loadTools()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
</style>
