import {get, post, del} from "@/plugins/request"

const authUrl = "/auth/session"
const codeUrl = "/captcha"
const forgetPassword = "/user/forgot/password"

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