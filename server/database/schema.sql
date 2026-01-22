-- CourtEdge Database Schema
-- PostgreSQL 14+

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  verified BOOLEAN DEFAULT FALSE,
  bankroll DECIMAL(10, 2) DEFAULT 1000.00,
  starting_bankroll DECIMAL(10, 2) DEFAULT 1000.00,
  unit_size DECIMAL(5, 2) DEFAULT 1.00,
  risk_tolerance VARCHAR(20) DEFAULT 'medium' CHECK (risk_tolerance IN ('conservative', 'medium', 'aggressive')),
  kelly_fraction DECIMAL(3, 2) DEFAULT 0.25,
  avatar_url VARCHAR(500),
  bio TEXT,
  settings JSONB DEFAULT '{"notifications": true, "theme": "light"}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);

CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BETS & WAGERS
-- ============================================

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Bet Details
  sport VARCHAR(50) NOT NULL,
  league VARCHAR(50) NOT NULL,
  game_id VARCHAR(100),
  game_date TIMESTAMP,
  home_team VARCHAR(100),
  away_team VARCHAR(100),
  
  -- Bet Type & Market
  bet_type VARCHAR(50) NOT NULL CHECK (bet_type IN ('single', 'parlay', 'teaser', 'round_robin')),
  market VARCHAR(50) NOT NULL, -- spread, totals, moneyline, props
  selection VARCHAR(200) NOT NULL, -- Team/player selected
  line DECIMAL(10, 2), -- Spread or total
  
  -- Odds & Stakes
  odds DECIMAL(10, 2) NOT NULL,
  odds_format VARCHAR(20) DEFAULT 'american' CHECK (odds_format IN ('american', 'decimal', 'fractional')),
  stake_amount DECIMAL(10, 2) NOT NULL,
  units DECIMAL(5, 2),
  to_win DECIMAL(10, 2),
  
  -- Sportsbook
  bookmaker VARCHAR(100),
  
  -- Outcome
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'push', 'void')),
  result VARCHAR(200),
  payout DECIMAL(10, 2),
  profit_loss DECIMAL(10, 2),
  
  -- Analytics
  edge_percent DECIMAL(5, 2),
  clv_percent DECIMAL(5, 2), -- Closing Line Value
  kelly_percent DECIMAL(5, 2),
  
  -- Metadata
  notes TEXT,
  tags VARCHAR(100)[],
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP
);

CREATE TABLE parlay_legs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parlay_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  leg_number INTEGER NOT NULL,
  
  -- Leg Details
  game_id VARCHAR(100),
  game_date TIMESTAMP,
  home_team VARCHAR(100),
  away_team VARCHAR(100),
  market VARCHAR(50) NOT NULL,
  selection VARCHAR(200) NOT NULL,
  line DECIMAL(10, 2),
  odds DECIMAL(10, 2) NOT NULL,
  
  -- Outcome
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'push', 'void')),
  result VARCHAR(200),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PREDICTIONS & ML MODELS
-- ============================================

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Game Info
  game_id VARCHAR(100) UNIQUE NOT NULL,
  sport VARCHAR(50) NOT NULL,
  league VARCHAR(50) NOT NULL,
  game_date TIMESTAMP NOT NULL,
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  
  -- Predictions
  predicted_winner VARCHAR(100),
  win_probability DECIMAL(5, 2),
  predicted_spread DECIMAL(10, 2),
  spread_confidence DECIMAL(5, 2),
  predicted_total DECIMAL(10, 2),
  total_confidence DECIMAL(5, 2),
  
  -- Model Info
  model_version VARCHAR(50),
  model_type VARCHAR(50),
  features_used TEXT[],
  
  -- Props Predictions
  props_predictions JSONB,
  
  -- Outcome
  actual_home_score INTEGER,
  actual_away_score INTEGER,
  actual_winner VARCHAR(100),
  actual_spread DECIMAL(10, 2),
  actual_total DECIMAL(10, 2),
  
  -- Accuracy
  prediction_correct BOOLEAN,
  spread_error DECIMAL(10, 2),
  total_error DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
  
  -- Player Info
  player_id VARCHAR(100) NOT NULL,
  player_name VARCHAR(200) NOT NULL,
  team VARCHAR(100) NOT NULL,
  
  -- Predictions
  predicted_points DECIMAL(5, 2),
  predicted_rebounds DECIMAL(5, 2),
  predicted_assists DECIMAL(5, 2),
  predicted_threes DECIMAL(5, 2),
  predicted_minutes DECIMAL(5, 2),
  
  -- Props
  props_lines JSONB,
  props_predictions JSONB,
  
  -- Outcome
  actual_points INTEGER,
  actual_rebounds INTEGER,
  actual_assists INTEGER,
  actual_threes INTEGER,
  actual_minutes INTEGER,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ODDS & LINE MOVEMENTS
