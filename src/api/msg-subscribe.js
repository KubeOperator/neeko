import {post, get} from "@/plugins/request"

const subscribeUrl = "/api/v1/msg/subscribes"

export function searchMsgSubscribe (currentPage, pageSize, type, resourceName, conditions) {
  return post(`${subscribeUrl}/search?type=${type}&resourceName=${resourceName}&pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}

export function updateMsgSubScribe (data) {
  return post(`${subscribeUrl}/update`, data)
}

export function addSubscribeUser (data) {
  return post(`${subscribeUrl}/user`, data)
}

export function deleteSubscribeUser (data) {
  return post(`${subscribeUrl}/delete/user`, data)
}

export function searchMsgSubscribeByName (type, resourceName, name) {
  return post(`${subscribeUrl}/search?type=${type}&resourceName=${resourceName}`, {
    quick: {
      field: "quick",
      value: name
    }
  })
}

export function getAddSubscribeUsers (search, subscribeId, resourceName) {
  return get(`${subscribeUrl}/users?user=${search}&subscribeId=${subscribeId}&resourceName=${resourceName}`)
}

export function getSubScribeUsers (currentPage, pageSize, subscribeId, conditions) {
  return post(`${subscribeUrl}/users?subscribeId=${subscribeId}&pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}
