import React from 'react';
import { DhcpLease } from '../types';
import { useTranslation } from '../App';

const DhcpLeases: React.FC = () => {
  const { t } = useTranslation();
  const leases: DhcpLease[] = [
    { id: '1', hostname: 'MacBook-Pro', mac: '00:1A:2B:3C:4D:5E', ip: '192.168.1.10', expiry: '2h 14m' },
    { id: '2', hostname: 'iPhone-15', mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.1.15', expiry: '4h 32m' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg">{t('dhcp.title')}</h3>
          <p className="text-xs text-slate-500 font-medium">{t('dhcp.desc')}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <input 
              placeholder={t('common.search')} 
              className="w-full md:w-64 bg-slate-800/50 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-1 ring-indigo-500 outline-none transition-all"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">{t('dhcp.hostname')}</th>
              <th className="px-6 py-4">{t('dhcp.ip')}</th>
              <th className="px-6 py-4">{t('dhcp.mac')}</th>
              <th className="px-6 py-4">{t('dhcp.expires')}</th>
              <th className="px-6 py-4 text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leases.map((lease) => (
              <tr key={lease.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-200">{lease.hostname}</td>
                <td className="px-6 py-4 font-mono text-emerald-400 text-sm">{lease.ip}</td>
                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{lease.mac}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700/50">{lease.expiry}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase mr-4 transition-colors">{t('dhcp.to_static')}</button>
                  <button className="text-slate-500 hover:text-white text-xs font-bold uppercase transition-colors">{t('dhcp.release')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DhcpLeases;