<template>
  <div>
    <el-row>
      <h3>{{$t('cluster.detail.backup.velero_schedule')}}</h3>
      <div>
        <div style="float: right">
          <el-button size="small" icon="el-icon-refresh" circle @click="search()" v-permission="['ADMIN']" :disabled="loading">
          </el-button>
        </div>
      </div>
      <complex-table  :data="items" v-loading="loading">
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
            <el-link type="info" @click="describe(row.metadata.name)">
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
        <fu-table-operations  fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
      </complex-table>
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
    </el-row>
  </div>
</template>

<script>
import {
  delVeleroRestore, getRestores, getVeleroRestoreDescribe, getVeleroRestoreLogs,
} from "@/api/cluster/backup"
import ComplexTable from "@/components/complex-table"

export default {
  name: "VeleroRestore",
  components: {ComplexTable},
  props: {},
  data () {
    return {
      openDetail: false,
      detail: "",
      items:[],
      loading: false,
      buttons:[
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row.metadata.name)
          },
        },
      ]
    }
  },
  methods: {
    search(){
      this.loading = true
      getRestores(this.clusterName).then(res => {
        if (res.kind === 'RestoreList') {
          this.items = res.items
        }else {
          this.items.push(res)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    describe(name){
      getVeleroRestoreDescribe(this.clusterName,name).then(res => {
        this.detail = res
        this.openDetail = true
      })
    },
    onDelete(name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        delVeleroRestore(this.clusterName,name).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.delete_success"),
          })
          this.search()
        })
      })
    },
    getVeleroLogs(name) {
      getVeleroRestoreLogs(this.clusterName, name).then(res => {
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
