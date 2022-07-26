import {get, post} from "@/plugins/request"

export function listUserMessages (currentPage, pageSize) {
  return get(`/api/v1/user/messages?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function readUserMessage (id) {
  return post(`/api/v1/user/messages/read/${id}`, {})
}

export function markAllRead() {
  return post(`/api/v1/user/messages/read/all`, {})
}
