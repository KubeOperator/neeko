<template>
<div>
    <el-col :span="2"><br/></el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple-light">
        <el-form ref="form"  v-loading="loading" :model="form" label-width="100px">
          <el-form-item  style="width: 100%" :label="$t('setting.ntpServer')" prop="vars.ntp_server">
            <el-input v-model="form.vars.ntp_server"></el-input>
          </el-form-item>
          <div style="float: right">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"><br/></el-col>
</div>
</template>

<script>
import {getSetting,createSetting} from "@/api/system-setting";

export default {
  name: "NTP",
  data() {
    return {
      form: {
        vars: {
          ntp_server: ''
        },
        tab: '',
      },
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
      this.loading = true
      createSetting( {
        vars: this.form.vars,
        tab: 'SYSTEM'
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        this.$router.push({name: "NTP"})
      }).finally(() => {
        this.loading = false
      })
    })
    }
  },
  created() {
    this.loading = true
    getSetting("SYSTEM").then( data => {
      this.loading = false
      this.form.vars.ntp_server = data.vars['ntp_server']
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
