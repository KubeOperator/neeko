import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/api/v1/settings"
const messageUrl = "/api/v1/message/setting"

// Settings
export function getSetting(tabName) {
  return get(`${settingUrl}/${tabName}`)
}
export function check(tabName,data){
  return post(`${settingUrl}/check/${tabName}`,data)
}

export function createSetting(data) {
  return post(settingUrl,data)
}

// Registry
export function listRegistry(currentPage, pageSize) {
  return get(`${settingUrl}/registry?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function listRegistryAll() {
  return get(`${settingUrl}/registry`)
}

export function createRegistry(data) {
  return post(`${settingUrl}/registry`,data)
}

export function updateRegistry(arch, data) {
  return patch(`${settingUrl}/registry/${arch}`,data)
}

export function searchRegistry(currentPage, pageSize, conditions) {
  return post(`${settingUrl}/registry/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

export function getRegistry(id) {
  return get(`${settingUrl}/registry/${id}`)
}

export function deleteRegistry(id) {
  return del(`${settingUrl}/registry/${id}`)
}

// Message
export function getMessageSetting(tabName) {
  return get(`${messageUrl}/${tabName}`)
}
export function checkMessage(tabName,data){
  return post(`${messageUrl}/check/${tabName}`,data)
}

export function createMessageSetting(tabName,data) {
  return post(`${messageUrl}/${tabName}`,data)
}

// LDAP
export function syncLDAP(data){
  return post(`/api/v1/ldap/sync`,data)
}

export function createLDAP(data) {
  return post(`/api/v1/ldap/`,data)
}
