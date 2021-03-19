import {get} from "@/plugins/request"

export function listClusters(page, size, projectName) {
  return get(`/clusters/?pageNum=${page}&pageSize=${size}&projectName=${projectName}`)
}
