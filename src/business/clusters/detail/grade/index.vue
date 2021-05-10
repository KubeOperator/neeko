<template>
  <div v-loading="loading">
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
import { getGrade } from "@/api/cluster/grade"
import * as echarts from "echarts"

export default {
  name: "ClusterGrade",
  data() {
    return {
      loading: false,
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
      this.loading = true
      getGrade(this.clusterName).then((data) => {
        this.gradeInfo = data
        this.initPieChart(this.gradeInfo)
        this.initBarChart(this.gradeInfo)
        this.gradeInfo.grade = this.getGrade(this.gradeInfo.score)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
