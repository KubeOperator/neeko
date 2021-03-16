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
  children: []
}
export default Host
