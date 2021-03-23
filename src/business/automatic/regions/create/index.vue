<template>
  <layout-content>
    <fu-steps :steps="stepConfig" :submit="submit" :cancel="cancel">
      <fu-step-content slot="step-content" :index="1">
        <div slot="content-detail">
          <el-form :model="form" size="small">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </fu-step-content>
      <fu-step-content :index="2" slot="step-content"></fu-step-content>
      <fu-step-content :index="3" slot="step-content"></fu-step-content>
    </fu-steps>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import FuSteps from "@/components/fu-steps"
import FuStepContent from "@/components/fu-steps/fu-step-content"
export default {
  name: "RegionCreate",
  components: { LayoutContent, FuSteps, FuStepContent },
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

