<template>
  <div>
    <layout-content :header="$t('route.ldap')" v-loading="loading">
    <br>
      <el-col :span="1"><br/></el-col>
      <el-col :span="15">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-position="left" :model="form" label-width="130px">
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.address')" required>
              <el-input v-model="form.vars['ldap_address']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.port')" required>
              <el-input v-model="form.vars['ldap_port']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.username')" required>
              <el-input v-model="form.vars['ldap_username']"></el-input>
            </el-form-item>
            <el-form-item  style="width: 100%" :label="$t('setting.table.ldap.password')" required>
              <el-input :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.vars['ldap_password']" show-password></el-input>
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
                <el-button type="primary" @click="onSubmit" :disabled="btn">{{$t('commons.button.submit')}}</el-button>
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
      btn: true,
      loading: false
    }
  },
  methods: {
    onSubmit() {
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
        setTimeout(() => location.reload(), 500)
        this.$router.push({name: "LDAP"})
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
        this.btn = false
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
      this.form.vars = data.vars,
        this.form.tab = data.tab
    })
  }
}
</script>

<style scoped>

</style>
