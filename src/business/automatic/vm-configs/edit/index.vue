<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'VmConfigList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.cpu')" prop="cpu">
              <el-input-number v-model="form.cpu"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.memory')" prop="memory">
              <el-input-number v-model="form.memory"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit">{{ $t("commons.button.submit") }}</el-button>
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
import {getVmConfig, updateVmConfig} from "@/api/vm-config"

export default {
  name: "VmConfigEdit",
  props: ["name"],
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        cpu: 0,
        memory: 0
      },
      rules: {
        cpu: [{
          required: true,
          trigger: "blur",
          type: "number",
          min: 1,
          max: 1000,
          message: this.$t("automatic.vm_config.cpu_invalid")
        }],
        memory: [{
          required: true,
          trigger: "blur",
          type: "number",
          min: 1,
          max: 1000,
          message: this.$t("automatic.vm_config.mem_invalid")
        }]
      }
    }
  },
  methods: {
    onSubmit () {
      updateVmConfig(this.name, {
        cpu: this.form.cpu,
        memory: this.form.memory
      }).then(() => {
          this.$message({
            type: "success",
            message: `修改成功`
          })
          this.$router.push({ name: "VmConfigList" })
        }
      )
    },
    onCancel () {
      this.$router.push({ name: "VmConfigList" })
    }
  },
  created () {
    getVmConfig(this.name).then(data => {
      this.form.name = data.name
      this.form.cpu = data.cpu
      this.form.memory = data.memory
    })
  }
}
</script>

<style scoped>

</style>
