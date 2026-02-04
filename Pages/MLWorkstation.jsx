// ML Workstation Elite v5.0 - 100 Improvements Edition
// Advanced AI-Powered Sports Analytics Platform
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTheme } from '../src/contexts/ThemeContext';
import { 
  Brain, Activity, TrendingUp, TrendingDown, Search, 
  Zap, Target, BarChart3, PieChart, Layers, 
  AlertTriangle, CheckCircle, Clock, DollarSign,
  Cpu, Database, GitBranch, Sparkles, Flame,
  Shield, Crosshair, Users, Timer, Award,
  ArrowUpRight, ArrowDownRight, Percent, Info,
  RefreshCw, Download, Filter, ChevronRight,
  BarChart2, Calculator, Briefcase, Play, Pause,
  Eye, Lightbulb, Boxes, Crown, Gem, Star,
  TrendingUp as Trending, Wallet, PiggyBank,
  LineChart as LineChartIcon, Lock, Unlock,
  Maximize2, Minimize2, Settings, Bell, BellRing,
  ChevronDown, ChevronUp, Copy, Share2, Bookmark,
  History, Rocket, Gauge, Radio, Wifi, WifiOff,
  Moon, Sun, Volume2, VolumeX, Grid, List, LayoutGrid,
  ThumbsUp, ThumbsDown, MessageCircle, Send, Heart,
  AlertCircle, XCircle, Check, X, Plus, Minus,
  RotateCcw, Save, Trash2, Edit, ExternalLink, Link
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  ReferenceLine, Scatter, ScatterChart, ZAxis, PieChart as RechartsPie, Pie
} from 'recharts';
import PlayersAPI from '../src/api/playersApi';
import { WORKSTATION_PLAYERS, NBA_PLAYERS_DATABASE } from '../src/api/mockData';

// ==================== DESIGN SYSTEM ====================
const useDesignSystem = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return {
    isDark,
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    bgCard: isDark ? 'bg-slate-900/80' : 'bg-white',
    bgCardHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50',
    bgAccent: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
    bgSuccess: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
    bgWarning: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
    bgDanger: isDark ? 'bg-red-500/10' : 'bg-red-50',
    bgGradient: isDark 
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950' 
      : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    textMuted: isDark ? 'text-slate-500' : 'text-slate-400',
    textAccent: isDark ? 'text-indigo-400' : 'text-indigo-600',
    textSuccess: isDark ? 'text-emerald-400' : 'text-emerald-600',
    textWarning: isDark ? 'text-amber-400' : 'text-amber-600',
    textDanger: isDark ? 'text-red-400' : 'text-red-600',
    border: isDark ? 'border-slate-800' : 'border-slate-200',
    borderAccent: isDark ? 'border-indigo-500/30' : 'border-indigo-200',
    input: isDark 
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    chartGrid: isDark ? '#334155' : '#e2e8f0',
    chartText: isDark ? '#94a3b8' : '#64748b',
    gradientPrimary: 'from-indigo-500 via-purple-500 to-pink-500',
    gradientSuccess: 'from-emerald-500 via-green-500 to-teal-500',
    gradientWarning: 'from-amber-500 via-orange-500 to-red-500',
  };
};

// ==================== ANIMATED COMPONENTS ====================
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const target = parseFloat(value) || 0;
    const duration = 1000;
    const steps = 30;
    const stepValue = (target - displayValue) / steps;
    let current = displayValue;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      current += stepValue;
      setDisplayValue(current);
      if (step >= steps) {
        setDisplayValue(target);
        clearInterval(interval);
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [value]);
  
  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>;
};

