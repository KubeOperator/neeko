import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/credentials"

// Registry
export function listCredentials(currentPage, pageSize) {
  return get(`${settingUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function listCredentialAll() {
  return get(`${settingUrl}`)
}

export function createCredentials(data) {
  return post(settingUrl,data)
}

export function updateCredentials(name, data) {
  return patch(`${settingUrl}/${name}`,data)
}

export function deleteCredentials(name) {
  return del(`${settingUrl}/${name}`)
}
