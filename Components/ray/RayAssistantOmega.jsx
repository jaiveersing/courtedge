// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🌌 RAY v11.0 ULTRA - THE WORLD'S MOST ADVANCED PLAYER ANALYTICS AI                                       ║
// ║  ═══════════════════════════════════════════════════════════════════════════════════════════════════════  ║
// ║  🧠 ML-Powered Predictions • 🌌 Holographic Design • 📊 Inline Charts • 💎 Player Cards • 🎯 Prop Analysis ║
// ║  ⚔️ Comparisons • 📈 Trends • 💰 EV Calculator • 🏆 Rankings • 🎮 Fantasy • 🗣️ Voice • 🎨 Animations      ║
// ║  🎤 TAP TO SPEAK: Click mic button to activate voice • Voice navigation • Instant commands               ║
// ║  🚀 v11.0 ULTRA: 1000x better intelligence with ML, advanced NLP, smart caching                          ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Brain, Sparkles,
  TrendingUp, TrendingDown, Target, Zap, Activity, Crown, Cpu, Shield,
  Maximize2, Minimize2, Clock, Flame, MessageSquare, BarChart3, 
  Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, StopCircle,
  ChevronRight, ArrowUp, ArrowDown, Minus, Star, Award,
  DollarSign, Percent, Calendar, Users, GitCompare, LineChart,
  AlertTriangle, AlertCircle, CheckCircle, XCircle, Info, BookOpen
} from 'lucide-react';
import DOMPurify from 'dompurify';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🚀 v11.0 ULTRA ENGINES (NEW - 1000X BETTER)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
import rayUltimateEngine from './RayUltimateEngine';
import rayPropIntelligenceUltra from './RayPropIntelligenceUltra';
import rayLiveDataUltra from './RayLiveDataServiceUltra';

