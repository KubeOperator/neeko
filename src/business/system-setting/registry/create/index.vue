<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.arch')" required>
              <el-select style="width: 100%" v-model="form.architecture" placeholder="请选择">
                <el-option
                  v-for="item in architectureOptions"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('commons.table.protocol')" required>
              <el-select style="width: 100%" v-model="form.protocol" default-first-option="https" placeholder="请选择">
                <el-option
                  v-for="item in protocolOptions"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('commons.table.hostname')" required>
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
import LayoutContent from "@/components/layout/LayoutContent";
import {createRegistry} from "@/api/system-setting";
export default {
  name: "RegistryCreate",
  components: {LayoutContent},
  props: [
    'dialogFormVisible'
  ],
  data() {
    return {
      form: {
        architecture: '',
        hostname: '',
        protocol: ''
      },
      architectureOptions: [{
        value: 'x86_64',
      }, {
        value: 'aarch64',
      }],
      protocolOptions: [{
        value: 'http',
      }, {
        value: 'https',
      }],
      formLabelWidth: '120px'
    }
  },
  methods: {
    onSubmit() {
      createRegistry({
        architecture: this.form.architecture,
        hostname: this.form.hostname,
        protocol: this.form.protocol
      }).then(() => {
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "Registry"})
      })
    },
    onCancel() {
      this.$router.push({name: "Registry"})
    }
  },
  created() {
      this.form.architecture = 'x86_64';
      this.form.protocol = 'http';
  }
}
</script>

<style scoped>

</style>
