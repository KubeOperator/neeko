import {del, get, post} from "@/plugins/request"

const fileUrl = "/api/v1/clusters/backup/files"
const logUrl = "/api/v1/clusters/log"
const strategyUrl = "/api/v1/clusters/backup/strategy"
const clusterUrl = "/api/v1/clusters/backupaccounts"
const VeleroUrl = "/api/v1/clusters/velero"



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

export function getVeleroBackups(cluster) {
  return get(`${VeleroUrl}/${cluster}/backups`)
}

export function getVeleroBackupLogs(cluster,backup){
  return get(`${VeleroUrl}/${cluster}/backup/logs?name=${backup}`)
}

export function createVeleroBackup(cluster, type, item) {
  return post(`${VeleroUrl}/${cluster}/${type}/create`,item)
}

export function deleteVeleroBackup(cluster, type, backup) {
  return del(`${VeleroUrl}/${cluster}/${type}/del?name=${backup}`)
}

export function getRestores(cluster){
  return get(`${VeleroUrl}/${cluster}/restore`)
}

export function getVeleroRestoreDescribe(cluster,restore){
  return get(`${VeleroUrl}/${cluster}/restore/describe?name=${restore}`)
}

export function getVeleroRestoreLogs(cluster,restore){
  return get(`${VeleroUrl}/${cluster}/restore/logs?name=${restore}`)
}

export function delVeleroRestore(cluster,restore) {
  return del(`${VeleroUrl}/${cluster}/restore/del?name=${restore}`)
}

export function restore(cluster,item) {
  return post(`${VeleroUrl}/${cluster}/restore/create`,item)
}

export function veleroInstall(cluster,item) {
  return post(`${VeleroUrl}/${cluster}/velero/install/config`,item)
}

export function getVeleroConfig(cluster) {
  return get(`${VeleroUrl}/${cluster}/velero/install/config`)
}

export function veleroUninstall(cluster) {
  return del(`${VeleroUrl}/${cluster}/velero/uninstall`)
}
