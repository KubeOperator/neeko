<template>
  <header class="header-container">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: "LayoutHeader",
}
</script>

<style>
  .header-container {
      background-color: #fa5d50;
  }
</style>
