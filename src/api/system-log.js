import {post} from "@/plugins/request"

export function systemQuery(page, size, conditions) {
  return post(`logs?pageNum=${page}&pageSize=${size}`, conditions)
}