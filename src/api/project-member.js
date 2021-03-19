import {get} from "@/plugins/request"

const projectMemberUrl = (project_name) => {
  return `/project/${project_name}/members`
}


export function listProjectMembers(project_name, currentPage, pageSize) {
  return get(`${projectMemberUrl(project_name)}?pageNum=${currentPage}&pageSize=${pageSize}`)
}

export function createProjectMember(project_name, data) {
  return get(`${projectMemberUrl(project_name)}}`, data)
}

export function deleteProjectMember(project_name, name) {
  return get(`${projectMemberUrl(project_name)}}/${name}`)
}

export function updateProjectMember(project_name, name, data) {
  return get(`${projectMemberUrl(project_name)}}/${name}`, data)
}
