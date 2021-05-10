import {del, get, post} from "@/plugins/request"

const projectMemberUrl = (project_name) => {
  return `/api/v1/projects/${project_name}/members`
}


export function listProjectMembers(project_name, currentPage, pageSize) {
  return get(`${projectMemberUrl(project_name)}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createProjectMember(project_name, data) {
  return post(`${projectMemberUrl(project_name)}`, data)
}

export function deleteProjectMember(project_name, name) {
  return del(`${projectMemberUrl(project_name)}/${name}`)
}

export function updateProjectMember(project_name, name, data) {
  return get(`${projectMemberUrl(project_name)}/${name}`, data)
}

export function listUsers(project_name, name) {
  return get(`${projectMemberUrl(project_name)}/users?name=${name}`)
}
