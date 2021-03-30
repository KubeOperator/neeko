import Layout from "@/business/app-layout/horizontal-layout"
import AuthorizationComponent from "@/business/authorization"


const Authorization = {
  sort: 10,
  path: "/authorization",
  component: Layout,
  name: "Authorization",
  children: [
    {
      path: "list",
      component: () => import("@/business/authorization"),
      name: "ProjectAuthorizationList",
      meta: {
        cache: true,
        title: "route.project",
        icon: "el-icon-s-data"
      }
    },
    {
      path: "resource",
      component: AuthorizationComponent,
      name: "Resource",
      hidden: true,
      meta: {
        activeMenu: "/authorization/list"
      },
    },
  ]
}

export default Authorization
