// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  🌌 RAY v9.0 QUANTUM - THE MOST VISUALLY INSANE AI EVER CREATED              ║
// ║  Neural Networks • Holographic Orbs • Matrix Rain • Particle Systems          ║
// ║  Voice Waveforms • 3D Depth • Neon Glow • Ambient Effects                     ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Brain, Sparkles,
  TrendingUp, Target, Zap, Activity, Crown, Cpu, Shield,
  Maximize2, Minimize2, Clock, Flame, MessageSquare,
  Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, StopCircle
} from 'lucide-react';
import RayConversationEngine from './RayConversationEngine';
import rayLiveData, { PLAYER_STATS_2025 } from './RayLiveDataService';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 QUANTUM CYBERPUNK STYLES - 2000+ LINES OF PURE VISUAL INSANITY
// ═══════════════════════════════════════════════════════════════════════════════
const quantumStyles = `
  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    QUANTUM COLOR SYSTEM                                   ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  :root {
    --q-void: #000000;
    --q-abyss: #030308;
    --q-deep: #0a0a15;
    --q-dark: #0f0f1a;
    --q-surface: #151525;
    --q-elevated: #1a1a30;
    
    --q-purple: #8b5cf6;
    --q-purple-bright: #a78bfa;
    --q-purple-dim: rgba(139, 92, 246, 0.15);
    --q-purple-glow: rgba(139, 92, 246, 0.6);
    
    --q-cyan: #06b6d4;
    --q-cyan-bright: #22d3ee;
    --q-cyan-glow: rgba(6, 182, 212, 0.6);
    
    --q-pink: #ec4899;
    --q-pink-bright: #f472b6;
    --q-pink-glow: rgba(236, 72, 153, 0.6);
    
    --q-green: #10b981;
    --q-orange: #f59e0b;
    --q-red: #ef4444;
    
    --q-white: #ffffff;
    --q-text: rgba(255, 255, 255, 0.92);
    --q-text-dim: rgba(255, 255, 255, 0.6);
    --q-text-muted: rgba(255, 255, 255, 0.4);
    
    --q-border: rgba(139, 92, 246, 0.2);
    --q-border-bright: rgba(139, 92, 246, 0.5);
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    CONTAINER - QUANTUM REALM                              ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .quantum-realm {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
    perspective: 1000px;
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    HOLOGRAPHIC ORB BUTTON                                 ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .holo-orb {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, 
      var(--q-elevated) 0%, 
      var(--q-dark) 50%, 
      var(--q-abyss) 100%);
    border: none;
    cursor: pointer;
    position: relative;
    transform-style: preserve-3d;
    animation: orb-levitate 4s ease-in-out infinite;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 80px var(--q-purple-glow),
      inset 0 -20px 40px rgba(0, 0, 0, 0.5),
      inset 0 20px 40px rgba(139, 92, 246, 0.1);
  }

  @keyframes orb-levitate {
    0%, 100% { 
      transform: translateY(0) rotateX(0deg) rotateY(0deg); 
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 80px var(--q-purple-glow),
        inset 0 -20px 40px rgba(0, 0, 0, 0.5),
        inset 0 20px 40px rgba(139, 92, 246, 0.1);
    }
    25% { transform: translateY(-8px) rotateX(5deg) rotateY(-5deg); }
    50% { 
      transform: translateY(-12px) rotateX(0deg) rotateY(0deg); 
      box-shadow: 
        0 35px 80px rgba(0, 0, 0, 0.6),
        0 0 120px var(--q-purple-glow),
        inset 0 -20px 40px rgba(0, 0, 0, 0.5),
        inset 0 20px 40px rgba(139, 92, 246, 0.2);
    }
    75% { transform: translateY(-8px) rotateX(-5deg) rotateY(5deg); }
  }

  /* Holographic rings */
  .holo-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
    animation: ring-spin linear infinite;
  }

  .holo-ring-1 {
    inset: -8px;
    border-top-color: var(--q-purple);
    border-right-color: var(--q-purple);
    animation-duration: 3s;
    filter: drop-shadow(0 0 10px var(--q-purple));
  }

  .holo-ring-2 {
    inset: -16px;
    border-bottom-color: var(--q-cyan);
    border-left-color: var(--q-cyan);
    animation-duration: 4s;
    animation-direction: reverse;
    filter: drop-shadow(0 0 10px var(--q-cyan));
  }

  .holo-ring-3 {
    inset: -24px;
    border-top-color: var(--q-pink);
    animation-duration: 5s;
    filter: drop-shadow(0 0 10px var(--q-pink));
    opacity: 0.6;
  }

  @keyframes ring-spin {
    from { transform: rotateZ(0deg) rotateX(60deg); }
    to { transform: rotateZ(360deg) rotateX(60deg); }
  }

  /* Orbiting particles */
  .orbit-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    margin: -4px;
    animation: particle-orbit linear infinite;
  }

  .orbit-particle::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    animation: particle-pulse 1s ease-in-out infinite;
  }

  .orbit-p1 {
    background: var(--q-purple);
    box-shadow: 0 0 20px var(--q-purple), 0 0 40px var(--q-purple-glow);
    animation-duration: 2s;
  }
  .orbit-p2 {
    background: var(--q-cyan);
    box-shadow: 0 0 20px var(--q-cyan), 0 0 40px var(--q-cyan-glow);
    animation-duration: 2.5s;
    animation-delay: -0.5s;
  }
  .orbit-p3 {
    background: var(--q-pink);
    box-shadow: 0 0 20px var(--q-pink), 0 0 40px var(--q-pink-glow);
    animation-duration: 3s;
    animation-delay: -1s;
  }
  .orbit-p4 {
    background: var(--q-green);
    box-shadow: 0 0 20px var(--q-green);
    animation-duration: 3.5s;
    animation-delay: -1.5s;
  }
  .orbit-p5 {
    background: var(--q-orange);
    box-shadow: 0 0 20px var(--q-orange);
    animation-duration: 4s;
    animation-delay: -2s;
  }

  @keyframes particle-orbit {
    from { transform: rotate(0deg) translateX(55px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(55px) rotate(-360deg); }
  }

  @keyframes particle-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.6; }
  }

  /* Core brain */
  .orb-core {
    position: absolute;
    inset: 15px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 50%,
      var(--q-dark) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--q-border);
    overflow: hidden;
  }

  .orb-core::before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from 0deg,
      transparent 0%,
      var(--q-purple-dim) 25%,
      transparent 50%,
      var(--q-cyan-glow) 75%,
      transparent 100%
    );
    animation: core-rotate 4s linear infinite;
  }

  @keyframes core-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .brain-icon {
    position: relative;
    z-index: 2;
    color: var(--q-purple-bright);
    filter: drop-shadow(0 0 15px var(--q-purple));
    animation: brain-glow 2s ease-in-out infinite;
  }

  @keyframes brain-glow {
    0%, 100% { filter: drop-shadow(0 0 15px var(--q-purple)); }
    50% { filter: drop-shadow(0 0 25px var(--q-purple)) drop-shadow(0 0 40px var(--q-cyan)); }
  }

  /* Notification badge */
  .orb-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    background: linear-gradient(135deg, var(--q-red), #dc2626);
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--q-abyss);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    animation: badge-pulse 2s ease-in-out infinite;
    z-index: 10;
  }

  @keyframes badge-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .holo-orb:hover {
    animation-play-state: paused;
    transform: scale(1.1) translateY(-5px);
  }

  .holo-orb:hover .holo-ring {
    animation-duration: 1s;
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    MAIN PANEL - QUANTUM INTERFACE                         ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .quantum-panel {
    width: 440px;
    height: 700px;
    background: linear-gradient(180deg, 
      var(--q-abyss) 0%, 
      var(--q-deep) 50%,
      var(--q-abyss) 100%);
    border-radius: 28px;
    border: 1px solid var(--q-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    box-shadow: 
      0 50px 100px rgba(0, 0, 0, 0.8),
      0 0 100px rgba(139, 92, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.5);
    animation: panel-emerge 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes panel-emerge {
    0% { 
      opacity: 0; 
      transform: translateY(30px) scale(0.9) rotateX(10deg); 
      filter: blur(10px);
    }
    100% { 
      opacity: 1; 
      transform: translateY(0) scale(1) rotateX(0deg); 
      filter: blur(0);
    }
  }

  .quantum-panel.expanded {
    width: 580px;
    height: 800px;
  }

  /* Animated border */
  .quantum-panel::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 30px;
    background: linear-gradient(45deg, 
      var(--q-purple), 
      var(--q-cyan), 
      var(--q-pink), 
      var(--q-purple));
    background-size: 400% 400%;
    z-index: -1;
    animation: border-flow 8s ease infinite;
    opacity: 0.5;
  }

  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    NEURAL NETWORK BACKGROUND                              ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .neural-network {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .neural-node {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--q-purple);
    border-radius: 50%;
    box-shadow: 0 0 15px var(--q-purple), 0 0 30px var(--q-purple-glow);
    animation: node-pulse 3s ease-in-out infinite;
  }

  @keyframes node-pulse {
    0%, 100% { 
      transform: scale(1); 
      opacity: 0.3;
      box-shadow: 0 0 15px var(--q-purple), 0 0 30px var(--q-purple-glow);
    }
    50% { 
      transform: scale(1.8); 
      opacity: 0.8;
      box-shadow: 0 0 25px var(--q-purple), 0 0 50px var(--q-purple-glow);
    }
  }

  .neural-connection {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      var(--q-purple), 
      var(--q-cyan),
      transparent);
    transform-origin: left center;
    animation: connection-pulse 4s ease-in-out infinite;
    box-shadow: 0 0 10px var(--q-purple-glow);
  }

  @keyframes connection-pulse {
    0%, 100% { opacity: 0.1; transform: scaleX(0.8); }
    50% { opacity: 0.6; transform: scaleX(1); }
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    MATRIX RAIN EFFECT                                     ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .matrix-rain {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.06;
    z-index: 0;
  }

  .matrix-column {
    position: absolute;
    top: -100%;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: var(--q-purple);
    text-shadow: 0 0 15px var(--q-purple), 0 0 30px var(--q-purple-glow);
    writing-mode: vertical-rl;
    text-orientation: upright;
    animation: matrix-fall linear infinite;
    letter-spacing: 5px;
  }

  @keyframes matrix-fall {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(250%); opacity: 0; }
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    AMBIENT PARTICLES                                      ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .ambient-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .ambient-particle {
    position: absolute;
    border-radius: 50%;
    animation: float-up linear infinite;
    opacity: 0;
  }

  @keyframes float-up {
    0% { 
      transform: translateY(100%) translateX(0) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
      transform: translateY(90%) translateX(10px) scale(1);
    }
    90% {
      opacity: 1;
      transform: translateY(10%) translateX(-10px) scale(1);
    }
    100% { 
      transform: translateY(0%) translateX(0) scale(0);
      opacity: 0;
    }
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    SCAN LINE EFFECT                                       ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .scan-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      var(--q-cyan) 20%,
      var(--q-purple) 50%,
      var(--q-cyan) 80%,
      transparent 100%);
    box-shadow: 
      0 0 20px var(--q-cyan),
      0 0 40px var(--q-cyan-glow),
      0 0 60px var(--q-purple-glow);
    animation: scan 6s linear infinite;
    opacity: 0.4;
    z-index: 1;
    pointer-events: none;
  }

  @keyframes scan {
    0% { top: -2px; }
    100% { top: 100%; }
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    HEADER - COMMAND CENTER                                ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .quantum-header {
    padding: 20px 24px;
    background: linear-gradient(180deg, 
      rgba(139, 92, 246, 0.1) 0%, 
      transparent 100%);
    border-bottom: 1px solid var(--q-border);
    position: relative;
    z-index: 10;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* Holographic Avatar */
  .holo-avatar {
    width: 56px;
    height: 56px;
    position: relative;
    flex-shrink: 0;
  }

  .avatar-rings {
    position: absolute;
    inset: 0;
  }

  .avatar-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
  }

  .avatar-ring-1 {
    inset: 0;
    border-top-color: var(--q-purple);
    border-right-color: var(--q-purple);
    animation: ring-spin 3s linear infinite;
    filter: drop-shadow(0 0 8px var(--q-purple));
  }

  .avatar-ring-2 {
    inset: 4px;
    border-bottom-color: var(--q-cyan);
    border-left-color: var(--q-cyan);
    animation: ring-spin 4s linear infinite reverse;
    filter: drop-shadow(0 0 8px var(--q-cyan));
  }

  .avatar-ring-3 {
    inset: 8px;
    border-top-color: var(--q-pink);
    animation: ring-spin 5s linear infinite;
    filter: drop-shadow(0 0 8px var(--q-pink));
    opacity: 0.6;
  }

  .avatar-core {
    position: absolute;
    inset: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--q-border);
    box-shadow: 
      0 0 30px var(--q-purple-glow),
      inset 0 0 20px rgba(139, 92, 246, 0.1);
  }

  .avatar-icon {
    color: var(--q-purple-bright);
    filter: drop-shadow(0 0 10px var(--q-purple));
  }

  .avatar-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    background: var(--q-green);
    border-radius: 50%;
    border: 2px solid var(--q-abyss);
    box-shadow: 0 0 10px var(--q-green);
    z-index: 5;
  }

  .avatar-status.speaking {
    animation: status-speak 0.5s ease-in-out infinite alternate;
  }

  @keyframes status-speak {
    from { transform: scale(1); box-shadow: 0 0 10px var(--q-green); }
    to { transform: scale(1.3); box-shadow: 0 0 20px var(--q-green); }
  }

  /* Identity */
  .identity {
    flex: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ray-name {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, 
      var(--q-white) 0%, 
      var(--q-purple-bright) 50%,
      var(--q-cyan-bright) 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: name-shimmer 4s ease infinite;
  }

  @keyframes name-shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .version-badge {
    padding: 4px 10px;
    background: linear-gradient(135deg, 
      var(--q-purple-dim) 0%, 
      rgba(6, 182, 212, 0.15) 100%);
    border: 1px solid var(--q-border);
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    color: var(--q-cyan);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .crown-icon {
    color: #fbbf24;
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
    animation: crown-float 2s ease-in-out infinite;
  }

  @keyframes crown-float {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-3px) rotate(5deg); }
  }

  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--q-text-dim);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: var(--q-green);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--q-green);
    animation: dot-pulse 2s ease-in-out infinite;
  }

  @keyframes dot-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  .sep-dot {
    width: 3px;
    height: 3px;
    background: var(--q-text-muted);
    border-radius: 50%;
  }

  .voice-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--q-text-muted);
  }

  /* Header controls */
  .header-controls {
    display: flex;
    gap: 6px;
  }

  .ctrl-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid var(--q-border);
    color: var(--q-text-dim);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
  }

  .ctrl-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--q-purple);
    color: var(--q-white);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px var(--q-purple-glow);
  }

  .ctrl-btn.active {
    background: var(--q-purple-dim);
    border-color: var(--q-purple);
    color: var(--q-purple-bright);
  }

  .ctrl-btn.close:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: var(--q-red);
    color: var(--q-red);
    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3);
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    MESSAGES AREA                                          ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .messages-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 5;
    scroll-behavior: smooth;
  }

  .messages-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .messages-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--q-purple), var(--q-cyan));
    border-radius: 3px;
  }

  /* Message */
  .msg {
    display: flex;
    gap: 12px;
    animation: msg-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .msg.user {
    flex-direction: row-reverse;
  }

  @keyframes msg-in {
    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  .msg-avatar {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 600;
  }

  .msg.assistant .msg-avatar {
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 100%);
    border: 1px solid var(--q-border);
    color: var(--q-purple-bright);
    box-shadow: 0 0 20px var(--q-purple-glow);
  }

  .msg.user .msg-avatar {
    background: linear-gradient(135deg, 
      var(--q-purple) 0%, 
      #7c3aed 100%);
    color: white;
    box-shadow: 0 4px 15px var(--q-purple-glow);
  }

  .msg-body {
    flex: 1;
    max-width: 82%;
    display: flex;
    flex-direction: column;
  }

  .msg.user .msg-body {
    align-items: flex-end;
  }

  .msg-bubble {
    padding: 14px 18px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.65;
    position: relative;
    overflow: hidden;
  }

  .msg.assistant .msg-bubble {
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 100%);
    border: 1px solid var(--q-border);
    color: var(--q-text);
    border-bottom-left-radius: 4px;
  }

  .msg.assistant .msg-bubble::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      var(--q-purple), 
      var(--q-cyan), 
      transparent);
  }

  .msg.user .msg-bubble {
    background: linear-gradient(135deg, 
      var(--q-purple) 0%, 
      #7c3aed 50%,
      #6d28d9 100%);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 20px var(--q-purple-glow);
  }

  .msg-bubble strong {
    color: var(--q-cyan-bright);
    font-weight: 600;
  }

  .msg.user .msg-bubble strong {
    color: white;
  }

  /* Message actions */
  .msg-actions {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .msg:hover .msg-actions {
    opacity: 1;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: var(--q-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: var(--q-purple-dim);
    color: var(--q-purple-bright);
  }

  .action-btn.active {
    color: var(--q-green);
  }

  .msg-time {
    font-size: 10px;
    color: var(--q-text-muted);
    margin-top: 6px;
  }

  /* Streaming cursor */
  .stream-cursor {
    display: inline-block;
    width: 2px;
    height: 1.1em;
    background: var(--q-purple-bright);
    margin-left: 3px;
    animation: cursor-blink 0.8s step-end infinite;
    vertical-align: text-bottom;
    box-shadow: 0 0 10px var(--q-purple);
  }

  @keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Thinking */
  .thinking {
    display: flex;
    gap: 12px;
  }

  .thinking-content {
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 100%);
    border: 1px solid var(--q-border);
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .thinking-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--q-text-dim);
  }

  .thinking-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--q-border);
    border-top-color: var(--q-purple);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .thinking-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .thinking-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--q-text-muted);
    animation: step-in 0.3s ease-out;
  }

  @keyframes step-in {
    0% { opacity: 0; transform: translateX(-10px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  .thinking-step.done {
    color: var(--q-green);
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    PLAYER CARDS                                           ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .player-card {
    margin-top: 14px;
    background: linear-gradient(135deg, 
      var(--q-surface) 0%, 
      var(--q-elevated) 100%);
    border: 1px solid var(--q-border);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .player-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      var(--q-purple), 
      var(--q-cyan), 
      var(--q-pink));
  }

  .player-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--q-border);
  }

  .player-avatar {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, 
      var(--q-purple) 0%, 
      var(--q-cyan) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    color: white;
    box-shadow: 0 4px 15px var(--q-purple-glow);
  }

  .player-info h4 {
    font-size: 15px;
    font-weight: 600;
    color: var(--q-text);
    margin: 0;
  }

  .player-info span {
    font-size: 12px;
    color: var(--q-text-muted);
  }

  .player-trend {
    margin-left: auto;
    padding: 5px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .player-trend.up {
    background: rgba(16, 185, 129, 0.15);
    color: var(--q-green);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
  }

  .player-trend.down {
    background: rgba(239, 68, 68, 0.15);
    color: var(--q-red);
  }

  .player-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .player-stat {
    padding: 14px 10px;
    text-align: center;
    border-right: 1px solid var(--q-border);
  }

  .player-stat:last-child {
    border-right: none;
  }

  .player-stat-value {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--q-white), var(--q-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .player-stat-label {
    font-size: 10px;
    color: var(--q-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    SUGGESTIONS                                            ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .suggestions {
    padding: 14px 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid var(--q-border);
    border-bottom: 1px solid var(--q-border);
    position: relative;
    z-index: 5;
  }

  .suggestion-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, 
      var(--q-purple-dim) 0%, 
      rgba(6, 182, 212, 0.1) 100%);
    border: 1px solid var(--q-border);
    border-radius: 25px;
    font-size: 13px;
    font-weight: 500;
    color: var(--q-text-dim);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .suggestion-chip:hover {
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.25) 0%, 
      rgba(6, 182, 212, 0.2) 100%);
    border-color: var(--q-purple);
    color: var(--q-white);
    transform: translateY(-3px);
    box-shadow: 
      0 10px 30px var(--q-purple-glow),
      0 0 20px var(--q-purple-glow);
  }

  .suggestion-chip svg {
    color: var(--q-purple);
  }

  .suggestion-chip:hover svg {
    color: var(--q-cyan);
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    INPUT AREA                                             ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  .input-area {
    padding: 18px;
    background: linear-gradient(0deg, 
      var(--q-abyss) 0%, 
      transparent 100%);
    position: relative;
    z-index: 10;
  }

  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: var(--q-surface);
    border: 1px solid var(--q-border);
    border-radius: 18px;
    padding: 10px 14px;
    transition: all 0.3s ease;
  }

  .input-container:focus-within {
    border-color: var(--q-purple);
    box-shadow: 
      0 0 30px var(--q-purple-glow),
      inset 0 0 20px rgba(139, 92, 246, 0.05);
  }

  /* Voice button */
  .voice-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .voice-btn.idle {
    background: var(--q-elevated);
    color: var(--q-text-dim);
  }

  .voice-btn.idle:hover {
    background: var(--q-purple-dim);
    color: var(--q-purple-bright);
  }

  .voice-btn.listening {
    background: linear-gradient(135deg, var(--q-red), #dc2626);
    color: white;
    animation: voice-active 1s ease-in-out infinite;
  }

  @keyframes voice-active {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); 
    }
    50% { 
      box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); 
    }
  }

  /* Voice waveform */
  .waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 24px;
  }

  .wave-bar {
    width: 4px;
    border-radius: 2px;
    background: linear-gradient(180deg, white, rgba(255,255,255,0.6));
    animation: wave 0.7s ease-in-out infinite;
  }

  .wave-bar:nth-child(1) { height: 8px; animation-delay: 0s; }
  .wave-bar:nth-child(2) { height: 18px; animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { height: 12px; animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { height: 22px; animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { height: 10px; animation-delay: 0.4s; }

  @keyframes wave {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1.4); }
  }

  /* Textarea */
  .input-textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--q-text);
    font-size: 15px;
    font-family: inherit;
    line-height: 1.5;
    resize: none;
    outline: none;
    min-height: 26px;
    max-height: 120px;
    padding: 8px 0;
  }

  .input-textarea::placeholder {
    color: var(--q-text-muted);
  }

  /* Send button */
  .send-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .send-btn.ready {
    background: linear-gradient(135deg, 
      var(--q-purple) 0%, 
      var(--q-cyan) 100%);
    color: white;
    box-shadow: 0 4px 20px var(--q-purple-glow);
  }

  .send-btn.ready:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px var(--q-purple-glow);
  }

  .send-btn:disabled {
    background: var(--q-elevated);
    color: var(--q-text-muted);
    cursor: not-allowed;
    box-shadow: none;
  }

  .stop-btn {
    background: linear-gradient(135deg, var(--q-red), #dc2626);
    color: white;
    animation: stop-pulse 1.5s ease-in-out infinite;
  }

  @keyframes stop-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
  }

  .stop-btn:hover {
    transform: scale(1.1);
  }

  /* Input hints */
  .input-hints {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    font-size: 11px;
    color: var(--q-text-muted);
  }

  .hint-kbd {
    padding: 2px 8px;
    background: var(--q-elevated);
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    color: var(--q-text-dim);
  }

  /* ╔═══════════════════════════════════════════════════════════════════════════╗
     ║                    RESPONSIVE                                             ║
     ╚═══════════════════════════════════════════════════════════════════════════╝ */
  @media (max-width: 500px) {
    .quantum-panel {
      width: calc(100vw - 32px);
      height: calc(100vh - 120px);
      max-height: 700px;
    }

    .quantum-realm {
      bottom: 16px;
      right: 16px;
    }

    .holo-orb {
      width: 64px;
      height: 64px;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 HUMANIZED RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════
const RESPONSES = {
  transitions: [
    "Here's what I found:",
    "Based on my analysis:",
    "Looking at the data:",
    "Here's the breakdown:",
    "Alright, here's the deal:"
  ],
  closings: [
    "Anything else you want to know?",
    "Let me know if you need more!",
    "Want me to dig deeper?",
    "What else are you curious about?"
  ]
};

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const relativeTime = (date) => {
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function RayAssistantUltimate({ isOpen, onClose, onToggle }) {
  // State
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Refs
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationRef = useRef(new RayConversationEngine());
  const contextRef = useRef({ lastPlayer: null });
  const processingLockRef = useRef(false); // Bulletproof lock

  // Neural network nodes
  const neuralNodes = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 4 + Math.random() * 4
    })), []);

  // Neural connections
  const neuralConnections = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: 80 + Math.random() * 150,
      angle: Math.random() * 360,
      delay: Math.random() * 4
    })), []);

  // Matrix columns
  const matrixColumns = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: (i + 1) * 6.5,
      chars: Array.from({ length: 25 }, () => 
        String.fromCharCode(0x30A0 + Math.random() * 96)
      ).join(''),
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 10
    })), []);

  // Ambient particles
  const ambientParticles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      color: ['var(--q-purple)', 'var(--q-cyan)', 'var(--q-pink)'][Math.floor(Math.random() * 3)]
    })), []);

  // Scroll effect
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamText, thinkingSteps]);

  // Welcome
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: "Hey! I'm Ray — your AI sports analyst. I find edges, analyze trends, and help you make smarter plays. What are we looking at?",
          timestamp: new Date()
        }]);
      }, 400);
    }
  }, [isOpen, messages.length]);

  // Inject styles
  useEffect(() => {
    const id = 'quantum-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = quantumStyles;
      document.head.appendChild(el);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  // Auto-resize
  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, []);

  // Speech
  const speak = useCallback((text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const cleaned = text.replace(/[*#📊📈🔥🎯🚀📉•→]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes('David'));
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stream text
  const streamResponse = useCallback((fullText, onDone) => {
    setIsStreaming(true);
    setStreamText('');
    const words = fullText.split(' ');
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setStreamText(prev => prev + (i > 0 ? ' ' : '') + words[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamText('');
        onDone(fullText);
      }
    }, 25 + Math.random() * 20);
    return () => clearInterval(interval);
  }, []);

  // Generate response
  const generateResponse = useCallback(async (userInput) => {
    const lower = userInput.toLowerCase();
    
    const playerMatch = Object.keys(PLAYER_STATS_2025).find(name => 
      lower.includes(name.toLowerCase().split(' ')[0]) ||
      lower.includes(name.toLowerCase())
    );
    
    if (playerMatch) {
      const p = PLAYER_STATS_2025[playerMatch];
      const trend = p.last5.pts > p.season.pts ? 'up' : 'down';
      const diff = (p.last5.pts - p.season.pts).toFixed(1);
      contextRef.current.lastPlayer = playerMatch;
      
      return {
        content: `${random(RESPONSES.transitions)}\n\n` +
          `**${playerMatch}** is averaging **${p.season.pts} PPG** this season with ${p.season.reb} rebounds and ${p.season.ast} assists.\n\n` +
          `Over the last 5 games: **${p.last5.pts} PPG** (${trend === 'up' ? '+' : ''}${diff})\n\n` +
          `${trend === 'up' 
            ? "📈 He's on fire — lean toward the over." 
            : "📉 Cooling off — watch the under."}\n\n` +
          random(RESPONSES.closings),
        playerData: { name: playerMatch, stats: p, trend }
      };
    }
    
    if (lower.includes('value') || lower.includes('good') || lower.includes('tonight') || lower.includes('bet')) {
      const plays = rayLiveData.findValuePlays();
      if (plays.length > 0) {
        const top = plays[0];
        return {
          content: `${random(RESPONSES.transitions)}\n\n` +
            `I like **${top.player}** ${top.prop} tonight.\n\n` +
            `→ Line: ${top.line}\n→ Edge: ${top.edge}\n→ Confidence: ${top.confidence}%\n\n` +
            `${top.trend}\n\n` +
            `${plays.length > 1 ? `Got ${plays.length - 1} more if you want!` : ''}`
        };
      }
    }
    
    if (lower.includes('trend') || lower.includes('hot') || lower.includes('fire')) {
      const trending = rayLiveData.findTrendingPlayers();
      return {
        content: `${random(RESPONSES.transitions)}\n\n` +
          trending.slice(0, 3).map(p => 
            `• **${p.name}** — ${p.metric} (${p.change})`
          ).join('\n') +
          `\n\n${random(RESPONSES.closings)}`
      };
    }
    
    if (lower.includes('consistent') || lower.includes('safe') || lower.includes('reliable')) {
      const consistent = rayLiveData.findConsistentPlayers();
      return {
        content: `${random(RESPONSES.transitions)}\n\n` +
          consistent.slice(0, 3).map(p => 
            `• **${p.name}** — ${p.hitRate}% on ${p.prop}`
          ).join('\n') +
          `\n\nSafest prop targets right now. ${random(RESPONSES.closings)}`
      };
    }
    
    const response = conversationRef.current.processInput(userInput);
    return { content: response.message };
  }, []);

  // Process message
  const processMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    
    // BULLETPROOF: Check ref lock first (synchronous, no race condition)
    if (!trimmed || processingLockRef.current) {
      return;
    }
    
    // Lock immediately using ref (synchronous)
    processingLockRef.current = true;
    
    // Clear input immediately
    setInput('');
    setIsProcessing(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.value = '';
    }
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    }]);
    
    setThinkingSteps([]);
    setIsTyping(true);
    
    const steps = ['Understanding your question...', 'Analyzing data...', 'Generating response...'];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      setThinkingSteps(prev => [...prev, step]);
    }
    
    await new Promise(r => setTimeout(r, 200));
    const response = await generateResponse(trimmed);
    
    setIsTyping(false);
    setThinkingSteps([]);
    
    streamResponse(response.content, (final) => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: final,
        timestamp: new Date(),
        playerData: response.playerData
      }]);
      // Unlock
      processingLockRef.current = false;
      setIsProcessing(false);
      speak(final);
    });
  }, [generateResponse, streamResponse, speak]);

  // Stop
  const stopGeneration = useCallback(() => {
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
    setIsProcessing(false);
  }, [streamText]);

  // Regenerate
  const regenerate = useCallback(() => {
    if (processingLockRef.current) return;
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1));
      processMessage(lastUser.content);
    }
  }, [messages, processMessage]);

  // Copy
  const copy = useCallback((id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Voice
  const toggleVoice = useCallback(() => {
    if (processingLockRef.current) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (e) => processMessage(e.results[0][0].transcript);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, processMessage]);

  // Keyboard
  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!processingLockRef.current && input.trim()) {
        processMessage(input);
      }
    }
  }, [input, processMessage]);

  // Suggestions
  const suggestions = [
    { icon: Target, text: "Best plays", query: "What's good tonight?" },
    { icon: TrendingUp, text: "Who's hot?", query: "Who's trending?" },
    { icon: Shield, text: "Safe props", query: "Most consistent players" },
    { icon: Flame, text: "LeBron", query: "Analyze LeBron" }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - CLOSED
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isOpen) {
    return (
      <div className="quantum-realm">
        <button className="holo-orb" onClick={onToggle}>
          <div className="holo-ring holo-ring-1" />
          <div className="holo-ring holo-ring-2" />
          <div className="holo-ring holo-ring-3" />
          <div className="orbit-particle orbit-p1" />
          <div className="orbit-particle orbit-p2" />
          <div className="orbit-particle orbit-p3" />
          <div className="orbit-particle orbit-p4" />
          <div className="orbit-particle orbit-p5" />
          <div className="orb-core">
            <Brain className="brain-icon" size={26} />
          </div>
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - OPEN
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="quantum-realm">
      <div className={`quantum-panel ${expanded ? 'expanded' : ''}`}>
        {/* Neural Network */}
        <div className="neural-network">
          {neuralNodes.map(n => (
            <div
              key={n.id}
              className="neural-node"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                width: n.size,
                height: n.size,
                animationDelay: `${n.delay}s`
              }}
            />
          ))}
          {neuralConnections.map(c => (
            <div
              key={c.id}
              className="neural-connection"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: c.width,
                transform: `rotate(${c.angle}deg)`,
                animationDelay: `${c.delay}s`
              }}
            />
          ))}
        </div>

        {/* Matrix Rain */}
        <div className="matrix-rain">
          {matrixColumns.map(col => (
            <div
              key={col.id}
              className="matrix-column"
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

        {/* Ambient Particles */}
        <div className="ambient-particles">
          {ambientParticles.map(p => (
            <div
              key={p.id}
              className="ambient-particle"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            />
          ))}
        </div>

        {/* Scan Line */}
        <div className="scan-line" />

        {/* Header */}
        <div className="quantum-header">
          <div className="header-content">
            <div className="holo-avatar">
              <div className="avatar-rings">
                <div className="avatar-ring avatar-ring-1" />
                <div className="avatar-ring avatar-ring-2" />
                <div className="avatar-ring avatar-ring-3" />
              </div>
              <div className="avatar-core">
                <Brain className="avatar-icon" size={20} />
              </div>
              <div className={`avatar-status ${isSpeaking ? 'speaking' : ''}`} />
            </div>

            <div className="identity">
              <div className="name-row">
                <span className="ray-name">Ray</span>
                <span className="version-badge">Quantum v9</span>
                <Crown className="crown-icon" size={18} />
              </div>
              <div className="status-row">
                <div className="status-indicator">
                  <span className="status-dot" />
                  <span>Online</span>
                </div>
                <span className="sep-dot" />
                <div className="voice-status">
                  <Volume2 size={11} />
                  <span>David</span>
                </div>
              </div>
            </div>

            <div className="header-controls">
              <button
                className={`ctrl-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                className="ctrl-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button className="ctrl-btn close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-scroll" ref={scrollRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`msg ${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === 'assistant' ? <Brain size={16} /> : 'You'}
              </div>
              <div className="msg-body">
                <div className="msg-bubble">
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') && line.includes('**') ? (
                        <strong>{line.replace(/\*\*/g, '')}</strong>
                      ) : line.startsWith('→') || line.startsWith('•') ? (
                        <div style={{ marginLeft: 8, marginTop: 4 }}>{line}</div>
                      ) : line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  
                  {msg.playerData && (
                    <div className="player-card">
                      <div className="player-header">
                        <div className="player-avatar">
                          {msg.playerData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="player-info">
                          <h4>{msg.playerData.name}</h4>
                          <span>2024-25 Season</span>
                        </div>
                        <div className={`player-trend ${msg.playerData.trend}`}>
                          <TrendingUp size={14} />
                          {msg.playerData.trend === 'up' ? 'Hot' : 'Cool'}
                        </div>
                      </div>
                      <div className="player-stats">
                        <div className="player-stat">
                          <div className="player-stat-value">{msg.playerData.stats.season.pts}</div>
                          <div className="player-stat-label">PPG</div>
                        </div>
                        <div className="player-stat">
                          <div className="player-stat-value">{msg.playerData.stats.season.reb}</div>
                          <div className="player-stat-label">RPG</div>
                        </div>
                        <div className="player-stat">
                          <div className="player-stat-value">{msg.playerData.stats.season.ast}</div>
                          <div className="player-stat-label">APG</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {msg.role === 'assistant' && (
                  <div className="msg-actions">
                    <button 
                      className={`action-btn ${copiedId === msg.id ? 'active' : ''}`}
                      onClick={() => copy(msg.id, msg.content)}
                    >
                      {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button className="action-btn" onClick={regenerate}>
                      <RotateCcw size={14} />
                    </button>
                    <button className="action-btn"><ThumbsUp size={14} /></button>
                    <button className="action-btn"><ThumbsDown size={14} /></button>
                  </div>
                )}
                
                <div className="msg-time">{relativeTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {/* Thinking */}
          {isTyping && thinkingSteps.length > 0 && (
            <div className="thinking">
              <div className="msg-avatar" style={{ background: 'var(--q-purple-dim)', color: 'var(--q-purple-bright)' }}>
                <Brain size={16} />
              </div>
              <div className="thinking-content">
                <div className="thinking-header">
                  <div className="thinking-spinner" />
                  <span>Thinking...</span>
                </div>
                <div className="thinking-steps">
                  {thinkingSteps.map((step, i) => (
                    <div key={i} className={`thinking-step ${i < thinkingSteps.length - 1 ? 'done' : ''}`}>
                      {i < thinkingSteps.length - 1 ? <Check size={12} /> : <Activity size={12} />}
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Streaming */}
          {isStreaming && streamText && (
            <div className="msg assistant">
              <div className="msg-avatar" style={{ background: 'var(--q-purple-dim)', color: 'var(--q-purple-bright)' }}>
                <Brain size={16} />
              </div>
              <div className="msg-body">
                <div className="msg-bubble">
                  {streamText.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
                      {i < streamText.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <span className="stream-cursor" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="suggestion-chip"
                onClick={() => processMessage(s.query)}
              >
                <s.icon size={15} />
                {s.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="input-area">
          <div className="input-container">
            <button
              className={`voice-btn ${isListening ? 'listening' : 'idle'}`}
              onClick={toggleVoice}
              disabled={isProcessing}
            >
              {isListening ? (
                <div className="waveform">
                  {[1,2,3,4,5].map(i => <span key={i} className="wave-bar" />)}
                </div>
              ) : (
                <Mic size={20} />
              )}
            </button>

            <textarea
              ref={textareaRef}
              className="input-textarea"
              placeholder="Message Ray..."
              value={input}
              onChange={(e) => { if (!isProcessing) setInput(e.target.value); adjustHeight(); }}
              onKeyDown={handleKey}
              rows={1}
              disabled={isProcessing}
            />

            {isStreaming ? (
              <button className="send-btn stop-btn" onClick={stopGeneration}>
                <StopCircle size={20} />
              </button>
            ) : (
              <button
                className={`send-btn ${input.trim() && !isProcessing ? 'ready' : ''}`}
                onClick={() => { if (!processingLockRef.current) processMessage(input); }}
                disabled={!input.trim() || isProcessing}
              >
                <Send size={20} />
              </button>
            )}
          </div>
          
          <div className="input-hints">
            <span className="hint-kbd">Enter</span>
            <span>send</span>
            <span>•</span>
            <span className="hint-kbd">Shift+Enter</span>
            <span>new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RayAssistantUltimate);
