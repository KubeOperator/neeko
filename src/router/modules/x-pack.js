import Layout from "@/business/app-layout/horizontal-layout"

const XPack = {
  path: "/xpack",
  sort: 8,
  name: "XPack",
  component: Layout,
  meta: {
    title: "X-Pack",
    icon: "el-icon-message",
  },
  children: [
    {
      path: "multi-cluster",
      component: () => import("@/business/xpack"),
      name: "MultiCluster",
      meta: {
        title: "route.multi_cluster",
        roles: ["admin"]
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
          },
        },
        {
          path: "create",
          hidden: true,
          component: () => import("@/business/xpack/multi-cluster/create"),
          name: "MultiClusterRepositoryCreate",
          meta: {
            activeMenu: "/xpack/multi-cluster",
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
          }
        },
      ],
    },
    {
      path: "message-center",
      component: () => import("@/business/message-center/index"),
      name: "message-center",
      meta: {
        title: "route.message_center",
        roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
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
          component: () => import("@/business/message-center/message"),
          name: "Messages",
          hidden: true,
          meta: {
            title: "message.message",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "receiver",
          component: () => import("@/business/message-center/receiver/index"),
          name: "MessageReceiver",
          hidden: true,
          meta: {
            title: "message.message_receiver",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "subscribe",
          hidden: true,
          component: () => import("@/business/message-center/subscribe/index"),
          name: "MessageSubscribes",
          meta: {
            title: "message.message_subscribe",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        }
      ]
    }
  ]
}
export default XPack
