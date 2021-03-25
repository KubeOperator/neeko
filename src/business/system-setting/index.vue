<template>
<!--  <div>-->
<!--    <layout-content>-->
<!--      <template #header>-->
<!--        <back-button path=""></back-button>-->
<!--        {{$t('route.system_setting')}}-->
<!--      </template>-->
<!--      <TabPage :submenu="submenu" :active-menu.sync="activeMenu">-->
<!--        <keep-alive>-->
<!--          <component :is="activeMenu" :object="componentData" />-->
<!--        </keep-alive>-->
<!--      </TabPage>-->
<!--      </layout-content>-->
<!--  </div>-->

  <layout-content :header="$t('route.system_setting')">
    <el-menu router :default-active="$route.path" mode="horizontal">
      <el-menu-item :index="'/setting/registry'">仓库</el-menu-item>
      <el-menu-item :index="'/setting/credential'">凭证</el-menu-item>
      <el-menu-item :index="'/setting/ntp'">NTP</el-menu-item>
      <el-menu-item :index="'/setting/email'">邮箱</el-menu-item>
      <el-menu-item :index="'/setting/ldap'">LDAP</el-menu-item>
      <el-menu-item :index="'/setting/license'">许可</el-menu-item>
      <el-menu-item :index="'/setting/theme'">主题</el-menu-item>
      <el-menu-item :index="'/setting/message'">消息</el-menu-item>
    </el-menu>
    <br/>
    <router-view></router-view>
  </layout-content>
</template>

<script>
// import Registry from "./registry";
// import NTP from "./ntp";
// import Credential from "./credential";
// import Theme from "./theme"
// import Ldap from "./ldap";
// import Email from "./email";
// import Message from "./message";
// import License from "./license";
// import TabPage from "@/components/tab-page";
import LayoutContent from "@/components/layout/LayoutContent";


export default {
  components: {
    // Registry,
    // NTP,
    LayoutContent,
    // TabPage,
    // Credential,
    // Ldap,
    // Email,
    // Message,
    // License,
    // Theme
  },
  name: "Setting",
  data() {
    return {
      activeMenu: 'registry',
      submenu: [
        {
          title: this.$t('setting.registry'),
          name: 'Registry'
        },
        {
          title: this.$t('setting.credential'),
          name: 'Credential'
        },
        {
          title: this.$t('setting.ntp'),
          name: 'NTP'
        },
        {
          title: this.$t('setting.email'),
          name: 'Email'
        },
        {
          title: this.$t('setting.license'),
          name: 'License'
        },
        {
          title: this.$t('setting.ldap'),
          name: 'Ldap'
        },
        {
          title: this.$t('setting.message'),
          name: 'Message'
        },
        {
          title: this.$t('setting.theme'),
          name: 'Theme'
        }
      ]
    }
  },
  methods: {
    initial() {
      const params = this.$route.params
      switch (params.activeMenu) {
        case 'NTP':
          this.activeMenu = 'NTP'
          break
        case 'Registry':
          this.activeMenu = 'Registry'
          break
        case 'Credential':
          this.activeMenu = 'Credential'
          break
        case 'Email':
          this.activeMenu = 'Email'
          break
        case 'License':
          this.activeMenu = 'License'
          break
        case 'Ldap':
          this.activeMenu = 'Ldap'
          break
        case 'Message':
          this.activeMenu = 'Message'
          break
        case 'Theme':
          this.activeMenu = 'Theme'
          break
      }
    }
  },
  computed: {
    title() {
      return this.$t('settings.setting')
    },
    componentData() {
      return {}
    }
  }
}
</script>

<style scoped>
  .page-submenu >>> .el-tabs__header {
    background-color: white;
    margin-left: -25px;
    padding-left: 25px;
    /*margin-right: -25px;*/
    /*padding-right: 25px;*/
    margin-top: -5px;
  }
</style>
