import {get, patch} from "@/plugins/request"

const baseUrl = "/api/v1/manifests";

export function manifestGroup() {
  return get(`${baseUrl}/group`)
}

export function listActive() {
  return get(`${baseUrl}/active`);
}

export function changeStatus(versionName, manifest) {
  return patch(`${baseUrl}/${versionName}`, manifest)
}
