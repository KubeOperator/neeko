<template>
  <div>

    <div v-if="status ==='Running'">
      <span class="iconfont iconduihao" style="color: #32B350"></span>
      {{ $t("commons.status.running") }}
    </div>
    <div v-if="status === 'Failed'">
      <span class="iconfont icongantanhao" style="color: #FA4147"></span>
      <el-button type="text" @click="getDetail()">
          <span class="koLink">
              {{ $t("commons.status.failed") }}
          </span>
      </el-button>
    </div>
    <div v-if="status === 'Initializing'">
      <span><i class="el-icon-loading"/></span>
      <el-button type="text" @click="getDetail()">
          <span class="koLink">
              {{ $t("commons.status.initializing") }}
          </span>
      </el-button>
    </div>
    <div v-if="status === 'Upgrading' ">
      <span><i class="el-icon-loading"/></span>
      <el-button type="text" @click="getDetail()">
          <span class="koLink">
              {{ $t("commons.status.initializing") }}
          </span>
      </el-button>
    </div>
    <div v-if="status === 'Upgrading' ">
      <span><i class="el-icon-loading"/></span>
      <el-button type="text" @click="getDetail()">
          <span class="koLink">
              {{ $t("commons.status.initializing") }}
          </span>
      </el-button>
    </div>
    <div v-if="status === 'Terminating' && other==='bareMetal' ">
      <span><i class="el-icon-loading"/></span>
      <el-button type="text" @click="getDetail()">
          <span class="koLink">
              {{ $t("commons.status.initializing") }}
          </span>
      </el-button>
    </div>
    <div v-if="status === 'Creating'">
      <i class="el-icon-loading"/>{{ $t("commons.status.creating") }}
    </div>
  </div>
</template>

<script>
export default {
  name: "KoStatus",
  props: ["status", "content", "other"],
  methods: {
    getDetail () {
      this.$emit("detail")
    }
  }
}
</script>

<style scoped>

</style>