import {del, get, post} from "@/plugins/request"

const clusterMemberUrl = (clusterName) => {
  return `cluster/${clusterName}/members`
}

export function listClusterMembers (clusterName, currentPage, pageSize) {
  return get(`${clusterMemberUrl(clusterName)}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createClusterMember (clusterName, data) {
  return post(`${clusterMemberUrl(clusterName)}`, data)
}

export function deleteClusterMember(clusterName,name) {
  return del(`${clusterMemberUrl(clusterName)}/${name}`)
}
