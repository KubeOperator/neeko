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
      import: "导入",
      upgrade: "升级",
      check: "诊断",
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
      cannot_be_empty: "该内容不能为空!",
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
    manifest: "版本管理",
    system_log: "系统日志",
    complex_table: "复合表格",
    user: "用户"
  },
  cluster: {
    cluster: "集群",
    version: "版本",
    node_size: "节点数量",
    creation: {
      step1: "集群信息",
      name: "名称",
      name_check: "校验中",
      name_help: "支持小写英文、数字和- 不能以数字开头",
      name_invalid_err: "集群名称无效",
      provider: "提供商",
      provide_plan: "部署计划",
      provide_bare_metal: "裸金属",
      version: "版本",
      arch: "架构",
      repo_err: "请在系统设置中完善对应仓库信息",
      yum_repo: "Yum 仓库",
      yum_repo_replace_help: "此操作将会对 K8S 节点服务器原始 yum repo 文件进行备份，之后生成并仅使用 KubeOperator 的 yum repo",
      yum_repo_coexist_help: "此操作将保持K8S节点服务器原始 yum repo 文件不变，同时生成并使用 kubeoperator 的 yum repo",
      yum_repo_no_help: "此操作将保持使用 K8S 节点服务器原始 yum repo 文件，不对K8S节点服务器的 yum repo 做任何操作",
      
      step2: "集群设置",
      container_network: "容器网络",
      cluster_cidr: "集群 CIDR",
      max_node_pod_num: "POD 数量上限/节点",
      max_cluster_service_num: "Service 数量上限/集群",
      proxy_mode: "proxy 模式",
      kubernetes_audit: "Kubernetes 审计",
      enable: "启用",
      disable: "禁用",
      network_help: "CIDR不能与目标IP段重叠，否则会造成初始化失败",
      max_node_num_show: "当前容器网络配置下，集群最多拥有 {0} 节点",

      step3: "运行时设置",
      runtime_type: "容器运行时",
      docker_storage_dir: "Docker 数据路径",
      containe_storage_dir: "Container 数据路径",
      subnet: "Container 子网",

      step4: "容器网络设置",
      network_interface: "网卡名称",
      network_interface_help: "多网卡环境需要指定使用的网卡名称，单网卡环境可不填",
      network_type: "容器网络",
      flannel_backend: "网络模式",
      flannel_backend_help_route: "基于路由，不适用于公有云环境，优势是没有封包和解包过程，完全基于两端宿主机的路由表进行转发劣势是要求宿主机在2层网络是互通，且路由表膨胀会导致性能降低。",
      flannel_backend_help_channel: "基于隧道，在任何网络环境下都可以正常工作，优势是对物理网络环境没有特殊要求，只要宿主机IP层可以路由互通即可。劣势是封包和解包耗费CPU性能，且额外的封装导致带宽浪费。",

      step5: "组件设置",
      ingress_type: "ingress 类型",
      support_gpu: "安装GPU套件",

      step6_of_bare_metal: "节点信息",
      node_help: "主机需要先在项目-资源中授权",
      master_select_help: "（Master 节点的数量必须为1或者3）",
      step6_of_plan: "部署计划",
      worker_num: "Worker 数量",

      step7: "配置预览",
      base_setting: "基本配置",
    },
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
  manifest: {
    title: "版本管理",
    detail: "详情",
    enable: "启用",
    message: "版本 {0} 启用/停用成功！"
  },
  system_log: {
    title: "系统日志",
    operation: "操作",
    operation_info: "操作内容",
    query_placeholder: "按 名称/操作/操作内容 搜索"
  }

}

export default {
  ...el,
  ...fu,
  ...message
};
