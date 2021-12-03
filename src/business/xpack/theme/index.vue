<template>
  <layout-content :header="$t('route.theme')">
    <el-col :span="2"><br /></el-col>
    <el-col :span="13">
      <div class="grid-content bg-purple-light">
        <el-form ref="form" label-position="left" v-loading="loading" :model="form" label-width="150px">
          <el-form-item style="width: 100%" :label="$t('theme.systemName')" required>
            <el-input v-model="form.systemName"></el-input>
            <div><span class="input-help">{{$t('theme.system_name_help')}}</span></div>
          </el-form-item>

          <el-form-item style="width: 100%;margin-top: 20px" :label="$t('theme.login_image')" required>
            <el-image v-if="form.loginImage === ''" :src="require('@/assets/KobeOperator-login.jpg')" style="width: 20%" />
            <el-image v-else :src="form.loginImage" style="width: 20%" />
            <div><span class="input-help">{{$t('theme.login_image_help')}}</span></div>
            <el-upload :on-change="(file, fileList) => {handleChange(file, fileList, 'loginImage')}" :auto-upload="false" class="upload-demo" :multiple="false" action="" :file-list="loginImages">
              <el-button size="small">
                <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px"> {{ $t('theme.re_upload')}}</span>
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item style="width: 100%;margin-top: 20px" :label="$t('theme.logo')" required>
            <el-image v-if="form.logo === ''" :src="require('@/assets/KubeOperator-assist-white.png')" style="width: 5%;background-color: #4A4B4D" />
            <el-image v-else :src="form.logo" style="width: 10%;background-color: #4A4B4D" />
            <div><span class="input-help">{{$t('theme.logo_help')}}</span></div>
            <el-upload :on-change="(file, fileList) => {handleChange(file, fileList, 'logo')}" :auto-upload="false" class="upload-demo" :multiple="false" action="" :file-list="logos">
              <el-button size="small">
                <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px"> {{ $t('theme.re_upload')}}</span>
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item style="width: 100%;margin-top: 20px" :label="$t('theme.logo_with_text')" required>
            <el-image v-if="form.logoWithText === ''" :src="require('@/assets/KubeOperator-white.png')" style="width: 25%;background-color: #4A4B4D" />
            <el-image v-else :src="form.logoWithText" style="width: 30%;background-color: #4A4B4D" />
            <div><span class="input-help">{{$t('theme.logo_with_text_help')}}</span></div>
            <el-upload :on-change="(file, fileList) => {handleChange(file, fileList, 'logoWithText')}" :auto-upload="false" class="upload-demo" :multiple="false" action="" :file-list="logoWithTexts">
              <el-button size="small">
                <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px"> {{ $t('theme.re_upload')}}</span>
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item style="width: 100%;margin-top: 20px" :label="$t('theme.logo_about')" required>
            <el-image v-if="form.logoAbout === ''" :src="require('@/assets/KubeOperator-red.png')" style="width: 25%;" />
            <el-image v-else :src="form.logoAbout" style="width: 30%;" />
            <div><span class="input-help">{{$t('theme.logo_about_help')}}</span></div>
            <el-upload :on-change="(file, fileList) => {handleChange(file, fileList, 'logoAbout')}" :auto-upload="false" class="upload-demo" :multiple="false" action="" :file-list="logoAbouts">
              <el-button size="small">
                <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px"> {{ $t('theme.re_upload')}}</span>
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item style="width: 100%;margin-top: 20px" :label="$t('theme.icon')" required>
            <el-image v-if="form.icon === ''" :src="require('@/assets/KubeOperator-assist-white.png')" style="width: 3%" />
            <el-image v-else :src="form.icon" style="width: 3%" />
            <div><span class="input-help">{{$t('theme.icon_help')}}</span></div>
            <el-upload :on-change="(file, fileList) => {handleChange(file, fileList, 'icon')}" :auto-upload="false" class="upload-demo" :multiple="false" action="" :file-list="icons">
              <el-button size="small">
                <span class="iconfont iconshangchuan5"></span><span style="font-size: 13px"> {{ $t('theme.re_upload')}}</span>
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <div style="position: absolute;right: 0px;margin-top: 20px">
              <el-button @click="onReSet()" v-preventReClick>{{$t('theme.reset')}}</el-button>
              <el-button type="primary" @click="onSubmit()" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </layout-content>
</template>

<script>
import { importTheme } from "@/api/theme"
import LayoutContent from "@/components/layout/LayoutContent"
import store from "@/store"

export default {
  name: "Theme",
  components: {
    LayoutContent,
  },
  data() {
    return {
      logos: [],
      logoWithTexts: [],
      loginImages: [],
      icons: [],
      logoAbouts: [],
      form: {
        systemName: "",
        logo: "",
        logoWithText: "",
        loginImage: "",
        icon: "",
        logoAbout: "",
      },
      loading: false,
      submitDisable: true,
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      importTheme(this.form)
        .then(() => {
          this.loading = false
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success"),
          })
          setTimeout(() => location.reload(), 500)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onReSet() {
      this.form.systemName = ""
      this.form.logo = ""
      this.form.logoWithText = ""
      this.form.loginImage = ""
      this.form.icon = ""
      this.form.logoAbout = ""
      this.onSubmit()
    },
    handleChange(e, filelist, key) {
      const types = ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/x-icon"]
      if (!types.includes(e.raw.type)) {
        this.$message({
          type: "error",
          message: this.$t("commons.validate.support_image_type"),
        })
        return false
      }
      const r = new FileReader()
      r.readAsDataURL(e.raw)
      r.onload = (b) => {
        switch (key) {
          case "loginImage":
            this.form.loginImage = b.target.result.toString()
            this.loginImages = filelist.slice(-1)
            break
          case "logo":
            this.form.logo = b.target.result.toString()
            this.logos = filelist.slice(-1)
            break
          case "logoWithText":
            this.form.logoWithText = b.target.result.toString()
            this.logoWithTexts = filelist.slice(-1)
            break
          case "icon":
            this.form.icon = b.target.result.toString()
            this.icons = filelist.slice(-1)
            break
          case "logoAbout":
            this.form.logoAbout = b.target.result.toString()
            this.logoAbouts = filelist.slice(-1)
            break
        }
      }
    },
  },
  created() {
    if (store.getters.theme) {
      this.form = store.getters.theme
    } else {
      this.$store.dispatch("theme/getThemeInfo").then((data) => {
        this.form = data
      })
    }
  },
}
</script>
<style scoped></style>
