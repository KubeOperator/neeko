import {getLicense} from "@/api/license"

const LicenseKey = "X-License";

const Status = {
  valid: "valid",
  invalid: "invalid",
  expired: "expired",
}

const get = () => {
  return localStorage.getItem(LicenseKey)
}
const set = value => {
  localStorage.setItem(LicenseKey, value)
}
const state = {
  status: get(),
  license: {},
  message: ""
}

const mutations = {
  SET_STATUS: (state, status) => {
    set(LicenseKey, status)
    state.status = status;
  },
  SET_LICENSE: (state, license) => {
    state.license = license;
  },
  SET_MESSAGE: (state, message) => {
    state.message = message;
  }
}

const actions = {
  getLicense({commit}) {
    return new Promise((resolve, reject) => {
      getLicense().then(data => {
        const {status, license, message} = data;
        commit('SET_STATUS', status)
        commit('SET_LICENSE', license)
        commit('SET_MESSAGE', message)
        resolve(data)
      }).catch(error => {
        commit('SET_STATUS', Status.invalid)
        reject(error)
      })
    })
  },
  isValid({state}) {
    return state.status === Status.valid
  },
  isExpired({state}) {
    return state.status === Status.expired
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
