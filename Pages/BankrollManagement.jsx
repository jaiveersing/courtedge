import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Input } from '@/Components/ui/input';
import { 
  DollarSign, TrendingUp, TrendingDown, Target, Wallet, Shield, 
  Percent, BarChart2, LineChart, PieChart, Calendar, Settings, 
  RefreshCw, Download, AlertCircle, ChevronRight, Sparkles, Brain,
  ArrowUpRight, ArrowDownRight, Lock, Unlock, Edit2, Save, X,
  Activity, Award, Flame, Clock, CheckCircle2, Info, Lightbulb,
  Bell, BookOpen, Zap, Users, Star, Trophy, ChevronUp, ChevronDown,
  Minus, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import { 
  LineChart as RechartsLine, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, 
  Pie, Cell, BarChart, Bar, Legend, ComposedChart
} from 'recharts';

// Elite color palette
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  chart: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1']
};

// Theme-aware Glass Card Component
const GlassCard = ({ children, className = "", gradient = false, theme }) => (
  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 
    ${theme === 'dark' 
      ? `border-white/10 ${gradient ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95' : 'bg-slate-900/80'} backdrop-blur-xl shadow-2xl hover:border-white/20` 
      : `border-slate-200 ${gradient ? 'bg-gradient-to-br from-white via-slate-50 to-white' : 'bg-white'} shadow-lg hover:shadow-xl hover:border-slate-300`
    } ${className}`}>
    <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 via-transparent to-transparent' : 'bg-gradient-to-br from-blue-50/50 via-transparent to-transparent'}`} />
    <div className="relative z-10">{children}</div>
  </div>
);

// Theme-aware Elite Metric Card
const MetricCard = ({ icon: Icon, label, value, subValue, trend, color = "blue", theme, highlight = false }) => {
  const colorMap = {
    blue: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-500', lightBg: 'bg-blue-50', lightText: 'text-blue-600' },
    green: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-500', lightBg: 'bg-emerald-50', lightText: 'text-emerald-600' },
    purple: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-500', lightBg: 'bg-purple-50', lightText: 'text-purple-600' },
    orange: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-500', lightBg: 'bg-orange-50', lightText: 'text-orange-600' },
    red: { bg: 'from-red-500 to-rose-500', text: 'text-red-500', lightBg: 'bg-red-50', lightText: 'text-red-600' },
    cyan: { bg: 'from-cyan-500 to-teal-500', text: 'text-cyan-500', lightBg: 'bg-cyan-50', lightText: 'text-cyan-600' },
    amber: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-500', lightBg: 'bg-amber-50', lightText: 'text-amber-600' },
    indigo: { bg: 'from-indigo-500 to-violet-500', text: 'text-indigo-500', lightBg: 'bg-indigo-50', lightText: 'text-indigo-600' }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`group relative p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]
      ${highlight 
        ? `${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200'}` 
        : `${theme === 'dark' ? 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800/70' : `${colors.lightBg} border-slate-100 hover:border-slate-200 hover:shadow-md`}`
      }`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {subValue}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : colors.lightText}`}>{value}</p>
        {!trend && subValue && <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{subValue}</p>}
      </div>
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ value, max, label, color = "#10b981", size = 120, theme }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r="40"
          fill="none"
          stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{Math.round(percentage)}%</span>
        <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
    </div>
  );
};

