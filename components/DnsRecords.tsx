
import React, { useState } from 'react';
import { DnsRecord } from '../types';
import { suggestDnsRecord } from '../services/geminiService';

const DnsRecords: React.FC = () => {
  const [records, setRecords] = useState<DnsRecord[]>([
    { id: '1', domain: 'home.nas', ip: '192.168.1.50', type: 'A', comment: 'Network storage' },
    { id: '2', domain: 'router.local', ip: '192.168.1.1', type: 'A', comment: 'Main Gateway' },
    { id: '3', domain: 'tv.livingroom', ip: '192.168.1.105', type: 'A' },
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSuggest = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    const suggestion = await suggestDnsRecord(aiPrompt);
    if (suggestion) {
      setRecords([...records, { 
        id: Date.now().toString(), 
        domain: suggestion.domain, 
        ip: suggestion.ip, 
        type: 'A', 
        comment: suggestion.explanation 
      }]);
      setAiPrompt('');
    }
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <h3 className="text-indigo-400 font-bold mb-1 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            AI Smart Add
          </h3>
          <p className="text-xs text-indigo-300/70">Describe what you want to add, e.g., "Add a record for my raspberry pi at 192.168.1.20 called pi.local"</p>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <input 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Type your request..." 
            className="flex-1 md:w-80 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none transition-all"
          />
          <button 
            onClick={handleAiSuggest}
            disabled={isAiLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isAiLoading ? 'Thinking...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{record.domain}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{record.ip}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">{record.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.comment || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors mr-3">Edit</button>
                    <button className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500">{records.length} records configured</p>
          <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">+ Manual Add Record</button>
        </div>
      </div>
    </div>
  );
};

export default DnsRecords;
