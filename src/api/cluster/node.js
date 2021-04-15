import {get, post} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const nodesUrl = "api/v1/nodes"
const nodeStatsSummaryUrl = "apis/metrics.k8s.io/v1beta1/nodes"
const batchUrl = "/clusters/node/batch/{clusterName}"

export function listNodesUsage(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodeStatsSummaryUrl)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listNodeInDB(clusterName) {
  return get(`clusters/node/${clusterName}`)
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
  return get(`/clusters/node/${clusterName}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export function nodeCreate(clusterName, data) {
  return post(batchUrl.replace("{clusterName}", clusterName), data)
}
  