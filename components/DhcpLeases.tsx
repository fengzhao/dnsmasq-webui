
import React from 'react';
import { DhcpLease } from '../types';

const DhcpLeases: React.FC = () => {
  const leases: DhcpLease[] = [
    { id: '1', hostname: 'MacBook-Pro', mac: '00:1A:2B:3C:4D:5E', ip: '192.168.1.10', expiry: '2h 14m' },
    { id: '2', hostname: 'iPhone-15', mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.1.15', expiry: '4h 32m' },
    { id: '3', hostname: 'Philips-Hue-Bridge', mac: '11:22:33:44:55:66', ip: '192.168.1.25', expiry: '1d 12h' },
    { id: '4', hostname: 'Nintendo-Switch', mac: '66:55:44:33:22:11', ip: '192.168.1.42', expiry: '55m' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Active Leases</h3>
          <p className="text-sm text-slate-500">Currently assigned IP addresses in the network</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              placeholder="Search by IP or MAC..." 
              className="bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 ring-indigo-500 outline-none w-64"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/30 text-xs font-bold text-slate-500 uppercase">
              <th className="px-6 py-3 tracking-wider">Hostname</th>
              <th className="px-6 py-3 tracking-wider">IP Address</th>
              <th className="px-6 py-3 tracking-wider">MAC Address</th>
              <th className="px-6 py-3 tracking-wider">Expires In</th>
              <th className="px-6 py-3 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leases.map((lease) => (
              <tr key={lease.id} className="hover:bg-slate-800/20">
                <td className="px-6 py-4 font-medium">{lease.hostname}</td>
                <td className="px-6 py-4 font-mono text-emerald-400">{lease.ip}</td>
                <td className="px-6 py-4 font-mono text-slate-500">{lease.mac}</td>
                <td className="px-6 py-4">
                  <span className="text-sm px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{lease.expiry}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mr-4">Convert to Static</button>
                  <button className="text-slate-500 hover:text-white">Release</button>
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