// Risk Rule Component
const RiskRule = ({ icon: Icon, title, current, limit, status, theme }) => {
  const statusConfig = {
    safe: { darkBg: 'bg-emerald-500/20', lightBg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    warning: { darkBg: 'bg-amber-500/20', lightBg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-500/30' },
    danger: { darkBg: 'bg-red-500/20', lightBg: 'bg-red-50', text: 'text-red-500', border: 'border-red-500/30' }
  };
  
  const config = statusConfig[status] || statusConfig.safe;
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all
      ${theme === 'dark' ? `${config.darkBg} ${config.border}` : `${config.lightBg} border-slate-200`}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? config.darkBg : config.lightBg}`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
        <div>
          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{title}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{current} / {limit}</p>
        </div>
      </div>
      <Badge className={`${theme === 'dark' ? config.darkBg : config.lightBg} ${config.text} border-0 capitalize`}>
        {status}
      </Badge>
    </div>
  );
};

export default function BankrollManagement() {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Bankroll Settings State
  const [settings, setSettings] = useState({
    initialBankroll: 5000,
    currentBankroll: 7250,
    monthlyDeposit: 500,
    maxBetPercent: 5,
    stopLossPercent: 20,
    goalAmount: 15000,
    kellyMultiplier: 0.25,
    dailyBetLimit: 10,
    maxExposure: 1000
  });

  const [tempSettings, setTempSettings] = useState(settings);

  // Generate 90 days of sample bankroll history
  const bankrollHistory = useMemo(() => {
    const data = [];
    let balance = settings.initialBankroll;
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dailyChange = (Math.random() - 0.42) * 200;
      balance = Math.max(balance + dailyChange, settings.initialBankroll * 0.5);
      
      // Monthly deposits
      if (date.getDate() === 1) {
        balance += settings.monthlyDeposit;
      }
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString(),
        balance: parseFloat(balance.toFixed(2)),
        target: settings.initialBankroll + ((90 - i) / 90) * (settings.goalAmount - settings.initialBankroll)
      });
    }
    
    return data;
  }, [settings]);

  // Weekly performance data
  const weeklyPerformance = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 12; w++) {
      const profit = (Math.random() - 0.4) * 800;
      const bets = Math.floor(15 + Math.random() * 25);
      const wins = Math.floor(bets * (0.45 + Math.random() * 0.2));
      
      weeks.push({
        week: `W${w + 1}`,
        profit: parseFloat(profit.toFixed(2)),
        bets,
        wins,
        roi: parseFloat(((profit / (bets * 50)) * 100).toFixed(1))
      });
    }
    return weeks;
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const latest = bankrollHistory[bankrollHistory.length - 1];
    const initial = bankrollHistory[0];
    const totalProfit = latest.balance - initial.balance;
    const roi = (totalProfit / initial.balance) * 100;
    const goalProgress = ((latest.balance - settings.initialBankroll) / (settings.goalAmount - settings.initialBankroll)) * 100;
    
    // Calculate drawdown
    let maxBalance = initial.balance;
    let maxDrawdown = 0;
    bankrollHistory.forEach(day => {
      maxBalance = Math.max(maxBalance, day.balance);
      const drawdown = ((maxBalance - day.balance) / maxBalance) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });
    
    // 7-day and 30-day performance
    const last7Days = bankrollHistory.slice(-7);
    const last30Days = bankrollHistory.slice(-30);
    const profit7d = last7Days[last7Days.length - 1].balance - last7Days[0].balance;
    const profit30d = last30Days[last30Days.length - 1].balance - last30Days[0].balance;
    
    // Calculate best and worst weeks
    const bestWeek = Math.max(...weeklyPerformance.map(w => w.profit));
    const worstWeek = Math.min(...weeklyPerformance.map(w => w.profit));
    
    // Win rate from weekly data
    const totalBets = weeklyPerformance.reduce((sum, w) => sum + w.bets, 0);
    const totalWins = weeklyPerformance.reduce((sum, w) => sum + w.wins, 0);
    const winRate = (totalWins / totalBets) * 100;
    
    return {
      currentBankroll: latest.balance,
      totalProfit,
      roi,
      goalProgress: Math.min(goalProgress, 100),
      maxDrawdown,
      profit7d,
      profit30d,
      bestWeek,
      worstWeek,
      winRate,
      totalBets,
      daysToGoal: goalProgress >= 100 ? 0 : Math.ceil((settings.goalAmount - latest.balance) / (totalProfit / 90))
    };
  }, [bankrollHistory, weeklyPerformance, settings]);

  // Risk assessment
  const riskAssessment = useMemo(() => {
    const todayBets = 6;
    const currentExposure = 450;
    const drawdownPercent = stats.maxDrawdown;
    
    return {
      betLimit: { current: todayBets, limit: settings.dailyBetLimit, status: todayBets >= settings.dailyBetLimit ? 'danger' : todayBets >= settings.dailyBetLimit * 0.8 ? 'warning' : 'safe' },
      exposure: { current: currentExposure, limit: settings.maxExposure, status: currentExposure >= settings.maxExposure ? 'danger' : currentExposure >= settings.maxExposure * 0.8 ? 'warning' : 'safe' },
      drawdown: { current: drawdownPercent.toFixed(1), limit: settings.stopLossPercent, status: drawdownPercent >= settings.stopLossPercent ? 'danger' : drawdownPercent >= settings.stopLossPercent * 0.7 ? 'warning' : 'safe' }
    };
  }, [stats, settings]);

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  // Allocation breakdown
  const allocationData = [
    { name: 'Points', value: 35, color: COLORS.primary },
    { name: 'Rebounds', value: 20, color: COLORS.success },
    { name: 'Assists', value: 15, color: COLORS.warning },
    { name: '3PT Made', value: 15, color: COLORS.danger },
    { name: 'PRA', value: 10, color: COLORS.secondary },
    { name: 'Other', value: 5, color: COLORS.info }
  ];

  const tooltipStyle = theme === 'dark' 
    ? { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0f] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Animated Background - Dark mode only */}
      {theme === 'dark' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}
      
      <div className="relative z-10 p-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent' : 'text-slate-800'}`}>
                  Bankroll Management
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Professional money management & risk control</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`px-4 py-2 gap-2 ${stats.totalProfit >= 0 ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
              <TrendingUp className="w-4 h-4" />
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(0)} All Time
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 px-4 py-2 gap-2">
              <Target className="w-4 h-4" />
              {stats.goalProgress.toFixed(0)}% to Goal
            </Badge>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className={theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className={theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Balance Card */}
        <GlassCard gradient theme={theme}>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Current Balance */}
              <div className="text-center lg:text-left">
                <p className={`text-sm uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Current Bankroll</p>
                <p className={`text-5xl font-bold mt-2 ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent' : 'text-emerald-600'}`}>
                  ${stats.currentBankroll.toFixed(0)}
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
                  <div className={`flex items-center gap-2 text-sm ${stats.profit7d >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stats.profit7d >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>${Math.abs(stats.profit7d).toFixed(0)} (7d)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${stats.profit30d >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stats.profit30d >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>${Math.abs(stats.profit30d).toFixed(0)} (30d)</span>
                  </div>
                </div>
              </div>

              {/* Goal Progress Circle */}
              <div className="flex justify-center">
                <div className="relative">
                  <CircularProgress 
                    value={stats.goalProgress} 
                    max={100} 
                    label="Goal" 
                    color="#10b981" 
                    size={160} 
                    theme={theme}
                  />
                </div>
              </div>

              {/* Goal Details */}
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Starting</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>${settings.initialBankroll}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Goal</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>${settings.goalAmount}</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Remaining</span>
                  <span className="font-bold text-emerald-500">${Math.max(0, settings.goalAmount - stats.currentBankroll).toFixed(0)}</span>
                </div>
                {stats.daysToGoal > 0 && (
                  <p className={`text-sm text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Est. ~{stats.daysToGoal} days to goal at current rate
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <MetricCard icon={DollarSign} label="Total P/L" value={`$${stats.totalProfit.toFixed(0)}`} trend={stats.totalProfit >= 0 ? 'up' : 'down'} subValue={`${stats.roi.toFixed(1)}%`} color={stats.totalProfit >= 0 ? 'green' : 'red'} theme={theme} />
          <MetricCard icon={Percent} label="ROI" value={`${stats.roi.toFixed(1)}%`} color={stats.roi >= 0 ? 'green' : 'red'} theme={theme} />
          <MetricCard icon={Target} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} color="blue" theme={theme} />
          <MetricCard icon={Activity} label="Total Bets" value={stats.totalBets} color="purple" theme={theme} />
          <MetricCard icon={TrendingDown} label="Max DD" value={`${stats.maxDrawdown.toFixed(1)}%`} color={stats.maxDrawdown > 15 ? 'red' : 'amber'} theme={theme} />
          <MetricCard icon={Trophy} label="Best Week" value={`$${stats.bestWeek.toFixed(0)}`} color="green" theme={theme} />
          <MetricCard icon={AlertCircle} label="Worst Week" value={`$${Math.abs(stats.worstWeek).toFixed(0)}`} color="red" theme={theme} />
          <MetricCard icon={Brain} label="Kelly Mult" value={`${settings.kellyMultiplier}x`} color="purple" theme={theme} />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50 border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-6">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-6">Performance</TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-6">Risk Management</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-6">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bankroll Chart */}
              <GlassCard className="lg:col-span-2" theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <LineChart className="w-5 h-5 text-emerald-500" /> Bankroll History (90 Days)
                  </h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={bankrollHistory}>
                      <defs>
                        <linearGradient id="bankrollGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} interval="preserveStartEnd" />
                      <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${value.toFixed(0)}`, '']} />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" fill="url(#bankrollGrad)" strokeWidth={2.5} name="Balance" />
                      <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Allocation Pie */}
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <PieChart className="w-5 h-5 text-purple-500" /> Bet Allocation
                  </h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie 
                        data={allocationData} 
                        cx="50%" 
                        cy="45%" 
                        innerRadius={50} 
                        outerRadius={85} 
                        paddingAngle={3} 
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Performance */}
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <BarChart2 className="w-5 h-5 text-blue-500" /> Weekly Profit
                  </h3>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="week" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                        {weeklyPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? COLORS.success : COLORS.danger} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Weekly ROI */}
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <TrendingUp className="w-5 h-5 text-cyan-500" /> Weekly ROI
                  </h3>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyPerformance}>
                      <defs>
                        <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="week" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'ROI']} />
                      <Area type="monotone" dataKey="roi" stroke="#06b6d4" fill="url(#roiGrad)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* Performance Table */}
            <GlassCard className="mt-6" theme={theme}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <Calendar className="w-5 h-5 text-amber-500" /> Weekly Breakdown
                </h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Week</th>
                      <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Bets</th>
                      <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Wins</th>
                      <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Win Rate</th>
                      <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ROI</th>
                      <th className={`text-right py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyPerformance.map((week) => (
                      <tr key={week.week} className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className={`py-3 px-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{week.week}</td>
                        <td className={`py-3 px-4 text-center ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{week.bets}</td>
                        <td className={`py-3 px-4 text-center ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{week.wins}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${(week.wins / week.bets * 100) >= 55 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'} border-0`}>
                            {(week.wins / week.bets * 100).toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-semibold ${week.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {week.roi >= 0 ? '+' : ''}{week.roi}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${week.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {week.profit >= 0 ? '+' : ''}${week.profit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Rules */}
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Shield className="w-5 h-5 text-blue-500" /> Risk Controls
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <RiskRule
                    icon={Activity}
                    title="Daily Bet Limit"
                    current={riskAssessment.betLimit.current}
                    limit={riskAssessment.betLimit.limit}
                    status={riskAssessment.betLimit.status}
                    theme={theme}
                  />
                  <RiskRule
                    icon={DollarSign}
                    title="Current Exposure"
                    current={`$${riskAssessment.exposure.current}`}
                    limit={`$${riskAssessment.exposure.limit}`}
                    status={riskAssessment.exposure.status}
                    theme={theme}
                  />
                  <RiskRule
                    icon={TrendingDown}
                    title="Max Drawdown"
                    current={`${riskAssessment.drawdown.current}%`}
                    limit={`${riskAssessment.drawdown.limit}%`}
                    status={riskAssessment.drawdown.status}
                    theme={theme}
                  />
                </div>
              </GlassCard>

              {/* Kelly Calculator */}
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Brain className="w-5 h-5 text-purple-500" /> Kelly Criterion Calculator
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Win Rate</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Avg Odds</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>-115</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Kelly Multiplier</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{settings.kellyMultiplier}x</span>
                    </div>
                    <div className={`h-px my-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>Recommended Bet</span>
                      <span className="text-xl font-bold text-purple-500">
                        ${((stats.currentBankroll * 0.03) * settings.kellyMultiplier).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Based on your historical performance and the Kelly Criterion formula, adjusted by your risk multiplier.
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Risk Tips */}
            <GlassCard className="mt-6" theme={theme}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Risk Management Tips
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: 'Unit Sizing', desc: `Never exceed ${settings.maxBetPercent}% of bankroll per bet`, color: 'blue' },
                  { icon: TrendingDown, title: 'Stop Loss', desc: `Stop betting if down ${settings.stopLossPercent}% in a session`, color: 'red' },
                  { icon: Target, title: 'Diversify', desc: 'Spread bets across multiple players and bet types', color: 'purple' },
                  { icon: Clock, title: 'Timing', desc: 'Avoid chasing losses with impulsive bets', color: 'amber' },
                  { icon: BookOpen, title: 'Track Everything', desc: 'Log every bet to identify patterns', color: 'cyan' },
                  { icon: Zap, title: 'Edge Focus', desc: 'Only bet when you identify clear value', color: 'green' }
                ].map((tip, i) => (
                  <div key={i} className={`p-4 rounded-xl ${theme === 'dark' ? `bg-${tip.color}-500/10 border border-${tip.color}-500/20` : `bg-${tip.color}-50 border border-${tip.color}-100`}`}>
                    <div className="flex items-start gap-3">
                      <tip.icon className={`w-5 h-5 text-${tip.color}-500 mt-0.5`} />
                      <div>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{tip.title}</h4>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{tip.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Wallet className="w-5 h-5 text-emerald-500" /> Bankroll Settings
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { key: 'initialBankroll', label: 'Initial Bankroll', prefix: '$' },
                    { key: 'goalAmount', label: 'Goal Amount', prefix: '$' },
                    { key: 'monthlyDeposit', label: 'Monthly Deposit', prefix: '$' }
                  ].map(field => (
                    <div key={field.key} className="flex items-center justify-between">
                      <label className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{field.label}</label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{field.prefix}</span>
                          <Input
                            type="number"
                            value={tempSettings[field.key]}
                            onChange={(e) => setTempSettings({ ...tempSettings, [field.key]: parseFloat(e.target.value) || 0 })}
                            className={`w-32 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                          />
                        </div>
                      ) : (
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{field.prefix}{settings[field.key]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Shield className="w-5 h-5 text-blue-500" /> Risk Settings
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { key: 'maxBetPercent', label: 'Max Bet %', suffix: '%' },
                    { key: 'stopLossPercent', label: 'Stop Loss %', suffix: '%' },
                    { key: 'dailyBetLimit', label: 'Daily Bet Limit', suffix: ' bets' },
                    { key: 'maxExposure', label: 'Max Exposure', prefix: '$' },
                    { key: 'kellyMultiplier', label: 'Kelly Multiplier', suffix: 'x' }
                  ].map(field => (
                    <div key={field.key} className="flex items-center justify-between">
                      <label className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{field.label}</label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          {field.prefix && <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{field.prefix}</span>}
                          <Input
                            type="number"
                            step={field.key === 'kellyMultiplier' ? '0.05' : '1'}
                            value={tempSettings[field.key]}
                            onChange={(e) => setTempSettings({ ...tempSettings, [field.key]: parseFloat(e.target.value) || 0 })}
                            className={`w-24 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                          />
                          {field.suffix && <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{field.suffix}</span>}
                        </div>
                      ) : (
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                          {field.prefix}{settings[field.key]}{field.suffix}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {!isEditing && (
              <div className="mt-6 text-center">
                <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Settings
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


