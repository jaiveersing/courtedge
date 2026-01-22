import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatLeaderChart({ data, stat = 'points_per_game', title, dataKey, unit = '', barColor = '#3b82f6', isPercentage = false }) {
  const chartData = data?.slice(0, 10).map(player => ({
    name: (player.player_name || player.name || 'Unknown').split(' ').slice(-1)[0],
    fullName: player.player_name || player.name || 'Unknown',
    value: isPercentage 
      ? ((player[dataKey || stat] || 0) * 100) 
      : (player[dataKey || stat] || 0),
    displayValue: isPercentage
      ? `${((player[dataKey || stat] || 0) * 100).toFixed(1)}%`
      : (player[dataKey || stat] || 0).toFixed(1)
  })) || [];

  const chartTitle = title || `Top 10 Leaders - ${(dataKey || stat).replace(/_/g, ' ').toUpperCase()}`;

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
      <CardHeader>
        <CardTitle className="text-white text-lg">{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name" 
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
                formatter={(value, name, props) => [
                  `${props.payload.displayValue} ${unit}`,
                  props.payload.fullName
                ]}
              />
              <Bar 
                dataKey="value" 
                fill={barColor} 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-slate-400 text-center">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
