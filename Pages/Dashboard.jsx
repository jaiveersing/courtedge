
import { useState, useEffect } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { AppCard } from "@/Components/ui/AppCard";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Link } from "react-router-dom";
import { Prediction } from "@/Entities/Prediction";
import { Bet } from "@/Entities/Bet";
import { Bankroll } from "@/Entities/Bankroll";
import { format } from "date-fns";
import {
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Activity,
  Zap,
  TrendingUp as TrendingUpIcon,
  DollarSign,
  Flame,
  Shield,
  Brain,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Star
} from "lucide-react";
import SharpMoneyAlerts from "@/Components/ai/SharpMoneyAlerts";
import { 
  StatCard, 
  QuickActionCard, 
  AlertCard, 
  MiniChart, 
  ProgressRing,
  LeaderboardItem 
} from "@/Components/ui/DashboardWidgets";
import HotStreakBanner from "@/Components/ui/HotStreakBanner";
import LiveAlerts from "@/Components/ui/LiveAlerts";
import MLServiceStatus from "@/Components/ml/MLServiceStatus";

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    liveGames: 8,
    roiPercent: 12.4,
    totalEVProps: 23,
    todaysProfit: 247.50,
    growthPercent: 8.3,
    dayStreak: 5,
    accuracy: 76.3,
    disciplineScore: 82,
    avgCLV: 4.3,
    eliteOpportunities: 3
  });

  const [recentPerformance, setRecentPerformance] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Theme-aware design system
  const ds = {
    bg: theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/90',
    bgCard: theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-50/90',
    bgHero: theme === 'dark' ? 'bg-white/[0.02]' : 'bg-slate-100/50',
    border: theme === 'dark' ? 'border-white/5' : 'border-slate-200/80',
    borderLight: theme === 'dark' ? 'border-white/10' : 'border-slate-300/50',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    hover: theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100',
  };

  useEffect(() => {
    loadStats();
    loadRecentPerformance();
    loadTopPerformers();
    loadAlerts();
  }, []);

  const loadStats = async () => {
    try {
      const liveGames = Math.floor(Math.random() * 10) + 6;
      const todaysProfit = (Math.random() * 400 - 100);
      const growthPercent = (Math.random() * 20 - 5);
      const roiPercent = (Math.random() * 15 + 5);
      const totalEVProps = Math.floor(Math.random() * 30) + 15;
      const dayStreak = Math.floor(Math.random() * 10);
      const accuracy = Math.random() * 20 + 65;
      const disciplineScore = Math.floor(Math.random() * 20) + 75;
      const avgCLV = Math.random() * 6 + 2;
      const eliteOpportunities = Math.floor(Math.random() * 8);

      setStats({
        liveGames,
        roiPercent,
        totalEVProps,
        todaysProfit,
        growthPercent,
        dayStreak,
        accuracy,
        disciplineScore,
        avgCLV,
        eliteOpportunities
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadRecentPerformance = () => {
    // Generate last 7 days of performance data
    const data = [];
    for (let i = 6; i >= 0; i--) {
      data.push((Math.random() * 200 - 50)); // Random profit/loss
    }
    setRecentPerformance(data);
  };

  const loadTopPerformers = () => {
    const players = [
      "LeBron James", "Stephen Curry", "Giannis Antetokounmpo",
      "Luka Doncic", "Joel Embiid", "Nikola Jokic",
      "Kevin Durant", "Damian Lillard"
    ];
    
    const performers = players.slice(0, 5).map((player, idx) => ({
      name: player,
      value: `${(Math.random() * 5 + 10).toFixed(1)}%`,
      change: (Math.random() * 10 - 2).toFixed(1)
    }));
    
    setTopPerformers(performers);
  };

  const loadAlerts = () => {
    const alertTypes = ['success', 'warning', 'info'];
    const messages = [
      { type: 'success', title: 'Hot Streak!', message: 'You\'ve won 5 bets in a row. Keep it up!' },
      { type: 'warning', title: 'Line Movement', message: 'LAL vs GSW spread moved from -3.5 to -5.0' },
      { type: 'info', title: 'New Props Available', message: '12 new player props added for tonight\'s games' }
    ];
    
    setAlerts(messages.slice(0, 2));
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-full mx-auto px-8 py-6 relative z-10">
        {/* Hot Streak Banner */}
        <HotStreakBanner />
        
        {/* Top Header Bar */}
        <div className={`mb-8 p-8 rounded-2xl ${ds.bgHero} backdrop-blur-xl border ${ds.border}`}>
          {/* Top Row: Branding and Main Stats */}
          <div className="flex items-center justify-between mb-8">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-glow">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${ds.text}`}>CourtEdge</h1>
                <div className="flex items-center gap-2">
                  <p className={`${ds.textMuted} text-sm`}>Professional Betting Intelligence Platform</p>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    Elite v3.0
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Key Metrics */}
            <div className="flex items-center gap-12">
              <div className={`text-center p-4 rounded-xl ${ds.bgCard} border ${ds.borderLight} transition-all duration-300 hover:scale-105`}>
                <div className={`font-bold text-4xl mb-1 ${stats.todaysProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.todaysProfit >= 0 ? '+' : ''}${stats.todaysProfit.toFixed(2)}
                </div>
                <div className={`${ds.textMuted} text-sm font-medium mb-1`}>Today's Profit</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${stats.growthPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.growthPercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stats.growthPercent >= 0 ? '+' : ''}{stats.growthPercent.toFixed(1)}% Growth
                </div>
              </div>

              <div className={`text-center p-4 rounded-xl ${ds.bgCard} border ${ds.borderLight} transition-all duration-300 hover:scale-105`}>
                <div className="text-cyan-400 font-bold text-4xl mb-1 flex items-center justify-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  {stats.dayStreak}
                </div>
                <div className={`${ds.textMuted} text-sm font-medium mb-1`}>Day Streak</div>
                <div className="text-cyan-400 text-xs">{stats.accuracy.toFixed(1)}% Accuracy</div>
              </div>

              <div className={`text-center p-4 rounded-xl ${ds.bgCard} border ${ds.borderLight} transition-all duration-300 hover:scale-105`}>
                <div className="text-purple-400 font-bold text-4xl mb-1">{stats.disciplineScore}</div>
                <div className={`${ds.textMuted} text-sm font-medium mb-1`}>Discipline Score</div>
                <div className="text-purple-400 text-xs">+{stats.avgCLV.toFixed(1)}% Avg CLV</div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Live Stats */}
          <div className={`flex items-center gap-8 pt-6 border-t ${ds.border}`}>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'} border border-green-500/30`}>
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className={`${ds.text} font-semibold text-lg`}>{stats.eliteOpportunities} Elite Opportunities</span>
            </div>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} border border-blue-500/30`}>
              <Target className="w-5 h-5 text-blue-400" />
              <span className={`${ds.text} font-semibold text-lg`}>{stats.liveGames} Games Analyzed</span>
            </div>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} border border-purple-500/30`}>
              <Brain className="w-5 h-5 text-purple-400" />
              <span className={`${ds.text} font-semibold text-lg`}>ML Active</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">LIVE</span>
            </div>
          </div>
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold ${ds.text} mb-6 flex items-center gap-3`}>
            <Star className="w-6 h-6 text-yellow-400" />
            Performance Overview
          </h2>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={DollarSign}
              title="Today's Profit"
              value={`$${Math.abs(stats.todaysProfit).toFixed(2)}`}
              change={stats.growthPercent}
              trend={stats.growthPercent >= 0 ? 'up' : 'down'}
            />
            
            <StatCard
              icon={TrendingUp}
              title="ROI"
              value={`${stats.roiPercent.toFixed(1)}%`}
              change={2.3}
              trend="up"
            />
            
            <StatCard
              icon={Target}
              title="Win Rate"
              value={`${stats.accuracy.toFixed(1)}%`}
              change={-1.2}
              trend="down"
            />
            
            <StatCard
              icon={Flame}
              title="Win Streak"
              value={stats.dayStreak.toString()}
              subtitle={`${stats.eliteOpportunities} hot props`}
              trend="neutral"
            />
          </div>

          {/* Charts, ML Status, and Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <MLServiceStatus />
            </div>
            <div>
              <AppCard className="p-6">
                <h3 className={`text-lg font-bold ${ds.text} mb-4 flex items-center gap-2`}>
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Last 7 Days Performance
                </h3>
                <MiniChart 
                  data={recentPerformance}
                  height={120}
                />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className={ds.textMuted}>Average: ${(recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length || 0).toFixed(2)}</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +{stats.growthPercent.toFixed(1)}% vs last week
                  </span>
                </div>
              </AppCard>
            </div>

            <div>
              <LiveAlerts maxAlerts={2} />
            </div>
          </div>

          {/* Progress and Leaderboard Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppCard className="p-6">
              <h3 className={`text-lg font-bold ${ds.text} mb-6 flex items-center gap-2`}>
                <Trophy className="w-5 h-5 text-yellow-400" />
                Monthly Goal Progress
              </h3>
              <div className="flex items-center justify-center mb-6">
                <ProgressRing
                  percentage={68}
                  size={180}
                  strokeWidth={12}
                  color="from-green-400 to-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-3 rounded-xl ${ds.bgCard} border ${ds.borderLight}`}>
                  <div className={`text-2xl font-bold ${ds.text} mb-1`}>$6,800</div>
                  <div className={ds.textMuted}>Current</div>
                </div>
                <div className={`p-3 rounded-xl ${ds.bgCard} border ${ds.borderLight}`}>
                  <div className={`text-2xl font-bold ${ds.textSecondary} mb-1`}>$10,000</div>
                  <div className={ds.textMuted}>Target</div>
                </div>
              </div>
            </AppCard>

            <AppCard className="p-6">
              <h3 className={`text-lg font-bold ${ds.text} mb-6 flex items-center gap-2`}>
                <Users className="w-5 h-5 text-purple-400" />
                Top Performing Props
              </h3>
              <div className="space-y-3">
                {topPerformers.map((performer, idx) => (
                  <LeaderboardItem
                    key={idx}
                    rank={idx + 1}
                    name={performer.name}
                    subtitle="Player Props"
                    value={performer.value}
                    trend={parseFloat(performer.change) >= 0 ? 'up' : 'down'}
                  />
                ))}
              </div>
            </AppCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold ${ds.text} mb-6 flex items-center gap-3`}>
            <Zap className="w-6 h-6 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <QuickActionCard
              icon={Users}
              title="Player Trends"
              description="Analyze player performance"
              link="/player-trends"
            />
            
            <QuickActionCard
              icon={Target}
              title="Team Matchups"
              description="View today's games"
              link="/todays-matchups"
            />
            
            <QuickActionCard
              icon={Brain}
              title="AI Predictions"
              description="ML-powered insights"
              link="/predictions"
              badge="NEW"
            />
            
            <QuickActionCard
              icon={TrendingUp}
              title="Analytics"
              description="Deep performance stats"
              link="/analytics"
            />
            
            <QuickActionCard
              icon={BarChart3}
              title="Prop Tool"
              description="Find value props"
              link="/player-props"
              badge="HOT"
            />
          </div>
        </div>
        
        {/* Find your bet Section */}
        <div className="mb-10">
          <div className="mb-8">
            <h1 className={`text-5xl font-bold ${ds.text} mb-3`}>Find your bet</h1>
            <p className={`text-lg ${ds.textMuted}`}>Analyze matchups, trends, and player props</p>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <Link to="/player-trends">
              <button className="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl">
                <Users className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Player Trends</span>
              </button>
            </Link>
            
            <Link to="/todays-matchups">
              <button className="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl">
                <Users className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Team Trends</span>
              </button>
            </Link>
            
            <Link to="/predictions">
              <button className="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl">
                <Target className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Parlay Trends</span>
              </button>
            </Link>
            
            <Link to="/analytics">
              <button className="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl">
                <TrendingUp className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Alternate Lines</span>
              </button>
            </Link>
            
            <Link to="/player-props">
              <button className="w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl">
                <BarChart3 className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Prop Tool</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Today's Matchups */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`text-3xl font-bold ${ds.text}`}>
              Today's Matchups <span className="text-blue-400">Nov 30</span>
            </h2>
            <Link to="/todays-matchups" className={`flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors ${ds.textMuted}`}>
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game Card 1: BOS @ MIN */}
            <AppCard className={`p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
              <div className={`text-center text-sm ${ds.textMuted} mb-5`}>03:30</div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg" alt="BOS" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>BOS</div>
                      <div className={`${ds.textMuted} text-sm`}>10-8</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>+235</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg" alt="MIN" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>MIN</div>
                      <div className={`${ds.textMuted} text-sm`}>10-8</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>-290</div>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-3 gap-4 pb-4 border-b ${ds.border}`}>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Spread</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>+7.5 / -7.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-114 / -106</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Total</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>o227.5 / u227.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-106 / -106</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>ML</div>
                  <div className={`${ds.text} font-semibold text-sm`}>+235 / -290</div>
                </div>
              </div>
            </AppCard>

            {/* Game Card 2: TOR @ CHA */}
            <AppCard className={`p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
              <div className={`text-center text-sm ${ds.textMuted} mb-5`}>04:30</div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg" alt="TOR" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>TOR</div>
                      <div className={`${ds.textMuted} text-sm`}>14-5</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>-334</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg" alt="CHA" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>CHA</div>
                      <div className={`${ds.textMuted} text-sm`}>5-14</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>+270</div>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-3 gap-4 pb-4 border-b ${ds.border}`}>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Spread</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>-7.5 / +7.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-114 / -106</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Total</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>o233.5 / u233.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-110 / -110</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>ML</div>
                  <div className={`${ds.text} font-semibold text-sm`}>-334 / +270</div>
                </div>
              </div>
            </AppCard>

            {/* Game Card 3: CHI @ IND */}
            <AppCard className={`p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
              <div className={`text-center text-sm ${ds.textMuted} mb-5`}>06:00</div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg" alt="CHI" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>CHI</div>
                      <div className={`${ds.textMuted} text-sm`}>9-9</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>-148</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg" alt="IND" className="w-12 h-12" />
                    <div>
                      <div className={`${ds.text} font-bold text-lg`}>IND</div>
                      <div className={`${ds.textMuted} text-sm`}>3-16</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${ds.textMuted} text-xs mb-1`}>Money</div>
                    <div className={`${ds.text} font-semibold`}>+126</div>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-3 gap-4 pb-4 border-b ${ds.border}`}>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Spread</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>-3.5 / +3.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-106 / -112</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>Total</div>
                  <div className={`${ds.text} font-semibold text-sm mb-1`}>o241.5 / u241.5</div>
                  <div className={`${ds.textMuted} text-xs`}>-112 / -106</div>
                </div>
                <div className="text-center">
                  <div className={`${ds.textMuted} text-xs mb-1 font-medium`}>ML</div>
                  <div className={`${ds.text} font-semibold text-sm`}>-148 / +126</div>
                </div>
              </div>
            </AppCard>
          </div>
        </div>

        {/* Sharp Money Alerts */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold ${ds.text} mb-6 flex items-center gap-2`}>
            <Brain className="w-6 h-6 text-purple-400" />
            AI-Powered Sharp Money Detection
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
              Elite ML v3.0
            </span>
          </h2>
          <SharpMoneyAlerts />
        </div>
      </div>
    </div>
  );
}
