<template>
  <el-tabs  tab-position="left" style="height: 510px">
    <el-tab-pane :label="$t('setting.table.message.wechat')">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item  style="width: 50%" label="corpid" required>
          <el-input v-model="form.vars['WORK_WEIXIN_CORP_ID']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" label="agentid" required>
          <el-input v-model="form.vars['WORK_WEIXIN_AGENT_ID']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" label="secret" required>
          <el-input v-model="form.vars['WORK_WEIXIN_CORP_SECRET']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" :label="$t('setting.table.message.testUser')" required>
          <el-input v-model="form.vars['WORK_WEIXIN_TEST_USER']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" :label="$t('setting.table.message.status')" required>
          <el-switch
            v-model="form.vars['WORK_WEIXIN_STATUS']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ENABLE"
            inactive-value="DISABLE"
            :active-text="$t('commons.button.enable')"
            :inactive-text="$t('commons.button.disable')">
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <a href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq/26eaddd5"  target="_blank" class="link-color">{{ $t('setting.table.message.wechatConcept')}}</a><br/>
          <a href="https://ding-doc.dingtalk.com/doc#/faquestions/eovtrt"  target="_blank" class="link-color">{{ $t('setting.table.message.wechatLimit')}}</a>
          <p style="font-size: 12px;color: #4E5051">{{ $t('setting.helpInfo.messageInfo')}}</p>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="wechatVerify" :disabled="btnSelect">{{$t('commons.button.verify')}}</el-button>
          <el-button type="primary" @click="wechatOnSubmit" :disabled="btn">{{$t('commons.button.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane :label="$t('setting.table.message.dingTalk')">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item  style="width: 50%" :label="$t('setting.table.message.webhookAddress')" required>
          <el-input v-model="form.vars['DING_TALK_WEBHOOK']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" label="secret" required>
          <el-input v-model="form.vars['DING_TALK_SECRET']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" :label="$t('setting.table.message.testUser')" required>
          <el-input v-model="form.vars['DING_TALK_TEST_USER']"></el-input>
        </el-form-item>
        <el-form-item  style="width: 50%" :label="$t('setting.table.message.status')" required>
          <el-switch
            style="display: block"
            v-model="form.vars['DING_TALK_STATUS']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ENABLE"
            inactive-value="DISABLE"
            :active-text="$t('commons.button.enable')"
            :inactive-text="$t('commons.button.disable')">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <a href="https://work.weixin.qq.com/api/doc/90000/90135/90665"  target="_blank" class="link-color">{{ $t('setting.table.message.dingTalkConcept')}}</a><br/>
          <a href="https://work.weixin.qq.com/api/doc/90000/90139/90312"  target="_blank" class="link-color">{{ $t('setting.table.message.dingTalkLimit')}}</a>
          <p style="font-size: 12px;color: #4E5051">{{ $t('setting.helpInfo.messageInfo')}}</p>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dingTalkVerify">{{$t('commons.button.verify')}}</el-button>
          <el-button type="primary" @click="dingTalkOnSubmit">{{$t('commons.button.submit')}}</el-button>
<!--          <el-button type="success" @click="dingTalkVerify" :disabled="!btnSlect">{{$t('commons.button.verify')}}</el-button>-->
<!--          <el-button type="primary" @click="dingTalkOnSubmit" :disabled="btn">{{$t('commons.button.submit')}}</el-button>-->
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {checkMessage, createMessageSetting, createSetting, getMessageSetting} from "@/api/system-setting";

export default {
  name: "Message",
  data() {
    return {
      form: {
        vars: {},
        tab: ''
      },
      btn: true
    }
  },
  methods: {
    wechatOnSubmit() {
      createMessageSetting("WORK_WEIXIN",{
        vars: this.form.vars,
        tab: "WORK_WEIXIN"
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        this.$router.push({name: "Message"})
      }).catch(error => {
        this.$message({
          type: "error",
          message: error.error.msg,
        })
      })
    },
    dingTalkOnSubmit() {
      createSetting("DING_TALK",{
        vars: this.form.vars,
        tab: "DING_TALK"
      })
    },
    wechatVerify() {
      checkMessage("WORK_WEIXIN",{
        vars: this.form.vars,
        tab: "WORK_WEIXIN"
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btn = false
      })
    },
    dingTalkVerify() {
      checkMessage("DING_TALK",{
        vars: this.form.vars,
        tab: "DING_TALK"
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btn = false
      })
    }
  },
  computed: {
    btnSelect(){
      let status = this.form.vars['WORK_WEIXIN_STATUS']
      if (status == "ENABLE"){
        return false
      }else {
        return true
      }
    }
  },
  created() {
    getMessageSetting("WORK_WEIXIN").then( data => {
      this.form.vars = data.vars
      this.form.tab = data.tab
    })
  }
}
</script>

<style scoped>
.link-color{
  color: #447DF7;
  font-size: 10px;
}
</style>
