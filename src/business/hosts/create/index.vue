<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'HostList' }">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' ref="form" :model="form" :rules="rules" label-width="160px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name" clearable></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="form.ip" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('host.port')" prop="port">
              <el-input-number :step="1" :max="65535" step-strictly v-model.number="form.port" clearable></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('host.project_auth')" prop="project">
              <el-select style="width:100%" v-model="form.project" @change="getClusters" clearable filterable>
                <el-option v-for="pro in projectList" :key="pro.id" :value="pro.name" :label="pro.name" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('host.cluster_auth')" prop="cluster">
              <el-select style="width:100%" v-model="form.cluster" clearable filterable>
                <el-option v-for="(item,index) in clusterList" :key="index" :value="item" :label="item" />
              </el-select>
              <div><span class="input-help">{{$t('host.cluster_auth_help')}}</span></div>

            </el-form-item>

            <el-form-item :label="$t('credential.type')" required>
              <el-radio-group v-model="credentialType" @change="updateCredentialType">
                <el-radio label="exists">{{$t('host.exists_credential')}}</el-radio>
                <el-radio label="new">{{$t('host.new_credential')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="credentialType==='exists'" :label="$t('host.credential_name')" prop="credentialId">
              <el-select style="width:100%" v-model="form.credentialId" clearable filterable>
                <el-option v-for="cre in credentialList" :key="cre.id" :value="cre.id" :label="cre.name" />
              </el-select>
            </el-form-item>

            <span v-if="credentialType==='new'">
              <el-form-item :label="$t('credential.name')" prop="credential.name">
                <el-input v-model="form.credential.name" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('credential.username')" prop="credential.username">
                <el-input v-model="form.credential.username" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('host.credential_type')" prop="credential.type" required>
                <el-radio-group v-model="form.credential.type">
                  <el-radio label="password">{{$t('credential.password')}}</el-radio>
                  <el-radio label="privateKey">{{$t('credential.privateKey')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.credential.type==='password'" :label="$t('credential.password')" prop="credential.password">
                <el-input type="password" v-model="form.credential.password" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="form.credential.type==='privateKey'" :label="$t('credential.privateKey')" prop="credential.privateKey">
                <el-input type="textarea" v-model="form.credential.privateKey" clearable></el-input>
              </el-form-item>
            </span>
            <el-form-item style="float: right">
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit">{{ $t("commons.button.create") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { createHost } from "@/api/hosts"
import { listCredentialAll } from "@/api/credentials"
import { allProjects } from "@/api/projects"
import { getClusterByProject } from "@/api/cluster"
import Rule from "@/utils/rules"

export default {
  name: "HostCreate",
  components: { LayoutContent },
  data() {
    return {
      credentialType: "exists",
      form: {
        name: "",
        ip: "",
        port: 22,
        project: "",
        cluster: "",
        credentialId: "",
        credential: {
          username: "",
          password: "",
          name: "",
          type: "password",
          privateKey: "",
        },
      },
      rules: {
        name: [Rule.NameRule],
        ip: [Rule.RequiredRule],
        port: [Rule.NumberRule],
        project: [Rule.RequiredRule],
        credentialId: [Rule.RequiredRule],
        credential: {
          username: [Rule.RequiredRule],
          password: [Rule.RequiredRule],
          name: [Rule.RequiredRule],
          privateKey: [Rule.RequiredRule],
        },
      },
      credentialList: [],
      projectList: [],
      clusterList: [],
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          createHost(this.form).then(() => {
            this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
            this.$router.push({ name: "HostList" })
          })
        } else {
          return false
        }
      })
    },
    updateCredentialType() {
      this.form.credentialId = this.credentialType === "exists" ? this.form.credentialId : ""
    },
    getCredentials() {
      listCredentialAll().then((data) => {
        this.credentialList = data.items
      })
    },
    getProjects() {
      allProjects().then((data) => {
        this.projectList = data.items
      })
    },
    getClusters() {
      this.clusterList = []
      this.form.cluster = ""
      if (this.form.project === "") {
        return
      }
      if (this.form.project) {
        getClusterByProject(this.form.project).then((data) => {
          this.clusterList = []
          for (const clu of data) {
            if (clu.provider !== "plan") {
              this.clusterList.push(clu.name)
            }
          }
        })
      }
    },
    onCancel() {
      this.$router.push({ name: "HostList" })
    },
  },
  created() {
    this.getCredentials()
    this.getProjects()
  },
}
</script>

<style scoped>
</style>
