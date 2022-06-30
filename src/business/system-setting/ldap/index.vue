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
                <el-button @click="openLoginPage" :disabled="loading">{{
                    $t("setting.table.ldap.test_login")
                  }}
                </el-button>
                <el-button @click="openImportPage" :disabled="loading">{{
                    $t("setting.table.ldap.import_user")
                  }}
                </el-button>
                <el-button @click="remake" :disabled="loading">{{
                    $t("setting.table.ldap.ldap_remake")
                  }}
                </el-button>
                <el-button type="primary" @click="onSubmit" v-preventReClick>{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>

          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
      <el-dialog :visible.sync="loginPageOpen" :title="$t('setting.table.ldap.test_login')" width="30%">
        <el-form ref="loginForm" v-loading="loginLoading" label-position="left" :rules="rules" :model="loginForm"
                 label-width="20%">
          <el-form-item style="width: 100%" :label="$t('setting.table.ldap.username')" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" :label="$t('setting.table.ldap.password')" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <div style="height: 30px">
            <div style="float: right">
              <el-button @click="loginPageOpen=false" :disabled="loginLoading">
                {{ $t("commons.button.cancel") }}
              </el-button>
              <el-button type="primary" @click="loginTest" :disabled="loginLoading">{{ $t("commons.button.confirm") }}
              </el-button>
            </div>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog :visible.sync="importUserPageOpen" :title="$t('setting.table.ldap.import_user')" style="height: 900px">
        <span>{{ $t("setting.table.ldap.ldap_helper") }}</span>
        <div style="text-align: right;margin-bottom: 10px">
          <el-input v-model="searchName" suffix-icon="el-icon-search" style="width: 30%" size="mini" clearable @change="handleSearch" />
        </div>
        <el-table
                :data="tableUsers.slice((pageConfig.currentPage-1)*pageConfig.pageSize,pageConfig.currentPage*pageConfig.pageSize)"
                @selection-change="handleSelectionChange">
          <el-table-column type="selection" fix :selectable="importAvailable"></el-table-column>
          <el-table-column :label="$t('commons.table.name')" prop="name" min-width="100" fix>
          </el-table-column>
          <el-table-column :label="$t('setting.email')" prop="email" min-width="100" fix>
          </el-table-column>
          <el-table-column :label="$t('setting.table.ldap.import_enable')" prop="available" min-width="100" fix>
            <template v-slot:default="{row}">
              {{ row.available ? $t('commons.form.yes') : $t('commons.form.no') }}
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 30px;margin-top: 10px;margin-bottom: 20px;text-align: right">
          <el-pagination
                  :current-page.sync="pageConfig.currentPage"
                  :page-size="pageConfig.pageSize"
                  layout="prev, pager, next"
                  :total="tableUsers.length">
          </el-pagination>
          <el-button @click="importUserPageOpen=false" :disabled="importLoading">
            {{ $t("commons.button.cancel") }}
          </el-button>
          <el-button type="primary" @click="userImport" :disabled="importLoading">{{ $t("commons.button.confirm") }}
          </el-button>
        </div>
      </el-dialog>
    </layout-content>
  </div>
</template>

<script>
import {createLDAP, getSetting, importUsers, sync, testConnect, testLogin} from "@/api/system-setting"
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
      loginPageOpen: false,
      loginLoading: false,
      loginForm: {},
      users: [],
      tableUsers: [],
      importUserPageOpen: false,
      searchName: "",
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
      },
      selects: [],
      importLoading: false,
      oldConfig: {}
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
    },
    openLoginPage () {
      this.loginPageOpen = true
      this.loginForm = {}
    },
    loginTest () {
      let isFormReady = false
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          isFormReady = true
        }
      })
      if (!isFormReady) {
        return
      }
      this.loginLoading = true
      testLogin(this.loginForm).then(() => {
        this.$message({
          type: "success",
          message: this.$t("business.user.login_success")
        })
      }).finally(() => {
        this.loginLoading = false
      })
    },
    openImportPage(){
      this.searchName = ""
      this.loading = true
      sync().then(res => {
        this.users = res
        this.tableUsers = res
        this.importUserPageOpen = true
      }).finally(() => {
        this.loading = false
      })
    },
    userImport() {
      if (this.selects.length === 0) {
        return
      }
      let req = {
        users: this.selects
      }
      this.importLoading = true
      importUsers(req).then(() => {
        this.$message({
          type: "success",
          message: this.$t("setting.table.ldap.import_user_success")
        })
        this.importUserPageOpen = false
      }).finally(() => {
        this.importLoading = false
      })
    },
    handleSelectionChange(val) {
      this.selects = val
    },
    handleSearch(){
      this.tableUsers =this.users.filter(user => {
        return user.name.indexOf(this.searchName) > -1
      })
    },
    importAvailable (row) {
      return row.available
    },
    remake () {
      this.form = JSON.parse(JSON.stringify(this.oldConfig))
    },
  },
  computed: {
    btnSlect(){
      let status = this.form.vars['ldap_status']
      return status === "ENABLE"
    }
  },
  created() {
    getSetting('LDAP').then( data => {
      this.form = data
      this.oldConfig = data
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
