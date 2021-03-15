import Layout from "@/business/app-layout/horizontal-layout";

const Directive = {
  path: '/directive',
  component: Layout,
  name: 'Directive',
  meta: {
    title: "指令",
    icon: 'el-icon-cpu',
  },
  children: [
    {
      path: 'click-outside',
      component: () => import('@/business/directive/ClickOutsideDemo'),
      name: "ClickOutside",
      meta: {
        title: "点击外部指令"
      }
    },
    {
      path: 'permission',
      component: () => import('@/business/directive/PermissionDemo'),
      name: "Permission",
      meta: {
        title: "权限指令"
      }
    }
  ]
}
export default Directive
