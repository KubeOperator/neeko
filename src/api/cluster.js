import {get, post, del} from "@/plugins/request"

const clusterUrl = "/api/v1/clusters"
const clusterLoggerUrl = "/api/v1/clusters/logger/{cluster_name}"
const clusterNodeLoggerUrl = "/api/v1/clusters/node/logger/{cluster_name}/{node_name}"
const storageProvisionerLoggerUrl = "/api/v1/clusters/provisioner/log/{cluster_name}/{log_id}"

export function getClusterByName(clusterName) {
  return get(`${clusterUrl}/${clusterName}`)
}

export function getClusterByProject(projectNames) {
  return get(`${clusterUrl}/name/${projectNames}`)
}

export function checkClusterNameExistence(clusterName) {
  return get(`${clusterUrl}/existence/${clusterName}`)
}

export function listClusters(page, size) {
  return get(`${clusterUrl}?pageNum=${page}&pageSize=${size}`)
}

export function searchClusters(page, size, condition) {
  return post(`${clusterUrl}/search?pageNum=${page}&pageSize=${size}`, condition)
}

export function createCluster(data) {
  return post(`${clusterUrl}`, data)
}

export function healthCheck(clusterName) {
  return get(`${clusterUrl}/health/${clusterName}`)
}

export function clusterRecover(clusterName) {
  return post(`${clusterUrl}/recover/${clusterName}`, {})
}

export function deleteCluster(clusterName, force) {
  return del(`${clusterUrl}/${clusterName}?force=${force}`)
}

export function importCluster(data) {
  return post(`${clusterUrl}/import/`, data)
}

export function allClusters() {
  return get(`${clusterUrl}`)
}

export function initCluster(clusterName) {
  return post(`${clusterUrl}/init/${clusterName}/`, {})
}

export function upgradeCluster(clusterName, version) {
  let req = {
    clusterName: clusterName,
    version: version,
  }
  return post(`${clusterUrl}/upgrade/`, req)
}

export function getClusterStatus(clusterName) {
  return get(`${clusterUrl}/status/${clusterName}`)
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
  window.open(`/ui/#/logger?clusterName=${clusterName}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}

export function openProvisionerLogger(clusterName, logId) {
  window.open(`/ui/#/logger?clusterName=${clusterName}&logId=${logId}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}

export function getSecret(clusterName) {
  return get(`${clusterUrl}/secret/${clusterName}`)
}
