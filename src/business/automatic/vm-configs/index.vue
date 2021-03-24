<template>
  <layout-content :header="$t('automatic.vm_config.name')">
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            @search="search">
      <template #header>
        <el-button-group>
          <el-button size="small" round @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" round>{{ $t("commons.button.delete") }}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.vm_config.cpu')"
              mix-width="100"
              v-slot:default="{ row }">
        {{ row.cpu }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.vm_config.memory')"
              mix-width="100"
              v-slot:default="{ row }"
      >{{ row.memory }}
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
import {listVmConfigs, deleteVmConfigBy} from "@/api/vm-config"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "PlanList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "VmConfigEdit", params: { name: row.name } })
          }
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
      listVmConfigs(currentPage, pageSize).then(data => {
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
          deleteVmConfigBy(row.name).then(() => {
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
    },
    create () {
      this.$router.push({ name: "VmConfigCreate" })
    }
  },
  created () {
    this.search()
  }
}
</script>

