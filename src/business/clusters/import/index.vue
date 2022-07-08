<template>
  <layout-content :header="$t('commons.button.import')" :back-to="{ name: 'ClusterList' }">
    <el-alert type="info">
      <div slot="title">
        <span>{{$t('cluster.import.import_version_help')}}
          (<el-link style="font-size:13px;line-height: 18px;" type="info" icon="el-icon-position" @click="openMinifest()">{{$t('cluster.import.import_version_link')}})</el-link>
        </span>
      </div>
    </el-alert>
    <el-row style="margin-top: 20px">
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" ref="form" label-position='left' :rules="rules" label-width="120px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input style="width: 100%" v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.import.authenticate_mode')">
              <el-radio v-model="form.authenticationMode" label="bearer" @change="onAuthenticationModeChange">Bearer Token
              </el-radio>
              <el-radio v-model="form.authenticationMode" label="certificate" @change="onAuthenticationModeChange">{{ $t('cluster.import.certificate') }}
              </el-radio>
              <el-radio v-model="form.authenticationMode" label="configFile" @change="onAuthenticationModeChange">{{ $t('cluster.import.config_file') }}
              </el-radio>
            </el-form-item>

            <el-form-item :label="$t('project.project')" prop="projectName">
              <el-select filterable style="width: 100%" v-model.number="form.projectName" clearable>
                <el-option v-for="item of projects" :key="item.name" :value="item.name">{{ item.name }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('cluster.creation.arch')" prop="architectures">
              <el-select style="width: 100%" v-model="form.architectures">
                <el-option value="amd64" label="AMD64">AMD64</el-option>
                <el-option value="arm64" label="ARM64">ARM64</el-option>
                <el-option value="all" label="MIXED">MIXED</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="router" prop="router">
              <el-input style="width: 100%" v-model="form.router" :placeholder="$t('cluster.import.router_help')" clearable></el-input>
            </el-form-item>
            <div v-if="form.authenticationMode === 'bearer'">
              <el-form-item label="apiServer" prop="apiServer">
                <el-input style="width: 100%" v-model="form.apiServer" :placeholder="$t('cluster.import.api_server_help')" clearable></el-input>
              </el-form-item>
              <el-form-item label="token" prop="token">
                <el-input type="textarea" :autosize="{ minRows: 2,maxRows: 5}" style="width: 100%" v-model="form.token" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="form.authenticationMode==='certificate'">
              <el-form-item label="apiServer" prop="apiServer">
                <el-input style="width: 100%" v-model="form.apiServer" :placeholder="$t('cluster.import.api_server_help')" clearable></el-input>
              </el-form-item>
              <el-form-item label="Certificate" prop="certDataStr">
                <el-input :autosize="{ minRows: 5, maxRows: 10}" type="textarea" v-model="form.certDataStr" clearable></el-input>
              </el-form-item>
              <el-form-item label="Certificate Key" prop="keyDataStr">
                <el-input :autosize="{ minRows: 5, maxRows: 10}" type="textarea" v-model="form.keyDataStr" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="form.authenticationMode==='configFile'">
              <el-form-item :label="$t('cluster.import.config_content')">
                <el-input :autosize="{ minRows: 5, maxRows: 10}" type="textarea" v-model="form.configContent"></el-input>
              </el-form-item>
              <el-form-item>
                <el-upload :before-upload="readFile" action="" style="display: inline-block;margin-left: 5px">
                  <el-button>{{ $t('commons.button.upload') }}</el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="isKoCluster">
                <el-checkbox v-model="form.isKoCluster">{{$t('cluster.import.is_ko_cluster')}}</el-checkbox>
              </el-form-item>
            </div>
            <div v-if="dialogKoImportVisible">
              <ko-import :clusterImportInfo="form" @changeVisble="changeVisble" :visible="dialogKoImportVisible" />
            </div>
            <el-form-item style="float: right">
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button v-if="!form.isKoCluster" type="primary" v-loading="loadding" @click="onSubmit" v-preventReClick>{{ $t("commons.button.create") }}</el-button>
              <el-button v-if="form.isKoCluster" type="primary" v-loading="loadding" @click="onLoadInfo">{{ $t("cluster.import.load_ko_cluster_info") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { allProjects } from "@/api/projects"
import { importCluster } from "@/api/cluster"
import KoImport from "./ko-import.vue"
import Rule from "@/utils/rules"

export default {
  name: "ClusterImport",
  components: { LayoutContent, KoImport },
  data() {
    return {
      loadding: false,
      projects: [],
      hostDatas: [],
      dialogKoImportVisible: false,
      form: {
        name: "",
        apiServer: "",
        token: "",
        router: "",
        projectName: "kubeoperator",
        architectures: "amd64",
        isKoCluster: false,

        authenticationMode: "bearer",
        certDataStr: "-----BEGIN CERTIFICATE-----\n" + "-----END CERTIFICATE-----",
        keyDataStr: "-----BEGIN RSA PRIVATE KEY-----\n" + "-----END RSA PRIVATE KEY-----",
        configContent: "",
      },
      rules: {
        name: [Rule.RequiredRule],
        apiServer: [Rule.RequiredRule],
        token: [Rule.RequiredRule],
        projectName: [Rule.RequiredRule],
        architectures: [Rule.RequiredRule],
        router: [Rule.RequiredRule],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadding = true
          importCluster(this.form)
            .then(() => {
              this.loadding = false
              this.$router.push({ name: "ClusterList" })
            })
            .catch(() => {
              this.loadding = false
            })
        } else {
          return false
        }
      })
    },
    onAuthenticationModeChange() {
      this.form.certDataStr = ""
      this.form.keyDataStr = ""
      this.form.token = ""
      this.form.configContent = ""
    },
    readFile(file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        this.form.configContent = reader.result
      }
      return false
    },
    openMinifest() {
      let routeUrl = this.$router.resolve({
        name: "Manifests",
      })
      window.open(routeUrl.href, "_blank")
    },
    changeVisble(val) {
      this.dialogKoImportVisible = val
    },
    getProjects() {
      allProjects().then((data) => {
        this.projects = data.items
      })
    },
    onLoadInfo() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogKoImportVisible = true
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterList" })
    },
  },
  created() {
    this.getProjects()
  },
}
</script>

<style scoped>
</style>
