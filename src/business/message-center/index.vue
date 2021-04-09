<template>
  <layout-content :header="$t('route.message_center')">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/xpack/message-center/message'">{{$t('message.message')}}</el-menu-item>
      <el-menu-item :index="'/xpack/message-center/receiver'">{{$t('message.message_receiver')}}</el-menu-item>
      <el-menu-item :index="'/xpack/message-center/subscribe'">{{$t('message.message_subscribe')}}</el-menu-item>
    </el-menu>
    <br/>
    <router-view></router-view>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "Message",
  components: { LayoutContent },
}
</script>

<style scoped></style>
