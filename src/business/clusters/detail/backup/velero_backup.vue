<template>
  <div>
    <el-row>
      <h3>{{$t('cluster.detail.backup.velero_list')}}</h3>
      <el-button-group>
        <el-button size="small" @click="onCreate()" v-permission="['ADMIN']">{{ $t("commons.button.create") }}</el-button>
      </el-button-group>
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
        <fu-table-operations  fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
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
    <div>
      <el-dialog :title="$t('commons.button.create')" width="50%" :visible.sync="openCreate" v-loading="loading">
        <el-form ref="form" label-position="left" :model="form" label-width="180px" :rules="rules">
          <el-form-item :label="$t('commons.table.name')" prop="name">
            <el-input v-model="form.name"></el-input>
            <div><span class="input-help">{{ $t("commons.validate.name_help") }}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_type')" prop="type">
            <el-select style="width: 100%" v-model="form.type">
              <el-option :value="'Normal'" :label="$t('cluster.detail.backup.velero_type_normal')"></el-option>
              <el-option :value="'Schedule'" :label="$t('cluster.detail.backup.velero_type_schedule')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_schedule_cycle')" prop="schedule" v-if="form.type==='Schedule'">
            <el-input v-model="form.schedule" :placeholder="'eg: 0 3 * * * ('+ $t('cluster.detail.backup.velero_schedule_help')+')'" ></el-input>
          </el-form-item>
          <el-divider>{{ $t("cluster.detail.backup.velero_help") }}</el-divider>
          <el-form-item :label="$t('cluster.detail.backup.velero_namespace_include')" prop="includeNamespaces">
            <el-select style="width: 100%" v-model="form.includeNamespaces" multiple>
              <el-option v-for="item in namespaces" :key="item.metadata.name" :value="item.metadata.name"
                         :label="item.metadata.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_namespace_exclude')" prop="excludeNamespaces">
            <el-select style="width: 100%" v-model="form.excludeNamespaces" multiple>
              <el-option v-for="item in namespaces" :key="item.metadata.name" :value="item.metadata.name"
                         :label="item.metadata.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_resource_include')" prop="includeResources">
            <el-input v-model="form.includeResources" placeholder="eg: deployments,pods,services"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_resource_exclude')" prop="excludeResources">
            <el-input v-model="form.excludeResources" placeholder="eg: deployments,pods,services"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_backup_retention')" prop="ttl">
            <el-select style="width: 100%" v-model="form.ttl">
              <el-option v-for="item in ttls" :key="item.key" :value="item.value" :label="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_backup_labels')" prop="labels">
            <el-input v-model="form.labels" placeholder="eg: backup=day,user=admin"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_backup_Selector')" prop="selector">
            <el-input v-model="form.selector" placeholder="eg: app=nginx,resource=normal"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.backup.velero_backup_setting')" prop="selector">
            <el-checkbox v-model="form.includeClusterResources">{{$t('cluster.detail.backup.velero_include_cluster_resource')}}</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="openCreate = false">{{ $t("commons.button.cancel") }}</el-button>
          <el-button type="primary" @click="submit()">{{ $t("commons.button.ok") }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {
  createVeleroBackup, createVeleroSchedule,
  deleteVeleroBackup,
  getVeleroBackupDescribe,
  getVeleroBackupLogs,
  getVeleroBackups, restore
} from "@/api/cluster/backup"
import {listNamespace} from "@/api/cluster/namespace"
import Rule from "@/utils/rules"

export default {
  name: "VeleroBackup",
  components: { ComplexTable },
  props: {},
  data () {
    return {
      clusterName: "",
      items: [],
      openDetail: false,
      openCreate: false,
      detail: "",
      namespaces: [],
      loading: false,
      form: {
        includeClusterResources:true,
      },
      rules: {
        name: [Rule.NameRule],
        type: [Rule.RequiredRule],
        schedule: [Rule.RequiredRule],
      },
      ttls: [
        { key: "7 days", value: "168h0m0s" },
        { key: "30 days", value: "720h0m0s" },
        { key: "60 days", value: "1440h0m0s" },
        { key: "90 days", value: "2160h0m0s" },
      ],
      buttons:[
        {
          label: this.$t("cluster.detail.backup.recover"),
          icon: "el-icon-refresh-left",
          click: (row) => {
            this.onRestore(row.metadata.name)
          },
        },
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
    search () {
      this.items = []
      getVeleroBackups(this.clusterName).then(res => {
        if (res.kind === 'BackupList') {
          this.items = res.items
        }else {
          this.items.push(res)
        }
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
    },
    onCreate () {
      this.form = {
        includeClusterResources:true
      }
      listNamespace(this.clusterName).then(res => {
        this.namespaces = res.items
      })
      this.openCreate = true
    },
    submit () {
      this.loading = true
      const ps = []
      if (this.form.type === 'Normal'){
        ps.push(createVeleroBackup(this.clusterName, this.form))
      }else {
        ps.push(createVeleroSchedule(this.clusterName, this.form))
      }
      Promise.all(ps).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.create_success"),
        })
        this.openCreate = false
      })
        .finally(() => {
          this.loading = false
        })
    },
    onDelete(name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        deleteVeleroBackup(this.clusterName,name).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.delete_success"),
          })
          this.search()
        })
      })
    },
    onRestore(name) {
      this.$confirm(this.$t("cluster.detail.backup.restore_message"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const item = {
          backupName : name
        }
        restore(this.clusterName,item).then(() => {
          this.$message({
            type: "success",
            message: this.$t("cluster.detail.backup.recover_success"),
          })
          this.search()
        })
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