<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'UserList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.email')" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item v-if="currentUser.isSuper && form.name !== 'admin'" :label="$t('user.role')" prop="role">
              <el-radio-group v-model="form.role">
                <el-radio label="admin">{{ $t("commons.role.admin") }}</el-radio>
                <el-radio label="user">{{ $t("commons.role.user") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="currentUser.isSuper && form.name !== 'admin'">
              <el-button @click="onChange" size="mini" icon="el-icon-edit">{{$t("login.reset_password")}}</el-button>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')" v-preventReClick>{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>

    <el-dialog :title="$t('login.reset_password')" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
      <el-form ref="passwordForm" label-position="left" :rules="passwordRules" :model="passwordForm" label-width="100px">
        <el-form-item style="width: 100%" :label="$t('commons.personal.new_password')" prop="password">
          <el-input type="password" v-model="passwordForm.password"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :label="$t('commons.personal.confirm_password')" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="onSubmitChange('passwordForm')" v-preventReClick>{{ $t("commons.button.submit") }}</el-button>
      </span>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {changePassword} from "@/api/personal-setting"
import {updateUser, getUser} from "@/api/user"
import Rule from "@/utils/rules"
import {getSession} from "@/api/auth"

export default {
  name: "UserEdit",
  props: ["name"],
  components: { LayoutContent },
  data () {
    return {
      currentUser: {},
      dialogVisible: false,
      form: {
        name: "",
        email: "",
        role: "user",
      },
      rules: {
        email: [Rule.EmailRule, Rule.RequiredRule],
        role: [Rule.RequiredRule]
      },
      passwordForm: {
        id: "",
        password: "",
        confirmPassword: "",
      },
      passwordRules: {
        password: [Rule.RequiredRule, Rule.PasswordRule],
        confirmPassword: [
          Rule.RequiredRule,
          Rule.PasswordRule,
          {
            validator: this.checkPassword,
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        updateUser(this.name, {
          email: this.form.email,
          role: this.form.role,
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success")
          })
          this.$router.push({ name: "UserList" })
        })
      })
    },
    onChange() {
      this.passwordForm.password = ""
      this.passwordForm.confirmPassword = ""
      this.passwordForm.id = this.form.name
      this.dialogVisible = true
    },
    checkPassword(rule, value, callback) {
      if (this.passwordForm.password !== this.passwordForm.confirmPassword) {
        return callback(new Error(this.$t("commons.personal.confirm_password1_info")))
      }
      callback()
    },
    onSubmitChange (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        changePassword({
          name: this.form.name,
          original: "",
          password: this.passwordForm.password,
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
          this.dialogVisible = false 
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "UserList" })
    },

  },
  created () {
    getSession().then(res => {
      this.currentUser = res.user
    })
    getUser(this.name).then(data => {
      this.form.name = data.name
      this.form.email = data.email
      this.form.role = data.role
    })
  }
}
</script>

<style scoped>
</style>
