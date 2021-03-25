import {get} from "@/plugins/request"

const toolUrl = "clusters/tool/"

export function listTool(clusterName) {
  return get(`${toolUrl}/${clusterName}`)
}

export function enableTool(clusterName, data) {
  return get(`${toolUrl}/enable/${clusterName}`, data)
}

export function disableTool(clusterName, data) {
  return get(`${toolUrl}/disable/${clusterName}`, data)
}

export function upgradeTool(clusterName, data) {
  return get(`${toolUrl}/upgrade/${clusterName}`, data)
}