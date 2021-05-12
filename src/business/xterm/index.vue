<template>
  <div>
    <div style="position: absolute;right: 10px;z-index: 200">
      <el-button size="large" v-if="isRun" icon="el-icon-video-pause" @click="changeMode()" style="float: right;"></el-button>
      <el-button size="large" v-if="!isRun" icon="el-icon-video-play" @click="changeMode()" style="float: right;"></el-button>
    </div>
    <div>
      <div id="terminal-container"></div>
    </div>
  </div>
</template>

<script>
import "xterm/css/xterm.css"
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
          if (logId !== undefined) {
            getProvisionerLog(clusterName, logId)
              .then((data) => {
                this.term.clear()
                const text = data.msg.replace(/\n/g, "\r\n")
                this.term.write(text)
                setTimeout(() => {
                  this.term.scrollToBottom()
                }, 100)
              })
              .catch((error) => {
                if (error.toString() === "Error: Request failed with status code 400") {
                  this.isRun = false
                } else {
                  this.term.write("no log to show" + error)
                }
              })
          } else {
            getClusterLog(clusterName)
              .then((data) => {
                this.term.clear()
                const text = data.msg.replace(/\n/g, "\r\n")
                this.term.write(text)
                setTimeout(() => {
                  this.term.scrollToBottom()
                }, 100)
              })
              .catch((error) => {
                if (error.toString() === "Error: Request failed with status code 400") {
                  this.isRun = false
                } else {
                  this.term.write("no log to show" + error)
                }
              })
          }
        }
      }, 5000)
    },
    changeMode() {
      this.isRun = !this.isRun
    },
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    this.init()
  },
}
</script>