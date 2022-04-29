<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'HostList' }">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' ref="form" :model="form" :rules="rules" label-width="160px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input disabled v-model="form.name" clearable></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="form.ip" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="enableFlexIp">{{$t("host.enable_flex_ip")}}</el-checkbox>
            </el-form-item>

            <el-form-item v-if="enableFlexIp" :label="$t('host.flex_ip')" prop="flexIp">
              <el-input v-model="form.flexIp" clearable></el-input>
            </el-form-item>
            
            <el-form-item :label="$t('host.port')" prop="port">
              <el-input-number :step="1" :max="65535" step-strictly v-model.number="form.port" clearable></el-input-number>
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
                <el-input type="password" show-password v-model="form.credential.password" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="form.credential.type==='privateKey'" :label="$t('credential.privateKey')" prop="credential.privateKey">
                <el-input type="textarea" v-model="form.credential.privateKey" clearable></el-input>
              </el-form-item>
            </span>
            <el-form-item style="float: right">
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit" v-preventReClick>{{ $t("commons.button.submit") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { updateHost, getHostByName } from "@/api/hosts"
import { listCredentialAll } from "@/api/credentials"
import Rule from "@/utils/rules"

export default {
  name: "HostEdit",
  components: { LayoutContent },
  props: ["name"],
  data() {
    return {
      credentialType: "exists",
      enableFlexIp: false,
      form: {
        name: "",
        ip: "",
        flexIp: "",
        port: 22,
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
        ip: [Rule.IpRule],
        flexIp: [Rule.IpRule],
        port: [Rule.NumberRule],
        credentialId: [Rule.RequiredRule],
        credential: {
          username: [Rule.RequiredRule],
          password: [Rule.RequiredRule],
          name: [Rule.RequiredRule],
          privateKey: [Rule.RequiredRule],
        },
      },
      credentialList: [],
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.enableFlexIp) {
            this.form.flexIp = ""
          }
          updateHost(this.form).then(() => {
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
    onCancel() {
      this.$router.push({ name: "HostList" })
    },
  },
  mounted () {
    this.getCredentials()
    getHostByName(this.name).then(data => {
      this.form.name = data.name
      this.form.ip = data.ip
      this.enableFlexIp = data.flexIp !== ""
      this.form.flexIp = data.flexIp
      this.form.port = data.port
      this.form.credentialId = data.credentialId
    })
  }
}
</script>

<style scoped>
</style>
