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
            <el-form-item :label="$t('automatic.vm_config.cpu')">
              <el-input-number  v-model="form.cpu"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('automatic.vm_config.memory')">
              <el-input-number  v-model="form.memory"></el-input-number>
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

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {createVmConfig} from "@/api/vm-config"

export default {
  name: "VmConfigCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        cpu: 0,
        memory: 0,
        name: "",
      }
    }
  },
  methods: {
    onSubmit(){
      createVmConfig({
        name:this.form.name,
        cpu: this.form.cpu,
        memory:this.form.memory,
      }).then( () => {
        this.$message(
          {
            type: "success",
            message: `创建成功`
          }
        )
        this.$router.push({name:"VmConfigList"})
      })
    },
    onCancel() {
      this.$router.push({name: "VmConfigList"})
    }
  }
}
</script>

<style scoped>

</style>