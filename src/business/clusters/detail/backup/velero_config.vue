<template>
  <div>
    <el-row v-loading="loading">
      <h3>{{ $t("cluster.detail.backup.velero_config") }}</h3>
      <el-form ref="form" label-position="left" :model="form" label-width="180px" :rules="rules" v-loading="submitLoading">
        <el-form-item :label="$t('cluster.detail.backup.backup_account')" prop="backupAccountName">
          <el-select style="width:100%" size="small" allow-create filterable
                     v-model="form.backupAccountName">
            <el-option v-for="b in backupAccounts" :key="b.name" :label="b.name" :value="b.name">
              {{ b.name }}({{ b.bucket }})
            </el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex">
          <el-form-item :label="$t('cluster.detail.istio.cpu_request')" prop="requests.cpu" :rules="numberRules">
            <el-input-number style="width: 100%" :step="1" step-strictly v-model="form.requests.cpu"></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="requests.memory" :rules="numberRules">
            <el-input-number style="width: 100%" :step="1" step-strictly v-model="form.requests.memory"></el-input-number>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="limits.cpu" :rules="numberRules">
            <el-input-number style="width: 100%" :step="1" step-strictly v-model.number="form.limits.cpu"></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.istio.memory_limit')" prop="limits.memory" :rules="numberRules">
            <el-input-number style="width: 100%" :step="1" step-strictly v-model="form.limits.memory"></el-input-number>
          </el-form-item>
        </el-row>
        <el-form-item style="float: right">
          <el-button :disabled="submitLoading" @click="onDelete()" v-preventReClick>
            {{ $t("commons.button.delete") }}
          </el-button>
          <el-button type="primary" @click="onSubmit()" v-preventReClick>
            {{ $t("commons.button.submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import {
  getVeleroConfig,
  listBackupAccounts,
  veleroInstall,
  veleroUninstall
} from "@/api/cluster/backup"
import Rule from "@/utils/rules"

export default {
  name: "VeleroConfig",
  components: {},
  props: {},
  data () {
    return {
      form: {
        requests:{
          cpu:1000,
          memory:512,
        },
        limits: {
          cpu:1000,
          memory:512,
        }
      },
      rules: {
        backupAccountName: [Rule.RequiredRule]
      },
      numberRules: [Rule.NumberRule],
      backupAccounts: [],
      submitLoading: false,
      clusterName: "",
      loading: false,
    }
  },
  methods: {
    onSubmit () {
      this.submitLoading = true
      veleroInstall(this.clusterName, this.form).then(() => {
        this.$message({
          type: "success",
          message: this.$t("commons.msg.create_success"),
        })
      }).finally(() => {
        this.submitLoading = false
      })
    },
    getConfig () {
      this.loading = true
      getVeleroConfig(this.clusterName).then(res => {
        this.form = res
      }).finally(() => {
        this.loading = false
      })
    },
    onDelete() {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        veleroUninstall(this.clusterName).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.delete_success"),
          })
          this.search()
        })
      })
    }
  },
  created () {
    this.clusterName = this.$route.params.name
    listBackupAccounts(this.clusterName).then((res) => {
      this.backupAccounts = res
    })
    this.getConfig()
  }
}
</script>

<style scoped>

</style>
