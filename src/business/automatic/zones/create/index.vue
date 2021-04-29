<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'ZoneList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="100px" :model="form" :rules="rules" v-loading="loading" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.region.name')"  prop="regionName">
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
            <div v-if="region.regionVars['provider'] === 'vSphere'">
              <h3>{{ $t("automatic.zone.compute") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.cluster')"  prop="cloudVars.cluster">
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
              <el-form-item :label="$t('automatic.zone.resource_pool')"
                            prop="cloudVars.resourcePool">
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
              <el-form-item :label="$t('automatic.zone.datastore_type')"
                            prop="cloudVars.datastoreType">
                <el-radio-group v-model="form.cloudVars.datastoreType">
                  <el-radio label="value">{{ $t("automatic.zone.value") }}</el-radio>
                  <el-radio label="usage">{{ $t("automatic.zone.usage") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.datastore')"  prop="cloudVars.datastore">
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
              <el-form-item :label="$t('automatic.zone.template_type')"
                            prop="cloudVars.templateType">
                <el-radio-group v-model="form.cloudVars.templateType">
                  <el-radio label="default">{{ $t("automatic.zone.default") }}</el-radio>
                  <el-radio label="customize" @change="changeTemplateType('customize')">
                    {{ $t("automatic.zone.customize") }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="form.cloudVars['templateType']==='customize'">
                <el-form-item :label="$t('automatic.zone.template')"  prop="cloudVars.imageName">
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
                <el-form-item :label="$t('credential.credential')"  prop="credentialName">
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
              <el-form-item :label="$t('automatic.zone.network_adapter')"  prop="cloudVars.network">
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
              <el-form-item :label="$t('automatic.ip_pool.name')"  prop="ipPoolName">
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
            </div>
            <div v-if="region.regionVars['provider'] === 'OpenStack'">
              <h3>{{ $t("automatic.zone.compute") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.cluster')"  prop="cloudVars.cluster">
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
              <h3>{{ $t("automatic.zone.datastore") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.storageType')"  prop="cloudVars.storageType">
                <el-select v-model="form.cloudVars.storageType"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.storages"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <h3>{{ $t("automatic.zone.template") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.template_type')"
                            prop="cloudVars.templateType">
                <el-radio-group v-model="form.cloudVars.templateType">
                  <el-radio label="default">{{ $t("automatic.zone.default") }}</el-radio>
                  <el-radio label="customize" @change="changeTemplateType('customize')">
                    {{ $t("automatic.zone.customize") }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="form.cloudVars['templateType']==='customize'">
                <el-form-item :label="$t('automatic.zone.template')"  prop="cloudVars.imageName">
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
                <el-form-item :label="$t('credential.credential')"  prop="credentialName">
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
              <el-form-item :label="$t('automatic.zone.security_group')"
                            prop="cloudVars.securityGroup">
                <el-select v-model="form.cloudVars.securityGroup"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.securityGroups"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.network')"  prop="cloudVars.network">
                <el-select v-model="form.cloudVars.network"
                           filterable
                           reserve-keyword
                           @change="changeNetwork(form.cloudVars.network)">
                  <el-option
                          v-for="(item,index) in cloudZone.networkList"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.ip_type')" prop="cloudVars.ipType">
                <el-select v-model="form.cloudVars.ipType"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.ipTypes"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.subnet')"  prop="cloudVars.subnet"
                            v-if="form.cloudVars.ipType==='private'">
                <el-select v-model="form.cloudVars.subnet"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in subnetList"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.floating_ip')"
                            prop="cloudVars.floatingNetwork"
                            v-if="form.cloudVars.ipType==='floating'">
                <el-select v-model="form.cloudVars.floatingNetwork"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.floatingNetworkList"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.ip_pool.name')"  prop="ipPoolName">
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
            </div>
            <div v-if="region.regionVars['provider'] === 'FusionCompute'">
              <h3>{{ $t("automatic.zone.compute") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.cluster')"  prop="cloudVars.cluster">
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
              <h3>{{ $t("automatic.zone.datastore") }}</h3>
              <hr/>
              <el-form-item :label="$t('automatic.zone.datastore')"  prop="cloudVars.datastore">
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
              <el-form-item :label="$t('automatic.zone.template_type')"
                            prop="cloudVars.templateType">
                <el-radio-group v-model="form.cloudVars.templateType">
                  <el-radio label="default">{{ $t("automatic.zone.default") }}</el-radio>
                  <el-radio label="customize">
                    {{ $t("automatic.zone.customize") }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="form.cloudVars['templateType']==='default'">
                <el-form-item :label="$t('automatic.zone.nfs_address')"  prop="cloudVars.nfsAddress">
                  <el-input v-model="form.cloudVars.nfsAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_port')"  prop="cloudVars.nfsPort">
                  <el-input-number v-model="form.cloudVars.nfsPort"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_folder')"  prop="cloudVars.nfsFolder">
                  <el-input v-model="form.cloudVars.nfsFolder"></el-input>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_username')"
                              prop="cloudVars.nfsUsername">
                  <el-input v-model="form.cloudVars.nfsUsername"></el-input>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_password')"
                              prop="cloudVars.nfsPassword">
                  <el-input type="password" v-model="form.cloudVars.nfsPassword"></el-input>
                </el-form-item>
              </div>
              <div v-if="form.cloudVars['templateType']==='customize'">
                <el-form-item :label="$t('automatic.zone.template')"  prop="cloudVars.imageName">
                  <el-select v-model="form.cloudVars.imageName"
                             filterable
                             reserve-keyword
                             @change="changeTemplate(form.cloudVars.imageName)">
                    <el-option
                            v-for="(item,index) in cloudZone.templates"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('credential.credential')"  prop="credentialName">
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
              <el-form-item :label="$t('automatic.zone.switch')"  prop="cloudVars.switch">
                <el-select v-model="form.cloudVars.switch"
                           filterable
                           reserve-keyword
                           @change="changeSwitch(form.cloudVars.switch)">
                  <el-option
                          v-for="(item,index) in cloudZone.switchs"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.portgroup')"  prop="cloudVars.portgroup">
                <el-select v-model="form.cloudVars.portgroup"
                           filterable
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in portgroups"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.ip_pool.name')"  prop="ipPoolName">
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
            </div>
            <el-form-item>
              <div style="float: right">
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
          imageName: "",
          storageType: "",
          securityGroup: "",
          ipType: "",
          subnet: "",
          floatingNetwork: "",
          switch: "",
          portgroup: "",
          nfsAddress: "",
          nfsPort: "",
          nfsFolder: "",
          nfsUsername: "",
          nfsPassword: ""
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
        networks: [],
        storages: [],
        securityGroups: [],
        networkList: [],
        ipType: [],
        ipTypes: [],
        floatingNetworkList: [],
        switchs: [],
        portgroups: [],
        templates: []
      },
      cloudTemplates: [],
      credentials: [],
      ipPools: [],
      subnetList: [],
      portgroups: [],
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
          storageType: [Rule.RequiredRule],
          securityGroup: [Rule.RequiredRule],
          ipType: [Rule.RequiredRule],
          subnet: [Rule.RequiredRule],
          floatingNetwork: [Rule.RequiredRule],
          switch: [Rule.RequiredRule],
          portgroup: [Rule.RequiredRule],
          nfsAddress: [Rule.RequiredRule],
          nfsPort: [Rule.RequiredRule],
          nfsUsername: [Rule.RequiredRule],
          nfsPassword: [Rule.RequiredRule]
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
    changeNetwork (networkId) {
      this.cloudZone.networkList.forEach(network => {
        if (network.id === networkId) {
          this.subnetList = network.subnetList
        }
      })
    },
    changeSwitch (switchName) {
      this.cloudZone.switchs.forEach(sw => {
        if (sw.name === switchName) {
          this.portgroups = sw.portgroups
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        createZone(this.form).then(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.create_success")
          })
          this.$router.push({ name: "ZoneList" })
        }).finally(() => {
          this.loading = false
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