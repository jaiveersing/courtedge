// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  💰 RAY PROP OPTIMIZER - ADVANCED BETTING OPTIMIZATION & STRATEGY ENGINE                                              ║
// ║  Portfolio Theory • Risk Management • Parlay Optimization • Line Shopping • Arbitrage Detection                      ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

import { BettingAlgorithms } from './RayEnhancedDatabase';
import { DescriptiveStatistics, MonteCarloSimulation } from './RayAdvancedStatistics';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 💼 MODERN PORTFOLIO THEORY FOR BETTING
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PortfolioOptimizer {
  
  static efficientFrontier(bets, targetReturn = 0.05) {
    // Calculate optimal bet allocation using Markowitz Portfolio Theory
    // bets = [{name, expectedReturn, variance, correlation}]
    
    const n = bets.length;
    const returns = bets.map(b => b.expectedReturn);
    const variances = bets.map(b => b.variance);
    
    // Create covariance matrix
    const covMatrix = this.createCovarianceMatrix(bets);
    
    // Optimize weights to minimize variance for given return
    const weights = this.optimizeWeights(returns, covMatrix, targetReturn);
    
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * returns[i], 0);
    const portfolioVariance = this.calculatePortfolioVariance(weights, covMatrix);
    const portfolioStd = Math.sqrt(portfolioVariance);
    
    const sharpeRatio = (portfolioReturn - 0.02) / portfolioStd; // Assuming 2% risk-free rate
    
    return {
      weights: weights.map((w, i) => ({
        bet: bets[i].name,
        weight: (w * 100).toFixed(2) + '%',
        allocation: w
      })),
      expectedReturn: (portfolioReturn * 100).toFixed(2) + '%',
      volatility: (portfolioStd * 100).toFixed(2) + '%',
      sharpeRatio: sharpeRatio.toFixed(3),
      diversification: this.diversificationScore(weights)
    };
  }

  static createCovarianceMatrix(bets) {
    const n = bets.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = bets[i].variance;
        } else {
          const correlation = bets[i].correlationWith?.[bets[j].name] || 0;
          matrix[i][j] = correlation * Math.sqrt(bets[i].variance * bets[j].variance);
        }
      }
    }
    
    return matrix;
  }

  static calculatePortfolioVariance(weights, covMatrix) {
    let variance = 0;
    
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * covMatrix[i][j];
      }
    }
    
    return variance;
  }

  static optimizeWeights(returns, covMatrix, targetReturn) {
    // Simplified optimization using equal risk contribution
    const n = returns.length;
    let weights = new Array(n).fill(1 / n);
    
    // Iterative adjustment toward target return
    for (let iter = 0; iter < 100; iter++) {
      const currentReturn = weights.reduce((sum, w, i) => sum + w * returns[i], 0);
      
      if (Math.abs(currentReturn - targetReturn) < 0.001) break;
      
      // Adjust weights toward target
      weights = weights.map((w, i) => {
        const adjustment = (targetReturn - currentReturn) * (returns[i] / this.sum(returns));
        return Math.max(0, w + adjustment);
      });
      
      // Normalize
      const total = this.sum(weights);
      weights = weights.map(w => w / total);
    }
    
    return weights;
  }

  static sum(array) {
    return array.reduce((a, b) => a + b, 0);
  }

  static diversificationScore(weights) {
    // Higher score = more diversified
    const effectiveN = 1 / weights.reduce((sum, w) => sum + w * w, 0);
    return {
      effectivePositions: effectiveN.toFixed(2),
      score: (effectiveN / weights.length * 100).toFixed(0) + '%'
    };
  }

  static varAnalysis(positions, confidence = 0.95) {
    // Value at Risk analysis
    const totalValue = positions.reduce((sum, p) => sum + p.amount, 0);
    const returns = positions.map(p => p.expectedReturn);
    const weights = positions.map(p => p.amount / totalValue);
    
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * returns[i], 0);
    const portfolioStd = Math.sqrt(
      positions.reduce((sum, p, i) => 
        sum + Math.pow(weights[i], 2) * p.variance, 0
      )
    );
    
    // Z-score for confidence level
    const zScore = confidence === 0.95 ? 1.645 : confidence === 0.99 ? 2.326 : 1.96;
    const var_ = portfolioReturn - zScore * portfolioStd;
    
    return {
      var: (var_ * 100).toFixed(2) + '%',
      varAmount: (totalValue * var_).toFixed(2),
      confidence: (confidence * 100).toFixed(0) + '%',
      interpretation: `${(confidence * 100).toFixed(0)}% confident max loss won't exceed ${Math.abs(var_ * 100).toFixed(2)}%`
    };
  }

  static conditionalVar(positions, confidence = 0.95) {
    // Expected Shortfall / CVaR
    const var_ = this.varAnalysis(positions, confidence);
    
    // CVaR is typically 1.3-1.5x worse than VaR
    const cvarMultiplier = 1.4;
    const cvar = parseFloat(var_.var) * cvarMultiplier;
    
    return {
      cvar: cvar.toFixed(2) + '%',
      interpretation: `Expected loss if worst ${((1 - confidence) * 100).toFixed(0)}% scenario occurs`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 PARLAY OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ParlayOptimizer {
  
  static optimizeParlaySize(legs, maxLegs = 6) {
    // Find optimal number of legs to maximize EV
    const results = [];
    
    for (let numLegs = 2; numLegs <= Math.min(maxLegs, legs.length); numLegs++) {
      const bestCombination = this.findBestCombination(legs, numLegs);
      results.push({
        legs: numLegs,
        ...bestCombination
      });
    }
    
    // Find leg count with highest EV
    const optimal = results.reduce((best, current) => 
      parseFloat(current.ev) > parseFloat(best.ev) ? current : best
    );
    
    return {
      optimal,
      allOptions: results,
      recommendation: `${optimal.legs}-leg parlay maximizes expected value at ${optimal.ev}%`
    };
  }

  static findBestCombination(legs, targetLegs) {
    // Greedy selection of best legs
    const sorted = [...legs].sort((a, b) => b.ev - a.ev);
    const selected = sorted.slice(0, targetLegs);
    
    const totalProb = selected.reduce((prod, leg) => prod * leg.winProb, 1);
    const totalOdds = selected.reduce((sum, leg) => sum + leg.odds, 0);
    const ev = (totalProb * totalOdds - (1 - totalProb) * 100) / 100;
    
    return {
      legs: selected.map(l => l.name),
      winProbability: (totalProb * 100).toFixed(2) + '%',
      totalOdds: totalOdds.toFixed(0),
      ev: (ev * 100).toFixed(2) + '%',
      payout: this.calculateParlayPayout(selected)
    };
  }

  static calculateParlayPayout(legs) {
    // American odds to decimal and multiply
    let payout = 1;
    
    for (const leg of legs) {
      const decimal = leg.odds > 0 
        ? (leg.odds / 100) + 1 
        : (100 / Math.abs(leg.odds)) + 1;
      payout *= decimal;
    }
    
    return payout.toFixed(2) + 'x';
  }

  static correlationAdjustment(legs) {
    // Adjust parlay probability for correlation
    let adjustedProb = 1;
    
    for (let i = 0; i < legs.length; i++) {
      adjustedProb *= legs[i].winProb;
      
      // Apply correlation penalty
      for (let j = i + 1; j < legs.length; j++) {
        const correlation = this.estimateCorrelation(legs[i], legs[j]);
        if (correlation > 0.3) {
          adjustedProb *= 0.95; // 5% penalty for each correlated pair
        }
      }
    }
    
    return {
      unadjustedProb: legs.reduce((p, l) => p * l.winProb, 1).toFixed(4),
      adjustedProb: adjustedProb.toFixed(4),
      adjustment: ((1 - adjustedProb / legs.reduce((p, l) => p * l.winProb, 1)) * 100).toFixed(1) + '%'
    };
  }

  static estimateCorrelation(leg1, leg2) {
    // Estimate correlation based on game/player relationships
    if (leg1.gameId === leg2.gameId) {
      if (leg1.team === leg2.team) return 0.6; // Same team
      return 0.4; // Opponents
    }
    return 0.1; // Different games
  }

  static roundRobinOptimizer(legs, parlaySize = 2) {
    // Generate all combinations of parlaySize from legs
    const combinations = this.getCombinations(legs, parlaySize);
    
    const parlays = combinations.map(combo => ({
      legs: combo.map(l => l.name),
      winProb: combo.reduce((p, l) => p * l.winProb, 1),
      payout: this.calculateParlayPayout(combo),
      ev: this.calculateEV(combo)
    }));
    
    const totalEV = parlays.reduce((sum, p) => sum + parseFloat(p.ev), 0);
    const avgEV = totalEV / parlays.length;
    
    return {
      totalParlays: parlays.length,
      parlays: parlays.slice(0, 10), // Top 10
      averageEV: avgEV.toFixed(2) + '%',
      recommendation: avgEV > 0 ? 'Positive EV round robin' : 'Negative EV - avoid'
    };
  }

  static getCombinations(array, size) {
    const result = [];
    
    const combine = (start, combo) => {
      if (combo.length === size) {
        result.push([...combo]);
        return;
      }
      
      for (let i = start; i < array.length; i++) {
        combo.push(array[i]);
        combine(i + 1, combo);
        combo.pop();
      }
    };
    
    combine(0, []);
    return result;
  }

  static calculateEV(legs) {
    const winProb = legs.reduce((p, l) => p * l.winProb, 1);
    const payout = parseFloat(this.calculateParlayPayout(legs));
    return ((winProb * payout - (1 - winProb)) * 100).toFixed(2);
  }

  static teaserAnalysis(legs, points = 6) {
    // Analyze teaser value
    const adjustedLegs = legs.map(leg => ({
      ...leg,
      line: leg.type === 'spread' ? leg.line + points : leg.line + points,
      winProb: this.adjustWinProbability(leg, points)
    }));
    
    const teaserProb = adjustedLegs.reduce((p, l) => p * l.winProb, 1);
    const teaserOdds = -110; // Standard teaser odds
    const ev = ((teaserProb * (100 / 110)) - (1 - teaserProb)) * 100;
    
    return {
      adjustedLines: adjustedLegs.map(l => `${l.name}: ${l.line}`),
      teaserWinProb: (teaserProb * 100).toFixed(2) + '%',
      ev: ev.toFixed(2) + '%',
      recommendation: ev > 0 ? 'Positive EV teaser' : 'Negative EV - pass'
    };
  }

  static adjustWinProbability(leg, points) {
    // Each point typically adds ~3-4% win probability around key numbers
    const baseIncrease = 0.035 * points;
    return Math.min(0.95, leg.winProb + baseIncrease);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔍 ARBITRAGE DETECTOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ArbitrageDetector {
  
  static detectArbitrage(odds1, odds2) {
    // Convert American odds to implied probability
    const prob1 = this.oddsToImpliedProb(odds1);
    const prob2 = this.oddsToImpliedProb(odds2);
    
    const totalProb = prob1 + prob2;
    const arbExists = totalProb < 1;
    
    if (!arbExists) {
      return {
        arbitrage: false,
        totalProbability: (totalProb * 100).toFixed(2) + '%',
        message: 'No arbitrage opportunity'
      };
    }
    
    const profitMargin = (1 - totalProb) * 100;
    
    // Calculate optimal stakes
    const stake1Pct = prob1 / totalProb;
    const stake2Pct = prob2 / totalProb;
    
    return {
      arbitrage: true,
      profitMargin: profitMargin.toFixed(2) + '%',
      totalProbability: (totalProb * 100).toFixed(2) + '%',
      stake1: (stake1Pct * 100).toFixed(2) + '%',
      stake2: (stake2Pct * 100).toFixed(2) + '%',
      guaranteedReturn: profitMargin.toFixed(2) + '%',
      recommendation: `Bet ${(stake1Pct * 100).toFixed(1)}% on odds ${odds1}, ${(stake2Pct * 100).toFixed(1)}% on odds ${odds2}`
    };
  }

  static oddsToImpliedProb(americanOdds) {
    if (americanOdds > 0) {
      return 100 / (americanOdds + 100);
    } else {
      return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
    }
  }

  static middlingOpportunity(line1, odds1, line2, odds2) {
    // Detect middling opportunities
    const lineGap = Math.abs(line1 - line2);
    
    if (lineGap < 2) {
      return {
        opportunity: false,
        message: 'Lines too close for middling'
      };
    }
    
    const prob1 = this.oddsToImpliedProb(odds1);
    const prob2 = this.oddsToImpliedProb(odds2);
    
    // Estimate probability of landing in the middle
    const middleProb = lineGap * 0.05; // Rough estimate
    
    const expectedValue = (middleProb * 2 - (prob1 + prob2)) * 100;
    
    return {
      opportunity: expectedValue > 0,
      lineGap: lineGap.toFixed(1),
      middleProbability: (middleProb * 100).toFixed(2) + '%',
      expectedValue: expectedValue.toFixed(2) + '%',
      recommendation: expectedValue > 0 
        ? `Middle opportunity: Bet both sides for ${expectedValue.toFixed(1)}% EV`
        : 'No profitable middle'
    };
  }

  static steamMoveDetection(historicalLines, currentLine) {
    // Detect sharp money movements
    const recentLines = historicalLines.slice(-5);
    const avgRecent = recentLines.reduce((sum, l) => sum + l, 0) / recentLines.length;
    
    const moveSize = Math.abs(currentLine - avgRecent);
    const moveDirection = currentLine > avgRecent ? 'up' : 'down';
    const moveSpeed = moveSize / recentLines.length;
    
    const isSteam = moveSize > 1.5 && moveSpeed > 0.3;
    
    return {
      steamMove: isSteam,
      moveSize: moveSize.toFixed(2),
      direction: moveDirection,
      speed: moveSpeed.toFixed(2),
      interpretation: isSteam 
        ? `STEAM MOVE: Sharp money moving line ${moveDirection} ${moveSize.toFixed(1)} points`
        : 'Normal line movement',
      action: isSteam 
        ? `Follow the sharp money - bet ${moveDirection === 'up' ? 'over' : 'under'}`
        : 'No clear sharp action'
    };
  }

  static valueThresholdCalculator(trueProb, bookOdds, edgeRequired = 0.03) {
    // Calculate minimum true probability needed for a bet to have value
    const impliedProb = this.oddsToImpliedProb(bookOdds);
    const actualEdge = trueProb - impliedProb;
    
    const hasValue = actualEdge >= edgeRequired;
    const kellyStake = Math.max(0, actualEdge);
    
    return {
      trueProb: (trueProb * 100).toFixed(2) + '%',
      impliedProb: (impliedProb * 100).toFixed(2) + '%',
      edge: (actualEdge * 100).toFixed(2) + '%',
      hasValue,
      kellyStake: (kellyStake * 100).toFixed(2) + '%',
      recommendation: hasValue 
        ? `VALUE BET: ${(actualEdge * 100).toFixed(1)}% edge, stake ${(kellyStake * 100).toFixed(1)}%`
        : `NO VALUE: Need ${((edgeRequired - actualEdge) * 100).toFixed(1)}% more edge`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 BANKROLL MANAGEMENT STRATEGIES
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class BankrollStrategies {
  
  static kellyCalculator(winProb, odds, bankroll, fraction = 0.25) {
    const b = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
    const p = winProb;
    const q = 1 - p;
    
    const fullKelly = Math.max(0, (b * p - q) / b);
    const fractionalKelly = fullKelly * fraction;
    const betSize = bankroll * fractionalKelly;
    
    const expectedGrowth = fractionalKelly * (b * p - q);
    const variance = fractionalKelly * fractionalKelly * b * b * p * q;
    
    return {
      fullKelly: (fullKelly * 100).toFixed(2) + '%',
      fractionalKelly: (fractionalKelly * 100).toFixed(2) + '%',
      betSize: betSize.toFixed(2),
      expectedGrowth: (expectedGrowth * 100).toFixed(2) + '%',
      variance: variance.toFixed(4),
      riskLevel: fullKelly > 0.15 ? 'High' : fullKelly > 0.08 ? 'Medium' : 'Low'
    };
  }

  static fixedUnitStrategy(bankroll, unitSize = 0.01) {
    // Conservative flat betting
    const units = bankroll * unitSize;
    
    return {
      strategy: 'Fixed Unit',
      unitSize: (unitSize * 100).toFixed(2) + '%',
      betSize: units.toFixed(2),
      unitsAvailable: Math.floor(bankroll / units),
      riskOfRuin: this.calculateRuinProbability(unitSize, 0.53, 100), // Assuming 53% win rate
      recommendation: 'Conservative approach, good for beginners'
    };
  }

  static martinaleWarning() {
    return {
      strategy: 'Martingale',
      warning: '⚠️ EXTREMELY DANGEROUS',
      problems: [
        'Exponential bet growth',
        'High probability of complete ruin',
        'Violates risk management principles',
        'Requires unlimited bankroll'
      ],
      recommendation: 'NEVER USE THIS STRATEGY',
      alternative: 'Use fractional Kelly instead'
    };
  }

  static percentageOfBankroll(bankroll, percentage = 0.02) {
    const betSize = bankroll * percentage;
    const betsUntilRuin = Math.floor(1 / percentage);
    
    return {
      strategy: 'Percentage of Bankroll',
      percentage: (percentage * 100).toFixed(2) + '%',
      betSize: betSize.toFixed(2),
      betsUntilRuin: `~${betsUntilRuin} consecutive losses`,
      flexibility: 'High - adjusts with bankroll',
      recommendation: percentage <= 0.02 ? 'Conservative and safe' : 'Consider reducing'
    };
  }

  static calculateRuinProbability(unitSize, winRate, numBets) {
    // Simplified ruin probability
    const edgePerBet = (2 * winRate - 1);
    const variance = 4 * winRate * (1 - winRate);
    
    const bankruptcyProb = Math.exp(-2 * edgePerBet * (1 / unitSize) / variance);
    
    return {
      probability: (Math.min(1, bankruptcyProb) * 100).toFixed(2) + '%',
      safety: bankruptcyProb < 0.01 ? 'Very Safe' : bankruptcyProb < 0.05 ? 'Safe' : 'Risky'
    };
  }

  static confidenceBased(bankroll, confidence, baseUnit = 0.02) {
    // Adjust bet size based on confidence level
    const multiplier = Math.max(0.5, Math.min(2, confidence / 0.6));
    const adjustedUnit = baseUnit * multiplier;
    const betSize = bankroll * adjustedUnit;
    
    return {
      confidence: (confidence * 100).toFixed(0) + '%',
      multiplier: multiplier.toFixed(2) + 'x',
      adjustedUnit: (adjustedUnit * 100).toFixed(2) + '%',
      betSize: betSize.toFixed(2),
      reasoning: `${confidence > 0.7 ? 'High' : confidence > 0.55 ? 'Medium' : 'Low'} confidence warrants ${multiplier.toFixed(1)}x base unit`
    };
  }

  static drawdownAnalysis(bettingHistory) {
    // Analyze historical drawdowns
    let peak = bettingHistory[0];
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    const drawdowns = [];
    
    bettingHistory.forEach(value => {
      if (value > peak) {
        peak = value;
        currentDrawdown = 0;
      } else {
        currentDrawdown = (peak - value) / peak;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      }
      drawdowns.push(currentDrawdown);
    });
    
    const avgDrawdown = drawdowns.reduce((sum, dd) => sum + dd, 0) / drawdowns.length;
    
    return {
      maxDrawdown: (maxDrawdown * 100).toFixed(2) + '%',
      averageDrawdown: (avgDrawdown * 100).toFixed(2) + '%',
      currentDrawdown: (currentDrawdown * 100).toFixed(2) + '%',
      recovery: currentDrawdown === 0 ? 'At peak' : `${((1 / (1 - currentDrawdown) - 1) * 100).toFixed(1)}% gain needed`,
      healthStatus: currentDrawdown < 0.1 ? 'Healthy' : currentDrawdown < 0.25 ? 'Stressed' : 'Critical'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎲 PROP BET OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PropBetOptimizer {
  
  static compareLines(props) {
    // Compare same prop across multiple books
    const bestOver = props.reduce((best, prop) => 
      prop.overOdds > best.overOdds ? prop : best
    );
    
    const bestUnder = props.reduce((best, prop) => 
      prop.underOdds > best.underOdds ? prop : best
    );
    
    const lineGap = Math.max(...props.map(p => p.line)) - Math.min(...props.map(p => p.line));
    
    return {
      bestOver: {
        book: bestOver.book,
        line: bestOver.line,
        odds: bestOver.overOdds,
        edge: this.calculateLineEdge(bestOver, props)
      },
      bestUnder: {
        book: bestUnder.book,
        line: bestUnder.line,
        odds: bestUnder.underOdds,
        edge: this.calculateLineEdge(bestUnder, props)
      },
      lineGap: lineGap.toFixed(1),
      recommendation: lineGap > 1 ? 'SIGNIFICANT LINE DISCREPANCY - investigate' : 'Lines aligned'
    };
  }

  static calculateLineEdge(prop, allProps) {
    const avgLine = allProps.reduce((sum, p) => sum + p.line, 0) / allProps.length;
    const lineDiff = prop.line - avgLine;
    return (lineDiff * 3).toFixed(1) + '%'; // Rough 3% per 0.5 points
  }

  static alternateLines(baseProps, playerAvg, playerStd) {
    // Generate alternate line values
    const alternates = [];
    
    for (let adjust = -3; adjust <= 3; adjust += 0.5) {
      if (adjust === 0) continue;
      
      const altLine = baseProps.line + adjust;
      const overProb = 1 - this.normalCDF((altLine - playerAvg) / playerStd);
      const underProb = 1 - overProb;
      
      const fairOverOdds = this.probToAmericanOdds(overProb);
      const fairUnderOdds = this.probToAmericanOdds(underProb);
      
      alternates.push({
        line: altLine.toFixed(1),
        overProb: (overProb * 100).toFixed(1) + '%',
        fairOverOdds,
        underProb: (underProb * 100).toFixed(1) + '%',
        fairUnderOdds
      });
    }
    
    return alternates;
  }

  static normalCDF(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  static probToAmericanOdds(prob) {
    if (prob >= 0.5) {
      return -Math.round((prob / (1 - prob)) * 100);
    } else {
      return Math.round(((1 - prob) / prob) * 100);
    }
  }

  static samegameParlayBuilder(playerProps, maxLegs = 4) {
    // Build optimal same game parlay
    const uncorrelated = this.findUncorrelatedProps(playerProps);
    const sorted = uncorrelated.sort((a, b) => b.ev - a.ev);
    const selected = sorted.slice(0, maxLegs);
    
    const combinedProb = selected.reduce((prob, prop) => prob * prop.winProb, 1);
    const adjustedProb = combinedProb * 0.85; // Correlation penalty
    
    return {
      legs: selected.map(p => ({
        player: p.player,
        prop: p.type,
        line: p.line,
        pick: p.side
      })),
      unadjustedProb: (combinedProb * 100).toFixed(2) + '%',
      adjustedProb: (adjustedProb * 100).toFixed(2) + '%',
      expectedPayout: this.calculateSGPPayout(selected),
      recommendation: adjustedProb > 0.3 ? 'Decent SGP' : 'Too many legs - reduce'
    };
  }

  static findUncorrelatedProps(props) {
    // Filter out highly correlated props
    const uncorrelated = [];
    
    for (const prop of props) {
      const isCorrelated = uncorrelated.some(p => 
        this.propsAreCorrelated(p, prop)
      );
      
      if (!isCorrelated) {
        uncorrelated.push(prop);
      }
    }
    
    return uncorrelated;
  }

  static propsAreCorrelated(prop1, prop2) {
    // Check if props are correlated
    if (prop1.player === prop2.player) return true; // Same player
    if (prop1.type === prop2.type) return true; // Same stat type
    return false;
  }

  static calculateSGPPayout(legs) {
    let payout = 1;
    legs.forEach(leg => {
      const decimal = leg.odds > 0 ? (leg.odds / 100) + 1 : (100 / Math.abs(leg.odds)) + 1;
      payout *= decimal;
    });
    return payout.toFixed(2) + 'x';
  }
}

export default {
  PortfolioOptimizer,
  ParlayOptimizer,
  ArbitrageDetector,
  BankrollStrategies,
  PropBetOptimizer
};
