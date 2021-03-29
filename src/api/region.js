import {get, del, post} from "@/plugins/request"

const regionUrl = "/regions"

export function listRegions (page, size) {
  return get(`${regionUrl}/search?pageNum=${page}&pageSize=${size}`)
}

export function deleteRegionBy (name) {
  return del(regionUrl + "/" + name)
}

export function searchRegion (page, size, condition) {
  return post(`${regionUrl}/search?pageNum=${page}&pageSize=${size}`, condition)
}
