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
                <span size="small">{{ $t(`cluster.condition.${row.task}`) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('commons.table.status')">
              <template v-slot:default="{row}">
                <span size="small">{{ $t(`commons.status.${row.status}`) }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.table.create_time')" prop="createdAt" min-width="100">
              <template v-slot:default="{row}">
                {{ row.createdAt | datetimeFormat }}
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.table.create_time')" prop="updatedAt" min-width="100">
              <template v-slot:default="{row}">
                {{ row.updatedAt | datetimeFormat }}
              </template>
            </el-table-column>
            <el-table-column sortable :label="$t('commons.table.spend_time')" min-width="100">
              <template v-slot:default="{row}">
                {{ loadTimeSpend(row.createdAt, row.updatedAt) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.tag.task')">
        <template v-slot:default="{row}">
          <span v-if="searchForm.logtype === 'single-task'" size="small">{{ $t(`cluster.condition.${row.tasklogs.type}`) }}</span>
          <span v-else size="small">{{ row.tasklogs.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')">
        <template v-slot:default="{row}">
          <span size="small">{{ $t(`commons.status.${row.tasklogs.phase}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.event.msg_info')">
        <template v-slot:default="{row}">
          <span size="small">{{ row.tasklogs.message | errorFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.create_time')" prop="createdAt" min-width="100">
        <template v-slot:default="{row}">
          {{ row.tasklogs.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.create_time')" prop="updatedAt" min-width="100">
        <template v-slot:default="{row}">
          {{ row.tasklogs.updatedAt | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.spend_time')" min-width="100">
        <template v-slot:default="{row}">
          {{ loadTimeSpend(row.tasklogs.createdAt, row.tasklogs.updatedAt) }}
        </template>
      </el-table-column>
      <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getTasks } from "@/api/cluster"
import ComplexTable from "@/components/complex-table"
import { openLoggerWithID } from "@/api/cluster"

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
    }
  },
  methods: {
    create() {
      this.$router.push({ name: "UserCreate" })
    },
    openXterm(row) {
      openLoggerWithID(row.name, row.id)
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
    loadTimeSpend(createAt, endAt) {
      let diff = new Date(endAt) - new Date(createAt)
      return diff / 1000 + " S"
    },
  },
  created() {
    this.search()
  },
}
</script>
<style scoped lang="scss">
</style>
