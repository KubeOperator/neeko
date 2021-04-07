import Layout from "@/business/app-layout/horizontal-layout"


const Cluster = {
  path: "/clusters",
  sort: 1,
  component: Layout,
  name: "Clusters",
  children: [
    {
      path: "/clusters",
      component: () => import("@/business/clusters"),
      name: "ClusterList",
      meta: {
        title: "route.cluster",
        icon: "el-icon-film",
        roles: ["admin"]
      },
    },
    {
      path: "create",
      hidden: true,
      component: () => import("@/business/clusters/create"),
      name: "ClusterCreate",
      meta: {
        activeMenu: "/cluster/create",
        roles: ["admin"]
      },
    },
    {
      path: "detail/:name",
      props: true,
      hidden: true,
      component: () => import("@/business/clusters/detail/index"),
      name: "ClusterDetail",
      meta: {
        activeMenu: "/clusters",
        roles: ["admin"]
      },
      children: [
        {
          path: "overview",
          name: "ClusterOverview",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/overview"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "node",
          name: "ClusterNode",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/node"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "namespace",
          name: "ClusterNamespace",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/namespace"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "tool",
          name: "ClusterTool",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/tool"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "monitor",
          name: "ClusterMonitor",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/monitor"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "backup",
          name: "ClusterBackup",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/backup"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "f5",
          name: "ClusterF5",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/f5"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "security",
          name: "ClusterSecurity",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/security"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "logging",
          name: "ClusterLogging",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/log/logging"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "loki",
          name: "ClusterLoki",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/log/loki"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "istio",
          name: "ClusterIstio",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/istio"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "event",
          name: "ClusterEvent",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/event"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "storage",
          name: "ClusterStorage",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/storage"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "storage-provisioner-create",
          name: "ClusterStorageProvionerCreate",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/storage/provisioner-create"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "storage-class-create",
          name: "ClusterStorageClassCreate",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/storage/class-create"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        },
        {
          path: "grade",
          name: "ClusterGrade",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/grade"),
          meta: {
            activeMenu: "/clusters",
            roles: ["admin"]
          }
        }
      ]
    }
  ]
}
export default Cluster
