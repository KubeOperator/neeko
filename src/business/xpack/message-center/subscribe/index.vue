<template>
    <complex-table :header="$t('message.message_subscribe')" :data="data" v-loading="loading">
      <el-table-column :label="$t('message.message_type')" min-width="100" prop="type" fix/>
      <el-table-column :label="$t('message.message_in_station')">
        <template  v-slot:default="{row}">
          <el-switch  v-model="row.vars['LOCAL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.mail')">
        <template  v-slot:default="{row}">
          <el-switch v-model="row.vars['EMAIL']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(row,)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.work_wechat')">
        <template  v-slot:default="{row}">
          <el-switch v-model="row.vars['WORK_WEIXIN']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.dingTalk')">
        <template  v-slot:default="{row}">
          <el-switch v-model="row.vars['DING_TALK']" active-value="ENABLE" inactive-value="DISABLE" @change="updateConfig(row)"></el-switch>
        </template>
      </el-table-column>
    </complex-table>
</template>

<script>
  import ComplexTable from "@/components/complex-table"
  import { getMessageOfSubscribe, updateMessageOfSubscribe } from "@/api/xpack/message"

  export default {
    name: "MessageSubscribes",
    components: {ComplexTable},
    data() {
      return {
        data: [],
        loading: false,
      }
    },
    methods: {
      search() {
        this.loading = true
        getMessageOfSubscribe().then(data => {
          if (data !== null) {
            this.loading = false
            this.data = data
          }
        }).finally(() => {
          this.loading = false
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
