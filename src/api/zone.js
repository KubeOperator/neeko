import { get, del } from "@/plugins/request"

const zoneUrl = "/zones"

export function listZones(page, size) {
  return get(`zones?pageNum=${page}&pageSize=${size}`)
}

export function deleteZoneBy(name) {
  return del(zoneUrl + "/" + name)
}
