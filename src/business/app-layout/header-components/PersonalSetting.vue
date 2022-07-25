<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
        <i class="el-icon-user-solid" style="color: #FA5D50;margin-right: 3px"></i>
        <span>{{ name }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <div class="personalDropdown">
        <el-dropdown-item class="iconfont iconxitongshezhi" command="setting">
          {{ $t("commons.personal.setting") }}
        </el-dropdown-item>
        <el-dropdown-item class="iconfont iconguanyu" command="about">{{
            $t("commons.personal.about")
          }}
        </el-dropdown-item>
        <el-dropdown-item class="iconfont icontuichudenglu" style="text-align: center" divided command="exit">
          {{ $t("commons.personal.exit_system") }}
        </el-dropdown-item>
      </div>
    </el-dropdown-menu>
    <el-dialog
            class="ko-dialog"
            :show-close="false"
            :visible.sync="aboutDialogVisible"
            width="40%">
      <div class="aboutBackground" style="padding: 20px 25px;">
        <el-image v-if="logoAbout === ''" :src="require('@/assets/KubeOperator-red.png')" class="sidebar-logo"/>
        <el-image v-else :src="logoAbout" class="sidebar-logo"/>
        <p style="color: #242e42;">{{ systemName }} {{ $t("commons.personal.ko_introduction") }}</p>
        <strong>{{ $t("commons.personal.version") }}: v3.7.0</strong>
      </div>
      <div style="padding:15px 20px;box-shadow:0px -10px 8px -5px #F0F1F2;">
        <el-row style="color: #242e42;text-align: center">
          <el-col :span="6">
            <el-link @click="toGithub" class="iconfont iconhuaban88"><span>{{
                $t("commons.personal.project_url")
              }}</span></el-link>
          </el-col>
          <el-col :span="6">
            <el-link @click="toIssue" class="iconfont iconbug">{{ $t("commons.personal.issue") }}</el-link>
          </el-col>
          <el-col :span="6">
            <el-link @click="toTalk" class="iconfont icontaolun">{{ $t("commons.personal.talk") }}</el-link>
          </el-col>
          <el-col :span="6">
            <el-link @click="toGithubStar" class="iconfont iconStarStar">{{ $t("commons.personal.star") }}</el-link>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="settingDialogVisible" :show-close="true" :title="$t('commons.personal.setting')">
      <el-tabs tab-position="left" v-model="active" @tab-click="handleTabs">
        <el-tab-pane :label="$t('commons.personal.change_password')" name="password">
          <el-card class="box-card">
            <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="100px">
              <el-form-item style="width: 100%" :label="$t('commons.personal.original_password')" prop="original">
                <el-input type="password" v-model="form.original"></el-input>
              </el-form-item>
              <el-form-item style="width: 100%" :label="$t('commons.personal.new_password')"
                            prop="password">
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item style="width: 100%" :label="$t('commons.personal.confirm_password')"
                            prop="password">
                <el-input type="password" v-model="confirmPassword"></el-input>
              </el-form-item>
            </el-form>
            <div style="float: right">
              <el-button @click="closePage">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary"
                         @click="submit('form')" v-preventReClick>{{ $t("commons.button.submit") }}
              </el-button>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('message.message')" name="message">
          <el-card class="box-card" v-loading="loading">
            <el-row :gutter="20">
              <el-form ref="settingForm" label-position="left" :model="settingForm" :rules="rules" label-width="150px">
                <el-col :span="12">
                  <el-form-item style="width: 100%" :label="$t('message.dingTalk_phone')" prop="dingTalk.account">
                    <el-input v-model="settingForm.dingTalk.account"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 100%" :label="$t('message.work_wechat_id')" prop="workWeiXin.account">
                    <el-input v-model="settingForm.workWeiXin.account"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 100%" :label="$t('message.email')" prop="email.account">
                    <el-input v-model="settingForm.email.account"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="width: 100%" :label="$t('message.receive_setting')">
                    <el-switch
                            v-model="settingForm.dingTalk.receive"
                            active-value="ENABLE"
                            inactive-value="DISABLE"
                            :active-text="$t('commons.button.enable')"
                            :inactive-text="$t('commons.button.disable')">
                    </el-switch>
                  </el-form-item>
                  <el-form-item style="width: 100%" :label="$t('message.receive_setting')">
                    <el-switch
                            v-model="settingForm.workWeiXin.receive"
                            active-value="ENABLE"
                            inactive-value="DISABLE"
                            :active-text="$t('commons.button.enable')"
                            :inactive-text="$t('commons.button.disable')">
                    </el-switch>
                  </el-form-item>
                  <el-form-item style="width: 100%" :label="$t('message.receive_setting')">
                    <el-switch
                            v-model="settingForm.email.receive"
                            active-value="ENABLE"
                            inactive-value="DISABLE"
                            :active-text="$t('commons.button.enable')"
                            :inactive-text="$t('commons.button.disable')">
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-form>
              <div style="float: right">
                <el-button @click="closePage">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary"
                           @click="updateSetting()" v-preventReClick>{{ $t("commons.button.submit") }}
                </el-button>
              </div>
            </el-row>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import {mapGetters} from "vuex"
import {changePassword} from "@/api/personal-setting"
import {logout} from "@/api/auth"
import store from "@/store"
import Rule from "@/utils/rules"
import {getUserSetting, updateUserSetting} from "@/api/user"

export default {
  name: "PersonalSetting",
  computed: {
    ...mapGetters([
      "name"
    ])
  },
  data () {
    return {
      dialogVisible: false,
      aboutDialogVisible: false,
      settingDialogVisible: false,
      systemName: "",
      logoAbout: "",
      form: {
        name: "",
        original: "",
        password: "",
      },
      confirmPassword: "",
      rules: {
        original: [Rule.RequiredRule, Rule.PasswordRule],
        password: [Rule.RequiredRule, Rule.PasswordRule],
        confirmPassword: [Rule.RequiredRule, Rule.PasswordRule, {
          validator: this.checkPassword, trigger: "blur"
        }]
      },
      active: "password",
      settingForm: {
        dingTalk: {},
        email: {},
        local: {},
        workWeiXin: {},
      },
      username: "",
      setting: {},
      loading: false,
    }
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case "password":
          this.getRole()
          this.dialogVisible = true
          break
        case "exit":
          this.exit()
          break
        case "setting":
          this.settingDialogVisible = true
          break
        default:
          this.aboutDialogVisible = true
          break
      }
    },
    handleTabs (tab) {
      const name = tab.name
      switch (name) {
        case "password":
          this.getRole()
          break
        case "message":
          this.getSetting()
          break
        default:
          this.getRole()
      }
    },
    toGithub () {
      window.open("https://github.com/KubeOperator/KubeOperator", "_blank")
    },
    toIssue () {
      window.open("https://github.com/KubeOperator/KubeOperator/issues", "_blank")
    },
    toTalk () {
      window.open("https://kubeoperator.io/#contact", "_blank")
    },
    exit () {
      logout().then(() => {
        location.reload()
      })
    },
    toGithubStar () {
      window.open("https://github.com/KubeOperator/KubeOperator", "_blank")
    },
    async getRole () {
      const { name } = await store.dispatch("user/getCurrentUser")
      this.form.name = name
      this.username = name
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        changePassword({
          name: this.form.name,
          original: this.form.original,
          password: this.form.password,
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
          setTimeout(() => {
            this.exit()
          }, 1500)
        })
      })
    },
    checkPassword (rule, value, callback) {
      if (this.form.password !== this.confirmPassword) {
        return callback(new Error(this.$t("commons.personal.confirm_password1_info")))
      }
      callback()
    },
    getSetting () {
      this.loading = true
      getUserSetting(this.username).then(res => {
        this.setting = res
        this.settingForm = res.msgConfig
      }).finally(() => {
        this.loading = false
      })
    },
    updateSetting () {
      this.setting.msgConfig = this.settingForm
      updateUserSetting(this.setting).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.save_success")
        })
      })
    },
    closePage () {
      this.settingDialogVisible = false
    }
  },
  created () {
    this.getRole()
    if (store.getters.theme) {
      this.systemName = store.getters.theme.systemName
      this.logoAbout = store.getters.theme.logoAbout
    } else {
      this.$store.dispatch("theme/getThemeInfo").then((data) => {
        this.systemName = data.systemName
        this.logoAbout = data.logoAbout
      })
    }
  },
}
</script>

<style lang="scss">
  @import "~@/styles/business/header-menu.scss";

  .sidebar-logo {
    height: $logo-height;
    vertical-align: middle;
  }

  .personalDropdown {
    .icongenggaimima:before {
      padding-right: 5px;
    }

    .iconguanyu:before {
      padding-right: 5px;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
  }
</style>
