import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PerformanceChart({ data, stat = 'points', theme = 'dark' }) {
  // Theme-aware styling
  const ds = {
    bgCard: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
    tooltipText: theme === 'dark' ? '#f1f5f9' : '#1e293b',
  };

  if (!data || data.length === 0) {
    return (
      <Card className={`${ds.bgCard} ${ds.border}`}>
        <CardHeader>
          <CardTitle className={ds.text}>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${ds.textMuted} text-center py-8`}>No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${ds.bgCard} ${ds.border}`}>
      <CardHeader>
        <CardTitle className={ds.text}>Performance Trend - Last 10 Games</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={ds.grid} />
            <XAxis 
              dataKey="game" 
              stroke={ds.axis}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={ds.axis}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                background: ds.tooltipBg,
                border: `1px solid ${ds.tooltipBorder}`,
                borderRadius: '8px',
                color: ds.tooltipText,
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={stat} 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
