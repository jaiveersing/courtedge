import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, Brain, Target, Sparkles, Filter, ChevronDown } from 'lucide-react';
import mlService from '@/src/api/mlService';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function PlayerPropsModern() {
  const [selectedStat, setSelectedStat] = useState('points');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const topPlayers = [
    { 
      name: 'LeBron James', 
      team: 'LAL', 
      opponent: 'vs GSW',
      lines: { 
        points: 25.5, 
        rebounds: 7.5, 
        assists: 7.5,
        threes: 2.5 
      },
      predictions: {
        points: 27.8,
        rebounds: 8.2,
        assists: 8.1,
        threes: 2.8
      },
      confidence: 87,
      trend: 'up',
      lastGames: [28, 31, 24, 27, 29]
    },
    { 
      name: 'Stephen Curry', 
      team: 'GSW', 
      opponent: '@ LAL',
      lines: { 
        points: 27.5, 
        rebounds: 4.5, 
        assists: 6.5,
        threes: 4.5 
      },
      predictions: {
        points: 30.2,
        rebounds: 4.8,
        assists: 7.1,
        threes: 5.2
      },
      confidence: 92,
      trend: 'up',
      lastGames: [32, 28, 35, 27, 31]
    },
    { 
      name: 'Giannis Antetokounmpo', 
      team: 'MIL', 
      opponent: 'vs BOS',
      lines: { 
        points: 30.5, 
        rebounds: 11.5, 
        assists: 5.5,
        threes: 0.5 
      },
      predictions: {
        points: 32.4,
        rebounds: 12.8,
        assists: 6.2,
        threes: 0.7
      },
      confidence: 89,
      trend: 'up',
      lastGames: [34, 29, 36, 31, 28]
    },
    { 
      name: 'Luka Doncic', 
      team: 'DAL', 
      opponent: '@ PHX',
      lines: { 
        points: 28.5, 
        rebounds: 8.5, 
        assists: 8.5,
        threes: 3.5 
      },
      predictions: {
        points: 31.2,
        rebounds: 9.1,
        assists: 9.8,
        threes: 3.9
      },
      confidence: 91,
      trend: 'up',
      lastGames: [33, 29, 35, 28, 32]
    },
    { 
      name: 'Jayson Tatum', 
      team: 'BOS', 
      opponent: '@ MIL',
      lines: { 
        points: 27.5, 
        rebounds: 8.5, 
        assists: 4.5,
        threes: 3.5 
      },
      predictions: {
        points: 26.2,
        rebounds: 8.1,
        assists: 4.8,
        threes: 3.2
      },
      confidence: 78,
      trend: 'down',
      lastGames: [24, 28, 22, 29, 26]
    },
    { 
      name: 'Kevin Durant', 
      team: 'PHX', 
      opponent: 'vs DAL',
      lines: { 
        points: 28.5, 
        rebounds: 6.5, 
        assists: 5.5,
        threes: 2.5 
      },
      predictions: {
        points: 30.8,
        rebounds: 7.2,
        assists: 6.1,
        threes: 2.9
      },
      confidence: 88,
      trend: 'up',
      lastGames: [31, 29, 33, 28, 30]
    }
  ];

  const statTypes = [
    { value: 'points', label: 'Points', icon: Target },
    { value: 'rebounds', label: 'Rebounds', icon: Activity },
    { value: 'assists', label: 'Assists', icon: TrendingUp },
    { value: 'threes', label: '3-Pointers', icon: Sparkles }
  ];

  const getEdge = (player) => {
    const prediction = player.predictions[selectedStat];
    const line = player.lines[selectedStat];
    const edge = ((prediction - line) / line) * 100;
    return edge;
  };

  const filteredPlayers = topPlayers
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(player => {
      if (filterValue === 'all') return true;
      if (filterValue === 'over') return getEdge(player) > 3;
      if (filterValue === 'under') return getEdge(player) < -3;
      return true;
    })
    .sort((a, b) => Math.abs(getEdge(b)) - Math.abs(getEdge(a)));

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 mesh-gradient opacity-20"></div>
        <div className="absolute inset-0 dot-pattern"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="gradient-text">Player Props</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered prop predictions with real-time edge analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-semibold text-purple-500">AI Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 animate-slide-in-up stagger-1">
          <div className="card-glass p-6 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Search Players
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern pl-10"
                  />
                </div>
              </div>

              {/* Stat Type Filter */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Stat Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {statTypes.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <button
                        key={stat.value}
                        onClick={() => setSelectedStat(stat.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedStat === stat.value
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium block">{stat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edge Filter */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Filter by Edge
                </label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="input-modern"
                >
                  <option value="all">All Edges</option>
                  <option value="over">Over Edges (&gt;3%)</option>
                  <option value="under">Under Edges (&lt;-3%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Props Grid */}
        <div className="space-y-4">
          {filteredPlayers.map((player, index) => {
            const edge = getEdge(player);
            const prediction = player.predictions[selectedStat];
            const line = player.lines[selectedStat];
            const isOver = prediction > line;

            return (
              <div
                key={index}
                className={`card-elevated p-6 rounded-2xl hover:scale-[1.01] transition-all duration-300 animate-slide-in-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  {/* Player Info */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{player.name}</h3>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="font-semibold">{player.team}</span>
                        <span>•</span>
                        <span>{player.opponent}</span>
                        <span>•</span>
                        <span className="text-xs">{selectedStat.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    {/* Line */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Line</div>
                      <div className="text-3xl font-bold text-foreground">{line}</div>
                    </div>

                    {/* Prediction */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">AI Prediction</div>
                      <div className={`text-3xl font-bold ${isOver ? 'text-green-500' : 'text-red-500'}`}>
                        {prediction.toFixed(1)}
                      </div>
                    </div>

                    {/* Edge */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Edge</div>
                      <div className={`text-3xl font-bold flex items-center gap-2 ${
                        Math.abs(edge) > 5 ? isOver ? 'text-green-500' : 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {isOver ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        {edge > 0 ? '+' : ''}{edge.toFixed(1)}%
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Confidence</div>
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-muted/30"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(player.confidence / 100) * 201} 201`}
                            className={player.confidence >= 85 ? 'text-green-500' : player.confidence >= 75 ? 'text-yellow-500' : 'text-orange-500'}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-foreground">{player.confidence}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      className={`btn-primary ${
                        Math.abs(edge) > 5 ? 'animate-pulse-glow' : ''
                      }`}
                    >
                      {isOver ? 'Bet Over' : 'Bet Under'}
                    </button>
                  </div>
                </div>

                {/* Recent Performance */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Last 5 Games:</span>
                    <div className="flex items-center gap-2">
                      {player.lastGames.map((game, i) => (
                        <div
                          key={i}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            game > line ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {game}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No props found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
