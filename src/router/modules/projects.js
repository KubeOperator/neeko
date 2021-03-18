import Layout from "@/business/app-layout/horizontal-layout";

const Projects = {
  path: '/projects',
  component: Layout,
  name: 'Project',
  children: [
    {
      path: 'list',
      component: () => import('@/business/projects'),
      name: "ProjectList",
      meta: {
        title: "route.project",
        icon: 'el-icon-setting',
        roles: ['admin']
      }
    },
    {
      path: "create",
      hidden: true,
      component: () => import('@/business/projects/create'),
      meta: {
        activeMenu: "/projects/list",
        roles: ['admin']
      },
    }, {
      path: "edit/:name",
      hidden: true,
      props: true,
      name: "ProjectEdit",
      component: () => import('@/business/projects/edit'),
      meta: {
        activeMenu: "/projects/list",
        roles: ['admin']
      },
    }, {
      path: "detail/:name",
      props: true,
      hidden: true,
      name: "ProjectDetail",
      component: () => import('@/business/projects/detail'),
      meta: {
        activeMenu: "/projects/list",
        roles: ['admin']
      }
    }
  ]
}
export default Projects
