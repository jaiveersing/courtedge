// Mock Betting Database - 200 Comprehensive Bets with Realistic P/L Patterns
// This data is optimized for performance charts showing growth, streaks, and variance

const generateMockBets = () => {
  const players = [
    'LeBron James', 'Stephen Curry', 'Giannis Antetokounmpo', 'Luka Doncic',
    'Nikola Jokic', 'Joel Embiid', 'Jayson Tatum', 'Kevin Durant',
    'Damian Lillard', 'Anthony Davis', 'Devin Booker', 'Trae Young',
    'Kawhi Leonard', 'Jimmy Butler', 'Paul George', 'Kyrie Irving',
    'Donovan Mitchell', 'Ja Morant', 'Zion Williamson', 'Shai Gilgeous-Alexander'
  ];

  const betTypes = ['Player Props', 'Spread', 'Moneyline', 'Over/Under', 'Parlay', '1st Half'];
  const sports = ['NBA', 'NBA', 'NBA', 'NBA', 'NBA', 'NFL', 'MLB']; // 70% NBA
  const propTypes = ['Points', 'Rebounds', 'Assists', '3PT Made', 'Blocks', 'Steals', 'PTS+REB', 'PTS+AST'];

  const bets = [];
  let cumulativeProfit = 0;
  let winStreak = 0;
  let loseStreak = 0;

  // Generate 200 bets spanning 6 months with realistic patterns
  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor((i / 200) * 180); // Spread over 6 months
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Stake varies realistically (more aggressive when winning, cautious when losing)
    let stake;
    if (cumulativeProfit > 500) {
      stake = Math.floor(Math.random() * 100 + 50); // $50-$150 when winning
    } else if (cumulativeProfit < -200) {
      stake = Math.floor(Math.random() * 50 + 25); // $25-$75 when losing
    } else {
      stake = Math.floor(Math.random() * 80 + 40); // $40-$120 normal
    }

    // Realistic odds distribution
    const oddsPool = [1.75, 1.80, 1.85, 1.90, 1.91, 1.95, 2.00, 2.05, 2.10, 2.15, 2.20, 2.25, 2.30, 2.50, 2.75, 3.00];
    const odds = oddsPool[Math.floor(Math.random() * oddsPool.length)];

    // Win rate: ~58% overall with streaks
    let result;
    let winProbability = 0.58; // Base 58% win rate
    
    // Adjust for streaks (momentum)
    if (winStreak >= 3) winProbability = 0.65; // Hot streak
    if (loseStreak >= 3) winProbability = 0.52; // Cold streak
    
    // Higher odds = lower win probability (realistic)
    if (odds >= 2.50) winProbability -= 0.10;
    if (odds >= 3.00) winProbability -= 0.15;
    
    result = Math.random() < winProbability ? 'win' : 'loss';

    // Update streaks
    if (result === 'win') {
      winStreak++;
      loseStreak = 0;
    } else {
      loseStreak++;
      winStreak = 0;
    }

    // Calculate profit
    let profit;
    if (result === 'win') {
      profit = stake * (odds - 1); // Profit = stake × (odds - 1)
    } else {
      profit = -stake;
    }

    cumulativeProfit += profit;

    const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const player = players[Math.floor(Math.random() * players.length)];
    const propType = propTypes[Math.floor(Math.random() * propTypes.length)];

    bets.push({
      id: i + 1,
      date: date,
      timestamp: date,
      player: player,
      propType: propType,
      stake: stake,
      amount: stake, // Duplicate for compatibility
      odds: odds,
      result: result,
      profit: parseFloat(profit.toFixed(2)),
      potentialPayout: result === 'win' ? parseFloat((stake * odds).toFixed(2)) : 0,
      betType: betType,
      sport: sport,
      description: `${player} ${propType} ${betType}`,
      cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      winStreak: winStreak,
      loseStreak: loseStreak,
      // Additional metadata
      bookmaker: ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet'][Math.floor(Math.random() * 5)],
      settled: true,
      settledAt: new Date(date.getTime() + Math.random() * 4 * 60 * 60 * 1000) // Settled 0-4 hours later
    });
  }

  // Reverse to get chronological order (oldest first)
  return bets.reverse();
};

