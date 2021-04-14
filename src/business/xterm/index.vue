<template>
  <div>
    <div style="position: absolute;right: 10px;z-index: 100">
      <el-button v-if="isRun" icon="el-icon-video-play" @click="changeMode()" style="float: right;"></el-button>
      <el-button v-if="!isRun" icon="el-icon-video-pause" @click="changeMode()" style="float: right;"></el-button>
    </div>
    <div class="container">
      <div id="terminal-container"></div>
    </div>
  </div>
</template>

<script>
import { Terminal } from "xterm"
import { getProvisionerLog, getClusterLog } from "@/api/cluster"

export default {
  name: "xTerm",
  data() {
    return {
      term: Terminal,
      isRun: true,
    }
  },
  methods: {
    init() {
      let terminalContainer = document.getElementById("terminal-container")
      this.term = new Terminal({
        disableStdin: true,
        cursorStyle: "bar",
        cols: 100,
        rows: 58,
        letterSpacing: 1,
        fontSize: 12,
      })

      this.term.open(terminalContainer)
      this.term.write("connect to logger...")
      setTimeout(() => {
        this.term.clear()
      }, 3000)
      const clusterName = this.$route.query.clusterName
      const logId = this.$route.query.logId
      this.timer = setInterval(() => {
        if (this.isRun) {
          if (logId) {
            getProvisionerLog(clusterName, logId).then(
              (data) => {
                this.term.clear()
                const text = data.msg.replace(/\n/g, "\r\n")
                this.term.write(text)
                setTimeout(() => {
                  this.term.scrollToBottom()
                }, 100)
              },
              (error) => {
                this.term.write("no log to show" + error)
              }
            )
          } else {
            getClusterLog(clusterName).then(
              (data) => {
                this.term.clear()
                const text = data.msg.replace(/\n/g, "\r\n")
                this.term.write(text)
                setTimeout(() => {
                  this.term.scrollToBottom()
                }, 100)
              },
              (error) => {
                this.term.write("no log to show" + error)
              }
            )
          }
        }
      }, 5000)
    },
    changeMode() {
      this.isRun = !this.isRun
    },
    getQueryVariable(variable) {
      const query = window.location.search.substring(1)
      const vars = query.split("&")
      for (const v of vars) {
        const pair = v.split("=")
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return null
    },
  },
  mounted() {
    this.init()
  },
}
</script>