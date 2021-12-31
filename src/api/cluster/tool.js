import {get, post} from "@/plugins/request"

const toolUrl = "/api/v1/clusters/tool"

export function listTool(clusterName) {
  return get(`${toolUrl}/${clusterName}`)
}

export function enableTool(clusterName, data) {
  return post(`${toolUrl}/enable/${clusterName}`, data)
}

export function disableTool(clusterName, data) {
  return post(`${toolUrl}/disable/${clusterName}`, data)
}

export function upgradeTool(clusterName, data) {
  return post(`${toolUrl}/upgrade/${clusterName}`, data)
}

export function getNodePort(clusterName, toolName) {
  return get(`${toolUrl}/port/${clusterName}/${toolName}`)
}

export function syncTool(clusterName, data) {
  return post(`${toolUrl}/sync/${clusterName}`, data)
}