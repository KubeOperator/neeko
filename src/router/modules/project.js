import Layout from "@/business/app-layout/horizontal-layout";

const Host = {
  path: '/projects',
  component: Layout,
  name: 'Project',
  meta: {
    title: "route.project",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [
    {
      path: 'projects',
      component: () => ('@/business/clusters'),
      name: "ProjectList",
      meta: {
        title: "项目管理"
      }
    },
    {
      path: 'members',
      component: () => ('@/business/clusters'),
      name: "MemberList",
      meta: {
        title: "成员管理"
      }
    }
  ]
}
export default Host
