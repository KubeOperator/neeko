import {get} from "@/plugins/request"

const authorizationUrl = "/projects"

export function getResourceTree () {
  return get(`${authorizationUrl}/tree`)
}