<template>
  <layout-content>
    <el-button-group>
      <el-button icon="el-icon-tickets" @click="search('single-task')">Single-Task</el-button>
      <el-button icon="el-icon-document-copy" @click="search('multi-task')">Multi-Task</el-button>
    </el-button-group>
    <complex-table :key="refresh" :data="data" :pagination-config="paginationConfig" @search="search" v-loading="loading" :fit="true">
      <el-table-column :label="$t('cluster.detail.tag.task')">
        <template v-slot:default="{row}">
          <el-link v-if="searchForm.logtype === 'single-task'" style="font-size: 12px" type="info" @click="getDetailInfo(row)">{{ $t(`task.${row.tasklogs.type}`) }}</el-link>
          <span v-else size="small">{{ row.tasklogs.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')">
        <template v-slot:default="{row}">
          <div v-if="row.tasklogs.phase === 'FAILED'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="getStatus(row)">{{ $t("commons.status.FAILED") }}</el-link>
          </div>
          <div v-if="row.tasklogs.phase === 'SUCCESS'">
            <span class="iconfont iconduihao" style="color: #32B350"></span> &nbsp; &nbsp; &nbsp;
            {{ $t("commons.status.SUCCESS") }}
          </div>
          <span v-if="row.tasklogs.phase === 'RUNNING'">
            <i class="el-icon-loading" />{{ $t("commons.status.RUNNING") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.search.time_start')" prop="tasklogs.startTime" min-width="100">
        <template v-slot:default="{row}">
          {{ row.tasklogs.startTime | timeStampFormat }}
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.search.time_end')" prop="tasklogs.endTime" min-width="100">
        <template v-slot:default="{row}">
          <span v-if="row.tasklogs.endTime === 0"> - </span>
          <span v-else>{{ row.tasklogs.endTime | timeStampFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.spend_time')" min-width="100">
        <template v-slot:default="{row}">
          {{ loadTimeSpend(row.tasklogs.startTime, row.tasklogs.endTime) }}
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getTasks } from "@/api/cluster/tasks"
import ComplexTable from "@/components/complex-table"

export default {
  name: "ClusterTask",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      clusterName: "",
      searchForm: {
        logtype: "single-task",
      },
      data: [],
      loading: false,
      refresh: false,
    }
  },
  methods: {
    search(type) {
      this.searchForm.logtype = type ? type : "single-task"
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      getTasks(currentPage, pageSize, this.clusterName, this.searchForm.logtype).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
        this.refresh = !this.refresh
      })
    },
    getDetailInfo(row) {
      this.$router.push({ name: "ClusterTaskDetail", params: { id: row.tasklogs.id } })
    },
    loadTimeSpend(start, end) {
      if (end == 0) {
        return "-"
      }
      return end - start + " S"
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>
<style scoped lang="scss">
</style>
