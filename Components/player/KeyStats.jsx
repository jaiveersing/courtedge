import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, Target, Zap } from 'lucide-react';

export default function KeyStats({ stats, theme = 'dark' }) {
  // Theme-aware styling
  const ds = {
    bgCard: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  };

  if (!stats) {
    return (
      <Card className={`${ds.bgCard} ${ds.border}`}>
        <CardHeader>
          <CardTitle className={ds.text}>Key Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${ds.textMuted} text-center py-4`}>No stats available</p>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      label: 'Usage Rate',
      value: `${stats.usage_rate?.toFixed(1) || '0.0'}%`,
      icon: Target,
      color: 'text-blue-400',
    },
    {
      label: 'True Shooting %',
      value: `${stats.true_shooting_percentage?.toFixed(1) || '0.0'}%`,
      icon: Zap,
      color: 'text-yellow-400',
    },
    {
      label: 'PER',
      value: stats.player_efficiency_rating?.toFixed(1) || '0.0',
      icon: TrendingUp,
      color: 'text-green-400',
    },
  ];

  return (
    <Card className={`${ds.bgCard} ${ds.border}`}>
      <CardHeader>
        <CardTitle className={ds.text}>Key Advanced Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className={ds.textMuted}>{item.label}</span>
                </div>
                <span className={`text-lg font-semibold ${ds.text}`}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
