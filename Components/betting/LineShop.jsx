import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { OddsChip } from '../ui/OddsChip';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

export default function LineShop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');

  const mockLines = [
    {
      id: 1,
      game: 'Lakers vs Warriors',
      market: 'spread',
      team: 'Lakers',
      bestOdds: -5.5,
      sportsbooks: [
        { name: 'DraftKings', odds: -5.5, price: -110 },
        { name: 'FanDuel', odds: -5.5, price: -115 },
        { name: 'BetMGM', odds: -6.0, price: -105 },
      ],
      movement: '+0.5',
    },
    {
      id: 2,
      game: 'Celtics vs Heat',
      market: 'total',
      team: 'Over',
      bestOdds: 218.5,
      sportsbooks: [
        { name: 'DraftKings', odds: 218.5, price: -110 },
        { name: 'FanDuel', odds: 219.0, price: -108 },
        { name: 'BetMGM', odds: 218.5, price: -112 },
      ],
      movement: '-1.5',
    },
    {
      id: 3,
      game: 'Nuggets vs Suns',
      market: 'moneyline',
      team: 'Nuggets',
      bestOdds: -145,
      sportsbooks: [
        { name: 'DraftKings', odds: -145, price: 0 },
        { name: 'FanDuel', odds: -150, price: 0 },
        { name: 'BetMGM', odds: -140, price: 0 },
      ],
      movement: '-5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search games, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={marketFilter} onValueChange={setMarketFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Market type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="spread">Spreads</SelectItem>
                <SelectItem value="total">Totals</SelectItem>
                <SelectItem value="moneyline">Moneylines</SelectItem>
                <SelectItem value="props">Props</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lines Grid */}
      <div className="space-y-4">
        {mockLines.map((line) => (
          <Card key={line.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{line.game}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{line.market}</Badge>
                    <span className="text-slate-400 text-sm">{line.team}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {line.movement.includes('+') ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-sm font-semibold text-slate-300">
                    {line.movement}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {line.sportsbooks.map((book) => (
                  <div
                    key={book.name}
                    className="p-4 bg-slate-900/50 rounded border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <p className="text-sm text-slate-400 mb-2">{book.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {book.odds > 0 ? `+${book.odds}` : book.odds}
                      </span>
                      {book.price !== 0 && (
                        <OddsChip odds={book.price} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
