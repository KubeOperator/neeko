import {get} from "@/plugins/request"

const clusterLoggerUrl = "/clusters/logger/{cluster_name}"
const clusterNodeLoggerUrl = "/clusters/node/logger/{cluster_name}/{node_name}"
const storageProvisionerLoggerUrl = "/clusters/provisioner/log/{cluster_name}/{log_id}"

export function getClusterByName(clusterName) {
  return get(`/clusters/${clusterName}`)
}

export function listClusters(page, size, projectName) {
  return get(`/clusters/?pageNum=${page}&pageSize=${size}&projectName=${projectName}`)
}

export function allClusters() {
  return get(`/clusters`)
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