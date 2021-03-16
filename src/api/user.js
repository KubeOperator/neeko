import {patch} from "@/plugins/request"

const userUrl = "/users"


export function update(name, data) {
  return patch(`${userUrl}/${name}`, data)
}



