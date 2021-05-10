import {get,post} from "@/plugins/request"

const userUrl = "/api/v1/theme"

export function getTheme() {
  return get(userUrl)
}

export function importTheme(data) {
  return post(userUrl,data)
}
