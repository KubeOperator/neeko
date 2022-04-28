import {del, get, patch, post} from "@/plugins/request"

const templateUrl = "/api/v1/templates"

export function searchTemplates (page, size, condition) {
  return post(`${templateUrl}/search?pageNum=${page}&pageSize=${size}`, condition)
}

export function createTemplate (data) {
  return post(`${templateUrl}/create`, data)
}

export function getTemplate(name) {
  return get(`${templateUrl}/${name}`)
}

export function delTemplate(name) {
  return del(`${templateUrl}/${name}`)
}

export function updateTemplate(name,data) {
  return patch(`${templateUrl}/${name}`, data)
}

export function listTemplateConfigs() {
  return get(`${templateUrl}`)
}
