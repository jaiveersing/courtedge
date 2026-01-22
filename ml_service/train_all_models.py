"""
Complete ML Model Training Pipeline for CourtEdge
Trains all models: Player Props, Game Outcomes, Line Movement
"""

import os
import sys
import logging
import pickle
import json
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

# ML Libraries
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score, f1_score
import xgboost as xgb
import lightgbm as lgb

# Deep Learning
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create model directories
MODEL_DIRS = [
    'models/player_props',
    'models/game_outcomes',
    'models/line_movement',
    'data/features',
    'data/historical',
    'data/cache'
]

for dir_path in MODEL_DIRS:
    os.makedirs(dir_path, exist_ok=True)
    logger.info(f"Created directory: {dir_path}")


class PlayerPropsLSTM(nn.Module):
    """LSTM model for player prop predictions"""
    def __init__(self, input_size=20, hidden_size=128, num_layers=2, output_size=1):
        super(PlayerPropsLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc1 = nn.Linear(hidden_size, 64)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(64, output_size)
        
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc1(out[:, -1, :])
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        return out


def generate_synthetic_player_data(num_samples=5000):
    """Generate synthetic player performance data for training"""
    logger.info(f"Generating {num_samples} synthetic player samples...")
    
    np.random.seed(42)
    
    # Player features
    players = ['LeBron James', 'Stephen Curry', 'Giannis Antetokounmpo', 'Luka Doncic', 
               'Joel Embiid', 'Nikola Jokic', 'Kevin Durant', 'Damian Lillard',
               'Jayson Tatum', 'Anthony Davis', 'Kawhi Leonard', 'Jimmy Butler']
    
    data = []
    for _ in range(num_samples):
        player = np.random.choice(players)
        
        # Base stats with some variance
        base_ppg = np.random.uniform(15, 35)
        base_rpg = np.random.uniform(3, 12)
        base_apg = np.random.uniform(2, 10)
        
        # Recent performance (last 5 games)
        recent_games = np.random.normal(base_ppg, 5, 5)
        
        # Opponent defensive rating (lower is better defense)
        opp_def_rating = np.random.uniform(105, 118)
        
        # Home/Away factor
        is_home = np.random.choice([0, 1])
        home_advantage = 2.5 if is_home else -2.5
        
        # Rest days
        rest_days = np.random.choice([0, 1, 2, 3, 4])
        rest_factor = min(rest_days * 0.5, 2)
        
        # Minutes expected
        minutes = np.random.uniform(28, 38)
        
        # Injury status (0-100)
        health = np.random.uniform(85, 100)
        
        # Calculate target (actual performance)
        target_points = (
            base_ppg + 
            home_advantage + 
            rest_factor + 
            (115 - opp_def_rating) * 0.3 +
            (minutes - 33) * 0.2 +
            (health - 92.5) * 0.1 +
            np.random.normal(0, 3)
        )
        
        target_rebounds = base_rpg + np.random.normal(0, 1.5)
        target_assists = base_apg + np.random.normal(0, 1.5)
        
        data.append({
            'player': player,
            'season_ppg': base_ppg,
            'season_rpg': base_rpg,
            'season_apg': base_apg,
            'last_5_avg': np.mean(recent_games),
            'last_game': recent_games[-1],
            'opp_def_rating': opp_def_rating,
            'is_home': is_home,
            'rest_days': rest_days,
            'minutes_avg': minutes,
            'health_status': health,
            'usage_rate': np.random.uniform(20, 35),
            'ts_percentage': np.random.uniform(52, 65),
            'opponent_pace': np.random.uniform(95, 105),
            'target_points': max(0, target_points),
            'target_rebounds': max(0, target_rebounds),
            'target_assists': max(0, target_assists)
        })
    
    return pd.DataFrame(data)


def generate_synthetic_game_data(num_samples=3000):
    """Generate synthetic game outcome data"""
    logger.info(f"Generating {num_samples} synthetic game samples...")
    
    np.random.seed(42)
    
    teams = ['LAL', 'GSW', 'BOS', 'MIA', 'MIL', 'PHX', 'DEN', 'PHI', 'DAL', 'BKN']
    
    # Team ratings (simplified ELO-style)
    team_ratings = {team: np.random.uniform(1450, 1650) for team in teams}
    
    data = []
    for _ in range(num_samples):
        home_team = np.random.choice(teams)
        away_team = np.random.choice([t for t in teams if t != home_team])
        
        home_rating = team_ratings[home_team]
        away_rating = team_ratings[away_team]
        
        # Home court advantage
        home_advantage = 3.5
        
        # Calculate expected point differential
        rating_diff = (home_rating - away_rating) / 25 + home_advantage
        
        # Add randomness
        actual_diff = rating_diff + np.random.normal(0, 10)
        
        home_score = np.random.uniform(105, 125)
        away_score = home_score - actual_diff
        
        home_win = 1 if home_score > away_score else 0
        
        data.append({
            'home_team': home_team,
            'away_team': away_team,
            'home_rating': home_rating,
            'away_rating': away_rating,
            'home_rest_days': np.random.choice([0, 1, 2, 3]),
            'away_rest_days': np.random.choice([0, 1, 2, 3]),
            'home_win_streak': np.random.choice([-2, -1, 0, 1, 2, 3]),
            'away_win_streak': np.random.choice([-2, -1, 0, 1, 2, 3]),
            'spread': -rating_diff / 2,
            'total': 220 + np.random.uniform(-10, 10),
            'home_score': home_score,
            'away_score': away_score,
            'home_win': home_win,
            'total_score': home_score + away_score
        })
    
    return pd.DataFrame(data)


def generate_synthetic_line_movement_data(num_samples=2000):
    """Generate synthetic betting line movement data"""
    logger.info(f"Generating {num_samples} synthetic line movement samples...")
    
    np.random.seed(42)
    
    data = []
    for _ in range(num_samples):
        opening_line = np.random.uniform(-10, 10)
        
        # Sharp money indicators
        sharp_percentage = np.random.uniform(0.3, 0.9)
        public_percentage = 1 - sharp_percentage
        
        # Line movement based on sharp money
        line_movement = (sharp_percentage - 0.6) * np.random.uniform(1, 3)
        
        closing_line = opening_line + line_movement
        
        # Steam move indicator
        is_steam = 1 if abs(line_movement) > 1.5 else 0
        
        # Reverse line movement (public on one side, line moves other way)
        is_rlm = 1 if (public_percentage > 0.65 and line_movement * opening_line < 0) else 0
        
        data.append({
            'opening_line': opening_line,
            'closing_line': closing_line,
            'line_movement': line_movement,
            'sharp_percentage': sharp_percentage,
            'public_percentage': public_percentage,
            'ticket_count': np.random.randint(1000, 50000),
            'money_percentage': sharp_percentage * 0.7 + np.random.uniform(-0.1, 0.1),
            'is_steam_move': is_steam,
            'is_rlm': is_rlm,
            'time_to_game': np.random.uniform(1, 72),
            'sharp_signal': 1 if sharp_percentage > 0.7 and abs(line_movement) > 1 else 0
        })
    
    return pd.DataFrame(data)


def train_player_props_lstm(X_train, y_train, X_test, y_test):
    """Train LSTM model for player props"""
    logger.info("Training Player Props LSTM model...")
    
    # Reshape for LSTM [batch_size, sequence_length, features]
    X_train_tensor = torch.FloatTensor(X_train).unsqueeze(1)
    y_train_tensor = torch.FloatTensor(y_train).unsqueeze(1)
    X_test_tensor = torch.FloatTensor(X_test).unsqueeze(1)
    y_test_tensor = torch.FloatTensor(y_test).unsqueeze(1)
    
    # Create datasets
    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    
    # Initialize model
    model = PlayerPropsLSTM(input_size=X_train.shape[1], hidden_size=128, num_layers=2)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Training
    num_epochs = 50
    best_loss = float('inf')
    
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        
        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        avg_loss = total_loss / len(train_loader)
        
        if (epoch + 1) % 10 == 0:
            logger.info(f"Epoch [{epoch+1}/{num_epochs}], Loss: {avg_loss:.4f}")
        
        if avg_loss < best_loss:
            best_loss = avg_loss
    
    # Evaluate
    model.eval()
    with torch.no_grad():
        predictions = model(X_test_tensor).numpy()
        mse = mean_squared_error(y_test, predictions)
        mae = mean_absolute_error(y_test, predictions)
        
        logger.info(f"Player Props LSTM - MSE: {mse:.4f}, MAE: {mae:.4f}")
    
    # Save model
    model_path = 'models/player_props/lstm_model.pth'
    torch.save({
        'model_state_dict': model.state_dict(),
        'input_size': X_train.shape[1],
        'hidden_size': 128,
        'num_layers': 2,
        'mse': float(mse),
        'mae': float(mae)
    }, model_path)
    logger.info(f"Saved LSTM model to {model_path}")
    
    return model, {'mse': float(mse), 'mae': float(mae)}


def train_player_props_xgboost(X_train, y_train, X_test, y_test):
    """Train XGBoost model for player props"""
    logger.info("Training Player Props XGBoost model...")
    
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    
    logger.info(f"Player Props XGBoost - MSE: {mse:.4f}, MAE: {mae:.4f}")
    
    # Save model
    model_path = 'models/player_props/xgboost_model.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    logger.info(f"Saved XGBoost model to {model_path}")
    
    return model, {'mse': float(mse), 'mae': float(mae)}


def train_game_outcome_models(X_train, y_train, X_test, y_test):
    """Train models for game outcome prediction"""
    logger.info("Training Game Outcome models...")
    
    models = {}
    metrics = {}
    
    # XGBoost Classifier
    logger.info("Training XGBoost Classifier...")
    xgb_model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        random_state=42
    )
    xgb_model.fit(X_train, y_train)
    xgb_pred = xgb_model.predict(X_test)
    xgb_acc = accuracy_score(y_test, xgb_pred)
    xgb_f1 = f1_score(y_test, xgb_pred)
    
    logger.info(f"XGBoost - Accuracy: {xgb_acc:.4f}, F1: {xgb_f1:.4f}")
    
    with open('models/game_outcomes/xgboost_classifier.pkl', 'wb') as f:
        pickle.dump(xgb_model, f)
    
    models['xgboost'] = xgb_model
    metrics['xgboost'] = {'accuracy': float(xgb_acc), 'f1_score': float(xgb_f1)}
    
    # LightGBM Classifier
    logger.info("Training LightGBM Classifier...")
    lgb_model = lgb.LGBMClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        random_state=42,
        verbose=-1
    )
    lgb_model.fit(X_train, y_train)
    lgb_pred = lgb_model.predict(X_test)
    lgb_acc = accuracy_score(y_test, lgb_pred)
    lgb_f1 = f1_score(y_test, lgb_pred)
    
    logger.info(f"LightGBM - Accuracy: {lgb_acc:.4f}, F1: {lgb_f1:.4f}")
    
    with open('models/game_outcomes/lightgbm_classifier.pkl', 'wb') as f:
        pickle.dump(lgb_model, f)
    
    models['lightgbm'] = lgb_model
    metrics['lightgbm'] = {'accuracy': float(lgb_acc), 'f1_score': float(lgb_f1)}
    
    # Gradient Boosting Classifier
    logger.info("Training Gradient Boosting Classifier...")
    gb_model = GradientBoostingClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    gb_model.fit(X_train, y_train)
    gb_pred = gb_model.predict(X_test)
    gb_acc = accuracy_score(y_test, gb_pred)
    gb_f1 = f1_score(y_test, gb_pred)
    
    logger.info(f"Gradient Boosting - Accuracy: {gb_acc:.4f}, F1: {gb_f1:.4f}")
    
    with open('models/game_outcomes/gradient_boosting_classifier.pkl', 'wb') as f:
        pickle.dump(gb_model, f)
    
    models['gradient_boosting'] = gb_model
    metrics['gradient_boosting'] = {'accuracy': float(gb_acc), 'f1_score': float(gb_f1)}
    
    logger.info("Saved all game outcome models")
    
    return models, metrics


