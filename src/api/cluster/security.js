import {get, post, del} from "@/plugins/request"

const url = "/api/v1/clusters/cis/{cluster_name}"

export function listCisByPage(clusterName, page, size) {
  return get(url.replace("{cluster_name}", clusterName) + `?pageNum=${page}&pageSize=${size}`)
}

export function cisCreate(clusterName) {
  return post(url.replace("{cluster_name}", clusterName), {})
}

export function cisDelete(clusterName, id) {
  return del(url.replace("{cluster_name}", clusterName) + `/${id}`)
}
