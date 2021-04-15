<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'RegionList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="120px" :model="form" :rules="rules" v-loading="loading">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.cloud_provider')" prop="provider">
              <el-select v-model="form.provider"
                         filterable
                         reserve-keyword>
                <el-option label="OpenStack" value="OpenStack"></el-option>
                <el-option label="vSphere" value="vSphere"></el-option>
                <el-option label="FusionCompute" value="FusionCompute"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.provider === 'vSphere'">
              <el-form-item :label="$t('automatic.region.vcenter_host')" prop="regionVars.host">
                <el-input v-model="form.regionVars.host"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_port')" prop="regionVars.port">
                <el-input-number v-model="form.regionVars.port"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_username')" prop="regionVars.username">
                <el-input v-model="form.regionVars.username"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_password')" prop="regionVars.password">
                <el-input type="password" v-model="form.regionVars.password"></el-input>
              </el-form-item>
            </div>
            <div v-if="form.provider === 'OpenStack'">
              <el-form-item :label="$t('automatic.region.openstack_identity')" prop="regionVars.identity">
                <el-input v-model="form.regionVars.identity"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_username')" prop="regionVars.username">
                <el-input v-model="form.regionVars.username"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_password')" prop="regionVars.password">
                <el-input type="password" v-model="form.regionVars.password"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.openstack_project')" prop="regionVars.projectId">
                <el-input v-model="form.regionVars.projectId"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.openstack_domain')" prop="regionVars.domainName">
                <el-input v-model="form.regionVars.domainName"></el-input>
              </el-form-item>
            </div>
            <div v-if="form.provider === 'FusionCompute'">
              <el-form-item :label="$t('automatic.region.fusionCompute_server')" prop="regionVars.server">
                <el-input v-model="form.regionVars.server"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_username')" prop="regionVars.user">
                <el-input v-model="form.regionVars.user"></el-input>
              </el-form-item>
              <el-form-item :label="$t('automatic.region.vcenter_password')" prop="regionVars.password">
                <el-input type="password" v-model="form.regionVars.password"></el-input>
              </el-form-item>
            </div>
            <el-form-item :label="$t('automatic.datacenter')" prop="datacenter">
              <el-select v-model="form.datacenter"
                         filterable
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in cloudRegions"
                        :key="index"
                        :label="item"
                        :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button type="info" @click="onCheckParams()">{{ $t("automatic.region.get_datacenter") }}</el-button>
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.save") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules"
import {listDatacenter, createRegion} from "@/api/region"

export default {
  name: "RegionCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        regionVars: {
          host: "",
          port: 443,
          username: "",
          password: "",
          identity: "",
          projectId: "",
          domainName: "",
          server: "",
          user: "",
          datacenter: ""
        },
        provider: "",
        datacenter: "",
        vars: "",
        name: "",
      },
      rules: {
        name: [Rule.NameRule],
        regionVars: {
          host: [Rule.RequiredRule],
          port: [Rule.RequiredRule],
          username: [Rule.RequiredRule],
          password: [Rule.RequiredRule],
          identity: [Rule.RequiredRule],
          projectId: [Rule.RequiredRule],
          domainName: [Rule.RequiredRule],
          server: [Rule.RequiredRule],
          user: [Rule.RequiredRule],
        },
        provider: [Rule.RequiredRule],
        datacenter: [Rule.RequiredRule],
      },
      cloudRegions: [],
      loading: false,
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        createRegion(this.form).finally(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success")
          })
          this.$router.push({ name: "RegionList" })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "RegionList" })
    },
    onCheckParams () {
      this.loading = true
      this.form.regionVars["provider"] = this.form.provider
      listDatacenter(this.form).then(res => {
        this.loading = false
        this.cloudRegions = res.result
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
</style>

