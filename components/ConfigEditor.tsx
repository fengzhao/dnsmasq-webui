import React, { useState, useEffect } from 'react';
import { analyzeConfig } from '../services/geminiService';
import { SystemService } from '../services/systemService';
import { useTranslation } from '../App';

const ConfigEditor: React.FC = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{valid: boolean, error?: string} | null>(null);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('dnsmasq_conf');
      if (saved) setConfig(saved);
      else setConfig(`# dnsmasq.conf\ndomain-needed\nbogus-priv\nno-resolv\nserver=8.8.8.8\ncache-size=1000`);
    };
    load();
  }, []);

  const handleApply = async () => {
    setIsSaving(true);
    setTestResult(null);

    const test = await SystemService.testConfig(config);
    if (!test.valid) {
      setTestResult(test);
      setIsSaving(false);
      return;
    }

    await SystemService.saveConfig(config);
    await SystemService.restartService();
    
    setTestResult({ valid: true });
    setIsSaving(false);
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeConfig(config);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-8">
      <div className="flex-1 flex flex-col min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-600 tracking-tighter uppercase">/etc/dnsmasq.conf</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
            >
              {isAnalyzing ? '...' : t('config.ai_scan')}
            </button>
            <button 
              onClick={handleApply}
              disabled={isSaving}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                isSaving ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isSaving ? '...' : t('config.apply_btn')}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`px-6 py-3 border-b text-[11px] font-bold ${testResult.valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {testResult.valid ? `✓ ${t('config.valid')}` : `✗ ${t('config.invalid')}: ${testResult.error}`}
          </div>
        )}

        <textarea 
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="flex-1 bg-slate-950 p-8 text-sm font-mono text-indigo-300 outline-none resize-none spellcheck-false custom-scrollbar leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="lg:w-96 space-y-6">
        {analysis ? (
           <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-2xl animate-in slide-in-from-right duration-500">
             <div className="flex items-center justify-between mb-6">
               <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-widest">{t('config.ai_insight')}</h4>
               <button onClick={() => setAnalysis(null)} className="text-slate-600 hover:text-white transition-colors">&times;</button>
             </div>
             <div className="space-y-8">
               <section>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">{t('config.security')}</label>
                 <ul className="space-y-3">
                   {analysis.security.map((s: string, i: number) => (
                     <li key={i} className="text-xs text-slate-300 flex gap-3 leading-normal">
                       <span className="text-emerald-500 font-bold shrink-0">✓</span> {s}
                     </li>
                   ))}
                 </ul>
               </section>
               {analysis.issues.length > 0 && (
                 <section>
                   <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-3">{t('config.optimization')}</label>
                   <ul className="space-y-3">
                     {analysis.issues.map((issue: string, i: number) => (
                       <li key={i} className="text-xs text-amber-200/70 flex gap-3 leading-normal">
                         <span className="text-amber-500 font-bold shrink-0">!</span> {issue}
                       </li>
                     ))}
                   </ul>
                 </section>
               )}
             </div>
           </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-200 text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t('config.help_title')}
            </h4>
            <div className="space-y-5">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <code className="text-xs text-indigo-400 font-bold block mb-2">address=/domain/ip</code>
                <p className="text-[10px] text-slate-600 font-medium uppercase leading-relaxed">DNS Redirection Mapping</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <code className="text-xs text-indigo-400 font-bold block mb-2">server=8.8.8.8</code>
                <p className="text-[10px] text-slate-600 font-medium uppercase leading-relaxed">Set Upstream DNS Servers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigEditor;