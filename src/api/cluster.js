import {get, post, del} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const namespaceUrl = "api/v1/namespaces"
const namespaceOpUrl = "api/v1/namespaces/{namespace}"
const serviceUrl = "api/v1/services"
const namespaceServiceUrl = "api/v1/namespaces/{namespace}/services"
const persistentVolumesUrl = "api/v1/persistentvolumes"
const persistentVolumesOpUrl = "api/v1/persistentvolumes/{name}"
const storageClassUrl = "apis/storage.k8s.io/v1/storageclasses"
const storageClassOpUrl = "apis/storage.k8s.io/v1/storageclasses/{name}"
const persistentVolumeClaimsUrl = "api/v1/persistentvolumeclaims"
const namespacePersistentVolumeClaimsUrl = "api/v1/namespaces/{namespace}/deployments"
const deploymentUrl = "apis/apps/v1/deployments"
const namespaceDeploymentUrl = "apis/apps/v1/namespaces/{namespace}/deployments"
const daemonSetUrl = "apis/apps/v1/daemonsets/"
const statefulSetUrl = "apis/apps/v1/statefulsets/"
const namespaceStatefulSet = "apis/apps/v1/namespaces/{namespace}/statefulsets/"
const namespaceDaemonSetUrl = "apis/apps/v1/namespaces/{namespace}/daemonsets/"
const cornJobUrl = "apis/batch/v1beta1/cronjobs"
const namespaceCornJobUrl = "apis/batch/v1beta1/namespaces/{namespace}/cronjobs"
const jobUrl = "apis/batch/v1/jobs"
const namespaceJobUrl = "apis/batch/v1/namespaces/{namespace}/jobs"
const ingressUrl = "apis/networking.k8s.io/v1beta1/ingresses"
const namespaceIngressUrl = "apis/networking.k8s.io/v1beta1/namespaces/{namespace}/ingresses"
const configMapUrl = "api/v1/configmaps"
const namespaceConfigMapUrl = "api/v1/namespaces/{namespace}/configmaps"
const secretUrl = "api/v1/secrets"
const namespaceSecretUrl = "api/v1/secrets"
const podUrl = "api/v1/pods"
const namespacePodUrl = "api/v1/namespaces/{namespace}/pods/"
const nodesUrl = "api/v1/nodes"
const nodeStatsSummaryUrl = "apis/metrics.k8s.io/v1beta1/nodes"
const eventByNamespaceUrl = "api/v1/namespaces/{namespace}/events"
const eventsUrl = "api/v1/events"

export function getClusterByName(clusterName) {
  return get(`/clusters/${clusterName}`)
}

export function listClusters(page, size, projectName) {
  return get(`/clusters/?pageNum=${page}&pageSize=${size}&projectName=${projectName}`)
}

export function getToken(clusterName) {
  return get(`clusters/webkubectl/${clusterName}?l=zh-CN`)
}

export function listNodesUsage(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", nodeStatsSummaryUrl)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listNodes(clusterName, continueToken) {
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

export function listNamespaces(clusterName) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", namespaceUrl)
  return get(url)
}

export function listTools(clusterName) {
  return get(`/clusters/tool/${clusterName}`)
}

export function createPersistentVolume(clusterName, data) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", persistentVolumesUrl)
  return post(url, data)
}

export function listPersistentVolumes(clusterName, continueToken) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", persistentVolumesUrl)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function listStorageClass(clusterName, continueToken, all) {
  let url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", storageClassUrl)
  if (!all) {
    url += "?limit=" + limit
  }
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  return get(url)
}

export function createStorageClass(clusterName, data) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", storageClassUrl)
  return post(url, data)
}

export function listPersistentVolumeClaims(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespacePersistentVolumeClaimsUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", persistentVolumeClaimsUrl)
  }
  return get(url)
}

export function listDeployment(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceDeploymentUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", deploymentUrl)
  }
  return get(url)
}

export function listDaemonSet(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceDaemonSetUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", daemonSetUrl)
  }
  return get(url)
}

export function listStatefulSet(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceStatefulSet).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", statefulSetUrl)
  }
  return get(url)
}

export function listJob(clusterName, continueToken, namespace){
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceJobUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", jobUrl)
  }
  return get(url)
}


export function listCornJob(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceCornJobUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", cornJobUrl)
  }
  return get(url)
}

export function listService(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceServiceUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", serviceUrl)
  }
  return get(url)
}

export function listIngress(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceIngressUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", ingressUrl)
  }
  return get(url)
}

export function listConfigMap(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceConfigMapUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", configMapUrl)
  }
  return get(url)
}

export function listSecret(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", namespaceSecretUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", secretUrl)
  }
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


export function listEvents(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
  url += "?limit=" + limit
  if (continueToken !== undefined && continueToken !== null) {
    url += "&continue=" + continueToken
  }
  if (namespace !== undefined && namespace !== null) {
    url = url.replace("{resource_url}", eventByNamespaceUrl).replace("{namespace}", namespace)
  } else {
    url = url.replace("{resource_url}", eventsUrl)
  }
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

export function deleteStorageClass(clusterName, name) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", storageClassOpUrl).replace("{name}", name)
  return del(url)
}

export function deletePersistentVolume(clusterName, name) {
  const url = proxyUrl.replace("{cluster_name}", clusterName).replace("{resource_url}", persistentVolumesOpUrl).replace("{name}", name)
  return del(url)
}