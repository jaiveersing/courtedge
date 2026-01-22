import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { 
  Search, Filter, TrendingUp, TrendingDown, X, Calendar, Star, Flame, Target, 
  BarChart3, Activity, Info, RefreshCw, Download, Share2, Bookmark, AlertCircle, 
  CheckCircle2, XCircle, Clock, MapPin, Percent, DollarSign, Grid, List, 
  Maximize2, Users, Shield, Zap, Wifi, WifiOff, LineChart, Plus, Minus, 
  Bell, Eye, Save, ChevronLeft, ChevronRight, Brain, Sparkles,
  ArrowUpRight, ArrowDownRight, Settings, Layers, Signal, Database,
  GitCompare, SortAsc, SortDesc, History, RotateCcw, ChevronDown,
  ExternalLink, Home, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Badge } from '../Components/ui/badge';
import { AppCard } from "@/Components/ui/AppCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import mlService from '../src/api/mlService';
import PlayersAPI from '../src/api/playersApi';


// ==================== THEME-AWARE DESIGN SYSTEM ====================
const useDesignSystem = () => {
  const { theme } = useTheme();
  return {
    bg: theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
    bgCard: theme === 'dark' ? 'bg-white/[0.02]' : 'bg-white/90',
    bgCardAlt: theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100/80',
    border: theme === 'dark' ? 'border-white/[0.05]' : 'border-slate-200',
    borderAccent: theme === 'dark' ? 'border-white/10' : 'border-slate-300',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    hover: theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100',
    input: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    inputBorder: theme === 'dark' ? 'border-white/10' : 'border-slate-300',
    chartGrid: theme === 'dark' ? '#334155' : '#e2e8f0',
    chartText: theme === 'dark' ? '#94a3b8' : '#64748b',
    theme
  };
};

// ==================== HELPER FUNCTIONS ====================


