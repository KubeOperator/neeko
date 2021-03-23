<template>
  <layout-content>
    <complex-table :header="$t('route.message_subscribe')" :data="data" :pagination-config="paginationConfig">
      <el-table-column :label="$t('message.message_type')" min-width="100" prop="content" fix/>
      <el-table-column :label="$t('message.message_in_station')" min-width="100" prop="spec.type" fix/>
      <el-table-column :label="$t('message.mail')" min-width="100" prop="level"/>
      <el-table-column :label="$t('message.enterprise_wechat')" min-width="100" prop="readStatus"/>
      <el-table-column :label="$t('message.dingding')" min-width="100" prop="readStatus"/>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent"
  import ComplexTable from "@/components/complex-table"
  import { getMessagesByUser } from "@/api/message"

  export default {
    name: "Message",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        paginationConfig: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        data: [],
      }
    },
    methods: {
      search() {
        const {currentPage, pageSize} = this.paginationConfig
        getMessagesByUser(currentPage, pageSize).then(data => {
          this.data = data.items;
          this.paginationConfig.total = data.total
        })
      }
    }
  }
</script>

<style scoped>

</style>
