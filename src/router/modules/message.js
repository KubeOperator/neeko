import Layout from "@/business/app-layout/horizontal-layout"

const Message = {
  path: "/message-center",
  sort: 7,
  component: Layout,
  name: "MessageCenter",
  props: true,
  meta: {
    title: "route.message_center",
    icon: "el-icon-message",
    roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
  },
  children: [
    {
      path: "/message-center",
      component: () => import("@/business/message-center/index"),
      name: "message-center",
      meta: {
        title: "route.message_center",
        roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
      },
      hidden: true,
      redirect: to => {
        return {
          name: 'Messages',
          params: to.params,
        }
      },
      children: [
        {
          path: "message",
          component: () => import("@/business/message-center/message"),
          name: "Messages",
          meta: {
            title: "message.message",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "receiver",
          component: () => import("@/business/message-center/receiver/index"),
          name: "MessageReceiver",
          meta: {
            title: "message.message_receiver",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        },
        {
          path: "subscribe",
          component: () => import("@/business/message-center/subscribe/index"),
          name: "MessageSubscribes",
          meta: {
            title: "message.message_subscribe",
            roles: ["ADMIN", "PROJECT_MANAGER","CLUSTER_MANAGER"]
          }
        }
      ]
    }
  ]
}
export default Message
