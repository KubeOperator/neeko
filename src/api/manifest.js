import {get, patch} from "@/plugins/request"

export function manifestGroup() {
  return get("manifests/group")
}

export function changeStatus(versionName, manifest) {
  return patch(`manifests/${versionName}`, manifest)
}
