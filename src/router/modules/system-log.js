import Layout from "@/business/app-layout/horizontal-layout";

const SystemLog = {
  sort: 9,
  path: '/system-log',
  component: Layout,
  name: 'SystemLog',
  meta: {
    title: "route.system_log",
    icon: 'el-icon-notebook-2',
    roles: ['ADMIN', "PROJECT_MANAGER","CLUSTER_MANAGER"]
  },
  children: [
    {
      path: 'logs',
      component: () => import('@/business/system-log/index'),
      name: "Logs",
      meta: {
        title: "route.system_log",
        roles: ['ADMIN', "PROJECT_MANAGER","CLUSTER_MANAGER"]
      }
    }
  ]
}
export default SystemLog
