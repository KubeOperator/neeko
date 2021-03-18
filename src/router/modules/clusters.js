import Layout from '@/business/app-layout/horizontal-layout'


const Cluster = {
  path: '/clusters',
  sort: 1,
  component: Layout,
  name: 'Clusters',
  children: [
    {
      path: '/clusters',
      component: () => import('@/business/clusters'),
      name: "ClusterList",
      meta: {
        title: "route.cluster",
        icon: 'el-icon-setting',
        roles: ['admin']
      },
    },
  ]
}
export default Cluster
