<template>
  <el-menu class="header-menu" text-color="inherit" mode="horizontal">
    <el-submenu index="none" popper-class="header-menu-popper">
      <template slot="title">
        <i class="el-icon-user-solid" style="color: #FA5D50"></i>
        <span>{{ name }}</span>
      </template>
      <el-menu-item @click="toPersonal">
        <span>{{ $t('commons.personal.change_password') }}</span>
      </el-menu-item>
      <el-menu-item @click="logout">
        <span>{{ $t('commons.personal.exit_system') }}</span>
      </el-menu-item>
      <el-menu-item @click="toBbout">
        <span>{{ $t('commons.personal.about') }}</span>
      </el-menu-item>
    </el-submenu>
    <el-dialog
      :title="$t('commons.personal.change_password')"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="form"  label-width="100px">
        <el-form-item  style="width: 100%" :label="$t('commons.personal.original_password')" required>
          <el-input v-model="form.original" show-password></el-input>
        </el-form-item>
        <el-form-item  style="width: 100%"  :rules="rules.password" :label="$t('commons.personal.new_password')" prop="password" required>
          <el-input  v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item  style="width: 100%"  :rules="rules.password" :label="$t('commons.personal.confirm_password')" prop="password" required>
          <el-input  v-model="confirmPassword" show-password></el-input>
          <el-alert v-if="!checkPassword() && form.password &&confirmPassword"
            :title="$t('commons.personal.confirm_password1_info')"
            type="error">
          </el-alert>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
    <el-button type="primary" :disabled="!checkPassword() && form.password &&confirmPassword" @click="submit()">{{ $t("commons.button.save") }}</el-button>
  </span>
    </el-dialog>
    <el-dialog
        class="ko-dialog"
        :show-close="true"
        :visible.sync="aboutDialogVisible"
        width="40%">
      <div class="aboutBackground" style="padding: 20px 25px;">
        <img  style="margin-left: 0;" :src="require('@/assets/KubeOperator-red.png')"
                class="sidebar-logo"
                alt="Sidebar Logo">
        <p style="color: #242e42;">{{ $t('commons.personal.ko_introduction') }}</p>
        <strong>{{ $t('commons.personal.version') }}: v3.7.0</strong>
      </div>
      <div style="padding:15px 20px;box-shadow:0px -10px 8px -5px #F0F1F2;">
        <el-row style="font-size: 6px;color: #242e42;text-align: center">
          <el-col :span="6"><el-link @click="toGithub" class="iconfont iconhuaban88"><span>{{ $t('commons.personal.project_url') }}</span></el-link></el-col>
          <el-col :span="6"><el-link @click="toIssue" class="iconfont iconbug">{{ $t('commons.personal.issue') }}</el-link></el-col>
          <el-col :span="6"><el-link @click="toTalk" class="iconfont icontaolun">{{ $t('commons.personal.talk') }}</el-link></el-col>
          <el-col :span="6"><el-link @click="toGithubStar" class="iconfont iconStarStar">{{ $t('commons.personal.star') }}</el-link></el-col>
        </el-row>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import {mapGetters} from "vuex";
import {changePassword} from "@/api/personal-setting";
import store from "@/store";
import Rule from "@/utils/rules"

export default {
  name: "PersonalSetting",
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return {
      dialogVisible: false,
      aboutDialogVisible: false,
      form: {
        name: '',
        original: '',
        password: '',
      },
      confirmPassword: '',
      rules: {
        password: [Rule.PasswordRule],
      }
    }
  },
  methods: {
    toGithub() {
      window.open("https://github.com/KubeOperator/KubeOperator", "_blank");
    },
    toIssue() {
      window.open("https://github.com/KubeOperator/KubeOperator/issues", "_blank");
    },
    toTalk() {
      window.open("https://kubeoperator.io/#contact", "_blank");
    },
    toGithubStar() {
      window.open("https://github.com/KubeOperator/KubeOperator", "_blank");
    },
    toPersonal() {
      this.getRole()
      this.dialogVisible = true
    },
    toBbout() {
      this.aboutDialogVisible = true
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        location.reload()
      })
    },
    checkPassword() {
      return this.form.password === this.confirmPassword;
    },
    async getRole () {
      const { name } = await store.dispatch("user/getCurrentUser")
      this.form.name = name
    },
    submit() {
      changePassword( {
        name: this.form.name,
        original: this.form.original,
        password: this.form.password,
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        setTimeout( () => {
          this.$store.dispatch("user/logout").then(() => {
          location.reload()
        })}, 1500)
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
</style>
