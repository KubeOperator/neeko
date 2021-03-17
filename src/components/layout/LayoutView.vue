<template>
  <main class="view-container">
    <transition name="el-fade-in" mode="out-in">
      <router-view :key="key"/>
    </transition>
  </main>
</template>

<script>
  export default {
    name: "LayoutView",
    computed: {
      key() {
        return this.$route.path
      }
    }
  }
</script>
