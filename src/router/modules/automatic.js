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
    },
    {
      path: "plans",
      component: () => import("@/business/automatic/plans"),
      name: "PlanList",
      meta: {
        title: "automatic.plan.name"
      }
    },
    {
      path: "vmconfigs",
      component: () => import("@/business/automatic/vm-configs"),
      name: "VmConfigList",
      meta: {
        title: "automatic.vm_config.name"
      }
    },
    {
      path: "vmconfigs/create",
      component: () => import("@/business/automatic/vm-configs/create"),
      name: "VmConfigCreate",
      hidden: true,
      meta: {
        activeMenu: "/automatic/vmconfigs"
      }
    },
    {
      path: "ippools",
      component: () => import("@/business/automatic/ip-pools"),
      name: "IpPoolList",
      meta: {
        title: "automatic.ip_pool.name"
      }
    },
    {
      path: "ippools/create",
      hidden: true,
      component: () => import("@/business/automatic/ip-pools/create"),
      name: "IpPoolCreate",
      meta: {
        activeMenu: "/automatic/ippools"
      }
    },
    {
      path: "ippools/:name/ips",
      hidden: true,
      component: () => import("@/business/automatic/ip-pools/ips"),
      name: "IpList",
      meta: {
        activeMenu: "/automatic/ippools"
      }
    }
  ]
}

export default Automatic
