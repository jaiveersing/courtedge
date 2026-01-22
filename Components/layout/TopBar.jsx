import { Bell, Search, User, Sparkles, TrendingUp, Zap, Activity, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/ThemeToggle';
import SearchAutocomplete from '../ui/SearchAutocomplete';
import UserProfileDropdown from '../ui/UserProfileDropdown';
import NotificationCenter from '../ui/NotificationCenter';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function TopBar({ collapsed }) {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveGames, setLiveGames] = useState(8);
  const [todayProfit, setTodayProfit] = useState(247);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 backdrop-blur-xl border-b flex items-center justify-between px-6 z-30 transition-all duration-300
        ${collapsed ? 'left-[72px]' : 'left-[280px]'}
        ${theme === 'dark' 
          ? 'bg-slate-900/95 border-slate-700/50' 
          : 'bg-white/95 border-slate-200/80'
        }
      `}
      style={{
        boxShadow: theme === 'dark' 
          ? '0 4px 24px rgba(0, 0, 0, 0.3)' 
          : '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Left Section - Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <SearchAutocomplete placeholder="Search players, teams, props..." />
        </div>
      </div>

      {/* Center Section - Quick Stats Banner */}
      <div className="hidden lg:flex items-center gap-4 px-6">
        {/* Today's Profit */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer
          ${todayProfit >= 0 
            ? theme === 'dark'
              ? 'bg-green-500/15 border border-green-500/30 hover:bg-green-500/20'
              : 'bg-green-50 border border-green-200 hover:bg-green-100'
            : theme === 'dark'
              ? 'bg-red-500/15 border border-red-500/30 hover:bg-red-500/20'
              : 'bg-red-50 border border-red-200 hover:bg-red-100'
          }
        `}>
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${todayProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}
          `}>
            <TrendingUp className={`w-4 h-4 ${todayProfit >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
          </div>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Today</p>
            <p className={`text-sm font-bold ${todayProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {todayProfit >= 0 ? '+' : ''}${Math.abs(todayProfit)}
            </p>
          </div>
        </div>

        {/* Live Games */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer
          ${theme === 'dark'
            ? 'bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/20'
            : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
          }
        `}>
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center relative">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
          </div>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Live</p>
            <p className="text-sm font-bold text-blue-500">{liveGames} Games</p>
          </div>
        </div>

        {/* ML Status */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer
          ${theme === 'dark'
            ? 'bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/20'
            : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
          }
        `}>
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ML</p>
            <p className="text-sm font-bold text-purple-500">Active</p>
          </div>
        </div>

        {/* Time */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          ${theme === 'dark'
            ? 'bg-slate-800/50 border border-slate-700/50'
            : 'bg-slate-100 border border-slate-200'
          }
        `}>
          <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* AI Insights Quick Button */}
        <button className={`
          hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105
          ${theme === 'dark'
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30'
            : 'bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 border border-purple-200'
          }
        `}>
          <Zap className="w-4 h-4 text-purple-500" />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            AI Insights
          </span>
        </button>

        <ThemeToggle />
        <NotificationCenter />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
