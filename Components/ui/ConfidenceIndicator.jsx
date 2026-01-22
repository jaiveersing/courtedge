import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

/**
 * ConfidenceIndicator - Visual component showing prediction confidence
 * @param {number} confidence - Confidence value (0-100)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showLabel - Whether to show text label
 * @param {boolean} showIcon - Whether to show icon
 */
export const ConfidenceIndicator = ({ 
  confidence = 50, 
  size = 'md',
  showLabel = true,
  showIcon = true,
  className = ''
}) => {
  const getConfidenceLevel = (conf) => {
    if (conf >= 85) return { level: 'Very High', color: 'green', icon: CheckCircle2 };
    if (conf >= 70) return { level: 'High', color: 'blue', icon: TrendingUp };
    if (conf >= 55) return { level: 'Medium', color: 'yellow', icon: Info };
    if (conf >= 40) return { level: 'Low', color: 'orange', icon: AlertTriangle };
    return { level: 'Very Low', color: 'red', icon: TrendingDown };
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const { level, color, icon: Icon } = getConfidenceLevel(confidence);
  
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      text: 'text-green-400',
      border: 'border-green-500/20'
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-400',
      border: 'border-blue-500/20'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-400',
      border: 'border-orange-500/20'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-400',
      border: 'border-red-500/20'
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Icon className={`${iconSizes[size]} ${colorClasses[color].text}`} />}
      <div className="flex-1 min-w-0">
        {showLabel && (
          <div className="flex items-center justify-between mb-1">
            <span className={`${textSizes[size]} font-medium ${colorClasses[color].text}`}>
              {level}
            </span>
            <span className={`${textSizes[size]} text-slate-400`}>
              {confidence}%
            </span>
          </div>
        )}
        <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div 
            className={`h-full ${colorClasses[color].bg} transition-all duration-500`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * ConfidenceBadge - Compact badge showing confidence
 */
export const ConfidenceBadge = ({ confidence = 50, showPercentage = true }) => {
  const getConfidenceLevel = (conf) => {
    if (conf >= 85) return { level: 'Very High', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (conf >= 70) return { level: 'High', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (conf >= 55) return { level: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (conf >= 40) return { level: 'Low', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { level: 'Very Low', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const { level, color } = getConfidenceLevel(confidence);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${color}`}>
      <span>{level}</span>
      {showPercentage && <span>({confidence}%)</span>}
    </span>
  );
};

/**
 * ConfidenceRange - Shows prediction range with confidence intervals
 */
export const ConfidenceRange = ({ 
  prediction, 
  low, 
  high, 
  confidence = 95,
  label = 'Points',
  size = 'md'
}) => {
  const range = high - low;
  const margin = prediction - low;
  const percentage = (margin / range) * 100;

  const sizeClasses = {
    sm: { container: 'h-8', text: 'text-xs', dot: 'w-2 h-2' },
    md: { container: 'h-10', text: 'text-sm', dot: 'w-3 h-3' },
    lg: { container: 'h-12', text: 'text-base', dot: 'w-4 h-4' }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{confidence}% Confidence Interval</span>
        <span className="font-medium text-white">{prediction.toFixed(1)} {label}</span>
      </div>
      
      <div className={`relative ${sizeClasses[size].container} bg-slate-800 rounded-lg overflow-hidden`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 to-red-500/10" />
        
        {/* Range bar */}
        <div className="absolute inset-0 flex items-center px-2">
          <div className="w-full h-1 bg-blue-500/30 rounded-full relative">
            {/* Prediction marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${percentage}%` }}
            >
              <div className={`${sizeClasses[size].dot} bg-blue-500 rounded-full ring-4 ring-blue-500/30`} />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <span className={`${sizeClasses[size].text} font-semibold text-slate-400`}>
            {low.toFixed(1)}
          </span>
          <span className={`${sizeClasses[size].text} font-semibold text-slate-400`}>
            {high.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
        <Info className="w-3 h-3" />
        <span>Range: {low.toFixed(1)} - {high.toFixed(1)} {label}</span>
      </div>
    </div>
  );
};

/**
 * PredictionWithConfidence - Complete prediction display with confidence
 */
export const PredictionWithConfidence = ({
  prediction,
  confidence,
  low,
  high,
  label = 'Points',
  subtitle,
  showRange = true,
  size = 'md'
}) => {
  const getConfidenceColor = (conf) => {
    if (conf >= 85) return 'text-green-400';
    if (conf >= 70) return 'text-blue-400';
    if (conf >= 55) return 'text-yellow-400';
    if (conf >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
            {prediction.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400 mt-1">{label}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <ConfidenceIndicator confidence={confidence} size={size} showIcon={false} />
      
      {showRange && low !== undefined && high !== undefined && (
        <ConfidenceRange
          prediction={prediction}
          low={low}
          high={high}
          confidence={95}
          label={label}
          size="sm"
        />
      )}
    </div>
  );
};

export default { 
  ConfidenceIndicator, 
  ConfidenceBadge, 
  ConfidenceRange, 
  PredictionWithConfidence 
};
