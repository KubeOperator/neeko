import {get, post, del} from "@/plugins/request"

const authUrl = "/auth/session"
const codeUrl = "/captcha"

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