const PulsingDot = ({ color = 'emerald' }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-3 w-3 bg-${color}-500`}></span>
  </span>
);

const GlowingCard = ({ children, className = '', glow = 'indigo' }) => (
  <div className={`relative group ${className}`}>
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glow}-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
    <div className="relative">{children}</div>
  </div>
);

// ==================== STAT CARDS ====================
const StatCard = ({ label, value, subValue, icon: Icon, trend, color = 'indigo', large = false, ds, onClick }) => (
  <div 
    onClick={onClick}
    className={`${ds.bgCard} rounded-xl ${large ? 'p-6' : 'p-4'} border ${ds.border} 
      transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10 
      hover:border-${color}-500/30 ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-start justify-between mb-2">
      <span className={`${ds.textSecondary} ${large ? 'text-base' : 'text-sm'}`}>{label}</span>
      {Icon && (
        <div className={`p-2 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/10`}>
          <Icon className={`${large ? 'w-5 h-5' : 'w-4 h-4'} text-${color}-400`} />
        </div>
      )}
    </div>
    <div className={`${large ? 'text-3xl' : 'text-2xl'} font-bold ${ds.text}`}>
      {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
    </div>
    {subValue && (
      <div className="flex items-center gap-1 mt-1">
        {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
        {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-400" />}
        <span className={`text-sm ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : ds.textMuted}`}>
          {subValue}
        </span>
      </div>
    )}
  </div>
);

const MiniStatCard = ({ label, value, color = 'slate', ds }) => (
  <div className={`px-3 py-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
    <div className={`text-xs ${ds.textMuted}`}>{label}</div>
    <div className={`text-sm font-semibold text-${color}-400`}>{value}</div>
  </div>
);

// ==================== CONFIDENCE & BADGES ====================
const ConfidenceMeter = ({ confidence, size = 'md', ds }) => {
  const level = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
  const colors = {
    high: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    medium: { bar: 'bg-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-400' },
    low: { bar: 'bg-red-500', bg: 'bg-red-500/20', text: 'text-red-400' }
  };
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={`text-xs ${ds.textMuted}`}>Confidence</span>
        <span className={`text-sm font-bold ${colors[level].text}`}>{confidence}%</span>
      </div>
      <div className={`${sizes[size]} ${colors[level].bg} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${colors[level].bar} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
};

const PredictionBadge = ({ type, size = 'md' }) => {
  const config = {
    OVER: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: TrendingUp },
    UNDER: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: TrendingDown },
    HOLD: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', icon: Pause }
  };
  
  const c = config[type] || config.HOLD;
  const Icon = c.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${c.bg} ${c.text} border ${c.border} font-bold ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {type}
    </span>
  );
};

const RiskBadge = ({ level }) => {
  const config = {
    low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Low Risk' },
    medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Medium Risk' },
    high: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'High Risk' }
  };
  const c = config[level] || config.medium;
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// ==================== LOADING STATES ====================
const LoadingSpinner = ({ ds, text = 'Processing...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full" />
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400" />
    </div>
    <span className={`mt-4 ${ds.textSecondary} animate-pulse`}>{text}</span>
  </div>
);

const SkeletonCard = ({ ds }) => (
  <div className={`${ds.bgCard} rounded-xl p-4 border ${ds.border} animate-pulse`}>
    <div className={`h-4 ${ds.isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-24 mb-3`}></div>
    <div className={`h-8 ${ds.isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-32 mb-2`}></div>
    <div className={`h-3 ${ds.isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-20`}></div>
  </div>
);

// ==================== PLAYER COMPONENTS ====================
const PlayerAvatar = ({ player, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };
  
  const initials = player?.name?.split(' ').map(n => n[0]).join('') || '?';
  
  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
      flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30`}>
      {initials}
    </div>
  );
};

const PlayerCard = ({ player, onClick, selected, ds }) => (
  <div 
    onClick={() => onClick(player)}
    className={`${ds.bgCard} rounded-xl p-4 border transition-all duration-300 cursor-pointer
      ${selected ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : `${ds.border} hover:border-indigo-500/50`}`}
  >
    <div className="flex items-center gap-3">
      <PlayerAvatar player={player} size="md" />
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${ds.text} truncate`}>{player.name}</div>
        <div className={`text-sm ${ds.textMuted}`}>{player.team} • {player.position}</div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${ds.text}`}>{player.ppg}</div>
        <div className={`text-xs ${ds.textMuted}`}>PPG</div>
      </div>
    </div>
  </div>
);

// ==================== CHART COMPONENTS ====================
const PredictionDistributionChart = ({ data, line, ds }) => {
  const chartData = data || Array.from({ length: 20 }, (_, i) => ({
    value: 15 + i * 1.5,
    probability: Math.exp(-Math.pow(15 + i * 1.5 - 25, 2) / 50) * 100
  }));
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} />
        <XAxis dataKey="value" stroke={ds.chartText} fontSize={11} />
        <YAxis stroke={ds.chartText} fontSize={11} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: ds.isDark ? '#1e293b' : '#fff',
            border: `1px solid ${ds.isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px'
          }}
        />
        <Area type="monotone" dataKey="probability" stroke="#6366f1" fill="url(#probGradient)" strokeWidth={2} />
        {line && <ReferenceLine x={parseFloat(line)} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const ModelComparisonChart = ({ data, ds }) => {
  const chartData = data || [
    { name: 'XGBoost', accuracy: 72, precision: 74, recall: 71, f1: 72 },
    { name: 'Random Forest', accuracy: 69, precision: 70, recall: 68, f1: 69 },
    { name: 'Neural Net', accuracy: 70, precision: 72, recall: 69, f1: 70 },
    { name: 'Ensemble', accuracy: 75, precision: 77, recall: 74, f1: 75 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} />
        <XAxis type="number" domain={[0, 100]} stroke={ds.chartText} fontSize={11} />
        <YAxis dataKey="name" type="category" stroke={ds.chartText} fontSize={11} width={90} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: ds.isDark ? '#1e293b' : '#fff',
            border: `1px solid ${ds.isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="accuracy" fill="#6366f1" radius={[0, 4, 4, 0]} name="Accuracy" />
        <Bar dataKey="precision" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Precision" />
        <Bar dataKey="f1" fill="#a855f7" radius={[0, 4, 4, 0]} name="F1 Score" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const PerformanceRadar = ({ data, ds }) => {
  const chartData = data || [
    { stat: 'Points', value: 85, fullMark: 100 },
    { stat: 'Rebounds', value: 72, fullMark: 100 },
    { stat: 'Assists', value: 78, fullMark: 100 },
    { stat: 'Efficiency', value: 82, fullMark: 100 },
    { stat: 'Consistency', value: 76, fullMark: 100 },
    { stat: 'Clutch', value: 88, fullMark: 100 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={chartData}>
        <PolarGrid stroke={ds.chartGrid} />
        <PolarAngleAxis dataKey="stat" tick={{ fill: ds.chartText, fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: ds.chartText, fontSize: 10 }} />
        <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const HistoricalTrendChart = ({ data, ds }) => {
  const chartData = data || Array.from({ length: 10 }, (_, i) => ({
    game: `G${i + 1}`,
    actual: 20 + Math.random() * 15,
    predicted: 25 + Math.random() * 5,
    line: 24.5
  }));
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={ds.chartGrid} />
        <XAxis dataKey="game" stroke={ds.chartText} fontSize={11} />
        <YAxis stroke={ds.chartText} fontSize={11} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: ds.isDark ? '#1e293b' : '#fff',
            border: `1px solid ${ds.isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="actual" fill="url(#actualGradient)" stroke="#10b981" strokeWidth={2} name="Actual" />
        <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Predicted" />
        <ReferenceLine y={24.5} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Line', fill: '#f59e0b', fontSize: 11 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// ==================== FEATURE PANELS ====================
const ModelPanel = ({ model, ds }) => (
  <div className={`${ds.bgCard} rounded-xl p-4 border ${ds.border} hover:border-indigo-500/30 transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.gradient} flex items-center justify-center`}>
          <model.icon className="w-4 h-4 text-white" />
        </div>
        <span className={`font-semibold ${ds.text}`}>{model.name}</span>
      </div>
      <span className={`text-lg font-bold ${model.prediction > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {model.prediction > 0 ? '+' : ''}{model.prediction.toFixed(1)}
      </span>
    </div>
    <ConfidenceMeter confidence={model.confidence} size="sm" ds={ds} />
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
      <span className={`text-xs ${ds.textMuted}`}>Weight: {(model.weight * 100).toFixed(0)}%</span>
      <span className={`text-xs ${model.trend === 'bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
        {model.trend === 'bullish' ? '↑ Bullish' : '↓ Bearish'}
      </span>
    </div>
  </div>
);

const InsightCard = ({ title, description, type = 'info', icon: Icon, ds }) => {
  const types = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info, color: 'text-blue-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle, color: 'text-emerald-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle, color: 'text-amber-400' },
    danger: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, color: 'text-red-400' },
    premium: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Crown, color: 'text-purple-400' },
  };
  
  const t = types[type];
  const DisplayIcon = Icon || t.icon;
  
  return (
    <div className={`${t.bg} border ${t.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <DisplayIcon className={`w-5 h-5 ${t.color} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`font-semibold ${ds.text} mb-1`}>{title}</h4>
          <p className={`text-sm ${ds.textSecondary}`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ label, icon: Icon, onClick, color = 'indigo', disabled, ds }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
      ${disabled 
        ? 'opacity-50 cursor-not-allowed bg-slate-800' 
        : `bg-${color}-500/20 hover:bg-${color}-500/30 text-${color}-400 border border-${color}-500/30`
      }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// ==================== TAB CONFIGURATION ====================
const TABS = [
  { id: 'predictions', label: 'AI Predictions', icon: Brain, color: 'indigo' },
  { id: 'analysis', label: 'Deep Analysis', icon: Activity, color: 'cyan' },
  { id: 'value', label: 'Value Scanner', icon: Target, color: 'emerald' },
  { id: 'matchups', label: 'Matchup Intel', icon: Shield, color: 'purple' },
  { id: 'models', label: 'Model Lab', icon: Cpu, color: 'pink' },
  { id: 'live', label: 'Live Feed', icon: Radio, color: 'red' },
];

// ==================== MAIN COMPONENT ====================
export default function MLWorkstation() {
  const ds = useDesignSystem();
  const [activeTab, setActiveTab] = useState('predictions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProp, setSelectedProp] = useState('points');
  const [propLine, setPropLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  
  // Prediction states
  const [prediction, setPrediction] = useState(null);
  const [models, setModels] = useState([]);
  const [insights, setInsights] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  
  // Fetch players from LIVE API with fallback to mock data
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoadingPlayers(true);
      try {
        const livePlayers = await PlayersAPI.getPlayers({ limit: 100 });
        if (livePlayers && livePlayers.length > 0) {
          setPlayers(livePlayers);
        } else {
          // Fallback to 100 real NBA players mock data
          setPlayers(NBA_PLAYERS_DATABASE);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        // Fallback to 100 real NBA players mock data
        setPlayers(NBA_PLAYERS_DATABASE);
      }
      setIsLoadingPlayers(false);
    };
    fetchPlayers();
  }, []);
  
  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) {
return [];
}
    const query = searchQuery.toLowerCase();
    return players.filter(p => 
      (p.name || p.fullName || '').toLowerCase().includes(query) || 
      (p.team || '').toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, players]);

  // Top players for quick select
  const topPlayers = useMemo(() => players.slice(0, 5), [players]);
  
  // Run prediction
  const runPrediction = useCallback(async () => {
    if (!selectedPlayer) {
return;
}
    
    setLoading(true);
    
    // Simulate ML processing
    await new Promise(r => setTimeout(r, 1500));
    
    // Generate mock prediction results
    const baseValue = selectedProp === 'points' ? selectedPlayer.ppg : 
                     selectedProp === 'rebounds' ? selectedPlayer.rpg :
                     selectedProp === 'assists' ? selectedPlayer.apg : selectedPlayer.ppg;
    
    const predictionValue = baseValue + (Math.random() - 0.5) * 4;
    const lineValue = parseFloat(propLine) || baseValue;
    const edge = ((predictionValue - lineValue) / lineValue * 100);
    
    setPrediction({
      value: predictionValue,
      confidence: 65 + Math.random() * 25,
      recommendation: predictionValue > lineValue ? 'OVER' : 'UNDER',
      edge: Math.abs(edge),
      probability: 50 + (edge > 0 ? 1 : -1) * Math.abs(edge) * 2,
      ev: edge * 0.5,
      kellyCriterion: Math.abs(edge) * 0.1,
      sharpScore: 60 + Math.random() * 30,
    });
    
    setModels([
      { name: 'XGBoost Pro', prediction: predictionValue + (Math.random() - 0.5) * 3, confidence: 70 + Math.random() * 20, weight: 0.35, trend: Math.random() > 0.5 ? 'bullish' : 'bearish', icon: Zap, gradient: 'from-blue-500 to-cyan-500' },
      { name: 'DeepNet v3', prediction: predictionValue + (Math.random() - 0.5) * 3, confidence: 70 + Math.random() * 20, weight: 0.30, trend: Math.random() > 0.5 ? 'bullish' : 'bearish', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
      { name: 'RandomForest+', prediction: predictionValue + (Math.random() - 0.5) * 3, confidence: 70 + Math.random() * 20, weight: 0.20, trend: Math.random() > 0.5 ? 'bullish' : 'bearish', icon: GitBranch, gradient: 'from-green-500 to-emerald-500' },
      { name: 'GradientBoost', prediction: predictionValue + (Math.random() - 0.5) * 3, confidence: 70 + Math.random() * 20, weight: 0.15, trend: Math.random() > 0.5 ? 'bullish' : 'bearish', icon: Flame, gradient: 'from-orange-500 to-red-500' },
    ]);
    
    setInsights([
      { title: 'Strong Historical Performance', description: `${selectedPlayer.name} has exceeded this line in 7 of last 10 games`, type: 'success' },
      { title: 'Favorable Matchup Detected', description: 'Opponent ranks 28th in defending this stat category', type: 'premium' },
      { title: 'Recent Form Alert', description: 'Player averaging 12% above season average in last 5 games', type: 'info' },
      { title: 'Pace Factor', description: 'Expected game pace is +4.2% above average', type: 'info' },
    ]);
    
    setHistoricalData(Array.from({ length: 10 }, (_, i) => ({
      game: `G${i + 1}`,
      actual: baseValue + (Math.random() - 0.5) * 10,
      predicted: baseValue + (Math.random() - 0.3) * 5,
      line: lineValue
    })));
    
    setLoading(false);
  }, [selectedPlayer, selectedProp, propLine]);

  // Toggle favorite
  const toggleFavorite = (player) => {
    setFavorites(prev => 
      prev.includes(player.id) 
        ? prev.filter(id => id !== player.id)
        : [...prev, player.id]
    );
  };

  // Prop types
  const propTypes = [
    { id: 'points', label: 'Points', icon: Target },
    { id: 'rebounds', label: 'Rebounds', icon: Activity },
    { id: 'assists', label: 'Assists', icon: Users },
    { id: 'threes', label: '3-Pointers', icon: Crosshair },
    { id: 'steals', label: 'Steals', icon: Shield },
    { id: 'blocks', label: 'Blocks', icon: Shield },
    { id: 'pra', label: 'PTS+REB+AST', icon: Layers },
  ];

  return (
    <div className={`min-h-screen ${ds.bgGradient}`}>
      {/* Premium Header */}
      <div className={`${ds.bgCard} backdrop-blur-xl border-b ${ds.border} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                  flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full 
                  flex items-center justify-center border-2 border-slate-900">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className={`text-2xl font-bold ${ds.text} flex items-center gap-2`}>
                  ML Workstation
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                    ELITE v5.0
                  </span>
                </h1>
                <p className={ds.textSecondary}>Advanced AI-Powered Predictions</p>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Live Mode Toggle */}
              <button 
                onClick={() => setLiveMode(!liveMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  liveMode 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : `${ds.bgCard} ${ds.textSecondary} border ${ds.border}`
                }`}
              >
                {liveMode ? <Radio className="w-4 h-4 animate-pulse" /> : <Radio className="w-4 h-4" />}
                <span className="hidden md:inline">{liveMode ? 'Live' : 'Static'}</span>
              </button>
              
              {/* Search */}
              <div className="relative">
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2.5 rounded-xl ${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:text-indigo-400 transition-colors`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Notifications */}
              <button className={`relative p-2.5 rounded-xl ${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:text-indigo-400 transition-colors`}>
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
          
          {/* Search Overlay */}
          {showSearch && (
            <div className={`absolute top-full left-0 right-0 ${ds.bgCard} border-b ${ds.border} p-4 shadow-2xl`}>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${ds.textMuted}`} />
                  <input
                    type="text"
                    placeholder="Search players by name or team..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className={`w-full pl-12 pr-4 py-3 rounded-xl ${ds.input} border text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  />
                  <button 
                    onClick={() => {
 setShowSearch(false); setSearchQuery(''); 
}}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Search Results */}
                {filteredPlayers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {filteredPlayers.map(player => (
                      <button
                        key={player.id}
                        onClick={() => {
                          setSelectedPlayer(player);
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 ${ds.bgCardHover} transition-colors text-left`}
                      >
                        <PlayerAvatar player={player} size="sm" />
                        <div className="flex-1">
                          <div className={ds.text}>{player.name}</div>
                          <div className={`text-sm ${ds.textMuted}`}>{player.team} • {player.position}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${ds.text}`}>{player.ppg}</div>
                          <div className={`text-xs ${ds.textMuted}`}>PPG</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Quick Select */}
                {!searchQuery && (
                  <div className="mt-4">
                    <div className={`text-sm ${ds.textMuted} mb-2`}>Top Players</div>
                    <div className="flex flex-wrap gap-2">
                      {topPlayers.map(player => (
                        <button
                          key={player.id}
                          onClick={() => {
                            setSelectedPlayer(player);
                            setShowSearch(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg ${ds.bgAccent} ${ds.textAccent} text-sm hover:opacity-80 transition-opacity`}
                        >
                          {player.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Player Bar */}
          {selectedPlayer && (
            <div className={`py-3 border-t ${ds.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <PlayerAvatar player={selectedPlayer} size="md" />
                  <div>
                    <div className={`text-lg font-bold ${ds.text}`}>{selectedPlayer.name}</div>
                    <div className={`text-sm ${ds.textMuted}`}>{selectedPlayer.team} • {selectedPlayer.position} • #{selectedPlayer.jersey}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 ml-6">
                    <MiniStatCard label="PPG" value={selectedPlayer.ppg} color="indigo" ds={ds} />
                    <MiniStatCard label="RPG" value={selectedPlayer.rpg} color="emerald" ds={ds} />
                    <MiniStatCard label="APG" value={selectedPlayer.apg} color="purple" ds={ds} />
                    <MiniStatCard label="FG%" value={`${(selectedPlayer.fgPct * 100).toFixed(1)}%`} color="amber" ds={ds} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedPlayer)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(selectedPlayer.id) 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : `${ds.bgCard} ${ds.textMuted}`
                    }`}
                  >
                    <Star className={`w-5 h-5 ${favorites.includes(selectedPlayer.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setSelectedPlayer(null)}
                    className={`p-2 rounded-lg ${ds.bgCard} ${ds.textMuted} hover:text-red-400 transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-2 pt-2 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500/20 to-${tab.color}-600/10 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-lg shadow-${tab.color}-500/10`
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
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'predictions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              {/* Player Selection */}
              {!selectedPlayer ? (
                <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                  <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                    <Search className="w-5 h-5 text-indigo-400" />
                    Select a Player
                  </h3>
                  <p className={`${ds.textSecondary} mb-4`}>Click the search icon above or choose from top players:</p>
                  <div className="space-y-2">
                    {topPlayers.map(player => (
                      <PlayerCard 
                        key={player.id} 
                        player={player} 
                        onClick={setSelectedPlayer}
                        selected={false}
                        ds={ds}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Prop Type Selection */}
                  <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                    <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                      <Target className="w-5 h-5 text-indigo-400" />
                      Prop Type
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {propTypes.map(prop => (
                        <button
                          key={prop.id}
                          onClick={() => setSelectedProp(prop.id)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            selectedProp === prop.id
                              ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400'
                              : `${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:border-indigo-500/30`
                          }`}
                        >
                          <prop.icon className="w-4 h-4 mb-1" />
                          <span className="text-sm font-medium">{prop.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Line Input */}
                  <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                    <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                      Betting Line
                    </h3>
                    <input
                      type="number"
                      step="0.5"
                      value={propLine}
                      onChange={(e) => setPropLine(e.target.value)}
                      placeholder={`e.g., ${selectedPlayer?.ppg || '25.5'}`}
                      className={`w-full px-4 py-3 rounded-xl ${ds.input} border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg`}
                    />
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => setPropLine((parseFloat(propLine) || selectedPlayer?.ppg || 25) - 0.5)}
                        className={`flex-1 py-2 rounded-lg ${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:border-indigo-500/30`}
                      >
                        -0.5
                      </button>
                      <button 
                        onClick={() => setPropLine(selectedPlayer?.ppg || 25)}
                        className={`flex-1 py-2 rounded-lg ${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:border-indigo-500/30`}
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => setPropLine((parseFloat(propLine) || selectedPlayer?.ppg || 25) + 0.5)}
                        className={`flex-1 py-2 rounded-lg ${ds.bgCard} border ${ds.border} ${ds.textSecondary} hover:border-indigo-500/30`}
                      >
                        +0.5
                      </button>
                    </div>
                  </div>
                  
                  {/* Run Button */}
                  <button
                    onClick={runPrediction}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3
                      ${loading 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                      }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        Run AI Prediction
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <LoadingSpinner ds={ds} text="Running ensemble prediction models..." />
              ) : prediction ? (
                <>
                  {/* Main Prediction Card */}
                  <GlowingCard glow={prediction.recommendation === 'OVER' ? 'emerald' : 'red'}>
                    <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className={`text-lg font-semibold ${ds.text} flex items-center gap-2`}>
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            AI Prediction Result
                          </h3>
                          <p className={ds.textSecondary}>Ensemble of 4 ML models</p>
                        </div>
                        <PredictionBadge type={prediction.recommendation} size="lg" />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard 
                          label="Predicted" 
                          value={prediction.value.toFixed(1)} 
                          icon={Target}
                          color="indigo"
                          ds={ds}
                        />
                        <StatCard 
                          label="Edge" 
                          value={`${prediction.edge.toFixed(1)}%`}
                          subValue={prediction.edge > 5 ? 'Strong Edge' : 'Moderate'}
                          trend={prediction.edge > 3 ? 'up' : 'down'}
                          icon={Percent}
                          color="emerald"
                          ds={ds}
                        />
                        <StatCard 
                          label="Probability" 
                          value={`${prediction.probability.toFixed(0)}%`}
                          icon={PieChart}
                          color="purple"
                          ds={ds}
                        />
                        <StatCard 
                          label="EV" 
                          value={`${prediction.ev > 0 ? '+' : ''}${prediction.ev.toFixed(1)}%`}
                          trend={prediction.ev > 0 ? 'up' : 'down'}
                          icon={DollarSign}
                          color="amber"
                          ds={ds}
                        />
                      </div>
                      
                      <ConfidenceMeter confidence={prediction.confidence} size="lg" ds={ds} />
                      
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${ds.text}`}>{prediction.kellyCriterion.toFixed(1)}%</div>
                          <div className={`text-sm ${ds.textMuted}`}>Kelly Criterion</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${ds.text}`}>{prediction.sharpScore.toFixed(0)}</div>
                          <div className={`text-sm ${ds.textMuted}`}>Sharp Score</div>
                        </div>
                        <div className="text-center">
                          <RiskBadge level={prediction.edge > 8 ? 'low' : prediction.edge > 4 ? 'medium' : 'high'} />
                        </div>
                      </div>
                    </div>
                  </GlowingCard>
                  
                  {/* Model Breakdown */}
                  <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                    <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                      <Layers className="w-5 h-5 text-indigo-400" />
                      Model Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {models.map((model, idx) => (
                        <ModelPanel key={idx} model={model} ds={ds} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                      <h3 className={`text-lg font-semibold ${ds.text} mb-4`}>Probability Distribution</h3>
                      <PredictionDistributionChart line={propLine} ds={ds} />
                    </div>
                    <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                      <h3 className={`text-lg font-semibold ${ds.text} mb-4`}>Historical Performance</h3>
                      <HistoricalTrendChart data={historicalData} ds={ds} />
                    </div>
                  </div>
                  
                  {/* Insights */}
                  <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
                    <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                      AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {insights.map((insight, idx) => (
                        <InsightCard key={idx} {...insight} ds={ds} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <QuickAction label="Save Prediction" icon={Bookmark} onClick={() => {}} color="indigo" ds={ds} />
                    <QuickAction label="Compare Players" icon={Users} onClick={() => {}} color="purple" ds={ds} />
                    <QuickAction label="Export Report" icon={Download} onClick={() => {}} color="emerald" ds={ds} />
                    <QuickAction label="Share Analysis" icon={Share2} onClick={() => {}} color="amber" ds={ds} />
                  </div>
                </>
              ) : (
                <div className={`${ds.bgCard} rounded-2xl p-12 border ${ds.border} text-center`}>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className={`text-xl font-semibold ${ds.text} mb-2`}>Ready to Analyze</h3>
                  <p className={`${ds.textSecondary} max-w-md mx-auto`}>
                    Select a player, choose a prop type, and enter a betting line to get AI-powered predictions from our ensemble of machine learning models.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <Activity className="w-5 h-5 text-cyan-400" />
                Player Performance Radar
              </h3>
              <PerformanceRadar ds={ds} />
            </div>
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h3 className={`text-lg font-semibold ${ds.text} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Model Comparison
              </h3>
              <ModelComparisonChart ds={ds} />
            </div>
            <div className={`lg:col-span-2 ${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h3 className={`text-lg font-semibold ${ds.text} mb-4`}>Recent Game Log</h3>
              <HistoricalTrendChart ds={ds} />
            </div>
          </div>
        )}

        {activeTab === 'value' && (
          <div className="text-center py-12">
            <Target className={`w-16 h-16 mx-auto mb-4 text-emerald-400`} />
            <h3 className={`text-xl font-semibold ${ds.text} mb-2`}>Value Scanner</h3>
            <p className={ds.textSecondary}>Automatically scan for +EV betting opportunities</p>
          </div>
        )}

        {activeTab === 'matchups' && (
          <div className="text-center py-12">
            <Shield className={`w-16 h-16 mx-auto mb-4 text-purple-400`} />
            <h3 className={`text-xl font-semibold ${ds.text} mb-2`}>Matchup Intelligence</h3>
            <p className={ds.textSecondary}>Deep defensive matchup analysis</p>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h3 className={`text-lg font-semibold ${ds.text} mb-4`}>Model Performance</h3>
              <ModelComparisonChart ds={ds} />
            </div>
            <div className={`${ds.bgCard} rounded-2xl p-6 border ${ds.border}`}>
              <h3 className={`text-lg font-semibold ${ds.text} mb-4`}>Training Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Accuracy" value="74.5%" icon={Target} color="emerald" ds={ds} />
                <StatCard label="Precision" value="76.2%" icon={Crosshair} color="indigo" ds={ds} />
                <StatCard label="Recall" value="73.1%" icon={Activity} color="purple" ds={ds} />
                <StatCard label="F1 Score" value="74.6%" icon={Award} color="amber" ds={ds} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="text-center py-12">
            <Radio className={`w-16 h-16 mx-auto mb-4 text-red-400 ${liveMode ? 'animate-pulse' : ''}`} />
            <h3 className={`text-xl font-semibold ${ds.text} mb-2`}>Live Feed</h3>
            <p className={ds.textSecondary}>
              {liveMode ? 'Connected to live data stream' : 'Enable live mode to stream real-time predictions'}
            </p>
            <button 
              onClick={() => setLiveMode(!liveMode)}
              className={`mt-4 px-6 py-2 rounded-xl font-medium transition-all ${
                liveMode 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {liveMode ? 'Disconnect' : 'Go Live'}
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${ds.bgCard} border-t ${ds.border} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PulsingDot color="emerald" />
                <span className={ds.textSecondary}>ML Service Connected</span>
              </div>
              <div className={ds.textMuted}>|</div>
              <div className={ds.textMuted}>4 Models Active</div>
              <div className={ds.textMuted}>|</div>
              <div className={ds.textMuted}>Last Update: Just now</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={ds.textMuted}>v5.0.0</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
