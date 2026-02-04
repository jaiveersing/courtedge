// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  💰 RAY ADVANCED BANKROLL MANAGER - RISK MANAGEMENT & KELLY OPTIMIZATION                                            ║
// ║  Risk of Ruin • Kelly Criterion • Drawdown Analysis • Variance Management • Stake Optimization • Portfolio Theory   ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 💼 BANKROLL MANAGER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class BankrollManager {
  
  constructor(initialBankroll, riskTolerance = 'moderate') {
    this.initialBankroll = initialBankroll;
    this.currentBankroll = initialBankroll;
    this.riskTolerance = riskTolerance;
    this.history = [];
    this.highWaterMark = initialBankroll;
  }

  static analyzeBankroll(bankrollData) {
    const current = bankrollData.current;
    const initial = bankrollData.initial;
    const history = bankrollData.history || [];
    
    const performance = this.calculatePerformance(current, initial, history);
    const riskMetrics = this.calculateRiskMetrics(history, current);
    const healthScore = this.calculateHealthScore(performance, riskMetrics);
    const recommendations = this.generateRecommendations(healthScore, riskMetrics, current, initial);
    
    return {
      current_status: {
        bankroll: current.toFixed(2),
        roi: performance.roi,
        profit: performance.profit,
        units: (current / initial).toFixed(2)
      },
      performance,
      riskMetrics,
      healthScore,
      recommendations,
      projections: this.projectFuture(current, performance, riskMetrics)
    };
  }

  static calculatePerformance(current, initial, history) {
    const profit = current - initial;
    const roi = ((profit / initial) * 100).toFixed(2);
    
    const winningBets = history.filter(b => b.result === 'win').length;
    const losingBets = history.filter(b => b.result === 'loss').length;
    const totalBets = history.length;
    
    const winRate = totalBets > 0 ? ((winningBets / totalBets) * 100).toFixed(1) : '0.0';
    
    const avgWin = winningBets > 0
      ? history.filter(b => b.result === 'win').reduce((sum, b) => sum + b.profit, 0) / winningBets
      : 0;
    
    const avgLoss = losingBets > 0
      ? Math.abs(history.filter(b => b.result === 'loss').reduce((sum, b) => sum + b.profit, 0) / losingBets)
      : 0;
    
    const profitFactor = avgLoss > 0 ? (avgWin * winningBets) / (avgLoss * losingBets) : 0;
    
    return {
      roi: roi + '%',
      profit: profit.toFixed(2),
      winRate: winRate + '%',
      totalBets: totalBets,
      winningBets: winningBets,
      losingBets: losingBets,
      averageWin: avgWin.toFixed(2),
      averageLoss: avgLoss.toFixed(2),
      profitFactor: profitFactor.toFixed(2),
      rating: this.ratePerformance(parseFloat(roi), parseFloat(winRate), profitFactor)
    };
  }

  static ratePerformance(roi, winRate, profitFactor) {
    if (roi > 15 && winRate > 55 && profitFactor > 1.5) {
return 'Elite 🌟';
}
    if (roi > 10 && winRate > 52 && profitFactor > 1.3) {
return 'Excellent ⭐';
}
    if (roi > 5 && winRate > 50 && profitFactor > 1.1) {
return 'Good ✅';
}
    if (roi > 0 && winRate > 48) {
return 'Profitable 💰';
}
    if (roi > -5) {
return 'Break-even ➡️';
}
    if (roi > -10) {
return 'Struggling 📉';
}
    return 'Poor 🚨';
  }

  static calculateRiskMetrics(history, currentBankroll) {
    if (history.length === 0) {
      return {
        maxDrawdown: '0%',
        currentDrawdown: '0%',
        volatility: '0%',
        sharpeRatio: '0.00',
        riskOfRuin: '0%'
      };
    }
    
    const drawdowns = this.calculateDrawdowns(history);
    const returns = this.calculateReturns(history);
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns, volatility);
    const riskOfRuin = this.calculateRiskOfRuin(currentBankroll, history);
    
    return {
      maxDrawdown: drawdowns.max + '%',
      currentDrawdown: drawdowns.current + '%',
      drawdownStatus: drawdowns.status,
      volatility: volatility.toFixed(2) + '%',
      sharpeRatio: sharpeRatio,
      riskOfRuin: riskOfRuin,
      varMetrics: this.calculateVaR(returns, currentBankroll)
    };
  }

  static calculateDrawdowns(history) {
    let peak = history[0]?.bankroll || 0;
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    
    history.forEach(entry => {
      const bankroll = entry.bankroll;
      
      if (bankroll > peak) {
        peak = bankroll;
      }
      
      const drawdown = ((peak - bankroll) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
      currentDrawdown = drawdown;
    });
    
    return {
      max: maxDrawdown.toFixed(2),
      current: currentDrawdown.toFixed(2),
      status: currentDrawdown > 20 ? '🚨 Severe' : currentDrawdown > 10 ? '⚠️ Moderate' : currentDrawdown > 5 ? '📊 Mild' : '✅ Minimal'
    };
  }

  static calculateReturns(history) {
    const returns = [];
    
    for (let i = 1; i < history.length; i++) {
      const returnPct = ((history[i].bankroll - history[i-1].bankroll) / history[i-1].bankroll) * 100;
      returns.push(returnPct);
    }
    
    return returns;
  }

  static calculateVolatility(returns) {
    if (returns.length === 0) {
return 0;
}
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev;
  }

  static calculateSharpeRatio(returns, volatility) {
    if (returns.length === 0 || volatility === 0) {
return '0.00';
}
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 0; // Assume 0 for betting
    
    const sharpe = (avgReturn - riskFreeRate) / volatility;
    
    return sharpe.toFixed(2);
  }

  static calculateRiskOfRuin(bankroll, history) {
    if (history.length < 10) {
return 'Insufficient data';
}
    
    const winRate = history.filter(b => b.result === 'win').length / history.length;
    const avgStake = history.reduce((sum, b) => sum + (b.stake || 0), 0) / history.length;
    const avgOdds = history.reduce((sum, b) => sum + (b.odds || 2.0), 0) / history.length;
    
    // Simplified risk of ruin calculation
    const edgePerBet = (winRate * (avgOdds - 1)) - (1 - winRate);
    const kellyFraction = edgePerBet / (avgOdds - 1);
    const typicalStakePct = (avgStake / bankroll) * 100;
    
    let ruinProb = 0;
    
    if (edgePerBet <= 0) {
      ruinProb = 100; // No edge = eventual ruin
    } else if (typicalStakePct > kellyFraction * 100 * 2) {
      ruinProb = 25; // Over-betting significantly
    } else if (typicalStakePct > kellyFraction * 100) {
      ruinProb = 10; // Slightly over-betting
    } else {
      ruinProb = Math.max(0, 5 - edgePerBet * 50); // Conservative with edge
    }
    
    return {
      probability: Math.min(100, ruinProb).toFixed(1) + '%',
      risk_level: ruinProb > 20 ? '🚨 High' : ruinProb > 10 ? '⚠️ Moderate' : ruinProb > 5 ? '📊 Low' : '✅ Very Low',
      recommendation: ruinProb > 15 ? 'Reduce stake sizes immediately' : ruinProb > 8 ? 'Consider more conservative sizing' : 'Risk levels acceptable'
    };
  }

  static calculateVaR(returns, bankroll) {
    if (returns.length === 0) {
return { var_95: '0', var_99: '0' };
}
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    
    const var95Index = Math.floor(returns.length * 0.05);
    const var99Index = Math.floor(returns.length * 0.01);
    
    const var95 = sortedReturns[var95Index] || 0;
    const var99 = sortedReturns[var99Index] || 0;
    
    return {
      var_95: {
        percentage: var95.toFixed(2) + '%',
        amount: (bankroll * var95 / 100).toFixed(2),
        interpretation: '95% confidence: Won\'t lose more than this in single bet'
      },
      var_99: {
        percentage: var99.toFixed(2) + '%',
        amount: (bankroll * var99 / 100).toFixed(2),
        interpretation: '99% confidence: Won\'t lose more than this in single bet'
      }
    };
  }

  static calculateHealthScore(performance, riskMetrics) {
    let score = 50; // Base score
    
    // Performance factors
    const roi = parseFloat(performance.roi);
    if (roi > 15) {
score += 25;
} else if (roi > 10) {
score += 20;
} else if (roi > 5) {
score += 15;
} else if (roi > 0) {
score += 10;
} else if (roi > -5) {
score += 0;
} else {
score -= 15;
}
    
    const winRate = parseFloat(performance.winRate);
    if (winRate > 55) {
score += 15;
} else if (winRate > 52) {
score += 10;
} else if (winRate > 50) {
score += 5;
} else if (winRate > 48) {
score += 0;
} else {
score -= 10;
}
    
    // Risk factors
    const maxDD = parseFloat(riskMetrics.maxDrawdown);
    if (maxDD > 30) {
score -= 20;
} else if (maxDD > 20) {
score -= 15;
} else if (maxDD > 10) {
score -= 5;
}
    
    const currentDD = parseFloat(riskMetrics.currentDrawdown);
    if (currentDD > 20) {
score -= 15;
} else if (currentDD > 10) {
score -= 8;
} else if (currentDD > 5) {
score -= 3;
}
    
    const sharpe = parseFloat(riskMetrics.sharpeRatio);
    if (sharpe > 2) {
score += 10;
} else if (sharpe > 1) {
score += 5;
} else if (sharpe < 0) {
score -= 10;
}
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: score,
      grade: this.gradeHealth(score),
      status: this.describeHealth(score),
      color: this.getHealthColor(score)
    };
  }

  static gradeHealth(score) {
    if (score >= 90) {
return 'A+ (Exceptional)';
}
    if (score >= 85) {
return 'A (Excellent)';
}
    if (score >= 80) {
return 'A- (Very Good)';
}
    if (score >= 75) {
return 'B+ (Good)';
}
    if (score >= 70) {
return 'B (Above Average)';
}
    if (score >= 65) {
return 'B- (Satisfactory)';
}
    if (score >= 60) {
return 'C+ (Acceptable)';
}
    if (score >= 55) {
return 'C (Fair)';
}
    if (score >= 50) {
return 'C- (Marginal)';
}
    if (score >= 45) {
return 'D+ (Poor)';
}
    if (score >= 40) {
return 'D (Very Poor)';
}
    return 'F (Critical)';
  }

  static describeHealth(score) {
    if (score >= 80) {
return '✅ Excellent bankroll health - Continue current strategy';
}
    if (score >= 70) {
return '👍 Good bankroll health - Minor optimizations possible';
}
    if (score >= 60) {
return '⚖️ Fair bankroll health - Some improvements needed';
}
    if (score >= 50) {
return '⚠️ Marginal bankroll health - Significant changes recommended';
}
    if (score >= 40) {
return '🚨 Poor bankroll health - Major changes required';
}
    return '🆘 Critical bankroll health - STOP BETTING and reassess';
  }

  static getHealthColor(score) {
    if (score >= 80) {
return 'green';
}
    if (score >= 60) {
return 'yellow';
}
    if (score >= 40) {
return 'orange';
}
    return 'red';
  }

  static generateRecommendations(healthScore, riskMetrics, current, initial) {
    const recommendations = [];
    const score = healthScore.score;
    
    // Critical situations
    if (score < 40) {
      recommendations.push({
        priority: 'URGENT',
        action: 'STOP BETTING IMMEDIATELY',
        reason: 'Critical bankroll health - reassess entire strategy',
        timeframe: 'Now'
      });
    }
    
    // Drawdown management
    const currentDD = parseFloat(riskMetrics.currentDrawdown);
    if (currentDD > 20) {
      recommendations.push({
        priority: 'High',
        action: 'Reduce bet sizes by 50%',
        reason: `In ${currentDD}% drawdown - protect remaining bankroll`,
        timeframe: 'Immediate'
      });
    } else if (currentDD > 10) {
      recommendations.push({
        priority: 'Medium',
        action: 'Reduce bet sizes by 25%',
        reason: `In ${currentDD}% drawdown - conservative approach warranted`,
        timeframe: 'Next session'
      });
    }
    
    // Risk of ruin
    if (typeof riskMetrics.riskOfRuin === 'object' && parseFloat(riskMetrics.riskOfRuin.probability) > 15) {
      recommendations.push({
        priority: 'High',
        action: 'Implement strict Kelly Criterion',
        reason: `${riskMetrics.riskOfRuin.probability} risk of ruin is too high`,
        timeframe: 'Immediate'
      });
    }
    
    // Volatility management
    const volatility = parseFloat(riskMetrics.volatility);
    if (volatility > 15) {
      recommendations.push({
        priority: 'Medium',
        action: 'Diversify bet types and reduce correlation',
        reason: `${volatility}% volatility is excessive`,
        timeframe: '1 week'
      });
    }
    
    // Sharpe ratio improvement
    const sharpe = parseFloat(riskMetrics.sharpeRatio);
    if (sharpe < 0.5) {
      recommendations.push({
        priority: 'Medium',
        action: 'Improve bet selection quality',
        reason: `Sharpe ratio of ${sharpe} indicates poor risk-adjusted returns`,
        timeframe: '2 weeks'
      });
    }
    
    // Positive recommendations
    if (score > 80 && current > initial * 1.2) {
      recommendations.push({
        priority: 'Low',
        action: 'Consider withdrawing profits',
        reason: 'Lock in gains - withdraw 30-50% of profit',
        timeframe: 'Next month'
      });
    }
    
    if (score > 75 && sharpe > 1.5) {
      recommendations.push({
        priority: 'Low',
        action: 'Slightly increase unit size',
        reason: 'Strong performance justifies 10-15% unit increase',
        timeframe: 'Next quarter'
      });
    }
    
    return recommendations.length > 0 ? recommendations : [{
      priority: 'Low',
      action: 'Maintain current strategy',
      reason: 'Bankroll health is acceptable',
      timeframe: 'Ongoing'
    }];
  }

  static projectFuture(current, performance, riskMetrics) {
    const roi = parseFloat(performance.roi) / 100;
    const volatility = parseFloat(riskMetrics.volatility) / 100;
    const totalBets = performance.totalBets;
    
    // Estimate bets per month (assuming current is lifetime)
    const betsPerMonth = totalBets > 0 ? Math.max(20, totalBets / 3) : 30;
    
    const scenarios = {
      conservative: this.projectScenario(current, roi * 0.7, volatility, betsPerMonth, 3),
      expected: this.projectScenario(current, roi, volatility, betsPerMonth, 3),
      optimistic: this.projectScenario(current, roi * 1.3, volatility, betsPerMonth, 3)
    };
    
    return {
      scenarios,
      assumptions: {
        betsPerMonth: Math.round(betsPerMonth),
        timeHorizon: '3 months',
        basedOn: `${totalBets} historical bets`
      },
      recommendation: this.getProjectionRecommendation(scenarios)
    };
  }

  static projectScenario(initial, monthlyROI, volatility, betsPerMonth, months) {
    let bankroll = initial;
    const projections = [bankroll];
    
    for (let i = 0; i < months; i++) {
      // Add expected return
      const expectedGrowth = bankroll * monthlyROI;
      // Add random volatility (simplified)
      const volatilityImpact = bankroll * volatility * (Math.random() - 0.5) * 2;
      
      bankroll += expectedGrowth + volatilityImpact;
      bankroll = Math.max(initial * 0.1, bankroll); // Floor at 10% of initial
      
      projections.push(bankroll);
    }
    
    const finalBankroll = projections[projections.length - 1];
    const totalReturn = ((finalBankroll - initial) / initial) * 100;
    
    return {
      start: initial.toFixed(2),
      end: finalBankroll.toFixed(2),
      change: (finalBankroll - initial).toFixed(2),
      returnPct: totalReturn.toFixed(1) + '%',
      projections: projections.map(p => p.toFixed(2))
    };
  }

  static getProjectionRecommendation(scenarios) {
    const conservative = parseFloat(scenarios.conservative.returnPct);
    const expected = parseFloat(scenarios.expected.returnPct);
    const optimistic = parseFloat(scenarios.optimistic.returnPct);
    
    if (conservative < -20) {
      return '🚨 High risk of significant loss - reconsider betting activity';
    }
    
    if (expected > 20 && conservative > 0) {
      return '🌟 Strong upside potential with acceptable downside risk';
    }
    
    if (expected > 10) {
      return '📈 Positive expected value - maintain disciplined approach';
    }
    
    if (expected > 0) {
      return '⚖️ Marginal expected value - focus on bet quality';
    }
    
    return '⚠️ Negative expected value - strategy changes needed';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 KELLY CRITERION OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class KellyOptimizer {
  
  static calculateOptimalStake(winProbability, odds, bankroll, options = {}) {
    const {
      fractionalKelly = 0.25, // Use 25% of full Kelly by default
      maxStakePercent = 5,    // Never risk more than 5% of bankroll
      minStakePercent = 0.5,  // Minimum 0.5% stake
      edgeThreshold = 0.02    // Minimum 2% edge required
    } = options;
    
    const decimalOdds = this.convertToDecimalOdds(odds);
    const edge = this.calculateEdge(winProbability, decimalOdds);
    
    if (edge < edgeThreshold) {
      return {
        stake: 0,
        stakePercent: '0%',
        recommendation: 'NO BET - Insufficient edge',
        edge: (edge * 100).toFixed(2) + '%',
        reason: `Edge of ${(edge * 100).toFixed(2)}% is below ${(edgeThreshold * 100)}% threshold`
      };
    }
    
    const fullKelly = this.calculateFullKelly(winProbability, decimalOdds);
    const fractionalKellyStake = fullKelly * fractionalKelly;
    
    // Apply constraints
    let finalStakePercent = Math.min(fractionalKellyStake, maxStakePercent / 100);
    finalStakePercent = Math.max(finalStakePercent, minStakePercent / 100);
    
    const stakeAmount = bankroll * finalStakePercent;
    
    return {
      stake: stakeAmount.toFixed(2),
      stakePercent: (finalStakePercent * 100).toFixed(2) + '%',
      fullKelly: (fullKelly * 100).toFixed(2) + '%',
      fractionalUsed: (fractionalKelly * 100) + '%',
      edge: (edge * 100).toFixed(2) + '%',
      recommendation: this.generateKellyRecommendation(edge, finalStakePercent),
      expectedValue: this.calculateExpectedValue(stakeAmount, winProbability, decimalOdds),
      variance: this.calculateVariance(stakeAmount, winProbability, decimalOdds),
      optimalityScore: this.scoreOptimality(edge, finalStakePercent, fullKelly)
    };
  }

  static convertToDecimalOdds(odds) {
    if (typeof odds === 'object' && odds.decimal) {
      return odds.decimal;
    }
    
    if (typeof odds === 'number') {
      if (odds > 0) {
        // American odds (positive)
        return (odds / 100) + 1;
      } else {
        // American odds (negative)
        return (100 / Math.abs(odds)) + 1;
      }
    }
    
    return odds; // Assume already decimal
  }

  static calculateEdge(winProb, decimalOdds) {
    const expectedValue = (winProb * (decimalOdds - 1)) - (1 - winProb);
    return expectedValue;
  }

  static calculateFullKelly(winProb, decimalOdds) {
    const q = 1 - winProb;
    const b = decimalOdds - 1;
    
    const kelly = (winProb * b - q) / b;
    
    return Math.max(0, kelly); // Never negative
  }

  static generateKellyRecommendation(edge, stakePercent) {
    if (edge > 0.15) {
      return `🌟 STRONG BET - Excellent ${(edge * 100).toFixed(1)}% edge, stake ${(stakePercent * 100).toFixed(1)}%`;
    }
    
    if (edge > 0.08) {
      return `✅ GOOD BET - Solid ${(edge * 100).toFixed(1)}% edge, stake ${(stakePercent * 100).toFixed(1)}%`;
    }
    
    if (edge > 0.04) {
      return `📊 PLAYABLE - Moderate ${(edge * 100).toFixed(1)}% edge, stake ${(stakePercent * 100).toFixed(1)}%`;
    }
    
    return `⚖️ MARGINAL - Small ${(edge * 100).toFixed(1)}% edge, stake ${(stakePercent * 100).toFixed(1)}%`;
  }

  static calculateExpectedValue(stake, winProb, decimalOdds) {
    const expectedReturn = (stake * decimalOdds * winProb) + (stake * (winProb - 1));
    const ev = expectedReturn - stake;
    
    return {
      amount: ev.toFixed(2),
      percentage: ((ev / stake) * 100).toFixed(2) + '%',
      interpretation: ev > 0 ? 'Positive EV ✅' : 'Negative EV ❌'
    };
  }

  static calculateVariance(stake, winProb, decimalOdds) {
    const winReturn = stake * (decimalOdds - 1);
    const lossReturn = -stake;
    
    const expectedReturn = (winReturn * winProb) + (lossReturn * (1 - winProb));
    
    const variance = (winProb * Math.pow(winReturn - expectedReturn, 2)) + 
                    ((1 - winProb) * Math.pow(lossReturn - expectedReturn, 2));
    
    const stdDev = Math.sqrt(variance);
    
    return {
      variance: variance.toFixed(2),
      standardDeviation: stdDev.toFixed(2),
      coefficientOfVariation: ((stdDev / Math.abs(expectedReturn)) * 100).toFixed(1) + '%',
      risk: stdDev > stake * 1.5 ? 'High' : stdDev > stake ? 'Moderate' : 'Low'
    };
  }

  static scoreOptimality(edge, actualStake, fullKelly) {
    let score = 50; // Base score
    
    // Reward having an edge
    score += Math.min(30, edge * 200);
    
    // Penalize over-betting
    if (actualStake > fullKelly * 0.5) {
      score -= 20;
    } else if (actualStake > fullKelly * 0.3) {
      score -= 10;
    }
    
    // Penalize under-betting with big edge
    if (edge > 0.10 && actualStake < fullKelly * 0.15) {
      score -= 15;
    }
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: score,
      rating: score > 80 ? 'Optimal' : score > 65 ? 'Good' : score > 50 ? 'Acceptable' : 'Suboptimal',
      feedback: this.getOptimalityFeedback(score, edge, actualStake, fullKelly)
    };
  }

  static getOptimalityFeedback(score, edge, actual, full) {
    if (score > 80) {
      return '✅ Excellent bet sizing - well within Kelly guidelines';
    }
    
    if (actual > full * 0.5) {
      return '⚠️ Over-betting relative to Kelly - reduce size for longevity';
    }
    
    if (edge > 0.10 && actual < full * 0.15) {
      return '📈 Under-betting strong edge - consider larger size';
    }
    
    if (score < 50) {
      return '❌ Suboptimal sizing - review Kelly calculations';
    }
    
    return '📊 Acceptable sizing - minor optimizations possible';
  }

  static optimizePortfolioKelly(bets, bankroll) {
    // Optimize multiple simultaneous bets using Kelly
    const correlationMatrix = this.estimateCorrelations(bets);
    const individualKellys = bets.map(bet => 
      this.calculateOptimalStake(bet.winProb, bet.odds, bankroll, { fractionalKelly: 0.25 })
    );
    
    // Adjust for correlations
    const adjustedStakes = this.adjustForCorrelations(individualKellys, correlationMatrix, bankroll);
    
    return {
      individual: individualKellys,
      adjusted: adjustedStakes,
      totalExposure: this.calculateTotalExposure(adjustedStakes),
      diversificationBenefit: this.calculateDiversificationBenefit(individualKellys, adjustedStakes),
      recommendation: this.generatePortfolioRecommendation(adjustedStakes, bankroll)
    };
  }

  static estimateCorrelations(bets) {
    // Simplified correlation estimation
    const n = bets.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1.0; // Perfect correlation with self
        } else {
          // Estimate correlation based on bet characteristics
          matrix[i][j] = this.estimatePairwiseCorrelation(bets[i], bets[j]);
        }
      }
    }
    
    return matrix;
  }

  static estimatePairwiseCorrelation(bet1, bet2) {
    let correlation = 0;
    
    // Same game = high correlation
    if (bet1.gameId === bet2.gameId) {
correlation = 0.7;
}
    // Same team = moderate correlation
    else if (bet1.team === bet2.team) {
correlation = 0.4;
}
    // Same day = low correlation
    else if (bet1.date === bet2.date) {
correlation = 0.2;
}
    // Different = very low correlation
    else {
correlation = 0.1;
}
    
    return correlation;
  }

  static adjustForCorrelations(kellys, correlations, bankroll) {
    // Reduce stakes when bets are correlated
    return kellys.map((kelly, i) => {
      let adjustment = 1.0;
      
      kellys.forEach((otherKelly, j) => {
        if (i !== j && correlations[i][j] > 0.3) {
          // Reduce stake proportional to correlation
          adjustment *= (1 - correlations[i][j] * 0.3);
        }
      });
      
      return {
        ...kelly,
        adjustedStake: (parseFloat(kelly.stake) * adjustment).toFixed(2),
        adjustmentFactor: adjustment.toFixed(2),
        reason: adjustment < 1 ? 'Reduced due to correlation' : 'No adjustment needed'
      };
    });
  }

  static calculateTotalExposure(stakes) {
    const total = stakes.reduce((sum, stake) => sum + parseFloat(stake.adjustedStake || stake.stake), 0);
    
    return {
      amount: total.toFixed(2),
      warning: total > 1000 ? '⚠️ High total exposure' : null
    };
  }

  static calculateDiversificationBenefit(individual, adjusted) {
    const individualTotal = individual.reduce((sum, s) => sum + parseFloat(s.stake), 0);
    const adjustedTotal = adjusted.reduce((sum, s) => sum + parseFloat(s.adjustedStake), 0);
    
    const reduction = ((individualTotal - adjustedTotal) / individualTotal) * 100;
    
    return {
      reduction: reduction.toFixed(1) + '%',
      benefit: reduction > 15 ? 'High' : reduction > 8 ? 'Moderate' : 'Low',
      interpretation: `Correlation adjustments reduced exposure by ${reduction.toFixed(1)}%`
    };
  }

  static generatePortfolioRecommendation(stakes, bankroll) {
    const totalExposure = stakes.reduce((sum, s) => sum + parseFloat(s.adjustedStake), 0);
    const exposurePercent = (totalExposure / bankroll) * 100;
    
    if (exposurePercent > 20) {
      return '🚨 EXCESSIVE EXPOSURE - Reduce number of bets or sizes';
    }
    
    if (exposurePercent > 12) {
      return '⚠️ HIGH EXPOSURE - Monitor closely, consider reducing';
    }
    
    if (exposurePercent > 7) {
      return '📊 MODERATE EXPOSURE - Acceptable but watch limits';
    }
    
    return '✅ CONTROLLED EXPOSURE - Well-diversified portfolio';
  }
}

export default {
  BankrollManager,
  KellyOptimizer
};
