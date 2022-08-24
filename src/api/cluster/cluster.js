import {get, post} from "@/plugins/request"

const kubernetesUrl = "/api/v1/kubernetes/search"
const kubernetesCreateUrl = "/api/v1/kubernetes/create"
const kubernetesDeleteUrl = "/api/v1/kubernetes/delete"
const metricUrl = "/api/v1/kubernetes/search/metric/{cluster_name}" 

export function listResource(data) {
  return post(kubernetesUrl, data)
}

export function deleteResoure(data) {
  return post(kubernetesDeleteUrl, data)
}

export function listNamespace(clusterName) {
  let search = {
    kind: "namespacelist",
    cluster: clusterName,
    continue: "",
    limit: 0,
    namespace: "",
    name: "",
  }
  return post(kubernetesUrl, search)
}

export function listDeployment(clusterName, namespace) {
  let search = {
    kind: "deploymentlist",
    cluster: clusterName,
    continue: "",
    limit: 0,
    namespace: namespace,
    name: "",
  }
  return post(kubernetesUrl, search)
}

export function listPod(clusterName, namespace) {
  let search = {
    kind: "podlist",
    cluster: clusterName,
    continue: "",
    limit: 0,
    namespace: namespace,
    name: "",
  }
  return post(kubernetesUrl, search)
}

export function listNode(clusterName) {
  let search = {
    kind: "nodelist",
    cluster: clusterName,
    continue: "",
    limit: 0,
    namespace: "",
    name: "",
  }
  return post(kubernetesUrl, search)
}

export function listStorageClass(clusterName) {
  let search = {
    kind: "storageclasslist",
    cluster: clusterName,
    continue: "",
    limit: 0,
    namespace: "",
    name: "",
  }
  return post(kubernetesUrl, search)
}

export function getMetric(clusterName) {
  return post(metricUrl.replace("{cluster_name}", clusterName))
}

export function createStorageClass(data) {
  return post(kubernetesCreateUrl + "/sc", data)
}

export function createSecret(data) {
  return post(kubernetesCreateUrl + "/secret", data)
}

export function getClusterToken(clusterName) {
  return get(`/api/v1/clusters/webkubectl/${clusterName}?l=zh-CN`)
}

export function getDashboard(clusterName){
  return get(`/api/v1/clusters/dashboard/${clusterName}?l=zh-CN`)
}
