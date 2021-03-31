import {get,post} from "@/plugins/request"

const userUrl = "/theme"

export function getTheme() {
  return get(userUrl)
}

export function importTheme(data) {
  return post(userUrl,data)
}
