<template>
  <layout-content :header="$t('automatic.template_config.name')" v-loading="loading">
    <complex-table :data="data" :pagination-config="paginationConfig" :search-config="searchConfig" @search="search"
                   :selects.sync="selects">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()" :disabled="selects.length===0">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100" prop="name">
        <template v-slot:default="{ row }">
          <el-link type="info" @click="openDetailPage(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.type')" mix-width="100" prop="type">
        <template v-slot:default="{row}">
          <cloud-providers :provider="row.type"></cloud-providers>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
    </complex-table>
    <el-dialog :title="$t('automatic.detail')" :visible.sync="openDetail">
      <div style=" text-align: center;">
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.cloud_provider") }}</td>
              <td>{{ item.type }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.template_config.template_name") }}</td>
              <td>{{ item.config.name }}</td>
            </tr>
            <tr v-if="item.type==='vSphere'">
              <td>{{ $t("automatic.template_config.vmdk_path") }}</td>
              <td>{{ item.config.vmdk_path }}</td>
            </tr>
            <tr v-if="item.type==='vSphere'">
              <td>{{ $t("automatic.template_config.ovf_path") }}</td>
              <td>{{ item.config.ovf_path }}</td>
            </tr>
            <tr v-if="item.type==='OpenStack'">
              <td>{{ $t("automatic.template_config.qcow2_path") }}</td>
              <td>{{ item.config.qcow2_path }}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {getTemplate, searchTemplates} from "@/api/template-config"
import CloudProviders from "@/components/cloud-providers"

export default {
  name: "TemplateList",
  components: { CloudProviders, ComplexTable, LayoutContent },
  props: {},
  data () {
    return {
      loading: false,
      data: [],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          {
            field: "name",
            label: this.$t("commons.table.name"),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "created_at",
            label: this.$t("commons.table.create_time"),
            component: "FuComplexDate",
            valueFormat: "yyyy-MM-dd"
          }
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selects: [],
      openDetail: false,
      item: {
        config: {}
      }
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, PageSize } = this.paginationConfig
      searchTemplates(currentPage, PageSize, condition).then(res => {
        this.loading = false
        this.data = res.items
        this.paginationConfig.total = res.total
      })
    },
    create () {
      this.$router.push({ path: "/automatic/templates/operate" })
    },
    del () {

    },
    openDetailPage (row) {
      this.loading = true
      getTemplate(row.name).then(res => {
        this.item = res
        this.openDetail = true
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>
