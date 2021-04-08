import {del, get, post} from "@/plugins/request"

const clusterMemberUrl = (projectName, clusterName) => {
  return `/projects/${projectName}/clusters/${clusterName}/members`
}

export function listClusterMembers (projectName, clusterName, currentPage, pageSize) {
  return get(`${clusterMemberUrl(projectName, clusterName)}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createClusterMember (projectName, clusterName, data) {
  return post(`${clusterMemberUrl(projectName, clusterName)}`, data)
}

export function deleteClusterMember (projectName, clusterName, name) {
  return del(`${clusterMemberUrl(projectName, clusterName)}/${name}`)
}
