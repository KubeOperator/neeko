import Layout from "@/business/app-layout/horizontal-layout"


const Cluster = {
  path: "/tasks",
  sort: 9,
  component: Layout,
  name: "Tasks",
  children: [
    {
      path: "/tasks",
      component: () => import("@/business/task-center/index.vue"),
      name: "TaskList",
      meta: {
        title: "route.task",
        icon: "iconfont iconcluster",
        roles: ["ADMIN","PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
    },
  ]
}
export default Cluster
