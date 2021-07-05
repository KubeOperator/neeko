<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'UserList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name" required>
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('user.email')" prop="email" required>
              <el-input type="email" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.password')" prop="password" required>
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.confirm_password')" prop="confirmPassword" required>
              <el-input type="password" v-model="form.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.role')" required prop="role">
              <el-radio-group v-model="form.role">
                <el-radio label="admin">{{ $t("commons.role.admin") }}</el-radio>
                <el-radio label="user">{{ $t("commons.role.user") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {createUser} from "@/api/user"
import Rule from "@/utils/rules"

export default {
  name: "UserCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        password: "",
        confirmPassword: "",
        role: "user",
      },
      rules: {
        name: [Rule.NameRule, Rule.RequiredRule],
        email: [Rule.EmailRule, Rule.RequiredRule],
        password: [Rule.RequiredRule,Rule.PasswordRule],
        confirmPassword: [Rule.RequiredRule,Rule.PasswordRule, {
          validator: this.checkPassword, trigger: "blur"
        }],
        role: [Rule.RequiredRule],
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        createUser({
          name: this.form.name,
          password: this.form.password,
          email: this.form.email,
          role: this.form.role,
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success"),
          })
          this.$router.push({ name: "UserList" })
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "UserList" })
    },
    checkPassword (rule, value, callback) {
      if (this.form.password !== this.form.confirmPassword) {
        return callback(new Error(this.$t("commons.personal.confirm_password1_info")))
      }
      callback()
    },
  }
}
</script>

<style scoped>
</style>
