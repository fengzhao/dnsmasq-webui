
import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DnsRecords from './components/DnsRecords';
import DhcpLeases from './components/DhcpLeases';
import AdBlocking from './components/AdBlocking';
import ConfigEditor from './components/ConfigEditor';
import LogsViewer from './components/LogsViewer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
            <h1 className="text-xl font-bold capitalize">{currentView.replace('_', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-green-500">Service Active</span>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 custom-scrollbar">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
