<template>
  <layout-content>
    <el-button-group>
      <el-tooltip class="item" effect="dark" :content="$t('task.cluster_task_help')" placement="bottom-start">
        <el-button icon="el-icon-tickets" @click="search('cluster')">{{ $t('task.cluster_task') }}</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('task.component_task_help')" placement="bottom-start">
        <el-button icon="el-icon-document-copy" @click="search('component')">{{ $t('task.component_task') }}</el-button>
      </el-tooltip>
    </el-button-group>
    <complex-table :key="refresh" :data="data" :pagination-config="paginationConfig" @search="search" v-loading="loading" :fit="true">
      <el-table-column sortable prop="tasklogs.type" v-if="searchForm.logtype === 'cluster'" min-width="150" :label="$t('cluster.detail.tag.task')">
        <template v-slot:default="{row}">
          <el-link style="font-size: 12px" type="info" @click="getDetailInfo(row)">{{ $t(`task.${row.tasklogs.type}`) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column sortable prop="tasklogs.type" v-if="searchForm.logtype !== 'cluster'" min-width="150" :label="$t('cluster.detail.tag.task')">
        <template v-slot:default="{row}">
          <el-link style="font-size: 12px" type="info" @click="openXterm(row)">{{ loadName(row) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column sortable prop="tasklogs.phase" :label="$t('commons.table.status')" min-width="60">
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
      <el-table-column sortable :label="$t('commons.search.time_start')" prop="tasklogs.startTime" min-width="80">
        <template v-slot:default="{row}">
          {{ row.tasklogs.startTime | timeStampFormat }}
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.search.time_end')" prop="tasklogs.endTime" min-width="80">
        <template v-slot:default="{row}">
          <span v-if="row.tasklogs.endTime === 0"> - </span>
          <span v-else>{{ row.tasklogs.endTime | timeStampFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.spend_time')" min-width="60">
        <template v-slot:default="{row}">
          {{ loadTimeSpend(row.tasklogs.startTime, row.tasklogs.endTime) }}
        </template>
      </el-table-column>
    </complex-table>

    <el-dialog :title="$t('commons.button.error_msg')" width="50%" :visible.sync="dialogVisible">
      <template slot="title">
        <div v-if="formatMsgs.failed">{{formatMsgs.name}}</div>
      </template>
      <div v-if="formatMsgs.type !== 'unFormat'">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-if="formatMsgs.info.msg" title="message" name="1">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{ formatMsgs.info.msg }}</span></div>
          </el-collapse-item>
          <el-collapse-item v-if="formatMsgs.info.stderr" title="stderr" name="2">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stderr }}</span></div>
          </el-collapse-item>
          <el-collapse-item v-if="formatMsgs.info.stdout" title="stdout" name="3">
            <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stdout }}</span></div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else>
        <div><span style="white-space: pre-wrap;">{{formatMsgs.info | errorFormat }}</span></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getTasks } from "@/api/cluster/tasks"
import ComplexTable from "@/components/complex-table"
import { openLoggerWithID } from "@/api/cluster/tasks"
import { ansibleErrFormat } from "@/utils/format_ansible_err"

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
        logtype: "cluster",
      },
      data: [],
      loading: false,
      refresh: false,
      dialogVisible: false,
      formatMsgs: {
        name: "",
        info: {},
        failed: false,
      },
      activeNames: ["1", "2", "3"],
    }
  },
  methods: {
    search(type) {
      this.searchForm.logtype = type ? type : "cluster"
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      getTasks(currentPage, pageSize, this.clusterName, this.searchForm.logtype).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
        this.refresh = !this.refresh
      })
    },
    openXterm(row) {
      if (row.tasklogs.type.indexOf(" (enable)") !== -1) {
        openLoggerWithID(row.tasklogs.clusterID, row.tasklogs.id + " (enable)")
        return
      }
      openLoggerWithID(row.tasklogs.clusterID, row.tasklogs.id)
    },
    getStatus(row) {
      this.formatMsgs = ansibleErrFormat(row.tasklogs.message)[0]
      this.dialogVisible = true
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
    loadName(task) {
      if (task.tasklogs.type.indexOf("disable") !== -1) {
        if (task.tasklogs.type.indexOf("storage") !== -1) {
          return this.$t("message.title.CLUSTER_DISABLE_PROVISIONER") + " [ " + task.name + " ]"
        } else {
          return this.$t("message.title.CLUSTER_DISABLE_COMPONENT") + " [ " + task.name + " ]"
        }
      } else {
        if (task.tasklogs.type.indexOf("storage") !== -1) {
          return this.$t("message.title.CLUSTER_ENABLE_PROVISIONER") + " [ " + task.name + " ]"
        } else {
          return this.$t("message.title.CLUSTER_ENABLE_COMPONENT") + " [ " + task.name + " ]"
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
<style scoped lang="scss">
</style>
