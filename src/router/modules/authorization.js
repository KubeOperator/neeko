import Layout from "@/business/app-layout/horizontal-layout"
import AuthorizationComponent from "@/business/authorization"


const Authorization = {
  sort: 7,
  path: "/authorization",
  component: Layout,
  name: "Authorization",
  children: [
    {
      path: "list",
      component: () => import("@/business/authorization"),
      name: "ProjectAuthorizationList",
      props: true,
      meta: {
        title: "route.project_management",
        icon: "iconfont iconproject",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      }
    },
    {
      path: "resource",
      component: AuthorizationComponent,
      name: "Resource",
      hidden: true,
      meta: {
        activeMenu: "/authorization/list",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      },
    },
    {
      path: "project/create",
      component: () => import("@/business/authorization/projects/create"),
      name: "ProjectCreate",
      hidden: true,
      meta: {
        activeMenu: "/authorization/list",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      }
    },
    {
      path: "project/edit/:name",
      props: true,
      component: () => import("@/business/authorization/projects/edit"),
      name: "ProjectEdit",
      hidden: true,
      meta: {
        activeMenu: "/authorization/list",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      }
    }
  ]
}

export default Authorization
