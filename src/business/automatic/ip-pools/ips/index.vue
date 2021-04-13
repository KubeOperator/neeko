<template>
  <layout-content v-loading="loading">
    <br>
    <el-page-header @back="goBack" :content="$t('automatic.ip_pool.ip_list')">
    </el-page-header>
    <br>
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            :selects.sync="selects"
            @search="search">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()">
            {{ $t("commons.button.delete") }}
          </el-button>
          <el-button size="small" @click="sync()">
            {{ $t("commons.button.sync") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('automatic.ip_pool.address')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.address }}</template>
      </el-table-column>
      <el-table-column :label="$t('automatic.ip_pool.gateway')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.gateway }}</template>
      </el-table-column>
      <el-table-column :label="$t('automatic.ip_pool.dns1')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.dns1 }}</template>
      </el-table-column>
      <el-table-column :label="$t('automatic.ip_pool.dns2')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.dns2 }}</template>
      </el-table-column>
      <el-table-column :label="$t('automatic.ip_pool.status')" mix-width="100">
        <template v-slot:default="{ row }">
          <el-tag v-if="row.status === 'IP_AVAILABLE'" type="success" size="small">
            {{ $t("automatic.ip_pool.ip_available") }}
          </el-tag>
          <el-tag v-if="row.status === 'IP_USED'" type="danger" size="small">
            {{ $t("automatic.ip_pool.ip_used") }}
          </el-tag>
          <el-tag v-if="row.status === 'IP_REACHABLE'" type="warning" size="small">
            {{ $t("automatic.ip_pool.ip_reachable") }}
          </el-tag>
          <el-tag v-if="row.status === 'IP_LOCK'" type="info" size="small">
            {{ $t("automatic.ip_pool.ip_lock") }}
          </el-tag>
        </template>
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
import {deleteIpBy, syncIp, searchIp} from "@/api/ip-pool"

export default {
  name: "IpList",
  components: { ComplexTable, LayoutContent },
  props: ["name"],
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.del(row.address)
          }
        }
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          {
            field: "address",
            label: this.$t("automatic.ip_pool.address"),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "status",
            label: this.$t("commons.table.status"),
            component: "FuComplexSelect",
            options: [
              { label: this.$t("automatic.ip_pool.ip_available"), value: "IP_AVAILABLE" },
              { label: this.$t("automatic.ip_pool.ip_lock"), value: "IP_LOCK" },
              { label: this.$t("automatic.ip_pool.ip_used"), value: "IP_USED" },
              { label: this.$t("automatic.ip_pool.ip_reachable"), value: "IP_REACHABLE" }
            ],
            multiple: true
          },
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
      selects: []
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchIp(currentPage, pageSize, this.name, condition).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
        this.loading = false
      })
    },
    create () {
      this.$router.push({ name: "IpCreate", params: { name: this.name } })
    },
    del (address) {
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
          if (address) {
            ps.push(deleteIpBy(this.name,address))
          } else {
            for (const item of this.selects) {
              ps.push(deleteIpBy(this.name,item.address))
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
    goBack () {
      this.$router.push({ name: "IpPoolList" })
    },
    sync () {
      this.loading = true
      syncIp(this.name).then(() => {
        this.loading = false
        this.$message({
          type: "success",
          message: this.$t("commons.msg.sync_success")
        })
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