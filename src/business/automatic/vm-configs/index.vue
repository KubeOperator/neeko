<template>
  <layout-content :header="$t('automatic.vm_config.name')">
    <complex-table
            local-key="vm_config_columns"
            v-loading="loading"
            :data="data"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            :selects.sync="selects"
            @search="search">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()" v-permission="['ADMIN']">
            {{
              $t("commons.button.create")
            }}
          </el-button>
          <el-button size="small"  :disabled="selects.length===0"  v-permission="['ADMIN']" @click="del()">
            {{
              $t("commons.button.delete")
            }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.vm_config.cpu')"
              mix-width="100"
              v-slot:default="{ row }">{{ row.cpu }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.vm_config.memory')"
              mix-width="100"
              v-slot:default="{ row }">{{ row.memory }}
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations v-if="isAdmin" :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
  </layout-content>
</template>
<script>
import ComplexTable from "@/components/complex-table"
import {searchVmConfigs, deleteVmConfigBy} from "@/api/vm-config"
import LayoutContent from "@/components/layout/LayoutContent"
import {checkPermission} from "@/utils/permisstion"

export default {
  name: "VmConfigList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "VmConfigEdit", params: { name: row.name } })
          },
          disabled: !checkPermission('ADMIN')
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",

          click: (row) => {
            this.del(row.name)
          },
          disabled: !checkPermission('ADMIN')
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
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" },

        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
      selects: [],
      isAdmin: checkPermission('ADMIN')
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchVmConfigs(currentPage, pageSize, condition).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    del (name) {
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
          const ps = []
          if (name) {
            ps.push(deleteVmConfigBy(name))
          } else {
            for (const item of this.selects) {
              ps.push(deleteVmConfigBy(item.name))
            }
          }
          Promise.all(ps).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success")
            })
          })
        })
    },
    create () {
      this.$router.push({ name: "VmConfigCreate" })
    },
  },
  created () {
    this.search()
  }
}
</script>

