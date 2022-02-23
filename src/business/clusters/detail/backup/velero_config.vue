<template>
  <div>
    <el-row v-loading="submitLoading">
      <h3>{{ $t("cluster.detail.backup.velero_config") }}</h3>
      <el-form ref="form" label-position="left" :model="form" label-width="180px" :rules="rules">
        <el-form-item :label="$t('cluster.detail.backup.backup_account')" prop="backupAccountName">
          <el-select style="width:100%" size="small" allow-create filterable
                     v-model="form.backupAccountName">
            <el-option v-for="b in backupAccounts" :key="b.name" :label="b.name" :value="b.name">
              {{ b.name }}({{ b.bucket }})
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" :disabled="submitLoading" @click="onSubmit()" v-preventReClick>
            {{ $t("commons.button.submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import {getVeleroConfig, listBackupAccounts, veleroInstall} from "@/api/cluster/backup"
import Rule from "@/utils/rules"

export default {
  name: "VeleroConfig",
  components: {},
  props: {},
  data () {
    return {
      form: {},
      rules: {
        backupAccountName: [Rule.RequiredRule]
      },
      backupAccounts: [],
      submitLoading: false,
      clusterName: ""
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
      getVeleroConfig(this.clusterName).then(res => {
        this.form = res
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
