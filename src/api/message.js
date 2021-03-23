import {get} from "@/plugins/request"

export function getMessagesByUser(page, size) {
  return get(`message/mail?pageNum=${page}&pageSize=${size}`)
}