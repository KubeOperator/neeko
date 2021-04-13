<template>
    <layout-content>
      <complex-table :header="$t('route.message')" :selects.sync="selects" :data="data" :pagination-config="paginationConfig">
        <template #header>
          <el-button-group>
            <el-button size="small" :disabled="selects.length < 1" round @click="markAsRead()">
              {{ $t("message.mark_as_read") }}</el-button>
            <el-button size="small" :disabled="selects.length < 1" round @click="remove()">
              {{ $t("commons.button.delete") }}</el-button>
          </el-button-group>
        </template>

        <el-table-column type="selection" fix></el-table-column>
        <el-table-column :label="$t('message.content')" min-width="100" prop="content" fix />
        <el-table-column :label="$t('message.type')" min-width="100" prop="spec.type" fix />
        <el-table-column :label="$t('message.level')" min-width="100" prop="level" />
        <el-table-column :label="$t('commons.table.status')" min-width="100" prop="readStatus" />
        <el-table-column :label="$t('commons.table.create_time')">
          <template v-slot:default="{ row }">
            {{ row.createdAt | datetimeFormat }}
          </template>
        </el-table-column>
      </complex-table>
    </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent";
import ComplexTable from "@/components/complex-table";
import {getMessagesByUser} from "@/api/xpack/message";

export default {
  name: "MessageCenter",
  components: {
    LayoutContent,
    ComplexTable
  },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      selects: [],
      data: [],
    }
  },
  methods: {
    markAsRead() {},
    remove() {},
    search() {
      const { currentPage, pageSize } = this.paginationConfig
      getMessagesByUser(currentPage, pageSize).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
  },
  created() {
    // this.search()
  },
}
</script>

<style scoped>

</style>
