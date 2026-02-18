import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  Bell, 
  Lightbulb, 
  HandCoins, 
  MessageSquare, 
  FolderOpen, 
  Settings,
  Menu,
  X,
  UserCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Import sub-components (will create these next)
import { Dashboard } from './components/dashboard';
import { ProfileCreation } from './components/profile-creation';
import { ComplianceGuidance } from './components/compliance-guidance';
import { AlertsInterface } from './components/alerts-interface';
import { Schemes } from './components/schemes';
import { Loans } from './components/loans';
import { AIQueryAssistant } from './components/ai-query-assistant';
import { Documents } from './components/documents';
import { SettingsPage } from './components/settings';
import { ErrorView } from './components/error-view';
import { Auth } from './components/auth-container';

type View = 'dashboard' | 'profile' | 'guidance' | 'alerts' | 'schemes' | 'loans' | 'assistant' | 'documents' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'MSME Profile', icon: UserCircle },
    { id: 'guidance', label: 'Compliance Guidance', icon: BookOpen },
    { id: 'alerts', label: 'Alerts & Deadlines', icon: Bell },
    { id: 'schemes', label: 'Govt Schemes', icon: Lightbulb },
    { id: 'loans', label: 'Loan Recommendations', icon: HandCoins },
    { id: 'assistant', label: 'AI Query Assistant', icon: MessageSquare },
    { id: 'documents', label: 'Document Storage', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderView = () => {
    if (hasError) {
      return (
        <ErrorView 
          onRetry={() => setHasError(false)} 
          onHome={() => {
            setHasError(false);
            setCurrentView('dashboard');
          }} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <ProfileCreation />;
      case 'guidance': return <ComplianceGuidance />;
      case 'alerts': return <AlertsInterface />;
      case 'schemes': return <Schemes />;
      case 'loans': return <Loans />;
      case 'assistant': return <AIQueryAssistant />;
      case 'documents': return <Documents />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100 h-16">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 font-bold text-blue-600 text-xl tracking-tight">
              <ShieldCheck className="w-8 h-8" />
              <span>CompliAssist</span>
            </div>
          ) : (
            <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto" />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 lg:flex hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon size={22} className={`shrink-0 ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
              {isSidebarOpen && <span className="font-medium flex-1 leading-tight">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              SS
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Srijan Singh</span>
                <span className="text-xs text-slate-500 truncate">Tech Solutions MSME</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {navItems.find(i => i.id === currentView)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setHasError(true)}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
              title="Simulate Error"
            >
              <AlertCircle size={20} />
            </button>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              <Bell size={20} className="text-slate-500 cursor-pointer" />
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">Compliance: 85%</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
