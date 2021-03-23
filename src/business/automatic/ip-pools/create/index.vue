<template>
  <layout-content :header="$t('commons.button.create')">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.description')">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.subnet')">
              <el-input v-model="form.subnet"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.ip_start')">
              <el-input v-model="form.ipStart"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.ip_end')">
              <el-input v-model="form.ipEnd"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.gateway')">
              <el-input v-model="form.gateway"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns1')">
              <el-input v-model="form.dns1"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.ip_pool.dns2')">
              <el-input v-model="form.dns2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit()">{{ $t("commons.button.save") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </layout-content>
</template>
<!--<template>-->
<!--  <layout-content :header="$t('commons.button.create')">-->
<!--    <el-row>-->
<!--      <el-col :span="4"><br/></el-col>-->
<!--      <el-col :span="16">-->
<!--        <div class="grid-content bg-purple-light">-->
<!--          <el-form ref="form" :model="form" label-width="80px">-->
<!--            <el-form-item :label="$t('commons.table.name')">-->
<!--              <el-input v-model="form.name"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item :label="$t('automatic.vm_config.cpu')">-->
<!--              <el-input-number  v-model="form.cpu"></el-input-number>-->
<!--            </el-form-item>-->
<!--            <el-form-item :label="$t('automatic.vm_config.memory')">-->
<!--              <el-input-number  v-model="form.memory"></el-input-number>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>-->
<!--              <el-button type="primary" @click="onSubmit()">{{ $t("commons.button.save") }}</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="4"></el-col>-->
<!--    </el-row>-->
<!--  </layout-content>-->
<!--</template>-->
<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {createIpPool} from "@/api/ip-pool"

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
      }
    }
  },
  methods: {
    onSubmit () {
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
    },
    onCancel () {
      this.$router.push({ name: "IpPoolList" })
    }
  }
}
</script>

<style scoped>

</style>