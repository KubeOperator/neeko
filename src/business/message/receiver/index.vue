<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item :label="$t('message.dingTalk_phone')">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('message.dingTalk_phone_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.work_wechat_id')">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('message.work_wechat_id_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.email')">
              <el-input v-model="form.name"></el-input>
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
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getMessageReceicver, updateMessageReceicver } from "@/api/xpack/message"

export default {
  name: "MessageReceiver",
  components: { LayoutContent },
  data() {
    return {
      form: {
        name: "",
      },
    }
  },
  methods: {
    onSubmit() {
      updateMessageReceicver(this.form).then((data) => {
        console.log(data)
      })
    },
    search() {
      getMessageReceicver().then((data) => {
        console.log(data)
      })
    },
    onCancel() {
      this.$router.push({ name: "Messages" })
    },
  },
  mounted() {
    this.search()
  },
}
</script>

<style scoped>
</style>
