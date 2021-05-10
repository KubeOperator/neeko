import {post} from "@/plugins/request"

export function systemQuery(page, size, conditions) {
  return post(`/api/v1/logs?pageNum=${page}&pageSize=${size}`, conditions)
}
