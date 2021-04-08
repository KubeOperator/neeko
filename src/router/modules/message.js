import Layout from "@/business/app-layout/horizontal-layout"

const Message = {
  path: "/message",
  sort: 7,
  component: Layout,
  name: "message",
  props: true,
  meta: {
    title: "route.message",
    icon: "el-icon-message",
    roles: ["ADMIN", "projectManager"]
  },
  children: [
    {
      path: "/message",
      component: () => import("@/business/message/index"),
      name: "messages",
      meta: {
        title: "route.message",
        roles: ["ADMIN", "PROJECT_MANAGER"]
      },
      hidden: true,
      redirect: to => {
        return {
          name: 'MessagesCenter',
          params: to.params,
        }
      },
      children: [
        {
          path: "message-center",
          component: () => import("@/business/message/message-center"),
          name: "MessagesCenter",
          meta: {
            title: "route.message",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          }
        },
        {
          path: "receiver",
          component: () => import("@/business/message/receiver/index"),
          name: "Receivers",
          meta: {
            title: "route.message_receiver",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          }
        },
        {
          path: "subscribe",
          component: () => import("@/business/message/subscribe/index"),
          name: "Subscribes",
          meta: {
            title: "route.message_subscribe",
            roles: ["ADMIN", "PROJECT_MANAGER"]
          }
        }
      ]
    }
  ]
}
export default Message
