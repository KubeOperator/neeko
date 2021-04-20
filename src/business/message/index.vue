<template>
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
import { getMessagesByUser } from "@/api/xpack/message"

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
