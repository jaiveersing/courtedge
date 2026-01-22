import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppCard } from "@/Components/ui/AppCard";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Zap,
  Home,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Target
} from "lucide-react";

// Mock data for NBA player trends
const generateMockTrends = () => {
  const players = [
    { name: "J. Randle", team: "MIN", teamLogo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", opponent: "BOS" },
    { name: "R. Gobert", team: "MIN", teamLogo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", opponent: "BOS" },
    { name: "M. Conley", team: "MIN", teamLogo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", opponent: "BOS" },
    { name: "N. Reid", team: "MIN", teamLogo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", opponent: "BOS" },
    { name: "A. Edwards", team: "MIN", teamLogo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", opponent: "BOS" },
    { name: "J. Tatum", team: "BOS", teamLogo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", opponent: "MIN" },
    { name: "J. Brown", team: "BOS", teamLogo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", opponent: "MIN" },
    { name: "K. Porzingis", team: "BOS", teamLogo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", opponent: "MIN" },
  ];

  const statTypes = [
    { label: "1Q Points", value: "1q_points" },
    { label: "Points", value: "points" },
    { label: "Rebounds", value: "rebounds" },
    { label: "Assists", value: "assists" },
    { label: "PTS+AST", value: "pts_ast" },
    { label: "PTS+REB+AST", value: "pts_reb_ast" },
    { label: "REB+AST", value: "reb_ast" },
    { label: "Three-Pointers Made", value: "threes" },
    { label: "Turnovers", value: "turnovers" },
  ];

  const trends = [];
  
  players.forEach(player => {
    // Generate 3-5 trends per player
    const numTrends = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numTrends; i++) {
      const stat = statTypes[Math.floor(Math.random() * statTypes.length)];
      const hitRate = Math.floor(Math.random() * 40) + 60; // 60-100%
      const gamesHit = Math.floor((hitRate / 100) * 10);
      const totalGames = 10;
      const line = (Math.random() * 30 + 5).toFixed(1);
      const overUnder = Math.random() > 0.5 ? "Over" : "Under";
      const odds = Math.random() > 0.5 ? `+${Math.floor(Math.random() * 200 + 100)}` : `-${Math.floor(Math.random() * 200 + 100)}`;
      const isHome = Math.random() > 0.5;
      const context = isHome ? "home games" : "last games";
      
      trends.push({
        id: `${player.name}-${stat.value}-${i}`,
        player: player.name,
        team: player.team,
        teamLogo: player.teamLogo,
        opponent: player.opponent,
        statType: stat.label,
        statValue: stat.value,
        overUnder,
        line: parseFloat(line),
        hitRate,
        gamesHit,
        totalGames,
        odds,
        isHome,
        context,
        confidence: hitRate >= 80 ? "high" : hitRate >= 60 ? "medium" : "low",
        streak: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 3 : 0
      });
    }
  });

  return trends.sort((a, b) => b.hitRate - a.hitRate);
};

export default function PlayerTrends() {
  const [trends, setTrends] = useState([]);
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("hitRate");
  const [filterStatType, setFilterStatType] = useState("all");
  const [filterHitRate, setFilterHitRate] = useState(0);
  const [expandedTrend, setExpandedTrend] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const mockTrends = generateMockTrends();
    setTrends(mockTrends);
    setFilteredTrends(mockTrends);
  }, []);

  useEffect(() => {
    let filtered = [...trends];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.statType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Stat type filter
    if (filterStatType !== "all") {
      filtered = filtered.filter(t => t.statValue === filterStatType);
    }

    // Hit rate filter
    if (filterHitRate > 0) {
      filtered = filtered.filter(t => t.hitRate >= filterHitRate);
    }

    // Sort
    if (sortBy === "hitRate") {
      filtered.sort((a, b) => b.hitRate - a.hitRate);
    } else if (sortBy === "odds") {
      filtered.sort((a, b) => {
        const aVal = parseInt(a.odds.replace(/[+-]/g, ''));
        const bVal = parseInt(b.odds.replace(/[+-]/g, ''));
        return bVal - aVal;
      });
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.player.localeCompare(b.player));
    }

    setFilteredTrends(filtered);
  }, [searchQuery, sortBy, filterStatType, filterHitRate, trends]);

  const toggleExpand = (trendId) => {
    setExpandedTrend(expandedTrend === trendId ? null : trendId);
  };

  const getConfidenceIcon = (trend) => {
    if (trend.confidence === "high") return <Zap className="w-4 h-4 text-yellow-400" />;
    if (trend.isHome) return <Home className="w-4 h-4 text-blue-400" />;
    if (trend.hitRate < 70) return <AlertCircle className="w-4 h-4 text-orange-400" />;
    return null;
  };

  const getHitRateColor = (hitRate) => {
    if (hitRate >= 80) return "text-green-400";
    if (hitRate >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const generateGameLog = (trend) => {
    const games = [];
    const dates = ["11/27/25", "11/25/25", "11/22/25", "11/20/25", "11/18/25", "11/16/25", "11/14/25", "11/12/25", "11/10/25", "11/08/25"];
    const opponents = ["OKL", "SAC", "PHX", "WAS", "DAL", "MEM", "HOU", "DEN", "LAL", "GSW"];
    
    for (let i = 0; i < 10; i++) {
      const hit = i < trend.gamesHit;
      const statValue = hit ? trend.line + Math.random() * 5 : trend.line - Math.random() * 3;
      games.push({
        date: dates[i],
        opponent: opponents[i],
        result: Math.random() > 0.5 ? "W" : "L",
        score: `${Math.floor(Math.random() * 30 + 95)}-${Math.floor(Math.random() * 30 + 95)}`,
        stat: statValue.toFixed(1),
        hit,
        minutes: Math.floor(Math.random() * 10 + 28)
      });
    }
    return games;
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-full mx-auto px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Player Trends</h1>
          <p className="text-lg text-slate-400">Discover high-confidence player prop opportunities</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search players, teams, or stat types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/[0.02] border-white/10 text-white"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <AppCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/[0.02] border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hitRate">Hit Rate (High to Low)</SelectItem>
                      <SelectItem value="odds">Odds Value</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Stat Type</label>
                  <Select value={filterStatType} onValueChange={setFilterStatType}>
                    <SelectTrigger className="bg-white/[0.02] border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stats</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="rebounds">Rebounds</SelectItem>
                      <SelectItem value="assists">Assists</SelectItem>
                      <SelectItem value="pts_ast">PTS+AST</SelectItem>
                      <SelectItem value="pts_reb_ast">PTS+REB+AST</SelectItem>
                      <SelectItem value="threes">Three-Pointers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Minimum Hit Rate: {filterHitRate}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filterHitRate}
                    onChange={(e) => setFilterHitRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </AppCard>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AppCard className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-3xl font-bold text-white">{filteredTrends.length}</div>
                <div className="text-sm text-slate-400">Active Trends</div>
              </div>
            </div>
          </AppCard>

          <AppCard className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {filteredTrends.filter(t => t.confidence === "high").length}
                </div>
                <div className="text-sm text-slate-400">High Confidence</div>
              </div>
            </div>
          </AppCard>

          <AppCard className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {filteredTrends.filter(t => t.streak >= 3).length}
                </div>
                <div className="text-sm text-slate-400">Hot Streaks</div>
              </div>
            </div>
          </AppCard>

          <AppCard className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {Math.round(filteredTrends.reduce((sum, t) => sum + t.hitRate, 0) / filteredTrends.length || 0)}%
                </div>
                <div className="text-sm text-slate-400">Avg Hit Rate</div>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Trends List */}
        <div className="space-y-4">
          {filteredTrends.length === 0 ? (
            <AppCard className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No trends found</h3>
              <p className="text-slate-400">Try adjusting your filters or search query</p>
            </AppCard>
          ) : (
            filteredTrends.map((trend) => (
              <AppCard key={trend.id} className="p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="flex items-start justify-between" onClick={() => toggleExpand(trend.id)}>
                  {/* Left Section: Player Info */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={trend.teamLogo} 
                      alt={trend.team} 
                      className="w-16 h-16 rounded-full bg-white/5 p-2"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{trend.player}</h3>
                        <Badge variant="outline" className="text-xs">
                          {trend.team}
                        </Badge>
                      </div>
                      <div className="text-slate-400 text-sm mb-2">
                        vs <span className="text-white font-semibold">{trend.opponent}</span>
                      </div>
                      <div className="text-white font-semibold text-lg">
                        {trend.overUnder} {trend.line} {trend.statType}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        • Hit in {trend.context}
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Stats */}
                  <div className="flex items-center gap-8">
                    {/* Hit Rate */}
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getHitRateColor(trend.hitRate)}`}>
                        {trend.hitRate}%
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {trend.gamesHit}/{trend.totalGames} games
                      </div>
                      {/* Progress Bar */}
                      <div className="w-24 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full ${trend.hitRate >= 80 ? 'bg-green-400' : trend.hitRate >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${trend.hitRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Odds */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{trend.odds}</div>
                      <div className="text-xs text-slate-400 mt-1">Current Odds</div>
                    </div>

                    {/* Indicators */}
                    <div className="flex flex-col gap-2">
                      {getConfidenceIcon(trend)}
                      {trend.streak >= 3 && (
                        <div className="flex items-center gap-1 text-orange-400 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          {trend.streak} game streak
                        </div>
                      )}
                    </div>

                    {/* Expand Button */}
                    <Button variant="ghost" size="sm">
                      {expandedTrend === trend.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Game Log */}
                {expandedTrend === trend.id && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Last 10 Games</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-slate-400 border-b border-white/10">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Opponent</th>
                            <th className="pb-3">Result</th>
                            <th className="pb-3">{trend.statType}</th>
                            <th className="pb-3">Hit</th>
                            <th className="pb-3">Minutes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateGameLog(trend).map((game, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-3 text-white">{game.date}</td>
                              <td className="py-3 text-white">{game.opponent}</td>
                              <td className="py-3">
                                <span className={game.result === "W" ? "text-green-400" : "text-red-400"}>
                                  {game.result} {game.score}
                                </span>
                              </td>
                              <td className="py-3 text-white font-semibold">{game.stat}</td>
                              <td className="py-3">
                                {game.hit ? (
                                  <span className="text-green-400 text-xl">✓</span>
                                ) : (
                                  <span className="text-red-400 text-xl">✗</span>
                                )}
                              </td>
                              <td className="py-3 text-slate-400">{game.minutes} min</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      <Link to="/workstation" className="flex-1">
                        <Button className="w-full" variant="outline">
                          View Full Research
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                        Add to Bet Slip
                      </Button>
                    </div>
                  </div>
                )}
              </AppCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
