import {get, del, post} from "@/plugins/request"

const ipPoolUrl = "/ippools"

export function listIpPools (page, size) {
  return get(`ippools?pageNum=${page}&pageSize=${size}`)
}

export function deleteIpPoolBy (name) {
  return del(ipPoolUrl + "/" + name)
}

export function createIpPool (data) {
  return post(ipPoolUrl, data)
}
