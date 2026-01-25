// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  💰 RAY PROP INTELLIGENCE v2.0 - WORLD'S SMARTEST BETTING BRAIN               ║
// ║  Line Movement • Sharp Money • EV Calculator • Kelly Sizing • Parlay Builder  ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

import rayAnalytics, { PLAYERS_DB, TEAMS_DB } from './RayAnalyticsEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CURRENT PROP LINES (Simulated sportsbook data)
// ═══════════════════════════════════════════════════════════════════════════════
export const PROP_LINES = {
  "Stephen Curry": {
    pts: { line: 24.5, overOdds: -115, underOdds: -105 },
    reb: { line: 4.5, overOdds: -110, underOdds: -110 },
    ast: { line: 5.5, overOdds: -120, underOdds: +100 },
    threes: { line: 4.5, overOdds: +105, underOdds: -125 },
    pra: { line: 33.5, overOdds: -110, underOdds: -110 },
    steals: { line: 0.5, overOdds: -180, underOdds: +150 }
  },
  "LeBron James": {
    pts: { line: 24.5, overOdds: -110, underOdds: -110 },
    reb: { line: 7.5, overOdds: -115, underOdds: -105 },
    ast: { line: 7.5, overOdds: -105, underOdds: -115 },
    pra: { line: 39.5, overOdds: -110, underOdds: -110 },
    steals: { line: 0.5, overOdds: -200, underOdds: +160 }
  },
  "Luka Doncic": {
    pts: { line: 33.5, overOdds: -110, underOdds: -110 },
    reb: { line: 8.5, overOdds: -115, underOdds: -105 },
    ast: { line: 9.5, overOdds: -110, underOdds: -110 },
    pra: { line: 51.5, overOdds: -105, underOdds: -115 },
    threes: { line: 3.5, overOdds: -130, underOdds: +110 }
  },
  "Jayson Tatum": {
    pts: { line: 27.5, overOdds: -110, underOdds: -110 },
    reb: { line: 8.5, overOdds: -105, underOdds: -115 },
    ast: { line: 4.5, overOdds: -115, underOdds: -105 },
    pra: { line: 40.5, overOdds: -110, underOdds: -110 },
    threes: { line: 2.5, overOdds: -150, underOdds: +125 }
  },
  "Giannis Antetokounmpo": {
    pts: { line: 31.5, overOdds: -115, underOdds: -105 },
    reb: { line: 11.5, overOdds: -110, underOdds: -110 },
    ast: { line: 5.5, overOdds: -125, underOdds: +105 },
    pra: { line: 49.5, overOdds: -105, underOdds: -115 },
    blk: { line: 1.5, overOdds: -110, underOdds: -110 }
  },
  "Nikola Jokic": {
    pts: { line: 29.5, overOdds: -110, underOdds: -110 },
    reb: { line: 13.5, overOdds: -115, underOdds: -105 },
    ast: { line: 9.5, overOdds: -105, underOdds: -115 },
    pra: { line: 53.5, overOdds: -110, underOdds: -110 },
    threes: { line: 1.5, overOdds: -140, underOdds: +120 }
  },
  "Shai Gilgeous-Alexander": {
    pts: { line: 32.5, overOdds: -115, underOdds: -105 },
    reb: { line: 5.5, overOdds: -110, underOdds: -110 },
    ast: { line: 6.5, overOdds: -105, underOdds: -115 },
    pra: { line: 44.5, overOdds: -110, underOdds: -110 },
    steals: { line: 1.5, overOdds: -135, underOdds: +115 }
  },
  "Kevin Durant": {
    pts: { line: 27.5, overOdds: -110, underOdds: -110 },
    reb: { line: 6.5, overOdds: -105, underOdds: -115 },
    ast: { line: 4.5, overOdds: -120, underOdds: +100 },
    pra: { line: 38.5, overOdds: -110, underOdds: -110 }
  },
  "Anthony Edwards": {
    pts: { line: 28.5, overOdds: -110, underOdds: -110 },
    reb: { line: 5.5, overOdds: -105, underOdds: -115 },
    ast: { line: 4.5, overOdds: -115, underOdds: -105 },
    pra: { line: 39.5, overOdds: -110, underOdds: -110 }
  },
  "Tyrese Haliburton": {
    pts: { line: 20.5, overOdds: -110, underOdds: -110 },
    reb: { line: 3.5, overOdds: -115, underOdds: -105 },
    ast: { line: 10.5, overOdds: -105, underOdds: -115 },
    pra: { line: 34.5, overOdds: -110, underOdds: -110 }
  },
  "Devin Booker": {
    pts: { line: 27.5, overOdds: -115, underOdds: -105 },
    reb: { line: 4.5, overOdds: -105, underOdds: -115 },
    ast: { line: 6.5, overOdds: -110, underOdds: -110 },
    pra: { line: 39.5, overOdds: -110, underOdds: -110 }
  },
  "Ja Morant": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110 },
    reb: { line: 5.5, overOdds: -105, underOdds: -115 },
    ast: { line: 8.5, overOdds: -115, underOdds: -105 },
    pra: { line: 39.5, overOdds: -110, underOdds: -110 }
  },
  "Donovan Mitchell": {
    pts: { line: 26.5, overOdds: -110, underOdds: -110 },
    reb: { line: 4.5, overOdds: -110, underOdds: -110 },
    ast: { line: 5.5, overOdds: -105, underOdds: -115 },
    pra: { line: 36.5, overOdds: -110, underOdds: -110 }
  },
  "Joel Embiid": {
    pts: { line: 28.5, overOdds: -110, underOdds: -110 },
    reb: { line: 10.5, overOdds: -115, underOdds: -105 },
    ast: { line: 4.5, overOdds: -105, underOdds: -115 },
    pra: { line: 43.5, overOdds: -110, underOdds: -110 },
    blk: { line: 1.5, overOdds: -120, underOdds: +100 }
  },
  "Trae Young": {
    pts: { line: 26.5, overOdds: -110, underOdds: -110 },
    reb: { line: 3.5, overOdds: -130, underOdds: +110 },
    ast: { line: 11.5, overOdds: -105, underOdds: -115 },
    pra: { line: 41.5, overOdds: -110, underOdds: -110 }
  },
  "Anthony Davis": {
    pts: { line: 25.5, overOdds: -110, underOdds: -110 },
    reb: { line: 12.5, overOdds: -105, underOdds: -115 },
    ast: { line: 3.5, overOdds: -105, underOdds: -115 },
    pra: { line: 41.5, overOdds: -110, underOdds: -110 },
    blk: { line: 1.5, overOdds: -150, underOdds: +125 }
  },
  "Jimmy Butler": {
    pts: { line: 20.5, overOdds: -110, underOdds: -110 },
    reb: { line: 5.5, overOdds: -110, underOdds: -110 },
    ast: { line: 4.5, overOdds: -115, underOdds: -105 },
    pra: { line: 31.5, overOdds: -110, underOdds: -110 }
  },
  "Paolo Banchero": {
    pts: { line: 24.5, overOdds: -110, underOdds: -110 },
    reb: { line: 7.5, overOdds: -105, underOdds: -115 },
    ast: { line: 5.5, overOdds: -110, underOdds: -110 },
    pra: { line: 37.5, overOdds: -110, underOdds: -110 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 LINE MOVEMENT HISTORY (Last 24 hours)
// ═══════════════════════════════════════════════════════════════════════════════
export const LINE_MOVEMENTS = {
  "Stephen Curry": {
    pts: { opened: 23.5, current: 24.5, movement: +1, direction: "up", sharpAction: "over" },
    ast: { opened: 6.5, current: 5.5, movement: -1, direction: "down", sharpAction: "under" }
  },
  "LeBron James": {
    pts: { opened: 25.5, current: 24.5, movement: -1, direction: "down", sharpAction: "under" },
    reb: { opened: 7.5, current: 7.5, movement: 0, direction: "stable", sharpAction: null }
  },
  "Luka Doncic": {
    pts: { opened: 32.5, current: 33.5, movement: +1, direction: "up", sharpAction: "over" },
    pra: { opened: 50.5, current: 51.5, movement: +1, direction: "up", sharpAction: "over" }
  },
  "Giannis Antetokounmpo": {
    pts: { opened: 30.5, current: 31.5, movement: +1, direction: "up", sharpAction: "over" },
    reb: { opened: 12.5, current: 11.5, movement: -1, direction: "down", sharpAction: "over" }
  },
  "Nikola Jokic": {
    pts: { opened: 28.5, current: 29.5, movement: +1, direction: "up", sharpAction: "over" },
    ast: { opened: 10.5, current: 9.5, movement: -1, direction: "down", sharpAction: "over" }
  },
  "Shai Gilgeous-Alexander": {
    pts: { opened: 31.5, current: 32.5, movement: +1, direction: "up", sharpAction: "over" }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎰 PROP INTELLIGENCE CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class RayPropIntelligence {
  constructor() {
    this.propLines = PROP_LINES;
    this.lineMovements = LINE_MOVEMENTS;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Convert American odds to implied probability
  // ─────────────────────────────────────────────────────────────────────────────
  oddsToImpliedProb(odds) {
    if (odds < 0) {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    } else {
      return 100 / (odds + 100);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Convert implied probability to American odds
  // ─────────────────────────────────────────────────────────────────────────────
  probToOdds(prob) {
    if (prob >= 0.5) {
      return Math.round(-100 * prob / (1 - prob));
    } else {
      return Math.round(100 * (1 - prob) / prob);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calculate Expected Value
  // ─────────────────────────────────────────────────────────────────────────────
  calculateEV(winProb, odds, stake = 100) {
    const impliedProb = this.oddsToImpliedProb(odds);
    const potentialProfit = odds > 0 ? stake * (odds / 100) : stake * (100 / Math.abs(odds));
    
    const ev = (winProb * potentialProfit) - ((1 - winProb) * stake);
    const evPercent = (ev / stake) * 100;

    return {
      ev: ev.toFixed(2),
      evPercent: evPercent.toFixed(2),
      impliedProb: (impliedProb * 100).toFixed(1),
      edge: ((winProb - impliedProb) * 100).toFixed(1),
      isPositiveEV: ev > 0,
      recommendation: ev > 5 ? 'STRONG BET' : ev > 0 ? 'VALUE BET' : 'AVOID'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Kelly Criterion for optimal bet sizing
  // ─────────────────────────────────────────────────────────────────────────────
  kellyCalculator(winProb, odds, bankroll = 1000, fractional = 0.25) {
    const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
    const b = decimalOdds - 1; // Net odds
    const p = winProb;
    const q = 1 - p;

    const fullKelly = ((b * p) - q) / b;
    const fractionalKelly = fullKelly * fractional;
    const suggestedBet = Math.max(0, fractionalKelly * bankroll);

    return {
      fullKelly: (fullKelly * 100).toFixed(2) + '%',
      fractionalKelly: (fractionalKelly * 100).toFixed(2) + '%',
      suggestedBet: suggestedBet.toFixed(2),
      suggestedUnits: (fractionalKelly * 10).toFixed(2),
      riskLevel: fractionalKelly > 0.05 ? 'High' : fractionalKelly > 0.02 ? 'Medium' : 'Low',
      recommendation: fullKelly <= 0 
        ? 'NO BET — Negative expectation'
        : suggestedBet < 10 
        ? 'SKIP — Edge too small'
        : `BET $${suggestedBet.toFixed(0)} (${(fractionalKelly * 100).toFixed(1)}% of bankroll)`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Analyze a specific prop
  // ─────────────────────────────────────────────────────────────────────────────
  analyzeProp(playerName, propType) {
    const player = rayAnalytics.findPlayer(playerName);
    if (!player) return null;

    const lines = this.propLines[player.name];
    if (!lines || !lines[propType]) return null;

    const prop = lines[propType];
    const movement = this.lineMovements[player.name]?.[propType];
    const hitRates = player.propHitRates;

    // Find relevant hit rate
    let relevantHitRate = null;
    for (const [key, value] of Object.entries(hitRates)) {
      if (key.startsWith(propType + '_')) {
        const line = parseFloat(key.split('_')[1]);
        if (Math.abs(line - prop.line) <= 2) {
          relevantHitRate = value;
          break;
        }
      }
    }

    // Calculate EV for both sides
    const overWinProb = relevantHitRate ? relevantHitRate.over / 100 : 0.5;
    const underWinProb = relevantHitRate ? relevantHitRate.under / 100 : 0.5;

    const overEV = this.calculateEV(overWinProb, prop.overOdds);
    const underEV = this.calculateEV(underWinProb, prop.underOdds);

    // Get player trend
    const trend = rayAnalytics.calculateTrend(player);
    const last5Avg = player.last5[propType] || 0;
    const seasonAvg = player.season[propType] || 0;

    // Determine recommendation
    let recommendation = 'NO PLAY';
    let confidence = 'Low';
    let reasoning = [];

    if (parseFloat(overEV.edge) > 5) {
      recommendation = `OVER ${prop.line}`;
      confidence = parseFloat(overEV.edge) > 10 ? 'High' : 'Medium';
      reasoning.push(`${overEV.edge}% edge on the over`);
    } else if (parseFloat(underEV.edge) > 5) {
      recommendation = `UNDER ${prop.line}`;
      confidence = parseFloat(underEV.edge) > 10 ? 'High' : 'Medium';
      reasoning.push(`${underEV.edge}% edge on the under`);
    }

    if (trend.direction === 'up' && trend.strength !== 'slight') {
      reasoning.push(`Player trending UP (+${trend.ptsChange5}%)`);
      if (recommendation === 'NO PLAY' && last5Avg > prop.line) {
        recommendation = `LEAN OVER ${prop.line}`;
        confidence = 'Medium';
      }
    } else if (trend.direction === 'down' && trend.strength !== 'slight') {
      reasoning.push(`Player trending DOWN (${trend.ptsChange5}%)`);
      if (recommendation === 'NO PLAY' && last5Avg < prop.line) {
        recommendation = `LEAN UNDER ${prop.line}`;
        confidence = 'Medium';
      }
    }

    if (movement?.sharpAction) {
      reasoning.push(`Sharp money on the ${movement.sharpAction.toUpperCase()}`);
    }

    return {
      player: player.name,
      prop: propType.toUpperCase(),
      line: prop.line,
      overOdds: prop.overOdds,
      underOdds: prop.underOdds,
      seasonAvg,
      last5Avg,
      hitRate: relevantHitRate,
      overEV,
      underEV,
      lineMovement: movement,
      trend: trend.direction,
      recommendation,
      confidence,
      reasoning,
      kelly: recommendation !== 'NO PLAY' 
        ? this.kellyCalculator(
            recommendation.includes('OVER') ? overWinProb : underWinProb,
            recommendation.includes('OVER') ? prop.overOdds : prop.underOdds
          )
        : null
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Find all +EV props
  // ─────────────────────────────────────────────────────────────────────────────
  findPositiveEVProps(minEdge = 3) {
    const positiveEV = [];

    for (const [playerName, lines] of Object.entries(this.propLines)) {
      const player = PLAYERS_DB[playerName];
      if (!player) continue;

      for (const [propType, propData] of Object.entries(lines)) {
        const hitRates = player.propHitRates || {};
        
        // Find best matching hit rate
        for (const [key, value] of Object.entries(hitRates)) {
          if (key.startsWith(propType + '_')) {
            const line = parseFloat(key.split('_')[1]);
            if (Math.abs(line - propData.line) <= 2) {
              const overEV = this.calculateEV(value.over / 100, propData.overOdds);
              const underEV = this.calculateEV(value.under / 100, propData.underOdds);

              if (parseFloat(overEV.edge) >= minEdge) {
                positiveEV.push({
                  player: playerName,
                  team: player.team,
                  prop: `${propType.toUpperCase()} Over ${propData.line}`,
                  odds: propData.overOdds,
                  hitRate: value.over,
                  edge: parseFloat(overEV.edge),
                  ev: parseFloat(overEV.evPercent),
                  streak: value.streak,
                  confidence: parseFloat(overEV.edge) >= 10 ? 'High' : 'Medium'
                });
              }

              if (parseFloat(underEV.edge) >= minEdge) {
                positiveEV.push({
                  player: playerName,
                  team: player.team,
                  prop: `${propType.toUpperCase()} Under ${propData.line}`,
                  odds: propData.underOdds,
                  hitRate: value.under,
                  edge: parseFloat(underEV.edge),
                  ev: parseFloat(underEV.evPercent),
                  streak: value.streak,
                  confidence: parseFloat(underEV.edge) >= 10 ? 'High' : 'Medium'
                });
              }
            }
          }
        }
      }
    }

    return positiveEV.sort((a, b) => b.edge - a.edge);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get sharp money indicators
  // ─────────────────────────────────────────────────────────────────────────────
  getSharpMoneyPlays() {
    const sharpPlays = [];

    for (const [playerName, movements] of Object.entries(this.lineMovements)) {
      for (const [propType, data] of Object.entries(movements)) {
        if (data.sharpAction) {
          const lines = this.propLines[playerName]?.[propType];
          if (lines) {
            sharpPlays.push({
              player: playerName,
              prop: propType.toUpperCase(),
              line: lines.line,
              opened: data.opened,
              current: lines.line,
              movement: data.movement,
              direction: data.direction,
              sharpSide: data.sharpAction.toUpperCase(),
              odds: data.sharpAction === 'over' ? lines.overOdds : lines.underOdds,
              analysis: `Line moved from ${data.opened} to ${lines.line} — sharps on ${data.sharpAction.toUpperCase()}`
            });
          }
        }
      }
    }

    return sharpPlays;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Build a parlay
  // ─────────────────────────────────────────────────────────────────────────────
  buildParlay(legs, stake = 10) {
    if (legs.length < 2) return null;

    let totalDecimalOdds = 1;
    let combinedProb = 1;
    const parlayLegs = [];

    for (const leg of legs) {
      const analysis = this.analyzeProp(leg.player, leg.prop);
      if (!analysis) continue;

      const isOver = leg.side === 'over';
      const odds = isOver ? analysis.overOdds : analysis.underOdds;
      const prob = isOver 
        ? (analysis.hitRate?.over || 50) / 100 
        : (analysis.hitRate?.under || 50) / 100;

      const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
      totalDecimalOdds *= decimalOdds;
      combinedProb *= prob;

      parlayLegs.push({
        player: analysis.player,
        prop: `${leg.prop.toUpperCase()} ${isOver ? 'Over' : 'Under'} ${analysis.line}`,
        odds: odds,
        winProb: (prob * 100).toFixed(1) + '%',
        decimalOdds: decimalOdds.toFixed(2)
      });
    }

    const americanOdds = totalDecimalOdds >= 2 
      ? Math.round((totalDecimalOdds - 1) * 100)
      : Math.round(-100 / (totalDecimalOdds - 1));

    const payout = stake * totalDecimalOdds;
    const ev = (combinedProb * payout) - stake;
    const evPercent = ((ev / stake) * 100).toFixed(2);

    return {
      legs: parlayLegs,
      numLegs: parlayLegs.length,
      totalOdds: americanOdds > 0 ? `+${americanOdds}` : americanOdds,
      decimalOdds: totalDecimalOdds.toFixed(2),
      combinedProb: (combinedProb * 100).toFixed(2) + '%',
      stake: stake,
      potentialPayout: payout.toFixed(2),
      potentialProfit: (payout - stake).toFixed(2),
      ev: ev.toFixed(2),
      evPercent: evPercent,
      recommendation: ev > 0 
        ? `POSITIVE EV PARLAY (+${evPercent}%) — Worth the risk!`
        : `Negative EV (${evPercent}%) — Consider singles instead.`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get correlated props
  // ─────────────────────────────────────────────────────────────────────────────
  findCorrelatedProps(playerName) {
    const player = rayAnalytics.findPlayer(playerName);
    if (!player) return null;

    const correlations = [];
    const log = player.gameLog || [];

    // Analyze correlations from game log
    let highPtsHighReb = 0, highPtsHighAst = 0, winHighPts = 0;
    
    for (const game of log) {
      if (game.pts > player.season.pts && game.reb > player.season.reb) highPtsHighReb++;
      if (game.pts > player.season.pts && game.ast > player.season.ast) highPtsHighAst++;
      if (game.result === 'W' && game.pts > player.season.pts) winHighPts++;
    }

    const n = log.length || 1;

    if (highPtsHighReb / n > 0.6) {
      correlations.push({
        type: 'PTS + REB',
        correlation: ((highPtsHighReb / n) * 100).toFixed(0) + '%',
        description: `When ${player.name} scores big, he grabs more boards too.`,
        parlayIdea: `${player.name} PTS Over + REB Over — ${((highPtsHighReb / n) * 100).toFixed(0)}% hit rate together`
      });
    }

    if (highPtsHighAst / n > 0.5) {
      correlations.push({
        type: 'PTS + AST',
        correlation: ((highPtsHighAst / n) * 100).toFixed(0) + '%',
        description: `High scoring games often come with high assists.`,
        parlayIdea: `${player.name} PTS Over + AST Over — ${((highPtsHighAst / n) * 100).toFixed(0)}% hit rate together`
      });
    }

    if (winHighPts / n > 0.7) {
      correlations.push({
        type: 'WIN + PTS',
        correlation: ((winHighPts / n) * 100).toFixed(0) + '%',
        description: `${player.name} balls out in wins.`,
        parlayIdea: `Team ML + ${player.name} PTS Over — correlated success`
      });
    }

    return {
      player: player.name,
      correlations,
      recommendation: correlations.length > 0
        ? `Found ${correlations.length} strong correlation(s) for ${player.name} — good parlay building blocks.`
        : `No strong correlations found for ${player.name} — stick to singles.`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get today's best plays summary
  // ─────────────────────────────────────────────────────────────────────────────
  getTodaysBestPlays(count = 5) {
    const positiveEV = this.findPositiveEVProps(5);
    const sharpPlays = this.getSharpMoneyPlays();

    // Combine and rank
    const allPlays = [];

    for (const play of positiveEV) {
      const isSharp = sharpPlays.some(
        s => s.player === play.player && 
             play.prop.toLowerCase().includes(s.prop.toLowerCase()) &&
             play.prop.toLowerCase().includes(s.sharpSide.toLowerCase())
      );

      allPlays.push({
        ...play,
        hasSharpAction: isSharp,
        totalScore: play.edge + (isSharp ? 5 : 0) + (play.hitRate > 60 ? 3 : 0)
      });
    }

    return allPlays
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, count)
      .map((play, i) => ({
        rank: i + 1,
        ...play,
        summary: `${play.player} ${play.prop} @ ${play.odds > 0 ? '+' : ''}${play.odds} — ${play.edge}% edge, ${play.hitRate}% hit rate${play.hasSharpAction ? ' 🔥 SHARP' : ''}`
      }));
  }
}

// Export singleton instance
const rayPropIntelligence = new RayPropIntelligence();
export default rayPropIntelligence;
