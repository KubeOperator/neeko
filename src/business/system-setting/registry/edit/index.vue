<template>
  <layout-content :header="$t('setting.option.editRegistry')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('setting.table.registry.arch')" required>
              <el-input v-model="form.architecture" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.protocol')" required>
              <el-select style="width: 100%" v-model="form.protocol" default-first-option="https" placeholder="请选择">
                <el-option
                  v-for="item in protocolOptions"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.table.registry.hostname')" required>
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.save')}}</el-button>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import {getRegistry, updateRegistry} from "@/api/system-setting";
import LayoutContent from "@/components/layout/LayoutContent";
export default {
  components: {
    LayoutContent
  },
  name: "EditRegistry",
  props: ['arch'],
  data() {
    return {
      form: {
        architecture: '',
        hostname: '',
        protocol: '',
        id: '',
      },
      protocolOptions: [{
        value: 'http',
      }, {
        value: 'https',
      }],
    }
  },
  methods: {
    onSubmit() {
      updateRegistry(this.arch, {
        architecture: this.form.architecture,
        hostname: this.form.hostname,
        protocol: this.form.protocol,
        id: this.form.id
      }).then( () => {
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "Registry"})
      })
    },
    onCancel() {
      this.$router.push({name: "Registry"})
    },
  },
  created() {
    getRegistry(this.arch).then(data => {
      this.form.architecture = data.architecture,
      this.form.hostname = data.hostname,
      this.form.protocol = data.protocol,
      this.form.id = data.id
    })
  }
}
</script>

<style scoped>

</style>
