// 根据实际需要修改
const getters = {
  sidebar: state => state.app.sidebar,
  name: state => state.user.name,
  currentProject: state => state.user.currentProject,
  language: state => state.user.language,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  license: state => state.license,
  theme: state => state.theme.theme,
}
export default getters
