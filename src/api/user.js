import {get, patch, post} from "@/plugins/request"

const userUrl = "/users"


export function update(name, data) {
  return patch(`${userUrl}/${name}`, data)
}

export function listUsers() {
  return get(userUrl)
}

export function createUser(data) {
  return post(userUrl, data)
}
