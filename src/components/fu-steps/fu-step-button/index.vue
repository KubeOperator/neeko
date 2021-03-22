<template>
  <div>
    <el-button-group>
      <el-button v-if="activeIndex == 1" icon="el-icon-circle-close" @click="cancel">取消</el-button>
      <el-button v-if="activeIndex > 1" icon="el-icon-arrow-left" @click="previousStep()">上一步</el-button>
      <el-button v-if="activeIndex!= stepsArray.length" type="primary" @click="nextStep()">
        下一步
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
      <el-button v-else type="primary" @click="submit">
        提交
        <i class="el-icon-circle-check"></i>
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: "FuStepButton",
  data() {
    return {
      activeIndex: this.currentActive,
      stepsArray: this.steps
    }
  },
  model: {},
  props: {
    currentActive: {
      type: Number,
      default: 0,
      required: true
    },
    steps: {
      type: Array,
      default: function() {
        return []
      },
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
  watch: {
    activeIndex(value) {
      this.$emit("stepChange", value)
    }
  },
  methods: {
    nextStep() {
      this.activeIndex = this.activeIndex + 1
    },
    previousStep() {
      this.activeIndex = this.activeIndex - 1
    }
  }
}
</script>

