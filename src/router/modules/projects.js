import Layout from "@/business/app-layout/horizontal-layout";

const Projects = {
  sort: 0,
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
      name: "ProjectCreate",
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
      redirect: to => {
        return {
          name: 'ProjectMembersList',
          params: to.params,
        }
      },
      children: [
        {
          path: "members/list",
          name: "ProjectMembersList",
          hidden: true,
          props: true,
          component: () => import('@/business/projects/detail/members'),
          meta: {
            activeMenu: "/projects/list",
            roles: ['admin']
          },
        },
        {
          path: "members/create",
          name: "ProjectMemberCreate",
          hidden: true,
          props: true,
          component: () => import('@/business/projects/detail/members/create'),
          meta: {
            activeMenu: "/projects/list",
            roles: ['admin']
          },
        },
        {
          path: "resources/list",
          name: "ProjectResourcesList",
          props: true,
          hidden: true,
          component: () => import('@/business/projects/detail/resources'),
          meta: {
            activeMenu: "/projects/list",
            roles: ['admin']
          }
        }
      ],
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
