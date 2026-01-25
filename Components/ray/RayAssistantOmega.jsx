// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🌌 RAY v10.0 OMEGA - THE WORLD'S MOST ADVANCED PLAYER ANALYTICS CHATBOT                                  ║
// ║  ═══════════════════════════════════════════════════════════════════════════════════════════════════════  ║
// ║  🧠 Neural Networks • 🌌 Holographic Design • 📊 Inline Charts • 💎 Player Cards • 🎯 Prop Analysis       ║
// ║  ⚔️ Comparisons • 📈 Trends • 💰 EV Calculator • 🏆 Rankings • 🎮 Fantasy • 🗣️ Voice • 🎨 Animations      ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Brain, Sparkles,
  TrendingUp, TrendingDown, Target, Zap, Activity, Crown, Cpu, Shield,
  Maximize2, Minimize2, Clock, Flame, MessageSquare, BarChart3, 
  Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, StopCircle,
  ChevronRight, ArrowUp, ArrowDown, Minus, Star, Award,
  DollarSign, Percent, Calendar, Users, GitCompare, LineChart,
  AlertTriangle, CheckCircle, XCircle, Info, BookOpen
} from 'lucide-react';

// Import our MEGA ENGINES
import rayConversationBrain from './RayConversationBrain';
import rayAnalytics, { PLAYERS_DB, TEAMS_DB } from './RayAnalyticsEngine';
import rayPropIntelligence from './RayPropIntelligence';
import rayComparisonEngine from './RayComparisonEngine';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎨 OMEGA QUANTUM STYLES - WORLD'S MOST ADVANCED UI
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const omegaStyles = `
  /* ═════════════════════════════════════════════════════════════════════════════════════
     QUANTUM COLOR SYSTEM - 50+ Custom Properties
     ═════════════════════════════════════════════════════════════════════════════════════ */
  :root {
    --omega-void: #000000;
    --omega-abyss: #020208;
    --omega-deep: #050510;
    --omega-dark: #0a0a18;
    --omega-surface: #101020;
    --omega-elevated: #161630;
    --omega-hover: #1c1c40;
    
    --omega-purple: #8b5cf6;
    --omega-purple-bright: #a78bfa;
    --omega-purple-light: #c4b5fd;
    --omega-purple-dim: rgba(139, 92, 246, 0.12);
    --omega-purple-glow: rgba(139, 92, 246, 0.5);
    --omega-purple-intense: rgba(139, 92, 246, 0.8);
    
    --omega-cyan: #06b6d4;
    --omega-cyan-bright: #22d3ee;
    --omega-cyan-dim: rgba(6, 182, 212, 0.12);
    --omega-cyan-glow: rgba(6, 182, 212, 0.5);
    
    --omega-pink: #ec4899;
    --omega-pink-bright: #f472b6;
    --omega-pink-dim: rgba(236, 72, 153, 0.12);
    --omega-pink-glow: rgba(236, 72, 153, 0.5);
    
    --omega-green: #10b981;
    --omega-green-bright: #34d399;
    --omega-green-dim: rgba(16, 185, 129, 0.12);
    
    --omega-orange: #f59e0b;
    --omega-orange-bright: #fbbf24;
    
    --omega-red: #ef4444;
    --omega-red-bright: #f87171;
    --omega-red-dim: rgba(239, 68, 68, 0.12);
    
    --omega-gold: #fcd34d;
    --omega-silver: #9ca3af;
    --omega-bronze: #d97706;
    
    --omega-white: #ffffff;
    --omega-text: rgba(255, 255, 255, 0.95);
    --omega-text-secondary: rgba(255, 255, 255, 0.75);
    --omega-text-dim: rgba(255, 255, 255, 0.55);
    --omega-text-muted: rgba(255, 255, 255, 0.35);
    
    --omega-border: rgba(139, 92, 246, 0.15);
    --omega-border-bright: rgba(139, 92, 246, 0.4);
    --omega-divider: rgba(255, 255, 255, 0.08);
    
    --omega-glass: rgba(10, 10, 24, 0.85);
    --omega-glass-light: rgba(20, 20, 48, 0.6);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     BASE CONTAINER - OMEGA REALM
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-realm {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    perspective: 1200px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     HOLOGRAPHIC ORB - FLOATING AI PORTAL
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-orb {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 30% 30%, 
      var(--omega-elevated) 0%, 
      var(--omega-dark) 40%, 
      var(--omega-abyss) 100%);
    border: none;
    cursor: pointer;
    position: relative;
    transform-style: preserve-3d;
    animation: orb-float 5s ease-in-out infinite;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.6),
      0 0 60px var(--omega-purple-glow),
      0 0 120px rgba(139, 92, 246, 0.2),
      inset 0 -15px 30px rgba(0, 0, 0, 0.4),
      inset 0 15px 30px rgba(139, 92, 246, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  @keyframes orb-float {
    0%, 100% { 
      transform: translateY(0) rotateX(0deg) rotateY(0deg) scale(1);
    }
    25% { 
      transform: translateY(-6px) rotateX(3deg) rotateY(-3deg) scale(1.01);
    }
    50% { 
      transform: translateY(-10px) rotateX(0deg) rotateY(0deg) scale(1.02);
    }
    75% { 
      transform: translateY(-6px) rotateX(-3deg) rotateY(3deg) scale(1.01);
    }
  }

  .omega-orb:hover {
    animation-play-state: paused;
    transform: scale(1.12) translateY(-5px);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.7),
      0 0 80px var(--omega-purple-glow),
      0 0 160px rgba(139, 92, 246, 0.3);
  }

  /* Holographic Rings */
  .omega-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
    pointer-events: none;
  }

  .omega-ring-1 {
    inset: -6px;
    border-top-color: var(--omega-purple);
    border-right-color: var(--omega-purple);
    animation: ring-orbit 3s linear infinite;
    filter: drop-shadow(0 0 8px var(--omega-purple));
  }

  .omega-ring-2 {
    inset: -12px;
    border-bottom-color: var(--omega-cyan);
    border-left-color: var(--omega-cyan);
    animation: ring-orbit 4s linear infinite reverse;
    filter: drop-shadow(0 0 8px var(--omega-cyan));
    opacity: 0.8;
  }

  .omega-ring-3 {
    inset: -18px;
    border-top-color: var(--omega-pink);
    animation: ring-orbit 5s linear infinite;
    filter: drop-shadow(0 0 8px var(--omega-pink));
    opacity: 0.5;
  }

  @keyframes ring-orbit {
    from { transform: rotateZ(0deg) rotateX(65deg); }
    to { transform: rotateZ(360deg) rotateX(65deg); }
  }

  /* Orbiting Particles */
  .omega-particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    margin: -3px;
    pointer-events: none;
  }

  .omega-particle-1 { 
    background: var(--omega-purple-bright);
    box-shadow: 0 0 15px var(--omega-purple);
    animation: particle-spin 2.5s linear infinite;
  }
  .omega-particle-2 { 
    background: var(--omega-cyan-bright);
    box-shadow: 0 0 15px var(--omega-cyan);
    animation: particle-spin 3s linear infinite;
    animation-delay: -1s;
  }
  .omega-particle-3 { 
    background: var(--omega-pink-bright);
    box-shadow: 0 0 15px var(--omega-pink);
    animation: particle-spin 3.5s linear infinite;
    animation-delay: -2s;
  }
  .omega-particle-4 { 
    background: var(--omega-green-bright);
    box-shadow: 0 0 15px var(--omega-green);
    animation: particle-spin 4s linear infinite;
    animation-delay: -0.5s;
  }

  @keyframes particle-spin {
    from { transform: rotate(0deg) translateX(48px) rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) translateX(48px) rotate(-180deg) scale(1.5); }
    to { transform: rotate(360deg) translateX(48px) rotate(-360deg) scale(1); }
  }

  /* Orb Core */
  .omega-core {
    position: absolute;
    inset: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      var(--omega-surface) 0%, 
      var(--omega-elevated) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--omega-border);
    overflow: hidden;
  }

  .omega-core::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: conic-gradient(
      from 0deg,
      transparent 0%,
      var(--omega-purple-dim) 20%,
      transparent 40%,
      var(--omega-cyan-dim) 60%,
      transparent 80%,
      var(--omega-pink-dim) 100%
    );
    animation: core-spin 6s linear infinite;
  }

  @keyframes core-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .omega-brain {
    position: relative;
    z-index: 2;
    color: var(--omega-purple-bright);
    filter: drop-shadow(0 0 12px var(--omega-purple));
    animation: brain-pulse 2.5s ease-in-out infinite;
  }

  @keyframes brain-pulse {
    0%, 100% { 
      filter: drop-shadow(0 0 12px var(--omega-purple));
      transform: scale(1);
    }
    50% { 
      filter: drop-shadow(0 0 20px var(--omega-purple)) drop-shadow(0 0 35px var(--omega-cyan));
      transform: scale(1.08);
    }
  }

  /* Notification Badge */
  .omega-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    background: linear-gradient(135deg, var(--omega-red), #dc2626);
    border-radius: 11px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--omega-abyss);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
    animation: badge-bounce 2s ease-in-out infinite;
    z-index: 10;
  }

  @keyframes badge-bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     MAIN PANEL - QUANTUM INTERFACE
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-panel {
    width: 480px;
    height: 720px;
    background: linear-gradient(180deg, 
      var(--omega-abyss) 0%, 
      var(--omega-deep) 30%,
      var(--omega-dark) 70%,
      var(--omega-abyss) 100%);
    border-radius: 24px;
    border: 1px solid var(--omega-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    box-shadow: 
      0 50px 100px rgba(0, 0, 0, 0.8),
      0 0 80px rgba(139, 92, 246, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(0, 0, 0, 0.5);
    animation: panel-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .omega-panel.expanded {
    width: 620px;
    height: 820px;
  }

  @keyframes panel-enter {
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.95) rotateX(5deg); 
      filter: blur(8px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1) rotateX(0deg); 
      filter: blur(0);
    }
  }

  /* Animated Border Gradient */
  .omega-panel::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 25px;
    background: linear-gradient(45deg, 
      var(--omega-purple), 
      var(--omega-cyan), 
      var(--omega-pink), 
      var(--omega-purple));
    background-size: 300% 300%;
    animation: border-flow 8s linear infinite;
    z-index: -1;
    opacity: 0.4;
  }

  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Neural Network Background */
  .omega-neural-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.6;
  }

  .omega-node {
    position: absolute;
    border-radius: 50%;
    background: var(--omega-purple);
    box-shadow: 0 0 10px var(--omega-purple-glow);
    animation: node-pulse 4s ease-in-out infinite;
  }

  @keyframes node-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.5); }
  }

  .omega-connection {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--omega-purple-dim), transparent);
    transform-origin: left center;
    animation: connection-flow 6s ease-in-out infinite;
  }

  @keyframes connection-flow {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.5; }
  }

  /* Matrix Rain */
  .omega-matrix {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.15;
  }

  .omega-matrix-col {
    position: absolute;
    top: -100%;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: var(--omega-green);
    writing-mode: vertical-rl;
    text-orientation: upright;
    animation: matrix-fall linear infinite;
    text-shadow: 0 0 10px var(--omega-green);
  }

  @keyframes matrix-fall {
    from { transform: translateY(0); }
    to { transform: translateY(200%); }
  }

  /* Scan Line */
  .omega-scanline {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      var(--omega-cyan-glow), 
      transparent);
    animation: scanline-sweep 4s linear infinite;
    pointer-events: none;
  }

  @keyframes scanline-sweep {
    0% { top: -5%; opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { top: 105%; opacity: 0; }
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     HEADER
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(180deg, 
      rgba(139, 92, 246, 0.08) 0%, 
      transparent 100%);
    border-bottom: 1px solid var(--omega-divider);
    position: relative;
    z-index: 10;
  }

  .omega-identity {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .omega-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, 
      var(--omega-purple) 0%, 
      var(--omega-cyan) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 
      0 4px 15px var(--omega-purple-glow),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .omega-name-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .omega-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--omega-white);
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .omega-name-badge {
    padding: 2px 6px;
    background: linear-gradient(135deg, var(--omega-green), #059669);
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .omega-tagline {
    font-size: 12px;
    color: var(--omega-text-dim);
  }

  .omega-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .omega-btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--omega-border);
    background: var(--omega-surface);
    color: var(--omega-text-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .omega-btn-icon:hover {
    background: var(--omega-elevated);
    color: var(--omega-purple-bright);
    border-color: var(--omega-purple);
    box-shadow: 0 0 15px var(--omega-purple-dim);
  }

  .omega-btn-icon.active {
    background: var(--omega-purple-dim);
    color: var(--omega-purple-bright);
    border-color: var(--omega-purple);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     QUICK ACTIONS BAR
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-quick-bar {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border-bottom: 1px solid var(--omega-divider);
  }

  .omega-quick-bar::-webkit-scrollbar {
    display: none;
  }

  .omega-quick-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    border-radius: 20px;
    color: var(--omega-text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .omega-quick-btn:hover {
    background: var(--omega-purple-dim);
    color: var(--omega-purple-bright);
    border-color: var(--omega-purple);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--omega-purple-dim);
  }

  .omega-quick-btn svg {
    width: 14px;
    height: 14px;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     MESSAGES AREA
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-messages {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
    position: relative;
    z-index: 5;
  }

  .omega-messages::-webkit-scrollbar {
    width: 6px;
  }

  .omega-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .omega-messages::-webkit-scrollbar-thumb {
    background: var(--omega-border);
    border-radius: 3px;
  }

  .omega-messages::-webkit-scrollbar-thumb:hover {
    background: var(--omega-purple);
  }

  /* Message Bubble */
  .omega-msg {
    display: flex;
    flex-direction: column;
    animation: msg-appear 0.3s ease;
  }

  @keyframes msg-appear {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  .omega-msg.user {
    align-items: flex-end;
  }

  .omega-msg.assistant {
    align-items: flex-start;
  }

  .omega-msg-bubble {
    max-width: 90%;
    padding: 14px 18px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.6;
    position: relative;
  }

  .omega-msg.user .omega-msg-bubble {
    background: linear-gradient(135deg, var(--omega-purple), var(--omega-purple-bright));
    color: white;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 20px var(--omega-purple-glow);
  }

  .omega-msg.assistant .omega-msg-bubble {
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    color: var(--omega-text);
    border-bottom-left-radius: 6px;
  }

  .omega-msg-time {
    font-size: 10px;
    color: var(--omega-text-muted);
    margin-top: 4px;
    padding: 0 4px;
  }

  /* Markdown Rendering */
  .omega-msg-bubble h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--omega-purple-bright);
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--omega-divider);
  }

  .omega-msg-bubble h3 {
    font-size: 13px;
    font-weight: 600;
    color: var(--omega-cyan-bright);
    margin: 16px 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .omega-msg-bubble strong {
    color: var(--omega-white);
    font-weight: 600;
  }

  .omega-msg-bubble p {
    margin: 0 0 10px 0;
  }

  .omega-msg-bubble p:last-child {
    margin-bottom: 0;
  }

  .omega-msg-bubble ul, .omega-msg-bubble ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  .omega-msg-bubble li {
    margin: 4px 0;
  }

  .omega-msg-bubble code {
    background: rgba(139, 92, 246, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--omega-purple-bright);
  }

  .omega-msg-bubble table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 12px;
  }

  .omega-msg-bubble th {
    background: var(--omega-elevated);
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    color: var(--omega-text-secondary);
    border-bottom: 1px solid var(--omega-border);
  }

  .omega-msg-bubble td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--omega-divider);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     THINKING STATE
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-thinking {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 18px;
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    border-radius: 18px;
    border-bottom-left-radius: 6px;
    max-width: 90%;
  }

  .omega-thinking-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--omega-purple-bright);
    font-size: 12px;
    font-weight: 600;
  }

  .omega-thinking-dots {
    display: flex;
    gap: 4px;
  }

  .omega-thinking-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--omega-purple);
    animation: dot-bounce 1.2s ease-in-out infinite;
  }

  .omega-thinking-dot:nth-child(2) { animation-delay: 0.1s; }
  .omega-thinking-dot:nth-child(3) { animation-delay: 0.2s; }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
    40% { transform: scale(1.3); opacity: 1; }
  }

  .omega-thinking-steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .omega-thinking-step {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--omega-text-dim);
    animation: step-appear 0.3s ease;
  }

  @keyframes step-appear {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .omega-thinking-step svg {
    width: 12px;
    height: 12px;
    color: var(--omega-green);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     STREAMING TEXT
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-streaming {
    padding: 14px 18px;
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    border-radius: 18px;
    border-bottom-left-radius: 6px;
    max-width: 90%;
    font-size: 14px;
    line-height: 1.6;
    color: var(--omega-text);
  }

  .omega-cursor {
    display: inline-block;
    width: 2px;
    height: 16px;
    background: var(--omega-purple-bright);
    margin-left: 2px;
    animation: cursor-blink 0.8s ease-in-out infinite;
    vertical-align: text-bottom;
  }

  @keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     SUGGESTIONS
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .omega-suggestion {
    padding: 8px 14px;
    background: var(--omega-elevated);
    border: 1px solid var(--omega-border);
    border-radius: 16px;
    font-size: 12px;
    color: var(--omega-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .omega-suggestion:hover {
    background: var(--omega-purple-dim);
    border-color: var(--omega-purple);
    color: var(--omega-purple-bright);
    transform: translateY(-2px);
  }

  .omega-suggestion svg {
    width: 12px;
    height: 12px;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     INLINE PLAYER CARD
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-player-card {
    background: linear-gradient(135deg, 
      var(--omega-elevated) 0%, 
      var(--omega-surface) 100%);
    border: 1px solid var(--omega-border);
    border-radius: 16px;
    padding: 16px;
    margin: 12px 0;
  }

  .omega-player-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .omega-player-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--omega-purple), var(--omega-cyan));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .omega-player-info {
    flex: 1;
  }

  .omega-player-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--omega-white);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .omega-player-team {
    font-size: 12px;
    color: var(--omega-text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .omega-player-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .omega-player-trend.up {
    background: var(--omega-green-dim);
    color: var(--omega-green-bright);
  }

  .omega-player-trend.down {
    background: var(--omega-red-dim);
    color: var(--omega-red-bright);
  }

  .omega-player-trend.stable {
    background: var(--omega-purple-dim);
    color: var(--omega-purple-bright);
  }

  .omega-player-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .omega-stat-box {
    background: var(--omega-dark);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
  }

  .omega-stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--omega-white);
  }

  .omega-stat-label {
    font-size: 10px;
    color: var(--omega-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     INLINE PROP CARD
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-prop-card {
    background: linear-gradient(135deg, 
      var(--omega-surface) 0%, 
      var(--omega-elevated) 100%);
    border: 1px solid var(--omega-border);
    border-radius: 16px;
    padding: 16px;
    margin: 12px 0;
  }

  .omega-prop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .omega-prop-player {
    font-size: 14px;
    font-weight: 600;
    color: var(--omega-white);
  }

  .omega-prop-type {
    font-size: 12px;
    color: var(--omega-purple-bright);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .omega-prop-line {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: var(--omega-dark);
    border-radius: 12px;
    margin-bottom: 12px;
  }

  .omega-prop-side {
    flex: 1;
    text-align: center;
  }

  .omega-prop-direction {
    font-size: 12px;
    color: var(--omega-text-dim);
    margin-bottom: 4px;
  }

  .omega-prop-odds {
    font-size: 20px;
    font-weight: 700;
  }

  .omega-prop-odds.over {
    color: var(--omega-green-bright);
  }

  .omega-prop-odds.under {
    color: var(--omega-red-bright);
  }

  .omega-prop-value {
    font-size: 28px;
    font-weight: 800;
    color: var(--omega-white);
    padding: 0 16px;
    border-left: 1px solid var(--omega-divider);
    border-right: 1px solid var(--omega-divider);
  }

  .omega-prop-analysis {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .omega-analysis-box {
    background: var(--omega-dark);
    border-radius: 10px;
    padding: 10px 12px;
  }

  .omega-analysis-label {
    font-size: 10px;
    color: var(--omega-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .omega-analysis-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--omega-white);
    margin-top: 2px;
  }

  .omega-analysis-value.positive {
    color: var(--omega-green-bright);
  }

  .omega-analysis-value.negative {
    color: var(--omega-red-bright);
  }

  .omega-prop-recommendation {
    margin-top: 12px;
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .omega-prop-recommendation.strong {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.15) 0%, 
      rgba(16, 185, 129, 0.05) 100%);
    border: 1px solid var(--omega-green);
  }

  .omega-prop-recommendation.avoid {
    background: linear-gradient(135deg, 
      rgba(239, 68, 68, 0.15) 0%, 
      rgba(239, 68, 68, 0.05) 100%);
    border: 1px solid var(--omega-red);
  }

  .omega-prop-recommendation.neutral {
    background: var(--omega-dark);
    border: 1px solid var(--omega-border);
  }

  .omega-rec-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .omega-rec-icon.strong {
    background: var(--omega-green);
    color: white;
  }

  .omega-rec-icon.avoid {
    background: var(--omega-red);
    color: white;
  }

  .omega-rec-icon.neutral {
    background: var(--omega-purple);
    color: white;
  }

  .omega-rec-text {
    flex: 1;
  }

  .omega-rec-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--omega-white);
  }

  .omega-rec-subtitle {
    font-size: 11px;
    color: var(--omega-text-dim);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     INLINE COMPARISON CARD
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-compare-card {
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    border-radius: 16px;
    padding: 16px;
    margin: 12px 0;
  }

  .omega-compare-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .omega-compare-vs {
    font-size: 12px;
    font-weight: 700;
    color: var(--omega-purple-bright);
    padding: 4px 12px;
    background: var(--omega-purple-dim);
    border-radius: 12px;
  }

  .omega-compare-players {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 12px;
    align-items: center;
  }

  .omega-compare-player {
    text-align: center;
  }

  .omega-compare-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--omega-white);
    margin-bottom: 4px;
  }

  .omega-compare-score {
    font-size: 28px;
    font-weight: 800;
  }

  .omega-compare-score.winner {
    color: var(--omega-green-bright);
  }

  .omega-compare-score.loser {
    color: var(--omega-text-dim);
  }

  .omega-compare-divider {
    width: 1px;
    height: 60px;
    background: var(--omega-divider);
  }

  .omega-compare-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  .omega-compare-stat {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 12px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--omega-divider);
  }

  .omega-compare-stat:last-child {
    border-bottom: none;
  }

  .omega-compare-val {
    font-size: 16px;
    font-weight: 600;
  }

  .omega-compare-val.winner {
    color: var(--omega-green-bright);
  }

  .omega-compare-label {
    font-size: 11px;
    color: var(--omega-text-muted);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     INLINE CHART (MINI SPARKLINE)
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-sparkline {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 40px;
    padding: 8px 0;
  }

  .omega-spark-bar {
    flex: 1;
    min-width: 12px;
    max-width: 20px;
    background: var(--omega-purple);
    border-radius: 3px 3px 0 0;
    transition: all 0.3s ease;
  }

  .omega-spark-bar:hover {
    background: var(--omega-purple-bright);
    transform: scaleY(1.1);
    transform-origin: bottom;
  }

  .omega-spark-bar.high {
    background: var(--omega-green);
  }

  .omega-spark-bar.low {
    background: var(--omega-red);
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     MESSAGE ACTIONS
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-msg-actions {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .omega-msg:hover .omega-msg-actions {
    opacity: 1;
  }

  .omega-action-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: var(--omega-elevated);
    color: var(--omega-text-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .omega-action-btn:hover {
    background: var(--omega-purple-dim);
    color: var(--omega-purple-bright);
  }

  .omega-action-btn.active {
    background: var(--omega-green);
    color: white;
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     INPUT AREA
     ═════════════════════════════════════════════════════════════════════════════════════ */
  .omega-input-area {
    padding: 16px;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(139, 92, 246, 0.03) 100%);
    border-top: 1px solid var(--omega-divider);
    position: relative;
    z-index: 10;
  }

  .omega-input-container {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--omega-surface);
    border: 1px solid var(--omega-border);
    border-radius: 20px;
    padding: 10px 14px;
    transition: all 0.3s ease;
  }

  .omega-input-container:focus-within {
    border-color: var(--omega-purple);
    box-shadow: 
      0 0 0 3px var(--omega-purple-dim),
      0 0 30px var(--omega-purple-dim);
  }

  .omega-voice-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .omega-voice-btn.idle {
    background: var(--omega-elevated);
    color: var(--omega-text-dim);
  }

  .omega-voice-btn.idle:hover {
    background: var(--omega-purple-dim);
    color: var(--omega-purple-bright);
  }

  .omega-voice-btn.listening {
    background: var(--omega-red);
    color: white;
    animation: voice-pulse 1.2s ease-in-out infinite;
  }

  @keyframes voice-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  }

  .omega-textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--omega-text);
    font-size: 14px;
    font-family: inherit;
    line-height: 1.5;
    resize: none;
    outline: none;
    min-height: 24px;
    max-height: 120px;
    padding: 8px 0;
  }

  .omega-textarea::placeholder {
    color: var(--omega-text-muted);
  }

  .omega-send-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .omega-send-btn.ready {
    background: linear-gradient(135deg, var(--omega-purple), var(--omega-cyan));
    color: white;
    box-shadow: 0 4px 15px var(--omega-purple-glow);
  }

  .omega-send-btn.ready:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 25px var(--omega-purple-glow);
  }

  .omega-send-btn:disabled {
    background: var(--omega-elevated);
    color: var(--omega-text-muted);
    cursor: not-allowed;
    box-shadow: none;
  }

  .omega-send-btn.stop {
    background: var(--omega-red);
    color: white;
    animation: stop-glow 1.5s ease-in-out infinite;
  }

  @keyframes stop-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
  }

  /* Voice Waveform */
  .omega-waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 20px;
  }

  .omega-wave-bar {
    width: 3px;
    border-radius: 2px;
    background: white;
  }

  .omega-wave-bar:nth-child(1) { height: 6px; animation: wave-dance 0.5s ease-in-out infinite; }
  .omega-wave-bar:nth-child(2) { height: 14px; animation: wave-dance 0.5s ease-in-out infinite 0.1s; }
  .omega-wave-bar:nth-child(3) { height: 10px; animation: wave-dance 0.5s ease-in-out infinite 0.2s; }
  .omega-wave-bar:nth-child(4) { height: 18px; animation: wave-dance 0.5s ease-in-out infinite 0.3s; }
  .omega-wave-bar:nth-child(5) { height: 8px; animation: wave-dance 0.5s ease-in-out infinite 0.4s; }

  @keyframes wave-dance {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1.3); }
  }

  /* ═════════════════════════════════════════════════════════════════════════════════════
     RESPONSIVE
     ═════════════════════════════════════════════════════════════════════════════════════ */
  @media (max-width: 520px) {
    .omega-panel {
      width: calc(100vw - 32px);
      height: calc(100vh - 100px);
      max-height: 700px;
    }

    .omega-realm {
      bottom: 16px;
      right: 16px;
    }

    .omega-orb {
      width: 60px;
      height: 60px;
    }

    .omega-player-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 INLINE COMPONENT: PLAYER CARD
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const PlayerCard = memo(({ data }) => {
  if (!data) return null;

  const { name, team, position, stats, trend } = data;
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className="omega-player-card">
      <div className="omega-player-header">
        <div className="omega-player-avatar">{initials}</div>
        <div className="omega-player-info">
          <div className="omega-player-name">
            {name}
            {trend?.direction === 'up' && <TrendingUp size={16} color="#34d399" />}
            {trend?.direction === 'down' && <TrendingDown size={16} color="#f87171" />}
          </div>
          <div className="omega-player-team">{team} • {position}</div>
        </div>
        <div className={`omega-player-trend ${trend?.direction || 'stable'}`}>
          {trend?.direction === 'up' ? <ArrowUp size={12} /> : 
           trend?.direction === 'down' ? <ArrowDown size={12} /> : <Minus size={12} />}
          {trend?.direction === 'up' ? 'HOT' : trend?.direction === 'down' ? 'COLD' : 'STABLE'}
        </div>
      </div>
      <div className="omega-player-stats">
        <div className="omega-stat-box">
          <div className="omega-stat-value">{stats?.pts || 0}</div>
          <div className="omega-stat-label">PTS</div>
        </div>
        <div className="omega-stat-box">
          <div className="omega-stat-value">{stats?.reb || 0}</div>
          <div className="omega-stat-label">REB</div>
        </div>
        <div className="omega-stat-box">
          <div className="omega-stat-value">{stats?.ast || 0}</div>
          <div className="omega-stat-label">AST</div>
        </div>
        <div className="omega-stat-box">
          <div className="omega-stat-value">{((stats?.fg_pct || 0) * 100).toFixed(0)}%</div>
          <div className="omega-stat-label">FG%</div>
        </div>
      </div>
      {/* Mini Sparkline */}
      {data.gameLog && (
        <div className="omega-sparkline">
          {data.gameLog.slice(0, 10).reverse().map((g, i) => {
            const avg = stats?.pts || 20;
            const height = Math.min(100, Math.max(20, (g.pts / avg) * 60));
            const isHigh = g.pts > avg * 1.1;
            const isLow = g.pts < avg * 0.9;
            return (
              <div 
                key={i} 
                className={`omega-spark-bar ${isHigh ? 'high' : isLow ? 'low' : ''}`}
                style={{ height: `${height}%` }}
                title={`${g.pts} PTS vs ${g.opponent}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 💰 INLINE COMPONENT: PROP CARD
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const PropCard = memo(({ data }) => {
  if (!data) return null;

  const isPositive = data.recommendation?.includes('OVER') || data.recommendation?.includes('STRONG');
  const isNegative = data.recommendation?.includes('AVOID') || data.recommendation?.includes('NO PLAY');

  return (
    <div className="omega-prop-card">
      <div className="omega-prop-header">
        <div className="omega-prop-player">{data.player}</div>
        <div className="omega-prop-type">{data.prop}</div>
      </div>
      <div className="omega-prop-line">
        <div className="omega-prop-side">
          <div className="omega-prop-direction">OVER</div>
          <div className="omega-prop-odds over">
            {data.overOdds > 0 ? '+' : ''}{data.overOdds}
          </div>
        </div>
        <div className="omega-prop-value">{data.line}</div>
        <div className="omega-prop-side">
          <div className="omega-prop-direction">UNDER</div>
          <div className="omega-prop-odds under">
            {data.underOdds > 0 ? '+' : ''}{data.underOdds}
          </div>
        </div>
      </div>
      <div className="omega-prop-analysis">
        <div className="omega-analysis-box">
          <div className="omega-analysis-label">Season Avg</div>
          <div className="omega-analysis-value">{data.seasonAvg}</div>
        </div>
        <div className="omega-analysis-box">
          <div className="omega-analysis-label">Last 5 Avg</div>
          <div className="omega-analysis-value">{data.last5Avg}</div>
        </div>
        <div className="omega-analysis-box">
          <div className="omega-analysis-label">Hit Rate</div>
          <div className={`omega-analysis-value ${data.hitRate?.over > 55 ? 'positive' : data.hitRate?.over < 45 ? 'negative' : ''}`}>
            {data.hitRate?.over || 50}%
          </div>
        </div>
        <div className="omega-analysis-box">
          <div className="omega-analysis-label">Edge</div>
          <div className={`omega-analysis-value ${parseFloat(data.overEV?.edge) > 0 ? 'positive' : 'negative'}`}>
            {data.overEV?.edge || 0}%
          </div>
        </div>
      </div>
      <div className={`omega-prop-recommendation ${isPositive ? 'strong' : isNegative ? 'avoid' : 'neutral'}`}>
        <div className={`omega-rec-icon ${isPositive ? 'strong' : isNegative ? 'avoid' : 'neutral'}`}>
          {isPositive ? <CheckCircle size={18} /> : isNegative ? <XCircle size={18} /> : <Info size={18} />}
        </div>
        <div className="omega-rec-text">
          <div className="omega-rec-title">{data.recommendation || 'Analyzing...'}</div>
          <div className="omega-rec-subtitle">Confidence: {data.confidence || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// ⚔️ INLINE COMPONENT: COMPARISON CARD
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const ComparisonCard = memo(({ data }) => {
  if (!data || !data.player1 || !data.player2) return null;

  const p1 = data.player1;
  const p2 = data.player2;
  const p1Wins = p1.overallScore > p2.overallScore;

  return (
    <div className="omega-compare-card">
      <div className="omega-compare-header">
        <span style={{ color: 'var(--omega-text-secondary)', fontSize: '12px' }}>Head to Head</span>
        <div className="omega-compare-vs">VS</div>
        <span style={{ color: 'var(--omega-text-secondary)', fontSize: '12px' }}>{data.timeframe}</span>
      </div>
      <div className="omega-compare-players">
        <div className="omega-compare-player">
          <div className="omega-compare-name">{p1.name.split(' ')[1]}</div>
          <div className={`omega-compare-score ${p1Wins ? 'winner' : 'loser'}`}>
            {p1.overallScore}
          </div>
        </div>
        <div className="omega-compare-divider" />
        <div className="omega-compare-player">
          <div className="omega-compare-name">{p2.name.split(' ')[1]}</div>
          <div className={`omega-compare-score ${!p1Wins ? 'winner' : 'loser'}`}>
            {p2.overallScore}
          </div>
        </div>
      </div>
      <div className="omega-compare-stats">
        {['pts', 'reb', 'ast'].map(stat => {
          const p1Val = p1.stats?.[stat] || 0;
          const p2Val = p2.stats?.[stat] || 0;
          return (
            <div key={stat} className="omega-compare-stat">
              <div className={`omega-compare-val ${p1Val > p2Val ? 'winner' : ''}`} style={{ textAlign: 'right' }}>
                {p1Val}
              </div>
              <div className="omega-compare-label">{stat.toUpperCase()}</div>
              <div className={`omega-compare-val ${p2Val > p1Val ? 'winner' : ''}`} style={{ textAlign: 'left' }}>
                {p2Val}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const formatTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const parseMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/## (.*?)(?:\n|$)/g, '<h2>$1</h2>')
    .replace(/### (.*?)(?:\n|$)/g, '<h3>$1</h3>')
    .replace(/• /g, '&bull; ')
    .replace(/\n/g, '<br/>');
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌌 MAIN OMEGA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
function RayAssistantUltimate({ isOpen, onClose, onToggle }) {
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [suggestions, setSuggestions] = useState(['Best props today', 'Trending players', 'Curry stats', 'Sharp money']);
  const [quickActions, setQuickActions] = useState([
    { icon: '🔥', label: 'Hot props', action: 'Show me the hottest props today' },
    { icon: '⚡', label: 'Value plays', action: 'Find me +EV props' },
    { icon: '📊', label: 'Top players', action: 'Who are the top performers this week?' },
    { icon: '🎯', label: 'Best bets', action: 'What are the best bets tonight?' }
  ]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // REFS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const processingLockRef = useRef(false);
  const streamIntervalRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // MEMOIZED DECORATIONS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const neuralNodes = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 4
    })), []);

  const neuralConnections = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: 60 + Math.random() * 120,
      angle: Math.random() * 360,
      delay: Math.random() * 5
    })), []);

  const matrixColumns = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: (i + 1) * 8,
      chars: Array.from({ length: 20 }, () => 
        String.fromCharCode(0x30A0 + Math.random() * 96)
      ).join(''),
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8
    })), []);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  
  // Inject styles
  useEffect(() => {
    const styleId = 'omega-styles-v10';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = omegaStyles;
      document.head.appendChild(styleEl);
    }
    return () => document.getElementById(styleId)?.remove();
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamText, thinkingSteps]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `Hey! I'm **Ray** 🧠 — your AI-powered NBA analytics expert.\n\nI can instantly analyze:\n• **📊 Player Stats** — Real-time performance & trends\n• **🎯 Props & Lines** — EV analysis, hit rates, sharp money\n• **⚔️ Comparisons** — Head-to-head player breakdowns\n• **💰 Value Plays** — +EV opportunities & edges\n• **🏆 Rankings** — Top performers by any stat\n• **📈 Predictions** — AI-powered prop forecasts\n\nTry asking: *"Curry points prop"* or *"Compare LeBron vs Giannis"*`,
          timestamp: new Date(),
          suggestions: ['🔥 Hot props', '⚡ +EV plays', '📊 Curry analysis', '⚔️ LeBron vs Curry']
        }]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // SPEECH
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const speak = useCallback((text) => {
    if (!voiceEnabled || !text) return;
    window.speechSynthesis.cancel();
    const cleaned = text.replace(/[*#📊📈🔥🎯🚀📉•→💰⚔️🏆]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes('David'));
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // STREAM TEXT
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const streamResponse = useCallback((fullText, onComplete, additionalData = {}) => {
    setIsStreaming(true);
    setStreamText('');
    
    const words = fullText.split(' ');
    let index = 0;
    
    streamIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        setStreamText(prev => prev + (index > 0 ? ' ' : '') + words[index]);
        index++;
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
        setStreamText('');
        onComplete(fullText, additionalData);
      }
    }, 20 + Math.random() * 15);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // PROCESS MESSAGE - BRAIN INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const processMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    
    // Bulletproof lock
    if (!trimmed || processingLockRef.current) return;
    processingLockRef.current = true;
    
    // Clear input
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.value = '';
    }
    
    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    }]);
    
    // Show thinking
    setIsTyping(true);
    setThinkingSteps([]);
    
    const steps = [
      'Understanding your question...',
      'Analyzing player data...',
      'Processing statistics...',
      'Generating insights...'
    ];
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 150));
      setThinkingSteps(prev => [...prev, step]);
    }
    
    // Process through the conversation brain
    try {
      const response = await rayConversationBrain.processMessage(trimmed);
      
      setIsTyping(false);
      setThinkingSteps([]);
      
      // Update suggestions
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
      
      // Stream the response
      streamResponse(response.text, (finalText) => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: finalText,
          timestamp: new Date(),
          data: response.data,
          type: response.type,
          suggestions: response.suggestions
        }]);
        
        processingLockRef.current = false;
        speak(finalText);
      });
      
    } catch (error) {
      console.error('Ray error:', error);
      setIsTyping(false);
      setThinkingSteps([]);
      processingLockRef.current = false;
      
      const errorSuggestions = [
        'Try: "Curry points prop"',
        'Or: "Compare LeBron vs Giannis"',
        'Or: "Best props today"'
      ];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Hmm, I couldn't process that. 🤔\n\n**Try these formats:**\n• "[Player] stats" — e.g., "Curry stats"\n• "[Player] [stat] prop" — e.g., "LeBron points prop"\n• "Compare [Player] vs [Player]"\n• "Best props today"\n\nWhat would you like to know?`,
        timestamp: new Date(),
        suggestions: errorSuggestions
      }]);
    }
  }, [streamResponse, speak]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // STOP GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const stopGeneration = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    
    if (streamText) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: streamText + ' [stopped]',
        timestamp: new Date()
      }]);
    }
    
    setIsStreaming(false);
    setIsTyping(false);
    setThinkingSteps([]);
    setStreamText('');
    processingLockRef.current = false;
  }, [streamText]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // INPUT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const handleSubmit = useCallback(() => {
    if (!processingLockRef.current && input.trim()) {
      processMessage(input);
    }
  }, [input, processMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleSuggestionClick = useCallback((suggestion) => {
    if (!processingLockRef.current) {
      processMessage(suggestion);
    }
  }, [processMessage]);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, []);

  // Copy message
  const copyMessage = useCallback((id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  
  // Orb button when closed
  if (!isOpen) {
    return (
      <div className="omega-realm">
        <button className="omega-orb" onClick={onToggle} aria-label="Open Ray Assistant">
          {/* Holographic Rings */}
          <div className="omega-ring omega-ring-1" />
          <div className="omega-ring omega-ring-2" />
          <div className="omega-ring omega-ring-3" />
          
          {/* Orbiting Particles */}
          <div className="omega-particle omega-particle-1" />
          <div className="omega-particle omega-particle-2" />
          <div className="omega-particle omega-particle-3" />
          <div className="omega-particle omega-particle-4" />
          
          {/* Core */}
          <div className="omega-core">
            <Brain className="omega-brain" size={28} />
          </div>
          
          {/* Badge */}
          <div className="omega-badge">AI</div>
        </button>
      </div>
    );
  }

  // Main panel
  return (
    <div className="omega-realm">
      <div className={`omega-panel ${expanded ? 'expanded' : ''}`}>
        {/* Background Effects */}
        <div className="omega-neural-bg">
          {neuralNodes.map(node => (
            <div
              key={node.id}
              className="omega-node"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: node.size,
                height: node.size,
                animationDelay: `${node.delay}s`
              }}
            />
          ))}
          {neuralConnections.map(conn => (
            <div
              key={conn.id}
              className="omega-connection"
              style={{
                left: `${conn.x}%`,
                top: `${conn.y}%`,
                width: conn.width,
                transform: `rotate(${conn.angle}deg)`,
                animationDelay: `${conn.delay}s`
              }}
            />
          ))}
        </div>

        {/* Matrix Rain */}
        <div className="omega-matrix">
          {matrixColumns.map(col => (
            <div
              key={col.id}
              className="omega-matrix-col"
              style={{
                left: `${col.left}%`,
                animationDelay: `${col.delay}s`,
                animationDuration: `${col.duration}s`
              }}
            >
              {col.chars}
            </div>
          ))}
        </div>

        {/* Scan Line */}
        <div className="omega-scanline" />

        {/* Header */}
        <div className="omega-header">
          <div className="omega-identity">
            <div className="omega-avatar">
              <Brain size={20} />
            </div>
            <div className="omega-name-block">
              <div className="omega-name">
                Ray
                <span className="omega-name-badge">v10.0</span>
              </div>
              <div className="omega-tagline">NBA Analytics AI</div>
            </div>
          </div>
          <div className="omega-actions">
            <button
              className={`omega-btn-icon ${voiceEnabled ? 'active' : ''}`}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              className="omega-btn-icon"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              className="omega-btn-icon"
              onClick={onClose}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="omega-quick-bar">
          <button className="omega-quick-btn" onClick={() => handleSuggestionClick('Best props today')}>
            <Target size={14} /> Best Props
          </button>
          <button className="omega-quick-btn" onClick={() => handleSuggestionClick('Sharp money plays')}>
            <DollarSign size={14} /> Sharp Money
          </button>
          <button className="omega-quick-btn" onClick={() => handleSuggestionClick('Trending players')}>
            <TrendingUp size={14} /> Trending
          </button>
          <button className="omega-quick-btn" onClick={() => handleSuggestionClick('MVP rankings')}>
            <Crown size={14} /> Rankings
          </button>
          <button className="omega-quick-btn" onClick={() => handleSuggestionClick('Injury report')}>
            <AlertTriangle size={14} /> Injuries
          </button>
        </div>

        {/* Messages */}
        <div className="omega-messages" ref={scrollRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`omega-msg ${msg.role}`}>
              <div 
                className="omega-msg-bubble"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
              />
              
              {/* Inline Cards based on response type */}
              {msg.type === 'playerStats' && msg.data && (
                <PlayerCard data={msg.data} />
              )}
              {msg.type === 'propAnalysis' && msg.data && (
                <PropCard data={msg.data} />
              )}
              {msg.type === 'comparison' && msg.data && (
                <ComparisonCard data={msg.data} />
              )}
              
              {/* Suggestions */}
              {msg.suggestions && msg.role === 'assistant' && (
                <div className="omega-suggestions">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="omega-suggestion"
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      <ChevronRight size={12} /> {sug}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Message Actions */}
              {msg.role === 'assistant' && (
                <div className="omega-msg-actions">
                  <button
                    className={`omega-action-btn ${copiedId === msg.id ? 'active' : ''}`}
                    onClick={() => copyMessage(msg.id, msg.content)}
                    title="Copy"
                  >
                    {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button className="omega-action-btn" title="Good response">
                    <ThumbsUp size={12} />
                  </button>
                  <button className="omega-action-btn" title="Bad response">
                    <ThumbsDown size={12} />
                  </button>
                </div>
              )}
              
              <div className="omega-msg-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))}

          {/* Thinking State */}
          {isTyping && (
            <div className="omega-msg assistant">
              <div className="omega-thinking">
                <div className="omega-thinking-header">
                  <Cpu size={14} />
                  <span>Ray is thinking</span>
                  <div className="omega-thinking-dots">
                    <div className="omega-thinking-dot" />
                    <div className="omega-thinking-dot" />
                    <div className="omega-thinking-dot" />
                  </div>
                </div>
                {thinkingSteps.length > 0 && (
                  <div className="omega-thinking-steps">
                    {thinkingSteps.map((step, i) => (
                      <div key={i} className="omega-thinking-step">
                        <Check size={12} />
                        {step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Streaming */}
          {isStreaming && streamText && (
            <div className="omega-msg assistant">
              <div className="omega-streaming">
                <span dangerouslySetInnerHTML={{ __html: parseMarkdown(streamText) }} />
                <span className="omega-cursor" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="omega-input-area">
          <div className="omega-input-container">
            <button
              className={`omega-voice-btn ${isListening ? 'listening' : 'idle'}`}
              onClick={() => setIsListening(!isListening)}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? (
                <div className="omega-waveform">
                  <div className="omega-wave-bar" />
                  <div className="omega-wave-bar" />
                  <div className="omega-wave-bar" />
                  <div className="omega-wave-bar" />
                  <div className="omega-wave-bar" />
                </div>
              ) : (
                <Mic size={18} />
              )}
            </button>
            
            <textarea
              ref={textareaRef}
              className="omega-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about players, props, trends..."
              rows={1}
            />
            
            {isStreaming ? (
              <button
                className="omega-send-btn stop"
                onClick={stopGeneration}
                title="Stop"
              >
                <StopCircle size={18} />
              </button>
            ) : (
              <button
                className={`omega-send-btn ${input.trim() ? 'ready' : ''}`}
                onClick={handleSubmit}
                disabled={!input.trim() || processingLockRef.current}
                title="Send"
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RayAssistantUltimate);
