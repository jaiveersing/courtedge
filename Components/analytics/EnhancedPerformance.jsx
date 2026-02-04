import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, Percent, Activity, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

export default function EnhancedPerformance({ data = [] }) {
  // Process betting data to generate analytics
  const analytics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalProfit: 0,
        totalWagered: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        roi: 0,
        avgBetSize: 0,
        performanceData: [],
        sportBreakdown: [],
        betTypeBreakdown: []
      };
    }

    const wins = data.filter(bet => bet.result === 'win').length;
    const losses = data.filter(bet => bet.result === 'loss').length;
    const totalProfit = data.reduce((sum, bet) => sum + (bet.profit || 0), 0);
    const totalWagered = data.reduce((sum, bet) => sum + bet.amount, 0);
    const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0;
    const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
    const avgBetSize = data.length > 0 ? totalWagered / data.length : 0;

    // Group data by week for performance chart
    const sortedData = [...data].sort((a, b) => a.date - b.date);
    const weeklyData = {};
    
    sortedData.forEach(bet => {
      const weekKey = Math.floor((Date.now() - bet.date.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekLabel = weekKey === 0 ? 'This Week' : `${weekKey}w ago`;
      
      if (!weeklyData[weekLabel]) {
        weeklyData[weekLabel] = {
          date: weekLabel,
          profit: 0,
          wagered: 0,
          wins: 0,
          total: 0
        };
      }
      
      weeklyData[weekLabel].profit += bet.profit || 0;
      weeklyData[weekLabel].wagered += bet.amount;
      weeklyData[weekLabel].total += 1;
      if (bet.result === 'win') {
weeklyData[weekLabel].wins += 1;
}
    });

    const performanceData = Object.values(weeklyData).reverse().map(week => ({
      ...week,
      winRate: week.total > 0 ? Math.round((week.wins / week.total) * 100) : 0,
      roi: week.wagered > 0 ? Math.round((week.profit / week.wagered) * 100) : 0
    }));

    // Sport breakdown for pie chart
    const sportGroups = {};
    data.forEach(bet => {
      const sport = bet.sport || 'Other';
      if (!sportGroups[sport]) {
        sportGroups[sport] = { name: sport, value: 0, profit: 0 };
      }
      sportGroups[sport].value += 1;
      sportGroups[sport].profit += bet.profit || 0;
    });
    const sportBreakdown = Object.values(sportGroups);

    // Bet type breakdown
    const betTypeGroups = {};
    data.forEach(bet => {
      const type = bet.betType || 'Other';
      if (!betTypeGroups[type]) {
        betTypeGroups[type] = { name: type, wins: 0, total: 0, profit: 0 };
      }
      betTypeGroups[type].total += 1;
      if (bet.result === 'win') {
betTypeGroups[type].wins += 1;
}
      betTypeGroups[type].profit += bet.profit || 0;
    });
    const betTypeBreakdown = Object.values(betTypeGroups).map(type => ({
      ...type,
      winRate: type.total > 0 ? Math.round((type.wins / type.total) * 100) : 0
    }));

    return {
      totalProfit,
      totalWagered,
      wins,
      losses,
      winRate,
      roi,
      avgBetSize,
      performanceData,
      sportBreakdown,
      betTypeBreakdown
    };
  }, [data]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const metrics = [
    { 
      label: 'Total P/L', 
      value: `$${analytics.totalProfit.toFixed(2)}`, 
      icon: DollarSign, 
      color: analytics.totalProfit >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: analytics.totalProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
    },
    { 
      label: 'Win Rate', 
      value: `${analytics.winRate.toFixed(1)}%`, 
      icon: Target, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'ROI', 
      value: `${analytics.roi >= 0 ? '+' : ''}${analytics.roi.toFixed(1)}%`, 
      icon: Percent, 
      color: analytics.roi >= 0 ? 'text-purple-400' : 'text-orange-400',
      bgColor: analytics.roi >= 0 ? 'bg-purple-500/10' : 'bg-orange-500/10'
    },
    { 
      label: 'Total Bets', 
      value: `${analytics.wins + analytics.losses}`, 
      icon: Activity, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      subtitle: `${analytics.wins}W / ${analytics.losses}L`
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-slate-400">{metric.label}</p>
                {metric.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{metric.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Over Time Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Profit & Performance Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analytics.performanceData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                fill="url(#profitGradient)"
                strokeWidth={2}
                name="Profit ($)"
              />
              <Area 
                type="monotone" 
                dataKey="winRate" 
                stroke="#3b82f6" 
                fill="url(#winRateGradient)"
                strokeWidth={2}
                name="Win Rate (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row: Sport & Bet Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bet Type Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance by Bet Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.betTypeBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="winRate" fill="#3b82f6" name="Win Rate (%)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#10b981" name="Profit ($)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sport Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Bets by Sport</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.sportBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.sportBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}