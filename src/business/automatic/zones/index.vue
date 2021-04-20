<template>
  <layout-content :header="$t('automatic.zone.name')" :description="$t('automatic.zone.description')"
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
          <el-button size="small" @click="del()" :disabled="selects.length===0">{{
              $t("commons.button.delete")
            }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{row}">
          <el-button type="text" @click="openDetailPage(row)">{{ row.name }}</el-button>
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
        <el-tag v-if="row.status === 'READY'" type="success" size="small">
          {{ $t("automatic.zone.ready") }}
        </el-tag>
        <el-tag v-if="row.status === 'INITIALIZING'" type="info" size="small">
          {{ $t("automatic.zone.initializing") }}
        </el-tag>
        <el-tag v-if="row.status === 'UPLOADIMAGERROR'" type="danger" size="small">
          {{ $t("automatic.zone.uploadImageError") }}
        </el-tag>
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
            <ul> {{ $t("automatic.region.name") }}</ul>
            <ul> {{ $t("automatic.zone.resource_pool") }}</ul>
            <ul> {{ $t("automatic.zone.cluster") }}</ul>
            <ul> {{ $t("automatic.zone.datastore") }}</ul>
            <ul> {{ $t("automatic.zone.network") }}</ul>
            <ul v-if="item.cloudVars.templateType === 'customize'"> {{ item.cloudVars.template }}</ul>
            <ul> {{ $t("automatic.ip_pool.name") }}</ul>
            <ul> {{ $t("automatic.ip_pool.subnet") }}</ul>
            <ul> {{ $t("automatic.ip_pool.ip_usage") }}</ul>
            <ul> {{ $t("automatic.ip_pool.gateway") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns1") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns2") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionName }}</ul>
            <ul> {{ item.cloudVars.resourcePool }}</ul>
            <ul> {{ item.cloudVars.cluster }}</ul>
            <ul> {{ item.cloudVars.datastore }}</ul>
            <ul> {{ item.cloudVars.network }}</ul>
            <ul v-if="item.cloudVars.templateType === 'customize'">{{ $t("automatic.zone.template") }}</ul>
            <ul> {{ item.ipPool.name }}</ul>
            <ul> {{ item.ipPool.subnet }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns1 }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns2 }}</ul>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="item.provider==='OpenStack'">
          <el-col :span="5">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.region.name") }}</ul>
            <ul> {{ $t("automatic.zone.cluster") }}</ul>
            <ul> {{ $t("automatic.zone.storageType") }}</ul>
            <ul> {{ $t("automatic.zone.network") }}</ul>
            <ul> {{ $t("automatic.zone.security_group") }}</ul>
            <ul> {{ $t("automatic.ip_pool.name") }}</ul>
            <ul> {{ $t("automatic.ip_pool.subnet") }}</ul>
            <ul> {{ $t("automatic.ip_pool.ip_usage") }}</ul>
            <ul> {{ $t("automatic.ip_pool.gateway") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns1") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns2") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionName }}</ul>
            <ul> {{ item.cloudVars.cluster }}</ul>
            <ul> {{ item.cloudVars.storageType }}</ul>
            <ul> {{ item.cloudVars.network }}</ul>
            <ul> {{ item.cloudVars.securityGroup }}</ul>
            <ul> {{ item.ipPool.name }}</ul>
            <ul> {{ item.ipPool.subnet }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns1 }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns2 }}</ul>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="item.provider==='FusionCompute'">
          <el-col :span="5">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.region.name") }}</ul>
            <ul> {{ $t("automatic.zone.cluster") }}</ul>
            <ul> {{ $t("automatic.zone.datastore") }}</ul>
            <ul> {{ $t("automatic.zone.network") }}</ul>
            <ul v-if="item.cloudVars.templateType === 'customize'">{{ $t("automatic.zone.template") }}</ul>
            <ul> {{ $t("automatic.ip_pool.name") }}</ul>
            <ul> {{ $t("automatic.ip_pool.subnet") }}</ul>
            <ul> {{ $t("automatic.ip_pool.ip_usage") }}</ul>
            <ul> {{ $t("automatic.ip_pool.gateway") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns1") }}</ul>
            <ul> {{ $t("automatic.ip_pool.dns2") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionName }}</ul>
            <ul> {{ item.cloudVars.cluster }}</ul>
            <ul> {{ item.cloudVars.datastore }}</ul>
            <ul> {{ item.cloudVars.portgroup }}</ul>
            <ul v-if="item.cloudVars.templateType === 'customize'"> {{ item.cloudVars.template }}</ul>
            <ul> {{ item.ipPool.name }}</ul>
            <ul> {{ item.ipPool.subnet }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ipUsed }}/{{ item.ipPool.ips.length }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].gateway }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns1 }}</ul>
            <ul v-if="item.ipPool.ips.length>0"> {{ item.ipPool.ips[0].dns2 }}</ul>
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
import {searchZone, deleteZoneBy} from "@/api/zone"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "ZoneList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      loading: false,
      columns: [],
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
          type: "danger",
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
      this.$router.push({ name: "ZoneCreate" })
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
