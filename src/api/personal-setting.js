import {post} from "@/plugins/request"

export function changePassword(data) {
  return post('/api/v1/users/change/password', data)
}
