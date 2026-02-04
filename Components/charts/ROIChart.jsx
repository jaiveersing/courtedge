import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';

const ROIChart = ({ bets = [], groupBy = 'sport', height = 300 }) => {
  // Calculate ROI by category
  const roiData = useMemo(() => {
    if (!bets.length) {
return [];
}

    const categories = {};

    bets.forEach(bet => {
      const category = groupBy === 'sport' 
        ? bet.sport || 'Unknown'
        : groupBy === 'betType'
        ? bet.betType || 'Unknown'
        : groupBy === 'bookmaker'
        ? bet.bookmaker || 'Unknown'
        : 'All';

      if (!categories[category]) {
        categories[category] = {
          name: category,
          totalWagered: 0,
          totalProfit: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          bets: 0
        };
      }

      // Calculate profit - handle American odds format
      let profit = 0;
      if (bet.result === 'win') {
        if (bet.profit !== undefined) {
          profit = bet.profit;
        } else if (bet.potentialPayout) {
          profit = bet.potentialPayout - bet.stake;
        } else {
          const odds = bet.odds || -110;
          if (odds > 0) {
            profit = bet.stake * (odds / 100);
          } else {
            profit = bet.stake * (100 / Math.abs(odds));
          }
        }
      } else if (bet.result === 'loss') {
        profit = bet.profit !== undefined ? bet.profit : -bet.stake;
      }

      categories[category].totalWagered += bet.stake;
      categories[category].totalProfit += profit;
      categories[category].bets++;
      
      if (bet.result === 'win') {
categories[category].wins++;
}
      if (bet.result === 'loss') {
categories[category].losses++;
}
      if (bet.result === 'push') {
categories[category].pushes++;
}
    });

    return Object.values(categories)
      .map(cat => ({
        ...cat,
        roi: cat.totalWagered > 0 ? (cat.totalProfit / cat.totalWagered) * 100 : 0,
        winRate: (cat.wins + cat.losses) > 0 ? (cat.wins / (cat.wins + cat.losses)) * 100 : 0
      }))
      .sort((a, b) => b.roi - a.roi);
  }, [bets, groupBy]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
return null;
}

    const data = payload[0].payload;

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">ROI:</span>
            <span className={`font-semibold text-sm ${
              data.roi >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.roi >= 0 ? '+' : ''}{data.roi.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Win Rate:</span>
            <span className="text-blue-400 font-semibold text-sm">
              {data.winRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Profit:</span>
            <span className={`font-semibold text-sm ${
              data.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${data.totalProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Wagered:</span>
            <span className="text-gray-300 text-sm">
              ${data.totalWagered.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Record:</span>
            <span className="text-gray-300 text-sm">
              {data.wins}-{data.losses}-{data.pushes}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 text-xs">Bets:</span>
            <span className="text-gray-300 text-sm">{data.bets}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!roiData.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Percent className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall stats
  const overallROI = roiData.reduce((sum, d) => sum + (d.totalWagered * d.roi / 100), 0) / 
    roiData.reduce((sum, d) => sum + d.totalWagered, 0) * 100;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">ROI by {groupBy}</h3>
          <p className="text-sm text-gray-400 mt-1">
            Overall ROI: 
            <span className={`ml-2 font-semibold ${
              overallROI >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(2)}%
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overallROI >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={roiData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
          <Bar dataKey="roi" radius={[8, 8, 0, 0]}>
            {roiData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.roi >= 0 ? '#10b981' : '#ef4444'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Positive ROI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">Negative ROI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIChart;
