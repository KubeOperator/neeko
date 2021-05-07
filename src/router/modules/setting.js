import Layout from "@/business/app-layout/horizontal-layout";

const SystemSetting = {
  path: '/setting',
  component: Layout,
  name: 'systemSetting',
  props: true,
  meta: {
    title: "route.system_setting",
    icon: 'el-icon-setting',
    roles: ["ADMIN"]
  },
  children: [
    {
      path: '/setting',
      name: "SystemSetting",
      component: () => import('@/business/system-setting/index'),
      meta: {
        activeMenu: "/setting",
        roles: ['ADMIN']
      },
      hidden: true,
      props: true,
      redirect: to => {
        return {
          name: 'Registry',
          params: to.params,
        }
      },
      children: [
        {
          path: "registry",
          name: "Registry",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/registry'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN'],
          },
        },
        {
          path: "ntp",
          name: "NTP",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/ntp'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN']
          }
        },
        {
          path: "credential",
          name: "Credential",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/credential'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN']
          }
        },
        {
          path: "email",
          name: "EMail",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/email'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN']
          }
        },
        {
          path: "license",
          name: "License",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/license'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN']
          }
        },
        {
          path: "message",
          name: "Message",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/message'),
          meta: {
            activeMenu: "/setting",
            roles: ['ADMIN']
          }
        }
      ],
    },
    {
      name: "RegistryCreate",
      path: "registry/create",
      hidden: true,
      component: () => import('@/business/system-setting/registry/create'),
      meta: {
        activeMenu: "/setting",
        roles: ['ADMIN']
      },
    },{
      name: "RegistryEdit",
      path: "registry/edit/:arch",
      props: true,
      hidden: true,
      component: () => import('@/business/system-setting/registry/edit'),
      meta: {
        activeMenu: "/setting",
        roles: ['ADMIN']
      }
    },{
      name: "CredentialCreate",
      path: "credential/create",
      props: true,
      hidden: true,
      component: () => import('@/business/system-setting/credential/create'),
      meta: {
        activeMenu: "/setting",
        roles: ['ADMIN']
      },
    },{
      name: "CredentialEdit",
      path: "credential/edit",
      props: true,
      hidden: true,
      component: () => import('@/business/system-setting/credential/edit'),
      meta: {
        activeMenu: "/setting",
        roles: ['ADMIN']
      }
    },
  ]
}
export default SystemSetting
