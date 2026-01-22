import { useState, useMemo, useCallback } from 'react';
import { 
  Search, TrendingUp, TrendingDown, X, Calendar, Star, Flame, Target, 
  BarChart3, Activity, RefreshCw, Bookmark, AlertCircle, 
  CheckCircle2, XCircle, Clock, DollarSign, 
  Users, Shield, Zap, Brain, Sparkles,
  ChevronDown, ChevronUp, Filter, Trophy, Award, Timer,
  ArrowUp, ArrowDown, Minus, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Badge } from '../Components/ui/badge';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ReferenceLine, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Bar, Area
} from 'recharts';
import { useTheme } from '../src/contexts/ThemeContext';

// Player Database
const PLAYERS_DATABASE = [
  { 
    id: 1, name: 'LeBron James', team: 'LAL', teamFull: 'Los Angeles Lakers',
    position: 'SF', number: 23, opponent: 'vs GSW', gameTime: '7:30 PM',
    isHome: true, status: 'Active', image: 'LJ',
    seasonStats: { ppg: 27.3, rpg: 7.8, apg: 8.9, spg: 1.2, bpg: 0.8, fgPct: 52.1, threePct: 38.5, ftPct: 73.2, mpg: 35.2, gamesPlayed: 45 },
    props: [
      { type: 'Points', line: 25.5, hitRate: 87, avg: 27.3, overOdds: -115, underOdds: -105, trend: 'hot' },
      { type: 'Rebounds', line: 7.5, hitRate: 68, avg: 7.8, overOdds: -110, underOdds: -110, trend: 'neutral' },
      { type: 'Assists', line: 8.5, hitRate: 72, avg: 8.9, overOdds: -120, underOdds: +100, trend: 'hot' },
      { type: 'PRA', line: 43.5, hitRate: 85, avg: 44.0, overOdds: -125, underOdds: +105, trend: 'hot' },
      { type: '3PT Made', line: 2.5, hitRate: 58, avg: 2.4, overOdds: +115, underOdds: -135, trend: 'cold' },
    ],
    last10Games: [
      { date: 'Jan 20', opp: 'GSW', pts: 28, reb: 8, ast: 11, pra: 47, result: 'W', mins: 36 },
      { date: 'Jan 18', opp: 'SAC', pts: 31, reb: 7, ast: 9, pra: 47, result: 'W', mins: 38 },
      { date: 'Jan 16', opp: 'PHX', pts: 22, reb: 5, ast: 12, pra: 39, result: 'L', mins: 34 },
      { date: 'Jan 14', opp: 'LAC', pts: 29, reb: 9, ast: 8, pra: 46, result: 'W', mins: 37 },
      { date: 'Jan 12', opp: 'MEM', pts: 26, reb: 6, ast: 10, pra: 42, result: 'W', mins: 35 },
      { date: 'Jan 10', opp: 'DEN', pts: 24, reb: 7, ast: 11, pra: 42, result: 'L', mins: 36 },
      { date: 'Jan 08', opp: 'DAL', pts: 29, reb: 8, ast: 9, pra: 46, result: 'W', mins: 38 },
      { date: 'Jan 06', opp: 'POR', pts: 31, reb: 9, ast: 7, pra: 47, result: 'W', mins: 37 },
      { date: 'Jan 04', opp: 'UTA', pts: 27, reb: 6, ast: 10, pra: 43, result: 'W', mins: 35 },
      { date: 'Jan 02', opp: 'MIN', pts: 24, reb: 7, ast: 8, pra: 39, result: 'L', mins: 34 },
    ],
    vsOpponent: { games: 12, avgPts: 29.2, overRate: 83, record: '8-4' },
    mlPrediction: { value: 28.3, confidence: 92, edge: 2.8, recommendation: 'OVER' },
    market: { publicOver: 68, sharpOver: 82, lineMovement: -0.5 }
  },
  { 
    id: 2, name: 'Stephen Curry', team: 'GSW', teamFull: 'Golden State Warriors',
    position: 'PG', number: 30, opponent: '@ LAL', gameTime: '7:30 PM',
    isHome: false, status: 'Active', image: 'SC',
    seasonStats: { ppg: 29.1, rpg: 4.5, apg: 6.2, spg: 0.9, bpg: 0.3, fgPct: 47.8, threePct: 42.1, ftPct: 91.2, mpg: 34.8, gamesPlayed: 42 },
    props: [
      { type: 'Points', line: 28.5, hitRate: 62, avg: 29.1, overOdds: -105, underOdds: -115, trend: 'neutral' },
      { type: 'Rebounds', line: 4.5, hitRate: 55, avg: 4.5, overOdds: -110, underOdds: -110, trend: 'neutral' },
      { type: 'Assists', line: 5.5, hitRate: 68, avg: 6.2, overOdds: -115, underOdds: -105, trend: 'hot' },
      { type: 'PRA', line: 38.5, hitRate: 72, avg: 39.8, overOdds: -120, underOdds: +100, trend: 'hot' },
      { type: '3PT Made', line: 5.5, hitRate: 52, avg: 5.2, overOdds: +105, underOdds: -125, trend: 'neutral' },
    ],
    last10Games: [
      { date: 'Jan 20', opp: 'LAL', pts: 32, reb: 5, ast: 7, pra: 44, result: 'L', mins: 36 },
      { date: 'Jan 18', opp: 'PHX', pts: 28, reb: 4, ast: 8, pra: 40, result: 'W', mins: 35 },
      { date: 'Jan 16', opp: 'SAC', pts: 35, reb: 3, ast: 5, pra: 43, result: 'W', mins: 37 },
      { date: 'Jan 14', opp: 'DEN', pts: 25, reb: 6, ast: 6, pra: 37, result: 'L', mins: 34 },
      { date: 'Jan 12', opp: 'OKC', pts: 30, reb: 4, ast: 7, pra: 41, result: 'W', mins: 36 },
      { date: 'Jan 10', opp: 'HOU', pts: 27, reb: 5, ast: 5, pra: 37, result: 'W', mins: 35 },
      { date: 'Jan 08', opp: 'MEM', pts: 33, reb: 4, ast: 8, pra: 45, result: 'W', mins: 38 },
      { date: 'Jan 06', opp: 'MIN', pts: 26, reb: 3, ast: 6, pra: 35, result: 'L', mins: 33 },
      { date: 'Jan 04', opp: 'POR', pts: 29, reb: 5, ast: 7, pra: 41, result: 'W', mins: 36 },
      { date: 'Jan 02', opp: 'SAS', pts: 31, reb: 4, ast: 6, pra: 41, result: 'W', mins: 35 },
    ],
    vsOpponent: { games: 15, avgPts: 27.8, overRate: 67, record: '7-8' },
    mlPrediction: { value: 29.5, confidence: 78, edge: 1.0, recommendation: 'LEAN OVER' },
    market: { publicOver: 72, sharpOver: 58, lineMovement: +0.5 }
  },
  { 
    id: 3, name: 'Giannis Antetokounmpo', team: 'MIL', teamFull: 'Milwaukee Bucks',
    position: 'PF', number: 34, opponent: 'vs BOS', gameTime: '8:00 PM',
    isHome: true, status: 'Active', image: 'GA',
    seasonStats: { ppg: 31.2, rpg: 11.8, apg: 5.9, spg: 1.1, bpg: 1.4, fgPct: 60.5, threePct: 28.9, ftPct: 64.8, mpg: 35.5, gamesPlayed: 40 },
    props: [
      { type: 'Points', line: 30.5, hitRate: 58, avg: 31.2, overOdds: -110, underOdds: -110, trend: 'hot' },
      { type: 'Rebounds', line: 11.5, hitRate: 62, avg: 11.8, overOdds: -115, underOdds: -105, trend: 'hot' },
      { type: 'Assists', line: 5.5, hitRate: 55, avg: 5.9, overOdds: -105, underOdds: -115, trend: 'neutral' },
      { type: 'PRA', line: 48.5, hitRate: 70, avg: 48.9, overOdds: -115, underOdds: -105, trend: 'hot' },
      { type: 'Blocks', line: 1.5, hitRate: 48, avg: 1.4, overOdds: +115, underOdds: -135, trend: 'cold' },
    ],
    last10Games: [
      { date: 'Jan 21', opp: 'BOS', pts: 35, reb: 14, ast: 6, pra: 55, result: 'W', mins: 38 },
      { date: 'Jan 19', opp: 'PHI', pts: 28, reb: 12, ast: 7, pra: 47, result: 'W', mins: 36 },
      { date: 'Jan 17', opp: 'MIA', pts: 32, reb: 10, ast: 5, pra: 47, result: 'L', mins: 35 },
      { date: 'Jan 15', opp: 'CLE', pts: 30, reb: 13, ast: 6, pra: 49, result: 'W', mins: 37 },
      { date: 'Jan 13', opp: 'NYK', pts: 29, reb: 11, ast: 8, pra: 48, result: 'W', mins: 36 },
      { date: 'Jan 11', opp: 'IND', pts: 33, reb: 12, ast: 4, pra: 49, result: 'W', mins: 35 },
      { date: 'Jan 09', opp: 'CHI', pts: 27, reb: 9, ast: 7, pra: 43, result: 'L', mins: 34 },
      { date: 'Jan 07', opp: 'DET', pts: 36, reb: 14, ast: 5, pra: 55, result: 'W', mins: 37 },
      { date: 'Jan 05', opp: 'ATL', pts: 31, reb: 11, ast: 6, pra: 48, result: 'W', mins: 36 },
      { date: 'Jan 03', opp: 'ORL', pts: 28, reb: 10, ast: 5, pra: 43, result: 'W', mins: 34 },
    ],
    vsOpponent: { games: 18, avgPts: 32.5, overRate: 72, record: '10-8' },
    mlPrediction: { value: 32.1, confidence: 85, edge: 1.6, recommendation: 'OVER' },
    market: { publicOver: 55, sharpOver: 75, lineMovement: -1.0 }
  },
  { 
    id: 4, name: 'Luka Doncic', team: 'DAL', teamFull: 'Dallas Mavericks',
    position: 'PG', number: 77, opponent: '@ PHX', gameTime: '9:00 PM',
    isHome: false, status: 'Active', image: 'LD',
    seasonStats: { ppg: 33.8, rpg: 9.2, apg: 9.8, spg: 1.4, bpg: 0.5, fgPct: 49.2, threePct: 38.2, ftPct: 78.5, mpg: 37.2, gamesPlayed: 38 },
    props: [
      { type: 'Points', line: 33.5, hitRate: 55, avg: 33.8, overOdds: -105, underOdds: -115, trend: 'neutral' },
      { type: 'Rebounds', line: 9.5, hitRate: 48, avg: 9.2, overOdds: +105, underOdds: -125, trend: 'cold' },
      { type: 'Assists', line: 9.5, hitRate: 52, avg: 9.8, overOdds: -110, underOdds: -110, trend: 'neutral' },
      { type: 'PRA', line: 52.5, hitRate: 62, avg: 52.8, overOdds: -115, underOdds: -105, trend: 'hot' },
      { type: '3PT Made', line: 3.5, hitRate: 58, avg: 3.6, overOdds: -110, underOdds: -110, trend: 'neutral' },
    ],
    last10Games: [
      { date: 'Jan 20', opp: 'PHX', pts: 38, reb: 10, ast: 12, pra: 60, result: 'W', mins: 39 },
      { date: 'Jan 18', opp: 'LAC', pts: 32, reb: 8, ast: 9, pra: 49, result: 'L', mins: 37 },
      { date: 'Jan 16', opp: 'UTA', pts: 35, reb: 11, ast: 8, pra: 54, result: 'W', mins: 38 },
      { date: 'Jan 14', opp: 'SAS', pts: 29, reb: 7, ast: 11, pra: 47, result: 'W', mins: 36 },
      { date: 'Jan 12', opp: 'HOU', pts: 36, reb: 9, ast: 10, pra: 55, result: 'W', mins: 38 },
      { date: 'Jan 10', opp: 'OKC', pts: 31, reb: 10, ast: 8, pra: 49, result: 'L', mins: 37 },
      { date: 'Jan 08', opp: 'NOP', pts: 34, reb: 8, ast: 12, pra: 54, result: 'W', mins: 38 },
      { date: 'Jan 06', opp: 'DEN', pts: 28, reb: 9, ast: 9, pra: 46, result: 'L', mins: 36 },
      { date: 'Jan 04', opp: 'MIN', pts: 37, reb: 11, ast: 10, pra: 58, result: 'W', mins: 39 },
      { date: 'Jan 02', opp: 'GSW', pts: 33, reb: 8, ast: 11, pra: 52, result: 'W', mins: 37 },
    ],
    vsOpponent: { games: 14, avgPts: 35.2, overRate: 64, record: '8-6' },
    mlPrediction: { value: 34.5, confidence: 72, edge: 1.0, recommendation: 'LEAN OVER' },
    market: { publicOver: 62, sharpOver: 68, lineMovement: 0 }
  },
  { 
    id: 5, name: 'Jayson Tatum', team: 'BOS', teamFull: 'Boston Celtics',
    position: 'SF', number: 0, opponent: '@ MIL', gameTime: '8:00 PM',
    isHome: false, status: 'Active', image: 'JT',
    seasonStats: { ppg: 27.8, rpg: 8.5, apg: 4.8, spg: 1.0, bpg: 0.7, fgPct: 47.5, threePct: 37.8, ftPct: 85.2, mpg: 36.5, gamesPlayed: 44 },
    props: [
      { type: 'Points', line: 27.5, hitRate: 55, avg: 27.8, overOdds: -110, underOdds: -110, trend: 'neutral' },
      { type: 'Rebounds', line: 8.5, hitRate: 52, avg: 8.5, overOdds: -105, underOdds: -115, trend: 'neutral' },
      { type: 'Assists', line: 4.5, hitRate: 58, avg: 4.8, overOdds: -115, underOdds: -105, trend: 'neutral' },
      { type: 'PRA', line: 40.5, hitRate: 68, avg: 41.1, overOdds: -120, underOdds: +100, trend: 'hot' },
      { type: '3PT Made', line: 3.5, hitRate: 48, avg: 3.2, overOdds: +110, underOdds: -130, trend: 'cold' },
    ],
    last10Games: [
      { date: 'Jan 21', opp: 'MIL', pts: 25, reb: 9, ast: 5, pra: 39, result: 'L', mins: 37 },
      { date: 'Jan 19', opp: 'CLE', pts: 30, reb: 7, ast: 4, pra: 41, result: 'W', mins: 36 },
      { date: 'Jan 17', opp: 'NYK', pts: 28, reb: 10, ast: 6, pra: 44, result: 'W', mins: 38 },
      { date: 'Jan 15', opp: 'PHI', pts: 26, reb: 8, ast: 5, pra: 39, result: 'W', mins: 35 },
      { date: 'Jan 13', opp: 'MIA', pts: 32, reb: 9, ast: 4, pra: 45, result: 'W', mins: 37 },
      { date: 'Jan 11', opp: 'BKN', pts: 24, reb: 7, ast: 6, pra: 37, result: 'W', mins: 34 },
      { date: 'Jan 09', opp: 'TOR', pts: 29, reb: 8, ast: 3, pra: 40, result: 'W', mins: 36 },
      { date: 'Jan 07', opp: 'CHI', pts: 27, reb: 9, ast: 5, pra: 41, result: 'L', mins: 35 },
      { date: 'Jan 05', opp: 'WAS', pts: 31, reb: 10, ast: 6, pra: 47, result: 'W', mins: 38 },
      { date: 'Jan 03', opp: 'ORL', pts: 26, reb: 8, ast: 4, pra: 38, result: 'W', mins: 35 },
    ],
    vsOpponent: { games: 16, avgPts: 26.5, overRate: 56, record: '9-7' },
    mlPrediction: { value: 27.2, confidence: 68, edge: -0.3, recommendation: 'PASS' },
    market: { publicOver: 58, sharpOver: 45, lineMovement: +1.0 }
  }
];

