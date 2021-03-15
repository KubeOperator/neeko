import {get} from "@/plugins/request";

export function listUsers(page, size) {
  return get(`/samples/user-management/list/${page}/${size}`)
}
