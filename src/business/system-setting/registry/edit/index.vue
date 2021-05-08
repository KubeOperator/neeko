<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'Registry'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading"  :rules="rules" :model="form" label-width="80px">
            <el-form-item :label="$t('setting.table.registry.arch')" required>
              <span >{{form.architecture}}</span>
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
            <el-form-item :label="$t('setting.table.registry.hostname')" prop="hostname"  required>
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
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
import Rule from "@/utils/rules";

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
      rules: {
        hostname: [Rule.IpRule],
      },
      protocolOptions: [{
        value: 'http',
      }, {
        value: 'https',
      }],
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        updateRegistry(this.arch, {
          architecture: this.form.architecture,
          hostname: this.form.hostname,
          protocol: this.form.protocol,
          id: this.form.id
        }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: this.$t("commons.msg.update_success")
          });
          this.$router.push({name: "Registry"})
        }).finally(() => {
          this.loading = false
        })
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
