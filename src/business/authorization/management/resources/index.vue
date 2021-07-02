<template>
  <el-row>
    <el-tabs tab-position="left" v-model="resourceType" @tab-click="changeTab()">
      <el-tab-pane :label="$t('host.host')" name="HOST">
        <complex-table
                :key="key"
                :data="data"
                :pagination-config="paginationConfig"
                v-loading="loading"
                :selects.sync="selects"
                @search="getProjectResourceList">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()" v-permission=role>
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0"  @click="openDelete()" v-permission=role>
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" min-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.ip')" min-width="100px">
            <template v-slot:default="{ row }">{{ row.ip }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.vm_config.cpu')" min-width="50">
            <template v-slot:default="{ row }">{{ row.cpuCore }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.vm_config.memory')" min-width="50">
            <template v-slot:default="{ row }">{{ row.memory }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.gpu')" min-width="50">
            <template v-slot:default="{ row }">{{ row.gpuNum }}</template>
          </el-table-column>
          <el-table-column :label="$t('host.os')">
            <template v-slot:default="{ row }">{{ row.os }}{{ row.osVersion }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('automatic.plan.name')" name="PLAN" v-if="authObj">
        <complex-table
                :key="key"
                :data="data"
                :pagination-config="paginationConfig"
                v-loading="loading"
                :selects.sync="selects"
                @search="getProjectResourceList">
          <template #header v-if="authObj.type !== 'CLUSTER'">
            <el-button-group>
              <el-button size="small" @click="create()" v-permission=role>
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0"  @click="openDelete()" v-permission="role">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="60">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.plan.deploy_template')"  mix-width="160">
            <template v-slot:default="{ row }">
                {{ $t("automatic.plan." + row.deployTemplate) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.create_time')" mix-width="60">
            <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('backup_account.name')" name="BACKUP_ACCOUNT">
        <complex-table
                :key="key"
                :data="data"
                :pagination-config="paginationConfig"
                v-loading="loading"
                :selects.sync="selects"
                @search="getProjectResourceList">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()" v-permission=role>
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" :disabled="selects.length === 0"  @click="openDelete()" v-permission="role">
                {{ $t("commons.button.delete") }}
              </el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('backup_account.table.bucket')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.bucket }}</template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.type')"  mix-width="70">
            <template v-slot:default="{row}">
              <svg v-if="row.type === 'OSS'" class="icon" aria-hidden="true">
                <use xlink:href="#iconoss"></use>
              </svg>
              <svg v-if="row.type === 'AZURE'" class="icon" aria-hidden="true">
                <use xlink:href="#iconAzure"></use>
              </svg>
              <svg v-if="row.type === 'SFTP'" class="icon" aria-hidden="true">
                <use xlink:href="#iconSFTP"></use>
              </svg>
              <svg v-if="row.type === 'S3'" class="icon" aria-hidden="true">
                <use xlink:href="#icons3"></use>
              </svg>
              &nbsp;&nbsp;&nbsp;&nbsp;<span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.status')" mix-width="40">
            <template v-slot:default="{row}">
              <div v-if="row.status === 'VALID'">
                <span class="iconfont iconduihao" style="color: #32B350"></span>
                {{ $t("commons.status.normal") }}
              </div>
              <div v-else>
                <span class="iconfont iconerror" style="color: #FA4147"></span>
                {{ $t("commons.status.failure") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.create_time')" mix-width="100">
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
          <el-button type="primary" @click="submit">{{ $t("commons.button.submit") }}</el-button>
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
      },
      key:0
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
  computed: {
    role: function () {
      if (this.authObj.type === "PROJECT") {
        return ["ADMIN"]
      } else {
        return ["ADMIN", "PROJECT_MANAGER"]
      }
    }
  },
  watch: {
    authObj () {
      this.key++
      this.getProjectResourceList()
    },
  }
}
</script>

<style scoped>

</style>
