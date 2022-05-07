<template>
  <div>
    <br>
    <el-col :span="1"><br /></el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="120px">
          <el-form-item style="width: 100%" :label="$t('login.username') ">
            <span>admin</span>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('login.password')" prop="bindPassword">
            <el-input type="password" show-password v-model="form.bindPassword"></el-input>
          </el-form-item>
          <div style="float: right">
            <el-form-item>
              <el-button v-if="!attachable" @click="testConnection" v-preventReClick>{{ $t("commons.button.test_connection") }}</el-button>
              <el-button v-if="attachable" type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"><br /></el-col>
  </div>
</template>

<script>
import { bindUser, getBindInfo, testKubepiConn} from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "EMail",
  data() {
    return {
      form: {
        sourceType: "ADMIN",
        bindUser: "admin",
        bindPassword: "",
      },
      loading: false,
      rules: {
        bindPassword: [Rule.RequiredRule],
      },
      attachable: false,
    }
  },
  methods: {
    testConnection() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        let data = {
          bindUser: "admin",
          bindPassword: this.form.bindPassword,
        }
        testKubepiConn(data).then(() => {
          this.$message({
            type: "success",
            message: this.$t("setting.conn_successful"),
          })
          this.attachable = true
        })
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        this.form.bindUser = "admin"
        bindUser(this.form)
          .then(() => {
            this.loading = false
            this.$message({
              type: "success",
              message: this.$t("commons.msg.save_success"),
            })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
  },
  created() {
    getBindInfo({ sourceType: "ADMIN" }).then((data) => {
      this.form.bindUser = data.bindUser
    })
  },
}
</script>

<style scoped>
</style>
