import {get} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"

const deploymentUrl = "apis/apps/v1/deployments"
const namespaceDeploymentUrl = "apis/apps/v1/namespaces/{namespace}/deployments"
const namespaceUrl = "api/v1/namespaces"
const podUrl = "api/v1/pods"
const namespacePodUrl = "api/v1/namespaces/{namespace}/pods/"

export function listDeployment(clusterName, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceDeploymentUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", deploymentUrl)
  }
  return get(url)
}

export function listNamespace(clusterName) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", namespaceUrl)
  return get(url)
}

export function listPod(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespacePodUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", podUrl)
  }
  return get(url)
}

export function getClusterToken(clusterName) {
  return get(`/api/v1/clusters/webkubectl/${clusterName}?l=zh-CN`)
}

export function getDashboard(clusterName){
  return get(`/api/v1/clusters/dashboard/${clusterName}?l=zh-CN`)
}
