import Layout from "@/business/app-layout/horizontal-layout"

const Users = {
  sort: 7,
  path: "/users",
  component: Layout,
  name: "User",
  meta: {
    roles: ["ADMIN"]
  },
  children: [
    {
      path: "list",
      component: () => import("@/business/users"),
      name: "UserList",
      meta: {
        title: "route.user",
        icon: "el-icon-user",
        roles: ["ADMIN"]
      }
    },
    {
      path: "create",
      hidden: true,
      name: "UserCreate",
      component: () => import("@/business/users/create"),
      meta: {
        activeMenu: "/users/list",
        roles: ["ADMIN"]
      },
    }, {
      props: true,
      path: "edit/:name",
      hidden: true,
      name: "UserEdit",
      component: () => import("@/business/users/edit"),
      meta: {
        activeMenu: "/users/list",
        roles: ["ADMIN"]
      },
    }
  ]
}
export default Users
