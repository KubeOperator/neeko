<template>
  <layout-content v-loading="loading" :header="$t('automatic.ip_pool.ip_list')" :back-to="{ name: 'IpPoolList' }">
    <complex-table
            :data="data"
            local-key="ip_columns"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            :selects.sync="selects"
            @search="search">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" :disabled="selects.length===0" @click="del()">
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
          <div v-if="row.status ==='IP_AVAILABLE'">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("automatic.ip_pool.ip_available") }}
          </div>
          <div v-if="row.status ==='IP_USED'">
            <span class="iconfont iconin-use" style="color: #FA5D50"></span>
            {{ $t("automatic.ip_pool.ip_used") }}
          </div>
          <div v-if="row.status ==='IP_REACHABLE'">
            <span class="iconfont iconping" style="color: #FA5D50"></span>
            {{ $t("automatic.ip_pool.ip_reachable") }}
          </div>
          <div v-if="row.status ==='IP_LOCK'">
            <span class="iconfont iconlock" style="color: #FA5D50"></span>
            {{ $t("automatic.ip_pool.ip_lock") }}
          </div>
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
import {deleteIpBy, syncIp, searchIp, updateIp} from "@/api/ip-pool"

export default {
  name: "IpList",
  components: { ComplexTable, LayoutContent },
  props: ["name", "subnet"],
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.lock"), icon: "el-icon-lock", click: (row) => {
            this.update(row)
          }
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.del(row.address)
          }
        },
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
      this.$router.push({ name: "IpCreate", params: { name: this.name, subnet: this.subnet } })
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
            ps.push(deleteIpBy(this.name, address))
          } else {
            for (const item of this.selects) {
              ps.push(deleteIpBy(this.name, item.address))
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
    sync () {
      this.loading = true
      syncIp(this.name).then(() => {
        this.loading = false
        this.$message({
          type: "success",
          message: this.$t("commons.msg.sync_success")
        })
        this.search()
      })
    },
    update (row) {
      let operation = "LOCK"
      if (row.status === "IP_LOCK") {
        operation = "UNLOCK"
      }
      updateIp(this.name, row.address, {
        operation: operation
      }).then(() => {
        this.search()
        this.$message({
          type: "success",
          message: this.$t("commons.msg.update_success")
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