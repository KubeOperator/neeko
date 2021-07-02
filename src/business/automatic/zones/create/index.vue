<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'ZoneList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="200px" :model="form" :rules="rules" v-loading="loading"
                   label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('automatic.region.name')" prop="regionName">
              <el-select v-model="form.regionName"
                         filterable style="width:100%"
                         reserve-keyword
                         size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.compute") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.cluster')" prop="cloudVars.cluster">
                <el-select v-model="form.cloudVars.cluster"
                           filterable style="width:100%"
                           reserve-keyword
                           size="medium"
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
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.resourcePools"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-divider content-position="left">{{ $t("automatic.zone.datastore") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.datastore_type')"
                            prop="cloudVars.datastoreType">
                <el-radio-group v-model="form.cloudVars.datastoreType">
                  <el-radio label="value">{{ $t("automatic.zone.value") }}</el-radio>
                  <el-radio label="usage">{{ $t("automatic.zone.usage") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.datastore')" prop="cloudVars.datastore">
                <el-select v-model="form.cloudVars.datastore"
                           multiple
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudDatastores"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-divider content-position="left">{{ $t("automatic.zone.template") }}</el-divider>
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
                <el-form-item :label="$t('automatic.zone.template')" prop="cloudVars.imageName">
                  <el-select v-model="form.cloudVars.imageName"
                             filterable style="width:100%"
                             reserve-keyword
                             size="medium"
                             @change="changeTemplate(form.cloudVars.imageName)">
                    <el-option
                            v-for="(item,index) in cloudTemplates"
                            :key="index"
                            :label="item.imageName"
                            :value="item.imageName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('credential.credential')" prop="credentialName">
                  <el-select v-model="form.credentialName"
                             filterable style="width:100%"
                             size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.network") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.network_adapter')" prop="cloudVars.network">
                <el-select v-model="form.cloudVars.network"
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.networks"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.ip_pool.name')" prop="ipPoolName">
                <el-select v-model="form.ipPoolName"
                           filterable style="width:100%"
                           size="medium"
                           @change="changeIpPool()"
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
              <el-divider content-position="left"> {{ $t("automatic.zone.compute") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.cluster')" prop="cloudVars.cluster">
                <el-select v-model="form.cloudVars.cluster"
                           filterable style="width:100%"
                           reserve-keyword
                           size="medium"
                           @change="changeCloudZone(form.cloudVars.cluster)">
                  <el-option
                          v-for="(item,index) in cloudZones"
                          :key="index"
                          :label="item.cluster"
                          :value="item.cluster">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-divider content-position="left">{{ $t("automatic.zone.datastore") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.storageType')" prop="cloudVars.storageType">
                <el-select v-model="form.cloudVars.storageType"
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.storages"
                          :key="index"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-divider content-position="left">{{ $t("automatic.zone.template") }}</el-divider>
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
                <el-form-item :label="$t('automatic.zone.template')" prop="cloudVars.imageName">
                  <el-select v-model="form.cloudVars.imageName"
                             filterable style="width:100%"
                             reserve-keyword
                             size="medium"
                             @change="changeTemplate(form.cloudVars.imageName)">
                    <el-option
                            v-for="(item,index) in cloudTemplates"
                            :key="index"
                            :label="item.imageName"
                            :value="item.imageName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('credential.credential')" prop="credentialName">
                  <el-select v-model="form.credentialName"
                             filterable style="width:100%"
                             size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.network") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.security_group')"
                            prop="cloudVars.securityGroup">
                <el-select v-model="form.cloudVars.securityGroup"
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.securityGroups"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.network')" prop="cloudVars.network">
                <el-select v-model="form.cloudVars.network"
                           filterable style="width:100%"
                           reserve-keyword
                           size="medium"
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
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.ipTypes"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.subnet')" prop="cloudVars.subnet"
                            v-if="form.cloudVars.ipType==='private'">
                <el-select v-model="form.cloudVars.subnet"
                           filterable style="width:100%"
                           size="medium"
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
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudZone.floatingNetworkList"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.ip_pool.name')" prop="ipPoolName">
                <el-select v-model="form.ipPoolName"
                           filterable style="width:100%"
                           size="medium"
                           @change="changeIpPool()"
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
              <el-divider content-position="left">{{ $t("automatic.zone.compute") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.cluster')" prop="cloudVars.cluster">
                <el-select v-model="form.cloudVars.cluster"
                           filterable style="width:100%"
                           size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.datastore") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.datastore')" prop="cloudVars.datastore">
                <el-select v-model="form.cloudVars.datastore"
                           multiple style="width:100%"
                           size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.template") }}</el-divider>
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
                <el-form-item :label="$t('automatic.zone.nfs_address')" prop="cloudVars.nfsAddress">
                  <el-input v-model="form.cloudVars.nfsAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_port')" prop="cloudVars.nfsPort">
                  <el-input-number v-model="form.cloudVars.nfsPort"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('automatic.zone.nfs_folder')" prop="cloudVars.nfsFolder">
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
                <el-form-item :label="$t('automatic.zone.template')" prop="cloudVars.imageName">
                  <el-select v-model="form.cloudVars.imageName"
                             filterable
                             reserve-keyword
                             size="medium"
                             @change="changeTemplate(form.cloudVars.imageName)">
                    <el-option
                            v-for="(item,index) in cloudZone.templates"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('credential.credential')" prop="credentialName">
                  <el-select v-model="form.credentialName"
                             filterable style="width:100%"
                             size="medium"
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
              <el-divider content-position="left">{{ $t("automatic.zone.network") }}</el-divider>
              <el-form-item :label="$t('automatic.zone.switch')" prop="cloudVars.switch">
                <el-select v-model="form.cloudVars.switch"
                           filterable style="width:100%"
                           reserve-keyword
                           size="medium"
                           @change="changeSwitch(form.cloudVars.switch)">
                  <el-option
                          v-for="(item,index) in cloudZone.switchs"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.portgroup')" prop="cloudVars.portgroup">
                <el-select v-model="form.cloudVars.portgroup"
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in portgroups"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.ip_pool.name')" prop="ipPoolName">
                <el-select v-model="form.ipPoolName"
                           filterable style="width:100%"
                           size="medium"
                           reserve-keyword
                           @change="changeIpPool()">
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
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
          <h4 v-if="currentPool && form.ipPoolName !== '' ">{{ $t("automatic.ip_pool.name") }}</h4>
          <table class="el-table" v-if="currentPool && form.ipPoolName !== '' ">
            <tbody>
            <tr>
              <th>{{ $t("commons.table.name") }}</th>
              <td>{{ currentPool.name }}</td>
            </tr>
            <tr>
              <th>{{ $t("automatic.ip_pool.subnet") }}</th>
              <td>{{ currentPool.subnet }}</td>
            </tr>
            <tr>
              <th>{{ $t("automatic.ip_pool.gateway") }}</th>
              <td v-if="currentPool.ips.length >0 ">{{ currentPool.ips[0].gateway }}</td>
            </tr>
            <tr>
              <th>{{ $t("automatic.ip_pool.dns1") }}</th>
              <td v-if="currentPool.ips.length >0 ">{{ currentPool.ips[0].dns1 }}</td>
            </tr>
            <tr>
              <th>{{ $t("automatic.ip_pool.dns2") }}</th>
              <td v-if="currentPool.ips.length >0 ">{{ currentPool.ips[0].dns2 }}</td>
            </tr>
            <tr>
              <th>{{ $t("automatic.ip_pool.ip_usage") }}</th>
              <td>{{ currentPool.ipUsed }}/{{ currentPool.ips.length }}</td>
            </tr>
            </tbody>
          </table>
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
          nfsPassword: "",
          resourcePool: ""
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
        name: [Rule.LengthRule,Rule.NameRule],
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
      currentPool: {
        ips: [],
        ipUsed: 0
      }
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
      this.form.cloudVars.resourcePool =  ""
      this.form.cloudVars.datastore =  []
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
    },
    changeIpPool () {
      for (const p of this.ipPools) {
        if (this.form.ipPoolName === p.name) {
          this.currentPool = p
          break
        }
      }
    },
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
