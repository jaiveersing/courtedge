// Type definitions for CourtEdge project
export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  number: number;
  age: number;
  experience: number;
  height: string;
  weight: number;
  college?: string;
  draftYear?: number;
  draftPick?: number;
}

export interface PlayerStats {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  min: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  usage?: number;
  per?: number;
}

export interface GameLog {
  date: string;
  opp: string;
  pts: number;
  reb: number;
  ast: number;
  min: number;
  result: 'W' | 'L';
  fgm?: number;
  fga?: number;
  threePm?: number;
  threePa?: number;
  ftm?: number;
  fta?: number;
  stl?: number;
  blk?: number;
  tov?: number;
}

export interface PropHitRate {
  over: number;
  under: number;
  streak: string;
}

export interface PlayerSplits {
  home: PlayerStats & { record: string };
  away: PlayerStats & { record: string };
  vs_east: PlayerStats;
  vs_west: PlayerStats;
  rest_0: PlayerStats;
  rest_1: PlayerStats;
  rest_2plus: PlayerStats;
  win: PlayerStats;
  loss: PlayerStats;
  q4: { pts: number; fgPct: number };
  clutch: { pts: number; fgPct: number };
}

export interface PlayerAdvanced {
  per: number;
  trueShooting: number;
  offRating: number;
  defRating: number;
  netRating: number;
  winShares: number;
  bpm: number;
  vorp: number;
  usageRate: number;
  reboundRate: number;
  assistRate: number;
  turnoverRate: number;
  effectiveFG: number;
}

export interface PlayerCareer {
  gamesPlayed: number;
  points: number;
  assists: number;
  rebounds: number;
  allStars: number;
  allNBA: number;
  awards: string[];
}

export interface Injury {
  current: string | null;
  history: string[];
}

export interface Fantasy {
  avgFpts: number;
  ceiling: number;
  floor: number;
  consistency: number;
}

export interface Bet {
  id: string;
  type: 'player_prop' | 'game' | 'parlay';
  player?: string;
  prop?: string;
  line: number;
  odds: number;
  stake: number;
  result?: 'win' | 'loss' | 'push' | 'pending';
  profit?: number;
  date: string;
  game?: string;
  notes?: string;
}

export interface BankrollEntry {
  id: string;
  date: string;
  startBalance: number;
  endBalance: number;
  profit: number;
  roi: number;
  betsCount: number;
  wins: number;
  losses: number;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  wins: number;
  losses: number;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  status: 'scheduled' | 'live' | 'final';
  quarter?: number;
  timeRemaining?: string;
}

export interface Prediction {
  value: number;
  confidence: number;
  factors: Record<string, number>;
  modelVersion: string;
  timestamp: string;
}

export interface MLPredictionRequest {
  playerId: string;
  statType: 'points' | 'rebounds' | 'assists' | 'threes';
  gameDate: string;
  opponent?: string;
}

export interface MLPredictionResponse {
  prediction: number;
  confidence: number;
  recommendedAction: 'over' | 'under' | 'pass';
  factors: {
    recent_form: number;
    opponent_defense: number;
    home_away: number;
    rest_days: number;
    injury_impact: number;
  };
  kellyBet?: number;
  expectedValue?: number;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
