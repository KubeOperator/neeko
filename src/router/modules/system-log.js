import Layout from "@/business/app-layout/horizontal-layout";

const SystemLog = {
  sort: 5,
  path: '/system-log',
  component: Layout,
  name: 'SystemLog',
  meta: {
    title: "route.system_log",
    icon: 'el-icon-notebook-2',
    roles: ['admin']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/business/system-log/SystemLog'),
      name: "List",
      meta: {
        title: "route.system_log",
        roles: ['admin']
      }
    }
  ]
}
export default SystemLog
