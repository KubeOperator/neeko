import {get, post, del} from "@/plugins/request"

const hostUrl = "/hosts"

export function createHost(data) {
  return post(hostUrl, data)
}

export function deleteHost(name) {
  return del(`${hostUrl}/${name}`)
}

export function listHosts(currentPage, pageSize) {
  return get(`${hostUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function searchHosts(currentPage, pageSize, conditions) {
  return post(`${hostUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

// export function isLogin() {
//   return get(`${authUrl}/status`)
// }
//
//
// export function getSession() {
//   return get(authUrl)
// }
