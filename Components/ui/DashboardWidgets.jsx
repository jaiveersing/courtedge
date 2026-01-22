import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, Award, AlertCircle } from 'lucide-react';

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'neutral',
  subtitle,
  className = ''
}) => {
  const trendColors = {
    up: 'text-green-400 bg-green-500/10 border-green-500/20',
    down: 'text-red-400 bg-red-500/10 border-red-500/20',
    neutral: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Target;

  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${trendColors[trend]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${trendColors[trend]}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};

export const QuickActionCard = ({ title, description, icon: Icon, onClick, badge, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-left hover:border-blue-500/50 hover:bg-slate-800/70 transition-all group ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white mb-1">{title}</div>
          <div className="text-sm text-slate-400">{description}</div>
        </div>
        <div className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
          →
        </div>
      </div>
    </button>
  );
};

export const AlertCard = ({ type = 'info', title, message, icon: Icon, action }) => {
  const typeStyles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400'
  };

  const DefaultIcon = Icon || AlertCircle;

  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        <DefaultIcon className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-sm opacity-90">{message}</div>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const MiniChart = ({ data = [], label, height = 60 }) => {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="flex items-end gap-1" style={{ height: `${height}px` }}>
        {data.map((value, index) => {
          const heightPercent = ((value - min) / range) * 100;
          const isPositive = value >= 0;
          
          return (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all hover:opacity-80 ${
                isPositive ? 'bg-green-500/50' : 'bg-red-500/50'
              }`}
              style={{ height: `${Math.max(heightPercent, 5)}%` }}
              title={`${value.toFixed(1)}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export const ProgressRing = ({ value, max = 100, size = 80, strokeWidth = 8, label, color = 'blue' }) => {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    red: 'stroke-red-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClasses[color]} transition-all duration-500`}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          className="text-lg font-bold fill-white transform rotate-90"
          style={{ transformOrigin: 'center' }}
        >
          {percentage.toFixed(0)}%
        </text>
      </svg>
      {label && <div className="text-xs text-slate-400 text-center">{label}</div>}
    </div>
  );
};

export const LeaderboardItem = ({ rank, name, value, avatar, subtitle, trend }) => {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
      <div className="text-xl font-bold text-slate-500 w-8 text-center">
        {medals[rank] || `#${rank}`}
      </div>
      {avatar && (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=40`;
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{name}</div>
        {subtitle && <div className="text-xs text-slate-400 truncate">{subtitle}</div>}
      </div>
      <div className="text-right">
        <div className={`font-bold ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default {
  StatCard,
  QuickActionCard,
  AlertCard,
  MiniChart,
  ProgressRing,
  LeaderboardItem
};
