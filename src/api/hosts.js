import {get, post, del} from "@/plugins/request"

const hostUrl = "/api/v1/hosts"

export function createHost(data) {
  return post(hostUrl, data)
}

export function deleteHost(name) {
  return del(`${hostUrl}/${name}`)
}

export function listHosts(currentPage, pageSize) {
  return get(`${hostUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function searchHosts(currentPage, pageSize,condition) {
  return post(`${hostUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`,condition)
}

export function syncHosts(hosts) {
  const itemUrl = `${hostUrl}/sync/`
  return post(itemUrl, hosts)
}

export function importHosts(file) {
  const itemUrl = `${hostUrl}/upload`
  return post(itemUrl, file)
}
