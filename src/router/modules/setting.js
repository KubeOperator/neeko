import Layout from "@/business/app-layout/horizontal-layout";

const SystemSetting = {
  sort: 5,
  path: '/setting',
  component: Layout,
  name: 'Setting',
  meta: {
    title: "route.system_setting",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [
    {
      path: 'registry',
      component: () => import('@/business/system-setting/registry/index'),
      name: "Registry",
      meta: {
        title: "route.system_setting",
        roles: ['admin']
      }
    }
  ]
}
export default SystemSetting
