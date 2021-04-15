import {get, patch} from "@/plugins/request"

const baseUrl = '/manifests';

export function manifestGroup() {
  return get("manifests/group")
}

export function changeStatus(versionName, version) {
  return patch(`manifests/${versionName}`, version)
}

export function listActive() {
  return get(baseUrl + '/active');
}