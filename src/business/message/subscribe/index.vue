<template>
  <layout-content>
    <complex-table :header="$t('route.message_subscribe')" :data="data">
      <el-table-column :label="$t('message.message_type')" min-width="100" prop="type" fix/>
      <el-table-column :label="$t('message.message_in_station')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['LOCAL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row, 'LOCAL')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.mail')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['EMAIL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row,'EMAIL')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.work_wechat')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['WORK_WEIXIN']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row,'WORK_WEIXIN')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.dingding')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['DING_TALK']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row,'DING_TALK')"></el-switch>
        </template>
      </el-table-column>
    </complex-table>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent"
  import ComplexTable from "@/components/complex-table"
  import { getMessageOfSubscribe, updateMessageOfSubscribe } from "@/api/message"

  export default {
    name: "Message",
    components: {ComplexTable, LayoutContent},
    data() {
      return {
        data: [
          {
            "id": "657c4590-2001-48dd-bd4f-e24f9f0185b4",
            "userId": "5e81095f-3c0c-4cb2-8033-bde03d60135c",
            "vars": {
              "DING_TALK": "DISABLE",
              "EMAIL": "DISABLE",
              "LOCAL": "ENABLE",
              "WORK_WEIXIN": "DISABLE"
            },
            "type": "CLUSTER"
          },
          {
            "id": "e2d2a7f2-bee2-4273-8edf-f8bf1f3057c4",
            "userId": "5e81095f-3c0c-4cb2-8033-bde03d60135c",
            "vars": {
              "DING_TALK": "DISABLE",
              "EMAIL": "DISABLE",
              "LOCAL": "ENABLE",
              "WORK_WEIXIN": "DISABLE"
            },
            "type": "SYSTEM"
          }
        ],
      }
    },
    methods: {
      search() {
        getMessageOfSubscribe().then(data => {
          if (data !== null) {
            this.data = data
          }
        })
      },
      updateConfig(item, type) {
        item.vars[type] = (item.vars[type] === "DISABLE") ? "ENABLE" : "DISABLE"
        updateMessageOfSubscribe(item).then(data => {
          console.log(data)
          this.$message({message: this.$t('commons.msg.message'), type: "success"})
          this.search()
        })
      }
    },
    mounted() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
