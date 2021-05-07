import Layout from "@/business/app-layout/horizontal-layout"

const Automatic = {
  sort: 3,
  path: "/automatic",
  component: Layout,
  name: "Automatic",
  meta: {
    title: "automatic.name",
    icon: "iconfont iconautomatic",
    roles: ["ADMIN", "PROJECT_MANAGER"]
  },
  children: [
    {
      path: "regions",
      component: () => import("@/business/automatic/regions"),
      name: "RegionList",
      meta: {
        title: "automatic.region.name",
        roles: ["ADMIN"]
      }
    },
    {
      path: "regions/create",
      hidden: true,
      name: "RegionCreate",
      component: () => import("@/business/automatic/regions/create"),
      meta: {
        activeMenu: "/automatic/regions",
        roles: ["ADMIN"]
      }
    },
    {
      path: "regions/edit/:name",
      hidden: true,
      name: "RegionEdit",
      props: true,
      component: () => import("@/business/automatic/regions/edit"),
      meta: {
        activeMenu: "/automatic/regions",
        roles: ["ADMIN"]
      }
    },
    {
      path: "zones",
      component: () => import("@/business/automatic/zones"),
      name: "ZoneList",
      meta: {
        title: "automatic.zone.name",
        roles: ["ADMIN"]
      }
    },
    {
      path: "zones/create",
      hidden: true,
      component: () => import("@/business/automatic/zones/create"),
      name: "ZoneCreate",
      meta: {
        activeMenu: "/automatic/zones",
        roles: ["ADMIN"]
      }
    },
    {
      path: "zones/edit/:name",
      props: true,
      hidden: true,
      component: () => import("@/business/automatic/zones/edit"),
      name: "ZoneEdit",
      meta: {
        activeMenu: "/automatic/zones",
        roles: ["ADMIN"]
      }
    },
    {
      path: "plans",
      component: () => import("@/business/automatic/plans"),
      name: "PlanList",
      meta: {
        title: "automatic.plan.name",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      }
    },
    {
      path: "plans/create",
      hidden: true,
      component: () => import("@/business/automatic/plans/create"),
      name: "PlanCreate",
      meta: {
        activeMenu: "/automatic/plans",
        roles: ["ADMIN"]
      }
    },
    {
      path: "plans/edit/:name",
      props: true,
      hidden: true,
      component: () => import("@/business/automatic/plans/edit"),
      name: "PlanEdit",
      meta: {
        activeMenu: "/automatic/plans",
        roles: ["ADMIN"]
      }
    },
    {
      path: "vmconfigs",
      component: () => import("@/business/automatic/vm-configs"),
      name: "VmConfigList",
      meta: {
        title: "automatic.vm_config.name",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      }
    },
    {
      path: "vmconfigs/create",
      component: () => import("@/business/automatic/vm-configs/create"),
      name: "VmConfigCreate",
      hidden: true,
      meta: {
        activeMenu: "/automatic/vmconfigs",
        roles: ["ADMIN"]
      }
    },
    {
      path: "vmconfigs/edit/:name",
      props: true,
      component: () => import("@/business/automatic/vm-configs/edit"),
      name: "VmConfigEdit",
      hidden: true,
      meta: {
        activeMenu: "/automatic/vmconfigs",
        roles: ["ADMIN"]
      }
    },
    {
      path: "ippools",
      component: () => import("@/business/automatic/ip-pools"),
      name: "IpPoolList",
      meta: {
        title: "automatic.ip_pool.name",
        roles: ["ADMIN"]
      }
    },
    {
      path: "ippools/create",
      hidden: true,
      component: () => import("@/business/automatic/ip-pools/create"),
      name: "IpPoolCreate",
      meta: {
        activeMenu: "/automatic/ippools",
        roles: ["ADMIN"]
      }
    },
    {
      path: "ippools/:name/ips",
      props: true,
      hidden: true,
      component: () => import("@/business/automatic/ip-pools/ips"),
      name: "IpList",
      meta: {
        activeMenu: "/automatic/ippools",
        roles: ["ADMIN"]
      }
    },
    {
      path: "ippools/:name/ips/create",
      props: true,
      hidden: true,
      component: () => import("@/business/automatic/ip-pools/ips/create"),
      name: "IpCreate",
      meta: {
        activeMenu: "ippools/:name/ips",
        roles: ["ADMIN"]
      }
    }
  ]
}

export default Automatic
