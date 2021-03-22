import Layout from "@/business/app-layout/horizontal-layout";

const Setting = {
  sort: 5,
  path: '/setting',
  component: Layout,
  name: 'Setting',
  meta: {
    title: "route.setting",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [
    // {
    //   path: 'registry',
    //   component: () => import('@/business/registry/index'),
    //   name: "Registry",
    //   meta: {
    //     title: "route.registry",
    //     roles: ['admin']
    //   }
    // }
  ]
}
export default Setting
