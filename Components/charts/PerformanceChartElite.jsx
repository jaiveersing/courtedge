import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Legend,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Percent, 
  Target, 
  BarChart3, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';

/**
 * Elite Performance Chart Component v3.0
 * 
 * Features:
 * - Full theme support (dark/light mode)
 * - Multiple chart types (cumulative, daily, ROI, combined)
 * - Interactive time range selection
 * - Animated stats cards
 * - Smart tooltips with detailed info
 * - Performance streak indicators
 * - Responsive design
 */
const PerformanceChartElite = ({ bets = [], height = 350, showBrush = false, compact = false }) => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('30D');
  const [chartType, setChartType] = useState('cumulative');
  const [hoveredStat, setHoveredStat] = useState(null);

  // Theme-aware design system
  const ds = {
    // Backgrounds
    bg: theme === 'dark' ? 'bg-slate-800/90' : 'bg-white/95',
    bgCard: theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-50/80',
    bgHover: theme === 'dark' ? 'hover:bg-slate-700/60' : 'hover:bg-slate-100/80',
    bgAccent: theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100',
    
    // Borders
    border: theme === 'dark' ? 'border-slate-700/60' : 'border-slate-200/80',
    borderHover: theme === 'dark' ? 'hover:border-slate-600' : 'hover:border-slate-300',
    
    // Text colors
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    textSubtle: theme === 'dark' ? 'text-slate-500' : 'text-slate-400',
    
    // Chart colors
    gridStroke: theme === 'dark' ? '#334155' : '#e2e8f0',
    axisStroke: theme === 'dark' ? '#94a3b8' : '#64748b',
    tooltipBg: theme === 'dark' ? '#0f172a' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
    
    // Shadows
    shadow: theme === 'dark' ? 'shadow-xl shadow-black/20' : 'shadow-xl shadow-slate-200/50',
    shadowHover: theme === 'dark' ? 'hover:shadow-2xl hover:shadow-black/30' : 'hover:shadow-2xl hover:shadow-slate-300/50',
  };

  const timeRanges = [
    { label: '7D', days: 7, description: 'Last 7 days' },
    { label: '30D', days: 30, description: 'Last 30 days' },
    { label: '90D', days: 90, description: 'Last 3 months' },
    { label: '1Y', days: 365, description: 'Last year' },
    { label: 'All', days: null, description: 'All time' }
  ];

  const chartTypes = [
    { key: 'cumulative', label: 'Cumulative', icon: TrendingUp },
    { key: 'daily', label: 'Daily', icon: BarChart3 },
    { key: 'roi', label: 'ROI', icon: Percent },
    { key: 'combined', label: 'Combined', icon: Activity }
  ];

  // Process bets into chart data with comprehensive stats
  const { chartData, stats, streaks } = useMemo(() => {
    if (!bets.length) {
      return { 
        chartData: [], 
        stats: {
          totalProfit: 0, totalWagered: 0, roi: 0,
          wins: 0, losses: 0, pushes: 0, winRate: 0,
          avgBet: 0, avgOdds: 0, bestDay: 0, worstDay: 0
        },
        streaks: { current: 0, best: 0 }
      };
    }

    // Filter by time range
    const now = new Date();
    const range = timeRanges.find(r => r.label === timeRange);
    const filteredBets = range?.days
      ? bets.filter(bet => {
          const betDate = new Date(bet.date || bet.created_date || bet.timestamp);
          const diffDays = (now - betDate) / (1000 * 60 * 60 * 24);
          return diffDays <= range.days;
        })
      : bets;

    // Sort by date
    const sortedBets = [...filteredBets].sort((a, b) => 
      new Date(a.date || a.created_date || a.timestamp) - 
      new Date(b.date || b.created_date || b.timestamp)
    );

    // Calculate statistics
    let cumulativeProfit = 0;
    let totalWagered = 0;
    let wins = 0, losses = 0, pushes = 0;
    let bestDay = -Infinity, worstDay = Infinity;
    let currentStreak = 0, bestStreak = 0, isWinStreak = true;
    let oddsSum = 0;

    const dataByDate = {};
    
    sortedBets.forEach(bet => {
      const dateStr = new Date(bet.date || bet.created_date || bet.timestamp).toLocaleDateString();
      
      // Calculate profit based on result
      let profit = 0;
      const stake = bet.stake || bet.amount || 10;
      
      if (bet.profit !== undefined) {
        profit = bet.profit;
      } else if (bet.result === 'won' || bet.result === 'win') {
        profit = bet.potentialWin || bet.potential_win || (stake * 0.9);
        wins++;
        if (isWinStreak) {
          currentStreak++;
        } else {
          currentStreak = 1;
          isWinStreak = true;
        }
      } else if (bet.result === 'lost' || bet.result === 'loss') {
        profit = -stake;
        losses++;
        if (!isWinStreak) {
          currentStreak++;
        } else {
          currentStreak = 1;
          isWinStreak = false;
        }
      } else if (bet.result === 'push') {
        profit = 0;
        pushes++;
      }

      bestStreak = Math.max(bestStreak, currentStreak);
      cumulativeProfit += profit;
      totalWagered += stake;
      oddsSum += Math.abs(bet.odds || -110);

      if (!dataByDate[dateStr]) {
        dataByDate[dateStr] = {
          date: dateStr,
          dailyProfit: 0,
          bets: 0,
          wins: 0,
          losses: 0,
          wagered: 0
        };
      }
      
      dataByDate[dateStr].dailyProfit += profit;
      dataByDate[dateStr].bets += 1;
      dataByDate[dateStr].wagered += stake;
      if (bet.result === 'won' || bet.result === 'win') {
dataByDate[dateStr].wins += 1;
} else if (bet.result === 'lost' || bet.result === 'loss') {
dataByDate[dateStr].losses += 1;
}
    });

    // Build chart data with cumulative values
    let runningTotal = 0;
    let runningWagered = 0;
    const data = Object.values(dataByDate).map((day, index) => {
      runningTotal += day.dailyProfit;
      runningWagered += day.wagered;
      
      bestDay = Math.max(bestDay, day.dailyProfit);
      worstDay = Math.min(worstDay, day.dailyProfit);
      
      return {
        ...day,
        cumulativeProfit: runningTotal,
        roi: runningWagered > 0 ? (runningTotal / runningWagered) * 100 : 0,
        winRate: day.bets > 0 ? (day.wins / day.bets) * 100 : 0,
        index
      };
    });

    const statsCalc = {
      totalProfit: cumulativeProfit,
      totalWagered,
      roi: totalWagered > 0 ? (cumulativeProfit / totalWagered) * 100 : 0,
      wins,
      losses,
      pushes,
      winRate: (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0,
      avgBet: sortedBets.length > 0 ? totalWagered / sortedBets.length : 0,
      avgOdds: sortedBets.length > 0 ? oddsSum / sortedBets.length : 0,
      bestDay: bestDay === -Infinity ? 0 : bestDay,
      worstDay: worstDay === Infinity ? 0 : worstDay,
      totalBets: sortedBets.length
    };

    return { 
      chartData: data, 
      stats: statsCalc,
      streaks: { current: currentStreak, best: bestStreak, isWinStreak }
    };
  }, [bets, timeRange]);

  // Get chart configuration
  const getChartConfig = () => {
    const configs = {
      cumulative: {
        dataKey: 'cumulativeProfit',
        color: stats.totalProfit >= 0 ? '#10b981' : '#ef4444',
        gradientId: 'gradientCumulative',
        name: 'Cumulative P/L',
        formatter: (v) => `$${v?.toFixed(2) || '0.00'}`
      },
      daily: {
        dataKey: 'dailyProfit',
        color: '#3b82f6',
        gradientId: 'gradientDaily',
        name: 'Daily P/L',
        formatter: (v) => `$${v?.toFixed(2) || '0.00'}`
      },
      roi: {
        dataKey: 'roi',
        color: '#8b5cf6',
        gradientId: 'gradientROI',
        name: 'ROI',
        formatter: (v) => `${v?.toFixed(2) || '0.00'}%`
      }
    };
    return configs[chartType] || configs.cumulative;
  };

  const config = getChartConfig();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
return null;
}
    const data = payload[0]?.payload;
    
    return (
      <div 
        className={`${ds.bg} backdrop-blur-xl rounded-xl p-4 border ${ds.border} ${ds.shadow}`}
        style={{ minWidth: '200px' }}
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: ds.tooltipBorder }}>
          <Calendar className={`w-4 h-4 ${ds.textMuted}`} />
          <span className={`font-semibold ${ds.text}`}>{label}</span>
        </div>
        
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className={`text-sm ${ds.textMuted}`}>{entry.name}</span>
              </div>
              <span className={`font-bold ${
                entry.value >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {config.formatter(entry.value)}
              </span>
            </div>
          ))}
          
          {data && (
            <div className={`pt-2 mt-2 border-t text-xs ${ds.textSubtle}`} style={{ borderColor: ds.tooltipBorder }}>
              <div className="flex justify-between">
                <span>Bets</span>
                <span className={ds.textMuted}>{data.bets}</span>
              </div>
              <div className="flex justify-between">
                <span>Record</span>
                <span className={ds.textMuted}>{data.wins}W - {data.losses}L</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Stats card component
  const StatCard = ({ icon: Icon, label, value, subValue, trend, color, index }) => (
    <div 
      className={`
        ${ds.bgCard} rounded-xl p-4 border ${ds.border} 
        transition-all duration-300 cursor-pointer
        ${ds.bgHover} ${ds.borderHover}
        hover:scale-[1.02] hover:-translate-y-0.5
        animate-slide-in-up
      `}
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards', opacity: 0 }}
      onMouseEnter={() => setHoveredStat(label)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <div className={`flex items-center gap-2 ${ds.textMuted} text-xs mb-2`}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xl font-bold`} style={{ color: trend !== undefined ? (trend >= 0 ? '#10b981' : '#ef4444') : color }}>
          {value}
        </span>
        {trend !== undefined && (
          trend >= 0 
            ? <ArrowUpRight className="w-4 h-4 text-green-500" />
            : <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
      </div>
      {subValue && (
        <p className={`text-xs mt-1 ${ds.textSubtle}`}>{subValue}</p>
      )}
    </div>
  );

  // Empty state
  if (!bets.length) {
    return (
      <div className={`${ds.bg} backdrop-blur-xl rounded-2xl border ${ds.border} p-8 ${ds.shadow}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${ds.text}`}>Performance Analytics</h3>
            <p className={`text-sm ${ds.textMuted}`}>Elite tracking system</p>
          </div>
        </div>
        
        <div className={`flex flex-col items-center justify-center py-16 ${ds.textMuted}`}>
          <div className={`w-20 h-20 rounded-2xl ${ds.bgCard} flex items-center justify-center mb-4 border ${ds.border}`}>
            <Target className="w-10 h-10 opacity-40" />
          </div>
          <p className="font-semibold mb-1">No Performance Data</p>
          <p className={`text-sm ${ds.textSubtle}`}>Place bets to start tracking your performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ds.bg} backdrop-blur-xl rounded-2xl border ${ds.border} ${ds.shadow} transition-all duration-300 ${ds.shadowHover}`}>
      {/* Header */}
      <div className={`p-6 border-b ${ds.border}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${ds.text}`}>Performance Analytics</h3>
              <p className={`text-sm ${ds.textMuted}`}>
                {stats.totalBets} bets tracked • {timeRanges.find(r => r.label === timeRange)?.description}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Time Range */}
            <div className={`flex ${ds.bgCard} rounded-xl p-1 border ${ds.border}`}>
              {timeRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setTimeRange(range.label)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    timeRange === range.label
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : `${ds.textMuted} ${ds.bgHover}`
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Chart Type */}
            {!compact && (
              <div className={`flex ${ds.bgCard} rounded-xl p-1 border ${ds.border}`}>
                {chartTypes.slice(0, 3).map(type => (
                  <button
                    key={type.key}
                    onClick={() => setChartType(type.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                      chartType === type.key
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                        : `${ds.textMuted} ${ds.bgHover}`
                    }`}
                  >
                    <type.icon className="w-3.5 h-3.5" />
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className={`grid grid-cols-2 ${compact ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-3 mb-6`}>
          <StatCard 
            icon={DollarSign} 
            label="Total P/L" 
            value={`${stats.totalProfit >= 0 ? '+' : ''}$${stats.totalProfit.toFixed(2)}`}
            trend={stats.totalProfit}
            color="#10b981"
            index={0}
          />
          <StatCard 
            icon={Percent} 
            label="ROI" 
            value={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(2)}%`}
            trend={stats.roi}
            color="#8b5cf6"
            index={1}
          />
          <StatCard 
            icon={Target} 
            label="Win Rate" 
            value={`${stats.winRate.toFixed(1)}%`}
            subValue={`${stats.wins}W - ${stats.losses}L${stats.pushes ? ` - ${stats.pushes}P` : ''}`}
            color="#3b82f6"
            index={2}
          />
          <StatCard 
            icon={Flame} 
            label="Best Streak" 
            value={`${streaks.best} ${streaks.isWinStreak ? 'Wins' : 'Games'}`}
            subValue={`Current: ${streaks.current}`}
            color="#f59e0b"
            index={3}
          />
        </div>

        {/* Chart */}
        <div className={`${ds.bgCard} rounded-xl p-4 border ${ds.border}`}>
          <ResponsiveContainer width="100%" height={height}>
            {chartType === 'daily' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={ds.gridStroke} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke={ds.axisStroke}
                  tick={{ fill: ds.axisStroke, fontSize: 11 }}
                  tickLine={{ stroke: ds.gridStroke }}
                />
                <YAxis 
                  stroke={ds.axisStroke}
                  tick={{ fill: ds.axisStroke, fontSize: 11 }}
                  tickLine={{ stroke: ds.gridStroke }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke={ds.gridStroke} strokeDasharray="3 3" />
                <Bar dataKey="dailyProfit" name="Daily P/L" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.dailyProfit >= 0 ? 'url(#gradientPositive)' : 'url(#gradientNegative)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={ds.gridStroke} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke={ds.axisStroke}
                  tick={{ fill: ds.axisStroke, fontSize: 11 }}
                  tickLine={{ stroke: ds.gridStroke }}
                />
                <YAxis 
                  stroke={ds.axisStroke}
                  tick={{ fill: ds.axisStroke, fontSize: 11 }}
                  tickLine={{ stroke: ds.gridStroke }}
                  tickFormatter={config.formatter}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke={ds.gridStroke} strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={3}
                  fill={`url(#${config.gradientId})`}
                  name={config.name}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    stroke: config.color, 
                    strokeWidth: 2,
                    fill: theme === 'dark' ? '#1e293b' : '#ffffff'
                  }}
                />
                {showBrush && chartData.length > 15 && (
                  <Brush 
                    dataKey="date" 
                    height={30} 
                    stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                    fill={theme === 'dark' ? '#1f2937' : '#f9fafb'}
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${ds.border} ${ds.bgCard}`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 text-xs`}>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 ${ds.textMuted}`}>
              <Wallet className="w-3.5 h-3.5" />
              <span>Wagered: <strong className={ds.textSecondary}>${stats.totalWagered.toFixed(2)}</strong></span>
            </div>
            <div className={`flex items-center gap-2 ${ds.textMuted}`}>
              <Target className="w-3.5 h-3.5" />
              <span>Avg Bet: <strong className={ds.textSecondary}>${stats.avgBet.toFixed(2)}</strong></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {stats.totalProfit >= 0 ? (
              <span className="flex items-center gap-1.5 text-green-500 font-semibold bg-green-500/10 px-3 py-1.5 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                Profitable
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-500 font-semibold bg-red-500/10 px-3 py-1.5 rounded-lg">
                <TrendingDown className="w-3.5 h-3.5" />
                Losing
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Import for Wallet icon that was missing
import { Wallet } from 'lucide-react';

export default PerformanceChartElite;
