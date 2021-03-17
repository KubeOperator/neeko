<template>
  <layout-content>
    <complex-table header="复合表格" :data="data" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @input="search" @search="search">
      <el-table-column label="名称" min-width="100" prop="name"/>
      <el-table-column label="操作" min-width="100" prop="operation"/>
      <el-table-column label="操作内容" min-width="100" prop="operationInfo" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent";
import {systemQuery} from "@/api/system-log"
import ComplexTable from "@/components/complex-table";

export default {
  name: "SystemLog",
  components: {ComplexTable, LayoutContent},
  data() {
    return {
      searchConfig: {
        quickPlaceholder: "按 名称/操作/操作内容 搜索",
        components: [
          {field: "name", label: "名称", component: "FuComplexInput"},
          {field: "operation", label: "操作", component: "FuComplexInput"},
          {field: "operation_info", label: "操作内容", component: "FuComplexInput"}
        ]
      },
      condition : {
        name: '',
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
      const {currentPage, pageSize} = this.paginationConfig
      systemQuery(currentPage, pageSize, condition).then(response => {
        const currentLanguage = localStorage.getItem('currentLanguage') || this.translate.getBrowserCultureLang();
        if (response.items != null) {
          for (const item of response.items) {
            if (currentLanguage == 'en-US') {
                item.operation = item.operation.split('|')[1]
            } else {
                item.operation = item.operation.split('|')[0]
            }
          }
        }
        this.data = response.items
        this.paginationConfig.total = response.total
      })
    }
  },
  mounted() {
    var condition = {
      name: {
        field: '',
        operator: '',
        value: '',
      }
    }
    this.search(condition)
  }
}
</script>

<style scoped>

</style>