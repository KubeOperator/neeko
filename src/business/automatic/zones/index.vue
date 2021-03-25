<template>
  <layout-content :description="$t('automatic.zone.description')">
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            @search="search">
      <template #header>
        <el-button size="small" @click="create()">
          {{ $t("commons.button.create") }}
        </el-button>
        <!--          <el-button size="small" >{{ $t("commons.button.delete") }}</el-button>-->
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.region.name')"
              mix-width="100"
              v-slot:default="{ row }">{{ row.regionName }}
      </el-table-column>
      <el-table-column
              :label="$t('commons.table.status')"
              mix-width="100"
              v-slot:default="{ row }">{{ row.status }}
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
  </layout-content>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {listZones, deleteZoneBy} from "@/api/zone"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "ZoneList",
  components: { ComplexTable, LayoutContent },
  data () {
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
        pageSize: 10,
        total: 0
      },
      data: []
    }
  },
  methods: {
    search (condition) {
      console.log(condition)
      const { currentPage, pageSize } = this.paginationConfig
      listZones(currentPage, pageSize).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    openDelete (row) {
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
          deleteZoneBy(row.name).then(() => {
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
  created () {
    this.search()
  }
}
</script>
