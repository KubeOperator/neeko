<template>
  <div>
    <el-form :inline="true">
      <el-form-item :label="$t('cluster.detail.log.monitor_node')">
        <el-select size="small" @change="search()" allow-create filterable v-model="searchruleForm.node">
          <el-option v-for="node in nodes" :key="node" :label="node" :value="node"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('commons.search.time')">
        <el-date-picker @change="search()" v-model="searchruleForm.timeRange" type="datetimerange" :range-separator="$t('commons.search.time_range')" :start-placeholder="$t('commons.search.time_start')" :end-placeholder="$t('commons.search.time_end')">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-card style="overflow: inherit">
          <div v-loading="loading_cpu" id="cpuChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="overflow: inherit">
          <div v-loading="loading_memory" id="memoryChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card style="overflow: inherit">
          <div v-loading="loading_disk" id="diskChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="overflow: inherit">
          <div v-loading="loading_network" id="networkChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listNodeInDB } from "@/api/cluster/node"
import { listTool } from "@/api/cluster/tool"
let echarts = require("echarts/lib/echarts")
import { QueryCPU, QueryMemoryTotal, QueryMemoryUsed, QueryMemoryCacheBuffer, QueryMemoryFree, QueryMemorySWAPUsed, QueryDisk, QueryNetworkRecv, QueryNetworkTrans } from "@/api/cluster/monitor"

