<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'IpList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
            <el-form-item :label="$t('automatic.ip_pool.ip_start')" prop="ipStart">
              <el-input v-model="form.ipStart"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.ip_end')" prop="ipEnd">
              <el-input v-model="form.ipEnd"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.gateway')" prop="gateway">
              <el-input v-model="form.gateway"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns1')" prop="dns1">
              <el-input v-model="form.dns1"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns2')" prop="dns2">
              <el-input v-model="form.dns2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.save") }}</el-button>
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

var ipaddr = require("ipaddr.js")

export default {
  name: "IpCreate",
  components: { LayoutContent },
  props: ["name"],
  data () {
    var checkIp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("commons.form.required_msg")))
      }
      if (!ipaddr.isValid(value)) {
        return callback(new Error(this.$t("commons.form.ip_error")))
      }
      callback()
    }
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
        ipStart: [{ validator: checkIp, required: true, trigger: "blur" }],
        ipEnd: [{ validator: checkIp, required: true, trigger: "blur" }],
        gateway: [{ validator: checkIp, required: true, trigger: "blur" }],
        dns1: [{ validator: checkIp, required: true, trigger: "blur" }],
        dns2: [{ validator: checkIp, required: true, trigger: "blur" }]
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
            message: this.$t("commons.form.ip_range_error")
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
            message: this.$t("save_success")
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