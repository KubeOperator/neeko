import Layout from "@/business/app-layout/horizontal-layout"

const XPack = {
  path: "/xpack",
  sort: 7,
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
      component: () => import("@/business/message"),
      name: "MessageCenter",
      meta: {
        title: "route.message"
      }
    },
  ]
}
export default XPack
