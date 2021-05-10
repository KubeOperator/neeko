import {get, post, del} from "@/plugins/request"

const authUrl = "/api/v1/auth/session"
const codeUrl = "/api/v1/captcha"
const forgetPassword = "/api/v1/user/forgot/password"

export function login(data) {
  return post(authUrl, data)
}

export function logout() {
  return del(authUrl)
}

export function isLogin() {
  return get(`${authUrl}/status`)
}

export function getSession() {
  return get(authUrl)
}

export function getCaptcha() {
  return get(`${codeUrl}`)
}

export function resetPassword(data) {
  return post(`${forgetPassword}`,data)
}
