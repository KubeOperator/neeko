<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
        <i class="el-icon-user-solid" style="color: #FA5D50;margin-right: 3px"></i>
        <span>{{ name }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <div class="personalDropdown">
        <el-dropdown-item class="iconfont icongenggaimima" command="password">{{
            $t("commons.personal.change_password")
          }}
        </el-dropdown-item>
        <el-dropdown-item class="iconfont iconguanyu" command="about">{{
            $t("commons.personal.about")
          }}
        </el-dropdown-item>
        <el-dropdown-item class="iconfont icontuichudenglu" style="text-align: center" divided command="logout">
          {{ $t("commons.personal.exit_system") }}
        </el-dropdown-item>
      </div>
    </el-dropdown-menu>
    <el-dialog
            :title="$t('commons.personal.change_password')"
            :visible.sync="dialogVisible"
            width="30%">
      <el-form ref="form" label-position="left" :model="form" label-width="100px">
        <el-form-item style="width: 100%" :label="$t('commons.personal.original_password')" required>
          <el-input v-model="form.original"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :rules="rules.password" :label="$t('commons.personal.new_password')"
                      prop="password" required>
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :rules="rules.password" :label="$t('commons.personal.confirm_password')"
                      prop="password" required>
          <el-input v-model="confirmPassword"></el-input>
          <el-alert v-if="!checkPassword() && form.password &&confirmPassword"
                    :title="$t('commons.personal.confirm_password1_info')"
                    type="error">
          </el-alert>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
    <el-button type="primary" :disabled="!checkPassword() && form.password &&confirmPassword"
               @click="submit('form')">{{ $t("commons.button.submit") }}</el-button>
  </span>
    </el-dialog>
    <el-dialog
            class="ko-dialog"
            :show-close="false"
            :visible.sync="aboutDialogVisible"
            width="40%">
      <div class="aboutBackground" style="padding: 20px 25px;">
        <img style="margin-left: 0;" :src="require('@/assets/KubeOperator-red.png')"
             class="sidebar-logo"
             alt="Sidebar Logo">
        <p style="color: #242e42;">{{ $t("commons.personal.ko_introduction") }}</p>
        <strong>{{ $t("commons.personal.version") }}: v3.7.0</strong>
      </div>
      <div style="padding:15px 20px;box-shadow:0px -10px 8px -5px #F0F1F2;">
        <el-row style="font-size: 6px;color: #242e42;text-align: center">
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
  </el-dropdown>
</template>

<script>
import {mapGetters} from "vuex"
import {changePassword} from "@/api/personal-setting"
import store from "@/store"
import Rule from "@/utils/rules"

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
      form: {
        name: "",
        original: "",
        password: "",
      },
      confirmPassword: "",
      rules: {
        password: [Rule.PasswordRule],
      }
    }
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case "password":
          this.getRole()
          this.dialogVisible = true
          break
        case "logout":
          this.logout()
          break
        default:
          this.aboutDialogVisible = true
          break
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
    logout () {
      this.$store.dispatch("user/logout").then(() => {
        location.reload()
      })
    },
    toGithubStar () {
      window.open("https://github.com/KubeOperator/KubeOperator", "_blank")
    },
    checkPassword () {
      return this.form.password === this.confirmPassword
    },
    async getRole () {
      const { name } = await store.dispatch("user/getCurrentUser")
      this.form.name = name
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
            this.$store.dispatch("user/logout").then(() => {
              location.reload()
            })
          }, 1500)
        })
      })
    }
  }
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
