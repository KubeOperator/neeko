<template>
  <layout-content>
    Element UI的指令，但是文档上没写，但是挺好用的，这里写个例子。
    <br><br>
    点击1，触发2，3的外部事件
    <br><br>
    点击空白处，触发1，2，3的外部事件
    <br><br>
    控制台查看触发事件
    <br><br>
    <el-button v-click-outside="clickOutside(1)">1</el-button>
    <el-button v-click-outside="clickOutside(2)">2</el-button>
    <el-button v-click-outside="clickOutside(3)">3</el-button>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent";

export default {
  name: "ClickOutsideDemo",
  components: {LayoutContent},
  methods: {
    clickOutside(i) {
      return () => {
      }
    }
  }
}
</script>

<style scoped>

</style>
