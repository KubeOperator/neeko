import {del, get, post} from "@/plugins/request"

const messageUrl = "/api/v1/message"

export function getMessages(page, size) {
  return get(`${messageUrl}/mail?pageNum=${page}&pageSize=${size}`)
}

export function deleteMessagesBy(messageID) {
  return del(`${messageUrl}/${messageID}`)
}

export function getMessageReceiver() {
  return get(`${messageUrl}/receiver`)
}

export function getMessageOfSubscribe() {
  return get(`${messageUrl}/subscribe`)
}

export function updateMessageOfSubscribe(data) {
  return post(`${messageUrl}/subscribe`, data)
}

export function updateMessageReceicver(data) {
  return post(`${messageUrl}/receiver`, data)
}

export function updateMessageStatus(data) {
  return post(`${messageUrl}/mail/batch`, data)
}

export function searchMessages(currentPage, pageSize, conditions) {
  return post(`${messageUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}
