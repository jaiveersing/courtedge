// Mock data generator for development/demo without Base44 API
// Generates realistic betting, prediction, player, and game data
import espnApi from './espnApi';

const NBA_TEAMS = [
  'LAL', 'BOS', 'GSW', 'MIA', 'DEN', 'PHX', 'DAL', 'BKN', 'MEM', 'SAC',
  'PHI', 'MIL', 'LAC', 'NYK', 'CHI', 'ATL', 'CLE', 'TOR', 'MIN', 'NOP',
  'POR', 'OKC', 'IND', 'UTA', 'WAS', 'CHA', 'SAS', 'DET', 'HOU', 'ORL'
];

const REAL_PLAYERS = [
  'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Nikola Jokic',
  'Luka Doncic', 'Joel Embiid', 'Jayson Tatum', 'Damian Lillard', 'Anthony Davis',
  'Kawhi Leonard', 'Jimmy Butler', 'Paul George', 'Devin Booker', 'Donovan Mitchell',
  'Trae Young', 'Ja Morant', 'Zion Williamson', 'Karl-Anthony Towns', 'Bam Adebayo'
];

const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
const statTypes = ['Points', 'Rebounds', 'Assists', 'Blocks', 'Steals', 'Touchdowns', 'Passing Yards', 'Home Runs'];

function randomDate(daysBack = 60) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Real NBA player data cache
let realPlayersCache = null;
let realGamesCache = null;

export async function loadRealNBAData() {
  if (!realPlayersCache) {
    try {
      console.log('🏀 Loading real NBA player data from ESPN...');
      realPlayersCache = await espnApi.getAllPlayersWithStats();
      console.log(`✅ Loaded ${realPlayersCache.length} real NBA players from ESPN`);
    } catch (error) {
      console.error('Error loading NBA players from ESPN:', error);
      realPlayersCache = [];
    }
  }
  
  if (!realGamesCache) {
    try {
      console.log('🏀 Loading live NBA games from ESPN...');
      realGamesCache = await espnApi.getLiveGames();
      console.log(`✅ Loaded ${realGamesCache.length} games from ESPN`);
    } catch (error) {
      console.error('Error loading NBA games from ESPN:', error);
      realGamesCache = [];
    }
  }
  
  return { players: realPlayersCache, games: realGamesCache };
}

function generatePredictions(count = 15) {
  const predictions = [];
  for (let i = 0; i < count; i++) {
    const confidence = Math.round(Math.random() * 40 + 50); // 50-90%
    const isWin = Math.random() > 0.3; // 70% win rate for demo
    const player = randomElement(REAL_PLAYERS);
    const team = randomElement(NBA_TEAMS);
    const awayTeam = randomElement(NBA_TEAMS.filter(t => t !== team));
    
    predictions.push({
      id: `pred_${i + 1}`,
      playerName: player,
      team: team,
      stat: randomElement(['Points', 'Rebounds', 'Assists', 'Blocks', 'Steals']),
      line: Math.round(Math.random() * 30 + 10),
      overUnder: Math.random() > 0.5 ? 'OVER' : 'UNDER',
      odds: parseFloat((Math.random() * 0.5 - 1.15).toFixed(2)),
      confidence: confidence,
      result: isWin ? 'WIN' : 'LOSS',
      roi: isWin ? Math.round(Math.random() * 25 + 5) : Math.round(Math.random() * -20 - 5),
      createdAt: randomDate(),
      game: `${awayTeam} @ ${team}`,
      away_team: awayTeam,
      home_team: team,
      sport: 'NBA',
      game_date: randomDate(7),
      confidence_score: confidence,
      confidence_interval_low: parseFloat((Math.random() * 30 + 10).toFixed(1)),
      confidence_interval_high: parseFloat((Math.random() * 30 + 40).toFixed(1)),
      prediction_uncertainty: parseFloat((Math.random() * 5 + 2).toFixed(2)),
      spread_prediction: (Math.random() * 10 - 5).toFixed(1),
      total_prediction: Math.round(Math.random() * 20 + 210),
      value_bets: [{
        description: `${player} ${randomElement(['Points', 'Rebounds', 'Assists'])} O/U`,
        edge_percentage: (Math.random() * 15 + 5).toFixed(1),
        best_available_odds: -110,
        sportsbook: randomElement(['DraftKings', 'FanDuel', 'BetMGM', 'Caesars'])
      }],
      analysis: 'Strong matchup data suggests high probability of cover based on historical performance and recent form.'
    });
  }
  return predictions;
}

function generateBets(count = 20) {
  const bets = [];
  for (let i = 0; i < count; i++) {
    const stake = Math.round(Math.random() * 200 + 25);
    const odds = parseFloat((Math.random() * 2 + 1).toFixed(2));
    const isWin = Math.random() > 0.45; // ~55% win rate
    const payout = isWin ? Math.round(stake * odds) : 0;
    const profit = payout - stake;

    bets.push({
      id: `bet_${i + 1}`,
      date: randomDate(),
      type: randomElement(['Moneyline', 'Spread', 'Over/Under', 'Parlay', 'Props']),
      teams: `${randomElement(teams)} vs ${randomElement(teams)}`,
      description: `${randomElement(teams)} ${randomElement(['to win', 'spread -7.5', 'over 210.5'])}`,
      odds: odds,
      stake: stake,
      potential: Math.round(stake * odds),
      result: isWin ? 'WIN' : 'LOSS',
      payout: payout,
      profit: profit,
      roi: parseFloat(((profit / stake) * 100).toFixed(1)),
      sport: randomElement(sports),
      sportsbook: randomElement(['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet']),
      status: Math.random() > 0.1 ? 'Settled' : 'Pending'
    });
  }
  return bets;
}

function generateBankroll() {
  return {
    id: 'bankroll_1',
    totalBalance: 5250,
    initialBankroll: 5000,
    profit: 250,
    roi: 5.0,
    dailyLimit: 500,
    weeklyLimit: 2000,
    monthlyLimit: 5000,
    daysActive: 180,
    totalBets: 342,
    winRate: 0.56,
    averageOdds: 1.85,
    largestWin: 850,
    largestLoss: -320,
    currency: 'USD',
    riskManagement: {
      kellyFraction: 0.25,
      maxWagerPercent: 5,
      minOdds: 1.5
    }
  };
}

function generatePlayers(count = 10) {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push({
      id: `player_${i + 1}`,
      name: `Player ${Math.floor(Math.random() * 500) + 1}`,
      team: randomElement(teams),
      position: randomElement(['PG', 'SG', 'SF', 'PF', 'C', 'QB', 'RB', 'WR']),
      number: Math.floor(Math.random() * 99) + 1,
      height: `${Math.floor(Math.random() * 2) + 6}'${Math.floor(Math.random() * 12)}"`,
      weight: Math.floor(Math.random() * 100 + 180),
      stats: {
        pointsPerGame: parseFloat((Math.random() * 20 + 10).toFixed(1)),
        reboundsPerGame: parseFloat((Math.random() * 10 + 3).toFixed(1)),
        assistsPerGame: parseFloat((Math.random() * 5 + 2).toFixed(1)),
        fieldGoalPercent: parseFloat((Math.random() * 0.15 + 0.40).toFixed(2)),
        threePointPercent: parseFloat((Math.random() * 0.10 + 0.30).toFixed(2))
      },
      injuryStatus: Math.random() > 0.85 ? 'Out' : 'Healthy',
      lastGame: randomDate(7)
    });
  }
  return players;
}

function generateGames(count = 12) {
  const games = [];
  for (let i = 0; i < count; i++) {
    const homeTeam = randomElement(teams);
    const awayTeam = randomElement(teams.filter(t => t !== homeTeam));
    const homeScore = Math.floor(Math.random() * 50 + 90);
    const awayScore = Math.floor(Math.random() * 50 + 90);

    games.push({
      id: `game_${i + 1}`,
      date: randomDate(30),
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      sport: randomElement(sports),
      homeScore: homeScore,
      awayScore: awayScore,
      status: Math.random() > 0.3 ? 'Final' : 'Scheduled',
      homeSpread: parseFloat((Math.random() * 7 - 3.5).toFixed(1)),
      overUnder: Math.floor(Math.random() * 30 + 200),
      homeMoneyline: Math.floor(Math.random() * 200 - 110),
      awayMoneyline: Math.floor(Math.random() * 200 + 110),
      quarter: Math.floor(Math.random() * 4) + 1,
      timeRemaining: `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60)}`
    });
  }
  return games;
}

function generateStats() {
  return {
    totalBets: 342,
    winRate: 0.56,
    roiPercent: 12.5,
    profitLoss: 3420,
    averageOdds: 1.85,
    winStreak: 4,
    lossStreak: 2,
    longestWinStreak: 8,
    longestLossStreak: 3,
    standardDeviation: 145.32,
    sharpeRatio: 1.42,
    sortino: 1.89
  };
}

export const mockData = {
  generatePredictions,
  generateBets,
  generateBankroll,
  generatePlayers,
  generateGames,
  generateStats
};

// Helper to simulate API response structure
export async function generateMockEntities(entityName, count = 10) {
  // For PlayerSeasonStats, use real NBA data
  if (entityName === 'PlayerSeasonStats') {
    if (!realPlayersCache) {
      await loadRealNBAData();
    }
    return { 
      rows: realPlayersCache || [], 
      total: realPlayersCache?.length || 0 
    };
  }

  const generators = {
    Prediction: () => ({ rows: generatePredictions(count), total: count }),
    Bet: () => ({ rows: generateBets(count), total: count }),
    Bankroll: () => ({ rows: [generateBankroll()], total: 1 }),
    Player: () => ({ rows: generatePlayers(count), total: count }),
    PlayerGameLog: () => ({ rows: [], total: 0 }),
    Game: () => ({ rows: generateGames(count), total: count }),
    Stats: () => ({ rows: [generateStats()], total: 1 })
  };

  if (generators[entityName]) {
    return generators[entityName]();
  }
  return { rows: [], total: 0 };
}

export default mockData;
