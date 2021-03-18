import Layout from "@/business/app-layout/horizontal-layout";

const Host = {
  sort: 2,
  path: '/hosts',
  component: Layout,
  name: 'Host',
  children: [
    {
      path: 'list',
      component: () => import('@/business/hosts'),
      name: "HostList",
      meta: {
        title: "route.host",
        icon: 'el-icon-setting',
        roles: ['admin']
      },
    },
    {
      path: "create",
      hidden: true,
      component: () => import('@/business/hosts/create'),
      meta: {
        activeMenu: "/hosts/list",
        roles: ['admin']
      },
    }
  ]
}
export default Host
