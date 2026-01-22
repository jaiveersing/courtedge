import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

export default function Last30Games({ games }) {
  if (!games || games.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Last 30 Games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">No game data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>Last 30 Games</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>PTS</TableHead>
              <TableHead>REB</TableHead>
              <TableHead>AST</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.slice(0, 30).map((game, idx) => (
              <TableRow key={idx}>
                <TableCell>{game.date || 'N/A'}</TableCell>
                <TableCell>{game.opponent || 'N/A'}</TableCell>
                <TableCell className="font-semibold">{game.points || 0}</TableCell>
                <TableCell>{game.rebounds || 0}</TableCell>
                <TableCell>{game.assists || 0}</TableCell>
                <TableCell>
                  <Badge variant={game.won ? 'default' : 'secondary'}>
                    {game.won ? 'W' : 'L'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
