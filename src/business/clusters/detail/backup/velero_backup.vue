<template>
  <div>
    <el-row>
      <complex-table :data="items" @search="search">
        <el-table-column :label="$t('commons.table.name')">
          <template v-slot:default="{row}">
            {{ row.metadata.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.status')">
          <template v-slot:default="{row}">
            {{ row.status.phase }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.create_time')">
          <template v-slot:default="{row}">
            {{ row.metadata.creationTimestamp  | datetimeFormat }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('cluster.detail.backup.velero_describe')">
          <template v-slot:default="{row}">
            <el-link type="info" @click="getVeleroDescribe(row.metadata.name)">
              {{ $t("cluster.detail.backup.velero_detail") }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('cluster.detail.backup.velero_log')">
          <template v-slot:default="{row}">
            <el-link type="info" @click="getVeleroLogs(row.metadata.name)">
              {{ $t("cluster.detail.backup.velero_detail") }}
            </el-link>
          </template>
        </el-table-column>
      </complex-table>
    </el-row>
    <div>
      <el-dialog :title="$t('cluster.detail.backup.velero_detail')" width="80%" :visible.sync="openDetail">
        <div style="overflow: scroll;height: 700px">
          <span style="white-space:pre">{{ detail }}</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="openDetail = false">{{ $t("commons.button.ok") }}</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {getVeleroBackupDescribe, getVeleroBackupLogs, getVeleroBackups} from "@/api/cluster/backup"

export default {
  name: "VeleroBackup",
  components: { ComplexTable },
  props: {},
  data () {
    return {
      clusterName: "",
      items: [],
      openDetail: false,
      detail: ""
    }
  },
  methods: {
    search () {
      getVeleroBackups(this.clusterName).then(res => {
        this.items = res.items
      })
    },
    getVeleroDescribe (backupName) {
      getVeleroBackupDescribe(this.clusterName, backupName).then(res => {
        this.detail = res
        this.openDetail = true
      })
    },
    getVeleroLogs (backupName) {
      getVeleroBackupLogs(this.clusterName, backupName).then(res => {
        this.detail = res
        this.openDetail = true
      })
    }
  },
  created () {
    this.clusterName = this.$route.params.name
    this.search()
  }
}
</script>

<style scoped>

</style>
