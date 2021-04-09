<template>
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item :label="$t('message.dingTalk_phone')">
              <el-input v-model="form.vars['DING_TALK']"></el-input>
              <div><span class="input-help">{{$t('message.dingTalk_phone_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.work_wechat_id')">
              <el-input v-model="form.vars['WORK_WEIXIN']"></el-input>
              <div><span class="input-help">{{$t('message.work_wechat_id_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.email')">
              <el-input v-model="form.vars['EMAIL']"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.create')}}</el-button>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
</template>

<script>
import { getMessageReceicver, updateMessageReceicver } from "@/api/xpack/message"

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
    }
  },
  methods: {
    onSubmit() {
      updateMessageReceicver(this.form).then(() => {
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "MessageReceiver"})
      })
    },
    search() {
      getMessageReceicver().then((data) => {
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
