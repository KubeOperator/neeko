import {get, post} from "@/plugins/request"

export function getMessagesByUser(page, size) {
  return get(`message/mail?pageNum=${page}&pageSize=${size}`)
}

export function getMessageReceicver() {
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
