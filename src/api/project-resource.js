import {get, post} from "@/plugins/request"


const projectResourceUrl = (project_name) => {
  return `/project/${project_name}/resources`
}

export function listProjectResources (project_name, resourceType, currentPage, pageSize) {
  return get(`${projectResourceUrl(project_name)}?pageNum=${currentPage}&pageSize=${pageSize}&resourceType=${resourceType}`)
}

export function getResourceList (project_name, resourceType) {
  return get(`${projectResourceUrl(project_name)}/list?resourceType=${resourceType}`)
}

export function createProjectResource (project_name, data) {
  return post(`${projectResourceUrl(project_name)}`, data)
}