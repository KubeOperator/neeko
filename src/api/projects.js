import {get, post, del} from "@/plugins/request"
import {patch} from "../plugins/request";

const projectUrl = "/projects"

export function createProject(data) {
  return post(projectUrl, data)
}

export function listProjects(currentPage, pageSize) {
  return get(`${projectUrl}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function getProject(name) {
  return get(`${projectUrl}/${name}`)
}

export function updateProject(name, data) {
  return patch(`${projectUrl}/${name}`, data)
}

export function deleteProject(name) {
  return del(`${projectUrl}/${name}`)
}

export function allProjects() {
  return get(`${projectUrl}`)
}
