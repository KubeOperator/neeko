<template>
  <div>
    <br>
    <el-col :span="1"><br/></el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="120px">


          <el-form-item style="width: 100%" :label="$t('login.username') " prop="vars.KUBEPI_USERNAME">
            <el-input v-model="form.vars.KUBEPI_USERNAME"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('login.password')" prop="vars.KUBEPI_PASSWORD">
            <el-input type="password" show-password v-model="form.vars.KUBEPI_PASSWORD"></el-input>
          </el-form-item>

          <div style="float: right">
            <el-form-item>
              <el-button type="primary" @click="onSubmit" v-preventReClick>{{ $t('commons.button.submit') }}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"><br/></el-col>
  </div>
</template>

<script>
import { createSetting, getSetting} from "@/api/system-setting";
import Rule from "@/utils/rules";

export default {
  name: "EMail",
  data() {
    return {
      form: {
        vars: {
          KUBEPI_USERNAME: "",
          KUBEPI_PASSWORD: "",
        },
        tab: ''
      },
      btn: true,
      loading: false,
      rules: {
        vars: {
          KUBEPI_USERNAME: [Rule.RequiredRule],
          KUBEPI_PASSWORD: [Rule.RequiredRule],
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
          tab: 'KUBEPI'
        }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: this.$t('commons.msg.save_success')
          });
          // setTimeout(() => location.reload(), 500)
          // this.$router.push({name: "EMail"})
        }).finally(() => {
          this.loading = false
        })
      })
    },
  },
  computed: {
  },
  created() {
    getSetting('KUBEPI').then(data => {
      if (data.tab !== "") {
        this.form.tab = data.tab
        this.form.vars = data.vars
        this.form.vars.KUBEPI_PASSWORD = ""
      }
    })
  }
}
</script>

<style scoped>

</style>
