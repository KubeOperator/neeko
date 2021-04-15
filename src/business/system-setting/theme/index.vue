<template>
  <div>
    <el-col :span="1"><br/></el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item  style="width: 100%" :label="$t('setting.table.theme.systemName')" required>
            <el-input v-model="form.systemName"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('setting.table.theme.logo')" required>
            <el-upload
              :on-change="onUploadChange"
              :auto-upload="false"
              :on-exceed="uploadInfo"
              class="upload-demo"
              :limit=1
              action=""
              list-type="picture">
              <el-button size="small" type="success">
                <svg class="icon" aria-hidden="true"   >
                  <use  xlink:href="#iconshangchuan1"></use>
                </svg>
                {{ $t('commons.button.upload')}}
              </el-button>
              <div class="el-upload__tip" slot="tip">
                <svg class="icon" aria-hidden="true"   >
                  <use  xlink:href="#icontishi11"></use>
                </svg>
                {{ $t('setting.table.theme.uploadLogoHelper') }}
              </div>
            </el-upload>
            <div style="position: absolute;right: 0px;margin-top: 20px">
            <el-button type="primary" @click="onSubmit()">{{$t('commons.button.submit')}}</el-button>
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
      logoFile: '',
    }
  },
  methods: {
    onSubmit() {
      this.form.logo = this.logoBase64
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
    onUploadChange(e) {
      this.logoFile = e.raw
      const r = new FileReader();
      r.readAsDataURL(e.raw);
      r.onload = (b) => {
        this.logoBase64 = b.target.result.toString();
      };
    },
    uploadInfo() {
      this.$message({
        type: 'warning',
        message: '默认只能上传一个文件，请删除当前文件后，重新上传!'
      });
    }
  },
  created() {
    getTheme().then( data => {
      this.form.systemName = data.systemName
      this.form.logo = data.logo
    })
  }
}
</script>
<style scoped></style>
