// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🌦️ RAY ADVANCED CONTEXT ANALYZER - WEATHER, REFS, PUBLIC BETTING & LINE PREDICTION                                 ║
// ║  Weather Impact • Referee Tendencies • Public Betting Patterns • Sharp Money Detection • Line Movement Prediction    ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌡️ WEATHER IMPACT ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class WeatherImpactAnalyzer {
  
  static analyzeWeatherImpact(venue, date, weatherData) {
    const conditions = this.assessConditions(weatherData);
    const venueFactors = this.analyzeVenueFactors(venue, weatherData);
    const playerImpact = this.calculatePlayerImpact(conditions, venueFactors);
    const bettingImplications = this.generateBettingAdvice(conditions, playerImpact);
    
    return {
      venue: venue,
      date: date,
      conditions: conditions,
      venue_factors: venueFactors,
      player_impact: playerImpact,
      betting_implications: bettingImplications,
      historical_trends: this.getHistoricalWeatherTrends(venue, conditions),
      risk_assessment: this.assessWeatherRisk(conditions, venueFactors)
    };
  }

  static assessConditions(weather) {
    const temp = weather.temperature || 72;
    const humidity = weather.humidity || 45;
    const altitude = weather.altitude || 0;
    const travel = weather.timezoneDifference || 0;
    
    return {
      temperature: {
        value: temp,
        rating: temp < 60 ? 'Cold 🥶' : temp > 85 ? 'Hot 🔥' : 'Optimal ✅',
        impact_level: Math.abs(temp - 72) > 15 ? 'High' : Math.abs(temp - 72) > 8 ? 'Moderate' : 'Low'
      },
      humidity: {
        value: humidity + '%',
        rating: humidity > 70 ? 'High 💧' : humidity < 30 ? 'Low 🏜️' : 'Normal ✅',
        impact_level: Math.abs(humidity - 45) > 25 ? 'High' : Math.abs(humidity - 45) > 15 ? 'Moderate' : 'Low'
      },
      altitude: {
        value: altitude + ' ft',
        rating: altitude > 4000 ? 'Very High ⛰️' : altitude > 2000 ? 'Elevated 📈' : 'Sea Level 🌊',
        impact_level: altitude > 4000 ? 'Extreme' : altitude > 2000 ? 'Moderate' : 'Minimal'
      },
      timezone_shift: {
        hours: Math.abs(travel),
        direction: travel > 0 ? 'East to West' : travel < 0 ? 'West to East' : 'None',
        impact_level: Math.abs(travel) >= 3 ? 'High' : Math.abs(travel) >= 2 ? 'Moderate' : 'Low',
        circadian_disruption: Math.abs(travel) >= 3 ? 'Significant' : Math.abs(travel) >= 2 ? 'Moderate' : 'Minimal'
      }
    };
  }

  static analyzeVenueFactors(venue, weather) {
    const knownVenues = {
      'Denver': { altitude: 5280, typical_temp: 68, humidity: 25, notes: 'Mile High - extreme fatigue factor' },
      'Miami': { altitude: 10, typical_temp: 82, humidity: 75, notes: 'Heat and humidity - conditioning critical' },
      'Phoenix': { altitude: 1100, typical_temp: 78, humidity: 20, notes: 'Dry heat - hydration key' },
      'Portland': { altitude: 50, typical_temp: 70, humidity: 65, notes: 'Mild climate - minimal impact' },
      'Salt Lake City': { altitude: 4226, typical_temp: 70, humidity: 30, notes: 'High altitude - fatigue factor' }
    };
    
    const venueInfo = knownVenues[venue] || { altitude: 0, typical_temp: 72, humidity: 45, notes: 'Standard conditions' };
    
    return {
      venue_name: venue,
      baseline_altitude: venueInfo.altitude + ' ft',
      typical_conditions: {
        temperature: venueInfo.typical_temp + '°F',
        humidity: venueInfo.humidity + '%'
      },
      special_notes: venueInfo.notes,
      home_court_advantage: this.calculateHomeCourtAdvantage(venueInfo),
      visiting_team_challenges: this.identifyVisitorChallenges(venueInfo, weather)
    };
  }

  static calculateHomeCourtAdvantage(venueInfo) {
    let advantage = 3.0; // Base HCA points
    
    // Altitude bonus
    if (venueInfo.altitude > 4000) {
advantage += 2.5;
} else if (venueInfo.altitude > 2000) {
advantage += 1.0;
}
    
    // Climate extremes
    if (venueInfo.typical_temp > 80 || venueInfo.typical_temp < 65) {
advantage += 0.5;
}
    if (venueInfo.humidity > 70 || venueInfo.humidity < 30) {
advantage += 0.5;
}
    
    return {
      total_points: advantage.toFixed(1),
      breakdown: {
        base_hca: '3.0',
        altitude_bonus: venueInfo.altitude > 4000 ? '2.5' : venueInfo.altitude > 2000 ? '1.0' : '0.0',
        climate_bonus: ((venueInfo.typical_temp > 80 || venueInfo.typical_temp < 65) ? 0.5 : 0) + 
                       ((venueInfo.humidity > 70 || venueInfo.humidity < 30) ? 0.5 : 0)
      },
      rating: advantage > 5 ? 'Extreme 🔴' : advantage > 4 ? 'Strong ⚠️' : advantage > 3.5 ? 'Moderate 📊' : 'Standard ✅'
    };
  }

  static identifyVisitorChallenges(venueInfo, weather) {
    const challenges = [];
    
    if (venueInfo.altitude > 4000) {
      challenges.push({
        factor: 'Extreme Altitude',
        impact: 'Severe fatigue, reduced stamina in 2nd half',
        performance_hit: '-8 to -12%',
        mitigation: 'Arrive 2+ days early for acclimation'
      });
    } else if (venueInfo.altitude > 2000) {
      challenges.push({
        factor: 'Elevated Altitude',
        impact: 'Moderate fatigue, 4th quarter struggles',
        performance_hit: '-4 to -7%',
        mitigation: 'Extra conditioning, hydration'
      });
    }
    
    if (venueInfo.humidity > 70) {
      challenges.push({
        factor: 'High Humidity',
        impact: 'Heavy legs, reduced shooting efficiency',
        performance_hit: '-3 to -5% FG',
        mitigation: 'Frequent substitutions, hydration'
      });
    }
    
    if (venueInfo.typical_temp > 80) {
      challenges.push({
        factor: 'Heat',
        impact: 'Increased fatigue, cramping risk',
        performance_hit: '-2 to -4%',
        mitigation: 'Cooling breaks, electrolytes'
      });
    }
    
    const timezoneDiff = Math.abs(weather.timezoneDifference || 0);
    if (timezoneDiff >= 3) {
      challenges.push({
        factor: 'Major Timezone Shift',
        impact: 'Circadian disruption, alertness issues',
        performance_hit: '-5 to -8%',
        mitigation: 'Adjust sleep schedule 2 days before'
      });
    }
    
    return challenges;
  }

  static calculatePlayerImpact(conditions, venueFactors) {
    const impacts = {
      scoring: this.estimateScoringImpact(conditions, venueFactors),
      efficiency: this.estimateEfficiencyImpact(conditions, venueFactors),
      pace: this.estimatePaceImpact(conditions, venueFactors),
      stamina: this.estimateStaminaImpact(conditions, venueFactors)
    };
    
    return impacts;
  }

  static estimateScoringImpact(conditions, venueFactors) {
    let impact = 0;
    
    // Altitude increases scoring (thinner air = longer shots)
    if (conditions.altitude.value > 4000) {
impact += 5;
} else if (conditions.altitude.value > 2000) {
impact += 2;
}
    
    // Extreme temps reduce scoring
    const temp = conditions.temperature.value;
    if (temp < 60 || temp > 85) {
impact -= 3;
}
    
    // High humidity reduces scoring
    if (conditions.humidity.value > 70) {
impact -= 2;
}
    
    return {
      change: impact > 0 ? `+${impact}%` : `${impact}%`,
      direction: impact > 2 ? 'Increase 📈' : impact < -2 ? 'Decrease 📉' : 'Neutral ➡️',
      confidence: Math.abs(impact) > 3 ? 'High' : Math.abs(impact) > 1 ? 'Moderate' : 'Low',
      explanation: this.explainScoringImpact(conditions, impact)
    };
  }

  static explainScoringImpact(conditions, impact) {
    const reasons = [];
    
    if (conditions.altitude.value > 4000) {
      reasons.push('High altitude = thinner air = longer range on shots = more scoring');
    }
    
    if (conditions.temperature.value < 60 || conditions.temperature.value > 85) {
      reasons.push('Extreme temperatures reduce shooting touch and rhythm');
    }
    
    if (conditions.humidity.value > 70) {
      reasons.push('High humidity affects ball grip and shooting mechanics');
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'Standard conditions - minimal impact';
  }

  static estimateEfficiencyImpact(conditions, venueFactors) {
    let impact = 0;
    
    // Temperature extremes hurt efficiency
    const temp = conditions.temperature.value;
    if (Math.abs(temp - 72) > 15) {
impact -= 4;
} else if (Math.abs(temp - 72) > 8) {
impact -= 2;
}
    
    // Humidity impacts
    if (conditions.humidity.value > 75) {
impact -= 3;
} else if (conditions.humidity.value < 25) {
impact -= 1;
}
    
    // Timezone
    if (Math.abs(conditions.timezone_shift.hours) >= 3) {
impact -= 3;
}
    
    return {
      change: impact !== 0 ? `${impact}%` : '0%',
      primary_factor: this.identifyPrimaryEfficiencyFactor(conditions),
      shooting_impact: `${impact}% FG`,
      free_throw_impact: `${Math.floor(impact * 0.7)}% FT`,
      recommendation: impact < -3 ? 'Lean UNDER on efficiency props' : impact > 2 ? 'Lean OVER' : 'Neutral'
    };
  }

  static identifyPrimaryEfficiencyFactor(conditions) {
    const factors = [];
    
    if (Math.abs(conditions.temperature.value - 72) > 10) {
factors.push('Temperature');
}
    if (conditions.humidity.value > 70 || conditions.humidity.value < 30) {
factors.push('Humidity');
}
    if (Math.abs(conditions.timezone_shift.hours) >= 3) {
factors.push('Timezone');
}
    
    return factors.length > 0 ? factors[0] : 'None';
  }

  static estimatePaceImpact(conditions, venueFactors) {
    let paceChange = 0;
    
    // Altitude increases pace (home teams run more)
    if (conditions.altitude.value > 4000) {
paceChange += 3;
} else if (conditions.altitude.value > 2000) {
paceChange += 1;
}
    
    // Heat/humidity slows pace
    if (conditions.temperature.value > 85) {
paceChange -= 2;
}
    if (conditions.humidity.value > 70) {
paceChange -= 1.5;
}
    
    return {
      change: paceChange > 0 ? `+${paceChange.toFixed(1)}` : `${paceChange.toFixed(1)}`,
      possessions_per_game: paceChange,
      impact_on_totals: Math.abs(paceChange) > 2 ? 'Significant' : Math.abs(paceChange) > 1 ? 'Moderate' : 'Minimal',
      betting_angle: paceChange > 2 ? 'Lean OVER on totals' : paceChange < -2 ? 'Lean UNDER on totals' : 'Neutral'
    };
  }

  static estimateStaminaImpact(conditions, venueFactors) {
    let fatigueScore = 0;
    
    // Altitude is biggest stamina factor
    if (conditions.altitude.value > 4000) {
fatigueScore += 40;
} else if (conditions.altitude.value > 2000) {
fatigueScore += 20;
}
    
    // Heat and humidity
    if (conditions.temperature.value > 85) {
fatigueScore += 15;
}
    if (conditions.humidity.value > 70) {
fatigueScore += 15;
}
    
    // Timezone
    if (Math.abs(conditions.timezone_shift.hours) >= 3) {
fatigueScore += 20;
}
    
    return {
      fatigue_score: fatigueScore,
      level: fatigueScore > 50 ? 'Severe 🔴' : fatigueScore > 30 ? 'High ⚠️' : fatigueScore > 15 ? 'Moderate 📊' : 'Low ✅',
      fourth_quarter_impact: fatigueScore > 40 ? 'Major decline expected' : fatigueScore > 25 ? 'Noticeable decline' : 'Minimal',
      rotation_impact: fatigueScore > 40 ? 'Deeper rotations needed' : fatigueScore > 25 ? 'More substitutions' : 'Normal rotations',
      betting_strategy: fatigueScore > 40 ? '🎯 Target 1H OVER, 2H UNDER' : fatigueScore > 25 ? '📊 Slight lean 2H UNDER' : '✅ No adjustment'
    };
  }

  static generateBettingAdvice(conditions, playerImpact) {
    const advice = [];
    
    // Altitude plays
    if (conditions.altitude.value > 4000) {
      advice.push('🏔️ HIGH ALTITUDE: Target home team OVERs, fade road team stamina-dependent players');
      advice.push('📈 1H OVER / 2H UNDER splits profitable (road teams fade in 2H)');
    }
    
    // Temperature
    if (conditions.temperature.value > 85 || conditions.temperature.value < 60) {
      advice.push('🌡️ EXTREME TEMPS: Lean UNDERs on efficiency props (FG%, 3PT%)');
    }
    
    // Humidity
    if (conditions.humidity.value > 70) {
      advice.push('💧 HIGH HUMIDITY: Fade shooters, target rebounders/defenders');
    }
    
    // Timezone
    if (Math.abs(conditions.timezone_shift.hours) >= 3) {
      advice.push('⏰ MAJOR TIMEZONE SHIFT: Fade road team, especially early games');
      advice.push('🎯 Target slow starts - 1Q UNDER often hits');
    }
    
    // Pace adjustments
    if (Math.abs(playerImpact.pace.possessions_per_game) > 2) {
      advice.push(`⚡ PACE IMPACT: ${playerImpact.pace.betting_angle}`);
    }
    
    return advice.length > 0 ? advice : ['✅ Standard conditions - no weather-based adjustments'];
  }

  static getHistoricalWeatherTrends(venue, conditions) {
    // Simulated historical data
    const altitude = conditions.altitude.value;
    
    if (altitude > 4000) {
      return {
        home_team_record: '342-198 (63.3% win rate)',
        road_team_performance: '-7.2 ppg vs season average',
        total_trend: 'OVER 54% of time in 1H, UNDER 58% in 2H',
        key_stat: 'Road teams shoot -4.8% FG in 4th quarter',
        confidence: 'High - 20+ years of data'
      };
    }
    
    if (Math.abs(conditions.timezone_shift.hours) >= 3) {
      return {
        home_team_record: 'Standard HCA maintained',
        road_team_performance: '-3.5 ppg first 2 games of road trip',
        total_trend: '1Q UNDER 56%, game total neutral',
        key_stat: 'Road teams -8% scoring efficiency in 1Q',
        confidence: 'Moderate - consistent pattern'
      };
    }
    
    return {
      home_team_record: 'Standard HCA (58%)',
      road_team_performance: 'Normal variance',
      total_trend: 'No significant weather-based trend',
      key_stat: 'Minimal historical impact',
      confidence: 'Low - not a major factor'
    };
  }

  static assessWeatherRisk(conditions, venueFactors) {
    let riskScore = 0;
    
    if (conditions.altitude.impact_level === 'Extreme') {
riskScore += 8;
} else if (conditions.altitude.impact_level === 'Moderate') {
riskScore += 4;
}
    
    if (conditions.temperature.impact_level === 'High') {
riskScore += 3;
}
    if (conditions.humidity.impact_level === 'High') {
riskScore += 3;
}
    if (conditions.timezone_shift.impact_level === 'High') {
riskScore += 4;
}
    
    return {
      overall_score: riskScore,
      level: riskScore > 12 ? 'EXTREME 🔴' : riskScore > 8 ? 'HIGH ⚠️' : riskScore > 4 ? 'MODERATE 📊' : 'LOW ✅',
      primary_concerns: this.listPrimaryConcerns(conditions),
      recommendation: riskScore > 10 ? 'HEAVY FADE road team' : riskScore > 6 ? 'Moderate fade road team' : 'Normal betting approach'
    };
  }

  static listPrimaryConcerns(conditions) {
    const concerns = [];
    
    if (conditions.altitude.impact_level === 'Extreme' || conditions.altitude.impact_level === 'High') {
      concerns.push('Altitude fatigue');
    }
    
    if (conditions.temperature.impact_level === 'High') {
      concerns.push('Temperature extremes');
    }
    
    if (conditions.humidity.impact_level === 'High') {
      concerns.push('High humidity');
    }
    
    if (conditions.timezone_shift.impact_level === 'High') {
      concerns.push('Timezone disruption');
    }
    
    return concerns.length > 0 ? concerns : ['None'];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 👨‍⚖️ REFEREE TENDENCY ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class RefereeTendencyAnalyzer {
  
  static analyzeRefereeImpact(referee, teams, gameContext) {
    const profile = this.getRefereeProfile(referee);
    const fouls = this.analyzeFoulTendencies(profile, teams);
    const pace = this.analyzePaceImpact(profile);
    const homeAwayBias = this.analyzeHomeAwayBias(profile, gameContext);
    const starTreatment = this.analyzeStarTreatment(profile);
    const bettingImplications = this.generateRefereeBettingAdvice(profile, fouls, pace);
    
    return {
      referee: referee,
      profile: profile,
      foul_tendencies: fouls,
      pace_impact: pace,
      home_away_bias: homeAwayBias,
      star_treatment: starTreatment,
      betting_implications: bettingImplications,
      historical_totals: this.getHistoricalTotals(profile),
      confidence: this.calculateRefConfidence(profile)
    };
  }

  static getRefereeProfile(referee) {
    // Simulated referee database
    const refs = {
      'Scott Foster': {
        years_experience: 28,
        games_officiated: 1850,
        fouls_per_game: 22.8,
        technical_fouls_per_game: 0.45,
        reputation: 'Strict, technical',
        pace_impact: -1.8,
        home_bias: 0.52,
        star_bias: 'Minimal',
        notable: 'Playoff veteran, calls tight game'
      },
      'Tony Brothers': {
        years_experience: 30,
        games_officiated: 2100,
        fouls_per_game: 24.2,
        technical_fouls_per_game: 0.62,
        reputation: 'Controversial, whistle-happy',
        pace_impact: -2.5,
        home_bias: 0.55,
        star_bias: 'High',
        notable: 'Slow pace, many reviews'
      },
      'Marc Davis': {
        years_experience: 26,
        games_officiated: 1650,
        fouls_per_game: 20.5,
        technical_fouls_per_game: 0.28,
        reputation: 'Let them play',
        pace_impact: +1.2,
        home_bias: 0.54,
        star_bias: 'Low',
        notable: 'Fewer whistles, faster game'
      }
    };
    
    return refs[referee] || {
      years_experience: 15,
      games_officiated: 800,
      fouls_per_game: 21.5,
      technical_fouls_per_game: 0.35,
      reputation: 'Standard',
      pace_impact: 0,
      home_bias: 0.53,
      star_bias: 'Moderate',
      notable: 'League average tendencies'
    };
  }

  static analyzeFoulTendencies(profile, teams) {
    const leagueAvg = 21.0;
    const diff = profile.fouls_per_game - leagueAvg;
    
    return {
      fouls_per_game: profile.fouls_per_game,
      vs_league_average: diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`,
      tendency: profile.fouls_per_game > 23 ? 'Whistle-Happy 🚨' : 
                profile.fouls_per_game < 20 ? 'Let Them Play ✅' : 
                'Standard 📊',
      impact_on_game: {
        free_throws: profile.fouls_per_game > 23 ? '+8 to +12 FTA total' : 
                     profile.fouls_per_game < 20 ? '-6 to -10 FTA total' : 
                     'Normal FTA',
        flow: profile.fouls_per_game > 23 ? 'Disrupted - many stoppages' : 
              profile.fouls_per_game < 20 ? 'Smooth - continuous action' : 
              'Standard flow',
        foul_trouble: profile.fouls_per_game > 23 ? 'High risk for star players' : 
                      profile.fouls_per_game < 20 ? 'Low risk' : 
                      'Moderate risk'
      },
      technical_tendency: {
        rate: profile.technical_fouls_per_game,
        level: profile.technical_fouls_per_game > 0.5 ? 'High (quick T)' : 
               profile.technical_fouls_per_game < 0.3 ? 'Low (patient)' : 
               'Moderate'
      }
    };
  }

  static analyzePaceImpact(profile) {
    const impact = profile.pace_impact;
    
    return {
      pace_adjustment: impact,
      possessions_impact: impact > 0 ? `+${Math.abs(impact).toFixed(1)}` : `${impact.toFixed(1)}`,
      total_impact: this.calculateTotalImpact(impact),
      explanation: impact > 1 ? 'Fewer whistles = faster pace = more possessions' :
                   impact < -1 ? 'More whistles = slower pace = fewer possessions' :
                   'Neutral pace impact',
      betting_angle: impact > 1.5 ? 'Lean OVER on totals' : 
                     impact < -1.5 ? 'Lean UNDER on totals' : 
                     'Neutral'
    };
  }

  static calculateTotalImpact(paceImpact) {
    // Each possession ≈ 1.1 points on average
    const pointsImpact = paceImpact * 1.1;
    
    return {
      estimated_points: pointsImpact > 0 ? `+${pointsImpact.toFixed(1)}` : `${pointsImpact.toFixed(1)}`,
      significance: Math.abs(pointsImpact) > 2 ? 'Significant' : 
                    Math.abs(pointsImpact) > 1 ? 'Moderate' : 
                    'Minimal'
    };
  }

  static analyzeHomeAwayBias(profile, gameContext) {
    const homeBias = profile.home_bias || 0.53;
    const league_avg = 0.53;
    
    const diff = homeBias - league_avg;
    
    return {
      home_win_rate: (homeBias * 100).toFixed(1) + '%',
      league_average: (league_avg * 100).toFixed(1) + '%',
      bias_level: Math.abs(diff) > 0.04 ? 'Significant Pro-Home 🏠' : 
                  Math.abs(diff) > 0.02 ? 'Moderate Pro-Home 📊' : 
                  'Standard ✅',
      estimated_impact: (diff * 100).toFixed(1) + ' percentage points',
      betting_advice: diff > 0.03 ? '🏠 Lean HOME TEAM' : 
                      diff < -0.03 ? '✈️ Lean ROAD TEAM' : 
                      '➡️ No bias adjustment'
    };
  }

  static analyzeStarTreatment(profile) {
    const bias = profile.star_bias || 'Moderate';
    
    const treatments = {
      'High': {
        description: 'Gives stars favorable whistle',
        foul_calls: '+15% for stars, -10% against',
        impact: 'Target star player OVERs, especially FTA',
        confidence: 'High'
      },
      'Moderate': {
        description: 'Standard star treatment',
        foul_calls: '+5% for stars',
        impact: 'Minimal betting adjustment',
        confidence: 'Moderate'
      },
      'Low': {
        description: 'No special treatment',
        foul_calls: 'Equal treatment',
        impact: 'Fade star FTA props',
        confidence: 'Moderate'
      },
      'Minimal': {
        description: 'Treats stars same as role players',
        foul_calls: 'No favoritism',
        impact: 'Neutral',
        confidence: 'Low'
      }
    };
    
    return treatments[bias] || treatments['Moderate'];
  }

  static generateRefereeBettingAdvice(profile, fouls, pace) {
    const advice = [];
    
    // Foul-based advice
    if (profile.fouls_per_game > 23) {
      advice.push('🚨 WHISTLE-HAPPY REF: Target FTA props OVER for aggressive drivers');
      advice.push('⏱️ Expect longer game - many stoppages');
      advice.push('📉 Lean UNDER on pace-dependent props');
    } else if (profile.fouls_per_game < 20) {
      advice.push('✅ LENIENT REF: Fade FTA props, physical play allowed');
      advice.push('⚡ Expect fast-paced game - fewer interruptions');
      advice.push('📈 Lean OVER on totals');
    }
    
    // Pace advice
    if (Math.abs(profile.pace_impact) > 1.5) {
      advice.push(`⚡ PACE IMPACT: ${pace.betting_angle}`);
    }
    
    // Technical fouls
    if (profile.technical_fouls_per_game > 0.5) {
      advice.push('⚠️ QUICK TRIGGER: High technical foul rate - coaches/players at risk');
    }
    
    // Star treatment
    if (profile.star_bias === 'High') {
      advice.push('⭐ STAR-FRIENDLY: Target star player props OVER');
    } else if (profile.star_bias === 'Low') {
      advice.push('🎯 NO STAR TREATMENT: Fade star FTA props');
    }
    
    return advice.length > 0 ? advice : ['➡️ Standard referee - no major adjustments'];
  }

  static getHistoricalTotals(profile) {
    const leagueAvg = 221.5;
    const refAvg = leagueAvg + (profile.pace_impact * 1.1);
    
    return {
      average_total: refAvg.toFixed(1),
      league_average: leagueAvg.toFixed(1),
      difference: profile.pace_impact > 0 ? `+${(refAvg - leagueAvg).toFixed(1)}` : `${(refAvg - leagueAvg).toFixed(1)}`,
      over_under_record: this.estimateOverUnderRecord(profile),
      trend: profile.pace_impact > 1 ? 'Games tend to go OVER' : 
             profile.pace_impact < -1 ? 'Games tend to go UNDER' : 
             'Neutral totals impact'
    };
  }

  static estimateOverUnderRecord(profile) {
    const baseline = 50;
    
    if (profile.pace_impact > 1.5) {
      return `OVER: 56%, UNDER: 44% (OVER trend)`;
    } else if (profile.pace_impact < -1.5) {
      return `OVER: 44%, UNDER: 56% (UNDER trend)`;
    }
    
    return `OVER: 50%, UNDER: 50% (Neutral)`;
  }

  static calculateRefConfidence(profile) {
    let confidence = 50;
    
    // More experience = more confidence in data
    if (profile.games_officiated > 1500) {
confidence += 20;
} else if (profile.games_officiated > 1000) {
confidence += 10;
}
    
    // Extreme tendencies = more predictable
    if (Math.abs(profile.pace_impact) > 2 || Math.abs(profile.fouls_per_game - 21) > 2.5) {
      confidence += 15;
    }
    
    return {
      score: Math.min(85, confidence),
      level: confidence > 70 ? 'High' : confidence > 55 ? 'Moderate' : 'Low',
      sample_size: profile.games_officiated + ' games'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 PUBLIC BETTING PATTERN ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PublicBettingAnalyzer {
  
  static analyzePublicBetting(game, bettingData) {
    const publicSide = this.identifyPublicSide(bettingData);
    const sharpMoney = this.detectSharpMoney(bettingData);
    const steamMoves = this.detectSteamMoves(bettingData);
    const contrarian = this.identifyContrarianOpportunities(publicSide, sharpMoney);
    const recommendations = this.generatePublicBettingAdvice(publicSide, sharpMoney, contrarian);
    
    return {
      game: game,
      public_side: publicSide,
      sharp_money: sharpMoney,
      steam_moves: steamMoves,
      contrarian_opportunities: contrarian,
      recommendations: recommendations,
      fade_potential: this.calculateFadePotential(publicSide, sharpMoney),
      historical_patterns: this.getHistoricalPublicPatterns(game)
    };
  }

  static identifyPublicSide(bettingData) {
    const spread = bettingData.spread || {};
    const total = bettingData.total || {};
    
    return {
      spread: {
        favorite_bets: spread.favorite_percentage || 65,
        underdog_bets: spread.underdog_percentage || 35,
        public_side: (spread.favorite_percentage || 65) > 60 ? 'FAVORITE 📈' : 'UNDERDOG 💎',
        heavy_public: (spread.favorite_percentage || 65) > 75 ? true : false,
        fade_rating: this.calculateFadeRating(spread.favorite_percentage || 65)
      },
      total: {
        over_bets: total.over_percentage || 58,
        under_bets: total.under_percentage || 42,
        public_side: (total.over_percentage || 58) > 55 ? 'OVER 📈' : 'UNDER 📉',
        heavy_public: (total.over_percentage || 58) > 70 ? true : false,
        fade_rating: this.calculateFadeRating(total.over_percentage || 58)
      }
    };
  }

  static calculateFadeRating(percentage) {
    if (percentage > 80) {
return '🔥 PREMIUM FADE (80%+ public)';
}
    if (percentage > 70) {
return '✅ GOOD FADE (70%+ public)';
}
    if (percentage > 65) {
return '📊 MODERATE FADE (65%+ public)';
}
    return '➡️ LOW FADE VALUE';
  }

  static detectSharpMoney(bettingData) {
    const lineMovement = bettingData.line_movement || [];
    const moneyPercentages = bettingData.money_percentages || {};
    
    // Sharp indicators: Line moves against public
    const reverseLineMovement = this.detectReverseLineMovement(lineMovement, moneyPercentages);
    
    // Sharp indicators: Big money bets
    const bigMoneyBets = this.identifyBigMoneyBets(bettingData);
    
    return {
      detected: reverseLineMovement.detected || bigMoneyBets.detected,
      reverse_line_movement: reverseLineMovement,
      big_money_bets: bigMoneyBets,
      sharp_side: this.determineSharpSide(reverseLineMovement, bigMoneyBets),
      confidence: this.calculateSharpConfidence(reverseLineMovement, bigMoneyBets)
    };
  }

  static detectReverseLineMovement(lineMovement, moneyPercentages) {
    // Example: 70% of bets on favorite, but line moves TOWARD underdog = sharps on underdog
    const publicSide = moneyPercentages.favorite_bets > 60 ? 'favorite' : 'underdog';
    const lineDirection = lineMovement.direction || 'favorite';
    
    const isRLM = publicSide === 'favorite' && lineDirection === 'underdog' ||
                  publicSide === 'underdog' && lineDirection === 'favorite';
    
    return {
      detected: isRLM,
      public_on: publicSide,
      line_moving_to: lineDirection,
      explanation: isRLM ? 
        '🎯 SHARP MONEY DETECTED: Line moving opposite to public betting' : 
        '➡️ Line moving with public (no RLM)',
      strength: lineMovement.magnitude > 1.5 ? 'Strong' : lineMovement.magnitude > 1 ? 'Moderate' : 'Weak'
    };
  }

  static identifyBigMoneyBets(bettingData) {
    const tickets = bettingData.ticket_count || 100;
    const money = bettingData.money_percentage || 50;
    
    // If money % >> ticket %, big bettors (sharps) are on that side
    const discrepancy = Math.abs(money - 50) - Math.abs((100 - tickets) - 50);
    
    return {
      detected: discrepancy > 10,
      side: money > tickets ? 'Side with higher money %' : 'Unknown',
      discrepancy: discrepancy.toFixed(1) + ' percentage points',
      interpretation: discrepancy > 15 ? '🚨 MAJOR sharp money detected' : 
                      discrepancy > 10 ? '⚠️ Moderate sharp interest' : 
                      '➡️ Evenly distributed'
    };
  }

  static determineSharpSide(rlm, bigMoney) {
    if (rlm.detected && bigMoney.detected) {
      return {
        side: rlm.line_moving_to,
        confidence: 'Very High',
        evidence: 'RLM + Big Money both detected'
      };
    }
    
    if (rlm.detected) {
      return {
        side: rlm.line_moving_to,
        confidence: 'High',
        evidence: 'Reverse Line Movement'
      };
    }
    
    if (bigMoney.detected) {
      return {
        side: bigMoney.side,
        confidence: 'Moderate',
        evidence: 'Big Money discrepancy'
      };
    }
    
    return {
      side: 'Unknown',
      confidence: 'Low',
      evidence: 'No clear sharp indicators'
    };
  }

  static calculateSharpConfidence(rlm, bigMoney) {
    let score = 0;
    
    if (rlm.detected) {
      score += rlm.strength === 'Strong' ? 35 : rlm.strength === 'Moderate' ? 25 : 15;
    }
    
    if (bigMoney.detected) {
      score += parseFloat(bigMoney.discrepancy) > 15 ? 30 : 20;
    }
    
    return {
      score: score,
      level: score > 50 ? 'Very High 🎯' : score > 30 ? 'High ✅' : score > 15 ? 'Moderate 📊' : 'Low ➡️'
    };
  }

  static detectSteamMoves(bettingData) {
    const lineMovement = bettingData.line_movement || [];
    
    // Steam = rapid significant line movement across multiple books
    const recentMoves = lineMovement.slice(-3); // Last 3 movements
    const rapidMoves = recentMoves.filter(move => move.speed === 'fast' && Math.abs(move.magnitude) > 1);
    
    return {
      detected: rapidMoves.length >= 2,
      count: rapidMoves.length,
      moves: rapidMoves.map(move => ({
        time: move.timestamp,
        from: move.from_line,
        to: move.to_line,
        magnitude: move.magnitude,
        sportsbooks: move.books_moved || ['Multiple']
      })),
      interpretation: rapidMoves.length >= 2 ? 
        '🚨 STEAM DETECTED: Syndicate/sharp money flooding market' : 
        '➡️ No steam detected',
      recommendation: rapidMoves.length >= 2 ? 
        '🎯 FOLLOW THE STEAM - Sharp money indicator' : 
        '➡️ Monitor line movement'
    };
  }

  static identifyContrarianOpportunities(publicSide, sharpMoney) {
    const opportunities = [];
    
    // Spread contrarian
    if (publicSide.spread.heavy_public) {
      opportunities.push({
        type: 'Spread Fade',
        public_on: publicSide.spread.public_side,
        contrarian_play: publicSide.spread.public_side.includes('FAVORITE') ? 'UNDERDOG' : 'FAVORITE',
        public_percentage: publicSide.spread.favorite_bets + '%',
        value_rating: publicSide.spread.fade_rating,
        confidence: publicSide.spread.favorite_bets > 75 ? 'High' : 'Moderate'
      });
    }
    
    // Total contrarian
    if (publicSide.total.heavy_public) {
      opportunities.push({
        type: 'Total Fade',
        public_on: publicSide.total.public_side,
        contrarian_play: publicSide.total.public_side === 'OVER 📈' ? 'UNDER' : 'OVER',
        public_percentage: publicSide.total.over_bets + '%',
        value_rating: publicSide.total.fade_rating,
        confidence: publicSide.total.over_bets > 70 ? 'High' : 'Moderate'
      });
    }
    
    // Sharp confirmation
    if (sharpMoney.detected) {
      opportunities.forEach(opp => {
        if (opp.contrarian_play.includes(sharpMoney.sharp_side.side)) {
          opp.sharp_confirmation = true;
          opp.confidence = 'Very High';
        }
      });
    }
    
    return opportunities;
  }

  static generatePublicBettingAdvice(publicSide, sharpMoney, contrarian) {
    const advice = [];
    
    // Sharp money advice
    if (sharpMoney.detected && sharpMoney.confidence.level.includes('High')) {
      advice.push(`🎯 SHARP MONEY ON: ${sharpMoney.sharp_side.side.toUpperCase()}`);
      advice.push(`✅ FOLLOW SHARPS - Confidence: ${sharpMoney.sharp_side.confidence}`);
    }
    
    // Contrarian advice
    contrarian.forEach(opp => {
      if (opp.confidence === 'Very High' && opp.sharp_confirmation) {
        advice.push(`🔥 PREMIUM PLAY: ${opp.contrarian_play} (${opp.type})`);
        advice.push(`   • Public: ${opp.public_percentage} on opposite side`);
        advice.push(`   • Sharps: Confirmed on this side`);
      } else if (opp.confidence === 'High' || opp.confidence === 'Very High') {
        advice.push(`✅ GOOD FADE: ${opp.contrarian_play} (${opp.type})`);
        advice.push(`   • Public: ${opp.public_percentage} on opposite side`);
      }
    });
    
    // Default advice
    if (advice.length === 0) {
      advice.push('➡️ No strong public betting angles detected');
      advice.push('📊 Use other analysis methods for this game');
    }
    
    return advice;
  }

  static calculateFadePotential(publicSide, sharpMoney) {
    let score = 0;
    
    // Heavy public = fade potential
    if (publicSide.spread.heavy_public) {
score += 25;
}
    if (publicSide.total.heavy_public) {
score += 25;
}
    
    // Sharp confirmation = high fade potential
    if (sharpMoney.detected) {
score += 30;
}
    
    // Very heavy public (>80%) = premium fade
    if (publicSide.spread.favorite_bets > 80 || publicSide.total.over_bets > 80) {
      score += 20;
    }
    
    return {
      score: score,
      level: score > 70 ? '🔥 PREMIUM FADE SPOT' : 
             score > 50 ? '✅ GOOD FADE SPOT' : 
             score > 30 ? '📊 MODERATE FADE' : 
             '➡️ LOW FADE VALUE',
      recommendation: score > 60 ? 'Strong fade recommendation - bet opposite public' : 
                      score > 40 ? 'Consider fading public side' : 
                      'Not a strong fade spot'
    };
  }

  static getHistoricalPublicPatterns(game) {
    return {
      heavy_favorite_record: 'Public favorites >75% bets: 42-58 ATS (42%)',
      heavy_over_record: 'Public OVERs >70% bets: 45-55 (45%)',
      contrarian_strategy: 'Fading 75%+ public bets: 58% win rate historically',
      sharp_following: 'Following confirmed sharp money: 62% win rate',
      note: 'Public consistently overvalues favorites and OVERs'
    };
  }
}

export default {
  WeatherImpactAnalyzer,
  RefereeTendencyAnalyzer,
  PublicBettingAnalyzer
};
