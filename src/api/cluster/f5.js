import {get, post, patch} from "@/plugins/request"

const baseUrl = "/api/v1/clusters/f5"

export function getF5(clusterName) {
    const itemUrl = `${baseUrl}/${clusterName}`
    return get(itemUrl)
}

export function createF5(data) {
    const url = baseUrl
    return post(url, data)
}

export function updateF5(data) {
    const url = baseUrl
    return patch(url, data)
}
