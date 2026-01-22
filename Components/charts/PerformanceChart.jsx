import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Percent, Target } from 'lucide-react';

const PerformanceChart = ({ bets = [], height = 400, showBrush = true }) => {
  const [timeRange, setTimeRange] = useState('30D');
  const [chartType, setChartType] = useState('cumulative'); // cumulative, daily, roi

  const timeRanges = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 },
    { label: 'All', days: null }
  ];

  // Process bets into time-series data
  const chartData = useMemo(() => {
    if (!bets.length) return [];

    // Filter by time range
    const now = new Date();
    const selectedRange = timeRanges.find(r => r.label === timeRange);
    const cutoffDate = selectedRange?.days 
      ? new Date(now - selectedRange.days * 24 * 60 * 60 * 1000)
      : null;

    const filteredBets = cutoffDate
      ? bets.filter(bet => new Date(bet.date || bet.timestamp) >= cutoffDate)
      : [...bets];

    // Sort by date
    filteredBets.sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp);
      const dateB = new Date(b.date || b.timestamp);
      return dateA - dateB;
    });

    // Group by date and calculate metrics
    const dataByDate = {};
    let cumulativeProfit = 0;
    let cumulativeWins = 0;
    let cumulativeLosses = 0;
    let totalWagered = 0;

    filteredBets.forEach(bet => {
      const date = new Date(bet.date || bet.timestamp).toLocaleDateString();
      
      // Calculate profit - handle American odds format
      let profit = 0;
      if (bet.result === 'win') {
        if (bet.profit !== undefined) {
          profit = bet.profit;
        } else if (bet.potentialPayout) {
          profit = bet.potentialPayout - bet.stake;
        } else {
          // Convert American odds to profit
          const odds = bet.odds || -110;
          if (odds > 0) {
            profit = bet.stake * (odds / 100);
          } else {
            profit = bet.stake * (100 / Math.abs(odds));
          }
        }
      } else if (bet.result === 'loss') {
        profit = bet.profit !== undefined ? bet.profit : -bet.stake;
      } else if (bet.result === 'push') {
        profit = 0;
      }

      if (!dataByDate[date]) {
        dataByDate[date] = {
          date,
          dailyProfit: 0,
          wins: 0,
          losses: 0,
          wagered: 0,
          betsCount: 0
        };
      }

      cumulativeProfit += profit;
      if (bet.result === 'win') cumulativeWins++;
      if (bet.result === 'loss') cumulativeLosses++;
      totalWagered += bet.stake;

      dataByDate[date].dailyProfit += profit;
      dataByDate[date].cumulativeProfit = cumulativeProfit;
      dataByDate[date].wins = cumulativeWins;
      dataByDate[date].losses = cumulativeLosses;
      dataByDate[date].wagered += bet.stake;
      dataByDate[date].totalWagered = totalWagered;
      dataByDate[date].betsCount++;
      dataByDate[date].roi = totalWagered > 0 ? (cumulativeProfit / totalWagered) * 100 : 0;
      dataByDate[date].winRate = (cumulativeWins + cumulativeLosses) > 0
        ? (cumulativeWins / (cumulativeWins + cumulativeLosses)) * 100
        : 0;
    });

    return Object.values(dataByDate);
  }, [bets, timeRange]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!chartData.length) {
      return {
        totalProfit: 0,
        totalWagered: 0,
        roi: 0,
        winRate: 0,
        wins: 0,
        losses: 0,
        avgBet: 0
      };
    }

    const lastData = chartData[chartData.length - 1];
    const totalBets = lastData.wins + lastData.losses;
    
    return {
      totalProfit: lastData.cumulativeProfit || 0,
      totalWagered: lastData.totalWagered || 0,
      roi: lastData.roi || 0,
      winRate: lastData.winRate || 0,
      wins: lastData.wins || 0,
      losses: lastData.losses || 0,
      avgBet: totalBets > 0 ? lastData.totalWagered / totalBets : 0
    };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {chartType === 'cumulative' && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 text-xs">Cumulative P/L:</span>
              <span className={`font-semibold text-sm ${
                data.cumulativeProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${data.cumulativeProfit?.toFixed(2)}
              </span>
            </div>
          )}
          {chartType === 'daily' && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 text-xs">Daily P/L:</span>
              <span className={`font-semibold text-sm ${
                data.dailyProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${data.dailyProfit?.toFixed(2)}
              </span>
            </div>
          )}
          {chartType === 'roi' && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 text-xs">ROI:</span>
              <span className={`font-semibold text-sm ${
                data.roi >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.roi?.toFixed(2)}%
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Win Rate:</span>
            <span className="text-blue-400 font-semibold text-sm">
              {data.winRate?.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Bets:</span>
            <span className="text-gray-300 text-sm">{data.betsCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Wagered:</span>
            <span className="text-gray-300 text-sm">${data.wagered?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Get chart config based on type
  const getChartConfig = () => {
    switch (chartType) {
      case 'cumulative':
        return {
          dataKey: 'cumulativeProfit',
          color: stats.totalProfit >= 0 ? '#10b981' : '#ef4444',
          name: 'Cumulative P/L'
        };
      case 'daily':
        return {
          dataKey: 'dailyProfit',
          color: '#3b82f6',
          name: 'Daily P/L'
        };
      case 'roi':
        return {
          dataKey: 'roi',
          color: '#8b5cf6',
          name: 'ROI %'
        };
      default:
        return {
          dataKey: 'cumulativeProfit',
          color: '#10b981',
          name: 'Cumulative P/L'
        };
    }
  };

  const chartConfig = getChartConfig();

  if (!bets.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No bet history available</p>
            <p className="text-sm mt-1">Place some bets to see your performance</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Performance Over Time</h3>
        <div className="flex gap-2">
          {/* Time Range Selector */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            {timeRanges.map(range => (
              <button
                key={range.label}
                onClick={() => setTimeRange(range.label)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timeRange === range.label
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'cumulative'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cumulative
            </button>
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setChartType('roi')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'roi'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ROI
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            <span>Total P/L</span>
          </div>
          <div className={`text-lg font-bold ${
            stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Percent className="w-3 h-3" />
            <span>ROI</span>
          </div>
          <div className={`text-lg font-bold ${
            stats.roi >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Target className="w-3 h-3" />
            <span>Win Rate</span>
          </div>
          <div className="text-lg font-bold text-blue-400">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Calendar className="w-3 h-3" />
            <span>Record</span>
          </div>
          <div className="text-lg font-bold text-gray-300">
            {stats.wins}-{stats.losses}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => chartType === 'roi' ? `${value}%` : `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {chartType === 'cumulative' && <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />}
          {chartType === 'roi' && <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />}
          <Area
            type="monotone"
            dataKey={chartConfig.dataKey}
            stroke={chartConfig.color}
            strokeWidth={2}
            fill="url(#colorProfit)"
            name={chartConfig.name}
          />
          {showBrush && chartData.length > 20 && (
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#4b5563"
              fill="#1f2937"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Total Wagered: ${stats.totalWagered.toFixed(2)}</span>
          <span>Avg Bet Size: ${stats.avgBet.toFixed(2)}</span>
          <span>
            {stats.totalProfit >= 0 ? (
              <span className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                Profitable
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <TrendingDown className="w-3 h-3" />
                Losing
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
