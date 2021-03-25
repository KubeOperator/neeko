import {rolesRoutes, constantRoutes} from '@/router'

function hasPermission(roles, license, route) {
  if (route.meta && route.meta.requireLicense) {
    if (license.status !== 'valid') {
      return false
    }
  }
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}


export function filterRolesRoutes(routes, license, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, license, tmp)) {
      if (tmp.children) {
        tmp.children = filterRolesRoutes(tmp.children, license, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, p) {
    return new Promise(resolve => {
      const {license, roles} = p
      let accessedRoutes
      accessedRoutes = filterRolesRoutes(rolesRoutes, license, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
