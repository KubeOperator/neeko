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
        icon: "iconfont iconcluster",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
    },
    {
      path: "create",
      hidden: true,
      component: () => import("@/business/clusters/create"),
      name: "ClusterCreate",
      meta: {
        activeMenu: "/clusters",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
    },
    {
      path: "upgrade/:name",
      hidden: true,
      component: () => import("@/business/clusters/upgrade"),
      name: "ClusterUpgrade",
      meta: {
        activeMenu: "/clusters",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
    },
    {
      path: "import",
      hidden: true,
      component: () => import("@/business/clusters/import"),
      name: "ClusterImport",
      meta: {
        activeMenu: "/clusters",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
    },
    {
      path: "detail/:project/:name",
      props: true,
      hidden: true,
      component: () => import("@/business/clusters/detail/index"),
      name: "ClusterDetail",
      meta: {
        activeMenu: "/clusters",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "pv-create",
          name: "ClusterStoragePvCreate",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/storage/pv-create"),
          meta: {
            activeMenu: "/clusters",
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
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
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        }
      ]
    }
  ]
}
export default Cluster
