import {del, get, patch, post} from "@/plugins/request"

const backupAccountUrl="/api/v1/backupaccounts"


export function getBackupAccounts(currentPage,pageSize) {
  return get(`${backupAccountUrl}/?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createBackupAccounts(data) {
  return post(`${backupAccountUrl}`,data)
}

export function listBuckets(data) {
  return post(`${backupAccountUrl}/buckets`,data)
}

export function updateBackupAccounts(name, data) {
  return patch(`${backupAccountUrl}/${name}`,data)
}

export function deleteBackupAccounts(name) {
  return del(`${backupAccountUrl}/${name}`)
}

export function searchBackupAccounts(currentPage, pageSize, conditions) {
  return post(`${backupAccountUrl}/search?pageNum=${currentPage}&pageSize=${pageSize}`, conditions)
}
