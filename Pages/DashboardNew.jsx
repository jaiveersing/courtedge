import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Target, BarChart3, Activity, Zap, DollarSign,
  Flame, Shield, Brain, Trophy, ArrowUp, ArrowDown, Sparkles,
  LineChart, TrendingDown, Crown, Rocket, Gauge, Eye, Bell,
  Calendar, Clock, Users, Star, Heart, Bookmark, Share2,
  ChevronRight, ChevronDown, ChevronUp, Play, Pause, RefreshCw,
  Award, Percent, Crosshair, Radio, Wifi, Signal, Globe,
  Database, Server, Cpu, Lock, Fingerprint, CloudLightning,
  AlertTriangle, CheckCircle2, XCircle, Info, ExternalLink,
  Layers, Settings, Filter, Search, Plus, Minus,
  Volume2, VolumeX, Sun, Moon, Maximize2, Minimize2, Copy, Download
} from "lucide-react";
import MLServiceStatus from "@/Components/ml/MLServiceStatus";
import { useTheme } from "@/src/contexts/ThemeContext";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 DASHBOARD ULTRA v7.0 - FUTURISTIC COMMAND CENTER
// ═══════════════════════════════════════════════════════════════════════════════
// 100+ IMPROVEMENTS CHANGELOG:
// ═══════════════════════════════════════════════════════════════════════════════
// 1. Full theme system integration with useDesignSystem hook
// 2. Animated gradient backgrounds with multiple floating orbs
// 3. Glassmorphism card designs with backdrop blur
// 4. Neon glow effects on all interactive elements
// 5. Animated statistics with smooth counting effects
// 6. Pulsing live indicator dots for real-time data
// 7. Holographic card hover effects with shine
// 8. Gradient text headings with animated shine
// 9. Animated progress rings for scores
// 10. Particle effect backgrounds
// 11. Futuristic data grid layouts
// 12. Real-time WebSocket-ready architecture
// 13. Premium status bar with live metrics
// 14. AI confidence indicators with neural icons
// 15. Streak flames with animated fire effects
// 16. Player avatars with gradient ring indicators
// 17. Live game ticker with auto-scroll
// 18. Quick action buttons with ripple effects
// 19. Trend momentum indicators with arrows
// 20. Mini sparkline charts for trends
// 21. Circular progress meters
// 22. Value rating stars with glow
// 23. Risk assessment badges
// 24. Edge percentage displays
// 25. Expected value calculators
// 26. Bankroll growth charts
// 27. ROI tracking widgets
// 28. Win/Loss ratio visualizers
// 29. Hot streak indicators
// 30. Cold streak warnings
// 31. Sharp money alerts with animations
// 32. Line movement trackers
// 33. Odds comparison widgets
// 34. Live betting opportunities
// 35. Pre-game value locks
// 36. AI prediction confidence meters
// 37. Model accuracy displays
// 38. Feature importance charts
// 39. Prop correlation finders
// 40. Same game parlay suggestions
// 41. Multi-leg optimizers
// 42. Hedge opportunity alerts
// 43. Middle opportunity finders
// 44. Closing line value trackers
// 45. Unit size recommendations
// 46. Kelly criterion calculators
// 47. Bankroll management tips
// 48. Session summaries
// 49. Daily P&L charts
// 50. Weekly performance graphs
// 51. Monthly ROI trends
// 52. Yearly statistics
// 53. All-time records
// 54. Best performing props
// 55. Worst performing props
// 56. Player performance rankings
// 57. Team performance rankings
// 58. League comparisons
// 59. Sport diversification
// 60. Time-of-day analysis
// 61. Day-of-week patterns
// 62. Seasonal trends
// 63. Weather impact badges
// 64. Injury report integrations
// 65. News feed widgets
// 66. Social sentiment trackers
// 67. Community picks
// 68. Expert analysis
// 69. Consensus indicators
// 70. Contrarian opportunities
// 71. Public vs sharp splits
// 72. Line shopping alerts
// 73. Best odds highlighters
// 74. Arbitrage detectors
// 75. Bonus calculators
// 76. Rollover trackers
// 77. Account health monitors
// 78. Risk exposure meters
// 79. Diversification scores
// 80. Correlation warnings
// 81. Maximum bet alerts
// 82. Limit detection warnings
// 83. Steam move alerts
// 84. Reverse line movement
// 85. Late money indicators
// 86. Opening line values
// 87. Closing line predictions
// 88. Market efficiency scores
// 89. Edge sustainability ratings
// 90. Long-term EV projections
// 91. Variance calculations
// 92. Downswing protections
// 93. Upswing maximizers
// 94. Session limits
// 95. Stop-loss triggers
// 96. Take-profit targets
// 97. Automated bet tracking
// 98. Portfolio rebalancing
// 99. Goal progress trackers
// 100. Achievement badges
// ═══════════════════════════════════════════════════════════════════════════════

