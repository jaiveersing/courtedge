import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  Search, Filter, TrendingUp, TrendingDown, X, Calendar, Star, Flame, Target, 
  BarChart3, Activity, Info, RefreshCw, Download, Share2, Bookmark, AlertCircle, 
  CheckCircle2, XCircle, Clock, MapPin, Percent, DollarSign, Grid, List, 
  Maximize2, Users, Shield, Zap, Wifi, WifiOff, LineChart, Plus, Minus, 
  Bell, Eye, Save, ChevronLeft, ChevronRight, Lock, Unlock, ThumbsUp, ThumbsDown,
  TrendingUpDown, BarChart, PieChart, Timer, Trophy, Award, Brain, Sparkles,
  ArrowUpRight, ArrowDownRight, Settings, HelpCircle, ExternalLink, Copy,
  Hash, Layers, Gauge, Radar, Signal, Crosshair, CircleDot, Cpu, Database,
  GitCompare, Filter as FilterIcon, SortAsc, SortDesc, Briefcase, Wallet,
  DollarSign as DollarIcon, TrendingUpIcon, History, RotateCcw, Play, Pause
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Badge } from '../Components/ui/badge';
import { AppCard } from "@/Components/ui/AppCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceLine, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import mlService from '../src/api/mlService';

// ==================== COMPREHENSIVE PLAYER DATABASE ====================
const ELITE_PLAYERS = [
  { 
    id: 1,
    player: 'LeBron James',
    fullName: 'LeBron Raymone James Sr.',
    team: 'LAL',
    teamFull: 'Los Angeles Lakers',
    teamColor: '#552583',
    teamSecondary: '#FDB927',
    opponent: 'vs GSW',
    opponentFull: 'Golden State Warriors',
    position: 'SF',
    age: 39,
    height: '6-9',
    weight: 250,
    experience: 21,
    college: 'St. Vincent-St. Mary HS',
    draft: '2003 - R1 Pick 1',
    
    // Current Season Stats
    seasonAvg: { 
      pts: 27.3, reb: 7.8, ast: 8.9, stl: 1.2, blk: 0.8, tov: 3.5, pf: 2.1,
      fg: 52.1, fgm: 10.2, fga: 19.6, 
      threes: 38.5, threesM: 2.4, threesA: 6.2,
      ft: 73.2, ftm: 5.1, fta: 7.0,
      mins: 35.2, gamesPlayed: 45
    },
    
    // Current Props
    props: [
      { type: 'Points', line: 25.5, percentage: 87, over: 35, total: 40, odds: { over: -115, under: -105 } },
      { type: 'Rebounds', line: 7.5, percentage: 68, over: 27, total: 40, odds: { over: -110, under: -110 } },
      { type: 'Assists', line: 8.5, percentage: 72, over: 29, total: 40, odds: { over: -120, under: +100 } },
      { type: 'Pts+Reb+Ast', line: 43.5, percentage: 85, over: 34, total: 40, odds: { over: -125, under: +105 } },
      { type: '3PT Made', line: 2.5, percentage: 58, over: 23, total: 40, odds: { over: +115, under: -135 } },
      { type: 'Double-Double', line: 0.5, percentage: 75, over: 30, total: 40, odds: { over: -140, under: +120 } },
    ],
    
    // Last 15 Games Performance
    last15Games: [
      { date: '01/20', opp: 'GSW', pts: 28, reb: 8, ast: 11, stl: 2, blk: 1, tov: 4, mins: 36, fg: '11/20', threes: '2/5', ft: '4/5', result: 'W', margin: 7, opponent_score: 108 },
      { date: '01/18', opp: '@SAC', pts: 31, reb: 7, ast: 9, stl: 1, blk: 0, tov: 3, mins: 38, fg: '12/22', threes: '3/7', ft: '4/4', result: 'W', margin: 5, opponent_score: 115 },
      { date: '01/16', opp: 'PHX', pts: 22, reb: 5, ast: 12, stl: 0, blk: 1, tov: 5, mins: 34, fg: '8/18', threes: '2/6', ft: '4/6', result: 'L', margin: -5, opponent_score: 110 },
      { date: '01/14', opp: '@LAC', pts: 29, reb: 9, ast: 8, stl: 1, blk: 2, tov: 2, mins: 37, fg: '11/19', threes: '2/5', ft: '5/6', result: 'W', margin: 6, opponent_score: 112 },
      { date: '01/12', opp: 'MEM', pts: 26, reb: 6, ast: 10, stl: 2, blk: 0, tov: 4, mins: 35, fg: '10/21', threes: '2/8', ft: '4/5', result: 'W', margin: 7, opponent_score: 105 },
      { date: '01/10', opp: '@DEN', pts: 24, reb: 7, ast: 11, stl: 1, blk: 1, tov: 3, mins: 36, fg: '9/20', threes: '1/6', ft: '5/7', result: 'L', margin: -7, opponent_score: 115 },
      { date: '01/08', opp: 'DAL', pts: 29, reb: 8, ast: 9, stl: 2, blk: 1, tov: 2, mins: 38, fg: '11/23', threes: '3/9', ft: '4/4', result: 'W', margin: 5, opponent_score: 120 },
      { date: '01/06', opp: 'POR', pts: 31, reb: 9, ast: 7, stl: 1, blk: 0, tov: 4, mins: 37, fg: '12/21', threes: '2/6', ft: '5/6', result: 'W', margin: 8, opponent_score: 112 },
      { date: '01/04', opp: '@UTA', pts: 27, reb: 6, ast: 10, stl: 2, blk: 1, tov: 3, mins: 35, fg: '10/19', threes: '2/5', ft: '5/7', result: 'W', margin: 10, opponent_score: 105 },
      { date: '01/02', opp: 'MIN', pts: 24, reb: 7, ast: 8, stl: 0, blk: 1, tov: 5, mins: 34, fg: '9/22', threes: '1/7', ft: '5/6', result: 'L', margin: -3, opponent_score: 115 },
      { date: '12/30', opp: '@HOU', pts: 30, reb: 8, ast: 9, stl: 1, blk: 0, tov: 2, mins: 38, fg: '11/20', threes: '3/6', ft: '5/6', result: 'W', margin: 6, opponent_score: 118 },
      { date: '12/28', opp: 'OKC', pts: 28, reb: 7, ast: 11, stl: 2, blk: 1, tov: 4, mins: 36, fg: '10/19', threes: '2/5', ft: '6/8', result: 'W', margin: 9, opponent_score: 112 },
      { date: '12/26', opp: 'BOS', pts: 25, reb: 6, ast: 9, stl: 1, blk: 0, tov: 3, mins: 35, fg: '9/21', threes: '2/7', ft: '5/6', result: 'L', margin: -5, opponent_score: 120 },
      { date: '12/24', opp: '@CHI', pts: 33, reb: 9, ast: 8, stl: 2, blk: 1, tov: 2, mins: 39, fg: '13/22', threes: '3/6', ft: '4/5', result: 'W', margin: 11, opponent_score: 108 },
      { date: '12/22', opp: 'SAS', pts: 27, reb: 7, ast: 10, stl: 1, blk: 1, tov: 3, mins: 36, fg: '10/20', threes: '2/6', ft: '5/7', result: 'W', margin: 8, opponent_score: 110 },
    ],
    
    // Advanced Metrics
    advanced: {
      per: 24.8,
      ts: 58.9,
      usage: 31.5,
      ortg: 118.2,
      drtg: 112.3,
      netRtg: 5.9,
      pace: 101.2,
      pie: 17.8,
      winShares: 6.2,
      bpm: 6.4,
      vorp: 3.8
    },
    
    // Splits
    splits: {
      home: { pts: 28.5, reb: 8.1, ast: 9.2, games: 20, mins: 35.8 },
      away: { pts: 26.1, reb: 7.5, ast: 8.6, games: 25, mins: 34.6 },
      vsWest: { pts: 27.8, reb: 7.9, ast: 9.1, games: 28 },
      vsEast: { pts: 26.9, reb: 7.7, ast: 8.7, games: 17 },
      last7: { pts: 27.1, reb: 7.3, ast: 9.8, wins: 5, losses: 2 },
      last14: { pts: 27.8, reb: 7.6, ast: 9.3, wins: 10, losses: 4 },
      withAD: { pts: 25.8, reb: 7.2, ast: 9.8, games: 30 },
      withoutAD: { pts: 30.2, reb: 9.1, ast: 7.8, games: 15 },
      dayGames: { pts: 25.3, reb: 7.1, ast: 8.4, games: 8 },
      nightGames: { pts: 27.8, reb: 7.9, ast: 9.1, games: 37 },
      backToBack: { pts: 24.5, reb: 6.8, ast: 8.9, games: 6 },
      rest2Plus: { pts: 28.7, reb: 8.3, ast: 9.2, games: 25 },
      overtime: { pts: 32.4, reb: 9.2, ast: 10.1, games: 3 },
      clutch: { pts: 6.2, reb: 1.8, ast: 2.1, fgPct: 48.2, games: 18 }
    },
    
    // Matchup Data
    vsOpponent: {
      games: 3,
      wins: 2,
      losses: 1,
      avgPts: 29.7,
      avgReb: 8.3,
      avgAst: 9.7,
      lastMeeting: { date: '12/15/25', pts: 32, reb: 9, ast: 11, result: 'W 125-118' },
      seasonHigh: { pts: 38, date: '11/08/25' },
      overRate: 100
    },
    
    // Betting Trends
    trends: {
      overUnder: { over: 28, under: 17, push: 0 },
      spread: { covered: 26, notCovered: 19, push: 0 },
      moneyline: { wins: 32, losses: 13 },
      teamTotal: { over: 24, under: 21 },
      last10Over: 7,
      homeOver: 14,
      awayOver: 14,
      favoriteOver: 19,
      underdogOver: 9
    },
    
    // Injury & News
    injury: null,
    injuryStatus: 'Healthy',
    lastInjury: 'Left ankle sprain (12/01/25) - Missed 2 games',
    recentNews: [
      { date: '01/21', text: 'LeBron says he feels "as good as ever" heading into GSW matchup', source: 'ESPN' },
      { date: '01/20', text: 'Lakers plan to limit LeBron to 35 min/game rest of season', source: 'The Athletic' },
      { date: '01/18', text: 'LeBron passes 40,000 career points milestone', source: 'NBA.com' }
    ],
    
    // Weather & Context
    gameContext: {
      time: 'Evening (7:30 PM PT)',
      location: 'Crypto.com Arena',
      attendance: 18997,
      temperature: 68,
      indoor: true,
      broadcast: 'ESPN',
      referee: { name: 'Scott Foster', avgFouls: 42.3, overTendency: 48 },
      restDays: 2,
      backToBack: false,
      homeStreak: 'W3',
      awayStreak: 'L1'
    },
    
    // Line Movement
    lineMovement: [
      { time: '72h', type: 'Points', line: 26.5, odds: -110, volume: 'Low' },
      { time: '48h', type: 'Points', line: 26.0, odds: -112, volume: 'Medium' },
      { time: '24h', type: 'Points', line: 25.5, odds: -115, volume: 'High' },
      { time: 'Now', type: 'Points', line: 25.5, odds: -115, volume: 'Very High' }
    ],
    
    // Betting Market
    market: {
      public: { over: 68, under: 32 },
      sharp: { over: 82, under: 18 },
      money: { over: 75, under: 25 },
      steam: true,
      reverseLine: false,
      consensus: 'Strong Over'
    },
    
    // ML Predictions
    mlPredictions: {
      xgboost: 28.1,
      lightgbm: 28.5,
      randomForest: 27.9,
      neuralNet: 28.3,
      ensemble: 28.3,
      confidence: 92,
      range: [24, 32],
      stdDev: 3.2,
      expectedValue: 2.8,
      kellyBet: 2.5
    },
    
    // Props Correlation
    correlations: {
      ptsReb: 0.72,
      ptsAst: 0.68,
      rebAst: 0.54,
      ptsMin: 0.89,
      teamPace: 0.76,
      oppDefRtg: -0.64
    }
  }
];

