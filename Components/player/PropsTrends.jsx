import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PropsTrends({ trends }) {
  const mockTrends = trends || [
    { prop: 'Points', line: 25.5, hitRate: 70, trend: 'up' },
    { prop: 'Rebounds', line: 8.5, hitRate: 55, trend: 'down' },
    { prop: 'Assists', line: 6.5, hitRate: 65, trend: 'up' },
    { prop: 'Threes Made', line: 2.5, hitRate: 60, trend: 'up' },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>Props Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTrends.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded hover:bg-slate-900/70 transition-colors"
            >
              <div className="flex-1">
                <p className="text-white font-medium">{item.prop}</p>
                <p className="text-sm text-slate-400">O/U {item.line}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={item.hitRate >= 60 ? 'default' : 'secondary'}>
                  {item.hitRate}% Hit Rate
                </Badge>
                {item.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
