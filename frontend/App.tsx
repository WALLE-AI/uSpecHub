import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  User,
  LogOut,
  Settings,
  Mail,
  Lock,
  X,
  ChevronDown,
  UserPlus,
  LogIn,
  Library,
  ClipboardList,
  Box,
  Terminal,
  ShieldCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DeveloperCenter from './components/DeveloperCenter';
// import ApiDocs from './components/ApiDocs'; // Replaced by DeveloperCenter
import ModelCenter from './components/ModelCenter';
import UserProfilePage from './components/UserProfile';
import BillingPage from './components/BillingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { SettingsModal } from './components/SettingsModal';

type View = 'dev-center' | 'models' | 'profile' | 'billing';
type AppState = 'auth-login' | 'auth-register' | 'main';

interface UserProfile {
  name: string;
  email: string;
  role: 'Admin' | 'Developer';
  organization?: string;
  avatarColor: string;
}

// --- User Dropdown Component ---
const UserDropdown = ({
  user,
  onLogout,
  onViewProfile,
  onNavigateToBilling
}: {
  user: UserProfile;
  onLogout: () => void;
  onViewProfile?: () => void;
  onNavigateToBilling?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 p-1 rounded-full pr-3 transition-colors border border-transparent hover:border-slate-200"
      >
        <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-700 hidden md:block">{user.name}</span>
        <ChevronDown size={14} className="text-slate-400 hidden md:block" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <div className="text-sm font-bold text-slate-800">{user.name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
            </div>

            <button
              onClick={() => { onViewProfile && onViewProfile(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors"
            >
              <User size={16} /> 个人中心
            </button>
            <button
              onClick={() => { onNavigateToBilling && onNavigateToBilling(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors"
            >
              <CreditCard size={16} /> 财务账单
            </button>

            <div className="h-px bg-slate-100 my-1"></div>

            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> 退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [currentView, setCurrentView] = useState<View>('models');
  const [devCenterTab, setDevCenterTab] = useState<'dashboard' | 'keys' | 'knowledge' | 'agents' | 'playground' | 'docs'>('dashboard');

  // Auth State
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Admin',
    email: 'admin@nexus.ai',
    role: 'Admin',
    organization: 'Building Pro Corp',
    avatarColor: 'from-blue-600 to-indigo-600'
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle Auth Transitions
  if (appState === 'auth-login') {
    return <LoginPage onLogin={(userData) => { setUser(userData); setAppState('main'); }} onNavigateToRegister={() => setAppState('auth-register')} />;
  }

  if (appState === 'auth-register') {
    return <RegisterPage onSuccess={() => setAppState('auth-login')} onNavigateToLogin={() => setAppState('auth-login')} />;
  }

  // Ensure user is logged in
  if (!user && appState === 'main') {
    setAppState('auth-login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">uSpecHub</span>
        </div>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={() => setCurrentView('models')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'models' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <div className="flex items-center gap-2"><Box size={16} /> 模型中心</div>
          </button>

          <button
            onClick={() => setCurrentView('dev-center')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'dev-center' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <div className="flex items-center gap-2"><Terminal size={16} /> 开发者中心</div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-slate-400 hover:text-slate-600 relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {user && (
            <UserDropdown
              user={user}
              onLogout={() => { setUser(null); setAppState('auth-login'); }}
              onViewProfile={() => setCurrentView('profile')}
              onNavigateToBilling={() => setCurrentView('billing')}
            />
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'models' && <ModelCenter onNavigateToDevCenter={() => { setDevCenterTab('docs'); setCurrentView('dev-center'); }} />}
        {currentView === 'dev-center' && <DeveloperCenter initialTab={devCenterTab} />}
        {currentView === 'profile' && <UserProfilePage user={user!} />}
        {currentView === 'billing' && <BillingPage />}
      </main>
    </div>
  );
};

export default App;