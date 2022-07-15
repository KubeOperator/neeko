import Layout from "@/business/app-layout/horizontal-layout"

const MsgSubscribe = {
  sort: 7,
  path: "/msg_subscribe",
  component: Layout,
  name: "MsgSubscribe",
  props: true,
  meta: {
    icon: "iconfont iconweidu1",
    roles: ["ADMIN", "PROJECT_MANAGER"]
  },
  children: [
    {
      path: "msgSubscribe",
      component: () => import("@/business/msg-subscribe/index"),
      name: "MsgSubscribeList",
      meta: {
        title: "message.message_subscribe",
        roles: ["ADMIN","PROJECT_MANAGER"]
      }
    },
  ]
}

export default MsgSubscribe


