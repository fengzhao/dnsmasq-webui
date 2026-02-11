
import React, { useState, useEffect } from 'react';
import { QueryLog } from '../types';

const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [filter, setFilter] = useState('');

  // Simulate incoming logs
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
      case 'Blocked': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'Cached': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'Local': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-bold">Live Traffic</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase animate-pulse">Live</span>
        </div>
        <div className="flex gap-2">
          <input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter domains..." 
            className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm outline-none w-64 focus:ring-1 ring-indigo-500"
          />
          <button 
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
            <tr className="text-xs font-bold text-slate-500 uppercase">
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Domain</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Reply</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {logs.filter(l => l.domain.toLowerCase().includes(filter.toLowerCase())).map((log, i) => (
              <tr key={i} className="hover:bg-slate-800/30 text-xs transition-colors animate-in slide-in-from-top-2 duration-300">
                <td className="px-6 py-3 font-mono text-slate-500">{log.timestamp}</td>
                <td className="px-6 py-3 font-mono text-slate-300">{log.client}</td>
                <td className="px-6 py-3 font-medium text-slate-200 truncate max-w-xs">{log.domain}</td>
                <td className="px-6 py-3 font-bold text-slate-500">{log.type}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-mono text-slate-500">{log.replyTime || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  Waiting for incoming queries...
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
