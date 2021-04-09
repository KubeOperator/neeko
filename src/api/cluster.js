import {get} from "@/plugins/request"

export function getClusterByName(clusterName) {
  return get(`/clusters/${clusterName}`)
}

export function listClusters(page, size, projectName) {
  return get(`/clusters/?pageNum=${page}&pageSize=${size}&projectName=${projectName}`)
}

export function allClusters() {
  return get(`/clusters`)
}

export function getToken(clusterName) {
  return get(`clusters/webkubectl/${clusterName}?l=zh-CN`)
}
