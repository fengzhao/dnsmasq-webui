
const API_BASE = '/api'; 

export interface SystemStatus {
  active: boolean;
  uptime: string;
  cpu: number;
  memory: number;
  pid: number;
  connected: boolean;
  mode: 'container' | 'host' | 'docker-remote';
  target_container?: string;
}

export const SystemService = {
  async restartService(): Promise<{success: boolean, log: string}> {
    try {
      const resp = await fetch(`${API_BASE}/restart`, { method: 'POST' });
      return await resp.json();
    } catch (e) {
      console.error("Backend unreachable", e);
      return { success: false, log: "无法连接到后端服务" };
    }
  },

  async saveConfig(content: string): Promise<{success: boolean, message: string}> {
    try {
      const resp = await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: content
      });
      return await resp.json();
    } catch (e) {
      return { success: false, message: "保存失败" };
    }
  },

  async testConfig(content: string): Promise<{valid: boolean, error?: string}> {
    try {
      const resp = await fetch(`${API_BASE}/test-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: content
      });
      return await resp.json();
    } catch (e) {
      return { valid: false, error: "无法连接到后端进行配置测试" };
    }
  },

  async getStatus(): Promise<SystemStatus> {
    try {
      const resp = await fetch(`${API_BASE}/status`);
      return await resp.json();
    } catch (e) {
      return {
        active: false,
        uptime: "Offline",
        cpu: 0,
        memory: 0,
        pid: 0,
        connected: false,
        mode: 'host'
      };
    }
  }
};
