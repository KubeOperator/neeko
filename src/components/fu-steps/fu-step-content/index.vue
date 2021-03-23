<template v-slot:step-content="active">
  <div>
    {{index}}
    {{active.activeIndex}}
    <slot name="content-detail"></slot>
  </div>
</template>

<script>
export default {
  name: "FuStepContent",
  data() {
    return {
      active: {}
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  methods: {}
}
</script>

<style>
</style>
