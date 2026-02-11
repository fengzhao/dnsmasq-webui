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
      service_active: "核心在线",
      service_stopped: "核心离线"
    },
    dashboard: {
      traffic_analysis: "流量趋势分析",
      activity_log: "24H 活动实时记录",
      node_info: "核心节点信息",
      config_path: "配置文件路径",
      mem_usage: "实时内存占用",
      restart_service: "强制重启服务"
    },
    dns: {
      ai_title: "AI 智能解析助手",
      ai_desc: "描述您的网络映射需求，AI 将自动为您生成 Dnsmasq 标准格式记录",
      ai_placeholder: "例如：给我的 NAS 分配 nas.home 域名...",
      ai_btn: "自动生成",
      domain: "域名",
      ip: "目标 IP",
      type: "记录类型",
      desc: "备注信息",
      manual_add: "手动添加解析项"
    },
    dhcp: {
      title: "终端地址分配",
      desc: "当前局域网内由 Dnsmasq 分配的活动租约",
      hostname: "设备主机名",
      mac: "硬件地址",
      expires: "有效时长",
      to_static: "转静态绑定",
      release: "释放地址"
    },
    config: {
      ai_scan: "AI 配置审计",
      apply_btn: "保存并部署",
      valid: "配置验证通过并已重载",
      invalid: "配置格式错误",
      help_title: "配置语法参考",
      ai_insight: "AI 深度审计报告",
      security: "安全性评分",
      optimization: "优化建议"
    },
    logs: {
      title: "全域流量监控",
      live: "LIVE",
      filter: "过滤访问域名...",
      clear: "清除历史",
      time: "请求时间",
      client: "来源客户端",
      domain: "访问域名",
      reply: "处理时延"
    },
    ad_blocking: {
      shield_title: "全域网络防火墙",
      shield_desc: "基于 DNS 层的广告拦截与恶意域名过滤",
      efficiency: "拦截效能",
      optimal: "防御中",
      blocking_stat: "当前已抵御 ~24% 的广告/追踪请求",
      quick_control: "快捷指令",
      sync_lists: "规则重载",
      flush_cache: "清理 DNS 缓存",
      managed_lists: "订阅规则源管理",
      add_list: "新增订阅源",
      active: "运行中",
      disabled: "已禁用"
    }
  },
  en: {
    common: {
      apply: "Apply",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      save: "Save",
      loading: "Loading...",
      search: "Search...",
      actions: "Actions",
      status: "Status"
    },
    nav: {
      dashboard: "Dashboard",
      dns_records: "DNS Records",
      dhcp_leases: "DHCP Leases",
      ad_blocking: "Ad Blocking",
      config: "Config Editor",
      logs: "Query Logs",
      sys_load: "Sys Load"
    },
    header: {
      service_active: "Core Active",
      service_stopped: "Core Offline"
    },
    dashboard: {
      traffic_analysis: "Traffic Trend Analysis",
      activity_log: "24H Real-time Activity",
      node_info: "Node Statistics",
      config_path: "Config Path",
      mem_usage: "Memory Usage",
      restart_service: "Restart Service"
    },
    dns: {
      ai_title: "AI DNS Helper",
      ai_desc: "Describe your needs, AI will generate standard dnsmasq records for you",
      ai_placeholder: "e.g., set nas.local to 192.168.1.100...",
      ai_btn: "Generate",
      domain: "Domain",
      ip: "IP Address",
      type: "Type",
      desc: "Comment",
      manual_add: "Add Record Manually"
    },
    dhcp: {
      title: "Active Leases",
      desc: "IP addresses currently assigned via DHCP",
      hostname: "Hostname",
      mac: "MAC Address",
      expires: "Expires",
      to_static: "To Static",
      release: "Release"
    },
    config: {
      ai_scan: "AI Security Scan",
      apply_btn: "Save & Deploy",
      valid: "Config valid and reloaded",
      invalid: "Syntax error detected",
      help_title: "Syntax Help",
      ai_insight: "AI Audit Report",
      security: "Security Score",
      optimization: "Performance"
    },
    logs: {
      title: "Traffic Monitor",
      live: "LIVE",
      filter: "Filter domains...",
      clear: "Clear All",
      time: "Time",
      client: "Client",
      domain: "Domain",
      reply: "Latency"
    },
    ad_blocking: {
      shield_title: "Global Firewall",
      shield_desc: "DNS-level ad blocking and tracker filtering",
      efficiency: "Efficiency",
      optimal: "Defending",
      blocking_stat: "Blocking ~24% of all DNS queries",
      quick_control: "Quick Commands",
      sync_lists: "Sync Lists",
      flush_cache: "Flush Cache",
      managed_lists: "Blocklist Management",
      add_list: "Add Source",
      active: "Active",
      disabled: "Disabled"
    }
  }
};