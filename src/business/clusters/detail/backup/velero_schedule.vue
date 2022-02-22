<template>
  <div>
    <el-row>
      <h3>{{$t('cluster.detail.backup.velero_schedule')}}</h3>
      <complex-table  :data="items" >
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
import {getVeleroScheduleDescribe, getVeleroSchedules} from "@/api/cluster/backup"
import ComplexTable from "@/components/complex-table"

export default {
  name: "VeleroSchedule",
  components: {ComplexTable},
  props: {},
  data () {
    return {
      openDetail: false,
      detail: "",
      items:[]
    }
  },
  methods: {
    search(){
      getVeleroSchedules(this.clusterName).then(res => {
        if (res.kind === 'ScheduleList') {
          this.items = res.items
        }else {
          this.items.push(res)
        }
      })
    },
    describe(name){
      getVeleroScheduleDescribe(this.clusterName,name).then(res => {
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
