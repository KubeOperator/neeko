import { get, del } from "@/plugins/request"

const regionUrl = "/regions"

export function listRegions(page, size) {
  return get(`regions?pageNum=${page}&pageSize=${size}`)
}

export function deleteRegionBy(name) {
  return del(regionUrl + "/" + name)
}
