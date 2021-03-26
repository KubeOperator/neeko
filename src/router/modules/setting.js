import Layout from "@/business/app-layout/horizontal-layout";

const SystemSetting = {
  path: '/setting',
  component: Layout,
  name: 'SystemSetting',
  props: true,
  meta: {
    title: "route.system_setting",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [
    {
      path: '/setting',
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
            roles: ['admin'],
            requireLicense: true,
          },
        },
        {
          name: "RegistryCreate",
          path: "registry/create",
          hidden: true,
          component: () => import('@/business/system-setting/registry/create'),
          meta: {
            // activeMenu: "/setting",
            roles: ['admin']
          },
        },{
          name: "RegistryEdit",
          path: "registry/edit/:arch",
          props: true,
          hidden: true,
          component: () => import('@/business/system-setting/registry/edit'),
          meta: {
            // activeMenu: "/setting",
            roles: ['admin']
          }
          // children: [
          //   {
          //     name: "RegistryList",
          //     path: "list",
          //     // hidden: true,
          //     component: () => import('@/business/system-setting/registry'),
          //     meta: {
          //       activeMenu: "/setting",
          //       roles: ['admin']
          //     },
          //   },
          //   {
          //     name: "RegistryCreate",
          //     path: "create",
          //     hidden: true,
          //     component: () => import('@/business/system-setting/registry/create'),
          //     meta: {
          //       activeMenu: "/setting",
          //       roles: ['admin']
          //     },
          //   },{
          //     name: "RegistryEdit",
          //     path: "edit/:arch",
          //     props: true,
          //     hidden: true,
          //     component: () => import('@/business/system-setting/registry/edit'),
          //     meta: {
          //       activeMenu: "/setting",
          //       roles: ['admin']
          //     }
          //   },
          // ]
        },
        {
          path: "ntp",
          name: "NTP",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/ntp'),
          meta: {
            activeMenu: "/setting",
            roles: ['admin']
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
            roles: ['admin']
          }
        },
        {
          path: "email",
          name: "Email",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/email'),
          meta: {
            activeMenu: "/setting",
            roles: ['admin']
          }
        },
        {
          path: "ldap",
          name: "Ldap",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/ldap'),
          meta: {
            activeMenu: "/setting",
            roles: ['admin']
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
            roles: ['admin']
          }
        },
        {
          path: "theme",
          name: "Theme",
          hidden: true,
          props: true,
          component: () => import('@/business/system-setting/theme'),
          meta: {
            activeMenu: "/setting",
            roles: ['admin']
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
            roles: ['admin']
          }
        }
      ],
      name: "SystemSetting",
      component: () => import('@/business/system-setting/index'),
      meta: {
        activeMenu: "/setting",
        roles: ['admin']
      },
    }
  ]
}
export default SystemSetting
