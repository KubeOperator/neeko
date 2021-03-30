import {get} from "@/plugins/request"

const authorizationUrl = "/project/resources"

export function getResourceTree () {
  return get(`${authorizationUrl}/tree`)
}