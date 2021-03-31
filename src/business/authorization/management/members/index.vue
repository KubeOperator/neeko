<template>
  <el-row>
    <complex-table
            :data="data"
            :colums="columns"
            :pagination-config="paginationConfig">
      <template #header>
        <el-button-group>
          <el-button size="small" @click="create()">
            {{ $t("commons.button.create") }}
          </el-button>
          <el-button size="small">{{ $t("commons.button.delete") }}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.userName }}</template>
      </el-table-column>
      <el-table-column :label="$t('user.email')" mix-width="100">
        <template v-slot:default="{ row }">{{ row.email }}</template>
      </el-table-column>
      <el-table-column :label="$t('user.role')">
        <template v-slot:default="{ row }">
          <el-tag type="info" size="small">
            {{ $t("project."+row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">{{ row.createdAt | datetimeFormat }}</template>
      </el-table-column>
    </complex-table>
  </el-row>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {listProjectMembers} from "@/api/project-member"

export default {
  name: "MemberList",
  components: { ComplexTable },
  props: ["name", "type"],
  data () {
    return {
      columns: [],
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: this.openDelete
        }
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
    }
  },
  created () {
    if (this.type === "PROJECT") {
      this.listMemberList()
    }
  },
  methods: {
    listMemberList () {
      const { currentPage, pageSize } = this.paginationConfig
      if (this.type === "PROJECT") {
        listProjectMembers(this.name, currentPage, pageSize).then(data => {
          this.data = data.items
          this.paginationConfig.total = data.total
        })
      }
    },
  },
  computed: {
    member() {
      const {name,type} = this
      return {
        name,type
      }
    }
  },
  watch: {
    member: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.listMemberList()
        }
      }
    },
  }
}
</script>

<style scoped>

</style>