const calculateAdvancedStats = (games, propType, line) => {
  if (!games || games.length === 0) return null;
  
  const values = games.map(g => {
    switch(propType.toLowerCase()) {
      case 'points': return g.pts || 0;
      case 'rebounds': return g.reb || 0;
      case 'assists': return g.ast || 0;
      case 'pts+reb+ast': return (g.pts || 0) + (g.reb || 0) + (g.ast || 0);
      case '3pt made': return g.threesMade || 0;
      case 'steals': return g.stl || 0;
      case 'blocks': return g.blk || 0;
      default: return g.pts || 0;
    }
  });
  
  const hits = values.filter(v => v >= line).length;
  const hitRate = (hits / values.length * 100).toFixed(1);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const stdDev = Math.sqrt(values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b) / values.length).toFixed(1);
  
  // Trend calculation
  const recent5 = values.slice(-5);
  const earlier5 = values.slice(-10, -5);
  const recentAvg = recent5.reduce((a, b) => a + b, 0) / 5;
  const earlierAvg = earlier5.length > 0 ? earlier5.reduce((a, b) => a + b, 0) / earlier5.length : recentAvg;
  const trendDirection = recentAvg > earlierAvg ? 'Upward' : recentAvg < earlierAvg ? 'Downward' : 'Stable';
  const trendStrength = Math.abs(recentAvg - earlierAvg).toFixed(1);
  
  // Streak calculation
  let currentStreak = 0;
  let streakType = 'None';
  for (let i = values.length - 1; i >= 0; i--) {
    if (i === values.length - 1) {
      streakType = values[i] >= line ? 'Over' : 'Under';
      currentStreak = 1;
    } else {
      const isOver = values[i] >= line;
      if ((streakType === 'Over' && isOver) || (streakType === 'Under' && !isOver)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return {
    hitRate,
    hits,
    total: values.length,
    avg,
    median,
    max,
    min,
    stdDev,
    range: `${min} - ${max}`,
    trendDirection,
    trendStrength,
    currentStreak,
    streakType,
    values
  };
};

const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-green-400';
  if (confidence >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

const getConfidenceBg = (confidence) => {
  if (confidence >= 80) return 'bg-green-500/20 border-green-500/40';
  if (confidence >= 60) return 'bg-yellow-500/20 border-yellow-500/40';
  return 'bg-red-500/20 border-red-500/40';
};

const generateMockGameData = (player, gameCount = 15) => {
  const games = [];
  const baseValue = player.ppg || 20;
  
  for (let i = 0; i < gameCount; i++) {
    const variance = (Math.random() - 0.5) * 10;
    games.push({
      date: new Date(Date.now() - (gameCount - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}),
      opp: ['GSW', 'LAC', 'PHX', 'DEN', 'DAL'][Math.floor(Math.random() * 5)],
      pts: Math.max(0, Math.round(baseValue + variance)),
      reb: Math.max(0, Math.round((player.rpg || 5) + (Math.random() - 0.5) * 3)),
      ast: Math.max(0, Math.round((player.apg || 4) + (Math.random() - 0.5) * 3)),
      stl: Math.max(0, Math.round((player.spg || 1) + (Math.random() - 0.5) * 0.5)),
      blk: Math.max(0, Math.round((player.bpg || 0.5) + (Math.random() - 0.5) * 0.5)),
      threesMade: Math.max(0, Math.round((player.tpm || 2) + (Math.random() - 0.5) * 2)),
      mins: Math.max(0, Math.round((player.mpg || 30) + (Math.random() - 0.5) * 5)),
      fg: `${Math.floor(Math.random() * 10 + 5)}/${Math.floor(Math.random() * 10 + 15)}`,
      result: Math.random() > 0.5 ? 'W' : 'L'
    });
  }
  
  return games;
};

// ==================== MAIN COMPONENT ====================

export default function Workstation() {
  // Theme System
  const ds = useDesignSystem();
  
  // State Management
  const [allPlayers, setAllPlayers] = useState([]);

  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [selectedProp, setSelectedProp] = useState('points');
  const [customLine, setCustomLine] = useState(25.5);
  const [timeRange, setTimeRange] = useState('last_15');
  const [splitType, setSplitType] = useState('all');
  const [showMLPredictions, setShowMLPredictions] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const [mlPrediction, setMlPrediction] = useState(null);
  const [gameData, setGameData] = useState([]);
  
  // Prop type options
  const propTypes = [
    { value: 'points', label: 'Points', icon: Target },
    { value: 'rebounds', label: 'Rebounds', icon: Activity },
    { value: 'assists', label: 'Assists', icon: Users },
    { value: 'pts+reb+ast', label: 'Pts+Reb+Ast', icon: Flame },
    { value: '3pt made', label: '3PT Made', icon: TrendingUp },
    { value: 'steals', label: 'Steals', icon: Shield },
    { value: 'blocks', label: 'Blocks', icon: Shield }
  ];
  
  // Load all players from database
  useEffect(() => {
    loadAllPlayers();
  }, []);
  
  const loadAllPlayers = async () => {
    try {
      setLoading(true);
      const response = await PlayersAPI.getPlayers();
      // Handle both array and object with data property
      const players = Array.isArray(response) ? response : (response?.data || response?.players || []);
      
      if (Array.isArray(players) && players.length > 0) {
        setAllPlayers(players);
        setFilteredPlayers(players.slice(0, 50));
        handlePlayerSelect(players[0]);
      } else {
        console.warn('No players found, using fallback');
        setAllPlayers([]);
        setFilteredPlayers([]);
      }
    } catch (error) {
      console.error('Error loading players:', error);
      setAllPlayers([]);
      setFilteredPlayers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Search filter
  useEffect(() => {
    if (!Array.isArray(allPlayers)) return;
    
    if (searchQuery.trim() === '') {
      setFilteredPlayers(allPlayers.slice(0, 50));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allPlayers.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.team?.toLowerCase().includes(query) ||
        p.position?.toLowerCase().includes(query)
      ).slice(0, 30);
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, allPlayers]);
  
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setSearchQuery(player.name);
    setShowPlayerDropdown(false);
    
    // Generate game data
    const games = generateMockGameData(player);
    setGameData(games);
    
    // Set default line based on prop type
    const avgValue = {
      'points': player.ppg || 20,
      'rebounds': player.rpg || 7,
      'assists': player.apg || 5,
      'pts+reb+ast': (player.ppg || 20) + (player.rpg || 7) + (player.apg || 5),
      '3pt made': player.tpm || 2,
      'steals': player.spg || 1,
      'blocks': player.bpg || 0.5
    };
    setCustomLine(avgValue[selectedProp] || 20);
    
    // Fetch ML prediction
    fetchMLPrediction(player);
  };
  
  const fetchMLPrediction = async (player) => {
    try {
      const prediction = await mlService.getPrediction({
        player_name: player.name,
        prop_type: selectedProp,
        line: customLine
      });
      setMlPrediction(prediction);
    } catch (error) {
      console.error('ML prediction error:', error);
    }
  };
  
  // Calculate stats based on selected prop and line
  const stats = useMemo(() => {
    if (!gameData.length) return null;
    return calculateAdvancedStats(gameData, selectedProp, customLine);
  }, [gameData, selectedProp, customLine]);
  
  // Chart data
  const chartData = useMemo(() => {
    if (!gameData.length) return [];
    
    return gameData.slice(-10).map((game, idx) => {
      let value;
      switch(selectedProp.toLowerCase()) {
        case 'points': value = game.pts; break;
        case 'rebounds': value = game.reb; break;
        case 'assists': value = game.ast; break;
        case 'pts+reb+ast': value = game.pts + game.reb + game.ast; break;
        case '3pt made': value = game.threesMade; break;
        case 'steals': value = game.stl; break;
        case 'blocks': value = game.blk; break;
        default: value = game.pts;
      }
      
      return {
        game: `G${idx + 1}`,
        value,
        line: customLine,
        hit: value >= customLine,
        date: game.date,
        opponent: game.opp,
        result: game.result
      };
    });
  }, [gameData, selectedProp, customLine]);

  if (loading) {
    return (
      <div className={`min-h-screen ${ds.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={ds.textMuted}>Loading players database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${ds.bg} p-6`}>
      <div className="max-w-[1920px] mx-auto">
        
        {/* ==================== HEADER ==================== */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${ds.text} mb-2`}>🎯 Elite Workstation</h1>
              <p className={ds.textMuted}>Advanced Player Props Analysis & Research Lab</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 px-4 py-2 flex items-center gap-2">
                <Signal className="w-4 h-4 animate-pulse" />
                {allPlayers.length} Players
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Live Data
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                className={`${ds.borderAccent} ${ds.hover}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className={`${ds.borderAccent} ${ds.hover}`}
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* ==================== LEFT SIDEBAR - Player Search & Selection ==================== */}
          <div className="col-span-3 space-y-4">
            
            {/* Player Search */}
            <AppCard className={`${ds.bgCard} ${ds.border}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                  <Search className="w-5 h-5 text-purple-400" />
                  Search Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowPlayerDropdown(true);
                    }}
                    onFocus={() => setShowPlayerDropdown(true)}
                    placeholder="Search by name, team, position..."
                    className={`${ds.input} ${ds.inputBorder} ${ds.text} pl-10`}
                  />
                  <Search className={`w-4 h-4 ${ds.textMuted} absolute left-3 top-3`} />
                  
                  {showPlayerDropdown && filteredPlayers.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 mt-2 ${ds.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg max-h-96 overflow-y-auto z-50 shadow-xl`}>
                      {filteredPlayers.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => handlePlayerSelect(player)}
                          className={`w-full px-4 py-3 text-left ${ds.theme === 'dark' ? 'hover:bg-slate-700 border-slate-700/50' : 'hover:bg-slate-100 border-slate-200'} transition-colors border-b last:border-0`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`${ds.text} font-semibold`}>{player.name}</p>
                              <p className={`text-xs ${ds.textMuted}`}>{player.team} • {player.position}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-purple-400">{player.ppg} PPG</p>
                              <p className={`text-xs ${ds.textMuted}`}>{player.gamesPlayed} GP</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedPlayer && (
                  <div className={`mt-4 p-4 ${ds.bgCardAlt} rounded-lg border ${ds.border}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {selectedPlayer.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className={`${ds.text} font-bold`}>{selectedPlayer.name}</h3>
                        <p className={`text-xs ${ds.textMuted}`}>{selectedPlayer.team} • {selectedPlayer.position}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`text-center p-2 ${ds.theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded`}>
                        <p className={`text-xs ${ds.textMuted}`}>PPG</p>
                        <p className={`text-sm font-bold ${ds.text}`}>{selectedPlayer.ppg}</p>
                      </div>
                      <div className={`text-center p-2 ${ds.theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded`}>
                        <p className={`text-xs ${ds.textMuted}`}>RPG</p>
                        <p className={`text-sm font-bold ${ds.text}`}>{selectedPlayer.rpg}</p>
                      </div>
                      <div className={`text-center p-2 ${ds.theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded`}>
                        <p className={`text-xs ${ds.textMuted}`}>APG</p>
                        <p className={`text-sm font-bold ${ds.text}`}>{selectedPlayer.apg}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </AppCard>
            
            {/* Prop Type Selection */}
            <AppCard className={`${ds.bgCard} ${ds.border}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                  <Target className="w-5 h-5 text-purple-400" />
                  Select Prop
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {propTypes.map((prop) => (
                  <button
                    key={prop.value}
                    onClick={() => {
                      setSelectedProp(prop.value);
                      if (selectedPlayer) {
                        const avgValue = {
                          'points': selectedPlayer.ppg || 20,
                          'rebounds': selectedPlayer.rpg || 7,
                          'assists': selectedPlayer.apg || 5,
                          'pts+reb+ast': (selectedPlayer.ppg || 20) + (selectedPlayer.rpg || 7) + (selectedPlayer.apg || 5),
                          '3pt made': selectedPlayer.tpm || 2,
                          'steals': selectedPlayer.spg || 1,
                          'blocks': selectedPlayer.bpg || 0.5
                        };
                        setCustomLine(avgValue[prop.value] || 20);
                      }
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedProp === prop.value
                        ? 'border-purple-500 bg-purple-500/20'
                        : ds.theme === 'dark' 
                          ? 'border-slate-700 bg-slate-800/30 hover:border-slate-600' 
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <prop.icon className={`w-5 h-5 ${selectedProp === prop.value ? 'text-purple-400' : ds.textMuted}`} />
                      <span className={`text-sm font-semibold ${selectedProp === prop.value ? ds.text : ds.textSecondary}`}>
                        {prop.label}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </AppCard>
            
            {/* Line Adjustment */}
            <AppCard className={`${ds.bgCard} ${ds.border}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                  <Settings className="w-5 h-5 text-blue-400" />
                  Line Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className={`text-sm ${ds.textMuted} mb-2`}>Current Line</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${ds.theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-100'}`}
                      onClick={() => setCustomLine(Math.max(0, customLine - 0.5))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={customLine}
                      onChange={(e) => setCustomLine(parseFloat(e.target.value))}
                      className={`w-20 text-center text-xl font-bold ${ds.theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} ${ds.text}`}
                      step="0.5"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${ds.theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-100'}`}
                      onClick={() => setCustomLine(customLine + 0.5)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm ${ds.textMuted}`}>Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className={`${ds.theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} ${ds.text}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${ds.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <SelectItem value="last_7">Last 7 Games</SelectItem>
                      <SelectItem value="last_10">Last 10 Games</SelectItem>
                      <SelectItem value="last_15">Last 15 Games</SelectItem>
                      <SelectItem value="season">Full Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </AppCard>
          </div>
          
          {/* ==================== CENTER - Main Analytics ==================== */}
          <div className="col-span-6 space-y-4">
            
            {selectedPlayer ? (
              <>
                {/* Performance Chart */}
                <AppCard className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-xl ${ds.text} flex items-center gap-2`}>
                        <Activity className="w-6 h-6 text-purple-400" />
                        Performance Analysis
                      </CardTitle>
                      {stats && (
                        <div className="flex items-center gap-2">
                          <Badge className={`${getConfidenceBg(stats.hitRate)} px-4 py-2`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {stats.hitRate}% Hit Rate
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
                            {stats.hits}/{stats.total} Games
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} opacity={0.1} />
                          <XAxis dataKey="game" stroke={ds.chartText} fontSize={12} />
                          <YAxis stroke={ds.chartText} fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: ds.theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                              border: ds.theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                              borderRadius: '8px',
                              color: ds.theme === 'dark' ? '#fff' : '#1e293b'
                            }}
                          />
                          <Legend />
                          <ReferenceLine 
                            y={customLine} 
                            stroke="#a855f7" 
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{ value: `Line: ${customLine}`, position: 'right', fill: '#a855f7' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            name="Performance"
                          />
                          <Bar dataKey="value" fill="#8b5cf6" opacity={0.6} radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.hit ? '#22c55e' : '#ef4444'} />
                            ))}
                          </Bar>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Stats Grid */}
                    {stats && (
                      <div className="grid grid-cols-6 gap-3">
                        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg">
                          <p className="text-xs text-blue-400/60 mb-1">Average</p>
                          <p className="text-xl font-bold text-blue-400">{stats.avg}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-lg">
                          <p className="text-xs text-green-400/60 mb-1">Median</p>
                          <p className="text-xl font-bold text-green-400">{stats.median}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg">
                          <p className="text-xs text-purple-400/60 mb-1">Max</p>
                          <p className="text-xl font-bold text-purple-400">{stats.max}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-lg">
                          <p className="text-xs text-orange-400/60 mb-1">Min</p>
                          <p className="text-xl font-bold text-orange-400">{stats.min}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-lg">
                          <p className="text-xs text-yellow-400/60 mb-1">Std Dev</p>
                          <p className="text-xl font-bold text-yellow-400">{stats.stdDev}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20 rounded-lg">
                          <p className="text-xs text-rose-400/60 mb-1">Streak</p>
                          <p className="text-xl font-bold text-rose-400">{stats.currentStreak}{stats.streakType === 'Over' ? '↑' : '↓'}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </AppCard>
                
                {/* Game Log */}
                <AppCard className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <CardTitle className={`text-xl ${ds.text} flex items-center gap-2`}>
                      <History className="w-6 h-6 text-blue-400" />
                      Game Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`text-left text-xs ${ds.textMuted} border-b ${ds.border}`}>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Opp</th>
                            <th className="pb-3 font-medium">Result</th>
                            <th className="pb-3 font-medium">Value</th>
                            <th className="pb-3 font-medium">Hit</th>
                            <th className="pb-3 font-medium">Mins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameData.slice(-10).reverse().map((game, idx) => {
                            let value;
                            switch(selectedProp.toLowerCase()) {
                              case 'points': value = game.pts; break;
                              case 'rebounds': value = game.reb; break;
                              case 'assists': value = game.ast; break;
                              case 'pts+reb+ast': value = game.pts + game.reb + game.ast; break;
                              case '3pt made': value = game.threesMade; break;
                              case 'steals': value = game.stl; break;
                              case 'blocks': value = game.blk; break;
                              default: value = game.pts;
                            }
                            const hit = value >= customLine;
                            
                            return (
                              <tr key={idx} className={`border-b ${ds.theme === 'dark' ? 'border-slate-800/50 hover:bg-slate-700/30' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
                                <td className={`py-3 text-sm ${ds.text}`}>{game.date}</td>
                                <td className={`py-3 text-sm ${ds.text}`}>{game.opp}</td>
                                <td className="py-3">
                                  <Badge className={game.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                    {game.result}
                                  </Badge>
                                </td>
                                <td className="py-3">
                                  <span className={`text-sm font-semibold ${hit ? 'text-green-400' : 'text-red-400'}`}>
                                    {value}
                                  </span>
                                </td>
                                <td className="py-3">
                                  {hit ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                  )}
                                </td>
                                <td className={`py-3 text-sm ${ds.textMuted}`}>{game.mins}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </AppCard>
              </>
            ) : (
              <AppCard className={`${ds.bgCard} ${ds.border} h-96 flex items-center justify-center`}>
                <div className="text-center">
                  <Search className={`w-16 h-16 ${ds.theme === 'dark' ? 'text-slate-600' : 'text-slate-400'} mx-auto mb-4`} />
                  <p className={`text-xl ${ds.textMuted}`}>Select a player to begin analysis</p>
                  <p className={`text-sm ${ds.theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} mt-2`}>Search from {allPlayers.length} NBA players</p>
                </div>
              </AppCard>
            )}
          </div>
          
          {/* ==================== RIGHT SIDEBAR - Insights & Actions ==================== */}
          <div className="col-span-3 space-y-4">
            
            {selectedPlayer && stats && (
              <>
                {/* Quick Stats */}
                <AppCard className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className={`flex items-center justify-between p-3 ${ds.bgCardAlt} rounded-lg`}>
                      <span className={`text-sm ${ds.textMuted}`}>Hit Rate</span>
                      <span className={`text-lg font-bold ${getConfidenceColor(stats.hitRate)}`}>{stats.hitRate}%</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 ${ds.bgCardAlt} rounded-lg`}>
                      <span className={`text-sm ${ds.textMuted}`}>Trend</span>
                      <span className={`text-lg font-bold ${stats.trendDirection === 'Upward' ? 'text-green-400' : stats.trendDirection === 'Downward' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {stats.trendDirection}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between p-3 ${ds.bgCardAlt} rounded-lg`}>
                      <span className={`text-sm ${ds.textMuted}`}>Current Streak</span>
                      <span className="text-lg font-bold text-purple-400">{stats.currentStreak} {stats.streakType}</span>
                    </div>
                  </CardContent>
                </AppCard>
                
                {/* ML Predictions */}
                {showMLPredictions && mlPrediction && (
                  <AppCard className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                        <Brain className="w-5 h-5 text-purple-400" />
                        AI Prediction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <p className="text-sm text-purple-300 mb-2">Predicted Value</p>
                          <p className="text-3xl font-bold text-purple-400">{mlPrediction.predicted_value}</p>
                        </div>
                        <div className={`flex items-center justify-between p-3 ${ds.bgCardAlt} rounded-lg`}>
                          <span className={`text-sm ${ds.textMuted}`}>Confidence</span>
                          <span className="text-lg font-bold text-blue-400">{mlPrediction.confidence}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </AppCard>
                )}
                
                {/* Quick Actions */}
                <AppCard className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${ds.text} flex items-center gap-2`}>
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Bet Slip
                    </Button>
                    <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Analysis
                    </Button>
                    <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </CardContent>
                </AppCard>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
