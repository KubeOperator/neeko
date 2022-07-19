import Layout from "@/business/app-layout/horizontal-layout"

const XPack = {
  path: "/xpack",
  sort: 9,
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
