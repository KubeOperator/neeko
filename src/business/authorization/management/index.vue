<template>
  <el-row>
    <el-tabs v-model="active" @tab-click="changeItem" type="border-card">
      <el-tab-pane :label="$t('project.member')" name="member">
        <member-list :auth-obj="authObj"></member-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('project.resource')" name="resource">
        <resource-list :auth-obj="authObj"></resource-list>
      </el-tab-pane>
      <el-tab-pane label="Dashboard" name="Dashboard">
        <div>
          <el-alert v-if="authObj.type === 'PROJECT'" :title="$t('automatic.kubepi_project_help')" type="info" />
          <el-alert v-if="authObj.type === 'CLUSTER'" :title="$t('automatic.kubepi_cluster_help')" type="info" />
          <el-form style="margin-top:20px" ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="120px">
            <el-form-item style="width: 30%" :label="$t('login.username')" prop="bindUser">
              <el-select style="width: 100%" @change="attachable = false" v-model="form.bindUser">
                <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="item" />
              </el-select>
              <div v-if="isUserBind">
                <i style="margin-top: 9px;color: #67C23A; float: left" class="el-icon-circle-check" />
                <span style="color: #67C23A">{{ $t("commons.status.bind") }}</span>
              </div>
            </el-form-item>

            <el-form-item style="width: 30%" :label="$t('login.password')" prop="bindPassword">
              <el-input @input="attachable = false" type="password" show-password v-model="form.bindPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="!attachable" @click="testConnection" v-preventReClick>{{ $t("commons.button.test_connection") }}</el-button>
              <el-button v-if="attachable" type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import MemberList from "@/business/authorization/management/members"
import ResourceList from "@/business/authorization/management/resources"
import { bindUser, getBindInfo, getUser, testKubepiConn } from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "Management",
  components: { ResourceList, MemberList },
  props: ["authObj"],
  watch: {
    authObj() {
      this.loadInfo()
    },
  },
  data() {
    return {
      active: "member",
      loading: false,

      form: {
        sourceType: this.authObj.type,
        project: this.authObj.projectName,
        cluster: this.authObj.clusterName,
        bindUser: "",
        bindPassword: "",
      },
      attachable: false,
      rules: {
        bindUser: [Rule.RequiredRule],
        bindPassword: [Rule.RequiredRule],
      },
      isUserBind: false,
      nameList: [],
    }
  },
  methods: {
    changeItem(tab) {
      this.active = tab.name
      if (tab.name === "Dashboard") {
        this.loadInfo()
        this.getUsers()
      }
    },
    loadInfo() {
      this.form.bindUser = ""
      this.form.bindPassword = ""
      getBindInfo({ sourceType: this.authObj.type, project: this.authObj.projectName, cluster: this.authObj.clusterName }).then((data) => {
        this.form.bindUser = data.bindUser
        this.isUserBind = data.bindUser ? true : false
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
            message: this.$t("setting.kubepi_conn_successful"),
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
            this.loadInfo()
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