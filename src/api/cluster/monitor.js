import {get} from "@/plugins/request"

const baseUrl = '/proxy/prometheus/{cluster_name}/'

const cpuCommon = 'api/v1/query_range?query=sum by(instance)(irate(node_cpu_seconds_total{instance="{instance}", mode={mode}}[5m])) * 100&start={start}&end={end}&step=300'

const memoryTotal = 'api/v1/query_range?query=node_memory_MemTotal_bytes{instance="{instance}"}&start={start}&end={end}&step=300'
const memoryUsed = 'api/v1/query_range?query=node_memory_MemTotal_bytes{instance="{instance}"} - node_memory_MemFree_bytes{instance="{instance}"} - (node_memory_Cached_bytes{instance="{instance}"}%2Bnode_memory_Buffers_bytes{instance="{instance}"})&start={start}&end={end}&step=300'
const memoryCacheBuffer = 'api/v1/query_range?query=node_memory_Cached_bytes{instance="{instance}"}%2Bnode_memory_Buffers_bytes{instance="{instance}"}&start={start}&end={end}&step=300'
const memoryFree = 'api/v1/query_range?query=node_memory_MemFree_bytes{instance="{instance}"}&start={start}&end={end}&step=300'
const memorySWAPUsed = 'api/v1/query_range?query=(node_memory_SwapTotal_bytes{instance="{instance}"} - node_memory_SwapFree_bytes{instance="{instance}"})&start={start}&end={end}&step=300'

const disk = 'api/v1/query_range?query=100 - ((node_filesystem_avail_bytes{instance="{instance}",device!~"rootfs"} * 100) / node_filesystem_size_bytes{instance="{instance}",device!~"rootfs"})&start={start}&end={end}&step=300'

const networkRecv = 'api/v1/query_range?query=irate(node_network_receive_bytes_total{instance="{instance}"}[5m])*8&start={start}&end={end}&step=300'
const networkTrans = 'api/v1/query_range?query=irate(node_network_transmit_bytes_total{instance="{instance}"}[5m])*8&start={start}&end={end}&step=300'


export function QueryCPU(clusterName, node, mode , start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + cpuCommon.replace(/{instance}/g, node).replace(/{mode}/g, mode).replace('{start}', start).replace('{end}', end))
}

export function QueryMemoryTotal(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + memoryTotal.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}
export function QueryMemoryUsed(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + memoryUsed.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}
export function QueryMemoryCacheBuffer(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + memoryCacheBuffer.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}
export function QueryMemoryFree(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + memoryFree.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}
export function QueryMemorySWAPUsed(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + memorySWAPUsed.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}

export function QueryDisk(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + disk.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}

export function QueryNetworkRecv(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + networkRecv.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}
export function QueryNetworkTrans(clusterName, node, start, end) {
    return get(baseUrl.replace('{cluster_name}', clusterName) + networkTrans.replace(/{instance}/g, node).replace('{start}', start).replace('{end}', end))
}