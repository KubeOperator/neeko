import Layout from "@/business/app-layout/horizontal-layout"

const XPack = {
  path: "/xpack",
  sort: 8,
  name: "XPack",
  component: Layout,
  meta: {
    title: "X-Pack",
    icon: "iconfont iconx-pack",
    requireLicense: true
  },
  children: [
    {
      path: "multi-cluster",
      component: () => import("@/business/xpack"),
      name: "MultiCluster",
      meta: {
        title: "route.multi_cluster",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      },
      redirect: () => {
        return {
          name: 'MultiClusterRepositoriesList',
        }
      },
      children: [
        {
          path: "list",
          hidden: true,
          component: () => import("@/business/xpack/multi-cluster"),
          name: "MultiClusterRepositoriesList",
          meta: {
            title: "route.multi_cluster",
            activeMenu: "/xpack/multi-cluster",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          },
        },
        {
          path: "create",
          hidden: true,
          component: () => import("@/business/xpack/multi-cluster/create"),
          name: "MultiClusterRepositoryCreate",
          meta: {
            activeMenu: "/xpack/multi-cluster",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          },
        },
        {
          path: "edit/:name",
          props: true,
          hidden: true,
          component: () => import("@/business/xpack/multi-cluster/edit"),
          name: "MultiClusterRepositoryEdit",
          meta: {
            activeMenu: "/xpack/multi-cluster",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          }
        },
        {
          path: "log/:name",
          props: true,
          hidden: true,
          component: () => import("@/business/xpack/multi-cluster/log"),
          name: "MultiClusterRepositoryLog",
          meta: {
            activeMenu: "/xpack/multi-cluster",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          }
        },
      ],
    },
    {
      path: "message-center",
      component: () => import("@/business/xpack/message-center/index"),
      name: "message-center",
      meta: {
        activeMenu: "/xpack/message-center",
        title: "route.message_center",
        roles: ["ADMIN", "PROJECT_MANAGER", "CLUSTER_MANAGER"]
      },
      redirect: to => {
        return {
          name: 'Messages',
          params: to.params,
        }
      },
      children: [
        {
          path: "message",
          component: () => import("@/business/xpack/message-center/message"),
          name: "Messages",
          hidden: true,
          meta: {
            activeMenu: "/xpack/message-center",
            title: "message.message",
            roles: ["ADMIN", "PROJECT_MANAGER", "CLUSTER_MANAGER"]
          }
        },
        {
          path: "receiver",
          component: () => import("@/business/xpack/message-center/receiver/index"),
          name: "MessageReceiver",
          hidden: true,
          meta: {
            activeMenu: "/xpack/message-center",
            title: "message.message_receiver",
            roles: ["ADMIN", "PROJECT_MANAGER", "CLUSTER_MANAGER"]
          }
        },
        {
          path: "subscribe",
          hidden: true,
          component: () => import("@/business/xpack/message-center/subscribe/index"),
          name: "MessageSubscribes",
          meta: {
            activeMenu: "/xpack/message-center",
            title: "message.message_subscribe",
            roles: ["ADMIN", "PROJECT_MANAGER", "CLUSTER_MANAGER"]
          }
        }
      ]
    },
    {
      path: "ldap",
      name: "LDAP",
      props: true,
      component: () => import('@/business/xpack/ldap'),
      meta: {
        requireLicense: true,
        title: "route.ldap",
        activeMenu: "/xpack/ldap",
        roles: ['ADMIN']
      }
    },
    {
      path: "theme",
      name: "Theme",
      props: true,
      component: () => import('@/business/xpack/theme'),
      meta: {
        requireLicense: true,
        title: "route.theme",
        activeMenu: "/xpack/theme",
        roles: ['ADMIN']
      }
    },
  ]
}
export default XPack
