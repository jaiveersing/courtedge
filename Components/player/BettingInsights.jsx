import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function BettingInsights({ player, recentPerformance, theme = 'dark' }) {
  // Theme-aware styling
  const ds = {
    bgCard: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    bgCardAlt: theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-100',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  };

  const insights = [
    {
      type: 'value',
      title: 'Best Value Props',
      items: [
        { prop: 'Points Over 25.5', ev: '+5.2%', sportsbook: 'DraftKings' },
        { prop: 'Rebounds Over 8.5', ev: '+3.8%', sportsbook: 'FanDuel' },
      ],
    },
    {
      type: 'trend',
      title: 'Recent Trends',
      items: [
        { text: 'Hit Over in 7 of last 10 games', trend: 'up' },
        { text: 'Averages 28.5 PPG in last 5', trend: 'up' },
        { text: 'Better at home (30.2 vs 24.8)', trend: 'neutral' },
      ],
    },
  ];

  return (
    <Card className={`${ds.bgCard} ${ds.border}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${ds.text}`}>
          <DollarSign className="h-5 w-5" />
          Betting Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {insights.map((section, idx) => (
          <div key={idx}>
            <h3 className={`text-sm font-semibold ${ds.textSecondary} mb-3`}>{section.title}</h3>
            <div className="space-y-2">
              {section.type === 'value' ? (
                section.items.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 ${ds.bgCardAlt} rounded`}>
                    <div>
                      <p className={`${ds.text} font-medium`}>{item.prop}</p>
                      <p className={`text-xs ${ds.textMuted}`}>{item.sportsbook}</p>
                    </div>
                    <Badge className="bg-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {item.ev}
                    </Badge>
                  </div>
                ))
              ) : (
                section.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span className={ds.textSecondary}>{item.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