// Generate the database
export const mockBetsDatabase = generateMockBets();

// Summary statistics
export const getDatabaseStats = () => {
  const wins = mockBetsDatabase.filter(b => b.result === 'win').length;
  const losses = mockBetsDatabase.filter(b => b.result === 'loss').length;
  const totalStaked = mockBetsDatabase.reduce((sum, b) => sum + b.stake, 0);
  const totalProfit = mockBetsDatabase.reduce((sum, b) => sum + b.profit, 0);
  const finalProfit = mockBetsDatabase[mockBetsDatabase.length - 1].cumulativeProfit;

  return {
    totalBets: mockBetsDatabase.length,
    wins: wins,
    losses: losses,
    winRate: ((wins / (wins + losses)) * 100).toFixed(2),
    totalStaked: totalStaked.toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    finalCumulativeProfit: finalProfit.toFixed(2),
    roi: ((totalProfit / totalStaked) * 100).toFixed(2),
    avgStake: (totalStaked / mockBetsDatabase.length).toFixed(2),
    avgOdds: (mockBetsDatabase.reduce((sum, b) => sum + b.odds, 0) / mockBetsDatabase.length).toFixed(2),
    biggestWin: Math.max(...mockBetsDatabase.map(b => b.profit)).toFixed(2),
    biggestLoss: Math.min(...mockBetsDatabase.map(b => b.profit)).toFixed(2),
    longestWinStreak: Math.max(...mockBetsDatabase.map(b => b.winStreak)),
    longestLoseStreak: Math.max(...mockBetsDatabase.map(b => b.loseStreak)),
  };
};

// Filter helpers
export const getBetsByTimeRange = (days) => {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return mockBetsDatabase.filter(bet => bet.date >= cutoff);
};

export const getBetsBySport = (sport) => {
  return mockBetsDatabase.filter(bet => bet.sport === sport);
};

export const getBetsByType = (betType) => {
  return mockBetsDatabase.filter(bet => bet.betType === betType);
};

export const getWinningBets = () => {
  return mockBetsDatabase.filter(bet => bet.result === 'win');
};

export const getLosingBets = () => {
  return mockBetsDatabase.filter(bet => bet.result === 'loss');
};

// Performance analysis
export const getMonthlyPerformance = () => {
  const monthly = {};
  
  mockBetsDatabase.forEach(bet => {
    const monthKey = `${bet.date.getFullYear()}-${String(bet.date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthly[monthKey]) {
      monthly[monthKey] = {
        month: monthKey,
        bets: 0,
        wins: 0,
        losses: 0,
        profit: 0,
        staked: 0
      };
    }
    
    monthly[monthKey].bets++;
    monthly[monthKey].staked += bet.stake;
    monthly[monthKey].profit += bet.profit;
    if (bet.result === 'win') monthly[monthKey].wins++;
    if (bet.result === 'loss') monthly[monthKey].losses++;
  });
  
  return Object.values(monthly).map(m => ({
    ...m,
    winRate: ((m.wins / m.bets) * 100).toFixed(1),
    roi: ((m.profit / m.staked) * 100).toFixed(1)
  }));
};

// Best performing bet types
export const getBestBetTypes = () => {
  const byType = {};
  
  mockBetsDatabase.forEach(bet => {
    if (!byType[bet.betType]) {
      byType[bet.betType] = {
        type: bet.betType,
        bets: 0,
        wins: 0,
        profit: 0,
        staked: 0
      };
    }
    
    byType[bet.betType].bets++;
    byType[bet.betType].staked += bet.stake;
    byType[bet.betType].profit += bet.profit;
    if (bet.result === 'win') byType[bet.betType].wins++;
  });
  
  return Object.values(byType)
    .map(t => ({
      ...t,
      winRate: ((t.wins / t.bets) * 100).toFixed(1),
      roi: ((t.profit / t.staked) * 100).toFixed(1)
    }))
    .sort((a, b) => b.profit - a.profit);
};

export default mockBetsDatabase;
