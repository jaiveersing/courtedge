import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export default function DailyBreakdownModal({ date, bets, isOpen, onClose }) {
  if (!date || !bets) {
return null;
}

  const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bets for {date}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded">
            <span className="text-slate-400">Total Profit/Loss</span>
            <Badge variant={totalProfit > 0 ? 'default' : 'secondary'} className="text-lg">
              {totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bet</TableHead>
                <TableHead>Odds</TableHead>
                <TableHead>Stake</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bets.map((bet, idx) => (
                <TableRow key={idx}>
                  <TableCell>{bet.description}</TableCell>
                  <TableCell>{bet.odds}</TableCell>
                  <TableCell>${bet.stake}</TableCell>
                  <TableCell>
                    <Badge variant={bet.won ? 'default' : 'secondary'}>
                      {bet.won ? 'Won' : 'Lost'}
                    </Badge>
                  </TableCell>
                  <TableCell className={bet.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                    {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
