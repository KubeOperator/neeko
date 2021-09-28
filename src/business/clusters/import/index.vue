<template>
  <layout-content :header="$t('commons.button.import')" :back-to="{ name: 'ClusterList' }">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" ref="form" label-position='left' :rules="rules" label-width="120px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input style="width: 100%" v-model="form.name" clearable></el-input>
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
            <el-form-item label="apiServer" prop="apiServer">
              <el-input style="width: 100%" v-model="form.apiServer" :placeholder="$t('cluster.import.api_server_help')" clearable></el-input>
            </el-form-item>
            <el-form-item label="router" prop="router">
              <el-input style="width: 100%" v-model="form.router" :placeholder="$t('cluster.import.router_help')" clearable></el-input>
            </el-form-item>
            <el-form-item label="token" prop="token">
              <el-input type="textarea" :autosize="{ minRows: 2}" style="width: 100%" v-model="form.token" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.import.is_ko_cluster')" prop="isKoCluster">
              <el-switch v-model="form.isKoCluster" />
            </el-form-item>
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
        projectName: "",
        architectures: "amd64",
        isKoCluster: false,
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
