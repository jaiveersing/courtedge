import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlayerStatsTable({ players, sortBy, onSort }) {
  const [localSortBy, setLocalSortBy] = useState(sortBy || 'points_per_game');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (column) => {
    if (localSortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setLocalSortBy(column);
      setSortDirection('desc');
    }
    if (onSort) onSort(column);
  };

  const sortedPlayers = [...(players || [])].sort((a, b) => {
    const aVal = a[localSortBy] || 0;
    const bVal = b[localSortBy] || 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="rounded-md border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('points_per_game')}
                className="h-8 px-2"
              >
                PPG <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('rebounds_per_game')}
                className="h-8 px-2"
              >
                RPG <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('assists_per_game')}
                className="h-8 px-2"
              >
                APG <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>FG%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.slice(0, 50).map((player, idx) => (
            <TableRow key={idx} className="hover:bg-slate-800/50">
              <TableCell>
                <Link 
                  to={`/player-profile?id=${player.id}`}
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  {player.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{player.team}</Badge>
              </TableCell>
              <TableCell className="font-semibold">
                {player.points_per_game?.toFixed(1) || '0.0'}
              </TableCell>
              <TableCell>{player.rebounds_per_game?.toFixed(1) || '0.0'}</TableCell>
              <TableCell>{player.assists_per_game?.toFixed(1) || '0.0'}</TableCell>
              <TableCell>
                {player.field_goal_percentage?.toFixed(1) || '0.0'}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
