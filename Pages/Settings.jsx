
import { useState } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { AppCard } from '@/Components/ui/AppCard';
import { CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { 
  Link, 
  Bell, 
  ShieldCheck, 
  Settings as SettingsIcon,
  User,
  Palette,
  Database,
  Shield,
  Sparkles,
  ChevronRight,
  Moon,
  Sun,
  Zap,
  HelpCircle
} from 'lucide-react';
import Connections from '@/Components/settings/Connections';
import ResponsibleGaming from '@/Components/settings/ResponsibleGaming';
import Notifications from '@/Components/settings/Notifications';

const TABS = [
  { id: 'connections', label: 'Connections', icon: Link, component: Connections, description: 'Manage API connections' },
  { id: 'responsible_gaming', label: 'Responsible Gaming', icon: ShieldCheck, component: ResponsibleGaming, description: 'Set betting limits' },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: Notifications, description: 'Configure alerts' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('connections');

  // Theme-aware design system
  const ds = {
    bg: theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50',
    bgCard: theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/90',
    bgCardHover: theme === 'dark' ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100',
    bgAccent: theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100',
    border: theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    hover: theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-200',
  };

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={`min-h-screen ${ds.bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <SettingsIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${ds.text}`}>Settings</h1>
              <p className={ds.textMuted}>Manage your account, connections, and preferences</p>
            </div>
          </div>

          {/* Quick Theme Toggle */}
          <div className={`inline-flex items-center gap-3 p-2 rounded-xl ${ds.bgAccent} border ${ds.border}`}>
            <span className={`text-sm font-medium ${ds.textMuted} pl-2`}>Theme:</span>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : `${ds.textMuted} ${ds.hover}`
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : `${ds.textMuted} ${ds.hover}`
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${ds.bgCard} backdrop-blur-xl rounded-2xl border ${ds.border} p-4 shadow-xl`}>
              <div className="space-y-2">
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20' 
                        : `${ds.textSecondary} ${ds.bgCardHover}`
                      }
                    `}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{tab.label}</p>
                      <p className={`text-xs ${activeTab === tab.id ? 'text-white/70' : ds.textMuted}`}>
                        {tab.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ds.textMuted}`} />
                  </button>
                ))}
              </div>

              {/* Pro Features Banner */}
              <div className={`mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className={`font-bold ${ds.text}`}>Elite ML v3.0</span>
                </div>
                <p className={`text-sm ${ds.textMuted} mb-3`}>
                  100 improvements active with advanced ML predictions.
                </p>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">All features enabled</span>
                </div>
              </div>

              {/* Help Link */}
              <div className={`mt-4 p-3 rounded-xl ${ds.bgAccent} border ${ds.border} flex items-center gap-3 cursor-pointer ${ds.bgCardHover} transition-colors`}>
                <HelpCircle className={`w-5 h-5 ${ds.textMuted}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${ds.textSecondary}`}>Need help?</p>
                  <p className={`text-xs ${ds.textMuted}`}>View documentation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`${ds.bgCard} backdrop-blur-xl rounded-2xl border ${ds.border} p-6 shadow-xl min-h-[500px]`}>
              {/* Tab Header */}
              <div className={`flex items-center gap-3 mb-6 pb-6 border-b ${ds.border}`}>
                {TABS.find(t => t.id === activeTab) && (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      {(() => {
                        const TabIcon = TABS.find(t => t.id === activeTab)?.icon;
                        return TabIcon ? <TabIcon className="w-6 h-6 text-white" /> : null;
                      })()}
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${ds.text}`}>
                        {TABS.find(t => t.id === activeTab)?.label}
                      </h2>
                      <p className={ds.textMuted}>
                        {TABS.find(t => t.id === activeTab)?.description}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Active Component */}
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