-- ============================================

CREATE TABLE odds_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Game Info
  game_id VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  bookmaker VARCHAR(100) NOT NULL,
  
  -- Market
  market VARCHAR(50) NOT NULL, -- spread, totals, moneyline
  
  -- Odds
  home_odds DECIMAL(10, 2),
  away_odds DECIMAL(10, 2),
  over_odds DECIMAL(10, 2),
  under_odds DECIMAL(10, 2),
  line DECIMAL(10, 2), -- Spread or total
  
  -- Metadata
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE line_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Game Info
  game_id VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  market VARCHAR(50) NOT NULL,
  
  -- Movement
  old_line DECIMAL(10, 2),
  new_line DECIMAL(10, 2),
  movement_size DECIMAL(10, 2),
  
  -- Classification
  is_steam_move BOOLEAN DEFAULT FALSE,
  is_rlm BOOLEAN DEFAULT FALSE, -- Reverse Line Movement
  sharp_money BOOLEAN,
  
  -- Public Betting Data
  public_betting_percent DECIMAL(5, 2),
  public_side VARCHAR(50),
  
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE arbitrage_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Game Info
  game_id VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  game_date TIMESTAMP,
  game_description VARCHAR(500),
  
  -- Opportunity
  market VARCHAR(50) NOT NULL,
  outcomes JSONB NOT NULL, -- Array of {bookmaker, selection, odds, link}
  profit_percent DECIMAL(5, 2) NOT NULL,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PLAYER DATA
-- ============================================

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id VARCHAR(100) UNIQUE NOT NULL,
  
  -- Basic Info
  name VARCHAR(200) NOT NULL,
  team VARCHAR(100),
  position VARCHAR(50),
  jersey_number VARCHAR(10),
  
  -- Physical
  height_inches INTEGER,
  weight_lbs INTEGER,
  age INTEGER,
  
  -- Career Stats
  career_stats JSONB,
  season_stats JSONB,
  
  -- Metadata
  image_url VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_game_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Player & Game
  player_id VARCHAR(100) NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  game_date DATE NOT NULL,
  season VARCHAR(20) NOT NULL,
  team VARCHAR(100) NOT NULL,
  opponent VARCHAR(100) NOT NULL,
  home_away VARCHAR(10) CHECK (home_away IN ('home', 'away')),
  
  -- Stats
  minutes INTEGER,
  points INTEGER,
  rebounds INTEGER,
  assists INTEGER,
  steals INTEGER,
  blocks INTEGER,
  turnovers INTEGER,
  fouls INTEGER,
  fg_made INTEGER,
  fg_attempted INTEGER,
  three_made INTEGER,
  three_attempted INTEGER,
  ft_made INTEGER,
  ft_attempted INTEGER,
  plus_minus INTEGER,
  
  -- Result
  won BOOLEAN,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(player_id, game_id)
);

-- ============================================
-- SOCIAL FEATURES
-- ============================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE bet_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES bet_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bet_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(bet_id, user_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL CHECK (type IN ('bet_settled', 'arbitrage', 'steam_move', 'rlm', 'follow', 'like', 'comment')),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  data JSONB,
  
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  device_type VARCHAR(50), -- ios, android, web
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP
);

-- ============================================
-- BANKROLL TRACKING
-- ============================================

