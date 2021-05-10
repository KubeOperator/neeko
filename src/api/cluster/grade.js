import {get} from "@/plugins/request"

const baseUrl = "/api/v1/clusters/grade"

export function getGrade(clusterName) {
    const gradeUrl = `${baseUrl}/${clusterName}`
    return get(gradeUrl)
}
