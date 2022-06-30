import {get, post} from "@/plugins/request"

const taskUrl = "/api/v1/tasks"
const taskLoggerUrl = "/api/v1/tasks"

export function getTasks(page, size, cluster, logtype) {
    return post(`${taskUrl}?cluster=${cluster}&logtype=${logtype}&pageNum=${page}&pageSize=${size}`)
}

export function openLoggerWithID(clusterId, logId) {
    window.open(`/ui/#/logger?clusterId=${clusterId}&logId=${logId}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}

export function openLoggerWithName(clusterName, logId) {
    window.open(`/ui/#/logger?clusterName=${clusterName}&logId=${logId}`, "_blank", "height=865, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}

export function getLogById(clusterId, logId) {
    return get(`${taskLoggerUrl}/log1/${clusterId}/${logId}`)
}

export function getDetailById(logId) {
    return get(`${taskLoggerUrl}/detail/${logId}`)
}

export function getLogByName(clusterName, logId) {
    return get(`${taskLoggerUrl}/log2/${clusterName}/${logId}`)
}
