<template>
  <div>
    <br>
      <el-col :span="1"><br/></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :rules="rules"  :model="form" label-width="120px">
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.smtp')" prop="vars.SMTP_ADDRESS">
              <el-input v-model="form.vars.SMTP_ADDRESS"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.port')"  prop="vars.SMTP_PORT">
              <el-input v-model="form.vars.SMTP_PORT"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.username')"  prop="vars.SMTP_USERNAME">
              <el-input v-model="form.vars.SMTP_USERNAME"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.password')"  prop="vars.SMTP_PASSWORD">
              <el-input :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.vars.SMTP_PASSWORD"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.testUser')"  prop="vars.SMTP_TEST_USER">
              <el-input v-model="form.vars.SMTP_TEST_USER"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.status')" required>
              <el-switch
                v-model="form.vars.EMAIL_STATUS"
                active-value="ENABLE"
                inactive-value="DISABLE"
                :active-text="$t('commons.button.enable')"
                :inactive-text="$t('commons.button.disable')">
              </el-switch>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button  @click="verify" :disabled="!btnSlect">{{$t('commons.button.verify')}}</el-button>
                <el-button type="primary" @click="onSubmit" >{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
  </div>
</template>

<script>
import {check, createSetting, getSetting} from "@/api/system-setting";
import Rule from "@/utils/rules";
export default {
  name: "EMail",
  data() {
    return {
      form: {
        vars: {
          EMAIL_STATUS: '',
          SMTP_ADDRESS: '',
          SMTP_PASSWORD: '',
          SMTP_PORT: '',
          SMTP_TEST_USER: '',
          SMTP_USERNAME: ''
        },
        tab: ''
      },
      btn: true,
      loading: false,
      rules: {
        vars: {
          SMTP_ADDRESS: [Rule.RequiredRule],
          SMTP_PASSWORD: [Rule.RequiredRule],
          SMTP_PORT: [Rule.RequiredRule],
          SMTP_TEST_USER: [Rule.EmailRule, Rule.RequiredRule],
          SMTP_USERNAME: [Rule.EmailRule, Rule.RequiredRule],
        },
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
          if (!valid) {
            return false
          }
      this.loading = true
      createSetting({
        vars: this.form.vars,
        tab: 'EMAIL'
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        setTimeout(() => location.reload(), 500)
        this.$router.push({name: "EMail"})
      }).finally(() => {
        this.loading = false
      })
    })
    },
    verify(){
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
      this.loading = true
      check( 'EMAIL',{
        vars: this.form.vars,
        tab: 'EMAIL'
      }
      ).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btn = false
      }).finally(() => {
        this.loading = false
      })
    })
    }
  },
  computed: {
    btnSlect(){
      let status = this.form.vars.EMAIL_STATUS
      if (status == "ENABLE"){
        return true
      }else {
        return false
      }
    }
  },
  created() {
    getSetting('EMAIL').then( data => {
      this.form.vars = data.vars,
      this.form.tab = data.tab
    })
  }
}
</script>

<style scoped>

</style>
