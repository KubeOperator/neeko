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
      <el-menu-item @click="toHelp">
        <span>{{ $t('commons.personal.help_documentation') }}</span>
      </el-menu-item>
      <el-menu-item @click="logout">
        <span>{{ $t('commons.personal.exit_system') }}</span>
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
    toPersonal() {
      this.getRole()
      this.dialogVisible = true
    },
    toHelp() {
      window.open("https://github.com/fit2cloud-ui/samples", "_blank");
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
</style>