def train_line_movement_models(X_train, y_train, X_test, y_test):
    """Train models for line movement prediction"""
    logger.info("Training Line Movement models...")
    
    models = {}
    metrics = {}
    
    # Random Forest Classifier
    logger.info("Training Random Forest for sharp signals...")
    rf_model = RandomForestRegressor(
        n_estimators=150,
        max_depth=8,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    rf_mse = mean_squared_error(y_test, rf_pred)
    rf_mae = mean_absolute_error(y_test, rf_pred)
    
    logger.info(f"Random Forest - MSE: {rf_mse:.4f}, MAE: {rf_mae:.4f}")
    
    with open('models/line_movement/random_forest_regressor.pkl', 'wb') as f:
        pickle.dump(rf_model, f)
    
    models['random_forest'] = rf_model
    metrics['random_forest'] = {'mse': float(rf_mse), 'mae': float(rf_mae)}
    
    # XGBoost Regressor
    logger.info("Training XGBoost for line movement...")
    xgb_model = xgb.XGBRegressor(
        n_estimators=150,
        max_depth=6,
        learning_rate=0.05,
        random_state=42
    )
    xgb_model.fit(X_train, y_train)
    xgb_pred = xgb_model.predict(X_test)
    xgb_mse = mean_squared_error(y_test, xgb_pred)
    xgb_mae = mean_absolute_error(y_test, xgb_pred)
    
    logger.info(f"XGBoost - MSE: {xgb_mse:.4f}, MAE: {xgb_mae:.4f}")
    
    with open('models/line_movement/xgboost_regressor.pkl', 'wb') as f:
        pickle.dump(xgb_model, f)
    
    models['xgboost'] = xgb_model
    metrics['xgboost'] = {'mse': float(xgb_mse), 'mae': float(xgb_mae)}
    
    logger.info("Saved all line movement models")
    
    return models, metrics


def train_all_models():
    """Main training pipeline"""
    logger.info("="*60)
    logger.info("STARTING COURTEDGE ML MODEL TRAINING PIPELINE")
    logger.info("="*60)
    
    training_summary = {
        'timestamp': datetime.now().isoformat(),
        'models': {}
    }
    
    # 1. PLAYER PROPS MODELS
    logger.info("\n" + "="*60)
    logger.info("PHASE 1: PLAYER PROPS MODELS")
    logger.info("="*60)
    
    player_data = generate_synthetic_player_data(5000)
    
    # Features for player props
    feature_cols = [
        'season_ppg', 'season_rpg', 'season_apg', 'last_5_avg', 'last_game',
        'opp_def_rating', 'is_home', 'rest_days', 'minutes_avg', 
        'health_status', 'usage_rate', 'ts_percentage', 'opponent_pace'
    ]
    
    X = player_data[feature_cols].values
    y = player_data['target_points'].values
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Save scaler
    with open('models/player_props/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    logger.info("Saved feature scaler")
    
    # Train LSTM
    lstm_model, lstm_metrics = train_player_props_lstm(X_train, y_train, X_test, y_test)
    training_summary['models']['player_props_lstm'] = lstm_metrics
    
    # Train XGBoost
    xgb_model, xgb_metrics = train_player_props_xgboost(X_train, y_train, X_test, y_test)
    training_summary['models']['player_props_xgboost'] = xgb_metrics
    
    # 2. GAME OUTCOME MODELS
    logger.info("\n" + "="*60)
    logger.info("PHASE 2: GAME OUTCOME MODELS")
    logger.info("="*60)
    
    game_data = generate_synthetic_game_data(3000)
    
    game_features = [
        'home_rating', 'away_rating', 'home_rest_days', 'away_rest_days',
        'home_win_streak', 'away_win_streak', 'spread', 'total'
    ]
    
    X_game = game_data[game_features].values
    y_game = game_data['home_win'].values
    
    game_scaler = StandardScaler()
    X_game_scaled = game_scaler.fit_transform(X_game)
    
    X_train_game, X_test_game, y_train_game, y_test_game = train_test_split(
        X_game_scaled, y_game, test_size=0.2, random_state=42
    )
    
    with open('models/game_outcomes/scaler.pkl', 'wb') as f:
        pickle.dump(game_scaler, f)
    logger.info("Saved game outcome scaler")
    
    game_models, game_metrics = train_game_outcome_models(
        X_train_game, y_train_game, X_test_game, y_test_game
    )
    training_summary['models']['game_outcomes'] = game_metrics
    
    # 3. LINE MOVEMENT MODELS
    logger.info("\n" + "="*60)
    logger.info("PHASE 3: LINE MOVEMENT MODELS")
    logger.info("="*60)
    
    line_data = generate_synthetic_line_movement_data(2000)
    
    line_features = [
        'opening_line', 'sharp_percentage', 'public_percentage', 
        'ticket_count', 'money_percentage', 'time_to_game'
    ]
    
    X_line = line_data[line_features].values
    y_line = line_data['line_movement'].values
    
    line_scaler = StandardScaler()
    X_line_scaled = line_scaler.fit_transform(X_line)
    
    X_train_line, X_test_line, y_train_line, y_test_line = train_test_split(
        X_line_scaled, y_line, test_size=0.2, random_state=42
    )
    
    with open('models/line_movement/scaler.pkl', 'wb') as f:
        pickle.dump(line_scaler, f)
    logger.info("Saved line movement scaler")
    
    line_models, line_metrics = train_line_movement_models(
        X_train_line, y_train_line, X_test_line, y_test_line
    )
    training_summary['models']['line_movement'] = line_metrics
    
    # Save training summary
    summary_path = 'models/training_summary.json'
    with open(summary_path, 'w') as f:
        json.dump(training_summary, f, indent=2)
    
    logger.info("\n" + "="*60)
    logger.info("TRAINING COMPLETE!")
    logger.info("="*60)
    logger.info(f"\nTraining summary saved to: {summary_path}")
    logger.info("\nModel files created:")
    logger.info("  - models/player_props/lstm_model.pth")
    logger.info("  - models/player_props/xgboost_model.pkl")
    logger.info("  - models/player_props/scaler.pkl")
    logger.info("  - models/game_outcomes/xgboost_classifier.pkl")
    logger.info("  - models/game_outcomes/lightgbm_classifier.pkl")
    logger.info("  - models/game_outcomes/gradient_boosting_classifier.pkl")
    logger.info("  - models/game_outcomes/scaler.pkl")
    logger.info("  - models/line_movement/random_forest_regressor.pkl")
    logger.info("  - models/line_movement/xgboost_regressor.pkl")
    logger.info("  - models/line_movement/scaler.pkl")
    logger.info("\n" + "="*60)
    
    return training_summary


if __name__ == "__main__":
    try:
        summary = train_all_models()
        logger.info("\n✅ ALL MODELS TRAINED SUCCESSFULLY!")
        sys.exit(0)
    except Exception as e:
        logger.error(f"\n❌ Training failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
