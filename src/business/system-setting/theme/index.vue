<template>
  <div>
    <el-col :span="1"><br/></el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item  style="width: 100%" :label="$t('setting.table.theme.systemName')" required>
            <el-input v-model="form.systemName"></el-input>
          </el-form-item>

          <el-form-item style="width: 100%" :label="$t('setting.table.theme.logo')" required>
            <input type="file" @change="fileChange">
            <div style="position: absolute;right: 0px">
            <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
          </div>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"><br/></el-col>
  </div>
</template>

<script>
import {getTheme, importTheme} from "@/api/theme";

export default {
  name: "Theme",
  data() {
    return {
      form: {
        systemName: '',
        logo: ''
      },
      logoBase64: '',
      logoFile: ''
    }
  },
  methods: {
    onSubmit() {
      this.form.logo = this.logoBase64
      if (!this.logoBase64 || !window.FileReader) return false;
      importTheme( {
        systemName: this.form.systemName,
        logo: this.form.logo
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        setTimeout(() => location.reload(), 500)
      })
    },
    fileChange(e) {
      this.logoFile = e.target.files[0]
      const r = new FileReader();
      r.readAsDataURL(e.target.files[0]);
      r.onload = (b) => {
        this.logoBase64 = b.target.result.toString();
      };
    }
  },
  created() {
    getTheme().then( data => {
      this.form.systemName = data.systemName
    })
  }
}
</script>

<style scoped>

</style>
