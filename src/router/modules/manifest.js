import Layout from "@/business/app-layout/horizontal-layout"

const Manifest = {
  path: "/manifest",
  sort: 6,
  component: Layout,
  name: "Manifest",
  meta: {
    title: "route.manifest",
    icon: "el-icon-s-grid",
    roles: ["admin"]
  },
  children: [
    {
      path: "manifests",
      component: () => import("@/business/manifest/index"),
      name: "Manifests",
      meta: {
        title: "route.manifest",
        roles: ["admin"]
      }
    }
  ]
}
export default Manifest