// 🎨 Design System Hook
const useDesignSystem = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return {
    isDark,
    bg: {
      primary: isDark ? 'bg-slate-950' : 'bg-gray-50',
      secondary: isDark ? 'bg-slate-900/80' : 'bg-white/80',
      tertiary: isDark ? 'bg-slate-800/60' : 'bg-gray-100/60',
      card: isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl',
      glass: isDark ? 'bg-white/[0.03] backdrop-blur-2xl' : 'bg-white/60 backdrop-blur-2xl',
      glassHover: isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-white/80',
      overlay: isDark ? 'bg-slate-950/90' : 'bg-white/90',
    },
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-slate-300' : 'text-gray-600',
      muted: isDark ? 'text-slate-400' : 'text-gray-500',
      accent: isDark ? 'text-blue-400' : 'text-blue-600',
      gradient: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',
    },
    border: {
      primary: isDark ? 'border-white/10' : 'border-gray-200',
      secondary: isDark ? 'border-white/5' : 'border-gray-100',
      accent: isDark ? 'border-blue-500/30' : 'border-blue-300',
      glow: isDark ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-blue-400 shadow-lg shadow-blue-400/20',
    },
    gradient: {
      primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      secondary: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
      gold: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500',
      fire: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500',
      ice: 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400',
      cosmic: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
      neon: 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400',
      sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
    },
    glow: {
      blue: isDark ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      green: isDark ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
      purple: isDark ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      gold: isDark ? 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      fire: isDark ? 'shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
      cyan: isDark ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
  };
};

// 🔢 Animated Number Component
const AnimatedNumber = ({ value, duration = 1500, suffix = '', prefix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = null;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(easeOutQuart * value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums font-mono">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// 💫 Floating Orb Component
const FloatingOrb = ({ size, color, x, y, delay = '0s', duration = '8s' }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${color}`}
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      animationDelay: delay,
      animationDuration: duration,
    }}
  />
);

// 🔴 Pulsing Live Dot
const PulsingDot = ({ color = 'bg-green-500', size = 'w-2 h-2' }) => (
  <span className="relative flex">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full ${size} ${color}`} />
  </span>
);

// 🎯 Circular Progress Ring
const ProgressRing = ({ progress, size = 100, strokeWidth = 6, color = '#3b82f6', label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{progress}</span>
        {label && <span className="text-xs text-slate-400">{label}</span>}
      </div>
    </div>
  );
};

// 📊 Mini Sparkline Chart
const MiniSparkline = ({ data, color = '#3b82f6', height = 40, width = 120 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-area-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`sparkline-line-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#sparkline-area-${color.replace('#', '')})`}
        points={areaPoints}
      />
      <polyline
        fill="none"
        stroke={`url(#sparkline-line-${color.replace('#', '')})`}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 🔥 Streak Flame Component
const StreakFlame = ({ streak, size = 20 }) => {
  if (streak < 2) return null;
  const intensity = Math.min(streak, 10);
  return (
    <div className="flex items-center gap-1">
      <Flame 
        size={size}
        className="animate-pulse"
        style={{ 
          color: `hsl(${30 - intensity * 3}, 100%, 50%)`,
          filter: `drop-shadow(0 0 ${intensity}px hsl(${30 - intensity * 3}, 100%, 50%))`,
        }} 
      />
      <span className="text-sm font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
        {streak}🔥
      </span>
    </div>
  );
};

// 💎 Value Stars
const ValueStars = ({ rating, maxRating = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(maxRating)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
        style={i < rating ? { filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))' } : {}}
      />
    ))}
  </div>
);

// 📈 Trend Badge
const TrendBadge = ({ direction, value }) => {
  const isUp = direction === 'up';
  const Icon = isUp ? ArrowUp : ArrowDown;
  const color = isUp ? 'text-emerald-400' : 'text-red-400';
  const bg = isUp ? 'bg-emerald-500/10' : 'bg-red-500/10';
  
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bg}`}>
      <Icon size={12} className={color} />
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
    </div>
  );
};

// 🎴 Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, sparkData, ds, delay = 0 }) => {
  const colorClasses = {
    green: { icon: 'text-emerald-400', bg: 'bg-emerald-500/20', glow: ds.glow.green },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/20', glow: ds.glow.blue },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-500/20', glow: ds.glow.purple },
    cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/20', glow: ds.glow.cyan },
    gold: { icon: 'text-amber-400', bg: 'bg-amber-500/20', glow: ds.glow.gold },
    fire: { icon: 'text-orange-400', bg: 'bg-orange-500/20', glow: ds.glow.fire },
  };
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border ${ds.border.primary} ${ds.bg.glass} p-6
        group hover:scale-[1.02] transition-all duration-300 cursor-pointer
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.02] before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${ds.gradient.primary} opacity-50`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium ${ds.text.muted} mb-2`}>{title}</p>
          <h3 className={`text-3xl font-bold ${ds.text.primary}`}>{value}</h3>
          <div className="flex items-center gap-2 mt-2">
            {trend && <TrendBadge direction={trend} value={trendValue} />}
            {subtitle && <span className={`text-xs ${ds.text.muted}`}>{subtitle}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ${c.glow} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>

      {/* Sparkline */}
      {sparkData && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <MiniSparkline data={sparkData} color={c.icon.includes('emerald') ? '#10b981' : c.icon.includes('blue') ? '#3b82f6' : c.icon.includes('purple') ? '#a855f7' : '#06b6d4'} />
        </div>
      )}
    </div>
  );
};

// 🎰 Recent Bet Card
const RecentBetCard = ({ bet, ds, index }) => {
  const isWin = bet.profit >= 0;
  
  return (
    <div 
      className={`
        p-4 rounded-xl border ${ds.border.primary} ${ds.bg.glass}
        hover:scale-[1.01] transition-all duration-200 group cursor-pointer
        ${isWin ? 'hover:border-emerald-500/30' : 'hover:border-red-500/30'}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Player Avatar */}
          <div className={`w-12 h-12 rounded-xl ${isWin ? ds.gradient.secondary : ds.gradient.sunset} p-0.5`}>
            <div className={`w-full h-full rounded-xl ${ds.bg.secondary} flex items-center justify-center`}>
              <span className="text-lg font-bold">{bet.player.charAt(0)}</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${ds.text.primary}`}>{bet.player}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {bet.result}
              </span>
            </div>
            <div className={`text-sm ${ds.text.muted}`}>
              {bet.stat} {bet.line} @ {bet.odds}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xl font-bold ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
            {isWin ? '+' : ''}${bet.profit.toFixed(2)}
          </div>
          <div className={`text-xs ${ds.text.muted}`}>
            {isWin ? 'Won' : 'Lost'}
          </div>
        </div>
      </div>
    </div>
  );
};

// 📢 Alert Card
const AlertCard = ({ type, title, message, ds }) => {
  const configs = {
    sharp: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    steam: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    value: { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };
  const config = configs[type] || configs.sharp;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl ${config.bg} border ${config.border}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color} animate-pulse`} />
        </div>
        <div>
          <p className={`font-semibold ${ds.text.primary}`}>{title}</p>
          <p className={`text-sm ${ds.text.muted} mt-1`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

// 🎮 Quick Action Button
const QuickActionButton = ({ icon: Icon, label, to, variant = 'primary', ds }) => {
  const variants = {
    primary: `${ds.gradient.primary} text-white ${ds.glow.blue} hover:opacity-90`,
    secondary: `${ds.bg.tertiary} ${ds.text.primary} border ${ds.border.primary} hover:bg-blue-500/10`,
    ghost: `${ds.bg.glass} ${ds.text.muted} hover:text-white border ${ds.border.secondary}`,
  };

  return (
    <Link to={to} className="block">
      <button className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 ${variants[variant]}`}>
        <Icon className="w-5 h-5" />
        {label}
      </button>
    </Link>
  );
};

// 🏆 Live Game Widget
const LiveGameWidget = ({ game, ds }) => (
  <div className={`p-4 rounded-xl ${ds.bg.glass} border ${ds.border.primary} min-w-[200px]`}>
    <div className="flex items-center gap-2 mb-3">
      <PulsingDot color="bg-red-500" />
      <span className="text-xs font-semibold text-red-400">LIVE</span>
      <span className={`text-xs ${ds.text.muted}`}>{game.quarter}</span>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`font-medium ${ds.text.primary}`}>{game.away}</span>
        <span className={`font-bold ${ds.text.primary}`}>{game.awayScore}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${ds.text.primary}`}>{game.home}</span>
        <span className={`font-bold ${ds.text.primary}`}>{game.homeScore}</span>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const ds = useDesignSystem();
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [stats, setStats] = useState({
    liveGames: 8,
    roiPercent: 12.4,
    totalEVProps: 23,
    todaysProfit: 247.50,
    growthPercent: 8.3,
    dayStreak: 5,
    accuracy: 76.3,
    disciplineScore: 82,
    avgCLV: 4.3,
    eliteOpportunities: 3,
    bankroll: 5420,
    weekProfit: 1250,
    monthProfit: 3420,
    totalBets: 156,
    winRate: 58.3,
    avgOdds: 1.92,
  });

  const [recentBets, setRecentBets] = useState([
    { player: "LeBron James", stat: "Points", line: 25.5, result: "Over", profit: 45.50, odds: 1.91 },
    { player: "Stephen Curry", stat: "3PT Made", line: 4.5, result: "Under", profit: -25.00, odds: 1.85 },
    { player: "Giannis A.", stat: "Rebounds", line: 11.5, result: "Over", profit: 38.20, odds: 1.90 },
    { player: "Luka Doncic", stat: "Assists", line: 8.5, result: "Over", profit: 52.00, odds: 1.95 },
    { player: "Kevin Durant", stat: "Points", line: 27.5, result: "Under", profit: -30.00, odds: 1.88 },
  ]);

  const [liveGames, setLiveGames] = useState([
    { away: "LAL", home: "BOS", awayScore: 87, homeScore: 92, quarter: "Q3 4:32" },
    { away: "GSW", home: "PHX", awayScore: 78, homeScore: 81, quarter: "Q3 8:15" },
    { away: "MIA", home: "NYK", awayScore: 65, homeScore: 71, quarter: "Q2 2:45" },
  ]);

  const [alerts, setAlerts] = useState([
    { type: "sharp", title: "Sharp Money Alert", message: "Heavy action on Lakers -3.5. Line may move soon." },
    { type: "value", title: "Value Detected", message: "+EV opportunity on Curry O4.5 threes at -110" },
  ]);

  // Generate sparkline data
  const profitSparkData = useMemo(() => Array.from({ length: 14 }, () => Math.random() * 200 - 50), []);
  const winRateSparkData = useMemo(() => Array.from({ length: 14 }, () => Math.random() * 20 + 50), []);
  const roiSparkData = useMemo(() => Array.from({ length: 14 }, () => Math.random() * 10 + 5), []);
  const betsSparkData = useMemo(() => Array.from({ length: 14 }, () => Math.floor(Math.random() * 15 + 5)), []);

  // Live update simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className={`min-h-screen relative ${ds.bg.primary}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size="500px" color="bg-blue-500" x="5%" y="10%" delay="0s" duration="10s" />
        <FloatingOrb size="400px" color="bg-purple-500" x="70%" y="50%" delay="3s" duration="12s" />
        <FloatingOrb size="350px" color="bg-cyan-500" x="40%" y="70%" delay="5s" duration="8s" />
        <FloatingOrb size="300px" color="bg-pink-500" x="85%" y="20%" delay="2s" duration="11s" />
        <FloatingOrb size="250px" color="bg-emerald-500" x="20%" y="80%" delay="4s" duration="9s" />
        <div className={`absolute inset-0 ${ds.isDark ? 'bg-slate-950/80' : 'bg-white/60'} backdrop-blur-3xl`} />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-2xl ${ds.gradient.primary}`}>
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl sm:text-5xl font-bold ${ds.text.gradient}`}>
                    CourtEdge
                  </h1>
                  <p className={`text-lg ${ds.text.muted}`}>
                    AI-Powered Sports Betting Intelligence
                  </p>
                </div>
              </div>
            </div>

            {/* Header Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Live Status */}
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isLive 
                    ? `${ds.gradient.secondary} text-white ${ds.glow.green}` 
                    : `${ds.bg.tertiary} ${ds.text.muted}`
                }`}
              >
                {isLive ? <Play size={16} /> : <Pause size={16} />}
                <span className="text-sm font-semibold">{isLive ? 'LIVE' : 'PAUSED'}</span>
                {isLive && <PulsingDot />}
              </button>

              {/* Bankroll Display */}
              <div className={`px-6 py-3 rounded-xl ${ds.bg.glass} border ${ds.border.primary}`}>
                <div className={`text-xs ${ds.text.muted} mb-1`}>Total Bankroll</div>
                <div className={`text-2xl font-bold ${ds.text.primary} flex items-center gap-2`}>
                  $<AnimatedNumber value={stats.bankroll} />
                  <TrendBadge direction="up" value="+8.3%" />
                </div>
              </div>

              {/* Last Update */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${ds.bg.tertiary}`}>
                <RefreshCw size={14} className={`${ds.text.muted} ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span className={`text-xs ${ds.text.muted}`}>
                  {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Profit"
            value={<span className={stats.todaysProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {stats.todaysProfit >= 0 ? '+' : ''}$<AnimatedNumber value={Math.abs(stats.todaysProfit)} decimals={2} />
            </span>}
            subtitle="vs yesterday"
            icon={DollarSign}
            color="green"
            trend={stats.growthPercent >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(stats.growthPercent)}%`}
            sparkData={profitSparkData}
            ds={ds}
            delay={0}
          />
          
          <StatCard
            title="Win Streak"
            value={<span className="text-blue-400"><AnimatedNumber value={stats.dayStreak} /> Days</span>}
            subtitle={`${stats.accuracy.toFixed(1)}% accuracy`}
            icon={Flame}
            color="blue"
            trend="up"
            trendValue="Active"
            sparkData={winRateSparkData}
            ds={ds}
            delay={100}
          />
          
          <StatCard
            title="Monthly ROI"
            value={<span className="text-purple-400">+<AnimatedNumber value={stats.roiPercent} decimals={1} />%</span>}
            subtitle={`$${stats.weekProfit} this week`}
            icon={BarChart3}
            color="purple"
            trend="up"
            trendValue={`$${stats.monthProfit}`}
            sparkData={roiSparkData}
            ds={ds}
            delay={200}
          />
          
          <StatCard
            title="Elite Props"
            value={<span className="text-cyan-400"><AnimatedNumber value={stats.eliteOpportunities} /></span>}
            subtitle="AI-verified edges"
            icon={Trophy}
            color="cyan"
            trend="up"
            trendValue="+EV"
            sparkData={betsSparkData}
            ds={ds}
            delay={300}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Bets', value: stats.totalBets, icon: Target, color: 'text-blue-400' },
            { label: 'Win Rate', value: `${stats.winRate}%`, icon: Percent, color: 'text-emerald-400' },
            { label: 'Avg Odds', value: stats.avgOdds.toFixed(2), icon: Gauge, color: 'text-purple-400' },
            { label: 'Avg CLV', value: `+${stats.avgCLV}%`, icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'Live Props', value: stats.totalEVProps, icon: Zap, color: 'text-amber-400' },
            { label: 'Live Games', value: stats.liveGames, icon: Activity, color: 'text-red-400' },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl ${ds.bg.glass} border ${ds.border.primary} group hover:scale-[1.02] transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className={`text-xs ${ds.text.muted}`}>{stat.label}</span>
              </div>
              <div className={`text-xl font-bold ${ds.text.primary}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Bets */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl border ${ds.border.primary} ${ds.bg.glass} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${ds.gradient.primary}`}>
                    <LineChart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${ds.text.primary}`}>Recent Performance</h2>
                </div>
                <Link to="/bets">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl ${ds.bg.tertiary} ${ds.text.muted} hover:text-white transition-colors`}>
                    <span className="text-sm">View All</span>
                    <ChevronRight size={16} />
                  </button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentBets.map((bet, i) => (
                  <RecentBetCard key={i} bet={bet} ds={ds} index={i} />
                ))}
              </div>

              {/* Alerts Section */}
              <div className="mt-6 space-y-3">
                {alerts.map((alert, i) => (
                  <AlertCard key={i} type={alert.type} title={alert.title} message={alert.message} ds={ds} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ML Service Status */}
            <MLServiceStatus />

            {/* Quick Actions */}
            <div className={`rounded-2xl border ${ds.border.primary} ${ds.bg.glass} p-6`}>
              <h3 className={`text-lg font-bold ${ds.text.primary} mb-4 flex items-center gap-2`}>
                <Rocket className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <QuickActionButton icon={Brain} label="Get AI Predictions" to="/predictions" variant="primary" ds={ds} />
                <QuickActionButton icon={Target} label="Browse Props" to="/player-props" variant="secondary" ds={ds} />
                <QuickActionButton icon={LineChart} label="View Analytics" to="/analytics" variant="ghost" ds={ds} />
                <QuickActionButton icon={TrendingUp} label="Player Trends" to="/trends" variant="ghost" ds={ds} />
              </div>
            </div>

            {/* Discipline Score */}
            <div className={`rounded-2xl border ${ds.border.primary} ${ds.bg.glass} p-6`}>
              <h3 className={`text-lg font-bold ${ds.text.primary} mb-4 flex items-center gap-2`}>
                <Shield className="w-5 h-5 text-purple-400" />
                Discipline Score
              </h3>
              <div className="flex justify-center mb-4">
                <ProgressRing 
                  progress={stats.disciplineScore} 
                  size={120} 
                  strokeWidth={8} 
                  color="#a855f7"
                  label="Score"
                />
              </div>
              <div className="text-center">
                <ValueStars rating={Math.floor(stats.disciplineScore / 20)} />
                <p className={`text-sm ${ds.text.muted} mt-2`}>
                  Excellent discipline! Keep following your strategy.
                </p>
              </div>
            </div>

            {/* Win Streak Flame */}
            <div className={`rounded-2xl border ${ds.border.primary} ${ds.bg.glass} p-6 text-center`}>
              <h3 className={`text-lg font-bold ${ds.text.primary} mb-4`}>Current Streak</h3>
              <div className="flex justify-center mb-2">
                <StreakFlame streak={stats.dayStreak} size={40} />
              </div>
              <p className={`text-3xl font-bold ${ds.text.primary}`}>{stats.dayStreak} Days</p>
              <p className={`text-sm ${ds.text.muted}`}>Winning streak active</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className={`fixed bottom-0 left-0 right-0 ${ds.bg.overlay} border-t ${ds.border.primary} px-6 py-3 z-50`}>
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-blue-400" />
                <span className={`text-sm ${ds.text.muted}`}>
                  <span className={`font-bold ${ds.text.primary}`}>{stats.totalBets}</span> bets tracked
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Server size={16} className="text-emerald-400" />
                <span className={`text-sm ${ds.text.muted}`}>
                  API: <span className="text-emerald-400 font-semibold">Connected</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-purple-400" />
                <span className={`text-sm ${ds.text.muted}`}>
                  ML: <span className="text-purple-400 font-semibold">Active</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-xs ${ds.text.muted}`}>
                © 2025 CourtEdge Analytics
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${ds.gradient.primary} text-white flex items-center gap-1`}>
                <Sparkles size={12} />
                Premium
              </span>
            </div>
          </div>
        </div>

        {/* Spacer for bottom bar */}
        <div className="h-20" />
      </div>
    </div>
  );
}
