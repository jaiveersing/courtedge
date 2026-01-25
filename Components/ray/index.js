/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY v10.0 OMEGA - WORLD'S MOST ADVANCED NBA ANALYTICS CHATBOT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE ULTIMATE SPORTS BETTING AI CHATBOT - 1000+ FEATURES
 * 
 * CORE ENGINES:
 * • RayAssistantOmega - Main chatbot component (OMEGA UI)
 * • RayConversationBrain - 15+ intent recognition, memory, context
 * • RayAnalyticsEngine - 18+ players, stats, splits, matchups
 * • RayPropIntelligence - EV, Kelly, sharp money, parlays
 * • RayComparisonEngine - H2H, rankings, fantasy, trade value
 * • RayLiveDataService - Real-time API integration
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (v10.0 OMEGA is now default)
// ═══════════════════════════════════════════════════════════════════════════════

export { default } from './RayAssistantOmega';
export { default as RayAssistant } from './RayAssistantOmega';
export { default as RayAssistantOmega } from './RayAssistantOmega';
export { default as RayAssistantUltimate } from './RayAssistantUltimate';
export { default as RayAssistantLegacy } from './RayAssistant';

// ═══════════════════════════════════════════════════════════════════════════════
// v10.0 OMEGA ENGINES (NEW)
// ═══════════════════════════════════════════════════════════════════════════════

export { default as rayAnalytics, PLAYERS_DB, TEAMS_DB, PLAYER_ALIASES as PLAYER_ALIASES_V10 } from './RayAnalyticsEngine';
export { default as rayPropIntelligence, PROP_LINES, LINE_MOVEMENTS } from './RayPropIntelligence';
export { default as rayComparisonEngine } from './RayComparisonEngine';
export { default as rayConversationBrain } from './RayConversationBrain';
export { default as rayLiveData, PLAYER_STATS_2025 } from './RayLiveDataService';

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS (Backward Compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

export { RayContextProvider, useRayContext } from './RayContext';
export { useRayAnalysis } from './RayAnalysisEngine';
export { useRayIntent } from './RayIntentSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// CORE ENGINES (v4.0)
// ═══════════════════════════════════════════════════════════════════════════════

export { default as RayBrain, PLAYER_DATABASE, TEAM_DATABASE } from './RayBrain';
export { default as RayStatEngine } from './RayStatEngine';
export { default as RayNLPEngine, PLAYER_ALIASES, TEAM_ALIASES, MARKET_ALIASES } from './RayNLPEngine';
export { default as RayMemory } from './RayMemory';
export { default as RayDataEngine } from './RayDataEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  Sparkline,
  DistributionChart,
  ConfidenceGauge,
  HitRateIndicator,
  EdgeIndicator,
  VolatilityIndicator,
  TrendIndicator,
  GradeBadge,
  ComparisonBar,
  PercentileBar,
  StatCard,
  RecommendationPill,
  AnalysisCard,
  LivePulse
} from './RayVisualizations';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export {
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
} from './RayAnimations';

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION INFO
// ═══════════════════════════════════════════════════════════════════════════════

export const RAY_VERSION = '4.0.0';

export const RAY_FEATURES = {
  voice: true,
  nlp: true,
  memory: true,
  statistics: true,
  visualizations: true,
  monteCarlo: true,
  bayesian: true,
  darkMode: true,
  realTimeData: true,
  playerDatabase: 30,
  intentTypes: 20,
  statMethods: 40,
  uiComponents: 15
};

export const RAY_CAPABILITIES = [
  'Player analysis for 30+ NBA superstars',
  'Props analysis (pts, reb, ast, 3pm, stl, blk, PRA)',
  'Hit rate calculations across multiple windows',
  'Monte Carlo simulations (10,000 iterations)',
  'Bayesian confidence updates',
  'Expected Value & Kelly Criterion sizing',
  'Edge detection and grade assignment',
  'Multi-turn conversation with context memory',
  'Voice input/output',
  'Natural language understanding (20+ intents)',
  'Interactive visualizations',
  'Dark/light mode support'
];
