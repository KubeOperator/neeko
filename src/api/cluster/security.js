import {get, post, del} from "@/plugins/request"

const url = "/api/v1/clusters/cis/{cluster_name}"
const detailUrl = "/api/v1/clusters/cisdetail/{cluster_name}"
const reportlUrl = "/api/v1/clusters/cisreport/{cluster_name}"

export function listCisByPage(clusterName, page, size) {
  return get(url.replace("{cluster_name}", clusterName) + `?pageNum=${page}&pageSize=${size}`)
}

export function cisCreate(clusterName, data) {
  return post(url.replace("{cluster_name}", clusterName), data)
}

export function cisDelete(clusterName, id) {
  return del(url.replace("{cluster_name}", clusterName) + `/${id}`)
}

export function getCisDetail(clusterName, id) {
  return get(detailUrl.replace("{cluster_name}", clusterName) + `/${id}`)
}

export function getCisReport(clusterName, id, format) {
  let url = reportlUrl.replace("{cluster_name}", clusterName) + `/${id}`
  if (format) {
    url += `?format=${format}`
  }
  return window.open(url)
}
