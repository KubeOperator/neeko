<template>
  <layout-content>
    <complex-table
      :data="data"
      :colums="columns"
      :pagination-config="paginationConfig"
      :search-config="searchConfig"
      @search="search"
    >
      <template #header>
        <el-button-group>
          <el-button
            size="small"
            round
          >{{
            $t("commons.button.create")
            }}</el-button>
          <el-button
            size="small"
            round
          >
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column
        type="selection"
        fix
      > </el-table-column>
      <el-table-column
        :label="$t('commons.table.name')"
        mix-width="100"
      >
        <template v-slot:default="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('automatic.cloud_provider')"
        mix-width="100"
        v-slot:default="{ row }"
      >
        {{ row.regionVars['provider'] }}
      </el-table-column>
      <el-table-column
        :label="$t('automatic.datacenter')"
        mix-width="100"
        v-slot:default="{ row }"
      >
        {{ row.datacenter }}
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations
        :buttons="buttons"
        :label="$t('commons.table.action')"
      />
    </complex-table>
  </layout-content>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listRegions } from "@/api/region"
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
          label: "",
          icon: "el-icon-delete",
          type: "danger"
        }
      ],
      searchConfig: {
        quickPlaceholder: "按 姓名/邮箱 搜索",
        components: [
          {
            field: "name",
            label: "姓名",
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "status",
            label: "状态",
            component: "FuComplexSelect",
            options: [
              { label: "运行中", value: "Running" },
              { label: "成功", value: "Success" },
              { label: "失败", value: "Fail" }
            ],
            multiple: true
          },
          {
            field: "create_time",
            label: "创建时间",
            component: "FuComplexDateTime"
          }
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      data: []
    }
  },
  methods: {
    search(condition) {
      console.log(condition)
      const { currentPage, pageSize } = this.paginationConfig
      listRegions(currentPage, pageSize).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    }
  },
  created() {
    this.search()
  }
}
</script>
