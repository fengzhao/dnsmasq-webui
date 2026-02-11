import React, { useState, createContext, useContext, useEffect } from 'react';
import { View } from './types';
import { translations } from './translations';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DnsRecords from './components/DnsRecords';
import DhcpLeases from './components/DhcpLeases';
import AdBlocking from './components/AdBlocking';
import ConfigEditor from './components/ConfigEditor';
import LogsViewer from './components/LogsViewer';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[lang];
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }
    return result;
  };

  const getViewTitle = (view: View) => {
    const titles: Record<View, string> = {
      [View.DASHBOARD]: t('nav.dashboard'),
      [View.DNS_RECORDS]: t('nav.dns_records'),
      [View.DHCP_LEASES]: t('nav.dhcp_leases'),
      [View.AD_BLOCKING]: t('nav.ad_blocking'),
      [View.CONFIG]: t('nav.config'),
      [View.LOGS]: t('nav.logs')
    };
    return titles[view];
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.DNS_RECORDS: return <DnsRecords />;
      case View.DHCP_LEASES: return <DhcpLeases />;
      case View.AD_BLOCKING: return <AdBlocking />;
      case View.CONFIG: return <ConfigEditor />;
      case View.LOGS: return <LogsViewer />;
      default: return <Dashboard />;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-xl font-bold tracking-tight">{getViewTitle(currentView)}</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">{t('header.service_active')}</span>
              </div>

              <div className="flex items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                <button 
                  onClick={() => setLang('zh')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${lang === 'zh' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  中文
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-950 custom-scrollbar">
            {renderView()}
          </div>
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;