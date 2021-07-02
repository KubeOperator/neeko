<template>
  <layout-content :header="$t('automatic.zone.name')" :description="$t('automatic.zone.description')"
                  v-loading="loading">
    <complex-table
            local-key="zone_columns"
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
          <el-button size="small" @click="del()"  :disabled="selects.length===0">{{
              $t("commons.button.delete")
            }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{row}">
          <el-link type="info" @click="openDetailPage(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.region.name')"
              mix-width="100"
              v-slot:default="{ row }">{{ row.regionName }}
      </el-table-column>
      <el-table-column
              :label="$t('commons.table.status')"
              mix-width="100"
              v-slot:default="{ row }">

        <div v-if="row.status === 'READY'">
          <span class="iconfont iconduihao" style="color: #32B350"></span>
          {{ $t("automatic.zone.ready") }}
        </div>
        <div v-if="row.status === 'INITIALIZING'">
          <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
          {{ $t("automatic.zone.initializing") }}
        </div>
        <div v-if="row.status === 'UPLOADIMAGERROR'">
          <span class="iconfont iconerror2" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
          {{ $t("automatic.zone.uploadImageError") }}
        </div>
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
              <td>{{ $t("automatic.region.name") }}</td>
              <td>{{ item.regionName}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.resource_pool") }}</td>
              <td>{{ item.cloudVars.resourcePool }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.cluster") }}</td>
              <td>{{ item.cloudVars.cluster }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.datastore") }}</td>
              <td>{{ item.cloudVars.datastore }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.network") }}</td>
              <td>{{ item.cloudVars.network }}</td>
            </tr>
            <tr  v-if="item.cloudVars.templateType === 'customize'">
              <td>{{ $t("automatic.zone.template") }}</td>
              <td>{{ item.cloudVars.imageName }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.name") }}</td>
              <td>{{ item.ipPool.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.subnet") }}</td>
              <td>{{ item.ipPool.subnet }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.ip_usage") }}</td>
              <td  v-if="item.ipPool.ips.length>0">{{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.gateway") }}</td>
              <td v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns1") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns1 }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns2") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns2 }}</td>
            </tr>
          </table>
          <table style="width: 90%" class="myTable"  v-if="item.provider==='FusionCompute'">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.name") }}</td>
              <td>{{ item.regionName}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.cluster") }}</td>
              <td>{{ item.cloudVars.cluster }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.datastore") }}</td>
              <td>{{ item.cloudVars.datastore }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.network") }}</td>
              <td>{{ item.cloudVars.portgroup }}</td>
            </tr>
            <tr  v-if="item.cloudVars.templateType === 'customize'">
              <td>{{ $t("automatic.zone.template") }}</td>
              <td>{{ item.cloudVars.template }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.name") }}</td>
              <td>{{ item.ipPool.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.subnet") }}</td>
              <td>{{ item.ipPool.subnet }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.ip_usage") }}</td>
              <td  v-if="item.ipPool.ips.length>0">{{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.gateway") }}</td>
              <td v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns1") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns1 }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns2") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns2 }}</td>
            </tr>

          </table>
          <table style="width: 90%" class="myTable"  v-if="item.provider==='OpenStack'">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.name") }}</td>
              <td>{{ item.regionName}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.cluster") }}</td>
              <td>{{ item.cloudVars.cluster }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.storageType") }}</td>
              <td>{{ item.cloudVars.storageType }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.network") }}</td>
              <td>{{ item.cloudVars.network }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.security_group") }}</td>
              <td>{{ item.cloudVars.securityGroup }}</td>
            </tr>
            <tr  v-if="item.cloudVars.templateType === 'customize'">
              <td>{{ $t("automatic.zone.template") }}</td>
              <td>{{ item.cloudVars.template }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.name") }}</td>
              <td>{{ item.ipPool.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.subnet") }}</td>
              <td>{{ item.ipPool.subnet }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.ip_usage") }}</td>
              <td  v-if="item.ipPool.ips.length>0">{{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.gateway") }}</td>
              <td v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns1") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns1 }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.ip_pool.dns2") }}</td>
              <td v-if="item.ipPool.ips.length>0">{{ item.ipPool.ips[0].dns2 }}</td>
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
import {searchZone, deleteZoneBy} from "@/api/zone"
import LayoutContent from "@/components/layout/LayoutContent"
import { listRegistryAll } from "@/api/system-setting"

export default {
  name: "ZoneList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      loading: false,
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "ZoneEdit", params: { name: row.name } })
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
            field: "status",
            label: this.$t("commons.table.status"),
            component: "FuComplexSelect",
            options: [
              { label: this.$t("automatic.zone.ready"), value: "READY" },
              { label: this.$t("automatic.zone.initializing"), value: "INITIALIZING" },
              { label: this.$t("automatic.zone.uploadImageError"), value: "UPLOADIMAGERROR" }
            ],
            multiple: true
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
      selects: [],
      openDetail: false,
      item: {
        cloudVars: {},
        ipPool: {
          ips: []
        },
        provider: ""
      }
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchZone(currentPage, pageSize, condition).then(data => {
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
            ps.push(deleteZoneBy(name))
          } else {
            for (const item of this.selects) {
              ps.push(deleteZoneBy(item.name))
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
      listRegistryAll().then((data) => {
        let repoList = data.items === null ? [] : data.items
        let isExit = false
        for (const repo of repoList) {
          if (repo.architecture === "x86_64") {
            isExit = true
            break
          }
        }
        if (isExit) {
          this.$router.push({ name: "ZoneCreate" })
        } else {
          this.$message({ type: "info", message: this.$t("cluster.creation.repo_err") })
        }
      })
    },
    openDetailPage (row) {
      this.openDetail = true
      this.item = row
    },
    onCancel () {
      this.openDetail = false
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>
</style>
