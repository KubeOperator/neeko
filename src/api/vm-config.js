import { get, del } from "@/plugins/request"

const vmConfigUrl = "/vmconfigs"

export function listVmConfigs(page, size) {
  return get(`vmconfigs?pageNum=${page}&pageSize=${size}`)
}

export function deleteVmConfigBy(name) {
  return del(vmConfigUrl + "/" + name)
}