export default {
  name: "ClusterMonitor",
  components: {},
  data() {
    return {
      startDate: Date.now(),
      loading_cpu: false,
      loading_memory: false,
      loading_disk: false,
      loading_network: false,
      searchruleForm: {
        node: "",
        timeRange: [],
      },
      nodes: [],
      cpuDateList: [],
      cpuValueList: [],
      memoryDateList: [],
      memoryValueList: [],
      diskDateList: [],
      diskValueList: [],
      networkDateList: [],
      networkValueList: [],
      data: [],
    }
  },
  methods: {
    search() {
      this.loading_cpu = true
      this.loading_memory = true
      this.loading_disk = true
      this.loading_network = true
      listNodeInDB(this.clusterName).then((data) => {
        this.nodes = data.items.map(function (item) {
          return item.ip
        })
        this.searchruleForm.node = this.searchruleForm.node ? this.searchruleForm.node : this.nodes[0]

        if (!this.searchruleForm.timeRange) {
          this.searchruleForm.timeRange = []
        }
        if (this.searchruleForm.timeRange.length === 0) {
          this.searchruleForm.timeRange[0] = new Date(new Date().setMinutes(new Date().getMinutes() - 30))
          this.searchruleForm.timeRange[1] = new Date()
        }
        let start = this.searchruleForm.timeRange[0].getTime() / 1000
        let end = this.searchruleForm.timeRange[1].getTime() / 1000

        this.getCPUDatas(start, end)
        this.getMemoryDatas(start, end)
        this.getDiskDatas(start, end)
        this.getNetworkDatas(start, end)
      })
    },
    getCPUDatas(start, end) {
      this.cpuDateList = []
      this.cpuValueList = []
      let system = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.searchruleForm.node + ":9100", '"system"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            this.cpuDateList = data.data.result[0].values.map(function (item) {
              const timeNow = new Date(item[0] * 1000)
              return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
            })
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy System"))
          resolve()
        })
      })
      let user = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.searchruleForm.node + ":9100", '"user"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy User"))
          resolve()
        })
      })
      let iowait = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.searchruleForm.node + ":9100", '"iowait"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Iowait"))
          resolve()
        })
      })
      let idle = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.searchruleForm.node + ":9100", '"idle"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Idle"))
          resolve()
        })
      })
      let irq = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.searchruleForm.node + ":9100", '~".*irq"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Irqs"))
          resolve()
        })
      })
      Promise.all([system, user, iowait, idle, irq])
        .then(() => {
          this.loading_cpu = false
          this.initCharts("cpuChart", "CPU Basic", this.cpuDateList, this.cpuValueList, "%")
        })
        .catch(() => {
          this.loading_cpu = false
        })
    },

    getMemoryDatas(start, end) {
      this.memoryDateList = []
      this.memoryValueList = []
      let total = new Promise((resolve) => {
        QueryMemoryTotal(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            this.memoryDateList = data.data.result[0].values.map(function (item) {
              const timeNow = new Date(item[0] * 1000)
              return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
            })
            itemDatas = data.data.result[0].values.map(function (item) {
              return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
            })
          }
          this.memoryValueList.push(this.addSeries(itemDatas, "RAM Total"))
          resolve()
        })
      })
      let used = new Promise((resolve) => {
        QueryMemoryUsed(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
            })
          }
          this.memoryValueList.push(this.addSeries(itemDatas, "RAM Used"))
          resolve()
        })
      })
      let cache = new Promise((resolve) => {
        QueryMemoryCacheBuffer(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
            })
          }
          this.memoryValueList.push(this.addSeries(itemDatas, "RAM Cache + Buffer"))
          resolve()
        })
      })
      let free = new Promise((resolve) => {
        QueryMemoryFree(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
            })
          }
          this.memoryValueList.push(this.addSeries(itemDatas, "RAM Free"))
          resolve()
        })
      })
      let swap = new Promise((resolve) => {
        QueryMemorySWAPUsed(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            itemDatas = data.data.result[0].values.map(function (item) {
              return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
            })
          }
          this.memoryValueList.push(this.addSeries(itemDatas, "SWAP Used"))
          resolve()
        })
      })
      Promise.all([total, used, cache, free, swap])
        .then(() => {
          this.loading_memory = false
          this.initCharts("memoryChart", "Memory Basic", this.memoryDateList, this.memoryValueList, "GiB")
        })
        .catch(() => {
          this.loading_memory = false
        })
    },

    getDiskDatas(start, end) {
      this.diskDateList = []
      this.diskValueList = []
      QueryDisk(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString())
        .then((data) => {
          let itemDatas = []
          if (data.data.result.length !== 0) {
            this.diskDateList = data.data.result[0].values.map(function (item) {
              const timeNow = new Date(item[0] * 1000)
              return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
            })
            itemDatas = data.data.result[0].values.map(function (item) {
              return Number(item[1]).toFixed(2)
            })
          }
          this.diskValueList.push(this.addSeries(itemDatas, "Disk Space Used"))
          this.loading_disk = false
          this.initCharts("diskChart", "Disk Space Used Basic", this.diskDateList, this.diskValueList, "%")
        })
        .catch(() => {
          this.loading_disk = false
        })
    },

    getNetworkDatas(start, end) {
      this.networkDateList = []
      this.networkValueList = []
      let recv = new Promise((resolve) => {
        QueryNetworkRecv(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          if (data.data.result.length !== 0) {
            this.networkDateList = data.data.result[0].values.map(function (item) {
              const timeNow = new Date(item[0] * 1000)
              return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
            })
            for (const res of data.data.result) {
              let itemDatas = []
              itemDatas = res.values.map(function (item) {
                return (Number(item[1]) / 1000).toFixed(0)
              })
              this.networkValueList.push(this.addSeries(itemDatas, "Recv " + res.metric.device))
            }
          }
          resolve()
        })
      })
      let trans = new Promise((resolve) => {
        QueryNetworkTrans(this.clusterName, this.searchruleForm.node + ":9100", start.toString(), end.toString()).then((data) => {
          for (const res of data.data.result) {
            let itemDatas = []
            itemDatas = res.values.map(function (item) {
              return -(Number(item[1]) / 1000).toFixed(0)
            })
            this.networkValueList.push(this.addSeries(itemDatas, "Trans " + res.metric.device))
          }
          resolve()
        })
      })
      Promise.all([recv, trans])
        .then(() => {
          this.loading_network = false
          this.initCharts("networkChart", "Network Traffic Basic", this.networkDateList, this.networkValueList, "kb/s")
        })
        .catch(() => {
          this.loading_network = false
        })
    },
    initCharts(chartName, title, xDatas, yDatas, formatStr) {
      const lineChart = echarts.init(document.getElementById(chartName))
      const option = {
        title: [
          {
            left: "center",
            text: title,
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
        xAxis: [
          {
            data: xDatas,
            gridIndex: 1,
          },
        ],
        yAxis: [
          {
            axisLabel: { formatter: "{value} " + formatStr },
            gridIndex: 1,
          },
        ],
        grid: [{ bottom: "60%" }, { left: "20%" }, { top: "15%" }],
        series: yDatas,
      }
      lineChart.setOption(option, true)
    },
    addSeries(datas, name) {
      return {
        name: name,
        type: "line",
        smooth: true,
        showSymbol: true,
        areaStyle: {},
        data: datas,
      }
    },
  },
  mounted() {
    this.clusterName = this.$route.params.name
    listTool(this.clusterName).then((data) => {
      for (const tool of data) {
        if (tool.name === "prometheus") {
          this.startDate = new Date(tool.updatedAt).getTime()
        }
      }
    })
    this.search()
  },
}
</script>

<style scoped>
</style>