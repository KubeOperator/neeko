<template>
    <el-row>
      <el-col :span="2"><br /></el-col>
      <el-col :span="13">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :model="form" label-width="180px">
            <el-form-item :label="$t('message.dingTalk_phone')">
              <el-input v-model="form.vars['DING_TALK']"></el-input>
              <div><span class="input-help">{{$t('message.dingTalk_phone_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.work_wechat_id')">
              <el-input v-model="form.vars['WORK_WEIXIN']"></el-input>
              <div>
                <span class="input-help">{{$t('message.work_wechat_id_help')}}</span>
                <a class="input-help" target="_blank"  href="https://work.weixin.qq.com/api/doc/90000/90135/90665" style="color: #2D61A2;">{{$t('message.work_wechat_url_help')}}</a>
              </div>
            </el-form-item>
            <el-form-item :label="$t('message.email')">
              <el-input v-model="form.vars['EMAIL']"></el-input>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="onSubmit">{{$t('commons.button.create')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
</template>

<script>
import { getMessageReceiver, updateMessageReceicver } from "@/api/xpack/message"

export default {
  name: "MessageReceiver",
  data() {
    return {
      form: {
        "id": "",
        "userId": "",
        "vars": {
          "DING_TALK": "",
          "EMAIL": "",
          "WORK_WEIXIN": ""
        }
      },
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      updateMessageReceicver(this.form).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "MessageReceiver"})
      }).finally(() => {
        this.loading = false
      })
    },
    search() {
      getMessageReceiver().then((data) => {
        this.form = data
      })
    },
    onCancel() {
      this.$router.push({ name: "MessageReceiver" })
    },
  },
  mounted() {
    this.search()
  },
}
</script>

<style scoped>
</style>