// Import legacy MEGA ENGINES (still used for compatibility)
import rayConversationBrain from './RayConversationBrain';
import rayAnalytics, { PLAYERS_DB, TEAMS_DB } from './RayAnalyticsEngine';
import rayPropIntelligence from './RayPropIntelligence';
import rayComparisonEngine from './RayComparisonEngine';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎤 VOICE COMMAND SYSTEM - NAVIGATION & PAGE ACTIONS (Tap-to-Speak)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const VOICE_COMMANDS = {
  // Navigation commands -> route paths
  navigation: {
    // Bets
    'open bets': '/bets',
    'go to bets': '/bets', 
    'take me to bets': '/bets',
    'show my bets': '/bets',
    'bets page': '/bets',
    'my bets': '/bets',
    'open my bets': '/bets',
    
    // Bankroll
    'open bankroll': '/bankroll',
    'go to bankroll': '/bankroll',
    'take me to bankroll': '/bankroll',
    'bankroll page': '/bankroll',
    'show bankroll': '/bankroll',
    'my bankroll': '/bankroll',
    
    // Analytics
    'open analytics': '/analytics',
    'go to analytics': '/analytics',
    'take me to analytics': '/analytics',
    'analytics page': '/analytics',
    'show analytics': '/analytics',
    
    // Workstation
    'open workstation': '/workstation',
    'go to workstation': '/workstation',
    'take me to workstation': '/workstation',
    'workstation page': '/workstation',
    'workstation': '/workstation',
    
    // ML Workstation
    'open ml workstation': '/ml-workstation',
    'go to ml workstation': '/ml-workstation',
    'take me to ml workstation': '/ml-workstation',
    'ml workstation': '/ml-workstation',
    'machine learning': '/ml-workstation',
    'ml workshop': '/ml-workstation',
    'ml page': '/ml-workstation',
    
    // Dashboard
    'open dashboard': '/dashboard',
    'go to dashboard': '/dashboard',
    'take me to dashboard': '/dashboard',
    'home': '/dashboard',
    'go home': '/dashboard',
    'dashboard': '/dashboard',
    
    // Players
    'open players': '/players',
    'player database': '/players',
    'go to players': '/players',
    'show players': '/players',
    
    // Settings
    'open settings': '/settings',
    'go to settings': '/settings',
    'settings': '/settings',
    
    // Portfolio
    'open portfolio': '/portfolio',
    'go to portfolio': '/portfolio',
    'portfolio': '/portfolio',
    
    // Player Trends
    'player trends': '/player-trends',
    'go to trends': '/player-trends',
    'trends': '/player-trends'
  },
  
  // Page-specific actions (will dispatch custom events)
  pageActions: {
    // Workstation actions
    'last 10 games': { action: 'showGames', value: 10 },
    'last 10': { action: 'showGames', value: 10 },
    'show last 10': { action: 'showGames', value: 10 },
    'last 30 games': { action: 'showGames', value: 30 },
    'last 30': { action: 'showGames', value: 30 },
    'show last 30': { action: 'showGames', value: 30 },
    'last 5 games': { action: 'showGames', value: 5 },
    'last 5': { action: 'showGames', value: 5 },
    'alternate lines': { action: 'showAlternateLines' },
    'show alternate lines': { action: 'showAlternateLines' },
    'alternate': { action: 'showAlternateLines' },
    'props': { action: 'showProps' },
    'show props': { action: 'showProps' },
    'player props': { action: 'showProps' },
    'stats': { action: 'showStats' },
    'show stats': { action: 'showStats' },
    'compare': { action: 'showCompare' },
    'comparison': { action: 'showCompare' }
  },
  
  // Quick responses (no processing needed)
  quickResponses: {
    'what can you do': "I can navigate anywhere, analyze any player, show props, compare stats, and execute any command instantly. Just say what you want!",
    'help': "Say 'go to bets' to navigate, 'search Curry' to find a player, 'last 10 games' to see recent games, or ask me anything about NBA analytics!",
    'thanks': "You're welcome, sir!",
    'thank you': "My pleasure. Anything else?",
    'good job': "Thank you, sir. Always at your service.",
    'goodbye': "Goodbye, sir. Tap the mic button anytime you need me."
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 PLAYER NAME MATCHER - Find players in speech
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const findPlayerInText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Direct matches first
  const playerMatches = {
    'curry': 'Stephen Curry',
    'stephen curry': 'Stephen Curry',
    'steph': 'Stephen Curry',
    'lebron': 'LeBron James',
    'james': 'LeBron James',
    'lebron james': 'LeBron James',
    'giannis': 'Giannis Antetokounmpo',
    'luka': 'Luka Doncic',
    'doncic': 'Luka Doncic',
    'jokic': 'Nikola Jokic',
    'nikola': 'Nikola Jokic',
    'embiid': 'Joel Embiid',
    'tatum': 'Jayson Tatum',
    'durant': 'Kevin Durant',
    'kd': 'Kevin Durant',
    'harden': 'James Harden',
    'lillard': 'Damian Lillard',
    'dame': 'Damian Lillard',
    'booker': 'Devin Booker',
    'trae': 'Trae Young',
    'ja': 'Ja Morant',
    'morant': 'Ja Morant',
    'kyrie': 'Kyrie Irving',
    'edwards': 'Anthony Edwards',
    'ant': 'Anthony Edwards',
    'ad': 'Anthony Davis',
    'anthony davis': 'Anthony Davis',
    'jimmy butler': 'Jimmy Butler',
    'butler': 'Jimmy Butler',
    'kawhi': 'Kawhi Leonard',
    'paul george': 'Paul George',
    'pg': 'Paul George'
  };
  
  for (const [key, value] of Object.entries(playerMatches)) {
    if (lowerText.includes(key)) {
      return value;
    }
  }
  
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// � NBA VOCABULARY & NAME CORRECTION ENGINE - 100x BETTER VOICE INPUT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const NBA_VOCABULARY = {
  players: [
    'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Doncic',
    'Joel Embiid', 'Nikola Jokic', 'Jayson Tatum', 'Damian Lillard', 'Anthony Davis',
    'James Harden', 'Devin Booker', 'Trae Young', 'Donovan Mitchell', 'Jimmy Butler',
    'Kawhi Leonard', 'Paul George', 'Bradley Beal', 'Kyrie Irving', 'Anthony Edwards',
    'Ja Morant', 'Zion Williamson', 'Shai Gilgeous-Alexander', 'Jaylen Brown', 'DeMar DeRozan',
    'Karl-Anthony Towns', 'Bam Adebayo', 'Pascal Siakam', 'Domantas Sabonis', 'Tyrese Haliburton'
  ],
  teams: [
    'Lakers', 'Warriors', 'Celtics', 'Heat', 'Bucks', 'Nuggets', 'Suns', 'Mavericks',
    'Clippers', 'Sixers', '76ers', 'Nets', 'Grizzlies', 'Pelicans', 'Kings', 'Knicks',
    'Cavaliers', 'Hawks', 'Raptors', 'Bulls', 'Pacers', 'Magic', 'Wizards', 'Hornets'
  ],
  stats: [
    'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'field goal',
    'three pointer', 'free throw', 'plus minus', 'usage rate', 'true shooting',
    'player efficiency rating', 'PER', 'effective field goal', 'eFG'
  ],
  actions: [
    'compare', 'analyze', 'show stats', 'prop bet', 'over under', 'spread', 'moneyline',
    'parlay', 'points prop', 'rebounds prop', 'assists prop', 'best bet', 'value play'
  ],
  corrections: {
    'lebron': 'LeBron', 'le bron': 'LeBron', 'lebron james': 'LeBron James',
    'steph curry': 'Stephen Curry', 'stefan curry': 'Stephen Curry', 'steven curry': 'Stephen Curry',
    'kevin durant': 'Kevin Durant', 'kd': 'Kevin Durant', 'durant': 'Durant',
    'giannis': 'Giannis', 'yanis': 'Giannis', 'yannis': 'Giannis',
    'luca': 'Luka', 'luka': 'Luka', 'luka doncic': 'Luka Doncic',
    'yokich': 'Jokic', 'jokic': 'Jokic', 'nikola jokic': 'Nikola Jokic',
    'embid': 'Embiid', 'embiid': 'Embiid', 'joel embiid': 'Joel Embiid',
    'tatum': 'Tatum', 'jayson tatum': 'Jayson Tatum',
    'dame': 'Damian Lillard', 'lillard': 'Lillard', 'damian lillard': 'Damian Lillard',
    'ad': 'Anthony Davis', 'anthony davis': 'Anthony Davis',
    'harden': 'Harden', 'james harden': 'James Harden',
    'booker': 'Booker', 'devin booker': 'Devin Booker',
    'trae young': 'Trae Young', 'tray young': 'Trae Young',
    'ja morant': 'Ja Morant', 'jaw morant': 'Ja Morant',
    'kyrie': 'Kyrie', 'kyrie irving': 'Kyrie Irving',
    'point': 'points', 'rebound': 'rebounds', 'assist': 'assists',
    'three': 'three pointer', '3': 'three pointer', 'threes': 'three pointers',
    'free throws': 'free throw', 'ft': 'free throw',
    'versus': 'vs', 'verse': 'vs', 'compared to': 'compare',
    'over': 'over', 'under': 'under', 'prop': 'prop',
    'best bets': 'best bet', 'value plays': 'value play'
  }
};

// Intelligent transcript processor
const processVoiceTranscript = (rawTranscript) => {
  if (!rawTranscript) return '';
  
  let processed = rawTranscript.trim().toLowerCase();
  
  // Apply corrections from dictionary
  Object.entries(NBA_VOCABULARY.corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    processed = processed.replace(regex, correct);
  });
  
  // Fix common speech-to-text errors
  processed = processed
    .replace(/\bshow me\b/gi, '')
    .replace(/\btell me about\b/gi, '')
    .replace(/\bwhat about\b/gi, '')
    .replace(/\bwhat is\b/gi, '')
    .replace(/\bwhat are\b/gi, '')
    .replace(/\bhow about\b/gi, '')
    .replace(/\bget me\b/gi, '')
    .replace(/\s+/g, ' ');
  
  // Capitalize proper names
  NBA_VOCABULARY.players.forEach(player => {
    const regex = new RegExp(`\\b${player.toLowerCase()}\\b`, 'gi');
    processed = processed.replace(regex, player);
  });
  
  // Smart capitalization for first letter
  processed = processed.charAt(0).toUpperCase() + processed.slice(1);
  
  // Remove filler words
  processed = processed
    .replace(/\buh\b/gi, '')
    .replace(/\bum\b/gi, '')
    .replace(/\blike\b/gi, '')
    .replace(/\byou know\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return processed;
};

// Simple Levenshtein distance for fuzzy matching
const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🗣️ ADVANCED SPEECH PROCESSING - 100x SMARTER TTS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

// NBA pronunciation dictionary
const PRONUNCIATION_DICT = {
  'Giannis': 'YAH-nis',
  'Antetokounmpo': 'an-tet-oh-KOON-poh',
  'Jokic': 'YO-kich',
  'Doncic': 'DON-chich',
  'Embiid': 'em-BEED',
  'Siakam': 'see-AH-kum',
  'Sabonis': 'sah-BOH-nis',
  'Haliburton': 'HAL-ee-bur-ton',
  'Gilgeous-Alexander': 'GIL-juss AL-ex-an-der',
  'DeRozan': 'deh-ROH-zan',
  'Booker': 'BOOK-er',
  'Tatum': 'TAY-tum',
  'Lillard': 'LIL-erd',
  'Durant': 'duh-RANT',
  'LeBron': 'leh-BRON',
  'Curry': 'CUR-ee',
  'PER': 'P E R',
  'eFG': 'effective field goal percentage',
  'TS%': 'true shooting percentage',
  'USG%': 'usage rate',
  'BPM': 'box plus minus',
  'VORP': 'value over replacement player',
  'WS': 'win shares',
  'PnR': 'pick and roll',
  'ISO': 'isolation',
  'vs': 'versus',
  '3PT': 'three point',
  'FT': 'free throw',
  'FG': 'field goal'
};

// Detect emotion/tone in text
const detectEmotion = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('🔥') || lowerText.includes('dominant') || lowerText.includes('elite') || lowerText.includes('smash')) {
    return { emotion: 'excited', pitch: 1.15, rate: 1.05 };
  }
  if (lowerText.includes('warning') || lowerText.includes('caution') || lowerText.includes('fade')) {
    return { emotion: 'cautious', pitch: 0.95, rate: 0.95 };
  }
  if (lowerText.includes('analysis') || lowerText.includes('data') || lowerText.includes('statistics')) {
    return { emotion: 'analytical', pitch: 1.0, rate: 0.92 };
  }
  if (lowerText.includes('compare') || lowerText.includes('versus') || lowerText.includes('matchup')) {
    return { emotion: 'comparative', pitch: 1.05, rate: 0.98 };
  }
  
  return { emotion: 'neutral', pitch: 1.0, rate: 1.0 };
};

