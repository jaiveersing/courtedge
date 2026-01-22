// ML Workstation Elite v3.0 - Showcasing Advanced ML Features
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../src/contexts/ThemeContext';
import { 
  Brain, Activity, TrendingUp, TrendingDown, Search, 
  Zap, Target, BarChart3, PieChart, Layers, 
  AlertTriangle, CheckCircle, Clock, DollarSign,
  Cpu, Database, GitBranch, Sparkles, Flame,
  Shield, Crosshair, Users, Timer, Award,
  ArrowUpRight, ArrowDownRight, Percent, Info,
  RefreshCw, Download, Filter, ChevronRight,
  BarChart2, Calculator, Briefcase,
  Eye, Lightbulb, Boxes
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  ReferenceLine, Scatter, ScatterChart, ZAxis
} from 'recharts';
import mlService from '../src/api/mlService';

// Design System Hook
const useDesignSystem = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return {
    isDark,
    // Backgrounds
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    bgCard: isDark ? 'bg-white/[0.02]' : 'bg-white/90',
    bgCardHover: isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-white',
    bgAccent: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
    bgSuccess: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
    bgWarning: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
    bgDanger: isDark ? 'bg-red-500/10' : 'bg-red-50',
    bgGradient: isDark 
      ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black' 
      : 'bg-gradient-to-br from-white via-slate-50 to-slate-100',
    // Text
    text: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-400',
    textAccent: isDark ? 'text-indigo-400' : 'text-indigo-600',
    textSuccess: isDark ? 'text-emerald-400' : 'text-emerald-600',
    textWarning: isDark ? 'text-amber-400' : 'text-amber-600',
    textDanger: isDark ? 'text-red-400' : 'text-red-600',
    // Borders
    border: isDark ? 'border-white/5' : 'border-slate-200',
    borderAccent: isDark ? 'border-indigo-500/30' : 'border-indigo-200',
    // Inputs
    input: isDark 
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    // Charts
    chartGrid: isDark ? '#334155' : '#e2e8f0',
    chartText: isDark ? '#94a3b8' : '#64748b',
    chartTooltipBg: isDark ? '#1e293b' : '#ffffff',
    // Gradients
    gradientPrimary: 'from-indigo-500 via-purple-500 to-pink-500',
    gradientSuccess: 'from-emerald-500 via-green-500 to-teal-500',
    gradientWarning: 'from-amber-500 via-orange-500 to-red-500',
  };
};

// Tab Configuration
const TABS = [
  { id: 'predictions', label: 'Ensemble Predictions', icon: Brain, color: 'indigo' },
  { id: 'analysis', label: 'Player Analysis', icon: Activity, color: 'cyan' },
  { id: 'value', label: 'Value Finder', icon: Target, color: 'emerald' },
  { id: 'matchups', label: 'Matchup Intel', icon: Shield, color: 'purple' },
  { id: 'models', label: 'Model Lab', icon: Cpu, color: 'pink' },
  { id: 'bankroll', label: 'Bankroll AI', icon: Briefcase, color: 'amber' },
];

