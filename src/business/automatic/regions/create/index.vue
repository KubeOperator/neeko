<template>
  <layout-content>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
export default {
  name: "RegionCreate",
  components: { LayoutContent },
  data() {
    return {
      form: {
        regionVars: {},
        provider: "",
        datacenter: "",
        vars: "",
        name: ""
      },
      stepConfig: [
        { title: "步骤1", description: "描述文字1.." },
        { title: "步骤2", description: "描述文字2.." },
        { title: "步骤3", description: "描述文字3.." }
      ]
    }
  },
  methods: {
    submit() {},
    cancel() {
      this.$router.push("/automatic/regions")
    }
  }
}
</script>

<style scoped>
</style>

