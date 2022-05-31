<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading" :model="form" :rules="rules" label-width="140px">
            <el-form-item :label="$t('setting.table.registry.arch')">
              <el-select style="width: 100%" v-model="form.architecture" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in architectureOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.protocol')">
              <el-select @change="attachable = false" style="width: 100%" v-model="form.protocol" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in protocolOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.hostname')" prop="hostname">
              <el-input @input="attachable = false" @blur="attachable = false" placeholder="172.16.10.100" v-model="form.hostname"></el-input>
              <div><span class="input-help">{{$t('setting.table.registry.hostname_help')}}</span></div>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('login.username')">
              <label>admin</label>
            </el-form-item>
            <el-form-item :label="$t('setting.password')" prop="nexusPassword">
              <el-input @input="attachable = false" @blur="attachable = false" v-model="form.nexusPassword" :placeholder="$t('setting.password_help')" type="password" show-password></el-input>
            </el-form-item>
            <div class="registry-collapse">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    {{$t('multi_cluster.senior_setting')}}
                  </template>
                  <div>
                    <el-form-item label="RepoPort" prop="repoPort">
                      <el-input-number @input="attachable = false" v-model="form.repoPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryPort" prop="registryPort">
                      <el-input-number v-model="form.registryPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryHostedPort" prop="registryHostedPort">
                      <el-input-number v-model="form.registryHostedPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_hosted_port_help')}}</span></div>
                    </el-form-item>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div style="float: right">
              <el-form-item>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button v-if="!attachable" @click="testConnection">{{ $t("commons.button.test_connection") }}</el-button>
                <el-button v-if="attachable" type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
  </layout-content>

</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { createRegistry, testConnection } from "@/api/system-setting"
import Rule from "@/utils/rules"

export default {
  name: "RegistryCreate",
  components: { LayoutContent },
  props: ["dialogFormVisible"],
  data() {
    return {
      form: {
        architecture: "",
        hostname: "",
        protocol: "",
        repoPort: "",
        registryPort: "",
        registryHostedPort: "",
        nexusPassword: "admin123",
      },
      rules: {
        hostname: [Rule.IpRule],
        repoPort: [Rule.RequiredRule],
        registryPort: [Rule.RequiredRule],
        registryHostedPort: [Rule.RequiredRule],
        nexusPassword: [Rule.RequiredRule],
      },
      architectureOptions: [{ value: "x86_64" }, { value: "aarch64" }],
      protocolOptions: [{ value: "http" }, { value: "https" }],
      formLabelWidth: "120px",
      loading: false,
      attachable: false,
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        createRegistry({
          architecture: this.form.architecture,
          hostname: this.form.hostname,
          protocol: this.form.protocol,
          repoPort: this.form.repoPort,
          registryPort: this.form.registryPort,
          registryHostedPort: this.form.registryHostedPort,
          nexusPassword: this.form.nexusPassword,
        })
          .then(() => {
            this.loading = false
            this.$message({
              type: "success",
              message: this.$t("commons.msg.create_success"),
            })
            this.$router.push({ name: "Registry" })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    testConnection() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        let data = {
          protocol: this.form.protocol,
          hostname: this.form.hostname,
          repoPort: this.form.repoPort,
          username: "admin",
          password: this.form.nexusPassword,
        }
        testConnection(data).then(() => {
          this.$message({
            type: "success",
            message: this.$t("setting.conn_successful"),
          })
          this.attachable = true
        })
      })
    },
    onCancel() {
      this.$router.push({ name: "Registry" })
    },
  },
  created() {
    this.form.architecture = "x86_64"
    this.form.protocol = "http"
    this.form.repoPort = 8081
    this.form.registryPort = 8082
    this.form.registryHostedPort = 8083
  },
  computed: {
    validateCommit() {
      if (this.form.architecture && this.form.hostname && this.form.protocol) {
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style scoped>
</style>
