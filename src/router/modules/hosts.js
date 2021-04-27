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
        icon: 'iconfont iconhost',
        roles: ['ADMIN', "PROJECT_MANAGER"]
      },
    },
    {
      path: "create",
      hidden: true,
      name: "HostCreate",
      component: () => import('@/business/hosts/create'),
      meta: {
        activeMenu: "/hosts/list",
        roles: ['ADMIN']
      },
    }
  ]
}
export default Host
