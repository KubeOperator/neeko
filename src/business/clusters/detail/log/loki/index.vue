<template>
  <div>
    <el-form :inline="true">
      <el-form-item :label="$t('commons.search.time')">
        <el-date-picker v-model="searchruleForm.timeRange" type="daterange" :range-separator="$t('commons.search.time_range')" :start-placeholder="$t('commons.search.date_start')" :end-placeholder="$t('commons.search.date_end')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('cluster.detail.log.label')">
        <el-select size="small" @change="searchWithLabel()" clearable allow-create filterable v-model="searchruleForm.label">
          <el-option v-for="item in labels" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cluster.detail.log.value')">
        <el-select size="small" clearable allow-create filterable v-model="searchruleForm.value">
          <el-option v-for="item in values" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-button :disabled="searchruleForm.label.length === 0 || searchruleForm.value.length === 0" @click="search()" size="small">{{$t('commons.button.search')}}</el-button>
    </el-form>

    <complex-table :data="data" v-loading="loading">
      <el-table-column min-width="25%" :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.ts | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.log.msg_info')" min-width="100" prop="info" fix />
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { LokiLabels, LokiLabelValues, LokiSearch } from "@/api/cluster/log"

export default {
  name: "ClusterLoki",
  components: { ComplexTable },
  data() {
    return {
      loading: false,
      clusterName: "",
      searchruleForm: {
        timeRange: [],
        label: "",
        value: "",
      },
      labels: [],
      values: [],
      data: [],
    }
  },
  methods: {
    getLables() {
      LokiLabels(this.clusterName).then((data) => {
        this.labels = data.data
      })
    },
    search() {
      this.loading = true
      this.data = []
      let step = 8
      let paramInfo = "direction=backward&limit=1000&regexp="
      let start = 0
      let end = 0

      if (this.searchruleForm.timeRange.length !== 0) {
        start = this.searchruleForm.timeRange[0].getTime()
        end = this.searchruleForm.timeRange[1].getTime()
        paramInfo = paramInfo + ("&start=" + start + "000000&end=" + (end + 86400000) + "000000")
      }
      step = ((end - start) / 86400000 + 1) * 8
      paramInfo = paramInfo + "&step=" + step

      if (this.searchruleForm.label !== "" && this.searchruleForm.value !== "") {
        paramInfo += "&query={" + this.searchruleForm.label + '="' + this.searchruleForm.value + '"}'
      }
      LokiSearch(this.clusterName, paramInfo).then((data) => {
        for (const item1 of data.data.result) {
          for (const item2 of item1.values) {
            let logItem = this.dataParser(item2)
            this.data.push(logItem)
          }
        }
        this.loading = false
      })
    },
    searchWithLabel() {
      if (this.searchruleForm.label) {
        LokiLabelValues(this.clusterName, this.searchruleForm.label).then((data) => {
          if (data.data === undefined) {
            this.searchruleForm.values = []
            this.searchruleForm.value = ""
          } else {
            if (data.data.length > 0) {
              this.searchruleForm.values = data.data
              this.searchruleForm.value = this.searchruleForm.values[0]
            } else {
              this.searchruleForm.values = []
              this.searchruleForm.value = ""
            }
          }
        })
      }
    },
    dataParser(data) {
      let logItem = {
        ts: new Date(parseInt(data[0].substring(0, 13))),
        info: data[1],
      }
      return logItem
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.getLables()
  },
}
</script>

<style scoped>
</style>
