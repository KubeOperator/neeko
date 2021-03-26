import {get, del, post} from "@/plugins/request"

const planUrl = "/plans"

export function listPlans (page, size) {
  return get(`${planUrl}?pageNum=${page}&pageSize=${size}`)
}

export function deletePlanBy (name) {
  return del(planUrl + "/" + name)
}

export function searchPlans (page, size, condition) {
  return post(`${planUrl}/search?pageNum=${page}&pageSize=${size}`, condition)
}