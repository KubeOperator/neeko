<template>
  <div class="step">
    <div class="step-header">
      <el-steps :active="currentActive" class="fu-steps" v-bind="stepsAttrs" simple>
        <el-step :key="index" v-bind="step" v-for="(step, index) of computedSteps"></el-step>
      </el-steps>
    </div>
    <div class="step-content">
      <slot name="step-content" :activeIndex="currentActive"></slot>
    </div>
    <div class="step-footer">
      <fu-step-button
        :currentActive="currentActive"
        :steps="steps"
        @stepChange="change($event)"
        :submit="submit"
        :cancel="cancel"
      ></fu-step-button>
    </div>
  </div>
</template>
<script>
import FuStepButton from "./fu-step-button"
export default {
  name: "FuSteps",
  components: { FuStepButton },
  data() {
    return {
      currentActive: 1
    }
  },
  model: {},
  props: {
    stepsAttrs: {
      default() {
        return {
          "finish-status": "success"
        }
      }
    },
    steps: {
      required: true
    },
    submit: {
      type: Function,
      required: true
    },
    cancel: {
      type: Function,
      required: true
    }
  },
  watch: {},
  computed: {
    computedSteps() {
      const steps = this.steps
      const res = steps.map(item => {
        if (typeof item === "string") {
          item = {
            title: item
          }
        }
        return item
      })
      return res
    }
  },
  methods: {
    change(value) {
      this.currentActive = value
    },
    setActive() {
      this.$emit("active-index", this.currentActive)
    }
  },
  mounted: function() {
    this.setActive()
  }
}
</script>

<style>
.step {
  position: relative;
  height: 100%;
}
.step-content {
  overflow: auto;
  height: 800px;
}
.step-footer {
  position: absolute;
  right: 5px;
  bottom: 5px;
}
</style>