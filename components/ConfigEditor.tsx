
import React, { useState, useEffect } from 'react';
import { analyzeConfig } from '../services/geminiService';
import { SystemService } from '../services/systemService';

const ConfigEditor: React.FC = () => {
  const [config, setConfig] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{valid: boolean, error?: string} | null>(null);

  useEffect(() => {
    // Load existing config
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

    // 1. Run dnsmasq --test
    const test = await SystemService.testConfig(config);
    if (!test.valid) {
      setTestResult(test);
      setIsSaving(false);
      return;
    }

    // 2. Save file
    await SystemService.saveConfig(config);
    
    // 3. Restart service
    await SystemService.restartService();
    
    setTestResult({ valid: true });
    setIsSaving(false);
    
    // Auto clear success message
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
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
            </div>
            <span className="text-xs font-mono text-slate-500">/etc/dnsmasq.conf</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
            >
              {isAnalyzing ? 'Analyzing...' : 'AI Scan'}
            </button>
            <button 
              onClick={handleApply}
              disabled={isSaving}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                isSaving ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Applying...
                </>
              ) : 'Apply Changes'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`px-6 py-3 border-b text-xs font-mono ${testResult.valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {testResult.valid ? '✓ Configuration is valid and applied.' : `✗ Configuration Error: ${testResult.error}`}
          </div>
        )}

        <textarea 
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="flex-1 bg-slate-950 p-8 text-sm font-mono text-indigo-300 outline-none resize-none spellcheck-false custom-scrollbar"
          spellCheck={false}
          placeholder="# Type your dnsmasq configuration here..."
        />
      </div>

      <div className="lg:w-96 space-y-6">
        {analysis ? (
           <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-2xl animate-in slide-in-from-right duration-500">
             <div className="flex items-center justify-between mb-4">
               <h4 className="font-bold text-indigo-400 text-sm uppercase tracking-wider">AI Intelligence</h4>
               <button onClick={() => setAnalysis(null)} className="text-slate-500 hover:text-white">&times;</button>
             </div>
             <div className="space-y-6">
               <section>
                 <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Security Audit</label>
                 <ul className="space-y-2">
                   {analysis.security.map((s: string, i: number) => (
                     <li key={i} className="text-xs text-slate-300 flex gap-2">
                       <span className="text-emerald-500">✓</span> {s}
                     </li>
                   ))}
                 </ul>
               </section>
               {analysis.issues.length > 0 && (
                 <section>
                   <label className="text-[10px] font-bold text-amber-500 uppercase block mb-2">Optimization Tips</label>
                   <ul className="space-y-2">
                     {analysis.issues.map((issue: string, i: number) => (
                       <li key={i} className="text-xs text-amber-200/70 flex gap-2">
                         <span className="text-amber-500">!</span> {issue}
                       </li>
                     ))}
                   </ul>
                 </section>
               )}
             </div>
           </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Quick Reference
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group cursor-help">
                <code className="text-xs text-indigo-400 font-bold block mb-1 group-hover:text-indigo-300">address=/domain/ip</code>
                <p className="text-[10px] text-slate-500">Force a specific IP for a domain name.</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group cursor-help">
                <code className="text-xs text-indigo-400 font-bold block mb-1 group-hover:text-indigo-300">dhcp-range=192.168.1.50...</code>
                <p className="text-[10px] text-slate-500">Enable DHCP server for the local network.</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group cursor-help">
                <code className="text-xs text-indigo-400 font-bold block mb-1 group-hover:text-indigo-300">server=8.8.8.8</code>
                <p className="text-[10px] text-slate-500">Set upstream DNS servers.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigEditor;
