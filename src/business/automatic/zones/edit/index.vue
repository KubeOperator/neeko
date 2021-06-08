<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'ZoneList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="200px" :model="form" :rules="rules" v-loading="loading" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <div v-if="form.provider === 'vSphere' || form.provider === 'FusionCompute'">
              <el-form-item :label="$t('automatic.zone.datastore_type')"
                            prop="cloudVars.datastoreType">
                <el-radio-group v-model="form.cloudVars.datastoreType">
                  <el-radio label="value">{{ $t("automatic.zone.value") }}</el-radio>
                  <el-radio label="usage">{{ $t("automatic.zone.usage") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.old_datastores')" prop="oldDatastores">
                <el-select v-model="oldDatastores"
                           multiple
                           filterable style="width:100%"
                           reserve-keyword
                           disabled>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('automatic.zone.new_datastores')" prop="chooseDatastores">
                <el-select v-model="newDatastores"
                           multiple
                           filterable style="width:100%"
                           reserve-keyword>
                  <el-option
                          v-for="(item,index) in cloudDatastores"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item :label="$t('automatic.ip_pool.name')" prop="ipPoolName">
              <el-select v-model="form.ipPoolName" filterable style="width:100%" reserve-keyword @change="changeIpPool()">
                <el-option
                        v-for="(item,index) in ipPools"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
          <h3>{{ $t("automatic.ip_pool.name") }}</h3>
          <table class="el-table" v-if="currentPool">
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
import {getZone, listDatastores,updateZone} from "@/api/zone"
import {listAllIpPools} from "@/api/ip-pool"

export default {
  name: "ZoneEdit",
  components: { LayoutContent },
  props: ["name"],
  data () {
    return {
      form: {
        name: "",
        ipPoolName: "",
        cloudVars: {
          datastoreType: "",
          datastore: ""
        },
        provider: ""
      },
      rules: {
      },
      loading: false,
      ipPools: [],
      cloudDatastores: [],
      cloudZoneRequest: {
        regionName: "",
        cloudVars: {}
      },
      newDatastores: [],
      oldDatastores: [],
      currentPool: {
        ips: [],
        ipUsed: 0
      }
    }
  },
  methods: {
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.form.provider === 'vSphere' || this.form.provider === 'FusionCompute') {
          if (this.form.cloudVars['datastore'] instanceof Array) {
            this.form.cloudVars['datastore'] = this.form.cloudVars['datastore'].concat(this.newDatastores);
          } else if (this.form.cloudVars['datastore'].length > 0) {
            this.newDatastores.push(this.form.cloudVars['datastore']);
            this.form.cloudVars['datastore'] = this.newDatastores;
          }
        }
        this.loading = true
        updateZone(this.form.name, this.form).then(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
          this.$router.push({ name: "ZoneList" })
        }).finally(() => {
          this.loading = false
        })
      })
    }
  },
  created () {
    this.loading = true
    getZone(this.name).then(res => {
      this.form = res
      listAllIpPools().then(data => {
        this.ipPools = data.items
        this.changeIpPool()
      })
      this.oldDatastores = this.form.cloudVars["datastore"]
      if (this.form.provider === "vSphere" || this.form.provider === "FusionCompute") {
        this.cloudZoneRequest.cloudVars = this.form.cloudVars
        this.cloudZoneRequest.regionName = this.form.regionName
        listDatastores(this.cloudZoneRequest).then(res => {
          if (this.form.cloudVars["datastore"] instanceof Array) {
            const old = this.form.cloudVars["datastore"]
            for (const n of res) {
              let exist = false
              for (const o of old) {
                if (n.name === o) {
                  exist = true
                }
              }
              if (!exist) {
                this.cloudDatastores.push(n)
              }
            }
          } else {
            //为了兼容旧版本
            const old = this.form.cloudVars["datastore"]
            for (const n of res) {
              if (n.name !== old) {
                this.cloudDatastores.push(n)
              }
            }
          }
        })
      }
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
