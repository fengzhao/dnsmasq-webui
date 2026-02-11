
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SystemService, SystemStatus } from '../services/systemService';

const chartData = [
  { time: '00:00', queries: 400, blocked: 24 },
  { time: '04:00', queries: 300, blocked: 13 },
  { time: '08:00', queries: 1200, blocked: 180 },
  { time: '12:00', queries: 1800, blocked: 450 },
  { time: '16:00', queries: 2400, blocked: 620 },
  { time: '20:00', queries: 1900, blocked: 210 },
  { time: '23:59', queries: 800, blocked: 85 },
];

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);

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

  if (status && !status.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">未连接到后端</h2>
        <p className="text-slate-400 max-w-md">请确保在 Linux 服务器上以 root 权限运行了 Go 二进制程序。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${status?.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              dnsmasq.service
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest ${status?.active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {status?.active ? 'Running' : 'Stopped'}
              </span>
            </h2>
            <div className="flex gap-4 mt-1 text-sm text-slate-500 font-mono">
              <span>PID: {status?.pid || 'N/A'}</span>
              <span>Uptime: {status?.active ? status?.uptime : '---'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRestart}
            disabled={isRestarting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${isRestarting ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
          >
            <svg className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {isRestarting ? 'Restarting...' : 'Restart Service'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-300">
          <h3 className="font-bold text-lg mb-6">Traffic Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="font-bold text-lg mb-4">System Resources</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm text-slate-400">CPU Usage</span>
                 <span className="text-sm font-mono text-indigo-400">{status?.cpu || 0}%</span>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${status?.cpu || 0}%`}}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm text-slate-400">Memory</span>
                 <span className="text-sm font-mono text-emerald-400">{status?.memory || 0} MB</span>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: '15%'}}></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
