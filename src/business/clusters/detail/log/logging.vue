<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item :label="$t('commons.search.time')">
        <el-date-picker v-model="searchruleForm.timeRange" type="daterange" 
          :range-separator="$t('commons.search.time_range')"
          :start-placeholder="$t('commons.search.date_start')"
          :end-placeholder="$t('commons.search.date_end')">
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
      <el-button @click="search()" type="primary" size="small">{{$t('commons.button.search')}}</el-button>
    </el-form>

    <complex-table :data="data" :pagination-config="paginationConfig" >
       <el-table-column min-width="25%" :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.ts | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.log.msg_info')" min-width="100" prop="info" fix/>
    </complex-table>
  </div>
</template>

<script>
  import ComplexTable from "@/components/complex-table"
//   import { LokiLabels, LokiLabelValues, LokiSearch } from "@/api/cluster/log"

  export default {
    name: "ClusterLoki",
    components: {ComplexTable},
    data() {
      return {
        loading: false,
        clusterName: "",
        searchruleForm: {
          timeRange: [],
          info: [],
          namespace: "",
          pod: "",
          container: "",
        },
        paginationConfig: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        isExpertShow: false,
        data: []
      }
    },
    methods: {
      search() {}
    },
    created() {
      this.clusterName = this.$route.params.name
      this.search()
    }
  }
</script>

<style scoped>

</style>
