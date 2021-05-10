import {get, post, del} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"

const namespaceUrl = "api/v1/namespaces"
const namespaceOpUrl = "api/v1/namespaces/{namespace}"

export function listNamespace(clusterName) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", namespaceUrl)
  return get(url)
}

export function createNamespace(clusterName, data) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", namespaceUrl)
  return post(url, data)
}

export function deleteNamespace(clusterName, namespace) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", namespaceOpUrl).replace("{namespace}", namespace)
  return del(url)
}
