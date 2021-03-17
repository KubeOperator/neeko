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
      <el-table-column :label="$t('commons.table.name')" mix-width="100" fix>
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="3">
              <font-awesome-icon icon="user" size="3x"/>
            </el-col>
            <el-col :span="18">
              {{row.name}}<br/>
              {{row.email}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!--      <el-table-column label="IP" min-width="100" prop="ip" fix/>-->
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status === 'active'" type="success" size="small">{{$t('commons.status.active')}}</el-tag>
          <el-tag v-if="row.status === 'passive'" type="danger" size="small">{{$t('commons.status.passive')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="100">
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
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import {listUsers} from "@/api/user"
  import ComplexTable from "@/components/complex-table";

  const buttonClick = function (row) {
    console.log(this.label + ": " + row.id)
  }

  export default {
    name: "UserList",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        columns: [],
        buttons: [
          {
            label: "编辑", icon: "el-icon-edit", click: buttonClick
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
        this.$router.push({path: '/users/create'})
      },
      search(condition) {
        console.log(condition) // demo只查看搜索条件，没有搜索的实现
        const {currentPage, pageSize} = this.paginationConfig
        listUsers(currentPage, pageSize).then(data => {
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
