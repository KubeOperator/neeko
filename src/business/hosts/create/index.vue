<template>
  <layout-content :header="$t('commons.button.create')"  :back-to="{ name: 'HostList'}">
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="form.ip" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('host.port')" prop="port">
              <el-input-number style="width:20%" :step="1" :max="65535" step-strictly v-model.number="form.port" clearable></el-input-number>
            </el-form-item>

            <el-form-item :label="$t('credential.credential')">
              <el-radio-group v-model="credentialType">
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
              <el-form-item :label="$t('credential.credential')" prop="credential.type">
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
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button @click="onSubmit">{{ $t("commons.button.create") }}</el-button>
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
import { listCredentialAll } from "@/api/credentials";
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
        name: [Rule.RequiredRule],
        ip: [Rule.RequiredRule],
        port: [Rule.NumberRule],
        credentialId: [Rule.RequiredRule],
        credential: {
          username: [Rule.RequiredRule],
          password: [Rule.PasswordRule],
          name: [Rule.RequiredRule],
          privateKey: [Rule.RequiredRule],
        }
      },
      credentialList: [],
    }
  },
  methods: {
    onSubmit() {
      createHost(this.form).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
        this.$router.push({ name: "HostList" })
      })
    },
    getCredentials() {
      listCredentialAll().then(data => {
        this.credentialList = data.items
      })
    },
    onCancel() {
      this.$router.push({ name: "HostList" })
    },
  },
  created() {
    this.getCredentials()
  }
}
</script>

<style scoped>
</style>
