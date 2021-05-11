<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="login-background">
    <div class="login-container">
      <el-row type="flex" v-loading="loading">
        <el-col :span="12">
          <el-form :model="form" :rules="rules" ref="form" size="default">
            <div class="login-title">
              {{ systemName }}
            </div>
            <div class="login-border"></div>
            <div class="login-welcome">
              {{ $t("login.welcome") }}
            </div>
            <div class="login-form">
              <el-form-item prop="username">
                <el-input v-model="form.username" :placeholder="$t('login.username')" autofocus />
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="form.password" :placeholder="$t('login.password')"
                          maxlength="30"/>
              </el-form-item>
              <el-form-item v-if="hasCode">
                <el-col :span="18">
                  <el-form-item prop="code">
                    <el-input v-model="form.code"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-image style="float: right" :src="captcha.image" @click="createCaptcha"></el-image>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </div>
            <div class="login-btn">
              <el-button type="primary" class="submit" @click="submit('form')" size="default">
                {{ $t("commons.button.login") }}
              </el-button>
            </div>
            <div class="forget-password">
              <a style="color: #999999;text-decoration-line: underline" @click="forgetPassword">{{ $t("login.forget_password") }}?</a>
            </div>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div class="login-image"></div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="$t('login.reset_password')" :visible.sync="opened" width="30%" v-loading="loadingPage">
      <el-form :model="forgetForm" :rules="forgetRules" ref="forgetForm" size="default">
        <el-form-item prop="username">
          <el-input v-model="forgetForm.username" :placeholder="$t('login.username')" autofocus/>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="forgetForm.email" :placeholder="$t('login.email')" autofocus/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="opened = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submitForget('forgetForm')">{{ $t("commons.button.submit") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getTheme} from "@/api/theme"
import {getCaptcha, resetPassword} from "@/api/auth"

export default {
  name: "Login",
  data () {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
        captchaId: "",
        code: "",
      },
      rules: {
        username: [
          { required: true, message: this.$tm("commons.validate.input", "login.username"), trigger: "blur" },
        ],
        password: [
          // 先去掉方便测试
          { required: true, message: this.$tm("commons.validate.input", "login.password"), trigger: "blur" },
          { min: 6, max: 30, message: this.$t("commons.validate.limit", [6, 30]), trigger: "blur" }
        ],
        code: [
          { required: true, message: this.$tm("commons.validate.input", "login.captcha"), trigger: "blur" },
        ]
      },
      msg: "",
      redirect: undefined,
      otherQuery: {},
      systemName: this.$t("login.title"),
      captcha: {
        image: ""
      },
      hasCode: false,
      opened: false,
      forgetForm: {
        username: "",
        email: ""
      },
      forgetRules: {
        username: [
          { required: true, message: this.$tm("commons.validate.input", "login.username"), trigger: "blur" },
        ],
        email: [
          { required: true, message: this.$tm("commons.validate.input", "login.email"), trigger: "blur" },
        ],
      },
      loadingPage:false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created: function () {
    document.addEventListener("keydown", this.watchEnter)
    this.getSystemName()
    this.checkErrorNum()
  },

  destroyed () {
    document.removeEventListener("keydown", this.watchEnter)
  },
  methods: {
    watchEnter (e) {
      let keyCode = e.keyCode
      if (keyCode === 13) {
        if (this.opened) {
          this.submitForget("forgetForm")
        }else {
          this.submit("form")
        }
      }
    },
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.captchaId = this.captcha.captchaId
          this.$store.dispatch("user/login", this.form).then(() => {
            this.$router.push({ path: this.redirect || "/", query: this.otherQuery })
            this.loading = false
            localStorage.removeItem("loginErrorNum")
          }).catch(error => {
            this.handleError(error)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    getSystemName () {
      getTheme().then(data => {
        if (data.systemName !== "") {
          this.systemName = data.systemName
        }
      }).catch(() => this.systemName = this.$t("login.title"))
    },
    checkErrorNum () {
      if (localStorage.getItem("loginErrorNum") != null) {
        const loginErrorNum = Number(localStorage.getItem("loginErrorNum"))
        if (loginErrorNum >= 3) {
          this.createCaptcha()
        }
      }
    },
    createCaptcha () {
      getCaptcha().then(res => {
        this.captcha = res
        this.hasCode = true
      })
    },
    forgetPassword () {
      this.opened = true
    },
    submitForget (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loadingPage= true
        resetPassword(this.forgetForm).then(() => {
          this.$message({
            type: "success",
            message: this.$t("login.reset_message")
          })
          this.opened = false
          this.loadingPage= false
        }).finally(()=>{
          this.loadingPage= false
        })
      })
    },
    handleError (error) {
      this.msg = error
      if (localStorage.getItem("loginErrorNum") != null) {
        const loginErrorNum = Number(localStorage.getItem("loginErrorNum"))
        if (loginErrorNum >= 3) {
          this.createCaptcha()
        } else {
          const newNum = loginErrorNum + 1
          localStorage.setItem("loginErrorNum", newNum.toString())
        }
      } else {
        localStorage.setItem("loginErrorNum", "1")
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "../../styles/common/variables";

  @mixin login-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-background {
    background-color: $--background-color-base;
    height: 100%;
    @include login-center;
  }

  .login-container {
    min-width: 640px;
    width: 960px;
    height: 480px;
    background-color: #FFFFFF;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
    @media only screen and (max-width: 1280px) {
      width: 900px;
      height: 380px;
    }

    .login-logo {
      margin-top: 30px;
      margin-left: 30px;
      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }

      img {
        height: 45px;
      }
    }

    .login-title {
      margin-top: 50px;
      font-size: 32px;
      letter-spacing: 0;
      text-align: center;
      color: #999999;

      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }
    }

    .login-border {
      height: 2px;
      margin: 20px auto 20px;
      position: relative;
      width: 80px;
      background: $--color-primary;
      @media only screen and (max-width: 1280px) {
        margin: 10px auto 10px;
      }
    }

    .login-welcome {
      margin-top: 10px;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      line-height: 18px;
      text-align: center;
      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }
    }

    .login-form {
      margin-top: 30px;
      padding: 0 40px;

      @media only screen and (max-width: 1280px) {
        margin-top: 10px;
      }

      & ::v-deep .el-input__inner {
        border-radius: 0;
      }
    }

    .login-btn {
      margin-top: 40px;
      padding: 0 40px;
      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }

      .submit {
        width: 100%;
        border-radius: 0;
      }
    }

    .login-msg {
      margin-top: 10px;
      padding: 0 40px;
      color: $--color-danger;
      text-align: center;
    }

    .login-image {
      background: url(../../assets/KobeOperator-login.jpg) no-repeat;
      background-size: cover;
      width: 100%;
      height: 480px;
      @media only screen and (max-width: 1280px) {
        height: 380px;
      }
    }

    .submit {
      width: 100%;
      border-radius: 0;
    }

    .forget-password {
      margin-top: 40px;
      padding: 0 40px;
      float: right;
      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }
    }
  }
</style>
