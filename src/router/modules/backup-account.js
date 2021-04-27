import Layout from "@/business/app-layout/horizontal-layout"

const BackupAccount = {
  sort: 5,
  path: "/backup_account",
  component: Layout,
  name: "BackupAccount",
  props: true,
  meta: {
    title: "route.backup_account",
    icon: "iconfont iconbackup",
    roles: ["ADMIN","PROJECT_MANAGER"]
  },
  redirect: to => {
    return {
      name: 'BackupAccountList',
      params: to.params,
    }
  },
  children: [
    {
      path: "/backup_account",
      component: () => import("@/business/backup-account/index"),
      name: "BackupAccountList",
      props: true,
      hidden: true,
      meta: {
        activeMenu: "/backup_account",
        title: "route.backup_account",
        roles: ["ADMIN","PROJECT_MANAGER"]
      }
    },
    {
      path: "create",
      component: () => import("@/business/backup-account/create"),
      name: "BackupAccountCreate",
      hidden: true,
      props: true,
      meta: {
        activeMenu: "/backup_account",
        title: "route.backup_account",
        roles: ["ADMIN","PROJECT_MANAGER"]
      }
    },
    {
      path: "edit",
      component: () => import("@/business/backup-account/edit"),
      name: "BackupAccountEdit",
      props: true,
      hidden: true,
      meta: {
        activeMenu: "/backup_account",
        title: "route.backup_account",
        roles: ["ADMIN","PROJECT_MANAGER"]
      }
    }
  ]
}

export default BackupAccount
