import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SystemService, SystemStatus } from '../services/systemService.ts';
import { useApp } from '../App.tsx';

const Dashboard: React.FC = () => {
  const { t, theme } = useApp();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);

  const chartData = [
    { time: '00:00', queries: 400, blocked: 24 },
    { time: '04:00', queries: 300, blocked: 13 },
    { time: '08:00', queries: 1200, blocked: 180 },
    { time: '12:00', queries: 1800, blocked: 450 },
    { time: '16:00', queries: 2400, blocked: 620 },
    { time: '20:00', queries: 1900, blocked: 210 },
    { time: '23:59', queries: 800, blocked: 85 },
  ];

  useEffect(() => {
    const fetchStatus = async () => {
      const s = await SystemService.getStatus();
      setStatus(s);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async () => {
    setIsRestarting(true);
    await SystemService.restartService();
    setIsRestarting(false);
  };

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className={`border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-xl relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${status?.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-3">
              {status?.mode === 'docker-remote' ? status.target_container : 'Dnsmasq Core'}
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black ${status?.active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {status?.active ? 'Active' : 'Stopped'}
              </span>
            </h2>
            <div className={`flex gap-4 mt-1 text-sm font-mono transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>PID: {status?.pid || '---'}</span>
                <span>Uptime: {status?.active ? status?.uptime : '---'}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleRestart}
          disabled={isRestarting}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isRestarting ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'}`}
        >
          <svg className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {isRestarting ? t('common.loading') : t('dashboard.restart_service')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 border p-6 rounded-2xl transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">{t('dashboard.traffic_analysis')}</h3>
            <span className={`text-[10px] font-mono italic transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('dashboard.activity_log')}</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Area type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`border p-6 rounded-2xl flex flex-col transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold text-lg mb-6">{t('dashboard.node_info')}</h3>
          <div className="space-y-8 flex-1">
             <div className={`p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-[10px] uppercase font-bold mb-2 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('dashboard.config_path')}</p>
                <p className="text-sm font-mono text-indigo-500 font-bold break-all">/etc/dnsmasq.conf</p>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('dashboard.mem_usage')}</span>
                 <span className="text-sm font-mono text-emerald-500 font-bold">42.5 MB</span>
               </div>
               <div className={`h-2 rounded-full overflow-hidden transition-colors ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                 <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: '8.2%'}}></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;