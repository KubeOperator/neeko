<template>
  <div>
    <el-alert :title="$t('cluster.detail.component.operator_help')" type="info" />
    <complex-table style="margin-top: 20px" ref="nsData" :row-key="getRowKeys" :selects.sync="selects" :data="data">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="onSync()">{{$t('commons.button.sync')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" :reserve-selection="true" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" prop="name" fix />
      <el-table-column :label="$t('cluster.version')" prop="version" fix />
      <el-table-column :label="$t('commons.table.description')" prop="type" fix />
      <el-table-column :label="$t('commons.table.description')" min-width="300" prop="describe" fix />
      <el-table-column sortable :label="$t('commons.table.action')" prop="status.phase" fix>
        <template v-slot:default="{row}">
          <div v-if="row.status ==='enable'">
            <el-button size="mini" icon="el-icon-video-pause" @click="stopComponent(row, false)">{{ $t("commons.button.disable") }}</el-button>
          </div>
          <div v-if="row.status ==='disable'">
            <el-button size="mini" :disabled="row.disabled" icon="el-icon-video-play" @click="startComponent(row, false)">{{ $t("commons.button.enable") }}</el-button>
          </div>
          <div v-if="row.status === 'Waiting'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.waiting") }}</span>
          </div>
          <div v-if="row.status === 'Failed'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)">{{ $t("commons.status.failed") }}</el-link>
          </div>
          <div v-if="row.status ==='NotReady'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)">{{ $t("commons.status.not_ready") }}</el-link>
          </div>
          <div v-if="row.status ==='Initializing'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.initializing") }}</el-link>
          </div>
          <div v-if="row.status ==='Terminating'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.terminating") }}</el-link>
          </div>
          <div v-if="row.status ==='Synchronizing'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.synchronizing") }}</span>
          </div>
        </template>
      </el-table-column>
    </complex-table>

    <el-dialog title="Istio" width="50%" :visible.sync="dialogIstioVisible">
      <istio-component ref="istio_component"></istio-component>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogIstioVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button size="small" @click="submitIstio">{{ $t("commons.button.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.sync')" width="30%" :visible.sync="dialogSyncVisible">
      <span>{{ $t("cluster.detail.component.ensure_component_sync") }}</span>
      <ul style="margin-left: 5%;" :key="component.name" v-for="component of selects">
        <li>{{ component.name }} ({{ component.version }})</li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSyncVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submitSync()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.error_msg')" width="50%" :visible.sync="dialogVisible">
      <template slot="title">
        <div v-if="formatMsgs.failed">{{formatMsgs.name}}</div>
      </template>
      <div v-if="formatMsgs.type !== 'unFormat'">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-if="formatMsgs.info.msg" title="message" name="1">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{ formatMsgs.info.msg }}</span></div>
          </el-collapse-item>
          <el-collapse-item v-if="formatMsgs.info.stderr" title="stderr" name="2">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stderr }}</span></div>
          </el-collapse-item>
          <el-collapse-item v-if="formatMsgs.info.stdout" title="stdout" name="3">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stdout }}</span></div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else>
        <div><span style="font-weight: bold">info</span></div>
        <div><span style="white-space: pre-wrap;">{{formatMsgs.info | errorFormat }}</span></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button size="small" @click="startComponent(component, true)">{{ $t("commons.button.re_enable") }}</el-button>
        <el-button size="small" @click="stopComponent(component, true)">{{ $t("commons.button.disable") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { getComponents, createComponent, deleteComponent, syncComponents } from "@/api/cluster"
import { openLoggerWithName } from "@/api/cluster/tasks"
import IstioComponent from "./istio/index.vue"
import { ansibleErrFormat } from "@/utils/format_ansible_err"

export default {
  name: "ClusterNamespace",
  components: { ComplexTable, IstioComponent },
  data() {
    return {
      clusterName: "",
      data: [],
      selects: [],
      formatMsgs: {
        name: "",
        info: {},
        failed: false,
      },
      component: {
        name: "",
        clusterName: "",
        type: "",
        version: "",
        vars: {},
      },
      dialogVisible: false,
      dialogIstioVisible: false,
      dialogSyncVisible: false,
      activeNames: ["1", "2", "3"],
    }
  },
  methods: {
    getRowKeys(row) {
      return row.name
    },
    search() {
      getComponents(this.clusterName).then((data) => {
        this.data = data
      })
    },
    openXterm(row) {
      if (row.status === "Terminating") {
        openLoggerWithName(this.clusterName, row.id + " (disable)")
      }
      if (row.status === "Initializing") {
        openLoggerWithName(this.clusterName, row.id + " (enable)")
      }
    },
    onSync() {
      if (this.selects.length === 0) {
        this.$confirm(this.$t("commons.confirm_message.enable_component_select"), this.$t("commons.message_box.prompt"), {
          confirmButtonText: this.$t("commons.button.confirm"),
          cancelButtonText: this.$t("commons.button.cancel"),
          type: "warning",
        }).then(() => {
          this.selects = this.data
          this.submitSync()
        })
      } else {
        this.dialogSyncVisible = true
      }
    },
    submitSync() {
      let names = []
      for (const c of this.selects) {
        names.push(c.name)
      }
      let data = {
        clusterName: this.clusterName,
        names: names,
      }
      syncComponents(data).then(() => {
        this.search()
      })
    },
    submitIstio() {
      this.component.vars = this.component.vars === "" ? {} : this.component.vars
      this.$refs.istio_component.gatherVars(this.component.vars)
      let data = {
        clusterName: this.clusterName,
        name: this.component.name,
        type: this.component.type,
        version: this.component.version,
        vars: this.component.vars,
      }
      createComponent(data).then(() => {
        this.search()
      })
      this.dialogIstioVisible = false
    },
    startComponent(row, force) {
      this.component = row
      if (row.name === "istio") {
        this.dialogIstioVisible = true
        return
      }
      let data = {
        clusterName: this.clusterName,
        name: row.name,
        type: row.type,
        version: row.version,
      }
      if (force) {
        createComponent(data).then(() => {
          this.dialogVisible = false
          this.search()
        })
        return
      }
      this.$confirm(this.$t("commons.confirm_message.enable_component", [row.name]), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        createComponent(data).then(() => {
          this.search()
        })
      })
    },
    stopComponent(row, force) {
      if (force) {
        deleteComponent(this.clusterName, row.name).then(() => {
          this.dialogVisible = false
          this.search()
        })
        return
      }
      this.$confirm(this.$t("commons.confirm_message.disable_component", [row.name]), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        deleteComponent(this.clusterName, row.name).then(() => {
          this.search()
        })
      })
    },
    getStatus(row) {
      this.component = row
      this.formatMsgs = ansibleErrFormat(row.message)[0]
      this.dialogVisible = true
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Waiting", "Synchronizing"]
        for (const item of this.data) {
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
    this.clusterName = this.$route.params.name
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped>
</style>
