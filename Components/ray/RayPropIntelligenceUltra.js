// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  💰 RAY PROP INTELLIGENCE v3.0 ULTRA - WORLD'S SMARTEST BETTING BRAIN                                     ║
// ║  ═══════════════════════════════════════════════════════════════════════════════════════════════════════  ║
// ║  📊 Advanced EV • 🎯 Kelly Sizing • 🔥 Sharp Detection • 🎰 Parlay Optimizer • 📈 Correlation Engine      ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

import { PLAYERS_DB } from './RayAnalyticsEngine';
import { EXTENDED_PLAYERS } from './RayEnhancedDatabase';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 LIVE PROP LINES DATABASE (2024-25 Season)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

export const PROP_LINES = {
  // Top 20+ Players with full prop coverage
  "Stephen Curry": {
    pts: { line: 24.5, overOdds: -115, underOdds: -105, books: { DK: 24.5, FD: 24.0, MGM: 24.5 } },
    reb: { line: 4.5, overOdds: -110, underOdds: -110, books: { DK: 4.5, FD: 4.5, MGM: 5.5 } },
    ast: { line: 5.5, overOdds: -120, underOdds: +100, books: { DK: 5.5, FD: 6.5, MGM: 5.5 } },
    threes: { line: 4.5, overOdds: +105, underOdds: -125, books: { DK: 4.5, FD: 4.5, MGM: 4.5 } },
    pra: { line: 34.5, overOdds: -110, underOdds: -110 },
    steals: { line: 0.5, overOdds: -200, underOdds: +165 },
    blk: { line: 0.5, overOdds: +150, underOdds: -180 }
  },
  "LeBron James": {
    pts: { line: 24.5, overOdds: -110, underOdds: -110, books: { DK: 24.5, FD: 25.5, MGM: 24.5 } },
    reb: { line: 7.5, overOdds: -115, underOdds: -105, books: { DK: 7.5, FD: 7.5, MGM: 7.5 } },
    ast: { line: 8.5, overOdds: -110, underOdds: -110, books: { DK: 8.5, FD: 8.5, MGM: 8.5 } },
    pra: { line: 40.5, overOdds: -110, underOdds: -110 },
    threes: { line: 1.5, overOdds: -140, underOdds: +120 },
    steals: { line: 0.5, overOdds: -220, underOdds: +180 }
  },
  "Luka Doncic": {
    pts: { line: 33.5, overOdds: -110, underOdds: -110, books: { DK: 33.5, FD: 34.5, MGM: 33.5 } },
    reb: { line: 8.5, overOdds: -115, underOdds: -105, books: { DK: 8.5, FD: 9.5, MGM: 8.5 } },
    ast: { line: 9.5, overOdds: -110, underOdds: -110, books: { DK: 9.5, FD: 9.5, MGM: 9.5 } },
    pra: { line: 52.5, overOdds: -105, underOdds: -115 },
    threes: { line: 3.5, overOdds: -130, underOdds: +110 }
  },
  "Giannis Antetokounmpo": {
    pts: { line: 31.5, overOdds: -115, underOdds: -105, books: { DK: 31.5, FD: 32.5, MGM: 31.5 } },
    reb: { line: 11.5, overOdds: -110, underOdds: -110, books: { DK: 11.5, FD: 12.5, MGM: 11.5 } },
    ast: { line: 6.5, overOdds: -115, underOdds: -105, books: { DK: 6.5, FD: 6.5, MGM: 6.5 } },
    pra: { line: 50.5, overOdds: -105, underOdds: -115 },
    blk: { line: 1.5, overOdds: -120, underOdds: +100 }
  },
  "Nikola Jokic": {
    pts: { line: 29.5, overOdds: -110, underOdds: -110, books: { DK: 29.5, FD: 30.5, MGM: 29.5 } },
    reb: { line: 13.5, overOdds: -115, underOdds: -105, books: { DK: 13.5, FD: 13.5, MGM: 13.5 } },
    ast: { line: 10.5, overOdds: -110, underOdds: -110, books: { DK: 10.5, FD: 10.5, MGM: 10.5 } },
    pra: { line: 54.5, overOdds: -110, underOdds: -110 },
    threes: { line: 1.5, overOdds: -130, underOdds: +110 }
  },
  "Shai Gilgeous-Alexander": {
    pts: { line: 32.5, overOdds: -115, underOdds: -105, books: { DK: 32.5, FD: 33.5, MGM: 32.5 } },
    reb: { line: 5.5, overOdds: -110, underOdds: -110, books: { DK: 5.5, FD: 5.5, MGM: 5.5 } },
    ast: { line: 6.5, overOdds: -110, underOdds: -110, books: { DK: 6.5, FD: 6.5, MGM: 6.5 } },
    pra: { line: 45.5, overOdds: -110, underOdds: -110 },
    steals: { line: 1.5, overOdds: -140, underOdds: +120 }
  },
  "Jayson Tatum": {
    pts: { line: 27.5, overOdds: -110, underOdds: -110, books: { DK: 27.5, FD: 28.5, MGM: 27.5 } },
    reb: { line: 8.5, overOdds: -105, underOdds: -115, books: { DK: 8.5, FD: 8.5, MGM: 8.5 } },
    ast: { line: 5.5, overOdds: -115, underOdds: -105, books: { DK: 5.5, FD: 5.5, MGM: 5.5 } },
    pra: { line: 41.5, overOdds: -110, underOdds: -110 },
    threes: { line: 2.5, overOdds: -155, underOdds: +130 }
  },
  "Kevin Durant": {
    pts: { line: 27.5, overOdds: -110, underOdds: -110, books: { DK: 27.5, FD: 28.5, MGM: 27.5 } },
    reb: { line: 6.5, overOdds: -105, underOdds: -115, books: { DK: 6.5, FD: 6.5, MGM: 6.5 } },
    ast: { line: 5.5, overOdds: -115, underOdds: -105, books: { DK: 5.5, FD: 5.5, MGM: 5.5 } },
    pra: { line: 39.5, overOdds: -110, underOdds: -110 },
    blk: { line: 1.5, overOdds: +110, underOdds: -130 }
  },
  "Anthony Edwards": {
    pts: { line: 27.5, overOdds: -110, underOdds: -110, books: { DK: 27.5, FD: 28.5, MGM: 27.5 } },
    reb: { line: 5.5, overOdds: -110, underOdds: -110, books: { DK: 5.5, FD: 5.5, MGM: 5.5 } },
    ast: { line: 5.5, overOdds: -115, underOdds: -105, books: { DK: 5.5, FD: 5.5, MGM: 5.5 } },
    pra: { line: 38.5, overOdds: -110, underOdds: -110 }
  },
  "Devin Booker": {
    pts: { line: 27.5, overOdds: -115, underOdds: -105, books: { DK: 27.5, FD: 28.5, MGM: 27.5 } },
    reb: { line: 4.5, overOdds: -110, underOdds: -110, books: { DK: 4.5, FD: 4.5, MGM: 4.5 } },
    ast: { line: 6.5, overOdds: -110, underOdds: -110, books: { DK: 6.5, FD: 6.5, MGM: 6.5 } },
    pra: { line: 38.5, overOdds: -110, underOdds: -110 }
  },
  "Damian Lillard": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110, books: { DK: 25.5, FD: 26.5, MGM: 25.5 } },
    ast: { line: 7.5, overOdds: -115, underOdds: -105, books: { DK: 7.5, FD: 7.5, MGM: 7.5 } },
    threes: { line: 3.5, overOdds: -120, underOdds: +100, books: { DK: 3.5, FD: 3.5, MGM: 3.5 } },
    pra: { line: 37.5, overOdds: -110, underOdds: -110 }
  },
  "Trae Young": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110, books: { DK: 25.5, FD: 26.5, MGM: 25.5 } },
    ast: { line: 11.5, overOdds: -110, underOdds: -110, books: { DK: 11.5, FD: 11.5, MGM: 11.5 } },
    threes: { line: 2.5, overOdds: -125, underOdds: +105, books: { DK: 2.5, FD: 2.5, MGM: 2.5 } },
    pra: { line: 40.5, overOdds: -110, underOdds: -110 }
  },
  "Ja Morant": {
    pts: { line: 24.5, overOdds: -110, underOdds: -110 },
    ast: { line: 8.5, overOdds: -115, underOdds: -105 },
    reb: { line: 5.5, overOdds: -105, underOdds: -115 },
    pra: { line: 38.5, overOdds: -110, underOdds: -110 }
  },
  "Donovan Mitchell": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110 },
    ast: { line: 5.5, overOdds: -110, underOdds: -110 },
    reb: { line: 4.5, overOdds: -110, underOdds: -110 },
    pra: { line: 35.5, overOdds: -110, underOdds: -110 }
  },
  "Joel Embiid": {
    pts: { line: 28.5, overOdds: -110, underOdds: -110 },
    reb: { line: 10.5, overOdds: -115, underOdds: -105 },
    ast: { line: 4.5, overOdds: -105, underOdds: -115 },
    pra: { line: 43.5, overOdds: -110, underOdds: -110 },
    blk: { line: 1.5, overOdds: -125, underOdds: +105 }
  },
  "Anthony Davis": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110 },
    reb: { line: 12.5, overOdds: -110, underOdds: -110 },
    ast: { line: 3.5, overOdds: -105, underOdds: -115 },
    pra: { line: 41.5, overOdds: -110, underOdds: -110 },
    blk: { line: 2.5, overOdds: -105, underOdds: -115 }
  },
  "Tyrese Haliburton": {
    pts: { line: 19.5, overOdds: -110, underOdds: -110 },
    ast: { line: 10.5, overOdds: -115, underOdds: -105 },
    reb: { line: 4.5, overOdds: -110, underOdds: -110 },
    pra: { line: 34.5, overOdds: -110, underOdds: -110 }
  },
  "Jimmy Butler": {
    pts: { line: 20.5, overOdds: -110, underOdds: -110 },
    reb: { line: 5.5, overOdds: -110, underOdds: -110 },
    ast: { line: 5.5, overOdds: -115, underOdds: -105 },
    pra: { line: 31.5, overOdds: -110, underOdds: -110 }
  },
  "Jalen Brunson": {
    pts: { line: 26.5, overOdds: -110, underOdds: -110 },
    ast: { line: 7.5, overOdds: -115, underOdds: -105 },
    reb: { line: 4.5, overOdds: -110, underOdds: -110 },
    pra: { line: 38.5, overOdds: -110, underOdds: -110 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📈 LINE MOVEMENT TRACKING
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

export const LINE_MOVEMENTS = {
  "Stephen Curry": {
    pts: { opened: 23.5, current: 24.5, movement: +1, direction: "up", sharpAction: "over", publicPct: 68, sharpPct: 75 },
    ast: { opened: 6.5, current: 5.5, movement: -1, direction: "down", sharpAction: "under", publicPct: 55, sharpPct: 62 }
  },
  "LeBron James": {
    pts: { opened: 25.5, current: 24.5, movement: -1, direction: "down", sharpAction: "under", publicPct: 70, sharpPct: 45 },
    reb: { opened: 7.5, current: 7.5, movement: 0, direction: "stable", sharpAction: null, publicPct: 52, sharpPct: 55 }
  },
  "Luka Doncic": {
    pts: { opened: 32.5, current: 33.5, movement: +1, direction: "up", sharpAction: "over", publicPct: 72, sharpPct: 78 },
    pra: { opened: 50.5, current: 52.5, movement: +2, direction: "up", sharpAction: "over", publicPct: 65, sharpPct: 80 }
  },
  "Giannis Antetokounmpo": {
    pts: { opened: 30.5, current: 31.5, movement: +1, direction: "up", sharpAction: "over", publicPct: 68, sharpPct: 72 },
    reb: { opened: 12.5, current: 11.5, movement: -1, direction: "down", sharpAction: "over", publicPct: 58, sharpPct: 65 }
  },
  "Nikola Jokic": {
    pts: { opened: 28.5, current: 29.5, movement: +1, direction: "up", sharpAction: "over", publicPct: 70, sharpPct: 82 },
    ast: { opened: 10.5, current: 10.5, movement: 0, direction: "stable", sharpAction: "over", publicPct: 55, sharpPct: 68 }
  },
  "Shai Gilgeous-Alexander": {
    pts: { opened: 31.5, current: 32.5, movement: +1, direction: "up", sharpAction: "over", publicPct: 75, sharpPct: 85 }
  },
  "Jayson Tatum": {
    pts: { opened: 27.5, current: 27.5, movement: 0, direction: "stable", sharpAction: null, publicPct: 60, sharpPct: 55 },
    reb: { opened: 8.5, current: 8.5, movement: 0, direction: "stable", sharpAction: "over", publicPct: 52, sharpPct: 62 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎰 ADVANCED PROP INTELLIGENCE CLASS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class RayPropIntelligenceUltra {
  constructor() {
    this.propLines = PROP_LINES;
    this.lineMovements = LINE_MOVEMENTS;
    this.correlationMatrix = this.buildCorrelationMatrix();
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📊 ODDS & PROBABILITY CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  oddsToImpliedProb(odds) {
    if (odds < 0) {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
    return 100 / (odds + 100);
  }

  probToOdds(prob) {
    if (prob >= 0.5) {
      return Math.round(-100 * prob / (1 - prob));
    }
    return Math.round(100 * (1 - prob) / prob);
  }

  oddsToDecimal(odds) {
    if (odds < 0) {
      return 1 + (100 / Math.abs(odds));
    }
    return 1 + (odds / 100);
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 💰 EXPECTED VALUE CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  calculateEV(winProb, odds, stake = 100) {
    const impliedProb = this.oddsToImpliedProb(odds);
    const decimalOdds = this.oddsToDecimal(odds);
    const potentialProfit = stake * (decimalOdds - 1);
    
    const ev = (winProb * potentialProfit) - ((1 - winProb) * stake);
    const evPercent = (ev / stake) * 100;
    const edge = (winProb - impliedProb) * 100;

    // CLV (Closing Line Value) estimation
    const noVigProb = impliedProb / 0.95; // Assume 5% juice
    const clvEstimate = ((winProb / noVigProb) - 1) * 100;

    return {
      ev: parseFloat(ev.toFixed(2)),
      evPercent: parseFloat(evPercent.toFixed(2)),
      impliedProb: parseFloat((impliedProb * 100).toFixed(1)),
      edge: parseFloat(edge.toFixed(1)),
      isPositiveEV: ev > 0,
      clvEstimate: parseFloat(clvEstimate.toFixed(1)),
      gradeLevel: this.gradeEV(evPercent),
      recommendation: this.getEVRecommendation(evPercent, edge)
    };
  }

  gradeEV(evPercent) {
    if (evPercent > 10) {
return 'A+';
}
    if (evPercent > 7) {
return 'A';
}
    if (evPercent > 5) {
return 'B+';
}
    if (evPercent > 3) {
return 'B';
}
    if (evPercent > 1) {
return 'C';
}
    if (evPercent > 0) {
return 'D';
}
    return 'F';
  }

  getEVRecommendation(evPercent, edge) {
    if (evPercent > 8 && edge > 8) {
return '🔥 SMASH - Strong edge detected';
}
    if (evPercent > 5 && edge > 5) {
return '✅ STRONG BET - Clear value';
}
    if (evPercent > 2 && edge > 2) {
return '👍 VALUE BET - Worth taking';
}
    if (evPercent > 0 && edge > 0) {
return '🤔 LEAN - Small edge';
}
    if (evPercent > -2) {
return '⚖️ PASS - No clear value';
}
    return '❌ AVOID - Negative expectation';
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📈 KELLY CRITERION
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  kellyCalculator(winProb, odds, bankroll = 1000, kellyFraction = 0.25) {
    const decimalOdds = this.oddsToDecimal(odds);
    const b = decimalOdds - 1; // Net odds
    const p = winProb;
    const q = 1 - p;

    // Full Kelly
    const fullKelly = ((b * p) - q) / b;
    
    // Fractional Kelly (safer)
    const fractionalKelly = Math.max(0, fullKelly * kellyFraction);
    const suggestedBet = fractionalKelly * bankroll;
    
    // Calculate risk metrics
    const riskOfRuin = this.calculateRiskOfRuin(winProb, odds, fractionalKelly);

    return {
      fullKelly: parseFloat((fullKelly * 100).toFixed(2)),
      fractionalKelly: parseFloat((fractionalKelly * 100).toFixed(2)),
      suggestedBet: parseFloat(suggestedBet.toFixed(2)),
      suggestedUnits: parseFloat((fractionalKelly * 10).toFixed(2)),
      maxBetPct: parseFloat((fullKelly * 0.5 * 100).toFixed(2)), // Half Kelly max
      riskLevel: this.assessRiskLevel(fractionalKelly),
      riskOfRuin: parseFloat((riskOfRuin * 100).toFixed(2)),
      recommendation: this.getKellyRecommendation(fullKelly, suggestedBet)
    };
  }

  calculateRiskOfRuin(winProb, odds, betFraction) {
    // Simplified risk of ruin calculation
    const edge = winProb - this.oddsToImpliedProb(odds);
    if (edge <= 0) {
return 1;
} // 100% risk if no edge
    
    const variance = winProb * (1 - winProb);
    const ror = Math.exp(-2 * edge * (1 / betFraction) / variance);
    return Math.min(1, Math.max(0, ror));
  }

  assessRiskLevel(kellyPct) {
    if (kellyPct > 10) {
return { level: 'EXTREME', color: 'red', emoji: '🚨' };
}
    if (kellyPct > 5) {
return { level: 'HIGH', color: 'orange', emoji: '⚠️' };
}
    if (kellyPct > 2) {
return { level: 'MODERATE', color: 'yellow', emoji: '🔔' };
}
    if (kellyPct > 0.5) {
return { level: 'LOW', color: 'green', emoji: '✅' };
}
    return { level: 'MINIMAL', color: 'blue', emoji: '💤' };
  }

  getKellyRecommendation(fullKelly, suggestedBet) {
    if (fullKelly <= 0) {
return '🚫 NO BET - Negative expectation';
}
    if (suggestedBet < 5) {
return '⏭️ SKIP - Edge too small to bet';
}
    if (suggestedBet < 25) {
return `💵 SMALL - Bet $${suggestedBet.toFixed(0)}`;
}
    if (suggestedBet < 75) {
return `💰 STANDARD - Bet $${suggestedBet.toFixed(0)}`;
}
    return `🔥 MAX VALUE - Bet $${suggestedBet.toFixed(0)}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🔍 SHARP MONEY DETECTION
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  detectSharpMoney(playerName, propType) {
    const movement = this.lineMovements[playerName]?.[propType];
    if (!movement) {
return { detected: false, signal: null };
}

    const signals = [];
    let sharpScore = 0;

    // Reverse line movement (line moves opposite to public)
    if (movement.publicPct && movement.sharpPct) {
      const publicBias = movement.publicPct > 60 ? 'heavy' : movement.publicPct > 55 ? 'moderate' : 'light';
      const sharpContrarian = (movement.publicPct > 60 && movement.sharpPct < 50) || 
                              (movement.publicPct < 40 && movement.sharpPct > 50);
      
      if (sharpContrarian) {
        signals.push({ type: 'REVERSE_LINE_MOVEMENT', strength: 'STRONG', message: 'Sharp money opposing public' });
        sharpScore += 30;
      }

      // Sharp side consensus
      if (movement.sharpPct > 70) {
        signals.push({ type: 'SHARP_CONSENSUS', strength: 'STRONG', message: `${movement.sharpPct}% sharp money on ${movement.sharpAction}` });
        sharpScore += 25;
      } else if (movement.sharpPct > 60) {
        signals.push({ type: 'SHARP_LEAN', strength: 'MODERATE', message: `${movement.sharpPct}% sharp money on ${movement.sharpAction}` });
        sharpScore += 15;
      }
    }

    // Significant line movement
    if (Math.abs(movement.movement) >= 1.5) {
      signals.push({ type: 'BIG_MOVE', strength: 'MODERATE', message: `Line moved ${movement.movement > 0 ? '+' : ''}${movement.movement} points` });
      sharpScore += 20;
    } else if (Math.abs(movement.movement) >= 1) {
      signals.push({ type: 'LINE_MOVE', strength: 'LIGHT', message: `Line moved ${movement.movement > 0 ? '+' : ''}${movement.movement} point` });
      sharpScore += 10;
    }

    // Steam move detection (rapid movement)
    if (movement.steamMove) {
      signals.push({ type: 'STEAM_MOVE', strength: 'STRONG', message: 'Rapid coordinated movement detected' });
      sharpScore += 35;
    }

    return {
      detected: sharpScore > 20,
      signal: movement.sharpAction,
      sharpScore: Math.min(100, sharpScore),
      signals,
      recommendation: this.getSharpRecommendation(sharpScore, movement.sharpAction),
      publicVsSharp: {
        public: movement.publicPct || 50,
        sharp: movement.sharpPct || 50,
        divergence: Math.abs((movement.publicPct || 50) - (movement.sharpPct || 50))
      }
    };
  }

  getSharpRecommendation(score, side) {
    if (score > 60) {
return `🎯 FOLLOW SHARPS - Strong signal on ${side?.toUpperCase() || 'CURRENT SIDE'}`;
}
    if (score > 40) {
return `📊 LEAN WITH SHARPS - Moderate signal on ${side?.toUpperCase() || 'CURRENT SIDE'}`;
}
    if (score > 20) {
return `🔍 MONITOR - Some sharp activity detected`;
}
    return `📈 NO CLEAR SIGNAL - Await more information`;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🔗 CORRELATION ENGINE
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  buildCorrelationMatrix() {
    return {
      // Same player correlations (high)
      samePlayer: {
        'pts-ast': 0.35,    // Scorers who facilitate
        'pts-reb': 0.25,    // Bigs who score
        'pts-threes': 0.65, // Volume shooters
        'reb-blk': 0.45,    // Rim protectors
        'ast-reb': 0.15,    // Point forwards
        'pts-min': 0.75,    // More minutes = more stats
        'ast-min': 0.70,
        'reb-min': 0.65
      },
      // Teammate correlations (moderate positive)
      teammates: {
        'pg-ast_c-pts': 0.40,     // PG assists to C points
        'pg-ast_sg-pts': 0.35,    // PG assists to SG points
        'c-reb_pf-reb': -0.25,    // Competing for rebounds
      },
      // Opponent correlations (usually negative)
      opponents: {
        'c-pts_c-pts': -0.20,     // Centers limit each other
        'pg-ast_pg-stl': -0.15,   // PG battles
      },
      // Game environment
      environment: {
        'pace-all_stats': 0.40,   // High pace = more stats
        'ou-all_stats': 0.35,     // High totals = more points
      }
    };
  }

  analyzeCorrelation(player1, stat1, player2, stat2, relationship = 'samePlayer') {
    const key = `${stat1}-${stat2}`;
    const reverseKey = `${stat2}-${stat1}`;
    
    const matrix = this.correlationMatrix[relationship];
    if (!matrix) {
return { correlation: 0, usable: false };
}

    let correlation = matrix[key] || matrix[reverseKey] || 0;

    // Adjust for specific player synergies
    if (player1 === player2) {
      // Same player boosts
      if (stat1 === 'pts' && stat2 === 'threes') {
        const playerData = PLAYERS_DB[player1] || EXTENDED_PLAYERS[player1];
        if (playerData?.season?.threePct > 38) {
correlation += 0.15;
} // Good 3pt shooters
      }
    }

    return {
      correlation: parseFloat(correlation.toFixed(2)),
      strength: Math.abs(correlation) > 0.5 ? 'STRONG' : 
                Math.abs(correlation) > 0.3 ? 'MODERATE' : 
                Math.abs(correlation) > 0.1 ? 'WEAK' : 'NONE',
      direction: correlation > 0 ? 'POSITIVE' : correlation < 0 ? 'NEGATIVE' : 'NEUTRAL',
      usable: Math.abs(correlation) > 0.25,
      recommendation: this.getCorrelationRecommendation(correlation, stat1, stat2)
    };
  }

  getCorrelationRecommendation(corr, stat1, stat2) {
    if (corr > 0.5) {
return `🔗 Strong positive - ${stat1.toUpperCase()} OVER pairs well with ${stat2.toUpperCase()} OVER`;
}
    if (corr > 0.3) {
return `📊 Moderate link - Consider pairing ${stat1.toUpperCase()} and ${stat2.toUpperCase()} same direction`;
}
    if (corr < -0.3) {
return `⚠️ Negative correlation - Avoid pairing ${stat1.toUpperCase()} and ${stat2.toUpperCase()} same direction`;
}
    return `➡️ Low correlation - Props are relatively independent`;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎰 PARLAY BUILDER
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  buildSmartParlay(legs, bankroll = 1000) {
    if (legs.length < 2) {
return { error: 'Need at least 2 legs for a parlay' };
}

    // Calculate combined probability
    let combinedProb = 1;
    let combinedOdds = 1;
    let correlationAdjustment = 1;
    const legDetails = [];

    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const player = PLAYERS_DB[leg.player] || EXTENDED_PLAYERS[leg.player];
      if (!player) {
continue;
}

      const prop = this.propLines[leg.player]?.[leg.stat];
      if (!prop) {
continue;
}

      const odds = leg.direction === 'over' ? prop.overOdds : prop.underOdds;
      const winProb = this.estimateWinProbability(leg.player, leg.stat, leg.direction);

      combinedProb *= winProb;
      combinedOdds *= this.oddsToDecimal(odds);

      legDetails.push({
        ...leg,
        line: prop.line,
        odds,
        winProb: parseFloat((winProb * 100).toFixed(1)),
        ev: this.calculateEV(winProb, odds)
      });

      // Check correlations with other legs
      for (let j = i + 1; j < legs.length; j++) {
        const otherLeg = legs[j];
        if (leg.player === otherLeg.player) {
          const corr = this.analyzeCorrelation(leg.player, leg.stat, otherLeg.player, otherLeg.stat);
          if (leg.direction === otherLeg.direction && corr.correlation > 0) {
            correlationAdjustment *= (1 + corr.correlation * 0.3); // Boost for positive correlation
          } else if (leg.direction !== otherLeg.direction && corr.correlation > 0.3) {
            correlationAdjustment *= 0.85; // Penalty for conflicting directions with positive correlation
          }
        }
      }
    }

    // Apply correlation adjustment
    const adjustedProb = Math.min(combinedProb * correlationAdjustment, 0.95);
    const parlayOdds = this.probToOdds(1 / combinedOdds);
    const impliedProb = 1 / combinedOdds;

    const ev = this.calculateEV(adjustedProb, parlayOdds);
    const kelly = this.kellyCalculator(adjustedProb, parlayOdds, bankroll, 0.15); // Lower kelly for parlays

    return {
      legs: legDetails,
      legCount: legDetails.length,
      combinedOdds: parseFloat(combinedOdds.toFixed(2)),
      parlayOdds: parlayOdds,
      rawProbability: parseFloat((combinedProb * 100).toFixed(2)),
      adjustedProbability: parseFloat((adjustedProb * 100).toFixed(2)),
      correlationBoost: parseFloat(((correlationAdjustment - 1) * 100).toFixed(1)),
      ev,
      kelly,
      payout: parseFloat((100 * combinedOdds).toFixed(2)),
      recommendation: this.getParlayRecommendation(adjustedProb, ev.evPercent, legDetails.length)
    };
  }

  getParlayRecommendation(prob, evPct, legCount) {
    if (legCount > 4) {
return '⚠️ HIGH RISK - Consider reducing legs';
}
    if (evPct > 10 && prob > 20) {
return '🔥 STRONG PARLAY - Clear value across legs';
}
    if (evPct > 5 && prob > 25) {
return '✅ GOOD VALUE - Solid parlay opportunity';
}
    if (evPct > 0 && prob > 30) {
return '👍 PLAYABLE - Worth considering';
}
    if (evPct > -5) {
return '🤔 MARGINAL - Proceed with caution';
}
    return '❌ AVOID - Negative overall expectation';
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📊 COMPREHENSIVE PROP ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  analyzeFullProp(playerName, propType, customLine = null) {
    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
return { error: `Player "${playerName}" not found` };
}

    const lines = this.propLines[playerName];
    if (!lines || !lines[propType]) {
      return { error: `No ${propType} prop available for ${playerName}` };
    }

    const prop = lines[propType];
    const line = customLine || prop.line;

    // Get player stats
    const seasonAvg = player.season?.[propType] || 0;
    const last5Avg = player.last5?.[propType] || seasonAvg;
    const last10Avg = player.last10?.[propType] || seasonAvg;

    // Estimate probabilities
    const overProb = this.estimateWinProbability(playerName, propType, 'over', line);
    const underProb = 1 - overProb;

    // Calculate EV for both sides
    const overEV = this.calculateEV(overProb, prop.overOdds);
    const underEV = this.calculateEV(underProb, prop.underOdds);

    // Get sharp money signals
    const sharpSignals = this.detectSharpMoney(playerName, propType);

    // Line shopping
    const lineShop = this.findBestLine(playerName, propType);

    // Trend analysis
    const trend = this.analyzeTrend(player, propType);

    // Hit rate estimation
    const hitRate = this.estimateHitRate(player, propType, line);

    // Overall recommendation
    const recommendation = this.generateRecommendation(overEV, underEV, sharpSignals, trend, hitRate);

    return {
      player: playerName,
      propType,
      line,
      odds: { over: prop.overOdds, under: prop.underOdds },
      
      stats: {
        season: seasonAvg,
        last10: last10Avg,
        last5: last5Avg,
        vsLine: {
          season: parseFloat(((seasonAvg - line) / line * 100).toFixed(1)),
          last5: parseFloat(((last5Avg - line) / line * 100).toFixed(1))
        }
      },

      probabilities: {
        over: parseFloat((overProb * 100).toFixed(1)),
        under: parseFloat((underProb * 100).toFixed(1))
      },

      ev: { over: overEV, under: underEV },
      
      sharpMoney: sharpSignals,
      lineShop,
      trend,
      hitRate,
      recommendation,

      kelly: {
        over: this.kellyCalculator(overProb, prop.overOdds),
        under: this.kellyCalculator(underProb, prop.underOdds)
      }
    };
  }

  estimateWinProbability(playerName, propType, direction, customLine = null) {
    const player = PLAYERS_DB[playerName] || EXTENDED_PLAYERS[playerName];
    if (!player) {
return 0.5;
}

    const prop = this.propLines[playerName]?.[propType];
    const line = customLine || prop?.line || player.season?.[propType] || 0;

    const seasonAvg = player.season?.[propType] || 0;
    const last5Avg = player.last5?.[propType] || seasonAvg;
    const last10Avg = player.last10?.[propType] || seasonAvg;

    // Weighted average (recent form weighted higher)
    const projectedAvg = (last5Avg * 0.45) + (last10Avg * 0.35) + (seasonAvg * 0.20);

    // Standard deviation estimation (roughly 20-25% of mean for most stats)
    const stdDev = seasonAvg * 0.22;

    // Z-score calculation
    const zScore = (projectedAvg - line) / stdDev;

    // Convert to probability using normal CDF approximation
    const probability = this.normalCDF(zScore);

    return direction === 'over' ? probability : (1 - probability);
  }

  normalCDF(z) {
    // Approximation of normal CDF
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  findBestLine(playerName, propType) {
    const prop = this.propLines[playerName]?.[propType];
    if (!prop?.books) {
return null;
}

    const bestOver = Object.entries(prop.books)
      .map(([book, line]) => ({ book, line }))
      .sort((a, b) => a.line - b.line)[0]; // Lowest line for over

    const bestUnder = Object.entries(prop.books)
      .map(([book, line]) => ({ book, line }))
      .sort((a, b) => b.line - a.line)[0]; // Highest line for under

    return {
      over: bestOver,
      under: bestUnder,
      spread: bestUnder.line - bestOver.line,
      hasArbitrage: bestUnder.line < bestOver.line
    };
  }

  analyzeTrend(player, propType) {
    const season = player.season?.[propType] || 0;
    const last10 = player.last10?.[propType] || season;
    const last5 = player.last5?.[propType] || season;

    const shortTrend = last5 - last10;
    const longTrend = last5 - season;

    return {
      shortTerm: {
        change: parseFloat(shortTrend.toFixed(1)),
        pctChange: parseFloat(((shortTrend / last10) * 100).toFixed(1)),
        direction: shortTrend > 0.5 ? 'up' : shortTrend < -0.5 ? 'down' : 'stable'
      },
      longTerm: {
        change: parseFloat(longTrend.toFixed(1)),
        pctChange: parseFloat(((longTrend / season) * 100).toFixed(1)),
        direction: longTrend > 1 ? 'up' : longTrend < -1 ? 'down' : 'stable'
      },
      momentum: this.calculateMomentum(player, propType),
      streak: this.calculateStreak(player, propType)
    };
  }

  calculateMomentum(player, propType) {
    const season = player.season?.[propType] || 0;
    const last5 = player.last5?.[propType] || season;
    const last10 = player.last10?.[propType] || season;

    // Momentum = rate of improvement
    const recentImprovement = last5 - last10;
    const overallImprovement = last5 - season;

    if (recentImprovement > 2 && overallImprovement > 0) {
return '🚀 HOT';
}
    if (recentImprovement > 0 && overallImprovement > 0) {
return '📈 RISING';
}
    if (recentImprovement < -2 && overallImprovement < 0) {
return '❄️ COLD';
}
    if (recentImprovement < 0 && overallImprovement < 0) {
return '📉 FALLING';
}
    return '➡️ STABLE';
  }

  calculateStreak(player, propType) {
    // Would use game log in production
    const hitRates = player.propHitRates || {};
    for (const [key, value] of Object.entries(hitRates)) {
      if (key.startsWith(`${propType}_`)) {
        return value.streak || null;
      }
    }
    return null;
  }

  estimateHitRate(player, propType, line) {
    const hitRates = player.propHitRates || {};
    
    for (const [key, value] of Object.entries(hitRates)) {
      if (key.startsWith(`${propType}_`)) {
        const keyLine = parseFloat(key.split('_')[1]);
        if (Math.abs(keyLine - line) <= 1.5) {
          return {
            over: value.over,
            under: value.under,
            streak: value.streak,
            gamesAnalyzed: 20 // Assumed
          };
        }
      }
    }

    // Estimate if no direct match
    const seasonAvg = player.season?.[propType] || 0;
    const overRate = Math.round(50 + ((seasonAvg - line) / line) * 30);
    return {
      over: Math.min(85, Math.max(15, overRate)),
      under: Math.min(85, Math.max(15, 100 - overRate)),
      streak: null,
      gamesAnalyzed: 0,
      estimated: true
    };
  }

  generateRecommendation(overEV, underEV, sharpSignals, trend, hitRate) {
    let score = 0;
    let direction = 'none';
    const factors = [];

    // EV contribution
    if (overEV.evPercent > underEV.evPercent && overEV.evPercent > 0) {
      score += overEV.evPercent * 2;
      direction = 'OVER';
      factors.push(`+${overEV.evPercent.toFixed(1)}% EV on over`);
    } else if (underEV.evPercent > 0) {
      score += underEV.evPercent * 2;
      direction = 'UNDER';
      factors.push(`+${underEV.evPercent.toFixed(1)}% EV on under`);
    }

    // Sharp money contribution
    if (sharpSignals.detected && sharpSignals.sharpScore > 40) {
      const sharpDirection = sharpSignals.signal?.toUpperCase();
      if (sharpDirection === direction) {
        score += 15;
        factors.push(`Sharp money confirms ${direction}`);
      } else if (sharpDirection && sharpDirection !== direction) {
        score -= 10;
        factors.push(`Sharp money opposes - CAUTION`);
      }
    }

    // Trend contribution
    if (trend.momentum.includes('HOT') || trend.momentum.includes('RISING')) {
      if (direction === 'OVER') {
        score += 10;
        factors.push('Positive momentum');
      }
    } else if (trend.momentum.includes('COLD') || trend.momentum.includes('FALLING')) {
      if (direction === 'UNDER') {
        score += 10;
        factors.push('Negative momentum supports under');
      }
    }

    // Hit rate contribution
    if (hitRate && !hitRate.estimated) {
      const relevantRate = direction === 'OVER' ? hitRate.over : hitRate.under;
      if (relevantRate > 60) {
        score += 10;
        factors.push(`${relevantRate}% historical hit rate`);
      }
    }

    // Generate final recommendation
    let confidence, recommendation;
    if (score > 30) {
      confidence = 'HIGH';
      recommendation = `🔥 STRONG ${direction} - ${factors.join(', ')}`;
    } else if (score > 15) {
      confidence = 'MEDIUM';
      recommendation = `✅ ${direction} - ${factors.join(', ')}`;
    } else if (score > 5) {
      confidence = 'LOW';
      recommendation = `🤔 LEAN ${direction} - ${factors.join(', ')}`;
    } else {
      confidence = 'NONE';
      recommendation = `⚖️ PASS - No clear edge. ${factors.length > 0 ? factors.join(', ') : 'Insufficient signals'}`;
      direction = 'PASS';
    }

    return {
      direction,
      confidence,
      score: Math.round(score),
      summary: recommendation,
      factors
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎯 QUICK ACCESS METHODS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  getTopValuePlays(limit = 5) {
    const plays = [];
    const allPlayers = { ...PLAYERS_DB, ...EXTENDED_PLAYERS };

    for (const playerName of Object.keys(this.propLines)) {
      const props = this.propLines[playerName];
      
      for (const propType of Object.keys(props)) {
        const analysis = this.analyzeFullProp(playerName, propType);
        if (analysis.error) {
continue;
}

        const bestEV = Math.max(analysis.ev.over.evPercent, analysis.ev.under.evPercent);
        const direction = analysis.ev.over.evPercent > analysis.ev.under.evPercent ? 'OVER' : 'UNDER';

        if (bestEV > 3) {
          plays.push({
            player: playerName,
            prop: propType,
            line: analysis.line,
            direction,
            evPercent: bestEV,
            confidence: analysis.recommendation.confidence,
            recommendation: analysis.recommendation.summary
          });
        }
      }
    }

    return plays.sort((a, b) => b.evPercent - a.evPercent).slice(0, limit);
  }

  getAllProps(playerName) {
    const props = this.propLines[playerName];
    if (!props) {
return null;
}

    const analyses = {};
    for (const propType of Object.keys(props)) {
      analyses[propType] = this.analyzeFullProp(playerName, propType);
    }
    return analyses;
  }
}

// Create singleton instance
const rayPropIntelligenceUltra = new RayPropIntelligenceUltra();

export default rayPropIntelligenceUltra;
export { RayPropIntelligenceUltra };
