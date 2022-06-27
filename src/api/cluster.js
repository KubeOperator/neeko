import {get, post, del} from "@/plugins/request"

const clusterUrl = "/api/v1/clusters"
const componentUrl = "/api/v1/components"

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

export function searchClusters(page, size, condition, isPolling) {
  return post(`${clusterUrl}/search?pageNum=${page}&pageSize=${size}&isPolling=${isPolling}`, condition)
}

export function createCluster(data) {
  return post(`${clusterUrl}`, data)
}

export function healthCheck(clusterName) {
  return get(`${clusterUrl}/health/${clusterName}`)
}

export function clusterRecover(clusterName, data) {
  return post(`${clusterUrl}/recover/${clusterName}`, data)
}

export function deleteCluster(clusterName, force, uninstall) {
  return del(`${clusterUrl}/${clusterName}?force=${force}&uninstall=${uninstall}`)
}

export function importCluster(data) {
  return post(`${clusterUrl}/import/`, data)
}

export function searchDeployments(data) {
  return post(`${clusterUrl}/provisioner/deployment/`, data)
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

export function getSecret(clusterName) {
  return get(`${clusterUrl}/secret/${clusterName}`)
}

export function getClusterInfo(data) {
  return post(clusterUrl + "/load", data)
}

export function handleGpu(clusterName, handle) {
  return post(`${clusterUrl}/gpu/${clusterName}/${handle}`)
}

export function getGpuStatu(clusterName) {
  return get(`${clusterUrl}/gpu/${clusterName}`)
}

export function getComponents(cluster) {
  return get(`${componentUrl}?cluster=${cluster}`)
}

export function syncComponents(data) {
  return post(`${componentUrl}/sync`, data)
}

export function createComponent(data) {
  return post(`${componentUrl}`, data)
}

export function deleteComponent(cluster, name) {
  return del(`${componentUrl}/${cluster}/${name}`)
}