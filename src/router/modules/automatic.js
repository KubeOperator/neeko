import Layout from "@/business/app-layout/horizontal-layout";

const Automatic = {
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
            component: () => import('@/business/automatic/regions'),
            name: "RegionComponent",
            meta: {
                title: "automatic.name",
                icon: "el-icon-date"
            },
        }
    ]
}

export default Automatic