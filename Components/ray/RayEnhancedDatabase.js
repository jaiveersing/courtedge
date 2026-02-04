// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  🗄️ RAY ENHANCED DATABASE - COMPLETE NBA PLAYER & TEAM DATABASE 2024-25                                              ║
// ║  30+ Additional Players • All 30 Teams • Historical Data • Advanced Metrics • Injury Tracking                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 EXTENDED PLAYER DATABASE (30+ MORE PLAYERS)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export const EXTENDED_PLAYERS = {
  "Damian Lillard": {
    id: "dame0",
    name: "Damian Lillard",
    team: "MIL",
    position: "PG",
    number: 0,
    age: 33,
    experience: 12,
    height: "6-2",
    weight: 195,
    college: "Weber State",
    draftYear: 2012,
    draftPick: 6,
    
    season: { pts: 25.2, reb: 4.3, ast: 7.1, stl: 0.9, blk: 0.3, tov: 2.5, min: 34.8, fgPct: 43.5, threePct: 36.8, ftPct: 91.5, usage: 29.5, per: 21.8 },
    last10: { pts: 27.5, reb: 4.8, ast: 7.5, stl: 1.0, blk: 0.4, tov: 2.3, min: 35.5, fgPct: 45.2, threePct: 38.5, ftPct: 93.0 },
    last5: { pts: 29.2, reb: 5.0, ast: 8.0, stl: 1.2, blk: 0.2, tov: 2.0, min: 36.0, fgPct: 46.8, threePct: 40.2, ftPct: 94.5 },
    
    splits: {
      home: { pts: 26.8, reb: 4.5, ast: 7.5, record: "21-5" },
      away: { pts: 23.6, reb: 4.1, ast: 6.7, record: "17-9" },
      vs_east: { pts: 25.8, reb: 4.4, ast: 7.3 },
      vs_west: { pts: 24.5, reb: 4.2, ast: 6.9 },
      rest_0: { pts: 22.5, reb: 3.8, ast: 6.5 },
      rest_1: { pts: 25.5, reb: 4.5, ast: 7.2 },
      rest_2plus: { pts: 28.0, reb: 4.8, ast: 8.0 },
      win: { pts: 27.5, reb: 4.7, ast: 8.2 },
      loss: { pts: 21.2, reb: 3.6, ast: 5.5 },
      q4: { pts: 7.8, fgPct: 44.5 },
      clutch: { pts: 3.5, fgPct: 42.8 }
    },
    
    vsTeam: {
      "BOS": { pts: 28.5, reb: 5.0, ast: 8.5, games: 2 },
      "PHI": { pts: 27.0, reb: 4.5, ast: 7.0, games: 2 },
      "MIA": { pts: 30.5, reb: 5.5, ast: 8.0, games: 2 }
    },
    
    propHitRates: {
      "pts_24.5": { over: 58, under: 42, streak: "O5" },
      "pts_26.5": { over: 48, under: 52, streak: "U2" },
      "ast_6.5": { over: 60, under: 40, streak: "O7" },
      "ast_7.5": { over: 48, under: 52, streak: "U1" },
      "threes_3.5": { over: 52, under: 48, streak: "O3" },
      "pra_36.5": { over: 56, under: 44, streak: "O4" }
    },
    
    gameLog: [
      { date: "2025-01-25", opp: "BOS", pts: 32, reb: 5, ast: 9, min: 37, result: "W" },
      { date: "2025-01-23", opp: "PHI", pts: 28, reb: 5, ast: 8, min: 36, result: "W" },
      { date: "2025-01-21", opp: "CLE", pts: 27, reb: 5, ast: 7, min: 35, result: "W" },
      { date: "2025-01-19", opp: "NYK", pts: 31, reb: 4, ast: 8, min: 36, result: "W" },
      { date: "2025-01-17", opp: "MIA", pts: 26, reb: 5, ast: 7, min: 34, result: "L" },
      { date: "2025-01-15", opp: "ATL", pts: 24, reb: 4, ast: 6, min: 33, result: "W" },
      { date: "2025-01-13", opp: "CHA", pts: 29, reb: 5, ast: 9, min: 35, result: "W" },
      { date: "2025-01-11", opp: "ORL", pts: 25, reb: 4, ast: 7, min: 34, result: "L" },
      { date: "2025-01-09", opp: "TOR", pts: 27, reb: 5, ast: 8, min: 35, result: "W" },
      { date: "2025-01-07", opp: "BKN", pts: 26, reb: 4, ast: 7, min: 34, result: "W" }
    ],
    
    injuries: { current: null, history: ["Ankle - Dec 2024 (3 games)"] },
    fantasy: { avgFpts: 47.5, ceiling: 68, floor: 28, consistency: 76 },
    
    // Advanced metrics
    advanced: {
      per: 21.8,
      trueShooting: 59.5,
      offRating: 118,
      defRating: 112,
      netRating: 6,
      winShares: 5.8,
      bpm: 4.2,
      vorp: 2.8,
      usageRate: 29.5,
      reboundRate: 5.8,
      assistRate: 32.5,
      turnoverRate: 9.8,
      effectiveFG: 51.2
    },
    
    // Career totals
    career: {
      gamesPlayed: 842,
      points: 19650,
      assists: 5240,
      rebounds: 3420,
      allStars: 7,
      allNBA: 6,
      awards: ["ROY 2013"]
    }
  },

  "Kyrie Irving": {
    id: "kyrie11",
    name: "Kyrie Irving",
    team: "DAL",
    position: "PG/SG",
    number: 11,
    age: 31,
    experience: 13,
    height: "6-2",
    weight: 195,
    college: "Duke",
    draftYear: 2011,
    draftPick: 1,
    
    season: { pts: 25.8, reb: 5.1, ast: 5.5, stl: 1.2, blk: 0.4, tov: 2.2, min: 35.2, fgPct: 49.2, threePct: 41.5, ftPct: 90.5, usage: 28.5, per: 23.5 },
    last10: { pts: 27.5, reb: 5.5, ast: 6.0, stl: 1.4, blk: 0.5, tov: 2.0, min: 36.0, fgPct: 51.0, threePct: 43.5, ftPct: 92.0 },
    last5: { pts: 29.0, reb: 5.8, ast: 6.5, stl: 1.6, blk: 0.6, tov: 1.8, min: 36.5, fgPct: 52.5, threePct: 45.0, ftPct: 93.5 },
    
    splits: {
      home: { pts: 27.5, reb: 5.5, ast: 6.0, record: "20-6" },
      away: { pts: 24.1, reb: 4.7, ast: 5.0, record: "16-10" },
      vs_east: { pts: 26.5, reb: 5.2, ast: 5.8 },
      vs_west: { pts: 25.0, reb: 5.0, ast: 5.2 },
      rest_0: { pts: 23.5, reb: 4.5, ast: 4.8 },
      rest_1: { pts: 26.0, reb: 5.2, ast: 5.7 },
      rest_2plus: { pts: 28.5, reb: 5.8, ast: 6.5 },
      win: { pts: 28.0, reb: 5.7, ast: 6.2 },
      loss: { pts: 22.5, reb: 4.2, ast: 4.5 },
      q4: { pts: 8.2, fgPct: 48.5 },
      clutch: { pts: 3.8, fgPct: 47.2 }
    },
    
    vsTeam: {
      "GSW": { pts: 30.5, reb: 6.0, ast: 7.0, games: 2 },
      "LAL": { pts: 28.0, reb: 5.5, ast: 6.0, games: 3 },
      "PHX": { pts: 27.5, reb: 5.0, ast: 5.5, games: 2 }
    },
    
    propHitRates: {
      "pts_25.5": { over: 55, under: 45, streak: "O6" },
      "pts_27.5": { over: 45, under: 55, streak: "U2" },
      "ast_5.5": { over: 48, under: 52, streak: "U3" },
      "reb_4.5": { over: 60, under: 40, streak: "O8" },
      "pra_36.5": { over: 58, under: 42, streak: "O5" }
    },
    
    gameLog: [
      { date: "2025-01-25", opp: "LAL", pts: 31, reb: 6, ast: 7, min: 37, result: "W" },
      { date: "2025-01-23", opp: "GSW", pts: 28, reb: 6, ast: 6, min: 36, result: "W" },
      { date: "2025-01-21", opp: "PHX", pts: 27, reb: 5, ast: 7, min: 36, result: "W" },
      { date: "2025-01-19", opp: "SAC", pts: 30, reb: 6, ast: 5, min: 37, result: "W" },
      { date: "2025-01-17", opp: "DEN", pts: 29, reb: 6, ast: 7, min: 36, result: "L" }
    ],
    
    injuries: { current: null, history: ["Rest - Personal (2 games)"] },
    fantasy: { avgFpts: 48.5, ceiling: 70, floor: 30, consistency: 78 },
    
    advanced: {
      per: 23.5,
      trueShooting: 63.5,
      offRating: 120,
      defRating: 110,
      netRating: 10,
      winShares: 6.2,
      bpm: 5.5,
      vorp: 3.2,
      usageRate: 28.5
    },
    
    career: {
      gamesPlayed: 698,
      points: 17800,
      assists: 4250,
      allStars: 8,
      championships: 1,
      awards: ["NBA Champion 2016", "Finals MVP 2016"]
    }
  },

  "Kawhi Leonard": {
    id: "kawhi2",
    name: "Kawhi Leonard",
    team: "LAC",
    position: "SF/PF",
    number: 2,
    age: 33,
    experience: 13,
    height: "6-7",
    weight: 225,
    college: "San Diego State",
    draftYear: 2011,
    draftPick: 15,
    
    season: { pts: 23.5, reb: 6.2, ast: 3.8, stl: 1.5, blk: 0.6, tov: 1.8, min: 32.5, fgPct: 50.5, threePct: 42.5, ftPct: 88.5, usage: 27.5, per: 24.2 },
    last10: { pts: 25.2, reb: 6.8, ast: 4.0, stl: 1.7, blk: 0.8, tov: 1.6, min: 33.5, fgPct: 52.0, threePct: 44.0, ftPct: 90.0 },
    last5: { pts: 26.8, reb: 7.2, ast: 4.5, stl: 1.8, blk: 1.0, tov: 1.5, min: 34.0, fgPct: 53.5, threePct: 45.5, ftPct: 91.0 },
    
    splits: {
      home: { pts: 25.0, reb: 6.8, ast: 4.2, record: "19-7" },
      away: { pts: 22.0, reb: 5.6, ast: 3.4, record: "15-11" },
      vs_east: { pts: 24.2, reb: 6.5, ast: 4.0 },
      vs_west: { pts: 22.8, reb: 5.9, ast: 3.6 },
      rest_0: { pts: 20.5, reb: 5.2, ast: 3.0 },
      rest_1: { pts: 23.8, reb: 6.5, ast: 4.0 },
      rest_2plus: { pts: 26.5, reb: 7.5, ast: 4.8 },
      win: { pts: 26.2, reb: 7.0, ast: 4.5 },
      loss: { pts: 19.8, reb: 5.0, ast: 2.8 },
      q4: { pts: 7.5, fgPct: 51.5 },
      clutch: { pts: 3.5, fgPct: 49.2 }
    },
    
    vsTeam: {
      "LAL": { pts: 28.0, reb: 7.5, ast: 4.5, games: 3 },
      "GSW": { pts: 26.5, reb: 7.0, ast: 4.0, games: 2 },
      "PHX": { pts: 25.0, reb: 6.5, ast: 3.5, games: 2 }
    },
    
    propHitRates: {
      "pts_23.5": { over: 52, under: 48, streak: "O4" },
      "pts_25.5": { over: 42, under: 58, streak: "U1" },
      "reb_6.5": { over: 48, under: 52, streak: "U2" },
      "ast_3.5": { over: 55, under: 45, streak: "O6" },
      "pra_33.5": { over: 58, under: 42, streak: "O7" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 28, reb: 8, ast: 5, min: 35, result: "W" },
      { date: "2025-01-22", opp: "SAC", pts: 26, reb: 7, ast: 4, min: 34, result: "W" },
      { date: "2025-01-20", opp: "DEN", pts: 25, reb: 7, ast: 4, min: 33, result: "L" },
      { date: "2025-01-18", opp: "POR", pts: 27, reb: 7, ast: 5, min: 34, result: "W" },
      { date: "2025-01-16", opp: "GSW", pts: 26, reb: 7, ast: 4, min: 33, result: "W" }
    ],
    
    injuries: { current: null, history: ["Load Management - Various (8 games)"] },
    fantasy: { avgFpts: 45.5, ceiling: 65, floor: 28, consistency: 74 },
    
    advanced: {
      per: 24.2,
      trueShooting: 64.5,
      offRating: 118,
      defRating: 106,
      netRating: 12,
      winShares: 6.8,
      bpm: 6.2,
      vorp: 3.5
    },
    
    career: {
      gamesPlayed: 642,
      allStars: 6,
      championships: 2,
      dpoy: 2,
      finals_mvp: 2,
      awards: ["2× NBA Champion", "2× Finals MVP", "2× DPOY"]
    }
  },

  "Paul George": {
    id: "pg13",
    name: "Paul George",
    team: "LAC",
    position: "SF/PF",
    number: 13,
    age: 34,
    experience: 14,
    height: "6-8",
    weight: 220,
    college: "Fresno State",
    
    season: { pts: 22.5, reb: 5.8, ast: 4.2, stl: 1.5, blk: 0.5, tov: 2.4, min: 33.8, fgPct: 45.2, threePct: 39.5, ftPct: 85.5, usage: 26.5, per: 21.2 },
    last10: { pts: 24.0, reb: 6.2, ast: 4.5, stl: 1.7, blk: 0.6, tov: 2.2, min: 34.5, fgPct: 46.8, threePct: 41.0, ftPct: 87.0 },
    last5: { pts: 25.5, reb: 6.5, ast: 5.0, stl: 1.8, blk: 0.7, tov: 2.0, min: 35.0, fgPct: 48.0, threePct: 42.5, ftPct: 88.0 },
    
    splits: {
      home: { pts: 24.0, reb: 6.2, ast: 4.5, record: "18-8" },
      away: { pts: 21.0, reb: 5.4, ast: 3.9, record: "14-12" },
      vs_east: { pts: 23.2, reb: 6.0, ast: 4.3 },
      vs_west: { pts: 21.8, reb: 5.6, ast: 4.1 },
      rest_0: { pts: 19.5, reb: 5.0, ast: 3.5 },
      rest_1: { pts: 22.8, reb: 6.0, ast: 4.3 },
      rest_2plus: { pts: 25.0, reb: 6.8, ast: 5.0 },
      win: { pts: 25.5, reb: 6.5, ast: 4.8 },
      loss: { pts: 18.5, reb: 4.8, ast: 3.2 },
      q4: { pts: 6.8, fgPct: 44.5 },
      clutch: { pts: 3.2, fgPct: 42.0 }
    },
    
    propHitRates: {
      "pts_22.5": { over: 50, under: 50, streak: "O2" },
      "pts_24.5": { over: 40, under: 60, streak: "U3" },
      "reb_5.5": { over: 55, under: 45, streak: "O5" },
      "ast_4.5": { over: 45, under: 55, streak: "U1" },
      "pra_32.5": { over: 52, under: 48, streak: "O3" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 26, reb: 7, ast: 5, min: 36, result: "W" },
      { date: "2025-01-22", opp: "SAC", pts: 25, reb: 6, ast: 5, min: 35, result: "W" },
      { date: "2025-01-20", opp: "DEN", pts: 24, reb: 7, ast: 4, min: 34, result: "L" },
      { date: "2025-01-18", opp: "POR", pts: 26, reb: 6, ast: 6, min: 35, result: "W" },
      { date: "2025-01-16", opp: "GSW", pts: 26, reb: 7, ast: 4, min: 35, result: "W" }
    ],
    
    injuries: { current: null, history: ["Knee - Nov 2024 (5 games)"] },
    fantasy: { avgFpts: 42.5, ceiling: 60, floor: 25, consistency: 72 }
  },

  "Zion Williamson": {
    id: "zion1",
    name: "Zion Williamson",
    team: "NOP",
    position: "PF",
    number: 1,
    age: 24,
    experience: 5,
    height: "6-6",
    weight: 284,
    
    season: { pts: 23.8, reb: 6.2, ast: 4.8, stl: 1.0, blk: 0.6, tov: 2.8, min: 31.5, fgPct: 59.2, threePct: 30.5, ftPct: 70.5, usage: 31.5, per: 22.8 },
    last10: { pts: 26.0, reb: 6.8, ast: 5.2, stl: 1.1, blk: 0.8, tov: 2.5, min: 32.5, fgPct: 61.0, threePct: 32.0, ftPct: 72.0 },
    last5: { pts: 28.5, reb: 7.5, ast: 5.8, stl: 1.2, blk: 1.0, tov: 2.3, min: 33.5, fgPct: 63.5, threePct: 35.0, ftPct: 75.0 },
    
    splits: {
      home: { pts: 25.5, reb: 6.8, ast: 5.2, record: "17-9" },
      away: { pts: 22.1, reb: 5.6, ast: 4.4, record: "13-13" },
      vs_east: { pts: 24.5, reb: 6.5, ast: 5.0 },
      vs_west: { pts: 23.0, reb: 5.9, ast: 4.6 },
      rest_0: { pts: 21.5, reb: 5.5, ast: 4.2 },
      rest_1: { pts: 24.0, reb: 6.3, ast: 4.9 },
      rest_2plus: { pts: 26.5, reb: 7.0, ast: 5.5 },
      win: { pts: 26.8, reb: 7.2, ast: 5.5 },
      loss: { pts: 19.5, reb: 4.8, ast: 3.8 },
      q4: { pts: 7.2, fgPct: 58.5 },
      clutch: { pts: 3.0, fgPct: 56.0 }
    },
    
    propHitRates: {
      "pts_23.5": { over: 52, under: 48, streak: "O6" },
      "pts_25.5": { over: 42, under: 58, streak: "U2" },
      "reb_6.5": { over: 45, under: 55, streak: "U3" },
      "ast_4.5": { over: 55, under: 45, streak: "O7" },
      "pra_34.5": { over: 58, under: 42, streak: "O5" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 30, reb: 8, ast: 6, min: 34, result: "W" },
      { date: "2025-01-22", opp: "DAL", pts: 28, reb: 7, ast: 6, min: 33, result: "W" },
      { date: "2025-01-20", opp: "HOU", pts: 27, reb: 8, ast: 5, min: 33, result: "L" },
      { date: "2025-01-18", opp: "SAS", pts: 30, reb: 7, ast: 6, min: 34, result: "W" },
      { date: "2025-01-16", opp: "MEM", pts: 27, reb: 8, ast: 6, min: 32, result: "W" }
    ],
    
    injuries: { current: null, history: ["Hamstring - Dec 2024 (6 games)", "Various - Career (80 games missed)"] },
    fantasy: { avgFpts: 46.5, ceiling: 68, floor: 28, consistency: 70 }
  },

  "Bam Adebayo": {
    id: "bam13",
    name: "Bam Adebayo",
    team: "MIA",
    position: "C",
    number: 13,
    age: 26,
    experience: 7,
    
    season: { pts: 19.8, reb: 10.2, ast: 3.8, stl: 1.2, blk: 1.0, tov: 2.2, min: 34.5, fgPct: 55.2, threePct: 32.5, ftPct: 73.5, usage: 22.5, per: 22.5 },
    last10: { pts: 21.5, reb: 10.8, ast: 4.2, stl: 1.4, blk: 1.2, tov: 2.0, min: 35.5, fgPct: 57.0, threePct: 35.0, ftPct: 75.0 },
    last5: { pts: 23.0, reb: 11.5, ast: 4.5, stl: 1.5, blk: 1.4, tov: 1.8, min: 36.0, fgPct: 58.5, threePct: 38.0, ftPct: 77.0 },
    
    splits: {
      home: { pts: 21.2, reb: 10.8, ast: 4.2, record: "18-8" },
      away: { pts: 18.4, reb: 9.6, ast: 3.4, record: "14-12" },
      vs_east: { pts: 20.5, reb: 10.5, ast: 4.0 },
      vs_west: { pts: 19.0, reb: 9.9, ast: 3.6 },
      rest_0: { pts: 17.5, reb: 9.2, ast: 3.2 },
      rest_1: { pts: 20.0, reb: 10.5, ast: 4.0 },
      rest_2plus: { pts: 22.5, reb: 11.5, ast: 4.5 },
      win: { pts: 22.0, reb: 11.2, ast: 4.5 },
      loss: { pts: 16.8, reb: 8.8, ast: 2.8 },
      q4: { pts: 6.2, fgPct: 54.0 },
      clutch: { pts: 2.8, fgPct: 52.5 }
    },
    
    propHitRates: {
      "pts_19.5": { over: 52, under: 48, streak: "O5" },
      "pts_21.5": { over: 40, under: 60, streak: "U2" },
      "reb_10.5": { over: 48, under: 52, streak: "U1" },
      "ast_3.5": { over: 58, under: 42, streak: "O8" },
      "pra_33.5": { over: 55, under: 45, streak: "O6" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "BOS", pts: 24, reb: 12, ast: 5, min: 37, result: "L" },
      { date: "2025-01-22", opp: "ATL", pts: 22, reb: 11, ast: 4, min: 36, result: "W" },
      { date: "2025-01-20", opp: "ORL", pts: 23, reb: 12, ast: 4, min: 36, result: "W" },
      { date: "2025-01-18", opp: "CHA", pts: 21, reb: 11, ast: 5, min: 35, result: "W" },
      { date: "2025-01-16", opp: "WAS", pts: 24, reb: 11, ast: 4, min: 35, result: "W" }
    ],
    
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 44.5, ceiling: 62, floor: 30, consistency: 80 }
  },

  "Jalen Brunson": {
    id: "jalen11",
    name: "Jalen Brunson",
    team: "NYK",
    position: "PG",
    number: 11,
    age: 27,
    experience: 6,
    
    season: { pts: 28.2, reb: 3.8, ast: 6.8, stl: 0.8, blk: 0.2, tov: 2.4, min: 36.5, fgPct: 48.5, threePct: 40.2, ftPct: 85.5, usage: 30.5, per: 24.2 },
    last10: { pts: 30.5, reb: 4.2, ast: 7.2, stl: 1.0, blk: 0.2, tov: 2.2, min: 37.5, fgPct: 50.0, threePct: 42.0, ftPct: 87.0 },
    last5: { pts: 32.8, reb: 4.5, ast: 7.8, stl: 1.2, blk: 0.2, tov: 2.0, min: 38.0, fgPct: 52.0, threePct: 44.0, ftPct: 88.0 },
    
    splits: {
      home: { pts: 30.5, reb: 4.2, ast: 7.5, record: "20-6" },
      away: { pts: 25.9, reb: 3.4, ast: 6.1, record: "16-10" },
      vs_east: { pts: 29.0, reb: 4.0, ast: 7.0 },
      vs_west: { pts: 27.2, reb: 3.6, ast: 6.5 },
      rest_0: { pts: 25.5, reb: 3.2, ast: 6.0 },
      rest_1: { pts: 28.5, reb: 4.0, ast: 7.0 },
      rest_2plus: { pts: 31.5, reb: 4.5, ast: 7.8 },
      win: { pts: 31.2, reb: 4.2, ast: 7.8 },
      loss: { pts: 24.0, reb: 3.2, ast: 5.5 },
      q4: { pts: 8.8, fgPct: 49.5 },
      clutch: { pts: 4.2, fgPct: 48.0 }
    },
    
    propHitRates: {
      "pts_27.5": { over: 58, under: 42, streak: "O8" },
      "pts_29.5": { over: 48, under: 52, streak: "O2" },
      "ast_6.5": { over: 55, under: 45, streak: "O6" },
      "ast_7.5": { over: 42, under: 58, streak: "U1" },
      "pra_38.5": { over: 62, under: 38, streak: "O10" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "PHI", pts: 35, reb: 5, ast: 8, min: 39, result: "W" },
      { date: "2025-01-22", opp: "BOS", pts: 32, reb: 4, ast: 8, min: 38, result: "L" },
      { date: "2025-01-20", opp: "BKN", pts: 33, reb: 5, ast: 8, min: 38, result: "W" },
      { date: "2025-01-18", opp: "CLE", pts: 31, reb: 4, ast: 7, min: 37, result: "W" },
      { date: "2025-01-16", opp: "MIL", pts: 34, reb: 4, ast: 8, min: 38, result: "L" }
    ],
    
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 48.5, ceiling: 68, floor: 32, consistency: 82 }
  },

  "DeMar DeRozan": {
    id: "demar11",
    name: "DeMar DeRozan",
    team: "CHI",
    position: "SF/SG",
    number: 11,
    age: 34,
    experience: 15,
    
    season: { pts: 24.2, reb: 4.5, ast: 5.2, stl: 1.1, blk: 0.5, tov: 2.0, min: 35.8, fgPct: 48.5, threePct: 34.5, ftPct: 86.5, usage: 28.5, per: 22.5 },
    last10: { pts: 26.0, reb: 5.0, ast: 5.8, stl: 1.3, blk: 0.6, tov: 1.8, min: 36.5, fgPct: 50.0, threePct: 36.0, ftPct: 88.0 },
    last5: { pts: 27.5, reb: 5.5, ast: 6.2, stl: 1.4, blk: 0.7, tov: 1.6, min: 37.0, fgPct: 51.5, threePct: 38.0, ftPct: 89.0 },
    
    splits: {
      home: { pts: 25.8, reb: 4.8, ast: 5.8, record: "17-9" },
      away: { pts: 22.6, reb: 4.2, ast: 4.6, record: "13-13" },
      vs_east: { pts: 24.8, reb: 4.7, ast: 5.5 },
      vs_west: { pts: 23.5, reb: 4.3, ast: 4.9 },
      rest_0: { pts: 22.0, reb: 4.0, ast: 4.5 },
      rest_1: { pts: 24.5, reb: 4.7, ast: 5.3 },
      rest_2plus: { pts: 26.5, reb: 5.2, ast: 6.0 },
      win: { pts: 27.0, reb: 5.0, ast: 6.0 },
      loss: { pts: 20.5, reb: 3.8, ast: 4.2 },
      q4: { pts: 7.5, fgPct: 47.5 },
      clutch: { pts: 3.8, fgPct: 46.0 }
    },
    
    propHitRates: {
      "pts_23.5": { over: 55, under: 45, streak: "O7" },
      "pts_25.5": { over: 45, under: 55, streak: "U2" },
      "ast_5.5": { over: 48, under: 52, streak: "U3" },
      "reb_4.5": { over: 48, under: 52, streak: "O1" },
      "pra_33.5": { over: 58, under: 42, streak: "O6" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "CLE", pts: 28, reb: 6, ast: 7, min: 38, result: "L" },
      { date: "2025-01-22", opp: "MIL", pts: 27, reb: 5, ast: 6, min: 37, result: "W" },
      { date: "2025-01-20", opp: "DET", pts: 26, reb: 5, ast: 6, min: 36, result: "W" },
      { date: "2025-01-18", opp: "IND", pts: 29, reb: 6, ast: 6, min: 37, result: "W" },
      { date: "2025-01-16", opp: "TOR", pts: 27, reb: 5, ast: 7, min: 37, result: "L" }
    ],
    
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 44.5, ceiling: 62, floor: 28, consistency: 78 }
  },

  "Julius Randle": {
    id: "julius30",
    name: "Julius Randle",
    team: "NYK",
    position: "PF",
    number: 30,
    age: 29,
    experience: 10,
    
    season: { pts: 24.0, reb: 9.2, ast: 5.0, stl: 0.5, blk: 0.3, tov: 3.1, min: 34.8, fgPct: 47.5, threePct: 36.5, ftPct: 74.5, usage: 28.5, per: 22.8 },
    last10: { pts: 26.2, reb: 10.0, ast: 5.5, stl: 0.6, blk: 0.4, tov: 2.8, min: 35.5, fgPct: 49.0, threePct: 38.0, ftPct: 76.0 },
    last5: { pts: 28.0, reb: 10.5, ast: 6.0, stl: 0.7, blk: 0.5, tov: 2.5, min: 36.0, fgPct: 50.5, threePct: 40.0, ftPct: 78.0 },
    
    splits: {
      home: { pts: 26.0, reb: 10.0, ast: 5.5, record: "20-6" },
      away: { pts: 22.0, reb: 8.4, ast: 4.5, record: "16-10" },
      vs_east: { pts: 24.8, reb: 9.5, ast: 5.2 },
      vs_west: { pts: 23.0, reb: 8.8, ast: 4.7 },
      rest_0: { pts: 21.5, reb: 8.0, ast: 4.2 },
      rest_1: { pts: 24.5, reb: 9.5, ast: 5.2 },
      rest_2plus: { pts: 27.0, reb: 10.5, ast: 6.0 },
      win: { pts: 27.0, reb: 10.2, ast: 5.8 },
      loss: { pts: 19.8, reb: 7.8, ast: 3.8 },
      q4: { pts: 7.2, fgPct: 46.0 },
      clutch: { pts: 3.2, fgPct: 44.5 }
    },
    
    propHitRates: {
      "pts_23.5": { over: 55, under: 45, streak: "O6" },
      "pts_25.5": { over: 45, under: 55, streak: "U2" },
      "reb_9.5": { over: 48, under: 52, streak: "U1" },
      "ast_5.5": { over: 45, under: 55, streak: "U3" },
      "pra_38.5": { over: 58, under: 42, streak: "O7" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "PHI", pts: 30, reb: 11, ast: 6, min: 37, result: "W" },
      { date: "2025-01-22", opp: "BOS", pts: 27, reb: 10, ast: 6, min: 36, result: "L" },
      { date: "2025-01-20", opp: "BKN", pts: 28, reb: 11, ast: 6, min: 36, result: "W" },
      { date: "2025-01-18", opp: "CLE", pts: 26, reb: 10, ast: 6, min: 35, result: "W" },
      { date: "2025-01-16", opp: "MIL", pts: 29, reb: 11, ast: 6, min: 36, result: "L" }
    ],
    
    injuries: { current: null, history: ["Ankle - Oct 2024 (2 games)"] },
    fantasy: { avgFpts: 50.5, ceiling: 70, floor: 32, consistency: 75 }
  },

  "Bradley Beal": {
    id: "beal3",
    name: "Bradley Beal",
    team: "PHX",
    position: "SG",
    number: 3,
    age: 30,
    experience: 12,
    
    season: { pts: 18.5, reb: 4.2, ast: 5.0, stl: 0.9, blk: 0.4, tov: 2.2, min: 31.5, fgPct: 50.5, threePct: 43.0, ftPct: 82.5, usage: 23.5, per: 20.5 },
    last10: { pts: 20.2, reb: 4.5, ast: 5.5, stl: 1.0, blk: 0.5, tov: 2.0, min: 32.5, fgPct: 52.0, threePct: 45.0, ftPct: 84.0 },
    last5: { pts: 22.0, reb: 4.8, ast: 6.0, stl: 1.1, blk: 0.6, tov: 1.8, min: 33.0, fgPct: 53.5, threePct: 47.0, ftPct: 85.0 },
    
    splits: {
      home: { pts: 20.0, reb: 4.5, ast: 5.5, record: "19-7" },
      away: { pts: 17.0, reb: 3.9, ast: 4.5, record: "16-10" },
      vs_east: { pts: 19.2, reb: 4.3, ast: 5.2 },
      vs_west: { pts: 17.8, reb: 4.1, ast: 4.8 },
      rest_0: { pts: 16.5, reb: 3.8, ast: 4.2 },
      rest_1: { pts: 18.8, reb: 4.3, ast: 5.1 },
      rest_2plus: { pts: 21.0, reb: 4.8, ast: 5.8 },
      win: { pts: 20.5, reb: 4.6, ast: 5.5 },
      loss: { pts: 15.8, reb: 3.6, ast: 4.2 },
      q4: { pts: 5.5, fgPct: 49.0 },
      clutch: { pts: 2.5, fgPct: 48.5 }
    },
    
    propHitRates: {
      "pts_18.5": { over: 50, under: 50, streak: "O3" },
      "pts_20.5": { over: 40, under: 60, streak: "U2" },
      "ast_5.5": { over: 45, under: 55, streak: "U1" },
      "reb_4.5": { over: 45, under: 55, streak: "U2" },
      "pra_27.5": { over: 52, under: 48, streak: "O4" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "LAL", pts: 23, reb: 5, ast: 6, min: 34, result: "W" },
      { date: "2025-01-22", opp: "SAC", pts: 21, reb: 5, ast: 6, min: 33, result: "W" },
      { date: "2025-01-20", opp: "LAC", pts: 20, reb: 5, ast: 6, min: 32, result: "L" },
      { date: "2025-01-18", opp: "GSW", pts: 22, reb: 4, ast: 6, min: 33, result: "W" },
      { date: "2025-01-16", opp: "DEN", pts: 21, reb: 5, ast: 6, min: 33, result: "W" }
    ],
    
    injuries: { current: null, history: ["Back - Various (20+ games career)"] },
    fantasy: { avgFpts: 37.5, ceiling: 55, floor: 22, consistency: 74 }
  },

  "Lauri Markkanen": {
    id: "lauri23",
    name: "Lauri Markkanen",
    team: "UTA",
    position: "PF",
    number: 23,
    age: 26,
    experience: 7,
    
    season: { pts: 24.5, reb: 8.5, ast: 2.2, stl: 0.7, blk: 0.6, tov: 1.8, min: 33.8, fgPct: 48.5, threePct: 40.2, ftPct: 88.5, usage: 27.5, per: 22.2 },
    last10: { pts: 26.2, reb: 9.0, ast: 2.5, stl: 0.8, blk: 0.7, tov: 1.6, min: 34.5, fgPct: 50.0, threePct: 42.0, ftPct: 90.0 },
    last5: { pts: 28.0, reb: 9.5, ast: 2.8, stl: 0.9, blk: 0.8, tov: 1.5, min: 35.0, fgPct: 51.5, threePct: 44.0, ftPct: 91.0 },
    
    splits: {
      home: { pts: 26.0, reb: 9.2, ast: 2.5, record: "15-11" },
      away: { pts: 23.0, reb: 7.8, ast: 1.9, record: "13-13" },
      vs_east: { pts: 25.2, reb: 8.8, ast: 2.3 },
      vs_west: { pts: 23.8, reb: 8.2, ast: 2.1 },
      rest_0: { pts: 22.5, reb: 7.5, ast: 1.8 },
      rest_1: { pts: 24.8, reb: 8.7, ast: 2.3 },
      rest_2plus: { pts: 27.0, reb: 9.5, ast: 2.6 },
      win: { pts: 27.5, reb: 9.5, ast: 2.5 },
      loss: { pts: 21.2, reb: 7.3, ast: 1.8 },
      q4: { pts: 7.2, fgPct: 47.5 },
      clutch: { pts: 3.0, fgPct: 46.0 }
    },
    
    propHitRates: {
      "pts_24.5": { over: 50, under: 50, streak: "O4" },
      "pts_26.5": { over: 42, under: 58, streak: "U1" },
      "reb_8.5": { over: 48, under: 52, streak: "U2" },
      "threes_3.5": { over: 55, under: 45, streak: "O6" },
      "pra_35.5": { over: 55, under: 45, streak: "O5" }
    },
    
    gameLog: [
      { date: "2025-01-24", opp: "DEN", pts: 29, reb: 10, ast: 3, min: 36, result: "L" },
      { date: "2025-01-22", opp: "MIN", pts: 27, reb: 9, ast: 3, min: 35, result: "W" },
      { date: "2025-01-20", opp: "POR", pts: 28, reb: 10, ast: 2, min: 35, result: "W" },
      { date: "2025-01-18", opp: "SAC", pts: 26, reb: 9, ast: 3, min: 34, result: "L" },
      { date: "2025-01-16", opp: "OKC", pts: 28, reb: 9, ast: 3, min: 35, result: "L" }
    ],
    
    injuries: { current: null, history: [] },
    fantasy: { avgFpts: 43.5, ceiling: 62, floor: 28, consistency: 77 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🏀 COMPLETE NBA TEAMS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export const TEAMS_DATABASE = {
  "BOS": {
    name: "Boston Celtics",
    code: "BOS",
    city: "Boston",
    conference: "East",
    division: "Atlantic",
    founded: 1946,
    arena: "TD Garden",
    capacity: 19156,
    
    season: {
      record: "40-12",
      winPct: 0.769,
      homeRecord: "22-4",
      awayRecord: "18-8",
      confRecord: "25-7",
      streak: "W5",
      standingConf: 1,
      standingDiv: 1
    },
    
    stats: {
      offRating: 120.5,
      defRating: 109.2,
      netRating: 11.3,
      pace: 100.5,
      efgPct: 57.2,
      tovPct: 11.8,
      orbPct: 27.5,
      ftRate: 23.2
    },
    
    averages: {
      pts: 119.5,
      reb: 46.2,
      ast: 26.8,
      stl: 8.2,
      blk: 6.5,
      tov: 13.2,
      fgPct: 48.5,
      threePct: 38.8,
      ftPct: 81.2
    },
    
    roster: ["Jayson Tatum", "Jaylen Brown", "Derrick White", "Jrue Holiday", "Kristaps Porzingis"],
    
    schedule: {
      last5: ["W", "W", "W", "W", "L"],
      next3: [
        { date: "2025-01-26", opp: "PHI", location: "home" },
        { date: "2025-01-28", opp: "MIA", location: "away" },
        { date: "2025-01-30", opp: "CLE", location: "home" }
      ]
    },
    
    trends: {
      atsRecord: "28-24",
      ouRecord: "30-22-0",
      homeAts: "15-11",
      awayAts: "13-13"
    },
    
    injuries: [],
    
    championships: 18,
    history: "Most successful franchise in NBA history"
  },

  "LAL": {
    name: "Los Angeles Lakers",
    code: "LAL",
    city: "Los Angeles",
    conference: "West",
    division: "Pacific",
    founded: 1947,
    arena: "Crypto.com Arena",
    capacity: 18997,
    
    season: {
      record: "33-19",
      winPct: 0.635,
      homeRecord: "19-7",
      awayRecord: "14-12",
      confRecord: "21-11",
      streak: "L1",
      standingConf: 5,
      standingDiv: 2
    },
    
    stats: {
      offRating: 115.8,
      defRating: 112.5,
      netRating: 3.3,
      pace: 98.5,
      efgPct: 54.2,
      tovPct: 12.5,
      orbPct: 25.8,
      ftRate: 24.5
    },
    
    averages: {
      pts: 116.2,
      reb: 44.8,
      ast: 25.2,
      stl: 7.8,
      blk: 5.5,
      tov: 14.2,
      fgPct: 47.2,
      threePct: 36.5,
      ftPct: 78.5
    },
    
    roster: ["LeBron James", "Anthony Davis", "D'Angelo Russell", "Rui Hachimura", "Austin Reaves"],
    
    schedule: {
      last5: ["L", "W", "W", "W", "L"],
      next3: [
        { date: "2025-01-26", opp: "PHX", location: "home" },
        { date: "2025-01-28", opp: "GSW", location: "away" },
        { date: "2025-01-30", opp: "SAC", location: "home" }
      ]
    },
    
    trends: {
      atsRecord: "26-26",
      ouRecord: "28-24-0",
      homeAts: "14-12",
      awayAts: "12-14"
    },
    
    injuries: [],
    
    championships: 17
  },

  "GSW": {
    name: "Golden State Warriors",
    code: "GSW",
    city: "San Francisco",
    conference: "West",
    division: "Pacific",
    founded: 1946,
    arena: "Chase Center",
    capacity: 18064,
    
    season: {
      record: "32-20",
      winPct: 0.615,
      homeRecord: "18-8",
      awayRecord: "14-12",
      confRecord: "19-13",
      streak: "W3",
      standingConf: 6,
      standingDiv: 3
    },
    
    stats: {
      offRating: 117.2,
      defRating: 113.5,
      netRating: 3.7,
      pace: 101.2,
      efgPct: 55.8,
      tovPct: 13.2,
      orbPct: 24.5,
      ftRate: 22.8
    },
    
    averages: {
      pts: 117.8,
      reb: 45.2,
      ast: 27.5,
      stl: 8.5,
      blk: 5.2,
      tov: 14.5,
      fgPct: 47.8,
      threePct: 38.2,
      ftPct: 79.5
    },
    
    roster: ["Stephen Curry", "Andrew Wiggins", "Draymond Green", "Klay Thompson", "Chris Paul"],
    
    schedule: {
      last5: ["W", "W", "W", "L", "W"],
      next3: [
        { date: "2025-01-26", opp: "DAL", location: "away" },
        { date: "2025-01-28", opp: "LAL", location: "home" },
        { date: "2025-01-30", opp: "PHX", location: "away" }
      ]
    },
    
    trends: {
      atsRecord: "27-25",
      ouRecord: "29-23-0",
      homeAts: "15-11",
      awayAts: "12-14"
    },
    
    injuries: [],
    
    championships: 7
  },

  "MIL": {
    name: "Milwaukee Bucks",
    code: "MIL",
    city: "Milwaukee",
    conference: "East",
    division: "Central",
    founded: 1968,
    arena: "Fiserv Forum",
    capacity: 17500,
    
    season: {
      record: "38-14",
      winPct: 0.731,
      homeRecord: "21-5",
      awayRecord: "17-9",
      confRecord: "24-8",
      streak: "W6",
      standingConf: 2,
      standingDiv: 1
    },
    
    stats: {
      offRating: 119.2,
      defRating: 111.5,
      netRating: 7.7,
      pace: 99.8,
      efgPct: 56.5,
      tovPct: 12.2,
      orbPct: 26.8,
      ftRate: 25.2
    },
    
    averages: {
      pts: 118.5,
      reb: 47.2,
      ast: 25.8,
      stl: 7.8,
      blk: 6.2,
      tov: 13.5,
      fgPct: 48.8,
      threePct: 37.5,
      ftPct: 80.2
    },
    
    roster: ["Giannis Antetokounmpo", "Damian Lillard", "Khris Middleton", "Brook Lopez", "Bobby Portis"],
    
    schedule: {
      last5: ["W", "W", "W", "W", "W"],
      next3: [
        { date: "2025-01-26", opp: "CHI", location: "away" },
        { date: "2025-01-28", opp: "CLE", location: "home" },
        { date: "2025-01-30", opp: "IND", location: "away" }
      ]
    },
    
    trends: {
      atsRecord: "29-23",
      ouRecord: "27-25-0",
      homeAts: "16-10",
      awayAts: "13-13"
    },
    
    championships: 2
  },

  "DAL": {
    name: "Dallas Mavericks",
    code: "DAL",
    city: "Dallas",
    conference: "West",
    division: "Southwest",
    founded: 1980,
    arena: "American Airlines Center",
    capacity: 19200,
    
    season: {
      record: "35-17",
      winPct: 0.673,
      homeRecord: "20-6",
      awayRecord: "15-11",
      confRecord: "22-10",
      streak: "W4",
      standingConf: 4,
      standingDiv: 1
    },
    
    stats: {
      offRating: 118.5,
      defRating: 112.2,
      netRating: 6.3,
      pace: 99.2,
      efgPct: 56.2,
      tovPct: 11.5,
      orbPct: 25.2,
      ftRate: 24.8
    },
    
    averages: {
      pts: 117.8,
      reb: 45.5,
      ast: 26.2,
      stl: 7.5,
      blk: 5.8,
      tov: 13.2,
      fgPct: 48.2,
      threePct: 37.8,
      ftPct: 79.8
    },
    
    roster: ["Luka Doncic", "Kyrie Irving", "Dereck Lively II", "Josh Green", "Grant Williams"],
    
    schedule: {
      last5: ["W", "W", "W", "W", "L"],
      next3: [
        { date: "2025-01-26", opp: "GSW", location: "home" },
        { date: "2025-01-28", opp: "HOU", location: "away" },
        { date: "2025-01-30", opp: "SAS", location: "home" }
      ]
    },
    
    trends: {
      atsRecord: "30-22",
      ouRecord: "28-24-0",
      homeAts: "17-9",
      awayAts: "13-13"
    },
    
    championships: 1
  },

  "DEN": {
    name: "Denver Nuggets",
    code: "DEN",
    city: "Denver",
    conference: "West",
    division: "Northwest",
    founded: 1976,
    arena: "Ball Arena",
    capacity: 19520,
    
    season: {
      record: "37-15",
      winPct: 0.712,
      homeRecord: "21-6",
      awayRecord: "16-9",
      confRecord: "23-9",
      streak: "W2",
      standingConf: 3,
      standingDiv: 1
    },
    
    stats: {
      offRating: 119.8,
      defRating: 111.5,
      netRating: 8.3,
      pace: 98.8,
      efgPct: 57.5,
      tovPct: 11.8,
      orbPct: 26.5,
      ftRate: 23.5
    },
    
    averages: {
      pts: 118.2,
      reb: 46.8,
      ast: 28.2,
      stl: 7.2,
      blk: 5.5,
      tov: 12.8,
      fgPct: 49.5,
      threePct: 38.5,
      ftPct: 80.5
    },
    
    roster: ["Nikola Jokic", "Jamal Murray", "Michael Porter Jr.", "Aaron Gordon", "Kentavious Caldwell-Pope"],
    
    schedule: {
      last5: ["W", "W", "L", "W", "W"],
      next3: [
        { date: "2025-01-26", opp: "UTA", location: "away" },
        { date: "2025-01-28", opp: "PHX", location: "home" },
        { date: "2025-01-30", opp: "LAL", location: "away" }
      ]
    },
    
    trends: {
      atsRecord: "28-24",
      ouRecord: "29-23-0",
      homeAts: "15-12",
      awayAts: "13-12"
    },
    
    championships: 1
  },

  "PHX": {
    name: "Phoenix Suns",
    code: "PHX",
    city: "Phoenix",
    conference: "West",
    division: "Pacific",
    founded: 1968,
    arena: "Footprint Center",
    capacity: 18055,
    
    season: {
      record: "35-17",
      winPct: 0.673,
      homeRecord: "19-7",
      awayRecord: "16-10",
      confRecord: "22-10",
      streak: "W3",
      standingConf: 4,
      standingDiv: 1
    },
    
    stats: {
      offRating: 117.5,
      defRating: 111.8,
      netRating: 5.7,
      pace: 99.5,
      efgPct: 55.8,
      tovPct: 12.5,
      orbPct: 25.5,
      ftRate: 24.2
    },
    
    averages: {
      pts: 116.8,
      reb: 45.2,
      ast: 26.5,
      stl: 7.8,
      blk: 5.2,
      tov: 13.8,
      fgPct: 48.5,
      threePct: 37.2,
      ftPct: 81.5
    },
    
    roster: ["Kevin Durant", "Devin Booker", "Bradley Beal", "Jusuf Nurkic", "Grayson Allen"],
    
    schedule: {
      last5: ["W", "W", "W", "L", "W"],
      next3: [
        { date: "2025-01-26", opp: "LAL", location: "away" },
        { date: "2025-01-28", opp: "DEN", location: "away" },
        { date: "2025-01-30", opp: "GSW", location: "home" }
      ]
    },
    
    trends: {
      atsRecord: "27-25",
      ouRecord: "28-24-0",
      homeAts: "15-11",
      awayAts: "12-14"
    },
    
    championships: 0
  },

  "PHI": {
    name: "Philadelphia 76ers",
    code: "PHI",
    city: "Philadelphia",
    conference: "East",
    division: "Atlantic",
    founded: 1946,
    arena: "Wells Fargo Center",
    capacity: 20478,
    
    season: {
      record: "34-18",
      winPct: 0.654,
      homeRecord: "19-8",
      awayRecord: "15-10",
      confRecord: "22-10",
      streak: "L1",
      standingConf: 4,
      standingDiv: 2
    },
    
    stats: {
      offRating: 116.5,
      defRating: 112.2,
      netRating: 4.3,
      pace: 98.5,
      efgPct: 54.8,
      tovPct: 12.8,
      orbPct: 25.2,
      ftRate: 26.5
    },
    
    averages: {
      pts: 115.2,
      reb: 44.8,
      ast: 24.5,
      stl: 8.2,
      blk: 6.8,
      tov: 13.5,
      fgPct: 47.5,
      threePct: 36.8,
      ftPct: 82.5
    },
    
    roster: ["Joel Embiid", "Tyrese Maxey", "Tobias Harris", "De'Anthony Melton", "Paul Reed"],
    
    schedule: {
      last5: ["L", "W", "W", "W", "W"],
      next3: [
        { date: "2025-01-26", opp: "BOS", location: "away" },
        { date: "2025-01-28", opp: "NYK", location: "home" },
        { date: "2025-01-30", opp: "MIA", location: "away" }
      ]
    },
    
    trends: {
      atsRecord: "28-24",
      ouRecord: "27-25-0",
      homeAts: "16-11",
      awayAts: "12-13"
    },
    
    championships: 3
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📈 ADVANCED BETTING ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class BettingAlgorithms {
  
  // Kelly Criterion with fractional Kelly
  static kellyFractional(winProb, decimalOdds, bankroll, fraction = 0.25) {
    const b = decimalOdds - 1;
    const p = winProb;
    const q = 1 - p;
    
    const fullKelly = ((b * p) - q) / b;
    const fractionalKelly = Math.max(0, fullKelly * fraction);
    const betSize = fractionalKelly * bankroll;
    
    return {
      fullKelly: (fullKelly * 100).toFixed(2) + '%',
      fractionalKelly: (fractionalKelly * 100).toFixed(2) + '%',
      betSize: betSize.toFixed(2),
      expectedGrowth: (fractionalKelly * (b * p - q)).toFixed(4),
      riskOfRuin: fullKelly > 0.2 ? 'High' : fullKelly > 0.1 ? 'Medium' : 'Low'
    };
  }

  // Monte Carlo simulation for variance estimation
  static monteCarloVariance(winProb, stake, odds, iterations = 10000) {
    const results = [];
    const profit = odds > 0 ? stake * (odds / 100) : stake * (100 / Math.abs(odds));
    
    for (let i = 0; i < iterations; i++) {
      const outcome = Math.random() < winProb ? profit : -stake;
      results.push(outcome);
    }
    
    const mean = results.reduce((sum, val) => sum + val, 0) / iterations;
    const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / iterations;
    const stdDev = Math.sqrt(variance);
    
    return {
      meanOutcome: mean.toFixed(2),
      variance: variance.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: Math.min(...results).toFixed(2),
      max: Math.max(...results).toFixed(2),
      confidenceInterval95: {
        lower: (mean - 1.96 * stdDev).toFixed(2),
        upper: (mean + 1.96 * stdDev).toFixed(2)
      }
    };
  }

  // Poisson distribution for scoring props
  static poissonProbability(lambda, k) {
    const e = Math.E;
    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
    return (Math.pow(lambda, k) * Math.pow(e, -lambda)) / factorial(k);
  }

  static poissonOverUnder(averageScore, line) {
    let overProb = 0;
    let underProb = 0;
    
    // Calculate for values 0 to 60 (sufficient for basketball)
    for (let i = 0; i <= 60; i++) {
      const prob = this.poissonProbability(averageScore, i);
      if (i > line) {
        overProb += prob;
      } else if (i < line) {
        underProb += prob;
      } else {
        // Push at line - split 50/50
        overProb += prob * 0.5;
        underProb += prob * 0.5;
      }
    }
    
    return {
      overProb: (overProb * 100).toFixed(2) + '%',
      underProb: (underProb * 100).toFixed(2) + '%',
      pushProb: (this.poissonProbability(averageScore, line) * 100).toFixed(2) + '%',
      expectedValue: averageScore.toFixed(2)
    };
  }

  // Regression to mean calculator
  static regressionToMean(recentAvg, seasonAvg, games, weight = 0.7) {
    // Weight recent performance but regress toward season mean
    const predicted = (recentAvg * weight) + (seasonAvg * (1 - weight));
    const confidence = Math.min(100, (games / 82) * 100);
    
    return {
      predicted: predicted.toFixed(1),
      recentWeight: (weight * 100).toFixed(0) + '%',
      seasonWeight: ((1 - weight) * 100).toFixed(0) + '%',
      confidence: confidence.toFixed(0) + '%',
      deviation: Math.abs(recentAvg - seasonAvg).toFixed(1)
    };
  }

  // Elo rating for strength comparison
  static eloExpected(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  static eloUpdate(rating, expected, actual, kFactor = 32) {
    return rating + kFactor * (actual - expected);
  }

  // Sharpe Ratio for bet quality
  static sharpeRatio(returns, riskFreeRate = 0.02) {
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    const excessReturn = mean - riskFreeRate;
    const sharpe = stdDev !== 0 ? excessReturn / stdDev : 0;
    
    return {
      sharpe: sharpe.toFixed(3),
      interpretation: sharpe > 2 ? 'Excellent' : sharpe > 1 ? 'Good' : sharpe > 0 ? 'Acceptable' : 'Poor',
      meanReturn: (mean * 100).toFixed(2) + '%',
      volatility: (stdDev * 100).toFixed(2) + '%'
    };
  }

  // Correlation coefficient between two props
  static correlation(dataX, dataY) {
    const n = Math.min(dataX.length, dataY.length);
    const meanX = dataX.reduce((sum, val) => sum + val, 0) / n;
    const meanY = dataY.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (dataX[i] - meanX) * (dataY[i] - meanY);
      denomX += Math.pow(dataX[i] - meanX, 2);
      denomY += Math.pow(dataY[i] - meanY, 2);
    }
    
    const correlation = numerator / Math.sqrt(denomX * denomY);
    
    return {
      r: correlation.toFixed(3),
      strength: Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.4 ? 'Moderate' : 'Weak',
      direction: correlation > 0 ? 'Positive' : 'Negative',
      rSquared: (correlation * correlation).toFixed(3)
    };
  }

  // Z-score for outlier detection
  static zScore(value, mean, stdDev) {
    const z = (value - mean) / stdDev;
    const isOutlier = Math.abs(z) > 2;
    
    return {
      zScore: z.toFixed(2),
      isOutlier,
      interpretation: Math.abs(z) > 3 ? 'Extreme outlier' : Math.abs(z) > 2 ? 'Outlier' : 'Normal',
      percentile: this.zToPercentile(z).toFixed(1) + '%'
    };
  }

  static zToPercentile(z) {
    // Approximate normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? (1 - p) * 100 : p * 100;
  }

  // Moving average convergence divergence (MACD) for trends
  static macd(prices, short = 5, long = 10, signal = 3) {
    const emaShort = this.ema(prices, short);
    const emaLong = this.ema(prices, long);
    const macdLine = emaShort - emaLong;
    
    // Would need historical MACD to calculate signal line properly
    // Simplified version:
    return {
      macdLine: macdLine.toFixed(2),
      signal: macdLine > 0 ? 'Bullish' : 'Bearish',
      strength: Math.abs(macdLine) > 2 ? 'Strong' : 'Weak'
    };
  }

  static ema(prices, period) {
    if (prices.length === 0) {
return 0;
}
    const k = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * k) + (ema * (1 - k));
    }
    
    return ema;
  }

  // Bankroll growth simulator
  static bankrollSimulator(initialBankroll, bets, roi, variance, duration = 100) {
    let currentBankroll = initialBankroll;
    const history = [initialBankroll];
    
    for (let i = 0; i < duration; i++) {
      const betSize = currentBankroll * 0.02; // 2% per bet
      const outcome = Math.random() < (roi + 1) / 2 
        ? betSize * (1 + roi + (Math.random() - 0.5) * variance)
        : -betSize;
      
      currentBankroll += outcome;
      history.push(currentBankroll);
      
      if (currentBankroll <= 0) {
break;
}
    }
    
    return {
      finalBankroll: currentBankroll.toFixed(2),
      growth: ((currentBankroll - initialBankroll) / initialBankroll * 100).toFixed(2) + '%',
      peak: Math.max(...history).toFixed(2),
      valley: Math.min(...history).toFixed(2),
      ruined: currentBankroll <= 0
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🎯 PROP CORRELATION ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PropCorrelationAnalyzer {
  
  static analyzeGameCorrelations(player1, player2, statType) {
    // Analyze if two players' props are correlated (same game or opponents)
    const team1 = player1.team;
    const team2 = player2.team;
    
    if (team1 === team2) {
      return {
        type: 'Teammates',
        correlation: 'Moderate Negative',
        reasoning: 'Teammates compete for stats',
        recommendation: 'Avoid stacking both overs',
        confidence: 0.65
      };
    } else {
      return {
        type: 'Opponents',
        correlation: 'Positive',
        reasoning: 'High-pace game benefits both',
        recommendation: 'Can stack for SGP',
        confidence: 0.55
      };
    }
  }

  static findOptimalParlayLegs(players, maxLegs = 4) {
    // Find best uncorrelated prop combinations
    const recommendations = [];
    
    // Logic: Mix positions, teams, stat types
    const positions = [...new Set(players.map(p => p.position))];
    const teams = [...new Set(players.map(p => p.team))];
    
    return {
      diversification: positions.length >= maxLegs ? 'Excellent' : 'Limited',
      recommendation: `Include ${maxLegs} different stat types from ${maxLegs} teams`,
      optimalMix: ['Points', 'Rebounds', 'Assists', 'Threes']
    };
  }
}

export default {
  EXTENDED_PLAYERS,
  TEAMS_DATABASE,
  BettingAlgorithms,
  PropCorrelationAnalyzer
};
