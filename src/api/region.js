import { get, del } from "@/plugins/request"

const regionUrl = "/regions"

export function listRegions() {
  return get(regionUrl)
}

export function deleteRegionBy(name) {
  return del(regionUrl + "/" + name)
}
