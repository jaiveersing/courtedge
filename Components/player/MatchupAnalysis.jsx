import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Target } from 'lucide-react';

export default function MatchupAnalysis({ opponent, historicalData }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Matchup Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-slate-400 text-sm mb-2">Next Opponent</p>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
              <span className="text-white font-semibold">
                {opponent?.name || 'TBD'}
              </span>
              <Badge>{opponent?.record || '0-0'}</Badge>
            </div>
          </div>

          {historicalData && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Career vs {opponent?.name}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-900/50 rounded text-center">
                  <p className="text-xs text-slate-400">PPG</p>
                  <p className="text-lg font-bold text-white">
                    {historicalData.ppg?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded text-center">
                  <p className="text-xs text-slate-400">RPG</p>
                  <p className="text-lg font-bold text-white">
                    {historicalData.rpg?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded text-center">
                  <p className="text-xs text-slate-400">APG</p>
                  <p className="text-lg font-bold text-white">
                    {historicalData.apg?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
