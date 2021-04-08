<template>
  <el-row>
    <el-tabs tab-position="left" v-model="resourceType" @tab-click="changeTab()">
      <el-tab-pane :label="$t('host.host')" name="HOST">
        <complex-table
                :data="data"
                :colums="columns"
                :pagination-config="paginationConfig"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                @search="getProjectResourceList">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0" @click="openDelete()">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('cluster.cluster')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.clusterName }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.ip')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.ip }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.vm_config.cpu')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.cpuCore }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.vm_config.memory')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.memory }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.gpu')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.gpuNum }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.os')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.os }}{{ row.osVersion }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('automatic.plan.name')" name="PLAN" v-if="authObj">
        <complex-table
                :data="data"
                :colums="columns"
                :pagination-config="paginationConfig"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                @search="getProjectResourceList">
          <template #header v-if="authObj.type !== 'CLUSTER'">
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0" @click="openDelete()">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.plan.deploy_template')" mix-width="100">
            <template v-slot:default="{ row }">
              <el-tag type="info" size="small">
                {{ $t("automatic.plan." + row.deployTemplate) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.create_time')">
            <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('backup_account.name')" name="BACKUP_ACCOUNT">
        <complex-table
                :data="data"
                :colums="columns"
                :pagination-config="paginationConfig"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                @search="getProjectResourceList">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0" @click="openDelete()">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('backup_account.bucket')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.bucket }}</template>
          </el-table-column>
          <el-table-column :label="$t('backup_account.type')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.type }}</template>
          </el-table-column>
          <el-table-column :label="$t('backup_account.status')" mix-width="100">
            <template v-slot:default="{ row }">
              <el-tag type="info" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.create_time')">
            <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
            :visible="openCreatePage"
            :title="$t('project.add_project_resource')"
            width="30%"
            @close="cancel">
      <el-select
              v-model="form.names"
              size="medium"
              multiple
              filterable
              style="width:100%">
        <el-option
                v-for="(item,index) in resources"
                :key="index"
                :value="item.name">
          <span style="float: left">{{ item.name }}</span>
          <span v-if="resourceType==='HOST'" style="color: #8492a6; font-size: 13px">
            {{ "\u00a0\u00a0\u00a0" + item.ip }}
          </span>
          <span v-if="resourceType==='PLAN'" style="color: #8492a6; font-size: 13px">
            {{ "\u00a0\u00a0\u00a0" + $t("automatic.plan." + item.deployTemplate) }}
          </span>
          <span v-if="resourceType==='BACKUP_ACCOUNT'"
                style="color: #8492a6; font-size: 13px">{{ "\u00a0\u00a0\u00a0" + item.bucket }}</span>
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">{{ $t("commons.button.cancel") }}</el-button>
          <el-button type="primary" @click="submit">{{ $t("commons.button.save") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {
  listProjectResources,
  getResourceList,
  createProjectResource,
  deleteProjectResource
} from "@/api/project-resource"

import {
  listClusterResources,
  createClusterResource,
  deleteClusterResource,
  getResourceAddList
} from "@/api/cluster-resource"

export default {
  name: "ResourceList",
  components: { ComplexTable },
  props: ["authObj"],
  data () {
    return {
      columns: [],
      buttons: [],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      resourceType: "HOST",
      loading: false,
      selects: [],
      openCreatePage: false,
      searchResourceLoading: false,
      resources: [],
      form: {
        names: []
      }
    }
  },
  created () {
    this.getProjectResourceList()
  },
  methods: {
    getProjectResourceList () {
      this.data = []
      this.loading = true
      this.selects = []
      const { currentPage, pageSize } = this.paginationConfig
      if (this.authObj.type === "PROJECT") {
        listProjectResources(this.authObj.projectName, this.resourceType, currentPage, pageSize).then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
          this.loading = false
        })
      }
      if (this.authObj.type === "CLUSTER") {
        listClusterResources(this.authObj.projectName, this.authObj.clusterName, this.resourceType, currentPage, pageSize).then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
          this.loading = false
        })
      }
    },
    handleSelectionChange (val) {
      this.selects = val
    },
    create () {
      if (this.authObj.type === "PROJECT") {
        getResourceList(this.authObj.projectName, this.resourceType).then(data => {
          this.resources = data
          this.openCreatePage = true
        })
      }
      if (this.authObj.type === "CLUSTER") {
        getResourceAddList(this.authObj.projectName, this.authObj.clusterName, this.resourceType).then(data => {
          this.resources = data
          this.openCreatePage = true
        })
      }
    },
    cancel () {
      this.openCreatePage = false
      this.form.names = []
      this.resources = []
    },
    submit () {
      if (this.authObj.type === "PROJECT") {
        createProjectResource(this.authObj.projectName, {
          resourceType: this.resourceType,
          names: this.form.names
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.getProjectResourceList()
          this.cancel()
        })
      }
      if (this.authObj.type === "CLUSTER") {
        createClusterResource(this.authObj.projectName, this.authObj.clusterName, {
          resourceType: this.resourceType,
          names: this.form.names
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.getProjectResourceList()
          this.cancel()
        })
      }
    },
    openDelete () {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning"
      }).then(() => {
        const ps = []
        for (const item of this.selects) {
          if (this.authObj.type === "PROJECT") {
            ps.push(deleteProjectResource(this.authObj.projectName, item.name, this.resourceType))
          }
          if (this.authObj.type === "CLUSTER") {
            ps.push(deleteClusterResource(this.authObj.projectName, this.authObj.clusterName, item.name, this.resourceType))
          }
        }
        Promise.all(ps).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.delete_success"),
          })
          this.getProjectResourceList()
        })
      })
    },
    changeTab () {
      this.paginationConfig = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.getProjectResourceList()
    }
  },
  computed: {},
  watch: {
    authObj () {
      this.getProjectResourceList()
    },
  }
}
</script>

<style scoped>

</style>