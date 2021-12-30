import {post} from "@/plugins/request"

const baseUrl = "/api/v1/clusters/monitor/search/{cluster_name}"

export function Monitor(clusterName, data) {
    return post(baseUrl.replace("{cluster_name}", clusterName), data)
}
