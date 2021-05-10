import {get, del, post, patch} from "@/plugins/request"

const ipPoolUrl = "/api/v1/ippools"

export function listIpPools (page, size) {
  return get(`${ipPoolUrl}?pageNum=${page}&pageSize=${size}`)
}

export function listAllIpPools () {
  return get(`${ipPoolUrl}`)
}

export function deleteIpPoolBy (name) {
  return del(`${ipPoolUrl}/${name}`)
}

export function createIpPool (data) {
  return post(ipPoolUrl, data)
}

export function searchIpPool (currentPage, pageSize, conditions) {
  return post(`${ipPoolUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)

}

export function listIps (ipPoolName, page, size) {
  return get(`ippools/${ipPoolName}/ips?pageNum=${page}&pageSize=${size}`)
}

export function deleteIpBy (ipPoolName, ip) {
  return del(`${ipPoolUrl}/${ipPoolName}/ips/${ip}`)
}

export function createIp (ipPoolName, data) {
  return post(`${ipPoolUrl}/${ipPoolName}/ips`, data)
}

export function syncIp (ipPoolName) {
  return patch(`${ipPoolUrl}/${ipPoolName}/ips/sync`)
}

export function searchIp (currentPage, pageSize, ipPoolName, conditions) {
  return post(`${ipPoolUrl}/${ipPoolName}/ips/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

export function updateIp (ipPoolName, name, data) {
  return patch(`${ipPoolUrl}/${ipPoolName}/ips/${name}`,data)
}
