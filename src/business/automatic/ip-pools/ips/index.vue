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
            @search="search">
      <template #header>
        <el-button size="small" @click="create()">
          {{ $t("commons.button.create") }}
        </el-button>
        <el-button size="small" @click="sync()">
          {{ $t("commons.button.sync") }}
        </el-button>
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
            {{ $t("automatic.ip_pool.ip_reachable") }}
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
import {listIps, deleteIpBy, syncIp} from "@/api/ip-pool"

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
      data: [],
      loading: false
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      console.log(condition)
      const { currentPage, pageSize } = this.paginationConfig
      listIps(this.name, currentPage, pageSize).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
        this.loading = false
      })
    },
    create () {
      this.$router.push({ name: "IpCreate", params: { name: this.name } })
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
          deleteIpBy(this.$route.params["name"], row.address).then(() => {
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