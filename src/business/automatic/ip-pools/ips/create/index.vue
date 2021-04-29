<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'IpList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon label-position="left">
            <el-form-item :label="$t('automatic.ip_pool.subnet')">
              <el-input disabled :placeholder="subnet" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.ip_start')" prop="ipStart">
              <el-input v-model="form.ipStart"  :placeholder="$t('automatic.ip_pool.ip_start_help')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.ip_end')" prop="ipEnd">
              <el-input v-model="form.ipEnd" :placeholder="$t('automatic.ip_pool.ip_end_help')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.gateway')" prop="gateway">
              <el-input v-model="form.gateway" :placeholder="$t('automatic.ip_pool.gateway_help')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns1')" prop="dns1">
              <el-input v-model="form.dns1" :placeholder="$t('automatic.ip_pool.dns1_help')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns2')" prop="dns2">
              <el-input v-model="form.dns2" :placeholder="$t('automatic.ip_pool.dns2_help')"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {createIp} from "@/api/ip-pool"
import Rule from "@/utils/rules"

var ipaddr = require("ipaddr.js")

export default {
  name: "IpCreate",
  components: { LayoutContent },
  props: ["name", "subnet"],
  data () {
    return {
      form: {
        ipStart: "",
        ipEnd: "",
        gateway: "",
        dns1: "",
        dns2: "",
        ipPoolName: ""
      },
      rules: {
        ipStart: [Rule.IpRule],
        ipEnd: [Rule.IpRule],
        gateway: [Rule.IpRule],
        dns1: [Rule.IpRule],
        dns2: [Rule.IpRule]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.checkNetwork()) {
          this.$message({
            type: "error",
            message: this.$t("commons.validate.ip_range_error")
          })
          return false
        }
        createIp(this.name, {
          ipStart: this.form.ipStart,
          ipEnd: this.form.ipEnd,
          gateway: this.form.gateway,
          dns1: this.form.dns1,
          dns2: this.form.dns2,
          ipPoolName: this.name
        }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
          this.$router.push({ name: "IpList" })
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "IpList" })
    },
    checkNetwork () {
      const ipStartAddr = ipaddr.IPv4.parse(this.form.ipStart)
      const ipEndAddr = ipaddr.IPv4.parse(this.form.ipEnd)
      const start = ipStartAddr.toByteArray()
      const end = ipEndAddr.toByteArray()
      for (let i = 0; i < 4; i++) {
        if (start[i] > end[i]) {
          return false
        }
        if (i === 3 && (end[i] - start[i]) < 1) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
