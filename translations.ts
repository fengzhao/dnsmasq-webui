export const translations = {
  zh: {
    common: {
      apply: "应用更改",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      save: "保存",
      loading: "处理中...",
      search: "搜索...",
      actions: "操作",
      status: "状态"
    },
    nav: {
      dashboard: "控制面板",
      dns_records: "DNS 记录",
      dhcp_leases: "DHCP 租约",
      ad_blocking: "广告拦截",
      config: "配置编辑",
      logs: "流量日志",
      sys_load: "系统负载"
    },
    header: {
      service_active: "服务正常",
      service_stopped: "服务停止"
    },
    dashboard: {
      traffic_analysis: "流量分析",
      activity_log: "24小时活动记录",
      node_info: "节点信息",
      config_path: "配置文件路径",
      mem_usage: "内存占用",
      restart_service: "重启服务",
      mode: {
        sidecar: "侧车模式",
        standalone: "容器模式",
        native: "宿主机模式"
      }
    },
    dns: {
      ai_title: "AI 智能添加",
      ai_desc: "描述您想添加的记录，例如：为 192.168.1.20 添加名为 pi.local 的记录",
      ai_placeholder: "输入您的需求...",
      ai_btn: "生成记录",
      domain: "域名",
      ip: "IP 地址",
      type: "类型",
      desc: "备注",
      manual_add: "手动添加记录"
    },
    dhcp: {
      title: "活动租约",
      desc: "当前局域网中已分配的 IP 地址",
      hostname: "主机名",
      mac: "MAC 地址",
      expires: "过期时间",
      to_static: "转为静态",
      release: "释放"
    },
    config: {
      ai_scan: "AI 智能审计",
      apply_btn: "应用并重启",
      valid: "配置合法且已应用",
      invalid: "配置存在错误",
      help_title: "快速参考",
      ai_insight: "AI 智能解析",
      security: "安全审计",
      optimization: "优化建议"
    },
    logs: {
      title: "实时流量",
      live: "实时",
      filter: "过滤域名...",
      clear: "清空日志",
      time: "时间",
      client: "客户端",
      domain: "域名",
      reply: "响应时间"
    }
  },
  en: {
    common: {
      apply: "Apply",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      save: "Save",
      loading: "Processing...",
      search: "Search...",
      actions: "Actions",
      status: "Status"
    },
    nav: {
      dashboard: "Dashboard",
      dns_records: "DNS Records",
      dhcp_leases: "DHCP Leases",
      ad_blocking: "Ad Blocking",
      config: "Configuration",
      logs: "Traffic Logs",
      sys_load: "System Load"
    },
    header: {
      service_active: "Service Active",
      service_stopped: "Service Stopped"
    },
    dashboard: {
      traffic_analysis: "Traffic Analysis",
      activity_log: "24H Activity Log",
      node_info: "Node Info",
      config_path: "Config Path",
      mem_usage: "Memory Usage",
      restart_service: "Restart Service",
      mode: {
        sidecar: "Docker Sidecar",
        standalone: "Standalone Container",
        native: "Native Host"
      }
    },
    dns: {
      ai_title: "AI Smart Add",
      ai_desc: "Describe what you want, e.g., 'Add record for pi.local at 192.168.1.20'",
      ai_placeholder: "Type your request...",
      ai_btn: "Generate",
      domain: "Domain",
      ip: "IP Address",
      type: "Type",
      desc: "Description",
      manual_add: "Add Record Manually"
    },
    dhcp: {
      title: "Active Leases",
      desc: "Currently assigned IP addresses in the network",
      hostname: "Hostname",
      mac: "MAC Address",
      expires: "Expires In",
      to_static: "Static",
      release: "Release"
    },
    config: {
      ai_scan: "AI Scan",
      apply_btn: "Apply & Restart",
      valid: "Config valid and applied",
      invalid: "Config error detected",
      help_title: "Quick Reference",
      ai_insight: "AI Insight",
      security: "Security Audit",
      optimization: "Optimization"
    },
    logs: {
      title: "Live Traffic",
      live: "LIVE",
      filter: "Filter domains...",
      clear: "Clear Logs",
      time: "Time",
      client: "Client",
      domain: "Domain",
      reply: "Reply Time"
    }
  }
};