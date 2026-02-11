import React from 'react';
import { useTranslation } from '../App';

const AdBlocking: React.FC = () => {
  const { t } = useTranslation();
  const blocklists = [
    { name: 'StevenBlack Unified Host', url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts', entries: '124,532', enabled: true },
    { name: 'Peter Lowe List', url: 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext', entries: '3,842', enabled: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-100 uppercase tracking-tight text-sm">{t('ad_blocking.shield_title')}</h3>
              <p className="text-xs text-slate-500 font-medium">{t('ad_blocking.shield_desc')}</p>
            </div>
            <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition-all shadow-lg shadow-indigo-600/20">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('ad_blocking.efficiency')}</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('ad_blocking.optimal')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">🛡️ {t('ad_blocking.blocking_stat')}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold text-slate-100 text-sm uppercase tracking-tight mb-4">{t('ad_blocking.quick_control')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group">
              <svg className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300">{t('ad_blocking.sync_lists')}</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group">
              <svg className="w-6 h-6 text-slate-500 group-hover:text-amber-400 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300">{t('ad_blocking.flush_cache')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">{t('ad_blocking.managed_lists')}</h3>
          <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 uppercase">+ {t('ad_blocking.add_list')}</button>
        </div>
        <div className="divide-y divide-slate-800">
          {blocklists.map((list, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${list.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-600'}`}></div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{list.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs md:max-w-lg">{list.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-tighter">Entries</p>
                  <p className="text-xs font-mono text-indigo-400 font-bold">{list.entries}</p>
                </div>
                <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${list.enabled ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10' : 'border-slate-700 text-slate-500 bg-slate-800'}`}>
                  {list.enabled ? t('ad_blocking.active') : t('ad_blocking.disabled')}
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