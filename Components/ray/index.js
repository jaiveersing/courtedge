/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY v10.0 OMEGA - NBA ANALYTICS CHATBOT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CORE ENGINES:
 * • RayAssistantOmega - Main chatbot component
 * • RayConversationBrain - Intent recognition, memory, context
 * • RayAnalyticsEngine - Players, stats, splits, matchups
 * • RayPropIntelligence - EV, Kelly, sharp money, parlays
 * • RayComparisonEngine - H2H, rankings, fantasy
 * • RayLiveDataService - Real-time API integration
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export { default } from './RayAssistantOmega';
export { default as RayAssistant } from './RayAssistantOmega';
export { default as RayAssistantOmega } from './RayAssistantOmega';

// ═══════════════════════════════════════════════════════════════════════════════
// CORE ENGINES
// ═══════════════════════════════════════════════════════════════════════════════

export { default as rayAnalytics, PLAYERS_DB, TEAMS_DB, PLAYER_ALIASES } from './RayAnalyticsEngine';
export { default as rayPropIntelligence, PROP_LINES, LINE_MOVEMENTS } from './RayPropIntelligence';
export { default as rayComparisonEngine } from './RayComparisonEngine';
export { default as rayConversationBrain } from './RayConversationBrain';
export { default as rayLiveData, PLAYER_STATS_2025 } from './RayLiveDataService';

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

export const RAY_VERSION = '10.0.0';
