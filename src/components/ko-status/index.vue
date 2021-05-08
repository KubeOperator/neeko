<template>
  <div class="ko-status">

    <div v-if="status ==='Running'">
      <span class="iconfont iconduihao" style="color: #32B350"></span>
      {{ $t("commons.status.running") }}
    </div>
    <div v-if="status === 'Failed'">
      <span class="iconfont iconerror" style="color: #FA4147"></span> &nbsp; &nbsp; &nbsp;
      <el-link type="info" @click="getDetail()">{{ $t("commons.status.failed") }}</el-link>
    </div>
    <div v-if="status === 'Initializing'">
      <i class="el-icon-loading"/>&nbsp; &nbsp; &nbsp;
      <span v-if="other==='host'">{{ $t("commons.status.initializing") }}</span>
      <el-link v-else type="info" @click="getDetail()"> {{ $t("commons.status.initializing") }}</el-link>
    </div>
    <div v-if="status === 'Upgrading' ">
      <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
      <el-link @click="getDetail()" type="info"> {{ $t("commons.status.upgrading") }} </el-link>
    </div>
    <div v-if="status === 'Terminating' && other==='bareMetal' ">
      <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
      <el-link type="info" @click="getDetail()">{{ $t("commons.status.terminating") }} </el-link>
    </div>
    <div v-if="status === 'Terminating' && other==='plan' ">
      <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
      <span>{{ $t("commons.status.terminating") }} </span>
    </div>
    <div v-if="status === 'Terminating' && other==='host' ">
      <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
      <span>{{ $t("commons.status.terminating") }} </span>
    </div>
    <div v-if="status === 'Synchronizing' && other==='host' ">
      <i class="el-icon-loading"/> &nbsp; &nbsp; &nbsp;
      <span>{{ $t("commons.status.synchronizing") }} </span>
    </div>
    <div v-if="status === 'Creating'">
      <i class="el-icon-loading"/>{{ $t("commons.status.creating") }}
    </div>
    <div v-if="status ==='active'">
      <span class="iconfont iconduihao" style="color: #32B350"></span>
      {{ $t("commons.status.active") }}
    </div>
    <div v-if="status ==='passive'">
      <span class="iconfont icondiable" style="color: #FA4147"></span>
      {{ $t("commons.status.passive") }}
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
