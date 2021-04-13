<template>
  <layout-content :header="$t('host.host')">
    <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                   :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="100" fix>
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="6">
<!--              <font-awesome-icon icon="server" size="3x"/>-->
              <svg class="icon" aria-hidden="true" style="font-size: 24px"  >
                <use  xlink:href="#iconzhuji1"></use>
              </svg>
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
          <el-tag v-if="row.status === 'Failed'" type="danger" size="small">{{$t('commons.status.failed')}}</el-tag>
          <el-tag v-if="row.status === 'Initializing'" type="info" size="small">{{$t('commons.status.initializing')}}
            <font-awesome-icon icon="spinner" pulse/>

          </el-tag>
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
  import {deleteHost, searchHosts} from "@/api/hosts"
  import ComplexTable from "@/components/complex-table";

  export default {
    name: "Host",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        columns: [],
        buttons: [{
          label: 'commons.button.delete', icon: "el-icon-delete", type: "danger", click: (row) => {
            this.delete(row.name)
          },
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
      create() {
        this.$router.push({path: '/hosts/create'})
      },
      delete(name) {
        this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
          confirmButtonText: this.$t('commons.button.confirm'),
          cancelButtonText: this.$t('commons.button.cancel'),
          type: 'warning'
        }).then(() => {
          if (name) {
            deleteHost(name).then(() => {
              this.search()
              this.$message({
                type: 'success',
                message: `${name}${this.$t('commons.msg.delete_success')}!`
              });
            })
          } else {
            const ps = []
            for (const item of this.selects) {
              ps.push(deleteHost(item.name))
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
      search(conditions) {
        const {currentPage, pageSize} = this.paginationConfig
        searchHosts(currentPage, pageSize, conditions).then(data => {
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
