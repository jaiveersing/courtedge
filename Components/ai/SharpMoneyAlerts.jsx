import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export default function SharpMoneyAlerts({ alerts }) {
  const mockAlerts = alerts || [
    {
      id: 1,
      game: 'Lakers vs Warriors',
      line: 'Lakers -5.5',
      movement: '+2.5',
      sharpMoney: '85%',
      time: '2 mins ago',
      priority: 'high',
    },
    {
      id: 2,
      game: 'Celtics vs Heat',
      line: 'Over 218.5',
      movement: '-3.0',
      sharpMoney: '72%',
      time: '15 mins ago',
      priority: 'medium',
    },
    {
      id: 3,
      game: 'Nuggets vs Suns',
      line: 'Nuggets ML',
      movement: '-120 to -135',
      sharpMoney: '68%',
      time: '1 hour ago',
      priority: 'medium',
    },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Sharp Money Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              p-4 rounded border transition-all hover:shadow-md
              ${alert.priority === 'high' 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-slate-900/50 border-slate-700'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {alert.priority === 'high' && (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="font-semibold text-white">{alert.game}</span>
                </div>
                <p className="text-sm text-blue-400">{alert.line}</p>
              </div>
              <Badge variant={alert.priority === 'high' ? 'destructive' : 'default'}>
                {alert.sharpMoney} Sharp
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-yellow-400">
                <TrendingUp className="h-4 w-4" />
                <span>Movement: {alert.movement}</span>
              </div>
              <span className="text-slate-500">{alert.time}</span>
            </div>
          </div>
        ))}

        {mockAlerts.length === 0 && (
          <p className="text-slate-400 text-center py-8">No sharp money alerts</p>
        )}
      </CardContent>
    </Card>
  );
}
