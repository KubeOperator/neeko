<template>
  <div>
    <el-row>
      <h3>{{ $t("cluster.detail.backup.velero_list") }}</h3>
      <complex-table :data="items" v-loading="loading" :selects.sync="selects">
        <template #header>
          <el-button-group>
            <el-button size="small" @click="onCreate()" v-permission="['ADMIN']">
              {{ $t("commons.button.create") }}
            </el-button>
            <el-button size="small" @click="onDelete()" :disabled="selects.length===0">
              {{ $t("commons.button.delete") }}
            </el-button>
          </el-button-group>
        </template>
        <el-table-column type="selection" fix></el-table-column>
        <el-table-column :label="$t('commons.table.name')">
          <template v-slot:default="{row}">
            <el-link type="info" @click="getVeleroDescribe(row)">
              {{ row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.type')">
          <template v-slot:default="{row}">
            <span v-if="row.kind === 'Backup'">{{$t('cluster.detail.backup.velero_type_normal')}}</span>
            <span v-if="row.kind === 'Schedule'">{{$t('cluster.detail.backup.velero_type_schedule') + '  (' + row.spec.schedule + ')'}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.status')">
          <template v-slot:default="{row}">
            <span v-if="row.status.phase">{{ row.status.phase }}</span>
            <span v-else>New</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.create_time')">
          <template v-slot:default="{row}">
            {{ row.metadata.creationTimestamp  | datetimeFormat }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('cluster.detail.backup.velero_log')">
          <template v-slot:default="{row}">
            <el-link type="info" @click="getVeleroLogs(row.metadata.name)">
              {{ $t("cluster.detail.backup.velero_detail") }}
            </el-link>
          </template>
        </el-table-column>
        <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
      </complex-table>
    </el-row>

    <el-dialog :title="$t('cluster.detail.backup.velero_detail')" width="80%" :visible.sync="openLog">
      <div style="overflow: scroll;height: 700px">
        <span style="white-space:pre">{{ detail }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openLog = false">{{ $t("commons.button.ok") }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('cluster.detail.backup.velero_detail')" width="50%" :visible.sync="openDetail">
      <el-row v-if="showForm">
        <el-col :span="2"><br /></el-col>
        <el-col :span="16">
          <el-form label-position="left" label-width="180px">
            <el-form-item :label="$t('commons.table.name')">
              <span>{{detailForm.metadata.name}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_type')">
              <span v-if="detailForm.kind === 'Backup'">{{$t('cluster.detail.backup.velero_type_normal')}}</span>
              <span v-if="detailForm.kind === 'Schedule'">{{$t('cluster.detail.backup.velero_type_schedule')}}</span>
            </el-form-item>

            <el-form-item :label="$t('cluster.detail.backup.velero_schedule_cycle')" v-if="detailForm.kind==='Schedule'">
              <span>{{detailForm.spec.schedule}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_namespace_include')">
              <span v-if="detailForm.kind==='Backup'">{{joinSplits(detailForm.spec.includedNamespaces)}}</span>
              <span v-else>{{joinSplits(detailForm.spec.template.includedNamespaces)}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_namespace_exclude')">
              <span v-if="detailForm.kind==='Backup'">{{joinSplits(detailForm.spec.excludedNamespaces)}}</span>
              <span v-else>{{joinSplits(detailForm.spec.template.excludedNamespaces)}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_resource_include')">
              <span v-if="detailForm.kind==='Backup'">{{joinSplits(detailForm.spec.includedResources)}}</span>
              <span v-else>{{joinSplits(detailForm.spec.template.includedResources)}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_resource_exclude')">
              <span v-if="detailForm.kind==='Backup'">{{joinSplits(detailForm.spec.excludedResources)}}</span>
              <span v-else>{{joinSplits(detailForm.spec.template.excludedResources)}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.backup.velero_backup_retention')">
              <span>{{detailForm.ttl}}</span>
            </el-form-item>

            <el-form-item :label="$t('commons.table.status')">
              <span>{{detailForm.status.phase}}</span>
              <li v-for="pr of detailForm.status.validationErrors" :key="pr">
                {{pr}}
              </li>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.security.start_time')">
              <span>{{detailForm.status.startTimestamp | datetimeFormat}}</span>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.security.end_time')">
              <span>{{detailForm.status.completionTimestamp | datetimeFormat}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="!showForm">
        <div style="overflow: scroll;height: 700px">
          <span style="white-space:pre">{{ detailForm }}</span>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button v-if="showForm" @click="showForm = false">{{ $t("commons.button.more") }}</el-button>
        <el-button v-if="!showForm" @click="showForm = true">{{ $t("commons.button.back_to_form") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.create')" width="50%" :visible.sync="openCreate" v-loading="loading">
      <el-form ref="form" label-position="left" :model="form" label-width="180px" :rules="rules">
        <el-form-item :label="$t('commons.table.name')" prop="name">
          <el-input v-model="form.name"></el-input>
          <div><span class="input-help">{{ $t("commons.validate.common_name_help") }}</span></div>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.backup.velero_type')" prop="type">
          <el-select style="width: 100%" v-model="form.type">
            <el-option :value="'Normal'" :label="$t('cluster.detail.backup.velero_type_normal')"></el-option>
            <el-option :value="'Schedule'" :label="$t('cluster.detail.backup.velero_type_schedule')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.backup.velero_schedule_cycle')" prop="schedule" v-if="form.type==='Schedule'">
          <el-input v-model="form.schedule" :placeholder="'eg: 0 3 * * * ('+ $t('cluster.detail.backup.velero_schedule_help')+')'"></el-input>
        </el-form-item>
        <el-divider>{{ $t("cluster.detail.backup.velero_help") }}</el-divider>
        <el-form-item :label="$t('cluster.detail.backup.velero_namespace_include')" prop="includeNamespaces">
          <el-select style="width: 100%" v-model="form.includeNamespaces" multiple @change="chooseNs()">
            <el-option v-for="item in namespaces" :key="item.name" :value="item.name" :label="item.name" :disabled="item.checked">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.backup.velero_namespace_exclude')" prop="excludeNamespaces">
          <el-select style="width: 100%" v-model="form.excludeNamespaces" multiple @change="chooseNs()">
            <el-option v-for="item in namespaces" :key="item.name" :value="item.name" :label="item.name" :disabled="item.checked">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.backup.velero_resource_include')" prop="includeResources">
          <el-select style="width: 100%" v-model="form.includeResources" multiple @change="chooseResource()">
            <el-option v-for="item in resources" :key="item.name" :value="item.name" :label="item.name" :disabled="item.checked">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.backup.velero_resource_exclude')" prop="excludeResources">
          <el-select style="width: 100%" v-model="form.excludeResources" multiple @change="chooseResource()">
            <el-option v-for="item in resources" :key="item.name" :value="item.name" :label="item.name" :disabled="item.checked">
            </el-option>
          </el-select>
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
          <el-checkbox v-model="form.includeClusterResources">
            {{ $t("cluster.detail.backup.velero_include_cluster_resource") }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openCreate = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submit()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { createVeleroBackup, deleteVeleroBackup, getVeleroBackupLogs, getVeleroBackups, restore } from "@/api/cluster/backup"
import { listNamespace } from "@/api/cluster/namespace"
import Rule from "@/utils/rules"

export default {
  name: "VeleroBackup",
  components: { ComplexTable },
  props: {},
  data() {
    return {
      clusterName: "",
      items: [],
      selects: [],
      openDetail: false,
      openLog: false,
      openCreate: false,
      detail: "",
      namespaces: [],
      loading: false,
      form: {
        name: "",
        type: "",
        cluster: "",
        includeNamespaces: [],
        excludeNamespaces: [],
        includeResources: [],
        excludeResources: [],
        includeClusterResources: true,
        labels: "",
        selector: "",
        ttl: "",
        schedule: "",
        backupName: "",
      },
      detailForm: {
        kind: "",
        metadata: {},
        spec: {
          template: {},
        },
        status: {},
      },
      showForm: true,
      rules: {
        name: [Rule.ClusterNameRule],
        type: [Rule.RequiredRule],
        schedule: [Rule.RequiredRule],
      },
      ttls: [
        { key: "7 days", value: "168h0m0s" },
        { key: "30 days", value: "720h0m0s" },
        { key: "60 days", value: "1440h0m0s" },
        { key: "90 days", value: "2160h0m0s" },
      ],
      resources: [
        { name: "services", checked: false },
        { name: "deployments", checked: false },
        { name: "configmaps", checked: false },
        { name: "persistentvolumeclaims", checked: false },
        { name: "persistentvolumes", checked: false },
        { name: "replicationcontrollers", checked: false },
        { name: "resourcequotas", checked: false },
        { name: "secrets", checked: false },
        { name: "serviceaccounts", checked: false },
        { name: "daemonsets", checked: false },
        { name: "replicasets", checked: false },
        { name: "statefulsets", checked: false },
        { name: "cronjobs", checked: false },
        { name: "jobs", checked: false },
        { name: "ingresses", checked: false },
      ],
      buttons: [
        {
          label: this.$t("cluster.detail.backup.recover"),
          icon: "el-icon-refresh-left",
          click: (row) => {
            this.onRestore(row.metadata.name)
          },
        },
      ],
    }
  },
  methods: {
    search() {
      this.items = []
      this.loading = true
      getVeleroBackups(this.clusterName)
        .then((res) => {
          this.items = res.items
        })
        .finally(() => {
          this.loading = false
        })
    },
    joinSplits(item) {
      if (item) {
        return item.join(",")
      }
    },
    getVeleroDescribe(row) {
      this.detailForm = row
      if (this.detailForm.metadata.managedFields) {
        delete this.detailForm.metadata.managedFields
      }
      if (row.spec.ttl) {
        for (const t of this.ttls) {
          if (t.value === row.spec.ttl) {
            row.ttl = t.key
            break
          }
        }
      }
      if (row.spec.template?.ttl) {
        for (const t of this.ttls) {
          if (t.value === row.spec.template.ttl) {
            row.ttl = t.key
            break
          }
        }
      }
      this.openDetail = true
    },
    getVeleroLogs(backupName) {
      this.loading = true
      getVeleroBackupLogs(this.clusterName, backupName)
        .then((res) => {
          this.detail = res
          this.openLog = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCreate() {
      this.form = {
        includeClusterResources: true,
        includeNamespaces: [],
        excludeNamespaces: [],
        includeResources: [],
        excludeResources: [],
      }
      listNamespace(this.clusterName).then((res) => {
        for (const ns of res.items) {
          this.namespaces.push({
            name: ns.metadata.name,
            checked: false,
          })
        }
      })
      this.openCreate = true
    },
    chooseNs() {
      this.namespaces.forEach((ns) => {
        ns.checked = false
      })

      this.namespaces.forEach((ns) => {
        this.form.includeNamespaces.forEach((choose) => {
          if (choose === ns.name) {
            ns.checked = true
          }
        })
        this.form.excludeNamespaces.forEach((choose) => {
          if (choose === ns.name) {
            ns.checked = true
          }
        })
      })
    },
    chooseResource() {
      this.resources.forEach((re) => {
        re.checked = false
      })
      this.resources.forEach((re) => {
        this.form.includeResources.forEach((choose) => {
          if (choose === re.name) {
            re.checked = true
          }
        })
        this.form.excludeResources.forEach((choose) => {
          if (choose === re.name) {
            re.checked = true
          }
        })
      })
    },
    submit() {
      this.loading = true
      const ps = []
      if (this.form.type === "Normal") {
        ps.push(createVeleroBackup(this.clusterName, "backup", this.form))
      } else {
        ps.push(createVeleroBackup(this.clusterName, "schedule", this.form))
      }
      Promise.all(ps)
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.openCreate = false
        })
        .finally(() => {
          this.search()
          this.loading = false
        })
    },
    onDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (row) {
          ps.push(deleteVeleroBackup(this.clusterName, row.kind.toLowerCase(), row.metadata.name))
        } else {
          for (const item of this.selects) {
            ps.push(deleteVeleroBackup(this.clusterName, item.kind.toLowerCase(), item.metadata.name))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
          })
          .catch(() => {
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
          backupName: name,
        }
        restore(this.clusterName, item).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success"),
          })
          this.search()
        })
      })
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
