<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'PlanList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="200px" :model="form" :rules="rules" v-loading="loading" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('automatic.region.name')" prop="region">
              <el-select v-model="form.region"
                         filterable style="width:100%"
                         reserve-keyword
                         @change="changeRegion(form.region)">
                <el-option
                        v-for="(item,index) in regions"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.deploy_template')" prop="deployTemplate">
              <el-select v-model="form.deployTemplate"
                         filterable style="width:100%"
                         reserve-keyword
                         @change="changeTemplate()">
                <el-option :label="$t('automatic.plan.SINGLE')" value="SINGLE"></el-option>
                <el-option :label="$t('automatic.plan.MULTIPLE')" value="MULTIPLE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.zone.name')" prop="zone" v-if="form.deployTemplate==='SINGLE'">
              <el-select v-model="form.zone"
                         filterable style="width:100%"
                         reserve-keyword
                         key="zone">
                <el-option
                        v-for="(item,index) in zones"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.zone.name')" prop="zones" v-if="form.deployTemplate==='MULTIPLE'">
              <el-select v-model="form.zones"
                         filterable style="width:100%"
                         multiple
                         reserve-keyword
                         key="zones">
                <el-option
                        v-for="(item,index) in zones"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.project_auth')" prop="projects">
              <el-select v-model="form.projects"
                         multiple
                         filterable style="width:100%"
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in projects"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.master_model')" prop="planVars.masterModel">
              <el-select v-model="form.planVars.masterModel"
                         filterable style="width:100%"
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in vmConfigs"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.worker_model')" prop="planVars.workerModel">
              <el-select v-model="form.planVars.workerModel"
                         filterable style="width:100%"
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in vmConfigs"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <h3>{{ $t("automatic.plan.config") }}</h3>
              <el-table
                      :data="vmConfigs"
                      style="width: 100%">
                <el-table-column
                        prop="name"
                        :label="$t('commons.table.name')">
                </el-table-column>
                <el-table-column
                        prop="config.cpu"
                        :label="$t('automatic.vm_config.cpu')">
                </el-table-column>
                <el-table-column
                        prop="config.memory"
                        :label="$t('automatic.vm_config.memory')">
                </el-table-column>
                <el-table-column
                        prop="config.disk"
                        :label="$t('automatic.vm_config.disk')"
                        v-if="currentProvider==='OpenStack'">
                </el-table-column>
              </el-table>
            </div>
            <br>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
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
import {listAllRegions} from "@/api/region"
import {listByRegion} from "@/api/zone"
import {listVmConfigs, createPlan} from "@/api/plan"
import {allProjects} from "@/api/projects"
import Rule from "@/utils/rules"


export default {
  name: "PlanCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        region: "",
        zone: "",
        deployTemplate: "SINGLE",
        projects: [],
        zones: [],
        planVars: {
          masterModel: "",
          workerModel: ""
        }
      },
      rules: {
        name: [Rule.LengthRule,Rule.NameRule],
        region: [Rule.RequiredRule],
        zone: [Rule.RequiredRule],
        deployTemplate: [Rule.RequiredRule],
        projects: [Rule.RequiredRule],
        zones: [Rule.RequiredRule],
        planVars: {
          masterModel: [Rule.RequiredRule],
          workerModel: [Rule.RequiredRule]
        }
      },
      loading: false,
      regions: [],
      zones: [],
      regionName: "",
      regionId: "",
      currentProvider: "",
      projects: [],
      vmConfigs: [],
    }
  },
  methods: {
    changeRegion (regionName) {
      this.regions.forEach(region => {
        if (region.name === regionName) {
          this.regionName = region.name
          this.regionId = region.id
          this.currentProvider = region.provider
          this.loading = true
          listVmConfigs(regionName).then(res => {
            this.loading = false
            this.vmConfigs = res
          })
          listByRegion(regionName).then(res => {
            this.zones = res
          })
        }
      })
    },
    onCancel () {
      this.$router.push({ name: "PlanList" })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.form.deployTemplate === "SINGLE") {
          this.form.zones = [this.form.zone]
        }
        this.loading = true
        createPlan(this.form).then(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success")
          })
          this.$router.push({ name: "PlanList" })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    changeTemplate() {
      this.form.zones = []
      this.form.zone = ""
    }
  },
  created () {
    listAllRegions().then(res => {
      this.regions = res.items
    })
    allProjects().then(res => {
      this.projects = res.items
    })
  }
}
</script>

<style scoped>

</style>
