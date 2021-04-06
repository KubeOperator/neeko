import {del, get, post} from "@/plugins/request"

const clusterResourceUrl = (cluster_name) => {
  return `/cluster/${cluster_name}/resources`
}

export function listClusterResources (clusterName, resourceType, currentPage, pageSize) {
  return get(`${clusterResourceUrl(clusterName)}?pageNum=${currentPage}&pageSize=${pageSize}&resourceType=${resourceType}`)
}

export function createClusterResource (clusterName, data) {
  return post(`${clusterResourceUrl(clusterName)}`, data)
}

export function deleteClusterResource (clusterName, name, resourceType) {
  return del(`${clusterResourceUrl(clusterName)}/${name}?resourceType=${resourceType}`)
}