<template>
  <complex-table local-key="credential_columns" :data="data" :search-config="searchConfig" :selects.sync="selects"
                 v-loading="loading" :pagination-config="paginationConfig" @search="search">
    <template #toolbar>
      <el-button-group>
        <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
        <el-button size="small" @click="del()"  :disabled="selects.length===0">{{$t('commons.button.delete')}}</el-button>
      </el-button-group>
    </template>

    <el-table-column type="selection" fix></el-table-column>
    <el-table-column :label="$t('commons.table.name')" mix-width="80" fix prop="name"/>
    <el-table-column :label="$t('commons.table.username')" mix-width="30" prop="username"/>
    <el-table-column :label="$t('commons.table.type')" min-width="100" prop="type"/>
    <el-table-column :label="$t('commons.table.create_time')" prop="updatedAt">
      <template v-slot:default="{row}">
        {{ row.updatedAt | datetimeFormat }}
      </template>
    </el-table-column>
    <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
  </complex-table>

</template>

<script>
import {deleteCredentials, searchCredential} from "@/api/credentials";
import ComplexTable from "@/components/complex-table";
export default {
  name: "CredentialList",
  components: {
    ComplexTable
  },
  data() {
    return{
      selects: [],
      formLabelWidth: '120px',
      buttons: [
        {
          label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
            this.$router.push({name: "CredentialEdit", params: {data: row}})
          }
        }, {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete",  click: (row) => {
            this.del(row.name)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t('commons.table.name'), component: "FuComplexInput", defaultOperator: "eq" },
          {
            field: "username",
            label: this.$t('commons.table.username'),
            component: "FuComplexInput",
          },
          {
            field: "type",
            label: this.$t('commons.table.type'),
            component: "FuComplexSelect",
            options: [
              { label: 'password', value: 'password' },
              { label: 'privateKey', value: 'privateKey' },
            ],
            multiple: true
          },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      loading: false,
    }
  },
  methods: {
    search(conditions) {
      this.loading = true
      const {currentPage, pageSize} = this.paginationConfig
      searchCredential(currentPage, pageSize, conditions).then(data => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({name: "CredentialCreate"})
    },
    del(name) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (name) {
          deleteCredentials(name).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: `${name}${this.$t('commons.msg.delete_success')}!`
            });
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteCredentials(item.name))
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
    }
  },
  created() {
    this.search()
  }
}
</script>

<style scoped>

</style>
