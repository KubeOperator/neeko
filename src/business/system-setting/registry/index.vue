<template>
  <div>
    <complex-table local-key="registry_columns" :data="data" :search-config="searchConfig" :selects.sync="selects"
                   v-loading="loading" :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" @click="del()" :disabled="selects.length===0">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('setting.table.registry.arch')" mix-width="80" fix prop="architecture"/>
      <el-table-column :label="$t('setting.table.registry.protocol')" mix-width="30" prop="protocol"/>
      <el-table-column :label="$t('setting.table.registry.hostname')" min-width="100" prop="hostname">
        <template v-slot:default="{row}">
          <el-link style="font-size: 12px" type="info" @click="goForNexus(row)">{{ row.hostname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')" prop="updatedAt">
        <template v-slot:default="{row}">
          {{ row.updatedAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog class="ko-tips"
      :title="$t('commons.message_box.prompt')"
      :show-close="true"
      :visible.sync="tipsVisible"
      width="40%">

      <complex-table
        :data="tipstableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          :label="$t('commons.table.name')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
          :label="$t('commons.table.description')">
          <template v-slot:default="{row}" >
              <el-link v-if="[row.value].toString().indexOf('http') != -1" style="font-size: 12px" type="info" @click="goToNexus(row.value)">{{ row.value }}</el-link>
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
      </complex-table>
      <br>
      <div style="line-height: 150%">
        <span style="font-weight: bolder">{{$t('manifest.see_documentation')}}:</span><br>
        <a style="color: #447DF7" href="https://kubeoperator.io/docs/user_manual/system_management/" target="_blank">https://kubeoperator.io/docs/user_manual/system_management/</a>
        <span slot="footer" class="dialog-footer">
      </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table";
import {deleteRegistry, searchRegistry} from "@/api/system-setting";
export default {
  components: {
    ComplexTable,
  },
  name: "Registry",
  data() {
    return{
      selects: [],
      formLabelWidth: '120px',
      buttons: [
        {
          label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
            this.$router.push({name: "RegistryEdit", params: {id: row.id}})
          }
        }, {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete",  click: (row) => {
            this.del(row.id)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          {
            field: "architecture",
            label: this.$t('setting.table.registry.arch'),
            component: "FuComplexInput",
            defaultOperator: "eq" },
          {
            field: "protocol",
            label: this.$t('setting.table.registry.protocol'),
            component: "FuComplexSelect",
            options: [
              { label: "http", value: 'http' },
              { label: "https", value: 'https' },
            ],
            multiple: true
          },
          {
            field: "hostname",
            label: this.$t('setting.table.registry.hostname'),
            component: "FuComplexInput",
            defaultOperator: "eq",
          },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      tipsVisible: false,
      data: [],
      loading: false,
      tipstableData: []
    }
  },
  methods: {
    search(conditions) {
      this.loading = true
      const {currentPage, pageSize} = this.paginationConfig
      searchRegistry(currentPage, pageSize, conditions).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({name: "RegistryCreate"})
    },
    del(id) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (id) {
          deleteRegistry(id).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: `${name}${this.$t('commons.msg.delete_success')}!`
            });
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteRegistry(item.id))
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
    goForNexus(row) {
      this.tipsVisible = true
      this.tipstableData = []
      this.tipstableData.push({
        name: this.$t('setting.table.registry.registry_address'),
        value: row.protocol + "://" + row.hostname + ":" + row.repoPort,
      },{
        name: this.$t('user.username'),
        value: 'admin'
      },{
        name: this.$t('setting.table.registry.default_password'),
          value: 'admin123'
      },{
        name: 'RegistryPort',
          value: row.registryPort
      },{
        name: 'RegistryHostedPort',
        value: row.registryHostedPort
      })
    },
    goToNexus(url) {
      window.open(url, "_blank");
    }
  },
  created() {
    this.search()
  }
}
</script>

<style scoped>
</style>
