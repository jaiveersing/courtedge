import { useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { ArrowLeft, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Mock all players data
const mockAllPlayers = {
  "OKC": [
    { id: 1, name: "S. Gilgeous-Alexander", position: "PG", number: "2" },
    { id: 2, name: "J. Giddey", position: "PG", number: "3" },
    { id: 3, name: "C. Holmgren", position: "C", number: "7" },
    { id: 4, name: "L. Dort", position: "SG", number: "5" },
    { id: 5, name: "J. Williams", position: "SF", number: "8" },
    { id: 6, name: "I. Joe", position: "SG", number: "11" },
    { id: 7, name: "J. Robinson-Earl", position: "PF", number: "50" },
    { id: 8, name: "K. Wallace", position: "SG", number: "13" },
  ],
  "GSW": [
    { id: 9, name: "S. Curry", position: "PG", number: "30" },
    { id: 10, name: "K. Thompson", position: "SG", number: "11" },
    { id: 11, name: "A. Wiggins", position: "SF", number: "22" },
    { id: 12, name: "D. Green", position: "PF", number: "23" },
    { id: 13, name: "K. Looney", position: "C", number: "5" },
    { id: 14, name: "C. Paul", position: "PG", number: "3" },
    { id: 15, name: "J. Kuminga", position: "SF", number: "00" },
    { id: 16, name: "M. Moody", position: "SG", number: "4" },
  ]
};

const PlayerCard = ({ player, team }) => {
  return (
    <Link to={createPageUrl(`PlayerPropDetail?player=${player.name}&team=${team}`)}>
      <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                  {player.name}
                </div>
                <div className="text-xs text-slate-400">
                  #{player.number} • {player.position}
                </div>
              </div>
            </div>
            <div className="text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function GamePropsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const params = new URLSearchParams(window.location.search);
  const gameParam = params.get('game') || "OKC@GSW";
  const [awayTeam, homeTeam] = gameParam.split('@');

  const allPlayers = [...(mockAllPlayers[awayTeam] || []), ...(mockAllPlayers[homeTeam] || [])];
  
  const filteredPlayers = allPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || 
                       (selectedTeam === awayTeam && mockAllPlayers[awayTeam]?.includes(player)) ||
                       (selectedTeam === homeTeam && mockAllPlayers[homeTeam]?.includes(player));
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={createPageUrl("Predictions")}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{awayTeam} @ {homeTeam}</h1>
              <p className="text-sm text-slate-400">Select a player to view their props and trends</p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
              LIVE
            </Badge>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button
              variant={selectedTeam === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTeam('all')}
              className={selectedTeam === 'all' ? 'bg-blue-500' : 'border-slate-600'}
            >
              All Teams
            </Button>
            <Button
              variant={selectedTeam === awayTeam ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTeam(awayTeam)}
              className={selectedTeam === awayTeam ? 'bg-blue-500' : 'border-slate-600'}
            >
              {awayTeam}
            </Button>
            <Button
              variant={selectedTeam === homeTeam ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTeam(homeTeam)}
              className={selectedTeam === homeTeam ? 'bg-blue-500' : 'border-slate-600'}
            >
              {homeTeam}
            </Button>
          </div>
        </div>

        {/* Players List */}
        <div className="grid md:grid-cols-2 gap-3">
          {filteredPlayers.map((player) => {
            const team = mockAllPlayers[awayTeam]?.includes(player) ? awayTeam : homeTeam;
            return <PlayerCard key={player.id} player={player} team={team} />;
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No players found</p>
          </div>
        )}
      </div>
    </div>
  );
}
