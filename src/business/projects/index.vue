<template>
    <complex-table @select='select' :data="data" :columns="columns"
                   :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search">

      <template #header>
        <back-button path=""></back-button>
        {{$t('project.project')}}
      </template>
      <template #toolbar>
        <el-button>{{$t('commons.button.create')}}</el-button>
      </template>


      <!--      <template #header>-->
      <!--        <el-button-group>-->
      <!--          <el-button size="small" round @click="create()">{{$t('commons.button.create')}}</el-button>-->
      <!--          <el-button size="small" round @click="del()">{{$t('commons.button.delete')}}</el-button>-->
      <!--        </el-button-group>-->
      <!--      </template>-->

      <el-table-column type="selection" fix></el-table-column>

      <el-table-column :label="$t('commons.table.name')" min-width="100" fix>
        <template v-slot:default="{row}">
          <router-link :to="{name:'ProjectDetail',params: {name:row.name}}">
            {{row.name}}
          </router-link>
        </template>
      </el-table-column>


      <el-table-column :label="$t('commons.table.description')" min-width="100" prop="description"
                       fix></el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>
</template>

<script>
  import {listProjects, deleteProject} from "@/api/projects"
  import ComplexTable from "@/components/complex-table";
  import BackButton from "@/components/back-button";


  export default {
    name: "ProjectList",
    components: {ComplexTable, BackButton},
    data() {
      return {
        deleteDialogOpen: false,
        columns: [],
        buttons: [
          {
            label: this.$t("commons.button.edit"), icon: "el-icon-edit", type: "info", click: (row) => {
              this.$router.push({name: "ProjectEdit", params: {name: row.name}})
            }
          },
          {
            label: this.$t("commons.button.delete"), icon: "el-icon-delete", type: "danger", click: (row) => {
              this.del(row.name)
            }
          },
        ],
        searchConfig: {
          quickPlaceholder: "按 姓名/邮箱 搜索",
          components: [
            {field: "name", label: "姓名", component: "FuComplexInput", defaultOperator: "eq"},
            {field: "create_time", label: "创建时间", component: "FuComplexDateTime"},
          ]
        },
        paginationConfig: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        data: [],
        selects: []
      }
    }, methods: {
      select(selection) {
        this.selects = selection
      },
      create() {
        this.$router.push({name: 'ProjectCreate'})
      },
      del(name) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (name) {
            deleteProject(name).then(() => {
              this.search()
              this.$message({
                type: 'success',
                message: `${name}删除成功!`
              });
            })
          } else {
            const ps = []
            for (const item of this.selects) {
              ps.push(deleteProject(item.name))
            }
            Promise.all(ps).then(() => {
              this.search()
              this.$message({
                type: 'success',
                message: `批量删除成功!`
              });
            })
          }
        })
      },
      search(condition) {
        console.log(condition)
        const {currentPage, pageSize} = this.paginationConfig
        listProjects(currentPage, pageSize).then(data => {
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
