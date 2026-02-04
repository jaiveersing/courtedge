import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { PlayerSeasonStats, Bet } from '@/Entities/all';
import PlayersAPI from '@/src/api/playersApi';
import { Input } from '@/Components/ui/input';
import { 
  Search, BarChart2, User, TrendingUp, TrendingDown, Zap, DollarSign, Target, 
  Award, Flame, Activity, Calendar, Filter, Download, RefreshCw, Trophy, 
  AlertCircle, ChevronRight, Sparkles, Brain, LineChart, PieChart, Wallet,
  ArrowUpRight, ArrowDownRight, Clock, Star, Shield, Percent, Hash, Layers,
  ChevronUp, ChevronDown, Eye, Settings, Bell, BookOpen, Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import StatLeaderChart from '../Components/analytics/StatLeaderChart';
import PlayerStatsTable from '../Components/analytics/PlayerStatsTable';
import PerformanceChart from '../Components/charts/PerformanceChart';
import ROIChart from '../Components/charts/ROIChart';
import WinRateChart from '../Components/charts/WinRateChart';
import { 
  LineChart as RechartsLine, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, 
  Pie, Cell, BarChart, Bar, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts';

// Elite color palette
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
  chart: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1']
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [bets, setBets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('2023-24');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30D');

  // Generate 100 elite sample bets with comprehensive data
  const generateSampleBets = () => {
    const betTypes = ['Points', 'Rebounds', 'Assists', '3PT Made', 'Pts+Reb+Ast', 'Steals', 'Blocks', 'Fantasy Score', 'Double-Double', 'First Basket'];
    const players = [
      { name: 'LeBron James', team: 'LAL', tier: 'S' },
      { name: 'Stephen Curry', team: 'GSW', tier: 'S' },
      { name: 'Kevin Durant', team: 'PHX', tier: 'S' },
      { name: 'Giannis Antetokounmpo', team: 'MIL', tier: 'S' },
      { name: 'Luka Dončić', team: 'DAL', tier: 'S' },
      { name: 'Joel Embiid', team: 'PHI', tier: 'S' },
      { name: 'Nikola Jokić', team: 'DEN', tier: 'S' },
      { name: 'Jayson Tatum', team: 'BOS', tier: 'A' },
      { name: 'Damian Lillard', team: 'MIL', tier: 'A' },
      { name: 'Devin Booker', team: 'PHX', tier: 'A' },
      { name: 'Anthony Davis', team: 'LAL', tier: 'A' },
      { name: 'Ja Morant', team: 'MEM', tier: 'A' },
      { name: 'Trae Young', team: 'ATL', tier: 'B' },
      { name: 'Donovan Mitchell', team: 'CLE', tier: 'B' },
      { name: 'Kyrie Irving', team: 'DAL', tier: 'A' },
      { name: 'Anthony Edwards', team: 'MIN', tier: 'A' },
      { name: 'Tyrese Haliburton', team: 'IND', tier: 'B' },
      { name: 'Paolo Banchero', team: 'ORL', tier: 'B' }
    ];
    
    const bookmakers = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet', 'Bet365'];
    const sampleBets = [];
    const today = new Date();
    
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      const isWin = Math.random() > 0.35;
      const isPush = !isWin && Math.random() > 0.9;
      const betAmount = [10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200][Math.floor(Math.random() * 11)];
      const odds = [-140, -135, -130, -125, -120, -115, -110, -105, +100, +105, +110, +115, +120, +125][Math.floor(Math.random() * 14)];
      const player = players[Math.floor(Math.random() * players.length)];
      const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
      const bookmaker = bookmakers[Math.floor(Math.random() * bookmakers.length)];
      
      const line = betType === 'Points' ? 18 + Math.floor(Math.random() * 22) :
                   betType === 'Rebounds' ? 4 + Math.floor(Math.random() * 14) :
                   betType === 'Assists' ? 3 + Math.floor(Math.random() * 12) :
                   betType === '3PT Made' ? 1 + Math.floor(Math.random() * 7) :
                   betType === 'Pts+Reb+Ast' ? 25 + Math.floor(Math.random() * 40) :
                   betType === 'Fantasy Score' ? 30 + Math.floor(Math.random() * 35) :
                   1 + Math.floor(Math.random() * 5);
      
      const potentialPayout = odds > 0 
        ? betAmount + (betAmount * odds / 100)
        : betAmount + (betAmount * 100 / Math.abs(odds));
      
      const actualResult = isWin ? (Math.random() > 0.5 ? line + Math.floor(Math.random() * 8) + 1 : line - Math.floor(Math.random() * 3)) :
                                   (Math.random() > 0.5 ? line - Math.floor(Math.random() * 8) - 1 : line + Math.floor(Math.random() * 3));
      
      sampleBets.push({
        id: `bet-${i + 1}`,
        date: date.toISOString(),
        timestamp: date.toISOString(),
        player: player.name,
        team: player.team,
        tier: player.tier,
        betType: betType,
        propType: betType.toLowerCase().replace(/\s+/g, '_'),
        line: line,
        actualResult: actualResult,
        pick: Math.random() > 0.5 ? 'Over' : 'Under',
        odds: odds,
        stake: betAmount,
        result: isPush ? 'push' : (isWin ? 'win' : 'loss'),
        status: 'settled',
        potentialPayout: potentialPayout,
        payout: isWin ? potentialPayout : (isPush ? betAmount : 0),
        profit: isWin ? (potentialPayout - betAmount) : (isPush ? 0 : -betAmount),
        sport: 'NBA',
        confidence: Math.floor(55 + Math.random() * 42),
        bookmaker: bookmaker,
        edgePercent: (Math.random() * 18 + 2).toFixed(1),
        model: ['Ensemble', 'XGBoost', 'Neural Net', 'LSTM'][Math.floor(Math.random() * 4)],
        tags: Math.random() > 0.7 ? ['Sharp Pick'] : Math.random() > 0.5 ? ['High Volume'] : []
      });
    }
    
    return sampleBets.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Player data is now fetched from live API - no mock generation needed

  // Initialize bets on mount
  useEffect(() => {
    setBets(generateSampleBets());
  }, []);

  // Fetch player stats (LIVE DATA from API)
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch live data from our backend API
        const players = await PlayersAPI.getPlayers({ limit: 100 });
        
        // Transform to expected format
        const data = players.map((p, idx) => ({
          id: p.id || `player_${idx + 1}`,
          player_name: p.name || p.fullName || p.displayName,
          team_abbreviation: p.team || p.teamAbbr,
          position: p.position,
          season: '2024-25',
          games_played: p.gamesPlayed || 0,
          minutes_per_game: p.minutesPerGame || 0,
          points_per_game: p.ppg || 0,
          rebounds_per_game: p.rpg || 0,
          assists_per_game: p.apg || 0,
          steals_per_game: p.spg || 0,
          blocks_per_game: p.bpg || 0,
          turnovers_per_game: p.tpg || 0,
          field_goal_percentage: (p.fgPct || 0) / 100,
          three_point_percentage: (p.fg3Pct || 0) / 100,
          free_throw_percentage: (p.ftPct || 0) / 100,
          player_image_url: p.headshot || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'Player')}&background=random&size=128`
        }));
        
        if (data.length > 0) {
          setAllStats(data);
          setStats(data.filter(player => player.season === seasonFilter));
        } else {
          // Try entity fallback
          const entityData = await PlayerSeasonStats.list('-points_per_game');
          setAllStats(entityData || []);
          setStats((entityData || []).filter(player => player.season === seasonFilter));
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
        setAllStats([]);
        setStats([]);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, [seasonFilter]);

  // Filter stats
  useEffect(() => {
    const filtered = allStats.filter(player => {
      const matchesSearch = player.player_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = teamFilter === 'all' || player.team_abbreviation === teamFilter;
      const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
      return matchesSearch && matchesTeam && matchesPosition;
    });
    setStats(filtered);
  }, [searchTerm, teamFilter, positionFilter, allStats]);

  // ==================== ADVANCED ANALYTICS CALCULATIONS ====================
  const analytics = useMemo(() => {
    if (!bets.length) {
return null;
}

    const wins = bets.filter(b => b.result === 'win').length;
    const losses = bets.filter(b => b.result === 'loss').length;
    const pushes = bets.filter(b => b.result === 'push').length;
    const totalProfit = bets.reduce((sum, b) => sum + (b.profit || 0), 0);
    const totalStaked = bets.reduce((sum, b) => sum + b.stake, 0);
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
    const avgOdds = bets.reduce((sum, b) => sum + b.odds, 0) / bets.length;
    const avgStake = totalStaked / bets.length;

    // Streak calculation
    const calculateStreak = () => {
      let count = 0;
      let type = null;
      for (const bet of bets) {
        if (bet.result === 'push') {
continue;
}
        if (!type) {
type = bet.result;
}
        if (bet.result === type) {
count++;
} else {
break;
}
      }
      return { count, type };
    };

    // Profit by bet type
    const profitByType = {};
    bets.forEach(bet => {
      if (!profitByType[bet.betType]) {
        profitByType[bet.betType] = { profit: 0, count: 0, wins: 0, stake: 0 };
      }
      profitByType[bet.betType].profit += bet.profit || 0;
      profitByType[bet.betType].count++;
      profitByType[bet.betType].stake += bet.stake;
      if (bet.result === 'win') {
profitByType[bet.betType].wins++;
}
    });

    // Profit by player
    const profitByPlayer = {};
    bets.forEach(bet => {
      if (!profitByPlayer[bet.player]) {
        profitByPlayer[bet.player] = { profit: 0, count: 0, wins: 0, team: bet.team };
      }
      profitByPlayer[bet.player].profit += bet.profit || 0;
      profitByPlayer[bet.player].count++;
      if (bet.result === 'win') {
profitByPlayer[bet.player].wins++;
}
    });

    // Profit by bookmaker
    const profitByBookmaker = {};
    bets.forEach(bet => {
      if (!profitByBookmaker[bet.bookmaker]) {
        profitByBookmaker[bet.bookmaker] = { profit: 0, count: 0, wins: 0, stake: 0 };
      }
      profitByBookmaker[bet.bookmaker].profit += bet.profit || 0;
      profitByBookmaker[bet.bookmaker].count++;
      profitByBookmaker[bet.bookmaker].stake += bet.stake;
      if (bet.result === 'win') {
profitByBookmaker[bet.bookmaker].wins++;
}
    });

    // Daily performance for chart
    const dailyPerformance = {};
    let cumProfit = 0;
    const sortedBets = [...bets].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedBets.forEach(bet => {
      const day = new Date(bet.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      cumProfit += bet.profit || 0;
      if (!dailyPerformance[day]) {
        dailyPerformance[day] = { profit: 0, cumulative: 0, bets: 0, wins: 0 };
      }
      dailyPerformance[day].profit += bet.profit || 0;
      dailyPerformance[day].cumulative = cumProfit;
      dailyPerformance[day].bets++;
      if (bet.result === 'win') {
dailyPerformance[day].wins++;
}
    });

    // Weekly performance
    const weeklyData = [];
    const weekMap = {};
    sortedBets.forEach(bet => {
      const weekStart = new Date(bet.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      if (!weekMap[weekKey]) {
        weekMap[weekKey] = { week: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, profit: 0, bets: 0, wins: 0 };
      }
      weekMap[weekKey].profit += bet.profit || 0;
      weekMap[weekKey].bets++;
      if (bet.result === 'win') {
weekMap[weekKey].wins++;
}
    });
    Object.values(weekMap).forEach(w => weeklyData.push(w));

    // Sharpe Ratio
    const returns = bets.map(b => (b.profit || 0) / b.stake);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const sharpeRatio = variance > 0 ? (avgReturn / Math.sqrt(variance)).toFixed(2) : 0;

    // Kelly Criterion
    const p = winRate / 100;
    const b = avgOdds > 0 ? avgOdds / 100 : 100 / Math.abs(avgOdds);
    const kelly = ((b * p) - (1 - p)) / b;
    const kellyPercent = Math.max(0, kelly * 100).toFixed(1);

    // Expected Value
    const expectedValue = bets.reduce((sum, b) => {
      const winProb = b.confidence / 100;
      const loseProb = 1 - winProb;
      const winAmount = b.potentialPayout - b.stake;
      const loseAmount = -b.stake;
      return sum + (winProb * winAmount + loseProb * loseAmount);
    }, 0);

    // Edge analysis
    const highEdgeBets = bets.filter(b => parseFloat(b.edgePercent) > 8);
    const highEdgeWinRate = highEdgeBets.length > 0 
      ? (highEdgeBets.filter(b => b.result === 'win').length / highEdgeBets.length) * 100 
      : 0;

    // Best/worst
    const biggestWin = Math.max(...bets.map(b => b.profit || 0));
    const biggestLoss = Math.min(...bets.map(b => b.profit || 0));

    // Model performance
    const modelPerformance = {};
    bets.forEach(bet => {
      if (!modelPerformance[bet.model]) {
        modelPerformance[bet.model] = { profit: 0, count: 0, wins: 0 };
      }
      modelPerformance[bet.model].profit += bet.profit || 0;
      modelPerformance[bet.model].count++;
      if (bet.result === 'win') {
modelPerformance[bet.model].wins++;
}
    });

    return {
      wins,
      losses,
      pushes,
      totalBets: bets.length,
      totalProfit,
      totalStaked,
      roi,
      winRate,
      avgOdds,
      avgStake,
      streak: calculateStreak(),
      biggestWin,
      biggestLoss,
      sharpeRatio,
      kellyPercent,
      expectedValue,
      highEdgeBets: highEdgeBets.length,
      highEdgeWinRate,
      profitByType: Object.entries(profitByType)
        .map(([type, data]) => ({ 
          type, 
          ...data, 
          winRate: (data.wins / data.count) * 100,
          roi: (data.profit / data.stake) * 100
        }))
        .sort((a, b) => b.profit - a.profit),
      profitByPlayer: Object.entries(profitByPlayer)
        .map(([player, data]) => ({ 
          player, 
          ...data, 
          winRate: (data.wins / data.count) * 100 
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10),
      profitByBookmaker: Object.entries(profitByBookmaker)
        .map(([bookmaker, data]) => ({ 
          bookmaker, 
          ...data, 
          winRate: (data.wins / data.count) * 100,
          roi: (data.profit / data.stake) * 100
        }))
        .sort((a, b) => b.profit - a.profit),
      dailyPerformance: Object.entries(dailyPerformance)
        .map(([day, data]) => ({ day, ...data }))
        .slice(-30),
      weeklyData: weeklyData.slice(-12),
      modelPerformance: Object.entries(modelPerformance)
        .map(([model, data]) => ({ 
          model, 
          ...data, 
          winRate: (data.wins / data.count) * 100 
        }))
        .sort((a, b) => b.profit - a.profit)
    };
  }, [bets, timeRange]);

  const getTopPlayers = (statKey, count = 10) => {
    return [...stats].sort((a, b) => b[statKey] - a[statKey]).slice(0, count);
  };

  // ==================== THEME-AWARE CUSTOM COMPONENTS ====================
  const MetricCard = ({ icon: Icon, label, value, subValue, trend, color = 'blue', size = 'normal' }) => {
    const colorMap = {
      blue: { darkBg: 'rgba(59, 130, 246, 0.1)', lightBg: 'bg-blue-50', border: 'rgba(59, 130, 246, 0.2)', text: 'text-blue-500' },
      green: { darkBg: 'rgba(16, 185, 129, 0.1)', lightBg: 'bg-emerald-50', border: 'rgba(16, 185, 129, 0.2)', text: 'text-emerald-500' },
      purple: { darkBg: 'rgba(139, 92, 246, 0.1)', lightBg: 'bg-purple-50', border: 'rgba(139, 92, 246, 0.2)', text: 'text-purple-500' },
      orange: { darkBg: 'rgba(245, 158, 11, 0.1)', lightBg: 'bg-orange-50', border: 'rgba(245, 158, 11, 0.2)', text: 'text-orange-500' },
      pink: { darkBg: 'rgba(236, 72, 153, 0.1)', lightBg: 'bg-pink-50', border: 'rgba(236, 72, 153, 0.2)', text: 'text-pink-500' },
      cyan: { darkBg: 'rgba(6, 182, 212, 0.1)', lightBg: 'bg-cyan-50', border: 'rgba(6, 182, 212, 0.2)', text: 'text-cyan-500' },
      indigo: { darkBg: 'rgba(99, 102, 241, 0.1)', lightBg: 'bg-indigo-50', border: 'rgba(99, 102, 241, 0.2)', text: 'text-indigo-500' },
      red: { darkBg: 'rgba(239, 68, 68, 0.1)', lightBg: 'bg-red-50', border: 'rgba(239, 68, 68, 0.2)', text: 'text-red-500' }
    };
    
    const colors = colorMap[color] || colorMap.blue;
    
    return (
      <div 
        className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${size === 'large' ? 'p-6' : 'p-4'}
          ${theme === 'dark' ? '' : colors.lightBg}`}
        style={theme === 'dark' ? {
          background: `linear-gradient(135deg, ${colors.darkBg} 0%, transparent 100%)`,
          border: `1px solid ${colors.border}`
        } : {
          border: `1px solid ${colors.border}`
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'light' && 'from-black/5'}`} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
          </div>
          <div className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-2xl'} ${colors.text}`}>
            {value}
          </div>
          {subValue && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{subValue}</div>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}% vs last period
            </div>
          )}
        </div>
      </div>
    );
  };

  const GlassCard = ({ children, className = '', gradient = false }) => (
    <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-300
      ${theme === 'dark' 
        ? `border-white/10 ${gradient ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80' : 'bg-slate-900/50'}`
        : `border-slate-200 ${gradient ? 'bg-gradient-to-br from-white via-slate-50 to-white' : 'bg-white'} shadow-lg`
      } ${className}`}>
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-blue-50/30 to-transparent'}`} />
      <div className="relative z-10">{children}</div>
    </div>
  );

  const tooltipStyle = theme === 'dark' 
    ? { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className={`h-16 w-1/3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className={`h-28 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />)}
          </div>
          <Skeleton className={`h-96 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300
      ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Animated Background Orbs - Dark mode only */}
      {theme === 'dark' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse delay-500" />
        </div>
      )}

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
        {/* ==================== ELITE HEADER ==================== */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent' : 'text-slate-800'}`}>
                  Elite Analytics Hub
                </h1>
                <p className={`mt-1 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  AI-Powered Performance Intelligence • {analytics?.totalBets || 0} Bets Analyzed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Live Sync</span>
              </div>
              <Button variant="outline" className={theme === 'dark' ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700' : ''}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className={theme === 'dark' ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700' : ''} onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* ==================== 8 METRIC DASHBOARD BANNER ==================== */}
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <MetricCard 
                icon={DollarSign} 
                label="Total P/L" 
                value={`$${analytics.totalProfit.toFixed(0)}`}
                subValue={`${analytics.roi >= 0 ? '+' : ''}${analytics.roi.toFixed(1)}% ROI`}
                color={analytics.totalProfit >= 0 ? 'green' : 'red'}
              />
              <MetricCard 
                icon={Target} 
                label="Win Rate" 
                value={`${analytics.winRate.toFixed(1)}%`}
                subValue={`${analytics.wins}W - ${analytics.losses}L`}
                color="blue"
              />
              <MetricCard 
                icon={Flame} 
                label="Streak" 
                value={analytics.streak.count}
                subValue={analytics.streak.type === 'win' ? '🔥 Wins' : '❄️ Losses'}
                color={analytics.streak.type === 'win' ? 'orange' : 'cyan'}
              />
              <MetricCard 
                icon={Wallet} 
                label="Avg Stake" 
                value={`$${analytics.avgStake.toFixed(0)}`}
                subValue={`${analytics.totalBets} total bets`}
                color="purple"
              />
              <MetricCard 
                icon={Trophy} 
                label="Best Win" 
                value={`$${analytics.biggestWin.toFixed(0)}`}
                subValue="Single bet"
                color="green"
              />
              <MetricCard 
                icon={Brain} 
                label="Sharpe" 
                value={analytics.sharpeRatio}
                subValue="Risk-adjusted"
                color="indigo"
              />
              <MetricCard 
                icon={Zap} 
                label="Avg Edge" 
                value={`${(bets.reduce((s, b) => s + parseFloat(b.edgePercent), 0) / bets.length).toFixed(1)}%`}
                subValue="Per bet"
                color="pink"
              />
              <MetricCard 
                icon={Award} 
                label="Kelly %" 
                value={`${analytics.kellyPercent}%`}
                subValue="Optimal size"
                color="cyan"
              />
            </div>
          )}
        </div>

        {/* ==================== ELITE TABS ==================== */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`p-1.5 mb-8 inline-flex rounded-2xl ${theme === 'dark' ? 'bg-slate-800/30 backdrop-blur-xl border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl px-6 transition-all">
              <BarChart2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl px-6 transition-all">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl px-6 transition-all">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-xl px-6 transition-all">
              <User className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
          </TabsList>

          {/* ==================== OVERVIEW TAB ==================== */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <GlassCard className="lg:col-span-2 p-6" gradient>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Performance Over Time</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Cumulative profit tracking</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">{bets.length} bets</Badge>
                </div>
                <PerformanceChart bets={bets} height={350} />
              </GlassCard>

              {/* Win Rate Donut */}
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Win Rate Analysis</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Overall performance</p>
                  </div>
                </div>
                <WinRateChart bets={bets} height={350} />
              </GlassCard>
            </div>

            {/* ROI Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>ROI by Bet Type</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Performance breakdown</p>
                  </div>
                </div>
                <ROIChart bets={bets} groupBy="betType" height={300} />
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>ROI by Bookmaker</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Sportsbook comparison</p>
                  </div>
                </div>
                <ROIChart bets={bets} groupBy="bookmaker" height={300} />
              </GlassCard>
            </div>

            {/* Weekly Performance */}
            <GlassCard className="p-6" gradient>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Weekly Performance Trends</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Last 12 weeks</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={analytics?.weeklyData}>
                  <defs>
                    <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="week" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                  <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }} />
                  <Area type="monotone" dataKey="profit" fill="url(#weeklyGradient)" stroke="#3b82f6" strokeWidth={2} />
                  <Bar dataKey="bets" fill="#8b5cf6" opacity={0.6} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </GlassCard>
          </TabsContent>

          {/* ==================== PERFORMANCE TAB ==================== */}
          <TabsContent value="performance" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Bet Types */}
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Top Bet Types</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Ranked by profit</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analytics?.profitByType.slice(0, 8).map((item, idx) => (
                    <div key={idx} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer
                      ${theme === 'dark' 
                        ? 'bg-slate-800/30 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-black' :
                          idx === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' :
                          theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className={`font-semibold group-hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{item.type}</div>
                          <div className={`flex items-center gap-3 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>{item.count} bets</span>
                            <span className="text-blue-500">{item.winRate.toFixed(0)}% WR</span>
                            <span className="text-purple-500">{item.roi.toFixed(1)}% ROI</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${item.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Top Players */}
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Top Players</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Most profitable picks</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analytics?.profitByPlayer.map((item, idx) => (
                    <div key={idx} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer
                      ${theme === 'dark' 
                        ? 'bg-slate-800/30 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/50' 
                        : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                          {item.player.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`font-semibold group-hover:text-purple-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{item.player}</div>
                          <div className={`flex items-center gap-3 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className={`px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>{item.team}</span>
                            <span>{item.count} bets</span>
                            <span className="text-emerald-500">{item.winRate.toFixed(0)}% WR</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${item.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Bookmaker Performance */}
            <GlassCard className="p-6" gradient>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Bookmaker Performance</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ROI comparison across sportsbooks</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {analytics?.profitByBookmaker.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all text-center
                    ${theme === 'dark' 
                      ? 'bg-slate-800/30 border-slate-700/50 hover:border-green-500/50' 
                      : 'bg-slate-50 border-slate-200 hover:border-green-300'
                    }`}>
                    <div className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{item.bookmaker}</div>
                    <div className={`text-2xl font-bold ${item.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(0)}
                    </div>
                    <div className={`flex justify-center gap-2 mt-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>{item.count} bets</span>
                      <span className="text-blue-500">{item.winRate.toFixed(0)}%</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={Math.min(100, Math.max(0, item.winRate))} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Model Performance */}
            <GlassCard className="p-6" gradient>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Model Performance</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ML model comparison</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics?.modelPerformance.map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border transition-all
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-indigo-500/50' 
                      : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-slate-200 hover:border-indigo-300'
                    }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{item.model}</span>
                    </div>
                    <div className={`text-3xl font-bold ${item.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(0)}
                    </div>
                    <div className={`flex items-center gap-3 mt-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>{item.count} picks</span>
                      <span className="text-blue-500">{item.winRate.toFixed(0)}% WR</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          {/* ==================== AI INSIGHTS TAB ==================== */}
          <TabsContent value="insights" className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Key AI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Kelly Criterion</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Optimal bet sizing</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-purple-500 mb-2">{analytics?.kellyPercent}%</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Based on your {analytics?.winRate.toFixed(1)}% win rate and average odds, bet {analytics?.kellyPercent}% of your bankroll per bet for optimal growth.
                </p>
              </GlassCard>

              <GlassCard className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Edge Analysis</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>High edge performance</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-500 mb-2">{analytics?.highEdgeWinRate.toFixed(0)}%</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Bets with 8%+ edge have {analytics?.highEdgeWinRate.toFixed(0)}% win rate ({analytics?.highEdgeBets} bets). Focus on high-edge opportunities.
                </p>
              </GlassCard>

              <GlassCard className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Expected Value</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Theoretical profit</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-emerald-500 mb-2">${analytics?.expectedValue.toFixed(0)}</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Based on confidence levels, your expected value across all bets is ${analytics?.expectedValue.toFixed(0)}.
                </p>
              </GlassCard>
            </div>

            {/* Smart Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Key Insights</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI-generated analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-500 mb-1">Strong Performance</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Your {analytics?.winRate.toFixed(1)}% win rate beats the 52.4% breakeven threshold by {(analytics?.winRate - 52.4).toFixed(1)}%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <Star className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-500 mb-1">Best Performing Type</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {analytics?.profitByType[0]?.type} bets are your most profitable at +${analytics?.profitByType[0]?.profit.toFixed(0)} with {analytics?.profitByType[0]?.winRate.toFixed(0)}% win rate.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Shield className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-500 mb-1">Risk Assessment</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Sharpe ratio of {analytics?.sharpeRatio} indicates {parseFloat(analytics?.sharpeRatio) > 1.5 ? 'excellent' : parseFloat(analytics?.sharpeRatio) > 1 ? 'good' : 'moderate'} risk-adjusted returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Recommendations</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI-powered suggestions</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                        <DollarSign className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-cyan-500 mb-1">Bankroll Strategy</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Consider {parseFloat(analytics?.kellyPercent) > 5 ? 'half-Kelly' : 'full-Kelly'} sizing at {(parseFloat(analytics?.kellyPercent) / (parseFloat(analytics?.kellyPercent) > 5 ? 2 : 1)).toFixed(1)}% per bet.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                        <Flame className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-orange-500 mb-1">Focus Areas</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Increase volume on {analytics?.profitByType[0]?.type} and {analytics?.profitByPlayer[0]?.player} picks for maximum returns.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-rose-500/20' : 'bg-rose-100'}`}>
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-rose-500 mb-1">Areas to Avoid</div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {analytics?.profitByType[analytics?.profitByType.length - 1]?.type} has lowest ROI at {analytics?.profitByType[analytics?.profitByType.length - 1]?.roi.toFixed(1)}%. Consider reducing exposure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* ==================== PLAYERS TAB ==================== */}
          <TabsContent value="players" className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Search */}
            <GlassCard className="p-6" gradient>
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <Input 
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-12 h-12 rounded-xl focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
                  />
                </div>
                <Button variant="outline" className={`h-12 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : ''}`}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </GlassCard>

            {/* League Leaders */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>League Leaders</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard className="p-0 overflow-hidden">
                  <StatLeaderChart 
                    title="Scoring Leaders" 
                    data={getTopPlayers('points_per_game')} 
                    dataKey="points_per_game"
                    unit="PPG"
                    barColor="#3b82f6"
                  />
                </GlassCard>
                <GlassCard className="p-0 overflow-hidden">
                  <StatLeaderChart 
                    title="Rebounding Leaders" 
                    data={getTopPlayers('rebounds_per_game')} 
                    dataKey="rebounds_per_game" 
                    unit="RPG"
                    barColor="#10b981"
                  />
                </GlassCard>
                <GlassCard className="p-0 overflow-hidden">
                  <StatLeaderChart 
                    title="Assists Leaders" 
                    data={getTopPlayers('assists_per_game')} 
                    dataKey="assists_per_game" 
                    unit="APG"
                    barColor="#8b5cf6"
                  />
                </GlassCard>
              </div>
            </div>

            {/* Player Stats Table */}
            <GlassCard className="p-6" gradient>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Player Statistics</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Complete database</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">{stats.length} players</Badge>
              </div>
              <PlayerStatsTable stats={stats} />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}



