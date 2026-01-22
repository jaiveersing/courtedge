import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Input } from '@/Components/ui/input';
import { 
  Search, BarChart2, TrendingUp, TrendingDown, Zap, DollarSign, Target, 
  Award, Flame, Activity, Calendar, Filter, Download, RefreshCw, Trophy, 
  AlertCircle, ChevronRight, Sparkles, Brain, LineChart, PieChart, Wallet,
  ArrowUpRight, ArrowDownRight, Clock, Star, Shield, Percent, Hash, Layers,
  ChevronUp, ChevronDown, Eye, Settings, Bell, BookOpen, Lightbulb,
  CheckCircle2, XCircle, Minus, BarChart3, Users
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
  pink: '#ec4899',
  indigo: '#6366f1',
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
const MetricCard = ({ icon: Icon, label, value, subValue, trend, color = "blue", theme }) => {
  const colorMap = {
    blue: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-500', lightBg: 'bg-blue-50', lightText: 'text-blue-600' },
    green: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-500', lightBg: 'bg-emerald-50', lightText: 'text-emerald-600' },
    purple: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-500', lightBg: 'bg-purple-50', lightText: 'text-purple-600' },
    orange: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-500', lightBg: 'bg-orange-50', lightText: 'text-orange-600' },
    red: { bg: 'from-red-500 to-rose-500', text: 'text-red-500', lightBg: 'bg-red-50', lightText: 'text-red-600' },
    cyan: { bg: 'from-cyan-500 to-teal-500', text: 'text-cyan-500', lightBg: 'bg-cyan-50', lightText: 'text-cyan-600' },
    pink: { bg: 'from-pink-500 to-rose-500', text: 'text-pink-500', lightBg: 'bg-pink-50', lightText: 'text-pink-600' },
    indigo: { bg: 'from-indigo-500 to-violet-500', text: 'text-indigo-500', lightBg: 'bg-indigo-50', lightText: 'text-indigo-600' },
    amber: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-500', lightBg: 'bg-amber-50', lightText: 'text-amber-600' }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`group relative p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]
      ${theme === 'dark' 
        ? 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800/70' 
        : `${colors.lightBg} border-slate-100 hover:border-slate-200 hover:shadow-md`
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

// Theme-aware Bet Row Component
const BetRow = ({ bet, index, theme }) => {
  const resultConfig = {
    win: { icon: CheckCircle2, darkBg: 'bg-emerald-500/20', lightBg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    loss: { icon: XCircle, darkBg: 'bg-red-500/20', lightBg: 'bg-red-50', text: 'text-red-500', border: 'border-red-500/30' },
    push: { icon: Minus, darkBg: 'bg-slate-500/20', lightBg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-500/30' },
    pending: { icon: Clock, darkBg: 'bg-amber-500/20', lightBg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-500/30' }
  };
  
  const config = resultConfig[bet.result] || resultConfig.pending;
  const ResultIcon = config.icon;
  
  const formatOdds = (odds) => odds > 0 ? `+${odds}` : odds;
  
  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer
      ${theme === 'dark' 
        ? `${config.darkBg} ${config.border} hover:bg-slate-800/50` 
        : `${config.lightBg} border-slate-200 hover:shadow-md`
      }`}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
          ${theme === 'dark' ? config.darkBg : config.lightBg}`}>
          <ResultIcon className={`w-6 h-6 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{bet.player}</span>
            <Badge variant="outline" className={`text-xs ${theme === 'dark' ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-500'}`}>{bet.team}</Badge>
            {bet.tier && (
              <Badge className={`text-xs ${bet.tier === 'S' ? 'bg-amber-500/20 text-amber-500' : bet.tier === 'A' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                {bet.tier}-Tier
              </Badge>
            )}
            {bet.tags?.includes('Sharp Pick') && (
              <Badge className="bg-emerald-500/20 text-emerald-500 text-xs gap-1">
                <Zap className="w-3 h-3" /> Sharp
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{bet.betType}</span>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{bet.pick} {bet.line}</span>
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>@ {formatOdds(bet.odds)}</span>
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>• {bet.bookmaker}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Confidence</p>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={bet.confidence} className="w-16 h-1.5" />
            <span className={`text-sm font-bold ${bet.confidence >= 80 ? 'text-emerald-500' : bet.confidence >= 65 ? 'text-blue-500' : 'text-amber-500'}`}>
              {bet.confidence}%
            </span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Edge</p>
          <span className={`text-sm font-bold ${parseFloat(bet.edgePercent) >= 10 ? 'text-emerald-500' : 'text-blue-500'}`}>
            {bet.edgePercent}%
          </span>
        </div>
        <div className="text-right">
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Stake</p>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>${bet.stake}</p>
        </div>
        <div className="text-right min-w-[90px]">
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>P/L</p>
          <p className={`text-sm font-bold ${bet.profit > 0 ? 'text-emerald-500' : bet.profit < 0 ? 'text-red-500' : 'text-amber-500'}`}>
            {bet.profit > 0 ? '+' : ''}{bet.result === 'pending' ? 'Pending' : `$${bet.profit.toFixed(2)}`}
          </p>
        </div>
        <Badge className={`${theme === 'dark' ? config.darkBg : config.lightBg} ${config.text} border-0 capitalize min-w-[70px] justify-center font-semibold`}>
          {bet.result}
        </Badge>
      </div>
    </div>
  );
};

// AI Insight Card
const InsightCard = ({ icon: Icon, title, value, description, color = "blue", theme }) => {
  const colorMap = {
    blue: { darkBg: 'from-blue-500/20 to-cyan-500/20', lightBg: 'from-blue-50 to-cyan-50', border: 'border-blue-500/30', text: 'text-blue-500' },
    green: { darkBg: 'from-emerald-500/20 to-green-500/20', lightBg: 'from-emerald-50 to-green-50', border: 'border-emerald-500/30', text: 'text-emerald-500' },
    purple: { darkBg: 'from-purple-500/20 to-pink-500/20', lightBg: 'from-purple-50 to-pink-50', border: 'border-purple-500/30', text: 'text-purple-500' },
    orange: { darkBg: 'from-orange-500/20 to-amber-500/20', lightBg: 'from-orange-50 to-amber-50', border: 'border-orange-500/30', text: 'text-orange-500' }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm
      ${theme === 'dark' ? `${colors.darkBg} ${colors.border}` : `${colors.lightBg} border-slate-200`}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${colors.text}`} />
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{title}</span>
      </div>
      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : colors.text}`}>{value}</p>
      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
    </div>
  );
};

export default function BetsPage() {
  const { theme } = useTheme();
  const [bets, setBets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filterResult, setFilterResult] = useState('all');
  const [filterBetType, setFilterBetType] = useState('all');

  // Generate 100 elite sample bets
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
      { name: 'Paolo Banchero', team: 'ORL', tier: 'B' },
      { name: 'Jaylen Brown', team: 'BOS', tier: 'A' },
      { name: 'De\'Aaron Fox', team: 'SAC', tier: 'B' }
    ];
    
    const bookmakers = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet', 'Bet365'];
    const sampleBets = [];
    const today = new Date();
    
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      const isWin = Math.random() > 0.38;
      const isPush = !isWin && Math.random() > 0.92;
      const isPending = i < 8;
      const betAmount = [10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200][Math.floor(Math.random() * 11)];
      const odds = [-140, -135, -130, -125, -120, -115, -110, -105, 100, 105, 110, 115, 120, 125, 130, 140][Math.floor(Math.random() * 16)];
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
      
      const result = isPending ? 'pending' : (isPush ? 'push' : (isWin ? 'win' : 'loss'));
      
      sampleBets.push({
        id: `bet-${i + 1}`,
        date: date.toISOString(),
        player: player.name,
        team: player.team,
        tier: player.tier,
        betType: betType,
        line: line,
        pick: Math.random() > 0.5 ? 'Over' : 'Under',
        odds: odds,
        stake: betAmount,
        result: result,
        potentialPayout: potentialPayout,
        profit: result === 'win' ? (potentialPayout - betAmount) : (result === 'push' || result === 'pending' ? 0 : -betAmount),
        confidence: Math.floor(55 + Math.random() * 42),
        bookmaker: bookmaker,
        edgePercent: (Math.random() * 18 + 2).toFixed(1),
        model: ['Ensemble', 'XGBoost', 'Neural Net', 'LSTM'][Math.floor(Math.random() * 4)],
        tags: Math.random() > 0.75 ? ['Sharp Pick'] : Math.random() > 0.6 ? ['High Volume'] : []
      });
    }
    
    return sampleBets.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  useEffect(() => {
    setBets(generateSampleBets());
  }, []);

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const settled = bets.filter(b => b.result !== 'pending');
    const wins = settled.filter(b => b.result === 'win');
    const losses = settled.filter(b => b.result === 'loss');
    
    const totalProfit = settled.reduce((sum, b) => sum + b.profit, 0);
    const totalStaked = settled.reduce((sum, b) => sum + b.stake, 0);
    const roi = totalStaked > 0 ? (totalProfit / totalStaked * 100) : 0;
    const winRate = settled.length > 0 ? (wins.length / settled.length * 100) : 0;
    
    let streak = 0;
    let streakType = null;
    for (const bet of settled) {
      if (streakType === null) {
        streakType = bet.result;
        streak = 1;
      } else if (bet.result === streakType) {
        streak++;
      } else break;
    }
    
    const bestWin = Math.max(...wins.map(b => b.profit), 0);
    const worstLoss = Math.min(...losses.map(b => b.profit), 0);
    const avgOdds = settled.length > 0 ? settled.reduce((sum, b) => sum + b.odds, 0) / settled.length : 0;
    
    const impliedProb = avgOdds < 0 ? Math.abs(avgOdds) / (Math.abs(avgOdds) + 100) : 100 / (avgOdds + 100);
    const kelly = ((winRate / 100 * (1 + 1 / impliedProb)) - 1) * 100;
    
    const returns = settled.map(b => b.profit / b.stake);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length || 0;
    const stdDev = Math.sqrt(returns.reduce((sq, r) => sq + Math.pow(r - avgReturn, 2), 0) / returns.length) || 1;
    const sharpe = (avgReturn / stdDev) * Math.sqrt(252);
    
    const avgWinProfit = wins.length > 0 ? wins.reduce((sum, b) => sum + b.profit, 0) / wins.length : 0;
    const avgLossProfit = losses.length > 0 ? Math.abs(losses.reduce((sum, b) => sum + b.profit, 0) / losses.length) : 0;
    const ev = (winRate / 100 * avgWinProfit) - ((100 - winRate) / 100 * avgLossProfit);
    
    const today = new Date().toISOString().split('T')[0];
    const todayBets = settled.filter(b => b.date.split('T')[0] === today);
    const todayProfit = todayBets.reduce((sum, b) => sum + b.profit, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekBets = settled.filter(b => new Date(b.date) >= weekAgo);
    const weekProfit = weekBets.reduce((sum, b) => sum + b.profit, 0);
    
    const highEdgeBets = settled.filter(b => parseFloat(b.edgePercent) >= 10);
    const highEdgeWinRate = highEdgeBets.length > 0 ? (highEdgeBets.filter(b => b.result === 'win').length / highEdgeBets.length * 100) : 0;
    
    return {
      totalProfit, totalStaked, roi, winRate,
      wins: wins.length, losses: losses.length,
      pushes: settled.filter(b => b.result === 'push').length,
      pending: bets.filter(b => b.result === 'pending').length,
      streak: `${streak}${streakType === 'win' ? 'W' : 'L'}`, streakType,
      bestWin, worstLoss, avgStake: settled.length > 0 ? totalStaked / settled.length : 0,
      avgOdds, kelly: Math.max(0, kelly), sharpe, ev, todayProfit, weekProfit,
      totalBets: settled.length, highEdgeWinRate
    };
  }, [bets]);

  const filteredBets = useMemo(() => {
    return bets.filter(bet => {
      const matchesSearch = bet.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.betType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.bookmaker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesResult = filterResult === 'all' || bet.result === filterResult;
      const matchesBetType = filterBetType === 'all' || bet.betType === filterBetType;
      return matchesSearch && matchesResult && matchesBetType;
    });
  }, [bets, searchTerm, filterResult, filterBetType]);

  // Chart data
  const profitOverTimeData = useMemo(() => {
    const sorted = [...bets].filter(b => b.result !== 'pending').sort((a, b) => new Date(a.date) - new Date(b.date));
    let cumProfit = 0;
    const data = [];
    sorted.forEach((bet, i) => {
      cumProfit += bet.profit;
      if (i % 3 === 0 || i === sorted.length - 1) {
        data.push({ bet: i + 1, profit: parseFloat(cumProfit.toFixed(2)), date: new Date(bet.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
      }
    });
    return data;
  }, [bets]);

  const betTypePerformance = useMemo(() => {
    const types = {};
    bets.filter(b => b.result !== 'pending').forEach(bet => {
      if (!types[bet.betType]) types[bet.betType] = { wins: 0, total: 0, profit: 0, staked: 0 };
      types[bet.betType].total++;
      types[bet.betType].staked += bet.stake;
      types[bet.betType].profit += bet.profit;
      if (bet.result === 'win') types[bet.betType].wins++;
    });
    return Object.entries(types).map(([name, data]) => ({
      name, winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
      roi: parseFloat(((data.profit / data.staked) * 100).toFixed(1)),
      profit: parseFloat(data.profit.toFixed(2)), bets: data.total
    })).sort((a, b) => b.profit - a.profit);
  }, [bets]);

  const bookmakerPerformance = useMemo(() => {
    const books = {};
    bets.filter(b => b.result !== 'pending').forEach(bet => {
      if (!books[bet.bookmaker]) books[bet.bookmaker] = { wins: 0, total: 0, profit: 0, staked: 0 };
      books[bet.bookmaker].total++;
      books[bet.bookmaker].staked += bet.stake;
      books[bet.bookmaker].profit += bet.profit;
      if (bet.result === 'win') books[bet.bookmaker].wins++;
    });
    return Object.entries(books).map(([name, data]) => ({
      name, winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
      roi: parseFloat(((data.profit / data.staked) * 100).toFixed(1)),
      profit: parseFloat(data.profit.toFixed(2)), bets: data.total
    })).sort((a, b) => b.profit - a.profit);
  }, [bets]);

  const winRateData = useMemo(() => [
    { name: 'Wins', value: stats.wins, color: COLORS.success },
    { name: 'Losses', value: stats.losses, color: COLORS.danger },
    { name: 'Pushes', value: stats.pushes, color: '#64748b' }
  ], [stats]);

  const topPlayers = useMemo(() => {
    const players = {};
    bets.filter(b => b.result !== 'pending').forEach(bet => {
      if (!players[bet.player]) players[bet.player] = { wins: 0, total: 0, profit: 0, team: bet.team };
      players[bet.player].total++;
      players[bet.player].profit += bet.profit;
      if (bet.result === 'win') players[bet.player].wins++;
    });
    return Object.entries(players).map(([name, data]) => ({
      name, team: data.team, winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
      profit: parseFloat(data.profit.toFixed(2)), bets: data.total
    })).sort((a, b) => b.profit - a.profit).slice(0, 5);
  }, [bets]);

  const betTypes = [...new Set(bets.map(b => b.betType))];

  const tooltipStyle = theme === 'dark' 
    ? { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0f] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Animated Background - Dark mode only */}
      {theme === 'dark' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}
      
      <div className="relative z-10 p-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent' : 'text-slate-800'}`}>
                  My Bets
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Elite betting analytics & AI insights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`px-4 py-2 gap-2 ${stats.winRate >= 55 ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'}`}>
              <TrendingUp className="w-4 h-4" />
              {stats.winRate.toFixed(1)}% Win Rate
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 px-4 py-2 gap-2">
              <Clock className="w-4 h-4" />
              {stats.pending} Pending
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 px-4 py-2 gap-2">
              <Activity className="w-4 h-4" />
              {bets.length} Total
            </Badge>
          </div>
        </div>

        {/* Elite Metrics Dashboard */}
        <GlassCard gradient theme={theme}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Performance Dashboard</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
              <MetricCard icon={DollarSign} label="Total P/L" value={`$${stats.totalProfit.toFixed(0)}`} trend={stats.totalProfit >= 0 ? 'up' : 'down'} subValue={`${stats.totalProfit >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`} color={stats.totalProfit >= 0 ? 'green' : 'red'} theme={theme} />
              <MetricCard icon={Target} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} subValue={`${stats.wins}W - ${stats.losses}L`} color="blue" theme={theme} />
              <MetricCard icon={Flame} label="Streak" value={stats.streak} color={stats.streakType === 'win' ? 'green' : 'orange'} theme={theme} />
              <MetricCard icon={Trophy} label="Best Win" value={`$${stats.bestWin.toFixed(0)}`} color="purple" theme={theme} />
              <MetricCard icon={TrendingDown} label="Worst Loss" value={`$${Math.abs(stats.worstLoss).toFixed(0)}`} color="red" theme={theme} />
              <MetricCard icon={BarChart3} label="Avg Stake" value={`$${stats.avgStake.toFixed(0)}`} color="blue" theme={theme} />
              <MetricCard icon={Percent} label="ROI" value={`${stats.roi.toFixed(1)}%`} trend={stats.roi >= 0 ? 'up' : 'down'} subValue={stats.roi >= 0 ? 'Profitable' : 'Losing'} color={stats.roi >= 0 ? 'green' : 'red'} theme={theme} />
              <MetricCard icon={Brain} label="Kelly %" value={`${stats.kelly.toFixed(1)}%`} subValue="Optimal bet size" color="purple" theme={theme} />
              <MetricCard icon={Shield} label="Sharpe" value={stats.sharpe.toFixed(2)} subValue="Risk-adjusted" color="cyan" theme={theme} />
              <MetricCard icon={Lightbulb} label="Exp. Value" value={`$${stats.ev.toFixed(2)}`} color={stats.ev >= 0 ? 'green' : 'red'} theme={theme} />
              <MetricCard icon={Calendar} label="Today" value={`$${stats.todayProfit.toFixed(0)}`} trend={stats.todayProfit >= 0 ? 'up' : 'down'} color={stats.todayProfit >= 0 ? 'green' : 'red'} theme={theme} />
              <MetricCard icon={Activity} label="This Week" value={`$${stats.weekProfit.toFixed(0)}`} trend={stats.weekProfit >= 0 ? 'up' : 'down'} color={stats.weekProfit >= 0 ? 'green' : 'red'} theme={theme} />
            </div>
          </div>
        </GlassCard>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard icon={Brain} title="Kelly Criterion" value={`${stats.kelly.toFixed(1)}%`} description="Recommended bet size based on edge" color="purple" theme={theme} />
          <InsightCard icon={Shield} title="Sharpe Ratio" value={stats.sharpe.toFixed(2)} description={stats.sharpe > 1 ? 'Excellent risk-adjusted returns' : stats.sharpe > 0.5 ? 'Good risk management' : 'Review strategy'} color="blue" theme={theme} />
          <InsightCard icon={Zap} title="High Edge Win Rate" value={`${stats.highEdgeWinRate.toFixed(1)}%`} description="Performance on 10%+ edge bets" color="green" theme={theme} />
          <InsightCard icon={Lightbulb} title="Expected Value" value={`$${stats.ev.toFixed(2)}/bet`} description={stats.ev > 0 ? 'Positive EV strategy' : 'Needs optimization'} color="orange" theme={theme} />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50 border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6">Overview</TabsTrigger>
            <TabsTrigger value="bets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6">All Bets</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6">Analytics</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2" theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <LineChart className="w-5 h-5 text-blue-500" /> Cumulative Profit
                  </h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={profitOverTimeData}>
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#profitGrad)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <PieChart className="w-5 h-5 text-purple-500" /> Win Distribution
                  </h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie data={winRateData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {winRateData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <BarChart2 className="w-5 h-5 text-cyan-500" /> ROI by Bet Type
                  </h3>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={betTypePerformance.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis type="number" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="roi" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Wallet className="w-5 h-5 text-amber-500" /> ROI by Bookmaker
                  </h3>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookmakerPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis type="number" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="roi" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* All Bets Tab */}
          <TabsContent value="bets" className="mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                <Input
                  placeholder="Search player, team, bet type..."
                  className={`pl-10 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className={`px-4 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
              >
                <option value="all">All Results</option>
                <option value="win">Wins</option>
                <option value="loss">Losses</option>
                <option value="push">Pushes</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className={`px-4 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                value={filterBetType}
                onChange={(e) => setFilterBetType(e.target.value)}
              >
                <option value="all">All Bet Types</option>
                {betTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <GlassCard theme={theme}>
              <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <div>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Recent Bets</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{filteredBets.length} bets found</p>
                </div>
                <Button variant="outline" size="sm" className={theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}>
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
              <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto">
                {filteredBets.slice(0, 50).map((bet, index) => <BetRow key={bet.id} bet={bet} index={index} theme={theme} />)}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <GlassCard className="lg:col-span-2" theme={theme}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <BarChart3 className="w-5 h-5 text-cyan-500" /> Bet Type Performance
                </h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                        <th className={`text-left py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Bet Type</th>
                        <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Bets</th>
                        <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Win Rate</th>
                        <th className={`text-center py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ROI</th>
                        <th className={`text-right py-3 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {betTypePerformance.map((type, i) => (
                        <tr key={type.name} className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }} />
                              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{type.name}</span>
                            </div>
                          </td>
                          <td className={`py-3 px-4 text-center ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{type.bets}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`${type.winRate >= 55 ? 'bg-emerald-500/20 text-emerald-500' : type.winRate >= 45 ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'} border-0`}>
                              {type.winRate}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${type.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {type.roi >= 0 ? '+' : ''}{type.roi}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-bold ${type.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {type.profit >= 0 ? '+' : ''}${type.profit}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="mt-6" theme={theme}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <Users className="w-5 h-5 text-purple-500" /> Top Players (by Profit)
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {topPlayers.map((player, i) => (
                  <div key={player.name} className={`flex items-center justify-between p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500 text-black' : i === 1 ? 'bg-slate-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {i + 1}
                      </span>
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{player.name}</span>
                        <Badge variant="outline" className={`ml-2 text-xs ${theme === 'dark' ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-500'}`}>{player.team}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{player.bets} bets</span>
                      <Badge className={`${player.winRate >= 60 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'} border-0`}>
                        {player.winRate}%
                      </Badge>
                      <span className={`text-sm font-bold ${player.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {player.profit >= 0 ? '+' : ''}${player.profit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Brain className="w-5 h-5 text-purple-500" /> AI Recommendations
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { icon: Target, title: 'Focus on Points Props', desc: `Your win rate on Points bets is ${betTypePerformance.find(t => t.name === 'Points')?.winRate || 55}%. Consider increasing allocation.`, color: 'blue' },
                    { icon: Shield, title: 'Risk Management', desc: `Kelly suggests ${stats.kelly.toFixed(1)}% stake size. You're averaging $${stats.avgStake.toFixed(0)}.`, color: 'purple' },
                    { icon: Zap, title: 'High Edge Bets', desc: `Bets with 10%+ edge have ${stats.highEdgeWinRate.toFixed(1)}% win rate. Prioritize these picks.`, color: 'green' },
                    { icon: AlertCircle, title: 'Avoid Overexposure', desc: 'Diversify across more players to reduce variance.', color: 'orange' }
                  ].map((rec, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? `bg-${rec.color}-500/10 border-${rec.color}-500/20` : `bg-${rec.color}-50 border-${rec.color}-100`}`}>
                      <div className="flex items-start gap-3">
                        <rec.icon className={`w-5 h-5 text-${rec.color}-500 mt-0.5`} />
                        <div>
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{rec.title}</h4>
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{rec.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard theme={theme}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <Sparkles className="w-5 h-5 text-amber-500" /> Edge Analysis
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { range: '15%+', min: 15 },
                    { range: '10-15%', min: 10, max: 15 },
                    { range: '5-10%', min: 5, max: 10 },
                    { range: '0-5%', min: 0, max: 5 }
                  ].map(range => {
                    const rangeBets = bets.filter(b => {
                      const edge = parseFloat(b.edgePercent);
                      return b.result !== 'pending' && edge >= range.min && (!range.max || edge < range.max);
                    });
                    const wins = rangeBets.filter(b => b.result === 'win').length;
                    const winRate = rangeBets.length > 0 ? (wins / rangeBets.length * 100) : 0;
                    const profit = rangeBets.reduce((sum, b) => sum + b.profit, 0);
                    
                    return (
                      <div key={range.range} className={`flex items-center justify-between p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{range.range} Edge</span>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{rangeBets.length} bets</span>
                          <Badge className={`${winRate >= 60 ? 'bg-emerald-500/20 text-emerald-500' : winRate >= 50 ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'} border-0`}>
                            {winRate.toFixed(1)}%
                          </Badge>
                          <span className={`text-sm font-bold min-w-[60px] text-right ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {profit >= 0 ? '+' : ''}${profit.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

