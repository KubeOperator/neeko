<template>
  <div>
    <complex-table ref="nsData" v-loading="loading" :data="data">
      <el-table-column :label="$t('commons.table.name')" prop="name" fix />
      <el-table-column :label="$t('cluster.version')" prop="version" fix />
      <el-table-column :label="$t('commons.table.description')" min-width="300" prop="describe" fix />
      <el-table-column sortable :label="$t('commons.table.action')" prop="status.phase" fix>
        <template v-slot:default="{row}">
          <div v-if="row.status ==='enable'">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("commons.status.enable") }}
          </div>
          <div v-if="row.status ==='disable'">
            <el-button type="text" @click="startComponent(row)">{{$t("commons.button.enable")}}</el-button>
          </div>
          <div v-if="row.status === 'Waiting'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <span>{{ $t("commons.status.waiting") }}</span>
          </div>
          <div v-if="row.status ==='NotReady'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)">{{ $t("commons.status.not_ready") }}</el-link>
          </div>
          <div v-if="row.status ==='Initializing'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.initializing") }}</el-link>
          </div>
          <div v-if="row.status ==='Terminating'">
            <i class="el-icon-loading" />&nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="openXterm(row)"> {{ $t("commons.status.terminating") }}</el-link>
          </div>
        </template>
      </el-table-column>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { getComponents, createComponent } from "@/api/cluster"
import { openLoggerWithID } from "@/api/cluster"

export default {
  name: "ClusterNamespace",
  components: { ComplexTable },
  data() {
    return {
      loading: false,
      clusterName: "",
      data: [],
    }
  },
  methods: {
    search() {
      this.loading = true
      getComponents(this.clusterName)
        .then((data) => {
          this.data = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    openXterm(row) {
      openLoggerWithID(this.clusterName, row.id)
    },
    startComponent(row) {
      this.$confirm(this.$t("commons.confirm_message.enable_component", [row.name]), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          clusterName: this.clusterName,
          name: row.name,
          version: row.version,
        }
        createComponent(data)
          .then(() => {
            this.search()
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Waiting"]
        for (const item of this.data) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
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
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped>
</style>
