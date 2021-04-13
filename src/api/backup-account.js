import {del, get, patch, post} from "@/plugins/request"

export function getBackupAccounts(currentPage,pageSize) {
  return get(`/backupaccounts?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createBackupAccounts(data) {
  return post(`/backupaccounts`,data)
}

export function listBuckets(data) {
  return post(`/backupaccounts/buckets`,data)
}

export function updateBackupAccounts(name, data) {
  return patch(`/backupaccounts/${name}`,data)
}

export function deleteBackupAccounts(name) {
  return del(`/backupaccounts/${name}`)
}
