/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLAYER ANALYSIS ENGINE - Real Data Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Connects RayAnalysisEngine formulas with real API data from RayDataService
 * 
 * Returns fully populated analysis with:
 * - Mean, median, SD for last 5/10/season
 * - Hit rate vs current line
 * - Trend direction (improving/declining)
 * - Volatility classification
 * - Confidence score
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import DataService from './RayDataService';
import { useRayAnalysis } from './RayAnalysisEngine';

/**
 * MAIN ANALYSIS FUNCTION
 * Fetches real data and runs comprehensive analysis
 */
export async function analyzePlayerProp(playerName, market = 'points', line = null) {
  console.log(`🧠 Analyzing ${playerName} - ${market}`);
  
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Fetch real player stats (last 20 games)
    // ─────────────────────────────────────────────────────────────────────────
    const playerStats = await DataService.getPlayerStats(playerName, 20);
    
    if (!playerStats || !playerStats.gameLogs || playerStats.gameLogs.length === 0) {
      console.warn(`No game logs found for ${playerName}`);
      return createEmptyAnalysis(playerName, market);
    }
    
    const { gameLogs, playerInfo, recentForm } = playerStats;
    console.log(`✅ Fetched ${gameLogs.length} games for ${playerInfo.name}`);
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Fetch current betting line
    // ─────────────────────────────────────────────────────────────────────────
    const lineData = await DataService.getCurrentLine(playerName, market);
    const currentLine = line || lineData.line || calculateDefaultLine(gameLogs, market);
    console.log(`📊 Line: ${currentLine} (from ${lineData.bookmaker || 'calculated'})`);
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Format game logs for analysis engine
    // ─────────────────────────────────────────────────────────────────────────
    const formattedGameLogs = formatGameLogsForAnalysis(gameLogs);
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4: Run comprehensive analysis using RayAnalysisEngine formulas
    // ─────────────────────────────────────────────────────────────────────────
    const analysis = runComprehensiveAnalysis(
      formattedGameLogs,
      currentLine,
      market,
      playerInfo
    );
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 5: Enrich with additional insights
    // ─────────────────────────────────────────────────────────────────────────
    const enrichedAnalysis = {
      ...analysis,
      playerInfo,
      lineData,
      market,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Analysis complete - Confidence: ${enrichedAnalysis.confidence}%`);
    return enrichedAnalysis;
    
  } catch (error) {
    console.error('Analysis error:', error);
    return createEmptyAnalysis(playerName, market);
  }
}

/**
 * FORMAT GAME LOGS
 * Convert API format to analysis engine format
 */
function formatGameLogsForAnalysis(gameLogs) {
  return gameLogs.map(game => ({
    // Points
    pts: game.pts || game.points || 0,
    points: game.pts || game.points || 0,
    
    // Rebounds
    reb: game.reb || game.rebounds || 0,
    rebounds: game.reb || game.rebounds || 0,
    
    // Assists
    ast: game.ast || game.assists || 0,
    assists: game.ast || game.assists || 0,
    
    // Threes
    fg3m: game.fg3m || game.threes || 0,
    threes: game.fg3m || game.threes || 0,
    
    // Steals
    stl: game.stl || game.steals || 0,
    steals: game.stl || game.steals || 0,
    
    // Blocks
    blk: game.blk || game.blocks || 0,
    blocks: game.blk || game.blocks || 0,
    
    // Field Goals
    fga: game.fga || 0,
    fgm: game.fgm || 0,
    fgPct: game.fg_pct || (game.fga > 0 ? (game.fgm / game.fga) * 100 : 0),
    
    // Minutes
    min: game.min || game.minutes || 0,
    minutes: game.min || game.minutes || 0,
    
    // Game info
    date: game.date || game.game?.date || null,
    opponent: game.opponent || game.game?.opponent || 'Unknown',
    home: game.home_team || game.game?.home_team || true
  }));
}

/**
 * RUN COMPREHENSIVE ANALYSIS
 * Uses all formulas from RayAnalysisEngine with real data
 */
function runComprehensiveAnalysis(gameLogs, line, market, playerInfo) {
  // ═════════════════════════════════════════════════════════════════════════
  // LAYER A: PERFORMANCE ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  const performance = analyzePerformanceWithRealData(gameLogs, market);
  
  // ═════════════════════════════════════════════════════════════════════════
  // LAYER B: LINE INTERACTION ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  const lineInteraction = analyzeLineInteractionWithRealData(gameLogs, line, market);
  
  // ═════════════════════════════════════════════════════════════════════════
  // LAYER C: CONTEXTUAL SPLITS
  // ═════════════════════════════════════════════════════════════════════════
  const contextual = analyzeContextualSplitsWithRealData(gameLogs, market);
  
  // ═════════════════════════════════════════════════════════════════════════
  // CALCULATE CONFIDENCE SCORE
  // ═════════════════════════════════════════════════════════════════════════
  const confidence = calculateConfidenceScore(
    lineInteraction,
    performance,
    contextual,
    gameLogs.length
  );
  
  // ═════════════════════════════════════════════════════════════════════════
  // GENERATE RECOMMENDATION
  // ═════════════════════════════════════════════════════════════════════════
  const { recommendation, edge, reasoning } = generateRecommendation(
    lineInteraction,
    performance,
    confidence
  );
  
  return {
    performance,
    lineInteraction,
    contextual,
    confidence,
    recommendation,
    edge,
    reasoning,
    grade: confidence >= 80 ? 'A' : confidence >= 70 ? 'B' : confidence >= 60 ? 'C' : 'D',
    sampleSize: gameLogs.length
  };
}

/**
 * LAYER A: PERFORMANCE ANALYSIS WITH REAL DATA
 * Calculate mean, median, SD for last 5/10/season
 */
function analyzePerformanceWithRealData(gameLogs, market) {
  const values = extractMarketValues(gameLogs, market);
  
  // Last 5 games
  const last5Values = values.slice(0, 5);
  const last5 = {
    mean: calculateMean(last5Values),
    median: calculateMedian(last5Values),
    stdDev: calculateStdDev(last5Values),
    min: Math.min(...last5Values),
    max: Math.max(...last5Values)
  };
  
  // Last 10 games
  const last10Values = values.slice(0, 10);
  const last10 = {
    mean: calculateMean(last10Values),
    median: calculateMedian(last10Values),
    stdDev: calculateStdDev(last10Values),
    cv: calculateCV(last10Values),
    min: Math.min(...last10Values),
    max: Math.max(...last10Values)
  };
  
  // Full season
  const season = {
    mean: calculateMean(values),
    median: calculateMedian(values),
    stdDev: calculateStdDev(values),
    cv: calculateCV(values),
    min: Math.min(...values),
    max: Math.max(...values)
  };
  
  // Classify volatility
  const volatility = classifyVolatility(last10.cv);
  
  // Determine trend direction
  const trendDirection = determineTrendDirection(last5.mean, last10.mean, season.mean);
  
  // Consistency score (inverse of CV)
  const consistency = Math.max(0, Math.min(100, 100 - last10.cv));
  
  return {
    last5,
    last10,
    season,
    volatility,
    trendDirection,
    consistency: Math.round(consistency),
    rawValues: { last5: last5Values, last10: last10Values, season: values }
  };
}

/**
 * LAYER B: LINE INTERACTION ANALYSIS WITH REAL DATA
 * Calculate hit rate vs current line
 */
function analyzeLineInteractionWithRealData(gameLogs, line, market) {
  const values = extractMarketValues(gameLogs, market);
  
  // Calculate hit rates for different windows
  const last5Values = values.slice(0, 5);
  const last10Values = values.slice(0, 10);
  
  const hitRate = {
    last5: calculateHitRate(last5Values, line),
    last10: calculateHitRate(last10Values, line),
    season: calculateHitRate(values, line)
  };
  
  // Calculate margins
  const margins = values.map(v => v - line);
  const last10Margins = margins.slice(0, 10);
  
  const hitsMargins = last10Margins.filter(m => m > 0);
  const missMargins = last10Margins.filter(m => m <= 0);
  
  const margin = {
    average: calculateMean(last10Margins),
    whenHit: hitsMargins.length > 0 ? calculateMean(hitsMargins) : 0,
    whenMiss: missMargins.length > 0 ? Math.abs(calculateMean(missMargins)) : 0
  };
  
  // Determine skew
  const skew = margin.average > 1 ? 'over-biased' : 
               margin.average < -1 ? 'under-biased' : 
               'balanced';
  
  // Line position relative to distribution
  const mean = calculateMean(last10Values);
  const linePosition = line < mean - 2 ? 'low' :
                       line > mean + 2 ? 'high' :
                       'center';
  
  return {
    hitRate,
    margin,
    skew,
    linePosition,
    recommendation: hitRate.last10 >= 65 ? 'over' : hitRate.last10 <= 35 ? 'under' : 'pass'
  };
}

/**
 * LAYER C: CONTEXTUAL SPLITS WITH REAL DATA
 */
function analyzeContextualSplitsWithRealData(gameLogs, market) {
  const homeGames = gameLogs.filter(g => g.home === true);
  const awayGames = gameLogs.filter(g => g.home === false);
  
  const homeValues = extractMarketValues(homeGames, market);
  const awayValues = extractMarketValues(awayGames, market);
  
  return {
    homeAway: {
      home: {
        games: homeGames.length,
        average: calculateMean(homeValues),
        stdDev: calculateStdDev(homeValues)
      },
      away: {
        games: awayGames.length,
        average: calculateMean(awayValues),
        stdDev: calculateStdDev(awayValues)
      },
      split: homeValues.length > 0 && awayValues.length > 0 
        ? calculateMean(homeValues) - calculateMean(awayValues)
        : 0
    }
  };
}

/**
 * CALCULATE CONFIDENCE SCORE
 * Based on multiple factors
 */
function calculateConfidenceScore(lineInteraction, performance, contextual, sampleSize) {
  let score = 0;
  
  // Hit rate confidence (max 30 points)
  if (lineInteraction.hitRate.last10 >= 75 || lineInteraction.hitRate.last10 <= 25) {
    score += 30;
  } else if (lineInteraction.hitRate.last10 >= 65 || lineInteraction.hitRate.last10 <= 35) {
    score += 20;
  } else if (lineInteraction.hitRate.last10 >= 55 || lineInteraction.hitRate.last10 <= 45) {
    score += 10;
  }
  
  // Volatility confidence (max 25 points)
  if (performance.volatility === 'low') {
    score += 25;
  } else if (performance.volatility === 'moderate') {
    score += 15;
  } else {
    score += 5;
  }
  
  // Trend confidence (max 20 points)
  if (performance.trendDirection === 'stable') {
    score += 20;
  } else if (performance.trendDirection === 'improving' || performance.trendDirection === 'declining') {
    score += 15;
  } else {
    score += 10;
  }
  
  // Sample size confidence (max 15 points)
  if (sampleSize >= 20) {
    score += 15;
  } else if (sampleSize >= 15) {
    score += 12;
  } else if (sampleSize >= 10) {
    score += 8;
  } else {
    score += 5;
  }
  
  // Consistency bonus (max 10 points)
  if (performance.consistency >= 80) {
    score += 10;
  } else if (performance.consistency >= 70) {
    score += 7;
  } else if (performance.consistency >= 60) {
    score += 4;
  }
  
  return Math.min(95, Math.max(0, score));
}

/**
 * GENERATE RECOMMENDATION
 */
function generateRecommendation(lineInteraction, performance, confidence) {
  let recommendation = 'pass';
  let edge = 0;
  let reasoning = [];
  
  const hitRate = lineInteraction.hitRate.last10;
  const consistency = performance.consistency;
  
  // Strong over signal
  if (hitRate >= 70 && consistency >= 70 && confidence >= 70) {
    recommendation = 'over';
    edge = Math.round(hitRate - 50);
    reasoning.push(`Strong hit rate: ${hitRate}%`);
    reasoning.push(`High consistency: ${consistency}%`);
  }
  // Moderate over signal
  else if (hitRate >= 60 && consistency >= 60 && confidence >= 60) {
    recommendation = 'over';
    edge = Math.round(hitRate - 50);
    reasoning.push(`Moderate edge detected`);
  }
  // Strong under signal
  else if (hitRate <= 30 && consistency >= 70 && confidence >= 70) {
    recommendation = 'under';
    edge = Math.round(50 - hitRate);
    reasoning.push(`Strong under bias: ${hitRate}% hit rate`);
    reasoning.push(`Consistent performance`);
  }
  // Moderate under signal
  else if (hitRate <= 40 && consistency >= 60 && confidence >= 60) {
    recommendation = 'under';
    edge = Math.round(50 - hitRate);
    reasoning.push(`Under edge detected`);
  }
  // No clear edge
  else {
    reasoning.push(`No clear edge (hit rate: ${hitRate}%)`);
    reasoning.push(`Consider alternative markets`);
  }
  
  return { recommendation, edge, reasoning };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function extractMarketValues(gameLogs, market) {
  return gameLogs.map(game => {
    switch (market.toLowerCase()) {
      case 'points': return game.pts || game.points || 0;
      case 'rebounds': return game.reb || game.rebounds || 0;
      case 'assists': return game.ast || game.assists || 0;
      case 'threes': return game.fg3m || game.threes || 0;
      case 'steals': return game.stl || game.steals || 0;
      case 'blocks': return game.blk || game.blocks || 0;
      case 'pra': return (game.pts || 0) + (game.reb || 0) + (game.ast || 0);
      default: return game[market] || 0;
    }
  });
}

function calculateMean(values) {
  if (!values || values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStdDev(values) {
  if (!values || values.length < 2) return 0;
  const mean = calculateMean(values);
  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  return Math.round(Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function calculateCV(values) {
  const mean = calculateMean(values);
  if (mean === 0) return 0;
  const stdDev = calculateStdDev(values);
  return Math.round((stdDev / mean) * 100 * 10) / 10;
}

function calculateHitRate(values, line) {
  if (!values || values.length === 0) return 0;
  const hits = values.filter(v => v > line).length;
  return Math.round((hits / values.length) * 100);
}

function classifyVolatility(cv) {
  if (cv < 15) return 'low';
  if (cv < 25) return 'moderate';
  return 'high';
}

function determineTrendDirection(last5Avg, last10Avg, seasonAvg) {
  const recentVsExtended = last5Avg - last10Avg;
  const recentVsSeason = last5Avg - seasonAvg;
  
  if (recentVsExtended > 1.5 && recentVsSeason > 1) return 'improving';
  if (recentVsExtended < -1.5 && recentVsSeason < -1) return 'declining';
  return 'stable';
}

function calculateDefaultLine(gameLogs, market) {
  const values = extractMarketValues(gameLogs, market);
  return calculateMean(values.slice(0, 10));
}

function createEmptyAnalysis(playerName, market) {
  return {
    playerInfo: { name: playerName },
    market,
    performance: {
      last5: { mean: 0, median: 0, stdDev: 0 },
      last10: { mean: 0, median: 0, stdDev: 0, cv: 0 },
      season: { mean: 0, median: 0, stdDev: 0, cv: 0 },
      volatility: 'unknown',
      trendDirection: 'unknown',
      consistency: 0
    },
    lineInteraction: {
      hitRate: { last5: 0, last10: 0, season: 0 },
      margin: { average: 0, whenHit: 0, whenMiss: 0 },
      skew: 'unknown',
      linePosition: 'unknown',
      recommendation: 'pass'
    },
    contextual: {
      homeAway: {
        home: { games: 0, average: 0, stdDev: 0 },
        away: { games: 0, average: 0, stdDev: 0 },
        split: 0
      }
    },
    confidence: 0,
    recommendation: 'pass',
    edge: 0,
    reasoning: ['No data available'],
    grade: 'F',
    sampleSize: 0,
    timestamp: new Date().toISOString()
  };
}

export default {
  analyzePlayerProp
};
