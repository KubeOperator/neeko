import Layout from "@/business/app-layout/horizontal-layout";

const Users = {
  sort: 4,
  path: '/users',
  component: Layout,
  name: 'User',
  children: [
    {
      path: 'list',
      component: () => import('@/business/users'),
      name: "UserList",
      meta: {
        title: "route.user",
        icon: 'el-icon-user',
        roles: ['admin']
      }
    },
    {
      path: "create",
      hidden: true,
      name: "UserCreate",
      component: () => import('@/business/users/create'),
      meta: {
        activeMenu: "/users/list",
        roles: ['admin']
      },
    }
  ]
}
export default Users
