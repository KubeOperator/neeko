<template>
  <layout-content>
    <el-form :inline="true">
      <el-form-item :label="$t('cluster.detail.log.monitor_node')">
        <el-select size="small" @change="search()" clearable allow-create filterable v-model="searchruleForm.node">
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
        <el-card>
          <div id="cpuChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="memeryChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card>
          <div id="diskChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="networkChart" style="width: 100%;height: 350%;margin-top: 40px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listNodeInDB } from "@/api/cluster/node"
let echarts = require("echarts/lib/echarts")
import { QueryCPU, QueryMemeryTotal, QueryMemeryUsed, QueryMemeryCacheBuffer, QueryMemeryFree, QueryMemerySWAPUsed, QueryDisk, QueryNetworkRecv, QueryNetworkTrans } from "@/api/cluster/monitor"

export default {
  name: "ClusterMonitor",
  components: { LayoutContent },
  data() {
    return {
      searchruleForm: {
        node: "",
        timeRange: [],
      },
      nodes: [],
      selectNode: "",
      searchBeginDate: Date,
      searchEndDate: Date,
      cpuDateList: [],
      cpuValueList: [],
      memeryDateList: [],
      memeryValueList: [],
      diskDateList: [],
      diskValueList: [],
      networkDateList: [],
      networkValueList: [],
      data: [],
    }
  },
  methods: {
    search() {
      this.clusterName = this.$route.params.name
      listNodeInDB(this.clusterName).then((data) => {
        this.nodes = data.items.map(function (item) {
          return item.ip
        })
        this.selectNode = this.nodes[0]

        if (this.searchruleForm.timeRange.length === 0) {
          this.searchruleForm.timeRange[0] = new Date(new Date().setMinutes(new Date().getMinutes() - 30))
          this.searchruleForm.timeRange[1] = new Date()
        }
        let start = this.searchruleForm.timeRange[0].getTime() / 1000
        let end = this.searchruleForm.timeRange[1].getTime() / 1000

        this.getCPUDatas(start, end)
        this.getMemeryDatas(start, end)
        this.getDiskDatas(start, end)
        this.getNetworkDatas(start, end)
      })
    },
    getCPUDatas(start, end) {
      this.cpuDateList = []
      this.cpuValueList = []
      let system = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.selectNode + ":9100", '"system"', start.toString(), end.toString()).then((data) => {
          if (data.data.result.length === 0) {
            return
          }
          this.cpuDateList = data.data.result[0].values.map(function (item) {
            const timeNow = new Date(item[0] * 1000)
            return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
          })
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return Number(item[1]).toFixed(2)
          })
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy System"))
          resolve()
        })
      })
      let user = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.selectNode + ":9100", '"user"', start.toString(), end.toString()).then((data) => {
          if (data.data.result.length === 0) {
            return
          }
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return Number(item[1]).toFixed(2)
          })
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy User"))
          resolve()
        })
      })
      let iowait = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.selectNode + ":9100", '"iowait"', start.toString(), end.toString()).then((data) => {
          if (data.data.result.length === 0) {
            return
          }
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return Number(item[1]).toFixed(2)
          })
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Iowait"))
          resolve()
        })
      })
      let idle = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.selectNode + ":9100", '"idle"', start.toString(), end.toString()).then((data) => {
          if (data.data.result.length === 0) {
            return
          }
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return Number(item[1]).toFixed(2)
          })
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Idle"))
          resolve()
        })
      })
      let irq = new Promise((resolve) => {
        QueryCPU(this.clusterName, this.selectNode + ":9100", '~".*irq"', start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return Number(item[1]).toFixed(2)
          })
          this.cpuValueList.push(this.addSeries(itemDatas, "Busy Irqs"))
          resolve()
        })
      })
      Promise.all([system, user, iowait, idle, irq])
        .then(() => {
          this.initCharts("cpuChart", "CPU Basic", this.cpuDateList, this.cpuValueList, "%")
        })
        .catch((err) => {
          alert(err)
        })
    },

    getMemeryDatas(start, end) {
      this.memeryDateList = []
      this.memeryValueList = []
      let total = new Promise((resolve) => {
        QueryMemeryTotal(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
          this.memeryDateList = data.data.result[0].values.map(function (item) {
            const timeNow = new Date(item[0] * 1000)
            return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
          })
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
          })
          this.memeryValueList.push(this.addSeries(itemDatas, "RAM Total"))
          resolve()
        })
      })
      let used = new Promise((resolve) => {
        QueryMemeryUsed(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
          })
          this.memeryValueList.push(this.addSeries(itemDatas, "RAM Used"))
          resolve()
        })
      })
      let cache = new Promise((resolve) => {
        QueryMemeryCacheBuffer(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
          })
          this.memeryValueList.push(this.addSeries(itemDatas, "RAM Cache + Buffer"))
          resolve()
        })
      })
      let free = new Promise((resolve) => {
        QueryMemeryFree(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
          })
          this.memeryValueList.push(this.addSeries(itemDatas, "RAM Free"))
          resolve()
        })
      })
      let swap = new Promise((resolve) => {
        QueryMemerySWAPUsed(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
          let itemDatas = []
          itemDatas = data.data.result[0].values.map(function (item) {
            return (Number(item[1]) / 1024 / 1024 / 1024).toFixed(2)
          })
          this.memeryValueList.push(this.addSeries(itemDatas, "SWAP Used"))
          resolve()
        })
      })
      Promise.all([total, used, cache, free, swap]).then(() => {
        this.initCharts("memeryChart", "Memery Basic", this.memeryDateList, this.memeryValueList, "GiB")
      })
    },

    getDiskDatas(start, end) {
      this.diskDateList = []
      this.diskValueList = []
      QueryDisk(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
        this.diskDateList = data.data.result[0].values.map(function (item) {
          const timeNow = new Date(item[0] * 1000)
          return timeNow.getMonth() + 1 + "月" + timeNow.getDate() + "日" + timeNow.getHours() + ":" + timeNow.getMinutes()
        })
        let itemDatas = []
        itemDatas = data.data.result[0].values.map(function (item) {
          return Number(item[1]).toFixed(2)
        })
        this.diskValueList.push(this.addSeries(itemDatas, "Disk Space Used"))
        this.initCharts("diskChart", "Disk Space Used Basic", this.diskDateList, this.diskValueList, "%")
      })
    },

    getNetworkDatas(start, end) {
      this.networkDateList = []
      this.networkValueList = []
      let recv = new Promise((resolve) => {
        QueryNetworkRecv(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
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
          resolve()
        })
      })
      let trans = new Promise((resolve) => {
        QueryNetworkTrans(this.clusterName, this.selectNode + ":9100", start.toString(), end.toString()).then((data) => {
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
      Promise.all([recv, trans]).then(() => {
        this.initCharts("networkChart", "Network Traffic Basic", this.networkDateList, this.networkValueList, "kb/s")
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
    this.search()
  },
}
</script>

<style scoped>
</style>