import {get, post, del, patch} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const nodesUrl = "/api/v1/nodes"
const evictionUrl = "api/v1/namespaces/{namespace}/pods/{pod}/eviction"
const nodeStatsSummaryUrl = "apis/metrics.k8s.io/v1beta1/nodes"
const baseUrl = "/api/v1/clusters/node/{clusterName}"

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
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listNodesByPage(clusterName, pageNum, pageSize) {
  return get(`/api/v1/clusters/node/${clusterName}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export function nodeCreate(clusterName, data) {
  return post(baseUrl.replace("{clusterName}", clusterName), data)
}

export function nodeDelete(clusterName, nodeName) {
  return del(`/api/v1/clusters/node/${clusterName}/${nodeName}`)
}
