<template>
  <div>
    <div class="dialog" v-loading="detailLoading" :element-loading-text="$t('task.condition_loading')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 1)" :style="{height: dialogHeight}">
      <el-scrollbar style="height:90%">
        <span v-if="log.details&&log.details.length === 0">{{ log.message | errorFormat }}</span>
        <div>
          <el-steps :space="50" style="margin: 0 50px" direction="vertical" :active="activeName">
            <el-step v-for="detail in log.details" :key="detail.name" :title="$t('task.' +detail.task)">
              <i :class="loadStepIcon(detail.status)" slot="icon"></i>
              <el-collapse v-if="detail.status === 'False'" accordion slot="description" v-model="activeCollapse">
                <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in detail.formatMsgs" :key="index">
                  <template slot="title">
                    <div v-if="item.failed">{{item.name}}</div>
                    <div v-if="!item.failed">{{item.name}}</div>
                  </template>
                  <div v-if="item.type !== 'unFormat'">
                    <div v-if="item.info.cmd">
                      <div><span style="font-weight: bold">cmd</span></div>
                      <div><span style="white-space: pre-wrap;">{{item.info.cmd }}</span></div>
                    </div>

                    <div v-if="item.info.msg">
                      <div><span style="font-weight: bold">message</span></div>
                      <div><span style="white-space: pre-wrap;">{{item.info.msg }}</span></div>
                    </div>

                    <div v-if="item.info.stderr">
                      <div style="margin-top: 2px"><span style="font-weight: bold">stderr</span></div>
                      <div><span style="white-space: pre-wrap;">{{item.info.stderr }}</span></div>
                    </div>

                    <div v-if="item.info.stdout">
                      <div style="margin-top: 2px"><span style="font-weight: bold">stdout</span></div>
                      <div><span style="white-space: pre-wrap;">{{item.info.stdout }}</span></div>
                    </div>
                  </div>
                  <div v-else>
                    <div><span style="font-weight: bold">info</span></div>
                    <div><span style="white-space: pre-wrap;">{{item.info | errorFormat }}</span></div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-step>
          </el-steps>
        </div>
      </el-scrollbar>
      <div style="float:right" v-if="!detailLoading">
        <el-button size="small" v-if="log.phase === 'FAILED'" @click="onRetry()">{{ $t("commons.button.retry") }}</el-button>
        <el-button size="small" v-if="log.phase !== 'NotReady'" @click="goForLogs()">{{ $t("commons.button.log") }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getNodeByName } from "@/api/cluster/node"
import { getClusterStatus } from "@/api/cluster"
import { openLoggerWithName } from "@/api/cluster/tasks"

