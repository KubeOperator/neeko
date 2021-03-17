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
    }
  ]
}
export default Projects
