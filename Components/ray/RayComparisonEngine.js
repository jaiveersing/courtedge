// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  ⚔️ RAY COMPARISON ENGINE v2.0 - HEAD-TO-HEAD ANALYTICS POWERHOUSE            ║
// ║  Player vs Player • Multi-Player Rankings • Fantasy Draft Aid • Trade Value   ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

import rayAnalytics, { PLAYERS_DB, TEAMS_DB } from './RayAnalyticsEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 STAT WEIGHTS FOR OVERALL SCORING
// ═══════════════════════════════════════════════════════════════════════════════
const STAT_WEIGHTS = {
  pts: 1.0,
  reb: 1.2,
  ast: 1.5,
  stl: 3.0,
  blk: 3.0,
  fg_pct: 0.5,
  ft_pct: 0.3,
  threes: 1.0,
  efficiency: 1.0,
  consistency: 1.5
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 POSITION RANKINGS
// ═══════════════════════════════════════════════════════════════════════════════
const POSITION_GROUPS = {
  PG: ["Stephen Curry", "Tyrese Haliburton", "Trae Young", "Ja Morant", "Shai Gilgeous-Alexander"],
  SG: ["Devin Booker", "Donovan Mitchell", "Anthony Edwards"],
  SF: ["LeBron James", "Jayson Tatum", "Kevin Durant", "Jimmy Butler", "Paolo Banchero"],
  PF: ["Giannis Antetokounmpo", "Anthony Davis"],
  C: ["Nikola Jokic", "Joel Embiid"],
  G: ["Stephen Curry", "Luka Doncic", "Tyrese Haliburton", "Trae Young", "Ja Morant", "Shai Gilgeous-Alexander", "Devin Booker", "Donovan Mitchell"],
  F: ["LeBron James", "Jayson Tatum", "Kevin Durant", "Jimmy Butler", "Paolo Banchero", "Giannis Antetokounmpo", "Anthony Davis"]
};

// ═══════════════════════════════════════════════════════════════════════════════
// ⚔️ COMPARISON ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class RayComparisonEngine {
  constructor() {
    this.weights = STAT_WEIGHTS;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calculate overall player score
  // ─────────────────────────────────────────────────────────────────────────────
  calculatePlayerScore(player, timeframe = 'season') {
    const stats = player[timeframe] || player.season;
    
    let score = 0;
    score += (stats.pts || 0) * this.weights.pts;
    score += (stats.reb || 0) * this.weights.reb;
    score += (stats.ast || 0) * this.weights.ast;
    score += (stats.stl || 0) * this.weights.stl;
    score += (stats.blk || 0) * this.weights.blk;
    score += (stats.fg_pct || 0) * this.weights.fg_pct;
    score += (stats.threes || 0) * this.weights.threes;

    // Add consistency bonus
    const consistency = rayAnalytics.calculateConsistency(player);
    score += (consistency.overallConsistency / 100) * 10 * this.weights.consistency;

    return Math.round(score * 10) / 10;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Compare two players head-to-head
  // ─────────────────────────────────────────────────────────────────────────────
  compareHeadToHead(player1Name, player2Name, timeframe = 'season') {
    const p1 = rayAnalytics.findPlayer(player1Name);
    const p2 = rayAnalytics.findPlayer(player2Name);

    if (!p1 || !p2) {
      return {
        error: true,
        message: `Could not find one or both players: ${player1Name}, ${player2Name}`
      };
    }

    const p1Stats = p1[timeframe] || p1.season;
    const p2Stats = p2[timeframe] || p2.season;

    const categories = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg_pct', 'threes'];
    const comparison = {};
    let p1Wins = 0, p2Wins = 0;

    for (const cat of categories) {
      const p1Val = p1Stats[cat] || 0;
      const p2Val = p2Stats[cat] || 0;
      const diff = p1Val - p2Val;
      const winner = diff > 0 ? p1.name : diff < 0 ? p2.name : 'Tie';

      if (winner === p1.name) p1Wins++;
      else if (winner === p2.name) p2Wins++;

      comparison[cat] = {
        [p1.name]: p1Val,
        [p2.name]: p2Val,
        difference: Math.abs(diff).toFixed(1),
        winner,
        advantage: diff > 0 ? `+${diff.toFixed(1)}` : diff < 0 ? diff.toFixed(1) : '0'
      };
    }

    // Overall scores
    const p1Score = this.calculatePlayerScore(p1, timeframe);
    const p2Score = this.calculatePlayerScore(p2, timeframe);

    // Trend analysis
    const p1Trend = rayAnalytics.calculateTrend(p1);
    const p2Trend = rayAnalytics.calculateTrend(p2);

    // Consistency
    const p1Consistency = rayAnalytics.calculateConsistency(p1);
    const p2Consistency = rayAnalytics.calculateConsistency(p2);

    // Determine overall winner
    const overallWinner = p1Wins > p2Wins ? p1.name : p2Wins > p1Wins ? p2.name : 'Too close to call';
    const scoreDiff = Math.abs(p1Score - p2Score);
    const dominance = scoreDiff > 20 ? 'Dominant' : scoreDiff > 10 ? 'Clear' : scoreDiff > 5 ? 'Slight' : 'Negligible';

    return {
      player1: {
        name: p1.name,
        team: p1.team,
        position: p1.position,
        stats: p1Stats,
        overallScore: p1Score,
        categoriesWon: p1Wins,
        trend: p1Trend,
        consistency: p1Consistency.overallConsistency
      },
      player2: {
        name: p2.name,
        team: p2.team,
        position: p2.position,
        stats: p2Stats,
        overallScore: p2Score,
        categoriesWon: p2Wins,
        trend: p2Trend,
        consistency: p2Consistency.overallConsistency
      },
      comparison,
      timeframe,
      overallWinner,
      dominance,
      verdict: this.generateVerdict(p1, p2, comparison, p1Score, p2Score, p1Trend, p2Trend)
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Generate detailed verdict
  // ─────────────────────────────────────────────────────────────────────────────
  generateVerdict(p1, p2, comparison, p1Score, p2Score, p1Trend, p2Trend) {
    const lines = [];
    const winner = p1Score > p2Score ? p1 : p2;
    const loser = p1Score > p2Score ? p2 : p1;
    const scoreDiff = Math.abs(p1Score - p2Score);

    // Overall assessment
    if (scoreDiff < 5) {
      lines.push(`🤝 This is incredibly close! ${p1.name} and ${p2.name} are virtually identical in overall value.`);
    } else if (scoreDiff < 15) {
      lines.push(`⚔️ ${winner.name} edges out ${loser.name}, but it's competitive.`);
    } else {
      lines.push(`🏆 ${winner.name} is clearly the superior player right now, outscoring ${loser.name} by ${scoreDiff.toFixed(1)} points.`);
    }

    // Specific advantages
    if (comparison.pts.winner === p1.name) {
      lines.push(`🔥 ${p1.name} is the better scorer (+${comparison.pts.difference} PPG).`);
    } else if (comparison.pts.winner === p2.name) {
      lines.push(`🔥 ${p2.name} is the better scorer (+${comparison.pts.difference} PPG).`);
    }

    if (comparison.ast.winner !== 'Tie') {
      const astWinner = comparison.ast.winner;
      lines.push(`🎯 ${astWinner} is the better playmaker (+${comparison.ast.difference} APG).`);
    }

    if (comparison.reb.winner !== 'Tie') {
      const rebWinner = comparison.reb.winner;
      lines.push(`🏀 ${rebWinner} controls the glass (+${comparison.reb.difference} RPG).`);
    }

    // Trend comparison
    if (p1Trend.direction === 'up' && p2Trend.direction === 'down') {
      lines.push(`📈 ${p1.name} is trending UP while ${p2.name} is cooling off — momentum favors ${p1.name}.`);
    } else if (p2Trend.direction === 'up' && p1Trend.direction === 'down') {
      lines.push(`📈 ${p2.name} is trending UP while ${p1.name} is cooling off — momentum favors ${p2.name}.`);
    } else if (p1Trend.direction === 'up' && p2Trend.direction === 'up') {
      lines.push(`📈 Both players are on fire right now!`);
    }

    // Fantasy/betting recommendation
    lines.push(`\n💰 BETTING TIP: If both have similar props, lean ${winner.name} — better overall production.`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rank players by specific stat
  // ─────────────────────────────────────────────────────────────────────────────
  rankBystat(stat, timeframe = 'season', limit = 10) {
    const rankings = [];

    for (const [name, player] of Object.entries(PLAYERS_DB)) {
      const stats = player[timeframe] || player.season;
      const value = stats[stat] || 0;

      rankings.push({
        rank: 0,
        name,
        team: player.team,
        position: player.position,
        value: value,
        displayValue: stat.includes('pct') ? (value * 100).toFixed(1) + '%' : value.toFixed(1)
      });
    }

    rankings.sort((a, b) => b.value - a.value);
    rankings.forEach((p, i) => p.rank = i + 1);

    return {
      stat,
      timeframe,
      leaderboard: rankings.slice(0, limit),
      leader: rankings[0],
      summary: `${rankings[0].name} leads the league in ${stat.toUpperCase()} with ${rankings[0].displayValue}`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Overall player rankings
  // ─────────────────────────────────────────────────────────────────────────────
  getOverallRankings(timeframe = 'season', limit = 15) {
    const rankings = [];

    for (const [name, player] of Object.entries(PLAYERS_DB)) {
      const score = this.calculatePlayerScore(player, timeframe);
      const consistency = rayAnalytics.calculateConsistency(player);
      const trend = rayAnalytics.calculateTrend(player);

      rankings.push({
        rank: 0,
        name,
        team: player.team,
        position: player.position,
        overallScore: score,
        pts: player[timeframe]?.pts || player.season.pts,
        reb: player[timeframe]?.reb || player.season.reb,
        ast: player[timeframe]?.ast || player.season.ast,
        consistency: consistency.overallConsistency,
        trend: trend.direction,
        tier: ''
      });
    }

    rankings.sort((a, b) => b.overallScore - a.overallScore);
    
    // Assign ranks and tiers
    rankings.forEach((p, i) => {
      p.rank = i + 1;
      if (i < 3) p.tier = 'MVP';
      else if (i < 8) p.tier = 'All-NBA';
      else if (i < 15) p.tier = 'All-Star';
      else p.tier = 'Starter';
    });

    return {
      timeframe,
      rankings: rankings.slice(0, limit),
      mvpRace: rankings.slice(0, 3),
      risingStars: rankings.filter(p => p.trend === 'up').slice(0, 5),
      mostConsistent: rankings.sort((a, b) => b.consistency - a.consistency).slice(0, 5),
      summary: `Top 3 MVP Candidates: ${rankings[0].name}, ${rankings[1].name}, ${rankings[2].name}`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Position-based rankings
  // ─────────────────────────────────────────────────────────────────────────────
  getPositionRankings(position = 'PG', timeframe = 'season') {
    const positionPlayers = POSITION_GROUPS[position.toUpperCase()] || [];
    const rankings = [];

    for (const name of positionPlayers) {
      const player = PLAYERS_DB[name];
      if (!player) continue;

      const score = this.calculatePlayerScore(player, timeframe);
      const stats = player[timeframe] || player.season;

      rankings.push({
        rank: 0,
        name,
        team: player.team,
        score,
        pts: stats.pts,
        reb: stats.reb,
        ast: stats.ast
      });
    }

    rankings.sort((a, b) => b.score - a.score);
    rankings.forEach((p, i) => p.rank = i + 1);

    return {
      position,
      timeframe,
      rankings,
      leader: rankings[0],
      summary: `Best ${position}: ${rankings[0]?.name || 'N/A'} (${rankings[0]?.score || 0} overall score)`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Fantasy value comparison
  // ─────────────────────────────────────────────────────────────────────────────
  fantasyValueComparison(player1Name, player2Name) {
    const p1 = rayAnalytics.findPlayer(player1Name);
    const p2 = rayAnalytics.findPlayer(player2Name);

    if (!p1 || !p2) return null;

    const p1Fantasy = rayAnalytics.getFantasyAnalysis().find(f => f.name === p1.name);
    const p2Fantasy = rayAnalytics.getFantasyAnalysis().find(f => f.name === p2.name);

    const p1Proj = p1.fantasyProjections;
    const p2Proj = p2.fantasyProjections;

    return {
      player1: {
        name: p1.name,
        team: p1.team,
        fppg: p1Proj.dkProjection,
        projections: p1Proj,
        ros: p1Fantasy?.recommendation || 'N/A',
        rank: p1Fantasy?.fantasyRank || 'N/A'
      },
      player2: {
        name: p2.name,
        team: p2.team,
        fppg: p2Proj.dkProjection,
        projections: p2Proj,
        ros: p2Fantasy?.recommendation || 'N/A',
        rank: p2Fantasy?.fantasyRank || 'N/A'
      },
      fantasyWinner: p1Proj.dkProjection > p2Proj.dkProjection ? p1.name : p2.name,
      recommendation: this.generateFantasyRec(p1, p2, p1Proj, p2Proj)
    };
  }

  generateFantasyRec(p1, p2, p1Proj, p2Proj) {
    const diff = Math.abs(p1Proj.dkProjection - p2Proj.dkProjection);
    const winner = p1Proj.dkProjection > p2Proj.dkProjection ? p1 : p2;

    if (diff < 3) {
      return `🎯 Both are roughly equal in fantasy value. Consider matchup and recent form.`;
    } else if (diff < 10) {
      return `📈 ${winner.name} has the edge (+${diff.toFixed(1)} FPPG). Solid choice.`;
    } else {
      return `🏆 ${winner.name} is the clear fantasy pick (+${diff.toFixed(1)} FPPG). No-brainer.`;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Multi-player comparison (3+ players)
  // ─────────────────────────────────────────────────────────────────────────────
  multiPlayerCompare(playerNames, timeframe = 'season') {
    const players = [];

    for (const name of playerNames) {
      const player = rayAnalytics.findPlayer(name);
      if (player) {
        const score = this.calculatePlayerScore(player, timeframe);
        const stats = player[timeframe] || player.season;
        const trend = rayAnalytics.calculateTrend(player);

        players.push({
          name: player.name,
          team: player.team,
          position: player.position,
          overallScore: score,
          stats,
          trend: trend.direction,
          emoji: trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️'
        });
      }
    }

    players.sort((a, b) => b.overallScore - a.overallScore);
    players.forEach((p, i) => p.rank = i + 1);

    return {
      players,
      winner: players[0],
      runnerUp: players[1],
      comparison: this.generateMultiComparison(players),
      recommendation: `Top pick: ${players[0]?.name || 'N/A'} with an overall score of ${players[0]?.overallScore || 0}`
    };
  }

  generateMultiComparison(players) {
    if (players.length < 2) return 'Need at least 2 players to compare.';

    const lines = [];
    lines.push(`📊 RANKING (${players.length} players):\n`);

    for (const p of players) {
      lines.push(`${p.rank}. ${p.name} (${p.team}) — ${p.overallScore} pts ${p.emoji}`);
    }

    // Stats leader breakdown
    const ptsLeader = players.reduce((a, b) => a.stats.pts > b.stats.pts ? a : b);
    const astLeader = players.reduce((a, b) => a.stats.ast > b.stats.ast ? a : b);
    const rebLeader = players.reduce((a, b) => a.stats.reb > b.stats.reb ? a : b);

    lines.push(`\n📌 Category Leaders:`);
    lines.push(`• Scoring: ${ptsLeader.name} (${ptsLeader.stats.pts} PPG)`);
    lines.push(`• Assists: ${astLeader.name} (${astLeader.stats.ast} APG)`);
    lines.push(`• Rebounds: ${rebLeader.name} (${rebLeader.stats.reb} RPG)`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Who should I start? (Fantasy decision aid)
  // ─────────────────────────────────────────────────────────────────────────────
  whoShouldIStart(playerNames, opponent = null) {
    const evaluations = [];

    for (const name of playerNames) {
      const player = rayAnalytics.findPlayer(name);
      if (!player) continue;

      const score = this.calculatePlayerScore(player, 'last5'); // Recent form matters
      const trend = rayAnalytics.calculateTrend(player);
      const consistency = rayAnalytics.calculateConsistency(player);
      
      let matchupBonus = 0;
      if (opponent) {
        const matchup = player.vsTeam?.[opponent];
        if (matchup) {
          matchupBonus = matchup.pts > player.season.pts ? 5 : -3;
        }
      }

      const injury = player.injuries;
      const injuryPenalty = injury.status !== 'healthy' ? -10 : 0;

      evaluations.push({
        name: player.name,
        team: player.team,
        recentScore: score,
        trend: trend.direction,
        trendEmoji: trend.direction === 'up' ? '🔥' : trend.direction === 'down' ? '❄️' : '➡️',
        consistency: consistency.overallConsistency,
        matchupBonus,
        injuryStatus: injury.status,
        injuryPenalty,
        totalScore: score + matchupBonus + injuryPenalty + (consistency.overallConsistency / 10)
      });
    }

    evaluations.sort((a, b) => b.totalScore - a.totalScore);
    const recommendation = evaluations[0];

    return {
      evaluations,
      start: recommendation,
      sit: evaluations[evaluations.length - 1],
      reasoning: this.generateStartSitReasoning(evaluations, opponent)
    };
  }

  generateStartSitReasoning(evaluations, opponent) {
    const start = evaluations[0];
    const sit = evaluations[evaluations.length - 1];

    const lines = [];
    lines.push(`✅ START: ${start.name} ${start.trendEmoji}`);
    lines.push(`• Recent form: ${start.recentScore.toFixed(1)} score`);
    lines.push(`• Consistency: ${start.consistency}%`);
    if (start.matchupBonus > 0) lines.push(`• Good matchup vs ${opponent}`);
    if (start.injuryStatus !== 'healthy') lines.push(`⚠️ Injury: ${start.injuryStatus}`);

    lines.push(`\n❌ SIT: ${sit.name}`);
    if (sit.trend === 'down') lines.push(`• Trending down lately`);
    if (sit.matchupBonus < 0) lines.push(`• Tough matchup vs ${opponent}`);
    if (sit.injuryStatus !== 'healthy') lines.push(`⚠️ Injury concern: ${sit.injuryStatus}`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Trade value analyzer
  // ─────────────────────────────────────────────────────────────────────────────
  tradeValueAnalyzer(giving, receiving) {
    const givingPlayers = giving.map(n => rayAnalytics.findPlayer(n)).filter(Boolean);
    const receivingPlayers = receiving.map(n => rayAnalytics.findPlayer(n)).filter(Boolean);

    const givingValue = givingPlayers.reduce((sum, p) => sum + this.calculatePlayerScore(p), 0);
    const receivingValue = receivingPlayers.reduce((sum, p) => sum + this.calculatePlayerScore(p), 0);

    const difference = receivingValue - givingValue;
    const percentDiff = (difference / givingValue) * 100;

    let verdict = '';
    if (Math.abs(percentDiff) < 5) {
      verdict = '🤝 FAIR TRADE — Both sides roughly equal';
    } else if (percentDiff > 15) {
      verdict = '🏆 SMASH ACCEPT — You\'re winning big!';
    } else if (percentDiff > 5) {
      verdict = '👍 GOOD TRADE — Slight advantage for you';
    } else if (percentDiff < -15) {
      verdict = '🚫 REJECT — You\'re getting fleeced';
    } else {
      verdict = '⚠️ RISKY — You\'re giving up more value';
    }

    return {
      giving: {
        players: givingPlayers.map(p => ({ name: p.name, team: p.team, score: this.calculatePlayerScore(p) })),
        totalValue: givingValue.toFixed(1)
      },
      receiving: {
        players: receivingPlayers.map(p => ({ name: p.name, team: p.team, score: this.calculatePlayerScore(p) })),
        totalValue: receivingValue.toFixed(1)
      },
      valueDifference: difference.toFixed(1),
      percentDifference: percentDiff.toFixed(1) + '%',
      verdict,
      recommendation: percentDiff > 0 
        ? `Accept the trade! You gain +${difference.toFixed(1)} in value.`
        : `Consider declining — you lose ${Math.abs(difference).toFixed(1)} in value.`
    };
  }
}

// Export singleton instance
const rayComparisonEngine = new RayComparisonEngine();
export default rayComparisonEngine;