export default {
  name: "KoLogs",
  props: {
    operation: String, // create-cluster || add-worker || terminal-node || terminal-cluster || not-ready
    clusterName: String,
    nodeName: String,
    errMsg: String,
  },
  data() {
    return {
      timer: null,
      timer2: null,
      detailLoading: true,
      clusterId: "",
      log: {
        type: "",
        phase: "",
        message: "",
        details: [],
      },
      activeName: 1,
      activeCollapse: 0,
      dialogHeight: "200px",
    }
  },
  methods: {
    loadStepIcon(status) {
      switch (status) {
        case "SUCCESS":
          return "el-icon-check"
        case "FAILED":
          return "el-icon-close"
        case "RUNNING":
          return "el-icon-loading"
      }
    },
    goForLogs() {
      openLoggerWithName(this.clusterName, this.log.id)
    },
    onRetry() {
      if (this.log.details.length !== 0) {
        this.log.details[this.log.details.length - 1].status = "Unknown"
      } else {
        this.detailLoading = true
      }
      this.log.phase = "Waiting"
      switch (this.log.type) {
        case "CLUSTER_NODE_EXTEND":
          this.$emit("retry", this.log.type, this.log.id)
          break
        case "CLUSTER_NODE_SHRINK":
          this.$emit("retry", this.log.type)
          break
        case "CLUSTER_CREATE":
          this.$emit("retry", this.log.type)
          break
        case "CLUSTER_UPGRADE":
          this.$emit("retry", this.log.type)
          break
      }
    },
    getStatus() {
      this.dialogHeight = "330px"
      switch (this.operation) {
        case "waiting-poll":
          getClusterStatus(this.clusterName).then((data) => {
            if (data.tasklogs.details.length !== 0) {
              this.detailLoading = false
            }
            this.handleResponse(data.tasklogs)
            this.dialogPolling()
          })
          break
        case "not-ready": {
          this.dialogHeight = "200px"
          this.detailLoading = false
          this.log = {
            phase: "NotReady",
            message: this.errMsg,
            details: [{ task: "CheckAPIStatus", formatMsgs: [{ name: this.clusterName, info: this.errMsg, type: "unFormat", failed: true }], status: "False", message: this.errMsg }],
          }
          break
        }
      }
    },
    // 缩容
    dialogPolling2() {
      this.timer2 = setInterval(() => {
        if (this.log.details.length !== 0 || this.log.phase === "Failed") {
          this.detailLoading = false
        }
        if (this.log.phase === "Terminating") {
          getNodeByName(this.clusterName, this.nodeName)
            .then((data) => {
              this.log = data
              if (this.log.phase !== data.status) {
                this.log.phase = data.status
              }
              if (data.status === "Failed") {
                this.dialogHeight = "330px"
                this.log.message = data.message
              }
            })
            .catch(() => {
              clearInterval(this.timer2)
              this.timer2 = null
              this.$emit("cancle")
            })
        }
      }, 5000)
    },
    // 拉取clusterStatus
    dialogPolling() {
      this.timer = setInterval(() => {
        if (this.log.details.length !== 0 || this.log.phase === "FAILED") {
          this.detailLoading = false
        }
        if ((this.log.phase !== "FAILED" && this.log.phase !== "SUCCESS")) {
          getClusterStatus(this.clusterName)
            .then((data) => {
              this.handleResponse(data.tasklogs)
            })
            .catch(() => {
              clearInterval(this.timer)
              this.timer = null
              this.$emit("cancle")
            })
        } else {
          this.activeName = this.log.details.length + 1
        }
      }, 5000)
    },
    handleResponse(data) {
      this.log = data
      this.activeName = data.details.length + 1
      if (this.log.phase !== data.phase) {
        this.log.phase = data.phase
      }
      for (const detail of this.log.details) {
        detail.formatMsgs = []
        if (detail.status === "False") {
          detail.formatMsgs = this.handleErrMsg(detail.message)
        }
      }
    },
    // 错误处理
    handleErrMsg(str) {
      let formatMsgs = []
      if (!this.isJson(str)) {
        return [{ name: "Error Message", info: str, failed: false, type: "unFormat" }]
      }
      var json1 = JSON.parse(str)
      for (const key in json1) {
        var itemMsg = { name: "", info: {}, failed: false }
        itemMsg.name = key
        if (this.isJson(json1[key])) {
          var json2 = JSON.parse(json1[key])
          itemMsg.info = json2
          if (itemMsg.info.msg) {
            itemMsg.info.msg = itemMsg.info.msg.replace(/\t/g, "").trim()
          }
          if (itemMsg.info.stdout) {
            itemMsg.info.stdout = itemMsg.info.stdout.replace(/\t/g, "").trim()
          }
          if (itemMsg.info.stderr) {
            itemMsg.info.stderr = itemMsg.info.stderr.replace(/\t/g, "").trim()
          }
          if (itemMsg.info.unreachable) {
            itemMsg.failed = true
          } else {
            itemMsg.failed = json2.failed
          }
        } else {
          itemMsg.type = "unFormat"
          itemMsg.info = json1[key]
        }
        if (itemMsg.info.length !== 0) {
          formatMsgs.push(itemMsg)
        }
      }
      return formatMsgs
    },
    isJson(str) {
      try {
        if (typeof JSON.parse(str) === "object") {
          return true
        }
      } catch {
        return false
      }
    },
  },
  created() {
    this.getStatus()
  },
  destroyed() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
    this.timer = null
    this.timer2 = null
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  ::v-deep .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
  }
}
</style>
