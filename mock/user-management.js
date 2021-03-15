const {success} = require("./result-holder")
const users = [
  {
    id: "admin",
    name: 'Administrator',
    email: "admin@fit2cloud.com",
    roles: ['admin'],
    language: "zh-CN"
  }, {
    id: "editor",
    name: 'Editor',
    email: "editor@fit2cloud.com",
    roles: ['editor'],
    language: "zh-CN"
  }, {
    id: "readonly",
    name: 'Readonly User',
    email: "readonly@fit2cloud.com",
    roles: ['readonly'],
    language: "zh-CN"
  }
]

for (let i = 0; i < 300; i++) {
  let id = "user-" + i
  let name = id;
  let email = id + "@fit2cloud.com"
  let roles = ['readonly']
  let language = "zh-CN"
  let createTime = new Date().getTime()
  users.push({id, name, email, roles, language, createTime})
}

module.exports = [
  // get user list
  {
    url: '/samples/user-management/list/\.*',
    type: 'get',
    response: (config) => {
      let path = config.originalUrl.split("/")
      let page = Number.parseInt(path[4])
      let size = Number.parseInt(path[5])
      let start = (page - 1) * size
      let end = page * size

      let data = {
        items: users.slice(start, end),
        total: users.length
      }
      return success(data)
    }
  },
]

