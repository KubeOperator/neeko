import Layout from "@/business/app-layout/horizontal-layout";

const ComponentsSetting = {
  path: '/components',
  component: Layout,
  name: 'Components',
  meta: {
    title: "route.components",
    icon: 'el-icon-s-grid',
    roles: ['admin']
  },
  children: [
    {
      path: 'complex-table',
      component: () => import('@/business/components/complex-table'),
      name: "ComplexTable",
      meta: {
        title: "route.complex_table",
      }
    },
  ]
}
export default ComponentsSetting
