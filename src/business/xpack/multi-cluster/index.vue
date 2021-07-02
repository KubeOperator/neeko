<template>
  <layout-content :header="$t('multi_cluster.multi_cluster')">
    <relations-management :visible="relationManagementOpened"
                          v-on:update:visible="relationManagementOpened=$event"
                          :name="currentRepositoryName"></relations-management>
    <repository-error-message :visible="repositoryErrorMessageOpened"
                              v-on:update:visible="repositoryErrorMessageOpened=$event"
                              :message="errorMessage"></repository-error-message>


    <complex-table :data="data" local-key="multi_cluster_columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100" fix>
        <template v-slot:default="{row}">
          {{row.name}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('multi_cluster.address')" min-width="100" prop="source" fix/>
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <div v-if="row.status ==='Running'">
            <span class="iconfont iconduihao" style="color: #32B350"></span>
            {{ $t("commons.status.running") }}
          </div>
          <div v-if="row.status ==='Initializing'">
            <i class="el-icon-loading" />&nbsp;
            {{ $t("commons.status.initializing") }}
          </div>
          <div v-if="row.status === 'Failed'">
            <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
            <el-link type="info" @click="showErrorMessage(row)">{{ $t("commons.status.failed") }}</el-link>
          </div>
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
  import ComplexTable from "@/components/complex-table";
  import RelationsManagement from "./dialog/RelationsManagement"
  import {listMultiClusterRepositories, deleteMultiClusterRepository} from "@/api/xpack/multi-cluster"
  import RepositoryErrorMessage from "./dialog/RepositoryErrorMessage";


  export default {
    name: "MultiClusterRepositoriesList",
    components: {RepositoryErrorMessage, RelationsManagement, ComplexTable, LayoutContent},
    data() {
      return {
        relationManagementOpened: false,
        repositoryErrorMessageOpened: false,
        currentRepositoryName: "",
        errorMessage: "123",
        buttons: [
          {
            label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
              this.$router.push({name: "MultiClusterRepositoryEdit", params: {name: row.name}})

            }
          },
          {
            label: this.$t('commons.button.relation'), icon: "el-icon-connection", click: (row) => {
              this.relationManagementOpened = true
              this.currentRepositoryName = row.name
            }
          },
          {
            label: this.$t('commons.button.log'), icon: "el-icon-notebook-2", click: (row) => {
              this.$router.push({name: "MultiClusterRepositoryLog", params: {name: row.name}})

            }
          },
          {
            label: this.$t('commons.button.delete'), icon: "el-icon-delete", click: (row) => {
              this.del(row.name)
            }
          },
        ],
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
            {
              field: "created_at",
              label: this.$t('commons.table.create_time'),
              component: "FuComplexDateTime",
              valueFormat: "yyyy-MM-dd"
            },
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
      showErrorMessage(item) {
        this.errorMessage = item.message
        this.repositoryErrorMessageOpened = true
      },
      create() {
        this.$router.push({name: "MultiClusterRepositoryCreate"})
      },
      search() {
        const {currentPage, pageSize} = this.paginationConfig
        listMultiClusterRepositories(currentPage, pageSize).then(data => {
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
                message: `${name}${this.$t('commons.msg.op_success')}!`
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
                message: this.$t('commons.msg.op_success'),
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
