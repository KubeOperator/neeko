<template>
  <layout-content :header="$t('route.task')">
    <el-button-group>
      <el-button icon="el-icon-tickets" @click="search('single-task')">Single-Task</el-button>
      <el-button icon="el-icon-document-copy" @click="search('multi-task')">Multi-Task</el-button>
    </el-button-group>
    <complex-table :key="refresh" :data="data" :pagination-config="paginationConfig" @search="search" v-loading="loading" :fit="true">
      <el-table-column v-if="searchForm.logtype === 'single-task'" type="expand">
        <template slot-scope="props">
          <el-table :show-header="false" :data="props.row.tasklogs.details" style="width: 100%">
            <el-table-column :label="$t('cluster.detail.tag.task')">
              <template v-slot:default="{row}">
                <span size="small">{{ $t(`task.${row.task}`) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('commons.table.status')">
              <template v-slot:default="{row}">
                <span size="small">{{ $t(`commons.status.${row.status}`) }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.search.time_start')" prop="startTime" min-width="100">
              <template v-slot:default="{row}">
                {{ row.startTime | timeStampFormat }}
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.search.time_end')" prop="endTime" min-width="100">
              <template v-slot:default="{row}">
                <span v-if="row.endTime === 0"> - </span>
                <span v-else>{{ row.endTime | timeStampFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.table.spend_time')" min-width="100">
              <template v-slot:default="{row}">
                {{ loadTimeSpend(row.startTime, row.endTime) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.tag.task')">
        <template v-slot:default="{row}">
          <span v-if="searchForm.logtype === 'single-task'" size="small">{{ $t(`task.${row.tasklogs.type}`) }}</span>
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
      <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
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
        <div><span style="font-weight: bold">info</span></div>
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
import { getTasks } from "@/api/tasks"
import ComplexTable from "@/components/complex-table"
import { openLoggerWithID } from "@/api/tasks"
import { ansibleErrFormat } from "@/utils/format_ansible_err"

export default {
  name: "UserList",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.log"),
          icon: "el-icon-monitor",
          click: (row) => {
            this.openXterm(row)
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      searchForm: {
        cluster: "",
        logtype: "single-task",
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
    create() {
      this.$router.push({ name: "UserCreate" })
    },
    openXterm(row) {
      if (row.tasklogs.type.indexOf(" (enable)") !== -1) {
        openLoggerWithID(row.tasklogs.clusterID, row.tasklogs.id+ " (enable)")
        return
      }
      openLoggerWithID(row.tasklogs.clusterID, row.tasklogs.id)
    },
    search(type) {
      this.searchForm.logtype = type ? type : "single-task"
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      getTasks(currentPage, pageSize, this.searchForm.cluster, this.searchForm.logtype).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
        this.refresh = !this.refresh
      })
    },
    getStatus(row) {
      this.formatMsgs = ansibleErrFormat(row.tasklogs.message)[0]
      this.dialogVisible = true
    },
    loadTimeSpend(start, end) {
      if (end == 0) {
        return "-"
      }
      return end - start + " S"
    },
  },
  created() {
    this.search()
  },
}
</script>
<style scoped lang="scss">
</style>
