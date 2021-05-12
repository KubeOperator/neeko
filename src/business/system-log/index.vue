<template>
  <layout-content>
    <complex-table local-key="system_log_columns" :header="$t('system_log.title')" 
      :data="data" :search-config="searchConfig" 
      :pagination-config="paginationConfig" 
      @input="search" @search="search">
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" />
      <el-table-column :label="$t('system_log.operation')" min-width="100" prop="operation" />
      <el-table-column :label="$t('system_log.operation_info')" min-width="100" prop="operationInfo" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { systemQuery } from "@/api/system-log"
import ComplexTable from "@/components/complex-table"

export default {
  name: "SystemLog",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      searchConfig: {
        quickPlaceholder: this.$t("system_log.query_placeholder"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput" },
          { field: "operation", label: this.$t("system_log.operation"), component: "FuComplexInput" },
          { field: "operation_info", label: this.$t("system_log.operation_info"), component: "FuComplexInput" },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" },
        ],
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      data: [],
    }
  },
  methods: {
    search(condition) {
      const { currentPage, pageSize } = this.paginationConfig
      systemQuery(currentPage, pageSize, condition).then((response) => {
        const currentLanguage = this.$store.getters.language || "zh-CN"
        if (response.items != null) {
          for (const item of response.items) {
            if (currentLanguage == "en-US") {
              item.operation = item.operation.split("|")[1]
            } else {
              item.operation = item.operation.split("|")[0]
            }
          }
        }
        this.data = response.items
        this.paginationConfig.total = response.total
      })
    },
  },
  mounted() {
    var condition = {
      name: {
        field: "",
        operator: "",
        value: "",
      },
    }
    this.search(condition)
  },
}
</script>

<style scoped>
</style>