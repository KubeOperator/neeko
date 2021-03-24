<template>
  <div>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">添加</el-button>
      <el-button @click="toggleSelection()">修改</el-button>
      <el-button @click="toggleSelection()">删除</el-button>
    </div>

    <p/>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="arch"
        label="CPU架构"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="protocol"
        label="协议"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="hostname"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
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
