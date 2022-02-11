<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item :label="$t('cluster.detail.log.monitor_node')">
        <el-select size="small" @change="changeNode" filterable v-model="searchruleForm.nodeName">
          <el-option :label="$t('cluster.detail.monitor.all_node')" value="all"></el-option>
          <el-option v-for="node in nodes" :key="node" :label="node" :value="node"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('commons.search.time')">
        <el-date-picker @change="search()" v-model="timeRange" type="datetimerange" :range-separator="$t('commons.search.time_range')" :start-placeholder="$t('commons.search.time_start')" :end-placeholder="$t('commons.search.time_end')" :picker-options="pickerOptions" align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('cluster.detail.monitor.step')">
        <el-select size="small" @change="search()" filterable v-model="searchruleForm.step">
          <el-option v-for="(step, index) in stepOptions" :key="index" :label="step.label" :value="step.value"></el-option>
        </el-select>
      </el-form-item>
      <el-tooltip :content="$t('commons.button.refresh')" placement="top" effect="light">
        <el-button :disabled="hasPrometheus === 'false'" icon="el-icon-refresh" @click="search"></el-button>
      </el-tooltip>
      <el-tooltip v-if="keepPoll" :content="$t('commons.button.watch')" placement="top" effect="light">
        <el-button :disabled="hasPrometheus === 'false'" icon="el-icon-video-play" @click="keepPoll === true"></el-button>
      </el-tooltip>
      <el-tooltip v-else :content="$t('commons.button.pause')" placement="top" effect="light">
        <el-button :disabled="hasPrometheus === 'false'" icon="el-icon-video-pause" @click="keepPoll === false"></el-button>
      </el-tooltip>
    </el-form>
    <el-alert v-if="hasPrometheus === 'false'">
      <el-button type="text" icon="el-icon-setting" @click="toTools">{{ $t("cluster.detail.monitor.monitor_help") }}</el-button>
    </el-alert>
    <div v-if="hasPrometheus === 'true'">
      <el-row>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="cpuErr !== ''">{{cpuErr}}</span>
            <div v-else id="cpuChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="memoryErr !== ''">{{memoryErr}}</span>
            <div v-else id="memoryChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="loadErr !== ''">{{loadErr}}</span>
            <div v-else id="loadChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="diskErr !== ''">{{diskErr}}</span>
            <div v-else id="diskChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="inodeErr !== ''">{{inodeErr}}</span>
            <div v-else id="inodeChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="diskRWErr !== ''">{{diskRWErr}}</span>
            <div v-else id="diskRwChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="iopsErr !== ''">{{iopsErr}}</span>
            <div v-else id="diskIopsChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="overflow: inherit">
            <span v-if="netErr !== ''">{{netErr}}</span>
            <div v-else id="netChart" style="width: 100%;height: 250%;margin-top: 40px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { listNodeInDB } from "@/api/cluster/node"
import { listTool } from "@/api/cluster/tool"
let echarts = require("echarts/lib/echarts")
import { Monitor } from "@/api/cluster/monitor"

