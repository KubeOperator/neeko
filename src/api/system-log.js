import {post} from "@/plugins/request"

export function systemQuery(page, size, data) {
  return post(`logs?pageNum=${page}&pageSize=${size}`, JSON.stringify(data))
}