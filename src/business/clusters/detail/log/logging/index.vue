<template>
  <div>
    <fu-search-bar :quick-placeholder="$t('cluster.detail.log.match_info_quick')" @exec="search">
      <template v-slot:complex>
        <fu-complex-date field="timeRange" :label="$t('cluster.detail.log.time')" />
        <custom-search-component field="match_info" :label="$t('cluster.detail.log.match_info')" />
        <custom-search-component field="namespace" label="namespace" />
        <custom-search-component field="container" label="container" />
        <custom-search-component field="pod" label="pod" />
      </template>
    </fu-search-bar>

    <complex-table v-loading="loading" :data="data" :pagination-config="paginationConfig" @search="search">
      <el-table-column min-width="25%" :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.timestamp | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.log.msg_info')" min-width="100" prop="_source" fix />
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { formatDate } from "@/utils/format_date"
import { EfSearch } from "@/api/cluster/log"

const CustomSearchComponent = {
  name: "custom-search-component",
  props: {
    field: String,
    label: String,
  },
  data() {
    return {
      loading: false,
      condition: "",
      operator: "like",
      operatorLabel: "包含",
    }
  },
  computed: {
    valueLabel() {
      return this.condition
    },
  },
  methods: {
    getCondition() {
      if (!this.condition) return
      let { field, label, operator, operatorLabel, condition, valueLabel } = this
      return {
        field,
        label,
        operator,
        operatorLabel,
        value: condition,
        valueLabel,
      }
    },
    init() {
      this.condition = ""
    },
  },
  render() {
    return (
      <div style="display:flex; align-items:center;padding: 5px;font-size:12px">
        <div style="min-width:100px;padding: 0 5px;">{this.label}</div>
        <div style="min-width: 140px;padding: 0 21px;box-sizing:border-box;">{this.operatorLabel}</div>
        <div style="width:100%;padding: 0 15px;">
          <el-input value={this.condition} on-input={(v) => (this.condition = v)} placeholder={this.label} />
        </div>
      </div>
    )
  },
}

export default {
  name: "ClusterLogging",
  components: { CustomSearchComponent, ComplexTable },
  data() {
    return {
      loading: false,
      clusterName: "",
      data: [],
      indexPrefix: "logstash-",
      searchBeginDate: Date,
      searchEndDate: Date,
      paginationConfig: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
    }
  },
  methods: {
    search(condition) {
      const queryArry = []
      var conditionItem = { timeRange: { operator: "none" } }
      if (condition === undefined) {
        this.getLogDatas(conditionItem, queryArry)
        return
      }

      if (condition.match_info !== undefined) {
        queryArry.push({
          match: { message: { query: condition.match_info.value } },
        })
      }
      if (condition.quick !== undefined) {
        queryArry.push({ match: { message: { query: condition.quick.value } } })
      }

      if (condition.namespace !== undefined) {
        if (condition.namespace.value.indexOf("-") === -1) {
          queryArry.push({
            term: { "kubernetes.namespace_name": condition.namespace.value },
          })
        } else {
          const namespaceArry = condition.namespace.value.split("-")
          for (const n of namespaceArry) {
            queryArry.push({ term: { "kubernetes.namespace_name": n } })
          }
        }
      }

      if (condition.pod !== undefined) {
        if (condition.pod.value.indexOf("-") === -1) {
          queryArry.push({
            term: { "kubernetes.pod_name": condition.pod.value },
          })
        } else {
          const podArry = condition.pod.value.split("-")
          for (const p of podArry) {
            queryArry.push({ term: { "kubernetes.pod_name": p } })
          }
        }
      }

      if (condition.container !== undefined) {
        if (condition.container.value.indexOf("-") === -1) {
          queryArry.push({
            term: { "kubernetes.container_name": condition.container.value },
          })
        } else {
          const containerArry = condition.container.value.split("-")
          for (const n of containerArry) {
            queryArry.push({ term: { "kubernetes.container_name": n } })
          }
        }
      }

      if (condition.timeRange !== undefined) {
        this.getLogDatas(condition, queryArry)
      } else {
        this.getLogDatas(conditionItem, queryArry)
      }
    },

    getLogDatas(condition, queryArry) {
      this.loading = true
      let queryIndex = ""
      this.getSearchDate(condition)
      const begindate = formatDate(this.searchBeginDate, "yyyy.MM.dd")
      const enddate = formatDate(this.searchEndDate, "yyyy.MM.dd")
      let startDate = this.searchBeginDate
      let endDate = this.searchEndDate
      while (startDate <= endDate) {
        queryIndex = queryIndex + this.indexPrefix + formatDate(startDate, "yyyy.MM.dd") + ","
        startDate.setDate(startDate.getDate() + 1)
      }
      queryIndex = queryIndex.substr(0, queryIndex.length - 1)
      EfSearch(this.clusterName, queryArry, queryIndex, begindate, enddate, this.paginationConfig.currentPage, this.paginationConfig.pageSize).then((data) => {
        this.data = data.hits.hits
        this.paginationConfig.total = data.hits.total.value
        for (const item of this.data) {
          const timeItem = new Date(item._source["@timestamp"])
          item.timestamp = timeItem
          item._source = JSON.stringify(item._source)
        }
        this.loading = false
      }).catch(() => {
          this.loading = false
        })
    },

    getSearchDate(condition) {
      switch (condition.timeRange.operator) {
        case "between": {
          this.searchBeginDate = new Date(condition.timeRange.value[0])
          this.searchEndDate = new Date(condition.timeRange.value[1])
          break
        }
        case "eq": {
          this.searchBeginDate = new Date(condition.timeRange.value)
          this.searchEndDate = new Date(condition.timeRange.value)
          break
        }
        case "gt": {
          this.searchBeginDate = new Date(condition.timeRange.value)
          this.searchBeginDate.setDate(this.searchBeginDate.getDate() + 1)
          this.searchEndDate = new Date(condition.timeRange.value)
          this.searchEndDate.setDate(this.searchEndDate.getDate() + 3)
          break
        }
        case "ge": {
          this.searchBeginDate = new Date(condition.timeRange.value)
          this.searchEndDate = new Date(condition.timeRange.value)
          this.searchEndDate.setDate(this.searchEndDate.getDate() + 3)
          break
        }
        case "lt": {
          this.searchBeginDate = new Date(condition.timeRange.value)
          this.searchBeginDate.setDate(this.searchBeginDate.getDate() - 3)
          this.searchEndDate = new Date(condition.timeRange.value)
          this.searchEndDate.setDate(this.searchEndDate.getDate() - 1)
          break
        }
        case "le": {
          this.searchBeginDate = new Date(condition.timeRange.value)
          this.searchBeginDate.setDate(this.searchBeginDate.getDate() - 3)
          this.searchEndDate = new Date(condition.timeRange.value)
          break
        }
        case "none": {
          this.searchBeginDate = new Date()
          this.searchBeginDate.setDate(this.searchBeginDate.getDate() - 3)
          this.searchEndDate = new Date()
          break
        }
      }
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style lang="scss" scoped>
.condition_display {
  width: 100%;
  overflow-y: auto;
  min-height: 16px;
  background-color: #f5f9ff;
}
</style>