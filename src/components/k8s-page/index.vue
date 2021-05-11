<template>
  <div>
    <el-button :disabled="!ko_nextToken || ko_btnLoading" size="mini" style="float:right" icon="el-icon-caret-right" @click="getPageNext()"></el-button>
    <span style="float:right; margin-top: 7px">{{ko_currentPage}}</span>
    <el-button :disabled="ko_currentPage===1 || ko_btnLoading" size="mini" style="float:right" icon="el-icon-caret-left" @click="getPageAhead()"></el-button>
  </div>
</template>
          
<script>
export default {
  name: "K8sPage",
  props: {
    nextToken: String,
    currentPage: Number,
  },
  watch: {
    nextToken: {
      handler(newName) {
        this.ko_nextToken = newName
      },
      immediate: true,
    },
    currentPage: {
      handler(newName) {
        this.ko_currentPage = newName ? newName : this.ko_currentPage
      },
      immediate: true,
    },
  },
  data() {
    return {
      ko_aheadToken: [],
      ko_continueToken: "",
      ko_nextToken: "",
      ko_currentPage: 1,
      ko_btnLoading: false,
    }
  },
  methods: {
    getPageAhead() {
      this.ko_btnLoading = true
      this.ko_currentPage--
      this.ko_continueToken = this.ko_aheadToken[this.ko_aheadToken.length - 1]
      this.ko_aheadToken.pop()
      this.$emit("pageChange", {token: this.ko_continueToken, page: this.ko_currentPage})
      this.ko_btnLoading = false
    },
    getPageNext() {
      this.ko_currentPage++
      this.ko_aheadToken.push(this.ko_continueToken)
      this.ko_continueToken = this.ko_nextToken
      this.$emit("pageChange", {token: this.ko_continueToken, page: this.ko_currentPage})
    },
  },
}
</script>
          
<style>
</style>