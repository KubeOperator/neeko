<template>
  <layout-content :header="$t('automatic.ip_pool.name')" v-loading="loading">
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
              :label="$t('automatic.ip_pool.subnet')"
              mix-width="100"
              v-slot:default="{ row }">
        {{ row.subnet }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.ip_pool.ip_usage')"
              mix-width="100"
              v-slot:default="{ row }">
        <el-link type="primary" @click="openIpList(row.name)">{{ row.ipUsed }} / {{ row.ips.length }}</el-link>
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
      columns: [],
      buttons: [
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
            label: this.$t('commons.table.name'),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "subnet",
            label: this.$t('automatic.ip_pool.subnet'),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {field: "create_at", label: this.$t('commons.table.create_time'), component: "FuComplexDateTime"},
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchIpPool(currentPage, pageSize,condition).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
        this.loading = false
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
          deleteIpPoolBy(row.name).then(() => {
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
      this.$router.push({ name: "IpPoolCreate" })
    },
    openIpList (name) {
      this.$router.push({ name: "IpList", params: { name: name } })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>