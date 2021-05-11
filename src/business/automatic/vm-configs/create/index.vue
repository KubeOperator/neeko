<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'VmConfigList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="200px" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.cpu')" prop="cpu" >
              <el-input-number v-model="form.cpu" :step="1" :min="0" :max="300"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.memory')" prop="memory">
              <el-input-number v-model="form.memory" :step="1" :min="0" :max="300"></el-input-number>
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
import {createVmConfig} from "@/api/vm-config"
import Rule from "@/utils/rules"

export default {
  name: "VmConfigCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        cpu: 0,
        memory: 0,
        name: "",
      },
      rules: {
        name: [Rule.LengthRule,Rule.NameRule],
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
        }],
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        createVmConfig({
          name: this.form.name,
          cpu: this.form.cpu,
          memory: this.form.memory,
        }).then(() => {
          this.$message(
            {
              type: "success",
              message: this.$t("commons.msg.create_success")
            }
          )
          this.$router.push({ name: "VmConfigList" })
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "VmConfigList" })
    }
  }
}
</script>

<style scoped>

</style>
