import {get} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const nodesUrl = "api/v1/nodes"
const nodeStatsSummaryUrl = "apis/metrics.k8s.io/v1beta1/nodes"

export function listNodesUsage(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodeStatsSummaryUrl)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listNode(clusterName, continueToken) {
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
  