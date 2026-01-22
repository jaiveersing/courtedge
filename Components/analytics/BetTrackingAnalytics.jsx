import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function BetTrackingAnalytics({ bets }) {
  const mockData = {
    totalBets: bets?.length || 0,
    winRate: 58.5,
    roi: 12.3,
    profit: 1247,
    avgOdds: -110,
    bestDay: { date: '2024-01-15', profit: 325 },
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>Bet Tracking Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/50 rounded">
            <p className="text-slate-400 text-sm mb-1">Win Rate</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">{mockData.winRate}%</p>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded">
            <p className="text-slate-400 text-sm mb-1">ROI</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-400">+{mockData.roi}%</p>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded">
            <p className="text-slate-400 text-sm mb-1">Total Profit</p>
            <p className="text-2xl font-bold text-green-400">
              ${mockData.profit.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-900/50 rounded">
            <p className="text-slate-400 text-sm mb-1">Total Bets</p>
            <p className="text-2xl font-bold text-white">{mockData.totalBets}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-900/20 rounded border border-blue-800">
          <p className="text-blue-400 text-sm mb-1">Best Day</p>
          <div className="flex items-center justify-between">
            <span className="text-white">{mockData.bestDay.date}</span>
            <span className="text-green-400 font-semibold">
              +${mockData.bestDay.profit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