export default {
  name: "ClusterMonitor",
  components: {},
  data() {
    return {
      loading: false,
      hasPrometheus: null,
      searchruleForm: {
        level: "cluster",
        nodeName: "all",
        start: "",
        end: "",
        step: 2,
        metricsFilter: ["cpu_used", "memory_used", "load1", "load5", "load15", "disk_used", "disk_inode_utilisation", "disk_read_throughput", "disk_write_throughput", "disk_read_iops", "disk_write_iops", "net_bytes_transmitted", "net_bytes_received"],
      },
      timeRange: [],
      nodes: [],
      data: [],
      cpuErr: "",
      memoryErr: "",
      diskErr: "",
      loadErr: "",
      inodeErr: "",
      iopsErr: "",
      netErr: "",
      diskRWErr: "",
      keepPoll: true,
      stepOptions: [
        { label: "1 " + this.$t("cluster.detail.monitor.minute"), value: 1 },
        { label: "2 " + this.$t("cluster.detail.monitor.minutes"), value: 2 },
        { label: "5 " + this.$t("cluster.detail.monitor.minutes"), value: 5 },
        { label: "10 " + this.$t("cluster.detail.monitor.minutes"), value: 10 },
        { label: "15 " + this.$t("cluster.detail.monitor.minutes"), value: 15 },
        { label: "30 " + this.$t("cluster.detail.monitor.minutes"), value: 30 },
        { label: "1 " + this.$t("cluster.detail.monitor.hour"), value: 60 },
        { label: "2 " + this.$t("cluster.detail.monitor.hours"), value: 120 },
        { label: "5 " + this.$t("cluster.detail.monitor.hours"), value: 300 },
      ],
      color: ["#f75e4f", "#2d8771", "#6c357a"],
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("cluster.detail.monitor.last_x_minutes", [10]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 600 * 1000)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_minutes", [20]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 1200 * 1000)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_minutes", [30]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 1800 * 1000)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [1]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [2]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 2)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [3]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 3)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [5]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 5)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [12]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 12)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_days", [1]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_days", [2]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_hours", [3]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit("pick", [start, end])
            },
          },
          {
            text: this.$t("cluster.detail.monitor.last_x_days", [7]),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            },
          },
        ],
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  methods: {
    loadNodes() {
      listNodeInDB(this.clusterName).then((data) => {
        this.nodes = data.items.map(function (item) {
          return item.ip
        })
      })
    },
    changeNode(node) {
      if (node !== "all") {
        this.searchruleForm.level = "node"
      } else {
        this.searchruleForm.level = "cluster"
      }
      this.search()
    },
    toTools() {
      this.$router.push({name: "ClusterTool"})
    },
    search() {
      if (this.hasPrometheus === 'false') {
        return
      }
      if (this.timeRange.length === 2) {
        this.searchruleForm.start = parseInt(this.timeRange[0].getTime() / 1000)
        this.searchruleForm.end = parseInt(this.timeRange[1].getTime() / 1000)
      }
      Monitor(this.clusterName, this.searchruleForm).then((res) => {
        let chartDatas = []
        for (const d of res) {
          let chartName = this.loadChart(d)
          if (chartName === "") {
            continue
          }
          let isExist = false
          for (const chart of chartDatas) {
            if (chartName === chart.name) {
              isExist = true
              if (d.data.result.length !== 0) {
                let yDatas = d.data.result[0].values.map(function (item) {
                  return chartName === "diskIopsChart" ? Math.round(item[1]) : Number(item[1]).toFixed(2)
                })
                let info = this.loadInfo(d.metric_name)
                chart.legendDatas.push(info.tipTitle)
                chart.yDatas.push(this.addSeries(yDatas, info.tipTitle, this.color[chart.yDatas.length]))
              }
            }
          }
          if (!isExist) {
            if (d.data.result.length !== 0) {
              let xDatas = d.data.result[0].values.map(function (item) {
                const timeNow = new Date(item[0] * 1000)
                return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds()
              })
              let yDatas = d.data.result[0].values.map(function (item) {
                return chartName === "diskIopsChart" ? Math.round(item[1]) : Number(item[1]).toFixed(2)
              })
              let info = this.loadInfo(d.metric_name)
              let chartItem = {
                name: chartName,
                legendDatas: [],
                xDatas: xDatas,
                yDatas: [],
                yTitle: info.yTitle,
                formatStr: info.formatStr,
              }
              chartItem.legendDatas.push(info.tipTitle)
              chartItem.yDatas.push(this.addSeries(yDatas, info.tipTitle, this.color[0]))
              chartDatas.push(chartItem)
            }
          }
        }
        for (const chart of chartDatas) {
          if (chart.legendDatas.length !== 1) {
            this.initCharts(chart.name, chart.legendDatas, chart.xDatas, chart.yDatas, chart.yTitle, chart.formatStr)
          } else {
            this.initCharts(chart.name, [], chart.xDatas, chart.yDatas, chart.yTitle, chart.formatStr)
          }
        }
      })
    },

    loadChart(val) {
      switch (val.metric_name) {
        case "cpu_used":
          this.cpuErr = val.error || ""
          return val.error ? "" : "cpuChart"
        case "memory_used":
          this.memoryErr = val.error || ""
          return val.error ? "" : "memoryChart"
        case "load1":
        case "load5":
        case "load15":
          this.loadErr = val.error || ""
          return val.error ? "" : "loadChart"
        case "disk_used":
          this.diskErr = val.error || ""
          return val.error ? "" : "diskChart"
        case "disk_inode_total":
        case "disk_inode_usage":
        case "disk_inode_utilisation":
          this.inodeErr = val.error || ""
          return val.error ? "" : "inodeChart"
        case "disk_read_iops":
        case "disk_write_iops":
          this.iopsErr = val.error || ""
          return val.error ? "" : "diskIopsChart"
        case "disk_read_throughput":
        case "disk_write_throughput":
          this.diskRWErr = val.error || ""
          return val.error ? "" : "diskRwChart"
        case "net_bytes_transmitted":
        case "net_bytes_received":
          this.netErr = val.error || ""
          return val.error ? "" : "netChart"
      }
    },
    loadInfo(val) {
      switch (val) {
        case "cpu_used":
          return {
            yTitle: this.$t("cluster.detail.monitor.cpu_usage"),
            tipTitle: this.$t("cluster.detail.monitor.usage"),
            formatStr: "%",
          }
        case "memory_used":
          return {
            yTitle: this.$t("cluster.detail.monitor.memory_usage"),
            tipTitle: this.$t("cluster.detail.monitor.usage"),
            formatStr: "%",
          }
        case "load1":
          return {
            yTitle: this.$t("cluster.detail.monitor.cpu_avg_load"),
            tipTitle: "1 " + this.$t("cluster.detail.monitor.minute"),
            formatStr: "",
          }
        case "load5":
          return {
            yTitle: this.$t("cluster.detail.monitor.cpu_avg_load"),
            tipTitle: "5 " + this.$t("cluster.detail.monitor.minutes"),
            formatStr: "",
          }
        case "load15":
          return {
            yTitle: this.$t("cluster.detail.monitor.cpu_avg_load"),
            tipTitle: "15 " + this.$t("cluster.detail.monitor.minutes"),
            formatStr: "",
          }
        case "disk_used":
          return {
            yTitle: this.$t("cluster.detail.monitor.disk_usage"),
            tipTitle: this.$t("cluster.detail.monitor.usage"),
            formatStr: "Gi",
          }
        case "disk_inode_utilisation":
          return {
            yTitle: this.$t("cluster.detail.monitor.inode_usage"),
            tipTitle: this.$t("cluster.detail.monitor.usage"),
            formatStr: "%",
          }
        case "disk_read_throughput":
          return {
            yTitle: this.$t("cluster.detail.monitor.disk_transfer"),
            tipTitle: this.$t("cluster.detail.monitor.read"),
            formatStr: "Mb/s",
          }
        case "disk_write_throughput":
          return {
            yTitle: this.$t("cluster.detail.monitor.disk_transfer"),
            tipTitle: this.$t("cluster.detail.monitor.write"),
            formatStr: "Mb/s",
          }
        case "disk_read_iops":
          return {
            yTitle: "IOPS",
            tipTitle: this.$t("cluster.detail.monitor.read"),
            formatStr: "",
          }
        case "disk_write_iops":
          return {
            yTitle: "IOPS",
            tipTitle: this.$t("cluster.detail.monitor.write"),
            formatStr: "",
          }
        case "net_bytes_transmitted":
          return {
            yTitle: this.$t("cluster.detail.monitor.net_transfer"),
            tipTitle: this.$t("cluster.detail.monitor.out"),
            formatStr: "Mbps",
          }
        case "net_bytes_received":
          return {
            yTitle: this.$t("cluster.detail.monitor.net_transfer"),
            tipTitle: this.$t("cluster.detail.monitor.in"),
            formatStr: "Mbps",
          }
      }
    },

    initCharts(chartName, legendDatas, xDatas, yDatas, yTitle, formatStr) {
      const lineChart = echarts.init(document.getElementById(chartName))
      const option = {
        title: [
          {
            left: "center",
            text: yTitle,
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: function (datas) {
            var res = datas[0].name + "<br/>"
            for (const item of datas) {
              res += item.marker + " " + item.seriesName + "：" + item.data + formatStr + "<br/>"
            }
            return res
          },
          textStyle: {
            align: "left",
          },
        },
        legend: {
          data: legendDatas,
          right: 10,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xDatas,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: { formatter: "{value} " + formatStr },
          },
        ],
        grid: [{ bottom: "10%" }, { left: "10%" }, { top: "0" }],
        series: yDatas,
      }
      lineChart.setOption(option, true)
    },
    addSeries(datas, name, color) {
      return {
        name: name,
        type: "line",
        showSymbol: false,
        data: datas,
        itemStyle: {
          color: color,
        },
        areaStyle: {
          color: "#ebdee3",
        },
      }
    },
    polling() {
      this.timer = setInterval(() => {
        if (this.hasPrometheus === 'false') {
          return
        }
        if(this.keepPoll) {
          this.search()
        }
      }, 10000)
    },
  },
  mounted() {
    this.clusterName = this.$route.params.name
    this.loadNodes()
    listTool(this.clusterName).then((data) => {
      for (const tool of data) {
        if (tool.name === "prometheus" && tool.status === "Running") {
          this.hasPrometheus = 'true'
          break
        }
      }
      this.hasPrometheus = this.hasPrometheus ? "true" : "false"
      if (this.hasPrometheus === 'true') {
        let now = new Date()
        this.timeRange = [new Date(now.setHours(now.getHours() - 2)), new Date()]
        this.search()

        window.onresize = () => {
          echarts.init(document.getElementById("cpuChart")).resize()
          echarts.init(document.getElementById("memoryChart")).resize()
          echarts.init(document.getElementById("loadChart")).resize()
          echarts.init(document.getElementById("diskChart")).resize()
          echarts.init(document.getElementById("inodeChart")).resize()
          echarts.init(document.getElementById("diskIopsChart")).resize()
          echarts.init(document.getElementById("diskRwChart")).resize()
          echarts.init(document.getElementById("netChart")).resize()
        }
      }
    })
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped>
</style>