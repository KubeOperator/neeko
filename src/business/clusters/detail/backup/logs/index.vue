<template>
  <div>
    <complex-table :header="$t('cluster.detail.backup.backup_list')" @search="search" :data="logs" :pagination-config="paginationConfig">
      <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type" fix>
        <template v-slot:default="{row}">
          {{ $t("cluster.detail.backup." + row.type) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.start_time')" min-width="100" prop="startTime" fix>
        <template v-slot:default="{row}">
          {{ row.startTime | timeStampFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.end_time')" min-width="100" prop="endTime" fix>
        <template v-slot:default="{row}">
          <span v-if="row.endTime === 0"> - </span>
          <span v-else>{{ row.endTime | timeStampFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="phase" fix>
        <template v-slot:default="{row}">
          <div v-if="row.phase === 'FAILED'">
            <el-popover placement="left-start" :title="$t('cluster.detail.backup.detail')" width="200" trigger="click" :content="row.message">
              <div slot="reference">
                <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
                <el-link type="info">{{ $t("commons.status.failed") }}</el-link>
              </div>
            </el-popover>
          </div>
          <div v-if="row.phase === 'WAITING'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.waiting") }}</span>
          </div>
          <div v-if="row.phase === 'Running'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.running") }}</el-link>
          </div>
          <div v-if="row.phase ==='SUCCESS'">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("commons.status.success") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </div>
</template>
    
<script>
import ComplexTable from "@/components/complex-table"
import { getBackupLogs } from "@/api/cluster/tasks"

export default {
  name: "BackupLogs",
  components: { ComplexTable },
  data() {
    return {
      logs: [],
      clusterName: "",
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    }
  },
  methods: {
    search() {
      const { currentPage, pageSize } = this.paginationConfig
      getBackupLogs(currentPage, pageSize, this.clusterName).then((data) => {
        if (data) {
          this.logs = data.items
          this.paginationConfig.total = data.total
        }
      })
    },
  },
  mounted() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>
    
<style>
</style>