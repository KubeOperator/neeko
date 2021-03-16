<template>
  <layout-content>
    <complex-table :header="$t('cluster.cluster')" :data="data" :columns="columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search">

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column label="ID" min-width="100" prop="id" fix/>
      <el-table-column label="姓名" min-width="100" prop="name" fix/>
      <el-table-column label="Email" min-width="100" prop="email"/>
      <el-table-column label="角色" min-width="100" prop="roles"/>
      <el-table-column label="语言" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.language === 'zh-CN'" type="danger" size="small">中文</el-tag>
          <el-tag v-if="row.language === 'en-US'" size="small">English</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" :show="false">
        <template v-slot:default="{row}">
          {{ row.createTime | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" label="操作" fix/>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import {listUsers} from "@/api/user-management"
  import ComplexTable from "@/components/complex-table";
  import CustomCondition from "./CustomCondtion";
  import {checkPermission} from "@/utils/permisstion"

  const buttonClick = function (row) {
    console.log(this.label + ": " + row.id)
  }

  export default {
    name: "Cluster",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        columns: [],
        buttons: [
          {
            label: "编辑", icon: "el-icon-edit", click: this.edit
          }, {
            label: "执行", icon: "el-icon-video-play", click: buttonClick
          }, {
            label: "删除", icon: "el-icon-delete", type: "danger", click: buttonClick
          }, {
            label: "删除(权限)", icon: "el-icon-delete", type: "danger", click: buttonClick,
            show: checkPermission('editor') // 必须有editor权限才能看到
          }, {
            label: "复制", icon: "el-icon-document-copy", click: buttonClick
          }, {
            label: "定时任务", icon: "el-icon-timer", click: buttonClick
          }
        ],
        searchConfig: {
          quickPlaceholder: "按 姓名/邮箱 搜索",
          components: [
            {field: "name", label: "姓名", component: "FuComplexInput", defaultOperator: "eq"},
            {field: "email", label: "Email", component: "FuComplexInput"},
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
            {field: "user", component: CustomCondition}, // 如何自定义搜索控件，看CustomCondition
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
      search() {
        const {currentPage, pageSize} = this.paginationConfig
        listUsers(currentPage, pageSize).then(response => {
          this.data = response.data.items
          this.paginationConfig.total = response.data.total
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
