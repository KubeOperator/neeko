<template>
  <complex-table :data="data" :columns="columns" :search-config="searchConfig"
                 :pagination-config="paginationConfig" @search="search">
    <template #toolbar>
      <el-button-group>
        <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
      </el-button-group>
    </template>

    <el-table-column type="selection" fix></el-table-column>
    <el-table-column :label="$t('commons.table.name')" mix-width="80" fix prop="name"/>
    <el-table-column :label="$t('credential.username')" mix-width="30" prop="username"/>
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
import {listCredentials,deleteCredentials} from "@/api/credentials";
import ComplexTable from "@/components/complex-table";
export default {
  name: "Credential",
  components: {
    ComplexTable
  },
  data() {
    return{
      columns: [],
      formLabelWidth: '120px',
      buttons: [
        {
          label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
            this.$router.push({name: "CredentialEdit", params: {data: row}})
          }
        }, {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete", type: "danger", click: (row) => {
            this.del(row.name)
          }
        },
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
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
    search(conditions) {
      const {currentPage, pageSize} = this.paginationConfig
      listCredentials(currentPage, pageSize, conditions).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({name: "CredentialCreate"})
    },
    del(arch) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (arch) {
          deleteCredentials(arch).then(() => {
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