const getTrendIcon = (trend) => {
  switch(trend) {
    case 'hot': return <Flame className="w-4 h-4 text-orange-500" />;
    case 'cold': return <TrendingDown className="w-4 h-4 text-blue-500" />;
    default: return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getHitRateColor = (rate) => {
  if (rate >= 75) return 'text-green-600 dark:text-green-400';
  if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (rate >= 50) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

const getRecommendationStyle = (rec) => {
  switch(rec) {
    case 'OVER': return 'bg-green-500 text-white';
    case 'UNDER': return 'bg-red-500 text-white';
    case 'LEAN OVER': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/50';
    case 'LEAN UNDER': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/50';
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
  }
};

export default function WorkstationNew() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [selectedPlayer, setSelectedPlayer] = useState(PLAYERS_DATABASE[0]);
  const [selectedProp, setSelectedProp] = useState(PLAYERS_DATABASE[0].props[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [bookmarkedPlayers, setBookmarkedPlayers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const filteredPlayers = useMemo(() => {
    return PLAYERS_DATABASE.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           player.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = selectedTeamFilter === 'all' || player.team === selectedTeamFilter;
      return matchesSearch && matchesTeam;
    });
  }, [searchQuery, selectedTeamFilter]);

  const propStats = useMemo(() => {
    const games = selectedPlayer.last10Games;
    const propType = selectedProp.type.toLowerCase();
    const values = games.map(g => {
      switch(propType) {
        case 'points': return g.pts;
        case 'rebounds': return g.reb;
        case 'assists': return g.ast;
        case 'pra': return g.pra;
        default: return g.pts;
      }
    });
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const hits = values.filter(v => v >= selectedProp.line).length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const stdDev = Math.sqrt(values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b) / values.length);
    return {
      values, avg: avg.toFixed(1), hits, total: values.length,
      hitRate: ((hits / values.length) * 100).toFixed(0),
      max, min, stdDev: stdDev.toFixed(1),
      median: [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
    };
  }, [selectedPlayer, selectedProp]);

  const chartData = useMemo(() => {
    const propType = selectedProp.type.toLowerCase();
    return selectedPlayer.last10Games.map((game, idx) => {
      let value;
      switch(propType) {
        case 'points': value = game.pts; break;
        case 'rebounds': value = game.reb; break;
        case 'assists': value = game.ast; break;
        case 'pra': value = game.pra; break;
        default: value = game.pts;
      }
      return { game: `G${10 - idx}`, date: game.date, opp: game.opp, value, line: selectedProp.line, hit: value >= selectedProp.line, result: game.result };
    }).reverse();
  }, [selectedPlayer, selectedProp]);

  const radarData = useMemo(() => {
    const stats = selectedPlayer.seasonStats;
    return [
      { stat: 'Scoring', value: (stats.ppg / 40) * 100, fullMark: 100 },
      { stat: 'Playmaking', value: (stats.apg / 12) * 100, fullMark: 100 },
      { stat: 'Rebounding', value: (stats.rpg / 15) * 100, fullMark: 100 },
      { stat: 'Efficiency', value: stats.fgPct, fullMark: 100 },
      { stat: '3PT', value: (stats.threePct / 50) * 100, fullMark: 100 },
      { stat: 'FT', value: (stats.ftPct / 100) * 100, fullMark: 100 },
    ];
  }, [selectedPlayer]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  const toggleBookmark = useCallback((playerId) => {
    setBookmarkedPlayers(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  }, []);

  const teams = [...new Set(PLAYERS_DATABASE.map(p => p.team))];
  const chartColors = {
    grid: isDark ? '#374151' : '#e5e7eb',
    axis: isDark ? '#9ca3af' : '#6b7280',
    line: '#8b5cf6',
    positive: '#22c55e',
    negative: '#ef4444',
    reference: '#a855f7',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Elite Workstation Pro</h1>
                <p className="text-muted-foreground text-sm lg:text-base">AI-Powered Player Props Analysis Platform</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30 px-3 py-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Data
              </Badge>
              <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                AI Enhanced
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Win Rate', value: '73.2%', color: 'green', icon: TrendingUp },
              { label: 'ROI', value: '+21.4%', color: 'blue', icon: DollarSign },
              { label: 'AI Confidence', value: '89%', color: 'purple', icon: Brain },
              { label: 'Hot Streak', value: '8-2', color: 'orange', icon: Flame },
              { label: 'Sharp Edge', value: '+4.2%', color: 'yellow', icon: Target },
              { label: 'Active Props', value: '24', color: 'cyan', icon: Activity },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-40`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Search */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search players..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                </Button>
                {showFilters && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Team</label>
                    <select value={selectedTeamFilter} onChange={(e) => setSelectedTeamFilter(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground">
                      <option value="all">All Teams</option>
                      {teams.map(team => <option key={team} value={team}>{team}</option>)}
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Players List */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-500" />Players</span>
                  <Badge variant="secondary">{filteredPlayers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {filteredPlayers.map(player => (
                    <button key={player.id} onClick={() => { setSelectedPlayer(player); setSelectedProp(player.props[0]); }}
                      className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
                        selectedPlayer.id === player.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-secondary/50 border-2 border-transparent hover:bg-secondary hover:border-border'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                          selectedPlayer.id === player.id ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>{player.image}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground truncate">{player.name}</span>
                            {bookmarkedPlayers.includes(player.id) && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{player.team}</span><span>•</span><span>{player.position}</span><span>•</span>
                            <span className={player.isHome ? 'text-green-600 dark:text-green-400' : ''}>{player.opponent}</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(player.id); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Bookmark className={`w-4 h-4 ${bookmarkedPlayers.includes(player.id) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prop Markets */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><Target className="w-5 h-5 text-cyan-500" />Prop Markets</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {selectedPlayer.props.map((prop, idx) => (
                    <button key={idx} onClick={() => setSelectedProp(prop)}
                      className={`w-full p-3 rounded-xl transition-all duration-200 ${
                        selectedProp.type === prop.type
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-secondary/50 border-2 border-transparent hover:bg-secondary'
                      }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{prop.type}</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(prop.trend)}
                          <span className={`text-lg font-bold ${getHitRateColor(prop.hitRate)}`}>{prop.hitRate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Line: <span className="text-foreground font-medium">{prop.line}</span></span>
                        <span className="text-muted-foreground">Avg: <span className="text-foreground font-medium">{prop.avg}</span></span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-green-600 dark:text-green-400">O {prop.overOdds > 0 ? '+' : ''}{prop.overOdds}</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-red-600 dark:text-red-400">U {prop.underOdds > 0 ? '+' : ''}{prop.underOdds}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            {/* Player Header */}
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">{selectedPlayer.image}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-foreground">{selectedPlayer.name}</h2>
                        <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">{selectedPlayer.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{selectedPlayer.teamFull}</span><span>•</span><span>{selectedPlayer.position}</span><span>•</span><span>#{selectedPlayer.number}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={selectedPlayer.isHome ? 'default' : 'secondary'}>{selectedPlayer.opponent}</Badge>
                        <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{selectedPlayer.gameTime}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="md:ml-auto grid grid-cols-4 gap-4">
                    {[
                      { label: 'PPG', value: selectedPlayer.seasonStats.ppg },
                      { label: 'RPG', value: selectedPlayer.seasonStats.rpg },
                      { label: 'APG', value: selectedPlayer.seasonStats.apg },
                      { label: 'FG%', value: selectedPlayer.seasonStats.fgPct },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center p-3 bg-secondary rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              {[
                { id: 'analysis', label: 'Analysis', icon: BarChart3 },
                { id: 'history', label: 'Game Log', icon: Calendar },
                { id: 'market', label: 'Market', icon: Activity }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}>
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-foreground flex items-center gap-3">
                        <Activity className={`w-5 h-5 ${getHitRateColor(selectedProp.hitRate)}`} />
                        {selectedProp.type} Analysis
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{getTrendIcon(selectedProp.trend)}<span className="ml-1.5">{selectedProp.trend}</span></Badge>
                        <div className={`px-4 py-2 rounded-lg font-bold ${getRecommendationStyle(selectedPlayer.mlPrediction.recommendation)}`}>
                          {selectedPlayer.mlPrediction.recommendation}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartColors.line} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={chartColors.line} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.5} />
                          <XAxis dataKey="game" stroke={chartColors.axis} fontSize={12} />
                          <YAxis stroke={chartColors.axis} fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', border: `1px solid ${chartColors.grid}`, borderRadius: '12px', color: isDark ? '#f3f4f6' : '#111827' }} />
                          <ReferenceLine y={selectedProp.line} stroke={chartColors.reference} strokeDasharray="8 4" strokeWidth={2} />
                          <Area type="monotone" dataKey="value" stroke={chartColors.line} strokeWidth={0} fill="url(#colorValue)" />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.hit ? chartColors.positive : chartColors.negative} />
                            ))}
                          </Bar>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {[
                        { label: 'Hit Rate', value: `${propStats.hitRate}%`, sub: `${propStats.hits}/${propStats.total}`, color: getHitRateColor(Number(propStats.hitRate)) },
                        { label: 'Average', value: propStats.avg, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Median', value: propStats.median, color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'Max', value: propStats.max, color: 'text-green-600 dark:text-green-400' },
                        { label: 'Min', value: propStats.min, color: 'text-red-600 dark:text-red-400' },
                        { label: 'Std Dev', value: `±${propStats.stdDev}`, color: 'text-yellow-600 dark:text-yellow-400' },
                      ].map((stat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-secondary border border-border">
                          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Prediction */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg"><Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
                      AI Prediction Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-purple-700 dark:text-purple-300">Predicted Value</span>
                          <Sparkles className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{selectedPlayer.mlPrediction.value}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {selectedPlayer.mlPrediction.value > selectedProp.line ? <ArrowUp className="w-4 h-4 text-green-500" /> : <ArrowDown className="w-4 h-4 text-red-500" />}
                          <span className={`text-sm ${selectedPlayer.mlPrediction.value > selectedProp.line ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Math.abs(selectedPlayer.mlPrediction.value - selectedProp.line).toFixed(1)} from line
                          </span>
                        </div>
                      </div>
                      <div className="p-5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-blue-700 dark:text-blue-300">Confidence</span>
                          <Shield className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{selectedPlayer.mlPrediction.confidence}%</p>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${selectedPlayer.mlPrediction.confidence}%` }} />
                        </div>
                      </div>
                      <div className="p-5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-green-700 dark:text-green-300">Edge</span>
                          <Zap className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400">+{selectedPlayer.mlPrediction.edge}%</p>
                        <p className="text-xs text-muted-foreground mt-2">Expected value advantage</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                          <div>
                            <p className="text-foreground font-semibold">Recommendation: {selectedPlayer.mlPrediction.recommendation}</p>
                            <p className="text-sm text-muted-foreground">Based on historical data, matchup analysis, and market conditions</p>
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                          <Play className="w-4 h-4 mr-2" />Add to Slip
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Game Log Tab */}
            {activeTab === 'history' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />Game Log (Last 10 Games)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b border-border">
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Opp</th>
                          <th className="pb-3 font-medium">Result</th>
                          <th className="pb-3 font-medium text-center">PTS</th>
                          <th className="pb-3 font-medium text-center">REB</th>
                          <th className="pb-3 font-medium text-center">AST</th>
                          <th className="pb-3 font-medium text-center">PRA</th>
                          <th className="pb-3 font-medium text-center">MIN</th>
                          <th className="pb-3 font-medium text-center">{selectedProp.type} Hit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlayer.last10Games.map((game, idx) => {
                          const propValue = selectedProp.type.toLowerCase() === 'points' ? game.pts :
                                           selectedProp.type.toLowerCase() === 'rebounds' ? game.reb :
                                           selectedProp.type.toLowerCase() === 'assists' ? game.ast :
                                           selectedProp.type.toLowerCase() === 'pra' ? game.pra : game.pts;
                          const hit = propValue >= selectedProp.line;
                          return (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                              <td className="py-3 text-sm text-foreground">{game.date}</td>
                              <td className="py-3 text-sm text-foreground">{game.opp}</td>
                              <td className="py-3"><Badge variant={game.result === 'W' ? 'default' : 'destructive'}>{game.result}</Badge></td>
                              <td className="py-3 text-sm text-foreground text-center font-medium">{game.pts}</td>
                              <td className="py-3 text-sm text-foreground text-center font-medium">{game.reb}</td>
                              <td className="py-3 text-sm text-foreground text-center font-medium">{game.ast}</td>
                              <td className="py-3 text-sm text-foreground text-center font-medium">{game.pra}</td>
                              <td className="py-3 text-sm text-muted-foreground text-center">{game.mins}</td>
                              <td className="py-3 text-center">{hit ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-500 mx-auto" />}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Tab */}
            {activeTab === 'market' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2"><Activity className="w-5 h-5 text-yellow-500" />Market Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Public Money</span>
                        <span className="text-sm font-semibold text-foreground">{selectedPlayer.market.publicOver}% Over</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${selectedPlayer.market.publicOver}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Sharp Money</span>
                        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{selectedPlayer.market.sharpOver}% Over</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" style={{ width: `${selectedPlayer.market.sharpOver}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Line Movement</p>
                        <div className="flex items-center gap-2">
                          {selectedPlayer.market.lineMovement < 0 ? <ArrowDown className="w-5 h-5 text-red-500" /> : selectedPlayer.market.lineMovement > 0 ? <ArrowUp className="w-5 h-5 text-green-500" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
                          <span className={`text-2xl font-bold ${selectedPlayer.market.lineMovement < 0 ? 'text-red-600 dark:text-red-400' : selectedPlayer.market.lineMovement > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                            {selectedPlayer.market.lineMovement > 0 ? '+' : ''}{selectedPlayer.market.lineMovement}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">vs Opponent</p>
                        <p className="text-lg font-bold text-foreground">{selectedPlayer.vsOpponent.record}</p>
                      </div>
                    </div>
                  </div>
                  {selectedPlayer.market.sharpOver > selectedPlayer.market.publicOver + 10 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="text-yellow-700 dark:text-yellow-400 font-semibold">Sharp vs Public Divergence</p>
                          <p className="text-sm text-muted-foreground">Sharp money is significantly higher. Consider following sharp action.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Player Profile Radar */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Player Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={chartColors.grid} />
                      <PolarAngleAxis dataKey="stat" stroke={chartColors.axis} fontSize={11} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={chartColors.axis} fontSize={10} />
                      <Radar name="Stats" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* vs Opponent */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><Users className="w-5 h-5 text-cyan-500" />vs {selectedPlayer.opponent.replace('vs ', '').replace('@ ', '')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-center">
                    <p className="text-xs text-green-700 dark:text-green-400 mb-1">Record</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedPlayer.vsOpponent.record}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-center">
                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Avg Pts</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedPlayer.vsOpponent.avgPts}</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Over Rate</span>
                    <span className={`text-lg font-bold ${getHitRateColor(selectedPlayer.vsOpponent.overRate)}`}>{selectedPlayer.vsOpponent.overRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${selectedPlayer.vsOpponent.overRate}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Based on {selectedPlayer.vsOpponent.games} career games</p>
                </div>
              </CardContent>
            </Card>

            {/* Hot Picks */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><Zap className="w-5 h-5 text-green-500" />Hot Picks Today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PLAYERS_DATABASE.filter(p => p.mlPrediction.confidence >= 80).slice(0, 3).map(player => (
                  <button key={player.id} onClick={() => { setSelectedPlayer(player); setSelectedProp(player.props[0]); }}
                    className="w-full p-3 bg-secondary border border-border rounded-xl hover:bg-muted transition-colors text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{player.name}</span>
                      <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs">{player.mlPrediction.confidence}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{player.props[0].type} {player.props[0].line}</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{player.mlPrediction.recommendation}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground flex items-center gap-2"><Award className="w-5 h-5 text-purple-500" />Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Analyzed', value: '12 Props', color: 'text-foreground' },
                  { label: 'Bookmarked', value: bookmarkedPlayers.length, color: 'text-yellow-600 dark:text-yellow-400' },
                  { label: 'Time', value: '24m', color: 'text-blue-600 dark:text-blue-400', icon: Timer },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.icon && <stat.icon className="w-4 h-4 inline mr-1" />}{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
