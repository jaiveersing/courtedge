import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Users, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import PlayersAPI from '../../src/api/playersApi';

const PlayerDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [sortBy, setSortBy] = useState('ppg');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  const playersPerPage = 20;

  // Get filtered and sorted players
  const filteredPlayers = useMemo(() => {
    const filters = {
      search: searchQuery,
      team: selectedTeam !== 'all' ? selectedTeam : undefined,
      position: selectedPosition !== 'all' ? selectedPosition : undefined,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: playersPerPage
    };

    return PlayersAPI.getPlayersLocal(filters);
  }, [searchQuery, selectedTeam, selectedPosition, sortBy, sortOrder, currentPage]);

  const teams = useMemo(() => {
    const result = PlayersAPI.getTeams();
    return result.success ? result.data : [];
  }, []);

  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'desc' ? <TrendingDown className="w-3 h-3 ml-1" /> : <TrendingUp className="w-3 h-3 ml-1" />;
  };

  const StatLeaders = () => {
    const scoringLeaders = PlayersAPI.getLeaders('ppg', 5);
    const reboundLeaders = PlayersAPI.getLeaders('rpg', 5);
    const assistLeaders = PlayersAPI.getLeaders('apg', 5);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Points Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scoringLeaders.data?.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-medium">{player.name}</span>
                  <Badge variant="outline" className="text-xs">{player.team}</Badge>
                </div>
                <span className="font-bold text-orange-500">{player.value.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Rebounds Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reboundLeaders.data?.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-medium">{player.name}</span>
                  <Badge variant="outline" className="text-xs">{player.team}</Badge>
                </div>
                <span className="font-bold text-blue-500">{player.value.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              Assists Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assistLeaders.data?.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-medium">{player.name}</span>
                  <Badge variant="outline" className="text-xs">{player.team}</Badge>
                </div>
                <span className="font-bold text-green-500">{player.value.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const PlayerTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left p-3 text-sm font-medium text-slate-400">Player</th>
            <th className="text-center p-3 text-sm font-medium text-slate-400">Team</th>
            <th className="text-center p-3 text-sm font-medium text-slate-400">Pos</th>
            <th className="text-center p-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200" onClick={() => handleSort('ppg')}>
              <div className="flex items-center justify-center">
                PPG <SortIcon field="ppg" />
              </div>
            </th>
            <th className="text-center p-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200" onClick={() => handleSort('rpg')}>
              <div className="flex items-center justify-center">
                RPG <SortIcon field="rpg" />
              </div>
            </th>
            <th className="text-center p-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200" onClick={() => handleSort('apg')}>
              <div className="flex items-center justify-center">
                APG <SortIcon field="apg" />
              </div>
            </th>
            <th className="text-center p-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200" onClick={() => handleSort('fgPct')}>
              <div className="flex items-center justify-center">
                FG% <SortIcon field="fgPct" />
              </div>
            </th>
            <th className="text-center p-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200" onClick={() => handleSort('per')}>
              <div className="flex items-center justify-center">
                PER <SortIcon field="per" />
              </div>
            </th>
            <th className="text-center p-3 text-sm font-medium text-slate-400">GP</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.data?.map((player) => (
            <tr key={player.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="p-3">
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs text-slate-400">{player.height} • {player.weight} lbs • {player.age} yo</div>
                </div>
              </td>
              <td className="text-center p-3">
                <Badge variant="outline">{player.team}</Badge>
              </td>
              <td className="text-center p-3">
                <Badge className="bg-slate-700">{player.position}</Badge>
              </td>
              <td className="text-center p-3 font-semibold text-orange-500">{player.ppg.toFixed(1)}</td>
              <td className="text-center p-3 font-semibold text-blue-500">{player.rpg.toFixed(1)}</td>
              <td className="text-center p-3 font-semibold text-green-500">{player.apg.toFixed(1)}</td>
              <td className="text-center p-3">{(player.fgPct * 100).toFixed(1)}%</td>
              <td className="text-center p-3 font-semibold">{player.per.toFixed(1)}</td>
              <td className="text-center p-3 text-slate-400">{player.gamesPlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PlayerCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPlayers.data?.map((player) => (
        <Card key={player.id} className="hover:border-slate-600 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">{player.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{player.team}</Badge>
                  <Badge className="bg-slate-700 text-xs">{player.position}</Badge>
                  <span className="text-xs text-slate-400">#{player.jersey}</span>
                </div>
              </div>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{player.ppg.toFixed(1)}</div>
                <div className="text-xs text-slate-400">PPG</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{player.rpg.toFixed(1)}</div>
                <div className="text-xs text-slate-400">RPG</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{player.apg.toFixed(1)}</div>
                <div className="text-xs text-slate-400">APG</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-slate-400">FG%</div>
                <div className="font-semibold">{(player.fgPct * 100).toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">3P%</div>
                <div className="font-semibold">{(player.fg3Pct * 100).toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">PER</div>
                <div className="font-semibold">{player.per.toFixed(1)}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
              {player.height} • {player.weight} lbs • {player.age} years • {player.gamesPlayed} GP
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NBA Player Database</h1>
          <p className="text-slate-400 mt-1">100 players • 2025-26 Season Stats</p>
        </div>
      </div>

      <StatLeaders />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search players by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedTeam}
                onChange={(e) => {
                  setSelectedTeam(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-slate-600"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team.code} value={team.code}>{team.name}</option>
                ))}
              </select>

              <select
                value={selectedPosition}
                onChange={(e) => {
                  setSelectedPosition(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-slate-600"
              >
                <option value="all">All Positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  onClick={() => setViewMode('table')}
                  size="sm"
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  onClick={() => setViewMode('cards')}
                  size="sm"
                >
                  Cards
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                Showing {((currentPage - 1) * playersPerPage) + 1} - {Math.min(currentPage * playersPerPage, filteredPlayers.pagination?.total || 0)} of {filteredPlayers.pagination?.total || 0} players
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Sorted by {sortBy.toUpperCase()} ({sortOrder})</span>
              </div>
            </div>

            {/* Player List */}
            {viewMode === 'table' ? <PlayerTableView /> : <PlayerCardView />}

            {/* Pagination */}
            {filteredPlayers.pagination?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: filteredPlayers.pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(filteredPlayers.pagination.totalPages, p + 1))}
                  disabled={currentPage === filteredPlayers.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDatabase;
