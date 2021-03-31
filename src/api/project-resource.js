import {get} from "@/plugins/request"


const projectResourceUrl = (project_name) => {
  return `/project/${project_name}/resources`
}

export function listProjectResources (project_name, resourceType, currentPage, pageSize) {
  return get(`${projectResourceUrl(project_name)}?pageNum=${currentPage}&pageSize=${pageSize}&resourceType=${resourceType}`)
}