import {get, post, del, patch} from "@/plugins/request"

const baseUrl = "/multicluster"

export function listMultiClusterRepositories(currentPage, pageSize) {
  return get(`${baseUrl}/repositories?pageNum=${currentPage}&pageSize=${pageSize}`,)
}


export function getMultiClusterRepository(name) {
  return get(`${baseUrl}/repositories/${name}`,)
}

export function createMultiClusterRepository(data) {
  return post(`${baseUrl}/repositories`, data)
}

export function deleteMultiClusterRepository(name) {
  return del(`${baseUrl}/repositories/${name}`)
}

export function updateMultiClusterRepository(name, data) {
  return patch(`${baseUrl}/repositories/${name}`, data)
}


export function listMultiClusterRepositoryRelations(name) {
  return get(`${baseUrl}/repositories/relations/${name}`,)
}

export function updateMultiClusterRepositoryRelations(name, data) {
  return post(`${baseUrl}/repositories/relations/${name}`, data)
}

export function getMultiClusterSyncLogs(name, currentPage, pageSize) {
  return get(`${baseUrl}/repositories/logs/${name}?pageNum=${currentPage}&pageSize=${pageSize}`,)
}
