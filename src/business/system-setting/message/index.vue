<template>
  <el-tabs tab-position="left" v-model="type" @tab-click="getAccount">
    <el-tab-pane :label="$t('setting.email')" name="EMAIL">
      <el-card class="box-card" style="height: 500px">
        <div slot="header" class="clearfix">
          <span>{{ $t("setting.email") }}</span>
        </div>
        <el-col :span="2"><br/></el-col>
        <el-col :span="16">
          <el-form ref="emailForm" v-loading="loading" label-position="left" :rules="emailRules" :model="form"
                   label-width="120px">
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.smtp')" prop="config.address">
              <el-input v-model="form.config.address"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.port')" prop="config.port">
              <el-input type="number" v-model.number="form.config.port"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.username')" prop="config.username">
              <el-input v-model="form.config.username"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.password')" prop="config.password">
              <el-input type="password" show-password :placeholder="$t('setting.helpInfo.inputPassword')"
                        v-model="form.config.password"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.testUser')" prop="config.testUser">
              <el-input v-model="form.config.testUser"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.mail.status')">
              <el-switch
                      v-model="form.status"
                      active-value="ENABLE"
                      inactive-value="DISABLE"
                      :active-text="$t('commons.button.enable')"
                      :inactive-text="$t('commons.button.disable')">
              </el-switch>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button @click="verify">{{ $t("commons.button.verify") }}</el-button>
                <el-button type="primary" @click="onSubmit('emailForm')" v-preventReClick>{{ $t("commons.button.submit") }}
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-card>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.table.message.wechat')" name="WORK_WEIXIN">
      <el-card class="box-card" style="height: 545px">
        <div slot="header" class="clearfix">
          <span>{{ $t("setting.table.message.wechatSetting") }}</span>
        </div>
        <el-col :span="2"><br/></el-col>
        <el-col :span="15">
          <el-form ref="weiXinForm" v-loading="loading" label-position="left" :model="form" label-width="120px"
                   :rules="weiXinRules">
            <el-form-item style="width: 100%" label="corpId" prop="config.corpId">
              <el-input v-model="form.config.corpId"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="agentid" prop="config.agentId">
              <el-input v-model="form.config.agentId"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" label="secret" prop="config.corpSecret">
              <el-input type="password" show-password v-model="form.config.corpSecret"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.message.testUser')" prop="config.testUser">
              <el-input v-model="form.config.testUser"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.message.status')">
              <el-switch
                      v-model="form.status"
                      active-value="ENABLE"
                      inactive-value="DISABLE"
                      :active-text="$t('commons.button.enable')"
                      :inactive-text="$t('commons.button.disable')">
                >
              </el-switch>
            </el-form-item>
            <el-form-item>
              <a href="https://work.weixin.qq.com/api/doc/90000/90135/90665" target="_blank"
                 class="link-color">{{ $t("setting.table.message.wechatConcept") }}</a><br/>
              <a href="https://work.weixin.qq.com/api/doc/90000/90139/90312" target="_blank"
                 class="link-color">{{ $t("setting.table.message.wechatLimit") }}</a>
              <p style="font-size: 12px;color: #4E5051">{{ $t("setting.helpInfo.messageInfo") }}</p>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button @click="verify">{{ $t("commons.button.verify") }}</el-button>
                <el-button type="primary" @click="onSubmit('weiXinForm')">{{ $t("commons.button.submit") }}
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-card>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.table.message.dingTalk')" name="DING_TALK">
      <el-card class="box-card" style="height: 500px">
        <div slot="header" class="clearfix">
          <span>{{ $t("setting.table.message.dingTalkSetting") }}</span>
        </div>
        <el-col :span="2"><br/></el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <el-form ref="dingTalkForm" label-position="left" v-loading="loading" :model="form" label-width="150px"
                     :rules="dingTalkRules">
              <el-form-item style="width: 100%" :label="$t('setting.table.message.webhookAddress')"
                            prop="config.webHook">
                <el-input v-model="form.config.webHook"></el-input>
              </el-form-item>
              <el-form-item style="width: 100%" label="secret" prop="config.secret">
                <el-input type="password" show-password v-model="form.config.secret"></el-input>
              </el-form-item>
              <el-form-item style="width: 100%" :label="$t('setting.table.message.testUser')" prop="config.testUser">
                <el-input v-model="form.config.testUser"></el-input>
              </el-form-item>
              <el-form-item style="width: 100%" :label="$t('setting.table.message.status')">
                <el-switch
                        v-model="form.status"
                        active-value="ENABLE"
                        inactive-value="DISABLE"
                        :active-text="$t('commons.button.enable')"
                        :inactive-text="$t('commons.button.disable')">
                </el-switch>
              </el-form-item>
              <el-form-item>
                <a href="https://open.dingtalk.com/document/group/assign-a-webhook-url-to-an-internal-chatbot" target="_blank"
                   class="link-color">{{ $t("setting.table.message.dingTalkConcept") }}</a><br/>
                <a href="https://ding-doc.dingtalk.com/doc#/faquestions/eovtrt" target="_blank"
                   class="link-color">{{ $t("setting.table.message.dingTalkLimit") }}</a>
                <p style="font-size: 12px;color: #4E5051">{{ $t("setting.helpInfo.messageInfo") }}</p>
              </el-form-item>
              <div style="float: right">
                <el-form-item>
                  <el-button @click="verify" :disabled="loading">{{ $t("commons.button.verify") }}
                  </el-button>
                  <el-button type="primary" @click="onSubmit('dingTalkForm')">
                    {{ $t("commons.button.submit") }}
                  </el-button>
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
import {
  createMsgAccount,
  getMsgAccount, verifyMsgAccount
} from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "Message",
  data () {
    return {
      dingTalk: {
        vars: {},
        tab: ""
      },
      loading: false,
      emailRules: {
        config: {
          address: [Rule.RequiredRule],
          port: [Rule.RequiredRule],
          username: [Rule.RequiredRule],
          password: [Rule.RequiredRule],
          testUser: [Rule.RequiredRule],
        },
        status: [Rule.RequiredRule],
      },
      weiXinRules: {
        config: {
          corpId: [Rule.RequiredRule],
          agentId: [Rule.RequiredRule],
          corpSecret: [Rule.RequiredRule],
          testUser: [Rule.RequiredRule],
        },
        status: [Rule.RequiredRule],
      },
      dingTalkRules: {
        config: {
          secret: [Rule.RequiredRule],
          testUser: [Rule.RequiredRule],
          webHook: [Rule.RequiredRule],
        },
        status: [Rule.RequiredRule],
      },
      type: "EMAIL",
      form: {
        config: {}
      }
    }
  },
  methods: {
    getAccount () {
      getMsgAccount(this.type).then(res => {
        this.form = res
      })
    },
    verify () {
      this.loading = true
      verifyMsgAccount(this.form).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.verify_success")
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.loading = true
        createMsgAccount(this.form).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
        }).finally(() => {
          this.loading = false
        })
      })
    }
  },
  computed: {},
  created () {
    this.getAccount()
  }
}
</script>

<style scoped>
    .link-color {
        color: #447DF7;
        font-size: 10px;
    }
</style>
