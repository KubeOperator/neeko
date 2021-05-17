import {get} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const limit = 10

const serviceUrl = "api/v1/services"
const namespaceServiceUrl = "api/v1/namespaces/{namespace}/services"
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
const eventByNamespaceUrl = "api/v1/namespaces/{namespace}/events"
const eventsUrl = "api/v1/events"

export function listDeployment(clusterName, continueToken, namespace) {
  let url = proxyUrl.replace("{cluster_name}", clusterName)
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

export function getClusterToken(clusterName) {
  return get(`/api/v1/clusters/webkubectl/${clusterName}?l=zh-CN`)
}
