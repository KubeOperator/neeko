<template>
  <layout-content>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input style="width: 100%" v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('project.project')" prop="projectName">
              <el-select filterable style="width: 100%" v-model.number="form.projectName" clearable>
                <el-option v-for="item of projects" :key="item.name" :value="item.name">{{ item.name }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="apiServer" prop="apiServer">
              <el-input style="width: 100%" v-model="form.apiServer" clearable></el-input>
              <div><span class="input-help">{{ $t("cluster.import.api_server_help") }}</span></div>
            </el-form-item>
            <el-form-item label="router" prop="router">
              <el-input style="width: 100%" v-model="form.router" clearable></el-input>
              <div><span class="input-help">{{ $t("cluster.import.router_help") }}</span></div>
            </el-form-item>
            <el-form-item label="token" prop="token">
              <el-input type="textarea" :autosize="{ minRows: 2}" style="width: 100%" v-model="form.token" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" v-loading="loadding" @click="onSubmit">{{ $t("commons.button.create") }}</el-button>
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
import Rule from "@/utils/rules"

export default {
  name: "ClusterImport",
  components: { LayoutContent },
  data() {
    return {
      loadding: false,
      projects: [],
      form: {
        name: "",
        apiServer: "",
        token: "",
        router: "",
        projectName: "kubeoperator",
      },
      rules: {
        name: [Rule.RequiredRule],
        apiServer: [Rule.RequiredRule],
        token: [Rule.RequiredRule],
        projectName: [Rule.RequiredRule],
        router: [Rule.RequiredRule],
      },
    }
  },
  methods: {
    onSubmit() {
      this.loadding = true
      this.$refs["form"].validate((valid) => {
        if (valid) {
          importCluster(this.form).then(() => {
            this.loadding = false
            this.$router.push({ name: "ClusterList" })
          }),
            (error) => {
              this.loadding = false
              this.$message({ type: "error", message: error })
            }
        } else {
          return false
        }
      })
    },
    getProjects() {
      allProjects().then((data) => {
        this.projects = data.items
      }),
        (error) => {
          this.$message({ type: "error", message: error })
        }
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