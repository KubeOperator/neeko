import {post} from "@/plugins/request"

const efBaseUrl = "/proxy/logging/{cluster_name}/{index_name}/_search?pretty=true"
const lokiBaseUrl = "/proxy/loki/{cluster_name}/"

export function EfSearch(clusterName, queryArry, queryIndex, beginDate, endDate, pageFrom, pageSize) {
  const index = queryIndex
  const query = {
    from: (pageFrom - 1) * pageSize,
    size: pageSize,
    query: {
      bool: {
        must: queryArry,
        filter: {
          range: {
            "@timestamp": {
              gte: beginDate,
              lte: endDate,
              format: "yyyy.MM.dd",
              time_zone: "+08:00"
            }
          }
        }
      }
    },
    sort: [
      {"@timestamp": "desc"},
    ]
  }
  return post(efBaseUrl.replace("{cluster_name}", clusterName).replace("{index_name}", index) + "&ignore_unavailable=true", query)
}
export function LokiLabels(clusterName) {
  return post(lokiBaseUrl.replace("{cluster_name}", clusterName) + "loki/api/v1/labels", "")
}
export function LokiLabelValues(clusterName, label) {
  return post(lokiBaseUrl.replace("{cluster_name}", clusterName) + "loki/api/v1/label/{label}/values".replace("{label}", label), "")
}
export function LokiSearch(clusterName, params) {
  return post(lokiBaseUrl.replace("{cluster_name}", clusterName) + "loki/api/v1/query_range?" + params, "")
}
