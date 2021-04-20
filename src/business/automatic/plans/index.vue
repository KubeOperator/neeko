<template>
  <layout-content :header="$t('automatic.plan.name')" :description="$t('automatic.plan.description')"
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
          <el-button size="small" @click="create()" v-permission="['ADMIN']">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()" type="danger"  v-permission="['ADMIN']" :disabled="selects.length===0">{{
              $t("commons.button.delete")
            }}
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
              :label="$t('automatic.region.name')"
              mix-width="100"
              v-slot:default="{ row }">
        {{ row.regionName }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.zone.name')"
              mix-width="100"
              v-slot:default="{ row }">
        <span v-for="zoneName in row.zoneNames" v-bind:key="zoneName">{{ zoneName }},</span>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
    <el-dialog :title="$t('automatic.detail')" :visible.sync="openDetail">
      <el-card class="box-card">
        <el-row type="flex">
          <el-col :span="5">
            <ul> {{ $t("commons.table.name") }}</ul>
            <ul> {{ $t("automatic.region.name") }}</ul>
            <ul> {{ $t("automatic.zone.name") }}</ul>
            <ul> {{ $t("automatic.plan.deploy_template") }}</ul>
            <ul> {{ $t("automatic.plan.master_model") }}</ul>
            <ul> {{ $t("automatic.plan.worker_model") }}</ul>
          </el-col>
          <el-col>
            <ul> {{ item.name }}</ul>
            <ul> {{ item.regionName }}</ul>
            <ul><span v-for="(zone,index) in item.zoneNames" :key="index">{{ zone }},</span></ul>
            <ul> {{ $t("automatic.plan." + item.deployTemplate) }}</ul>
            <ul> {{ item.planVars.masterModel }}</ul>
            <ul> {{ item.planVars.workerModel }}</ul>
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
import {searchPlans, deletePlanBy} from "@/api/plan"
import LayoutContent from "@/components/layout/LayoutContent"
import {checkPermission} from "@/utils/permisstion"

export default {
  name: "PlanList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      loading: false,
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          disabled: !checkPermission("ADMIN")
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.del(row.name)
          },
          disabled: !checkPermission("ADMIN")
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
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" }
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      selects: [],
      item: {
        zoneNames: [],
        planVars: {}
      },
      openDetail: false
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchPlans(currentPage, pageSize, condition).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create () {
      this.$router.push({ name: "PlanCreate" })
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
            ps.push(deletePlanBy(name))
          } else {
            for (const item of this.selects) {
              ps.push(deletePlanBy(item.name))
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

