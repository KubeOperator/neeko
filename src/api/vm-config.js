import {get, del, post, patch} from "@/plugins/request"

const vmConfigUrl = "/vmconfigs"

export function listVmConfigs (page, size) {
  return get(`vmconfigs?pageNum=${page}&pageSize=${size}`)
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