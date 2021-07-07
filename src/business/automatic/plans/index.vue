<template>
  <layout-content :header="$t('automatic.plan.name')" :description="$t('automatic.plan.description')"
                  v-loading="loading">
    <complex-table
            local-key="plan_columns"
            :data="data"
            :pagination-config="paginationConfig"
            :search-config="searchConfig"
            @search="search"
            :selects.sync="selects">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()" v-permission="['ADMIN']">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small" @click="del()" v-permission="['ADMIN']" :disabled="selects.length===0">
            {{ $t("commons.button.delete") }}
          </el-button>
          <el-button size="small" @click="onGrant()"  v-permission="['ADMIN']">{{ $t("commons.button.authorize") }}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">
          <el-link type="info" @click="openDetailPage(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
              :label="$t('automatic.region.name')"
              mix-width="100"
              v-slot:default="{ row }">
        {{ row.region }}
      </el-table-column>
      <el-table-column
              :label="$t('automatic.zone.name')"
              mix-width="100"
              v-slot:default="{ row }">
        <span v-for="zoneName in row.zones" v-bind:key="zoneName">{{ zoneName }},</span>
      </el-table-column>
      <el-table-column
              v-if="isAdmin"
              :label="$t('project.project')"
              mix-width="100"
              v-slot:default="{ row }">
        <span v-for="name in row.projects" v-bind:key="name">{{ name }},</span>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
      <fu-table-operations v-if="isAdmin" :buttons="buttons" :label="$t('commons.table.action')"/>
    </complex-table>
    <el-dialog :title="$t('automatic.detail')" :visible.sync="openDetail">

      <div style=" text-align: center;">
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable">
            <tr>
              <td>{{ $t("commons.table.name") }}</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.region.name") }}</td>
              <td>{{ item.region}}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.zone.name") }}</td>
              <td><span v-for="(zone,index) in item.zones" :key="index">{{ zone }},</span></td>
            </tr>
            <tr>
              <td>{{ $t("automatic.plan.deploy_template") }}</td>
              <td v-if="item.deployTemplate">{{ $t("automatic.plan." + item.deployTemplate) }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.plan.master_model") }}</td>
              <td>{{ item.planVars.masterModel }}</td>
            </tr>
            <tr>
              <td>{{ $t("automatic.plan.worker_model") }}</td>
              <td>{{ item.planVars.workerModel }}</td>
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
import {searchPlans, deletePlanBy} from "@/api/plan"
import LayoutContent from "@/components/layout/LayoutContent"
import {checkPermission} from "@/utils/permisstion"

export default {
  name: "PlanList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      loading: false,
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "PlanEdit", params: { name: row.name } })
          },
          disabled: !checkPermission("ADMIN")
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
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
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" }
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
        zones: [],
        planVars: {}
      },
      openDetail: false,
      isAdmin: checkPermission('ADMIN')
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
    onGrant() {
      this.$router.push({ name: "ProjectAuthorizationList" })
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
    },
  },
  created () {
    this.search()
  }
}
</script>

