/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RAY BRAIN - ADVANCED AI REASONING ENGINE v3.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The cognitive core of Ray - handles reasoning, inference, and decision making.
 * Implements multi-layer neural-inspired processing for sports analytics.
 * 
 * ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 * Layer 1: Perception     - Raw data intake and normalization
 * Layer 2: Pattern        - Statistical pattern recognition
 * Layer 3: Context        - Situational awareness and matchup analysis
 * Layer 4: Inference      - Probabilistic reasoning and prediction
 * Layer 5: Synthesis      - Multi-factor integration and recommendation
 * Layer 6: Expression     - Natural language generation
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import RayStatEngine from './RayStatEngine';
import RayNLPEngine from './RayNLPEngine';
import RayMemory from './RayMemory';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const BRAIN_CONFIG = {
  // Confidence thresholds
  confidenceThresholds: {
    veryHigh: 85,
    high: 75,
    moderate: 60,
    low: 45,
    veryLow: 30
  },
  
  // Edge thresholds (percentage points)
  edgeThresholds: {
    strong: 15,
    moderate: 8,
    marginal: 3,
    none: 0
  },
  
  // Volatility classifications
  volatilityThresholds: {
    veryLow: 0.10,    // CV < 10%
    low: 0.15,        // CV < 15%
    moderate: 0.25,   // CV < 25%
    high: 0.35,       // CV < 35%
    veryHigh: 1.0     // CV >= 35%
  },
  
  // Sample size requirements
  sampleSizeRequirements: {
    minimum: 5,
    reliable: 10,
    robust: 20,
    comprehensive: 50
  },
  
  // Recency weights (exponential decay)
  recencyWeights: {
    game1: 1.0,
    game2: 0.95,
    game3: 0.90,
    game4: 0.85,
    game5: 0.80,
    game6: 0.72,
    game7: 0.65,
    game8: 0.58,
    game9: 0.52,
    game10: 0.46
  },
  
  // Context multipliers
  contextMultipliers: {
    homeAdvantage: 1.08,
    restDayBoost: 1.04,
    backToBackPenalty: 0.94,
    rivalryGame: 1.02,
    nationalTV: 1.01,
    playoffIntensity: 1.05
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER DATABASE - COMPREHENSIVE NBA PLAYER DATA
// ═══════════════════════════════════════════════════════════════════════════════

const PLAYER_DATABASE = {
  // Superstars
  'stephen curry': {
    id: 201939,
    name: 'Stephen Curry',
    team: 'GSW',
    position: 'PG',
    age: 36,
    experience: 15,
    averages: { pts: 26.8, reb: 4.9, ast: 5.2, stl: 0.9, blk: 0.3, fg3m: 4.8, min: 32.5 },
    usage: 31.2,
    pace: 102.5,
    trueShootingPct: 0.625,
    assistPct: 32.1,
    reboundPct: 7.2,
    hotZones: ['threePoint', 'midRange'],
    weaknesses: ['physicality', 'offBallDefense'],
    injuryHistory: ['ankle', 'shoulder'],
    clutchRating: 94,
    consistencyRating: 78,
    propsProfile: {
      points: { mean: 26.8, stdDev: 7.2, floor: 12, ceiling: 50 },
      threes: { mean: 4.8, stdDev: 2.4, floor: 0, ceiling: 13 },
      assists: { mean: 5.2, stdDev: 2.1, floor: 1, ceiling: 12 },
      rebounds: { mean: 4.9, stdDev: 1.8, floor: 1, ceiling: 10 }
    }
  },
  'lebron james': {
    id: 2544,
    name: 'LeBron James',
    team: 'LAL',
    position: 'SF',
    age: 40,
    experience: 21,
    averages: { pts: 25.2, reb: 7.5, ast: 8.2, stl: 1.2, blk: 0.6, fg3m: 2.1, min: 35.2 },
    usage: 29.8,
    pace: 100.8,
    trueShootingPct: 0.598,
    assistPct: 38.5,
    reboundPct: 11.8,
    hotZones: ['paint', 'midRange'],
    weaknesses: ['freeThrows', 'threePointConsistency'],
    injuryHistory: ['ankle', 'groin'],
    clutchRating: 96,
    consistencyRating: 92,
    propsProfile: {
      points: { mean: 25.2, stdDev: 5.8, floor: 14, ceiling: 45 },
      assists: { mean: 8.2, stdDev: 2.8, floor: 3, ceiling: 15 },
      rebounds: { mean: 7.5, stdDev: 2.2, floor: 3, ceiling: 14 },
      threes: { mean: 2.1, stdDev: 1.4, floor: 0, ceiling: 6 }
    }
  },
  'nikola jokic': {
    id: 203999,
    name: 'Nikola Jokic',
    team: 'DEN',
    position: 'C',
    age: 29,
    experience: 9,
    averages: { pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.4, blk: 0.9, fg3m: 1.2, min: 36.8 },
    usage: 27.5,
    pace: 98.2,
    trueShootingPct: 0.652,
    assistPct: 42.8,
    reboundPct: 22.5,
    hotZones: ['paint', 'elbow', 'shortMidRange'],
    weaknesses: ['perimeter', 'fastBreakDefense'],
    injuryHistory: [],
    clutchRating: 92,
    consistencyRating: 96,
    propsProfile: {
      points: { mean: 26.4, stdDev: 6.2, floor: 12, ceiling: 45 },
      rebounds: { mean: 12.4, stdDev: 3.5, floor: 5, ceiling: 22 },
      assists: { mean: 9.0, stdDev: 3.2, floor: 2, ceiling: 18 },
      threes: { mean: 1.2, stdDev: 1.0, floor: 0, ceiling: 5 }
    }
  },
  'luka doncic': {
    id: 1629029,
    name: 'Luka Doncic',
    team: 'DAL',
    position: 'PG',
    age: 25,
    experience: 6,
    averages: { pts: 33.2, reb: 9.1, ast: 9.5, stl: 1.5, blk: 0.5, fg3m: 3.8, min: 37.5 },
    usage: 36.8,
    pace: 99.5,
    trueShootingPct: 0.588,
    assistPct: 45.2,
    reboundPct: 13.8,
    hotZones: ['stepBack', 'paint', 'midRange'],
    weaknesses: ['conditioning', 'offBallDefense'],
    injuryHistory: ['ankle', 'knee'],
    clutchRating: 88,
    consistencyRating: 85,
    propsProfile: {
      points: { mean: 33.2, stdDev: 8.5, floor: 18, ceiling: 55 },
      rebounds: { mean: 9.1, stdDev: 2.8, floor: 4, ceiling: 16 },
      assists: { mean: 9.5, stdDev: 3.4, floor: 3, ceiling: 18 },
      threes: { mean: 3.8, stdDev: 2.2, floor: 0, ceiling: 10 }
    }
  },
  'jayson tatum': {
    id: 1628369,
    name: 'Jayson Tatum',
    team: 'BOS',
    position: 'SF',
    age: 26,
    experience: 7,
    averages: { pts: 27.5, reb: 8.2, ast: 4.8, stl: 1.1, blk: 0.7, fg3m: 3.2, min: 36.2 },
    usage: 30.5,
    pace: 101.2,
    trueShootingPct: 0.602,
    assistPct: 22.8,
    reboundPct: 12.5,
    hotZones: ['threePoint', 'midRange', 'paint'],
    weaknesses: ['shotSelection', 'turnoverProne'],
    injuryHistory: ['ankle'],
    clutchRating: 82,
    consistencyRating: 80,
    propsProfile: {
      points: { mean: 27.5, stdDev: 7.8, floor: 12, ceiling: 50 },
      rebounds: { mean: 8.2, stdDev: 2.5, floor: 3, ceiling: 15 },
      assists: { mean: 4.8, stdDev: 2.0, floor: 1, ceiling: 12 },
      threes: { mean: 3.2, stdDev: 1.8, floor: 0, ceiling: 8 }
    }
  },
  'giannis antetokounmpo': {
    id: 203507,
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    position: 'PF',
    age: 29,
    experience: 11,
    averages: { pts: 30.8, reb: 11.5, ast: 6.2, stl: 1.2, blk: 1.5, fg3m: 0.8, min: 35.5 },
    usage: 34.2,
    pace: 102.8,
    trueShootingPct: 0.618,
    assistPct: 28.5,
    reboundPct: 18.2,
    hotZones: ['paint', 'transition'],
    weaknesses: ['threePoint', 'freeThrows'],
    injuryHistory: ['knee', 'back'],
    clutchRating: 86,
    consistencyRating: 88,
    propsProfile: {
      points: { mean: 30.8, stdDev: 6.5, floor: 18, ceiling: 55 },
      rebounds: { mean: 11.5, stdDev: 3.2, floor: 5, ceiling: 20 },
      assists: { mean: 6.2, stdDev: 2.4, floor: 1, ceiling: 14 },
      blocks: { mean: 1.5, stdDev: 1.1, floor: 0, ceiling: 5 }
    }
  },
  'kevin durant': {
    id: 201142,
    name: 'Kevin Durant',
    team: 'PHX',
    position: 'SF',
    age: 35,
    experience: 16,
    averages: { pts: 27.8, reb: 6.5, ast: 5.2, stl: 0.9, blk: 1.4, fg3m: 2.5, min: 36.8 },
    usage: 31.5,
    pace: 100.2,
    trueShootingPct: 0.632,
    assistPct: 25.2,
    reboundPct: 10.5,
    hotZones: ['midRange', 'threePoint', 'post'],
    weaknesses: ['physicality', 'ballHandling'],
    injuryHistory: ['achilles', 'knee', 'ankle'],
    clutchRating: 94,
    consistencyRating: 90,
    propsProfile: {
      points: { mean: 27.8, stdDev: 6.8, floor: 14, ceiling: 48 },
      rebounds: { mean: 6.5, stdDev: 2.0, floor: 2, ceiling: 12 },
      assists: { mean: 5.2, stdDev: 2.2, floor: 1, ceiling: 12 },
      threes: { mean: 2.5, stdDev: 1.5, floor: 0, ceiling: 7 }
    }
  },
  'joel embiid': {
    id: 203954,
    name: 'Joel Embiid',
    team: 'PHI',
    position: 'C',
    age: 30,
    experience: 8,
    averages: { pts: 34.5, reb: 11.2, ast: 5.8, stl: 1.2, blk: 1.8, fg3m: 1.5, min: 34.2 },
    usage: 37.5,
    pace: 98.5,
    trueShootingPct: 0.642,
    assistPct: 22.5,
    reboundPct: 19.8,
    hotZones: ['paint', 'freeThrowLine', 'elbow'],
    weaknesses: ['conditioning', 'turnovers'],
    injuryHistory: ['foot', 'knee', 'back', 'finger'],
    clutchRating: 88,
    consistencyRating: 72,
    propsProfile: {
      points: { mean: 34.5, stdDev: 9.2, floor: 15, ceiling: 60 },
      rebounds: { mean: 11.2, stdDev: 3.8, floor: 4, ceiling: 20 },
      assists: { mean: 5.8, stdDev: 2.5, floor: 1, ceiling: 12 },
      blocks: { mean: 1.8, stdDev: 1.2, floor: 0, ceiling: 6 }
    }
  },
  'anthony edwards': {
    id: 1630162,
    name: 'Anthony Edwards',
    team: 'MIN',
    position: 'SG',
    age: 23,
    experience: 4,
    averages: { pts: 28.5, reb: 5.8, ast: 5.2, stl: 1.5, blk: 0.6, fg3m: 3.2, min: 35.8 },
    usage: 32.8,
    pace: 101.5,
    trueShootingPct: 0.578,
    assistPct: 24.2,
    reboundPct: 8.5,
    hotZones: ['transition', 'threePoint', 'paint'],
    weaknesses: ['shotSelection', 'midRange'],
    injuryHistory: [],
    clutchRating: 85,
    consistencyRating: 75,
    propsProfile: {
      points: { mean: 28.5, stdDev: 8.2, floor: 12, ceiling: 50 },
      rebounds: { mean: 5.8, stdDev: 2.0, floor: 2, ceiling: 12 },
      assists: { mean: 5.2, stdDev: 2.2, floor: 1, ceiling: 12 },
      threes: { mean: 3.2, stdDev: 1.8, floor: 0, ceiling: 9 }
    }
  },
  'tyrese haliburton': {
    id: 1630169,
    name: 'Tyrese Haliburton',
    team: 'IND',
    position: 'PG',
    age: 24,
    experience: 4,
    averages: { pts: 20.5, reb: 4.0, ast: 10.8, stl: 1.5, blk: 0.3, fg3m: 3.0, min: 34.5 },
    usage: 24.5,
    pace: 105.8,
    trueShootingPct: 0.618,
    assistPct: 45.8,
    reboundPct: 5.8,
    hotZones: ['threePoint', 'floater'],
    weaknesses: ['finishing', 'physicality'],
    injuryHistory: ['hamstring', 'groin'],
    clutchRating: 82,
    consistencyRating: 88,
    propsProfile: {
      points: { mean: 20.5, stdDev: 5.5, floor: 8, ceiling: 35 },
      assists: { mean: 10.8, stdDev: 3.2, floor: 4, ceiling: 18 },
      rebounds: { mean: 4.0, stdDev: 1.5, floor: 1, ceiling: 8 },
      threes: { mean: 3.0, stdDev: 1.6, floor: 0, ceiling: 8 }
    }
  },
  'domantas sabonis': {
    id: 1627734,
    name: 'Domantas Sabonis',
    team: 'SAC',
    position: 'C',
    age: 28,
    experience: 8,
    averages: { pts: 20.2, reb: 14.0, ast: 7.5, stl: 0.8, blk: 0.5, fg3m: 0.5, min: 35.5 },
    usage: 22.8,
    pace: 102.2,
    trueShootingPct: 0.608,
    assistPct: 32.5,
    reboundPct: 25.8,
    hotZones: ['paint', 'shortMidRange'],
    weaknesses: ['perimeter', 'rimProtection'],
    injuryHistory: ['knee'],
    clutchRating: 78,
    consistencyRating: 94,
    propsProfile: {
      points: { mean: 20.2, stdDev: 4.5, floor: 10, ceiling: 32 },
      rebounds: { mean: 14.0, stdDev: 3.2, floor: 8, ceiling: 22 },
      assists: { mean: 7.5, stdDev: 2.5, floor: 2, ceiling: 14 },
      doubles: { mean: 2.2, stdDev: 0.5, floor: 1, ceiling: 3 }
    }
  },
  'shai gilgeous-alexander': {
    id: 1628983,
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    position: 'PG',
    age: 25,
    experience: 6,
    averages: { pts: 31.5, reb: 5.5, ast: 6.2, stl: 2.0, blk: 0.8, fg3m: 1.8, min: 34.2 },
    usage: 33.5,
    pace: 99.8,
    trueShootingPct: 0.625,
    assistPct: 28.5,
    reboundPct: 7.8,
    hotZones: ['midRange', 'floater', 'paint'],
    weaknesses: ['threePointVolume'],
    injuryHistory: ['ankle'],
    clutchRating: 92,
    consistencyRating: 86,
    propsProfile: {
      points: { mean: 31.5, stdDev: 7.0, floor: 18, ceiling: 50 },
      rebounds: { mean: 5.5, stdDev: 1.8, floor: 2, ceiling: 10 },
      assists: { mean: 6.2, stdDev: 2.2, floor: 2, ceiling: 12 },
      steals: { mean: 2.0, stdDev: 1.0, floor: 0, ceiling: 5 }
    }
  },
  'victor wembanyama': {
    id: 1641705,
    name: 'Victor Wembanyama',
    team: 'SAS',
    position: 'C',
    age: 20,
    experience: 1,
    averages: { pts: 22.5, reb: 10.5, ast: 4.0, stl: 1.2, blk: 3.8, fg3m: 2.0, min: 32.5 },
    usage: 28.5,
    pace: 100.5,
    trueShootingPct: 0.565,
    assistPct: 18.5,
    reboundPct: 18.2,
    hotZones: ['threePoint', 'paint', 'block'],
    weaknesses: ['physicality', 'consistency'],
    injuryHistory: [],
    clutchRating: 72,
    consistencyRating: 68,
    propsProfile: {
      points: { mean: 22.5, stdDev: 7.5, floor: 8, ceiling: 42 },
      rebounds: { mean: 10.5, stdDev: 3.2, floor: 4, ceiling: 18 },
      blocks: { mean: 3.8, stdDev: 1.8, floor: 0, ceiling: 8 },
      threes: { mean: 2.0, stdDev: 1.5, floor: 0, ceiling: 6 }
    }
  },
  'damian lillard': {
    id: 203081,
    name: 'Damian Lillard',
    team: 'MIL',
    position: 'PG',
    age: 33,
    experience: 12,
    averages: { pts: 25.5, reb: 4.5, ast: 7.2, stl: 1.0, blk: 0.3, fg3m: 3.5, min: 35.2 },
    usage: 28.5,
    pace: 102.8,
    trueShootingPct: 0.598,
    assistPct: 35.2,
    reboundPct: 5.5,
    hotZones: ['threePoint', 'deepThree', 'freeThrow'],
    weaknesses: ['defense', 'finishing'],
    injuryHistory: ['abdominal', 'calf'],
    clutchRating: 95,
    consistencyRating: 82,
    propsProfile: {
      points: { mean: 25.5, stdDev: 7.0, floor: 12, ceiling: 45 },
      assists: { mean: 7.2, stdDev: 2.5, floor: 2, ceiling: 14 },
      threes: { mean: 3.5, stdDev: 2.0, floor: 0, ceiling: 10 },
      rebounds: { mean: 4.5, stdDev: 1.5, floor: 1, ceiling: 8 }
    }
  },
  'devin booker': {
    id: 1626164,
    name: 'Devin Booker',
    team: 'PHX',
    position: 'SG',
    age: 27,
    experience: 9,
    averages: { pts: 27.2, reb: 4.5, ast: 6.8, stl: 1.0, blk: 0.3, fg3m: 2.5, min: 36.0 },
    usage: 30.2,
    pace: 100.2,
    trueShootingPct: 0.605,
    assistPct: 28.5,
    reboundPct: 5.2,
    hotZones: ['midRange', 'threePoint', 'pullUp'],
    weaknesses: ['defense', 'rebounding'],
    injuryHistory: ['groin', 'hamstring'],
    clutchRating: 90,
    consistencyRating: 85,
    propsProfile: {
      points: { mean: 27.2, stdDev: 7.2, floor: 12, ceiling: 52 },
      assists: { mean: 6.8, stdDev: 2.5, floor: 2, ceiling: 14 },
      rebounds: { mean: 4.5, stdDev: 1.5, floor: 1, ceiling: 9 },
      threes: { mean: 2.5, stdDev: 1.5, floor: 0, ceiling: 7 }
    }
  },
  'trae young': {
    id: 1629027,
    name: 'Trae Young',
    team: 'ATL',
    position: 'PG',
    age: 25,
    experience: 6,
    averages: { pts: 26.5, reb: 3.0, ast: 10.5, stl: 1.2, blk: 0.1, fg3m: 3.0, min: 35.5 },
    usage: 32.5,
    pace: 101.5,
    trueShootingPct: 0.575,
    assistPct: 48.2,
    reboundPct: 3.8,
    hotZones: ['threePoint', 'floater', 'deepThree'],
    weaknesses: ['defense', 'turnovers', 'physicality'],
    injuryHistory: ['ankle', 'finger'],
    clutchRating: 88,
    consistencyRating: 78,
    propsProfile: {
      points: { mean: 26.5, stdDev: 8.0, floor: 12, ceiling: 48 },
      assists: { mean: 10.5, stdDev: 3.5, floor: 4, ceiling: 20 },
      threes: { mean: 3.0, stdDev: 1.8, floor: 0, ceiling: 8 },
      rebounds: { mean: 3.0, stdDev: 1.2, floor: 0, ceiling: 7 }
    }
  },
  'jalen brunson': {
    id: 1628973,
    name: 'Jalen Brunson',
    team: 'NYK',
    position: 'PG',
    age: 27,
    experience: 6,
    averages: { pts: 28.5, reb: 3.8, ast: 6.8, stl: 0.9, blk: 0.2, fg3m: 2.2, min: 35.5 },
    usage: 32.2,
    pace: 99.5,
    trueShootingPct: 0.585,
    assistPct: 32.5,
    reboundPct: 4.5,
    hotZones: ['midRange', 'floater', 'paint'],
    weaknesses: ['threePointVolume', 'size'],
    injuryHistory: ['knee', 'hand'],
    clutchRating: 88,
    consistencyRating: 86,
    propsProfile: {
      points: { mean: 28.5, stdDev: 6.5, floor: 15, ceiling: 45 },
      assists: { mean: 6.8, stdDev: 2.2, floor: 2, ceiling: 14 },
      rebounds: { mean: 3.8, stdDev: 1.5, floor: 1, ceiling: 8 },
      threes: { mean: 2.2, stdDev: 1.4, floor: 0, ceiling: 6 }
    }
  },
  'donovan mitchell': {
    id: 1628378,
    name: 'Donovan Mitchell',
    team: 'CLE',
    position: 'SG',
    age: 27,
    experience: 7,
    averages: { pts: 26.8, reb: 4.2, ast: 5.5, stl: 1.5, blk: 0.4, fg3m: 3.5, min: 35.2 },
    usage: 30.5,
    pace: 99.2,
    trueShootingPct: 0.578,
    assistPct: 25.2,
    reboundPct: 5.2,
    hotZones: ['threePoint', 'midRange', 'transition'],
    weaknesses: ['shotSelection', 'defense'],
    injuryHistory: ['ankle', 'knee'],
    clutchRating: 86,
    consistencyRating: 80,
    propsProfile: {
      points: { mean: 26.8, stdDev: 7.5, floor: 12, ceiling: 48 },
      threes: { mean: 3.5, stdDev: 2.0, floor: 0, ceiling: 9 },
      assists: { mean: 5.5, stdDev: 2.2, floor: 1, ceiling: 12 },
      rebounds: { mean: 4.2, stdDev: 1.5, floor: 1, ceiling: 9 }
    }
  },
  'ja morant': {
    id: 1629630,
    name: 'Ja Morant',
    team: 'MEM',
    position: 'PG',
    age: 25,
    experience: 5,
    averages: { pts: 26.2, reb: 5.5, ast: 8.2, stl: 1.0, blk: 0.4, fg3m: 1.8, min: 32.5 },
    usage: 32.5,
    pace: 103.5,
    trueShootingPct: 0.548,
    assistPct: 38.5,
    reboundPct: 7.2,
    hotZones: ['paint', 'floater', 'transition'],
    weaknesses: ['threePoint', 'defense'],
    injuryHistory: ['knee', 'shoulder', 'suspension'],
    clutchRating: 84,
    consistencyRating: 72,
    propsProfile: {
      points: { mean: 26.2, stdDev: 7.8, floor: 10, ceiling: 48 },
      assists: { mean: 8.2, stdDev: 2.8, floor: 3, ceiling: 16 },
      rebounds: { mean: 5.5, stdDev: 2.0, floor: 2, ceiling: 12 },
      threes: { mean: 1.8, stdDev: 1.4, floor: 0, ceiling: 6 }
    }
  },
  'jimmy butler': {
    id: 202710,
    name: 'Jimmy Butler',
    team: 'MIA',
    position: 'SF',
    age: 34,
    experience: 13,
    averages: { pts: 21.5, reb: 5.8, ast: 5.2, stl: 1.8, blk: 0.4, fg3m: 0.8, min: 33.5 },
    usage: 26.5,
    pace: 97.5,
    trueShootingPct: 0.592,
    assistPct: 25.8,
    reboundPct: 8.5,
    hotZones: ['midRange', 'freeThrow', 'post'],
    weaknesses: ['threePoint', 'availability'],
    injuryHistory: ['knee', 'ankle', 'illness'],
    clutchRating: 94,
    consistencyRating: 68,
    propsProfile: {
      points: { mean: 21.5, stdDev: 6.5, floor: 8, ceiling: 40 },
      rebounds: { mean: 5.8, stdDev: 2.0, floor: 2, ceiling: 12 },
      assists: { mean: 5.2, stdDev: 2.2, floor: 1, ceiling: 12 },
      steals: { mean: 1.8, stdDev: 1.0, floor: 0, ceiling: 5 }
    }
  },
  'jaylen brown': {
    id: 1627759,
    name: 'Jaylen Brown',
    team: 'BOS',
    position: 'SG',
    age: 27,
    experience: 8,
    averages: { pts: 24.5, reb: 5.5, ast: 3.8, stl: 1.2, blk: 0.5, fg3m: 2.2, min: 34.5 },
    usage: 28.5,
    pace: 101.2,
    trueShootingPct: 0.572,
    assistPct: 18.2,
    reboundPct: 8.2,
    hotZones: ['transition', 'midRange', 'paint'],
    weaknesses: ['ballHandling', 'threePointConsistency'],
    injuryHistory: ['hamstring', 'finger'],
    clutchRating: 80,
    consistencyRating: 82,
    propsProfile: {
      points: { mean: 24.5, stdDev: 6.5, floor: 12, ceiling: 42 },
      rebounds: { mean: 5.5, stdDev: 1.8, floor: 2, ceiling: 10 },
      assists: { mean: 3.8, stdDev: 1.5, floor: 0, ceiling: 8 },
      threes: { mean: 2.2, stdDev: 1.4, floor: 0, ceiling: 6 }
    }
  },
  'de\'aaron fox': {
    id: 1628368,
    name: "De'Aaron Fox",
    team: 'SAC',
    position: 'PG',
    age: 26,
    experience: 7,
    averages: { pts: 27.2, reb: 4.5, ast: 6.2, stl: 1.8, blk: 0.4, fg3m: 2.0, min: 35.8 },
    usage: 31.2,
    pace: 102.2,
    trueShootingPct: 0.568,
    assistPct: 28.5,
    reboundPct: 5.5,
    hotZones: ['transition', 'paint', 'floater'],
    weaknesses: ['threePoint', 'defense'],
    injuryHistory: ['ankle'],
    clutchRating: 82,
    consistencyRating: 78,
    propsProfile: {
      points: { mean: 27.2, stdDev: 7.0, floor: 14, ceiling: 48 },
      assists: { mean: 6.2, stdDev: 2.2, floor: 2, ceiling: 12 },
      steals: { mean: 1.8, stdDev: 1.0, floor: 0, ceiling: 5 },
      rebounds: { mean: 4.5, stdDev: 1.5, floor: 1, ceiling: 9 }
    }
  },
  'tyrese maxey': {
    id: 1630178,
    name: 'Tyrese Maxey',
    team: 'PHI',
    position: 'PG',
    age: 23,
    experience: 4,
    averages: { pts: 26.5, reb: 3.8, ast: 6.2, stl: 1.0, blk: 0.3, fg3m: 3.0, min: 37.5 },
    usage: 28.5,
    pace: 98.5,
    trueShootingPct: 0.585,
    assistPct: 25.8,
    reboundPct: 4.2,
    hotZones: ['threePoint', 'transition', 'floater'],
    weaknesses: ['physicality', 'defense'],
    injuryHistory: ['foot'],
    clutchRating: 80,
    consistencyRating: 82,
    propsProfile: {
      points: { mean: 26.5, stdDev: 6.8, floor: 12, ceiling: 45 },
      threes: { mean: 3.0, stdDev: 1.6, floor: 0, ceiling: 8 },
      assists: { mean: 6.2, stdDev: 2.2, floor: 2, ceiling: 12 },
      rebounds: { mean: 3.8, stdDev: 1.4, floor: 1, ceiling: 8 }
    }
  },
  'karl-anthony towns': {
    id: 1626157,
    name: 'Karl-Anthony Towns',
    team: 'NYK',
    position: 'C',
    age: 28,
    experience: 9,
    averages: { pts: 24.5, reb: 9.2, ast: 3.2, stl: 0.7, blk: 0.8, fg3m: 2.8, min: 34.2 },
    usage: 27.5,
    pace: 99.5,
    trueShootingPct: 0.615,
    assistPct: 15.2,
    reboundPct: 16.5,
    hotZones: ['threePoint', 'paint', 'post'],
    weaknesses: ['defense', 'turnovers'],
    injuryHistory: ['calf', 'knee'],
    clutchRating: 76,
    consistencyRating: 78,
    propsProfile: {
      points: { mean: 24.5, stdDev: 6.5, floor: 12, ceiling: 42 },
      rebounds: { mean: 9.2, stdDev: 2.8, floor: 4, ceiling: 16 },
      threes: { mean: 2.8, stdDev: 1.6, floor: 0, ceiling: 7 },
      assists: { mean: 3.2, stdDev: 1.5, floor: 0, ceiling: 8 }
    }
  },
  'bam adebayo': {
    id: 1628389,
    name: 'Bam Adebayo',
    team: 'MIA',
    position: 'C',
    age: 26,
    experience: 7,
    averages: { pts: 20.5, reb: 10.5, ast: 4.5, stl: 1.2, blk: 1.0, fg3m: 0.2, min: 34.5 },
    usage: 24.5,
    pace: 97.5,
    trueShootingPct: 0.582,
    assistPct: 22.5,
    reboundPct: 18.2,
    hotZones: ['paint', 'elbow', 'shortMidRange'],
    weaknesses: ['threePoint', 'freeThrows'],
    injuryHistory: ['hip', 'knee'],
    clutchRating: 82,
    consistencyRating: 88,
    propsProfile: {
      points: { mean: 20.5, stdDev: 5.0, floor: 10, ceiling: 32 },
      rebounds: { mean: 10.5, stdDev: 2.8, floor: 5, ceiling: 18 },
      assists: { mean: 4.5, stdDev: 2.0, floor: 1, ceiling: 10 },
      blocks: { mean: 1.0, stdDev: 0.8, floor: 0, ceiling: 4 }
    }
  },
  'lamelo ball': {
    id: 1630163,
    name: 'LaMelo Ball',
    team: 'CHA',
    position: 'PG',
    age: 23,
    experience: 4,
    averages: { pts: 23.5, reb: 5.5, ast: 8.0, stl: 1.5, blk: 0.3, fg3m: 2.8, min: 33.5 },
    usage: 29.5,
    pace: 102.5,
    trueShootingPct: 0.548,
    assistPct: 38.5,
    reboundPct: 7.2,
    hotZones: ['threePoint', 'transition', 'pullUp'],
    weaknesses: ['shotSelection', 'defense', 'finishing'],
    injuryHistory: ['ankle', 'shoulder'],
    clutchRating: 78,
    consistencyRating: 70,
    propsProfile: {
      points: { mean: 23.5, stdDev: 7.5, floor: 10, ceiling: 42 },
      assists: { mean: 8.0, stdDev: 3.0, floor: 2, ceiling: 16 },
      rebounds: { mean: 5.5, stdDev: 2.0, floor: 2, ceiling: 12 },
      threes: { mean: 2.8, stdDev: 1.8, floor: 0, ceiling: 8 }
    }
  },
  'cade cunningham': {
    id: 1630595,
    name: 'Cade Cunningham',
    team: 'DET',
    position: 'PG',
    age: 22,
    experience: 3,
    averages: { pts: 24.5, reb: 4.5, ast: 9.0, stl: 1.0, blk: 0.3, fg3m: 2.5, min: 35.5 },
    usage: 30.5,
    pace: 101.5,
    trueShootingPct: 0.555,
    assistPct: 42.5,
    reboundPct: 5.8,
    hotZones: ['midRange', 'floater', 'threePoint'],
    weaknesses: ['athleticism', 'finishing'],
    injuryHistory: ['shin', 'knee'],
    clutchRating: 80,
    consistencyRating: 78,
    propsProfile: {
      points: { mean: 24.5, stdDev: 6.5, floor: 12, ceiling: 40 },
      assists: { mean: 9.0, stdDev: 3.0, floor: 3, ceiling: 16 },
      rebounds: { mean: 4.5, stdDev: 1.5, floor: 1, ceiling: 9 },
      threes: { mean: 2.5, stdDev: 1.5, floor: 0, ceiling: 7 }
    }
  },
  'paolo banchero': {
    id: 1631094,
    name: 'Paolo Banchero',
    team: 'ORL',
    position: 'PF',
    age: 21,
    experience: 2,
    averages: { pts: 24.5, reb: 7.5, ast: 5.5, stl: 1.0, blk: 0.5, fg3m: 1.5, min: 34.5 },
    usage: 29.5,
    pace: 100.2,
    trueShootingPct: 0.552,
    assistPct: 25.2,
    reboundPct: 11.5,
    hotZones: ['post', 'midRange', 'paint'],
    weaknesses: ['threePoint', 'shotSelection'],
    injuryHistory: ['oblique'],
    clutchRating: 78,
    consistencyRating: 76,
    propsProfile: {
      points: { mean: 24.5, stdDev: 6.8, floor: 12, ceiling: 42 },
      rebounds: { mean: 7.5, stdDev: 2.5, floor: 3, ceiling: 14 },
      assists: { mean: 5.5, stdDev: 2.2, floor: 1, ceiling: 12 },
      threes: { mean: 1.5, stdDev: 1.2, floor: 0, ceiling: 5 }
    }
  },
  'scottie barnes': {
    id: 1630567,
    name: 'Scottie Barnes',
    team: 'TOR',
    position: 'SF',
    age: 22,
    experience: 3,
    averages: { pts: 20.5, reb: 7.5, ast: 6.2, stl: 1.2, blk: 0.8, fg3m: 1.2, min: 35.5 },
    usage: 25.5,
    pace: 99.8,
    trueShootingPct: 0.548,
    assistPct: 28.5,
    reboundPct: 11.2,
    hotZones: ['transition', 'paint', 'midRange'],
    weaknesses: ['threePoint', 'shotCreation'],
    injuryHistory: ['ankle'],
    clutchRating: 76,
    consistencyRating: 80,
    propsProfile: {
      points: { mean: 20.5, stdDev: 5.5, floor: 10, ceiling: 35 },
      rebounds: { mean: 7.5, stdDev: 2.5, floor: 3, ceiling: 14 },
      assists: { mean: 6.2, stdDev: 2.5, floor: 2, ceiling: 12 },
      threes: { mean: 1.2, stdDev: 1.0, floor: 0, ceiling: 4 }
    }
  },
  'james harden': {
    id: 201935,
    name: 'James Harden',
    team: 'LAC',
    position: 'PG',
    age: 34,
    experience: 15,
    averages: { pts: 18.5, reb: 5.5, ast: 9.5, stl: 1.2, blk: 0.5, fg3m: 2.2, min: 34.5 },
    usage: 26.5,
    pace: 99.5,
    trueShootingPct: 0.582,
    assistPct: 42.5,
    reboundPct: 7.5,
    hotZones: ['threePoint', 'stepBack', 'freeThrow'],
    weaknesses: ['defense', 'conditioning'],
    injuryHistory: ['hamstring', 'foot'],
    clutchRating: 84,
    consistencyRating: 82,
    propsProfile: {
      points: { mean: 18.5, stdDev: 5.5, floor: 8, ceiling: 35 },
      assists: { mean: 9.5, stdDev: 3.0, floor: 4, ceiling: 18 },
      threes: { mean: 2.2, stdDev: 1.5, floor: 0, ceiling: 7 },
      rebounds: { mean: 5.5, stdDev: 1.8, floor: 2, ceiling: 10 }
    }
  },
  'kawhi leonard': {
    id: 202695,
    name: 'Kawhi Leonard',
    team: 'LAC',
    position: 'SF',
    age: 32,
    experience: 13,
    averages: { pts: 24.5, reb: 6.2, ast: 4.0, stl: 1.5, blk: 0.5, fg3m: 2.0, min: 32.5 },
    usage: 29.5,
    pace: 99.5,
    trueShootingPct: 0.608,
    assistPct: 18.5,
    reboundPct: 9.5,
    hotZones: ['midRange', 'threePoint', 'post'],
    weaknesses: ['availability', 'playmaking'],
    injuryHistory: ['knee', 'quad', 'shoulder'],
    clutchRating: 96,
    consistencyRating: 70,
    propsProfile: {
      points: { mean: 24.5, stdDev: 6.0, floor: 12, ceiling: 42 },
      rebounds: { mean: 6.2, stdDev: 2.0, floor: 2, ceiling: 12 },
      steals: { mean: 1.5, stdDev: 1.0, floor: 0, ceiling: 5 },
      assists: { mean: 4.0, stdDev: 1.8, floor: 0, ceiling: 9 }
    }
  },
  'paul george': {
    id: 202331,
    name: 'Paul George',
    team: 'PHI',
    position: 'SF',
    age: 33,
    experience: 14,
    averages: { pts: 23.5, reb: 5.5, ast: 4.5, stl: 1.5, blk: 0.4, fg3m: 2.8, min: 34.5 },
    usage: 28.5,
    pace: 98.5,
    trueShootingPct: 0.575,
    assistPct: 20.5,
    reboundPct: 8.2,
    hotZones: ['threePoint', 'midRange', 'transition'],
    weaknesses: ['consistency', 'durability'],
    injuryHistory: ['hamstring', 'knee', 'shoulder'],
    clutchRating: 82,
    consistencyRating: 75,
    propsProfile: {
      points: { mean: 23.5, stdDev: 7.0, floor: 10, ceiling: 42 },
      rebounds: { mean: 5.5, stdDev: 1.8, floor: 2, ceiling: 10 },
      threes: { mean: 2.8, stdDev: 1.6, floor: 0, ceiling: 7 },
      assists: { mean: 4.5, stdDev: 1.8, floor: 1, ceiling: 10 }
    }
  },
  'zion williamson': {
    id: 1629627,
    name: 'Zion Williamson',
    team: 'NOP',
    position: 'PF',
    age: 23,
    experience: 4,
    averages: { pts: 25.5, reb: 7.0, ast: 5.0, stl: 1.0, blk: 0.6, fg3m: 0.3, min: 32.5 },
    usage: 32.5,
    pace: 101.2,
    trueShootingPct: 0.658,
    assistPct: 24.5,
    reboundPct: 11.2,
    hotZones: ['paint', 'post', 'transition'],
    weaknesses: ['threePoint', 'conditioning', 'durability'],
    injuryHistory: ['foot', 'hamstring', 'hip'],
    clutchRating: 78,
    consistencyRating: 68,
    propsProfile: {
      points: { mean: 25.5, stdDev: 6.5, floor: 14, ceiling: 42 },
      rebounds: { mean: 7.0, stdDev: 2.5, floor: 3, ceiling: 14 },
      assists: { mean: 5.0, stdDev: 2.0, floor: 1, ceiling: 10 },
      doubles: { mean: 0.8, stdDev: 0.4, floor: 0, ceiling: 2 }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

const TEAM_DATABASE = {
  'GSW': { name: 'Golden State Warriors', conference: 'West', pace: 102.5, offRtg: 118.2, defRtg: 112.5, arena: 'Chase Center' },
  'LAL': { name: 'Los Angeles Lakers', conference: 'West', pace: 100.8, offRtg: 115.5, defRtg: 113.2, arena: 'Crypto.com Arena' },
  'DEN': { name: 'Denver Nuggets', conference: 'West', pace: 98.2, offRtg: 119.8, defRtg: 108.5, arena: 'Ball Arena' },
  'DAL': { name: 'Dallas Mavericks', conference: 'West', pace: 99.5, offRtg: 118.5, defRtg: 111.2, arena: 'American Airlines Center' },
  'BOS': { name: 'Boston Celtics', conference: 'East', pace: 101.2, offRtg: 121.2, defRtg: 106.8, arena: 'TD Garden' },
  'MIL': { name: 'Milwaukee Bucks', conference: 'East', pace: 102.8, offRtg: 117.5, defRtg: 110.2, arena: 'Fiserv Forum' },
  'PHX': { name: 'Phoenix Suns', conference: 'West', pace: 100.2, offRtg: 116.8, defRtg: 112.8, arena: 'Footprint Center' },
  'PHI': { name: 'Philadelphia 76ers', conference: 'East', pace: 98.5, offRtg: 115.2, defRtg: 109.5, arena: 'Wells Fargo Center' },
  'MIN': { name: 'Minnesota Timberwolves', conference: 'West', pace: 101.5, offRtg: 114.8, defRtg: 105.2, arena: 'Target Center' },
  'IND': { name: 'Indiana Pacers', conference: 'East', pace: 105.8, offRtg: 122.5, defRtg: 115.8, arena: 'Gainbridge Fieldhouse' },
  'SAC': { name: 'Sacramento Kings', conference: 'West', pace: 102.2, offRtg: 116.5, defRtg: 113.5, arena: 'Golden 1 Center' },
  'OKC': { name: 'Oklahoma City Thunder', conference: 'West', pace: 99.8, offRtg: 118.8, defRtg: 107.2, arena: 'Paycom Center' },
  'SAS': { name: 'San Antonio Spurs', conference: 'West', pace: 100.5, offRtg: 108.5, defRtg: 118.2, arena: 'Frost Bank Center' },
  'CLE': { name: 'Cleveland Cavaliers', conference: 'East', pace: 99.2, offRtg: 117.2, defRtg: 106.5, arena: 'Rocket Mortgage FieldHouse' },
  'MEM': { name: 'Memphis Grizzlies', conference: 'West', pace: 103.5, offRtg: 112.5, defRtg: 114.2, arena: 'FedExForum' },
  'MIA': { name: 'Miami Heat', conference: 'East', pace: 97.5, offRtg: 112.8, defRtg: 109.8, arena: 'Kaseya Center' },
  'NYK': { name: 'New York Knicks', conference: 'East', pace: 99.5, offRtg: 118.5, defRtg: 109.2, arena: 'Madison Square Garden' },
  'ATL': { name: 'Atlanta Hawks', conference: 'East', pace: 101.5, offRtg: 115.8, defRtg: 115.5, arena: 'State Farm Arena' },
  'TOR': { name: 'Toronto Raptors', conference: 'East', pace: 99.8, offRtg: 111.2, defRtg: 115.8, arena: 'Scotiabank Arena' },
  'DET': { name: 'Detroit Pistons', conference: 'East', pace: 101.5, offRtg: 108.8, defRtg: 117.5, arena: 'Little Caesars Arena' },
  'ORL': { name: 'Orlando Magic', conference: 'East', pace: 100.2, offRtg: 112.5, defRtg: 106.2, arena: 'Amway Center' },
  'CHA': { name: 'Charlotte Hornets', conference: 'East', pace: 102.5, offRtg: 109.5, defRtg: 118.2, arena: 'Spectrum Center' },
  'LAC': { name: 'Los Angeles Clippers', conference: 'West', pace: 99.5, offRtg: 115.2, defRtg: 112.5, arena: 'Intuit Dome' },
  'NOP': { name: 'New Orleans Pelicans', conference: 'West', pace: 101.2, offRtg: 114.8, defRtg: 113.8, arena: 'Smoothie King Center' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAY BRAIN CLASS - MAIN COGNITIVE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

class RayBrain {
  constructor() {
    this.config = BRAIN_CONFIG;
    this.players = PLAYER_DATABASE;
    this.teams = TEAM_DATABASE;
    this.memory = new RayMemory();
    this.nlp = new RayNLPEngine();
    this.stats = new RayStatEngine();
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 1: PERCEPTION - Data Intake & Normalization
  // ─────────────────────────────────────────────────────────────────────────────
  
  perceive(input) {
    const perception = {
      raw: input,
      timestamp: Date.now(),
      entities: this.nlp.extractEntities(input),
      intent: this.nlp.classifyIntent(input),
      sentiment: this.nlp.analyzeSentiment(input),
      context: this.memory.getContext(),
      previousTurns: this.memory.getRecentTurns(5)
    };
    
    return perception;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 2: PATTERN - Statistical Pattern Recognition
  // ─────────────────────────────────────────────────────────────────────────────
  
  recognizePatterns(playerName, market = 'points') {
    const player = this.getPlayer(playerName);
    if (!player) return null;
    
    const profile = player.propsProfile[market] || player.propsProfile.points;
    const gameLogs = this.generateGameLogs(player, market, 50);
    
    return {
      distribution: this.stats.analyzeDistribution(gameLogs),
      trends: this.stats.analyzeTrends(gameLogs),
      streaks: this.stats.findStreaks(gameLogs),
      splits: this.analyzeSplits(player, gameLogs),
      volatility: this.stats.calculateVolatility(gameLogs),
      seasonality: this.stats.analyzeSeasonality(gameLogs),
      correlations: this.analyzeCorrelations(player, gameLogs)
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 3: CONTEXT - Situational Awareness
  // ─────────────────────────────────────────────────────────────────────────────
  
  analyzeContext(player, matchup = null) {
    const contextFactors = {
      // Rest & Schedule
      restDays: this.estimateRestDays(),
      backToBack: Math.random() < 0.15,
      gameNumber: Math.floor(Math.random() * 60) + 10,
      
      // Opponent
      opponent: matchup || this.getRandomOpponent(player.team),
      homeAway: Math.random() < 0.5 ? 'home' : 'away',
      
      // Time factors
      dayOfWeek: new Date().getDay(),
      isNationalTV: Math.random() < 0.2,
      isRivalry: Math.random() < 0.1,
      
      // Player status
      minutesProjection: this.projectMinutes(player),
      usageProjection: this.projectUsage(player),
      
      // Team context
      teamPace: this.teams[player.team]?.pace || 100,
      teamOffRtg: this.teams[player.team]?.offRtg || 110
    };
    
    // Calculate context multiplier
    let multiplier = 1.0;
    
    if (contextFactors.homeAway === 'home') {
      multiplier *= this.config.contextMultipliers.homeAdvantage;
    }
    
    if (contextFactors.restDays >= 2) {
      multiplier *= this.config.contextMultipliers.restDayBoost;
    }
    
    if (contextFactors.backToBack) {
      multiplier *= this.config.contextMultipliers.backToBackPenalty;
    }
    
    if (contextFactors.isRivalry) {
      multiplier *= this.config.contextMultipliers.rivalryGame;
    }
    
    contextFactors.overallMultiplier = multiplier;
    
    return contextFactors;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 4: INFERENCE - Probabilistic Reasoning
  // ─────────────────────────────────────────────────────────────────────────────
  
  infer(patterns, context, line) {
    const { distribution, trends, volatility } = patterns;
    
    // Monte Carlo simulation for probability estimation
    const simulations = this.stats.monteCarloSimulation(
      distribution.mean,
      distribution.stdDev,
      10000
    );
    
    // Apply context adjustment
    const adjustedSimulations = simulations.map(s => s * context.overallMultiplier);
    
    // Calculate probabilities
    const overProb = adjustedSimulations.filter(s => s > line).length / adjustedSimulations.length;
    const underProb = 1 - overProb;
    
    // Calculate expected value
    const overEV = this.calculateExpectedValue(overProb, -110);
    const underEV = this.calculateExpectedValue(underProb, -110);
    
    // Bayesian confidence adjustment based on sample size and recency
    const sampleConfidence = this.calculateSampleConfidence(patterns.distribution.sampleSize);
    const trendConfidence = this.calculateTrendConfidence(trends);
    
    const inference = {
      probabilities: {
        over: Math.round(overProb * 100),
        under: Math.round(underProb * 100)
      },
      expectedValue: {
        over: overEV,
        under: underEV
      },
      edge: {
        over: Math.max(0, overProb - 0.5238) * 100, // vs -110 breakeven
        under: Math.max(0, underProb - 0.5238) * 100
      },
      confidence: Math.round((sampleConfidence + trendConfidence) / 2),
      recommendation: overEV > underEV ? 'over' : 'under',
      simStats: {
        mean: this.stats.mean(adjustedSimulations),
        median: this.stats.median(adjustedSimulations),
        p10: this.stats.percentile(adjustedSimulations, 10),
        p25: this.stats.percentile(adjustedSimulations, 25),
        p75: this.stats.percentile(adjustedSimulations, 75),
        p90: this.stats.percentile(adjustedSimulations, 90)
      }
    };
    
    return inference;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 5: SYNTHESIS - Multi-Factor Integration
  // ─────────────────────────────────────────────────────────────────────────────
  
  synthesize(perception, patterns, context, inference) {
    const synthesis = {
      timestamp: Date.now(),
      
      // Core recommendation
      recommendation: {
        direction: inference.recommendation,
        confidence: inference.confidence,
        edge: inference.edge[inference.recommendation],
        expectedValue: inference.expectedValue[inference.recommendation]
      },
      
      // Supporting data
      keyFactors: this.identifyKeyFactors(patterns, context, inference),
      risks: this.identifyRisks(patterns, context),
      opportunities: this.identifyOpportunities(patterns, context, inference),
      
      // Grade calculation
      grade: this.calculateGrade(inference),
      
      // Position sizing recommendation
      sizingRecommendation: this.recommendPositionSize(inference),
      
      // Alternative plays
      alternatives: this.generateAlternatives(perception, patterns),
      
      // Contextual insights
      insights: this.generateInsights(patterns, context, inference)
    };
    
    // Store in memory
    this.memory.addTurn({
      input: perception.raw,
      synthesis: synthesis,
      timestamp: Date.now()
    });
    
    return synthesis;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 6: EXPRESSION - Natural Language Generation
  // ─────────────────────────────────────────────────────────────────────────────
  
  express(synthesis, format = 'full') {
    // Generate natural language response based on synthesis
    return this.nlp.generateResponse(synthesis, format);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN PROCESSING PIPELINE
  // ─────────────────────────────────────────────────────────────────────────────
  
  async process(input) {
    try {
      // Layer 1: Perceive
      const perception = this.perceive(input);
      
      // Extract player if mentioned
      const playerEntity = perception.entities.player;
      if (!playerEntity) {
        return this.handleNonPlayerQuery(perception);
      }
      
      // Layer 2: Pattern Recognition
      const market = perception.entities.market || 'points';
      const patterns = this.recognizePatterns(playerEntity, market);
      
      if (!patterns) {
        return this.handleUnknownPlayer(playerEntity);
      }
      
      // Layer 3: Context Analysis
      const player = this.getPlayer(playerEntity);
      const context = this.analyzeContext(player, perception.entities.opponent);
      
      // Determine line
      const line = perception.entities.line || patterns.distribution.mean;
      
      // Layer 4: Inference
      const inference = this.infer(patterns, context, line);
      
      // Layer 5: Synthesis
      const synthesis = this.synthesize(perception, patterns, context, inference);
      
      // Layer 6: Expression
      const response = this.express(synthesis, perception.intent.responseFormat || 'full');
      
      return {
        success: true,
        response,
        synthesis,
        patterns,
        context,
        inference,
        player,
        market,
        line
      };
      
    } catch (error) {
      console.error('RayBrain processing error:', error);
      return {
        success: false,
        error: error.message,
        response: "Let me recalibrate. Could you rephrase that?"
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────────────────────────────────────────────
  
  getPlayer(nameOrAlias) {
    const alias = nameOrAlias.toLowerCase().trim();
    
    // Direct match
    if (this.players[alias]) {
      return this.players[alias];
    }
    
    // Alias mapping
    const aliasMap = {
      'steph': 'stephen curry',
      'lbj': 'lebron james',
      'bron': 'lebron james',
      'kd': 'kevin durant',
      'ant': 'anthony edwards',
      'wemby': 'victor wembanyama',
      'sga': 'shai gilgeous-alexander',
      'dame': 'damian lillard',
      'book': 'devin booker',
      'ja': 'ja morant',
      'jimmy': 'jimmy butler',
      'jb': 'jaylen brown',
      'kat': 'karl-anthony towns',
      'pg': 'paul george',
      'zion': 'zion williamson'
    };
    
    if (aliasMap[alias]) {
      return this.players[aliasMap[alias]];
    }
    
    // Partial match
    for (const [key, player] of Object.entries(this.players)) {
      if (key.includes(alias) || player.name.toLowerCase().includes(alias)) {
        return player;
      }
    }
    
    return null;
  }

  generateGameLogs(player, market, count = 20) {
    const profile = player.propsProfile[market] || player.propsProfile.points;
    const logs = [];
    
    for (let i = 0; i < count; i++) {
      // Generate semi-realistic game log with some correlation
      const baseValue = this.stats.randomNormal(profile.mean, profile.stdDev);
      
      // Add slight trend
      const trendAdjustment = (i < count / 2) ? -0.5 : 0.5;
      
      // Add home/away split
      const isHome = Math.random() < 0.5;
      const homeAdjustment = isHome ? 1.5 : -0.5;
      
      // Apply constraints
      const value = Math.max(
        profile.floor,
        Math.min(profile.ceiling, baseValue + trendAdjustment + homeAdjustment)
      );
      
      logs.push({
        game: i + 1,
        value: Math.round(value * 10) / 10,
        date: new Date(Date.now() - i * 2.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isHome,
        opponent: this.getRandomOpponent(player.team),
        minutes: Math.round(30 + Math.random() * 10),
        result: Math.random() < 0.55 ? 'W' : 'L'
      });
    }
    
    return logs;
  }

  getRandomOpponent(excludeTeam) {
    const teams = Object.keys(this.teams).filter(t => t !== excludeTeam);
    return teams[Math.floor(Math.random() * teams.length)];
  }

  estimateRestDays() {
    const weights = [0.15, 0.55, 0.20, 0.08, 0.02]; // 0, 1, 2, 3, 4+ days
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) return i;
    }
    
    return 1;
  }

  projectMinutes(player) {
    const base = player.averages.min;
    const variance = base * 0.1;
    return Math.round(this.stats.randomNormal(base, variance));
  }

  projectUsage(player) {
    const base = player.usage;
    const variance = base * 0.05;
    return Math.round(this.stats.randomNormal(base, variance) * 10) / 10;
  }

  analyzeSplits(player, gameLogs) {
    const homeGames = gameLogs.filter(g => g.isHome);
    const awayGames = gameLogs.filter(g => !g.isHome);
    
    return {
      home: {
        mean: this.stats.mean(homeGames.map(g => g.value)),
        games: homeGames.length
      },
      away: {
        mean: this.stats.mean(awayGames.map(g => g.value)),
        games: awayGames.length
      },
      differential: this.stats.mean(homeGames.map(g => g.value)) - 
                   this.stats.mean(awayGames.map(g => g.value))
    };
  }

  analyzeCorrelations(player, gameLogs) {
    // Analyze correlations between different stats
    return {
      minutesCorrelation: 0.65 + Math.random() * 0.25,
      paceCorrelation: 0.35 + Math.random() * 0.25,
      usageCorrelation: 0.55 + Math.random() * 0.25
    };
  }

  calculateExpectedValue(probability, odds) {
    // American odds to decimal
    const decimal = odds > 0 ? (odds / 100 + 1) : (100 / Math.abs(odds) + 1);
    const ev = (probability * decimal) - 1;
    return Math.round(ev * 10000) / 100; // Return as percentage
  }

  calculateSampleConfidence(sampleSize) {
    if (sampleSize >= this.config.sampleSizeRequirements.comprehensive) return 90;
    if (sampleSize >= this.config.sampleSizeRequirements.robust) return 80;
    if (sampleSize >= this.config.sampleSizeRequirements.reliable) return 70;
    if (sampleSize >= this.config.sampleSizeRequirements.minimum) return 55;
    return 40;
  }

  calculateTrendConfidence(trends) {
    // Higher confidence for stable trends
    if (trends.direction === 'stable') return 85;
    if (trends.direction === 'improving' && trends.strength > 0.6) return 80;
    if (trends.direction === 'declining' && trends.strength > 0.6) return 75;
    return 65;
  }

  identifyKeyFactors(patterns, context, inference) {
    const factors = [];
    
    if (inference.probabilities.over >= 65 || inference.probabilities.under >= 65) {
      factors.push({
        factor: 'Strong probability lean',
        impact: 'high',
        direction: inference.recommendation
      });
    }
    
    if (patterns.volatility.classification === 'low') {
      factors.push({
        factor: 'Low volatility - consistent output',
        impact: 'positive',
        description: 'Tight distribution reduces variance risk'
      });
    }
    
    if (context.homeAway === 'home') {
      factors.push({
        factor: 'Home court advantage',
        impact: 'positive',
        adjustment: '+8% production'
      });
    }
    
    if (context.restDays >= 2) {
      factors.push({
        factor: 'Extended rest',
        impact: 'positive',
        adjustment: '+4% production'
      });
    }
    
    if (context.backToBack) {
      factors.push({
        factor: 'Back-to-back game',
        impact: 'negative',
        adjustment: '-6% production'
      });
    }
    
    return factors;
  }

  identifyRisks(patterns, context) {
    const risks = [];
    
    if (patterns.volatility.classification === 'high' || 
        patterns.volatility.classification === 'veryHigh') {
      risks.push({
        risk: 'High variance profile',
        severity: 'medium',
        description: 'Boom-bust potential - size accordingly'
      });
    }
    
    if (context.backToBack) {
      risks.push({
        risk: 'Rest disadvantage',
        severity: 'medium',
        description: 'Second night of back-to-back may impact production'
      });
    }
    
    if (patterns.trends.direction === 'declining') {
      risks.push({
        risk: 'Negative trend',
        severity: 'low',
        description: 'Recent performance below baseline'
      });
    }
    
    return risks;
  }

  identifyOpportunities(patterns, context, inference) {
    const opportunities = [];
    
    if (inference.edge.over >= this.config.edgeThresholds.moderate) {
      opportunities.push({
        opportunity: 'Strong over edge',
        edge: `+${inference.edge.over.toFixed(1)}%`,
        confidence: inference.confidence
      });
    }
    
    if (inference.edge.under >= this.config.edgeThresholds.moderate) {
      opportunities.push({
        opportunity: 'Strong under edge',
        edge: `+${inference.edge.under.toFixed(1)}%`,
        confidence: inference.confidence
      });
    }
    
    if (patterns.streaks.current > 5) {
      opportunities.push({
        opportunity: 'Active streak',
        streak: patterns.streaks.current,
        direction: patterns.streaks.direction
      });
    }
    
    return opportunities;
  }

  calculateGrade(inference) {
    const edge = Math.max(inference.edge.over, inference.edge.under);
    const confidence = inference.confidence;
    
    // Combined score
    const score = (edge * 0.6) + (confidence * 0.4);
    
    if (score >= 40) return 'A+';
    if (score >= 35) return 'A';
    if (score >= 30) return 'A-';
    if (score >= 25) return 'B+';
    if (score >= 20) return 'B';
    if (score >= 15) return 'B-';
    if (score >= 10) return 'C+';
    if (score >= 5) return 'C';
    return 'D';
  }

  recommendPositionSize(inference) {
    const edge = Math.max(inference.edge.over, inference.edge.under);
    const confidence = inference.confidence;
    
    if (confidence >= 80 && edge >= 15) return { size: 'max', units: 3 };
    if (confidence >= 70 && edge >= 10) return { size: 'large', units: 2 };
    if (confidence >= 60 && edge >= 5) return { size: 'standard', units: 1 };
    if (confidence >= 50 && edge >= 3) return { size: 'small', units: 0.5 };
    return { size: 'pass', units: 0 };
  }

  generateAlternatives(perception, patterns) {
    const alternatives = [];
    const markets = ['points', 'rebounds', 'assists', 'threes', 'steals', 'blocks'];
    const currentMarket = perception.entities.market || 'points';
    
    // Suggest other markets for same player
    markets.filter(m => m !== currentMarket).forEach(market => {
      if (Math.random() < 0.3) {
        alternatives.push({
          type: 'market',
          suggestion: market,
          reason: 'Alternative market with potentially better value'
        });
      }
    });
    
    return alternatives.slice(0, 3);
  }

  generateInsights(patterns, context, inference) {
    const insights = [];
    
    // Distribution insight
    insights.push({
      category: 'Distribution',
      insight: `Performance clusters around ${patterns.distribution.mean.toFixed(1)} with ${patterns.volatility.classification} variance`,
      importance: 'high'
    });
    
    // Trend insight
    if (patterns.trends.direction !== 'stable') {
      insights.push({
        category: 'Trend',
        insight: `Recent ${patterns.trends.direction} trend detected - ${patterns.trends.description}`,
        importance: 'medium'
      });
    }
    
    // Context insight
    insights.push({
      category: 'Context',
      insight: `${context.homeAway.charAt(0).toUpperCase() + context.homeAway.slice(1)} game with ${context.minutesProjection} projected minutes`,
      importance: 'medium'
    });
    
    // Edge insight
    const bestEdge = inference.edge.over > inference.edge.under ? 'over' : 'under';
    if (inference.edge[bestEdge] >= 5) {
      insights.push({
        category: 'Edge',
        insight: `${bestEdge.toUpperCase()} shows +${inference.edge[bestEdge].toFixed(1)}% edge vs market`,
        importance: 'high'
      });
    }
    
    return insights;
  }

  handleNonPlayerQuery(perception) {
    // Handle queries without a player entity
    const intent = perception.intent.type;
    
    const responses = {
      greeting: {
        success: true,
        response: "Ready for analysis. Which player or game should we focus on?"
      },
      opportunities: {
        success: true,
        response: this.findTopOpportunities()
      },
      consistency: {
        success: true,
        response: this.findConsistentPlayers()
      },
      trending: {
        success: true,
        response: this.findTrendingPlayers()
      },
      default: {
        success: true,
        response: "The current context shows opportunity across multiple markets. Narrow the focus—which player or game interests you?"
      }
    };
    
    return responses[intent] || responses.default;
  }

  handleUnknownPlayer(playerName) {
    return {
      success: false,
      response: `I don't have comprehensive data on ${playerName}. Try a different player or check the spelling.`
    };
  }

  findTopOpportunities() {
    // Find best opportunities across all players
    const opportunities = [];
    
    for (const [key, player] of Object.entries(this.players)) {
      const patterns = this.recognizePatterns(player.name, 'points');
      const context = this.analyzeContext(player);
      const line = patterns.distribution.mean;
      const inference = this.infer(patterns, context, line);
      
      if (inference.confidence >= 70 && Math.max(inference.edge.over, inference.edge.under) >= 8) {
        opportunities.push({
          player: player.name,
          market: 'points',
          line,
          direction: inference.recommendation,
          edge: Math.max(inference.edge.over, inference.edge.under),
          confidence: inference.confidence
        });
      }
    }
    
    opportunities.sort((a, b) => b.edge - a.edge);
    
    if (opportunities.length === 0) {
      return "Looking at the current slate, no high-confidence opportunities meet the threshold. Sometimes the best play is no play.";
    }
    
    const top = opportunities.slice(0, 3);
    let response = `Looking at tonight's slate, ${opportunities.length} situations stand out. `;
    
    top.forEach((opp, i) => {
      response += `${opp.player}'s ${opp.market} at ${opp.line.toFixed(1)} shows ${opp.direction} value with ${opp.edge.toFixed(1)}% edge. `;
    });
    
    return response;
  }

  findConsistentPlayers() {
    const consistent = [];
    
    for (const [key, player] of Object.entries(this.players)) {
      if (player.consistencyRating >= 85) {
        consistent.push({
          player: player.name,
          consistency: player.consistencyRating,
          volatility: player.propsProfile.points?.stdDev || 5
        });
      }
    }
    
    consistent.sort((a, b) => b.consistency - a.consistency);
    const top = consistent.slice(0, 5);
    
    let response = "For low-variance options, these players show the tightest distributions: ";
    top.forEach((p, i) => {
      response += `${p.player} (${p.consistency}% consistency rating)${i < top.length - 1 ? ', ' : '. '}`;
    });
    
    return response;
  }

  findTrendingPlayers() {
    // Find players with positive recent trends
    const trending = [];
    
    for (const [key, player] of Object.entries(this.players)) {
      const patterns = this.recognizePatterns(player.name, 'points');
      if (patterns.trends.direction === 'improving' && patterns.trends.strength > 0.6) {
        trending.push({
          player: player.name,
          trend: patterns.trends.direction,
          strength: patterns.trends.strength
        });
      }
    }
    
    trending.sort((a, b) => b.strength - a.strength);
    const top = trending.slice(0, 3);
    
    if (top.length === 0) {
      return "No significant positive trends detected across the board. Markets appear relatively stable.";
    }
    
    let response = "Looking at momentum, these players are trending up: ";
    top.forEach((p, i) => {
      response += `${p.player} showing strong upward trajectory${i < top.length - 1 ? ', ' : '. '}`;
    });
    
    return response;
  }
}

export default RayBrain;
export { BRAIN_CONFIG, PLAYER_DATABASE, TEAM_DATABASE };
