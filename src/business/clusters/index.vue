<template>
  <layout-content>
    <complex-table :header="$t('cluster.cluster')" @selection-change="handleSelectionChange" :data="data" :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" round @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" :disabled="clusterSelection.length < 1" round @click="remove()">{{$t('commons.button.delete')}}</el-button>
          <el-button size="small" round @click="importIn()">{{$t('commons.button.import')}}</el-button>
          <el-button size="small" :disabled="clusterSelection.length != 1" round @click="upgrade()">{{$t('commons.button.upgrade')}}</el-button>
          <el-button size="small" :disabled="clusterSelection.length != 1" round @click="check()">{{$t('commons.button.check')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" prop="name" fix/>
      <el-table-column :label="$t('cluster.version')" min-width="100" prop="spec.version" fix/>
      <el-table-column :label="$t('cluster.node_size')" min-width="50" prop="nodeSize"/>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status"/>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent"
  import ComplexTable from "@/components/complex-table"
  import { listClusters } from "@/api/cluster"

  export default {
    name: "Cluster",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        paginationConfig: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        clusterSelection: [], 
        data: [],
      }
    },
    methods: {
      edit(row) {
        console.log("编辑: ", row)
      },
      handleSelectionChange(val) {
        this.clusterSelection = val
      },
      create() {
        this.$router.push({path: '/clusters/create'})
      },
      remove() {

      },
      importIn() {

      },
      search() {
        const {currentPage, pageSize} = this.paginationConfig
        listClusters(currentPage, pageSize, "kubeoperator").then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      }
    },
    created() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
