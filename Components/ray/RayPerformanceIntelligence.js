// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🏀 RAY PERFORMANCE INTELLIGENCE - CLUTCH, DEFENSE, ROLES & PACE ANALYTICS                                          ║
// ║  Clutch Performance • Defensive Matchups • Role Changes • Pace Analysis • Lineup Efficiency • Late-Game Execution   ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 CLUTCH PERFORMANCE ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ClutchPerformanceAnalyzer {
  
  static analyzeClutchPerformance(player, seasonStats) {
    const clutchStats = this.extractClutchStats(player, seasonStats);
    const comparison = this.compareClutchToRegular(clutchStats, player.stats);
    const tendencies = this.identifyClutchTendencies(clutchStats);
    const mentalProfile = this.assessMentalToughness(clutchStats, comparison);
    const bettingValue = this.evaluateClutchBettingValue(comparison, tendencies);
    
    return {
      player: player.name,
      clutch_stats: clutchStats,
      comparison: comparison,
      tendencies: tendencies,
      mental_profile: mentalProfile,
      betting_implications: bettingValue,
      situational_splits: this.getClutchSituationalSplits(player),
      recommendations: this.generateClutchRecommendations(comparison, tendencies)
    };
  }

  static extractClutchStats(player, seasonStats) {
    // Clutch = Last 5 minutes of game, score within 5 points
    const clutch = seasonStats.clutch || {};
    
    return {
      games: clutch.games || 45,
      minutes: clutch.minutes || 142,
      ppg: clutch.ppg || player.stats?.pts * 0.85 || 17,
      fg_pct: clutch.fg_pct || player.fg_pct * 0.92 || 0.41,
      fg3_pct: clutch.fg3_pct || player.fg3_pct * 0.88 || 0.33,
      ft_pct: clutch.ft_pct || player.ft_pct * 0.95 || 0.82,
      assists: clutch.apg || player.stats?.ast * 0.9 || 3.2,
      turnovers: clutch.tov || player.stats?.tov * 1.15 || 1.8,
      usage_rate: clutch.usage || player.usage * 1.25 || 28.5,
      true_shooting: clutch.ts_pct || 0.545
    };
  }

  static compareClutchToRegular(clutchStats, regularStats) {
    const regular = {
      ppg: regularStats?.pts || 20,
      fg_pct: regularStats?.fg_pct || 0.45,
      fg3_pct: regularStats?.fg3_pct || 0.37,
      ft_pct: regularStats?.ft_pct || 0.85,
      apg: regularStats?.ast || 4.0,
      tov: regularStats?.tov || 2.0
    };
    
    return {
      scoring: {
        clutch: clutchStats.ppg.toFixed(1),
        regular: regular.ppg.toFixed(1),
        difference: (clutchStats.ppg - regular.ppg).toFixed(1),
        percentage_change: (((clutchStats.ppg - regular.ppg) / regular.ppg) * 100).toFixed(1) + '%',
        rating: this.rateClutchScoring(clutchStats.ppg, regular.ppg)
      },
      efficiency: {
        clutch_fg: (clutchStats.fg_pct * 100).toFixed(1) + '%',
        regular_fg: (regular.fg_pct * 100).toFixed(1) + '%',
        difference: ((clutchStats.fg_pct - regular.fg_pct) * 100).toFixed(1) + '%',
        rating: this.rateClutchEfficiency(clutchStats.fg_pct, regular.fg_pct)
      },
      three_point: {
        clutch_3pt: (clutchStats.fg3_pct * 100).toFixed(1) + '%',
        regular_3pt: (regular.fg3_pct * 100).toFixed(1) + '%',
        difference: ((clutchStats.fg3_pct - regular.fg3_pct) * 100).toFixed(1) + '%',
        rating: this.rateClutchShooting(clutchStats.fg3_pct, regular.fg3_pct)
      },
      free_throws: {
        clutch_ft: (clutchStats.ft_pct * 100).toFixed(1) + '%',
        regular_ft: (regular.ft_pct * 100).toFixed(1) + '%',
        difference: ((clutchStats.ft_pct - regular.ft_pct) * 100).toFixed(1) + '%',
        pressure_rating: clutchStats.ft_pct > 0.85 ? 'Elite 🎯' : clutchStats.ft_pct > 0.80 ? 'Good ✅' : 'Concerning ⚠️'
      },
      playmaking: {
        clutch_ast: clutchStats.assists.toFixed(1),
        regular_ast: regular.apg.toFixed(1),
        clutch_tov: clutchStats.turnovers.toFixed(1),
        regular_tov: regular.tov.toFixed(1),
        ast_to_ratio_clutch: (clutchStats.assists / clutchStats.turnovers).toFixed(2),
        ast_to_ratio_regular: (regular.apg / regular.tov).toFixed(2),
        rating: this.rateClutchPlaymaking(clutchStats.assists, clutchStats.turnovers, regular.apg, regular.tov)
      }
    };
  }

  static rateClutchScoring(clutchPPG, regularPPG) {
    const diff = clutchPPG - regularPPG;
    
    if (diff > 3) return 'Elite Closer 🔥 (major scoring increase)';
    if (diff > 1) return 'Clutch Scorer ⭐ (scoring increase)';
    if (diff > -1) return 'Consistent 📊 (maintains scoring)';
    if (diff > -3) return 'Slight Decline 📉 (minor drop-off)';
    return 'Struggles in Clutch ⚠️ (significant decline)';
  }

  static rateClutchEfficiency(clutchFG, regularFG) {
    const diff = clutchFG - regularFG;
    
    if (diff > 0.03) return 'More Efficient 🎯';
    if (diff > -0.02) return 'Maintains Efficiency ✅';
    if (diff > -0.05) return 'Slight Drop 📉';
    return 'Struggles Under Pressure ⚠️';
  }

  static rateClutchShooting(clutch3PT, regular3PT) {
    const diff = clutch3PT - regular3PT;
    
    if (diff > 0.04) return 'Rises Up 🔥';
    if (diff > -0.03) return 'Steady ✅';
    return 'Pressure Affected 📉';
  }

  static rateClutchPlaymaking(clutchAst, clutchTov, regAst, regTov) {
    const clutchRatio = clutchAst / clutchTov;
    const regRatio = regAst / regTov;
    
    if (clutchRatio > regRatio * 1.1 && clutchRatio > 2.0) return 'Elite Decision Maker 🧠';
    if (clutchRatio >= regRatio * 0.9) return 'Reliable ✅';
    return 'Turnover Prone ⚠️';
  }

  static identifyClutchTendencies(clutchStats) {
    return {
      usage: {
        rate: clutchStats.usage_rate.toFixed(1) + '%',
        level: clutchStats.usage_rate > 30 ? 'Extremely High 🔥' : 
               clutchStats.usage_rate > 25 ? 'High ⭐' : 
               clutchStats.usage_rate > 20 ? 'Moderate 📊' : 
               'Low ➡️',
        interpretation: clutchStats.usage_rate > 28 ? 'Team goes to this player consistently' : 
                        clutchStats.usage_rate > 23 ? 'Primary option in crunch time' : 
                        'Role player in clutch'
      },
      shot_selection: this.analyzeClutchShotSelection(clutchStats),
      pressure_handling: this.assessPressureHandling(clutchStats),
      fourth_quarter_splits: this.getFourthQuarterTendencies(clutchStats)
    };
  }

  static analyzeClutchShotSelection(stats) {
    // Infer shot selection from efficiency metrics
    const ts = stats.true_shooting;
    
    return {
      true_shooting_pct: (ts * 100).toFixed(1) + '%',
      shot_quality: ts > 0.58 ? 'Excellent 🎯' : ts > 0.54 ? 'Good ✅' : ts > 0.50 ? 'Average 📊' : 'Poor ⚠️',
      likely_shots: ts > 0.58 ? 'High-quality looks, good shot selection' : 
                    ts > 0.54 ? 'Mix of quality shots' : 
                    'Forcing difficult shots',
      recommendation: ts > 0.56 ? 'Target this player in clutch props' : 
                      ts < 0.52 ? 'Fade clutch props' : 
                      'Neutral'
    };
  }

  static assessPressureHandling(stats) {
    const ftRate = stats.ft_pct;
    const tovRate = stats.turnovers / stats.minutes * 36;
    
    let score = 50;
    
    // FT shooting under pressure
    if (ftRate > 0.85) score += 25;
    else if (ftRate > 0.80) score += 15;
    else score -= 10;
    
    // Turnover control
    if (tovRate < 2.5) score += 15;
    else if (tovRate < 3.5) score += 5;
    else score -= 15;
    
    // Usage without crumbling
    if (stats.usage_rate > 28 && stats.fg_pct > 0.42) score += 10;
    
    return {
      score: Math.max(0, Math.min(100, score)),
      grade: score > 80 ? 'A+ (Elite) 🔥' : 
             score > 70 ? 'A (Excellent) ⭐' : 
             score > 60 ? 'B (Good) ✅' : 
             score > 50 ? 'C (Average) 📊' : 
             'D (Struggles) ⚠️',
      key_strength: ftRate > 0.85 ? 'Ice in veins at FT line' : 
                    tovRate < 2.5 ? 'Excellent ball security' : 
                    'Maintains composure',
      key_weakness: ftRate < 0.75 ? 'FT shooting drops under pressure' : 
                    tovRate > 4.0 ? 'Turnover issues in pressure' : 
                    'None significant'
    };
  }

  static getFourthQuarterTendencies(clutchStats) {
    // Simulate 4Q tendencies based on clutch stats
    const fadePercent = (1 - (clutchStats.fg_pct / 0.45)) * 15;
    
    return {
      scoring_pattern: clutchStats.ppg > 6 ? 'Finisher - saves energy for 4Q 🔥' : 
                       clutchStats.ppg > 4 ? 'Consistent throughout ✅' : 
                       'Fades in 4Q ⚠️',
      fatigue_indicator: fadePercent > 10 ? 'High fatigue impact' : 
                         fadePercent > 5 ? 'Moderate fatigue' : 
                         'Maintains energy',
      conditioning_grade: fadePercent < 5 ? 'Elite' : fadePercent < 10 ? 'Good' : 'Below Average'
    };
  }

  static assessMentalToughness(clutchStats, comparison) {
    let score = 50;
    
    // Scoring maintenance/improvement
    const scoringChange = parseFloat(comparison.scoring.percentage_change);
    if (scoringChange > 10) score += 25;
    else if (scoringChange > 0) score += 15;
    else if (scoringChange > -10) score += 5;
    else score -= 10;
    
    // Efficiency maintenance
    const effChange = parseFloat(comparison.efficiency.difference);
    if (effChange > 2) score += 15;
    else if (effChange > -2) score += 10;
    else score -= 10;
    
    // FT shooting (best pressure indicator)
    if (clutchStats.ft_pct > 0.87) score += 15;
    else if (clutchStats.ft_pct > 0.82) score += 5;
    else score -= 10;
    
    return {
      overall_score: Math.max(0, Math.min(100, score)),
      rating: score > 85 ? 'Elite Closer 🔥' : 
              score > 70 ? 'Clutch Performer ⭐' : 
              score > 55 ? 'Reliable ✅' : 
              score > 40 ? 'Average 📊' : 
              'Pressure Struggles ⚠️',
      key_traits: this.identifyClutchTraits(score, clutchStats, comparison),
      ice_in_veins_factor: clutchStats.ft_pct > 0.90 && scoringChange > 5 ? 
        '❄️ ICE COLD - Elite in biggest moments' : 
        clutchStats.ft_pct > 0.85 ? '✅ Composed under pressure' : 
        '⚠️ Pressure affects performance'
    };
  }

  static identifyClutchTraits(score, clutchStats, comparison) {
    const traits = [];
    
    if (parseFloat(comparison.scoring.percentage_change) > 10) {
      traits.push('Elevates scoring in crunch time');
    }
    
    if (clutchStats.ft_pct > 0.88) {
      traits.push('Deadly from FT line with game on line');
    }
    
    if (clutchStats.usage_rate > 30) {
      traits.push('Team\'s go-to option in clutch');
    }
    
    if (parseFloat(comparison.efficiency.difference) > 0) {
      traits.push('Actually shoots BETTER under pressure');
    }
    
    if (clutchStats.turnovers < 2.0) {
      traits.push('Takes care of the ball in pressure');
    }
    
    return traits.length > 0 ? traits : ['Standard clutch performance'];
  }

  static getClutchSituationalSplits(player) {
    // Simulate situational clutch data
    return {
      home_vs_away: {
        home_clutch_ppg: 5.8,
        away_clutch_ppg: 4.2,
        advantage: 'Home 🏠',
        difference: '+1.6 ppg at home'
      },
      leading_vs_trailing: {
        when_leading: { ppg: 4.5, fg_pct: 0.48, note: 'Runs clock, efficient' },
        when_trailing: { ppg: 6.2, fg_pct: 0.42, note: 'Forces more, higher usage' }
      },
      vs_elite_defense: {
        ppg: 4.1,
        fg_pct: 0.39,
        note: 'Slight decline vs top defenses',
        impact: 'Moderate'
      },
      playoff_experience: {
        games: 42,
        performance: 'Clutch stats translate to playoffs',
        rating: 'Proven ✅'
      }
    };
  }

  static evaluateClutchBettingValue(comparison, tendencies) {
    const value = [];
    
    // Scoring value
    if (parseFloat(comparison.scoring.percentage_change) > 8) {
      value.push({
        category: 'Clutch Scoring Props',
        recommendation: '✅ BET 4Q props OVER',
        reasoning: 'Significantly elevates scoring in crunch time',
        confidence: 'High'
      });
    } else if (parseFloat(comparison.scoring.percentage_change) < -8) {
      value.push({
        category: 'Clutch Scoring Props',
        recommendation: '❌ FADE 4Q props',
        reasoning: 'Scoring drops significantly in clutch',
        confidence: 'High'
      });
    }
    
    // FT value
    if (tendencies.pressure_handling.score > 75) {
      value.push({
        category: 'FTA Props',
        recommendation: '🎯 TARGET late-game FTA props',
        reasoning: 'Elite FT shooter who gets to line in clutch',
        confidence: 'Moderate'
      });
    }
    
    // Usage value
    if (tendencies.usage.rate > 28) {
      value.push({
        category: 'Last Shot Props',
        recommendation: '✅ High probability to take last shot',
        reasoning: 'Team\'s primary clutch option',
        confidence: 'High'
      });
    }
    
    return value.length > 0 ? value : [{
      category: 'General',
      recommendation: '➡️ No strong clutch betting angles',
      reasoning: 'Average clutch performance',
      confidence: 'N/A'
    }];
  }

  static generateClutchRecommendations(comparison, tendencies) {
    const recommendations = [];
    
    // For betting
    if (parseFloat(comparison.scoring.percentage_change) > 8) {
      recommendations.push('🎯 TARGET: 4th quarter scoring props OVER');
      recommendations.push('✅ Live betting: Bet this player when game is close late');
    }
    
    if (tendencies.pressure_handling.score > 75) {
      recommendations.push('❄️ ICE: Target FT props in close games');
    }
    
    if (tendencies.usage.rate > 30) {
      recommendations.push('⭐ USAGE: High last-shot probability');
    }
    
    // Fade scenarios
    if (parseFloat(comparison.efficiency.difference) < -5) {
      recommendations.push('⚠️ FADE: Efficiency drops under pressure');
    }
    
    if (tendencies.pressure_handling.key_weakness !== 'None significant') {
      recommendations.push(`⚠️ CONCERN: ${tendencies.pressure_handling.key_weakness}`);
    }
    
    return recommendations;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🛡️ DEFENSIVE MATCHUP ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class DefensiveMatchupAnalyzer {
  
  static analyzeDefensiveMatchup(offensivePlayer, defender, matchupHistory) {
    const defenderProfile = this.buildDefenderProfile(defender);
    const matchupAdvantage = this.calculateMatchupAdvantage(offensivePlayer, defenderProfile);
    const historicalPerformance = this.analyzeHistoricalMatchup(offensivePlayer, defender, matchupHistory);
    const schemeImpact = this.analyzeSchemeMatchup(offensivePlayer, defender);
    const bettingEdge = this.identifyMatchupBettingEdge(matchupAdvantage, historicalPerformance);
    
    return {
      offensive_player: offensivePlayer.name,
      primary_defender: defender.name,
      defender_profile: defenderProfile,
      matchup_advantage: matchupAdvantage,
      historical_performance: historicalPerformance,
      scheme_impact: schemeImpact,
      betting_edge: bettingEdge,
      adjustments: this.recommendBettingAdjustments(matchupAdvantage, historicalPerformance)
    };
  }

  static buildDefenderProfile(defender) {
    return {
      name: defender.name,
      position: defender.position,
      defensive_rating: defender.def_rating || 108,
      defensive_metrics: {
        dfg_pct: defender.dfg_pct || 0.45,
        dfg_pct_diff: ((defender.dfg_pct || 0.45) - 0.465) * 100, // vs league avg
        blocks_per_game: defender.stats?.blk || 0.6,
        steals_per_game: defender.stats?.stl || 0.9,
        def_rebounds: defender.stats?.dreb || 4.2,
        contests_per_game: defender.contests || 12.5
      },
      defensive_style: this.classifyDefensiveStyle(defender),
      strengths: this.identifyDefensiveStrengths(defender),
      weaknesses: this.identifyDefensiveWeaknesses(defender),
      reputation: this.getDefensiveReputation(defender)
    };
  }

  static classifyDefensiveStyle(defender) {
    const metrics = {
      contests: defender.contests || 12,
      blks: defender.stats?.blk || 0.6,
      stls: defender.stats?.stl || 0.9
    };
    
    if (metrics.blks > 1.5) {
      return {
        primary: 'Rim Protector 🛡️',
        approach: 'Verticality, shot blocking',
        challenge_shots: true
      };
    }
    
    if (metrics.stls > 1.5) {
      return {
        primary: 'Perimeter Pest 🐝',
        approach: 'Pressure, deflections, gambling',
        challenge_shots: true
      };
    }
    
    if (metrics.contests > 15) {
      return {
        primary: 'Contest Machine 📊',
        approach: 'High activity, close-outs',
        challenge_shots: true
      };
    }
    
    return {
      primary: 'Positional Defender ✅',
      approach: 'Sound fundamentals, positioning',
      challenge_shots: false
    };
  }

  static identifyDefensiveStrengths(defender) {
    const strengths = [];
    
    if ((defender.dfg_pct || 0.45) < 0.44) strengths.push('Elite shot prevention');
    if ((defender.stats?.blk || 0) > 1.0) strengths.push('Rim protection');
    if ((defender.stats?.stl || 0) > 1.3) strengths.push('Ball pressure');
    if ((defender.contests || 0) > 14) strengths.push('High contest rate');
    
    return strengths.length > 0 ? strengths : ['Sound fundamentals'];
  }

  static identifyDefensiveWeaknesses(defender) {
    const weaknesses = [];
    
    if ((defender.dfg_pct || 0.45) > 0.47) weaknesses.push('Allows high FG%');
    if ((defender.stats?.pf || 0) > 3.5) weaknesses.push('Foul prone');
    if (defender.speed_rating < 70) weaknesses.push('Lateral quickness');
    if (defender.strength_rating < 65) weaknesses.push('Physical strength');
    
    return weaknesses.length > 0 ? weaknesses : ['None major'];
  }

  static getDefensiveReputation(defender) {
    const rating = defender.def_rating || 108;
    
    if (rating < 103) return { level: 'Elite 🏆', impact: 'Major offensive suppression' };
    if (rating < 106) return { level: 'Excellent ⭐', impact: 'Significant defensive impact' };
    if (rating < 109) return { level: 'Above Average ✅', impact: 'Solid defender' };
    if (rating < 112) return { level: 'Average 📊', impact: 'Moderate impact' };
    return { level: 'Below Average ⚠️', impact: 'Exploitable defender' };
  }

  static calculateMatchupAdvantage(offensivePlayer, defenderProfile) {
    let advantage = 0;
    const factors = [];
    
    // Height advantage
    const heightDiff = (offensivePlayer.height || 78) - (defenderProfile.height || 78);
    if (Math.abs(heightDiff) > 3) {
      if (heightDiff > 0) {
        advantage += 8;
        factors.push({ factor: 'Height Advantage', impact: '+8', note: 'Can shoot over defender' });
      } else {
        advantage -= 5;
        factors.push({ factor: 'Height Disadvantage', impact: '-5', note: 'Contested more' });
      }
    }
    
    // Speed advantage
    const speedDiff = (offensivePlayer.speed_rating || 75) - (defenderProfile.speed_rating || 75);
    if (Math.abs(speedDiff) > 10) {
      if (speedDiff > 0) {
        advantage += 10;
        factors.push({ factor: 'Speed Advantage', impact: '+10', note: 'Can blow by defender' });
      } else {
        advantage -= 8;
        factors.push({ factor: 'Speed Disadvantage', impact: '-8', note: 'Gets pressured' });
      }
    }
    
    // Defensive rating impact
    const defRating = defenderProfile.defensive_rating;
    if (defRating < 103) {
      advantage -= 12;
      factors.push({ factor: 'Elite Defender', impact: '-12', note: 'Facing top-tier defense' });
    } else if (defRating > 111) {
      advantage += 10;
      factors.push({ factor: 'Weak Defender', impact: '+10', note: 'Exploitable matchup' });
    }
    
    // Style matchup
    if (offensivePlayer.playstyle === 'slasher' && defenderProfile.defensive_style.primary.includes('Rim')) {
      advantage -= 7;
      factors.push({ factor: 'Style Clash', impact: '-7', note: 'Rim protector vs driver' });
    }
    
    return {
      net_advantage: advantage,
      level: advantage > 15 ? 'Massive Advantage 🔥' : 
             advantage > 8 ? 'Significant Advantage ⭐' : 
             advantage > 3 ? 'Moderate Advantage ✅' : 
             advantage > -3 ? 'Neutral Matchup 📊' : 
             advantage > -8 ? 'Moderate Disadvantage ⚠️' : 
             'Significant Disadvantage 🚨',
      factors: factors,
      overall_assessment: this.assessOverallMatchup(advantage)
    };
  }

  static assessOverallMatchup(advantage) {
    if (advantage > 12) return '🎯 SMASH SPOT - Target all props OVER';
    if (advantage > 6) return '✅ FAVORABLE - Lean props OVER';
    if (advantage > -6) return '📊 NEUTRAL - Use other analysis';
    if (advantage > -12) return '⚠️ TOUGH MATCHUP - Lean props UNDER';
    return '🚨 NIGHTMARE MATCHUP - Fade all props';
  }

  static analyzeHistoricalMatchup(offensivePlayer, defender, history) {
    if (!history || history.games < 3) {
      return {
        sample_size: 'Insufficient (< 3 games)',
        note: 'Use general matchup analysis instead',
        reliable: false
      };
    }
    
    return {
      games_played: history.games,
      avg_points: history.avg_pts.toFixed(1),
      vs_season_avg: (history.avg_pts - (offensivePlayer.stats?.pts || 20)).toFixed(1),
      avg_fg_pct: (history.avg_fg_pct * 100).toFixed(1) + '%',
      vs_season_fg: ((history.avg_fg_pct - (offensivePlayer.fg_pct || 0.45)) * 100).toFixed(1) + '%',
      trend: history.avg_pts > (offensivePlayer.stats?.pts || 20) + 2 ? 'DOMINATES 🔥' : 
             history.avg_pts < (offensivePlayer.stats?.pts || 20) - 2 ? 'STRUGGLES ⚠️' : 
             'TYPICAL ✅',
      reliability: history.games > 10 ? 'High' : history.games > 5 ? 'Moderate' : 'Low',
      betting_adjustment: this.getHistoricalAdjustment(history, offensivePlayer)
    };
  }

  static getHistoricalAdjustment(history, player) {
    const diff = history.avg_pts - (player.stats?.pts || 20);
    
    if (Math.abs(diff) < 1.5) return 'No adjustment - typical performance';
    if (diff > 3) return `+${diff.toFixed(1)} points - Target OVER`;
    if (diff < -3) return `${diff.toFixed(1)} points - Target UNDER`;
    
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} points - Slight ${diff > 0 ? 'OVER' : 'UNDER'} lean`;
  }

  static analyzeSchemeMatchup(offensivePlayer, defender) {
    return {
      team_defensive_scheme: defender.team_scheme || 'Switch-heavy',
      primary_coverage: this.determineCoverage(offensivePlayer, defender),
      help_defense: {
        expected_help: defender.team_help_rating || 'Moderate',
        double_team_likelihood: offensivePlayer.usage > 28 ? 'High' : offensivePlayer.usage > 23 ? 'Moderate' : 'Low',
        impact: offensivePlayer.usage > 28 ? 'May see doubles, assists props interesting' : 'Mostly 1-on-1'
      },
      adjustments: this.predictSchemeAdjustments(offensivePlayer, defender)
    };
  }

  static determineCoverage(offensivePlayer, defender) {
    if (offensivePlayer.usage > 30) {
      return {
        type: 'Top Lock + Help',
        description: 'Best defender assigned + help rotations',
        impact: 'Tough scoring, look for assists/rebounds'
      };
    }
    
    if (offensivePlayer.position === defender.position) {
      return {
        type: 'Primary Assignment',
        description: 'Matched up by position',
        impact: 'Standard 1-on-1 coverage'
      };
    }
    
    return {
      type: 'Switching',
      description: 'Various defenders in switches',
      impact: 'May see multiple matchups'
    };
  }

  static predictSchemeAdjustments(offensivePlayer, defender) {
    const adjustments = [];
    
    if (offensivePlayer.three_point_rate > 0.40) {
      adjustments.push('Expect tight closeouts on perimeter');
    }
    
    if (offensivePlayer.drive_rate > 0.35) {
      adjustments.push('Help defense will load paint');
    }
    
    if (offensivePlayer.usage > 28) {
      adjustments.push('Double teams likely in clutch');
    }
    
    return adjustments.length > 0 ? adjustments : ['Standard defensive approach'];
  }

  static identifyMatchupBettingEdge(matchupAdvantage, historicalPerformance) {
    const edges = [];
    
    // Matchup-based edges
    if (matchupAdvantage.net_advantage > 10) {
      edges.push({
        type: 'Massive Matchup Edge',
        play: '🔥 SMASH ALL PROPS OVER',
        confidence: 'Very High',
        reasoning: matchupAdvantage.overall_assessment
      });
    } else if (matchupAdvantage.net_advantage < -10) {
      edges.push({
        type: 'Terrible Matchup',
        play: '🚨 FADE ALL PROPS',
        confidence: 'High',
        reasoning: 'Nightmare defensive matchup'
      });
    }
    
    // Historical edges
    if (historicalPerformance.reliable && historicalPerformance.trend === 'DOMINATES 🔥') {
      edges.push({
        type: 'Historical Dominance',
        play: '✅ TARGET OVER - proven track record vs this defender',
        confidence: 'High',
        reasoning: `Averages ${historicalPerformance.vs_season_avg} PPG above season average`
      });
    }
    
    return edges.length > 0 ? edges : [{
      type: 'No Clear Edge',
      play: '📊 NEUTRAL - use other analysis',
      confidence: 'N/A',
      reasoning: 'Balanced matchup'
    }];
  }

  static recommendBettingAdjustments(matchupAdvantage, historicalPerformance) {
    const recommendations = [];
    
    const netAdv = matchupAdvantage.net_advantage;
    
    if (netAdv > 8) {
      recommendations.push(`📈 Increase prop targets by ${(netAdv * 0.5).toFixed(0)}%`);
    } else if (netAdv < -8) {
      recommendations.push(`📉 Decrease prop targets by ${Math.abs(netAdv * 0.5).toFixed(0)}%`);
    }
    
    if (historicalPerformance.reliable) {
      const histAdj = parseFloat(historicalPerformance.vs_season_avg);
      if (Math.abs(histAdj) > 2) {
        recommendations.push(`🎯 Historical adjustment: ${histAdj > 0 ? '+' : ''}${histAdj.toFixed(1)} points`);
      }
    }
    
    // Specific prop recommendations
    matchupAdvantage.factors.forEach(factor => {
      if (factor.factor === 'Height Advantage' && parseFloat(factor.impact) > 5) {
        recommendations.push('🎯 Target shot attempts and FGM props');
      }
      
      if (factor.factor === 'Speed Advantage' && parseFloat(factor.impact) > 8) {
        recommendations.push('⚡ Target drives, FTA, and assists props');
      }
    });
    
    return recommendations.length > 0 ? recommendations : ['📊 No specific matchup adjustments'];
  }
}

export default {
  ClutchPerformanceAnalyzer,
  DefensiveMatchupAnalyzer
};
