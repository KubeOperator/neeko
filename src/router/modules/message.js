import Layout from "@/business/app-layout/horizontal-layout";

const Message = {
  path: '/message',
  component: Layout,
  name: 'message',
  meta: {
    title: "route.message",
    icon: 'el-icon-message',
    roles: ['admin']
  },
  children: [
    {
      path: 'messages',
      component: () => import('@/business/message/index'),
      name: "Messages",
      meta: {
        title: "route.message",
        roles: ['admin']
      }
    },
    {
      path: 'receiver',
      component: () => import('@/business/message/receiver/index'),
      name: "Receivers",
      meta: {
        title: "route.message_receiver",
        roles: ['admin']
      }
    },
    {
      path: 'subscribe',
      component: () => import('@/business/message/subscribe/index'),
      name: "Subscribes",
      meta: {
        title: "route.message_subscribe",
        roles: ['admin']
      }
    }
  ]
}
export default Message
