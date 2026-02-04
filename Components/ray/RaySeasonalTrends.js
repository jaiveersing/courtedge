// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  📈 RAY SEASONAL TRENDS ANALYZER - PATTERNS, SCHEDULES & FATIGUE MODELING                                           ║
// ║  Monthly Patterns • Schedule Density • Travel Analysis • Back-to-Back Impact • Rest Advantage • Seasonal Trends     ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📅 SEASONAL PATTERN ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class SeasonalPatternAnalyzer {
  
  static analyzeSeasonalTrends(player, currentDate) {
    const monthlyStats = this.getMonthlyBreakdown(player);
    const seasonPhase = this.determineSeasonPhase(currentDate);
    const trends = this.identifyTrends(monthlyStats, seasonPhase);
    const predictions = this.predictCurrentPerformance(player, seasonPhase, trends);
    
    return {
      currentPhase: seasonPhase,
      monthlyBreakdown: monthlyStats,
      trends,
      predictions,
      bettingImplications: this.generateSeasonalBettingAdvice(trends, seasonPhase),
      comparison: this.compareToCareerNorms(player, seasonPhase)
    };
  }

  static getMonthlyBreakdown(player) {
    const months = ['October', 'November', 'December', 'January', 'February', 'March', 'April'];
    
    return months.map(month => ({
      month,
      ppg: player.monthly?.[month]?.ppg || player.stats?.pts || 20,
      fg_pct: player.monthly?.[month]?.fg_pct || player.fg_pct || 0.45,
      games: player.monthly?.[month]?.games || 10,
      performance_rating: this.rateMonthlyPerformance(player.monthly?.[month])
    }));
  }

  static rateMonthlyPerformance(monthData) {
    if (!monthData) {
return 'Average';
}
    
    const ppg = monthData.ppg || 0;
    const fg = monthData.fg_pct || 0;
    
    if (ppg > 25 && fg > 0.48) {
return 'Elite 🔥';
}
    if (ppg > 22 && fg > 0.45) {
return 'Excellent ⭐';
}
    if (ppg > 19 && fg > 0.42) {
return 'Good ✅';
}
    if (ppg > 16) {
return 'Average ➡️';
}
    return 'Below Average 📉';
  }

  static determineSeasonPhase(date) {
    const month = new Date(date).getMonth() + 1; // 1-12
    
    if (month >= 10 || month <= 11) {
      return {
        phase: 'Early Season',
        month: month === 10 ? 'October' : 'November',
        characteristics: [
          'Players finding rhythm',
          'High energy levels',
          'Defensive intensity high',
          'Offensive efficiency developing'
        ],
        expected_performance: 'Variable - some rust early, building momentum',
        betting_notes: 'UNDERs often hit early, fade overvalued players from previous season'
      };
    }
    
    if (month === 12 || month === 1) {
      return {
        phase: 'Mid-Season',
        month: month === 12 ? 'December' : 'January',
        characteristics: [
          'Peak conditioning',
          'Rhythm established',
          'All-Star push begins',
          'Trade rumors emerge'
        ],
        expected_performance: 'Peak performance window',
        betting_notes: 'OVERs more reliable, target in-form players'
      };
    }
    
    if (month === 2 || month === 3) {
      return {
        phase: 'Post-All-Star',
        month: month === 2 ? 'February' : 'March',
        characteristics: [
          'Playoff push intensifies',
          'Fatigue starts showing',
          'Load management increases',
          'Injuries accumulate'
        ],
        expected_performance: 'Stars elevated, role players decline',
        betting_notes: 'Target star players, fade deep rotation'
      };
    }
    
    return {
      phase: 'Late Season',
      month: 'April',
      characteristics: [
        'Playoff seeding crucial',
        'Rest for secured teams',
        'Desperation for bubble teams',
        'Tank mode for eliminated teams'
      ],
      expected_performance: 'Highly situational - context matters',
      betting_notes: 'Focus on playoff implications, avoid resting teams'
    };
  }

  static identifyTrends(monthlyStats, seasonPhase) {
    const trends = {
      scoring: this.analyzeScoringTrend(monthlyStats),
      efficiency: this.analyzeEfficiencyTrend(monthlyStats),
      consistency: this.analyzeConsistency(monthlyStats),
      peakMonth: this.identifyPeakMonth(monthlyStats),
      weakMonth: this.identifyWeakMonth(monthlyStats)
    };
    
    return trends;
  }

  static analyzeScoringTrend(stats) {
    const scores = stats.map(s => s.ppg);
    const earlyAvg = scores.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
    const lateAvg = scores.slice(-2).reduce((a, b) => a + b, 0) / 2;
    
    const change = ((lateAvg - earlyAvg) / earlyAvg) * 100;
    
    return {
      direction: change > 5 ? 'Improving 📈' : change < -5 ? 'Declining 📉' : 'Stable ➡️',
      change: change.toFixed(1) + '%',
      interpretation: this.interpretScoringTrend(change)
    };
  }

  static interpretScoringTrend(change) {
    if (change > 15) {
return 'Strong positive trend - rider hot hand';
}
    if (change > 8) {
return 'Positive trend - increasing role/confidence';
}
    if (change > -8) {
return 'Stable production throughout season';
}
    if (change > -15) {
return 'Declining trend - fatigue or decreased role';
}
    return 'Significant decline - injury concern or benching';
  }

  static analyzeEfficiencyTrend(stats) {
    const efficiencies = stats.map(s => s.fg_pct);
    const trend = this.calculateTrendSlope(efficiencies);
    
    return {
      slope: trend.toFixed(4),
      direction: trend > 0.01 ? 'Improving' : trend < -0.01 ? 'Declining' : 'Stable',
      significance: Math.abs(trend) > 0.02 ? 'Significant' : 'Minimal'
    };
  }

  static calculateTrendSlope(values) {
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  static analyzeConsistency(stats) {
    const ppgs = stats.map(s => s.ppg);
    const mean = ppgs.reduce((a, b) => a + b, 0) / ppgs.length;
    const variance = ppgs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / ppgs.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    
    return {
      standardDeviation: stdDev.toFixed(2),
      coefficientOfVariation: cv.toFixed(1) + '%',
      rating: cv < 10 ? 'Highly Consistent ✅' : cv < 15 ? 'Consistent 📊' : cv < 20 ? 'Variable ⚡' : 'Inconsistent ⚠️',
      betting_impact: cv < 12 ? 'Reliable for props' : cv < 18 ? 'Moderate prop risk' : 'High prop variance'
    };
  }

  static identifyPeakMonth(stats) {
    let peakMonth = stats[0];
    
    stats.forEach(month => {
      if (month.ppg > peakMonth.ppg) {
        peakMonth = month;
      }
    });
    
    return {
      month: peakMonth.month,
      ppg: peakMonth.ppg.toFixed(1),
      rating: peakMonth.performance_rating,
      insight: `Historically strongest in ${peakMonth.month}`
    };
  }

  static identifyWeakMonth(stats) {
    let weakMonth = stats[0];
    
    stats.forEach(month => {
      if (month.ppg < weakMonth.ppg) {
        weakMonth = month;
      }
    });
    
    return {
      month: weakMonth.month,
      ppg: weakMonth.ppg.toFixed(1),
      rating: weakMonth.performance_rating,
      insight: `Historically weakest in ${weakMonth.month}`
    };
  }

  static predictCurrentPerformance(player, seasonPhase, trends) {
    const baselinePPG = player.stats?.pts || 20;
    const phaseMultiplier = this.getPhaseMultiplier(seasonPhase.phase);
    const trendAdjustment = this.getTrendAdjustment(trends);
    
    const projectedPPG = baselinePPG * phaseMultiplier * (1 + trendAdjustment);
    
    return {
      projected_ppg: projectedPPG.toFixed(1),
      baseline: baselinePPG.toFixed(1),
      phase_impact: ((phaseMultiplier - 1) * 100).toFixed(1) + '%',
      trend_impact: (trendAdjustment * 100).toFixed(1) + '%',
      confidence: this.calculatePredictionConfidence(trends),
      range: {
        low: (projectedPPG * 0.85).toFixed(1),
        high: (projectedPPG * 1.15).toFixed(1)
      }
    };
  }

  static getPhaseMultiplier(phase) {
    const multipliers = {
      'Early Season': 0.95,
      'Mid-Season': 1.05,
      'Post-All-Star': 1.02,
      'Late Season': 0.98
    };
    
    return multipliers[phase] || 1.0;
  }

  static getTrendAdjustment(trends) {
    const scoringChange = parseFloat(trends.scoring.change) / 100;
    const direction = trends.efficiency.direction;
    
    let adjustment = scoringChange * 0.3; // Weight scoring trend
    
    if (direction === 'Improving') {
adjustment += 0.03;
}
    if (direction === 'Declining') {
adjustment -= 0.03;
}
    
    return adjustment;
  }

  static calculatePredictionConfidence(trends) {
    let confidence = 60;
    
    const cv = parseFloat(trends.consistency.coefficientOfVariation);
    if (cv < 12) {
confidence += 20;
} else if (cv < 18) {
confidence += 10;
} else {
confidence -= 10;
}
    
    if (trends.scoring.direction.includes('Stable')) {
confidence += 10;
}
    
    return {
      score: Math.min(100, confidence),
      level: confidence > 75 ? 'High' : confidence > 60 ? 'Moderate' : 'Low'
    };
  }

  static generateSeasonalBettingAdvice(trends, seasonPhase) {
    const advice = [];
    
    if (seasonPhase.phase === 'Early Season') {
      advice.push('📉 Early season UNDERs often profitable');
      advice.push('⏳ Wait 10+ games before heavy player props');
    }
    
    if (seasonPhase.phase === 'Mid-Season' && trends.scoring.direction.includes('Improving')) {
      advice.push('🔥 Strong BUY - player hitting stride');
      advice.push('📈 Target OVERs on this player');
    }
    
    if (seasonPhase.phase === 'Post-All-Star') {
      advice.push('⭐ Stars play more minutes - target top players');
      advice.push('⚠️ Fade deep bench - inconsistent minutes');
    }
    
    if (seasonPhase.phase === 'Late Season') {
      advice.push('🎯 Context is EVERYTHING - check playoff implications');
      advice.push('💤 Avoid players on secured playoff teams (rest risk)');
    }
    
    if (trends.consistency.rating.includes('Inconsistent')) {
      advice.push('⚡ High variance - use smaller unit sizes');
    }
    
    return advice;
  }

  static compareToCareerNorms(player, seasonPhase) {
    const careerAvg = player.career?.ppg || player.stats?.pts || 20;
    const currentProjection = parseFloat(this.predictCurrentPerformance(player, seasonPhase, {
      scoring: { direction: 'Stable', change: '0' },
      efficiency: { direction: 'Stable' },
      consistency: { coefficientOfVariation: '15' }
    }).projected_ppg);
    
    const variance = ((currentProjection - careerAvg) / careerAvg) * 100;
    
    return {
      career_average: careerAvg.toFixed(1),
      current_projection: currentProjection.toFixed(1),
      variance: variance.toFixed(1) + '%',
      status: variance > 10 ? 'Outperforming career norms' : variance < -10 ? 'Underperforming career norms' : 'On pace with career'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ✈️ TRAVEL & SCHEDULE ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class TravelScheduleAnalyzer {
  
  static analyzeSchedule(team, upcomingGames) {
    const density = this.analyzeScheduleDensity(upcomingGames);
    const travel = this.analyzeTravelLoad(upcomingGames);
    const backToBacks = this.analyzeBackToBacks(upcomingGames);
    const restAdvantage = this.analyzeRestAdvantage(upcomingGames);
    const fatigueRisk = this.calculateFatigueRisk(density, travel, backToBacks);
    
    return {
      scheduleDensity: density,
      travelLoad: travel,
      backToBackGames: backToBacks,
      restAdvantage: restAdvantage,
      fatigueRisk: fatigueRisk,
      bettingStrategy: this.generateScheduleStrategy(density, travel, backToBacks, fatigueRisk),
      alertDays: this.identifyAlertDays(upcomingGames, fatigueRisk)
    };
  }

  static analyzeScheduleDensity(games) {
    const days = 14; // Look ahead 2 weeks
    const gamesInPeriod = games.filter(g => g.daysFromNow <= days).length;
    const gamesPerWeek = (gamesInPeriod / days) * 7;
    
    return {
      next_14_days: gamesInPeriod,
      games_per_week: gamesPerWeek.toFixed(1),
      density_rating: gamesPerWeek > 4.5 ? 'Very Heavy 🔴' : gamesPerWeek > 3.8 ? 'Heavy ⚠️' : gamesPerWeek > 3.2 ? 'Moderate 📊' : 'Light ✅',
      impact: gamesPerWeek > 4.2 ? 'Significant fatigue expected' : gamesPerWeek > 3.5 ? 'Moderate fatigue possible' : 'Manageable schedule',
      betting_implications: gamesPerWeek > 4.2 ? 'Lean UNDERs later in stretch' : 'Normal betting approach'
    };
  }

  static analyzeTravelLoad(games) {
    let totalMiles = 0;
    let consecutiveTravelGames = 0;
    let longestRoadTrip = 0;
    let currentRoadTrip = 0;
    
    games.forEach((game, index) => {
      if (game.isAway) {
        totalMiles += game.travelMiles || 0;
        consecutiveTravelGames++;
        currentRoadTrip++;
        longestRoadTrip = Math.max(longestRoadTrip, currentRoadTrip);
      } else {
        currentRoadTrip = 0;
      }
    });
    
    const avgMilesPerGame = games.length > 0 ? totalMiles / games.length : 0;
    
    return {
      total_miles: totalMiles,
      avg_miles_per_game: avgMilesPerGame.toFixed(0),
      longest_road_trip: longestRoadTrip + ' games',
      travel_burden: totalMiles > 8000 ? 'Extreme 🔴' : totalMiles > 5000 ? 'High ⚠️' : totalMiles > 3000 ? 'Moderate 📊' : 'Low ✅',
      fatigue_impact: totalMiles > 6000 ? 'Major performance hit expected' : totalMiles > 4000 ? 'Noticeable decline likely' : 'Minimal impact',
      timezone_changes: this.estimateTimezoneChanges(totalMiles),
      recommendation: this.getTravelRecommendation(totalMiles, longestRoadTrip)
    };
  }

  static estimateTimezoneChanges(miles) {
    // Rough estimate: every 1000 miles ≈ 1 timezone
    const changes = Math.floor(miles / 1000);
    
    return {
      estimated: changes,
      impact: changes > 6 ? 'Severe circadian disruption' : changes > 3 ? 'Moderate disruption' : 'Minimal disruption'
    };
  }

  static getTravelRecommendation(miles, longestTrip) {
    if (miles > 7000 || longestTrip > 5) {
      return '🚨 EXTREME TRAVEL - Heavily fade this team, especially late in trips';
    }
    
    if (miles > 5000 || longestTrip > 4) {
      return '⚠️ HEAVY TRAVEL - Target UNDERs, especially away games';
    }
    
    if (miles > 3500) {
      return '📊 MODERATE TRAVEL - Slight lean to UNDERs on road';
    }
    
    return '✅ MANAGEABLE TRAVEL - Normal betting approach';
  }

  static analyzeBackToBacks(games) {
    const b2bs = games.filter(g => g.isBackToBack);
    
    const avgPerformanceDecline = 8; // Typical 8% decline on B2Bs
    
    return {
      count: b2bs.length,
      games: b2bs.map(g => ({
        date: g.date,
        opponent: g.opponent,
        isAway: g.isAway,
        warning_level: g.isAway ? '🔴 High Risk' : '⚠️ Moderate Risk'
      })),
      expected_impact: {
        scoring: `-${avgPerformanceDecline}%`,
        efficiency: '-5 to -7%',
        pace: '-2 to -3 possessions'
      },
      betting_advice: b2bs.length > 3 ? '🎯 Target UNDERs on all B2B games' : b2bs.length > 0 ? '📉 Lean UNDER on B2B games' : '✅ No B2B concerns'
    };
  }

  static analyzeRestAdvantage(games) {
    const restAdvantageGames = games.filter(g => g.restAdvantage >= 2);
    const restDisadvantageGames = games.filter(g => g.restAdvantage <= -2);
    
    return {
      advantage_games: {
        count: restAdvantageGames.length,
        games: restAdvantageGames.map(g => ({
          date: g.date,
          opponent: g.opponent,
          rest_days: g.teamRest,
          opponent_rest: g.opponentRest,
          edge: `+${g.restAdvantage} days`
        })),
        expected_boost: '+3 to +5 points per 100 possessions'
      },
      disadvantage_games: {
        count: restDisadvantageGames.length,
        games: restDisadvantageGames.map(g => ({
          date: g.date,
          opponent: g.opponent,
          rest_days: g.teamRest,
          opponent_rest: g.opponentRest,
          deficit: `${g.restAdvantage} days`
        })),
        expected_decline: '-3 to -5 points per 100 possessions'
      },
      betting_strategy: this.getRestBettingStrategy(restAdvantageGames.length, restDisadvantageGames.length)
    };
  }

  static getRestBettingStrategy(advantageCount, disadvantageCount) {
    const strategies = [];
    
    if (advantageCount > 0) {
      strategies.push(`✅ ${advantageCount} games with rest advantage - TARGET these games`);
      strategies.push('📈 Lean team props OVER when well-rested vs tired opponent');
    }
    
    if (disadvantageCount > 0) {
      strategies.push(`⚠️ ${disadvantageCount} games with rest disadvantage - FADE these games`);
      strategies.push('📉 Lean team props UNDER when fatigued');
    }
    
    return strategies.length > 0 ? strategies : ['➡️ No significant rest advantages/disadvantages'];
  }

  static calculateFatigueRisk(density, travel, backToBacks) {
    let riskScore = 0;
    
    // Schedule density impact
    const gamesPerWeek = parseFloat(density.games_per_week);
    if (gamesPerWeek > 4.5) {
riskScore += 30;
} else if (gamesPerWeek > 3.8) {
riskScore += 20;
} else if (gamesPerWeek > 3.2) {
riskScore += 10;
}
    
    // Travel impact
    if (travel.total_miles > 7000) {
riskScore += 30;
} else if (travel.total_miles > 5000) {
riskScore += 20;
} else if (travel.total_miles > 3000) {
riskScore += 10;
}
    
    // Back-to-back impact
    riskScore += backToBacks.count * 10;
    
    riskScore = Math.min(100, riskScore);
    
    return {
      score: riskScore,
      level: riskScore > 70 ? 'EXTREME 🔴' : riskScore > 50 ? 'HIGH ⚠️' : riskScore > 30 ? 'MODERATE 📊' : 'LOW ✅',
      primary_concern: this.identifyPrimaryConcern(density, travel, backToBacks),
      overall_impact: this.describeFatigueImpact(riskScore),
      betting_adjustment: this.getFatigueAdjustment(riskScore)
    };
  }

  static identifyPrimaryConcern(density, travel, backToBacks) {
    const concerns = [];
    
    if (parseFloat(density.games_per_week) > 4.2) {
concerns.push('Heavy game schedule');
}
    if (travel.total_miles > 6000) {
concerns.push('Excessive travel');
}
    if (backToBacks.count > 2) {
concerns.push('Multiple back-to-backs');
}
    
    return concerns.length > 0 ? concerns[0] : 'No major concerns';
  }

  static describeFatigueImpact(score) {
    if (score > 70) {
return 'Severe performance degradation expected across the board';
}
    if (score > 50) {
return 'Significant decline in scoring, efficiency, and defense';
}
    if (score > 30) {
return 'Moderate decline, especially in 4th quarters';
}
    return 'Minimal expected impact on performance';
  }

  static getFatigueAdjustment(score) {
    if (score > 70) {
return 'Reduce all player props by 15-20%, strong UNDER lean';
}
    if (score > 50) {
return 'Reduce props by 10-15%, lean UNDER';
}
    if (score > 30) {
return 'Slight reduction 5-10%, neutral to UNDER lean';
}
    return 'No significant adjustment needed';
  }

  static generateScheduleStrategy(density, travel, backToBacks, fatigueRisk) {
    const strategy = {
      overall_approach: this.getOverallApproach(fatigueRisk.level),
      specific_targets: [],
      avoid_situations: [],
      timing_recommendations: []
    };
    
    if (fatigueRisk.score > 60) {
      strategy.specific_targets.push('🎯 Opponent props OVER (facing fatigued team)');
      strategy.specific_targets.push('📉 Team totals UNDER');
      strategy.avoid_situations.push('❌ Star player OVERs (fatigue risk)');
      strategy.avoid_situations.push('❌ Parlays involving this team');
    }
    
    if (backToBacks.count > 0) {
      strategy.timing_recommendations.push('⏰ Target second game of back-to-backs for UNDERs');
      strategy.timing_recommendations.push('🎯 Fade star players in B2B games');
    }
    
    if (parseFloat(travel.longest_road_trip.split(' ')[0]) > 4) {
      strategy.timing_recommendations.push('📍 Final games of long road trips = best UNDER spots');
    }
    
    return strategy;
  }

  static identifyAlertDays(games, fatigueRisk) {
    const alerts = [];
    
    games.forEach(game => {
      let alertLevel = 'normal';
      const reasons = [];
      
      if (game.isBackToBack && game.isAway) {
        alertLevel = 'high';
        reasons.push('Road back-to-back');
      } else if (game.isBackToBack) {
        alertLevel = 'moderate';
        reasons.push('Back-to-back game');
      }
      
      if (game.travelMiles > 2500) {
        alertLevel = alertLevel === 'high' ? 'extreme' : 'high';
        reasons.push('Long distance travel');
      }
      
      if (game.restAdvantage <= -2) {
        alertLevel = alertLevel === 'high' ? 'extreme' : alertLevel === 'moderate' ? 'high' : 'moderate';
        reasons.push('Rest disadvantage');
      }
      
      if (alertLevel !== 'normal') {
        alerts.push({
          date: game.date,
          opponent: game.opponent,
          alert_level: alertLevel,
          reasons: reasons,
          betting_action: this.getAlertAction(alertLevel),
          confidence: alertLevel === 'extreme' ? 'Very High' : alertLevel === 'high' ? 'High' : 'Moderate'
        });
      }
    });
    
    return alerts;
  }

  static getOverallApproach(fatigueLevel) {
    if (fatigueLevel.includes('EXTREME')) {
      return '🚨 AGGRESSIVE FADE - Heavy UNDER lean, fade all props';
    }
    if (fatigueLevel.includes('HIGH')) {
      return '⚠️ CAUTIOUS FADE - Strong UNDER lean, reduce exposure';
    }
    if (fatigueLevel.includes('MODERATE')) {
      return '📊 SELECTIVE APPROACH - Slight UNDER lean, cherry-pick spots';
    }
    return '✅ NORMAL BETTING - No schedule-based adjustments needed';
  }

  static getAlertAction(level) {
    if (level === 'extreme') {
return '🚨 STRONG FADE - All UNDERs';
}
    if (level === 'high') {
return '⚠️ FADE - Lean UNDERs';
}
    if (level === 'moderate') {
return '📊 CAUTION - Neutral to UNDER';
}
    return '✅ Normal';
  }
}

export default {
  SeasonalPatternAnalyzer,
  TravelScheduleAnalyzer
};
