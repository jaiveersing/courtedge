// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  💰 RAY ARBITRAGE ENGINE - GUARANTEED PROFIT OPPORTUNITIES & HEDGING STRATEGIES                                      ║
// ║  Cross-Sportsbook Arbitrage • Middles • Hedging • Correlation Bets • Same-Game Parlays • Line Shopping              ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 ARBITRAGE DETECTOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class ArbitrageDetector {
  
  static findArbitrageOpportunities(oddsData) {
    const opportunities = [];
    
    // Check traditional arbitrage
    const traditionalArbs = this.findTraditionalArbitrage(oddsData);
    opportunities.push(...traditionalArbs);
    
    // Check middle opportunities
    const middles = this.findMiddleOpportunities(oddsData);
    opportunities.push(...middles);
    
    // Check correlation arbitrage
    const correlationArbs = this.findCorrelationArbitrage(oddsData);
    opportunities.push(...correlationArbs);
    
    // Rank by profitability
    opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);
    
    return {
      total_opportunities: opportunities.length,
      high_value: opportunities.filter(o => o.expectedProfit > 5),
      moderate_value: opportunities.filter(o => o.expectedProfit >= 2 && o.expectedProfit <= 5),
      low_value: opportunities.filter(o => o.expectedProfit < 2),
      all_opportunities: opportunities,
      summary: this.generateArbitrageSummary(opportunities)
    };
  }

  static findTraditionalArbitrage(oddsData) {
    const arbs = [];
    
    // Group by market (same prop across different books)
    const markets = this.groupByMarket(oddsData);
    
    Object.values(markets).forEach(market => {
      const bestBack = this.findBestBackOdds(market);
      const bestLay = this.findBestLayOdds(market);
      
      if (bestBack && bestLay && bestBack.sportsbook !== bestLay.sportsbook) {
        const arbPercent = this.calculateArbitragePercent(bestBack.odds, bestLay.odds);
        
        if (arbPercent < 100) { // Guaranteed profit
          const profit = 100 - arbPercent;
          const stakes = this.calculateArbitrageStakes(bestBack.odds, bestLay.odds, 1000);
          
          arbs.push({
            type: 'Traditional Arbitrage',
            market: market[0].market,
            player: market[0].player || market[0].team,
            sportsbook_a: {
              name: bestBack.sportsbook,
              side: bestBack.side,
              odds: bestBack.odds,
              stake: stakes.stake_a.toFixed(2)
            },
            sportsbook_b: {
              name: bestLay.sportsbook,
              side: bestLay.side,
              odds: bestLay.odds,
              stake: stakes.stake_b.toFixed(2)
            },
            total_investment: stakes.total.toFixed(2),
            guaranteed_profit: stakes.profit.toFixed(2),
            roi: ((stakes.profit / stakes.total) * 100).toFixed(2) + '%',
            expectedProfit: stakes.profit,
            risk_level: 'None ✅',
            confidence: 100,
            instructions: this.generateArbInstructions(bestBack, bestLay, stakes)
          });
        }
      }
    });
    
    return arbs;
  }

  static groupByMarket(oddsData) {
    const markets = {};
    
    oddsData.forEach(odd => {
      const key = `${odd.player || odd.team}_${odd.market}_${odd.line || ''}`;
      
      if (!markets[key]) {
        markets[key] = [];
      }
      
      markets[key].push(odd);
    });
    
    return markets;
  }

  static findBestBackOdds(market) {
    let best = null;
    
    market.forEach(odd => {
      if (odd.side === 'over' || odd.side === 'yes' || odd.side === 'team_a') {
        if (!best || this.convertToDecimal(odd.odds) > this.convertToDecimal(best.odds)) {
          best = odd;
        }
      }
    });
    
    return best;
  }

  static findBestLayOdds(market) {
    let best = null;
    
    market.forEach(odd => {
      if (odd.side === 'under' || odd.side === 'no' || odd.side === 'team_b') {
        if (!best || this.convertToDecimal(odd.odds) > this.convertToDecimal(best.odds)) {
          best = odd;
        }
      }
    });
    
    return best;
  }

  static calculateArbitragePercent(odds_a, odds_b) {
    const decimal_a = this.convertToDecimal(odds_a);
    const decimal_b = this.convertToDecimal(odds_b);
    
    return ((1 / decimal_a) + (1 / decimal_b)) * 100;
  }

  static calculateArbitrageStakes(odds_a, odds_b, totalStake) {
    const decimal_a = this.convertToDecimal(odds_a);
    const decimal_b = this.convertToDecimal(odds_b);
    
    const arbPercent = ((1 / decimal_a) + (1 / decimal_b));
    
    const stake_a = totalStake / (arbPercent * decimal_a);
    const stake_b = totalStake / (arbPercent * decimal_b);
    
    const payout_a = stake_a * decimal_a;
    const payout_b = stake_b * decimal_b;
    
    const profit = Math.min(payout_a, payout_b) - totalStake;
    
    return {
      stake_a,
      stake_b,
      total: stake_a + stake_b,
      payout: Math.min(payout_a, payout_b),
      profit
    };
  }

  static convertToDecimal(odds) {
    if (odds > 0) {
      return (odds / 100) + 1;
    } else {
      return (100 / Math.abs(odds)) + 1;
    }
  }

  static generateArbInstructions(back, lay, stakes) {
    return [
      `1️⃣ Place $${stakes.stake_a.toFixed(2)} on ${back.side.toUpperCase()} at ${back.odds} on ${back.sportsbook}`,
      `2️⃣ Place $${stakes.stake_b.toFixed(2)} on ${lay.side.toUpperCase()} at ${lay.odds} on ${lay.sportsbook}`,
      `3️⃣ Total investment: $${stakes.total.toFixed(2)}`,
      `4️⃣ Guaranteed profit: $${stakes.profit.toFixed(2)} regardless of outcome ✅`
    ];
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🎲 MIDDLE OPPORTUNITIES
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  static findMiddleOpportunities(oddsData) {
    const middles = [];
    
    // Group by market
    const markets = this.groupByMarket(oddsData);
    
    Object.values(markets).forEach(market => {
      // Check for line discrepancies that create middle opportunities
      const lines = this.extractLines(market);
      
      lines.forEach((line_a, i) => {
        lines.slice(i + 1).forEach(line_b => {
          if (Math.abs(line_a.value - line_b.value) >= 1) {
            const middleAnalysis = this.analyzeMiddle(line_a, line_b);
            
            if (middleAnalysis.isViable) {
              middles.push({
                type: 'Middle Opportunity',
                market: market[0].market,
                player: market[0].player || market[0].team,
                line_a: {
                  sportsbook: line_a.sportsbook,
                  side: line_a.side,
                  line: line_a.value,
                  odds: line_a.odds
                },
                line_b: {
                  sportsbook: line_b.sportsbook,
                  side: line_b.side,
                  line: line_b.value,
                  odds: line_b.odds
                },
                middle_range: {
                  low: Math.min(line_a.value, line_b.value),
                  high: Math.max(line_a.value, line_b.value),
                  width: Math.abs(line_a.value - line_b.value)
                },
                probability_both_win: middleAnalysis.bothWinProb.toFixed(1) + '%',
                probability_split: middleAnalysis.splitProb.toFixed(1) + '%',
                expected_value: middleAnalysis.ev.toFixed(2),
                expectedProfit: middleAnalysis.ev,
                risk_level: middleAnalysis.ev > 3 ? 'Low ✅' : middleAnalysis.ev > 0 ? 'Moderate 📊' : 'High ⚠️',
                confidence: middleAnalysis.confidence,
                recommended_stakes: this.calculateMiddleStakes(line_a.odds, line_b.odds),
                instructions: this.generateMiddleInstructions(line_a, line_b)
              });
            }
          }
        });
      });
    });
    
    return middles;
  }

  static extractLines(market) {
    const lines = [];
    
    market.forEach(odd => {
      if (odd.line !== undefined) {
        lines.push({
          sportsbook: odd.sportsbook,
          side: odd.side,
          value: parseFloat(odd.line),
          odds: odd.odds
        });
      }
    });
    
    return lines;
  }

  static analyzeMiddle(line_a, line_b) {
    const middleWidth = Math.abs(line_a.value - line_b.value);
    
    // Estimate probability of landing in the middle (rough approximation)
    // Wider middles = higher probability
    const bothWinProb = Math.min(middleWidth * 8, 35); // Cap at 35%
    const splitProb = 100 - bothWinProb - 10; // 10% for both lose
    
    // Calculate expected value
    const decimal_a = this.convertToDecimal(line_a.odds);
    const decimal_b = this.convertToDecimal(line_b.odds);
    
    // Assume equal stakes of $100 each
    const stake = 100;
    const winBoth = (stake * decimal_a) + (stake * decimal_b) - (2 * stake);
    const winOne = (stake * decimal_a) - (2 * stake); // or win B, similar
    const loseBoth = -2 * stake;
    
    const ev = (winBoth * (bothWinProb / 100)) + (winOne * (splitProb / 100)) + (loseBoth * 0.1);
    
    return {
      isViable: ev > -5 && middleWidth >= 1, // Positive EV or close to break-even
      bothWinProb,
      splitProb,
      ev,
      confidence: middleWidth >= 2 ? 85 : middleWidth >= 1.5 ? 70 : 55
    };
  }

  static calculateMiddleStakes(odds_a, odds_b) {
    // Equal stakes approach for simplicity
    const stake = 100;
    
    return {
      bet_a: stake,
      bet_b: stake,
      total: stake * 2,
      max_profit: (stake * this.convertToDecimal(odds_a)) + (stake * this.convertToDecimal(odds_b)) - (2 * stake),
      max_loss: 2 * stake,
      break_even: 'Split (1 win, 1 loss)'
    };
  }

  static generateMiddleInstructions(line_a, line_b) {
    return [
      `1️⃣ Bet ${line_a.side.toUpperCase()} ${line_a.value} at ${line_a.odds} on ${line_a.sportsbook}`,
      `2️⃣ Bet ${line_b.side.toUpperCase()} ${line_b.value} at ${line_b.odds} on ${line_b.sportsbook}`,
      `🎯 MIDDLE RANGE: ${Math.min(line_a.value, line_b.value)} to ${Math.max(line_a.value, line_b.value)}`,
      `💰 If result lands in middle = WIN BOTH BETS!`,
      `📊 If result outside middle = win 1, lose 1 (minimal loss)`,
      `🎲 Risk: Low to Moderate - worst case is small loss if split`
    ];
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🔗 CORRELATION ARBITRAGE
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  static findCorrelationArbitrage(oddsData) {
    const correlationOpps = [];
    
    // Look for correlated props that are mispriced relative to each other
    const playerProps = this.groupByPlayer(oddsData);
    
    Object.values(playerProps).forEach(props => {
      // Example: Points OVER often correlates with FGM OVER
      const pointsOver = props.find(p => p.market === 'points' && p.side === 'over');
      const fgmOver = props.find(p => p.market === 'fgm' && p.side === 'over');
      
      if (pointsOver && fgmOver) {
        const correlation = this.estimateCorrelation('points', 'fgm');
        const impliedProb = this.calculateImpliedProbability(pointsOver.odds, fgmOver.odds);
        const trueProb = this.adjustForCorrelation(impliedProb.both, correlation);
        
        const edge = trueProb - impliedProb.both;
        
        if (Math.abs(edge) > 5) {
          correlationOpps.push({
            type: 'Correlation Arbitrage',
            player: pointsOver.player,
            prop_a: {
              market: 'Points OVER',
              line: pointsOver.line,
              odds: pointsOver.odds,
              sportsbook: pointsOver.sportsbook
            },
            prop_b: {
              market: 'FGM OVER',
              line: fgmOver.line,
              odds: fgmOver.odds,
              sportsbook: fgmOver.sportsbook
            },
            correlation_strength: (correlation * 100).toFixed(0) + '%',
            implied_probability: impliedProb.both.toFixed(1) + '%',
            true_probability: trueProb.toFixed(1) + '%',
            edge: edge.toFixed(1) + '%',
            recommendation: edge > 5 ? '✅ BET PARLAY' : edge < -5 ? '❌ FADE PARLAY' : '➡️ NEUTRAL',
            expectedProfit: edge / 2,
            risk_level: Math.abs(edge) > 10 ? 'Low ✅' : 'Moderate 📊',
            confidence: Math.abs(edge) > 10 ? 80 : 65,
            parlay_odds: this.calculateParlayOdds([pointsOver.odds, fgmOver.odds]),
            explanation: this.explainCorrelation('points', 'fgm', correlation)
          });
        }
      }
    });
    
    return correlationOpps;
  }

  static groupByPlayer(oddsData) {
    const players = {};
    
    oddsData.forEach(odd => {
      if (odd.player) {
        if (!players[odd.player]) {
          players[odd.player] = [];
        }
        players[odd.player].push(odd);
      }
    });
    
    return players;
  }

  static estimateCorrelation(prop_a, prop_b) {
    // Correlation coefficients based on basketball analytics
    const correlations = {
      'points_fgm': 0.85,
      'points_assists': 0.45,
      'points_rebounds': 0.30,
      'rebounds_blocks': 0.40,
      'assists_turnovers': 0.55,
      'fgm_fg3m': 0.60
    };
    
    const key = `${prop_a}_${prop_b}`;
    const reverseKey = `${prop_b}_${prop_a}`;
    
    return correlations[key] || correlations[reverseKey] || 0.25;
  }

  static calculateImpliedProbability(odds_a, odds_b) {
    const prob_a = this.oddsToImpliedProb(odds_a);
    const prob_b = this.oddsToImpliedProb(odds_b);
    
    // Assuming independence (which is wrong if correlated)
    const both = prob_a * prob_b * 100;
    
    return {
      prop_a: prob_a * 100,
      prop_b: prob_b * 100,
      both: both
    };
  }

  static oddsToImpliedProb(odds) {
    const decimal = this.convertToDecimal(odds);
    return 1 / decimal;
  }

  static adjustForCorrelation(independentProb, correlation) {
    // Higher correlation = higher joint probability
    // This is a simplified adjustment
    const adjustment = correlation * 15; // Up to 15% boost for perfect correlation
    return Math.min(independentProb + adjustment, 95);
  }

  static calculateParlayOdds(oddsArray) {
    let decimal = 1;
    
    oddsArray.forEach(odds => {
      decimal *= this.convertToDecimal(odds);
    });
    
    // Convert back to American
    if (decimal >= 2) {
      return '+' + ((decimal - 1) * 100).toFixed(0);
    } else {
      return '-' + (100 / (decimal - 1)).toFixed(0);
    }
  }

  static explainCorrelation(prop_a, prop_b, correlation) {
    if (prop_a === 'points' && prop_b === 'fgm') {
      return `Strong positive correlation (${(correlation * 100).toFixed(0)}%): Players who hit Points OVER typically need more FGM, making FGM OVER also likely.`;
    }
    
    return `Correlation: ${(correlation * 100).toFixed(0)}% - these props tend to move together.`;
  }

  static generateArbitrageSummary(opportunities) {
    const totalProfit = opportunities.reduce((sum, opp) => sum + opp.expectedProfit, 0);
    const avgProfit = opportunities.length > 0 ? totalProfit / opportunities.length : 0;
    
    const byType = {
      traditional: opportunities.filter(o => o.type === 'Traditional Arbitrage'),
      middle: opportunities.filter(o => o.type === 'Middle Opportunity'),
      correlation: opportunities.filter(o => o.type === 'Correlation Arbitrage')
    };
    
    return {
      total_opportunities: opportunities.length,
      total_expected_profit: totalProfit.toFixed(2),
      average_profit_per_opp: avgProfit.toFixed(2),
      breakdown: {
        traditional_arbs: byType.traditional.length,
        middles: byType.middle.length,
        correlation_arbs: byType.correlation.length
      },
      best_opportunity: opportunities[0] || null,
      recommendation: opportunities.length > 0 ? 
        `🎯 ${opportunities.length} arbitrage opportunities detected - prioritize highest EV plays` :
        '➡️ No arbitrage opportunities currently available'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🛡️ HEDGE CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class HedgeCalculator {
  
  static calculateHedge(originalBet, currentOdds, options = {}) {
    const {
      lockProfit = true,
      profitTarget = null,
      hedgePercentage = 100
    } = options;
    
    const potentialPayout = this.calculatePayout(originalBet.stake, originalBet.odds);
    const hedgeOdds = currentOdds;
    
    let hedgeStake;
    
    if (lockProfit) {
      // Lock in guaranteed profit
      hedgeStake = this.calculateLockProfitHedge(potentialPayout, hedgeOdds);
    } else if (profitTarget) {
      // Target specific profit amount
      hedgeStake = this.calculateTargetProfitHedge(originalBet.stake, potentialPayout, hedgeOdds, profitTarget);
    } else {
      // Partial hedge (percentage of original stake)
      hedgeStake = this.calculatePartialHedge(originalBet.stake, potentialPayout, hedgeOdds, hedgePercentage);
    }
    
    const hedgePayout = this.calculatePayout(hedgeStake, hedgeOdds);
    
    const outcomes = this.analyzeHedgeOutcomes(originalBet.stake, potentialPayout, hedgeStake, hedgePayout);
    
    return {
      original_bet: {
        stake: originalBet.stake,
        odds: originalBet.odds,
        potential_payout: potentialPayout.toFixed(2)
      },
      hedge_bet: {
        stake: hedgeStake.toFixed(2),
        odds: hedgeOdds,
        potential_payout: hedgePayout.toFixed(2)
      },
      outcomes: outcomes,
      recommendation: this.generateHedgeRecommendation(outcomes),
      analysis: this.analyzeHedgeValue(originalBet, hedgeStake, outcomes)
    };
  }

  static calculatePayout(stake, odds) {
    const decimal = this.convertToDecimal(odds);
    return stake * decimal;
  }

  static convertToDecimal(odds) {
    if (odds > 0) {
      return (odds / 100) + 1;
    } else {
      return (100 / Math.abs(odds)) + 1;
    }
  }

  static calculateLockProfitHedge(originalPayout, hedgeOdds) {
    // Calculate stake that guarantees same profit on either outcome
    const hedgeDecimal = this.convertToDecimal(hedgeOdds);
    return originalPayout / hedgeDecimal;
  }

  static calculateTargetProfitHedge(originalStake, originalPayout, hedgeOdds, targetProfit) {
    const hedgeDecimal = this.convertToDecimal(hedgeOdds);
    
    // Solve for hedge stake that yields target profit on hedge win
    // hedgeStake * hedgeDecimal - (originalStake + hedgeStake) = targetProfit
    const hedgeStake = (targetProfit + originalStake) / (hedgeDecimal - 1);
    
    return hedgeStake;
  }

  static calculatePartialHedge(originalStake, originalPayout, hedgeOdds, percentage) {
    const fullHedge = this.calculateLockProfitHedge(originalPayout, hedgeOdds);
    return fullHedge * (percentage / 100);
  }

  static analyzeHedgeOutcomes(originalStake, originalPayout, hedgeStake, hedgePayout) {
    const totalInvested = originalStake + hedgeStake;
    
    const originalWins = originalPayout - totalInvested;
    const hedgeWins = hedgePayout - totalInvested;
    
    return {
      if_original_wins: {
        payout: originalPayout.toFixed(2),
        profit: originalWins.toFixed(2),
        roi: ((originalWins / totalInvested) * 100).toFixed(1) + '%'
      },
      if_hedge_wins: {
        payout: hedgePayout.toFixed(2),
        profit: hedgeWins.toFixed(2),
        roi: ((hedgeWins / totalInvested) * 100).toFixed(1) + '%'
      },
      total_invested: totalInvested.toFixed(2),
      guaranteed_profit: Math.min(originalWins, hedgeWins) > 0 ? 
        Math.min(originalWins, hedgeWins).toFixed(2) : 
        'None - not fully hedged',
      worst_case: Math.min(originalWins, hedgeWins).toFixed(2),
      best_case: Math.max(originalWins, hedgeWins).toFixed(2)
    };
  }

  static generateHedgeRecommendation(outcomes) {
    const guaranteedProfit = outcomes.guaranteed_profit !== 'None - not fully hedged' ? 
      parseFloat(outcomes.guaranteed_profit) : null;
    
    if (guaranteedProfit && guaranteedProfit > 0) {
      return `✅ RECOMMENDED - Lock in guaranteed profit of $${guaranteedProfit.toFixed(2)}`;
    }
    
    const avgProfit = (parseFloat(outcomes.if_original_wins.profit) + parseFloat(outcomes.if_hedge_wins.profit)) / 2;
    
    if (avgProfit > 0) {
      return `📊 CONSIDER - Average profit across outcomes: $${avgProfit.toFixed(2)}`;
    }
    
    return `⚠️ CAUTION - Hedge creates negative expected value`;
  }

  static analyzeHedgeValue(originalBet, hedgeStake, outcomes) {
    const letItRideProfit = this.calculatePayout(originalBet.stake, originalBet.odds) - originalBet.stake;
    const hedgedProfit = Math.min(
      parseFloat(outcomes.if_original_wins.profit),
      parseFloat(outcomes.if_hedge_wins.profit)
    );
    
    const profitGivenUp = letItRideProfit - hedgedProfit;
    const percentageGivenUp = (profitGivenUp / letItRideProfit) * 100;
    
    return {
      let_it_ride_profit: letItRideProfit.toFixed(2),
      hedged_profit: hedgedProfit.toFixed(2),
      profit_given_up: profitGivenUp.toFixed(2),
      percentage_given_up: percentageGivenUp.toFixed(1) + '%',
      assessment: percentageGivenUp < 25 ? 'Excellent hedge - minimal profit sacrifice' :
                  percentageGivenUp < 50 ? 'Good hedge - reasonable trade-off' :
                  percentageGivenUp < 75 ? 'Fair hedge - significant profit given up' :
                  'Poor hedge - giving up too much potential profit',
      when_to_hedge: [
        '✅ Large potential payout (>10x stake)',
        '✅ Need the money for something important',
        '✅ Risk tolerance is low',
        '✅ Odds have moved significantly in your favor',
        '❌ Small bet relative to bankroll',
        '❌ Still confident in original bet'
      ]
    };
  }
}

export default {
  ArbitrageDetector,
  HedgeCalculator
};
