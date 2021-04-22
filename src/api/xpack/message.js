import {del, get, post} from "@/plugins/request"

export function getMessages(page, size) {
  return get(`message/mail?pageNum=${page}&pageSize=${size}`)
}

export function deleteMessagesBy(messageID) {
  return del(`message/${messageID}`)
}

export function getMessageReceiver() {
  return get("message/receiver")
}

export function getMessageOfSubscribe() {
  return get("message/subscribe")
}

export function updateMessageOfSubscribe(data) {
  return post("message/subscribe", data)
}

export function updateMessageReceicver(data) {
  return post("message/receiver", data)
}

export function updateMessageStatus(data) {
  return post("message/mail/batch", data)
}

export function searchMessages(currentPage, pageSize, conditions) {
  return post(`message/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}
