<template>
  <layout-content :header="$t('automatic.region.name')" :description="$t('automatic.region.description')"
                  v-loading="loading">
    <complex-table
            local-key="region_columns"
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
          <el-button size="small" @click="del()" :disabled="selects.length===0">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">
          <el-link type="info" @click="openDetailPage(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.cloud_provider')"
              mix-width="100">
        <template v-slot:default="{row}">
          <svg v-if="row.regionVars['provider'] === 'OpenStack'" class="icon" aria-hidden="true">
            <use xlink:href="#iconopenstack"></use>
          </svg>
          <svg v-if="row.regionVars['provider'] === 'vSphere'" class="icon" aria-hidden="true">
            <use xlink:href="#iconvmware"></use>
          </svg>
          <svg v-if="row.regionVars['provider'] === 'FusionCompute'" class="icon" aria-hidden="true">
            <use xlink:href="#iconhuawei"></use>
          </svg>
          {{ row.regionVars["provider"] }}
        </template>s
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
      <div style=" text-align: center;">
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable"  v-if="item.provider==='vSphere'">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.cloud_provider") }}</td>
              <td>{{ item.regionVars.provider}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.datacenter") }}</td>
              <td>{{ item.datacenter }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.vcenter_host") }}</td>
              <td>{{ item.regionVars.host }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.vcenter_username") }}</td>
              <td>{{ item.regionVars.username }}</td>
            </tr>
          </table>
          <table style="width: 90%" class="myTable"  v-if="item.provider==='FusionCompute'">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.cloud_provider") }}</td>
              <td>{{ item.regionVars.provider}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.datacenter") }}</td>
              <td>{{ item.datacenter }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.fusionCompute_server") }}</td>
              <td>{{ item.regionVars.server }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.vcenter_username") }}</td>
              <td>{{ item.regionVars.user }}</td>
            </tr>
          </table>
          <table style="width: 90%" class="myTable"  v-if="item.provider==='OpenStack'">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.cloud_provider") }}</td>
              <td>{{ item.regionVars.provider}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.datacenter") }}</td>
              <td>{{ item.datacenter }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.openstack_identity") }}</td>
              <td>{{ item.regionVars.identity }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.vcenter_username") }}</td>
              <td>{{ item.regionVars.username }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.openstack_project") }}</td>
              <td>{{ item.regionVars.projectId }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.openstack_domain") }}</td>
              <td>{{ item.regionVars.domainName }}</td>
            </tr>
          </table>
        </div>
      </div>
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
            component: "FuComplexDateTime",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
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
