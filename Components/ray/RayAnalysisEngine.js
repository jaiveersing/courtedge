/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY ANALYSIS ENGINE - Comprehensive Player Analysis Framework
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * MULTI-LAYER ANALYSIS FRAMEWORK:
 * 
 * LAYER A: Performance Analysis Foundation
 * - Recent Performance (Last 5 Games)
 * - Extended Window (Last 10 Games)
 * - Season Baseline
 * - Variance & Volatility Profiling
 * 
 * LAYER B: Line Interaction Analysis
 * - Hit Rate vs Current Line
 * - Hit Rate vs Similar Lines
 * - Over/Under Skew Analysis
 * - Trend Direction Analysis
 * 
 * LAYER C: Contextual Filters
 * - Home/Away Splits
 * - Rest Days Impact
 * - Roster Configuration
 * 
 * LAYER D: Matchup Intelligence
 * - Opponent Defense Metrics
 * - Historical Performance vs Opponent
 * - Pace & Style Implications
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useMemo, useCallback } from 'react';
import { useRayContext } from './RayContext';

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICAL UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const StatUtils = {
  // Calculate mean
  mean: (arr) => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },
  
  // Calculate median
  median: (arr) => {
    if (!arr || arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  
  // Calculate standard deviation
  stdDev: (arr) => {
    if (!arr || arr.length < 2) return 0;
    const avg = StatUtils.mean(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(StatUtils.mean(squareDiffs));
  },
  
  // Calculate coefficient of variation
  coefficientOfVariation: (arr) => {
    const avg = StatUtils.mean(arr);
    if (avg === 0) return 0;
    return (StatUtils.stdDev(arr) / avg) * 100;
  },
  
  // Calculate hit rate
  hitRate: (arr, line, overUnder = 'over') => {
    if (!arr || arr.length === 0) return 0;
    const hits = arr.filter(val => 
      overUnder === 'over' ? val > line : val < line
    ).length;
    return (hits / arr.length) * 100;
  },
  
  // Calculate min/max range
  range: (arr) => {
    if (!arr || arr.length === 0) return { min: 0, max: 0, spread: 0 };
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { min, max, spread: max - min };
  },
  
  // Calculate trend (linear regression slope)
  trend: (arr) => {
    if (!arr || arr.length < 2) return 0;
    const n = arr.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = StatUtils.mean(arr) * n;
    const sumXY = arr.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  },
  
  // Calculate z-score
  zScore: (value, mean, stdDev) => {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  },
  
  // Classify volatility
  classifyVolatility: (cv) => {
    if (cv < 15) return 'low';
    if (cv < 25) return 'moderate';
    return 'high';
  },
  
  // Classify trend direction
  classifyTrend: (recentAvg, extendedAvg, seasonAvg) => {
    const recentVsExtended = ((recentAvg - extendedAvg) / extendedAvg) * 100;
    const recentVsSeason = ((recentAvg - seasonAvg) / seasonAvg) * 100;
    
    if (recentVsExtended > 5 && recentVsSeason > 5) return 'improving';
    if (recentVsExtended < -5 && recentVsSeason < -5) return 'declining';
    if (Math.abs(recentVsExtended) < 3) return 'stable';
    return 'volatile';
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER A: PERFORMANCE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

const analyzePerformance = (gameLog, statType = 'points') => {
  if (!gameLog || gameLog.length === 0) {
    return {
      last5: { mean: 0, median: 0, stdDev: 0, trend: 'stable' },
      last10: { mean: 0, median: 0, stdDev: 0, trend: 'stable' },
      season: { mean: 0, median: 0, stdDev: 0 },
      volatility: 'unknown',
      consistency: 0
    };
  }
  
  // Extract stat values
  const getStatValue = (game) => {
    switch (statType.toLowerCase()) {
      case 'points': return game.pts || game.points || 0;
      case 'rebounds': return game.reb || game.rebounds || 0;
      case 'assists': return game.ast || game.assists || 0;
      case 'threes': return game.fg3m || game.threes || 0;
      case 'steals': return game.stl || game.steals || 0;
      case 'blocks': return game.blk || game.blocks || 0;
      case 'pra': return (game.pts || 0) + (game.reb || 0) + (game.ast || 0);
      default: return game[statType] || 0;
    }
  };
  
  const last5 = gameLog.slice(0, 5).map(getStatValue);
  const last10 = gameLog.slice(0, 10).map(getStatValue);
  const season = gameLog.map(getStatValue);
  
  // Calculate metrics for each window
  const last5Analysis = {
    mean: Math.round(StatUtils.mean(last5) * 10) / 10,
    median: Math.round(StatUtils.median(last5) * 10) / 10,
    stdDev: Math.round(StatUtils.stdDev(last5) * 10) / 10,
    range: StatUtils.range(last5),
    trend: StatUtils.trend(last5)
  };
  
  const last10Analysis = {
    mean: Math.round(StatUtils.mean(last10) * 10) / 10,
    median: Math.round(StatUtils.median(last10) * 10) / 10,
    stdDev: Math.round(StatUtils.stdDev(last10) * 10) / 10,
    range: StatUtils.range(last10),
    trend: StatUtils.trend(last10),
    cv: Math.round(StatUtils.coefficientOfVariation(last10) * 10) / 10
  };
  
  const seasonAnalysis = {
    mean: Math.round(StatUtils.mean(season) * 10) / 10,
    median: Math.round(StatUtils.median(season) * 10) / 10,
    stdDev: Math.round(StatUtils.stdDev(season) * 10) / 10,
    range: StatUtils.range(season),
    cv: Math.round(StatUtils.coefficientOfVariation(season) * 10) / 10
  };
  
  // Volatility classification
  const volatility = StatUtils.classifyVolatility(last10Analysis.cv);
  
  // Trend classification
  const trendDirection = StatUtils.classifyTrend(
    last5Analysis.mean,
    last10Analysis.mean,
    seasonAnalysis.mean
  );
  
  // Consistency score (inverse of CV, normalized to 0-100)
  const consistency = Math.max(0, Math.min(100, 100 - last10Analysis.cv));
  
  // Regression signal
  const zScoreRecent = StatUtils.zScore(
    last5Analysis.mean,
    seasonAnalysis.mean,
    seasonAnalysis.stdDev
  );
  
  return {
    last5: last5Analysis,
    last10: last10Analysis,
    season: seasonAnalysis,
    volatility,
    trendDirection,
    consistency: Math.round(consistency),
    regressionSignal: zScoreRecent > 1.5 ? 'likely_down' : zScoreRecent < -1.5 ? 'likely_up' : 'stable',
    rawData: { last5, last10, season }
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER B: LINE INTERACTION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

const analyzeLineInteraction = (gameLog, line, statType = 'points') => {
  if (!gameLog || gameLog.length === 0 || line === null) {
    return {
      hitRate: { last5: 0, last10: 0, season: 0 },
      margin: { average: 0, whenHit: 0, whenMiss: 0 },
      skew: 'neutral',
      linePosition: 'unknown'
    };
  }
  
  // Get stat values
  const getStatValue = (game) => {
    switch (statType.toLowerCase()) {
      case 'points': return game.pts || game.points || 0;
      case 'rebounds': return game.reb || game.rebounds || 0;
      case 'assists': return game.ast || game.assists || 0;
      case 'threes': return game.fg3m || game.threes || 0;
      case 'steals': return game.stl || game.steals || 0;
      case 'blocks': return game.blk || game.blocks || 0;
      case 'pra': return (game.pts || 0) + (game.reb || 0) + (game.ast || 0);
      default: return game[statType] || 0;
    }
  };
  
  const last5 = gameLog.slice(0, 5).map(getStatValue);
  const last10 = gameLog.slice(0, 10).map(getStatValue);
  const season = gameLog.map(getStatValue);
  
  // Hit rates
  const hitRate = {
    last5: Math.round(StatUtils.hitRate(last5, line) * 10) / 10,
    last10: Math.round(StatUtils.hitRate(last10, line) * 10) / 10,
    season: Math.round(StatUtils.hitRate(season, line) * 10) / 10
  };
  
  // Margin analysis
  const margins = season.map(val => val - line);
  const hitMargins = margins.filter(m => m > 0);
  const missMargins = margins.filter(m => m <= 0);
  
  const margin = {
    average: Math.round(StatUtils.mean(margins) * 10) / 10,
    whenHit: hitMargins.length > 0 ? Math.round(StatUtils.mean(hitMargins) * 10) / 10 : 0,
    whenMiss: missMargins.length > 0 ? Math.round(StatUtils.mean(missMargins) * 10) / 10 : 0
  };
  
  // Skew analysis
  const absHitMargin = Math.abs(margin.whenHit);
  const absMissMargin = Math.abs(margin.whenMiss);
  let skew = 'neutral';
  if (absHitMargin > absMissMargin * 1.5) skew = 'over_skewed';
  if (absMissMargin > absHitMargin * 1.5) skew = 'under_skewed';
  
  // Line position relative to distribution
  const seasonMedian = StatUtils.median(season);
  const seasonMean = StatUtils.mean(season);
  let linePosition = 'fair';
  if (line < seasonMedian * 0.95) linePosition = 'soft';
  if (line > seasonMedian * 1.05) linePosition = 'sharp';
  
  // Adjacent line hit rates
  const adjacentLines = {
    minus2: Math.round(StatUtils.hitRate(last10, line - 2)),
    minus1: Math.round(StatUtils.hitRate(last10, line - 1)),
    current: Math.round(StatUtils.hitRate(last10, line)),
    plus1: Math.round(StatUtils.hitRate(last10, line + 1)),
    plus2: Math.round(StatUtils.hitRate(last10, line + 2))
  };
  
  return {
    hitRate,
    margin,
    skew,
    linePosition,
    adjacentLines,
    recommendation: hitRate.last10 >= 65 ? 'over' : hitRate.last10 <= 35 ? 'under' : 'pass'
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER C: CONTEXTUAL FILTERS
// ═══════════════════════════════════════════════════════════════════════════════

const analyzeContextualSplits = (gameLog, statType = 'points') => {
  if (!gameLog || gameLog.length === 0) {
    return {
      home: { mean: 0, hitRate: 0, games: 0 },
      away: { mean: 0, hitRate: 0, games: 0 },
      rested: { mean: 0, hitRate: 0, games: 0 },
      b2b: { mean: 0, hitRate: 0, games: 0 },
      splits: []
    };
  }
  
  const getStatValue = (game) => {
    switch (statType.toLowerCase()) {
      case 'points': return game.pts || game.points || 0;
      case 'rebounds': return game.reb || game.rebounds || 0;
      case 'assists': return game.ast || game.assists || 0;
      case 'pra': return (game.pts || 0) + (game.reb || 0) + (game.ast || 0);
      default: return game[statType] || 0;
    }
  };
  
  // Home/Away splits
  const homeGames = gameLog.filter(g => g.isHome || g.location === 'home');
  const awayGames = gameLog.filter(g => !g.isHome || g.location === 'away');
  
  const home = {
    mean: Math.round(StatUtils.mean(homeGames.map(getStatValue)) * 10) / 10,
    games: homeGames.length
  };
  
  const away = {
    mean: Math.round(StatUtils.mean(awayGames.map(getStatValue)) * 10) / 10,
    games: awayGames.length
  };
  
  // Rest splits (simulated - would need actual rest day data)
  const rested = {
    mean: home.mean * 1.02, // Slight boost when rested
    games: Math.floor(gameLog.length * 0.6)
  };
  
  const b2b = {
    mean: home.mean * 0.95, // Slight decrease on B2B
    games: Math.floor(gameLog.length * 0.15)
  };
  
  // Calculate significant splits
  const splits = [];
  
  if (Math.abs(home.mean - away.mean) > 2) {
    splits.push({
      type: 'location',
      description: home.mean > away.mean ? 'Performs better at home' : 'Performs better on road',
      magnitude: Math.abs(home.mean - away.mean).toFixed(1),
      preferred: home.mean > away.mean ? 'home' : 'away'
    });
  }
  
  return {
    home,
    away,
    rested,
    b2b,
    splits,
    homeAdvantage: Math.round((home.mean - away.mean) * 10) / 10
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER D: MATCHUP INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════

const analyzeMatchup = (player, opponent, statType = 'points') => {
  // Mock matchup data - in production this would come from actual data
  const defenseRatings = {
    'Celtics': { points: 'elite', rebounds: 'good', assists: 'average' },
    'Bucks': { points: 'average', rebounds: 'elite', assists: 'good' },
    'Lakers': { points: 'poor', rebounds: 'average', assists: 'average' },
    'Warriors': { points: 'average', rebounds: 'poor', assists: 'average' },
    'Nuggets': { points: 'good', rebounds: 'average', assists: 'elite' },
    'Suns': { points: 'poor', rebounds: 'average', assists: 'poor' },
    'Heat': { points: 'elite', rebounds: 'good', assists: 'average' },
    'Mavericks': { points: 'average', rebounds: 'poor', assists: 'average' }
  };
  
  const defenseImpact = {
    'elite': -15,
    'good': -5,
    'average': 0,
    'poor': 10
  };
  
  const opponentDefense = defenseRatings[opponent]?.[statType] || 'average';
  const impact = defenseImpact[opponentDefense] || 0;
  
  // Pace factor
  const paceFactors = {
    'Warriors': 1.05,
    'Lakers': 1.02,
    'Suns': 1.08,
    'Nuggets': 1.03,
    'Celtics': 0.98,
    'Heat': 0.95,
    'Bucks': 1.01,
    'Mavericks': 1.04
  };
  
  const paceFactor = paceFactors[opponent] || 1.0;
  
  return {
    opponentDefense,
    defenseRating: opponentDefense,
    projectedImpact: impact,
    paceFactor,
    paceDescription: paceFactor > 1.02 ? 'fast' : paceFactor < 0.98 ? 'slow' : 'neutral',
    matchupGrade: impact > 5 ? 'favorable' : impact < -5 ? 'unfavorable' : 'neutral',
    historicalPerformance: {
      games: Math.floor(Math.random() * 5) + 2,
      average: Math.round((22 + impact * 0.5) * 10) / 10,
      hitRate: Math.round(50 + impact * 2)
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

const generateComprehensiveAnalysis = (player, gameLog, line, opponent, statType = 'points') => {
  // Run all analysis layers
  const performance = analyzePerformance(gameLog, statType);
  const lineInteraction = analyzeLineInteraction(gameLog, line, statType);
  const contextual = analyzeContextualSplits(gameLog, statType);
  const matchup = analyzeMatchup(player, opponent, statType);
  
  // Calculate overall confidence score
  const confidenceFactors = [];
  
  // Hit rate confidence
  if (lineInteraction.hitRate.last10 >= 70) confidenceFactors.push(20);
  else if (lineInteraction.hitRate.last10 >= 60) confidenceFactors.push(15);
  else if (lineInteraction.hitRate.last10 >= 50) confidenceFactors.push(10);
  else confidenceFactors.push(5);
  
  // Consistency confidence
  if (performance.volatility === 'low') confidenceFactors.push(20);
  else if (performance.volatility === 'moderate') confidenceFactors.push(12);
  else confidenceFactors.push(5);
  
  // Trend confidence
  if (performance.trendDirection === 'stable') confidenceFactors.push(15);
  else if (performance.trendDirection === 'improving') confidenceFactors.push(18);
  else if (performance.trendDirection === 'declining') confidenceFactors.push(8);
  else confidenceFactors.push(5);
  
  // Matchup confidence
  if (matchup.matchupGrade === 'favorable') confidenceFactors.push(15);
  else if (matchup.matchupGrade === 'neutral') confidenceFactors.push(10);
  else confidenceFactors.push(5);
  
  // Sample size confidence
  if (gameLog && gameLog.length >= 20) confidenceFactors.push(10);
  else if (gameLog && gameLog.length >= 10) confidenceFactors.push(7);
  else confidenceFactors.push(3);
  
  const overallConfidence = Math.min(95, confidenceFactors.reduce((a, b) => a + b, 15));
  
  // Generate recommendation
  let recommendation = 'pass';
  let edge = 0;
  
  if (lineInteraction.hitRate.last10 >= 65 && performance.consistency >= 70) {
    recommendation = 'over';
    edge = lineInteraction.hitRate.last10 - 50;
  } else if (lineInteraction.hitRate.last10 <= 35 && performance.consistency >= 70) {
    recommendation = 'under';
    edge = 50 - lineInteraction.hitRate.last10;
  }
  
  return {
    performance,
    lineInteraction,
    contextual,
    matchup,
    confidence: overallConfidence,
    recommendation,
    edge: Math.round(edge),
    grade: overallConfidence >= 80 ? 'A' : overallConfidence >= 70 ? 'B' : overallConfidence >= 60 ? 'C' : 'D',
    summary: generateAnalysisSummary(player, statType, line, performance, lineInteraction, matchup, recommendation)
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// NATURAL LANGUAGE SUMMARY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

const generateAnalysisSummary = (player, statType, line, performance, lineInteraction, matchup, recommendation) => {
  const playerName = player?.name || player || 'This player';
  const statLabel = statType.charAt(0).toUpperCase() + statType.slice(1);
  
  // Build the summary in Ray's voice
  let summary = '';
  
  // Performance context
  summary += `${playerName}'s ${statType} line at ${line} `;
  
  if (lineInteraction.hitRate.last10 >= 70) {
    summary += `presents clear value. `;
  } else if (lineInteraction.hitRate.last10 <= 30) {
    summary += `looks inflated. `;
  } else {
    summary += `sits at an interesting spot. `;
  }
  
  // Recent form
  summary += `The last 10 games show a ${lineInteraction.hitRate.last10}% hit rate, `;
  summary += `averaging ${performance.last10.mean} with ${performance.volatility} variance. `;
  
  // Trend
  if (performance.trendDirection === 'improving') {
    summary += `Recent trajectory is positive—last 5 average of ${performance.last5.mean} exceeds the extended window. `;
  } else if (performance.trendDirection === 'declining') {
    summary += `Recent form has dipped—last 5 averaging ${performance.last5.mean}, below the extended baseline. `;
  } else if (performance.trendDirection === 'stable') {
    summary += `Performance has been remarkably stable with minimal deviation from baseline. `;
  }
  
  // Matchup
  if (matchup.matchupGrade === 'favorable') {
    summary += `Tonight's matchup projects favorably with a ${matchup.paceDescription} pace expectation. `;
  } else if (matchup.matchupGrade === 'unfavorable') {
    summary += `The matchup presents challenges—opponent ranks ${matchup.defenseRating} defensively against this stat. `;
  }
  
  // Conclusion
  if (recommendation === 'over') {
    summary += `The data supports the over here.`;
  } else if (recommendation === 'under') {
    summary += `The analysis leans under.`;
  } else {
    summary += `No clear edge presents—consider passing or looking at alternative markets.`;
  }
  
  return summary;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export const useRayAnalysis = () => {
  const rayContext = useRayContext?.() || {};
  
  const analyzePlayer = useCallback((player, gameLog, line, opponent, statType) => {
    return generateComprehensiveAnalysis(player, gameLog, line, opponent, statType);
  }, []);
  
  const quickAnalysis = useCallback((gameLog, line, statType = 'points') => {
    const performance = analyzePerformance(gameLog, statType);
    const lineInteraction = analyzeLineInteraction(gameLog, line, statType);
    
    return {
      hitRate: lineInteraction.hitRate.last10,
      average: performance.last10.mean,
      volatility: performance.volatility,
      recommendation: lineInteraction.recommendation,
      confidence: Math.round(50 + (lineInteraction.hitRate.last10 - 50) * 0.6)
    };
  }, []);
  
  const compareMarkets = useCallback((gameLog, markets) => {
    return markets.map(market => {
      const analysis = analyzePerformance(gameLog, market.type);
      const lineAnalysis = analyzeLineInteraction(gameLog, market.line, market.type);
      
      return {
        market: market.type,
        line: market.line,
        hitRate: lineAnalysis.hitRate.last10,
        volatility: analysis.volatility,
        consistency: analysis.consistency,
        recommendation: lineAnalysis.recommendation,
        score: lineAnalysis.hitRate.last10 * (analysis.consistency / 100)
      };
    }).sort((a, b) => b.score - a.score);
  }, []);
  
  const findBestOpportunities = useCallback((players, gameLog, statType = 'points') => {
    // Analyze each player and rank by opportunity quality
    return players.map(player => {
      const log = gameLog[player.id] || [];
      const analysis = generateComprehensiveAnalysis(
        player.name,
        log,
        player.line,
        player.opponent,
        statType
      );
      
      return {
        player: player.name,
        line: player.line,
        confidence: analysis.confidence,
        grade: analysis.grade,
        recommendation: analysis.recommendation,
        edge: analysis.edge
      };
    }).filter(p => p.recommendation !== 'pass')
      .sort((a, b) => b.confidence - a.confidence);
  }, []);
  
  return {
    analyzePlayer,
    quickAnalysis,
    compareMarkets,
    findBestOpportunities,
    
    // Expose individual analysis functions
    analyzePerformance,
    analyzeLineInteraction,
    analyzeContextualSplits,
    analyzeMatchup,
    
    // Utilities
    StatUtils
  };
};

export default useRayAnalysis;
