<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.cpu')">
              <el-input-number v-model="form.cpu"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.memory')">
              <el-input-number v-model="form.memory"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit">{{ $t("commons.button.save") }}</el-button>
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
  name: "UserEdit",
  props: ["name"],
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        cpu: 0,
        memory: 0
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