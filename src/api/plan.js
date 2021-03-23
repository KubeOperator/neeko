import { get, del } from "@/plugins/request"

const planUrl = "/plans"

export function listPlans(page, size) {
  return get(`plans?pageNum=${page}&pageSize=${size}`)
}

export function deletePlanBy(name) {
  return del(planUrl + "/" + name)
}
