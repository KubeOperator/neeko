import {del, get, post} from "@/plugins/request"


const projectResourceUrl = (project_name) => {
  return `/api/v1/projects/${project_name}/resources`
}

export function listProjectResources (project_name, resourceType, currentPage, pageSize) {
  return get(`${projectResourceUrl(project_name)}?pageNum=${currentPage}&pageSize=${pageSize}&resourceType=${resourceType}`)
}

export function listProjectResourcesAll (project_name, resourceType) {
  return get(`${projectResourceUrl(project_name)}?resourceType=${resourceType}`)
}

export function getResourceList (project_name, resourceType) {
  return get(`${projectResourceUrl(project_name)}/list?resourceType=${resourceType}`)
}

export function createProjectResource (project_name, data) {
  return post(`${projectResourceUrl(project_name)}`, data)
}

export function deleteProjectResource (project_name, name,resourceType) {
  return del(`${projectResourceUrl(project_name)}/${name}?resourceType=${resourceType}`)
}
