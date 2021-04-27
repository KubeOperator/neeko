import Layout from "@/business/app-layout/horizontal-layout"

const Manifest = {
  path: "/manifest",
  sort: 6,
  component: Layout,
  name: "Manifest",
  meta: {
    title: "route.manifest",
    icon: "iconfont iconmanifest",
    roles: ["ADMIN","PROJECT_MANAGER"]
  },
  children: [
    {
      path: "manifests",
      component: () => import("@/business/manifest/index"),
      name: "Manifests",
      meta: {
        title: "route.manifest",
        roles: ["ADMIN","PROJECT_MANAGER"]
      }
    }
  ]
}
export default Manifest
