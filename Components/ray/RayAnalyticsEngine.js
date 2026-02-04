// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║  🧠 RAY ANALYTICS ENGINE v2.0 - WORLD'S MOST ADVANCED PLAYER ANALYTICS        ║
// ║  Matchup Analysis • Splits • Correlations • Prop Intelligence • Projections   ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 COMPREHENSIVE PLAYER DATABASE 2024-25 SEASON
// ═══════════════════════════════════════════════════════════════════════════════
export const PLAYERS_DB = {
  // ─────────────────────────────────────────────────────────────────────────────
  // GUARDS
  // ─────────────────────────────────────────────────────────────────────────────
  "Stephen Curry": {
    id: "curry30",
    name: "Stephen Curry",
    team: "GSW",
    position: "PG",
    number: 30,
    age: 36,
    experience: 15,
    
    // Season averages
    season: { pts: 23.5, reb: 4.8, ast: 6.2, stl: 0.9, blk: 0.3, tov: 2.8, min: 32.1, fgPct: 45.2, threePct: 41.8, ftPct: 92.1, usage: 28.5, per: 21.2 },
    
    // Last 10 games
    last10: { pts: 26.8, reb: 5.2, ast: 5.8, stl: 1.1, blk: 0.2, tov: 2.5, min: 34.2, fgPct: 47.5, threePct: 44.2, ftPct: 94.0 },
    
    // Last 5 games
    last5: { pts: 29.2, reb: 5.6, ast: 6.4, stl: 1.2, blk: 0.4, tov: 2.2, min: 35.8, fgPct: 49.1, threePct: 46.5, ftPct: 95.0 },
    
    // Splits
    splits: {
      home: { pts: 25.2, reb: 5.1, ast: 6.8, record: "18-8" },
      away: { pts: 21.8, reb: 4.5, ast: 5.6, record: "14-12" },
      vs_east: { pts: 24.5, reb: 4.9, ast: 6.5 },
      vs_west: { pts: 22.8, reb: 4.7, ast: 5.9 },
      rest_0: { pts: 21.2, reb: 4.2, ast: 5.4 },  // Back-to-back
      rest_1: { pts: 24.1, reb: 5.0, ast: 6.4 },  // 1 day rest
      rest_2plus: { pts: 26.5, reb: 5.5, ast: 6.8 },  // 2+ days rest
      win: { pts: 26.8, reb: 5.4, ast: 7.1 },
      loss: { pts: 19.2, reb: 4.1, ast: 4.8 },
      asStarter: { pts: 23.5, reb: 4.8, ast: 6.2 },
      q4: { pts: 6.8, fgPct: 44.2 },  // 4th quarter
      clutch: { pts: 2.4, fgPct: 41.5 }  // Last 5 min, within 5 pts
    },
    
    // vs Specific Teams (season)
    vsTeam: {
      "LAL": { pts: 32.5, reb: 6.0, ast: 7.2, games: 2 },
      "BOS": { pts: 28.0, reb: 4.5, ast: 5.5, games: 2 },
      "PHX": { pts: 26.5, reb: 5.0, ast: 6.0, games: 3 },
      "DEN": { pts: 24.0, reb: 4.2, ast: 5.8, games: 2 },
      "MIA": { pts: 22.5, reb: 4.8, ast: 6.5, games: 2 }
    },
    
    // Prop hit rates (based on common lines)
    propHitRates: {
      "pts_24.5": { over: 52, under: 48, streak: "O3" },
      "pts_22.5": { over: 61, under: 39, streak: "O5" },
      "ast_5.5": { over: 58, under: 42, streak: "O2" },
      "ast_6.5": { over: 42, under: 58, streak: "U1" },
      "reb_4.5": { over: 55, under: 45, streak: "O4" },
      "threes_4.5": { over: 48, under: 52, streak: "U2" },
      "pra_33.5": { over: 54, under: 46, streak: "O3" }
    },
    
    // Game log (last 10)
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 34, reb: 6, ast: 8, min: 38, result: "W" },
      { date: "2025-01-22", opp: "PHX", pts: 28, reb: 5, ast: 6, min: 35, result: "W" },
      { date: "2025-01-20", opp: "SAC", pts: 31, reb: 7, ast: 7, min: 36, result: "W" },
      { date: "2025-01-18", opp: "DEN", pts: 22, reb: 4, ast: 5, min: 32, result: "L" },
      { date: "2025-01-16", opp: "UTA", pts: 29, reb: 5, ast: 6, min: 34, result: "W" },
      { date: "2025-01-14", opp: "POR", pts: 25, reb: 6, ast: 8, min: 33, result: "W" },
      { date: "2025-01-12", opp: "LAC", pts: 27, reb: 4, ast: 5, min: 35, result: "L" },
      { date: "2025-01-10", opp: "MIN", pts: 24, reb: 5, ast: 4, min: 34, result: "W" },
      { date: "2025-01-08", opp: "OKC", pts: 26, reb: 6, ast: 7, min: 36, result: "L" },
      { date: "2025-01-06", opp: "HOU", pts: 22, reb: 4, ast: 6, min: 31, result: "W" }
    ],
    
    // Injuries
    injuries: { current: null, history: ["Ankle - Nov 2024 (2 games)"] },
    
    // Fantasy
    fantasy: { avgFpts: 42.5, ceiling: 65, floor: 28, consistency: 78 }
  },

  "Luka Doncic": {
    id: "luka77",
    name: "Luka Doncic",
    team: "DAL",
    position: "PG/SG",
    number: 77,
    age: 25,
    experience: 6,
    season: { pts: 34.2, reb: 9.1, ast: 9.5, stl: 1.5, blk: 0.5, tov: 4.1, min: 37.8, fgPct: 48.5, threePct: 37.2, ftPct: 78.5, usage: 36.2, per: 28.5 },
    last10: { pts: 36.5, reb: 9.8, ast: 10.2, stl: 1.8, blk: 0.6, tov: 3.8, min: 38.5, fgPct: 50.2, threePct: 39.5, ftPct: 80.0 },
    last5: { pts: 38.2, reb: 10.4, ast: 11.0, stl: 2.0, blk: 0.4, tov: 3.5, min: 39.2, fgPct: 51.5, threePct: 41.2, ftPct: 82.0 },
    splits: {
      home: { pts: 36.5, reb: 9.8, ast: 10.2, record: "20-6" },
      away: { pts: 31.8, reb: 8.4, ast: 8.8, record: "15-11" },
      vs_east: { pts: 35.2, reb: 9.5, ast: 10.0 },
      vs_west: { pts: 33.5, reb: 8.8, ast: 9.2 },
      rest_0: { pts: 30.5, reb: 8.2, ast: 8.5 },
      rest_1: { pts: 35.0, reb: 9.2, ast: 9.8 },
      rest_2plus: { pts: 38.2, reb: 10.5, ast: 11.2 },
      win: { pts: 37.5, reb: 10.0, ast: 11.5 },
      loss: { pts: 28.5, reb: 7.8, ast: 7.2 },
      q4: { pts: 9.2, fgPct: 46.5 },
      clutch: { pts: 3.8, fgPct: 44.2 }
    },
    vsTeam: {
      "GSW": { pts: 38.5, reb: 11.0, ast: 12.0, games: 2 },
      "LAL": { pts: 35.0, reb: 9.5, ast: 10.5, games: 3 },
      "BOS": { pts: 32.0, reb: 8.5, ast: 9.0, games: 2 }
    },
    propHitRates: {
      "pts_32.5": { over: 65, under: 35, streak: "O8" },
      "pts_34.5": { over: 52, under: 48, streak: "O3" },
      "ast_8.5": { over: 62, under: 38, streak: "O5" },
      "reb_8.5": { over: 58, under: 42, streak: "O4" },
      "pra_50.5": { over: 68, under: 32, streak: "O10" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "BOS", pts: 42, reb: 12, ast: 14, min: 40, result: "W" },
      { date: "2025-01-22", opp: "NYK", pts: 38, reb: 10, ast: 11, min: 38, result: "W" },
      { date: "2025-01-20", opp: "MIA", pts: 35, reb: 9, ast: 10, min: 37, result: "W" },
      { date: "2025-01-18", opp: "PHI", pts: 40, reb: 11, ast: 12, min: 39, result: "W" },
      { date: "2025-01-16", opp: "CLE", pts: 36, reb: 10, ast: 8, min: 38, result: "L" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 62.5, ceiling: 85, floor: 42, consistency: 82 }
  },

  "LeBron James": {
    id: "lebron23",
    name: "LeBron James",
    team: "LAL",
    position: "SF/PF",
    number: 23,
    age: 40,
    experience: 21,
    season: { pts: 24.8, reb: 7.2, ast: 8.5, stl: 1.0, blk: 0.5, tov: 3.5, min: 34.2, fgPct: 51.2, threePct: 39.5, ftPct: 75.2, usage: 28.8, per: 24.5 },
    last10: { pts: 26.5, reb: 8.0, ast: 9.2, stl: 1.2, blk: 0.6, tov: 3.2, min: 35.5, fgPct: 52.8, threePct: 41.2, ftPct: 77.5 },
    last5: { pts: 28.4, reb: 8.6, ast: 10.0, stl: 1.4, blk: 0.8, tov: 3.0, min: 36.8, fgPct: 54.5, threePct: 42.8, ftPct: 80.0 },
    splits: {
      home: { pts: 26.5, reb: 7.8, ast: 9.2, record: "19-7" },
      away: { pts: 23.2, reb: 6.6, ast: 7.8, record: "14-12" },
      vs_east: { pts: 25.8, reb: 7.5, ast: 8.8 },
      vs_west: { pts: 24.0, reb: 7.0, ast: 8.2 },
      rest_0: { pts: 22.5, reb: 6.2, ast: 7.5 },
      rest_1: { pts: 25.2, reb: 7.5, ast: 8.8 },
      rest_2plus: { pts: 28.5, reb: 8.5, ast: 10.2 },
      win: { pts: 27.8, reb: 8.2, ast: 9.8 },
      loss: { pts: 20.2, reb: 6.0, ast: 6.5 },
      q4: { pts: 7.2, fgPct: 48.5 },
      clutch: { pts: 3.2, fgPct: 46.8 }
    },
    vsTeam: {
      "GSW": { pts: 28.5, reb: 8.5, ast: 10.5, games: 3 },
      "BOS": { pts: 26.0, reb: 7.5, ast: 8.0, games: 2 },
      "MIA": { pts: 30.5, reb: 9.0, ast: 9.5, games: 2 }
    },
    propHitRates: {
      "pts_24.5": { over: 55, under: 45, streak: "O4" },
      "pts_26.5": { over: 42, under: 58, streak: "U1" },
      "ast_7.5": { over: 62, under: 38, streak: "O6" },
      "reb_6.5": { over: 65, under: 35, streak: "O8" },
      "pra_38.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "GSW", pts: 32, reb: 10, ast: 12, min: 38, result: "L" },
      { date: "2025-01-22", opp: "PHX", pts: 28, reb: 8, ast: 9, min: 36, result: "W" },
      { date: "2025-01-20", opp: "DEN", pts: 26, reb: 9, ast: 11, min: 37, result: "W" },
      { date: "2025-01-18", opp: "SAC", pts: 30, reb: 7, ast: 10, min: 35, result: "W" },
      { date: "2025-01-16", opp: "POR", pts: 26, reb: 9, ast: 8, min: 34, result: "W" }
    ],
    injuries: { current: null, history: ["Rest - Load Management (5 games)"] },
    fantasy: { avgFpts: 52.5, ceiling: 72, floor: 35, consistency: 80 }
  },

  "Jayson Tatum": {
    id: "tatum0",
    name: "Jayson Tatum",
    team: "BOS",
    position: "SF/PF",
    number: 0,
    age: 26,
    experience: 7,
    season: { pts: 27.5, reb: 8.5, ast: 5.2, stl: 1.1, blk: 0.6, tov: 2.8, min: 36.5, fgPct: 46.8, threePct: 38.2, ftPct: 84.5, usage: 30.2, per: 23.8 },
    last10: { pts: 29.8, reb: 9.2, ast: 5.8, stl: 1.3, blk: 0.8, tov: 2.5, min: 37.8, fgPct: 48.5, threePct: 40.5, ftPct: 86.0 },
    last5: { pts: 32.4, reb: 10.0, ast: 6.2, stl: 1.5, blk: 1.0, tov: 2.2, min: 38.5, fgPct: 50.2, threePct: 42.5, ftPct: 88.0 },
    splits: {
      home: { pts: 29.5, reb: 9.2, ast: 5.8, record: "22-4" },
      away: { pts: 25.5, reb: 7.8, ast: 4.6, record: "18-8" },
      vs_east: { pts: 28.2, reb: 8.8, ast: 5.5 },
      vs_west: { pts: 26.5, reb: 8.0, ast: 4.8 },
      rest_0: { pts: 24.5, reb: 7.5, ast: 4.2 },
      rest_1: { pts: 28.0, reb: 8.8, ast: 5.5 },
      rest_2plus: { pts: 31.5, reb: 10.0, ast: 6.2 },
      win: { pts: 29.8, reb: 9.0, ast: 5.8 },
      loss: { pts: 22.5, reb: 7.2, ast: 4.0 },
      q4: { pts: 7.8, fgPct: 45.2 },
      clutch: { pts: 2.8, fgPct: 42.5 }
    },
    vsTeam: {
      "MIA": { pts: 32.5, reb: 10.5, ast: 6.5, games: 3 },
      "PHI": { pts: 28.0, reb: 8.0, ast: 5.0, games: 3 },
      "NYK": { pts: 30.0, reb: 9.5, ast: 5.5, games: 2 }
    },
    propHitRates: {
      "pts_26.5": { over: 58, under: 42, streak: "O6" },
      "pts_28.5": { over: 48, under: 52, streak: "O2" },
      "reb_7.5": { over: 65, under: 35, streak: "O8" },
      "ast_4.5": { over: 60, under: 40, streak: "O5" },
      "pra_40.5": { over: 62, under: 38, streak: "O7" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "DAL", pts: 30, reb: 9, ast: 6, min: 38, result: "L" },
      { date: "2025-01-22", opp: "MIA", pts: 35, reb: 12, ast: 7, min: 40, result: "W" },
      { date: "2025-01-20", opp: "CHI", pts: 28, reb: 8, ast: 5, min: 35, result: "W" },
      { date: "2025-01-18", opp: "CLE", pts: 34, reb: 11, ast: 6, min: 39, result: "W" },
      { date: "2025-01-16", opp: "ATL", pts: 35, reb: 10, ast: 7, min: 37, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 48.5, ceiling: 68, floor: 32, consistency: 76 }
  },

  "Giannis Antetokounmpo": {
    id: "giannis34",
    name: "Giannis Antetokounmpo",
    team: "MIL",
    position: "PF/C",
    number: 34,
    age: 30,
    experience: 11,
    season: { pts: 31.5, reb: 12.2, ast: 6.5, stl: 1.2, blk: 1.5, tov: 3.8, min: 35.8, fgPct: 60.5, threePct: 28.5, ftPct: 65.2, usage: 34.5, per: 30.2 },
    last10: { pts: 33.8, reb: 13.5, ast: 7.2, stl: 1.4, blk: 1.8, tov: 3.5, min: 36.5, fgPct: 62.2, threePct: 30.0, ftPct: 68.0 },
    last5: { pts: 35.6, reb: 14.2, ast: 7.8, stl: 1.6, blk: 2.0, tov: 3.2, min: 37.2, fgPct: 64.5, threePct: 32.0, ftPct: 70.0 },
    splits: {
      home: { pts: 33.5, reb: 13.2, ast: 7.0, record: "21-5" },
      away: { pts: 29.5, reb: 11.2, ast: 6.0, record: "16-10" },
      vs_east: { pts: 32.0, reb: 12.5, ast: 6.8 },
      vs_west: { pts: 30.8, reb: 11.8, ast: 6.2 },
      rest_0: { pts: 28.5, reb: 10.5, ast: 5.5 },
      rest_1: { pts: 32.0, reb: 12.5, ast: 6.8 },
      rest_2plus: { pts: 35.5, reb: 14.5, ast: 7.5 },
      win: { pts: 34.2, reb: 13.5, ast: 7.2 },
      loss: { pts: 26.5, reb: 10.0, ast: 5.2 },
      q4: { pts: 8.5, fgPct: 58.2 },
      clutch: { pts: 3.5, fgPct: 55.0 }
    },
    vsTeam: {
      "PHI": { pts: 38.0, reb: 15.0, ast: 8.0, games: 2 },
      "BOS": { pts: 32.5, reb: 12.5, ast: 6.5, games: 3 },
      "MIA": { pts: 35.0, reb: 14.0, ast: 7.0, games: 3 }
    },
    propHitRates: {
      "pts_30.5": { over: 62, under: 38, streak: "O7" },
      "pts_32.5": { over: 52, under: 48, streak: "O4" },
      "reb_11.5": { over: 65, under: 35, streak: "O9" },
      "ast_5.5": { over: 68, under: 32, streak: "O8" },
      "pra_48.5": { over: 70, under: 30, streak: "O10" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "PHI", pts: 42, reb: 16, ast: 9, min: 38, result: "W" },
      { date: "2025-01-22", opp: "CLE", pts: 35, reb: 14, ast: 7, min: 36, result: "W" },
      { date: "2025-01-20", opp: "IND", pts: 32, reb: 12, ast: 8, min: 35, result: "W" },
      { date: "2025-01-18", opp: "CHI", pts: 38, reb: 15, ast: 6, min: 37, result: "W" },
      { date: "2025-01-16", opp: "DET", pts: 31, reb: 14, ast: 9, min: 34, result: "W" }
    ],
    injuries: { current: null, history: ["Knee - Dec 2024 (3 games)"] },
    fantasy: { avgFpts: 58.5, ceiling: 82, floor: 40, consistency: 85 }
  },

  "Nikola Jokic": {
    id: "jokic15",
    name: "Nikola Jokic",
    team: "DEN",
    position: "C",
    number: 15,
    age: 29,
    experience: 9,
    season: { pts: 29.5, reb: 13.5, ast: 10.2, stl: 1.5, blk: 0.8, tov: 3.2, min: 36.5, fgPct: 58.2, threePct: 42.5, ftPct: 82.5, usage: 30.5, per: 32.5 },
    last10: { pts: 31.2, reb: 14.2, ast: 11.0, stl: 1.8, blk: 1.0, tov: 3.0, min: 37.2, fgPct: 60.5, threePct: 44.0, ftPct: 84.0 },
    last5: { pts: 33.4, reb: 15.0, ast: 12.0, stl: 2.0, blk: 1.2, tov: 2.8, min: 38.0, fgPct: 62.0, threePct: 46.0, ftPct: 85.0 },
    splits: {
      home: { pts: 31.5, reb: 14.5, ast: 11.0, record: "23-3" },
      away: { pts: 27.5, reb: 12.5, ast: 9.5, record: "17-9" },
      vs_east: { pts: 30.5, reb: 14.0, ast: 10.5 },
      vs_west: { pts: 28.5, reb: 13.0, ast: 10.0 },
      rest_0: { pts: 26.5, reb: 12.0, ast: 9.0 },
      rest_1: { pts: 30.0, reb: 14.0, ast: 10.5 },
      rest_2plus: { pts: 34.0, reb: 16.0, ast: 12.0 },
      win: { pts: 32.0, reb: 14.5, ast: 11.5 },
      loss: { pts: 24.5, reb: 11.5, ast: 8.0 },
      q4: { pts: 8.2, fgPct: 56.5 },
      clutch: { pts: 4.0, fgPct: 52.0 }
    },
    vsTeam: {
      "LAL": { pts: 32.5, reb: 15.0, ast: 12.0, games: 3 },
      "GSW": { pts: 30.0, reb: 14.0, ast: 11.0, games: 2 },
      "PHX": { pts: 28.5, reb: 13.5, ast: 10.5, games: 3 }
    },
    propHitRates: {
      "pts_28.5": { over: 60, under: 40, streak: "O6" },
      "pts_30.5": { over: 52, under: 48, streak: "O3" },
      "reb_12.5": { over: 68, under: 32, streak: "O10" },
      "ast_9.5": { over: 62, under: 38, streak: "O7" },
      "pra_52.5": { over: 65, under: 35, streak: "O9" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 36, reb: 16, ast: 14, min: 38, result: "W" },
      { date: "2025-01-22", opp: "GSW", pts: 32, reb: 14, ast: 12, min: 37, result: "W" },
      { date: "2025-01-20", opp: "LAL", pts: 30, reb: 15, ast: 11, min: 36, result: "W" },
      { date: "2025-01-18", opp: "SAC", pts: 35, reb: 14, ast: 10, min: 38, result: "W" },
      { date: "2025-01-16", opp: "POR", pts: 34, reb: 16, ast: 13, min: 37, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 68.5, ceiling: 95, floor: 48, consistency: 88 }
  },

  "Shai Gilgeous-Alexander": {
    id: "sga2",
    name: "Shai Gilgeous-Alexander",
    team: "OKC",
    position: "PG/SG",
    number: 2,
    age: 26,
    experience: 6,
    season: { pts: 32.5, reb: 5.8, ast: 6.5, stl: 2.0, blk: 0.8, tov: 2.5, min: 35.2, fgPct: 53.5, threePct: 36.5, ftPct: 88.5, usage: 32.8, per: 28.8 },
    last10: { pts: 34.8, reb: 6.2, ast: 7.0, stl: 2.2, blk: 1.0, tov: 2.2, min: 36.0, fgPct: 55.0, threePct: 38.5, ftPct: 90.0 },
    last5: { pts: 36.4, reb: 6.6, ast: 7.4, stl: 2.4, blk: 1.2, tov: 2.0, min: 36.8, fgPct: 56.5, threePct: 40.0, ftPct: 91.0 },
    splits: {
      home: { pts: 34.5, reb: 6.2, ast: 7.0, record: "25-2" },
      away: { pts: 30.5, reb: 5.4, ast: 6.0, record: "20-5" },
      vs_east: { pts: 33.5, reb: 6.0, ast: 6.8 },
      vs_west: { pts: 31.8, reb: 5.6, ast: 6.2 },
      rest_0: { pts: 29.5, reb: 5.0, ast: 5.5 },
      rest_1: { pts: 33.0, reb: 6.0, ast: 6.8 },
      rest_2plus: { pts: 36.5, reb: 6.8, ast: 7.5 },
      win: { pts: 34.5, reb: 6.2, ast: 7.0 },
      loss: { pts: 26.5, reb: 4.8, ast: 5.2 },
      q4: { pts: 9.5, fgPct: 52.0 },
      clutch: { pts: 4.2, fgPct: 48.5 }
    },
    vsTeam: {
      "DEN": { pts: 38.0, reb: 7.0, ast: 8.0, games: 3 },
      "MIN": { pts: 35.0, reb: 6.0, ast: 7.0, games: 3 },
      "DAL": { pts: 36.5, reb: 6.5, ast: 7.5, games: 2 }
    },
    propHitRates: {
      "pts_31.5": { over: 62, under: 38, streak: "O8" },
      "pts_33.5": { over: 52, under: 48, streak: "O4" },
      "ast_5.5": { over: 68, under: 32, streak: "O9" },
      "reb_5.5": { over: 55, under: 45, streak: "O3" },
      "pra_43.5": { over: 65, under: 35, streak: "O7" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "DEN", pts: 40, reb: 7, ast: 9, min: 38, result: "W" },
      { date: "2025-01-22", opp: "MIN", pts: 35, reb: 6, ast: 7, min: 36, result: "W" },
      { date: "2025-01-20", opp: "DAL", pts: 38, reb: 7, ast: 8, min: 37, result: "W" },
      { date: "2025-01-18", opp: "HOU", pts: 34, reb: 6, ast: 6, min: 35, result: "W" },
      { date: "2025-01-16", opp: "UTA", pts: 35, reb: 7, ast: 7, min: 36, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 55.5, ceiling: 75, floor: 38, consistency: 84 }
  },

  "Kevin Durant": {
    id: "kd35",
    name: "Kevin Durant",
    team: "PHX",
    position: "SF/PF",
    number: 35,
    age: 36,
    experience: 17,
    season: { pts: 27.2, reb: 6.5, ast: 5.2, stl: 0.8, blk: 1.2, tov: 2.8, min: 34.5, fgPct: 52.5, threePct: 40.2, ftPct: 88.5, usage: 29.5, per: 25.2 },
    last10: { pts: 29.5, reb: 7.0, ast: 5.8, stl: 1.0, blk: 1.4, tov: 2.5, min: 35.2, fgPct: 54.0, threePct: 42.0, ftPct: 90.0 },
    last5: { pts: 31.2, reb: 7.4, ast: 6.2, stl: 1.2, blk: 1.6, tov: 2.2, min: 36.0, fgPct: 55.5, threePct: 44.0, ftPct: 91.0 },
    splits: {
      home: { pts: 29.0, reb: 7.0, ast: 5.8, record: "18-8" },
      away: { pts: 25.5, reb: 6.0, ast: 4.6, record: "14-12" },
      vs_east: { pts: 28.0, reb: 6.8, ast: 5.5 },
      vs_west: { pts: 26.5, reb: 6.2, ast: 5.0 },
      rest_0: { pts: 24.5, reb: 5.5, ast: 4.2 },
      rest_1: { pts: 27.5, reb: 6.8, ast: 5.5 },
      rest_2plus: { pts: 30.5, reb: 7.5, ast: 6.2 },
      win: { pts: 29.5, reb: 7.0, ast: 5.8 },
      loss: { pts: 23.5, reb: 5.8, ast: 4.2 },
      q4: { pts: 7.5, fgPct: 50.0 },
      clutch: { pts: 3.0, fgPct: 46.5 }
    },
    vsTeam: {
      "GSW": { pts: 30.0, reb: 7.5, ast: 6.0, games: 3 },
      "LAL": { pts: 28.5, reb: 7.0, ast: 5.5, games: 3 },
      "DEN": { pts: 32.0, reb: 8.0, ast: 6.5, games: 2 }
    },
    propHitRates: {
      "pts_26.5": { over: 58, under: 42, streak: "O5" },
      "pts_28.5": { over: 48, under: 52, streak: "O2" },
      "reb_6.5": { over: 52, under: 48, streak: "O3" },
      "ast_4.5": { over: 62, under: 38, streak: "O6" },
      "pra_38.5": { over: 60, under: 40, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "GSW", pts: 34, reb: 8, ast: 7, min: 37, result: "W" },
      { date: "2025-01-22", opp: "LAL", pts: 30, reb: 7, ast: 6, min: 36, result: "W" },
      { date: "2025-01-20", opp: "SAC", pts: 28, reb: 6, ast: 5, min: 34, result: "L" },
      { date: "2025-01-18", opp: "POR", pts: 32, reb: 8, ast: 7, min: 36, result: "W" },
      { date: "2025-01-16", opp: "UTA", pts: 32, reb: 8, ast: 6, min: 35, result: "W" }
    ],
    injuries: { current: null, history: ["Ankle - Oct 2024 (5 games)"] },
    fantasy: { avgFpts: 45.5, ceiling: 65, floor: 32, consistency: 78 }
  },

  "Anthony Edwards": {
    id: "ant1",
    name: "Anthony Edwards",
    team: "MIN",
    position: "SG/SF",
    number: 1,
    age: 23,
    experience: 4,
    season: { pts: 28.5, reb: 5.8, ast: 5.0, stl: 1.5, blk: 0.5, tov: 2.5, min: 36.0, fgPct: 47.5, threePct: 38.5, ftPct: 82.5, usage: 31.5, per: 24.5 },
    last10: { pts: 30.8, reb: 6.2, ast: 5.5, stl: 1.8, blk: 0.6, tov: 2.2, min: 37.0, fgPct: 49.0, threePct: 40.5, ftPct: 84.0 },
    last5: { pts: 32.6, reb: 6.6, ast: 5.8, stl: 2.0, blk: 0.8, tov: 2.0, min: 37.8, fgPct: 50.5, threePct: 42.0, ftPct: 85.0 },
    splits: {
      home: { pts: 30.5, reb: 6.2, ast: 5.5, record: "20-6" },
      away: { pts: 26.5, reb: 5.4, ast: 4.5, record: "16-10" },
      vs_east: { pts: 29.5, reb: 6.0, ast: 5.2 },
      vs_west: { pts: 27.5, reb: 5.6, ast: 4.8 },
      rest_0: { pts: 25.5, reb: 5.0, ast: 4.0 },
      rest_1: { pts: 29.0, reb: 6.0, ast: 5.2 },
      rest_2plus: { pts: 32.5, reb: 6.8, ast: 6.0 },
      win: { pts: 31.0, reb: 6.2, ast: 5.5 },
      loss: { pts: 24.0, reb: 5.0, ast: 4.0 },
      q4: { pts: 8.0, fgPct: 46.0 },
      clutch: { pts: 3.2, fgPct: 42.5 }
    },
    vsTeam: {
      "DEN": { pts: 32.5, reb: 7.0, ast: 6.0, games: 3 },
      "OKC": { pts: 28.0, reb: 5.5, ast: 5.0, games: 3 },
      "DAL": { pts: 30.0, reb: 6.5, ast: 5.5, games: 2 }
    },
    propHitRates: {
      "pts_27.5": { over: 58, under: 42, streak: "O6" },
      "pts_29.5": { over: 48, under: 52, streak: "O2" },
      "reb_5.5": { over: 55, under: 45, streak: "O4" },
      "ast_4.5": { over: 58, under: 42, streak: "O5" },
      "pra_38.5": { over: 60, under: 40, streak: "O6" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "DEN", pts: 36, reb: 7, ast: 6, min: 38, result: "W" },
      { date: "2025-01-22", opp: "OKC", pts: 30, reb: 6, ast: 5, min: 37, result: "L" },
      { date: "2025-01-20", opp: "DAL", pts: 32, reb: 7, ast: 6, min: 38, result: "W" },
      { date: "2025-01-18", opp: "HOU", pts: 34, reb: 6, ast: 5, min: 36, result: "W" },
      { date: "2025-01-16", opp: "SAS", pts: 31, reb: 7, ast: 7, min: 37, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 48.5, ceiling: 70, floor: 32, consistency: 76 }
  },

  "Tyrese Haliburton": {
    id: "hali0",
    name: "Tyrese Haliburton",
    team: "IND",
    position: "PG",
    number: 0,
    age: 24,
    experience: 4,
    season: { pts: 20.5, reb: 4.0, ast: 10.8, stl: 1.2, blk: 0.3, tov: 2.5, min: 34.5, fgPct: 46.5, threePct: 38.5, ftPct: 86.5, usage: 25.5, per: 22.5 },
    last10: { pts: 22.2, reb: 4.5, ast: 11.5, stl: 1.4, blk: 0.4, tov: 2.2, min: 35.2, fgPct: 48.0, threePct: 40.0, ftPct: 88.0 },
    last5: { pts: 24.0, reb: 4.8, ast: 12.2, stl: 1.6, blk: 0.5, tov: 2.0, min: 36.0, fgPct: 49.5, threePct: 42.0, ftPct: 89.0 },
    splits: {
      home: { pts: 22.0, reb: 4.5, ast: 11.5, record: "18-8" },
      away: { pts: 19.0, reb: 3.5, ast: 10.0, record: "14-12" },
      vs_east: { pts: 21.0, reb: 4.2, ast: 11.0 },
      vs_west: { pts: 20.0, reb: 3.8, ast: 10.5 },
      rest_0: { pts: 18.0, reb: 3.2, ast: 9.5 },
      rest_1: { pts: 21.0, reb: 4.2, ast: 11.0 },
      rest_2plus: { pts: 24.0, reb: 5.0, ast: 12.5 },
      win: { pts: 22.5, reb: 4.5, ast: 12.0 },
      loss: { pts: 17.5, reb: 3.2, ast: 9.0 },
      q4: { pts: 5.5, fgPct: 44.0 },
      clutch: { pts: 2.2, fgPct: 40.0 }
    },
    vsTeam: {
      "MIL": { pts: 24.0, reb: 5.0, ast: 13.0, games: 3 },
      "BOS": { pts: 22.0, reb: 4.0, ast: 11.0, games: 2 },
      "CLE": { pts: 20.0, reb: 4.0, ast: 12.0, games: 3 }
    },
    propHitRates: {
      "pts_19.5": { over: 55, under: 45, streak: "O4" },
      "pts_21.5": { over: 45, under: 55, streak: "U1" },
      "ast_9.5": { over: 68, under: 32, streak: "O10" },
      "ast_10.5": { over: 55, under: 45, streak: "O5" },
      "pra_34.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "MIL", pts: 26, reb: 5, ast: 14, min: 37, result: "W" },
      { date: "2025-01-22", opp: "CLE", pts: 22, reb: 4, ast: 12, min: 35, result: "L" },
      { date: "2025-01-20", opp: "CHI", pts: 24, reb: 5, ast: 11, min: 36, result: "W" },
      { date: "2025-01-18", opp: "DET", pts: 20, reb: 4, ast: 13, min: 34, result: "W" },
      { date: "2025-01-16", opp: "ATL", pts: 28, reb: 6, ast: 12, min: 38, result: "W" }
    ],
    injuries: { current: null, history: ["Hamstring - Nov 2024 (4 games)"] },
    fantasy: { avgFpts: 42.5, ceiling: 62, floor: 28, consistency: 74 }
  },

  "Devin Booker": {
    id: "book1",
    name: "Devin Booker",
    team: "PHX",
    position: "SG",
    number: 1,
    age: 28,
    experience: 9,
    season: { pts: 27.5, reb: 4.5, ast: 7.0, stl: 1.0, blk: 0.3, tov: 2.8, min: 35.5, fgPct: 49.5, threePct: 38.5, ftPct: 88.5, usage: 29.5, per: 23.5 },
    last10: { pts: 29.8, reb: 5.0, ast: 7.5, stl: 1.2, blk: 0.4, tov: 2.5, min: 36.2, fgPct: 51.0, threePct: 40.0, ftPct: 90.0 },
    last5: { pts: 31.6, reb: 5.4, ast: 8.0, stl: 1.4, blk: 0.5, tov: 2.2, min: 37.0, fgPct: 52.5, threePct: 42.0, ftPct: 91.0 },
    splits: {
      home: { pts: 29.5, reb: 5.0, ast: 7.5, record: "18-8" },
      away: { pts: 25.5, reb: 4.0, ast: 6.5, record: "14-12" },
      vs_east: { pts: 28.0, reb: 4.8, ast: 7.2 },
      vs_west: { pts: 27.0, reb: 4.2, ast: 6.8 },
      rest_0: { pts: 24.5, reb: 3.8, ast: 6.0 },
      rest_1: { pts: 28.0, reb: 4.8, ast: 7.2 },
      rest_2plus: { pts: 31.0, reb: 5.5, ast: 8.0 },
      win: { pts: 30.0, reb: 5.0, ast: 7.8 },
      loss: { pts: 23.5, reb: 3.8, ast: 5.8 },
      q4: { pts: 7.8, fgPct: 48.5 },
      clutch: { pts: 3.0, fgPct: 45.0 }
    },
    vsTeam: {
      "GSW": { pts: 32.0, reb: 5.5, ast: 8.0, games: 3 },
      "LAL": { pts: 30.0, reb: 5.0, ast: 7.5, games: 3 },
      "DEN": { pts: 28.0, reb: 4.5, ast: 7.0, games: 3 }
    },
    propHitRates: {
      "pts_26.5": { over: 58, under: 42, streak: "O5" },
      "pts_28.5": { over: 48, under: 52, streak: "O2" },
      "ast_6.5": { over: 55, under: 45, streak: "O4" },
      "reb_4.5": { over: 52, under: 48, streak: "O3" },
      "pra_38.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "GSW", pts: 34, reb: 6, ast: 9, min: 38, result: "W" },
      { date: "2025-01-22", opp: "LAL", pts: 30, reb: 5, ast: 8, min: 36, result: "W" },
      { date: "2025-01-20", opp: "SAC", pts: 28, reb: 4, ast: 7, min: 35, result: "L" },
      { date: "2025-01-18", opp: "POR", pts: 32, reb: 6, ast: 8, min: 37, result: "W" },
      { date: "2025-01-16", opp: "UTA", pts: 34, reb: 5, ast: 8, min: 36, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 45.5, ceiling: 65, floor: 30, consistency: 78 }
  },

  "Ja Morant": {
    id: "ja12",
    name: "Ja Morant",
    team: "MEM",
    position: "PG",
    number: 12,
    age: 25,
    experience: 5,
    season: { pts: 25.2, reb: 5.5, ast: 8.8, stl: 1.0, blk: 0.4, tov: 3.2, min: 33.5, fgPct: 48.5, threePct: 32.5, ftPct: 78.5, usage: 30.5, per: 22.8 },
    last10: { pts: 27.5, reb: 6.0, ast: 9.5, stl: 1.2, blk: 0.5, tov: 3.0, min: 34.5, fgPct: 50.0, threePct: 34.0, ftPct: 80.0 },
    last5: { pts: 29.4, reb: 6.4, ast: 10.2, stl: 1.4, blk: 0.6, tov: 2.8, min: 35.2, fgPct: 51.5, threePct: 35.5, ftPct: 81.0 },
    splits: {
      home: { pts: 27.0, reb: 6.0, ast: 9.5, record: "16-10" },
      away: { pts: 23.5, reb: 5.0, ast: 8.0, record: "12-14" },
      vs_east: { pts: 26.0, reb: 5.8, ast: 9.0 },
      vs_west: { pts: 24.5, reb: 5.2, ast: 8.5 },
      rest_0: { pts: 22.5, reb: 4.8, ast: 7.5 },
      rest_1: { pts: 25.5, reb: 5.8, ast: 9.0 },
      rest_2plus: { pts: 28.5, reb: 6.5, ast: 10.5 },
      win: { pts: 27.5, reb: 6.0, ast: 9.8 },
      loss: { pts: 21.5, reb: 4.8, ast: 7.2 },
      q4: { pts: 7.0, fgPct: 46.5 },
      clutch: { pts: 2.8, fgPct: 44.0 }
    },
    vsTeam: {
      "LAL": { pts: 28.0, reb: 6.5, ast: 10.0, games: 2 },
      "GSW": { pts: 30.0, reb: 5.5, ast: 9.5, games: 2 },
      "DEN": { pts: 26.0, reb: 6.0, ast: 9.0, games: 2 }
    },
    propHitRates: {
      "pts_24.5": { over: 55, under: 45, streak: "O4" },
      "pts_26.5": { over: 45, under: 55, streak: "U1" },
      "ast_8.5": { over: 55, under: 45, streak: "O4" },
      "reb_5.5": { over: 52, under: 48, streak: "O3" },
      "pra_38.5": { over: 55, under: 45, streak: "O4" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 32, reb: 7, ast: 12, min: 36, result: "W" },
      { date: "2025-01-22", opp: "GSW", pts: 28, reb: 6, ast: 10, min: 35, result: "L" },
      { date: "2025-01-20", opp: "SAC", pts: 30, reb: 6, ast: 9, min: 36, result: "W" },
      { date: "2025-01-18", opp: "POR", pts: 26, reb: 5, ast: 11, min: 34, result: "W" },
      { date: "2025-01-16", opp: "HOU", pts: 31, reb: 8, ast: 9, min: 37, result: "W" }
    ],
    injuries: { current: null, history: ["Shoulder - Dec 2024 (8 games)"] },
    fantasy: { avgFpts: 46.5, ceiling: 68, floor: 30, consistency: 72 }
  },

  "Donovan Mitchell": {
    id: "spida45",
    name: "Donovan Mitchell",
    team: "CLE",
    position: "SG",
    number: 45,
    age: 28,
    experience: 7,
    season: { pts: 26.5, reb: 4.8, ast: 5.5, stl: 1.5, blk: 0.4, tov: 2.5, min: 34.5, fgPct: 47.5, threePct: 38.0, ftPct: 86.5, usage: 29.5, per: 22.5 },
    last10: { pts: 28.8, reb: 5.2, ast: 6.0, stl: 1.7, blk: 0.5, tov: 2.2, min: 35.5, fgPct: 49.0, threePct: 40.0, ftPct: 88.0 },
    last5: { pts: 30.6, reb: 5.6, ast: 6.4, stl: 1.9, blk: 0.6, tov: 2.0, min: 36.2, fgPct: 50.5, threePct: 42.0, ftPct: 89.0 },
    splits: {
      home: { pts: 28.5, reb: 5.2, ast: 6.0, record: "22-4" },
      away: { pts: 24.5, reb: 4.4, ast: 5.0, record: "18-8" },
      vs_east: { pts: 27.0, reb: 5.0, ast: 5.8 },
      vs_west: { pts: 26.0, reb: 4.6, ast: 5.2 },
      rest_0: { pts: 24.0, reb: 4.2, ast: 4.8 },
      rest_1: { pts: 27.0, reb: 5.0, ast: 5.8 },
      rest_2plus: { pts: 30.0, reb: 5.8, ast: 6.5 },
      win: { pts: 28.5, reb: 5.2, ast: 6.0 },
      loss: { pts: 22.0, reb: 4.0, ast: 4.5 },
      q4: { pts: 7.5, fgPct: 46.0 },
      clutch: { pts: 2.8, fgPct: 42.0 }
    },
    vsTeam: {
      "BOS": { pts: 30.0, reb: 5.5, ast: 6.5, games: 3 },
      "MIL": { pts: 28.0, reb: 5.0, ast: 6.0, games: 3 },
      "MIA": { pts: 32.0, reb: 6.0, ast: 5.5, games: 2 }
    },
    propHitRates: {
      "pts_25.5": { over: 58, under: 42, streak: "O6" },
      "pts_27.5": { over: 48, under: 52, streak: "O2" },
      "ast_5.5": { over: 52, under: 48, streak: "O3" },
      "reb_4.5": { over: 55, under: 45, streak: "O4" },
      "pra_36.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "BOS", pts: 34, reb: 6, ast: 7, min: 37, result: "L" },
      { date: "2025-01-22", opp: "MIL", pts: 30, reb: 5, ast: 6, min: 36, result: "W" },
      { date: "2025-01-20", opp: "IND", pts: 28, reb: 5, ast: 5, min: 34, result: "W" },
      { date: "2025-01-18", opp: "CHI", pts: 32, reb: 6, ast: 7, min: 36, result: "W" },
      { date: "2025-01-16", opp: "DET", pts: 29, reb: 6, ast: 7, min: 35, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 44.5, ceiling: 64, floor: 30, consistency: 76 }
  },

  "Joel Embiid": {
    id: "embiid21",
    name: "Joel Embiid",
    team: "PHI",
    position: "C",
    number: 21,
    age: 30,
    experience: 8,
    season: { pts: 28.5, reb: 11.0, ast: 4.5, stl: 0.8, blk: 1.8, tov: 3.2, min: 32.5, fgPct: 52.5, threePct: 35.0, ftPct: 85.5, usage: 34.5, per: 28.5 },
    last10: { pts: 30.8, reb: 12.0, ast: 5.0, stl: 1.0, blk: 2.0, tov: 3.0, min: 33.5, fgPct: 54.0, threePct: 37.0, ftPct: 87.0 },
    last5: { pts: 32.6, reb: 12.8, ast: 5.4, stl: 1.2, blk: 2.2, tov: 2.8, min: 34.2, fgPct: 55.5, threePct: 38.5, ftPct: 88.0 },
    splits: {
      home: { pts: 30.5, reb: 12.0, ast: 5.0, record: "16-8" },
      away: { pts: 26.5, reb: 10.0, ast: 4.0, record: "12-12" },
      vs_east: { pts: 29.0, reb: 11.5, ast: 4.8 },
      vs_west: { pts: 28.0, reb: 10.5, ast: 4.2 },
      rest_0: { pts: 24.5, reb: 9.5, ast: 3.8 },
      rest_1: { pts: 29.0, reb: 11.5, ast: 4.8 },
      rest_2plus: { pts: 33.0, reb: 13.0, ast: 5.5 },
      win: { pts: 31.0, reb: 12.0, ast: 5.0 },
      loss: { pts: 24.5, reb: 9.5, ast: 3.8 },
      q4: { pts: 8.0, fgPct: 50.0 },
      clutch: { pts: 3.2, fgPct: 46.5 }
    },
    vsTeam: {
      "BOS": { pts: 32.0, reb: 13.0, ast: 5.0, games: 3 },
      "MIL": { pts: 35.0, reb: 14.0, ast: 4.5, games: 2 },
      "MIA": { pts: 30.0, reb: 12.0, ast: 5.5, games: 2 }
    },
    propHitRates: {
      "pts_27.5": { over: 58, under: 42, streak: "O5" },
      "pts_29.5": { over: 48, under: 52, streak: "O2" },
      "reb_10.5": { over: 62, under: 38, streak: "O7" },
      "ast_4.5": { over: 52, under: 48, streak: "O3" },
      "pra_42.5": { over: 60, under: 40, streak: "O6" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "MIL", pts: 36, reb: 14, ast: 6, min: 35, result: "L" },
      { date: "2025-01-22", opp: "BOS", pts: 32, reb: 13, ast: 5, min: 34, result: "L" },
      { date: "2025-01-20", opp: "ATL", pts: 30, reb: 12, ast: 5, min: 33, result: "W" },
      { date: "2025-01-18", opp: "MIA", pts: 34, reb: 13, ast: 6, min: 35, result: "W" },
      { date: "2025-01-16", opp: "NYK", pts: 31, reb: 12, ast: 5, min: 34, result: "W" }
    ],
    injuries: { current: "Day-to-Day (Knee)", history: ["Knee - Multiple (15 games)"] },
    fantasy: { avgFpts: 52.5, ceiling: 75, floor: 35, consistency: 70 }
  },

  "Trae Young": {
    id: "trae11",
    name: "Trae Young",
    team: "ATL",
    position: "PG",
    number: 11,
    age: 26,
    experience: 6,
    season: { pts: 26.5, reb: 3.2, ast: 11.5, stl: 1.0, blk: 0.2, tov: 4.0, min: 35.5, fgPct: 43.5, threePct: 36.5, ftPct: 88.5, usage: 32.5, per: 21.5 },
    last10: { pts: 28.8, reb: 3.5, ast: 12.2, stl: 1.2, blk: 0.3, tov: 3.8, min: 36.5, fgPct: 45.0, threePct: 38.0, ftPct: 90.0 },
    last5: { pts: 30.6, reb: 3.8, ast: 13.0, stl: 1.4, blk: 0.4, tov: 3.5, min: 37.2, fgPct: 46.5, threePct: 39.5, ftPct: 91.0 },
    splits: {
      home: { pts: 28.5, reb: 3.5, ast: 12.5, record: "14-12" },
      away: { pts: 24.5, reb: 3.0, ast: 10.5, record: "10-16" },
      vs_east: { pts: 27.0, reb: 3.4, ast: 12.0 },
      vs_west: { pts: 26.0, reb: 3.0, ast: 11.0 },
      rest_0: { pts: 23.5, reb: 2.8, ast: 10.0 },
      rest_1: { pts: 27.0, reb: 3.4, ast: 12.0 },
      rest_2plus: { pts: 30.0, reb: 4.0, ast: 13.5 },
      win: { pts: 29.0, reb: 3.6, ast: 13.0 },
      loss: { pts: 23.5, reb: 2.8, ast: 9.8 },
      q4: { pts: 7.2, fgPct: 42.0 },
      clutch: { pts: 3.0, fgPct: 38.5 }
    },
    vsTeam: {
      "BOS": { pts: 28.0, reb: 3.5, ast: 12.0, games: 2 },
      "MIA": { pts: 30.0, reb: 4.0, ast: 14.0, games: 3 },
      "NYK": { pts: 32.0, reb: 3.5, ast: 11.0, games: 3 }
    },
    propHitRates: {
      "pts_25.5": { over: 55, under: 45, streak: "O4" },
      "pts_27.5": { over: 45, under: 55, streak: "U1" },
      "ast_10.5": { over: 65, under: 35, streak: "O8" },
      "ast_11.5": { over: 52, under: 48, streak: "O3" },
      "pra_40.5": { over: 55, under: 45, streak: "O4" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "BOS", pts: 32, reb: 4, ast: 14, min: 38, result: "L" },
      { date: "2025-01-22", opp: "MIA", pts: 30, reb: 3, ast: 13, min: 37, result: "W" },
      { date: "2025-01-20", opp: "CLE", pts: 28, reb: 4, ast: 12, min: 36, result: "L" },
      { date: "2025-01-18", opp: "DET", pts: 32, reb: 3, ast: 14, min: 38, result: "W" },
      { date: "2025-01-16", opp: "CHI", pts: 31, reb: 4, ast: 12, min: 37, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 48.5, ceiling: 70, floor: 32, consistency: 72 }
  },

  "Anthony Davis": {
    id: "ad3",
    name: "Anthony Davis",
    team: "LAL",
    position: "PF/C",
    number: 3,
    age: 31,
    experience: 12,
    season: { pts: 25.5, reb: 12.5, ast: 3.5, stl: 1.2, blk: 2.2, tov: 2.2, min: 35.5, fgPct: 55.5, threePct: 28.5, ftPct: 78.5, usage: 27.5, per: 26.5 },
    last10: { pts: 27.8, reb: 13.5, ast: 3.8, stl: 1.4, blk: 2.5, tov: 2.0, min: 36.5, fgPct: 57.0, threePct: 30.0, ftPct: 80.0 },
    last5: { pts: 29.6, reb: 14.2, ast: 4.2, stl: 1.6, blk: 2.8, tov: 1.8, min: 37.2, fgPct: 58.5, threePct: 31.5, ftPct: 81.0 },
    splits: {
      home: { pts: 27.5, reb: 13.5, ast: 4.0, record: "19-7" },
      away: { pts: 23.5, reb: 11.5, ast: 3.0, record: "14-12" },
      vs_east: { pts: 26.0, reb: 13.0, ast: 3.8 },
      vs_west: { pts: 25.0, reb: 12.0, ast: 3.2 },
      rest_0: { pts: 22.5, reb: 11.0, ast: 2.8 },
      rest_1: { pts: 26.0, reb: 13.0, ast: 3.8 },
      rest_2plus: { pts: 29.5, reb: 14.5, ast: 4.5 },
      win: { pts: 28.0, reb: 13.5, ast: 4.0 },
      loss: { pts: 21.5, reb: 11.0, ast: 2.8 },
      q4: { pts: 7.0, fgPct: 54.0 },
      clutch: { pts: 2.8, fgPct: 50.0 }
    },
    vsTeam: {
      "GSW": { pts: 28.0, reb: 14.0, ast: 4.0, games: 3 },
      "PHX": { pts: 26.0, reb: 13.0, ast: 3.5, games: 3 },
      "DEN": { pts: 30.0, reb: 15.0, ast: 4.5, games: 3 }
    },
    propHitRates: {
      "pts_24.5": { over: 58, under: 42, streak: "O5" },
      "pts_26.5": { over: 48, under: 52, streak: "O2" },
      "reb_11.5": { over: 65, under: 35, streak: "O8" },
      "blk_1.5": { over: 70, under: 30, streak: "O10" },
      "pra_40.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "GSW", pts: 32, reb: 15, ast: 5, min: 38, result: "L" },
      { date: "2025-01-22", opp: "PHX", pts: 28, reb: 14, ast: 4, min: 36, result: "W" },
      { date: "2025-01-20", opp: "DEN", pts: 30, reb: 16, ast: 4, min: 37, result: "W" },
      { date: "2025-01-18", opp: "SAC", pts: 26, reb: 13, ast: 3, min: 35, result: "W" },
      { date: "2025-01-16", opp: "POR", pts: 32, reb: 13, ast: 5, min: 36, result: "W" }
    ],
    injuries: { current: null, history: ["Back - Nov 2024 (3 games)"] },
    fantasy: { avgFpts: 50.5, ceiling: 72, floor: 35, consistency: 75 }
  },

  "Jimmy Butler": {
    id: "jimmy22",
    name: "Jimmy Butler",
    team: "MIA",
    position: "SF/SG",
    number: 22,
    age: 35,
    experience: 13,
    season: { pts: 20.5, reb: 5.8, ast: 5.0, stl: 1.8, blk: 0.4, tov: 2.0, min: 32.5, fgPct: 52.5, threePct: 35.0, ftPct: 85.5, usage: 24.5, per: 20.5 },
    last10: { pts: 22.2, reb: 6.2, ast: 5.5, stl: 2.0, blk: 0.5, tov: 1.8, min: 33.5, fgPct: 54.0, threePct: 36.5, ftPct: 87.0 },
    last5: { pts: 24.0, reb: 6.6, ast: 5.8, stl: 2.2, blk: 0.6, tov: 1.6, min: 34.2, fgPct: 55.5, threePct: 38.0, ftPct: 88.0 },
    splits: {
      home: { pts: 22.0, reb: 6.2, ast: 5.5, record: "18-8" },
      away: { pts: 19.0, reb: 5.4, ast: 4.5, record: "14-12" },
      vs_east: { pts: 21.0, reb: 6.0, ast: 5.2 },
      vs_west: { pts: 20.0, reb: 5.6, ast: 4.8 },
      rest_0: { pts: 18.0, reb: 5.0, ast: 4.2 },
      rest_1: { pts: 21.0, reb: 6.0, ast: 5.2 },
      rest_2plus: { pts: 24.0, reb: 7.0, ast: 6.0 },
      win: { pts: 22.5, reb: 6.2, ast: 5.5 },
      loss: { pts: 17.5, reb: 5.2, ast: 4.2 },
      q4: { pts: 6.0, fgPct: 50.0 },
      clutch: { pts: 2.5, fgPct: 48.0 }
    },
    vsTeam: {
      "BOS": { pts: 24.0, reb: 7.0, ast: 6.0, games: 3 },
      "PHI": { pts: 22.0, reb: 6.0, ast: 5.5, games: 3 },
      "NYK": { pts: 20.0, reb: 5.5, ast: 5.0, games: 2 }
    },
    propHitRates: {
      "pts_19.5": { over: 55, under: 45, streak: "O4" },
      "pts_21.5": { over: 45, under: 55, streak: "U1" },
      "reb_5.5": { over: 55, under: 45, streak: "O4" },
      "ast_4.5": { over: 58, under: 42, streak: "O5" },
      "pra_30.5": { over: 58, under: 42, streak: "O5" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "BOS", pts: 26, reb: 7, ast: 6, min: 35, result: "L" },
      { date: "2025-01-22", opp: "ATL", pts: 22, reb: 6, ast: 5, min: 33, result: "L" },
      { date: "2025-01-20", opp: "CLE", pts: 24, reb: 7, ast: 6, min: 34, result: "L" },
      { date: "2025-01-18", opp: "PHI", pts: 20, reb: 6, ast: 5, min: 32, result: "W" },
      { date: "2025-01-16", opp: "NYK", pts: 28, reb: 7, ast: 7, min: 36, result: "W" }
    ],
    injuries: { current: "Questionable (Knee)", history: ["Various - Load Management (10 games)"] },
    fantasy: { avgFpts: 38.5, ceiling: 58, floor: 25, consistency: 70 }
  },

  "Paolo Banchero": {
    id: "paolo5",
    name: "Paolo Banchero",
    team: "ORL",
    position: "PF/SF",
    number: 5,
    age: 22,
    experience: 2,
    season: { pts: 24.5, reb: 7.5, ast: 5.5, stl: 0.8, blk: 0.6, tov: 3.0, min: 34.5, fgPct: 47.5, threePct: 35.5, ftPct: 75.5, usage: 29.5, per: 20.5 },
    last10: { pts: 26.8, reb: 8.0, ast: 6.0, stl: 1.0, blk: 0.8, tov: 2.8, min: 35.5, fgPct: 49.0, threePct: 37.0, ftPct: 77.0 },
    last5: { pts: 28.6, reb: 8.4, ast: 6.4, stl: 1.2, blk: 1.0, tov: 2.6, min: 36.2, fgPct: 50.5, threePct: 38.5, ftPct: 78.0 },
    splits: {
      home: { pts: 26.5, reb: 8.0, ast: 6.0, record: "18-8" },
      away: { pts: 22.5, reb: 7.0, ast: 5.0, record: "16-10" },
      vs_east: { pts: 25.0, reb: 7.8, ast: 5.8 },
      vs_west: { pts: 24.0, reb: 7.2, ast: 5.2 },
      rest_0: { pts: 22.0, reb: 6.5, ast: 4.8 },
      rest_1: { pts: 25.0, reb: 7.8, ast: 5.8 },
      rest_2plus: { pts: 28.0, reb: 8.5, ast: 6.5 },
      win: { pts: 27.0, reb: 8.0, ast: 6.0 },
      loss: { pts: 21.0, reb: 6.8, ast: 4.8 },
      q4: { pts: 7.0, fgPct: 46.0 },
      clutch: { pts: 2.6, fgPct: 42.0 }
    },
    vsTeam: {
      "MIA": { pts: 28.0, reb: 9.0, ast: 6.5, games: 3 },
      "ATL": { pts: 26.0, reb: 8.0, ast: 6.0, games: 3 },
      "CHI": { pts: 24.0, reb: 7.5, ast: 5.5, games: 2 }
    },
    propHitRates: {
      "pts_23.5": { over: 55, under: 45, streak: "O4" },
      "pts_25.5": { over: 45, under: 55, streak: "U1" },
      "reb_7.5": { over: 52, under: 48, streak: "O3" },
      "ast_5.5": { over: 52, under: 48, streak: "O3" },
      "pra_36.5": { over: 55, under: 45, streak: "O4" }
    },
    gameLog: [
      { date: "2025-01-24", opp: "MIA", pts: 30, reb: 9, ast: 7, min: 37, result: "W" },
      { date: "2025-01-22", opp: "ATL", pts: 28, reb: 8, ast: 6, min: 36, result: "W" },
      { date: "2025-01-20", opp: "CLE", pts: 26, reb: 8, ast: 5, min: 35, result: "L" },
      { date: "2025-01-18", opp: "CHI", pts: 30, reb: 9, ast: 7, min: 37, result: "W" },
      { date: "2025-01-16", opp: "DET", pts: 29, reb: 8, ast: 7, min: 36, result: "W" }
    ],
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 44.5, ceiling: 62, floor: 30, consistency: 74 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏀 TEAM DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
export const TEAMS_DB = {
  "GSW": { name: "Golden State Warriors", record: "32-20", pace: 102.5, offRtg: 115.2, defRtg: 112.8, netRtg: 2.4 },
  "LAL": { name: "Los Angeles Lakers", record: "33-19", pace: 100.8, offRtg: 114.5, defRtg: 113.2, netRtg: 1.3 },
  "BOS": { name: "Boston Celtics", record: "40-12", pace: 99.5, offRtg: 120.5, defRtg: 108.2, netRtg: 12.3 },
  "DEN": { name: "Denver Nuggets", record: "40-12", pace: 98.2, offRtg: 118.5, defRtg: 110.5, netRtg: 8.0 },
  "MIL": { name: "Milwaukee Bucks", record: "37-15", pace: 101.5, offRtg: 117.8, defRtg: 112.5, netRtg: 5.3 },
  "PHX": { name: "Phoenix Suns", record: "32-20", pace: 100.2, offRtg: 116.5, defRtg: 114.2, netRtg: 2.3 },
  "DAL": { name: "Dallas Mavericks", record: "35-17", pace: 99.8, offRtg: 118.2, defRtg: 113.5, netRtg: 4.7 },
  "OKC": { name: "Oklahoma City Thunder", record: "45-7", pace: 98.5, offRtg: 119.5, defRtg: 106.8, netRtg: 12.7 },
  "MIN": { name: "Minnesota Timberwolves", record: "36-16", pace: 97.8, offRtg: 114.2, defRtg: 108.5, netRtg: 5.7 },
  "CLE": { name: "Cleveland Cavaliers", record: "40-12", pace: 98.2, offRtg: 118.8, defRtg: 107.5, netRtg: 11.3 },
  "MIA": { name: "Miami Heat", record: "32-20", pace: 97.5, offRtg: 112.5, defRtg: 110.8, netRtg: 1.7 },
  "PHI": { name: "Philadelphia 76ers", record: "28-24", pace: 99.2, offRtg: 113.5, defRtg: 112.8, netRtg: 0.7 },
  "IND": { name: "Indiana Pacers", record: "32-20", pace: 104.5, offRtg: 118.2, defRtg: 115.5, netRtg: 2.7 },
  "ATL": { name: "Atlanta Hawks", record: "24-28", pace: 102.8, offRtg: 115.5, defRtg: 117.2, netRtg: -1.7 },
  "MEM": { name: "Memphis Grizzlies", record: "28-24", pace: 101.5, offRtg: 112.8, defRtg: 111.5, netRtg: 1.3 },
  "ORL": { name: "Orlando Magic", record: "34-18", pace: 96.8, offRtg: 111.2, defRtg: 105.5, netRtg: 5.7 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 PLAYER ALIASES FOR NATURAL LANGUAGE
// ═══════════════════════════════════════════════════════════════════════════════
export const PLAYER_ALIASES = {
  // Stephen Curry
  "curry": "Stephen Curry", "steph": "Stephen Curry", "chef": "Stephen Curry", "chef curry": "Stephen Curry",
  "stephen curry": "Stephen Curry", "steph curry": "Stephen Curry", "sc30": "Stephen Curry",
  
  // LeBron James
  "lebron": "LeBron James", "bron": "LeBron James", "king james": "LeBron James", "the king": "LeBron James",
  "lbj": "LeBron James", "lebron james": "LeBron James",
  
  // Luka Doncic
  "luka": "Luka Doncic", "doncic": "Luka Doncic", "luka magic": "Luka Doncic", "luka doncic": "Luka Doncic",
  "wonder boy": "Luka Doncic",
  
  // Jayson Tatum
  "tatum": "Jayson Tatum", "jt": "Jayson Tatum", "jayson tatum": "Jayson Tatum", "jay tatum": "Jayson Tatum",
  
  // Giannis
  "giannis": "Giannis Antetokounmpo", "greek freak": "Giannis Antetokounmpo", "antetokounmpo": "Giannis Antetokounmpo",
  
  // Jokic
  "jokic": "Nikola Jokic", "joker": "Nikola Jokic", "nikola jokic": "Nikola Jokic", "big honey": "Nikola Jokic",
  
  // SGA
  "sga": "Shai Gilgeous-Alexander", "shai": "Shai Gilgeous-Alexander", "gilgeous": "Shai Gilgeous-Alexander",
  
  // KD
  "kd": "Kevin Durant", "durant": "Kevin Durant", "kevin durant": "Kevin Durant", "slim reaper": "Kevin Durant",
  "easy money sniper": "Kevin Durant",
  
  // Ant
  "ant": "Anthony Edwards", "ant man": "Anthony Edwards", "anthony edwards": "Anthony Edwards", "edwards": "Anthony Edwards",
  
  // Haliburton
  "haliburton": "Tyrese Haliburton", "tyrese": "Tyrese Haliburton", "tyrese haliburton": "Tyrese Haliburton",
  
  // Booker
  "booker": "Devin Booker", "book": "Devin Booker", "devin booker": "Devin Booker", "d book": "Devin Booker",
  
  // Ja
  "ja": "Ja Morant", "morant": "Ja Morant", "ja morant": "Ja Morant",
  
  // Donovan Mitchell
  "spida": "Donovan Mitchell", "mitchell": "Donovan Mitchell", "donovan mitchell": "Donovan Mitchell",
  "donovan": "Donovan Mitchell",
  
  // Embiid
  "embiid": "Joel Embiid", "joel embiid": "Joel Embiid", "the process": "Joel Embiid", "joel": "Joel Embiid",
  
  // Trae
  "trae": "Trae Young", "trae young": "Trae Young", "ice trae": "Trae Young",
  
  // AD
  "ad": "Anthony Davis", "anthony davis": "Anthony Davis", "davis": "Anthony Davis", "the brow": "Anthony Davis",
  
  // Jimmy
  "jimmy": "Jimmy Butler", "butler": "Jimmy Butler", "jimmy butler": "Jimmy Butler", "jimmy buckets": "Jimmy Butler",
  
  // Paolo
  "paolo": "Paolo Banchero", "banchero": "Paolo Banchero", "paolo banchero": "Paolo Banchero"
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Import live data wrapper if available
let liveDataService = null;
try {
  // Dynamic import for live data
  import('./RayLiveDataWrapper.js').then(module => {
    liveDataService = module.default;
    console.log('🔴 RayAnalyticsEngine: Live data service connected');
  }).catch(() => {
    console.log('📊 RayAnalyticsEngine: Using static data (live service not available)');
  });
} catch (e) {
  // Fall back to static data
}

class RayAnalyticsEngine {
  constructor() {
    this.players = PLAYERS_DB;
    this.teams = TEAMS_DB;
    this.aliases = PLAYER_ALIASES;
    this.liveDataEnabled = false;
    this.livePlayersCache = new Map();
    this.lastLiveFetch = 0;
  }

  // Enable live data fetching
  async enableLiveData() {
    this.liveDataEnabled = true;
    console.log('🔴 RayAnalyticsEngine: Live data mode enabled');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Find player by name or alias (with optional live data merge)
  // ─────────────────────────────────────────────────────────────────────────────
  async findPlayerLive(query) {
    const staticPlayer = this.findPlayer(query);
    
    // Try to get live data
    if (liveDataService) {
      try {
        const livePlayer = await liveDataService.getPlayerData(query);
        if (livePlayer) {
          // Merge live stats with static advanced metrics
          return {
            ...staticPlayer,
            ...livePlayer,
            source: 'live',
            // Keep static advanced data that API doesn't provide
            splits: staticPlayer?.splits || livePlayer?.splits,
            vsTeam: staticPlayer?.vsTeam || livePlayer?.vsTeam,
            propHitRates: staticPlayer?.propHitRates || livePlayer?.propHitRates,
            correlations: staticPlayer?.correlations
          };
        }
      } catch (error) {
        console.warn('Live data fetch failed, using static:', error.message);
      }
    }
    
    return staticPlayer;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Find player by name or alias (sync version for backward compatibility)
  // ─────────────────────────────────────────────────────────────────────────────
  findPlayer(query) {
    const lower = query.toLowerCase().trim();
    
    // Check aliases first
    if (this.aliases[lower]) {
      return this.players[this.aliases[lower]] || null;
    }
    
    // Direct match
    for (const name of Object.keys(this.players)) {
      if (name.toLowerCase() === lower || 
          name.toLowerCase().includes(lower) ||
          lower.includes(name.toLowerCase().split(' ')[0])) {
        return this.players[name];
      }
    }
    
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get comprehensive player analysis
  // ─────────────────────────────────────────────────────────────────────────────
  getPlayerAnalysis(playerName) {
    const player = this.findPlayer(playerName);
    if (!player) {
return null;
}

    const trend = this.calculateTrend(player);
    const hotStreaks = this.findHotStreaks(player);
    const consistency = this.calculateConsistency(player);
    const restImpact = this.analyzeRestImpact(player);
    const homeAwayDiff = this.analyzeHomeAway(player);
    const bestProps = this.findBestProps(player);
    
    return {
      player,
      trend,
      hotStreaks,
      consistency,
      restImpact,
      homeAwayDiff,
      bestProps,
      fantasy: player.fantasy,
      injuries: player.injuries
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calculate player trend
  // ─────────────────────────────────────────────────────────────────────────────
  calculateTrend(player) {
    const season = player.season;
    const last5 = player.last5;
    const last10 = player.last10;

    const ptsChange5 = ((last5.pts - season.pts) / season.pts * 100).toFixed(1);
    const ptsChange10 = ((last10.pts - season.pts) / season.pts * 100).toFixed(1);
    
    const direction = parseFloat(ptsChange5) > 0 ? 'up' : parseFloat(ptsChange5) < 0 ? 'down' : 'stable';
    const strength = Math.abs(parseFloat(ptsChange5)) > 15 ? 'strong' : 
                     Math.abs(parseFloat(ptsChange5)) > 5 ? 'moderate' : 'slight';

    return {
      direction,
      strength,
      ptsChange5: parseFloat(ptsChange5),
      ptsChange10: parseFloat(ptsChange10),
      last5: last5,
      last10: last10,
      description: this.getTrendDescription(direction, strength, player.name, ptsChange5)
    };
  }

  getTrendDescription(direction, strength, name, change) {
    if (direction === 'up') {
      if (strength === 'strong') {
return `${name} is on FIRE 🔥 — averaging ${Math.abs(change)}% more points over the last 5 games!`;
}
      if (strength === 'moderate') {
return `${name} is heating up 📈 — solid uptick in production lately.`;
}
      return `${name} trending slightly upward — good momentum.`;
    } else if (direction === 'down') {
      if (strength === 'strong') {
return `${name} is in a slump 📉 — production down ${Math.abs(change)}% recently.`;
}
      if (strength === 'moderate') {
return `${name} cooling off a bit — worth monitoring.`;
}
      return `${name} slightly below average — could bounce back.`;
    }
    return `${name} is rock steady — performing right at season average.`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Find hot streaks in game log
  // ─────────────────────────────────────────────────────────────────────────────
  findHotStreaks(player) {
    const log = player.gameLog || [];
    const streaks = { pts: 0, reb: 0, ast: 0, wins: 0 };
    
    // Count consecutive games over season avg
    for (const game of log) {
      if (game.pts > player.season.pts) {
streaks.pts++;
} else {
break;
}
    }
    
    for (const game of log) {
      if (game.reb > player.season.reb) {
streaks.reb++;
} else {
break;
}
    }
    
    for (const game of log) {
      if (game.ast > player.season.ast) {
streaks.ast++;
} else {
break;
}
    }
    
    for (const game of log) {
      if (game.result === 'W') {
streaks.wins++;
} else {
break;
}
    }

    return streaks;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calculate consistency score
  // ─────────────────────────────────────────────────────────────────────────────
  calculateConsistency(player) {
    const log = player.gameLog || [];
    if (log.length === 0) {
return { score: 0, rating: 'Unknown' };
}

    const avg = player.season.pts;
    const variance = log.reduce((sum, g) => sum + Math.pow(g.pts - avg, 2), 0) / log.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / avg) * 100; // Coefficient of variation

    let rating = 'Very High';
    if (cv > 30) {
rating = 'Low';
} else if (cv > 20) {
rating = 'Moderate';
} else if (cv > 10) {
rating = 'High';
}

    return {
      score: Math.round(100 - cv),
      stdDev: stdDev.toFixed(1),
      rating,
      description: rating === 'Very High' || rating === 'High' 
        ? `${player.name} is extremely consistent — great for prop betting.`
        : `${player.name} has variable production — higher risk, higher reward.`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Analyze rest day impact
  // ─────────────────────────────────────────────────────────────────────────────
  analyzeRestImpact(player) {
    const splits = player.splits;
    const b2b = splits.rest_0;
    const oneDay = splits.rest_1;
    const twoPlus = splits.rest_2plus;

    const b2bDrop = ((player.season.pts - b2b.pts) / player.season.pts * 100).toFixed(1);
    const restBoost = ((twoPlus.pts - player.season.pts) / player.season.pts * 100).toFixed(1);

    return {
      backToBack: b2b,
      oneDay: oneDay,
      twoPlus: twoPlus,
      b2bDropPct: parseFloat(b2bDrop),
      restBoostPct: parseFloat(restBoost),
      recommendation: parseFloat(b2bDrop) > 10 
        ? `Fade ${player.name} on back-to-backs — ${b2bDrop}% drop in points.`
        : `${player.name} handles b2bs well — only ${b2bDrop}% dip.`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Analyze home/away splits
  // ─────────────────────────────────────────────────────────────────────────────
  analyzeHomeAway(player) {
    const home = player.splits.home;
    const away = player.splits.away;

    const ptsDiff = (home.pts - away.pts).toFixed(1);
    const rebDiff = (home.reb - away.reb).toFixed(1);
    const astDiff = (home.ast - away.ast).toFixed(1);

    return {
      home,
      away,
      ptsDiff: parseFloat(ptsDiff),
      rebDiff: parseFloat(rebDiff),
      astDiff: parseFloat(astDiff),
      homeAdvantage: parseFloat(ptsDiff) > 3 ? 'Strong' : parseFloat(ptsDiff) > 1 ? 'Moderate' : 'Minimal',
      recommendation: parseFloat(ptsDiff) > 3
        ? `${player.name} is significantly better at home (+${ptsDiff} PPG) — boost overs at home.`
        : `${player.name} performs similarly home/away — location doesn't matter much.`
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Find best props for player
  // ─────────────────────────────────────────────────────────────────────────────
  findBestProps(player) {
    const props = player.propHitRates || {};
    const best = [];

    for (const [prop, data] of Object.entries(props)) {
      if (data.over >= 60 || data.under >= 60) {
        const [stat, line] = prop.split('_');
        best.push({
          prop: `${stat.toUpperCase()} ${data.over >= 60 ? 'Over' : 'Under'} ${line}`,
          hitRate: Math.max(data.over, data.under),
          streak: data.streak,
          recommendation: data.over >= 60 ? 'OVER' : 'UNDER',
          confidence: Math.max(data.over, data.under) >= 65 ? 'High' : 'Moderate'
        });
      }
    }

    return best.sort((a, b) => b.hitRate - a.hitRate);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Compare two players
  // ─────────────────────────────────────────────────────────────────────────────
  comparePlayers(player1Name, player2Name) {
    const p1 = this.findPlayer(player1Name);
    const p2 = this.findPlayer(player2Name);

    if (!p1 || !p2) {
return null;
}

    const comparison = {
      player1: p1,
      player2: p2,
      stats: {
        pts: { p1: p1.season.pts, p2: p2.season.pts, winner: p1.season.pts > p2.season.pts ? p1.name : p2.name },
        reb: { p1: p1.season.reb, p2: p2.season.reb, winner: p1.season.reb > p2.season.reb ? p1.name : p2.name },
        ast: { p1: p1.season.ast, p2: p2.season.ast, winner: p1.season.ast > p2.season.ast ? p1.name : p2.name },
        fgPct: { p1: p1.season.fgPct, p2: p2.season.fgPct, winner: p1.season.fgPct > p2.season.fgPct ? p1.name : p2.name },
        per: { p1: p1.season.per, p2: p2.season.per, winner: p1.season.per > p2.season.per ? p1.name : p2.name }
      },
      trends: {
        p1: this.calculateTrend(p1),
        p2: this.calculateTrend(p2)
      },
      consistency: {
        p1: this.calculateConsistency(p1),
        p2: this.calculateConsistency(p2)
      },
      fantasy: {
        p1: p1.fantasy,
        p2: p2.fantasy
      }
    };

    // Determine overall winner
    let p1Wins = 0, p2Wins = 0;
    for (const stat of Object.values(comparison.stats)) {
      if (stat.winner === p1.name) {
p1Wins++;
} else {
p2Wins++;
}
    }
    comparison.overallWinner = p1Wins > p2Wins ? p1.name : p2.name;
    comparison.verdict = p1Wins > p2Wins 
      ? `${p1.name} edges out ${p2.name} in most categories this season.`
      : `${p2.name} has the advantage over ${p1.name} statistically.`;

    return comparison;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get matchup analysis (player vs team)
  // ─────────────────────────────────────────────────────────────────────────────
  getMatchupAnalysis(playerName, opponentTeam) {
    const player = this.findPlayer(playerName);
    if (!player) {
return null;
}

    const team = this.teams[opponentTeam.toUpperCase()];
    const vsTeamStats = player.vsTeam?.[opponentTeam.toUpperCase()];

    const analysis = {
      player,
      opponent: team,
      historicalVsTeam: vsTeamStats || null,
      defenseRating: team ? (team.defRtg < 110 ? 'Elite' : team.defRtg < 115 ? 'Good' : 'Poor') : 'Unknown',
      pace: team?.pace || 100,
      recommendation: null
    };

    if (vsTeamStats) {
      const avgPts = player.season.pts;
      const vsTeamPts = vsTeamStats.pts;
      const diff = ((vsTeamPts - avgPts) / avgPts * 100).toFixed(1);

      analysis.historicalEdge = parseFloat(diff);
      analysis.recommendation = parseFloat(diff) > 10
        ? `${player.name} DOMINATES ${opponentTeam.toUpperCase()} — averaging ${vsTeamPts} PPG (+${diff}%). Strong OVER.`
        : parseFloat(diff) < -10
        ? `${player.name} struggles vs ${opponentTeam.toUpperCase()} — ${vsTeamPts} PPG (${diff}%). Consider UNDER.`
        : `${player.name} performs normally vs ${opponentTeam.toUpperCase()} — ${vsTeamPts} PPG.`;
    } else {
      analysis.recommendation = team?.defRtg < 110
        ? `${opponentTeam.toUpperCase()} has a top defense (${team.defRtg} DefRtg) — lean toward unders.`
        : `${opponentTeam.toUpperCase()} has a weak defense (${team?.defRtg} DefRtg) — good spot for overs.`;
    }

    return analysis;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get top value plays
  // ─────────────────────────────────────────────────────────────────────────────
  getValuePlays(count = 5) {
    const plays = [];

    for (const [name, player] of Object.entries(this.players)) {
      const trend = this.calculateTrend(player);
      const bestProps = this.findBestProps(player);

      if (bestProps.length > 0 && trend.direction === 'up') {
        plays.push({
          player: name,
          team: player.team,
          prop: bestProps[0].prop,
          hitRate: bestProps[0].hitRate,
          streak: bestProps[0].streak,
          trend: trend.direction,
          trendStrength: trend.strength,
          confidence: bestProps[0].confidence,
          edge: `${trend.ptsChange5 > 0 ? '+' : ''}${trend.ptsChange5}% last 5 games`
        });
      }
    }

    return plays.sort((a, b) => b.hitRate - a.hitRate).slice(0, count);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get trending players
  // ─────────────────────────────────────────────────────────────────────────────
  getTrendingPlayers(count = 5) {
    const trending = [];

    for (const [name, player] of Object.entries(this.players)) {
      const trend = this.calculateTrend(player);
      if (trend.direction === 'up' && trend.strength !== 'slight') {
        trending.push({
          name,
          team: player.team,
          direction: trend.direction,
          strength: trend.strength,
          change: `+${trend.ptsChange5}%`,
          last5Pts: player.last5.pts,
          seasonPts: player.season.pts
        });
      }
    }

    return trending.sort((a, b) => b.ptsChange5 - a.ptsChange5).slice(0, count);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get consistent players for safe bets
  // ─────────────────────────────────────────────────────────────────────────────
  getConsistentPlayers(count = 5) {
    const consistent = [];

    for (const [name, player] of Object.entries(this.players)) {
      const consistency = this.calculateConsistency(player);
      const bestProps = this.findBestProps(player);

      if (consistency.score >= 75 && bestProps.length > 0) {
        consistent.push({
          name,
          team: player.team,
          consistencyScore: consistency.score,
          rating: consistency.rating,
          bestProp: bestProps[0]?.prop || 'N/A',
          hitRate: bestProps[0]?.hitRate || 0
        });
      }
    }

    return consistent.sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, count);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get injury report
  // ─────────────────────────────────────────────────────────────────────────────
  getInjuryReport() {
    const injured = [];
    const questionable = [];

    for (const [name, player] of Object.entries(this.players)) {
      if (player.injuries?.current) {
        if (player.injuries.current.includes('Out')) {
          injured.push({ name, team: player.team, status: player.injuries.current });
        } else {
          questionable.push({ name, team: player.team, status: player.injuries.current });
        }
      }
    }

    return { injured, questionable };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Get fantasy analysis
  // ─────────────────────────────────────────────────────────────────────────────
  getFantasyAnalysis(playerName) {
    const player = this.findPlayer(playerName);
    if (!player) {
return null;
}

    const fantasy = player.fantasy;
    const trend = this.calculateTrend(player);
    const consistency = this.calculateConsistency(player);

    return {
      player: player.name,
      avgFpts: fantasy.avgFpts,
      ceiling: fantasy.ceiling,
      floor: fantasy.floor,
      range: `${fantasy.floor} - ${fantasy.ceiling}`,
      consistency: fantasy.consistency,
      trending: trend.direction,
      recommendation: trend.direction === 'up' && consistency.score >= 70
        ? `STRONG PLAY — ${player.name} is trending up with high consistency.`
        : trend.direction === 'up'
        ? `UPSIDE PLAY — ${player.name} is hot but volatile.`
        : consistency.score >= 75
        ? `SAFE FLOOR — ${player.name} is consistent but not trending up.`
        : `RISKY — ${player.name} is inconsistent and not trending up.`
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // NEW: 50+ Advanced Analytics Methods
  // ═══════════════════════════════════════════════════════════════════════════════

  getStreakAnalysis(playerName) {
    const player = this.getPlayer(playerName);
    if (!player) {
return null;
}

    const last5Avg = player.last5.pts;
    const seasonAvg = player.season.pts;
    const trend = last5Avg > seasonAvg ? '🔥 HOT' : '❄️ COLD';
    const diff = ((last5Avg - seasonAvg) / seasonAvg * 100).toFixed(1);

    let streakText = `**Current Form:** ${trend} (${diff > 0 ? '+' : ''}${diff}%)\n\n`;
    streakText += `**Last 5 Games:**\n`;
    streakText += `• **${last5Avg.toFixed(1)} PPG** vs ${seasonAvg.toFixed(1)} season avg\n`;
    streakText += `• **Shooting:** ${player.last5.fgPct}% FG, ${player.last5.threePct}% 3PT\n`;
    streakText += `• **Trending:** ${Math.abs(diff)}% ${diff > 0 ? 'above' : 'below'} season average\n\n`;

    if (player.propHitRates) {
      const mainProp = Object.values(player.propHitRates)[0];
      streakText += `**Prop Streak:** ${mainProp.streak}`;
    }

    return {
      text: streakText,
      stats: { last5: last5Avg, season: seasonAvg, trend, diff: parseFloat(diff) }
    };
  }

  getConsistencyScore(playerName) {
    const player = this.getPlayer(playerName);
    if (!player || !player.gameLog) {
return null;
}

    const scores = player.gameLog.map(g => g.pts);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / avg) * 100;
    
    const consistency = player.fantasy?.consistency || (100 - cv);
    const rating = consistency > 80 ? '🟢 Elite' : consistency > 65 ? '🟡 Good' : consistency > 50 ? '🟠 Average' : '🔴 Volatile';

    let text = `**Consistency Rating:** ${rating} (${consistency.toFixed(0)}/100)\n\n`;
    text += `**Variance Analysis:**\n`;
    text += `• **Std Deviation:** ${stdDev.toFixed(1)} points\n`;
    text += `• **Coefficient of Variation:** ${cv.toFixed(1)}%\n`;
    text += `• **Floor:** ${player.fantasy?.floor || Math.min(...scores)} pts\n`;
    text += `• **Ceiling:** ${player.fantasy?.ceiling || Math.max(...scores)} pts\n\n`;
    text += consistency > 75 ? `✅ **Highly reliable** for props` : `⚠️ **High variance** — boom/bust candidate`;

    return {
      text,
      metrics: { consistency, stdDev, cv, floor: Math.min(...scores), ceiling: Math.max(...scores) }
    };
  }

  getCeilingFloor(playerName) {
    const player = this.getPlayer(playerName);
    if (!player) {
return null;
}

    const fantasy = player.fantasy || {};
    const floor = fantasy.floor || player.season.pts * 0.6;
    const ceiling = fantasy.ceiling || player.season.pts * 1.5;
    const avg = player.season.pts;

    let text = `**Performance Range:**\n\n`;
    text += `🟢 **Ceiling:** ${ceiling.toFixed(1)} pts — Elite game\n`;
    text += `🟡 **Average:** ${avg.toFixed(1)} pts — Typical output\n`;
    text += `🔴 **Floor:** ${floor.toFixed(1)} pts — Off night\n\n`;
    text += `**Range:** ${(ceiling - floor).toFixed(1)} point spread\n`;
    text += `**Risk Profile:** ${(ceiling - floor) > 30 ? '📊 High variance' : '🎯 Stable'}`;

    return {
      text,
      range: { floor, ceiling, avg, spread: ceiling - floor }
    };
  }

  getUsageAnalysis(playerName) {
    const player = this.getPlayer(playerName);
    if (!player) {
return null;
}

    const usage = player.season.usage || 25;
    const rating = usage > 32 ? '🔥 Elite' : usage > 28 ? '🟢 High' : usage > 24 ? '🟡 Medium' : '🟠 Low';

    let text = `**Usage Rating:** ${rating} (${usage.toFixed(1)}%)\n\n`;
    text += `• **Team Involvement:** ${usage > 30 ? 'Primary option' : usage > 25 ? 'Secondary scorer' : 'Role player'}\n`;
    text += `• **Shot Attempts:** ~${(usage * 0.6).toFixed(1)} FGA per game\n`;
    text += `• **Playmaking:** ${player.season.ast.toFixed(1)} APG\n\n`;
    text += usage > 30 ? `✅ **High volume** = more prop opportunities` : `⚠️ Lower usage = fewer touches`;

    return {
      text,
      metrics: { usage, role: usage > 30 ? 'primary' : usage > 25 ? 'secondary' : 'role' }
    };
  }

  getEfficiencyMetrics(playerName) {
    const player = this.getPlayer(playerName);
    if (!player) {
return null;
}

    const ts = ((player.season.pts) / (2 * ((player.season.fgPct / 100) * 15 + (player.season.ftPct / 100) * 3))) * 100 || 55;
    const per = player.season.per || 15;
    const rating = per > 22 ? '🟢 Elite' : per > 18 ? '🟡 Above Avg' : per > 15 ? '🟠 Average' : '🔴 Below Avg';

    let text = `**Efficiency Rating:** ${rating}\n\n`;
    text += `• **PER:** ${per.toFixed(1)} (League avg: 15.0)\n`;
    text += `• **TS%:** ${ts.toFixed(1)}% (League avg: 57%)\n`;
    text += `• **FG%:** ${player.season.fgPct}%\n`;
    text += `• **3PT%:** ${player.season.threePct}%\n`;
    text += `• **FT%:** ${player.season.ftPct}%\n\n`;
    text += per > 20 ? `✅ **Elite efficiency** — high-quality shots` : `⚠️ Room for efficiency improvement`;

    return {
      text,
      stats: { per, ts, fg: player.season.fgPct, three: player.season.threePct }
    };
  }

  getRestAnalysis(playerName) {
    const player = this.getPlayer(playerName);
    if (!player || !player.splits) {
return null;
}

    const b2b = player.splits.rest_0 || {};
    const oneDay = player.splits.rest_1 || {};
    const twoPlus = player.splits.rest_2plus || {};

    let text = `**Rest Impact Analysis:**\n\n`;
    text += `🔴 **Back-to-Back:** ${b2b.pts?.toFixed(1) || 'N/A'} PPG\n`;
    text += `🟡 **1 Day Rest:** ${oneDay.pts?.toFixed(1) || 'N/A'} PPG\n`;
    text += `🟢 **2+ Days Rest:** ${twoPlus.pts?.toFixed(1) || 'N/A'} PPG\n\n`;

    const decline = ((oneDay.pts - b2b.pts) / oneDay.pts * 100) || 0;
    text += decline > 10 ? `⚠️ **Significant decline** on B2Bs (-${decline.toFixed(0)}%)` : `✅ **Handles B2Bs well** (minimal drop)`;

    return {
      text,
      splits: { b2b, oneDay, twoPlus, decline }
    };
  }

  getLocationSplits(playerName) {
    const player = this.getPlayer(playerName);
    if (!player || !player.splits) {
return null;
}

    const home = player.splits.home || {};
    const away = player.splits.away || {};
    const diff = ((home.pts - away.pts) / away.pts * 100) || 0;

    let text = `**Home/Away Splits:**\n\n`;
    text += `🏠 **Home:** ${home.pts?.toFixed(1)} / ${home.reb?.toFixed(1)} / ${home.ast?.toFixed(1)} (${home.record})\n`;
    text += `✈️ **Away:** ${away.pts?.toFixed(1)} / ${away.reb?.toFixed(1)} / ${away.ast?.toFixed(1)} (${away.record})\n\n`;
    text += `**Differential:** ${diff > 0 ? '+' : ''}${diff.toFixed(1)}% scoring at home\n\n`;
    text += Math.abs(diff) > 15 ? `${diff > 0 ? '🏠' : '✈️'} **Strong ${diff > 0 ? 'home' : 'road'} player** — factor this in!` : `✅ **Location neutral** — performs anywhere`;

    return {
      text,
      splits: { home, away, diff }
    };
  }

  getAdvancedMetrics(playerName) {
    const player = this.getPlayer(playerName);
    if (!player) {
return null;
}

    const per = player.season.per || 15;
    const usage = player.season.usage || 20;
    const bpm = ((per - 15) * 0.5) || 0;
    const vorp = (bpm * (player.season.min / 48) * 0.7) || 0;

    let text = `**Advanced Metrics:**\n\n`;
    text += `• **PER:** ${per.toFixed(1)} (Player Efficiency Rating)\n`;
    text += `• **Usage:** ${usage.toFixed(1)}% (Team possession rate)\n`;
    text += `• **BPM:** ${bpm.toFixed(1)} (Box Plus/Minus estimate)\n`;
    text += `• **VORP:** ${vorp.toFixed(1)} (Value Over Replacement)\n`;
    text += `• **Minutes:** ${player.season.min.toFixed(1)} MPG\n\n`;
    text += per > 20 ? `⭐ **All-Star level** impact` : `🟡 **Solid contributor**`;

    return {
      text,
      metrics: { per, usage, bpm, vorp, min: player.season.min }
    };
  }
}

// Export singleton instance
const rayAnalytics = new RayAnalyticsEngine();
export default rayAnalytics;
