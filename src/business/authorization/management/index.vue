<template>
  <el-row>
    <el-tabs v-model="active" @tab-click="changeItem" type="border-card">
      <el-tab-pane :label="$t('project.member')" name="member">
        <member-list :auth-obj="authObj"></member-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('project.resource')" name="resource">
        <resource-list :auth-obj="authObj"></resource-list>
      </el-tab-pane>
      <el-tab-pane label="kubepi" name="kubepi">
        <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="120px">
          <el-form-item style="width: 30%" :label="$t('login.username') " prop="bindUser">
            <el-input @input="attachable = false" v-model="form.bindUser"></el-input>
          </el-form-item>
          <el-form-item style="width: 30%" :label="$t('login.password')" prop="bindPassword">
            <el-input @input="attachable = false" type="password" show-password v-model="form.bindPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!attachable" @click="testConnection" v-preventReClick>{{ $t("commons.button.test_connection") }}</el-button>
            <el-button v-if="attachable" type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import MemberList from "@/business/authorization/management/members"
import ResourceList from "@/business/authorization/management/resources"
import { bindUser, getBindInfo, testKubepiConn } from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "Management",
  components: { ResourceList, MemberList },
  props: ["authObj"],
  data() {
    return {
      active: "member",
      form: {
        sourceType: this.authObj.type,
        source: this.authObj.projectName,
        bindUser: "",
        bindPassword: "",
      },
      loading: false,
      attachable: false,
      rules: {
        bindUser: [Rule.RequiredRule],
        bindPassword: [Rule.RequiredRule],
      },
    }
  },
  methods: {
    changeItem(tab) {
      if (tab.name === "kubepi") {
        getBindInfo({ sourceType: this.authObj.type, source: this.authObj.projectName }).then((data) => {
          this.form.bindUser = data.bindUser
        })
      }
      this.form.sourceType = this.authObj.type
      this.form.source = this.authObj.projectName
      this.form.bindUser = ""
      this.form.bindPassword = ""
      this.active = tab.name
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
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
    },
  },
}
</script>

<style scoped>
</style>