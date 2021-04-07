import {del, get, post} from "@/plugins/request"

const clusterResourceUrl = (projectName,clusterName) => {
  return `/project/${projectName}/cluster/${clusterName}/resources`
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