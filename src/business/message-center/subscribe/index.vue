<template>
    <complex-table :header="$t('message.message_subscribe')" :data="data">
      <el-table-column :label="$t('message.message_type')" min-width="100" prop="type" fix/>
      <el-table-column :label="$t('message.message_in_station')">
        <template slot-scope="scope">
          <el-switch  v-model="scope.row.vars['LOCAL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.mail')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['EMAIL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row,)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.work_wechat')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['WORK_Wechat']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.dingTalk')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.vars['DING_TALK']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(scope.row)"></el-switch>
        </template>
      </el-table-column>
    </complex-table>
</template>

<script>
  import ComplexTable from "@/components/complex-table"
  import { getMessageOfSubscribe, updateMessageOfSubscribe } from "@/api/message"

  export default {
    name: "MessageSubscribes",
    components: {ComplexTable},
    data() {
      return {
        data: [],
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
      updateConfig(item) {
        // item.vars[type] = (item.vars[type] === "DISABLE") ? "ENABLE" : "DISABLE"
        updateMessageOfSubscribe(item).then(
          this.$message({
            type: 'success',
            message: this.$t('commons.msg.update_success')
          })
        )
      }
    },
    mounted() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
