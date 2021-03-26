import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/settings"

export function listRegistry(currentPage, pageSize) {
  return get(`${settingUrl}/registry?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createRegistry(data) {
  return post(`${settingUrl}/registry`,data)
}

export function updateRegistry(currentPage, pageSize) {
  return patch(`${settingUrl}/registry?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function deleteRegistry(arch) {
  return del(`${settingUrl}/registry/${arch}`)
}
