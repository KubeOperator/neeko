import Layout from "@/business/app-layout/horizontal-layout";

const Cluster = {
  path: '/clusters',
  component: Layout,
  name: 'Clusters',
  meta: {
    title: "route.cluster",
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: []
}
export default Cluster
