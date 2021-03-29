<template>
  <layout-content :description="$t('automatic.region.description')" v-loading="loading">
    <complex-table
      :data="data"
      :colums="columns"
      :pagination-config="paginationConfig"
      :search-config="searchConfig"
      @search="search"
    >
      <template #header>
          <el-button size="small" @click="create()">
            {{$t("commons.button.create") }}
          </el-button>
<!--          <el-button size="small">{{ $t("commons.button.delete") }}</el-button>-->
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column
        :label="$t('automatic.cloud_provider')"
        mix-width="100"
        v-slot:default="{ row }"
      >{{ row.regionVars['provider'] }}</el-table-column>
      <el-table-column
        :label="$t('automatic.datacenter')"
        mix-width="100"
        v-slot:default="{ row }"
      >{{ row.datacenter }}</el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
  </layout-content>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { searchRegion, deleteRegionBy } from "@/api/region"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "RegionList",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit"
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: this.openDelete
        }
      ],
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
            field: "create_time",
            label: this.$t("commons.table.create_time"),
            component: "FuComplexDateTime"
          }
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      data: [],
      loading: false
    }
  },
  methods: {
    search(condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchRegion(currentPage, pageSize,condition).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({ path: "/automatic/regions/create" })
    },
    openDelete(row) {
      this.$confirm(
        this.$t("commons.confirm_message.delete"),
        this.$t("commons.message_box.prompt"),
        {
          confirmButtonText: this.$t("commons.button.confirm"),
          cancelButtonText: this.$t("commons.button.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deleteRegionBy(row.name).then(() => {
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success")
            })
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("commons.msg.delete_cancel")
          })
        })
    }
  },
  created() {
    this.search()
  }
}
</script>
