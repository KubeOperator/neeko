import {get, del, post} from "@/plugins/request"

const zoneUrl = "/zones"

export function listZones (page, size) {
  return get(`${zoneUrl}?pageNum=${page}&pageSize=${size}`)
}

export function deleteZoneBy (name) {
  return del(zoneUrl + "/" + name)
}

export function searchZone (page, size, condition) {
  return post(`${zoneUrl}/search?pageNum=${page}&pageSize=${size}`, condition)
}