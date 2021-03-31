<template>
  <div>
      <el-col :span="1"><br/></el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.smtp')" required>
              <el-input v-model="form.vars.SMTP_ADDRESS"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.port')" required>
              <el-input v-model="form.vars.SMTP_PORT"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.username')" required>
              <el-input v-model="form.vars.SMTP_USERNAME"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.password')" required>
              <el-input :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.vars.SMTP_PASSWORD" show-password></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.testUser')" required>
              <el-input v-model="form.vars.SMTP_TEST_USER"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.mail.status')" required>
              <el-switch
                v-model="form.vars.EMAIL_STATUS"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="ENABLE"
                inactive-value="DISABLE"
                :active-text="$t('commons.button.enable')"
                :inactive-text="$t('commons.button.disable')">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="verify" :disabled="!btnSlect">{{$t('commons.button.verify')}}</el-button>
              <el-button type="primary" @click="onSubmit" :disabled="btn">{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
  </div>
</template>

<script>
import {check, createSetting, getSetting} from "@/api/system-setting";
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
      btn: true
    }
  },
  methods: {
    onSubmit() {
      createSetting( {
        vars: this.form.vars,
        tab: 'EMAIL'
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        this.$router.push({name: "EMail"})
      })
    },
    verify(){
      check( 'EMAIL',{
        vars: this.form.vars,
        tab: 'EMAIL'
      }
      ).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.verify_success')
        });
        this.btn = false
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
