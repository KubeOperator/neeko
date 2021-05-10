import {get, del, post, patch} from "@/plugins/request"

const vmConfigUrl = "/api/v1/vmconfigs"

export function listVmConfigs (page, size) {
  return get(`${vmConfigUrl}/search?pageNum=${page}&pageSize=${size}`)
}

export function deleteVmConfigBy (name) {
  return del(vmConfigUrl + "/" + name)
}

export function createVmConfig (data) {
  return post(vmConfigUrl, data)
}

export function getVmConfig (name) {
  return get(`${vmConfigUrl}/${name}`)
}


export function updateVmConfig (name, data) {
  return patch(`${vmConfigUrl}/${name}`, data)
}

export function searchVmConfigs (page, size, conditions) {
  return post(`${vmConfigUrl}/search?pageNum=${page}&pageSize=${size}`, conditions)
}
