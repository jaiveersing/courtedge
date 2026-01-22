import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { OddsChip } from '../ui/OddsChip';
import { TrendingUp } from 'lucide-react';

export default function OddsComparison({ market, sportsbooks }) {
  const mockSportsbooks = sportsbooks || [
    { name: 'DraftKings', odds: -110, ev: '+2.3%' },
    { name: 'FanDuel', odds: -115, ev: '-1.2%' },
    { name: 'BetMGM', odds: -105, ev: '+5.1%' },
    { name: 'Caesars', odds: -120, ev: '-3.4%' },
    { name: 'PointsBet', odds: -108, ev: '+3.8%' },
  ];

  // Sort by best value (highest EV)
  const sortedBooks = [...mockSportsbooks].sort((a, b) => {
    const evA = parseFloat(a.ev);
    const evB = parseFloat(b.ev);
    return evB - evA;
  });

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>Odds Comparison</CardTitle>
        {market && (
          <p className="text-sm text-slate-400 mt-1">{market}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedBooks.map((book, idx) => {
          const evNum = parseFloat(book.ev);
          const isPositive = evNum > 0;
          const isBest = idx === 0 && isPositive;

          return (
            <div
              key={book.name}
              className={`
                flex items-center justify-between p-3 rounded border
                ${isBest 
                  ? 'bg-green-900/20 border-green-800' 
                  : 'bg-slate-900/50 border-slate-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {isBest && <TrendingUp className="h-4 w-4 text-green-400" />}
                <span className="font-medium text-white">{book.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <OddsChip odds={book.odds} />
                <Badge variant={isPositive ? 'default' : 'secondary'}>
                  {book.ev}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