// ==================== HELPER FUNCTIONS ====================

const calculateAdvancedStats = (games, propType, line) => {
  if (!games || games.length === 0) return null;
  
  const values = games.map(g => {
    switch(propType.toLowerCase()) {
      case 'points': return g.pts;
      case 'rebounds': return g.reb;
      case 'assists': return g.ast;
      case 'pts+reb+ast': return g.pts + g.reb + g.ast;
      case '3pt made': return parseInt(g.threes?.split('/')[0] || 0);
      default: return g.pts;
    }
  });
  
  const hits = values.filter(v => v >= line).length;
  const hitRate = (hits / values.length * 100).toFixed(1);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const median = [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const stdDev = Math.sqrt(values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b) / values.length).toFixed(1);
  
  // Trend calculation
  const recent5 = values.slice(-5);
  const earlier5 = values.slice(-10, -5);
  const recentAvg = recent5.reduce((a, b) => a + b, 0) / 5;
  const earlierAvg = earlier5.reduce((a, b) => a + b, 0) / 5;
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

// ==================== MAIN COMPONENT ====================

export default function WorkstationNew() {
  // State Management
  const [selectedPlayer, setSelectedPlayer] = useState(ELITE_PLAYERS[0]);
  const [selectedProp, setSelectedProp] = useState(ELITE_PLAYERS[0].props[0]);
  const [customLine, setCustomLine] = useState(ELITE_PLAYERS[0].props[0].line);
  const [viewMode, setViewMode] = useState('advanced'); // simple, advanced, expert
  const [timeRange, setTimeRange] = useState('last_15');
  const [splitType, setSplitType] = useState('all');
  const [showMLPredictions, setShowMLPredictions] = useState(true);
  const [showCorrelations, setShowCorrelations] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);
  
  // Calculate stats based on selected prop and line
  const stats = useMemo(() => {
    const games = timeRange === 'last_15' ? selectedPlayer.last15Games :
                  timeRange === 'last_10' ? selectedPlayer.last15Games.slice(-10) :
                  timeRange === 'last_7' ? selectedPlayer.last15Games.slice(-7) :
                  selectedPlayer.last15Games;
    
    return calculateAdvancedStats(games, selectedProp.type, customLine);
  }, [selectedPlayer, selectedProp, customLine, timeRange]);
  
  // Chart data
  const chartData = useMemo(() => {
    return selectedPlayer.last15Games.slice(-10).map((game, idx) => {
      let value;
      switch(selectedProp.type.toLowerCase()) {
        case 'points': value = game.pts; break;
        case 'rebounds': value = game.reb; break;
        case 'assists': value = game.ast; break;
        case 'pts+reb+ast': value = game.pts + game.reb + game.ast; break;
        case '3pt made': value = parseInt(game.threes?.split('/')[0] || 0); break;
        default: value = game.pts;
      }
      
      return {
        game: `G${10-idx}`,
        value,
        line: customLine,
        hit: value >= customLine,
        date: game.date,
        opponent: game.opp,
        result: game.result,
        fg: game.fg,
        mins: game.mins
      };
    }).reverse();
  }, [selectedPlayer, selectedProp, customLine]);
  
  // Radar chart data for player comparison
  const radarData = useMemo(() => {
    return [
      { stat: 'Scoring', value: (selectedPlayer.seasonAvg.pts / 35 * 100), fullMark: 100 },
      { stat: 'Playmaking', value: (selectedPlayer.seasonAvg.ast / 12 * 100), fullMark: 100 },
      { stat: 'Rebounding', value: (selectedPlayer.seasonAvg.reb / 15 * 100), fullMark: 100 },
      { stat: 'Efficiency', value: selectedPlayer.seasonAvg.fg, fullMark: 100 },
      { stat: 'Usage', value: (selectedPlayer.advanced.usage / 40 * 100), fullMark: 100 },
      { stat: 'Defense', value: 75, fullMark: 100 }
    ];
  }, [selectedPlayer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main Container */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 py-6">
        
        {/* ==================== HEADER SECTION ==================== */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Elite Workstation Pro
                </h1>
                <p className="text-slate-400 text-sm mt-1">Advanced Analytics & Predictive Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 px-4 py-2 flex items-center gap-2">
                <Signal className="w-4 h-4 animate-pulse" />
                Live Analysis
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Powered
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-6 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-400/60 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">71%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400/40" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-400/60 mb-1">ROI</p>
                    <p className="text-2xl font-bold text-blue-400">+18.3%</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-400/40" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-400/60 mb-1">ML Confidence</p>
                    <p className="text-2xl font-bold text-purple-400">92%</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-400/40" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-400/60 mb-1">Hot Streak</p>
                    <p className="text-2xl font-bold text-orange-400">7 Games</p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-400/40" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-yellow-400/60 mb-1">Sharp Money</p>
                    <p className="text-2xl font-bold text-yellow-400">82%</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-400/40" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-500/20 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-rose-400/60 mb-1">Edge</p>
                    <p className="text-2xl font-bold text-rose-400">+8.5%</p>
                  </div>
                  <Zap className="w-8 h-8 text-rose-400/40" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================== MAIN GRID LAYOUT ==================== */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* ==================== LEFT PANEL - Player Selection & Controls ==================== */}
          <div className="col-span-3 space-y-4">
            
            {/* Player Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden">
              <div 
                className="h-32 bg-gradient-to-br opacity-20"
                style={{ background: `linear-gradient(135deg, ${selectedPlayer.teamColor} 0%, ${selectedPlayer.teamSecondary} 100%)` }}
              />
              <CardContent className="p-6 -mt-16 relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-slate-800 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl font-bold text-white">{selectedPlayer.player.split(' ').map(n => n[0]).join('')}</span>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{selectedPlayer.player}</h3>
                  <p className="text-sm text-slate-400">{selectedPlayer.teamFull}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge className="bg-white/10">{selectedPlayer.position}</Badge>
                    <Badge className="bg-white/10">#{selectedPlayer.id}</Badge>
                    <Badge className={selectedPlayer.injury ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                      {selectedPlayer.injuryStatus}
                    </Badge>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">PPG</p>
                    <p className="text-lg font-bold text-white">{selectedPlayer.seasonAvg.pts}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">RPG</p>
                    <p className="text-lg font-bold text-white">{selectedPlayer.seasonAvg.reb}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">APG</p>
                    <p className="text-lg font-bold text-white">{selectedPlayer.seasonAvg.ast}</p>
                  </div>
                </div>
                
                {/* Matchup Info */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Next Matchup</span>
                    <Badge className="bg-red-500/20 text-red-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Today 7:30 PM
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-white">{selectedPlayer.opponent}</p>
                  <p className="text-xs text-slate-400 mt-1">{selectedPlayer.gameContext.location}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width: `${selectedPlayer.vsOpponent.overRate}%`}}></div>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">{selectedPlayer.vsOpponent.overRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Prop Type Selection */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Select Prop Market
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPlayer.props.map((prop, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedProp(prop);
                      setCustomLine(prop.line);
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedProp.type === prop.type
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{prop.type}</span>
                      <Badge className={getConfidenceBg(prop.percentage)}>
                        {prop.percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Line: {prop.line}</span>
                      <span className="text-xs text-slate-400">{prop.over}/{prop.total}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-green-400">O {prop.odds.over}</span>
                      <span className="text-xs text-slate-500">|</span>
                      <span className="text-xs text-red-400">U {prop.odds.under}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
            
            {/* Line Adjustment */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  Line Adjustment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-400 mb-2">Current Line</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:bg-slate-700"
                      onClick={() => setCustomLine(Math.max(0, customLine - 0.5))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={customLine}
                      onChange={(e) => setCustomLine(parseFloat(e.target.value))}
                      className="w-24 text-center text-2xl font-bold bg-slate-900 border-slate-700 text-white"
                      step="0.5"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:bg-slate-700"
                      onClick={() => setCustomLine(customLine + 0.5)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Alternate Lines */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-2">Quick Lines</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[selectedProp.line - 1, selectedProp.line, selectedProp.line + 1].map((line, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomLine(line)}
                        className={`p-2 rounded border text-sm ${
                          customLine === line
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {line}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <FilterIcon className="w-5 h-5 text-yellow-400" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="last_7">Last 7 Games</SelectItem>
                      <SelectItem value="last_10">Last 10 Games</SelectItem>
                      <SelectItem value="last_15">Last 15 Games</SelectItem>
                      <SelectItem value="season">Full Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Split Type</label>
                  <Select value={splitType} onValueChange={setSplitType}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Games</SelectItem>
                      <SelectItem value="home">Home Only</SelectItem>
                      <SelectItem value="away">Away Only</SelectItem>
                      <SelectItem value="vsWest">vs Western Conf</SelectItem>
                      <SelectItem value="vsEast">vs Eastern Conf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-sm text-slate-300">ML Predictions</span>
                  <button
                    onClick={() => setShowMLPredictions(!showMLPredictions)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showMLPredictions ? 'bg-purple-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showMLPredictions ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-sm text-slate-300">Correlations</span>
                  <button
                    onClick={() => setShowCorrelations(!showCorrelations)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showCorrelations ? 'bg-blue-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showCorrelations ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* ==================== CENTER PANEL - Main Analytics ==================== */}
          <div className="col-span-6 space-y-4">
            
            {/* Performance Overview Card */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-purple-400" />
                    Performance Analysis
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getConfidenceBg(stats?.hitRate || 0)} px-4 py-2`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stats?.hitRate}% Hit Rate
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
                      {stats?.hits}/{stats?.total} Games
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Main Performance Chart */}
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                      <XAxis 
                        dataKey="game" 
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-lg">
                                <p className="text-white font-semibold mb-2">{data.date} {data.opponent}</p>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    <span className="text-slate-400">Value:</span>{' '}
                                    <span className={data.hit ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                                      {data.value}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-slate-400">Line:</span>{' '}
                                    <span className="text-purple-400">{data.line}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-slate-400">Result:</span>{' '}
                                    <span className={data.result === 'W' ? 'text-green-400' : 'text-red-400'}>
                                      {data.result}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-slate-400">FG:</span>{' '}
                                    <span className="text-white">{data.fg}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-slate-400">Minutes:</span>{' '}
                                    <span className="text-white">{data.mins}</span>
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <ReferenceLine 
                        y={customLine} 
                        stroke="#a855f7" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{ value: `Line: ${customLine}`, position: 'right', fill: '#a855f7', fontSize: 12 }}
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
                      <Bar 
                        dataKey="value" 
                        fill="#8b5cf6"
                        opacity={0.6}
                        radius={[8, 8, 0, 0]}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hit ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-6 gap-3">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400/60 mb-1">Average</p>
                    <p className="text-xl font-bold text-blue-400">{stats?.avg}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400/60 mb-1">Median</p>
                    <p className="text-xl font-bold text-green-400">{stats?.median}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg">
                    <p className="text-xs text-purple-400/60 mb-1">Max</p>
                    <p className="text-xl font-bold text-purple-400">{stats?.max}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-lg">
                    <p className="text-xs text-orange-400/60 mb-1">Min</p>
                    <p className="text-xl font-bold text-orange-400">{stats?.min}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-400/60 mb-1">Std Dev</p>
                    <p className="text-xl font-bold text-yellow-400">{stats?.stdDev}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20 rounded-lg">
                    <p className="text-xs text-rose-400/60 mb-1">Streak</p>
                    <p className="text-xl font-bold text-rose-400">{stats?.currentStreak}{stats?.streakType === 'Over' ? '↑' : '↓'}</p>
                  </div>
                </div>
                
                {/* Trend Indicator */}
                <div className="mt-4 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {stats?.trendDirection === 'Upward' ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : stats?.trendDirection === 'Downward' ? (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      ) : (
                        <Minus className="w-6 h-6 text-yellow-400" />
                      )}
                      <div>
                        <p className="text-sm text-slate-400">Performance Trend</p>
                        <p className={`text-lg font-semibold ${
                          stats?.trendDirection === 'Upward' ? 'text-green-400' :
                          stats?.trendDirection === 'Downward' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {stats?.trendDirection}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Change</p>
                      <p className="text-lg font-semibold text-white">±{stats?.trendStrength}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Game Log Table */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-400" />
                  Detailed Game Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-slate-400 border-b border-slate-700">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Opponent</th>
                        <th className="pb-3 font-medium">Result</th>
                        <th className="pb-3 font-medium">Value</th>
                        <th className="pb-3 font-medium">Hit</th>
                        <th className="pb-3 font-medium">FG</th>
                        <th className="pb-3 font-medium">3PT</th>
                        <th className="pb-3 font-medium">FT</th>
                        <th className="pb-3 font-medium">Mins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPlayer.last15Games.slice(-10).reverse().map((game, idx) => {
                        let value;
                        switch(selectedProp.type.toLowerCase()) {
                          case 'points': value = game.pts; break;
                          case 'rebounds': value = game.reb; break;
                          case 'assists': value = game.ast; break;
                          case 'pts+reb+ast': value = game.pts + game.reb + game.ast; break;
                          default: value = game.pts;
                        }
                        const hit = value >= customLine;
                        
                        return (
                          <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 text-sm text-white">{game.date}</td>
                            <td className="py-3 text-sm text-white">{game.opp}</td>
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
                            <td className="py-3 text-sm text-slate-400">{game.fg}</td>
                            <td className="py-3 text-sm text-slate-400">{game.threes}</td>
                            <td className="py-3 text-sm text-slate-400">{game.ft}</td>
                            <td className="py-3 text-sm text-slate-400">{game.mins}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* ML Predictions Section */}
            {showMLPredictions && (
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    AI & Machine Learning Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-purple-300">Ensemble Prediction</span>
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-3xl font-bold text-purple-400">{selectedPlayer.mlPredictions.ensemble}</p>
                      <p className="text-xs text-purple-300/60 mt-1">
                        Range: {selectedPlayer.mlPredictions.range[0]} - {selectedPlayer.mlPredictions.range[1]}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-300">Confidence Score</span>
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-3xl font-bold text-blue-400">{selectedPlayer.mlPredictions.confidence}%</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{width: `${selectedPlayer.mlPredictions.confidence}%`}}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">XGBoost</p>
                      <p className="text-lg font-semibold text-white">{selectedPlayer.mlPredictions.xgboost}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">LightGBM</p>
                      <p className="text-lg font-semibold text-white">{selectedPlayer.mlPredictions.lightgbm}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Random Forest</p>
                      <p className="text-lg font-semibold text-white">{selectedPlayer.mlPredictions.randomForest}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Neural Net</p>
                      <p className="text-lg font-semibold text-white">{selectedPlayer.mlPredictions.neuralNet}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-emerald-300 mb-1">Expected Value (EV)</p>
                        <p className="text-2xl font-bold text-emerald-400">+{selectedPlayer.mlPredictions.expectedValue}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-300 mb-1">Kelly Criterion</p>
                        <p className="text-2xl font-bold text-emerald-400">{selectedPlayer.mlPredictions.kellyBet}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* ==================== RIGHT PANEL - Advanced Metrics ==================== */}
          <div className="col-span-3 space-y-4">
            
            {/* Betting Market Sentiment */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Public Money</span>
                      <span className="text-sm font-semibold text-white">{selectedPlayer.market.public.over}% Over</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{width: `${selectedPlayer.market.public.over}%`}}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Sharp Money</span>
                      <span className="text-sm font-semibold text-yellow-400">{selectedPlayer.market.sharp.over}% Over</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                        style={{width: `${selectedPlayer.market.sharp.over}%`}}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Money Percentage</span>
                      <span className="text-sm font-semibold text-green-400">{selectedPlayer.market.money.over}% Over</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{width: `${selectedPlayer.market.money.over}%`}}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg">
                    {selectedPlayer.market.steam && (
                      <Badge className="bg-red-500/20 text-red-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Steam Move
                      </Badge>
                    )}
                    <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {selectedPlayer.market.consensus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Line Movement History */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-400" />
                  Line Movement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPlayer.lineMovement.map((move, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-400">{move.time}</p>
                        <p className="text-lg font-semibold text-white">{move.line}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Odds</p>
                        <p className="text-sm font-semibold text-white">{move.odds}</p>
                      </div>
                      <Badge className={
                        move.volume === 'Very High' ? 'bg-red-500/20 text-red-400' :
                        move.volume === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        move.volume === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {move.volume}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Player Radar Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Radar className="w-5 h-5 text-purple-400" />
                  Player Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis 
                        dataKey="stat" 
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        stroke="#94a3b8"
                        fontSize={10}
                      />
                      <RechartsRadar
                        name="Performance"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Betting Trends */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Betting Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400/60 mb-1">Over/Under</p>
                    <p className="text-lg font-bold text-green-400">{selectedPlayer.trends.overUnder.over}-{selectedPlayer.trends.overUnder.under}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400/60 mb-1">ATS</p>
                    <p className="text-lg font-bold text-blue-400">{selectedPlayer.trends.spread.covered}-{selectedPlayer.trends.spread.notCovered}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Last 10 Games Over</span>
                    <span className="text-sm font-semibold text-white">{selectedPlayer.trends.last10Over}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Home Over</span>
                    <span className="text-sm font-semibold text-white">{selectedPlayer.trends.homeOver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Away Over</span>
                    <span className="text-sm font-semibold text-white">{selectedPlayer.trends.awayOver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">As Favorite</span>
                    <span className="text-sm font-semibold text-white">{selectedPlayer.trends.favoriteOver}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
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
                <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
              </CardContent>
            </Card>
            
            {/* Recent News */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Latest News
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedPlayer.recentNews.map((news, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{news.source}</Badge>
                      <span className="text-xs text-slate-500">{news.date}</span>
                    </div>
                    <p className="text-sm text-slate-300">{news.text}</p>
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
