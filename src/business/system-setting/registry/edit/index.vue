<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading" :rules="rules" :model="form" label-width="140px">
            <el-form-item :label="$t('setting.table.registry.arch')" prop="architecture">
              <el-select style="width: 100%" v-model="form.architecture" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in architectureOptions" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.protocol')" prop="protocol">
              <el-select style="width: 100%" v-model="form.protocol" placeholder="请选择">
                <el-option v-for="item in protocolOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.hostname')" prop="hostname">
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onChange" size="mini" icon="el-icon-edit">{{$t("setting.sync_nexus_password")}}</el-button>
            </el-form-item>
            <div class="registry-collapse">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    {{$t('multi_cluster.port_setting')}}
                  </template>
                  <div>
                    <el-form-item label="RepoPort" prop="repoPort">
                      <el-input-number v-model="form.repoPort" :min="0" :max="65535"></el-input-number>
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
                <el-button type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
    <el-dialog :title="$t('commons.personal.sync_password')" :close-on-click-modal="false" :visible.sync="dialogChangePasswdVisible" width="30%">
      <i class="el-icon-info"></i>
      <span style="margin-left: 6px">{{$t('setting.nexus_passwd')}}</span>
      <el-form style="margin-top:20px" ref="passwordForm" label-position="left" :rules="rules" :model="passwordForm" label-width="100px">
        <el-form-item style="width: 100%" :label="$t('login.username')" prop="nexusUser">
          <el-input @input="attachable = false" @blur="attachable = false" v-model="passwordForm.nexusUser" placeholder="admin"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :label="$t('login.password')" prop="nexusPassword">
          <el-input type="password" @input="attachable = false" @blur="attachable = false" v-model="passwordForm.nexusPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangePasswdVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button v-if="!attachable" @click="testConnection">{{ $t("commons.button.test_connection") }}</el-button>
        <el-button v-if="attachable" type="primary" @click="changePasswd('passwordForm')" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
      </span>
    </el-dialog>
  </layout-content>
</template>

<script>
import { getRegistry, updateRegistry, testConnection, changePassword } from "@/api/system-setting"
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules"

export default {
  components: {
    LayoutContent,
  },
  name: "EditRegistry",
  props: ["id"],
  data() {
    return {
      form: {
        architecture: "",
        hostname: "",
        protocol: "",
        id: "",
        repoPort: "",
        registryPort: "",
        registryHostedPort: "",
      },
      architectureOptions: [{ value: "x86_64" }, { value: "aarch64" }],
      rules: {
        hostname: [Rule.IpRule],
        architecture: [Rule.RequiredRule],
        protocol: [Rule.RequiredRule],
        nexusUser: [Rule.RequiredRule],
        nexusPassword: [Rule.RequiredRule],
      },
      dialogChangePasswdVisible: false,
      passwordForm: {
        id: "",
        nexusUser: "",
        nexusPassword: "",
      },
      protocolOptions: [{ value: "http" }, { value: "https" }],
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
        if (this.form.registryPort === this.form.repoPort) {
          this.$message({
            type: "error",
            message: this.$t("setting.table.registry.registry_and_repo_err"),
          })
          return false
        }
        if (this.form.registryPort === this.form.registryHostedPort) {
          this.$message({
            type: "error",
            message: this.$t("setting.table.registry.registry_and_registry_hosted_err"),
          })
          return false
        }
        if (this.form.repoPort === this.form.registryHostedPort) {
          this.$message({
            type: "error",
            message: this.$t("setting.table.registry.repo_and_registry_hosted_err"),
          })
          return false
        }
        this.loading = true
        updateRegistry(this.form.architecture, this.form)
          .then(() => {
            this.loading = false
            this.$message({
              type: "success",
              message: this.$t("commons.msg.update_success"),
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
          nexusUser: this.passwordForm.nexusUser,
          nexusPassword: this.passwordForm.nexusPassword,
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
    onChange() {
      this.passwordForm.password = ""
      this.passwordForm.id = this.form.id
      this.passwordForm.nexusUser = this.form.nexusUser
      this.dialogChangePasswdVisible = true
    },
    changePasswd(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        changePassword(this.passwordForm).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success"),
          })
          this.dialogChangePasswdVisible = false
        })
      })
    },
    onCancel() {
      this.$router.push({ name: "Registry" })
    },
  },
  created() {
    getRegistry(this.id).then((data) => {
      this.form = data
    })
  },
}
</script>

<style scoped>
</style>
