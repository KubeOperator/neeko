<template>
  <el-tabs tab-position="left">
    <el-tab-pane  :label="$t('setting.table.message.wechat')">
      <el-card class="box-card" style="height: 545px">
        <div slot="header" class="clearfix">
          <span>{{$t('setting.table.message.wechatSetting')}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="getWechat">{{$t('commons.button.refresh')}}</el-button>
        </div>
        <el-col :span="2"><br/></el-col>
        <el-col :span="15">
        <el-form ref="form" v-loading="loading" label-position="left" :model="wechat" label-width="120px">
          <el-form-item  style="width: 100%" label="corpid" required>
            <el-input v-model="wechat.vars['WORK_WEIXIN_CORP_ID']"></el-input>
          </el-form-item>
          <el-form-item  style="width: 100%" label="agentid" required>
            <el-input v-model="wechat.vars['WORK_WEIXIN_AGENT_ID']"></el-input>
          </el-form-item>
          <el-form-item  style="width: 100%" label="secret" required>
            <el-input type="password" v-model="wechat.vars['WORK_WEIXIN_CORP_SECRET']"></el-input>
          </el-form-item>
          <el-form-item  style="width: 100%" :label="$t('setting.table.message.testUser')" required>
            <el-input v-model="wechat.vars['WORK_WEIXIN_TEST_USER']"></el-input>
          </el-form-item>
          <el-form-item  style="width: 100%" :label="$t('setting.table.message.status')" required>
            <el-switch
              v-model="wechat.vars['WORK_WEIXIN_STATUS']"
              active-value="ENABLE"
              inactive-value="DISABLE"
              :active-text="$t('commons.button.enable')"
              :inactive-text="$t('commons.button.disable')">
              >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <a href="https://work.weixin.qq.com/api/doc/90000/90135/90665"  target="_blank" class="link-color">{{ $t('setting.table.message.wechatConcept')}}</a><br/>
            <a href="https://work.weixin.qq.com/api/doc/90000/90139/90312"  target="_blank" class="link-color">{{ $t('setting.table.message.wechatLimit')}}</a>
            <p style="font-size: 12px;color: #4E5051">{{$t('setting.helpInfo.messageInfo')}}</p>
          </el-form-item>
          <div style="float: right">
            <el-form-item>
              <el-button @click="wechatVerify" :disabled="btnSelect">{{$t('commons.button.verify')}}</el-button>
              <el-button type="primary" @click="wechatOnSubmit" :disabled="btn">{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </div>
        </el-form>
        </el-col>
      </el-card>
    </el-tab-pane>

    <el-tab-pane :label="$t('setting.table.message.dingTalk')">
      <el-card class="box-card" style="height: 500px">
        <div slot="header" class="clearfix">
          <span>{{$t('setting.table.message.dingTalkSetting')}}</span>
          <el-button style="float: right; padding: 3px 0" @click="getDingTalk" type="text">{{$t('commons.button.refresh')}}</el-button>
        </div>
        <el-col :span="2"><br/></el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <el-form ref="form" label-position="left" v-loading="loading" :model="dingTalk" label-width="150px">
              <el-form-item  style="width: 100%" :label="$t('setting.table.message.webhookAddress')" required>
                <el-input v-model="dingTalk.vars['DING_TALK_WEBHOOK']"></el-input>
              </el-form-item>
              <el-form-item  style="width: 100%" label="secret" required>
                <el-input type="password" v-model="dingTalk.vars['DING_TALK_SECRET']"></el-input>
              </el-form-item>
              <el-form-item  style="width: 100%" :label="$t('setting.table.message.testUser')" required>
                <el-input v-model="dingTalk.vars['DING_TALK_TEST_USER']"></el-input>
              </el-form-item>
              <el-form-item  style="width: 100%" :label="$t('setting.table.message.status')" required>
                <el-switch
                  v-model="dingTalk.vars['DING_TALK_STATUS']"
                  active-value="ENABLE"
                  inactive-value="DISABLE"
                  :active-text="$t('commons.button.enable')"
                  :inactive-text="$t('commons.button.disable')">
                </el-switch>
              </el-form-item>
              <el-form-item>
                <a href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq/26eaddd5"  target="_blank" class="link-color">{{ $t('setting.table.message.dingTalkConcept')}}</a><br/>
                <a href="https://ding-doc.dingtalk.com/doc#/faquestions/eovtrt"  target="_blank" class="link-color">{{ $t('setting.table.message.dingTalkLimit')}}</a>
                <p style="font-size: 12px;color: #4E5051">{{ $t('setting.helpInfo.messageInfo')}}</p>
              </el-form-item>
              <div style="float: right">
                <el-form-item>
                  <el-button  @click="dingTalkVerify" :disabled="btnSelectDk">{{$t('commons.button.verify')}}</el-button>
                  <el-button type="primary" @click="dingTalkOnSubmit" :disabled="btnDk">{{$t('commons.button.submit')}}</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
        <el-col :span="4"><br/></el-col>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {checkMessage, createMessageSetting, getMessageSetting} from "@/api/system-setting";

export default {
  name: "Message",
  data() {
    return {
      wechat: {
        vars: {},
        tab: ''
      },
      dingTalk: {
        vars: {},
        tab: ''
      },
      btn: false,
      btnDk: false,
      loading: false
    }
  },
  methods: {
    wechatOnSubmit() {
      this.loading = true
      createMessageSetting("WORK_WEIXIN",{
        vars: this.wechat.vars,
        tab: "WORK_WEIXIN"
      }).then(() => {
        this.loading = false
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
      }).finally(() => {
        this.loading = false
      })
    },
    dingTalkOnSubmit() {
      this.loading = true
      createMessageSetting("DING_TALK",{
        vars: this.dingTalk.vars,
        tab: "DING_TALK"
      }).then(() => {
        this.loading = false
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
      }).finally(() => {
        this.loading = false
      })
    },
    wechatVerify() {
      this.loading = true
      checkMessage("WORK_WEIXIN",{
        vars: this.wechat.vars,
        tab: "WORK_WEIXIN"
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btn = false
      }).finally(() => {
        this.loading = false
      })
    },
    dingTalkVerify() {
      this.loading = true
      checkMessage("DING_TALK",{
        vars: this.dingTalk.vars,
        tab: "DING_TALK"
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btnDk = false
      }).finally(() => {
        this.loading = false
      })
    },
    getWechat() {
      getMessageSetting("WORK_WEIXIN").then( data => {
        this.wechat.vars = data.vars
        this.wechat.tab = data.tab
      })
    },
    getDingTalk() {
      getMessageSetting("DING_TALK").then( data => {
        this.dingTalk.vars = data.vars
        this.dingTalk.tab = data.tab
      })
    },
    refresh(){
      this.getWechat()
      this.getDingTalk()
    }
  },
  computed: {
    btnSelect(){
      let status = this.wechat.vars['WORK_WEIXIN_STATUS']
      if (status == "ENABLE"){
        return false
      }else {
        return true
      }
    },
    btnSelectDk(){
      let status = this.dingTalk.vars['DING_TALK_STATUS']
      if (status == "ENABLE"){
        return false
      }else {
        return true
      }
    }
  },
  created() {
    this.refresh()
  }
}
</script>

<style scoped>
.link-color{
  color: #447DF7;
  font-size: 10px;
}
</style>
