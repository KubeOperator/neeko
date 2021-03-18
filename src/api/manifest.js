import {get, patch} from "@/plugins/request"

export function manifestGroup() {
  return get("manifests/group")
}

export function changeStatus(versionName, version) {
  return patch(`manifests/${versionName}`, version)
}