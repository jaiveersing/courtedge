import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Home, Plane } from 'lucide-react';

export default function HomeAwayComparison({ homeStats, awayStats, theme = 'dark' }) {
  // Theme-aware styling
  const ds = {
    bgCard: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    homeBg: theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200',
    awayBg: theme === 'dark' ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200',
  };

  const stats = [
    { label: 'PPG', home: homeStats?.ppg || 0, away: awayStats?.ppg || 0 },
    { label: 'RPG', home: homeStats?.rpg || 0, away: awayStats?.rpg || 0 },
    { label: 'APG', home: homeStats?.apg || 0, away: awayStats?.apg || 0 },
    { label: 'FG%', home: homeStats?.fg_pct || 0, away: awayStats?.fg_pct || 0 },
  ];

  return (
    <Card className={`${ds.bgCard} ${ds.border}`}>
      <CardHeader>
        <CardTitle className={ds.text}>Home vs Away Splits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${ds.textMuted} text-sm`}>{stat.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded border ${ds.homeBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-blue-400">Home</span>
                  </div>
                  <p className={`text-xl font-bold ${ds.text}`}>
                    {typeof stat.home === 'number' ? stat.home.toFixed(1) : '0.0'}
                  </p>
                </div>
                <div className={`p-3 rounded border ${ds.awayBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="h-4 w-4 text-purple-400" />
                    <span className="text-xs text-purple-400">Away</span>
                  </div>
                  <p className={`text-xl font-bold ${ds.text}`}>
                    {typeof stat.away === 'number' ? stat.away.toFixed(1) : '0.0'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
