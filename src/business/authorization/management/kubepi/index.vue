<template>
  <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="120px">
    <el-form-item style="width: 30%" :label="$t('login.username') " prop="bindUser">
      <el-select style="width: 100%" @change="attachable = false" v-model="form.bindUser">
        <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 30%" :label="$t('login.password')" prop="bindPassword">
      <el-input @input="attachable = false" type="password" show-password v-model="form.bindPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-if="!attachable" @click="testConnection" v-preventReClick>{{ $t("commons.button.test_connection") }}</el-button>
      <el-button v-if="attachable" type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { bindUser, getBindInfo, getUser, testKubepiConn } from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "Kubepi",
  components: {},
  props: ["authObj"],
  data() {
    return {
      form: {
        sourceType: this.authObj.type,
        project: this.authObj.projectName,
        cluster: this.authObj.clusterName,
        bindUser: "",
        bindPassword: "",
      },
      loading: false,
      attachable: false,
      rules: {
        bindUser: [Rule.RequiredRule],
        bindPassword: [Rule.RequiredRule],
      },
      nameList: [],
    }
  },
  created() {
    this.loadInfo()
    this.getUsers()
  },
  methods: {
    loadInfo() {
      this.form.bindUser = ""
      this.form.bindPassword = ""
      getBindInfo({ sourceType: this.authObj.type, project: this.authObj.projectName, cluster: this.authObj.clusterName }).then((data) => {
        this.form.bindUser = data.bindUser
      })
    },
    getUsers() {
      getUser().then((data) => {
        this.nameList = []
        if (data.data) {
          for (const u of data.data) {
            this.nameList.push(u.name)
          }
        }
      })
    },
    testConnection() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        let data = {
          bindUser: this.form.bindUser,
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
        this.form.sourceType = this.authObj.type
        this.form.project = this.authObj.projectName
        this.form.cluster = this.authObj.clusterName
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
  watch: {
    authObj() {
      console.log(this.authObj)
      this.loadInfo()
      this.getUsers()
    },
  },
}
</script>

<style scoped>
</style>
