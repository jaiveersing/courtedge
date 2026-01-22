import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import mlService from '@/src/api/mlService';
import { 
  TrendingUp, 
  TrendingDown,
  Home,
  Plane,
  Zap,
  Target,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  Minus,
  ArrowLeft,
  Users,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import nbaApi from '@/src/api/nbaApi';

const TrendCard = ({ trend, index }) => {
  const getIcon = (type) => {
    if (type === 'home') return Home;
    if (type === 'away') return Plane;
    return Zap;
  };

  const Icon = getIcon(trend.type);
  
  return (
    <div className="flex items-center justify-between p-5 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all border border-white/5 hover:border-white/10 group">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/5">
          <img src={trend.teamLogo} alt={trend.team} className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{trend.player}</span>
            <span className="text-slate-400 text-sm">vs {trend.opponent}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-300 text-sm">{trend.stat}</span>
            <span className="text-slate-500 text-xs">{trend.odds}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-400">• {trend.hitRate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {trend.type === 'home' && (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-400" />
          </div>
        )}
        {trend.type === 'away' && (
          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Plane className="w-4 h-4 text-purple-400" />
          </div>
        )}
        {trend.type === 'hot' && (
          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
        )}
        <div className="text-right">
          <div className="text-lg font-bold text-white">{trend.hitPercentage}</div>
        </div>
      </div>
    </div>
  );
};

