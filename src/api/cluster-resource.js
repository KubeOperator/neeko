import {del, get, post} from "@/plugins/request"

const clusterResourceUrl = (projectName,clusterName) => {
  return `/api/v1/projects/${projectName}/clusters/${clusterName}/resources`
}

export function listClusterResources (projectName,clusterName, resourceType, currentPage, pageSize) {
  return get(`${clusterResourceUrl(projectName,clusterName)}?pageNum=${currentPage}&pageSize=${pageSize}&resourceType=${resourceType}`)
}

export function listClusterResourcesAll (projectName,clusterName, resourceType) {
  return get(`${clusterResourceUrl(projectName,clusterName)}?resourceType=${resourceType}`)
}

export function createClusterResource (projectName,clusterName, data) {
  return post(`${clusterResourceUrl(projectName,clusterName)}`, data)
}

export function deleteClusterResource (projectName,clusterName, name, resourceType) {
  return del(`${clusterResourceUrl(projectName,clusterName)}/${name}?resourceType=${resourceType}`)
}

export function getResourceAddList (projectName,clusterName, resourceType) {
  return get(`${clusterResourceUrl(projectName,clusterName)}/list?resourceType=${resourceType}`)
}
