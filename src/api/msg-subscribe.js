import {post} from "@/plugins/request"

const ipPoolUrl = "/api/v1/msg/subscribes"

export function searchMsgSubscribe (currentPage, pageSize, type, resourceName, conditions) {
  return post(`${ipPoolUrl}/search?type=${type}&resourceName=${resourceName}&pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

export function updateMsgSubScribe (data) {
  return post(`${ipPoolUrl}/update`, data)
}
