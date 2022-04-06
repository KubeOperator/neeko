<template>
  <layout-content :header="$t('automatic.template_config.name')" v-loading="loading">
    <complex-table :data="data" :pagination-config="paginationConfig" :search-config="searchConfig" @search="search"
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
      <el-table-column :label="$t('commons.table.name')" mix-width="100" prop="name"></el-table-column>
      <el-table-column :label="$t('commons.table.type')" mix-width="100" prop="type"></el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import ComplexTable from "@/components/complex-table"
import {searchTemplates} from "@/api/template-config"

export default {
  name: "TemplateList",
  components: { ComplexTable, LayoutContent },
  props: {},
  data () {
    return {
      loading: false,
      data: [],
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
            field: "created_at",
            label: this.$t("commons.table.create_time"),
            component: "FuComplexDate",
            valueFormat: "yyyy-MM-dd"
          }
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selects: []
    }
  },
  methods: {
    search (condition) {
      this.loading = true
      const {currentPage,PageSize} = this.paginationConfig
      searchTemplates(currentPage,PageSize,condition).then(res => {
        this.loading = false
        this.data = res.items
        this.paginationConfig.total = res.total
      })
    },
    create () {
      this.$router.push({ path: "/automatic/templates/operate" })
    },
    del () {

    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>
