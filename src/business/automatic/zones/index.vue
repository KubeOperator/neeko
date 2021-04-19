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
        <template v-slot:default="{ row }">{{ row.name }}</template>
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
      selects: []
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
    }
  },
  created () {
    this.search()
  }
}
</script>
