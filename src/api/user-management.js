import {get} from "@/plugins/request";

export function listUsers(page, size) {
  return get(`/api/v1/samples/user-management/list/${page}/${size}`)
}
