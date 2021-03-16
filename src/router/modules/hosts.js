import Layout from "@/business/app-layout/horizontal-layout";

const Host = {
  path: '/hosts',
  component: Layout,
  name: 'Host',
  meta: {
    title: "route.host",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: []
}
export default Host
