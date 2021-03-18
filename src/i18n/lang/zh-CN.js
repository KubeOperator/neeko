import el from "element-ui/lib/locale/lang/zh-CN"; // 加载element的内容
import fu from "fit2cloud-ui/src/locale/lang/zh-CN"; // 加载fit2cloud的内容

const message = {
  commons: {
    message_box: {
      alert: "警告",
      confirm: "确认",
      prompt: "提示",
    },
    dialog: {
      delete: "删除",
    },
    button: {
      login: "登录",
      ok: "确定",
      save: "保存",
      delete: "删除",
      cancel: "取消",
      return: "返回",
      create: "添加",
      confirm: "确定",
      edit: "编辑"
    },
    msg: {
      success: "{0}成功",
      op_success: "操作成功",
      save_success: "保存成功",
      delete_success: "删除成功",
    },
    validate: {
      limit: '长度在 {0} 到 {1} 个字符',
      input: "请输入{0}",
      select: "请选择{0}",
    },
    personal: {
      personal_information: "个人信息",
      help_documentation: "帮助文档",
      exit_system: "退出系统",
    },
    table: {
      action: "动作",
      name: "名称",
      status: "状态",
      description: "描述",
      create_time: "创建时间"
    },
    status: {
      running: "运行中",
      error: "错误",
      active: "活跃",
      passive: "禁用"
    },
    role: {
      admin: "管理员",
      user: "用户"
    }
  },
  login: {
    username: "用户名",
    password: "密码",
    title: "登录 FIT2CLOUD",
    welcome: "欢迎回来，请输入用户名和密码登录",
    expires: '认证信息已过期，请重新登录',
  },
  route: {
    project: "项目",
    cluster: "集群",
    host: "主机",
    system_setting: "系统设置",
    system_log: "系统日志",
    complex_table: "复合表格",
    user: "用户"
  },
  cluster: {
    cluster: "集群"
  },
  host: {
    host: "主机",
    memory: "内存",
    os: "操作系统",
    architecture: "架构",
    port: "端口"
  },
  user: {
    username: "用户名",
    password: "密码",
    confirm_password: "确认密码",
    role: "角色",
    email: "邮箱"
  },
  system_log: {
    title: "系统日志",
    name: "名称",
    operation: "操作",
    operation_info: "操作内容",
    create_at: "创建时间"
  }

}

export default {
  ...el,
  ...fu,
  ...message
};
