<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'IpPoolList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.description')" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.subnet')" prop="subnet">
              <el-input v-model="form.subnet"></el-input>
            </el-form-item>
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
            <el-form-item :label="$t('automatic.ip_pool.dns2')" prop="dns1">
              <el-input v-model="form.dns2"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit()">{{ $t("commons.button.save") }}</el-button>
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
import {createIpPool} from "@/api/ip-pool"
import Rule from "@/utils/rules"

var ipaddr = require("ipaddr.js")

export default {
  name: "IpPoolCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        description: "",
        subnet: "",
        ipStart: "",
        ipEnd: "",
        gateway: "",
        dns1: "",
        dns2: "",
      },
      rules: {
        name: [Rule.NameRule],
        subnet: [Rule.IpRule],
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
        createIpPool({
          name: this.form.name,
          description: this.form.description,
          subnet: this.form.subnet,
          ipStart: this.form.ipStart,
          ipEnd: this.form.ipEnd,
          gateway: this.form.gateway,
          dns1: this.form.dns1,
          dns2: this.form.dns2
        }).then(() => {
          this.$message({
            type: "success",
            message: "创建成功"
          })
          this.$router.push({ name: "IpPoolList" })
        })
      })

    },
    onCancel () {
      this.$router.push({ name: "IpPoolList" })
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