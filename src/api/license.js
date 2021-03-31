import {get, post} from "@/plugins/request"

const licenseUrl = "/license"

export function getLicense() {
  return get(`${licenseUrl}`)
}

export function importLicense(data) {
  return post(licenseUrl,data)
}
