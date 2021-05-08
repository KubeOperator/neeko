<template>
  <layout-content :header="$t('multi_cluster.multi_cluster')" :back-to="{ name: 'MultiClusterRepositoriesList'}">
    <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig">
      <el-table-column :label="$t('multi_cluster.address')" min-width="100" prop="gitCommitId" fix/>
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status.toLowerCase() === 'success'" type="success" size="small">
            {{$t('commons.status.success')}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import ComplexTable from "@/components/complex-table";
  import {getMultiClusterSyncLogs, deleteMultiClusterRepository} from "@/api/xpack/multi-cluster"


  export default {
    name: "MultiClusterRepositoriesLogs",
    props: ['name'],
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        columns: [],
        buttons: [],
        searchConfig: {
          quickPlaceholder: this.$t("commons.search.quickSearch"),
          components: [
            {field: "name", label: this.$t('commons.table.name'), component: "FuComplexInput", defaultOperator: "eq"},
            {
              field: "is_active",
              label: this.$t('commons.table.status'),
              component: "FuComplexSelect",
              options: [
                {label: this.$t('commons.status.active'), value: 1},
                {label: this.$t('commons.status.passive'), value: 0},
              ],
              multiple: true
            },
            {
              field: "is_admin",
              label: this.$t('user.role'),
              component: "FuComplexSelect",
              options: [
                {label: this.$t('commons.role.admin'), value: 1},
                {label: this.$t('commons.role.user'), value: 0},
              ],
              multiple: true
            },
            {field: "created_at", label: this.$t('commons.table.create_time'), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd"},
          ]
        },
        paginationConfig: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        data: [],
      }
    },
    methods: {
      select(selection) {
        console.log(selection)
      },
      create() {
        this.$router.push({name: "MultiClusterRepositoryCreate"})
      },
      search() {
        const {currentPage, pageSize} = this.paginationConfig
        getMultiClusterSyncLogs(this.name, currentPage, pageSize).then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      },
      del(name) {
        this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
          confirmButtonText: this.$t('commons.button.confirm'),
          cancelButtonText: this.$t('commons.button.cancel'),
          type: 'warning'
        }).then(() => {
          if (name) {
            deleteMultiClusterRepository(name).then(() => {
              this.search()
              this.$message({
                type: 'success',
                message: `${name}${this.$t('commons.msg.delete_success')}!`
              });
            })
          } else {
            const ps = []
            for (const item of this.selects) {
              ps.push(deleteMultiClusterRepository(item.name))
            }
            Promise.all(ps).then(() => {
              this.search()
              this.$message({
                type: 'success',
                message: this.$t('commons.msg.delete_success'),
              });
            })
          }
        })
      },
    },
    created() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
