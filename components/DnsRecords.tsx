import React, { useState } from 'react';
import { DnsRecord } from '../types';
import { suggestDnsRecord } from '../services/geminiService';
import { useTranslation } from '../App';

const DnsRecords: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<DnsRecord[]>([
    { id: '1', domain: 'home.nas', ip: '192.168.1.50', type: 'A', comment: 'Network storage' },
    { id: '2', domain: 'router.local', ip: '192.168.1.1', type: 'A', comment: 'Main Gateway' },
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
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="text-indigo-400 font-bold mb-1 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {t('dns.ai_title')}
          </h3>
          <p className="text-xs text-indigo-300/70">{t('dns.ai_desc')}</p>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <input 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t('dns.ai_placeholder')}
            className="flex-1 md:w-80 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none transition-all shadow-inner"
          />
          <button 
            onClick={handleAiSuggest}
            disabled={isAiLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            {isAiLoading ? '...' : t('dns.ai_btn')}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('dns.domain')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('dns.ip')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('dns.type')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('dns.desc')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-200">{record.domain}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400 text-sm">{record.ip}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">{record.type}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{record.comment || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors mr-4 text-xs font-bold uppercase">{t('common.edit')}</button>
                    <button className="text-red-500/70 hover:text-red-400 transition-colors text-xs font-bold uppercase">{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50">
          <p className="text-xs text-slate-600 font-medium">{records.length} records configured</p>
          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors">+ {t('dns.manual_add')}</button>
        </div>
      </div>
    </div>
  );
};

export default DnsRecords;