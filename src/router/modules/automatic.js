import Layout from "@/business/app-layout/horizontal-layout"

const Automatic = {
  sort: 3,
  path: "/automatic",
  component: Layout,
  name: "Automatic",
  meta: {
    title: "automatic.name",
    icon: "el-icon-date"
  },
  children: [
    {
      path: "regions",
      component: () => import("@/business/automatic/regions"),
      name: "RegionList",
      meta: {
        title: "automatic.region.name"
      }
    },
    {
      path: "regions/create",
      hidden: true,
      name: "RegionCreate",
      component: () => import("@/business/automatic/regions/create"),
      meta: {
        activeMenu: "/automatic/regions",
        roles: ["admin"]
      }
    },
    {
      path: "zones",
      component: () => import("@/business/automatic/zones"),
      name: "ZoneList",
      meta: {
        title: "automatic.zone.name"
      }
    }
  ]
}

export default Automatic
