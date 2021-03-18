import Layout from "@/business/app-layout/horizontal-layout";

const SystemLog = {
  path: '/manifest',
  component: Layout,
  name: 'Manifest',
  meta: {
    title: "route.manifest",
    icon: 'el-icon-notebook-2',
    roles: ['admin']
  },
  children: [
    {
      path: 'manifests',
      component: () => import('@/business/manifest/index'),
      name: "Manifests",
      meta: {
        title: "route.manifest",
        roles: ['admin']
      }
    }
  ]
}
export default SystemLog
