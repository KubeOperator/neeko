<template>
<div>
  <layout-content>
    <el-col :span="1"><br/></el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item  style="width: 100%" :label="$t('setting.ntpServer')" required>
            <el-input v-model="form.vars.ntp_server"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{$t('commons.button.save')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"><br/></el-col>
  </layout-content>
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
        tab: ''
      }
    }
  },
  methods: {
    onSubmit() {
      createSetting( {
        vars: this.form.vars,
        tab: 'SYSTEM'
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        this.$router.push({name: "NTP"})
      })
    }
  },
  created() {
    getSetting().then( data => {
      this.form.vars.ntp_server = data.vars['ntp_server']
    })
  }
}
</script>

<style scoped>

</style>
