<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading"  :rules="rules" :model="form" label-width="140px">
            <el-form-item :label="$t('setting.table.registry.arch')" prop="architecture" required>
              <el-select style="width: 100%" v-model="form.architecture" :placeholder="$t('commons.validate.select')">
                <el-option
                  v-for="item in architectureOptions"
                  :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.protocol')" prop="protocol" required>
              <el-select style="width: 100%" v-model="form.protocol"  placeholder="请选择">
                <el-option
                  v-for="item in protocolOptions"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.hostname')" prop="hostname"  required>
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>
            <div class="registry-collapse">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    {{$t('multi_cluster.senior_setting')}}<i class="header-icon el-icon-info"></i>
                  </template>
                  <div>
                    <el-form-item label="RepoPort" prop="repoPort" required>
                      <el-input-number v-model="form.repoPort"  :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryPort" prop="registryPort" required>
                      <el-input-number v-model="form.registryPort"  :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_port_help')}}</span></div>
                    </el-form-item>

                    <el-form-item label="RegistryHostedPort" prop="registryHostedPort" required>
                      <el-input-number v-model="form.registryHostedPort"  :min="0" :max="65535"></el-input-number>
                      <div><span class="input-help">{{$t('setting.table.registry.repo_registry_hosted_port_help')}}</span></div>
                    </el-form-item>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div style="float: right">
              <el-form-item>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import {getRegistry, updateRegistry} from "@/api/system-setting";
import LayoutContent from "@/components/layout/LayoutContent";
import Rule from "@/utils/rules";

export default {
  components: {
    LayoutContent
  },
  name: "EditRegistry",
  props: ['id'],
  data() {
    return {
      form: {
        architecture: '',
        hostname: '',
        protocol: '',
        id: '',
        repoPort: '',
        registryPort: '',
        registryHostedPort: '',
      },
      architectureOptions: [{
        value: 'x86_64',
      }, {
        value: 'aarch64',
      }],
      rules: {
        hostname: [Rule.IpRule],
        architecture: [Rule.RequiredRule],
        protocol: [Rule.RequiredRule],
      },
      protocolOptions: [{
        value: 'http',
      }, {
        value: 'https',
      }],
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.form.registryPort === this.form.repoPort){
          this.$message({
            type: 'error',
            message: this.$t('setting.table.registry.registry_and_repo_err'),
          });
          return false
        }
        if (this.form.registryPort === this.form.registryHostedPort){
          this.$message({
            type: 'error',
            message: this.$t('setting.table.registry.registry_and_registry_hosted_err'),
          });
          return false
        }
        if (this.form.repoPort === this.form.registryHostedPort){
          this.$message({
            type: 'error',
            message: this.$t('setting.table.registry.repo_and_registry_hosted_err'),
          });
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
        }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: this.$t("commons.msg.update_success")
          });
          this.$router.push({name: "Registry"})
        }).finally(() => {
          this.loading = false
        })
      })
    },
    onCancel() {
      this.$router.push({name: "Registry"})
    },
  },
  created() {
    getRegistry(this.id).then(data => {
      this.form = data
    })
  }
}
</script>

<style scoped>

</style>