const GameLogRow = ({ game }) => {
  const isWin = game.result.startsWith('W');
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-5 py-4 text-slate-400 text-sm">{game.date}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <img src={game.opponentLogo} alt={game.opponent} className="w-6 h-6" />
          <span className="text-white font-medium">{game.opponent}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-sm font-medium ${isWin ? 'text-green-400' : 'text-red-400'}`}>
          {game.result}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {game.hit ? (
          <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
        )}
      </td>
      <td className="px-4 py-3 text-center text-white font-semibold">{game.points}</td>
      <td className="px-4 py-3 text-center text-white font-semibold">{game.assists}</td>
      <td className="px-4 py-3 text-center text-white font-semibold">{game.rebounds}</td>
    </tr>
  );
};

const WorkstationPanel = ({ player, stat, line, recentGames = [] }) => {
  const [selectedBetType, setSelectedBetType] = useState('Points');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 10');
  const [selectedSplit, setSelectedSplit] = useState('Home+Away');
  const [currentLine, setCurrentLine] = useState(line || 25.5);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  
  // Generate chart data based on player stats or recent games
  const chartData = recentGames.length > 0
    ? recentGames.slice(0, 10).map((game, i) => ({
        game: i + 1,
        value: game.points || Math.floor(Math.random() * 15 + 15)
      }))
    : Array.from({ length: 10 }, (_, i) => ({
        game: i + 1,
        value: Math.floor(Math.random() * 15 + 15)
      }));

  // Calculate over/under based on actual line
  const overCount = chartData.filter(g => g.value > currentLine).length;
  const underCount = chartData.length - overCount;
  const overRate = Math.round((overCount / chartData.length) * 100);
  const underRate = 100 - overRate;
  
  // Get ML prediction when line or bet type changes
  useEffect(() => {
    const getPrediction = async () => {
      if (!player) return;
      
      setLoadingPrediction(true);
      try {
        const prediction = await mlService.predictPlayerProp({
          player_name: `${player.first_name} ${player.last_name}`,
          prop_type: selectedBetType.toLowerCase(),
          line: currentLine,
          opponent: 'BOS',
          home_away: 'home'
        });
        setMlPrediction(prediction);
      } catch (error) {
        console.error('ML prediction error:', error);
      }
      setLoadingPrediction(false);
    };
    
    getPrediction();
  }, [player, selectedBetType, currentLine]);

  return (
    <div className="space-y-6">
      {/* Bet Configuration */}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Bet Type</label>
          <select 
            value={selectedBetType}
            onChange={(e) => setSelectedBetType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option>1Q Points</option>
            <option>Points</option>
            <option>Assists</option>
            <option>Rebounds</option>
            <option>PTS+AST</option>
            <option>PTS+REB</option>
            <option>PTS+AST+REB</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-2">Timeframe</label>
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option>Last 10</option>
            <option>Last 20</option>
            <option>Season</option>
            <option>L2L</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-2">Split</label>
          <select 
            value={selectedSplit}
            onChange={(e) => setSelectedSplit(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option>Home+Away</option>
            <option>Home Only</option>
            <option>Away Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-2">With/Without</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option>All</option>
            <option>With [Player]</option>
            <option>Without [Player]</option>
          </select>
        </div>
      </div>

      {/* Performance Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="game" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <ReferenceLine y={currentLine} stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" label={{ value: `Line: ${currentLine}`, fill: '#3b82f6', position: 'right' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > currentLine ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Line Control */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="w-10 h-10 p-0 border-slate-600"
              onClick={() => setCurrentLine(Math.max(0.5, currentLine - 0.5))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Line</div>
              <div className="text-2xl font-bold text-white">{currentLine.toFixed(1)}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="w-10 h-10 p-0 border-slate-600"
              onClick={() => setCurrentLine(currentLine + 0.5)}
            >
              +
            </Button>
          </div>
          
          {/* ML Prediction */}
          {mlPrediction && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">AI Prediction</div>
                  <div className="text-xl font-bold text-white">
                    {mlPrediction.predicted_value?.toFixed(1)} {selectedBetType}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Confidence</div>
                  <div className={`text-xl font-bold ${
                    mlPrediction.confidence > 70 ? 'text-green-400' :
                    mlPrediction.confidence > 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {mlPrediction.confidence?.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-slate-400">Recommendation: </span>
                <span className={`font-semibold ${
                  mlPrediction.recommendation === 'over' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {mlPrediction.recommendation?.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Over/Under Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-red-400 mb-2">{underRate}%</div>
            <div className="text-slate-400 mb-4">Under</div>
            <div className="text-2xl font-bold text-white">{underCount}/{overCount + underCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{overRate}%</div>
            <div className="text-slate-400 mb-4">Over</div>
            <div className="text-2xl font-bold text-white">{overCount}/{overCount + underCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Season Stats Summary */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Season Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{player.points_per_game?.toFixed(1) || '24.5'}</div>
              <div className="text-sm text-slate-400">PPG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{player.rebounds_per_game?.toFixed(1) || '5.2'}</div>
              <div className="text-sm text-slate-400">RPG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{player.assists_per_game?.toFixed(1) || '7.8'}</div>
              <div className="text-sm text-slate-400">APG</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{((player.field_goal_percentage || 0.472) * 100).toFixed(1)}%</div>
              <div className="text-sm text-slate-400">FG%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function PlayerPropBettingPage() {
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState('trends');
  const [player, setPlayer] = useState(null);
  const [trends, setTrends] = useState([]);
  const [gameLogs, setGameLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerData();
  }, [playerId]);

  const loadPlayerData = async () => {
    setLoading(true);
    try {
      // Load player data
      const players = await nbaApi.getAllPlayers();
      const playerData = players.find(p => p.id === parseInt(playerId));
      
      if (playerData) {
        setPlayer(playerData);
        
        // Generate trend data
        const trendData = [
          {
            id: 1,
            player: `${playerData.first_name} ${playerData.last_name}`,
            team: playerData.team?.abbreviation || 'MIN',
            opponent: 'BOS',
            stat: 'Over 5.5 1Q Points',
            odds: '-125',
            hitRate: 'Hit in 6 of last 6 home games',
            hitPercentage: '100%',
            type: 'home',
            teamLogo: 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg'
          },
          {
            id: 2,
            player: `${playerData.first_name} ${playerData.last_name}`,
            team: playerData.team?.abbreviation || 'MIN',
            opponent: 'BOS',
            stat: 'Over 26.5 PTS+AST',
            odds: '-118',
            hitRate: 'Hit in 7 of last 8 home games',
            hitPercentage: '88%',
            type: 'hot',
            teamLogo: 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg'
          }
        ];
        setTrends(trendData);
        
        // Generate game log data with realistic variation
        const baseStats = {
          points: playerData.points_per_game || 20,
          assists: playerData.assists_per_game || 5,
          rebounds: playerData.rebounds_per_game || 6
        };
        
        const gameLogData = Array.from({ length: 10 }, (_, i) => {
          const variance = () => (Math.random() - 0.5) * 0.4; // +/- 20% variance
          const pts = Math.round(baseStats.points * (1 + variance()));
          const ast = Math.round(baseStats.assists * (1 + variance()));
          const reb = Math.round(baseStats.rebounds * (1 + variance()));
          
          return {
            date: `11/${27 - i}/25`,
            opponent: ['OKC', 'SAC', 'PHX', 'WAS', 'DAL', 'LAL', 'DEN', 'UTA', 'POR', 'GSW'][i],
            opponentLogo: 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg',
            result: Math.random() > 0.4 ? `W · ${105 + Math.floor(Math.random() * 20)}-${95 + Math.floor(Math.random() * 15)}` : `L · ${95 + Math.floor(Math.random() * 15)}-${105 + Math.floor(Math.random() * 20)}`,
            hit: pts > 25.5, // Check if hit the line
            points: pts,
            assists: ast,
            rebounds: reb
          };
        });
        setGameLogs(gameLogData);
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Player not found</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <img 
                src={`https://cdn.nba.com/logos/nba/${player.team?.id || '1610612750'}/global/L/logo.svg`}
                alt={player.team?.abbreviation}
                className="w-16 h-16"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{player.first_name} {player.last_name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-slate-400">vs BOS</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {player.position}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  #{player.number || Math.floor(Math.random() * 50)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700 mb-6">
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500">
              <Activity className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="workstation" className="data-[state=active]:bg-blue-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Workstation
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-500">
              <Calendar className="w-4 h-4 mr-2" />
              Game Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" className="bg-blue-500 text-white border-blue-500">
                Player
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600">
                Team
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600">
                Parlay
              </Button>
              <div className="flex-1"></div>
              <Button variant="outline" size="sm" className="border-slate-600">
                Filters
              </Button>
            </div>
            
            <div className="space-y-3">
              {trends.map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workstation">
            <WorkstationPanel 
              player={player}
              stat="Points"
              line={player.points_per_game || 25.5}
              recentGames={gameLogs}
            />
          </TabsContent>

          <TabsContent value="details">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Games Played
                </CardTitle>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-blue-500">All</Button>
                  <Button size="sm" variant="outline" className="border-slate-600">Last 10</Button>
                  <Button size="sm" variant="outline" className="border-slate-600">Head to Head</Button>
                  <Button size="sm" variant="outline" className="border-slate-600">Home Splits</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-slate-400 font-medium">DATE</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-medium">OPPONENT</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-medium">RESULT</th>
                        <th className="px-4 py-3 text-center text-slate-400 font-medium">HIT</th>
                        <th className="px-4 py-3 text-center text-slate-400 font-medium">1Q PTS</th>
                        <th className="px-4 py-3 text-center text-slate-400 font-medium">1Q AST</th>
                        <th className="px-4 py-3 text-center text-slate-400 font-medium">1Q REB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameLogs.map((game, index) => (
                        <GameLogRow key={index} game={game} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
