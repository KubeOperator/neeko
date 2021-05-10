import {get} from "@/plugins/request"

const authorizationUrl = "/api/v1/projects"

export function getResourceTree () {
  return get(`${authorizationUrl}/tree`)
}
