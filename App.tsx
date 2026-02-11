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
type Theme = 'dark' | 'light';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (path: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// Re-export for components that only need translation
export const useTranslation = useApp;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'zh';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[lang];
    for (const key of keys) {
      if (!result || result[key] === undefined) return path;
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
    <AppContext.Provider value={{ lang, setLang, theme, toggleTheme, t }}>
      <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className={`h-16 border-b flex items-center justify-between px-6 z-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-xl font-bold tracking-tight">{getViewTitle(currentView)}</h1>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">{t('header.service_active')}</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600'}`}
                  title="切换主题"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M14.414 7.586a5 5 0 11-7.172 7.172 5 5 0 017.172-7.172z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  )}
                </button>

                <div className={`flex items-center p-1 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                  <button 
                    onClick={() => setLang('zh')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'zh' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    中文
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className={`flex-1 overflow-y-auto p-6 transition-colors duration-300 custom-scrollbar ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
            {renderView()}
          </div>
        </main>
      </div>
      {/* Fixed: changed closing tag from LanguageContext.Provider to AppContext.Provider */}
    </AppContext.Provider>
  );
};

export default App;