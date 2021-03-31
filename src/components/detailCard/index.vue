<template>
  <div class="content">
    <el-row v-for="item in items" :key="'card-' + item.key" style="font-weight: bold;color: #676a6c" :gutter="10" class="item">
      <el-col :span="6">
        <div :style="{ 'text-align': align }" class="item-label"><label>{{ item.key }}: </label></div>
      </el-col>
      <el-col :span="18" >
        <span v-if="item.value == 'valid'" class="item-text" style="color: green" >
          {{ $t('setting.table.license.valid') }}
        </span>
        <span v-else-if="item.value == 'invalid'" class="item-text" style="color: #ff0000">
          {{ $t('setting.table.license.invalid') }}
        </span>
        <span v-else-if="item.value == 'expired'" class="item-text" style="color: red">
          {{ $t('setting.table.license.expired') }}
        </span>
        <span v-else class="item-text" >
          {{ item.value }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DetailCard',
  props: {
    title: {
      type: String,
      default() {
        return this.$t('common.BasicInfo')
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    align: {
      type: String,
      default: 'left'
    }
  },
  created() {
  }
}
</script>

<style scoped>
  .content {
    font-size: 13px;
    line-height: 2.5;
  }
</style>
