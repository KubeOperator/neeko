<template>
  <div >
    <layout-content :header="$t('route.theme')" style="min-height: 600px;">
      <el-col :span="2"><br/></el-col>
      <el-col :span="13">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" v-loading="loading" :model="form" label-width="120px">
            <el-form-item  style="width: 100%" :label="$t('theme.systemName')" required>
              <el-input v-model="form.systemName"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('theme.logo')" required>
              <el-upload
                :on-change="onUploadChange"
                :auto-upload="false"
                :on-exceed="uploadInfo"
                class="upload-demo"
                :limit=1
                action=""
                list-type="picture">
                <el-button size="small" >
                  <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px">{{ $t('commons.button.upload')}}</span>
                </el-button>
                <div class="el-upload__tip" slot="tip">
                  <svg class="icon" aria-hidden="true"   >
                    <use  xlink:href="#icontishi11"></use>
                  </svg>
                  {{ $t('theme.uploadLogoHelper') }}
                </div>
              </el-upload>
              <div style="position: absolute;right: 0px;margin-top: 20px">
                <el-button type="primary" @click="onSubmit()">{{$t('commons.button.submit')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </layout-content>
  </div>
</template>

<script>
import {getTheme, importTheme} from "@/api/theme";
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "Theme",
  components: {
    LayoutContent
  },
  data() {
    return {
      form: {
        systemName: '',
        logo: ''
      },
      logoBase64: '',
      logoFile: '',
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.form.logo = this.logoBase64
      importTheme( {
        systemName: this.form.systemName,
        logo: this.form.logo
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        setTimeout(() => location.reload(), 500)
      }).finally(() => {
        this.loading = false
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
        message: this.$t('theme.uploadLogoNumHelper')
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
