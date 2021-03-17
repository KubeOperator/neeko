import {get, post, del} from "@/plugins/request"

const projectUrl = "/projects"

export function createProject(data) {
  return post(projectUrl, data)
}

export function listProjects(currentPage, pageSize) {
  return get(`${projectUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function deleteProject(name) {
  return del(`${projectUrl}/${name}`)
}
