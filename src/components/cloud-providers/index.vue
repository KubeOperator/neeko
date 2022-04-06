<template>
  <div>
    <svg v-if="provider === 'OpenStack'" class="icon" aria-hidden="true">
      <use xlink:href="#iconopenstack"></use>
    </svg>
    <svg v-if="provider === 'vSphere'" class="icon" aria-hidden="true">
      <use xlink:href="#iconvmware"></use>
    </svg>
    <svg v-if="provider === 'FusionCompute'" class="icon" aria-hidden="true">
      <use xlink:href="#iconhuawei"></use>
    </svg>
    {{provider}}
  </div>
</template>

<script>
export default {
  name: "CloudProviders",
  components: {},
  props: {
    provider: String
  }
}
</script>
