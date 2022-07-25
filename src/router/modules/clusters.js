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
          path: "component",
          name: "Component",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/component"),
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
          path: "log",
          name: "ClusterLogs",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/log"),
          meta: {
            activeMenu: "/clusters",
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "task",
          name: "ClusterTask",
          hidden: false,
          props: true,
          component: () => import("@/business/clusters/detail/task"),
          meta: {
            activeMenu: "/clusters",
            roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "task/:id",
          name: "ClusterTaskDetail",
          hidden: true,
          props: true,
          component: () => import("@/business/clusters/detail/task/detail"),
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
          path: "storage-provisioner-create/:operation",
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
