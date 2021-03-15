import store from "@/store";

export const checkPermission = function (permissionRoles) {
  const roles = store.getters && store.getters.roles

  return roles.some(role => {
    return permissionRoles.includes(role)
  })
}
