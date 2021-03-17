<template>
  <layout-content>
    <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search">
      <template #header>

        <el-button-group>
          <el-button size="small" round @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" round>{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" fix>
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="6">
              <font-awesome-icon icon="server" size="3x"/>
            </el-col>
            <el-col :span="18">
              {{row.name}}<br/>
              {{row.ip}}
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <!--      <el-table-column label="IP" min-width="100" prop="ip" fix/>-->
      <el-table-column label="CPU" min-width="100" prop="cpuCore"/>
      <el-table-column label="GPU" min-width="100" prop="gpuNum"/>
      <el-table-column :label="$t('host.memory')" min-width="100" prop="memory"/>
      <el-table-column :label="$t('host.os')" min-width="100">
        <template v-slot:default="{row}">
          {{ row.os}} {{row.osVersion}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('host.architecture')" min-width="100" prop="architecture"/>
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status === 'Running'" type="success" size="small">{{$t('commons.status.running')}}</el-tag>
          <el-tag v-if="row.status === 'Error'" type="danger" size="small">{{$t('commons.status.error')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import {listHosts} from "@/api/hosts"
  import ComplexTable from "@/components/complex-table";

  const buttonClick = function (row) {
    console.log(this.label + ": " + row.id)
  }

  export default {
    name: "Host",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        columns: [],
        buttons: [
          {
            label: "执行", icon: "el-icon-video-play", click: buttonClick
          }, {
            label: "删除", icon: "el-icon-delete", type: "danger", click: buttonClick
          },
        ],
        searchConfig: {
          quickPlaceholder: "按 姓名/邮箱 搜索",
          components: [
            {field: "name", label: "姓名", component: "FuComplexInput", defaultOperator: "eq"},
            {
              field: "status",
              label: "状态",
              component: "FuComplexSelect",
              options: [
                {label: "运行中", value: "Running"},
                {label: "成功", value: "Success"},
                {label: "失败", value: "Fail"}
              ],
              multiple: true
            },
            {field: "create_time", label: "创建时间", component: "FuComplexDateTime"},
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
      edit(row) {
        console.log("编辑: ", row)
      },
      create() {
        this.$router.push({path: '/hosts/create'})
      },
      search(condition) {
        console.log(condition) // demo只查看搜索条件，没有搜索的实现
        const {currentPage, pageSize} = this.paginationConfig
        listHosts(currentPage, pageSize).then(data => {
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
