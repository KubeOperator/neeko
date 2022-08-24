import {get, post} from "@/plugins/request"
const kubernetesUrl = "/api/v1/kubernetes"


const clusterUrl = "/api/v1/clusters"
const baseUrl = "/api/v1/clusters/node/{clusterName}"
const detailUrl = "/api/v1/clusters/node/detail/{clusterName}/{node}"
const batchUrl = "/api/v1/clusters/node/batch/{clusterName}"
const recreateUrl = "/api/v1/clusters/node/recreate/{clusterName}"

export function cordonNode(data) {
  let headers = {"Content-Type": "application/strategic-merge-patch+json"}
  return post(kubernetesUrl + "/cordon", data, headers)
}

export function evictionNode(data) {
  return post(kubernetesUrl + "/evict", data)
}

export function listNodeInDB(clusterName) {
  return get(`/api/v1/clusters/node/${clusterName}`)
}

export function listNodesByPage(clusterName, pageNum, pageSize, isPolling) {
  return get(baseUrl.replace("{clusterName}", clusterName) + `?pageNum=${pageNum}&pageSize=${pageSize}&isPolling=${isPolling}`)
}

export function nodeBatchOperation(clusterName, data) {
  return post(batchUrl.replace("{clusterName}", clusterName), data)
}

export function getNodeStatus(clusterName, node) {
  return get(`${clusterUrl}/node/status/${clusterName}/${node}`)
}

export function getNodeByName(clusterName, node) {
  return get(detailUrl.replace("{clusterName}", clusterName).replace("{node}", node))
}

export function nodeReCreate(clusterName, data) {
  return post(recreateUrl.replace("{clusterName}", clusterName), data)
}