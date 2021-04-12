import {get} from "@/plugins/request"

const baseUrl = "/clusters/grade"

export function getGrade(clusterName) {
    const gradeUrl = `${baseUrl}/${clusterName}`
    return get(gradeUrl)
}