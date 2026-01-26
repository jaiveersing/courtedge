// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🔴 RAY LIVE GAME ANALYZER - REAL-TIME ANALYSIS & MOMENTUM TRACKING                                                 ║
// ║  Live Odds • Momentum Shifts • Run Detection • Fatigue Analysis • Clutch Situations • Live Betting Opportunities    ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ⚡ MOMENTUM TRACKER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class MomentumTracker {
  
  static analyzeMomentum(gameState, recentPlays) {
    const currentRun = this.detectCurrentRun(recentPlays);
    const momentumScore = this.calculateMomentumScore(recentPlays, gameState);
    const swingProbability = this.predictMomentumSwing(momentumScore, gameState);
    const keyFactors = this.identifyMomentumFactors(recentPlays);
    
    return {
      currentRun,
      momentumScore,
      team_with_momentum: this.determineMomentumLeader(momentumScore),
      swingProbability,
      keyFactors,
      recommendation: this.generateMomentumRecommendation(momentumScore, swingProbability),
      liveBettingOpportunity: this.identifyLiveOpportunity(momentumScore, gameState)
    };
  }

  static detectCurrentRun(plays) {
    let currentTeamRun = null;
    let runPoints = 0;
    let runLength = 0;
    
    // Analyze last 20 plays or fewer
    const recentPlays = plays.slice(-20);
    
    for (let i = recentPlays.length - 1; i >= 0; i--) {
      const play = recentPlays[i];
      
      if (play.points === 0) continue; // Skip non-scoring plays
      
      if (currentTeamRun === null) {
        currentTeamRun = play.team;
        runPoints = play.points;
        runLength = 1;
      } else if (play.team === currentTeamRun) {
        runPoints += play.points;
        runLength++;
      } else {
        break; // Run ended
      }
    }
    
    return {
      team: currentTeamRun,
      points: runPoints,
      length: runLength,
      significance: this.classifyRunSignificance(runPoints, runLength),
      timeframe: `Last ${runLength} scoring plays`,
      alert: runPoints >= 10 ? `🚨 ${runPoints}-0 RUN!` : null
    };
  }

  static classifyRunSignificance(points, length) {
    if (points >= 15) return 'Massive Run 🔥';
    if (points >= 10) return 'Significant Run ⚡';
    if (points >= 7) return 'Notable Run 📈';
    if (points >= 5) return 'Small Run ➕';
    return 'Minimal';
  }

  static calculateMomentumScore(plays, gameState) {
    const last10Plays = plays.slice(-10);
    
    let teamA_score = 0;
    let teamB_score = 0;
    
    last10Plays.forEach((play, index) => {
      const recencyWeight = (index + 1) / 10; // More recent = more weight
      const playValue = (play.points || 0) + (play.defensive_stop ? 0.5 : 0);
      
      if (play.team === 'teamA') {
        teamA_score += playValue * recencyWeight;
      } else {
        teamB_score += playValue * recencyWeight;
      }
    });
    
    // Normalize to -100 to +100 scale
    const totalScore = teamA_score + teamB_score;
    const momentumBalance = totalScore > 0 
      ? ((teamA_score - teamB_score) / totalScore) * 100 
      : 0;
    
    return {
      teamA: teamA_score.toFixed(2),
      teamB: teamB_score.toFixed(2),
      balance: momentumBalance.toFixed(1),
      description: this.describeMomentum(momentumBalance),
      strength: Math.abs(momentumBalance)
    };
  }

  static describeMomentum(balance) {
    if (balance > 60) return 'Team A has STRONG momentum 🔥';
    if (balance > 30) return 'Team A has momentum ⚡';
    if (balance > 10) return 'Team A has slight edge 📈';
    if (balance > -10) return 'Even momentum ⚖️';
    if (balance > -30) return 'Team B has slight edge 📈';
    if (balance > -60) return 'Team B has momentum ⚡';
    return 'Team B has STRONG momentum 🔥';
  }

  static determineMomentumLeader(momentumScore) {
    const balance = parseFloat(momentumScore.balance);
    
    if (Math.abs(balance) < 10) return 'Even';
    return balance > 0 ? 'Team A' : 'Team B';
  }

  static predictMomentumSwing(momentumScore, gameState) {
    const balance = Math.abs(parseFloat(momentumScore.balance));
    const quarter = gameState.quarter;
    const timeRemaining = gameState.timeRemaining;
    
    // Factors that increase swing probability
    let swingProb = 0;
    
    // Strong momentum often leads to counterpunch
    if (balance > 70) swingProb += 40;
    else if (balance > 50) swingProb += 25;
    
    // End of quarters often see momentum shifts
    if (timeRemaining < 120) swingProb += 15;
    
    // Halftime adjustments
    if (quarter === 3 && timeRemaining > 600) swingProb += 20;
    
    // Timeout can disrupt momentum
    if (gameState.recentTimeout) swingProb += 25;
    
    swingProb = Math.min(100, swingProb);
    
    return {
      probability: swingProb + '%',
      likelihood: swingProb > 60 ? 'High' : swingProb > 40 ? 'Moderate' : swingProb > 20 ? 'Low' : 'Very Low',
      factors: this.getSwingFactors(balance, quarter, timeRemaining, gameState),
      timing: this.predictSwingTiming(swingProb, gameState)
    };
  }

  static getSwingFactors(balance, quarter, timeRemaining, gameState) {
    const factors = [];
    
    if (balance > 70) factors.push('Extreme momentum (regression likely)');
    if (timeRemaining < 120) factors.push('End of quarter approaching');
    if (quarter === 3 && timeRemaining > 600) factors.push('Post-halftime adjustment period');
    if (gameState.recentTimeout) factors.push('Recent timeout (coaching adjustment)');
    if (gameState.foulTrouble) factors.push('Foul trouble affecting flow');
    
    return factors.length > 0 ? factors : ['No major swing catalysts identified'];
  }

  static predictSwingTiming(probability, gameState) {
    if (probability > 60) {
      return 'Swing likely within next 3-5 minutes';
    }
    if (probability > 40) {
      return 'Potential swing in next 5-8 minutes';
    }
    return 'No imminent swing expected';
  }

  static identifyMomentumFactors(plays) {
    const factors = {
      scoring_efficiency: this.analyzeRecentEfficiency(plays),
      defensive_intensity: this.analyzeDefensiveIntensity(plays),
      turnover_battle: this.analyzeTurnovers(plays),
      rebounding: this.analyzeRebounding(plays),
      free_throw_impact: this.analyzeFreeThrows(plays)
    };
    
    return {
      factors,
      primary_driver: this.identifyPrimaryDriver(factors),
      weakness: this.identifyWeakness(factors)
    };
  }

  static analyzeRecentEfficiency(plays) {
    const shootingPlays = plays.filter(p => p.type === 'shot');
    const makes = shootingPlays.filter(p => p.made).length;
    const attempts = shootingPlays.length;
    
    const fg_pct = attempts > 0 ? (makes / attempts) * 100 : 0;
    
    return {
      fg_pct: fg_pct.toFixed(1) + '%',
      makes: makes,
      attempts: attempts,
      rating: fg_pct > 55 ? 'Hot' : fg_pct > 45 ? 'Average' : 'Cold'
    };
  }

  static analyzeDefensiveIntensity(plays) {
    const defensiveStops = plays.filter(p => p.defensive_stop).length;
    const possessions = plays.length;
    
    const stopRate = possessions > 0 ? (defensiveStops / possessions) * 100 : 0;
    
    return {
      stops: defensiveStops,
      stopRate: stopRate.toFixed(1) + '%',
      intensity: stopRate > 40 ? 'Elite' : stopRate > 30 ? 'Good' : stopRate > 20 ? 'Average' : 'Poor'
    };
  }

  static analyzeTurnovers(plays) {
    const turnovers = plays.filter(p => p.type === 'turnover').length;
    const possessions = plays.length;
    
    const toRate = possessions > 0 ? (turnovers / possessions) * 100 : 0;
    
    return {
      turnovers: turnovers,
      rate: toRate.toFixed(1) + '%',
      impact: toRate > 20 ? 'Killing momentum' : toRate > 12 ? 'Moderate issue' : 'Well-controlled'
    };
  }

  static analyzeRebounding(plays) {
    const offReb = plays.filter(p => p.type === 'offensive_rebound').length;
    const defReb = plays.filter(p => p.type === 'defensive_rebound').length;
    
    return {
      offensive: offReb,
      defensive: defReb,
      total: offReb + defReb,
      advantage: offReb > defReb ? 'Offensive' : defReb > offReb ? 'Defensive' : 'Even'
    };
  }

  static analyzeFreeThrows(plays) {
    const ftPlays = plays.filter(p => p.type === 'free_throw');
    const ftMakes = ftPlays.filter(p => p.made).length;
    const ftAttempts = ftPlays.length;
    
    const ft_pct = ftAttempts > 0 ? (ftMakes / ftAttempts) * 100 : 0;
    
    return {
      makes: ftMakes,
      attempts: ftAttempts,
      percentage: ft_pct.toFixed(1) + '%',
      impact: ftAttempts > 5 ? 'Significant' : 'Minimal'
    };
  }

  static identifyPrimaryDriver(factors) {
    const ratings = {
      scoring: factors.scoring_efficiency.rating,
      defense: factors.defensive_intensity.intensity,
      turnovers: factors.turnover_battle.impact
    };
    
    if (ratings.scoring === 'Hot') return 'Hot shooting 🔥';
    if (ratings.defense === 'Elite') return 'Elite defense 🛡️';
    if (ratings.turnovers === 'Killing momentum') return 'Turnovers forcing 🎯';
    
    return 'Balanced attack';
  }

  static identifyWeakness(factors) {
    if (factors.scoring_efficiency.rating === 'Cold') return 'Poor shooting';
    if (factors.defensive_intensity.intensity === 'Poor') return 'Weak defense';
    if (parseFloat(factors.turnover_battle.rate) > 18) return 'Too many turnovers';
    
    return 'No glaring weakness';
  }

  static generateMomentumRecommendation(momentumScore, swingProb) {
    const balance = parseFloat(momentumScore.balance);
    const swingLikelihood = swingProb.likelihood;
    
    if (Math.abs(balance) > 60 && swingLikelihood === 'High') {
      return '⚠️ FADE THE MOMENTUM - High swing probability, consider contrarian bet';
    }
    
    if (Math.abs(balance) > 40 && swingLikelihood === 'Low') {
      return '✅ RIDE THE MOMENTUM - Strong momentum with low swing risk';
    }
    
    if (Math.abs(balance) < 15) {
      return '⚖️ WAIT - Momentum unclear, no strong betting signal';
    }
    
    return '📊 MODERATE SETUP - Can bet with momentum but manage risk';
  }

  static identifyLiveOpportunity(momentumScore, gameState) {
    const balance = parseFloat(momentumScore.balance);
    const opportunities = [];
    
    if (Math.abs(balance) > 50) {
      const favoredTeam = balance > 0 ? 'Team A' : 'Team B';
      const opposingTeam = balance > 0 ? 'Team B' : 'Team A';
      
      opportunities.push({
        type: 'Next Basket',
        bet: `${opposingTeam} to score next`,
        reasoning: 'Extreme momentum often leads to counter-punch',
        confidence: 'Moderate',
        edge: '3-5%'
      });
      
      opportunities.push({
        type: 'Quarter Winner',
        bet: `${opposingTeam} quarter`,
        reasoning: 'Regression to mean likely after extreme run',
        confidence: 'Moderate',
        edge: '4-7%'
      });
    }
    
    if (gameState.quarter === 4 && gameState.timeRemaining < 300) {
      opportunities.push({
        type: 'Total',
        bet: 'OVER live total',
        reasoning: 'End of game urgency increases pace',
        confidence: 'Low-Moderate',
        edge: '2-4%'
      });
    }
    
    return opportunities.length > 0 ? opportunities : [{ 
      type: 'None', 
      message: 'No clear live betting opportunities at this time' 
    }];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 LIVE PROP ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class LivePropAnalyzer {
  
  static analyzePlayerLive(player, gameState, currentStats) {
    const projectedFinal = this.projectFinalStats(player, gameState, currentStats);
    const paceAdjustment = this.adjustForGamePace(player, gameState);
    const fatigueImpact = this.assessFatigueImpact(player, gameState);
    const situationalFactors = this.analyzeSituationalFactors(player, gameState);
    
    return {
      currentStats,
      projectedFinal,
      paceAdjustment,
      fatigueImpact,
      situationalFactors,
      liveBets: this.generateLivePropRecommendations(projectedFinal, currentStats),
      confidence: this.calculateLiveConfidence(gameState, fatigueImpact)
    };
  }

  static projectFinalStats(player, gameState, currentStats) {
    const minutesPlayed = currentStats.minutes;
    const projectedMinutes = this.estimateFinalMinutes(player, gameState, minutesPlayed);
    
    const minutesRemaining = Math.max(0, projectedMinutes - minutesPlayed);
    const gameProgress = minutesPlayed / projectedMinutes;
    
    // Project points
    const pointsPace = currentStats.points / minutesPlayed;
    const projectedPoints = currentStats.points + (pointsPace * minutesRemaining);
    
    // Project rebounds
    const reboundsPace = currentStats.rebounds / minutesPlayed;
    const projectedRebounds = currentStats.rebounds + (reboundsPace * minutesRemaining);
    
    // Project assists
    const assistsPace = currentStats.assists / minutesPlayed;
    const projectedAssists = currentStats.assists + (assistsPace * minutesRemaining);
    
    return {
      points: {
        current: currentStats.points,
        projected: projectedPoints.toFixed(1),
        pace: pointsPace.toFixed(2) + ' per min',
        remaining: (projectedPoints - currentStats.points).toFixed(1)
      },
      rebounds: {
        current: currentStats.rebounds,
        projected: projectedRebounds.toFixed(1),
        pace: reboundsPace.toFixed(2) + ' per min'
      },
      assists: {
        current: currentStats.assists,
        projected: projectedAssists.toFixed(1),
        pace: assistsPace.toFixed(2) + ' per min'
      },
      gameProgress: (gameProgress * 100).toFixed(1) + '%',
      minutesRemaining: minutesRemaining.toFixed(1)
    };
  }

  static estimateFinalMinutes(player, gameState, currentMinutes) {
    const typicalMinutes = player.avg_minutes || 32;
    const quarter = gameState.quarter;
    
    // Adjust based on game situation
    if (gameState.blowout) {
      return Math.min(typicalMinutes * 0.85, currentMinutes + 5);
    }
    
    if (gameState.close && quarter >= 4) {
      return Math.max(typicalMinutes * 1.05, currentMinutes + 8);
    }
    
    // Normal projection
    const percentComplete = ((quarter - 1) * 12 + (12 - gameState.timeRemaining / 60)) / 48;
    return currentMinutes / percentComplete;
  }

  static adjustForGamePace(player, gameState) {
    const currentPace = gameState.pace || 100;
    const typicalPace = 99.5;
    const paceRatio = currentPace / typicalPace;
    
    return {
      currentPace: currentPace.toFixed(1),
      typicalPace: typicalPace.toFixed(1),
      adjustment: ((paceRatio - 1) * 100).toFixed(1) + '%',
      impact: paceRatio > 1.05 ? 'Boosting stats' : paceRatio < 0.95 ? 'Suppressing stats' : 'Neutral'
    };
  }

  static assessFatigueImpact(player, gameState) {
    const minutesPlayed = player.currentMinutes || 0;
    const quarter = gameState.quarter;
    
    let fatigueScore = 0;
    
    // Minutes-based fatigue
    if (minutesPlayed > 36) fatigueScore += 30;
    else if (minutesPlayed > 32) fatigueScore += 15;
    else if (minutesPlayed > 28) fatigueScore += 5;
    
    // Late game fatigue
    if (quarter === 4) fatigueScore += 10;
    
    // Back-to-back games
    if (gameState.backToBack) fatigueScore += 20;
    
    // Recent minutes load
    if (player.recent_minutes_avg > 36) fatigueScore += 10;
    
    return {
      score: fatigueScore,
      level: fatigueScore > 50 ? 'High' : fatigueScore > 30 ? 'Moderate' : fatigueScore > 15 ? 'Mild' : 'Low',
      impact: this.describeFatigueImpact(fatigueScore),
      recommendation: this.getFatigueRecommendation(fatigueScore)
    };
  }

  static describeFatigueImpact(score) {
    if (score > 50) return 'Significant performance decline likely';
    if (score > 30) return 'Moderate decline in efficiency expected';
    if (score > 15) return 'Slight impact on late-game performance';
    return 'Minimal fatigue impact';
  }

  static getFatigueRecommendation(score) {
    if (score > 50) return '⚠️ Fade late-game props';
    if (score > 30) return '📉 Reduce confidence in remaining prop projections';
    if (score > 15) return '⚖️ Neutral - monitor closely';
    return '✅ No fatigue concerns';
  }

  static analyzeSituationalFactors(player, gameState) {
    return {
      gameScript: this.analyzeGameScript(player, gameState),
      matchupShift: this.analyzeMatchupChanges(player, gameState),
      foulSituation: this.analyzeFoulSituation(player, gameState),
      hotColdStreak: this.analyzeCurrentPerformance(player, gameState)
    };
  }

  static analyzeGameScript(player, gameState) {
    const scoreDiff = Math.abs(gameState.score.teamA - gameState.score.teamB);
    const quarter = gameState.quarter;
    
    if (scoreDiff > 20 && quarter >= 3) {
      return {
        status: 'Blowout',
        impact: 'Starters likely to rest early',
        betting_impact: 'UNDERS favored'
      };
    }
    
    if (scoreDiff < 5 && quarter === 4) {
      return {
        status: 'Close game',
        impact: 'Stars will play heavy minutes',
        betting_impact: 'OVERS for key players'
      };
    }
    
    return {
      status: 'Competitive',
      impact: 'Normal rotations expected',
      betting_impact: 'Neutral'
    };
  }

  static analyzeMatchupChanges(player, gameState) {
    // Simplified - would track actual defender changes
    return {
      currentDefender: 'Unknown',
      defenderQuality: 'Average',
      impactOnProjection: 'Minimal adjustment needed'
    };
  }

  static analyzeFoulSituation(player, gameState) {
    const fouls = player.currentFouls || 0;
    const quarter = gameState.quarter;
    
    if (fouls >= 5) {
      return {
        fouls: fouls,
        risk: 'Extreme',
        impact: 'Major minutes restriction imminent',
        recommendation: 'AVOID all props'
      };
    }
    
    if (fouls >= 4 && quarter >= 3) {
      return {
        fouls: fouls,
        risk: 'High',
        impact: 'Playing cautiously, reduced aggression',
        recommendation: 'Lean UNDER on counting stats'
      };
    }
    
    if (fouls >= 3 && quarter <= 2) {
      return {
        fouls: fouls,
        risk: 'Moderate',
        impact: 'May sit longer stretches',
        recommendation: 'Slight lean UNDER'
      };
    }
    
    return {
      fouls: fouls,
      risk: 'Low',
      impact: 'No foul concerns',
      recommendation: 'Normal projections apply'
    };
  }

  static analyzeCurrentPerformance(player, gameState) {
    const currentFG = player.currentFG || 0.45;
    const avgFG = player.seasonFG || 0.47;
    const variance = currentFG - avgFG;
    
    return {
      current: (currentFG * 100).toFixed(1) + '%',
      season: (avgFG * 100).toFixed(1) + '%',
      variance: (variance * 100).toFixed(1) + '%',
      status: variance > 0.10 ? 'Hot 🔥' : variance < -0.10 ? 'Cold ❄️' : 'Normal',
      outlook: this.getPerformanceOutlook(variance, gameState)
    };
  }

  static getPerformanceOutlook(variance, gameState) {
    if (variance > 0.15) {
      return 'Unsustainable hot shooting - regression likely';
    }
    if (variance > 0.08) {
      return 'Hot shooting may continue near term';
    }
    if (variance < -0.15) {
      return 'Due for positive regression';
    }
    if (variance < -0.08) {
      return 'Below average, may improve';
    }
    return 'Performing at expected level';
  }

  static generateLivePropRecommendations(projected, current) {
    const recommendations = [];
    
    // Points recommendations
    const pointsNeeded = parseFloat(projected.points.projected) - current.points;
    if (pointsNeeded < current.points * 0.3) {
      recommendations.push({
        prop: `${current.playerName} OVER ${current.points + pointsNeeded.toFixed(0)} points`,
        confidence: 'High',
        reasoning: `On pace for ${projected.points.projected}, needs only ${pointsNeeded.toFixed(1)} more`
      });
    }
    
    // Rebounds recommendations
    const reboundsNeeded = parseFloat(projected.rebounds.projected) - current.rebounds;
    if (reboundsNeeded < current.rebounds * 0.4) {
      recommendations.push({
        prop: `${current.playerName} OVER ${current.rebounds + Math.ceil(reboundsNeeded)} rebounds`,
        confidence: 'Moderate',
        reasoning: `Strong rebounding pace, projects to ${projected.rebounds.projected}`
      });
    }
    
    return recommendations.length > 0 ? recommendations : [{
      message: 'No high-confidence live props identified',
      suggestion: 'Wait for better in-game spots'
    }];
  }

  static calculateLiveConfidence(gameState, fatigueImpact) {
    let confidence = 70; // Base confidence
    
    // Reduce confidence for fatigue
    if (fatigueImpact.level === 'High') confidence -= 25;
    else if (fatigueImpact.level === 'Moderate') confidence -= 15;
    else if (fatigueImpact.level === 'Mild') confidence -= 5;
    
    // Reduce confidence in blowouts
    if (gameState.blowout) confidence -= 30;
    
    // Increase confidence in close games (more predictable minutes)
    if (gameState.close && gameState.quarter >= 3) confidence += 15;
    
    // Reduce confidence very late
    if (gameState.quarter === 4 && gameState.timeRemaining < 180) confidence -= 20;
    
    confidence = Math.max(0, Math.min(100, confidence));
    
    return {
      score: confidence,
      rating: confidence > 75 ? 'High' : confidence > 55 ? 'Moderate' : confidence > 35 ? 'Low' : 'Very Low',
      reliability: confidence > 70 ? 'Reliable' : confidence > 50 ? 'Fair' : 'Uncertain'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔴 LIVE ODDS TRACKER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class LiveOddsTracker {
  
  static analyzeOddsMovement(initialLine, currentLine, gameState) {
    const movement = this.calculateMovement(initialLine, currentLine);
    const velocity = this.calculateVelocity(initialLine, currentLine, gameState);
    const sharpMoney = this.detectSharpMoney(movement, velocity);
    const reverseLineMovement = this.detectRLM(initialLine, currentLine, gameState);
    
    return {
      movement,
      velocity,
      sharpMoney,
      reverseLineMovement,
      recommendation: this.generateOddsRecommendation(movement, sharpMoney, reverseLineMovement),
      valueOpportunity: this.identifyValueOpportunity(movement, gameState)
    };
  }

  static calculateMovement(initial, current) {
    const pointsMove = current.line - initial.line;
    const oddsMove = current.odds - initial.odds;
    
    return {
      line_movement: pointsMove.toFixed(1),
      odds_movement: oddsMove.toFixed(0),
      direction: pointsMove > 0 ? '📈 Moved up' : pointsMove < 0 ? '📉 Moved down' : '➡️ No movement',
      magnitude: Math.abs(pointsMove) > 3 ? 'Significant' : Math.abs(pointsMove) > 1 ? 'Moderate' : 'Minimal'
    };
  }

  static calculateVelocity(initial, current, gameState) {
    const timePassed = this.estimateTimePassed(gameState);
    const movement = Math.abs(current.line - initial.line);
    
    const velocity = movement / (timePassed / 60); // Points per hour
    
    return {
      velocity: velocity.toFixed(2) + ' points/hour',
      speed: velocity > 5 ? 'Very Fast' : velocity > 2 ? 'Fast' : velocity > 0.5 ? 'Moderate' : 'Slow',
      significance: velocity > 3 ? 'Major market reaction' : velocity > 1 ? 'Notable reaction' : 'Normal'
    };
  }

  static estimateTimePassed(gameState) {
    const quarter = gameState.quarter;
    const timeRemaining = gameState.timeRemaining;
    
    const elapsed = ((quarter - 1) * 12) + (12 - timeRemaining / 60);
    return elapsed * 2.5; // Approximate real-time minutes (2.5x game time)
  }

  static detectSharpMoney(movement, velocity) {
    const lineMove = Math.abs(parseFloat(movement.line_movement));
    const speed = velocity.speed;
    
    const sharpIndicators = [];
    
    if (lineMove > 2 && (speed === 'Fast' || speed === 'Very Fast')) {
      sharpIndicators.push('Rapid significant movement');
    }
    
    if (lineMove > 3) {
      sharpIndicators.push('Large line move suggests big money');
    }
    
    const isSharp = sharpIndicators.length >= 1;
    
    return {
      detected: isSharp,
      indicators: sharpIndicators,
      confidence: sharpIndicators.length >= 2 ? 'High' : sharpIndicators.length === 1 ? 'Moderate' : 'Low',
      interpretation: isSharp ? '🏦 Sharp money likely in action' : '📊 Retail movement'
    };
  }

  static detectRLM(initial, current, gameState) {
    // Reverse Line Movement: line moves opposite to public betting
    // Simplified detection
    
    const lineMove = current.line - initial.line;
    const publicSide = gameState.publicBetting || 'unknown';
    
    let rlm = false;
    
    // If public is on favorite but line moves away from favorite = RLM
    if (publicSide === 'favorite' && lineMove > 0) rlm = true;
    if (publicSide === 'underdog' && lineMove < 0) rlm = true;
    
    return {
      detected: rlm,
      publicSide: publicSide,
      lineMove: lineMove.toFixed(1),
      interpretation: rlm 
        ? '💎 RLM detected - Sharps fading public' 
        : '📢 Line moving with public',
      bettingImplication: rlm 
        ? 'Follow the sharp money (opposite of public)' 
        : 'Public and sharps aligned'
    };
  }

  static generateOddsRecommendation(movement, sharpMoney, rlm) {
    if (sharpMoney.detected && rlm.detected) {
      return '💎💎💎 STRONG SHARP SIGNAL - Follow the reverse line movement';
    }
    
    if (sharpMoney.detected) {
      return '🏦 Sharp money detected - Consider following the line move';
    }
    
    if (rlm.detected) {
      return '💎 RLM present - Sharps fading public';
    }
    
    if (movement.magnitude === 'Significant') {
      return '⚠️ Major line movement - Market has strong opinion';
    }
    
    return '📊 Normal line movement - No special signals';
  }

  static identifyValueOpportunity(movement, gameState) {
    const lineMove = Math.abs(parseFloat(movement.line_movement));
    const opportunities = [];
    
    if (lineMove > 4) {
      opportunities.push({
        type: 'Overreaction',
        bet: 'Fade the line movement',
        reasoning: 'Lines rarely sustain moves >4 points in-game',
        edge: '5-10%'
      });
    }
    
    if (gameState.quarter === 4 && gameState.timeRemaining < 300 && lineMove > 2) {
      opportunities.push({
        type: 'Late-game volatility',
        bet: 'Middle opportunity possible',
        reasoning: 'Late line moves create middle chances',
        edge: '3-7%'
      });
    }
    
    return opportunities.length > 0 ? opportunities : [{
      message: 'No clear value from odds movement'
    }];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ⏱️ TIMEOUT & COACHING ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class TimeoutImpactAnalyzer {
  
  static analyzeTimeoutImpact(gameState, timeoutTeam, situation) {
    const timingAnalysis = this.analyzeTimeoutTiming(gameState, situation);
    const expectedAdjustments = this.predictCoachingAdjustments(timeoutTeam, situation);
    const momentumImpact = this.assessMomentumImpact(situation, gameState);
    const statistically = this.historicalTimeoutImpact(timeoutTeam, situation);
    
    return {
      timing: timingAnalysis,
      expectedAdjustments,
      momentumImpact,
      historical: statistically,
      bettingAngle: this.generateTimeoutBettingAngle(timingAnalysis, momentumImpact),
      nextPossessionValue: this.predictNextPossession(timeoutTeam, situation)
    };
  }

  static analyzeTimeoutTiming(gameState, situation) {
    const quarter = gameState.quarter;
    const timeRemaining = gameState.timeRemaining;
    const scoreDiff = Math.abs(situation.scoreDiff || 0);
    
    let timing_rating = '';
    let purpose = '';
    
    if (situation.opponentRun >= 8) {
      timing_rating = 'Critical - Stop momentum';
      purpose = 'Break opponent run';
    } else if (quarter === 4 && timeRemaining < 120) {
      timing_rating = 'Strategic - ATO setup';
      purpose = 'Draw up play';
    } else if (situation.poor_execution) {
      timing_rating = 'Corrective - Fix execution';
      purpose = 'Coaching adjustment';
    } else {
      timing_rating = 'Standard rotation';
      purpose = 'Rest/substitution';
    }
    
    return {
      quarter: quarter,
      timeRemaining: (timeRemaining / 60).toFixed(1) + ' min',
      rating: timing_rating,
      purpose: purpose,
      effectiveness: this.predictTimeoutEffectiveness(purpose, gameState)
    };
  }

  static predictTimeoutEffectiveness(purpose, gameState) {
    if (purpose === 'Break opponent run') {
      return {
        probability: '65%',
        outcome: 'Often stops run temporarily',
        bettingImpact: 'Lean toward timeout team next 2-3 possessions'
      };
    }
    
    if (purpose === 'Draw up play') {
      return {
        probability: '55%',
        outcome: 'ATO plays succeed ~55% of time',
        bettingImpact: 'Slight edge on timeout team to score'
      };
    }
    
    return {
      probability: '50%',
      outcome: 'Neutral impact',
      bettingImpact: 'No strong signal'
    };
  }

  static predictCoachingAdjustments(team, situation) {
    const adjustments = [];
    
    if (situation.opponentRun >= 8) {
      adjustments.push('Defensive scheme change likely');
      adjustments.push('May switch matchups');
    }
    
    if (situation.poor_shooting) {
      adjustments.push('Offensive sets adjustment');
      adjustments.push('More ball movement emphasized');
    }
    
    if (situation.turnover_heavy) {
      adjustments.push('Emphasis on ball security');
      adjustments.push('Simplified offensive sets');
    }
    
    return adjustments.length > 0 ? adjustments : ['Standard timeout - rest and regroup'];
  }

  static assessMomentumImpact(situation, gameState) {
    if (situation.opponentRun >= 12) {
      return {
        current: 'Opponent has STRONG momentum',
        expected_change: 'Timeout should disrupt ~70% of the time',
        betting_impact: '✅ Fade opponent momentum after timeout',
        confidence: 'Moderate-High'
      };
    }
    
    if (situation.opponentRun >= 8) {
      return {
        current: 'Opponent building momentum',
        expected_change: 'Timeout likely slows opponent',
        betting_impact: '📊 Slight edge to timeout team',
        confidence: 'Moderate'
      };
    }
    
    return {
      current: 'Neutral momentum',
      expected_change: 'Minimal impact expected',
      betting_impact: 'No strong signal',
      confidence: 'Low'
    };
  }

  static historicalTimeoutImpact(team, situation) {
    // Simplified historical analysis
    return {
      next_possession_success: '52%',
      points_next_3_min: '5.2 average',
      run_stopped_pct: '67%',
      overall_effectiveness: 'Above average'
    };
  }

  static generateTimeoutBettingAngle(timing, momentum) {
    if (timing.purpose === 'Break opponent run' && momentum.confidence === 'Moderate-High') {
      return '🎯 BET: Timeout team to score next + fade opponent momentum';
    }
    
    if (timing.purpose === 'Draw up play') {
      return '📊 LEAN: Timeout team to score next possession';
    }
    
    return '⚖️ NEUTRAL: No strong timeout betting angle';
  }

  static predictNextPossession(team, situation) {
    let successProb = 0.50; // Base 50%
    
    // ATO plays are more successful
    if (situation.ato_situation) successProb += 0.05;
    
    // After stopping run, teams often respond
    if (situation.opponentRun >= 8) successProb += 0.08;
    
    // Late game pressure
    if (situation.clutch) successProb += 0.03;
    
    return {
      score_probability: (successProb * 100).toFixed(1) + '%',
      expected_points: (successProb * 2.0 + 0.5).toFixed(2),
      confidence: successProb > 0.55 ? 'Moderate' : 'Low',
      recommendation: successProb > 0.55 
        ? `Lean ${team.name} to score next` 
        : 'No strong lean'
    };
  }
}

export default {
  MomentumTracker,
  LivePropAnalyzer,
  LiveOddsTracker,
  TimeoutImpactAnalyzer
};
