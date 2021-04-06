<template>
<!--  <layout-content>-->
<!--    <complex-table :header="$t('route.message')" @selection-change="handleSelectionChange" :data="data" :pagination-config="paginationConfig">-->
<!--      <template #header>-->
<!--        <el-button-group>-->
<!--          <el-button size="small" :disabled="Selection.length < 1" round @click="markAsRead()">-->
<!--            {{ $t("message.mark_as_read") }}</el-button>-->
<!--          <el-button size="small" :disabled="Selection.length < 1" round @click="remove()">-->
<!--            {{ $t("commons.button.delete") }}</el-button>-->
<!--        </el-button-group>-->
<!--      </template>-->

<!--      <el-table-column type="selection" fix></el-table-column>-->
<!--      <el-table-column :label="$t('message.content')" min-width="100" prop="content" fix />-->
<!--      <el-table-column :label="$t('message.type')" min-width="100" prop="spec.type" fix />-->
<!--      <el-table-column :label="$t('message.level')" min-width="100" prop="level" />-->
<!--      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="readStatus" />-->
<!--      <el-table-column :label="$t('commons.table.create_time')">-->
<!--        <template v-slot:default="{ row }">-->
<!--          {{ row.createdAt | datetimeFormat }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </complex-table>-->
<!--  </layout-content>-->
  <layout-content :header="$t('route.message')">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/message/message-center'">消息中心</el-menu-item>
      <el-menu-item :index="'/message/receiver'">接受源</el-menu-item>
      <el-menu-item :index="'/message/subscribe'">消息订阅</el-menu-item>
    </el-menu>
    <br/>
    <router-view></router-view>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
// import ComplexTable from "@/components/complex-table"
import { getMessagesByUser } from "@/api/message"

export default {
  name: "Message",
  components: { LayoutContent },
  data() {
    return {
      paginationConfig: {
        currentPage: "1",
        pageSize: 5,
        total: 0,
      },
      Selection: [],
      data: [],
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.Selection = val
    },
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

<style scoped></style>