// Helper Components
const StatCard = ({ label, value, subValue, icon: Icon, trend, color = 'indigo', ds }) => (
  <div className={`${ds.bgCard} rounded-xl p-4 border ${ds.border}`}>
    <div className="flex items-start justify-between mb-2">
      <span className={ds.textSecondary}>{label}</span>
      {Icon && (
        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
          <Icon className={`w-4 h-4 text-${color}-400`} />
        </div>
      )}
    </div>
    <div className={`text-2xl font-bold ${ds.text}`}>{value}</div>
    {subValue && (
      <div className="flex items-center gap-1 mt-1">
        {trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
        {trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400" />}
        <span className={`text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : ds.textMuted}`}>
          {subValue}
        </span>
      </div>
    )}
  </div>
);

const ConfidenceBadge = ({ confidence, ds }) => {
  const level = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
  const colors = {
    high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
      {confidence}% Confidence
    </span>
  );
};

const LoadingSpinner = ({ ds }) => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full" />
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
    <span className={`ml-3 ${ds.textSecondary}`}>Running ML Analysis...</span>
  </div>
);

// Main Component
export default function MLWorkstation() {
  const ds = useDesignSystem();
  const [activeTab, setActiveTab] = useState('predictions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProp, setSelectedProp] = useState('points');
  const [propLine, setPropLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  
  // Ensemble Predictions State
  const [ensembleResults, setEnsembleResults] = useState(null);
  const [modelComparison, setModelComparison] = useState(null);
  
  // Player Analysis State
  const [consistencyData, setConsistencyData] = useState(null);
  const [situationalSplits, setSituationalSplits] = useState(null);
  const [streakData, setStreakData] = useState(null);
  
  // Value Finder State
  const [evCalculation, setEvCalculation] = useState(null);
  const [correlatedProps, setCorrelatedProps] = useState(null);
  const [valueBets, setValueBets] = useState(null);
  
  // Matchup Intel State
  const [defenseMatchup, setDefenseMatchup] = useState(null);
  const [paceImpact, setPaceImpact] = useState(null);
  const [injuryImpact, setInjuryImpact] = useState(null);
  
  // Bankroll State
  const [bankrollOptimization, setBankrollOptimization] = useState(null);
  const [kellyRecommendation, setKellyRecommendation] = useState(null);

  // Sample players for demo
  const samplePlayers = [
    { id: 1, name: 'LeBron James', team: 'LAL', position: 'SF' },
    { id: 2, name: 'Stephen Curry', team: 'GSW', position: 'PG' },
    { id: 3, name: 'Kevin Durant', team: 'PHX', position: 'SF' },
    { id: 4, name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF' },
    { id: 5, name: 'Luka Doncic', team: 'DAL', position: 'PG' },
    { id: 6, name: 'Jayson Tatum', team: 'BOS', position: 'SF' },
    { id: 7, name: 'Nikola Jokic', team: 'DEN', position: 'C' },
    { id: 8, name: 'Joel Embiid', team: 'PHI', position: 'C' },
  ];

  const filteredPlayers = samplePlayers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Run Ensemble Prediction
  const runEnsemblePrediction = async () => {
    if (!selectedPlayer || !propLine) return;
    
    setLoading(true);
    try {
      const [ensemble, comparison] = await Promise.all([
        mlService.getEnsemblePrediction(selectedPlayer.id, selectedProp, parseFloat(propLine)),
        mlService.compareModels(selectedPlayer.id, selectedProp)
      ]);
      
      setEnsembleResults(ensemble || generateMockEnsembleResults());
      setModelComparison(comparison || generateMockModelComparison());
    } catch (error) {
      console.error('Ensemble prediction error:', error);
      setEnsembleResults(generateMockEnsembleResults());
      setModelComparison(generateMockModelComparison());
    } finally {
      setLoading(false);
    }
  };

  // Run Player Analysis
  const runPlayerAnalysis = async () => {
    if (!selectedPlayer) return;
    
    setLoading(true);
    try {
      const [consistency, splits, streaks] = await Promise.all([
        mlService.analyzeConsistency(selectedPlayer.id, selectedProp),
        mlService.getSituationalSplits(selectedPlayer.id, selectedProp),
        mlService.detectStreaks(selectedPlayer.id, selectedProp)
      ]);
      
      setConsistencyData(consistency || generateMockConsistency());
      setSituationalSplits(splits || generateMockSplits());
      setStreakData(streaks || generateMockStreaks());
    } catch (error) {
      console.error('Player analysis error:', error);
      setConsistencyData(generateMockConsistency());
      setSituationalSplits(generateMockSplits());
      setStreakData(generateMockStreaks());
    } finally {
      setLoading(false);
    }
  };

  // Run Value Finder
  const runValueFinder = async () => {
    if (!selectedPlayer || !propLine) return;
    
    setLoading(true);
    try {
      const [ev, correlated, value] = await Promise.all([
        mlService.calculateEV(selectedPlayer.id, selectedProp, parseFloat(propLine), -110),
        mlService.getCorrelatedProps(selectedPlayer.id),
        mlService.findValueBets(selectedPlayer.id)
      ]);
      
      setEvCalculation(ev || generateMockEV());
      setCorrelatedProps(correlated || generateMockCorrelated());
      setValueBets(value || generateMockValueBets());
    } catch (error) {
      console.error('Value finder error:', error);
      setEvCalculation(generateMockEV());
      setCorrelatedProps(generateMockCorrelated());
      setValueBets(generateMockValueBets());
    } finally {
      setLoading(false);
    }
  };

  // Run Matchup Intel
  const runMatchupIntel = async () => {
    if (!selectedPlayer) return;
    
    setLoading(true);
    try {
      const [defense, pace, injury] = await Promise.all([
        mlService.analyzeDefensiveMatchup(selectedPlayer.id, 'LAC'),
        mlService.analyzePaceImpact(selectedPlayer.id, 'LAC'),
        mlService.analyzeInjuryImpact(selectedPlayer.id)
      ]);
      
      setDefenseMatchup(defense || generateMockDefense());
      setPaceImpact(pace || generateMockPace());
      setInjuryImpact(injury || generateMockInjury());
    } catch (error) {
      console.error('Matchup intel error:', error);
      setDefenseMatchup(generateMockDefense());
      setPaceImpact(generateMockPace());
      setInjuryImpact(generateMockInjury());
    } finally {
      setLoading(false);
    }
  };

  // Run Bankroll Optimization
  const runBankrollOptimization = async () => {
    setLoading(true);
    try {
      const optimization = await mlService.optimizeBankroll(1000, 'moderate');
      setBankrollOptimization(optimization || generateMockBankroll());
    } catch (error) {
      console.error('Bankroll optimization error:', error);
      setBankrollOptimization(generateMockBankroll());
    } finally {
      setLoading(false);
    }
  };

  // Mock Data Generators
  const generateMockEnsembleResults = () => ({
    prediction: 27.5,
    confidence: 78,
    recommendation: 'OVER',
    edge: 6.2,
    models: [
      { name: 'XGBoost', prediction: 28.1, confidence: 82, weight: 0.35 },
      { name: 'Random Forest', prediction: 26.8, confidence: 75, weight: 0.25 },
      { name: 'LSTM Neural Net', prediction: 27.9, confidence: 79, weight: 0.25 },
      { name: 'Gradient Boost', prediction: 27.2, confidence: 76, weight: 0.15 },
    ],
    historicalAccuracy: {
      overall: 68.5,
      lastWeek: 72.3,
      lastMonth: 69.1,
    },
    probabilityDistribution: Array.from({ length: 15 }, (_, i) => ({
      value: 20 + i * 2,
      probability: Math.exp(-Math.pow(20 + i * 2 - 27.5, 2) / 50) * 100
    }))
  });

  const generateMockModelComparison = () => ({
    models: [
      { name: 'XGBoost', accuracy: 72.3, precision: 0.74, recall: 0.71, f1: 0.72, roi: 8.5 },
      { name: 'Random Forest', accuracy: 68.9, precision: 0.70, recall: 0.68, f1: 0.69, roi: 5.2 },
      { name: 'LSTM', accuracy: 70.1, precision: 0.72, recall: 0.69, f1: 0.70, roi: 6.8 },
      { name: 'Ensemble', accuracy: 74.5, precision: 0.76, recall: 0.73, f1: 0.74, roi: 11.2 },
    ],
    historicalPerformance: Array.from({ length: 10 }, (_, i) => ({
      week: `W${i + 1}`,
      xgboost: 65 + Math.random() * 15,
      rf: 62 + Math.random() * 15,
      lstm: 64 + Math.random() * 15,
      ensemble: 68 + Math.random() * 15,
    }))
  });

  const generateMockConsistency = () => ({
    consistencyScore: 76,
    standardDeviation: 4.2,
    coefficientOfVariation: 0.15,
    hitRate: { over: 58, under: 42 },
    streakData: Array.from({ length: 20 }, (_, i) => ({
      game: i + 1,
      actual: 22 + Math.random() * 12,
      line: 25.5,
      hit: Math.random() > 0.4
    })),
    distribution: {
      belowLine: 35,
      nearLine: 25,
      aboveLine: 40,
    }
  });

  const generateMockSplits = () => ({
    homeAway: {
      home: { avg: 28.3, games: 20, hitRate: 62 },
      away: { avg: 24.8, games: 21, hitRate: 52 }
    },
    vsConference: {
      east: { avg: 27.1, games: 18, hitRate: 58 },
      west: { avg: 25.9, games: 23, hitRate: 54 }
    },
    restDays: {
      backToBack: { avg: 23.4, games: 8, hitRate: 45 },
      oneDay: { avg: 26.5, games: 22, hitRate: 58 },
      twoPlusDays: { avg: 28.9, games: 11, hitRate: 68 }
    },
    clutchTime: {
      close: { avg: 8.2, games: 15, hitRate: 60 },
      blowout: { avg: 5.1, games: 10, hitRate: 48 }
    }
  });

  const generateMockStreaks = () => ({
    currentStreak: { type: 'over', length: 4 },
    longestStreak: { type: 'over', length: 7 },
    averageStreak: 2.8,
    streakAfterOver: { nextOver: 55, nextUnder: 45 },
    streakAfterUnder: { nextOver: 52, nextUnder: 48 },
    recentPattern: ['O', 'O', 'U', 'O', 'O', 'O', 'U', 'O', 'U', 'O'],
    momentum: 72
  });

  const generateMockEV = () => ({
    expectedValue: 5.8,
    impliedProbability: 52.4,
    modelProbability: 58.2,
    edge: 5.8,
    kellyBet: 2.4,
    breakeven: 52.4,
    roi: 11.1,
    grade: 'B+',
    recommendation: 'BET',
    scenarios: [
      { outcome: 'Over', probability: 58.2, payout: '+91', ev: '+$5.80' },
      { outcome: 'Under', probability: 41.8, payout: '-100', ev: '-$5.80' },
    ]
  });

  const generateMockCorrelated = () => ({
    correlations: [
      { prop: 'Points', stat: 'Assists', correlation: 0.72, description: 'High scoring games often mean more assists' },
      { prop: 'Points', stat: 'Minutes', correlation: 0.85, description: 'More minutes = more scoring opportunities' },
      { prop: 'Points', stat: 'FGA', correlation: 0.91, description: 'Shot volume strongly correlates with points' },
      { prop: 'Rebounds', stat: 'Minutes', correlation: 0.78, description: 'Extended play increases rebounding chances' },
    ],
    sameGameParlays: [
      { props: ['Over 25.5 PTS', 'Over 6.5 AST'], correlation: 0.68, boost: '+15%' },
      { props: ['Over 25.5 PTS', 'Over 7.5 REB'], correlation: 0.45, boost: '+8%' },
      { props: ['Over 6.5 AST', 'Over 2.5 3PM'], correlation: 0.52, boost: '+10%' },
    ]
  });

  const generateMockValueBets = () => ({
    valueBets: [
      { player: 'LeBron James', prop: 'Points', line: 25.5, edge: 8.2, confidence: 78, recommendation: 'OVER' },
      { player: 'Stephen Curry', prop: '3PM', line: 4.5, edge: 6.5, confidence: 72, recommendation: 'OVER' },
      { player: 'Nikola Jokic', prop: 'Assists', line: 8.5, edge: 7.1, confidence: 75, recommendation: 'OVER' },
      { player: 'Giannis', prop: 'Rebounds', line: 11.5, edge: 5.8, confidence: 68, recommendation: 'UNDER' },
    ],
    summary: {
      totalOpportunities: 12,
      highValue: 4,
      mediumValue: 5,
      lowValue: 3,
      averageEdge: 6.2
    }
  });

  const generateMockDefense = () => ({
    defenseRating: 108.5,
    positionRating: 'B-',
    allowedAverage: 26.8,
    adjustment: +2.3,
    keyDefenders: [
      { name: 'Kawhi Leonard', rating: 92, minutes: 32 },
      { name: 'Paul George', rating: 88, minutes: 34 },
    ],
    historical: Array.from({ length: 5 }, (_, i) => ({
      date: `Game ${i + 1}`,
      points: 22 + Math.random() * 10,
      vsDefense: 105 + Math.random() * 10
    })),
    recommendation: 'Slight positive matchup'
  });

  const generateMockPace = () => ({
    teamPace: 102.3,
    opponentPace: 98.7,
    expectedPace: 100.5,
    leagueAverage: 100.0,
    paceAdjustment: +0.5,
    possessionImpact: '+1.2 extra possessions',
    scoringOpportunities: 'Slightly Above Average',
    historicalInPace: [
      { paceRange: '95-98', avgPoints: 23.2 },
      { paceRange: '98-102', avgPoints: 25.8 },
      { paceRange: '102-106', avgPoints: 28.4 },
      { paceRange: '106+', avgPoints: 30.1 },
    ]
  });

  const generateMockInjury = () => ({
    playerStatus: 'Healthy',
    recentInjuries: [],
    teamInjuries: [
      { player: 'Anthony Davis', status: 'Questionable', impact: 'If out: +3.2 usage rate boost' },
    ],
    opponentInjuries: [
      { player: 'Kawhi Leonard', status: 'Out', impact: 'Defensive downgrade: +2.1 expected points' },
    ],
    netImpact: '+5.3 expected points',
    confidence: 72
  });

  const generateMockBankroll = () => ({
    currentBankroll: 1000,
    recommendedBetSize: 25,
    kellyPercentage: 2.5,
    riskLevel: 'Moderate',
    expectedGrowth: 8.2,
    drawdownRisk: 12.5,
    optimalBets: [
      { bet: 'LeBron Over 25.5 PTS', size: 30, ev: 5.8, risk: 'Medium' },
      { bet: 'Curry Over 4.5 3PM', size: 25, ev: 4.2, risk: 'Medium' },
      { bet: 'Jokic Over 8.5 AST', size: 20, ev: 3.5, risk: 'Low' },
    ],
    projectedPerformance: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      bankroll: 1000 * Math.pow(1.003, i) + (Math.random() - 0.5) * 50,
      projection: 1000 * Math.pow(1.003, i)
    }))
  });

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <EnsemblePredictionsTab 
          ds={ds} 
          selectedPlayer={selectedPlayer}
          selectedProp={selectedProp}
          setSelectedProp={setSelectedProp}
          propLine={propLine}
          setPropLine={setPropLine}
          loading={loading}
          runEnsemblePrediction={runEnsemblePrediction}
          ensembleResults={ensembleResults}
          modelComparison={modelComparison}
        />;
      case 'analysis':
        return <PlayerAnalysisTab 
          ds={ds}
          selectedPlayer={selectedPlayer}
          selectedProp={selectedProp}
          loading={loading}
          runPlayerAnalysis={runPlayerAnalysis}
          consistencyData={consistencyData}
          situationalSplits={situationalSplits}
          streakData={streakData}
        />;
      case 'value':
        return <ValueFinderTab 
          ds={ds}
          selectedPlayer={selectedPlayer}
          propLine={propLine}
          loading={loading}
          runValueFinder={runValueFinder}
          evCalculation={evCalculation}
          correlatedProps={correlatedProps}
          valueBets={valueBets}
        />;
      case 'matchups':
        return <MatchupIntelTab 
          ds={ds}
          selectedPlayer={selectedPlayer}
          loading={loading}
          runMatchupIntel={runMatchupIntel}
          defenseMatchup={defenseMatchup}
          paceImpact={paceImpact}
          injuryImpact={injuryImpact}
        />;
      case 'models':
        return <ModelLabTab 
          ds={ds}
          modelComparison={modelComparison}
          ensembleResults={ensembleResults}
        />;
      case 'bankroll':
        return <BankrollAITab 
          ds={ds}
          loading={loading}
          runBankrollOptimization={runBankrollOptimization}
          bankrollOptimization={bankrollOptimization}
        />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${ds.bgGradient}`}>
      {/* Header */}
      <div className={`${ds.bgCard} backdrop-blur-xl border-b ${ds.border} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${ds.text}`}>ML Workstation</h1>
                <p className={ds.textSecondary}>Elite v3.0 • Advanced Machine Learning Analysis</p>
              </div>
            </div>
            
            {/* Player Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${ds.textMuted}`} />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64`}
              />
              
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className={`absolute top-full mt-2 w-full ${ds.bgCard} backdrop-blur-xl border ${ds.border} rounded-xl shadow-xl overflow-hidden z-50`}>
                  {filteredPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayer(player);
                        setSearchQuery('');
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 ${ds.bgCardHover} transition-colors`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{player.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="text-left">
                        <div className={ds.text}>{player.name}</div>
                        <div className={`text-xs ${ds.textMuted}`}>{player.team} • {player.position}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Player Badge */}
          {selectedPlayer && (
            <div className="mt-4 flex items-center gap-2">
              <span className={ds.textSecondary}>Analyzing:</span>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${ds.bgAccent} border ${ds.borderAccent}`}>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{selectedPlayer.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <span className={ds.textAccent}>{selectedPlayer.name}</span>
                <span className={ds.textMuted}>• {selectedPlayer.team}</span>
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30`
                    : `${ds.textSecondary} hover:bg-white/5`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

// ==================== TAB COMPONENTS ====================

// Ensemble Predictions Tab
function EnsemblePredictionsTab({ ds, selectedPlayer, selectedProp, setSelectedProp, propLine, setPropLine, loading, runEnsemblePrediction, ensembleResults, modelComparison }) {
  const propTypes = ['points', 'rebounds', 'assists', 'threes', 'steals', 'blocks', 'pts+reb+ast'];
  
  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
          <Layers className="w-5 h-5 text-indigo-400" />
          Ensemble Prediction Engine
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm ${ds.textSecondary} mb-2`}>Prop Type</label>
            <select
              value={selectedProp}
              onChange={(e) => setSelectedProp(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
            >
              {propTypes.map(prop => (
                <option key={prop} value={prop}>{prop.charAt(0).toUpperCase() + prop.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm ${ds.textSecondary} mb-2`}>Line</label>
            <input
              type="number"
              step="0.5"
              value={propLine}
              onChange={(e) => setPropLine(e.target.value)}
              placeholder="e.g., 25.5"
              className={`w-full px-4 py-2 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={runEnsemblePrediction}
              disabled={!selectedPlayer || !propLine || loading}
              className="w-full px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              Run Ensemble
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner ds={ds} />}

      {!loading && ensembleResults && (
        <>
          {/* Main Prediction */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${ds.text} flex items-center gap-2`}>
                  <Target className="w-5 h-5 text-emerald-400" />
                  Ensemble Prediction
                </h3>
                <p className={ds.textSecondary}>Combined output from {ensembleResults.models.length} ML models</p>
              </div>
              <ConfidenceBadge confidence={ensembleResults.confidence} ds={ds} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                label="Prediction" 
                value={ensembleResults.prediction} 
                icon={Activity}
                color="indigo"
                ds={ds}
              />
              <StatCard 
                label="Recommendation" 
                value={ensembleResults.recommendation}
                subValue={`${ensembleResults.edge}% edge`}
                trend={ensembleResults.recommendation === 'OVER' ? 'up' : 'down'}
                icon={ensembleResults.recommendation === 'OVER' ? TrendingUp : TrendingDown}
                color={ensembleResults.recommendation === 'OVER' ? 'emerald' : 'red'}
                ds={ds}
              />
              <StatCard 
                label="Line" 
                value={propLine}
                icon={Target}
                color="purple"
                ds={ds}
              />
              <StatCard 
                label="Historical Accuracy" 
                value={`${ensembleResults.historicalAccuracy.overall}%`}
                subValue={`${ensembleResults.historicalAccuracy.lastWeek}% last week`}
                trend="up"
                icon={Award}
                color="amber"
                ds={ds}
              />
            </div>

            {/* Probability Distribution Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ensembleResults.probabilityDistribution}>
                  <defs>
                    <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} vertical={false} />
                  <XAxis dataKey="value" stroke={ds.chartText} fontSize={12} />
                  <YAxis stroke={ds.chartText} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: ds.chartTooltipBg, 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                    }}
                  />
                  <ReferenceLine x={parseFloat(propLine)} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Line', fill: '#f59e0b' }} />
                  <ReferenceLine x={ensembleResults.prediction} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Pred', fill: '#10b981' }} />
                  <Area type="monotone" dataKey="probability" stroke="#6366f1" fill="url(#probGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Breakdown */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
              <GitBranch className="w-5 h-5 text-purple-400" />
              Model Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ensembleResults.models.map((model, idx) => (
                <div key={idx} className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4 border ${ds.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-medium ${ds.text}`}>{model.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${ds.bgAccent} ${ds.textAccent}`}>
                      {(model.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${ds.text}`}>{model.prediction}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${model.confidence}%` }}
                      />
                    </div>
                    <span className={`text-xs ${ds.textMuted}`}>{model.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedPlayer && !loading && (
        <div className={`${ds.bgCard} rounded-2xl p-12 border ${ds.border} text-center`}>
          <Search className={`w-12 h-12 mx-auto ${ds.textMuted} mb-4`} />
          <h3 className={`text-lg font-semibold ${ds.text} mb-2`}>Select a Player</h3>
          <p className={ds.textSecondary}>Search for a player above to run ensemble predictions</p>
        </div>
      )}
    </div>
  );
}

// Player Analysis Tab
function PlayerAnalysisTab({ ds, selectedPlayer, selectedProp, loading, runPlayerAnalysis, consistencyData, situationalSplits, streakData }) {
  return (
    <div className="space-y-6">
      {/* Run Analysis Button */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${ds.text} flex items-center gap-2`}>
              <Activity className="w-5 h-5 text-cyan-400" />
              Deep Player Analysis
            </h3>
            <p className={ds.textSecondary}>Consistency, situational splits, and streak detection</p>
          </div>
          <button
            onClick={runPlayerAnalysis}
            disabled={!selectedPlayer || loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Analyze Player
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner ds={ds} />}

      {!loading && consistencyData && (
        <>
          {/* Consistency Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <Target className="w-4 h-4 text-emerald-400" />
                Consistency Score
              </h4>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke={ds.isDark ? '#334155' : '#e2e8f0'} strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke="url(#consistencyGradient)" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${consistencyData.consistencyScore * 3.52} 352`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="consistencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${ds.text}`}>{consistencyData.consistencyScore}</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className={ds.textSecondary}>σ = {consistencyData.standardDeviation}</div>
                <div className={`text-xs ${ds.textMuted}`}>CV = {consistencyData.coefficientOfVariation}</div>
              </div>
            </div>

            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Hit Rate Distribution
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={ds.textSecondary}>Over</span>
                    <span className="text-emerald-400">{consistencyData.hitRate.over}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                      style={{ width: `${consistencyData.hitRate.over}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={ds.textSecondary}>Under</span>
                    <span className="text-red-400">{consistencyData.hitRate.under}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                      style={{ width: `${consistencyData.hitRate.under}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {streakData && (
              <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                  <Flame className="w-4 h-4 text-orange-400" />
                  Streak Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Current Streak</span>
                    <span className={`font-bold ${streakData.currentStreak.type === 'over' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {streakData.currentStreak.length} {streakData.currentStreak.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Longest Streak</span>
                    <span className={`font-bold ${ds.text}`}>{streakData.longestStreak.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Momentum</span>
                    <span className={`font-bold ${ds.textAccent}`}>{streakData.momentum}%</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {streakData.recentPattern.map((p, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          p === 'O' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Situational Splits */}
          {situationalSplits && (
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-6 flex items-center gap-2`}>
                <Boxes className="w-5 h-5 text-purple-400" />
                Situational Splits
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Home/Away */}
                <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                  <h5 className={`text-sm font-medium ${ds.textSecondary} mb-3`}>Home vs Away</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={ds.text}>🏠 Home</span>
                      <span className="text-emerald-400">{situationalSplits.homeAway.home.avg} avg ({situationalSplits.homeAway.home.hitRate}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.text}>✈️ Away</span>
                      <span className="text-amber-400">{situationalSplits.homeAway.away.avg} avg ({situationalSplits.homeAway.away.hitRate}%)</span>
                    </div>
                  </div>
                </div>

                {/* Rest Days */}
                <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                  <h5 className={`text-sm font-medium ${ds.textSecondary} mb-3`}>Rest Days</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={ds.text}>B2B</span>
                      <span className="text-red-400">{situationalSplits.restDays.backToBack.avg} avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.text}>1 Day</span>
                      <span className="text-amber-400">{situationalSplits.restDays.oneDay.avg} avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.text}>2+ Days</span>
                      <span className="text-emerald-400">{situationalSplits.restDays.twoPlusDays.avg} avg</span>
                    </div>
                  </div>
                </div>

                {/* Conference */}
                <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                  <h5 className={`text-sm font-medium ${ds.textSecondary} mb-3`}>vs Conference</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={ds.text}>vs East</span>
                      <span className="text-blue-400">{situationalSplits.vsConference.east.avg} avg ({situationalSplits.vsConference.east.hitRate}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.text}>vs West</span>
                      <span className="text-purple-400">{situationalSplits.vsConference.west.avg} avg ({situationalSplits.vsConference.west.hitRate}%)</span>
                    </div>
                  </div>
                </div>

                {/* Clutch */}
                <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                  <h5 className={`text-sm font-medium ${ds.textSecondary} mb-3`}>Game Type</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={ds.text}>Close Games</span>
                      <span className="text-emerald-400">{situationalSplits.clutchTime.close.avg} 4Q pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.text}>Blowouts</span>
                      <span className="text-slate-400">{situationalSplits.clutchTime.blowout.avg} 4Q pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Chart */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-4`}>Recent Performance vs Line</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={consistencyData.streakData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} vertical={false} />
                  <XAxis dataKey="game" stroke={ds.chartText} fontSize={12} />
                  <YAxis stroke={ds.chartText} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: ds.chartTooltipBg, 
                      border: 'none', 
                      borderRadius: '12px' 
                    }}
                  />
                  <ReferenceLine y={consistencyData.streakData[0]?.line} stroke="#f59e0b" strokeDasharray="5 5" />
                  <Bar dataKey="actual" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {consistencyData.streakData.map((entry, index) => (
                      <Cell key={index} fill={entry.hit ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {!selectedPlayer && !loading && (
        <div className={`${ds.bgCard} rounded-2xl p-12 border ${ds.border} text-center`}>
          <Activity className={`w-12 h-12 mx-auto ${ds.textMuted} mb-4`} />
          <h3 className={`text-lg font-semibold ${ds.text} mb-2`}>Select a Player</h3>
          <p className={ds.textSecondary}>Search for a player above to analyze their performance patterns</p>
        </div>
      )}
    </div>
  );
}

// Value Finder Tab
function ValueFinderTab({ ds, selectedPlayer, propLine, loading, runValueFinder, evCalculation, correlatedProps, valueBets }) {
  return (
    <div className="space-y-6">
      {/* Run Value Finder */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${ds.text} flex items-center gap-2`}>
              <Target className="w-5 h-5 text-emerald-400" />
              Value Bet Finder
            </h3>
            <p className={ds.textSecondary}>Calculate EV, find correlated props, and discover value bets</p>
          </div>
          <button
            onClick={runValueFinder}
            disabled={!selectedPlayer || !propLine || loading}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            Find Value
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner ds={ds} />}

      {!loading && evCalculation && (
        <>
          {/* EV Calculation */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-6 flex items-center gap-2`}>
              <Calculator className="w-5 h-5 text-emerald-400" />
              Expected Value Analysis
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Expected Value" value={`+$${evCalculation.expectedValue}`} icon={DollarSign} color="emerald" ds={ds} />
              <StatCard label="Edge" value={`${evCalculation.edge}%`} icon={TrendingUp} color="indigo" ds={ds} />
              <StatCard label="Kelly Bet" value={`${evCalculation.kellyBet}%`} icon={Percent} color="amber" ds={ds} />
              <StatCard label="Grade" value={evCalculation.grade} icon={Award} color="purple" ds={ds} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                <h5 className={`font-medium ${ds.text} mb-3`}>Probability Breakdown</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Implied Probability</span>
                    <span className={ds.text}>{evCalculation.impliedProbability}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Model Probability</span>
                    <span className="text-emerald-400 font-bold">{evCalculation.modelProbability}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={ds.textSecondary}>Breakeven</span>
                    <span className={ds.text}>{evCalculation.breakeven}%</span>
                  </div>
                </div>
              </div>

              <div className={`${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} rounded-xl p-4`}>
                <h5 className={`font-medium ${ds.text} mb-3`}>Scenarios</h5>
                <div className="space-y-2">
                  {evCalculation.scenarios.map((scenario, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-2 rounded-lg ${scenario.outcome === 'Over' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      <span className={scenario.outcome === 'Over' ? 'text-emerald-400' : 'text-red-400'}>{scenario.outcome}</span>
                      <span className={ds.textSecondary}>{scenario.probability}%</span>
                      <span className={ds.text}>{scenario.payout}</span>
                      <span className={scenario.outcome === 'Over' ? 'text-emerald-400' : 'text-red-400'}>{scenario.ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`mt-6 p-4 rounded-xl ${evCalculation.recommendation === 'BET' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
              <div className="flex items-center gap-3">
                {evCalculation.recommendation === 'BET' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                )}
                <div>
                  <div className={`font-bold ${evCalculation.recommendation === 'BET' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {evCalculation.recommendation === 'BET' ? 'Positive EV - Bet Recommended' : 'Low Edge - Consider Passing'}
                  </div>
                  <div className={ds.textSecondary}>
                    Expected ROI: {evCalculation.roi}% | Risk-adjusted Kelly: {evCalculation.kellyBet}% of bankroll
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Correlated Props */}
          {correlatedProps && (
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-6 flex items-center gap-2`}>
                <Layers className="w-5 h-5 text-purple-400" />
                Correlated Props
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className={`font-medium ${ds.textSecondary} mb-3`}>Stat Correlations</h5>
                  <div className="space-y-3">
                    {correlatedProps.correlations.map((corr, idx) => (
                      <div key={idx} className={`p-3 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={ds.text}>{corr.prop} ↔ {corr.stat}</span>
                          <span className={`font-bold ${corr.correlation > 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            r = {corr.correlation.toFixed(2)}
                          </span>
                        </div>
                        <div className={`text-xs ${ds.textMuted}`}>{corr.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className={`font-medium ${ds.textSecondary} mb-3`}>Same-Game Parlay Ideas</h5>
                  <div className="space-y-3">
                    {correlatedProps.sameGameParlays.map((sgp, idx) => (
                      <div key={idx} className={`p-3 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} border-l-4 border-purple-500`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className={ds.text}>{sgp.props.join(' + ')}</div>
                          <span className="text-emerald-400 font-bold">{sgp.boost}</span>
                        </div>
                        <div className={`text-xs ${ds.textMuted}`}>Correlation: {sgp.correlation.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Value Bets Scanner */}
          {valueBets && (
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-6 flex items-center gap-2`}>
                <Eye className="w-5 h-5 text-amber-400" />
                Value Bet Scanner
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Opportunities" value={valueBets.summary.totalOpportunities} icon={Target} color="indigo" ds={ds} />
                <StatCard label="High Value" value={valueBets.summary.highValue} icon={Zap} color="emerald" ds={ds} />
                <StatCard label="Medium Value" value={valueBets.summary.mediumValue} icon={Activity} color="amber" ds={ds} />
                <StatCard label="Avg Edge" value={`${valueBets.summary.averageEdge}%`} icon={TrendingUp} color="purple" ds={ds} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${ds.border}`}>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Player</th>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Prop</th>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Line</th>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Edge</th>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Confidence</th>
                      <th className={`text-left py-3 px-4 ${ds.textSecondary}`}>Pick</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valueBets.valueBets.map((bet, idx) => (
                      <tr key={idx} className={`border-b ${ds.border} ${ds.bgCardHover}`}>
                        <td className={`py-3 px-4 ${ds.text}`}>{bet.player}</td>
                        <td className={`py-3 px-4 ${ds.textSecondary}`}>{bet.prop}</td>
                        <td className={`py-3 px-4 ${ds.text}`}>{bet.line}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${bet.edge > 7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            +{bet.edge}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <ConfidenceBadge confidence={bet.confidence} ds={ds} />
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            bet.recommendation === 'OVER' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {bet.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!selectedPlayer && !loading && (
        <div className={`${ds.bgCard} rounded-2xl p-12 border ${ds.border} text-center`}>
          <Target className={`w-12 h-12 mx-auto ${ds.textMuted} mb-4`} />
          <h3 className={`text-lg font-semibold ${ds.text} mb-2`}>Select a Player & Line</h3>
          <p className={ds.textSecondary}>Search for a player and enter a line to find value</p>
        </div>
      )}
    </div>
  );
}

// Matchup Intel Tab
function MatchupIntelTab({ ds, selectedPlayer, loading, runMatchupIntel, defenseMatchup, paceImpact, injuryImpact }) {
  return (
    <div className="space-y-6">
      {/* Run Matchup Intel */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${ds.text} flex items-center gap-2`}>
              <Shield className="w-5 h-5 text-purple-400" />
              Matchup Intelligence
            </h3>
            <p className={ds.textSecondary}>Defensive matchups, pace analysis, and injury impact</p>
          </div>
          <button
            onClick={runMatchupIntel}
            disabled={!selectedPlayer || loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Analyze Matchup
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner ds={ds} />}

      {!loading && defenseMatchup && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Defensive Matchup */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
              <Shield className="w-5 h-5 text-red-400" />
              Defensive Analysis
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard label="Defense Rating" value={defenseMatchup.defenseRating} icon={Shield} color="red" ds={ds} />
              <StatCard label="Position Grade" value={defenseMatchup.positionRating} icon={Award} color="amber" ds={ds} />
            </div>

            <div className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} mb-4`}>
              <div className="flex justify-between mb-2">
                <span className={ds.textSecondary}>Allowed Avg vs Position</span>
                <span className={ds.text}>{defenseMatchup.allowedAverage}</span>
              </div>
              <div className="flex justify-between">
                <span className={ds.textSecondary}>Matchup Adjustment</span>
                <span className={defenseMatchup.adjustment > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {defenseMatchup.adjustment > 0 ? '+' : ''}{defenseMatchup.adjustment}
                </span>
              </div>
            </div>

            <div>
              <h5 className={`text-sm ${ds.textSecondary} mb-2`}>Key Defenders</h5>
              <div className="space-y-2">
                {defenseMatchup.keyDefenders.map((def, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-2 rounded-lg ${ds.isDark ? 'bg-white/[0.02]' : 'bg-slate-100'}`}>
                    <span className={ds.text}>{def.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={ds.textMuted}>{def.minutes} min</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${def.rating >= 90 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {def.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30`}>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span className={ds.textAccent}>{defenseMatchup.recommendation}</span>
              </div>
            </div>
          </div>

          {/* Pace Impact */}
          {paceImpact && (
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <Timer className="w-5 h-5 text-cyan-400" />
                Pace Analysis
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard label="Expected Pace" value={paceImpact.expectedPace} icon={Activity} color="cyan" ds={ds} />
                <StatCard label="Pace Adjustment" value={`${paceImpact.paceAdjustment > 0 ? '+' : ''}${paceImpact.paceAdjustment}`} icon={TrendingUp} color="emerald" ds={ds} />
              </div>

              <div className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} mb-4`}>
                <div className="flex justify-between mb-2">
                  <span className={ds.textSecondary}>Team Pace</span>
                  <span className={ds.text}>{paceImpact.teamPace}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={ds.textSecondary}>Opponent Pace</span>
                  <span className={ds.text}>{paceImpact.opponentPace}</span>
                </div>
                <div className="flex justify-between">
                  <span className={ds.textSecondary}>League Average</span>
                  <span className={ds.textMuted}>{paceImpact.leagueAverage}</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl ${ds.bgAccent} border ${ds.borderAccent}`}>
                <div className={ds.textAccent}>{paceImpact.possessionImpact}</div>
                <div className={`text-xs ${ds.textMuted}`}>Scoring Opportunities: {paceImpact.scoringOpportunities}</div>
              </div>

              <div className="mt-4">
                <h5 className={`text-sm ${ds.textSecondary} mb-2`}>Historical Performance by Pace</h5>
                <div className="space-y-2">
                  {paceImpact.historicalInPace.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className={ds.textMuted}>{h.paceRange}</span>
                      <span className={`font-medium ${h.avgPoints > 27 ? 'text-emerald-400' : ds.text}`}>{h.avgPoints} avg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Injury Impact */}
          {injuryImpact && (
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border} lg:col-span-2`}>
              <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Injury Impact Analysis
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className={`text-sm ${ds.textSecondary} mb-3`}>Player Status</h5>
                  <div className={`p-4 rounded-xl ${injuryImpact.playerStatus === 'Healthy' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <div className="flex items-center gap-2">
                      {injuryImpact.playerStatus === 'Healthy' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={injuryImpact.playerStatus === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}>
                        {injuryImpact.playerStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className={`text-sm ${ds.textSecondary} mb-3`}>Teammate Injuries</h5>
                  {injuryImpact.teamInjuries.length > 0 ? (
                    <div className="space-y-2">
                      {injuryImpact.teamInjuries.map((inj, idx) => (
                        <div key={idx} className={`p-3 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={ds.text}>{inj.player}</span>
                            <span className="text-amber-400 text-xs">{inj.status}</span>
                          </div>
                          <div className={`text-xs ${ds.textMuted}`}>{inj.impact}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} text-center ${ds.textMuted}`}>
                      No significant injuries
                    </div>
                  )}
                </div>

                <div>
                  <h5 className={`text-sm ${ds.textSecondary} mb-3`}>Opponent Injuries</h5>
                  {injuryImpact.opponentInjuries.length > 0 ? (
                    <div className="space-y-2">
                      {injuryImpact.opponentInjuries.map((inj, idx) => (
                        <div key={idx} className={`p-3 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={ds.text}>{inj.player}</span>
                            <span className="text-red-400 text-xs">{inj.status}</span>
                          </div>
                          <div className={`text-xs text-emerald-400`}>{inj.impact}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} text-center ${ds.textMuted}`}>
                      No significant injuries
                    </div>
                  )}
                </div>
              </div>

              {/* Net Impact */}
              <div className={`mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className={`font-bold ${ds.text}`}>Net Injury Impact</div>
                      <div className={ds.textSecondary}>Combined effect on player projection</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{injuryImpact.netImpact}</div>
                    <div className={`text-xs ${ds.textMuted}`}>{injuryImpact.confidence}% confidence</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedPlayer && !loading && (
        <div className={`${ds.bgCard} rounded-2xl p-12 border ${ds.border} text-center`}>
          <Shield className={`w-12 h-12 mx-auto ${ds.textMuted} mb-4`} />
          <h3 className={`text-lg font-semibold ${ds.text} mb-2`}>Select a Player</h3>
          <p className={ds.textSecondary}>Search for a player above to analyze their matchup</p>
        </div>
      )}
    </div>
  );
}

// Model Lab Tab
function ModelLabTab({ ds, modelComparison, ensembleResults }) {
  // Generate default comparison data if not available
  const comparison = modelComparison || {
    models: [
      { name: 'XGBoost', accuracy: 72.3, precision: 0.74, recall: 0.71, f1: 0.72, roi: 8.5 },
      { name: 'Random Forest', accuracy: 68.9, precision: 0.70, recall: 0.68, f1: 0.69, roi: 5.2 },
      { name: 'LSTM', accuracy: 70.1, precision: 0.72, recall: 0.69, f1: 0.70, roi: 6.8 },
      { name: 'Ensemble', accuracy: 74.5, precision: 0.76, recall: 0.73, f1: 0.74, roi: 11.2 },
    ],
    historicalPerformance: Array.from({ length: 10 }, (_, i) => ({
      week: `W${i + 1}`,
      xgboost: 65 + Math.random() * 15,
      rf: 62 + Math.random() * 15,
      lstm: 64 + Math.random() * 15,
      ensemble: 68 + Math.random() * 15,
    }))
  };

  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <h3 className={`text-lg font-semibold ${ds.text} mb-6 flex items-center gap-2`}>
          <Cpu className="w-5 h-5 text-pink-400" />
          Model Laboratory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparison.models.map((model, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl ${model.name === 'Ensemble' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30' : `${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} border ${ds.border}`}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${model.name === 'Ensemble' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-slate-700'}`}>
                  {model.name === 'Ensemble' ? <Sparkles className="w-4 h-4 text-white" /> : <Cpu className="w-4 h-4 text-slate-400" />}
                </div>
                <span className={`font-medium ${ds.text}`}>{model.name}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={ds.textMuted}>Accuracy</span>
                  <span className={`font-bold ${model.accuracy > 72 ? 'text-emerald-400' : ds.text}`}>{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className={ds.textMuted}>Precision</span>
                  <span className={ds.text}>{model.precision}</span>
                </div>
                <div className="flex justify-between">
                  <span className={ds.textMuted}>Recall</span>
                  <span className={ds.text}>{model.recall}</span>
                </div>
                <div className="flex justify-between">
                  <span className={ds.textMuted}>F1 Score</span>
                  <span className={ds.text}>{model.f1}</span>
                </div>
                <div className="flex justify-between">
                  <span className={ds.textMuted}>ROI</span>
                  <span className={`font-bold ${model.roi > 8 ? 'text-emerald-400' : model.roi > 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    +{model.roi}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Performance Chart */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <h4 className={`font-semibold ${ds.text} mb-4`}>Model Accuracy Over Time</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparison.historicalPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} vertical={false} />
              <XAxis dataKey="week" stroke={ds.chartText} fontSize={12} />
              <YAxis stroke={ds.chartText} fontSize={12} domain={[55, 85]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: ds.chartTooltipBg, 
                  border: 'none', 
                  borderRadius: '12px' 
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="xgboost" name="XGBoost" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rf" name="Random Forest" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lstm" name="LSTM" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ensemble" name="Ensemble" stroke="#ec4899" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
          <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
            <Database className="w-5 h-5 text-cyan-400" />
            Feature Importance
          </h4>
          <div className="space-y-3">
            {[
              { feature: 'Recent Performance (L10)', importance: 92 },
              { feature: 'Home/Away Splits', importance: 78 },
              { feature: 'Rest Days', importance: 75 },
              { feature: 'Defensive Rating', importance: 72 },
              { feature: 'Pace Factor', importance: 68 },
              { feature: 'Injury Report', importance: 65 },
              { feature: 'Season Average', importance: 62 },
              { feature: 'Team Correlation', importance: 58 },
            ].map((f, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className={ds.textSecondary}>{f.feature}</span>
                  <span className={ds.text}>{f.importance}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${f.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
          <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
            <GitBranch className="w-5 h-5 text-purple-400" />
            Model Architecture
          </h4>
          <div className="space-y-4">
            {[
              { name: 'XGBoost', layers: '3 Boosting Stages', params: '2.4M', training: '45 epochs' },
              { name: 'Random Forest', layers: '500 Trees', params: '1.8M', training: 'Bagging' },
              { name: 'LSTM', layers: '2 LSTM + 2 Dense', params: '3.1M', training: '100 epochs' },
              { name: 'Ensemble', layers: 'Weighted Average', params: '7.3M', training: 'Meta-learner' },
            ].map((m, idx) => (
              <div key={idx} className={`p-3 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                <div className={`font-medium ${ds.text} mb-2`}>{m.name}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className={ds.textMuted}>Architecture</span>
                    <div className={ds.textSecondary}>{m.layers}</div>
                  </div>
                  <div>
                    <span className={ds.textMuted}>Parameters</span>
                    <div className={ds.textSecondary}>{m.params}</div>
                  </div>
                  <div>
                    <span className={ds.textMuted}>Training</span>
                    <div className={ds.textSecondary}>{m.training}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bankroll AI Tab
function BankrollAITab({ ds, loading, runBankrollOptimization, bankrollOptimization }) {
  const [bankrollAmount, setBankrollAmount] = useState(1000);
  const [riskLevel, setRiskLevel] = useState('moderate');

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
        <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
          <Briefcase className="w-5 h-5 text-amber-400" />
          Bankroll Optimizer AI
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm ${ds.textSecondary} mb-2`}>Bankroll Amount</label>
            <input
              type="number"
              value={bankrollAmount}
              onChange={(e) => setBankrollAmount(parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-2 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>
          
          <div>
            <label className={`block text-sm ${ds.textSecondary} mb-2`}>Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={runBankrollOptimization}
              disabled={loading}
              className="w-full px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
              Optimize
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner ds={ds} />}

      {!loading && bankrollOptimization && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Recommended Bet Size" value={`$${bankrollOptimization.recommendedBetSize}`} icon={DollarSign} color="emerald" ds={ds} />
            <StatCard label="Kelly %" value={`${bankrollOptimization.kellyPercentage}%`} icon={Percent} color="indigo" ds={ds} />
            <StatCard label="Expected Growth" value={`+${bankrollOptimization.expectedGrowth}%`} trend="up" icon={TrendingUp} color="cyan" ds={ds} />
            <StatCard label="Drawdown Risk" value={`${bankrollOptimization.drawdownRisk}%`} icon={AlertTriangle} color="amber" ds={ds} />
          </div>

          {/* Optimal Bets */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
              <Target className="w-5 h-5 text-emerald-400" />
              Optimal Bet Sizing
            </h4>
            
            <div className="space-y-3">
              {bankrollOptimization.optimalBets.map((bet, idx) => (
                <div key={idx} className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} border ${ds.border}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${ds.text}`}>{bet.bet}</div>
                      <div className={`text-sm ${ds.textMuted}`}>EV: +{bet.ev}% | Risk: {bet.risk}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">${bet.size}</div>
                      <div className={`text-xs ${ds.textMuted}`}>{((bet.size / bankrollOptimization.currentBankroll) * 100).toFixed(1)}% of bankroll</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Performance */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-4`}>30-Day Projection</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bankrollOptimization.projectedPerformance}>
                  <defs>
                    <linearGradient id="bankrollGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} vertical={false} />
                  <XAxis dataKey="day" stroke={ds.chartText} fontSize={12} />
                  <YAxis stroke={ds.chartText} fontSize={12} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: ds.chartTooltipBg, 
                      border: 'none', 
                      borderRadius: '12px' 
                    }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Bankroll']}
                  />
                  <Area type="monotone" dataKey="bankroll" stroke="#f59e0b" fill="url(#bankrollGradient)" strokeWidth={2} />
                  <Line type="monotone" dataKey="projection" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Management Tips */}
          <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
            <h4 className={`font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5 text-amber-400" />
              AI Recommendations
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${ds.bgSuccess} border border-emerald-500/30`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <div className={`font-medium ${ds.textSuccess}`}>Best Practice</div>
                    <div className={ds.textSecondary}>Never bet more than {bankrollOptimization.kellyPercentage * 2}% on a single wager to manage variance.</div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${ds.bgWarning} border border-amber-500/30`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className={`font-medium ${ds.textWarning}`}>Risk Alert</div>
                    <div className={ds.textSecondary}>Current drawdown risk of {bankrollOptimization.drawdownRisk}% suggests maintaining discipline on losing streaks.</div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${ds.bgAccent} border ${ds.borderAccent}`}>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <div className={`font-medium ${ds.textAccent}`}>Growth Strategy</div>
                    <div className={ds.textSecondary}>At current edge, expect ~{bankrollOptimization.expectedGrowth}% monthly growth with consistent betting.</div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${ds.isDark ? 'bg-white/[0.03]' : 'bg-slate-50'} border ${ds.border}`}>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className={`font-medium ${ds.text}`}>Patience Pays</div>
                    <div className={ds.textSecondary}>Long-term profitability requires 500+ bets for edge to materialize consistently.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
