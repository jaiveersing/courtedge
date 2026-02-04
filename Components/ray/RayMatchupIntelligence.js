// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🏀 RAY MATCHUP INTELLIGENCE - ADVANCED HEAD-TO-HEAD & SITUATIONAL ANALYSIS                                         ║
// ║  H2H Analytics • Style Matchups • Pace Impact • Coaching Tendencies • Injury Impact • Travel Fatigue               ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🥊 HEAD-TO-HEAD ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class HeadToHeadAnalyzer {
  
  static analyzeMatchup(playerA, playerB, historicalData) {
    const directMatchups = this.getDirectMatchups(playerA.id, playerB.id, historicalData);
    const styleComparison = this.comparePlayingStyles(playerA, playerB);
    const advantageAnalysis = this.determineAdvantages(playerA, playerB);
    const projections = this.projectPerformance(playerA, playerB, directMatchups);
    
    return {
      directMatchups: {
        gamesPlayed: directMatchups.length,
        playerA_avg: this.calculateAverageStats(directMatchups, playerA.id),
        playerB_avg: this.calculateAverageStats(directMatchups, playerB.id),
        lastMeeting: directMatchups[directMatchups.length - 1],
        trends: this.analyzeTrends(directMatchups, playerA.id, playerB.id)
      },
      styleComparison,
      advantageAnalysis,
      projections,
      recommendation: this.generateMatchupRecommendation(advantageAnalysis, projections),
      bettingAngle: this.identifyBettingAngles(advantageAnalysis, projections)
    };
  }

  static getDirectMatchups(playerA_id, playerB_id, historicalData) {
    return historicalData.filter(game => 
      (game.players.includes(playerA_id) && game.players.includes(playerB_id))
    );
  }

  static calculateAverageStats(matchups, playerId) {
    const playerGames = matchups.map(m => m.stats[playerId]).filter(s => s);
    
    if (playerGames.length === 0) {
      return { ppg: 0, rpg: 0, apg: 0, fg_pct: 0 };
    }
    
    return {
      ppg: (playerGames.reduce((sum, g) => sum + g.points, 0) / playerGames.length).toFixed(1),
      rpg: (playerGames.reduce((sum, g) => sum + g.rebounds, 0) / playerGames.length).toFixed(1),
      apg: (playerGames.reduce((sum, g) => sum + g.assists, 0) / playerGames.length).toFixed(1),
      fg_pct: ((playerGames.reduce((sum, g) => sum + g.fg_pct, 0) / playerGames.length) * 100).toFixed(1) + '%',
      games: playerGames.length
    };
  }

  static comparePlayingStyles(playerA, playerB) {
    return {
      offensive_style: {
        playerA: this.classifyOffensiveStyle(playerA),
        playerB: this.classifyOffensiveStyle(playerB),
        matchup: this.evaluateStyleMatchup(playerA, playerB, 'offense')
      },
      defensive_style: {
        playerA: this.classifyDefensiveStyle(playerA),
        playerB: this.classifyDefensiveStyle(playerB),
        matchup: this.evaluateStyleMatchup(playerA, playerB, 'defense')
      },
      pace_preference: {
        playerA: playerA.pace_preference || 'Medium',
        playerB: playerB.pace_preference || 'Medium',
        compatibility: this.evaluatePaceCompatibility(playerA, playerB)
      },
      size_advantage: this.evaluateSizeAdvantage(playerA, playerB)
    };
  }

  static classifyOffensiveStyle(player) {
    const usage = player.usage_rate || 25;
    const three_rate = player.three_point_rate || 0.35;
    const assist_rate = player.assist_rate || 20;
    
    if (usage > 30 && three_rate < 0.25) {
return 'Aggressive Scorer (Paint/Mid)';
}
    if (usage > 30 && three_rate > 0.4) {
return 'Volume Three-Point Shooter';
}
    if (assist_rate > 30) {
return 'Facilitator/Playmaker';
}
    if (three_rate > 0.5) {
return 'Spot-Up Shooter';
}
    return 'Balanced Scorer';
  }

  static classifyDefensiveStyle(player) {
    const stl = player.stats?.stl || 1;
    const blk = player.stats?.blk || 0.5;
    const def_rating = player.def_rating || 110;
    
    if (blk > 2) {
return 'Rim Protector';
}
    if (stl > 1.5) {
return 'Ball Hawk/Disruptor';
}
    if (def_rating < 105) {
return 'Elite Defender';
}
    if (def_rating < 110) {
return 'Solid Defender';
}
    return 'Average Defender';
  }

  static evaluateStyleMatchup(playerA, playerB, type) {
    if (type === 'offense') {
      const styleA = this.classifyOffensiveStyle(playerA);
      const styleB = this.classifyOffensiveStyle(playerB);
      
      if (styleA.includes('Aggressive') && styleB.includes('Rim Protector')) {
        return 'Challenging matchup for Player A';
      }
      if (styleA.includes('Shooter') && styleB.includes('Ball Hawk')) {
        return 'Moderate difficulty for Player A';
      }
      return 'Neutral matchup';
    }
    return 'Defense vs Offense analysis';
  }

  static evaluatePaceCompatibility(playerA, playerB) {
    const paceA = playerA.pace_rating || 50;
    const paceB = playerB.pace_rating || 50;
    
    const diff = Math.abs(paceA - paceB);
    
    if (diff < 5) {
return 'Similar pace preferences - expect normal flow';
}
    if (diff < 10) {
return 'Slight pace difference - minor adjustments';
}
    return 'Significant pace difference - expect adjustment period';
  }

  static evaluateSizeAdvantage(playerA, playerB) {
    const heightA = playerA.height_inches || 78;
    const heightB = playerB.height_inches || 78;
    const weightA = playerA.weight_lbs || 220;
    const weightB = playerB.weight_lbs || 220;
    
    const heightDiff = heightA - heightB;
    const weightDiff = weightA - weightB;
    
    return {
      height: {
        difference: heightDiff + ' inches',
        advantage: heightDiff > 3 ? 'Player A' : heightDiff < -3 ? 'Player B' : 'Even',
        impact: Math.abs(heightDiff) > 4 ? 'Significant' : 'Moderate'
      },
      weight: {
        difference: weightDiff + ' lbs',
        advantage: weightDiff > 20 ? 'Player A' : weightDiff < -20 ? 'Player B' : 'Even',
        impact: Math.abs(weightDiff) > 30 ? 'Significant' : 'Moderate'
      }
    };
  }

  static determineAdvantages(playerA, playerB) {
    const advantages = {
      playerA: [],
      playerB: [],
      even: []
    };
    
    // Compare key stats
    const comparisons = [
      { stat: 'scoring', a: playerA.stats?.pts || 0, b: playerB.stats?.pts || 0 },
      { stat: 'efficiency', a: playerA.ts_pct || 0.55, b: playerB.ts_pct || 0.55 },
      { stat: 'defense', a: 120 - (playerA.def_rating || 110), b: 120 - (playerB.def_rating || 110) },
      { stat: 'athleticism', a: playerA.athleticism_score || 70, b: playerB.athleticism_score || 70 },
      { stat: 'experience', a: playerA.years_pro || 5, b: playerB.years_pro || 5 }
    ];
    
    comparisons.forEach(comp => {
      const diff = comp.a - comp.b;
      if (Math.abs(diff) < 0.05 * Math.max(comp.a, comp.b)) {
        advantages.even.push(comp.stat);
      } else if (diff > 0) {
        advantages.playerA.push({ stat: comp.stat, margin: this.describeMagnitude(diff, comp.stat) });
      } else {
        advantages.playerB.push({ stat: comp.stat, margin: this.describeMagnitude(Math.abs(diff), comp.stat) });
      }
    });
    
    return advantages;
  }

  static describeMagnitude(diff, stat) {
    if (stat === 'scoring') {
      if (diff > 10) {
return 'Major';
}
      if (diff > 5) {
return 'Moderate';
}
      return 'Slight';
    }
    if (stat === 'efficiency') {
      if (diff > 0.08) {
return 'Major';
}
      if (diff > 0.04) {
return 'Moderate';
}
      return 'Slight';
    }
    if (diff > 10) {
return 'Major';
}
    if (diff > 5) {
return 'Moderate';
}
    return 'Slight';
  }

  static analyzeTrends(matchups, playerA_id, playerB_id) {
    if (matchups.length < 3) {
      return { available: false, reason: 'Insufficient data (need 3+ games)' };
    }
    
    const recentGames = matchups.slice(-5);
    const playerA_recent = recentGames.map(g => g.stats[playerA_id]?.points || 0);
    const playerB_recent = recentGames.map(g => g.stats[playerB_id]?.points || 0);
    
    return {
      available: true,
      playerA_trend: this.calculateTrendDirection(playerA_recent),
      playerB_trend: this.calculateTrendDirection(playerB_recent),
      dominance: this.calculateDominance(recentGames, playerA_id, playerB_id)
    };
  }

  static calculateTrendDirection(values) {
    if (values.length < 2) {
return 'Unknown';
}
    
    const first_half_avg = values.slice(0, Math.floor(values.length / 2)).reduce((sum, v) => sum + v, 0) / Math.floor(values.length / 2);
    const second_half_avg = values.slice(Math.floor(values.length / 2)).reduce((sum, v) => sum + v, 0) / Math.ceil(values.length / 2);
    
    const change = ((second_half_avg - first_half_avg) / first_half_avg) * 100;
    
    if (change > 10) {
return 'Improving 📈';
}
    if (change < -10) {
return 'Declining 📉';
}
    return 'Stable ➡️';
  }

  static calculateDominance(games, playerA_id, playerB_id) {
    let playerA_better = 0;
    let playerB_better = 0;
    
    games.forEach(game => {
      const statsA = game.stats[playerA_id];
      const statsB = game.stats[playerB_id];
      
      if (statsA && statsB) {
        if (statsA.points > statsB.points) {
playerA_better++;
} else if (statsB.points > statsA.points) {
playerB_better++;
}
      }
    });
    
    if (playerA_better > playerB_better) {
return 'Player A dominant';
}
    if (playerB_better > playerA_better) {
return 'Player B dominant';
}
    return 'Evenly matched';
  }

  static projectPerformance(playerA, playerB, directMatchups) {
    const playerA_season_avg = playerA.stats?.pts || 20;
    const playerB_season_avg = playerB.stats?.pts || 20;
    
    const playerA_h2h_avg = directMatchups.length > 0 
      ? parseFloat(this.calculateAverageStats(directMatchups, playerA.id).ppg)
      : playerA_season_avg;
    
    const playerB_h2h_avg = directMatchups.length > 0
      ? parseFloat(this.calculateAverageStats(directMatchups, playerB.id).ppg)
      : playerB_season_avg;
    
    // Weight h2h history more if there are enough games
    const weight = Math.min(directMatchups.length / 10, 0.7);
    
    const playerA_projection = (playerA_h2h_avg * weight) + (playerA_season_avg * (1 - weight));
    const playerB_projection = (playerB_h2h_avg * weight) + (playerB_season_avg * (1 - weight));
    
    return {
      playerA: {
        projected_points: playerA_projection.toFixed(1),
        confidence: this.calculateConfidence(directMatchups.length),
        range: {
          low: (playerA_projection * 0.8).toFixed(1),
          high: (playerA_projection * 1.2).toFixed(1)
        }
      },
      playerB: {
        projected_points: playerB_projection.toFixed(1),
        confidence: this.calculateConfidence(directMatchups.length),
        range: {
          low: (playerB_projection * 0.8).toFixed(1),
          high: (playerB_projection * 1.2).toFixed(1)
        }
      }
    };
  }

  static calculateConfidence(sampleSize) {
    if (sampleSize >= 10) {
return 'High';
}
    if (sampleSize >= 5) {
return 'Moderate';
}
    if (sampleSize >= 2) {
return 'Low';
}
    return 'Very Low (No H2H data)';
  }

  static generateMatchupRecommendation(advantages, projections) {
    const playerA_advantages = advantages.playerA.length;
    const playerB_advantages = advantages.playerB.length;
    
    if (playerA_advantages > playerB_advantages + 1) {
      return `Player A has clear edge (${playerA_advantages} vs ${playerB_advantages} advantages). Favor Player A props.`;
    }
    if (playerB_advantages > playerA_advantages + 1) {
      return `Player B has clear edge (${playerB_advantages} vs ${playerA_advantages} advantages). Favor Player B props.`;
    }
    return 'Evenly matched - look for situational edges and market inefficiencies.';
  }

  static identifyBettingAngles(advantages, projections) {
    const angles = [];
    
    if (advantages.playerA.some(a => a.stat === 'scoring' && a.margin === 'Major')) {
      angles.push('Player A points OVER looks strong');
    }
    
    if (advantages.playerB.some(a => a.stat === 'defense' && a.margin !== 'Slight')) {
      angles.push('Player A points UNDER could have value (strong defender)');
    }
    
    const playerA_proj = parseFloat(projections.playerA.projected_points);
    const playerB_proj = parseFloat(projections.playerB.projected_points);
    
    if (Math.abs(playerA_proj - playerB_proj) > 8) {
      angles.push('Significant scoring differential - check player performance props');
    }
    
    return angles.length > 0 ? angles : ['No clear betting angle - wait for line value'];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ⚡ PACE & STYLE IMPACT ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PaceStyleAnalyzer {
  
  static analyzePaceImpact(team, opponent) {
    const teamPace = team.pace || 100;
    const oppPace = opponent.pace || 100;
    const combinedPace = (teamPace + oppPace) / 2;
    
    const paceProjection = this.projectGamePace(teamPace, oppPace);
    const volumeImpact = this.calculateVolumeImpact(paceProjection);
    const playerImpacts = this.projectPlayerImpacts(team.players, paceProjection);
    
    return {
      projectedPace: paceProjection,
      paceRating: this.ratePace(paceProjection),
      volumeImpact,
      playerImpacts,
      bettingImplications: this.generatePaceImplications(paceProjection, volumeImpact),
      totalProjection: this.projectTotalScore(combinedPace, team, opponent)
    };
  }

  static projectGamePace(teamPace, oppPace) {
    // Game pace is influenced by both teams but not simply average
    // Faster team has more influence
    const fasterPace = Math.max(teamPace, oppPace);
    const slowerPace = Math.min(teamPace, oppPace);
    
    // Weighted average favoring faster team
    const projectedPace = (fasterPace * 0.6) + (slowerPace * 0.4);
    
    return {
      possessions: projectedPace.toFixed(1),
      comparison_to_league: this.compareToLeagueAverage(projectedPace),
      tempo: this.classifyTempo(projectedPace)
    };
  }

  static compareToLeagueAverage(pace) {
    const leagueAvg = 99.5;
    const diff = pace - leagueAvg;
    
    return {
      difference: diff.toFixed(1),
      percentage: ((diff / leagueAvg) * 100).toFixed(1) + '%',
      description: diff > 5 ? 'Much faster' : diff > 2 ? 'Faster' : diff > -2 ? 'Average' : diff > -5 ? 'Slower' : 'Much slower'
    };
  }

  static classifyTempo(pace) {
    if (pace > 105) {
return 'Breakneck';
}
    if (pace > 102) {
return 'Fast';
}
    if (pace > 98) {
return 'Above Average';
}
    if (pace > 96) {
return 'Below Average';
}
    if (pace > 93) {
return 'Slow';
}
    return 'Grinding';
  }

  static ratePace(paceProjection) {
    const pace = parseFloat(paceProjection.possessions);
    
    return {
      offensiveOpportunities: pace > 102 ? 'High' : pace > 98 ? 'Moderate' : 'Low',
      scoringEnvironment: pace > 105 ? 'Excellent' : pace > 100 ? 'Good' : pace > 96 ? 'Average' : 'Poor',
      overTendency: pace > 102 ? 'Lean OVER' : pace < 96 ? 'Lean UNDER' : 'Neutral'
    };
  }

  static calculateVolumeImpact(paceProjection) {
    const pace = parseFloat(paceProjection.possessions);
    const leagueAvg = 99.5;
    
    const volumeMultiplier = pace / leagueAvg;
    
    return {
      multiplier: volumeMultiplier.toFixed(3),
      expectedShots: (90 * volumeMultiplier).toFixed(1),
      expectedThrees: (35 * volumeMultiplier).toFixed(1),
      expectedFTAs: (24 * volumeMultiplier).toFixed(1),
      impactLevel: Math.abs(volumeMultiplier - 1) > 0.05 ? 'Significant' : 'Moderate'
    };
  }

  static projectPlayerImpacts(players, paceProjection) {
    const pace = parseFloat(paceProjection.possessions);
    const paceMultiplier = pace / 99.5;
    
    return players.map(player => {
      const usage = player.usage_rate || 0.22;
      const minutesProjhection = player.minutes || 32;
      
      // High usage players benefit more from pace
      const personalMultiplier = 1 + ((paceMultiplier - 1) * (usage / 0.25));
      
      return {
        playerName: player.name,
        baseProjection: player.ppg || 15,
        paceAdjusted: ((player.ppg || 15) * personalMultiplier).toFixed(1),
        impact: ((personalMultiplier - 1) * 100).toFixed(1) + '%',
        recommendation: personalMultiplier > 1.05 ? 'Pace boost - consider OVER' : personalMultiplier < 0.95 ? 'Pace drag - consider UNDER' : 'Minimal pace impact'
      };
    }).slice(0, 5); // Top 5 players
  }

  static generatePaceImplications(paceProjection, volumeImpact) {
    const pace = parseFloat(paceProjection.possessions);
    const implications = [];
    
    if (pace > 105) {
      implications.push('🚀 High pace game - OVERs have strong edge');
      implications.push('⚡ Volume scorers and high-usage players should excel');
      implications.push('📈 3-point props likely to hit due to extra possessions');
    } else if (pace > 100) {
      implications.push('⚡ Above-average pace - slight edge to OVERs');
      implications.push('✅ Good environment for scorer props');
    } else if (pace < 95) {
      implications.push('🐌 Slow pace - UNDERs have edge');
      implications.push('⚠️ Limited possessions hurt volume stats');
      implications.push('🎯 Target efficiency props over volume props');
    } else {
      implications.push('➡️ Average pace - no strong directional edge');
    }
    
    return implications;
  }

  static projectTotalScore(pace, team, opponent) {
    const possessions = pace;
    const teamEfficiency = team.offensive_rating || 110;
    const oppEfficiency = opponent.offensive_rating || 110;
    
    const teamScore = (possessions * teamEfficiency) / 100;
    const oppScore = (possessions * oppEfficiency) / 100;
    const total = teamScore + oppScore;
    
    return {
      projectedTotal: total.toFixed(1),
      teamScore: teamScore.toFixed(1),
      opponentScore: oppScore.toFixed(1),
      confidence: 'Moderate',
      recommendation: this.generateTotalRecommendation(total)
    };
  }

  static generateTotalRecommendation(projectedTotal) {
    // Assume typical NBA line is around 220
    const typicalLine = 220;
    const diff = projectedTotal - typicalLine;
    
    if (diff > 10) {
return `Strong OVER lean (projected ${projectedTotal.toFixed(0)} vs typical ${typicalLine})`;
}
    if (diff > 5) {
return `Lean OVER (projected ${projectedTotal.toFixed(0)})`;
}
    if (diff < -10) {
return `Strong UNDER lean (projected ${projectedTotal.toFixed(0)} vs typical ${typicalLine})`;
}
    if (diff < -5) {
return `Lean UNDER (projected ${projectedTotal.toFixed(0)})`;
}
    return `No strong lean - projected near typical total`;
  }

  static analyzeStyleClash(teamA, teamB) {
    const offensiveStyles = {
      teamA: this.classifyTeamOffense(teamA),
      teamB: this.classifyTeamOffense(teamB)
    };
    
    const defensiveStyles = {
      teamA: this.classifyTeamDefense(teamA),
      teamB: this.classifyTeamDefense(teamB)
    };
    
    return {
      offensiveStyles,
      defensiveStyles,
      matchupAnalysis: this.evaluateStyleMatchup(offensiveStyles, defensiveStyles),
      keyFactors: this.identifyKeyMatchupFactors(teamA, teamB),
      prediction: this.predictStyleOutcome(offensiveStyles, defensiveStyles)
    };
  }

  static classifyTeamOffense(team) {
    const threePtRate = team.three_point_rate || 0.38;
    const pace = team.pace || 100;
    const astRate = team.assist_rate || 0.60;
    
    const style = [];
    
    if (threePtRate > 0.42) {
style.push('Three-Point Heavy');
}
    if (pace > 102) {
style.push('Fast-Paced');
}
    if (astRate > 0.65) {
style.push('Ball Movement');
}
    if (team.paint_points_pct > 0.50) {
style.push('Paint-Dominant');
}
    
    return style.length > 0 ? style.join(', ') : 'Balanced';
  }

  static classifyTeamDefense(team) {
    const defRating = team.defensive_rating || 110;
    const stlRate = team.steals_per_game || 7;
    const blkRate = team.blocks_per_game || 4;
    
    const style = [];
    
    if (defRating < 108) {
style.push('Elite Defense');
}
    if (stlRate > 8) {
style.push('Pressure Defense');
}
    if (blkRate > 5) {
style.push('Rim Protection');
}
    if (team.opponent_three_pct < 0.35) {
style.push('Perimeter Lockdown');
}
    
    return style.length > 0 ? style.join(', ') : 'Average Defense';
  }

  static evaluateStyleMatchup(offensive, defensive) {
    const analysis = [];
    
    if (offensive.teamA.includes('Three-Point Heavy') && defensive.teamB.includes('Perimeter Lockdown')) {
      analysis.push('Team A may struggle from three against Team B\'s perimeter defense');
    }
    
    if (offensive.teamA.includes('Fast-Paced') && defensive.teamB.includes('Pressure Defense')) {
      analysis.push('Team A\'s pace could lead to turnovers against Team B\'s pressure');
    }
    
    if (offensive.teamB.includes('Paint-Dominant') && defensive.teamA.includes('Rim Protection')) {
      analysis.push('Team B may struggle in the paint against Team A\'s rim protection');
    }
    
    return analysis.length > 0 ? analysis : ['No significant style conflicts identified'];
  }

  static identifyKeyMatchupFactors(teamA, teamB) {
    return {
      offensiveEdge: (teamA.offensive_rating || 110) > (teamB.offensive_rating || 110) ? 'Team A' : 'Team B',
      defensiveEdge: (teamA.defensive_rating || 110) < (teamB.defensive_rating || 110) ? 'Team A' : 'Team B',
      paceControl: (teamA.pace || 100) > (teamB.pace || 100) ? 'Team A dictates tempo' : 'Team B dictates tempo',
      reboundingEdge: (teamA.rebounds_per_game || 45) > (teamB.rebounds_per_game || 45) ? 'Team A' : 'Team B',
      threePointEdge: (teamA.three_pct || 0.36) > (teamB.three_pct || 0.36) ? 'Team A' : 'Team B'
    };
  }

  static predictStyleOutcome(offensive, defensive) {
    // Simplified prediction based on style matchups
    return {
      expectedFlow: 'Competitive game with momentum swings',
      scoringEnvironment: 'Moderate',
      keyToVictory: 'Execution in half-court sets and limiting turnovers',
      watchFor: ['Pace of play in first quarter', 'Three-point shooting variance', 'Turnover differential']
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🏥 INJURY IMPACT ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class InjuryImpactAnalyzer {
  
  static analyzeInjuryImpact(team, injuredPlayers) {
    const totalImpact = this.calculateTotalImpact(team, injuredPlayers);
    const individualImpacts = this.analyzeIndividualImpacts(injuredPlayers);
    const replacementAnalysis = this.analyzeReplacements(team, injuredPlayers);
    const bettingAdjustments = this.generateBettingAdjustments(totalImpact, replacementAnalysis);
    
    return {
      overallImpact: totalImpact,
      injuredPlayers: individualImpacts,
      replacements: replacementAnalysis,
      teamAdjustments: this.projectTeamAdjustments(team, totalImpact),
      bettingAdjustments,
      riskLevel: this.assessRiskLevel(totalImpact),
      recommendedAction: this.generateRecommendation(totalImpact, bettingAdjustments)
    };
  }

  static calculateTotalImpact(team, injuredPlayers) {
    let totalWinSharesLost = 0;
    let totalUsageLost = 0;
    let totalMinutesLost = 0;
    
    injuredPlayers.forEach(player => {
      totalWinSharesLost += player.win_shares || 0;
      totalUsageLost += (player.usage_rate || 0) * (player.minutes || 0);
      totalMinutesLost += player.minutes || 0;
    });
    
    const impactScore = (totalWinSharesLost * 10) + (totalUsageLost / 10) + (totalMinutesLost / 20);
    
    return {
      score: impactScore.toFixed(2),
      winSharesLost: totalWinSharesLost.toFixed(2),
      usageLost: (totalUsageLost / 48).toFixed(1) + '%',
      minutesLost: totalMinutesLost.toFixed(1),
      severity: this.classifyImpactSeverity(impactScore),
      expectedPointSwing: this.estimatePointSwing(impactScore)
    };
  }

  static classifyImpactSeverity(score) {
    if (score > 15) {
return '🚨 Critical';
}
    if (score > 10) {
return '⚠️ Major';
}
    if (score > 5) {
return '⚡ Moderate';
}
    if (score > 2) {
return '📊 Minor';
}
    return '✅ Minimal';
  }

  static estimatePointSwing(impactScore) {
    // Rough estimate: each point of impact = ~0.8 points in game
    const swing = impactScore * 0.8;
    
    return {
      points: swing.toFixed(1),
      range: {
        low: (swing * 0.7).toFixed(1),
        high: (swing * 1.3).toFixed(1)
      },
      confidence: impactScore > 10 ? 'High' : impactScore > 5 ? 'Moderate' : 'Low'
    };
  }

  static analyzeIndividualImpacts(players) {
    return players.map(player => ({
      name: player.name,
      position: player.position,
      role: this.classifyPlayerRole(player),
      offensiveImpact: this.calculateOffensiveImpact(player),
      defensiveImpact: this.calculateDefensiveImpact(player),
      overallValue: this.calculatePlayerValue(player),
      replaceability: this.assessReplaceability(player)
    }));
  }

  static classifyPlayerRole(player) {
    const ppg = player.stats?.pts || 0;
    const usage = player.usage_rate || 0;
    
    if (ppg > 25 && usage > 0.30) {
return '⭐ Superstar';
}
    if (ppg > 20 || usage > 0.28) {
return '🌟 Star';
}
    if (ppg > 15) {
return '🔑 Key Rotation';
}
    if (ppg > 10) {
return '📋 Rotation Player';
}
    return '🪑 Bench';
  }

  static calculateOffensiveImpact(player) {
    const ppg = player.stats?.pts || 0;
    const apg = player.stats?.ast || 0;
    const usage = player.usage_rate || 0;
    
    const score = (ppg * 0.5) + (apg * 1.5) + (usage * 100);
    
    return {
      score: score.toFixed(1),
      lostScoringppg: ppg.toFixed(1),
      lostPlaymaking: apg.toFixed(1),
      impact: score > 20 ? 'Huge' : score > 12 ? 'Significant' : score > 6 ? 'Moderate' : 'Small'
    };
  }

  static calculateDefensiveImpact(player) {
    const defRating = player.def_rating || 110;
    const stl = player.stats?.stl || 0;
    const blk = player.stats?.blk || 0;
    
    const score = ((115 - defRating) / 2) + (stl * 2) + (blk * 2);
    
    return {
      score: score.toFixed(1),
      defensiveRating: defRating.toFixed(1),
      disruptionLost: (stl + blk).toFixed(1),
      impact: score > 8 ? 'Major' : score > 4 ? 'Moderate' : 'Minor'
    };
  }

  static calculatePlayerValue(player) {
    const ws = player.win_shares || 0;
    const vorp = player.vorp || 0;
    const bpm = player.bpm || 0;
    
    const value = (ws * 5) + vorp + bpm;
    
    return {
      score: value.toFixed(2),
      rating: value > 15 ? 'Elite' : value > 10 ? 'High' : value > 5 ? 'Above Average' : 'Average'
    };
  }

  static assessReplaceability(player) {
    const role = this.classifyPlayerRole(player);
    
    if (role.includes('Superstar')) {
      return { difficulty: 'Nearly Impossible', dropoff: '30-50%' };
    }
    if (role.includes('Star')) {
      return { difficulty: 'Very Difficult', dropoff: '20-35%' };
    }
    if (role.includes('Key')) {
      return { difficulty: 'Difficult', dropoff: '15-25%' };
    }
    return { difficulty: 'Manageable', dropoff: '5-15%' };
  }

  static analyzeReplacements(team, injuredPlayers) {
    return injuredPlayers.map(injured => {
      const replacement = this.identifyReplacement(team, injured);
      const comparison = this.comparePlayerValue(injured, replacement);
      
      return {
        injuredPlayer: injured.name,
        replacement: replacement.name,
        skillGap: comparison,
        expectations: this.generateReplacementExpectations(comparison)
      };
    });
  }

  static identifyReplacement(team, injuredPlayer) {
    // Simplified - would look at actual depth chart
    return {
      name: 'Backup Player',
      ppg: (injuredPlayer.stats?.pts || 20) * 0.6,
      efficiency: (injuredPlayer.ts_pct || 0.55) * 0.9
    };
  }

  static comparePlayerValue(injured, replacement) {
    const ppg_diff = (injured.stats?.pts || 0) - (replacement.ppg || 0);
    const efficiency_diff = ((injured.ts_pct || 0) - (replacement.efficiency || 0)) * 100;
    
    return {
      scoringDropoff: ppg_diff.toFixed(1) + ' PPG',
      efficiencyDropoff: efficiency_diff.toFixed(1) + '%',
      overallGap: ppg_diff > 15 ? 'Massive' : ppg_diff > 10 ? 'Major' : ppg_diff > 5 ? 'Significant' : 'Moderate'
    };
  }

  static generateReplacementExpectations(comparison) {
    const gap = comparison.overallGap;
    
    if (gap === 'Massive') {
      return 'Expect significant team struggles - major decline in performance';
    }
    if (gap === 'Major') {
      return 'Team will miss injured player considerably - look for UNDERs';
    }
    if (gap === 'Significant') {
      return 'Noticeable impact but team may adjust - be cautious';
    }
    return 'Replacement can hold fort - limited betting impact';
  }

  static projectTeamAdjustments(team, totalImpact) {
    const impactScore = parseFloat(totalImpact.score);
    
    return {
      offensiveRating: {
        baseline: team.offensive_rating || 110,
        adjusted: (team.offensive_rating - impactScore * 0.4).toFixed(1),
        change: (-impactScore * 0.4).toFixed(1)
      },
      pace: {
        baseline: team.pace || 100,
        adjusted: (team.pace - impactScore * 0.2).toFixed(1),
        change: (-impactScore * 0.2).toFixed(1)
      },
      projectedScoring: {
        baseline: team.ppg || 112,
        adjusted: (team.ppg - impactScore * 0.6).toFixed(1),
        change: (-impactScore * 0.6).toFixed(1)
      }
    };
  }

  static generateBettingAdjustments(totalImpact, replacements) {
    const severity = totalImpact.severity;
    const adjustments = [];
    
    if (severity.includes('Critical') || severity.includes('Major')) {
      adjustments.push('🔻 Fade affected team props');
      adjustments.push('⬇️ Target team totals UNDER');
      adjustments.push('📉 Avoid parlays involving this team');
      adjustments.push('🎯 Look for opponent player OVERs (easier matchup)');
    } else if (severity.includes('Moderate')) {
      adjustments.push('⚠️ Reduce confidence in affected team');
      adjustments.push('💡 Opportunity props for replacement players');
      adjustments.push('🔍 Monitor line movement for value');
    } else {
      adjustments.push('✅ Minimal betting adjustments needed');
    }
    
    return adjustments;
  }

  static assessRiskLevel(totalImpact) {
    const score = parseFloat(totalImpact.score);
    
    return {
      level: score > 15 ? 'Extreme' : score > 10 ? 'High' : score > 5 ? 'Moderate' : 'Low',
      recommendation: score > 10 
        ? 'Avoid betting on this team until more information available'
        : score > 5
        ? 'Proceed with caution - reduce stake sizes'
        : 'Normal betting approach acceptable'
    };
  }

  static generateRecommendation(totalImpact, adjustments) {
    const severity = totalImpact.severity;
    
    if (severity.includes('Critical')) {
      return '🚨 CRITICAL IMPACT - Strongly advise avoiding this team\'s bets. If betting against them, consider increasing confidence.';
    }
    if (severity.includes('Major')) {
      return '⚠️ MAJOR IMPACT - Significant adjustment needed. Fade team props, target UNDERs, look for opponent opportunities.';
    }
    if (severity.includes('Moderate')) {
      return '⚡ MODERATE IMPACT - Adjust expectations and reduce exposure. Look for value in adjusted lines.';
    }
    return '✅ MINIMAL IMPACT - Normal betting approach. Monitor replacement player performance for future value.';
  }
}

export default {
  HeadToHeadAnalyzer,
  PaceStyleAnalyzer,
  InjuryImpactAnalyzer
};
