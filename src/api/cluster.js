import {get, post, del} from "@/plugins/request"

const clusterLoggerUrl = "/clusters/logger/{cluster_name}"
const clusterNodeLoggerUrl = "/clusters/node/logger/{cluster_name}/{node_name}"
const storageProvisionerLoggerUrl = "/clusters/provisioner/log/{cluster_name}/{log_id}"

export function getClusterByName(clusterName) {
  return get(`/clusters/${clusterName}`)
}

export function checkClusterNameExistence(clusterName) {
  return get(`/clusters/existence/${clusterName}`)
}

export function listClusters(page, size) {
  return get(`/clusters/?pageNum=${page}&pageSize=${size}`)
}

export function createCluster(data) {
  return post("/clusters", data)
}

export function healthCheck(clusterName) {
  return get(`/clusters/health/${clusterName}`)
}

export function clusterRecover(clusterName) {
  return post(`/clusters/recover/${clusterName}`, {})
}

export function deleteCluster(clusterName, force) {
  return del(`/clusters/${clusterName}?force=${force}`)
}

export function importCluster(data) {
  return post(`/clusters/import/`, data)
}

export function allClusters() {
  return get(`/clusters`)
}

export function initCluster(clusterName) {
  return post(`/clusters/init/${clusterName}/`, {})
}

export function upgradeCluster(clusterName, version) {
  let req = {
    clusterName: clusterName,
    version: version,
  }
  return post(`/clusters/upgrade/`, req)
}

export function getClusterStatus(clusterName) {
  return get(`/clusters/status/${clusterName}`)
}

export function getToken(clusterName) {
  return get(`clusters/webkubectl/${clusterName}?l=zh-CN`)
}

export function getClusterLog(clusterName) {
  return get(clusterLoggerUrl.replace("{cluster_name}", clusterName))
}

export function getClusterNodeLog(clusterName, nodeName) {
  return get(clusterNodeLoggerUrl.replace("{cluster_name}", clusterName).replace("{node_name}", nodeName))
}

export function getProvisionerLog(clusterName, logId) {
  return get(storageProvisionerLoggerUrl.replace("{cluster_name}", clusterName).replace("{log_id}", logId))
}

export function openLogger(clusterName) {
  window.open(`/#/logger?clusterName=${clusterName}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}

export function openProvisionerLogger(clusterName, logId) {
  window.open(`/#/logger?clusterName=${clusterName}&logId=${logId}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
} 