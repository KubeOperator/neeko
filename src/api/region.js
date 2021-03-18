import {get} from "@/plugins/request"

const regionUrl = "/regions"

export function listRegions() {
    return get(regionUrl)
}