CREATE TABLE bankroll_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  amount DECIMAL(10, 2) NOT NULL,
  change_amount DECIMAL(10, 2) NOT NULL,
  change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('bet_placed', 'bet_settled', 'deposit', 'withdrawal', 'adjustment')),
  
  related_bet_id UUID REFERENCES bets(id) ON DELETE SET NULL,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  
  -- Stats
  bets_placed INTEGER DEFAULT 0,
  bets_won INTEGER DEFAULT 0,
  bets_lost INTEGER DEFAULT 0,
  bets_push INTEGER DEFAULT 0,
  
  total_staked DECIMAL(10, 2) DEFAULT 0,
  total_payout DECIMAL(10, 2) DEFAULT 0,
  profit_loss DECIMAL(10, 2) DEFAULT 0,
  roi DECIMAL(5, 2) DEFAULT 0,
  
  -- Bankroll
  starting_bankroll DECIMAL(10, 2),
  ending_bankroll DECIMAL(10, 2),
  peak_bankroll DECIMAL(10, 2),
  drawdown_percent DECIMAL(5, 2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Bets
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_game_date ON bets(game_date);
CREATE INDEX idx_bets_sport_league ON bets(sport, league);
CREATE INDEX idx_bets_created_at ON bets(created_at);
CREATE INDEX idx_bets_user_status ON bets(user_id, status);

-- Predictions
CREATE INDEX idx_predictions_game_id ON predictions(game_id);
CREATE INDEX idx_predictions_game_date ON predictions(game_date);
CREATE INDEX idx_predictions_sport_league ON predictions(sport, league);

-- Odds History
CREATE INDEX idx_odds_history_game_id ON odds_history(game_id);
CREATE INDEX idx_odds_history_timestamp ON odds_history(timestamp);
CREATE INDEX idx_odds_history_game_timestamp ON odds_history(game_id, timestamp);

-- Line Movements
CREATE INDEX idx_line_movements_game_id ON line_movements(game_id);
CREATE INDEX idx_line_movements_timestamp ON line_movements(timestamp);
CREATE INDEX idx_line_movements_steam ON line_movements(is_steam_move) WHERE is_steam_move = TRUE;
CREATE INDEX idx_line_movements_rlm ON line_movements(is_rlm) WHERE is_rlm = TRUE;

-- Player Game Logs
CREATE INDEX idx_player_game_logs_player_id ON player_game_logs(player_id);
CREATE INDEX idx_player_game_logs_game_date ON player_game_logs(game_date);
CREATE INDEX idx_player_game_logs_player_date ON player_game_logs(player_id, game_date);

-- Social
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_bet_comments_bet_id ON bet_comments(bet_id);
CREATE INDEX idx_bet_likes_bet_id ON bet_likes(bet_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bets_updated_at BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate bet profit/loss
CREATE OR REPLACE FUNCTION calculate_bet_profit_loss()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('won', 'lost', 'push') THEN
    IF NEW.status = 'won' THEN
      NEW.profit_loss = NEW.payout - NEW.stake_amount;
    ELSIF NEW.status = 'lost' THEN
      NEW.profit_loss = -NEW.stake_amount;
    ELSE -- push
      NEW.profit_loss = 0;
    END IF;
    NEW.settled_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_bet_profit_loss_trigger BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION calculate_bet_profit_loss();

-- ============================================
-- VIEWS
-- ============================================

-- User leaderboard view
CREATE VIEW user_leaderboard AS
SELECT 
  u.id,
  u.username,
  u.avatar_url,
  COUNT(b.id) AS total_bets,
  COUNT(CASE WHEN b.status = 'won' THEN 1 END) AS wins,
  COUNT(CASE WHEN b.status = 'lost' THEN 1 END) AS losses,
  CASE 
    WHEN COUNT(CASE WHEN b.status IN ('won', 'lost') THEN 1 END) > 0 
    THEN ROUND(100.0 * COUNT(CASE WHEN b.status = 'won' THEN 1 END) / COUNT(CASE WHEN b.status IN ('won', 'lost') THEN 1 END), 2)
    ELSE 0 
  END AS win_rate,
  COALESCE(SUM(b.profit_loss), 0) AS total_profit,
  COALESCE(SUM(b.stake_amount), 0) AS total_staked,
  CASE 
    WHEN SUM(b.stake_amount) > 0 
    THEN ROUND(100.0 * SUM(b.profit_loss) / SUM(b.stake_amount), 2)
    ELSE 0 
  END AS roi,
  u.bankroll - u.starting_bankroll AS bankroll_growth
FROM users u
LEFT JOIN bets b ON u.id = b.user_id AND b.status IN ('won', 'lost', 'push')
GROUP BY u.id, u.username, u.avatar_url, u.bankroll, u.starting_bankroll;

-- Recent active users view
CREATE VIEW recent_active_users AS
SELECT 
  u.id,
  u.username,
  u.avatar_url,
  COUNT(b.id) AS bets_last_7_days,
  MAX(b.created_at) AS last_bet_at
FROM users u
LEFT JOIN bets b ON u.id = b.user_id AND b.created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY u.id, u.username, u.avatar_url
ORDER BY bets_last_7_days DESC;
