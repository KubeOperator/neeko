<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'ZoneList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="80px" :model="form" :rules="rules">
            <el-form-item :label="$t('commons.table.name')" label-width="100px" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.region.name')" label-width="100px" prop="regionName">
              <el-select v-model="form.regionName"
                         filterable
                         reserve-keyword
                         @change="changeRegion(form.regionName)">
                <el-option
                        v-for="(item,index) in regions"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <!--            <div v-if="region.regionVars['provider'] === 'vSphere'">-->
            <h3>{{ $t("automatic.zone.compute") }}</h3>
            <hr/>
            <el-form-item :label="$t('automatic.zone.cluster')" label-width="100px" prop="cloudVars.cluster">
              <el-select v-model="form.cloudVars.cluster"
                         filterable
                         reserve-keyword
                         @change="changeCloudZone(form.cloudVars.cluster)">
                <el-option
                        v-for="(item,index) in cloudZones"
                        :key="index"
                        :label="item.cluster"
                        :value="item.cluster">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.zone.resource_pool')" label-width="100px" prop="cloudVars.resourcePool">
              <el-select v-model="form.cloudVars.resourcePool"
                         filterable
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in cloudZone.resourcePools"
                        :key="index"
                        :label="item"
                        :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <h3>{{ $t("automatic.zone.datastore") }}</h3>
            <hr/>
            <el-form-item :label="$t('automatic.zone.datastore_type')" label-width="100px" prop="cloudVars.datastoreType">
              <el-radio-group v-model="form.cloudVars.datastoreType">
                <el-radio label="value">{{ $t("automatic.zone.value") }}</el-radio>
                <el-radio label="usage">{{ $t("automatic.zone.usage") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('automatic.zone.datastore')" label-width="100px" prop="cloudVars.datastore">
              <el-select v-model="form.cloudVars.datastore"
                         multiple
                         filterable
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in cloudDatastores"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <h3>{{ $t("automatic.zone.template") }}</h3>
            <hr/>
            <el-form-item :label="$t('automatic.zone.template_type')" label-width="100px" prop="cloudVars.templateType">
              <el-radio-group v-model="form.cloudVars.templateType">
                <el-radio label="default">{{ $t("automatic.zone.default") }}</el-radio>
                <el-radio label="customize" @change="changeTemplateType('customize')">
                  {{ $t("automatic.zone.customize") }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="form.cloudVars['templateType']==='customize'">
              <el-form-item :label="$t('automatic.zone.template')" label-width="100px" prop="cloudVars.imageName">
                <el-select v-model="form.cloudVars.imageName"
                           filterable
                           reserve-keyword
                           @change="changeTemplate(form.cloudVars.imageName)">
                  <el-option
                          v-for="(item,index) in cloudTemplates"
                          :key="index"
                          :label="item.imageName"
                          :value="item.imageName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('credential.credential')" label-width="100px" prop="credentialName">
                <el-select v-model="form.credentialName"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in credentials"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <h3>{{ $t("automatic.zone.network") }}</h3>
            <hr/>
            <el-form-item :label="$t('automatic.zone.network_adapter')" label-width="100px" prop="cloudVars.network">
              <el-select v-model="form.cloudVars.network"
                         filterable
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in cloudZone.networks"
                        :key="index"
                        :label="item"
                        :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.name')" label-width="100px" prop="ipPoolName">
              <el-select v-model="form.ipPoolName"
                         filterable
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in ipPools"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <!--            </div>-->
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.save") }}</el-button>
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
import {listAllRegions} from "@/api/region"
import {listCloudZones, listDatastores, listTemplates, createZone} from "@/api/zone"
import {listAllCredentials} from "@/api/credentials"
import {listAllIpPools} from "@/api/ip-pool"

export default {
  name: "ZoneCreate",
  components: { LayoutContent },
  data () {
    return {
      loading: false,
      form: {
        name: "",
        regionName: "",
        cloudVars: {
          datastoreType: "value",
          templateType: "default",
          cluster: "",
          imageName: ""
        },
        credentialName: "",
        ipPoolName: ""
      },
      regions: [],
      cloudZoneRequest: {
        cloudVars: {}
      },
      cloudZones: [],
      region: {
        regionVars: {}
      },
      cloudDatastores: [],
      cloudZone: {
        resourcePools: [],
        networks: []
      },
      cloudTemplates: [],
      credentials: [],
      ipPools: [],
      rules: {
        name: [Rule.NameRule],
        regionName: [Rule.RequiredRule],
        cloudVars: {
          cluster: [Rule.RequiredRule],
          datastore: [Rule.RequiredRule],
          resourcePool: [Rule.RequiredRule],
          templateType: [Rule.RequiredRule],
          datastoreType: [Rule.RequiredRule],
          imageName: [Rule.RequiredRule],
          network: [Rule.RequiredRule],
        },
        credentialName: [Rule.RequiredRule],
        ipPoolName: [Rule.RequiredRule],
      },
    }
  },
  methods: {
    changeRegion (regionName) {
      this.regions.forEach(region => {
        if (region.name === regionName) {
          this.region = region
          this.cloudZoneRequest.cloudVars = JSON.parse(region.vars)
          this.cloudZoneRequest.cloudVars["datacenter"] = region.datacenter
          this.loading = true
          listCloudZones(this.cloudZoneRequest).then(res => {
            this.cloudZones = res.result
            this.loading = false
          })
        }
      })
    },
    changeCloudZone (cluster) {
      this.cloudZones.forEach(item => {
        if (item.cluster === cluster) {
          this.cloudZone = item
        }
      })
      this.cloudZoneRequest.cloudVars["cluster"] = cluster
      this.loading = true
      listDatastores(this.cloudZoneRequest).then(res => {
        this.cloudDatastores = res
        this.loading = false
      })
    },
    changeTemplateType (type) {
      if (type !== "customize") {
        return
      }
      this.loading = true
      listTemplates(this.cloudZoneRequest).then(res => {
        this.cloudTemplates = res.result
        this.loading = false
      })
    },
    changeTemplate (imageName) {
      this.cloudTemplates.forEach(template => {
        if (template.imageName === imageName) {
          this.form.cloudVars["imageDisks"] = template.imageDisks
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        createZone(this.form).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success")
          })
          this.$router.push({ name: "ZoneList" })
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "ZoneList" })
    }
  },
  created () {
    listAllRegions().then(data => {
      this.regions = data.items
    })
    listAllCredentials().then(data => {
      this.credentials = data.items
    })
    listAllIpPools().then(data => {
      this.ipPools = data.items
    })
  }
}
</script>

<style scoped>

</style>