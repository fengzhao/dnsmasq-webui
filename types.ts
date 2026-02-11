
export interface DnsRecord {
  id: string;
  domain: string;
  ip: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'PTR';
  comment?: string;
}

export interface DhcpLease {
  id: string;
  mac: string;
  ip: string;
  hostname: string;
  expiry: string;
}

export interface QueryLog {
  timestamp: string;
  client: string;
  domain: string;
  type: string;
  status: 'Forwarded' | 'Blocked' | 'Cached' | 'Local';
  replyTime?: string;
}

export interface StatsData {
  totalQueries: number;
  blockedQueries: number;
  percentageBlocked: number;
  activeClients: number;
  history: { time: string; queries: number; blocked: number }[];
}

export enum View {
  DASHBOARD = 'dashboard',
  DNS_RECORDS = 'dns_records',
  DHCP_LEASES = 'dhcp_leases',
  AD_BLOCKING = 'ad_blocking',
  CONFIG = 'config',
  LOGS = 'logs'
}
