import {get, patch, post, del} from "@/plugins/request"

const userUrl = "/api/v1/users"


export function updateUser(name, data) {
  return patch(`${userUrl}/${name}`, data)
}

export function listUsers(currentPage, pageSize) {
  return get(`${userUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createUser(data) {
  return post(userUrl, data)
}

export function searchUsers(currentPage, pageSize, conditions) {
  return post(`${userUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

export function getUser(name) {
  return get(`${userUrl}/${name}`)
}

export function deleteUser(name) {
  return del(`${userUrl}/${name}`)
}
