import {get, post} from "@/plugins/request"

const provisionerUrl = "/api/v1/clusters/provisioner/{cluster_name}"

export function listProvisioner(clusterName) {
  return get(provisionerUrl.replace("{cluster_name}", clusterName))
}

export function createProvisioner(clusterName, item) {
  return post(provisionerUrl.replace("{cluster_name}", clusterName), item)
}

export function syncProvisioner(clusterName, hosts) {
  const syncUrl = "/api/v1/clusters/provisioner/sync/{cluster_name}"
  const url = syncUrl.replace("{cluster_name}", clusterName)
  return post(url, hosts)
}

export function deleteProvisioner(clusterName, item) {
  const deleteUrl = "/api/v1/clusters/provisioner/delete/{cluster_name}"
  const url = deleteUrl.replace("{cluster_name}", clusterName)
  return post(url, item)
}