import {post, get} from "@/plugins/request"

const licenseUrl = "/license"

export function saveLicense(data) {
  return post(licenseUrl, data)
}


export function getLicense() {
  return get(licenseUrl)
}
