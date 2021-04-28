<template>
  <layout-content :header="$t('automatic.region.name')" :description="$t('automatic.region.description')"
                  v-loading="loading">
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            @search="search"
            :selects.sync="selects">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()" :disabled="selects.length===0">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">
          <el-button type="text" @click="openDetailPage(row)">{{ row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.cloud_provider')"
              mix-width="100"
              v-slot:default="{ row }"
      >{{ row.regionVars["provider"] }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.datacenter')"
              mix-width="100"
              v-slot:default="{ row }"
      >{{ row.datacenter }}
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
    <el-dialog :title="$t('automatic.detail')" :visible.sync="openDetail">
      <el-card class="box-card">
        <el-row type="flex" v-if="item.provider==='vSphere'">
          <el-col :span="5">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.cloud_provider") }}</ul>
            <ul> {{ $t("automatic.datacenter") }}</ul>
            <ul> {{ $t("automatic.region.vcenter_host") }}</ul>
            <ul> {{ $t("automatic.region.vcenter_username") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionVars.provider}}</ul>
            <ul> {{ item.datacenter }}</ul>
            <ul> {{ item.regionVars.host }}</ul>
            <ul> {{ item.regionVars.username }}</ul>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="item.provider==='FusionCompute'">
          <el-col :span="6">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.cloud_provider") }}</ul>
            <ul> {{ $t("automatic.datacenter") }}</ul>
            <ul> {{ $t("automatic.region.fusionCompute_server") }}</ul>
            <ul> {{ $t("automatic.region.vcenter_username") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionVars.provider}}</ul>
            <ul> {{ item.datacenter }}</ul>
            <ul> {{ item.regionVars.server }}</ul>
            <ul> {{ item.regionVars.user }}</ul>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="item.provider==='OpenStack'">
          <el-col :span="5">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.cloud_provider") }}</ul>
            <ul> {{ $t("automatic.datacenter") }}</ul>
            <ul> {{ $t("automatic.region.openstack_identity") }}</ul>
            <ul> {{ $t("automatic.region.vcenter_username") }}</ul>
            <ul> {{ $t("automatic.region.openstack_project") }}</ul>
            <ul> {{ $t("automatic.region.openstack_domain") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionVars.provider}}</ul>
            <ul> {{ item.datacenter }}</ul>
            <ul> {{ item.regionVars.identity }}</ul>
            <ul> {{ item.regionVars.username }}</ul>
            <ul> {{ item.regionVars.projectId }}</ul>
            <ul> {{ item.regionVars.domainName }}</ul>
          </el-col>
        </el-row>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button @click="openDetail = false">{{ $t("commons.button.cancel") }}</el-button>
      </span>
    </el-dialog>
  </layout-content>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {searchRegion, deleteRegionBy} from "@/api/region"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "RegionList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "RegionEdit", params: { name: row.name } })
          }
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",

          click: (row) => {
            this.del(row.name)
          }
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
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
      selects: [],
      openDetail: false,
      item: {
        regionVars:{},
        datacenter: ""
      }
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchRegion(currentPage, pageSize, condition).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create () {
      this.$router.push({ path: "/automatic/regions/create" })
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
            ps.push(deleteRegionBy(name))
          } else {
            for (const item of this.selects) {
              ps.push(deleteRegionBy(item.name))
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
    openDetailPage (row) {
      this.openDetail = true
      this.item = row
    }
  },
  created () {
    this.search()
  }
}
</script>
