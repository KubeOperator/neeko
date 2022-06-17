<template>
  <div>
    <layout-content :header="$t('route.ldap')">
    <br>
      <el-col :span="2"><br/></el-col>
      <el-col :span="15">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :rules="rules" :model="form" label-width="150px">
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.address')" prop="vars.ldap_address">
              <el-input v-model="form.vars['ldap_address']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.port')" prop="vars.ldap_port">
              <el-input v-model="form.vars['ldap_port']"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.ldap.ldap_tls')" prop="tls">
              <el-switch
                      v-model="form.vars['ldap_tls']"
                      active-value="ENABLE"
                      inactive-value="DISABLE"
                      :active-text="$t('commons.form.yes')"
                      :inactive-text="$t('commons.form.no')">
              </el-switch>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.username')" prop="vars.ldap_username">
              <el-input v-model="form.vars['ldap_username']" :placeholder="'cn=Manager,dc=ko,dc=com or Manager@ko.com'"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.password')" prop="vars.ldap_password">
              <el-input type="password" show-password  :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.vars['ldap_password']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.filterDN')" prop="vars.ldap_dn">
              <el-input v-model="form.vars['ldap_dn']" :placeholder="'ou=users,dc=ko,dc=com'"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.filterRule')" prop="vars.ldap_filter">
              <el-input v-model="form.vars['ldap_filter']" :placeholder="'(&(objectClass=organizationalPerson))'"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.ldap_mapping')" prop="vars.ldap_mapping">
              <codemirror ref="editor" class="yaml-editor"  v-model="form.vars['ldap_mapping']" :options="options"></codemirror>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.ldap.time_limit')" prop="vars.time_limit">
              <el-input v-model="form.vars['time_limit']" :placeholder="'30'" type="number"></el-input>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('setting.table.ldap.size_limit')" prop="vars.size_limit">
              <el-input v-model="form.vars['size_limit']" :placeholder="'1000'" type="number"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.status')" prop="vars.ldap_status">
              <el-switch
                v-model="form.vars['ldap_status']"
                active-value="ENABLE"
                inactive-value="DISABLE"
                :active-text="$t('commons.button.enable')"
                :inactive-text="$t('commons.button.disable')">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <div  style="font-size: 12px;color: #4E5051;">
                <svg class="icon" aria-hidden="true"  >
                  <use  xlink:href="#icontishi11"></use>
                </svg>
                {{$t('setting.table.ldap.ldapHelper')}}
              </div>
            </el-form-item>

            <div style="float: right">
              <el-form-item>
                <el-button @click="connectTest" :disabled="loading">{{
                    $t("setting.table.ldap.ldap_test")
                  }}
                </el-button>
                <el-button @click="sync" :disabled="!btnSlect">{{$t('commons.button.sync')}}</el-button>
                <el-button type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>

          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </layout-content>
  </div>
</template>

<script>
import {createLDAP, getSetting, syncLDAP, testConnect} from "@/api/system-setting"
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules";
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ayu-dark.css"
import "codemirror/mode/javascript/javascript"

export default {
  name: "LDAP",
  components: {
    LayoutContent
  },
  data() {
    return {
      form: {
        vars: {
          ldap_mapping: "{\n" +
            "   \"Name\":\"cn\",\n" +
            "   \"Email\":\"mail\"\n" +
            "}",
          size_limit: 1000,
          time_limit: 30,
        },
        tab: ''
      },
      rules: {
        vars: {
          ldap_address: [Rule.RequiredRule],
          ldap_port: [Rule.RequiredRule],
          ldap_username: [Rule.RequiredRule],
          ldap_password: [Rule.RequiredRule],
          ldap_dn: [Rule.RequiredRule],
          ldap_filter: [Rule.RequiredRule],
          ldap_mapping: [Rule.RequiredRule],
          ldap_status: [Rule.RequiredRule],
          time_limit: [Rule.RequiredRule],
          size_limit: [Rule.RequiredRule],
        }
      },
      loading: false,
      options: {
        value: "",
          mode: "application/json",
          theme: "ayu-dark",
          lineNumbers: true,
          tabSize: 2,
          lineWrapping: true,
          gutters: ["CodeMirror-lint-markers"],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
          if (!valid) {
            return false
          }
      this.loading = true
      createLDAP( {
        vars: this.form.vars,
        tab: 'LDAP'
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.save_success')
        });
        this.$router.push({name: "LDAP"})
      }).finally(() => {
        this.loading = false
      })
    })
    },
    sync(){
      this.loading = true
      syncLDAP( {
        vars: this.form.vars,
        tab: 'LDAP'
      }).then(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: this.$t('setting.table.ldap.sync_success')
        });
      }).finally(() => {
        this.loading = false
      })
    },
    connectTest() {
      let isFormReady = false
      this.$refs["form"].validate((valid) => {
        if (valid) {
          isFormReady = true
        }
      })
      if (!isFormReady) {
        return
      }
      this.loading = true
      testConnect(this.form).then(res => {
        this.$message({
          type: "success",
          message: this.$t("setting.table.ldap.test_result", { count: res.data })
        })
      }).finally(() => {
        this.loading = false
      })
    }
  },
  computed: {
    btnSlect(){
      let status = this.form.vars['ldap_status']
      if (status == "ENABLE"){
        return true
      }else {
        return false
      }
    }
  },
  created() {
    getSetting('LDAP').then( data => {
      this.form = data
      if (this.form.vars.ldap_mapping === undefined || this.form.vars.ldap_mapping === "" ) {
        this.form.vars.ldap_mapping = "{\n" +
          "   \"Name\":\"cn\",\n" +
          "   \"Email\":\"mail\"\n" +
          "}"
      }
    })
  }
}
</script>

<style scoped>
    .yaml-editor {
        height: 100%;
        position: relative;
    }

    .yaml-editor >>> .CodeMirror {
        height: auto;
        min-height: 100px;
    }
</style>
