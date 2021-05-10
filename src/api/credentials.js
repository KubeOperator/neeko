import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/api/v1/credentials"

// Registry
export function listCredentials(currentPage, pageSize) {
  return get(`${settingUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function listCredentialAll() {
  return get(`${settingUrl}`)
}

export function searchCredential(currentPage, pageSize, conditions) {
  return post(`${settingUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
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

export function listAllCredentials() {
  return get(`${settingUrl}`)
}
