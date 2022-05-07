import {get, patch, post, del} from "@/plugins/request"

const settingUrl = "/api/v1/settings"
const ntpUrl = "/api/v1/ntp"
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

export function changePassword(data) {
  return post(`${settingUrl}/registry/change/password`,data)
}

export function testConnection(data) {
  return post(`${settingUrl}/registry/check/conn`, data)
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

// ntp
export function searchNtp(currentPage, pageSize) {
  return get(`${ntpUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function deleteNtp(name) {
  return del(`${ntpUrl}/${name}`)
}

export function createNtp(data) {
  return post(`${ntpUrl}`, data)
}

export function updateNtp(name, data) {
  return patch(`${ntpUrl}/${name}`, data)
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

// kubepi
export function bindUser(data) {
  return post(`/api/v1/dashboard/bind`,data)
}
export function getUser(data) {
  return get(`/api/v1/dashboard/user`,data)
}
export function getBindInfo(data) {
  return post(`/api/v1/dashboard/search`,data)
}
export function testKubepiConn(data) {
  return post(`/api/v1/dashboard/check/conn`,data)
}
export function jumpTo(name) {
  return get(`/api/v1/dashboard/jump/${name}`)
}