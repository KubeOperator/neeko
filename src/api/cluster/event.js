import {get, post} from "@/plugins/request"

const proxyUrl = "/proxy/kubernetes/{cluster_name}/{resource_url}"
const eventByNamespaceUrl = "api/v1/namespaces/{namespace}/events"
const eventsUrl = "/api/v1/clusters/events"
const limit = 10

export function listEvents(clusterName, continueToken, namespace) {
    let url = proxyUrl.replace("{cluster_name}", clusterName)
    url += "?limit=" + limit
    if (continueToken) {
        url += "&continue=" + continueToken
    }
    if (namespace) {
        url = url.replace("{resource_url}", eventByNamespaceUrl).replace("{namespace}", namespace)
    } else {
        url = url.replace("{resource_url}", eventsUrl)
    }
    return get(url)
}

export function changeNpd(clusterName, operation) {
    const itemUrl = `${eventsUrl}/npd/${operation}/` + clusterName
    return post(itemUrl, {});
}
