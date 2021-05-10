import {get, post} from "@/plugins/request"

const licenseUrl = "/api/v1/license"

export function getLicense() {
  return get(`${licenseUrl}`)
}

export function importLicense(data) {
  return post(licenseUrl,data)
}
