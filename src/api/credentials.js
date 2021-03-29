import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/credentials"

// Registry
export function listCredentials(currentPage, pageSize) {
  return get(`${settingUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createCredentials(data) {
  return post(settingUrl,data)
}

export function updateCredentials(name, data) {
  return patch(`${settingUrl}/${name}`,data)
}

export function deleteCredentials(currentPage, pageSize) {
  return del(`${settingUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

