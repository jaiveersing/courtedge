// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🎲 RAY GAME THEORY ENGINE - STRATEGIC DECISION MAKING & NASH EQUILIBRIUM                                           ║
// ║  Nash Equilibrium • Dominant Strategies • Payoff Matrices • Mixed Strategy • Betting Psychology                    ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 NASH EQUILIBRIUM CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class NashEquilibriumSolver {
  
  static solveNashEquilibrium(payoffMatrix) {
    // Find Nash equilibrium for 2x2 games
    // payoffMatrix = [[a1, b1], [a2, b2]] for player 1, [[c1, d1], [c2, d2]] for player 2
    
    const pureStrategies = this.findPureStrategyNash(payoffMatrix);
    const mixedStrategies = this.findMixedStrategyNash(payoffMatrix);
    
    return {
      pureStrategyEquilibria: pureStrategies,
      mixedStrategyEquilibrium: mixedStrategies,
      recommendation: this.interpretEquilibrium(pureStrategies, mixedStrategies),
      stability: this.analyzeStability(pureStrategies, mixedStrategies)
    };
  }

  static findPureStrategyNash(payoffMatrix) {
    const equilibria = [];
    const p1Matrix = payoffMatrix.player1;
    const p2Matrix = payoffMatrix.player2;
    
    // Check all strategy combinations
    for (let i = 0; i < p1Matrix.length; i++) {
      for (let j = 0; j < p1Matrix[i].length; j++) {
        if (this.isPureNash(p1Matrix, p2Matrix, i, j)) {
          equilibria.push({
            player1Strategy: i,
            player2Strategy: j,
            payoffs: {
              player1: p1Matrix[i][j],
              player2: p2Matrix[i][j]
            }
          });
        }
      }
    }
    
    return equilibria;
  }

  static isPureNash(p1Matrix, p2Matrix, row, col) {
    // Check if (row, col) is a Nash equilibrium
    
    // Player 1 should not want to deviate
    for (let i = 0; i < p1Matrix.length; i++) {
      if (p1Matrix[i][col] > p1Matrix[row][col]) {
        return false;
      }
    }
    
    // Player 2 should not want to deviate
    for (let j = 0; j < p1Matrix[0].length; j++) {
      if (p2Matrix[row][j] > p2Matrix[row][col]) {
        return false;
      }
    }
    
    return true;
  }

  static findMixedStrategyNash(payoffMatrix) {
    // For 2x2 games, calculate mixed strategy Nash equilibrium
    const p1 = payoffMatrix.player1;
    const p2 = payoffMatrix.player2;
    
    if (p1.length !== 2 || p1[0].length !== 2) {
      return { exists: false, reason: "Only 2x2 games supported for mixed strategy" };
    }
    
    // Calculate probabilities using indifference principle
    const p = this.calculateMixedStrategyProbability(p2);
    const q = this.calculateMixedStrategyProbability(p1, true);
    
    if (p === null || q === null) {
      return { exists: false, reason: "No valid mixed strategy equilibrium" };
    }
    
    const expectedPayoffs = this.calculateExpectedPayoffs(p1, p2, p, q);
    
    return {
      exists: true,
      player1Probabilities: { strategy1: p, strategy2: 1 - p },
      player2Probabilities: { strategy1: q, strategy2: 1 - q },
      expectedPayoffs,
      interpretation: this.interpretMixedStrategy(p, q)
    };
  }

  static calculateMixedStrategyProbability(matrix, transpose = false) {
    let a, b, c, d;
    
    if (transpose) {
      a = matrix[0][0];
      b = matrix[1][0];
      c = matrix[0][1];
      d = matrix[1][1];
    } else {
      a = matrix[0][0];
      b = matrix[0][1];
      c = matrix[1][0];
      d = matrix[1][1];
    }
    
    const denominator = (a - c) + (d - b);
    
    if (Math.abs(denominator) < 0.0001) {
      return null;
    }
    
    const p = (d - b) / denominator;
    
    // Check if probability is valid (between 0 and 1)
    if (p < 0 || p > 1) {
      return null;
    }
    
    return p;
  }

  static calculateExpectedPayoffs(p1Matrix, p2Matrix, p, q) {
    const ep1 = p * q * p1Matrix[0][0] + 
                p * (1 - q) * p1Matrix[0][1] + 
                (1 - p) * q * p1Matrix[1][0] + 
                (1 - p) * (1 - q) * p1Matrix[1][1];
    
    const ep2 = p * q * p2Matrix[0][0] + 
                p * (1 - q) * p2Matrix[0][1] + 
                (1 - p) * q * p2Matrix[1][0] + 
                (1 - p) * (1 - q) * p2Matrix[1][1];
    
    return {
      player1: ep1.toFixed(3),
      player2: ep2.toFixed(3)
    };
  }

  static interpretEquilibrium(pure, mixed) {
    if (pure.length > 0) {
      return `Found ${pure.length} pure strategy Nash equilibrium(a). Players should stick to deterministic strategies.`;
    }
    
    if (mixed.exists) {
      return "No pure strategy equilibrium exists. Players should use mixed strategies (randomize).";
    }
    
    return "No Nash equilibrium found. Game may need different analysis approach.";
  }

  static interpretMixedStrategy(p, q) {
    return {
      player1: `Play strategy 1 with ${(p * 100).toFixed(1)}% probability`,
      player2: `Play strategy 1 with ${(q * 100).toFixed(1)}% probability`,
      advice: "Randomize according to these probabilities to remain unpredictable"
    };
  }

  static analyzeStability(pure, mixed) {
    if (pure.length > 1) {
      return "Multiple equilibria exist - coordination may be difficult";
    }
    
    if (pure.length === 1) {
      return "Unique pure strategy equilibrium - highly stable";
    }
    
    if (mixed.exists) {
      return "Mixed strategy equilibrium - requires careful randomization";
    }
    
    return "No equilibrium - unstable game";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎲 DOMINANT STRATEGY ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class DominantStrategyAnalyzer {
  
  static findDominantStrategies(payoffMatrix) {
    const p1Dominant = this.findPlayerDominantStrategy(payoffMatrix.player1, 'row');
    const p2Dominant = this.findPlayerDominantStrategy(payoffMatrix.player2, 'column');
    
    return {
      player1: p1Dominant,
      player2: p2Dominant,
      dominanceSolvable: p1Dominant.exists && p2Dominant.exists,
      recommendation: this.generateDominanceRecommendation(p1Dominant, p2Dominant)
    };
  }

  static findPlayerDominantStrategy(matrix, type) {
    const strategies = type === 'row' ? matrix : this.transposeMatrix(matrix);
    
    for (let i = 0; i < strategies.length; i++) {
      let isDominant = true;
      
      for (let j = 0; j < strategies.length; j++) {
        if (i === j) continue;
        
        // Check if strategy i dominates strategy j
        let dominatesAll = true;
        for (let k = 0; k < strategies[i].length; k++) {
          if (strategies[i][k] <= strategies[j][k]) {
            dominatesAll = false;
            break;
          }
        }
        
        if (!dominatesAll) {
          isDominant = false;
          break;
        }
      }
      
      if (isDominant) {
        return {
          exists: true,
          strategy: i,
          type: 'Strictly Dominant',
          advice: `Always play strategy ${i}`
        };
      }
    }
    
    // Check for weakly dominant strategies
    const weaklyDominant = this.findWeaklyDominantStrategy(strategies);
    
    return weaklyDominant || {
      exists: false,
      strategy: null,
      type: 'None',
      advice: 'No dominant strategy - use Nash equilibrium analysis'
    };
  }

  static findWeaklyDominantStrategy(strategies) {
    for (let i = 0; i < strategies.length; i++) {
      let isWeaklyDominant = true;
      let strictlyBetterSomewhere = false;
      
      for (let j = 0; j < strategies.length; j++) {
        if (i === j) continue;
        
        for (let k = 0; k < strategies[i].length; k++) {
          if (strategies[i][k] < strategies[j][k]) {
            isWeaklyDominant = false;
            break;
          }
          if (strategies[i][k] > strategies[j][k]) {
            strictlyBetterSomewhere = true;
          }
        }
        
        if (!isWeaklyDominant) break;
      }
      
      if (isWeaklyDominant && strictlyBetterSomewhere) {
        return {
          exists: true,
          strategy: i,
          type: 'Weakly Dominant',
          advice: `Strategy ${i} is never worse and sometimes better`
        };
      }
    }
    
    return null;
  }

  static transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  static generateDominanceRecommendation(p1, p2) {
    if (p1.exists && p2.exists) {
      return `Game is dominance solvable! Player 1 should always play strategy ${p1.strategy}, Player 2 should always play strategy ${p2.strategy}.`;
    }
    
    if (p1.exists) {
      return `Player 1 has a ${p1.type} strategy (${p1.strategy}). Player 2 should respond optimally.`;
    }
    
    if (p2.exists) {
      return `Player 2 has a ${p2.type} strategy (${p2.strategy}). Player 1 should respond optimally.`;
    }
    
    return "Neither player has a dominant strategy. Use Nash equilibrium or mixed strategy analysis.";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🧠 BETTING PSYCHOLOGY ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class BettingPsychologyAnalyzer {
  
  static analyzeBettingBehavior(bettingHistory) {
    const biases = this.detectCognitiveBiases(bettingHistory);
    const patterns = this.detectPatterns(bettingHistory);
    const emotionalState = this.assessEmotionalState(bettingHistory);
    const discipline = this.assessDiscipline(bettingHistory);
    
    return {
      overallScore: this.calculatePsychologyScore(biases, patterns, discipline),
      cognitiveBiases: biases,
      behavioralPatterns: patterns,
      emotionalState: emotionalState,
      disciplineScore: discipline,
      redFlags: this.identifyRedFlags(biases, patterns, discipline),
      recommendations: this.generatePsychologyRecommendations(biases, patterns, discipline)
    };
  }

  static detectCognitiveBiases(history) {
    return {
      gamblersFallacy: this.detectGamblersFallacy(history),
      recencyBias: this.detectRecencyBias(history),
      confirmationBias: this.detectConfirmationBias(history),
      overconfidence: this.detectOverconfidence(history),
      lossChasingBias: this.detectLossChasingBias(history),
      availabilityBias: this.detectAvailabilityBias(history)
    };
  }

  static detectGamblersFallacy(history) {
    // Check if bet sizes increase after losses (thinking they're "due" for a win)
    let fallacyScore = 0;
    
    for (let i = 1; i < history.length; i++) {
      if (history[i - 1].result === 'loss' && history[i].stake > history[i - 1].stake * 1.5) {
        fallacyScore++;
      }
    }
    
    const severity = fallacyScore / history.length;
    
    return {
      detected: severity > 0.15,
      severity: severity > 0.25 ? 'High' : severity > 0.15 ? 'Moderate' : 'Low',
      instances: fallacyScore,
      warning: severity > 0.15 ? "Increasing bets after losses - classic gambler's fallacy!" : null
    };
  }

  static detectRecencyBias(history) {
    // Check if recent results disproportionately influence bet size
    const recentBets = history.slice(-5);
    const recentWins = recentBets.filter(b => b.result === 'win').length;
    
    if (recentWins >= 4) {
      const avgRecentStake = recentBets.reduce((sum, b) => sum + b.stake, 0) / recentBets.length;
      const avgHistoricalStake = history.slice(0, -5).reduce((sum, b) => sum + b.stake, 0) / (history.length - 5);
      
      if (avgRecentStake > avgHistoricalStake * 1.3) {
        return {
          detected: true,
          severity: 'Moderate',
          warning: "Betting more after winning streak - recency bias detected"
        };
      }
    }
    
    return { detected: false, severity: 'Low' };
  }

  static detectConfirmationBias(history) {
    // Check if bets favor certain teams/types regardless of value
    const teamCounts = {};
    
    history.forEach(bet => {
      teamCounts[bet.team] = (teamCounts[bet.team] || 0) + 1;
    });
    
    const mostBetTeam = Object.entries(teamCounts).sort((a, b) => b[1] - a[1])[0];
    const favoriteTeamPct = mostBetTeam ? (mostBetTeam[1] / history.length) : 0;
    
    return {
      detected: favoriteTeamPct > 0.4,
      severity: favoriteTeamPct > 0.5 ? 'High' : favoriteTeamPct > 0.4 ? 'Moderate' : 'Low',
      favoriteTeam: mostBetTeam ? mostBetTeam[0] : 'None',
      percentage: (favoriteTeamPct * 100).toFixed(1) + '%',
      warning: favoriteTeamPct > 0.4 ? "Over-betting favorite team - confirmation bias" : null
    };
  }

  static detectOverconfidence(history) {
    // Check win rate vs bet sizing confidence
    const winRate = history.filter(b => b.result === 'win').length / history.length;
    const avgConfidence = history.reduce((sum, b) => sum + (b.confidence || 50), 0) / history.length;
    
    const overconfidenceGap = avgConfidence - (winRate * 100);
    
    return {
      detected: overconfidenceGap > 15,
      severity: overconfidenceGap > 25 ? 'High' : overconfidenceGap > 15 ? 'Moderate' : 'Low',
      actualWinRate: (winRate * 100).toFixed(1) + '%',
      perceivedConfidence: avgConfidence.toFixed(1) + '%',
      gap: overconfidenceGap.toFixed(1) + '%',
      warning: overconfidenceGap > 15 ? "Confidence exceeds actual performance - overconfidence bias" : null
    };
  }

  static detectLossChasingBias(history) {
    // Check for consecutive increasing bets after losses
    let chasingSessions = 0;
    let currentChase = 0;
    
    for (let i = 1; i < history.length; i++) {
      if (history[i - 1].result === 'loss' && history[i].stake > history[i - 1].stake * 1.2) {
        currentChase++;
      } else {
        if (currentChase >= 2) {
          chasingSessions++;
        }
        currentChase = 0;
      }
    }
    
    return {
      detected: chasingSessions > 0,
      severity: chasingSessions > 3 ? 'High' : chasingSessions > 1 ? 'Moderate' : 'Low',
      instances: chasingSessions,
      warning: chasingSessions > 0 ? "⚠️ LOSS CHASING DETECTED - High risk behavior!" : null
    };
  }

  static detectAvailabilityBias(history) {
    // Check if betting on recent news/highlights
    const recentHighProfile = history.slice(-10).filter(b => b.highProfile).length;
    
    return {
      detected: recentHighProfile > 6,
      severity: recentHighProfile > 7 ? 'Moderate' : 'Low',
      warning: recentHighProfile > 6 ? "Betting too much on highlighted games - availability bias" : null
    };
  }

  static detectPatterns(history) {
    return {
      streakDependency: this.analyzeStreakDependency(history),
      timingPatterns: this.analyzeTimingPatterns(history),
      unitSizeVariability: this.analyzeUnitVariability(history),
      marketSelection: this.analyzeMarketSelection(history)
    };
  }

  static analyzeStreakDependency(history) {
    let streakInfluence = 0;
    
    for (let i = 3; i < history.length; i++) {
      const last3 = history.slice(i - 3, i);
      const allWins = last3.every(b => b.result === 'win');
      const allLosses = last3.every(b => b.result === 'loss');
      
      if ((allWins || allLosses) && Math.abs(history[i].stake - history[i - 1].stake) > history[i - 1].stake * 0.3) {
        streakInfluence++;
      }
    }
    
    return {
      influenced: streakInfluence > 2,
      score: (streakInfluence / history.length * 100).toFixed(1) + '%',
      interpretation: streakInfluence > 3 ? "High streak dependency" : "Normal"
    };
  }

  static analyzeTimingPatterns(history) {
    const nightBets = history.filter(b => b.hour >= 20 || b.hour <= 4).length;
    const weekendBets = history.filter(b => b.isWeekend).length;
    
    return {
      lateNightBetting: {
        percentage: (nightBets / history.length * 100).toFixed(1) + '%',
        risk: nightBets / history.length > 0.4 ? 'High' : 'Normal',
        warning: nightBets / history.length > 0.4 ? "Too many late-night bets (impaired judgment)" : null
      },
      weekendBetting: {
        percentage: (weekendBets / history.length * 100).toFixed(1) + '%',
        pattern: weekendBets / history.length > 0.6 ? 'Weekend heavy' : 'Balanced'
      }
    };
  }

  static analyzeUnitVariability(history) {
    const stakes = history.map(b => b.stake);
    const mean = stakes.reduce((sum, s) => sum + s, 0) / stakes.length;
    const variance = stakes.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / stakes.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    
    return {
      coefficientOfVariation: cv.toFixed(1) + '%',
      consistency: cv < 30 ? 'Excellent' : cv < 50 ? 'Good' : cv < 75 ? 'Poor' : 'Very Poor',
      warning: cv > 60 ? "Highly inconsistent bet sizing - poor bankroll management" : null
    };
  }

  static analyzeMarketSelection(history) {
    const marketTypes = {};
    history.forEach(bet => {
      marketTypes[bet.marketType] = (marketTypes[bet.marketType] || 0) + 1;
    });
    
    const diversity = Object.keys(marketTypes).length;
    
    return {
      diversity: diversity > 5 ? 'High' : diversity > 3 ? 'Moderate' : 'Low',
      mostCommon: Object.entries(marketTypes).sort((a, b) => b[1] - a[1])[0],
      recommendation: diversity < 3 ? "Consider diversifying bet types" : "Good market diversity"
    };
  }

  static assessEmotionalState(history) {
    const recentPerformance = history.slice(-10);
    const recentROI = this.calculateROI(recentPerformance);
    const volatility = this.calculateVolatility(recentPerformance);
    
    let emotionalState = 'Neutral';
    let stressLevel = 50;
    
    if (recentROI < -20) {
      emotionalState = 'Frustrated/Tilted';
      stressLevel = 80;
    } else if (recentROI > 20) {
      emotionalState = 'Overconfident';
      stressLevel = 60;
    }
    
    if (volatility > 40) {
      stressLevel += 15;
    }
    
    return {
      currentState: emotionalState,
      stressLevel: Math.min(100, stressLevel),
      recentROI: recentROI.toFixed(1) + '%',
      volatility: volatility.toFixed(1),
      recommendation: this.getEmotionalRecommendation(emotionalState, stressLevel)
    };
  }

  static assessDiscipline(history) {
    let disciplineScore = 100;
    
    // Penalties for undisciplined behavior
    const biases = this.detectCognitiveBiases(history);
    
    if (biases.lossChasingBias.detected) disciplineScore -= 25;
    if (biases.gamblersFallacy.severity === 'High') disciplineScore -= 20;
    if (biases.overconfidence.severity === 'High') disciplineScore -= 15;
    if (biases.confirmationBias.severity === 'High') disciplineScore -= 10;
    
    const unitVariability = this.analyzeUnitVariability(history);
    if (parseFloat(unitVariability.coefficientOfVariation) > 60) disciplineScore -= 15;
    
    disciplineScore = Math.max(0, disciplineScore);
    
    return {
      score: disciplineScore,
      grade: disciplineScore >= 85 ? 'A' : disciplineScore >= 70 ? 'B' : disciplineScore >= 55 ? 'C' : disciplineScore >= 40 ? 'D' : 'F',
      level: disciplineScore >= 80 ? 'Excellent' : disciplineScore >= 65 ? 'Good' : disciplineScore >= 50 ? 'Fair' : 'Poor',
      areas: this.identifyDisciplineAreas(biases, unitVariability)
    };
  }

  static calculatePsychologyScore(biases, patterns, discipline) {
    let score = discipline.score;
    
    // Additional adjustments
    Object.values(biases).forEach(bias => {
      if (bias.severity === 'High') score -= 5;
      if (bias.severity === 'Moderate') score -= 2;
    });
    
    return {
      overall: Math.max(0, score),
      grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D/F',
      status: score >= 75 ? 'Healthy' : score >= 50 ? 'Needs Improvement' : 'At Risk'
    };
  }

  static identifyRedFlags(biases, patterns, discipline) {
    const flags = [];
    
    if (biases.lossChasingBias.detected) {
      flags.push("🚩 CRITICAL: Loss chasing detected - High risk of significant losses");
    }
    
    if (biases.gamblersFallacy.severity === 'High') {
      flags.push("🚩 Gambler's fallacy - Believing in 'due' outcomes");
    }
    
    if (discipline.score < 50) {
      flags.push("🚩 Poor discipline - Major changes needed");
    }
    
    if (patterns.timingPatterns.lateNightBetting.risk === 'High') {
      flags.push("⚠️ Excessive late-night betting - Impaired decision making");
    }
    
    return flags.length > 0 ? flags : ["✅ No major red flags detected"];
  }

  static generatePsychologyRecommendations(biases, patterns, discipline) {
    const recommendations = [];
    
    if (biases.lossChasingBias.detected) {
      recommendations.push("URGENT: Take a break after 2 consecutive losses");
      recommendations.push("Set strict stop-loss limits");
    }
    
    if (biases.overconfidence.severity !== 'Low') {
      recommendations.push("Track actual vs expected results to calibrate confidence");
    }
    
    if (patterns.unitSizeVariability.consistency === 'Poor' || patterns.unitSizeVariability.consistency === 'Very Poor') {
      recommendations.push("Adopt fixed unit sizing (1-3% of bankroll per bet)");
    }
    
    if (discipline.score < 70) {
      recommendations.push("Implement mandatory waiting period between bets");
      recommendations.push("Use bet tracking app with alerts");
    }
    
    recommendations.push("Regular psychology check-ins every 25 bets");
    
    return recommendations;
  }

  static calculateROI(bets) {
    const totalStake = bets.reduce((sum, b) => sum + b.stake, 0);
    const totalReturn = bets.reduce((sum, b) => sum + (b.result === 'win' ? b.payout : 0), 0);
    return ((totalReturn - totalStake) / totalStake) * 100;
  }

  static calculateVolatility(bets) {
    const returns = bets.map(b => b.result === 'win' ? b.payout / b.stake : -1);
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100;
  }

  static getEmotionalRecommendation(state, stress) {
    if (state === 'Frustrated/Tilted') {
      return "🛑 STOP BETTING - Take 24-48 hour break to reset emotionally";
    }
    if (state === 'Overconfident') {
      return "⚠️ Reduce bet sizes - Overconfidence can lead to major losses";
    }
    if (stress > 70) {
      return "High stress detected - Consider reducing volume and stake sizes";
    }
    return "Emotional state is manageable - Continue with caution";
  }

  static identifyDisciplineAreas(biases, unitVar) {
    const areas = {
      excellent: [],
      needsWork: []
    };
    
    if (!biases.lossChasingBias.detected) {
      areas.excellent.push("No loss chasing");
    } else {
      areas.needsWork.push("Loss chasing control");
    }
    
    if (unitVar.consistency === 'Excellent' || unitVar.consistency === 'Good') {
      areas.excellent.push("Consistent unit sizing");
    } else {
      areas.needsWork.push("Unit size consistency");
    }
    
    return areas;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 EXPECTED VALUE MAXIMIZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ExpectedValueMaximizer {
  
  static optimizePortfolio(availableBets, bankroll, constraints = {}) {
    // Optimize bet selection and sizing to maximize expected value
    
    const positiveEVBets = availableBets.filter(bet => bet.expectedValue > 0);
    
    if (positiveEVBets.length === 0) {
      return {
        recommendation: "No positive EV opportunities found",
        optimalBets: [],
        expectedReturn: 0
      };
    }
    
    // Sort by EV and apply Kelly Criterion
    const rankedBets = positiveEVBets
      .map(bet => ({
        ...bet,
        kellyStake: this.calculateKellyStake(bet, bankroll),
        sharpeRatio: this.calculateSharpeRatio(bet)
      }))
      .sort((a, b) => b.expectedValue - a.expectedValue);
    
    // Apply portfolio constraints
    const selectedBets = this.applyConstraints(rankedBets, bankroll, constraints);
    
    return {
      optimalBets: selectedBets,
      totalStake: selectedBets.reduce((sum, bet) => sum + bet.kellyStake, 0),
      expectedReturn: this.calculatePortfolioEV(selectedBets),
      expectedROI: this.calculateExpectedROI(selectedBets),
      riskMetrics: this.calculateRiskMetrics(selectedBets),
      diversification: this.assessDiversification(selectedBets)
    };
  }

  static calculateKellyStake(bet, bankroll) {
    const winProb = bet.impliedProbability;
    const odds = bet.decimalOdds;
    
    const q = 1 - winProb;
    const b = odds - 1;
    
    const kellyFraction = (winProb * b - q) / b;
    
    // Use fractional Kelly (typically 25-50% of full Kelly)
    const fractionalKelly = kellyFraction * 0.25;
    
    return Math.max(0, Math.min(bankroll * 0.05, bankroll * fractionalKelly));
  }

  static calculateSharpeRatio(bet) {
    const expectedReturn = bet.expectedValue;
    const volatility = Math.sqrt(bet.variance || 1);
    const riskFreeRate = 0; // Assume 0 for sports betting
    
    return (expectedReturn - riskFreeRate) / volatility;
  }

  static applyConstraints(bets, bankroll, constraints) {
    const {
      maxBetsPerDay = 10,
      maxTotalStake = bankroll * 0.20,
      minEV = 0.02,
      maxCorrelation = 0.3
    } = constraints;
    
    let selectedBets = [];
    let totalStake = 0;
    
    for (const bet of bets) {
      if (selectedBets.length >= maxBetsPerDay) break;
      if (totalStake + bet.kellyStake > maxTotalStake) break;
      if (bet.expectedValue < minEV) break;
      
      // Check correlation with existing bets
      const maxExistingCorrelation = this.calculateMaxCorrelation(bet, selectedBets);
      if (maxExistingCorrelation > maxCorrelation) continue;
      
      selectedBets.push(bet);
      totalStake += bet.kellyStake;
    }
    
    return selectedBets;
  }

  static calculateMaxCorrelation(bet, existingBets) {
    if (existingBets.length === 0) return 0;
    
    return Math.max(...existingBets.map(existing => {
      // Simple correlation: same game = 1.0, same team = 0.5, different = 0
      if (existing.gameId === bet.gameId) return 1.0;
      if (existing.team === bet.team) return 0.5;
      return 0.1;
    }));
  }

  static calculatePortfolioEV(bets) {
    return bets.reduce((sum, bet) => sum + (bet.kellyStake * bet.expectedValue), 0);
  }

  static calculateExpectedROI(bets) {
    const totalStake = bets.reduce((sum, bet) => sum + bet.kellyStake, 0);
    const expectedReturn = this.calculatePortfolioEV(bets);
    
    return totalStake > 0 ? (expectedReturn / totalStake) * 100 : 0;
  }

  static calculateRiskMetrics(bets) {
    const returns = bets.map(bet => bet.kellyStake * bet.expectedValue);
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      portfolioVariance: variance.toFixed(2),
      portfolioStdDev: stdDev.toFixed(2),
      coefficientOfVariation: ((stdDev / mean) * 100).toFixed(1) + '%',
      riskLevel: stdDev > 50 ? 'High' : stdDev > 25 ? 'Moderate' : 'Low'
    };
  }

  static assessDiversification(bets) {
    const leagues = new Set(bets.map(b => b.league)).size;
    const teams = new Set(bets.map(b => b.team)).size;
    const marketTypes = new Set(bets.map(b => b.marketType)).size;
    
    const diversificationScore = (leagues * 10) + (teams * 5) + (marketTypes * 15);
    
    return {
      score: Math.min(100, diversificationScore),
      leagues: leagues,
      teams: teams,
      marketTypes: marketTypes,
      rating: diversificationScore > 60 ? 'Well-diversified' : diversificationScore > 30 ? 'Moderate' : 'Concentrated'
    };
  }
}

export default {
  NashEquilibriumSolver,
  DominantStrategyAnalyzer,
  BettingPsychologyAnalyzer,
  ExpectedValueMaximizer
};
