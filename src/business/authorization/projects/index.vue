<template>

  <el-tabs v-model="active" type="border-card">
    <el-tab-pane :label="$t('project.project')" name="project">
      <complex-table
              :data="data"
              local-key="project_columns"
              :pagination-config="paginationConfig"
              :search-config="searchConfig"
              @search="search">
        <template #header>
          <el-button size="small" @click="create()" v-permission="['ADMIN']">
            {{ $t("commons.button.create") }}
          </el-button>
        </template>
        <el-table-column type="selection" fix></el-table-column>
        <el-table-column :label="$t('commons.table.name')" min-width="100" fix>
          <template v-slot:default="{row}">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('commons.table.description')" min-width="150" prop="description"
                         fix></el-table-column>
        <el-table-column :label="$t('commons.table.create_time')">
          <template v-slot:default="{row}">
            {{ row.createdAt | datetimeFormat }}
          </template>
        </el-table-column>
        <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
      </complex-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {deleteProject, searchProject} from "@/api/projects"

export default {
  name: "ProjectList",
  components: { ComplexTable },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "ProjectEdit", params: { name: row.name } })
          }
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",

          click: this.openDelete
        }
      ],
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          {
            field: "name",
            label: this.$t("commons.table.name"),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          {
            field: "subnet",
            label: this.$t("automatic.ip_pool.subnet"),
            component: "FuComplexInput",
            defaultOperator: "eq"
          },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" },
        ]
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      loading: false,
      active: "project"
    }
  },
  methods: {
    search (condition) {
      const { currentPage, pageSize } = this.paginationConfig
      searchProject(currentPage, pageSize, condition).then(data => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    openDelete (row) {
      this.$confirm(
        this.$t("commons.confirm_message.delete"),
        this.$t("commons.message_box.prompt"),
        {
          confirmButtonText: this.$t("commons.button.confirm"),
          cancelButtonText: this.$t("commons.button.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deleteProject(row.name).then(() => {
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success")
            })
            this.search()
            this.$emit("refresh")
          })
        })
    },
    create () {
      this.$router.push({ name: "ProjectCreate" })
    },
    edit () {
      this.$router.push({ name: "ProjectEdit" })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style scoped>

</style>