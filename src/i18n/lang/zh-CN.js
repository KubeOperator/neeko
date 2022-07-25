import el from "element-ui/lib/locale/lang/zh-CN" // 加载element的内容
import fu from "fit2cloud-ui/src/locale/lang/zh-CN" // 加载fit2cloud的内容

const message = {
  commons: {
    message_box: {
      alert: "警告",
      confirm: "确认",
      prompt: "提示"
    },
    dialog: {
      delete: "删除"
    },
    confirm_message: {
      delete: "此操作不可撤销, 是否继续?",
      uncordon: "此操作将恢复节点为可调度状态, 是否继续?",
      enable_component_select: "当前尚未选择同步组件，是否同步所有?",
      enable_component: "此操作将启用集群 {0} 组件，是否继续?",
      disable_component: "此操作将禁用集群 {0} 套件，是否继续?",
    },
    button: {
      login: "登录",
      ok: "确定",
      save: "保存",
      delete: "删除",
      import: "导入",
      import_exist: "导入已有",
      watch: "追踪",
      pause: "暂停",
      batch_import: "批量导入",
      upgrade: "升级",
      check: "诊断",
      cancel: "取消",
      close: "关闭",
      export: "导出",
      return: "返回",
      create: "添加",
      confirm: "确定",
      edit: "编辑",
      sync: "同步",
      enable: "启用",
      disable: "禁用",
      jump_to: "转到",
      search: "查询",
      verify: "校验",
      management: "管理",
      more: "更多信息",
      back_to_form: "返回表单",
      submit: "提交",
      refresh: "刷新",
      authorize: "授权",
      revoke_authorize: "取消授权",
      getBucket: "获取桶",
      update: "更新",
      upload: "上传",
      retry: "重试",
      history: "日志",
      error_msg: "错误",
      re_enable: "重新启用",
      lock: "启用/禁用",
      relation: "关联",
      active: "激活",
      cordon: "驱散",
      log: "日志",
      dashboard: "控制台",
      more_info: "更多信息",
      backup: "备份",
      restore: "恢复",
      test_connection: "连接性测试",
    },
    msg: {
      success: "{0}成功",
      op_success: "操作成功",
      save_success: "保存成功",
      delete_success: "删除成功",
      restart_after_delete: "操作成功，请成功删除后重启节点机器",
      sync_success: "已开始同步，同步时间取决于IP数量，请稍后刷新页面",
      create_success: "创建成功",
      verify_success: "校验成功",
      import_success: "导入成功",
      enable_success: "启用成功",
      re_enable_success: "重新启用成功",
      disable_success: "禁用成功",
      update_success: "更新成功",
      upgrade_start_success: "集群升级已开始，请稍候...",
    },
    validate: {
      limit: "长度在 {0} 到 {1} 个字符",
      input: "请输入{0}",
      input_error: "请输入正确的集群名称！",
      cannot_be_empty: "该内容不能为空!",
      name_not_compliant: "该名称不符合命名规范!",
      select: "请选择",
      required_msg: "输入项不能为空",
      ip_error: "请输入正确的Ip地址",
      password_help: "有效密码:8-30位,英文字母+数字+特殊字符(可选)",
      number_limit: "请输入正确的数字",
      email: "邮箱格式不正确",
      common_name_help: "小写英文、数字和-",
      name_help: "中文、大小写英文、数字、-和.",
      ip_range_error: "IP范围错误",
      subnet_error: "子网错误",
      support_image_type: "只能上传 jpg/png/jpeg 文件!",
    },
    search: {
      name: "",
      quickSearch: "快速搜索",
      select: "请选择{0}",
      time: "时间",
      time_start: "开始时间",
      time_end: "结束时间",
      time_range: "至",
      date_start: "开始日期",
      date_end: "结束日期",
      synchronizing: "同步中",
    },
    personal: {
      change_password: "修改密码",
      sync_password: "同步密码",
      help_documentation: "帮助文档",
      exit_system: "退出系统",
      new_password: "新密码",
      original_password: "原密码",
      confirm_password: "确认密码",
      confirm_password1_info: "密码不一致",
      about: "关于",
      project_url: "项目地址",
      issue: "问题反馈",
      talk: "参与讨论",
      star: "点亮 Star",
      version: "版本",
      ko_introduction: "是一个开源的轻量级 Kubernetes 发行版，专注于帮助企业规划、部署和运营生产级别的 Kubernetes 集群。",
      setting: "个人设置"
    },
    help: {
      help: "帮助",
      api_docs: "API 文档",
      business_support: "商业支持",
      ko_docs: "官方文档",
    },
    table: {
      action: "操作",
      name: "名称",
      status: "状态",
      description: "描述",
      create_time: "创建时间",
      spend_time: "耗时",
      type: "类型",
      username: "用户名",
    },
    status: {
      RUNNING: "执行中",
      SUCCESS: "成功",
      FAILED: "失败",
      WAITING: "等待中",
      running: "运行中",
      initializing: "初始化中",
      creating: "创建中",
      success: "成功",
      failed: "失败",
      Failed: "失败",
      not_ready: "未就绪",
      notready: "未就绪",
      error: "错误",
      active: "活跃",
      passive: "禁用",
      waiting: "等待中",
      upgrading: "升级中",
      terminating: "销毁中",
      synchronizing: "同步中",
      normal: "正常",
      failure: "异常",
      lost: "失联",
      disable_scheduling: "禁用调度",
      enable: "已启用",
      disable: "未启用",
      bind: "已绑定",
    },
    role: {
      super_admin: "超级管理员",
      admin: "管理员",
      user: "用户"
    },
    form: {
      number_validate: "请输入正确的数字",
      ip_range_error: "Ip范围无效",
      yes: "是",
      no: "否",
      file_upload_help: "将文件拖到此处，或点击上传",
    }
  },
  login: {
    username: "用户名",
    password: "密码",
    title: "KubeOperator",
    welcome: "欢迎回来，请输入用户名和密码登录",
    expires: "认证信息已过期，请重新登录",
    captcha: "验证码",
    forget_password: "忘记密码",
    reset_password: "重置密码",
    email: "邮箱",
    reset_message: "重置密码成功！请查看邮件"
  },
  theme: {
    systemName: "系统名称",
    system_name_help: "将会显示在企业版用户登录页面（eg: KubeOperator)",
    login_image: "登录页面图片",
    login_image_help: "将会显示在企业版用户登录页面（建议图片大小为: 480px*480px）",
    icon: "网站图标",
    icon_help: "网站图标（建议图片大小为: 16px*16px）",
    logo: "Logo(不带文字)",
    logo_help: "缩放菜单时，将会显示在管理页面左上方（建议图片大小为: 35px*40px）",
    logo_with_text: "Logo(带文字)",
    logo_with_text_help: "将会显示在管理页面左上方（建议图片大小为: 212p*40px）",
    logo_about: "关于页面图片",
    logo_about_help: "将会显示在企业版用户关于界面（建议图片大小为: 212p*40px）",
    re_upload: "重新上传",
    reset: "重置",
  },
  route: {
    project_management: "项目管理",
    cluster: "集群",
    host: "主机",
    system_setting: "系统设置",
    manifest: "版本管理",
    message_center: "消息中心",
    backup_account: "备份账号",
    system_log: "系统日志",
    complex_table: "复合表格",
    user: "用户管理",
    multi_cluster: "多集群管理",
    theme: "界面设置",
    ldap: "LDAP",
  },
  cluster: {
    cluster: "集群",
    project: "项目",
    cluster_detail: "集群详情",
    version: "版本",
    node_size: "节点数量",
    scan_policy: "扫描策略",
    creation: {
      step1: "集群信息",
      name_type: "节点命名规则",
      name_type_default_help: "节点命名将以 {集群名称}-master-1 形式",
      name_type_ip_help: "节点将直接以 ip 命名",
      name_type_host_help: "节点将以主机列表中主机名称命名",
      name: "名称",
      name_check: "校验中",
      name_help: "最大长度为 50，小写字母开始，数字或字母结束，支持小写字母、数字、以及-",
      name_invalid_err: "集群名称无效",
      provider: "提供商",
      provide_plan: "部署计划",
      provide_bare_metal: "裸金属",
      version: "版本",
      arch: "架构",
      repo_err: "请在系统设置中完善对应仓库信息",
      yum_repo: "Yum 仓库",
      yum_repo_replace_help: "此操作将会对 K8S 节点服务器原始 yum repo 文件进行备份，之后生成并仅使用 kubeoperator 的 yum repo",
      yum_repo_coexist_help: "此操作将保持K8S节点服务器原始 yum repo 文件不变，同时生成并使用 kubeoperator 的 yum repo",
      yum_repo_no_help: "此操作将保持使用 K8S 节点服务器原始 yum repo 文件，不对K8S节点服务器的 yum repo 做任何操作",

      step2: "集群设置",
      node_ip_num: "节点 IP 数量",
      pod_cidr: "Pod 网络 CIDR",
      pod_cidr_help1: "不能与 node 节点网段重复。集群最多可部署 ",
      pod_cidr_help2: " 台主机，每台主机最多容纳 ",
      pod_cidr_help3: " 个Pod",
      service_cidr: "Service 网络 CIDR",
      service_cidr_help: "不能与 node 节点网段或 pod 网段 cidr 重复",
      max_node_pod_num: "POD 数量上限/节点",
      max_cluster_service_num: "Service 数量上限/集群",
      proxy_mode: "proxy 模式",
      address: "地址",
      address_help: "非必填，默认使用所有本地地址",
      port_range: "范围",
      range_err: "请输入正确的端口范围",
      dns_cache: "dns 缓存",
      kubernetes_audit: "Kubernetes 审计",
      enable: "启用",
      disable: "禁用",
      network_help: "CIDR不能与目标IP段重叠，否则会造成初始化失败",

      step3: "运行时设置",
      runtime_type: "容器运行时",
      docker_storage_dir: "Docker 数据路径",
      containe_storage_dir: "Containerd 数据路径",
      subnet: "Container 子网",

      step4: "容器网络设置",
      multi_network: "多网络设置",
      network_interface: "网卡名称",
      network_name: "网卡",
      network_cidr: "网段",
      network_cidr_help: "多网段之间以逗号分隔",
      network_interface_fannel_help: "多网卡环境需要指定集群节点使用的网卡名称（单网卡环境可不设置）",
      network_interface_help: "多网卡环境需要指定集群节点使用的网卡名称或网段信息（单网卡环境可不设置）",
      network_type: "容器网络",
      flannel_backend: "网络模式",
      cilium_help: "Cilium 官方建议 kernel(内核) 版本至少在 4.9.17 以上",
      cilium_overlay_help: "基于封装的虚拟网络，产生所有主机。目前 VXLAN 和 Geneve 已经完成，但可以启用 Linux 支持的所有封装格式。",
      cilium_overlay_help_more: "此模式具有最小的基础设施和集成要求。它几乎适用于任何网络基础设施，唯一的要求是主机之间的IP连接。",
      cilium_native_help: "使用 Linux 主机的常规路由表。网络必须能够路由应用程序容器的IP地址，此模式适用于高级用户，需要了解底层网络基础结构。",
      cilium_native_help_more: "适用于（1. 原生 IPv6 网络、2. 与云网络路由器配合使用、3. 如果您已经在运行路由守护进程）",
      native_routing: "本地路由",
      tunnel_name: "隧道",
      flannel_backend_help_route_base: "基于路由，不适用于公有云环境;",
      flannel_backend_help_route_advantage: "优势是没有封包和解包过程，完全基于两端宿主机的路由表进行转发。",
      flannel_backend_help_route_inferiority: "劣势是要求宿主机在2层网络是互通，且路由表膨胀会导致性能降低。",
      flannel_backend_help_channel_base: "基于隧道，在任何网络环境下都可以正常工作;",
      flannel_backend_help_channel_advantage: "优势是对物理网络环境没有特殊要求，只要宿主机IP层可以路由互通即可。",
      flannel_backend_help_channel_inferiority: "劣势是封包和解包耗费CPU性能，且额外的封装导致带宽浪费。",


      step5: "组件设置",
      ingress_type: "ingress 类型",
      support_gpu: "安装GPU套件",
      etcd_data_dir: "数据根目录",
      etcd_snapshot_count: "快照交事务数",
      etcd_snapshot_count_help: "etcd 触发快照到硬盘的已提交事务的数量",
      etcd_compaction_retention: "自动压缩间隔 (小时)",
      etcd_compaction_retention_help: "用于 mvcc 键值存储的保持力，其中 0 表示关闭自动压缩",
      etcd_max_request: "请求大小限制 (MiB)",
      etcd_max_request_help: "etcd Raft 消息最大字节数",
      etcd_quota_backend: "存储大小限制 (GB)",

      step6_of_bare_metal: "节点信息",
      node_help: "主机需要先在项目-资源中授权，并且在主机列表中为运行中状态",
      master_select_help: "Master 节点的数量必须为1或者3",
      node_number_help: "当前配置下，集群内最多可允许部署 {0} 个节点",
      cluster_high_availability: "集群高可用",
      default: "默认",
      default_help: "worker 节点会部署 haproxy，所有 worker 节点组件均使用本地部署的 haproxy 访问 apiserver。",
      vip_help: "master 节点会部署 haproxy + keepalive，所有 worker 节点组件均使用 vip 地址访问 apiserver。",
      port: "端口",

      step6_of_plan: "部署计划",
      worker_num: "Worker 数量",
      master_schedule_type: "Master 调度",

      step7: "配置预览",
      base_setting: "基本配置"
    },
    upgrade: {
      current_version: "当前版本",
      upgrade_version: "升级版本",
      upgrade_help: "不支持K8s跨大版本升级或升级到未启用的K8s版本，请在版本管理中确认。",
    },
    import: {
      auto_input: "配置一键默认",
      authenticate_mode: "认证模式",
      certificate: "证书",
      config_file: "kubeconfig 文件",
      config_content: "config 内容",
      import_cluster: "集群导入",
      credential_rules: "请完善主机凭据信息！",
      port_rules: "请完善主机端口信息！",
      is_ko_cluster: "是否为 KubeOperator 自建集群",
      load_ko_cluster_info: "获取集群信息",
      provisioner_help: "当前仅支持 nfs 以及 external-ceph 同步，其他存储提供商后续支持。",
      provisioner_rule: "存在不满足同步条件的存储提供商(类型是为可同步类型)，请确认。",
      nfs_version_rule: "nfs 版本无法为空，请确认。",
      ko_cluster_info: "集群信息",
      batch_edit_port: "批量修改端口",
      batch_edit_credential: "批量修改凭据",
      other_info: "其他信息",
      api_server_help: "例如: https://172.16.10.100:8443",
      router_help: "装有 kube-proxy 的任意节点的且可以被访问到的 IP 地址",
      import_help: "单击可启用编辑，",
      import_help2: "详细操作可参照官方文档",
      import_name: "导入集群名称为原集群名称：",
      import_version_help: "若导入集群版本不存在于 KubeOperator 支持集群版本库中，集群工具将使用默认配置。",
      import_version_link: "查看 KubeOperator 支持集群版本",
    },
    delete: {
      delete_cluster: "集群删除",
      delete_cluster_help: "此操作无法撤消，这将永久删除 {0} 集群",
      is_uninstall: "卸载集群",
      sure_uninstall: "将执行集群卸载脚本。",
      is_force: "强制删除",
      force_delete: "强制删除，将忽略集群卸载脚本在执行过程中的错误信息，最终删除集群元数据。",
      submit_delete_input: "请输入 {0} 进行删除确认",
    },
    health_check: {
      health_check: "健康检查",
      level: "状态",
      message: "消息",
      method: "方法",
      result: "结果",
      recover: "恢复",
      CHECK_HOST_SSH_CONNECTION: "检测节点可连接性",
      CHECK_K8S_TOKEN: "检测集群可连接性",
      CHECK_K8S_API: "检测集群 API 是否已就绪",
      CHECK_K8S_NODE_STATUS: "检测集群节点是否同步",
      CHECK_KUBE_ROUTER: "检测集群代理 IP 可用性",

      STATUS_SUCCESS: "成功",
      STATUS_WARNING: "警告",
      STATUS_FAILED: "失败",
      STATUS_ERROR: "错误",
      STATUS_RECOVERD: "已恢复",
      STATUS_SOLVED_MANUALLY: "待解决",

      RECOVER_SYNC_NODE_STATUS: "节点列表中，强制删除节点以卸载相关集群服务(需手动)",
      RECOVER_SYNC_ROUTER_IP: "更新集群代理 IP",
      RECOVER_SYNC_TOKEN: "重新获取集群 Token",
      RECOVER_CONN_CONF: "更新集群连接信息(需手动)",
      RECOVER_HOST_CONN: "检查节点主机 SSH 服务、主机网络状况(需手动)",
      RECOVER_API_CONN: "检查集群服务是否可用、集群网络是否可用(需手动)",
    },
    detail: {
      tag: {
        overview: "概览",
        node: "节点",
        namespace: "命名空间",
        storage: "存储",
        event: "事件",
        monitor: "监控",
        log: "日志",
        tool: "工具",
        component: "组件",
        task: "任务",
        backup: "备份",
        security: "CIS扫描",
        grade: "集群评分",
      },
      overview: {
        source: "来源",
        base_info: "基础信息",
        capacity_info: "容量信息",
        statistical_info: "统计信息",
        cpu: "CPU 使用率",
        memory: "内存 使用率",
        docker: "容器组",
        connect: "执行 WebKubeCtl 命令行",
        download_kube_config: "下载 KubeConfig 文件",
        open_in_new_windows: "在新的窗口中打开",
      },
      node: {
        increment: "worker 增量",
        operator_help: "导入的外部集群暂不支持扩缩容",
        host: "worker 节点",
        node_detail: "节点详情",
        base_infomation: "基础信息",
        label: "标签",
        status: "状态",
        active: "激活",
        cordon: "驱散",
        mode: "模式",
        safe: "安全",
        force: "强制",
        safe_cordon_help: "如果节点拥有独立的 Pod 或临时的数据，它将被隔离但不会被驱散。",
        force_drain_help1: "永久删除：",
        force_drain_help2: "1.  独立 Pods 和它们的数据",
        force_drain_help3: "2.  配置了Empty Dir卷的Pods和它们的数据",
        existing_cordoned: "存在已驱逐节点",
        existing_actived: "存在已激活节点",
        is_master_node: "主节点禁止删除",
        drain_success: "节点强制驱逐成功",
        node_expand: "集群扩容",
        node_shrink: "集群缩容",
        node_expand_help: "当前配置下，集群内最多可扩容 {0} 个节点",
      },
      component: {
        ensure_component_sync: "是否确认同步下列组件？",
        operator_help: "同类型组件无法同时启用，如需切换需要先禁用已有的同类型组件。",
        METRICS_SERVER_HELPER: "将在集群内启用 metric-server 服务，用于提供集群核心监控数据。",
        TRAEFIK_HELPER: "将在集群内启用 traefik 服务，用于为集群提供更简单的 HTTP 反向代理和负载均衡器。",
        NGINX_HELPER: "将在集群内启用 nginx 服务，用于为集群提供高性能的 HTTP 和反向代理WEB服务器。",
        GPU_HELPER: "将在集群内启用 gpu 服务，用于为集群提供 gpu 能力",
        DNS_CACHE_HELPER: "将在集群内启用 dns-cache 服务，用于为集群提供 DNS 解析记录缓存。",
        ISTIO_HELPER: "将在集群内启用 istio 服务，用于为集群提供一种简单的方式来为已部署的服务建立网络，该网络具有负载均衡、服务间认证、监控等功能。",
        NPD_HELPER: "将在集群内启用 npd(node-problem-detector) 服务，用于为集群收集节点问题，并使它们对上游层可见。",
      },
      namespace: {
        before_delete: "删除失败,该命名空间下已存在工具：",
      },
      storage: {
        operator_help: "导入的集群暂不支持存储提供商添加",
        type: "类型",
        storage_class: "存储类",
        storage_clas_create: "添加存储类",
        provisioner_name: "提供商名称",
        provisioner: "存储提供商",
        provisioner_short: "提供商",
        provisioner_create: "添加存储提供商",
        provisioner_exist: "该存储提供商已存在",
        provisioner_exist_help: "添加集群中已存在的存储提供商，一般用于导入集群的存储提供商同步",
        provisioner_import_help: "该资源类型与存储提供商类型不匹配，请重试!",
        storage_class_exist: "此存储提供商已经绑定到存储类，不能删除！",
        disk_name: "磁盘名称",
        disk_name_help: "填写磁盘名称，多块磁盘使用逗号分隔，例如：'sdb,sdc'",
        is_block_enable: "是否启用块存储",
        cinder_version_help: "当前仅支持v3版本",
        vsphere_select_help: "VMware 环境最低要求：1. vCenter 6.7 Update 3， 2. ESXi v6.7.0",
        deploy_mode: "部署类型",
        multi_path_networking: "多路径组网",
        product: "产品",
        manage_url: "管理 URL",
        user_name: "用户名",
        password: "密码",
        storage_pool: "存储池",
        logic_port: "逻辑端口IP",
        business_ip: "iscsi业务IP",
        logic_port_help: "多个逻辑端口IP使用逗号分隔，例如：'test1,test2'",
        business_ip_help: "多个业务IP使用逗号分隔，例如：'10.1.1.1,10.1.1.2'",
        vcenter_host: "vCenter 主机",
        vcenter_port: "vCenter 端口",
        vcenter_username: "vCenter 用户名",
        vcenter_password: "vCenter 密码",
        ensure_provisioner_sync: "是否确认同步下列存储提供商？",
        start_provisioner_sync: "存储提供商同步已开始，请稍候...",
        reclaim_policy: "回收策略",
        volume_binding_mode: "卷绑定模式",
        capacity: "容量",
        source: "来源",
        class: {
          clone_form_help: "可选，格式为存储后端名.原卷名",
          clone_speed_help: "可选，默认值3，支持1~4，4速度最快",
          storage_policy_type: "存储策略类型",
          storage_policy: "存储策略",
          build_in: "内置",
          custom: "自定义",
        },
      },
      monitor: {
        monitor_help: "监控服务未启用，请先在集群工具列表中启用 Prometheus",
        usage: "用量",
        cpu_usage: "CPU 用量",
        cpu_avg_load: "CPU 平均负载",
        memory_usage: "内存用量",
        minute: "分钟",
        minutes: "分钟",
        hour: "小时",
        hours: "小时",
        disk_usage: "磁盘用量",
        disk_transfer: "磁盘吞吐",
        inode_usage: "Inode 用量",
        net_transfer: "网络带宽",
        read: "读",
        write: "写",
        in: "入",
        out: "出",
        step: "采集间隔",
        all_node: "全部节点",
        last_x_minutes: "最近 {0} 分钟",
        last_x_hours: "最近 {0} 小时",
        last_x_days: "最近 {0} 天",
      },
      event: {
        msg_info: "信息",
        msg_type: "类型",
        component: "组件",
        enable_npd: "启用 NPD",
        enable_npd_success: "NPD 启用成功",
        disable_npd_success: "NPD 禁用成功",
      },
      log: {
        log_help: "日志服务未启用，请先在集群工具列表中启用 Logging 或 Loki",
        time: "时间",
        msg_info: "消息内容",
        monitor_node: "监控节点",
        label: "标签",
        value: "标签值",
        match_info: "匹配内容",
        match_info_quick: "按 匹配内容 查询",
      },
      tool: {
        sync_tool: "同步",
        sync_tool_help1: "同步将进行以下两步操作",
        sync_tool_help2: "同步集群工具状态",
        sync_tool_help3: "同步 chart 仓库",
        flex_ip: "弹性 ip",
        enable_flex_ip_help: "将使用 master-01 节点弹性 ip 作为工具跳转地址",
        disable_flex_ip_help: "将使用 master-01 节点 ip 作为工具跳转地址",
        enable_title: "启用工具",
        disable_title: "禁用工具",
        info_title: "提示信息",
        err_title: "错误信息",
        upgrade_title: "版本升级",
        disable_show_msg: "禁用此工具会导致数据丢失,是否继续？",
        enable_storage: "启用存储",
        storage_class: "存储类",
        storage_size: "大小（Gi）",
        data_retention: "数据保留（天）",
        search_index: "前缀索引",
        search_index_help: "例如：logstash",
        replicas: "副本数量",
        max_replicas_num: "最大副本数为",
        hip_memory: "堆内存(GB)",
        default_hip_memory: "默认值为1G",
        password: "密码",
        password_re: "确认密码",
        log_err_msg: "logging 和 loki 不支持同时启用！",
        grafana_err_msg: "请先启用 promethues 作为默认数据源！",
        grafana_password_help: "密码不一致",
      },
      istio: {
        err_title: "错误信息",
        cpu_limit: "CPU 限制(m)",
        memory_limit: "Memory 限制(Mb)",
        cpu_request: "CPU 预留(m)",
        memory_request: "Memory 预留(Mb)",
        trace: "跟踪抽样比例(%)",
        gateways_type: "网关服务类型",
      },
      backup: {
        backup_strategy: "备份策略",
        backup_interval: "备份间隔(天)",
        retained_number: "保留份数",
        backup_account: "备份账号",
        backup_account_rule: "velero 备份仅支持 OSS、S3、MINIO",
        backup_account_help: "备份账号需要先授权到集群",
        status: "状态",
        local_recover: "本地文件恢复",
        backup_start: "已经开始备份！请稍后查看日志",
        recover_start: "已经开始恢复！请稍后查看日志",
        local_recover_tips: "请上传原始文件，不要上传压缩文件",
        file: "文件",
        mo_file_selected: "未选择文件",
        file_select: "文件选择",
        backup_now: "立即备份",
        backup_list: "备份列表",
        backup_location: "备份位置",
        backup_recover: "备份/恢复",
        backup_log: "日志",
        recover: "恢复",
        utc_zone: "velero 使用 utc 时间，请根据具体时区进行调整",
        recover_success: "开始恢复，稍后请查看日志",
        CLUSTER_RESTORE: "ETCD 集群恢复",
        CLUSTER_BACKUP: "ETCD 集群备份",
        CLUSTER_VELERO_RESTORE: "Velero 集群恢复",
        CLUSTER_VELERO_BACKUP: "Velero 集群备份",
        SUCCESS: "成功",
        Running: "运行中",
        restore_message: "确定用此备份文件恢复？",
        FAILED: "失败",
        detail: "详情",
        backup_help: "超过保留份数,时间最早的备份文件会被删除",
        velero_backup: "Velero 备份",
        velero_restore: "Velero 恢复",
        velero_describe: "描述",
        velero_log: "日志",
        velero_detail: "详情",
        velero_type: "类型",
        velero_namespace_include: "包含 Namespace",
        velero_namespace_exclude: "排除 Namespace",
        velero_resource_include: "包含资源",
        velero_resource_exclude: "排除资源",
        velero_backup_retention: "备份保存时长",
        velero_backup_setting: "配置",
        velero_backup_labels: "备份标签",
        velero_backup_Selector: "选择器",
        velero_include_cluster_resource: "是否包含集群资源",
        velero_type_normal: "手动",
        velero_type_schedule: "定时",
        velero_help: "以下项目如果全不填,则为全量备份",
        velero_list: "备份列表",
        velero_schedule: "Velero 任务",
        velero_schedule_list: "任务列表",
        velero_schedule_cycle: "周期",
        velero_schedule_help: "每天3点创建备份",
        velero_config: "Velero 配置"
      },
      security: {
        start_time: "开始时间",
        end_time: "结束时间",
        cis_result: "Cis 扫描结果",
        code: "编号",
        description: "描述",
        advise: "建议",
        start_cis: "是否开始CIS扫描任务？",
        create_task: "创建任务",
        auto: "自适应（根据当前 kubernetes 版本自适应扫描策略）"
      },
      f5: {
        big_ip_addr: "BIG-IP 地址",
        big_ip_user_name: "BIG-IP 用户名",
        big_ip_password: "BIG-IP 密码",
        big_ip_public: "BIG-IP 外网IP",
      },
      grade: {
        danger: "严重",
        warning: "警告",
        pass: "通过",
        total: "总量",
        health_checks: "健康检查",
        images: "镜像",
        networking: "网络",
        reliability: "可靠性",
        resources: "资源",
        security: "安全",
        efficiency: "效率"
      },
    },
  },
  task: {
    FAILED: "任务失败",
    REDO: "任务重试",
    name: "任务名称",
    task_detail: "任务详情",
    task_id: "任务 ID",
    message: "错误信息",
    condition_loading: "正在等待执行，请稍候...",
    condition_detail: "状态详情",
    CheckAPIStatus: "检测 API 状态",
    DeleteNode: "删除节点",
    EnsureInitTaskStart: "调度任务",
    EnsurePrepareBaseSystemConfig: "准备系统环境",
    EnsurePrepareContainerRuntime: "初始化容器引擎",
    EnsurePrepareKubernetesComponent: "准备 Kubernetes 组件",
    EnsurePrepareLoadBalancer: "准备负载均衡器",
    EnsurePrepareCertificates: "准备 CA 证书",
    EnsureInitEtcd: "初始化 ETCD",
    EnsureInitMaster: "初始化控制平面",
    EnsureInitWorker: "初始化工作负载",
    EnsureInitNetwork: "初始化网络",
    EnsureInitHelm: "初始化Helm",
    EnsureInitMetricsServer: "初始化监控组件",
    EnsureInitIngressController: "初始化服务暴露组件",
    EnsurePostInit: "配置集群",
    EnsureBackupETCD: "备份集群",
    EnsureUpgradeRuntime: "升级容器引擎",
    EnsureUpgradeETCD: "升级 ETCD",
    EnsureUpgradeKubernetes: "升级 Kubernetes",
    EnsureUpdateCertificates: "更新证书",
    EnsureUpgradeTaskStart: "调度任务",
    CLUSTER_CREATE: "集群创建",
    CLUSTER_DELEDE: "集群删除",
    CLUSTER_UPGRADE: "集群升级",
    CLUSTER_NODE_EXTEND: "节点扩容",
    CLUSTER_NODE_SHRINK: "节点缩容",
    CLUSTER_RESTORE: "ETCD 集群恢复",
    CLUSTER_BACKUP: "ETCD 集群备份",
    CLUSTER_VELERO_RESTORE: "Velero 集群恢复",
    CLUSTER_VELERO_BACKUP: "Velero 集群备份",

    EnsureAddWorkerTaskStart: "调度任务",
    EnsureAddWorkerBaseSystemConfig: "准备系统环境",
    EnsureAddWorkerContainerRuntime: "初始化容器引擎",
    EnsureAddWorkerKubernetesComponent: "准备 Kubernetes 组件",
    EnsureAddWorkerLoadBalancer: "准备负载均衡器",
    EnsureAddWorkerCertificates: "准备 CA 证书",
    EnsureAddWorkerWorker: "初始化工作负载",
    EnsureAddWorkerNetwork: "初始化网络",
    EnsureAddWorkerPost: "配置集群",
    EnsureAddWorkerStorage: "初始化存储提供商",

    cluster_task: "集群级任务",
    cluster_task_help: "需要单独执行的任务，如集群创建、扩缩容、升级备份等...",
    component_task: "组件级任务",
    component_task_help: "允许多个任务同时执行，相互之间不影响，如组件、存储提供商启用...",
  },
  host: {
    batch: "批量操作",
    batch_port_operation: "批量端口修改",
    batch_credential_operation: "批量凭据修改",
    batch_list: "批量修改下列主机<{0}>信息",
    batch_length_error: "当前未选择批量操作主机，请先选择！",
    detail: "详情",
    host: "主机",
    flex_ip: "弹性 ip",
    enable_flex_ip: "开启弹性 ip",
    disable_flex_ip: "禁用弹性 ip",
    memory: "内存(MB)",
    os: "操作系统",
    architecture: "架构",
    port: "端口",
    ensure_host_sync: "是否确认同步下列主机？",
    start_host_sync: "主机同步已开始，请稍候...",
    template_download: "模版下载",
    not_support_format: "不支持的文件格式",
    project_auth: "项目授权",
    cluster_auth: "集群授权",
    cluster_auth_help: "新增主机只能授权到手动模式集群中使用",
    new_credential: "新建凭据",
    type: "类型",
    credential: "凭据",
    credential_type: "凭据类型",
    credential_name: "凭据",
    exists_credential: "已存在凭据",
    ip: "IP",
    gpu: "GPU(个)",
    err_title: "错误信息",
    base_info: "基础信息",
    disk_size: "磁盘容量",
    cpu: "CPU(核)",
    size: "大小",
    gpu_info: "显卡信息",
    authorize_project: "授权到项目",
    existing_authorized: "存在已授权主机",
    existing_unauthorized: "存在未授权主机",
    project: "项目"
  },
  message: {
    message: "消息",
    message_center: "消息中心",
    message_receiver: "接受源",
    message_subscribe: "消息订阅",
    content: "消息内容",
    type: "类型",
    level: "级别",
    mark_as_read: "标记为已读",
    dingTalk_phone: "钉钉手机号",
    dingTalk_phone_help: "用于钉钉接收告警消息",
    work_wechat_id: "企业微信用户ID",
    work_wechat_id_help: "用于企业微信接收告警消息 ",
    work_wechat_url_help: "userid如何查找?",
    email: "邮箱",
    message_type: "消息类型",
    message_in_station: "站内信",
    mail: "邮件",
    work_wechat: "企业微信",
    dingTalk: "钉钉",
    message_system: "系统消息",
    message_cluster: "集群消息",
    receive_setting: "接收设置",
    user: "接收用户",
    loading: "加载中...",
    title: {
      CLUSTER_EVENT_WARNING: "集群事件告警",
      CLUSTER_INSTALL: "集群安装",
      CLUSTER_IMPORT: "集群导入",
      CLUSTER_REMOVE_WORKER: "节点删除",
      CLUSTER_ADD_WORKER: "添加节点",
      CLUSTER_BACKUP: "集群备份",
      CLUSTER_ENABLE_PROVISIONER: "启用存储提供商",
      CLUSTER_DISABLE_PROVISIONER: "禁用存储提供商",
      CLUSTER_ENABLE_COMPONENT: "启用集群组件",
      CLUSTER_DISABLE_COMPONENT: "禁用集群组件",
      CLUSTER_UN_INSTALL: "集群卸载",
      CLUSTER_UPGRADE: "集群升级",
      CLUSTER_DELETE: "集群删除",
      CLUSTER_SCALE: "集群伸缩",
      CLUSTER_RESTORE: "集群恢复",
      LICENSE_EXPIRE: "License 到期",
      CLUSTER_OPERATOR: "集群操作"
    },
    detail: {
      basicInformation: "基本信息",
      message_detail: "消息详情",
      clusterName: "集群",
      host: "主机",
      name: "名称",
      type: "类型",
      kind: "类别",
      component: "组件",
      detail: "详情",
      namespace: "命名空间",
      cause: "原因",
      time: "时间"
    },
    READ: "已读",
    UNREAD: "未读"
  },
  user: {
    username: "用户名",
    password: "密码",
    confirm_password: "确认密码",
    role: "角色",
    email: "邮箱",
    user: "用户",
    type: "来源",
    ldap: "LDAP",
    local: "本地"
  },
  manifest: {
    title: "版本管理",
    detail: "详情",
    enable: "启用",
    enable_message: "版本 {0} 启用成功！",
    disable_message: "版本 {0} 禁用成功！",
    component: "组件",
    version: "版本",
    see_documentation: "参阅文档",
    manifest_help: "离线包中默认携带一个最新的 Kubernetes 版本。如果当前是离线环境，则需要手动执行脚本来生成目标版本的 Kubernetes 离线包，并将其推送至 nexus 仓库。"
  },
  system_log: {
    title: "系统日志",
    operation: "操作",
    operation_info: "操作内容",
    query_placeholder: "按 名称/操作/操作内容 搜索"
  },
  automatic: {
    name: "自动模式",
    cloud_provider: "云提供商",
    datacenter: "数据中心",
    basic: "基本信息",
    detail: "详情",
    kubepi_project_help: "此处为项目管理员登录凭据（若项目 - 集群存在绑定用户，则集群管理员绑定用户优先）。",
    kubepi_cluster_help: "此处为集群管理员登录凭据。",
    kubepi_admin_help: "此处为 admin 用户登录凭据，需要和 Dashboard 用户管理中设置的密码保持一致。",
    region: {
      name: "区域",
      basic: "基本信息",
      config: "配置参数",
      description: "区域(Region)：与公有云中的区域（Region）概念相似，比如阿里云华北 1。对于 vSphere，区域对应于 Datacenter。",
      vcenter_host: "Vcenter 主机",
      vcenter_port: "Vcenter 端口",
      vcenter_username: "用户名",
      vcenter_password: "密码",
      openstack_identity: "identity",
      openstack_project: "项目ID",
      openstack_domain: "domainName",
      fusionCompute_server: "FusionCompute 服务地址",
      get_datacenter: "获取数据中心",
      vcenter_api_help: "vCenter API地址",
      vcenter_user_help: "访问 vCenter 的用户名，例如 administrator@vsphere.local",
      vcenter_password_help: "访问 vCenter 的密码",
      openstack_keystone_help: "OpenStack keystone地址",
      openstack_username_help: "访问 OpenStack 的用户名",
      openstack_password_help: "访问 OpenStack 的密码",
      openstack_project_help: "OpenStack 项目ID",
      openstack_domain_help: "OpenStack Domain Name",
      fusionCompute_server_help: "FusionCompute 的 API 服务地址，例如: https://10.1.240.11:7443",
      fusionCompute_user_help: "访问 FusionCompute 的用户名，例如: admin",
      fusionCompute_password_help: "访问 FusionCompute 的密码",
    },
    zone: {
      name: "可用区",
      description: "可用区(Zone): 与公有云中的 AZ 概念相似，可以理解为区域中具体的机房，比如北京1区，北京2区。对于 vSphere，可用区对应于集群，也可以对应于集群下面的资源池",
      ready: "就绪",
      uploadImageError: "上传镜像失败",
      initinitializingializing: "初始化中",
      config: "配置参数",
      compute: "计算",
      cluster: "集群",
      resource_pool: "资源池",
      datastore: "存储",
      value: "按剩余量",
      usage: "按使用率",
      datastore_type: "放置方式",
      template: "模版",
      template_type: "模版类型",
      default: "默认模版",
      customize: "已有模版",
      template_config: "自定义模版",
      network: "网络",
      network_adapter: "网络适配器",
      security_group: "安全组",
      ip_type: "IP类型",
      floating_ip: "浮动IP",
      subnet: "子网",
      storageType: "存储类型",
      switch: "交换机",
      nfs_address: "NFS服务器地址",
      nfs_port: "NFS服务端口",
      nfs_folder: "NFS服务器文件夹",
      nfs_username: "NFS服务器用户名",
      nfs_password: "NFS服务器密码",
      old_datastores: "已选存储",
      new_datastores: "新增存储",
      initializing: "初始化中",
      port: "端口",
      resource_type: "资源类型",
      host: "主机",
      portgroup: "端口组"
    },
    plan: {
      name: "部署计划",
      description: "部署计划 (Plan): 在 KubeOperator 中用来描述在哪个区域下，哪些可用区中，使用什么样的机器规格，部署什么类型的集群的一个抽象概念",
      deploy_template: "部署模型",
      SINGLE: "一主多节点",
      MULTIPLE: "多主多节点",
      project_auth: "项目授权",
      master_model: "Master 规格",
      worker_model: "Worker 规格",
      config: "规格参考"
    },
    vm_config: {
      name: "虚拟机配置",
      cpu: "CPU(核)",
      memory: "内存(GB)",
      name_validate_msg: "支持英文和数字",
      cpu_invalid: "CPU 范围 1～1000",
      mem_invalid: "内存 范围 1～1000",
      disk: "磁盘(GB)"
    },
    ip_pool: {
      name: "IP池",
      config: "IP池配置",
      subnet: "子网",
      ip_usage: "使用情况",
      gateway: "网关",
      ip_start: "开始IP",
      ip_end: "结束IP",
      dns1: "DNS1",
      dns2: "DNS2",
      description: "描述",
      address: "IP",
      status: "状态",
      ip_list: "IP列表",
      ip_available: "可用",
      ip_lock: "占用",
      ip_used: "使用中",
      ip_reachable: "可达",
      subnet_help: "172.1.10.0/24",
      ip_start_help: "172.1.10.1",
      ip_end_help: "172.1.10.10",
      gateway_help: "172.1.10.254",
      dns1_help: "8.8.8.8",
      dns2_help: "114.114.114.114",
    },
    template_config: {
      name: "自定义模版配置",
      qcow2_path: "qcow2文件位置",
      vmdk_path: "vmdk文件位置",
      ovf_path: "ovf文件位置",
      template_name: "模版名称"
    }
  },
  project: {
    project: "项目",
    member: "成员管理",
    resource: "资源管理",
    CLUSTER_MANAGER: "集群管理员",
    PROJECT_MANAGER: "项目管理员",
    description: "描述",
    add_project_manager: "添加项目管理员",
    add_project_resource: "添加资源",
    add_cluster_manager: "添加集群管理员",
    key_words: "请输入姓名",
    list: "项目列表",
    header_description: "左侧是项目-集群树，右侧是成员和资源管理（主机、备份账号需要授权到目标集群才能进行扩容、备份等操作）",
  },
  credential: {
    name: "凭据名称",
    credential: "凭据",
    username: "用户名",
    password: "密码",
    privateKey: "密钥",
    type: "类型"
  },
  backup_account: {
    name: "备份账号",
    bucket: "桶",
    select_placeholder: "请选择",
    table: {
      bucket: "桶",
      endpoint: "Endpoint",
      region: "区域",
      accountName: "账户名称",
      accountKey: "账户密钥",
      address: "地址",
      port: "端口",
      username: "用户名",
      password: "密码",
      path: "路径",
    }
  },
  setting: {
    registry: "仓库",
    tips: "默认仓库为部署机Nexus，管理端口为:",
    nexus_passwd: "该操作是将 nexus 仓库登录凭据同步到 KubeOperator",
    address: "地址",
    username: "账号",
    password: "密码",
    kubepi_conn_successful: "Kubepi 连接性检测成功！",
    conn_successful: "仓库连接性检测成功！",
    sync_nexus_password: "同步 Nexus 密码",
    password_help: "admin 用户默认密码为 admin123",
    ntp: "NTP",
    email: "邮箱",
    license: "许可证",
    apply_licensee: "申请许可证",
    message: "消息",
    credential: "凭据",
    ntpServer: "NTP服务器",
    table: {
      registry: {
        protocol: "协议",
        hostname: "地址",
        arch: "CPU架构",
        default_password: "默认密码",
        registry_address: "仓库地址",
        hostname_help: "默认为部署 KubeOperator 的服务器 IP，将使用该 IP 来访问 nexus 仓库",
        repo_port_help: "Web 访问 Nexus 的端口，也应用于 Yum/APT 及 wget 下载",
        repo_registry_port_help: "使用 docker pull 命令从 Nexus 仓库下载镜像所使用的端口",
        repo_registry_hosted_port_help: "使用 docker push命令上传镜像到 Nexus 仓库所使用的端口",
        registry_and_repo_err: "Registry 和 Repo 仓库端口冲突，请修改后重新提交",
        registry_and_registry_hosted_err: "Registry 和 RegistryHosted 仓库端口冲突，请修改后重新提交",
        repo_and_registry_hosted_err: "Repo 和 RegistryHosted 仓库端口冲突，请修改后重新提交",
      },
      mail: {
        smtp: "SMTP 地址",
        port: "端口",
        username: "用户名",
        password: "密码",
        testUser: "测试用户",
        status: "状态"
      },
      ldap: {
        address: "地址",
        port: "端口",
        username: "用户名",
        password: "密码",
        filterDN: "用户过滤 DN",
        filterRule: "用户过滤规则",
        status: "状态",
        ldapHelper: " 注意：没有邮箱的用户不会被同步，与本地用户登录名重复的也不会被同步!",
        ldap_mapping: "用户属性映射",
        ldap_mapping_helper:"用户属性映射代表怎样将LDAP中用户属性映射到KubeOperator用户上，name,email 是KubeOperator的用户需要属性",
        sync_success: "开始同步，请稍后查看结果",
        ldap_test: "测试连接",
        test_result: "连接成功,匹配到{count}个用户",
        test_login: "测试登录",
        login_success: "测试登录成功",
        login_failed: "登录失败",
        import_user: "导入用户",
        import_enable: "是否可导入",
        import_user_success: "导入成功",
        import_user_failed: "导入失败用户{user}",
        ldap_remake: "重置",
        time_limit: "连接超时时间",
        size_limit: "搜索分页数量",
        ldap_tls: "tls",
        ldap_helper: "注意：无法获取到 Name 映射属性的用户不会匹配",
      },
      license: {
        title: "导入许可证",
        corporation: "公司",
        count: "数量",
        expiration: "过期时间",
        edition: "版本",
        status: "状态",
        valid: "有效",
        invalid: "无效",
        expired: "已到期",
        licenseFile: "许可证",
        communityEdition: "社区版"
      },
      message: {
        wechat: "企业微信",
        dingTalk: "钉钉",
        testUser: "测试用户",
        status: "状态",
        webhookAddress: "webhook地址",
        dingTalkConcept: "钉钉机器人消息发送设置",
        dingTalkLimit: "钉钉消息频率限制",
        wechatConcept: "企业微信基本概念",
        wechatLimit: "企业微信消息频率限制",
        wechatSetting: "企业微信设置",
        dingTalkSetting: "钉钉设置",
      }
    },
    option: {
      addRegistry: "添加仓库",
      editRegistry: "编辑仓库",
      addCredential: "添加 SSH 凭据",
      editCredential: "编辑 SSH 凭据",
      addLicense: "添加许可"
    },
    helpInfo: {
      inputPassword: "请输入密码",
      messageInfo: "说明：由于每个企业的消息限制不同 所以KubeOperator没有做主动限制 请根据自身情况酌情使用",
    }
  },
  multi_cluster: {
    sync_detail: "同步详情",
    multi_cluster: "多集群",
    repository_setting: "仓库设置",
    basic_setting: "基础设置",
    senior_setting: "高级设置",
    port_setting: "端口设置",
    address: "地址",
    branch: "分支",
    auth: "认证",
    username: "用户名",
    password: "密码",
    sync_interval: "同步间隔(分钟)",
    pull_timeout: "拉取超时时间(分钟)",
    edit: "编辑",
    cluster_list: "集群列表",
    selected_clusters: "选择集群",
    relation_management: "关联管理",
    log: "日志"
  }
}

export default {
  ...el,
  ...fu,
  ...message
}