// Add natural pauses and emphasis
const addNaturalPauses = (text) => {
  let processed = text;
  
  // Remove emojis and special chars
  processed = processed.replace(/[*#📊📈🔥🎯🚀📉💰⚔️🏆✅⚡🎨🌟💎🏀⭐]/g, '');
  
  // Add pauses for better flow
  processed = processed
    .replace(/\n\n+/g, '... ')  // Double newlines = long pause
    .replace(/\n/g, ', ')        // Single newline = short pause
    .replace(/([.!?])\s+/g, '$1... ')  // Add pause after sentences
    .replace(/([,:;])\s+/g, '$1 ')     // Natural pause at punctuation
    .replace(/•/g, ',')                 // Bullets become commas
    .replace(/→/g, 'to')                // Arrow = "to"
    .replace(/\*\*/g, '')               // Remove bold markers
    .replace(/`([^`]+)`/g, '$1');       // Remove code markers
  
  // Add emphasis to numbers
  processed = processed.replace(/(\d+\.\d+)%/g, '$1 percent');
  processed = processed.replace(/(\d+)%/g, '$1 percent');
  processed = processed.replace(/\$(\d+)/g, '$1 dollars');
  
  // Better number reading
  processed = processed.replace(/\b(\d+)-(\d+)\b/g, '$1 to $2');
  processed = processed.replace(/\b(\d+)x\b/g, '$1 times');
  
  // Apply pronunciation dictionary
  Object.entries(PRONUNCIATION_DICT).forEach(([word, pronunciation]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processed = processed.replace(regex, pronunciation);
  });
  
  return processed.trim();
};

// Split long text into chunks for better speech flow
const splitIntoSpeechChunks = (text, maxLength = 200) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';
  
  sentences.forEach(sentence => {
    if ((currentChunk + sentence).length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  });
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

// Select best voice based on platform and quality
const selectBestVoice = (voices) => {
  if (!voices || voices.length === 0) return null;
  
  // Priority order: high quality, natural, en-US
  const priorities = [
    // Premium voices (best quality)
    { name: 'Google US English', score: 100 },
    { name: 'Microsoft David', score: 95 },
    { name: 'Microsoft Mark', score: 94 },
    { name: 'Alex', score: 90 },  // macOS
    { name: 'Samantha', score: 88 },  // macOS
    
    // Good quality voices
    { lang: 'en-US', localService: false, score: 80 },  // Cloud voices
    { lang: 'en-US', score: 70 },
    { lang: 'en-GB', score: 65 },
    { lang: 'en', score: 60 }
  ];
  
  let bestVoice = null;
  let bestScore = 0;
  
  voices.forEach(voice => {
    let score = 0;
    
    // Check priorities
    for (const priority of priorities) {
      if (priority.name && voice.name.includes(priority.name)) {
        score = Math.max(score, priority.score);
      }
      if (priority.lang && voice.lang === priority.lang) {
        score = Math.max(score, priority.score);
        if (priority.localService !== undefined && voice.localService === priority.localService) {
          score += 5;
        }
      }
    }
    
    // Bonus for neural/premium voices
    if (voice.name.toLowerCase().includes('neural')) score += 15;
    if (voice.name.toLowerCase().includes('premium')) score += 10;
    if (voice.name.toLowerCase().includes('enhanced')) score += 10;
    
    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  });
  
  return bestVoice;
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// �🎨 OMEGA QUANTUM STYLES - WORLD'S MOST ADVANCED UI
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
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
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
    background: linear-gradient(135deg, var(--omega-purple-bright), var(--omega-cyan));
    color: white;
    animation: voice-pulse-enhanced 1.2s ease-in-out infinite;
  }

  .omega-voice-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @keyframes voice-pulse-enhanced {
    0%, 100% { 
      transform: scale(1); 
      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7), 0 4px 20px rgba(139, 92, 246, 0.3); 
    }
    50% { 
      transform: scale(1.05); 
      box-shadow: 0 0 0 10px rgba(139, 92, 246, 0), 0 4px 30px rgba(139, 92, 246, 0.5); 
    }
  }

  @keyframes voice-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  }

  /* Voice Status Banner */
  .omega-voice-status {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15));
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 12px 12px 0 0;
    backdrop-filter: blur(10px);
    animation: slideUp 0.3s ease;
  }

  .omega-voice-status.error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15));
    border-color: rgba(239, 68, 68, 0.3);
  }

  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .omega-voice-error {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #f87171;
    font-size: 13px;
  }

  .omega-voice-dismiss {
    margin-left: auto;
    background: none;
    border: none;
    color: #f87171;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .omega-voice-dismiss:hover {
    opacity: 1;
  }

  .omega-voice-interim,
  .omega-voice-listening {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--omega-text);
  }

  .omega-voice-indicator {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .omega-voice-pulse {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--omega-purple-bright);
    opacity: 0.3;
    animation: pulse-ring 1.5s ease-out infinite;
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }

  .omega-transcript-display {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }

  .omega-interim-text {
    font-style: italic;
    color: var(--omega-purple-bright);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .omega-confidence-badge {
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid currentColor;
  }

  .omega-voice-commands {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--omega-text-dim);
    margin-left: auto;
  }

  .omega-voice-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--omega-text-dim);
    margin-left: auto;
  }

  .omega-voice-hint kbd {
    padding: 2px 6px;
    background: var(--omega-elevated);
    border: 1px solid var(--omega-border);
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 10px;
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

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🗣️ TEXT-TO-SPEECH CLEANER - Makes text natural for voice output (100x better!)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const cleanTextForSpeech = (text) => {
  if (!text) return '';
  
  let cleaned = text
    // === STEP 1: Remove markdown formatting ===
    // Remove headers (## and ###)
    .replace(/#{1,6}\s*/g, '')
    // Remove bold markers (**text**)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove italic markers (*text* or _text_)
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    
    // === STEP 2: Remove emojis and special characters ===
    // Remove all emojis (comprehensive regex)
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]/gu, '')
    // Remove box drawing characters
    .replace(/[═╔╗╚╝║│┌┐└┘├┤┬┴┼─━┃┏┓┗┛╋╬]/g, '')
    // Remove other special symbols
    .replace(/[►▸▹▶◆◇○●■□★☆✓✔✕✖✗✘→←↑↓↔↕⇒⇐⇑⇓]/g, '')
    
    // === STEP 3: Remove bullet points and list markers ===
    .replace(/^[•●○■▪▸►→·]\s*/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    
    // === STEP 4: Convert betting odds to natural speech ===
    // Handle plus odds (e.g., +150 → "plus 150")
    .replace(/\+(\d{2,4})\b/g, 'plus $1')
    // Handle minus odds (e.g., -110 → "minus 110")
    .replace(/-(\d{2,4})\b/g, 'minus $1')
    // Handle over/under notation
    .replace(/O\s*(\d+\.?\d*)/gi, 'over $1')
    .replace(/U\s*(\d+\.?\d*)/gi, 'under $1')
    .replace(/O\/U\s*(\d+\.?\d*)/gi, 'over under $1')
    
    // === STEP 5: Convert stat abbreviations to full words ===
    .replace(/\bPTS\b/gi, 'points')
    .replace(/\bREB\b/gi, 'rebounds')
    .replace(/\bAST\b/gi, 'assists')
    .replace(/\bSTL\b/gi, 'steals')
    .replace(/\bBLK\b/gi, 'blocks')
    .replace(/\bTOV?\b/gi, 'turnovers')
    .replace(/\bFGM\b/gi, 'field goals made')
    .replace(/\bFGA\b/gi, 'field goal attempts')
    .replace(/\bFG%\b/gi, 'field goal percentage')
    .replace(/\b3PM\b/gi, 'three pointers made')
    .replace(/\b3PA\b/gi, 'three point attempts')
    .replace(/\b3PT%?\b/gi, 'three point')
    .replace(/\bFTM\b/gi, 'free throws made')
    .replace(/\bFTA\b/gi, 'free throw attempts')
    .replace(/\bFT%\b/gi, 'free throw percentage')
    .replace(/\bMIN\b/gi, 'minutes')
    .replace(/\bPPG\b/gi, 'points per game')
    .replace(/\bRPG\b/gi, 'rebounds per game')
    .replace(/\bAPG\b/gi, 'assists per game')
    .replace(/\bSPG\b/gi, 'steals per game')
    .replace(/\bBPG\b/gi, 'blocks per game')
    .replace(/\bMPG\b/gi, 'minutes per game')
    .replace(/\bAVG\b/gi, 'average')
    .replace(/\bvs\.?\b/gi, 'versus')
    .replace(/\bw\/\b/gi, 'with')
    .replace(/\bw\/o\b/gi, 'without')
    
    // === STEP 6: Convert analytics terms ===
    .replace(/\b\+EV\b/gi, 'positive expected value')
    .replace(/\b-EV\b/gi, 'negative expected value')
    .replace(/\bEV\b/gi, 'expected value')
    .replace(/\bROI\b/gi, 'return on investment')
    .replace(/\bML\b/gi, 'moneyline')
    .replace(/\bATS\b/gi, 'against the spread')
    .replace(/\bL5\b/gi, 'last 5 games')
    .replace(/\bL10\b/gi, 'last 10 games')
    .replace(/\bL15\b/gi, 'last 15 games')
    .replace(/\bL20\b/gi, 'last 20 games')
    .replace(/\bL30\b/gi, 'last 30 games')
    .replace(/\bSZN\b/gi, 'season')
    
    // === STEP 7: Convert percentages and decimals ===
    .replace(/(\d+)\.(\d+)%/g, '$1 point $2 percent')
    .replace(/(\d+)%/g, '$1 percent')
    .replace(/(\d+)\.(\d)/g, '$1 point $2')
    
    // === STEP 8: Clean up URLs and emails ===
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[\w.-]+@[\w.-]+\.[\w]+/g, '')
    
    // === STEP 9: Handle HTML tags ===
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, '')
    
    // === STEP 10: Clean up punctuation and spacing ===
    // Replace multiple newlines with period
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ', ')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Fix multiple punctuation
    .replace(/\.{2,}/g, '.')
    .replace(/,{2,}/g, ',')
    .replace(/\.\s*,/g, '.')
    .replace(/,\s*\./g, '.')
    .replace(/!\s*\./g, '!')
    .replace(/\?\s*\./g, '?')
    // Clean spacing around punctuation
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])\s*([.,!?;:])/g, '$1')
    // Remove leading/trailing issues
    .replace(/^[.,\s]+/, '')
    .replace(/[.,\s]+$/, '')
    .trim();
  
  // === STEP 11: Limit length for natural listening ===
  if (cleaned.length > 500) {
    // Find a good breakpoint at end of sentence
    const breakpoint = cleaned.substring(0, 450).lastIndexOf('.');
    if (breakpoint > 150) {
      cleaned = cleaned.substring(0, breakpoint + 1) + ' More details are in the chat.';
    } else {
      // Try comma
      const commaBreak = cleaned.substring(0, 450).lastIndexOf(',');
      if (commaBreak > 150) {
        cleaned = cleaned.substring(0, commaBreak) + '. More details are in the chat.';
      } else {
        cleaned = cleaned.substring(0, 400) + '... See the chat for more.';
      }
    }
  }
  
  return cleaned;
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
// 🔒 SANITIZATION WRAPPER - SECURITY FIX FOR XSS VULNERABILITY
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'h2', 'h3', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'span'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false
  });
};

// Safe wrapper for parseMarkdown + sanitization
const parseAndSanitize = (text) => {
  const parsed = parseMarkdown(text);
  return sanitizeHTML(parsed);
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌌 MAIN OMEGA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
function RayAssistantUltimate({ isOpen, onClose, onToggle }) {
  // Navigation hook
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState(null);
  const [voiceConfidence, setVoiceConfidence] = useState(0);
  
  // 🎤 ALWAYS-ON WAKE WORD DETECTION STATE
  const [isAwake, setIsAwake] = useState(false);
  const [wakeWordListening, setWakeWordListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  
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
  const wakeWordRecognitionRef = useRef(null);
  const processingLockRef = useRef(false);
  const streamIntervalRef = useRef(null);
  const voiceTimeoutRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const awakeTimeoutRef = useRef(null);
  const processMessageRef = useRef(null); // Ref for processMessage to avoid circular dependency
  const voicesLoadedRef = useRef(false);
  const cachedVoiceRef = useRef(null);
  const speechQueueRef = useRef([]);

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

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🔊 VOICE PRELOADING - ENSURES SPEECH WORKS IMMEDIATELY
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const preloadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🔊 Available voices:', voices.length);
      
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        // Pre-select the best voice
        const bestVoice = selectBestVoice(voices);
        cachedVoiceRef.current = bestVoice;
        console.log('🔊 Voices preloaded! Best voice:', bestVoice?.name || 'Default');
      } else {
        console.warn('⚠️ No voices available yet');
      }
    };
    
    // Load voices immediately
    preloadVoices();
    
    // Also listen for voiceschanged
    window.speechSynthesis.addEventListener('voiceschanged', preloadVoices);
    
    // Keep speech synthesis alive - Chrome pauses it
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 5000);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', preloadVoices);
      clearInterval(keepAlive);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamText, thinkingSteps]);

  // Welcome message with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `Hello sir, how may I help you? 🧠\n\nI'm **Ray** — your AI-powered NBA analytics expert.\n\nI can instantly:\n• **Analyze Players** — Get stats, odds, and props for any player\n• **Show Props** — "Curry points prop", "LeBron rebounds over"\n• **Compare Players** — "Compare LeBron vs Giannis"\n• **Navigate** — "Go to bets", "Open bankroll", "Workstation"\n\n🎤 **Tap the mic button** to speak, or type your question below!`,
          timestamp: new Date(),
          suggestions: ['🔥 Hot props', '⚡ Best value plays', '📊 Top scorers', '🏀 Today\'s games']
        }]);
        
        // Speak the greeting with best voice
        setTimeout(() => {
          const greeting = new SpeechSynthesisUtterance('Hello sir, how may I help you? I am Ray, your NBA analytics expert.');
          if (cachedVoiceRef.current) {
            greeting.voice = cachedVoiceRef.current;
          }
          greeting.rate = 1.05;
          greeting.pitch = 1.0;
          greeting.volume = 1.0;
          window.speechSynthesis.speak(greeting);
        }, 500);
      }, 300);
    }
  }, [isOpen, messages.length]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎤 INSTANT VOICE COMMAND EXECUTION - NO DELAYS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  
  // 🔊 QUICK SPEAK - Fast natural speech for short responses
  const quickSpeak = useCallback((text) => {
    if (!text) return;
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;
    console.log('🎤 Quick speak:', cleanText);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleanText);
    // Use best voice if available
    if (cachedVoiceRef.current) {
      u.voice = cachedVoiceRef.current;
    }
    u.rate = 1.1;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.onstart = () => console.log('✅ Speaking');
    u.onerror = (e) => console.error('❌ Speech error:', e.error);
    window.speechSynthesis.speak(u);
  }, []);

  // Execute voice command instantly
  const executeVoiceCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase().trim();
    console.log('🎯 EXECUTING COMMAND:', lowerCommand);
    setLastCommand(command);
    
    // Helper to call processMessage via ref
    const callProcessMessage = (msg) => {
      if (processMessageRef.current) {
        processMessageRef.current(msg);
      }
    };
    
    // 1. Check for quick responses first (instant)
    for (const [trigger, response] of Object.entries(VOICE_COMMANDS.quickResponses)) {
      if (lowerCommand.includes(trigger)) {
        quickSpeak(response);
        return true;
      }
    }
    
    // 2. Check for bet queries
    if (lowerCommand.includes('bet') || lowerCommand.includes('placed') || lowerCommand.includes('wager')) {
      // Navigate to bets page first
      navigate('/bets');
      if (!isOpen && onToggle) onToggle();
      
      // Query bet information
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('rayBetQuery', { 
          detail: { query: lowerCommand }
        }));
      }, 500);
      
      // Listen for response
      const handleBetResponse = (event) => {
        quickSpeak(event.detail.response);
        window.removeEventListener('rayBetResponse', handleBetResponse);
      };
      window.addEventListener('rayBetResponse', handleBetResponse);
      
      quickSpeak("Checking your bets");
      return true;
    }
    
    // 3. Check for navigation commands (instant navigation)
    for (const [trigger, path] of Object.entries(VOICE_COMMANDS.navigation)) {
      if (lowerCommand.includes(trigger)) {
        console.log(`🚀 NAVIGATING TO: ${path}`);
        quickSpeak(`Going to ${trigger.replace('go to ', '').replace('open ', '').replace('take me to ', '')}`);
        
        // Open the chat if not open
        if (!isOpen && onToggle) onToggle();
        
        // Navigate instantly
        navigate(path);
        return true;
      }
    }
    
    // 4. Check for player search/research commands
    const searchPatterns = [
      /(?:search|find|look up|research|analyze|show me|looking at)\s+(.+)/i,
      /(?:i'm looking at|let's look at|check out)\s+(.+)/i
    ];
    
    for (const pattern of searchPatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        const playerName = findPlayerInText(match[1]);
        if (playerName) {
          console.log(`🔍 SEARCHING PLAYER: ${playerName}`);
          quickSpeak(`Searching for ${playerName}`);
          
          // Open chat if not open
          if (!isOpen && onToggle) onToggle();
          
          // Dispatch player search event for workstation/other pages to catch
          window.dispatchEvent(new CustomEvent('rayPlayerSearch', { 
            detail: { player: playerName, query: command }
          }));
          
          // Also process as a message for chat display
          callProcessMessage(`${playerName} stats`);
          return true;
        }
      }
    }
    
    // 5. Check for page-specific actions
    for (const [trigger, action] of Object.entries(VOICE_COMMANDS.pageActions)) {
      if (lowerCommand.includes(trigger)) {
        console.log(`⚡ PAGE ACTION: ${action.action}`, action);
        quickSpeak(`Showing ${trigger}`);
        
        // Dispatch custom event for pages to catch
        window.dispatchEvent(new CustomEvent('rayPageAction', { 
          detail: action
        }));
        return true;
      }
    }
    
    // 6. Check for direct player mention without explicit command
    const mentionedPlayer = findPlayerInText(lowerCommand);
    if (mentionedPlayer) {
      // Check if they want props, stats, etc.
      if (lowerCommand.includes('prop') || lowerCommand.includes('points') || 
          lowerCommand.includes('rebounds') || lowerCommand.includes('assists')) {
        console.log(`📊 PLAYER PROP: ${mentionedPlayer}`);
        if (!isOpen && onToggle) onToggle();
        callProcessMessage(command);
        return true;
      }
      
      // Default to player stats
      console.log(`📊 PLAYER STATS: ${mentionedPlayer}`);
      quickSpeak(`Got it, showing ${mentionedPlayer}`);
      if (!isOpen && onToggle) onToggle();
      
      window.dispatchEvent(new CustomEvent('rayPlayerSearch', { 
        detail: { player: mentionedPlayer, query: command }
      }));
      callProcessMessage(`${mentionedPlayer} stats`);
      return true;
    }
    
    // 7. Fall through to normal chat processing
    if (!isOpen && onToggle) onToggle();
    callProcessMessage(command);
    return true;
  }, [navigate, isOpen, onToggle, quickSpeak]);

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎤 TAP-TO-SPEAK VOICE - Voice activated via mic button tap only (no always-on)
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // Note: Voice is now activated by tapping the mic button in the chat input area
  // This saves battery and provides better privacy than always-on listening

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎤 PREMIUM SPEAK - Natural voice with clean text processing
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  const speak = useCallback((text) => {
    if (!text) return;
    
    // Clean the text for natural-sounding speech
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;
    
    console.log('🎤 SPEAKING:', cleanText.substring(0, 100) + '...');
    
    // Cancel any pending speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Use the best cached voice if available
    if (cachedVoiceRef.current) {
      utterance.voice = cachedVoiceRef.current;
      console.log('🔊 Using voice:', cachedVoiceRef.current.name);
    }
    
    // Natural speech settings
    utterance.rate = 1.05;    // Slightly faster than normal for snappy feel
    utterance.pitch = 1.0;    // Natural pitch
    utterance.volume = 1.0;   // Full volume
    
    utterance.onstart = () => {
      console.log('✅ Speaking started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('✅ Speaking ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (e) => {
      console.error('❌ Speech error:', e.error);
      setIsSpeaking(false);
    };
    
    // Speak!
    window.speechSynthesis.speak(utterance);
  }, []);

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
  // PROCESS MESSAGE - v11.0 ULTRA BRAIN INTEGRATION WITH ML
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
    
    // Show thinking with enhanced steps
    setIsTyping(true);
    setThinkingSteps([]);
    
    const steps = [
      '🧠 Understanding your question...',
      '🔍 Analyzing player data...',
      '📊 Processing statistics...',
      '🤖 Connecting to ML engine...',
      '⚡ Generating insights...'
    ];
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 150 + Math.random() * 100));
      setThinkingSteps(prev => [...prev, step]);
    }
    
    // Process through the v11.0 ULTRA engine (with fallback to legacy brain)
    try {
      let response;
      
      // Try Ultra Engine first (1000x better)
      try {
        response = await rayUltimateEngine.processMessage(trimmed);
        console.log('🚀 v11.0 Ultra response:', response.type);
        
        // Enhance props responses with Ultra intelligence
        if (response.type === 'prop_analysis' && response.data) {
          const ultraAnalysis = rayPropIntelligenceUltra.analyzeFullProp(
            response.data.player,
            response.data.stat || 'points'
          );
          if (ultraAnalysis) {
            response.data.ultraAnalysis = ultraAnalysis;
          }
        }
        
        // Enhance player responses with live data
        if (response.type === 'player_analysis' && response.data) {
          const liveData = await rayLiveDataUltra.getPlayerStats(response.data.name || response.data.player);
          if (liveData) {
            response.data.liveData = liveData;
            response.data.trend = liveData.trend;
          }
        }
        
      } catch (ultraError) {
        console.log('⚠️ Ultra engine fallback:', ultraError.message);
        // Fallback to legacy conversation brain
        response = await rayConversationBrain.processMessage(trimmed);
      }
      
      setIsTyping(false);
      setThinkingSteps([]);
      
      // Update suggestions with smart context-aware options
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      } else {
        // Generate smart suggestions based on context
        const smartSuggestions = generateSmartSuggestions(response.type, response.data);
        setSuggestions(smartSuggestions);
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
          suggestions: response.suggestions,
          confidence: response.confidence || 0.9
        }]);
        
        processingLockRef.current = false;
        
        // FORCE SPEAK WITH ALERT!
        console.log('🚨🚨🚨 ABOUT TO CALL SPEAK!');
        console.log('Text length:', finalText?.length);
        console.log('First 100 chars:', finalText?.substring(0, 100));
        
        // Show alert to confirm speak is being called
        if (finalText) {
          console.log('✅ Calling speak() NOW!');
          speak(finalText);
          
          // Check if speaking after 500ms
          setTimeout(() => {
            if (!window.speechSynthesis.speaking) {
              console.error('❌❌❌ SPEECH NOT STARTED! Browser might be blocking.');
              console.log('Try clicking the red 🔊 button first!');
            }
          }, 500);
        } else {
          console.error('❌ NO TEXT TO SPEAK!');
        }
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

  // Smart suggestions generator based on context
  const generateSmartSuggestions = (type, data) => {
    const defaults = ['Best props today', 'Trending players', 'Curry stats', 'Sharp money'];
    
    if (type === 'player_analysis' && data?.name) {
      return [
        `${data.name} points prop`,
        `${data.name} rebounds prop`,
        `Compare ${data.name} to...`,
        'Show another player'
      ];
    }
    
    if (type === 'prop_analysis') {
      return ['Show EV breakdown', 'Kelly sizing', 'Compare lines', 'Best value props'];
    }
    
    if (type === 'comparison') {
      return ['Fantasy rankings', 'Head to head stats', 'Trade value', 'Season projections'];
    }
    
    return defaults;
  };

  // Update the processMessage ref whenever processMessage changes
  useEffect(() => {
    processMessageRef.current = processMessage;
  }, [processMessage]);

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
  // ENHANCED SPEECH RECOGNITION SETUP
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  
  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      setVoiceSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const recognition = new SpeechRecognition();
    
    // Build grammar for NBA context
    if (SpeechGrammarList) {
      const grammarList = new SpeechGrammarList();
      const allWords = [
        ...NBA_VOCABULARY.players,
        ...NBA_VOCABULARY.teams,
        ...NBA_VOCABULARY.stats,
        ...NBA_VOCABULARY.actions
      ];
      const grammar = `#JSGF V1.0; grammar nba; public <nba> = ${allWords.join(' | ')};`;
      grammarList.addFromString(grammar, 1);
      recognition.grammars = grammarList;
    }
    
    // Enhanced configuration
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      setIsListening(true);
      setVoiceError(null);
      setInterimTranscript('');
      finalTranscriptRef.current = '';
      
      // Audio feedback
      if (voiceEnabled) {
        const beep = new AudioContext();
        const oscillator = beep.createOscillator();
        const gainNode = beep.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(beep.destination);
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, beep.currentTime);
        oscillator.start();
        oscillator.stop(beep.currentTime + 0.1);
      }
      
      // Auto-timeout after 30 seconds
      voiceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognition.stop();
          setVoiceError('Voice input timed out');
        }
      }, 30000);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';
      let bestConfidence = 0;
      
      // Process all results with alternative selection
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Check all alternatives and pick best match
        let bestTranscript = result[0].transcript;
        let bestAltConfidence = result[0].confidence;
        
        for (let j = 0; j < result.length; j++) {
          const alt = result[j];
          const processed = processVoiceTranscript(alt.transcript);
          
          // Boost confidence if contains known NBA terms
          let confidenceBoost = 0;
          NBA_VOCABULARY.players.forEach(player => {
            if (processed.toLowerCase().includes(player.toLowerCase())) {
              confidenceBoost += 0.15;
            }
          });
          
          const adjustedConfidence = Math.min(1, alt.confidence + confidenceBoost);
          
          if (adjustedConfidence > bestAltConfidence) {
            bestAltConfidence = adjustedConfidence;
            bestTranscript = alt.transcript;
          }
        }
        
        if (result.isFinal) {
          finalText += bestTranscript + ' ';
          bestConfidence = Math.max(bestConfidence, bestAltConfidence);
          setVoiceConfidence(bestAltConfidence * 100);
          console.log(`✅ Final: "${bestTranscript}" (${(bestAltConfidence * 100).toFixed(0)}% confidence)`);
        } else {
          interimText += bestTranscript;
          console.log(`⏳ Interim: "${bestTranscript}"`);
        }
      }
      
      // Process and clean up final text
      if (finalText) {
        const processed = processVoiceTranscript(finalText);
        finalTranscriptRef.current = processed;
        setInput(processed);
        
        // Show what was corrected
        if (processed !== finalText.trim()) {
          console.log(`🔧 Auto-corrected: "${finalText.trim()}" → "${processed}"`);
        }
      }
      
      // Process interim text for display
      if (interimText) {
        const processedInterim = processVoiceTranscript(interimText);
        setInterimTranscript(processedInterim);
      }
      
      // Voice commands
      const command = (finalText + interimText).toLowerCase().trim();
      
      if (command.includes('stop listening') || command.includes('cancel')) {
        recognition.stop();
        setInput('');
        setInterimTranscript('');
        finalTranscriptRef.current = '';
        return;
      }
      
      if (command.includes('send message') || command.includes('submit') || command.includes('go ahead')) {
        recognition.stop();
        if (finalTranscriptRef.current.trim()) {
          setTimeout(() => processMessage(finalTranscriptRef.current.trim()), 100);
        }
        return;
      }
      
      if (command.includes('clear') || command.includes('delete')) {
        setInput('');
        setInterimTranscript('');
        finalTranscriptRef.current = '';
        return;
      }
    };

    recognition.onerror = (event) => {
      console.error('🚨 Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript('');
      
      const errorMessages = {
        'not-allowed': '🚫 Microphone access denied. Please enable microphone in browser settings.',
        'no-speech': '🔇 No speech detected. Please speak louder.',
        'audio-capture': '🎤 Microphone not found. Please check your microphone.',
        'network': '🌐 Network error. Please check your connection.',
        'aborted': '⏹️ Voice input cancelled.',
        'language-not-supported': '🌍 Language not supported.'
      };
      
      const errorMsg = errorMessages[event.error] || `❌ Error: ${event.error}`;
      setVoiceError(errorMsg);
      
      if (event.error === 'not-allowed') {
        setTimeout(() => {
          alert('🎤 Microphone Access Required\n\nPlease allow microphone access to use voice input.\n\n1. Click the lock icon in address bar\n2. Allow microphone access\n3. Reload the page');
        }, 100);
      }
    };

    recognition.onend = () => {
      console.log('🛑 Voice recognition ended');
      setIsListening(false);
      setInterimTranscript('');
      
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
      
      // Auto-submit if we have text and high confidence
      if (finalTranscriptRef.current.trim() && voiceConfidence > 70) {
        setTimeout(() => {
          const text = finalTranscriptRef.current.trim();
          if (text && !processingLockRef.current) {
            processMessage(text);
          }
        }, 200);
      }
    };

    recognition.onsoundstart = () => {
      console.log('🔊 Sound detected');
    };
    
    recognition.onsoundend = () => {
      console.log('🔇 Sound ended');
    };
    
    recognition.onspeechstart = () => {
      console.log('🗣️ Speech detected');
    };
    
    recognition.onspeechend = () => {
      console.log('✋ Speech ended');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, [processMessage, voiceEnabled, voiceConfidence]);

  // Handle voice button toggle
  useEffect(() => {
    if (!recognitionRef.current || !voiceSupported) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsListening(false);
        setVoiceError('Failed to start. Please try again.');
      }
    } else {
      try {
        recognitionRef.current.stop();
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
        }
      } catch (error) {
        // Already stopped
      }
    }
  }, [isListening, voiceSupported]);
  
  // Voice shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Shift + V = Toggle voice
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        if (voiceSupported && !processingLockRef.current) {
          setIsListening(prev => !prev);
        }
      }
      
      // Escape while listening = Stop
      if (e.key === 'Escape' && isListening) {
        e.preventDefault();
        setIsListening(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, voiceSupported]);

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
              onClick={() => {
                const newState = !voiceEnabled;
                setVoiceEnabled(newState);
                console.log(`🔊 Voice ${newState ? 'ENABLED' : 'DISABLED'}`);
                
                // Test speak when enabled
                if (newState) {
                  setTimeout(() => {
                    console.log('🎤 Testing voice...');
                    const testUtterance = new SpeechSynthesisUtterance("Voice enabled");
                    testUtterance.rate = 1.2;
                    testUtterance.volume = 1.0;
                    window.speechSynthesis.speak(testUtterance);
                  }, 100);
                }
              }}
              title={voiceEnabled ? 'Mute voice (Currently ON)' : 'Enable voice (Currently OFF)'}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              className="omega-btn-icon"
              onClick={() => {
                console.log('🚨🚨🚨 EMERGENCY TEST BUTTON CLICKED!');
                
                // Cancel everything
                window.speechSynthesis.cancel();
                
                // Create test utterance
                const test = new SpeechSynthesisUtterance("Emergency voice test! Ray is speaking now!");
                test.rate = 1.1;
                test.volume = 1.0;
                
                test.onstart = () => {
                  console.log('✅✅✅ TEST SPEECH STARTED!');
                  alert('Voice is working! You should hear me speaking!');
                };
                
                test.onend = () => {
                  console.log('✅✅✅ TEST SPEECH ENDED!');
                };
                
                test.onerror = (e) => {
                  console.error('❌❌❌ TEST FAILED:', e);
                  alert('VOICE ERROR: ' + e.error + '\n\nMake sure:\n1. Volume is up\n2. Browser has permission\n3. No headphones issue');
                };
                
                // SPEAK!
                window.speechSynthesis.speak(test);
                console.log('🚀 Test utterance queued!');
                
                // Check status
                setTimeout(() => {
                  console.log('Speaking?', window.speechSynthesis.speaking);
                  console.log('Pending?', window.speechSynthesis.pending);
                  console.log('Paused?', window.speechSynthesis.paused);
                  
                  if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                    alert('Speech API not working!\n\nTry:\n1. Refresh page\n2. Check browser console\n3. Test in Chrome');
                  }
                }, 200);
              }}
              title="EMERGENCY TEST - Click to test voice!"
              style={{ background: '#ff0000', animation: 'pulse 1s infinite' }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🔊</span>
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
                dangerouslySetInnerHTML={{ __html: parseAndSanitize(msg.content) }}
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
                <span dangerouslySetInnerHTML={{ __html: parseAndSanitize(streamText) }} />
                <span className="omega-cursor" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="omega-input-area">
          {/* Voice Status Banner */}
          {(isListening || voiceError || interimTranscript) && (
            <div className={`omega-voice-status ${voiceError ? 'error' : isListening ? 'active' : ''}`}>
              {voiceError ? (
                <div className="omega-voice-error">
                  <AlertCircle size={14} />
                  <span>{voiceError}</span>
                  <button 
                    className="omega-voice-dismiss"
                    onClick={() => setVoiceError(null)}
                  >
                    ×
                  </button>
                </div>
              ) : isListening && interimTranscript ? (
                <div className="omega-voice-interim">
                  <div className="omega-voice-indicator">
                    <div className="omega-voice-pulse" />
                    <Mic size={12} />
                  </div>
                  <div className="omega-transcript-display">
                    <span className="omega-interim-text">"{interimTranscript}"</span>
                    {voiceConfidence > 0 && (
                      <span className="omega-confidence-badge" style={{
                        background: voiceConfidence > 80 ? 'rgba(34, 197, 94, 0.2)' : 
                                   voiceConfidence > 60 ? 'rgba(234, 179, 8, 0.2)' : 
                                   'rgba(239, 68, 68, 0.2)',
                        color: voiceConfidence > 80 ? '#22c55e' : 
                               voiceConfidence > 60 ? '#eab308' : '#ef4444'
                      }}>
                        {voiceConfidence.toFixed(0)}% confident
                      </span>
                    )}
                  </div>
                  <div className="omega-voice-commands">
                    <span>Say "stop listening" to cancel</span>
                    <span>•</span>
                    <span>Say "send message" to submit</span>
                  </div>
                </div>
              ) : isListening ? (
                <div className="omega-voice-listening">
                  <div className="omega-voice-indicator">
                    <div className="omega-voice-pulse" />
                    <Mic size={12} />
                  </div>
                  <span>Listening... Speak now</span>
                  <div className="omega-voice-hint">
                    Press <kbd>Esc</kbd> or click mic to stop
                  </div>
                </div>
              ) : null}
            </div>
          )}
          
          <div className="omega-input-container">
            <button
              className={`omega-voice-btn ${isListening ? 'listening' : 'idle'} ${!voiceSupported ? 'disabled' : ''}`}
              onClick={() => {
                // Auto-activate voice on first click
                const test = new SpeechSynthesisUtterance('');
                test.volume = 0;
                window.speechSynthesis.speak(test);
                
                if (voiceSupported) setIsListening(!isListening);
              }}
              title={!voiceSupported ? 'Voice input not supported' : isListening ? 'Stop listening (Esc)' : 'Voice input (Ctrl+Shift+V)'}
              disabled={!voiceSupported}
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
