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
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.username')" required>
              <el-input v-model="form.vars['ldap_username']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.password')" required>
              <el-input type="password"  :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.vars['ldap_password']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.filterDN')" required>
              <el-input v-model="form.vars['ldap_dn']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.filterRule')" required>
              <el-input v-model="form.vars['ldap_filter']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.status')" required>
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
                <el-button @click="sync" :disabled="!btnSlect">{{$t('commons.button.sync')}}</el-button>
                <el-button type="primary" @click="onSubmit" >{{$t('commons.button.submit')}}</el-button>
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
import {createLDAP, getSetting, syncLDAP} from "@/api/system-setting";
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules";

export default {
  name: "LDAP",
  components: {
    LayoutContent
  },
  data() {
    return {
      form: {
        vars: {},
        tab: ''
      },
      rules: {
        vars: {
          ldap_address: [Rule.RequiredRule],
          ldap_port: [Rule.RequiredRule],
        }
      },
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
          message: this.$t('commons.msg.verify_success')
        });
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
    })
  }
}
</script>

<style scoped>

</style>
