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

