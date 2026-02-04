/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY ANIMATIONS - ADVANCED MOTION & VISUAL EFFECTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Brain, Zap, TrendingUp, TrendingDown, Target, Activity, 
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Radio 
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// NEURAL NETWORK ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const NeuralNetworkVisual = ({ isActive, size = 100, isDark }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  
  useEffect(() => {
    // Create node grid
    const layers = [3, 5, 5, 3];
    const newNodes = [];
    const newConnections = [];
    let nodeId = 0;
    
    layers.forEach((count, layerIdx) => {
      const xPos = (layerIdx / (layers.length - 1)) * (size - 20) + 10;
      for (let i = 0; i < count; i++) {
        const yPos = ((i + 1) / (count + 1)) * (size - 10);
        newNodes.push({
          id: nodeId++,
          layer: layerIdx,
          x: xPos,
          y: yPos,
          active: Math.random() > 0.5
        });
      }
    });
    
    // Create connections between adjacent layers
    newNodes.forEach(node => {
      if (node.layer < layers.length - 1) {
        const nextLayerNodes = newNodes.filter(n => n.layer === node.layer + 1);
        nextLayerNodes.forEach(target => {
          newConnections.push({
            from: node,
            to: target,
            strength: Math.random()
          });
        });
      }
    });
    
    setNodes(newNodes);
    setConnections(newConnections);
  }, [size]);
  
  useEffect(() => {
    if (!isActive) {
return;
}
    
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.4
      })));
    }, 200);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <svg width={size} height={size} className="opacity-60">
      {/* Connections */}
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke={isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
          strokeWidth={conn.strength * 1.5}
          className={isActive && conn.from.active ? 'animate-pulse' : ''}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.active ? 4 : 3}
          fill={node.active 
            ? (isDark ? '#34d399' : '#10b981')
            : (isDark ? '#374151' : '#d1d5db')}
          className={`transition-all duration-300 ${node.active ? 'opacity-100' : 'opacity-50'}`}
        />
      ))}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESSING LOADER
// ═══════════════════════════════════════════════════════════════════════════════

