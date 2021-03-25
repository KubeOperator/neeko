<template>

  <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                 :pagination-config="paginationConfig" @search="search">
    <template #toolbar>
      <el-button-group>
        <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
      </el-button-group>
    </template>

    <el-table-column type="selection" fix></el-table-column>
    <el-table-column :label="$t('commons.table.arch')" mix-width="100" fix>
      <template v-slot:default="{row}">
        <el-row>
          <el-col :span="3">
            <font-awesome-icon icon="user" size="3x"/>
          </el-col>
          <el-col :span="18">
            {{row.name}}x86_64
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column :label="$t('commons.table.protocol')" min-width="100">
      <template v-slot:default="{row}">
        <el-tag v-if="row.status === 'active'" type="success" size="small">{{$t('commons.status.active')}}</el-tag>
        <el-tag v-if="row.status === 'passive'" type="danger" size="small">{{$t('commons.status.passive')}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="$t('commons.table.hostname')" min-width="100">
      <template v-slot:default="{row}">
        <el-tag type="info" size="small">{{$t(`commons.role.${row.role}`)}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="$t('commons.table.create_time')">
      <template v-slot:default="{row}">
        {{ row.createdAt | datetimeFormat }}
      </template>
    </el-table-column>

    <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
  </complex-table>


</template>

<script>
import ComplexTable from "@/components/complex-table";
// import LayoutContent from "@/components/layout/LayoutContent";

export default {
  components: {
    ComplexTable,

  },
  name: "Registry",
  data() {
    return{
      multipleSelection: [],
      tableData: [{
        arch: 'x86_64',
        protocol: 'http',
        hostname: '192.168.1.200',
        createTime: '2021-05-03'
      }, {
        arch: 'aarch64',
        protocol: 'https',
        hostname: '192.168.1.200',
        createTime: '2021-05-01'
      }],
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>

<style scoped>

</style>
