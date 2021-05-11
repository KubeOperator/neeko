import {del, get, post} from "@/plugins/request"

const fileUrl = "/api/v1/clusters/backup/files"
const logUrl = "/api/v1/clusters/log"
const strategyUrl = "/api/v1/clusters/backup/strategy"
const clusterUrl = "/api/v1/clusters/backupaccounts"

export function listBackupByPage (clusterName, page, size) {
  const itemUrl = `${fileUrl}?pageNum=${page}&pageSize=${size}&clusterName=${clusterName}`
  return get(itemUrl)
}

export function getStrategy (clusterName) {
  const itemUrl = `${strategyUrl}/${clusterName}`
  return get(itemUrl)
}

export function getBackupLog (clusterName) {
  return get(`${logUrl}/${clusterName}`)
}

export function createStrategy (data) {
  const itemUrl = `${strategyUrl}`
  return post(itemUrl, data)
}

export function startBackup (data) {
  const itemUrl = `${fileUrl}/backup`
  return post(itemUrl, data)
}

export function startRestore (data) {
  const itemUrl = `${fileUrl}/restore`
  return post(itemUrl, data)
}

export function localRestore (data) {
  const itemUrl = `${fileUrl}/restore/local`
  return post(itemUrl, data)
}

export function listBackupAccounts (name) {
  return get(`${clusterUrl}/${name}`)
}

export function deleteBackupFile(name) {
  return del(`${fileUrl}/${name}`)
}
