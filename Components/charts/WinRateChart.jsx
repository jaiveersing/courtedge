import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Target, TrendingUp, Award } from 'lucide-react';

const WinRateChart = ({ bets = [], height = 300 }) => {
  const stats = useMemo(() => {
    if (!bets.length) {
      return {
        wins: 0,
        losses: 0,
        pushes: 0,
        pending: 0,
        total: 0,
        winRate: 0,
        pushRate: 0
      };
    }

    const wins = bets.filter(b => b.result === 'win').length;
    const losses = bets.filter(b => b.result === 'loss').length;
    const pushes = bets.filter(b => b.result === 'push').length;
    const pending = bets.filter(b => b.result === 'pending' || !b.result).length;
    const settled = wins + losses + pushes;

    return {
      wins,
      losses,
      pushes,
      pending,
      total: bets.length,
      winRate: settled > 0 ? (wins / (wins + losses)) * 100 : 0,
      pushRate: settled > 0 ? (pushes / settled) * 100 : 0
    };
  }, [bets]);

  const chartData = [
    { name: 'Wins', value: stats.wins, color: '#10b981' },
    { name: 'Losses', value: stats.losses, color: '#ef4444' },
    { name: 'Pushes', value: stats.pushes, color: '#6b7280' },
    { name: 'Pending', value: stats.pending, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];
    const percent = ((data.value / stats.total) * 100).toFixed(1);

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-1">{data.name}</p>
        <p className="text-gray-300 text-sm">{data.value} bets ({percent}%)</p>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if slice is too small

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!bets.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Win Rate</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No bet history available</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine performance level
  const getPerformanceLevel = () => {
    if (stats.winRate >= 60) return { label: 'Elite', color: 'text-yellow-400', icon: Award };
    if (stats.winRate >= 55) return { label: 'Excellent', color: 'text-green-400', icon: TrendingUp };
    if (stats.winRate >= 52.4) return { label: 'Profitable', color: 'text-blue-400', icon: Target };
    if (stats.winRate >= 50) return { label: 'Break Even', color: 'text-gray-400', icon: Target };
    return { label: 'Needs Work', color: 'text-red-400', icon: Target };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Win Rate</h3>
        <div className={`flex items-center gap-2 ${performance.color}`}>
          <PerformanceIcon className="w-5 h-5" />
          <span className="text-sm font-semibold">{performance.label}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-green-400">
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {stats.wins} wins / {stats.wins + stats.losses} settled
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Push Rate</div>
          <div className="text-2xl font-bold text-gray-400">
            {stats.pushRate.toFixed(1)}%
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {stats.pushes} pushes
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-300">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Break-even note */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-white">Break-even rate:</span> ~52.4% win rate needed to overcome typical -110 juice
        </p>
      </div>
    </div>
  );
};

export default WinRateChart;
