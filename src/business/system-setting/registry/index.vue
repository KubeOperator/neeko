<template>
    <complex-table :data="data" :columns="columns" :search-config="searchConfig" :selects.sync="selects"
                   :pagination-config="paginationConfig" @search="search">
      <template #toolbar>
        <el-button-group>
          <el-button size="small" @click="create()">{{$t('commons.button.create')}}</el-button>
          <el-button size="small" @click="del()" :disabled="selects.length===0">{{$t('commons.button.delete')}}</el-button>
        </el-button-group>
      </template>

      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('setting.table.registry.arch')" mix-width="80" fix prop="architecture"/>
      <el-table-column :label="$t('setting.table.registry.protocol')" mix-width="30" prop="protocol"/>
      <el-table-column :label="$t('setting.table.registry.hostname')" min-width="100" prop="hostname"/>
      <el-table-column :label="$t('commons.table.create_time')" prop="updatedAt">
        <template v-slot:default="{row}">
          {{ row.updatedAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>
</template>

<script>
// import LayoutContent from "@/components/layout/LayoutContent";
import ComplexTable from "@/components/complex-table";
import {listRegistry, deleteRegistry} from "@/api/system-setting";
export default {
  components: {
    ComplexTable,
    // LayoutContent
  },
  name: "Registry",
  data() {
    return{
      columns: [],
      selects: [],
      formLabelWidth: '120px',
      buttons: [
        {
          label: this.$t('commons.button.edit'), icon: "el-icon-edit", click: (row) => {
            this.$router.push({name: "RegistryEdit", params: {arch: row.architecture}})
          }
        }, {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete", type: "danger", click: (row) => {
            this.del(row.architecture)
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
      listRegistry(currentPage, pageSize, conditions).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    create() {
      this.$router.push({name: "RegistryCreate"})
    },
    del(arch) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (arch) {
          deleteRegistry(arch).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: `${name}${this.$t('commons.msg.delete_success')}!`
            });
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteRegistry(item.architecture))
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
