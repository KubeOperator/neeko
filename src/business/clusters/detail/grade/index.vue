<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-card>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <div align="center">
                <span style="font-size: 144px; ">{{gradeInfo.grade}}</span><br /><br />
              </div>
              <div align="center">
                <span style="font-size: 24px">{{gradeInfo.score}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div id="pieChartOptions" style="width: 100%;height: 250px;margin-top: 40px;"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="barChartOptions" style="width: 100%;height: 250px;margin-top: 40px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <div v-for="item of gradeInfo.results" :key="item.namespace">
      <el-card style="margin-top:20px">
        <div slot="header" class="clearfix">
          <span>{{item.namespace}}</span>
        </div>
        <el-collapse v-for="re in item.results" :key="re.name">
          <el-collapse-item :title="re.kind + ':' + re.name" :name="re.name">
            <el-row>
              <el-col :span="12">
                <span style="font-size: 24px">Pod Sec</span>
              </el-col>
              <el-col :span="12">
                <ul class="list-unstyled">
                  <li v-for="pr of re.podResults" :key="pr.name">
                    <span v-if="pr.severity==='danger'"><i class="el-icon-warning" style="color: red" />{{pr.message}}</span>
                    <span v-if="pr.severity==='warning'"><i class="el-icon-question" style="color: blue" />{{pr.message}}</span>
                    <span v-if="pr.severity==='pass'"><i class="el-icon-success" style="color: green" />{{pr.message}}</span>
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
// import { getGrade } from "@/api/cluster/grade"
import * as echarts from "echarts"

export default {
  name: "ClusterGrade",
  data() {
    return {
      gradeInfo: {
        grade: "",
        score: 0,
        totalSum: 0,
        listSum: [],
        results: [],
      },
    }
  },
  methods: {
    search() {
      //   getGrade(this.clusterName).then(() => {
      this.gradeInfo = {
        score: 69,
        totalSum: {
          danger: 20,
          warning: 514,
          success: 649,
        },
        listSum: {
          "Health Checks": {
            danger: 0,
            warning: 68,
            success: 18,
          },
          Images: {
            danger: 0,
            warning: 63,
            success: 63,
          },
          Networking: {
            danger: 0,
            warning: 6,
            success: 111,
          },
          Reliability: {
            danger: 0,
            warning: 10,
            success: 1,
          },
          Resources: {
            danger: 0,
            warning: 185,
            success: 33,
          },
          Security: {
            danger: 20,
            warning: 182,
            success: 423,
          },
        },
        results: [
          {
            namespace: "kube-system",
            results: [
              {
                name: "kube-flannel-ds",
                kind: "DaemonSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "kube-proxy",
                kind: "DaemonSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class has been set",
                    severity: "warning",
                    success: true,
                  },
                ],
              },
              {
                name: "nginx-ingress-controller",
                kind: "DaemonSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network should not be configured",
                    severity: "warning",
                    success: false,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "node-problem-detector",
                kind: "DaemonSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "vsphere-csi-node",
                kind: "DaemonSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "coredns",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class has been set",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                ],
              },
              {
                name: "metrics-server",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "songliucs",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "kube-scheduler-v3-6test-master-1",
                kind: "Pod",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class has been set",
                    severity: "warning",
                    success: true,
                  },
                ],
              },
              {
                name: "vsphere-csi-controller",
                kind: "StatefulSet",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
            ],
          },
          {
            namespace: "istio-system",
            results: [
              {
                name: "istiod",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
            ],
          },
          {
            namespace: "xulinde",
            results: [
              {
                name: "job-8e9d975c-9708-4571-9f26-d414c8df0aef-1cf40fcf",
                kind: "Job",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "job-c6c19311-f344-44cc-8e10-cf067bf5c2dd-2c47e31f",
                kind: "Job",
                podResults: [
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                ],
              },
            ],
          },
          {
            namespace: "cattle-system",
            results: [
              {
                name: "cattle-cluster-agent",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
            ],
          },
          {
            namespace: "kube-operator",
            results: [
              {
                name: "job-b816462f-038f-441f-b86a-ca46c5280726-817f0e45",
                kind: "Job",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
              {
                name: "job-b816462f-038f-441f-b86a-ca46c5280726-96c4df6e",
                kind: "Job",
                podResults: [
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                ],
              },
              {
                name: "job-b816462f-038f-441f-b86a-ca46c5280726-f95ef660",
                kind: "Job",
                podResults: [
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                ],
              },
            ],
          },
          {
            namespace: "fleet-system",
            results: [
              {
                name: "fleet-agent",
                kind: "Deployment",
                podResults: [
                  {
                    id: "hostPIDSet",
                    category: "Security",
                    message: "Host PID is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "priorityClassNotSet",
                    category: "Security",
                    message: "Priority class should be set",
                    severity: "warning",
                    success: false,
                  },
                  {
                    id: "hostIPCSet",
                    category: "Security",
                    message: "Host IPC is not configured",
                    severity: "danger",
                    success: true,
                  },
                  {
                    id: "hostNetworkSet",
                    category: "Networking",
                    message: "Host network is not configured",
                    severity: "warning",
                    success: true,
                  },
                ],
              },
            ],
          },
        ],
      }
      this.initPieChart(this.gradeInfo)
      this.initBarChart(this.gradeInfo)
      this.gradeInfo.grade = this.getGrade(this.gradeInfo.score)
      //   })
    },
    getGrade(score) {
      if (score >= 97) {
        return "A+"
      } else if (score >= 93) {
        return "A"
      } else if (score >= 90) {
        return "A-"
      } else if (score >= 87) {
        return "B+"
      } else if (score >= 83) {
        return "B"
      } else if (score >= 80) {
        return "B-"
      } else if (score >= 77) {
        return "C+"
      } else if (score >= 73) {
        return "C"
      } else if (score >= 70) {
        return "C-"
      } else if (score >= 67) {
        return "D+"
      } else if (score >= 63) {
        return "D"
      } else if (score >= 60) {
        return "D-"
      }
      return "F"
    },
    initBarChart(gradeInfo) {
      const barChartOptions = echarts.init(document.getElementById("barChartOptions"))
      const barOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: [this.$t("cluster.detail.grade.danger"), this.$t("cluster.detail.grade.warning"), this.$t("cluster.detail.grade.pass")],
        },
        color: ["#F57660", "#F8B96A", "#90D072"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: [],
        },
        series: [
          {
            name: this.$t("cluster.detail.grade.danger"),
            type: "bar",
            stack: this.$t("cluster.detail.grade.total"),
            label: {
              position: "insideRight",
            },
            data: [],
          },
          {
            name: this.$t("cluster.detail.grade.warning"),
            type: "bar",
            stack: this.$t("cluster.detail.grade.total"),
            label: {
              position: "insideRight",
            },
            data: [],
          },
          {
            name: this.$t("cluster.detail.grade.pass"),
            type: "bar",
            stack: this.$t("cluster.detail.grade.total"),
            label: {
              position: "insideRight",
            },
            data: [],
          },
        ],
      }
      for (const category in gradeInfo.listSum) {
        if (category) {
          barOption.yAxis.data.push(this.$t("cluster.detail.grade." + category.toLowerCase().replace(" ", "_")))
          barOption.series[0].data.push(gradeInfo.listSum[category].danger)
          barOption.series[1].data.push(gradeInfo.listSum[category].warning)
          barOption.series[2].data.push(gradeInfo.listSum[category].success)
        }
      }
      barChartOptions.setOption(barOption, true)
    },
    initPieChart(gradeInfo) {
      const pieChartOptions = echarts.init(document.getElementById("pieChartOptions"))
      const pieOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          data: [this.$t("cluster.detail.grade.danger"), this.$t("cluster.detail.grade.warning"), this.$t("cluster.detail.grade.pass")],
        },
        color: ["#F57660", "#F8B96A", "#90D072"],
        series: [
          {
            name: this.$t("commons.table.type"),
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: gradeInfo.totalSum.danger, name: this.$t("cluster.detail.grade.danger") },
              { value: gradeInfo.totalSum.warning, name: this.$t("cluster.detail.grade.warning") },
              { value: gradeInfo.totalSum.success, name: this.$t("cluster.detail.grade.pass") },
            ],
          },
        ],
      }
      pieChartOptions.setOption(pieOption, true)
    },
  },
  mounted() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
