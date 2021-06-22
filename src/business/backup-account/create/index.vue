<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'BackupAccount'}">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="160px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('commons.table.type')" required>
              <el-select style="width: 100%" v-model="form.type" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in typeOptions" :key="item.value" :value="item.value" :label="item.label" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="AccessKey" prop="credentialVars.accessKey">
              <el-input v-model="form.credentialVars['accessKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="SecretKey" prop="credentialVars.secretKey">
              <el-input type="password" v-model="form.credentialVars['secretKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountName')" prop="credentialVars.accountName">
              <el-input v-model="form.credentialVars['accountName']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountKey')" prop="credentialVars.accountKey">
              <el-input type="password" v-model="form.credentialVars['accountKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'S3'" :label="$t('backup_account.table.region')" prop="credentialVars.region">
              <el-input v-model="form.credentialVars['region']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.endpoint')" prop="credentialVars.endpoint">
              <el-input v-model="form.credentialVars['endpoint']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.bucket')" prop="bucket">
              <el-select style="width: 100%" v-model="form.bucket" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in buckets" :key="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- SFTP Option start-->
            <div v-if="form.type === 'SFTP'">
              <el-form-item :label="$t('backup_account.table.address')" prop="credentialVars.address">
                <el-input placeholder="172.16.10.100" v-model="form.credentialVars['address']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.port')" prop="credentialVars.port">
                <el-input-number v-model="form.credentialVars['port']" :min="0" :max="65535"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.username')" prop="credentialVars.username">
                <el-input v-model="form.credentialVars['username']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.password')" prop="credentialVars.password">
                <el-input type="password" v-model="form.credentialVars['password']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.path')" prop="bucket">
                <el-input v-model="form.bucket"></el-input>
              </el-form-item>
            </div>
            <!-- SFTP Option end-->
            <el-form-item :label="$t('host.project_auth')" prop="projects" required>
              <el-select v-model="form.projects" multiple style="width:100%" filterable @change="getClusters" reserve-keyword>
                <el-option v-for="(item,index) in projects" :key="index" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('host.cluster_auth')" prop="clusters">
              <el-select v-model="form.clusters" multiple style="width:100%" filterable reserve-keyword>
                <el-option v-for="(item,index) in clusters" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button v-if="form.type !== 'SFTP'" plain @click="getBuckets">{{$t('commons.button.getBucket')}}</el-button>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
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
import { createBackupAccounts, listBuckets } from "@/api/backup-account"
import { allProjects } from "@/api/projects"
import { getClusterByProject } from "@/api/cluster"
import Rule from "@/utils/rules"

export default {
  name: "RegistryCreate",
  components: { LayoutContent },
  props: ["dialogFormVisible"],
  data() {
    return {
      form: {
        projects: [],
        clusters: [],
        name: "",
        type: "",
        bucket: "",
        credentialVars: {},
      },
      rules: {
        name: [Rule.NameRule],
        bucket: [Rule.RequiredRule],
        credentialVars: {
          accessKey: [Rule.RequiredRule],
          secretKey: [Rule.RequiredRule],
          accountName: [Rule.RequiredRule],
          accountKey: [Rule.RequiredRule],
          region: [Rule.RequiredRule],
          endpoint: [Rule.RequiredRule],
          port: [Rule.RequiredRule],
          username: [Rule.RequiredRule],
          address: [Rule.RequiredRule],
          password: [Rule.RequiredRule],
        },
      },
      typeOptions: [
        {
          value: "OSS",
        },
        {
          value: "S3",
        },
        {
          value: "SFTP",
        },
        {
          label: "Azure",
          value: "AZURE",
        },
      ],
      formLabelWidth: "120px",
      buckets: [],
      loading: false,
      projects: [],
      clusters: [],
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        createBackupAccounts({
          bucket: this.form.bucket,
          credentialVars: this.form.credentialVars,
          name: this.form.name,
          type: this.form.type,
          projects: this.form.projects,
          clusters: this.form.clusters,
        })
          .then(() => {
            this.loading = false
            this.$message({
              type: "success",
              message: this.$t("commons.msg.create_success"),
            })
            this.$router.push({ name: "BackupAccount" })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    onCancel() {
      this.$router.push({ name: "BackupAccount" })
    },
    getClusters() {
      this.clusters = []
      this.form.clusters = []
      if (this.form.projects.length === 0) {
        return
      }
      let pros = this.form.projects.join(",")
      getClusterByProject(pros).then((data) => {
        this.clusters = []
        for (const clu of data) {
          this.clusters.push(clu.name)
        }
      })
    },
    getBuckets() {
      this.loading = true
      listBuckets({
        name: this.form.name,
        type: this.form.type,
        credentialVars: this.form.credentialVars,
      })
        .then((data) => {
          this.loading = false
          this.buckets = data
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  created() {
    this.form.type = "SFTP"
    allProjects().then((res) => {
      this.projects = res.items
    })
  },
}
</script>

<style scoped>
</style>
