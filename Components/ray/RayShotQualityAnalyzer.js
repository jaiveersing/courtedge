// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🎯 RAY SHOT QUALITY ANALYZER - ADVANCED SHOOTING METRICS & QUALITY ANALYSIS                                         ║
// ║  Shot Selection • Shot Charts • Quality Ratings • Defensive Pressure • Expected Points • Shot Distribution          ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 SHOT ZONE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export const SHOT_ZONES = {
  RESTRICTED_AREA: {
    name: "Restricted Area",
    range: "0-3 feet",
    avgFG: 0.655,
    value: 1.31,
    frequency: 0.25,
    difficulty: 1
  },
  PAINT_NON_RA: {
    name: "In the Paint (Non-RA)",
    range: "3-10 feet",
    avgFG: 0.425,
    value: 0.85,
    frequency: 0.18,
    difficulty: 3
  },
  MID_RANGE_SHORT: {
    name: "Short Mid-Range",
    range: "10-16 feet",
    avgFG: 0.405,
    value: 0.81,
    frequency: 0.12,
    difficulty: 5
  },
  MID_RANGE_LONG: {
    name: "Long Mid-Range",
    range: "16-23.75 feet",
    avgFG: 0.395,
    value: 0.79,
    frequency: 0.10,
    difficulty: 6
  },
  CORNER_THREE: {
    name: "Corner Three",
    range: "22 feet (corners)",
    avgFG: 0.395,
    value: 1.185,
    frequency: 0.12,
    difficulty: 4
  },
  ABOVE_BREAK_THREE: {
    name: "Above the Break Three",
    range: "23.75+ feet",
    avgFG: 0.365,
    value: 1.095,
    frequency: 0.23,
    difficulty: 5
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 SHOT QUALITY CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ShotQualityAnalyzer {
  
  static calculateShotQuality(shot) {
    // Comprehensive shot quality score (0-100)
    const factors = {
      distance: this.distanceQuality(shot.distance),
      openness: this.opennessQuality(shot.defenderDistance),
      shotClock: this.shotClockQuality(shot.shotClockRemaining),
      gameContext: this.gameContextQuality(shot.gameSituation),
      shooterSkill: this.shooterSkillQuality(shot.shooterRating, shot.shotType),
      assistedBonus: shot.assisted ? 8 : 0
    };
    
    const baseQuality = Object.values(factors).reduce((sum, val) => sum + val, 0) / 6;
    const adjustedQuality = this.applyContextAdjustments(baseQuality, shot);
    
    return {
      overallQuality: Math.min(100, Math.max(0, adjustedQuality)).toFixed(1),
      factors,
      expectedPoints: this.calculateExpectedPoints(adjustedQuality, shot),
      grade: this.gradeShot(adjustedQuality),
      recommendation: this.generateRecommendation(adjustedQuality, shot)
    };
  }

  static distanceQuality(distance) {
    // Optimal distances get higher scores
    if (distance <= 3) return 95; // At rim
    if (distance <= 10) return 70; // Paint
    if (distance >= 22 && distance <= 24) return 80; // Three point range
    if (distance >= 10 && distance < 22) return 45; // Mid-range (inefficient)
    if (distance > 24) return 65; // Deep three
    return 50;
  }

  static opennessQuality(defenderDistance) {
    // Defender distance in feet
    if (defenderDistance >= 6) return 100; // Wide open
    if (defenderDistance >= 4) return 85; // Open
    if (defenderDistance >= 2) return 60; // Contested
    if (defenderDistance >= 1) return 35; // Tightly contested
    return 15; // Heavily contested
  }

  static shotClockQuality(remaining) {
    // Shot clock remaining in seconds
    if (remaining >= 15) return 90; // Early in clock
    if (remaining >= 10) return 75; // Mid clock
    if (remaining >= 7) return 60; // Getting late
    if (remaining >= 4) return 40; // Rushed
    return 20; // Desperation
  }

  static gameContextQuality(situation) {
    const { quarter, timeRemaining, scoreDiff } = situation;
    
    let contextScore = 75; // Neutral
    
    // Pressure situations
    if (quarter === 4 && timeRemaining < 120) {
      if (Math.abs(scoreDiff) <= 5) {
        contextScore -= 15; // High pressure
      }
    }
    
    // Garbage time
    if (quarter === 4 && Math.abs(scoreDiff) > 20) {
      contextScore -= 10; // Less meaningful
    }
    
    return contextScore;
  }

  static shooterSkillQuality(shooterRating, shotType) {
    // Shooter rating 0-100, shot type (e.g., "catch_and_shoot", "pullup", "driving")
    let baseRating = shooterRating;
    
    // Shot type adjustments
    const typeMultipliers = {
      catch_and_shoot: 1.1,
      spot_up: 1.05,
      pullup: 0.95,
      step_back: 0.85,
      contested_jumper: 0.75,
      driving_layup: 1.15,
      dunk: 1.25,
      hook_shot: 0.8,
      floater: 0.9
    };
    
    return baseRating * (typeMultipliers[shotType] || 1.0);
  }

  static applyContextAdjustments(baseQuality, shot) {
    let adjusted = baseQuality;
    
    // Hot hand bonus
    if (shot.recentShooting && shot.recentShooting.last5FG > 0.6) {
      adjusted += 5;
    }
    
    // Fatigue penalty
    if (shot.minutesPlayed > 35) {
      adjusted -= 3;
    }
    
    // Back-to-back penalty
    if (shot.backToBack) {
      adjusted -= 4;
    }
    
    // Home court advantage
    if (shot.isHome) {
      adjusted += 2;
    }
    
    return adjusted;
  }

  static calculateExpectedPoints(quality, shot) {
    const baseExpectation = shot.isThree ? 1.05 : 0.85; // League average points per shot
    const qualityMultiplier = quality / 75; // 75 is average quality
    
    return (baseExpectation * qualityMultiplier).toFixed(3);
  }

  static gradeShot(quality) {
    if (quality >= 85) return "A+";
    if (quality >= 80) return "A";
    if (quality >= 75) return "A-";
    if (quality >= 70) return "B+";
    if (quality >= 65) return "B";
    if (quality >= 60) return "B-";
    if (quality >= 55) return "C+";
    if (quality >= 50) return "C";
    if (quality >= 45) return "C-";
    if (quality >= 40) return "D+";
    if (quality >= 35) return "D";
    return "F";
  }

  static generateRecommendation(quality, shot) {
    if (quality >= 80) return "Excellent shot - Green light!";
    if (quality >= 70) return "Good shot - Take it";
    if (quality >= 60) return "Acceptable shot - Okay to take";
    if (quality >= 50) return "Marginal shot - Look for better option";
    if (quality >= 40) return "Poor shot - Pass if possible";
    return "Bad shot - Avoid this look";
  }

  static generateShotChart(playerShots) {
    // Generate heat map data for shot chart
    const zones = {};
    
    Object.keys(SHOT_ZONES).forEach(zoneKey => {
      zones[zoneKey] = {
        attempts: 0,
        makes: 0,
        fg_pct: 0,
        expected_fg: SHOT_ZONES[zoneKey].avgFG,
        performance: 0
      };
    });
    
    playerShots.forEach(shot => {
      const zone = this.classifyShot(shot);
      zones[zone].attempts++;
      if (shot.made) zones[zone].makes++;
    });
    
    // Calculate percentages and performance
    Object.keys(zones).forEach(zone => {
      if (zones[zone].attempts > 0) {
        zones[zone].fg_pct = zones[zone].makes / zones[zone].attempts;
        zones[zone].performance = zones[zone].fg_pct - zones[zone].expected_fg;
      }
    });
    
    return {
      zones,
      totalShots: playerShots.length,
      averageQuality: this.calculateAverageShotQuality(playerShots),
      hotZones: this.identifyHotZones(zones),
      coldZones: this.identifyColdZones(zones),
      visualization: this.createVisualizationData(zones)
    };
  }

  static classifyShot(shot) {
    const distance = shot.distance;
    const isCorner = shot.location.x > 20; // Simplified corner detection
    
    if (distance <= 3) return "RESTRICTED_AREA";
    if (distance <= 10) return "PAINT_NON_RA";
    if (distance <= 16) return "MID_RANGE_SHORT";
    if (distance < 22) return "MID_RANGE_LONG";
    if (isCorner) return "CORNER_THREE";
    return "ABOVE_BREAK_THREE";
  }

  static calculateAverageShotQuality(shots) {
    if (shots.length === 0) return 0;
    const totalQuality = shots.reduce((sum, shot) => {
      const quality = this.calculateShotQuality(shot);
      return sum + parseFloat(quality.overallQuality);
    }, 0);
    return (totalQuality / shots.length).toFixed(1);
  }

  static identifyHotZones(zones) {
    return Object.entries(zones)
      .filter(([_, data]) => data.attempts >= 5 && data.performance > 0.05)
      .map(([zone, data]) => ({
        zone: SHOT_ZONES[zone].name,
        fg_pct: (data.fg_pct * 100).toFixed(1) + '%',
        above_expected: (data.performance * 100).toFixed(1) + '%'
      }));
  }

  static identifyColdZones(zones) {
    return Object.entries(zones)
      .filter(([_, data]) => data.attempts >= 5 && data.performance < -0.05)
      .map(([zone, data]) => ({
        zone: SHOT_ZONES[zone].name,
        fg_pct: (data.fg_pct * 100).toFixed(1) + '%',
        below_expected: (data.performance * 100).toFixed(1) + '%'
      }));
  }

  static createVisualizationData(zones) {
    return Object.entries(zones).map(([zoneKey, data]) => ({
      zone: SHOT_ZONES[zoneKey].name,
      attempts: data.attempts,
      makes: data.makes,
      fg_pct: (data.fg_pct * 100).toFixed(1),
      expected: (data.expected_fg * 100).toFixed(1),
      heat: this.calculateHeat(data.performance),
      color: this.getHeatColor(data.performance)
    }));
  }

  static calculateHeat(performance) {
    // Convert performance to 0-100 heat scale
    return Math.min(100, Math.max(0, (performance + 0.15) * 333)).toFixed(0);
  }

  static getHeatColor(performance) {
    if (performance >= 0.1) return "#00ff00"; // Bright green
    if (performance >= 0.05) return "#90ee90"; // Light green
    if (performance >= 0.0) return "#ffff00"; // Yellow
    if (performance >= -0.05) return "#ffa500"; // Orange
    return "#ff0000"; // Red
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🛡️ DEFENSIVE IMPACT ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class DefensiveImpactAnalyzer {
  
  static analyzeDefensiveImpact(player) {
    const metrics = {
      contestRate: this.calculateContestRate(player),
      disruptionScore: this.calculateDisruptionScore(player),
      switchability: this.calculateSwitchability(player),
      rimProtection: this.calculateRimProtection(player),
      perimeterDefense: this.calculatePerimeterDefense(player),
      helpDefense: this.calculateHelpDefense(player),
      reboundImpact: this.calculateReboundImpact(player)
    };
    
    const overallRating = this.calculateOverallDefensiveRating(metrics);
    
    return {
      overallRating,
      grade: this.gradeDefense(overallRating),
      metrics,
      strengths: this.identifyStrengths(metrics),
      weaknesses: this.identifyWeaknesses(metrics),
      comparison: this.compareToPosition(player.position, metrics),
      impactEstimate: this.estimateWinShares(overallRating)
    };
  }

  static calculateContestRate(player) {
    // Percentage of opponent shots contested
    const contested = player.defense?.contested_shots || 0;
    const opportunities = player.defense?.contest_opportunities || 1;
    
    const rate = (contested / opportunities) * 100;
    
    return {
      rate: rate.toFixed(1) + '%',
      volume: contested.toFixed(1),
      grade: rate > 75 ? 'Elite' : rate > 65 ? 'Good' : rate > 55 ? 'Average' : 'Below Average'
    };
  }

  static calculateDisruptionScore(player) {
    // Composite score of steals, blocks, deflections, charges
    const steals = player.stats?.stl || 0;
    const blocks = player.stats?.blk || 0;
    const deflections = player.defense?.deflections || steals * 2.5;
    const charges = player.defense?.charges || 0.2;
    
    const score = (steals * 3) + (blocks * 3) + (deflections * 0.5) + (charges * 2);
    
    return {
      score: score.toFixed(2),
      stealsPerGame: steals.toFixed(1),
      blocksPerGame: blocks.toFixed(1),
      deflectionsPerGame: deflections.toFixed(1),
      rating: score > 8 ? 'Elite' : score > 6 ? 'Good' : score > 4 ? 'Average' : 'Poor'
    };
  }

  static calculateSwitchability(player) {
    // Ability to guard multiple positions
    const height = player.height_inches || 78;
    const lateralQuickness = player.athleticism?.lateral_quickness || 70;
    const bbiq = player.bbiq || 75;
    
    // Taller players have harder time switching
    const heightPenalty = Math.max(0, (height - 78) * 2);
    const score = (lateralQuickness + bbiq) / 2 - heightPenalty;
    
    return {
      score: Math.max(0, score).toFixed(1),
      positions: this.getDefensiblePositions(score),
      versatility: score > 75 ? 'Elite' : score > 65 ? 'Good' : score > 55 ? 'Average' : 'Limited'
    };
  }

  static calculateRimProtection(player) {
    const blocks = player.stats?.blk || 0;
    const oppFgAtRim = player.defense?.opp_fg_at_rim || 0.60;
    const leagueAvg = 0.655;
    
    const impact = (leagueAvg - oppFgAtRim) * 100;
    
    return {
      blocksPerGame: blocks.toFixed(1),
      oppFgAtRim: (oppFgAtRim * 100).toFixed(1) + '%',
      impactVsAvg: impact.toFixed(1) + '%',
      rating: impact > 8 ? 'Elite' : impact > 4 ? 'Good' : impact > 0 ? 'Average' : 'Poor'
    };
  }

  static calculatePerimeterDefense(player) {
    const oppThreePct = player.defense?.opp_three_pct || 0.365;
    const leagueAvg = 0.365;
    const closeouts = player.defense?.closeouts || 5;
    
    const impact = (leagueAvg - oppThreePct) * 100;
    
    return {
      oppThreePct: (oppThreePct * 100).toFixed(1) + '%',
      impactVsAvg: impact.toFixed(1) + '%',
      closeoutsPerGame: closeouts.toFixed(1),
      rating: impact > 3 ? 'Elite' : impact > 1 ? 'Good' : impact > -1 ? 'Average' : 'Poor'
    };
  }

  static calculateHelpDefense(player) {
    const rotations = player.defense?.help_rotations || 3;
    const charges = player.defense?.charges || 0.2;
    const bbiq = player.bbiq || 75;
    
    const score = (rotations * 2) + (charges * 5) + (bbiq / 10);
    
    return {
      rotationsPerGame: rotations.toFixed(1),
      chargesDrawn: charges.toFixed(2),
      score: score.toFixed(2),
      rating: score > 12 ? 'Elite' : score > 9 ? 'Good' : score > 6 ? 'Average' : 'Poor'
    };
  }

  static calculateReboundImpact(player) {
    const dreb = player.stats?.reb * 0.7 || 5;
    const boxOuts = player.defense?.box_outs || dreb * 1.5;
    
    return {
      defensiveRebounds: dreb.toFixed(1),
      boxOutsPerGame: boxOuts.toFixed(1),
      reboundRate: ((dreb / 48) * 100).toFixed(1) + '%',
      impact: 'Moderate'
    };
  }

  static calculateOverallDefensiveRating(metrics) {
    const weights = {
      contestRate: 0.15,
      disruptionScore: 0.20,
      switchability: 0.15,
      rimProtection: 0.15,
      perimeterDefense: 0.15,
      helpDefense: 0.10,
      reboundImpact: 0.10
    };
    
    const scores = {
      contestRate: parseFloat(metrics.contestRate.rate),
      disruptionScore: parseFloat(metrics.disruptionScore.score) * 10,
      switchability: parseFloat(metrics.switchability.score),
      rimProtection: parseFloat(metrics.rimProtection.oppFgAtRim) > 60 ? 70 : 85,
      perimeterDefense: parseFloat(metrics.perimeterDefense.oppThreePct) > 36 ? 70 : 85,
      helpDefense: parseFloat(metrics.helpDefense.score) * 6,
      reboundImpact: parseFloat(metrics.reboundImpact.defensiveRebounds) * 10
    };
    
    let totalScore = 0;
    Object.keys(weights).forEach(key => {
      totalScore += (scores[key] || 70) * weights[key];
    });
    
    return totalScore.toFixed(1);
  }

  static gradeDefense(rating) {
    if (rating >= 90) return "A+ (Elite)";
    if (rating >= 85) return "A (Excellent)";
    if (rating >= 80) return "A- (Very Good)";
    if (rating >= 75) return "B+ (Good)";
    if (rating >= 70) return "B (Above Average)";
    if (rating >= 65) return "B- (Average)";
    if (rating >= 60) return "C+ (Below Average)";
    if (rating >= 55) return "C (Poor)";
    return "D (Very Poor)";
  }

  static identifyStrengths(metrics) {
    const strengths = [];
    
    if (parseFloat(metrics.contestRate.rate) > 70) {
      strengths.push("High contest rate");
    }
    if (parseFloat(metrics.disruptionScore.score) > 7) {
      strengths.push("Excellent disruptor");
    }
    if (parseFloat(metrics.switchability.score) > 70) {
      strengths.push("Versatile defender");
    }
    if (metrics.rimProtection.rating === 'Elite') {
      strengths.push("Elite rim protector");
    }
    
    return strengths.length > 0 ? strengths : ["Limited defensive strengths"];
  }

  static identifyWeaknesses(metrics) {
    const weaknesses = [];
    
    if (parseFloat(metrics.contestRate.rate) < 60) {
      weaknesses.push("Low contest rate");
    }
    if (parseFloat(metrics.disruptionScore.score) < 4) {
      weaknesses.push("Limited disruption");
    }
    if (parseFloat(metrics.switchability.score) < 55) {
      weaknesses.push("Limited versatility");
    }
    
    return weaknesses.length > 0 ? weaknesses : ["Well-rounded defender"];
  }

  static compareToPosition(position, metrics) {
    const positionAverages = {
      PG: { overall: 68, perimeter: 75, rim: 45 },
      SG: { overall: 70, perimeter: 78, rim: 50 },
      SF: { overall: 72, perimeter: 75, rim: 60 },
      PF: { overall: 73, perimeter: 68, rim: 75 },
      C: { overall: 75, perimeter: 60, rim: 85 }
    };
    
    const avg = positionAverages[position] || positionAverages.SF;
    
    return {
      positionAverage: avg.overall,
      comparison: "Analysis vs position peers"
    };
  }

  static estimateWinShares(rating) {
    // Rough estimate of defensive win shares
    const dws = ((rating - 50) / 100) * 5;
    return Math.max(0, dws).toFixed(2);
  }

  static getDefensiblePositions(switchScore) {
    if (switchScore > 80) return "1-5 (All positions)";
    if (switchScore > 70) return "1-4";
    if (switchScore > 60) return "2-4";
    if (switchScore > 50) return "3-4";
    return "Primary position only";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔥 HOT HAND ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class HotHandAnalyzer {
  
  static analyzeHotHand(recentShots, playerAverage) {
    const streaks = this.identifyStreaks(recentShots);
    const momentum = this.calculateMomentum(recentShots);
    const confidence = this.estimateConfidence(recentShots, streaks);
    
    return {
      isHot: this.determineHotStatus(recentShots, playerAverage),
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      momentum: momentum,
      confidence: confidence,
      recommendation: this.generateRecommendation(momentum, confidence),
      shotByShot: this.analyzeShotSequence(recentShots)
    };
  }

  static identifyStreaks(shots) {
    let currentStreak = 0;
    let longestMake = 0;
    let longestMiss = 0;
    let tempMake = 0;
    let tempMiss = 0;
    
    shots.forEach((shot, i) => {
      if (shot.made) {
        tempMake++;
        tempMiss = 0;
        if (i === shots.length - 1) currentStreak = tempMake;
      } else {
        tempMiss++;
        tempMake = 0;
        if (i === shots.length - 1) currentStreak = -tempMiss;
      }
      
      longestMake = Math.max(longestMake, tempMake);
      longestMiss = Math.max(longestMiss, tempMiss);
    });
    
    return {
      current: currentStreak,
      longest: { makes: longestMake, misses: longestMiss },
      type: currentStreak > 0 ? 'making' : currentStreak < 0 ? 'missing' : 'neutral'
    };
  }

  static calculateMomentum(shots) {
    // Weighted recent performance (more recent = more weight)
    let weightedSum = 0;
    let totalWeight = 0;
    
    shots.forEach((shot, i) => {
      const weight = i + 1; // More recent shots get more weight
      weightedSum += (shot.made ? 1 : 0) * weight;
      totalWeight += weight;
    });
    
    const momentum = (weightedSum / totalWeight) * 100;
    
    return {
      score: momentum.toFixed(1),
      trend: momentum > 60 ? 'Heating up' : momentum > 40 ? 'Neutral' : 'Cooling off',
      strength: momentum > 70 ? 'Strong' : momentum > 55 ? 'Moderate' : momentum > 45 ? 'Weak' : 'Very Weak'
    };
  }

  static estimateConfidence(shots, streaks) {
    const recentFG = shots.slice(-5).filter(s => s.made).length / 5;
    const streakBonus = Math.max(0, streaks.current) * 5;
    
    const confidence = Math.min(100, (recentFG * 80) + streakBonus);
    
    return {
      level: confidence.toFixed(1),
      rating: confidence > 80 ? 'Sky High' : confidence > 65 ? 'High' : confidence > 50 ? 'Moderate' : confidence > 35 ? 'Low' : 'Very Low',
      impact: this.confidenceImpact(confidence)
    };
  }

  static confidenceImpact(confidence) {
    const boost = (confidence - 50) / 100;
    return {
      fgBoost: (boost * 8).toFixed(1) + '%',
      shotSelection: confidence > 70 ? 'More aggressive' : confidence < 40 ? 'More passive' : 'Normal'
    };
  }

  static determineHotStatus(shots, playerAverage) {
    const recentFG = shots.filter(s => s.made).length / shots.length;
    const threshold = playerAverage * 1.2; // 20% above average
    
    return {
      isHot: recentFG > threshold,
      recentFG: (recentFG * 100).toFixed(1) + '%',
      playerAverage: (playerAverage * 100).toFixed(1) + '%',
      difference: ((recentFG - playerAverage) * 100).toFixed(1) + '%'
    };
  }

  static generateRecommendation(momentum, confidence) {
    if (parseFloat(momentum.score) > 65 && parseFloat(confidence.level) > 70) {
      return "🔥 HOT HAND - Feed this player!";
    }
    if (parseFloat(momentum.score) > 55 && parseFloat(confidence.level) > 60) {
      return "Heating up - Give him opportunities";
    }
    if (parseFloat(momentum.score) < 40 || parseFloat(confidence.level) < 40) {
      return "Cold - Look elsewhere for scoring";
    }
    return "Neutral - Normal usage rate";
  }

  static analyzeShotSequence(shots) {
    return shots.slice(-10).map((shot, i) => ({
      shotNumber: i + 1,
      result: shot.made ? 'Make' : 'Miss',
      shotType: shot.type,
      distance: shot.distance.toFixed(1) + ' ft',
      quality: shot.quality
    }));
  }

  static clusteringEffect(shots, windowSize = 5) {
    // Analyze if makes/misses cluster more than random
    const windows = [];
    
    for (let i = 0; i <= shots.length - windowSize; i++) {
      const window = shots.slice(i, i + windowSize);
      const makes = window.filter(s => s.made).length;
      windows.push(makes);
    }
    
    const variance = this.calculateVariance(windows);
    const expectedVariance = (windowSize * 0.45 * 0.55); // Binomial variance
    
    return {
      actualVariance: variance.toFixed(2),
      expectedVariance: expectedVariance.toFixed(2),
      clustering: variance > expectedVariance ? 'Above expected' : 'Below expected',
      interpretation: variance > expectedVariance 
        ? 'Shots are clustering (hot hand evidence)' 
        : 'Shots are random (no hot hand)'
    };
  }

  static calculateVariance(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📍 PLAY TYPE ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PlayTypeAnalyzer {
  
  static analyzePlayTypes(playerData) {
    const playTypes = {
      isolation: this.analyzeIsolation(playerData),
      pickAndRoll: this.analyzePickAndRoll(playerData),
      spotUp: this.analyzeSpotUp(playerData),
      transition: this.analyzeTransition(playerData),
      postUp: this.analyzePostUp(playerData),
      cutting: this.analyzeCutting(playerData),
      offScreen: this.analyzeOffScreen(playerData),
      putbacks: this.analyzePutbacks(playerData)
    };
    
    return {
      playTypes,
      mostEfficient: this.findMostEfficient(playTypes),
      mostFrequent: this.findMostFrequent(playTypes),
      recommendations: this.generatePlayTypeRecommendations(playTypes),
      optimalMix: this.calculateOptimalMix(playTypes)
    };
  }

  static analyzeIsolation(data) {
    const freq = data.playTypes?.isolation?.frequency || 0.15;
    const ppp = data.playTypes?.isolation?.ppp || 0.92;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: ppp > 1.0 ? 'Excellent' : ppp > 0.90 ? 'Good' : ppp > 0.80 ? 'Average' : 'Poor',
      volume: (freq * 100).toFixed(0) + ' possessions per 100'
    };
  }

  static analyzePickAndRoll(data) {
    const freq = data.playTypes?.pickAndRoll?.frequency || 0.25;
    const ppp = data.playTypes?.pickAndRoll?.ppp || 0.95;
    const asHandler = data.playTypes?.pickAndRoll?.asHandler || 0.70;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      asHandler: (asHandler * 100).toFixed(1) + '%',
      asRoller: ((1 - asHandler) * 100).toFixed(1) + '%',
      efficiency: ppp > 1.0 ? 'Excellent' : ppp > 0.90 ? 'Good' : 'Average'
    };
  }

  static analyzeSpotUp(data) {
    const freq = data.playTypes?.spotUp?.frequency || 0.20;
    const ppp = data.playTypes?.spotUp?.ppp || 1.05;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: ppp > 1.10 ? 'Elite' : ppp > 1.00 ? 'Good' : 'Average',
      role: ppp > 1.05 ? 'Primary threat' : 'Secondary option'
    };
  }

  static analyzeTransition(data) {
    const freq = data.playTypes?.transition?.frequency || 0.15;
    const ppp = data.playTypes?.transition?.ppp || 1.15;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: ppp > 1.20 ? 'Elite' : ppp > 1.10 ? 'Good' : 'Average',
      impact: freq > 0.18 ? 'Major transition threat' : 'Moderate'
    };
  }

  static analyzePostUp(data) {
    const freq = data.playTypes?.postUp?.frequency || 0.10;
    const ppp = data.playTypes?.postUp?.ppp || 0.88;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: ppp > 1.0 ? 'Good' : ppp > 0.85 ? 'Average' : 'Below Average',
      usage: freq > 0.15 ? 'Primary post player' : 'Occasional'
    };
  }

  static analyzeCutting(data) {
    const freq = data.playTypes?.cutting?.frequency || 0.08;
    const ppp = data.playTypes?.cutting?.ppp || 1.25;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: 'Typically very efficient',
      timing: freq > 0.10 ? 'Elite cutter' : 'Average'
    };
  }

  static analyzeOffScreen(data) {
    const freq = data.playTypes?.offScreen?.frequency || 0.12;
    const ppp = data.playTypes?.offScreen?.ppp || 1.10;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: ppp > 1.15 ? 'Elite' : ppp > 1.05 ? 'Good' : 'Average',
      usage: freq > 0.15 ? 'Primary off-ball weapon' : 'Moderate'
    };
  }

  static analyzePutbacks(data) {
    const freq = data.playTypes?.putbacks?.frequency || 0.03;
    const ppp = data.playTypes?.putbacks?.ppp || 1.35;
    
    return {
      frequency: (freq * 100).toFixed(1) + '%',
      pointsPerPossession: ppp.toFixed(2),
      efficiency: 'High efficiency (close range)',
      offensive_rebounding: freq > 0.04 ? 'Strong' : 'Average'
    };
  }

  static findMostEfficient(playTypes) {
    let bestPPP = 0;
    let bestPlayType = '';
    
    Object.entries(playTypes).forEach(([type, data]) => {
      const ppp = parseFloat(data.pointsPerPossession);
      if (ppp > bestPPP) {
        bestPPP = ppp;
        bestPlayType = type;
      }
    });
    
    return {
      playType: bestPlayType,
      ppp: bestPPP.toFixed(2),
      recommendation: `Maximize ${bestPlayType} opportunities`
    };
  }

  static findMostFrequent(playTypes) {
    let highestFreq = 0;
    let mostFrequentType = '';
    
    Object.entries(playTypes).forEach(([type, data]) => {
      const freq = parseFloat(data.frequency);
      if (freq > highestFreq) {
        highestFreq = freq;
        mostFrequentType = type;
      }
    });
    
    return {
      playType: mostFrequentType,
      frequency: highestFreq.toFixed(1) + '%'
    };
  }

  static generatePlayTypeRecommendations(playTypes) {
    const recommendations = [];
    
    Object.entries(playTypes).forEach(([type, data]) => {
      const ppp = parseFloat(data.pointsPerPossession);
      const freq = parseFloat(data.frequency);
      
      if (ppp > 1.10 && freq < 15) {
        recommendations.push(`Increase ${type} usage (high efficiency, low volume)`);
      }
      if (ppp < 0.85 && freq > 15) {
        recommendations.push(`Reduce ${type} usage (low efficiency, high volume)`);
      }
    });
    
    return recommendations.length > 0 ? recommendations : ["Current play mix is well-optimized"];
  }

  static calculateOptimalMix(playTypes) {
    // Weight by efficiency and realistic constraints
    const optimal = {};
    let totalWeight = 0;
    
    Object.entries(playTypes).forEach(([type, data]) => {
      const ppp = parseFloat(data.pointsPerPossession);
      const weight = Math.pow(ppp, 2); // Square to emphasize efficiency
      optimal[type] = weight;
      totalWeight += weight;
    });
    
    // Normalize to 100%
    Object.keys(optimal).forEach(type => {
      optimal[type] = ((optimal[type] / totalWeight) * 100).toFixed(1) + '%';
    });
    
    return optimal;
  }
}

export default {
  SHOT_ZONES,
  ShotQualityAnalyzer,
  DefensiveImpactAnalyzer,
  HotHandAnalyzer,
  PlayTypeAnalyzer
};
