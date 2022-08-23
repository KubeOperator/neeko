<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'BackupAccount'}">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="100px">
            <el-form-item :label="$t('commons.table.name')" aria-readonly="true">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('commons.table.type')" aria-readonly="true">
              <el-input v-model="form.type" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="AccessKey">
              <el-input v-model="form.credentialVars['accessKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="SecretKey">
              <el-input type="password" show-password v-model="form.credentialVars['secretKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountName')">
              <el-input v-model="form.credentialVars['accountName']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountKey')">
              <el-input type="password" show-password v-model="form.credentialVars['accountKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'S3'" :label="$t('backup_account.table.region')">
              <el-input v-model="form.credentialVars['region']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.endpoint')">
              <el-input v-model="form.credentialVars['endpoint']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'MINIO'" prop="credentialVars.ssl">
              <el-radio-group v-model="form.credentialVars['ssl']">
                <el-radio label="http">http</el-radio>
                <el-radio label="https">https</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.bucket')">
              <el-select style="width: 100%" v-model="form.bucket" :placeholder="$t('commons.validate.select')">
                <el-option v-for="item in buckets" :key="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- SFTP Option start-->
            <div v-if="form.type === 'SFTP'">
              <el-form-item :label="$t('backup_account.table.address')">
                <el-input v-model="form.credentialVars['address']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.port')">
                <el-input-number v-model="form.credentialVars['port']" :min="0" :max="65535"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.username')">
                <el-input v-model="form.credentialVars['username']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.password')">
                <el-input type="password" show-password v-model="form.credentialVars['password']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.path')">
                <el-input v-model="form.bucket"></el-input>
              </el-form-item>
            </div>
            <!-- SFTP Option end-->
            <div style="float: right">
              <el-form-item>
                <el-button v-if="form.type !== 'SFTP'" plain @click="getBuckets">{{$t('commons.button.getBucket')}}</el-button>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="update()">{{$t('commons.button.submit')}}</el-button>
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
import { listBuckets, updateBackupAccounts, getBackupAccountByName } from "@/api/backup-account"
import Rule from "@/utils/rules"
export default {
  components: {
    LayoutContent,
  },
  props: ["name"],
  name: "BackupAccountEdit",
  data() {
    return {
      form: {
        id: "",
        name: "",
        type: "",
        bucket: "",
        credentialVars: {},
        projects: "",
        clusters: "",
      },
      rules: {
        name: [Rule.NameRule],
        bucket: [Rule.RequiredRule],
        projects: [Rule.SelectRequiredRule],
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
      buckets: [],
      loading: false,
    }
  },
  methods: {
    update() {
      this.loading = true
      let projects = this.form.projects ? this.form.projects.split(",") : []
      let clusters = this.form.clusters ? this.form.clusters.split(",") : []
      updateBackupAccounts(this.form.name, {
        id: this.form.id,
        bucket: this.form.bucket,
        credentialVars: this.form.credentialVars,
        name: this.form.name,
        type: this.form.type,
        projects: projects,
        clusters: clusters,
      })
        .then(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success"),
          })
          this.$router.push({ name: "BackupAccount" })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCancel() {
      this.$router.push({ name: "BackupAccount" })
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
    getBackupAccountByName(this.name).then((data) => {
      this.form.id = data.id
      this.form.name = data.name
      this.form.type = data.type
      this.form.bucket = data.bucket
      this.form.credentialVars = data.credentialVars
      this.form.clusters = data.clusters
      this.form.projects = data.projects
      this.getBuckets()
    })
  },
}
</script>

<style scoped>
</style>