export const ProcessingLoader = ({ stage = 'analyzing', isDark }) => {
  const stages = {
    perceiving: { label: 'Perceiving', progress: 15 },
    patterns: { label: 'Finding Patterns', progress: 30 },
    context: { label: 'Analyzing Context', progress: 50 },
    inference: { label: 'Drawing Inference', progress: 70 },
    synthesis: { label: 'Synthesizing', progress: 85 },
    expressing: { label: 'Formulating', progress: 95 },
    complete: { label: 'Complete', progress: 100 }
  };
  
  const [currentStage, setCurrentStage] = useState(stage);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const stageInfo = stages[stage] || stages.analyzing;
    setCurrentStage(stage);
    setProgress(stageInfo.progress);
  }, [stage]);
  
  return (
    <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Brain className={`w-4 h-4 animate-pulse ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {stages[currentStage]?.label || 'Processing'}...
        </span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE RING
// ═══════════════════════════════════════════════════════════════════════════════

export const ConfidenceRing = ({ value, size = 60, strokeWidth = 6, isDark, showLabel = true }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const startValue = animatedValue;
    
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimatedValue(startValue + (value - startValue) * eased);
      
      if (progress < 1) {
requestAnimationFrame(animate);
}
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  
  const getColor = () => {
    if (animatedValue >= 80) {
return isDark ? '#34d399' : '#10b981';
}
    if (animatedValue >= 60) {
return isDark ? '#38bdf8' : '#0ea5e9';
}
    if (animatedValue >= 40) {
return isDark ? '#fbbf24' : '#f59e0b';
}
    return isDark ? '#f87171' : '#ef4444';
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isDark ? '#1e293b' : '#e5e7eb'}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-colors duration-300"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(animatedValue)}%
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE METER
// ═══════════════════════════════════════════════════════════════════════════════

export const EdgeMeter = ({ edge, maxEdge = 20, isDark }) => {
  const [animatedEdge, setAnimatedEdge] = useState(0);
  const percentage = Math.min((animatedEdge / maxEdge) * 100, 100);
  
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedEdge(edge * eased);
      
      if (progress < 1) {
requestAnimationFrame(animate);
}
    };
    
    requestAnimationFrame(animate);
  }, [edge]);
  
  const getColor = () => {
    if (edge >= 15) {
return 'from-emerald-500 to-green-400';
}
    if (edge >= 10) {
return 'from-blue-500 to-cyan-400';
}
    if (edge >= 5) {
return 'from-amber-500 to-yellow-400';
}
    return 'from-gray-500 to-gray-400';
  };
  
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Zap className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Edge Detected
          </span>
        </div>
        <span className={`text-sm font-bold ${
          edge >= 10 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-gray-300' : 'text-gray-700')
        }`}>
          +{animatedEdge.toFixed(1)}%
        </span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>0%</span>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>+{maxEdge}%</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PULSE EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

export const PulseEffect = ({ isActive, color = 'emerald', children }) => {
  const colors = {
    emerald: 'ring-emerald-400/50',
    blue: 'ring-blue-400/50',
    amber: 'ring-amber-400/50',
    red: 'ring-red-400/50',
    cyan: 'ring-cyan-400/50'
  };
  
  return (
    <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
      {isActive && (
        <>
          <div className={`absolute inset-0 rounded-full ring-4 ${colors[color]} animate-ping`} />
          <div className={`absolute inset-0 rounded-full ring-2 ${colors[color]}`} />
        </>
      )}
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TREND ARROW ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const AnimatedTrendArrow = ({ direction, size = 'md', animate = true, isDark }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const sizeClass = sizes[size];
  
  const Icon = direction === 'up' ? ArrowUpRight : 
               direction === 'down' ? ArrowDownRight : Minus;
  
  const colorClass = direction === 'up' 
    ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
    : direction === 'down' 
      ? (isDark ? 'text-red-400' : 'text-red-600')
      : (isDark ? 'text-gray-400' : 'text-gray-500');
  
  return (
    <div className={`inline-flex ${animate ? 'animate-bounce' : ''}`}>
      <Icon className={`${sizeClass} ${colorClass}`} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STREAM ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const DataStream = ({ isActive, width = 200, height = 20, isDark }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }
    
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({ ...p, x: p.x + p.speed }))
          .filter(p => p.x < width);
        
        if (Math.random() > 0.7) {
          updated.push({
            id: Date.now(),
            x: 0,
            y: Math.random() * height,
            size: 2 + Math.random() * 3,
            speed: 2 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.7
          });
        }
        
        return updated;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, width, height]);
  
  return (
    <svg width={width} height={height} className="overflow-hidden">
      {particles.map(p => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill={isDark ? '#34d399' : '#10b981'}
          opacity={p.opacity}
        />
      ))}
      {/* Gradient fade at edges */}
      <defs>
        <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? '#0f172a' : '#ffffff'} stopOpacity="1" />
          <stop offset="10%" stopColor={isDark ? '#0f172a' : '#ffffff'} stopOpacity="0" />
          <stop offset="90%" stopColor={isDark ? '#0f172a' : '#ffffff'} stopOpacity="0" />
          <stop offset="100%" stopColor={isDark ? '#0f172a' : '#ffffff'} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#fadeGrad)" />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HISTOGRAM BAR ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const AnimatedHistogramBar = ({ value, max, label, delay = 0, isDark }) => {
  const [height, setHeight] = useState(0);
  const percentage = (value / max) * 100;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeight(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-6 h-16 rounded-t-sm overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'} relative`}>
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-700 ease-out"
          style={{ height: `${height}%` }}
        />
      </div>
      {label && (
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPARKLE EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

export const SparkleEffect = ({ isActive, children }) => {
  const [sparkles, setSparkles] = useState([]);
  
  useEffect(() => {
    if (!isActive) {
      setSparkles([]);
      return;
    }
    
    const interval = setInterval(() => {
      setSparkles(prev => {
        const now = Date.now();
        const filtered = prev.filter(s => now - s.created < 1000);
        
        if (Math.random() > 0.5) {
          filtered.push({
            id: now,
            created: now,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 4 + Math.random() * 8
          });
        }
        
        return filtered;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div className="relative">
      {children}
      {sparkles.map(s => (
        <Sparkles
          key={s.id}
          className="absolute text-amber-400 animate-ping"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 1 - ((Date.now() - s.created) / 1000)
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RADAR SCAN ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const RadarScan = ({ isActive, size = 80, isDark }) => {
  const [angle, setAngle] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
return;
}
    
    const interval = setInterval(() => {
      setAngle(prev => (prev + 3) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  const center = size / 2;
  const radius = (size - 10) / 2;
  
  return (
    <svg width={size} height={size}>
      {/* Background circles */}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * r}
          fill="none"
          stroke={isDark ? '#1e293b' : '#e5e7eb'}
          strokeWidth={1}
        />
      ))}
      
      {/* Crosshairs */}
      <line x1={center} y1={5} x2={center} y2={size - 5} stroke={isDark ? '#1e293b' : '#e5e7eb'} strokeWidth={1} />
      <line x1={5} y1={center} x2={size - 5} y2={center} stroke={isDark ? '#1e293b' : '#e5e7eb'} strokeWidth={1} />
      
      {/* Sweep */}
      {isActive && (
        <defs>
          <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#34d399' : '#10b981'} stopOpacity="0.5" />
            <stop offset="100%" stopColor={isDark ? '#34d399' : '#10b981'} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      
      {isActive && (
        <g transform={`rotate(${angle}, ${center}, ${center})`}>
          <path
            d={`M ${center} ${center} L ${center + radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos(Math.PI / 4)} ${center - radius * Math.sin(Math.PI / 4)} Z`}
            fill="url(#sweepGrad)"
          />
          <line
            x1={center}
            y1={center}
            x2={center + radius}
            y2={center}
            stroke={isDark ? '#34d399' : '#10b981'}
            strokeWidth={2}
          />
        </g>
      )}
      
      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={3}
        fill={isDark ? '#34d399' : '#10b981'}
        className={isActive ? 'animate-pulse' : ''}
      />
    </svg>
  );
};

export default {
  NeuralNetworkVisual,
  ProcessingLoader,
  ConfidenceRing,
  EdgeMeter,
  PulseEffect,
  AnimatedTrendArrow,
  DataStream,
  AnimatedHistogramBar,
  SparkleEffect,
  RadarScan
};
