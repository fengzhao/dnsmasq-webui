import React, { useState, useEffect } from 'react';
import { QueryLog } from '../types.ts';
import { useTranslation } from '../App.tsx';

const LogsViewer: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const domains = ['google.com', 'apple.com', 'tracker.doubleclick.net', 'netflix.com', 'api.github.com', 'analytics.local'];
    const clients = ['192.168.1.10', '192.168.1.15', '192.168.1.42', '127.0.0.1'];
    const types = ['A', 'AAAA', 'CNAME', 'HTTPS'];
    const statuses: ('Forwarded' | 'Blocked' | 'Cached' | 'Local')[] = ['Forwarded', 'Blocked', 'Cached', 'Local'];

    const interval = setInterval(() => {
      const newLog: QueryLog = {
        timestamp: new Date().toLocaleTimeString(),
        client: clients[Math.floor(Math.random() * clients.length)],
        domain: domains[Math.floor(Math.random() * domains.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: domains[Math.floor(Math.random() * domains.length)].includes('tracker') ? 'Blocked' : statuses[Math.floor(Math.random() * statuses.length)],
        replyTime: (Math.random() * 50).toFixed(1) + 'ms'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Blocked': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Cached': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'Local': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-sm uppercase tracking-widest">{t('logs.title')}</h3>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-600 text-white uppercase animate-pulse">{t('logs.live')}</span>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('logs.filter')} 
            className="flex-1 md:w-64 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 ring-indigo-500 transition-all shadow-inner"
          />
          <button 
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-400 transition-all uppercase tracking-tight"
          >
            {t('logs.clear')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 border-b border-slate-800">
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">{t('logs.time')}</th>
              <th className="px-6 py-4">{t('logs.client')}</th>
              <th className="px-6 py-4">{t('logs.domain')}</th>
              <th className="px-6 py-4">{t('dns.type')}</th>
              <th className="px-6 py-4">{t('common.status')}</th>
              <th className="px-6 py-4 text-right">{t('logs.reply')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono text-xs">
            {logs.filter(l => l.domain.toLowerCase().includes(filter.toLowerCase())).map((log, i) => (
              <tr key={i} className="hover:bg-slate-800/40 text-slate-400 transition-colors animate-in slide-in-from-top-1 duration-300">
                <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                <td className="px-6 py-4 text-indigo-400/80">{log.client}</td>
                <td className="px-6 py-4 font-medium text-slate-300 truncate max-w-xs">{log.domain}</td>
                <td className="px-6 py-4 font-bold text-slate-500">{log.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500">{log.replyTime || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center animate-pulse">
                         <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest italic">Waiting for queries...</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsViewer;