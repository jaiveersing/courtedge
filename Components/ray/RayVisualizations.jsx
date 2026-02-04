/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY ADVANCED VISUALIZATIONS v3.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Rich, interactive visualization components for Ray AI:
 * 
 * - Distribution Charts (histogram, density)
 * - Trend Lines (sparklines, projections)
 * - Confidence Meters (gauges, progress bars)
 * - Hit Rate Displays (streak indicators)
 * - Comparison Charts (side-by-side analysis)
 * - Edge Indicators (value visualization)
 * - Volatility Displays (variance indicators)
 * - Live Animations (pulsing, flowing)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Target, Activity, Zap,
  BarChart3, ArrowUpRight, ArrowDownRight, AlertTriangle,
  CheckCircle, XCircle, Clock, Flame, Snowflake, Award,
  Star, Shield, Eye, ChevronUp, ChevronDown
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// MINI SPARKLINE CHART
// ═══════════════════════════════════════════════════════════════════════════════

export const Sparkline = ({ 
  data = [], 
  width = 100, 
  height = 30, 
  color = '#10b981',
  showArea = true,
  line = null
}) => {
  if (!data || data.length < 2) {
return null;
}
  
  const values = data.map(d => typeof d === 'object' ? d.value : d);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  
  // Line threshold
  const lineY = line !== null ? height - ((line - min) / range) * height : null;
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Area fill */}
      {showArea && (
        <polygon
          points={areaPoints}
          fill={`${color}20`}
        />
      )}
      
      {/* Threshold line */}
      {lineY !== null && (
        <line
          x1={0}
          y1={lineY}
          x2={width}
          y2={lineY}
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="3,3"
        />
      )}
      
      {/* Main line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* End dot */}
      <circle
        cx={width}
        cy={height - ((values[values.length - 1] - min) / range) * height}
        r={3}
        fill={color}
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISTRIBUTION BAR CHART
// ═══════════════════════════════════════════════════════════════════════════════

export const DistributionChart = ({ 
  data = [], 
  line = null,
  width = 200,
  height = 60,
  bins = 10,
  isDark = true
}) => {
  if (!data || data.length < 5) {
return null;
}
  
  const values = data.map(d => typeof d === 'object' ? d.value : d);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const binSize = range / bins;
  
  // Create histogram
  const histogram = Array(bins).fill(0);
  values.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
    histogram[binIndex]++;
  });
  
  const maxCount = Math.max(...histogram);
  const barWidth = width / bins - 2;
  
  // Line position
  const lineX = line !== null 
    ? ((line - min) / range) * width 
    : null;
  
  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height}>
        {/* Bars */}
        {histogram.map((count, i) => {
          const x = (i / bins) * width + 1;
          const barHeight = (count / maxCount) * (height - 10);
          const y = height - barHeight;
          const isOverLine = line !== null && (min + (i + 0.5) * binSize) > line;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill={isOverLine ? '#10b981' : '#6b7280'}
              opacity={0.8}
            />
          );
        })}
        
        {/* Line threshold */}
        {lineX !== null && (
          <line
            x1={lineX}
            y1={0}
            x2={lineX}
            y2={height}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4,2"
          />
        )}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>{min.toFixed(0)}</span>
        {line !== null && (
          <span className="text-amber-500 font-medium">{line.toFixed(1)}</span>
        )}
        <span>{max.toFixed(0)}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADVANCED CONFIDENCE GAUGE
// ═══════════════════════════════════════════════════════════════════════════════

export const ConfidenceGauge = ({ 
  value = 50, 
  size = 80,
  showLabel = true,
  animated = true,
  isDark = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const duration = 800;
      const start = displayValue;
      const change = value - start;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        setDisplayValue(start + change * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);
  
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degrees
  const offset = circumference - (displayValue / 100) * circumference;
  
  const getColor = (val) => {
    if (val >= 80) {
return '#10b981';
}
    if (val >= 65) {
return '#3b82f6';
}
    if (val >= 50) {
return '#f59e0b';
}
    return '#ef4444';
  };
  
  const getLabel = (val) => {
    if (val >= 80) {
return 'High';
}
    if (val >= 65) {
return 'Good';
}
    if (val >= 50) {
return 'Moderate';
}
    return 'Low';
  };
  
  const color = getColor(displayValue);
  
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size * 0.75} className="transform -rotate-135">
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? '#1f2937' : '#e5e7eb'}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      
      {/* Center value */}
      <div 
        className="absolute flex flex-col items-center justify-center"
        style={{ top: '25%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span 
          className="text-xl font-bold"
          style={{ color }}
        >
          {Math.round(displayValue)}%
        </span>
        {showLabel && (
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {getLabel(displayValue)}
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HIT RATE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const HitRateIndicator = ({ 
  games = [], 
  line = null,
  size = 'md',
  showStreak = true,
  isDark = true
}) => {
  if (!games || games.length === 0) {
return null;
}
  
  const sizes = {
    sm: { dot: 'w-2 h-2', gap: 'gap-0.5' },
    md: { dot: 'w-3 h-3', gap: 'gap-1' },
    lg: { dot: 'w-4 h-4', gap: 'gap-1.5' }
  };
  
  const s = sizes[size] || sizes.md;
  
  const values = games.map(g => typeof g === 'object' ? g.value : g);
  const threshold = line !== null ? line : values.reduce((a, b) => a + b, 0) / values.length;
  
  const results = values.map(v => v > threshold);
  const hits = results.filter(Boolean).length;
  const hitRate = (hits / values.length) * 100;
  
  // Calculate current streak
  let streak = 0;
  const streakType = results[0] ? 'hit' : 'miss';
  for (const result of results) {
    if ((result && streakType === 'hit') || (!result && streakType === 'miss')) {
      streak++;
    } else {
      break;
    }
  }
  
  return (
    <div className="flex flex-col">
      <div className={`flex items-center ${s.gap}`}>
        {results.slice(0, 10).map((hit, i) => (
          <div
            key={i}
            className={`${s.dot} rounded-full transition-all ${
              hit 
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' 
                : 'bg-red-500/60'
            }`}
            title={`Game ${i + 1}: ${values[i].toFixed(1)}`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-xs font-medium ${
          hitRate >= 70 ? 'text-emerald-400' : 
          hitRate >= 50 ? 'text-blue-400' : 
          'text-red-400'
        }`}>
          {hitRate.toFixed(0)}% hit rate
        </span>
        
        {showStreak && streak >= 3 && (
          <span className={`text-xs ${
            streakType === 'hit' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {streak} {streakType === 'hit' ? '✓' : '✗'} streak
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const EdgeIndicator = ({ 
  edge = 0, 
  direction = 'over',
  showValue = true,
  isDark = true
}) => {
  const getColor = (e) => {
    if (e >= 15) {
return '#10b981';
}
    if (e >= 8) {
return '#3b82f6';
}
    if (e >= 3) {
return '#f59e0b';
}
    return '#6b7280';
  };
  
  const getLabel = (e) => {
    if (e >= 15) {
return 'Strong Edge';
}
    if (e >= 8) {
return 'Solid Edge';
}
    if (e >= 3) {
return 'Marginal Edge';
}
    return 'No Edge';
  };
  
  const color = getColor(edge);
  const width = Math.min(edge * 3, 100);
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {direction.toUpperCase()} Edge
        </span>
        {showValue && (
          <span className="text-xs font-medium" style={{ color }}>
            +{edge.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className={`h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${width}%`,
            backgroundColor: color,
            boxShadow: edge >= 8 ? `0 0 8px ${color}40` : 'none'
          }}
        />
      </div>
      
      <span className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {getLabel(edge)}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOLATILITY INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const VolatilityIndicator = ({ 
  classification = 'moderate',
  cv = 0.2,
  stdDev = 5,
  isDark = true
}) => {
  const levels = {
    veryLow: { bars: 1, color: '#10b981', label: 'Very Low' },
    low: { bars: 2, color: '#10b981', label: 'Low' },
    moderate: { bars: 3, color: '#f59e0b', label: 'Moderate' },
    high: { bars: 4, color: '#f97316', label: 'High' },
    veryHigh: { bars: 5, color: '#ef4444', label: 'Very High' }
  };
  
  const level = levels[classification] || levels.moderate;
  
  return (
    <div className="flex items-center gap-2">
      {/* Bars */}
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-1 rounded-t transition-all"
            style={{
              height: `${i * 20}%`,
              backgroundColor: i <= level.bars ? level.color : (isDark ? '#374151' : '#e5e7eb')
            }}
          />
        ))}
      </div>
      
      {/* Label */}
      <div className="flex flex-col">
        <span className="text-xs font-medium" style={{ color: level.color }}>
          {level.label}
        </span>
        <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          SD: {stdDev.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TREND INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const TrendIndicator = ({ 
  direction = 'stable',
  strength = 0.5,
  change = 0,
  isDark = true
}) => {
  const configs = {
    improving: { 
      icon: TrendingUp, 
      color: '#10b981', 
      bg: 'bg-emerald-500/10',
      label: 'Trending Up'
    },
    declining: { 
      icon: TrendingDown, 
      color: '#ef4444', 
      bg: 'bg-red-500/10',
      label: 'Trending Down'
    },
    stable: { 
      icon: Minus, 
      color: '#6b7280', 
      bg: 'bg-gray-500/10',
      label: 'Stable'
    }
  };
  
  const config = configs[direction] || configs.stable;
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${config.bg}`}>
      <Icon className="w-4 h-4" style={{ color: config.color }} />
      <div className="flex flex-col">
        <span className="text-xs font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
        {change !== 0 && (
          <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)} avg
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE BADGE
// ═══════════════════════════════════════════════════════════════════════════════

export const GradeBadge = ({ 
  grade = 'B',
  size = 'md',
  animated = true,
  isDark = true
}) => {
  const grades = {
    'A+': { color: '#10b981', ring: 'ring-emerald-500/30' },
    'A': { color: '#10b981', ring: 'ring-emerald-500/20' },
    'A-': { color: '#34d399', ring: 'ring-emerald-400/20' },
    'B+': { color: '#3b82f6', ring: 'ring-blue-500/20' },
    'B': { color: '#3b82f6', ring: 'ring-blue-500/20' },
    'B-': { color: '#60a5fa', ring: 'ring-blue-400/20' },
    'C+': { color: '#f59e0b', ring: 'ring-amber-500/20' },
    'C': { color: '#f59e0b', ring: 'ring-amber-500/20' },
    'D': { color: '#ef4444', ring: 'ring-red-500/20' },
    'F': { color: '#dc2626', ring: 'ring-red-600/20' }
  };
  
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };
  
  const config = grades[grade] || grades['C'];
  
  return (
    <div 
      className={`
        ${sizes[size]} 
        rounded-lg ring-2 ${config.ring}
        flex items-center justify-center font-bold
        ${animated ? 'transition-all hover:scale-110' : ''}
      `}
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color
      }}
    >
      {grade}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAT COMPARISON BAR
// ═══════════════════════════════════════════════════════════════════════════════

export const ComparisonBar = ({ 
  label = 'Stat',
  value1 = 50,
  value2 = 50,
  name1 = 'Player 1',
  name2 = 'Player 2',
  isDark = true
}) => {
  const total = value1 + value2;
  const pct1 = (value1 / total) * 100;
  const pct2 = (value2 / total) * 100;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-400 w-10 text-right">
          {value1.toFixed(1)}
        </span>
        
        <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-gray-800">
          <div 
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct1}%` }}
          />
          <div 
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${pct2}%` }}
          />
        </div>
        
        <span className="text-xs font-medium text-blue-400 w-10">
          {value2.toFixed(1)}
        </span>
      </div>
      
      <div className="flex justify-between text-[10px] mt-0.5">
        <span className="text-emerald-400">{name1}</span>
        <span className="text-blue-400">{name2}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE PULSE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const LivePulse = ({ 
  color = 'emerald',
  size = 'md',
  label = 'Live'
}) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };
  
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-ping absolute opacity-75`} />
        <div className={`${sizes[size]} ${colors[color]} rounded-full relative`} />
      </div>
      {label && (
        <span className={`text-xs font-medium text-${color}-400`}>{label}</span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PERCENTILE RANK BAR
// ═══════════════════════════════════════════════════════════════════════════════

export const PercentileBar = ({ 
  percentile = 50,
  label = 'Percentile',
  isDark = true
}) => {
  const getColor = (p) => {
    if (p >= 90) {
return '#10b981';
}
    if (p >= 75) {
return '#3b82f6';
}
    if (p >= 50) {
return '#f59e0b';
}
    if (p >= 25) {
return '#f97316';
}
    return '#ef4444';
  };
  
  const color = getColor(percentile);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
        <span className="font-medium" style={{ color }}>{percentile}th</span>
      </div>
      
      <div className={`h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentile}%`, backgroundColor: color }}
        />
      </div>
      
      {/* Markers */}
      <div className="flex justify-between mt-1">
        {[0, 25, 50, 75, 100].map(mark => (
          <div key={mark} className="flex flex-col items-center">
            <div className={`w-px h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className={`text-[8px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {mark}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════

export const StatCard = ({
  label,
  value,
  subtext,
  trend = null,
  icon: Icon = null,
  color = 'blue',
  isDark = true
}) => {
  const colors = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    red: 'text-red-400'
  };
  
  const bgColors = {
    emerald: 'bg-emerald-500/10',
    blue: 'bg-blue-500/10',
    amber: 'bg-amber-500/10',
    red: 'bg-red-500/10'
  };
  
  return (
    <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {Icon && (
            <div className={`p-1 rounded ${bgColors[color]}`}>
              <Icon className={`w-3 h-3 ${colors[color]}`} />
            </div>
          )}
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </span>
        </div>
        
        {trend && (
          <div className={`flex items-center gap-0.5 ${
            trend === 'up' ? 'text-emerald-400' :
            trend === 'down' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> :
             trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
        {subtext && (
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATION PILL
// ═══════════════════════════════════════════════════════════════════════════════

export const RecommendationPill = ({
  direction = 'over',
  confidence = 70,
  edge = 8,
  isDark = true
}) => {
  const isOver = direction.toLowerCase() === 'over';
  
  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full
      ${isOver ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}
    `}>
      <span className={`text-sm font-bold ${isOver ? 'text-emerald-400' : 'text-red-400'}`}>
        {isOver ? '↑' : '↓'} {direction.toUpperCase()}
      </span>
      
      <div className="w-px h-4 bg-gray-600" />
      
      <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {confidence}% conf
      </span>
      
      <span className={`text-xs font-medium ${isOver ? 'text-emerald-400' : 'text-red-400'}`}>
        +{edge.toFixed(1)}% edge
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED ANALYSIS CARD
// ═══════════════════════════════════════════════════════════════════════════════

export const AnalysisCard = ({
  player,
  market,
  line,
  analysis,
  isDark = true
}) => {
  if (!analysis) {
return null;
}
  
  const { performance, lineInteraction, confidence, recommendation, grade } = analysis;
  
  return (
    <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white border border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {player}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {market} @ {line}
          </p>
        </div>
        <GradeBadge grade={grade} isDark={isDark} />
      </div>
      
      {/* Recommendation */}
      <div className="mb-3">
        <RecommendationPill 
          direction={recommendation}
          confidence={confidence}
          edge={analysis.edge || 0}
          isDark={isDark}
        />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatCard
          label="Hit Rate L10"
          value={`${lineInteraction?.hitRate?.last10 || 0}%`}
          icon={Target}
          color={lineInteraction?.hitRate?.last10 >= 65 ? 'emerald' : 'amber'}
          isDark={isDark}
        />
        <StatCard
          label="Average"
          value={performance?.last10?.mean?.toFixed(1) || '0'}
          subtext="L10"
          icon={BarChart3}
          color="blue"
          isDark={isDark}
        />
      </div>
      
      {/* Volatility & Trend */}
      <div className="flex items-center justify-between">
        <VolatilityIndicator 
          classification={performance?.volatility || 'moderate'}
          stdDev={performance?.last10?.stdDev || 0}
          isDark={isDark}
        />
        <TrendIndicator 
          direction={performance?.trendDirection || 'stable'}
          change={performance?.trendChange || 0}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default {
  Sparkline,
  DistributionChart,
  ConfidenceGauge,
  HitRateIndicator,
  EdgeIndicator,
  VolatilityIndicator,
  TrendIndicator,
  GradeBadge,
  ComparisonBar,
  LivePulse,
  PercentileBar,
  StatCard,
  RecommendationPill,
  AnalysisCard
};
