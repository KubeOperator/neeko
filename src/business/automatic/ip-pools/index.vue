<template>
  <layout-content :header="$t('automatic.ip_pool.name')" v-loading="loading">
    <complex-table
            local-key="ip_pool_columns"
            :data="data"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            @search="search"
            :selects.sync="selects">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small"  :disabled="selects.length===0" @click="del()">
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
              :label="$t('automatic.ip_pool.subnet')"
              mix-width="100"
              v-slot:default="{ row }">
        {{ row.subnet }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.ip_pool.ip_usage')"
              mix-width="100"
              v-slot:default="{ row }">
        <el-link type="info" @click="openIpList(row)">{{ row.ipUsed }} / {{ row.ips.length }}</el-link>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {searchIpPool, deleteIpPoolBy} from "@/api/ip-pool"

export default {
  name: "IpPoolList",
  components: { LayoutContent, ComplexTable },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"), icon: "el-icon-delete",  click: (row) => {
            this.del(row.name)
          }
        },
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
            field: "subnet",
            label: this.$t("automatic.ip_pool.subnet"),
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
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchIpPool(currentPage, pageSize, condition).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
        this.loading = false
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
            ps.push(deleteIpPoolBy(name))
          } else {
            for (const item of this.selects) {
              ps.push(deleteIpPoolBy(item.name))
            }
          }
          Promise.all(ps).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success")
            })
          }).catch(() => {
            this.search()
          })
        })
    },
    create () {
      this.$router.push({ name: "IpPoolCreate" })
    },
    openIpList (row) {
      this.$router.push({ name: "IpList", params: { name: row.name, subnet: row.subnet } })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>