<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading" :rules="rules" :model="form" label-width="140px">
            <el-form-item :label="$t('setting.table.registry.arch')" prop="architecture" required>
              <el-select style="width: 100%" v-model="form.architecture" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in architectureOptions" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.protocol')" prop="protocol" required>
              <el-select style="width: 100%" v-model="form.protocol" placeholder="请选择">
                <el-option v-for="item in protocolOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.hostname')" prop="hostname" required>
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>
            <div class="registry-collapse">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    {{$t('multi_cluster.senior_setting')}}
                  </template>
                  <div>
                    <el-form-item label="RepoPort" prop="repoPort" required>
                      <el-input-number v-model="form.repoPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryPort" prop="registryPort" required>
                      <el-input-number v-model="form.registryPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryHostedPort" prop="registryHostedPort" required>
                      <el-input-number v-model="form.registryHostedPort" :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_hosted_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item>
                      <el-button @click="onChange" size="mini" icon="el-icon-edit">{{$t("setting.change_nexus_password")}}</el-button>
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
    <el-dialog :title="$t('commons.personal.change_password')" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
      <el-form ref="passwordForm" label-position="left" :rules="passwordRules" :model="passwordForm" label-width="100px">
        <el-form-item style="width: 100%" :label="$t('commons.personal.original_password')" prop="original">
          <el-input type="password" v-model="passwordForm.original"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :label="$t('commons.personal.new_password')" prop="password">
          <el-input type="password" v-model="passwordForm.password"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" :label="$t('commons.personal.confirm_password')" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submit('passwordForm')" v-preventReClick>{{ $t("commons.button.submit") }}</el-button>
      </span>
    </el-dialog>
  </layout-content>
</template>

<script>
import { getRegistry, updateRegistry, changePassword } from "@/api/system-setting"
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
        nexusPassword: "",
      },
      architectureOptions: [
        {
          value: "x86_64",
        },
        {
          value: "aarch64",
        },
      ],
      rules: {
        hostname: [Rule.IpRule],
        architecture: [Rule.RequiredRule],
        protocol: [Rule.RequiredRule],
        nexusPassword: [Rule.RequiredRule],
      },
      protocolOptions: [
        {
          value: "http",
        },
        {
          value: "https",
        },
      ],
      loading: false,
      dialogVisible: false,
      passwordForm: {
        id: "",
        original: "",
        password: "",
        confirmPassword: "",
      },
      passwordRules: {
        original: [Rule.RequiredRule, Rule.PasswordRule],
        password: [Rule.RequiredRule, Rule.PasswordRule],
        confirmPassword: [
          Rule.RequiredRule,
          Rule.PasswordRule,
          {
            validator: this.checkPassword,
            trigger: "blur",
          },
        ],
      },
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
        updateRegistry(this.form.architecture, {
          architecture: this.form.architecture,
          hostname: this.form.hostname,
          protocol: this.form.protocol,
          id: this.form.id,
          repoPort: this.form.repoPort,
          registryPort: this.form.registryPort,
          registryHostedPort: this.form.registryHostedPort,
          nexusPassword: this.form.nexusPassword,
        })
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
    onChange() {
      this.passwordForm.password = ""
      this.passwordForm.original = ""
      this.passwordForm.confirmPassword = ""
      this.passwordForm.id = this.form.id
      this.dialogVisible = true
    },
    checkPassword(rule, value, callback) {
      if (this.passwordForm.password !== this.passwordForm.confirmPassword) {
        return callback(new Error(this.$t("commons.personal.confirm_password1_info")))
      }
      callback()
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        changePassword({
          id: this.passwordForm.id,
          original: this.passwordForm.original,
          password: this.passwordForm.password,
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success"),
          })
          this.dialogVisible = false
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
