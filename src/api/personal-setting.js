import {post} from "@/plugins/request"

export function changePassword(data) {
  return post('users/change/password', data)
}
