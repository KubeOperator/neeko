import {get, post} from "@/plugins/request"

const istioUrl = "/api/v1/clusters/istio/{operation}/{cluster_name}"

export function listIstio(clusterName) {
  return get(istioUrl.replace("/{operation}", "").replace("{cluster_name}", clusterName))
}

export function enableIstio(clusterName, data) {
  return post(istioUrl.replace("{operation}", "enable").replace("{cluster_name}", clusterName), data)
}

export function disableIstio(clusterName, data) {
  return post(istioUrl.replace("{operation}", "disable").replace("{cluster_name}", clusterName), data)
}
