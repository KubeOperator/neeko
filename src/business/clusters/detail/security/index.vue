<template>
  <div>
    <template>
      <el-button-group>
        <el-button size="small" @click="cisCreate()">{{$t('commons.button.create')}}</el-button>
      </el-button-group>
    </template>
    <complex-table style="margin-top: 20px" :data="data" @search="search" :pagination-config="paginationConfig">
      <el-table-column label="ID" min-width="100" prop="id" fix>
        <template v-slot:default="{row}">
          <el-button v-if="row.status ==='Success'" type="text" @click="cisDetail(row)">{{row.id}}</el-button>
          <span v-if="row.status !=='Success'" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.start_time')" min-width="100" prop="startTime" fix>
        <template v-slot:default="{row}">
          {{ row.startTime | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.end_time')" min-width="100" prop="endTime" fix>
        <template v-slot:default="{row}">
          <span v-if="row.status !=='Running'">{{ row.endTime | datetimeFormat }}</span>
          <span v-if="row.status ==='Running'">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
        <template v-slot:default="{row}">
          <span style="margin: 12px">{{row.status}}
            <i v-if="row.status.phase === 'Running'" class="el-icon-loading" />
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :title="$t('cluster.detail.security.cis_result')" width="70%" :visible.sync="dialogDetailVisible">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-progress :stroke-width="12" type="circle" :percentage="passPercent"></el-progress>
        </el-col>
      </el-row>
      <complex-table style="margin-top: 20px" :data="results">
        <el-table-column :label="$t('cluster.detail.security.code')" min-width="10%" prop="number" />
        <el-table-column :label="$t('commons.table.status')" min-width="10%" prop="status" />
        <el-table-column :label="$t('cluster.detail.security.description')" min-width="40%" prop="desc" />
        <el-table-column :label="$t('cluster.detail.security.advise')" min-width="40%" prop="remediation" />
      </complex-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listCisByPage, cisCreate, cisDelete } from "@/api/cluster/security"

export default {
  name: "ClusterSecurity",
  components: { ComplexTable },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.onDelete(row)
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      data: [],
      results: [],
      clusterName: "",
      passPercent: 0,
      dialogDetailVisible: false,
    }
  },
  methods: {
    search() {
      const { currentPage, pageSize } = this.paginationConfig
      listCisByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    cisCreate() {
      cisCreate(this.clusterName).then(
        () => {
          this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
          this.search()
        },
        (error) => {
          this.$message({ type: "error", message: error })
        }
      )
    },
    onDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        cisDelete(this.clusterName, row.id).then(
          () => {
            this.$message({ type: "success", message: this.$t("commons.msg.delete_success") })
            this.search()
          },
          (error) => {
            this.$message({ type: "error", message: error })
          }
        )
      })
    },
    cisDetail(row) {
      let passCount = 0
      for (const result of row.results) {
        if (result.status === "PASS") {
          passCount++
        }
      }
      this.passPercent = Math.round((passCount / row.results.length) * 100)
      this.results = row.results
      this.dialogDetailVisible = true
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        for (const item of this.data) {
          if (item.status === "Running") {
            flag = true
          }
        }
        if (flag) {
          this.search()
        }
      }, 10000)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
</style>
