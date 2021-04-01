<template>
  <el-row>
    <el-tabs tab-position="left" v-model="resourceType" @tab-click="listResourceList(resourceType)">
      <el-tab-pane :label="$t('host.host')" name="HOST">
        <complex-table
                :data="data"
                :colums="columns"
                :pagination-config="paginationConfig"
                v-loading="loading">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small" >{{ $t("commons.button.delete") }}</el-button>
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
      <el-tab-pane :label="$t('automatic.plan.name')" name="PLAN">
        <complex-table
                :data="data"
                :colums="columns"
                :pagination-config="paginationConfig"
                v-loading="loading">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small">{{ $t("commons.button.delete") }}</el-button>
            </el-button-group>
          </template>
          <el-table-column type="selection" fix></el-table-column>
          <el-table-column :label="$t('commons.table.name')" mix-width="100">
            <template v-slot:default="{ row }">{{ row.name }}</template>
          </el-table-column>
          <el-table-column :label="$t('automatic.plan.deploy_template')" mix-width="100">
            <template v-slot:default="{ row }">
              <el-tag type="info" size="small">
                {{ $t("automatic.plan."+row.deployTemplate) }}
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
                v-loading="loading">
          <template #header>
            <el-button-group>
              <el-button size="small" @click="create()">
                {{ $t("commons.button.create") }}
              </el-button>
              <el-button size="small">{{ $t("commons.button.delete") }}</el-button>
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
<!--                {{ $t("automatic.plan."+row.deployTemplate) }}-->
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('commons.table.create_time')">
            <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
          </el-table-column>
        </complex-table>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {listProjectResources} from "@/api/project-resource"

export default {
  name: "ResourceList",
  components: { ComplexTable },
  props: ["name", "type"],
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: this.openDelete
        }
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      resourceType: "HOST",
      loading: false
    }
  },
  created () {
    this.listResourceList(this.resourceType)
  },
  methods: {
    listResourceList (resourceType) {
      this.data = []
      this.loading = true
      this.paginationConfig = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      const { currentPage, pageSize } = this.paginationConfig
      if (this.type === "PROJECT") {
        listProjectResources(this.name, resourceType, currentPage, pageSize).then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
          this.loading = false
        })
      }
    },
  },
  computed: {
    resource () {
      const { name, type } = this
      return {
        name, type
      }
    }
  },
  watch: {
    resource: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.listResourceList(this.resourceType)
        }
      }
    },
  }
}
</script>

<style scoped>

</style>