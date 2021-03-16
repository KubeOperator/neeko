import {get, post} from "@/plugins/request"

const hostUrl = "/hosts"

export function createHost(data) {
  return post(hostUrl, data)
}

export function listHosts(currentPage, pageSize) {
  return get(`${hostUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

// export function isLogin() {
//   return get(`${authUrl}/status`)
// }
//
//
// export function getSession() {
//   return get(authUrl)
// }
