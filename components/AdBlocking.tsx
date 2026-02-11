
import React from 'react';

const AdBlocking: React.FC = () => {
  const blocklists = [
    { name: 'StevenBlack Unified Host', url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts', entries: '124,532', enabled: true },
    { name: 'Peter Lowe List', url: 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext', entries: '3,842', enabled: true },
    { name: 'OISD Basic', url: 'https://big.oisd.nl/', entries: '542,102', enabled: false },
    { name: 'Malware Domain List', url: 'https://www.malwaredomainlist.com/hostslist/hosts.txt', entries: '1,231', enabled: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div>
              <h3 className="font-bold">Global Ad-Blocking</h3>
              <p className="text-sm text-slate-500">Enable or disable all blocklists</p>
            </div>
            <div className="ml-auto">
              <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition-colors">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Blocking efficiency</span>
              <span className="text-sm font-bold text-emerald-400">High</span>
            </div>
            <p className="text-xs text-slate-500">Blocking approximately 24% of all DNS queries in your network.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all group">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="text-xs font-medium">Update Lists</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all group">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="text-xs font-medium">Flush Cache</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold">Managed Blocklists</h3>
          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Add List URL</button>
        </div>
        <div className="divide-y divide-slate-800">
          {blocklists.map((list, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/10">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${list.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                <div>
                  <h4 className="font-bold text-slate-200">{list.name}</h4>
                  <p className="text-xs text-slate-500 truncate w-64 md:w-96">{list.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden md:block text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold">Entries</p>
                  <p className="text-sm font-mono text-indigo-400">{list.entries}</p>
                </div>
                <button className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${list.enabled ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10' : 'border-slate-700 text-slate-500 bg-slate-800'}`}>
                  {list.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdBlocking;
