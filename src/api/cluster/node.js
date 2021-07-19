import {get, post, patch} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const nodesUrl = "/api/v1/nodes"
const evictionUrl = "api/v1/namespaces/{namespace}/pods/{pod}/eviction"
const nodeStatsSummaryUrl = "apis/metrics.k8s.io/v1beta1/nodes"
const baseUrl = "/api/v1/clusters/node/{clusterName}"
const detailUrl = "/api/v1/clusters/node/detail/{clusterName}/{node}"
const batchUrl = "/api/v1/clusters/node/batch/{clusterName}"
const recreateUrl = "/api/v1/clusters/node/recreate/{clusterName}/{node}"

export function listNodesUsage(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodeStatsSummaryUrl)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function cordonNode(clusterName, nodeName, data) {
  let headers = {"Content-Type": "application/strategic-merge-patch+json"}
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodesUrl) + "/" + nodeName
  return patch(url, data, headers)
}

export function evictionNode(clusterName, namespace, pod, data) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", evictionUrl).replace("{namespace}", namespace).replace("{pod}", pod)
  return post(url, data)
}

export function listNodeInDB(clusterName) {
  return get(`/api/v1/clusters/node/${clusterName}`)
}

export function listNodeInCluster(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodesUrl)
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listNodesByPage(clusterName, pageNum, pageSize) {
  return get(baseUrl.replace("{clusterName}", clusterName) + `?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export function nodeBatchOperation(clusterName, data) {
  return post(batchUrl.replace("{clusterName}", clusterName), data)
}

export function getNodeByName(clusterName, node) {
  return get(detailUrl.replace("{clusterName}", clusterName).replace("{node}", node))
}

export function nodeReCreate(clusterName, node) {
  return post(recreateUrl.replace("{clusterName}", clusterName).replace("{node}", node))
}