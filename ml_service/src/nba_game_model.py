"""
NBA Game Prediction Model - XGBoost/LightGBM
Advanced ensemble model for game outcome, spread, and totals predictions
"""

import numpy as np
import pandas as pd
import xgboost as xgb
import lightgbm as lgb
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_absolute_error, log_loss
import joblib
import json
from datetime import datetime, timedelta

class NBAGamePredictionModel:
    def __init__(self):
        self.model_spread = None
        self.model_total = None
        self.model_winner = None
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.version = "2.1.0"
        
    def engineer_features(self, df):
        """
        Create advanced features from raw data
        """
        features = pd.DataFrame()
        
        # Team strength metrics (rolling averages)
        for window in [5, 10, 20]:
            features[f'home_pts_l{window}'] = df.groupby('home_team')['home_score'].rolling(window).mean().reset_index(0, drop=True)
            features[f'away_pts_l{window}'] = df.groupby('away_team')['away_score'].rolling(window).mean().reset_index(0, drop=True)
            features[f'home_pts_allowed_l{window}'] = df.groupby('home_team')['away_score'].rolling(window).mean().reset_index(0, drop=True)
            features[f'away_pts_allowed_l{window}'] = df.groupby('away_team')['home_score'].rolling(window).mean().reset_index(0, drop=True)
        
        # Offensive/defensive ratings
        features['home_off_rating'] = df['home_score'] / df['home_possessions'] * 100
        features['away_off_rating'] = df['away_score'] / df['away_possessions'] * 100
        features['home_def_rating'] = df['away_score'] / df['home_possessions'] * 100
        features['away_def_rating'] = df['home_score'] / df['away_possessions'] * 100
        
        # Pace
        features['home_pace'] = df['home_possessions'] / df['minutes_played'] * 48
        features['away_pace'] = df['away_possessions'] / df['minutes_played'] * 48
        
        # Four factors
        # Shooting efficiency
        features['home_efg'] = (df['home_fg'] + 0.5 * df['home_3pm']) / df['home_fga']
        features['away_efg'] = (df['away_fg'] + 0.5 * df['away_3pm']) / df['away_fga']
        
        # Turnover rate
        features['home_tov_rate'] = df['home_to'] / df['home_possessions']
        features['away_tov_rate'] = df['away_to'] / df['away_possessions']
        
        # Rebounding rate
        features['home_oreb_rate'] = df['home_oreb'] / (df['home_oreb'] + df['away_dreb'])
        features['away_oreb_rate'] = df['away_oreb'] / (df['away_oreb'] + df['home_dreb'])
        
        # Free throw rate
        features['home_ft_rate'] = df['home_fta'] / df['home_fga']
        features['away_ft_rate'] = df['away_fta'] / df['away_fga']
        
        # Rest days
        features['home_rest_days'] = (df['game_date'] - df.groupby('home_team')['game_date'].shift(1)).dt.days
        features['away_rest_days'] = (df['game_date'] - df.groupby('away_team')['game_date'].shift(1)).dt.days
        
        # Back-to-back indicator
        features['home_b2b'] = (features['home_rest_days'] == 1).astype(int)
        features['away_b2b'] = (features['away_rest_days'] == 1).astype(int)
        
        # Win streak
        features['home_win_streak'] = df.groupby('home_team')['home_win'].rolling(10).sum().reset_index(0, drop=True)
        features['away_win_streak'] = df.groupby('away_team')['away_win'].rolling(10).sum().reset_index(0, drop=True)
        
        # Home court advantage
        features['home_court_advantage'] = 3.5  # Average NBA home court advantage in points
        
        # Injury impact (placeholder - would integrate with injury service)
        features['home_injury_impact'] = df.get('home_injury_impact', 0)
        features['away_injury_impact'] = df.get('away_injury_impact', 0)
        
        # Head-to-head history
        features['h2h_home_wins'] = df.groupby(['home_team', 'away_team'])['home_win'].expanding().sum().reset_index(0, drop=True).shift(1)
        
        # Team rankings
        features['home_rank'] = df['home_team_rank']
        features['away_rank'] = df['away_team_rank']
        features['rank_diff'] = features['home_rank'] - features['away_rank']
        
        # Advanced metrics
        features['home_net_rating'] = features['home_off_rating'] - features['home_def_rating']
        features['away_net_rating'] = features['away_off_rating'] - features['away_def_rating']
        features['net_rating_diff'] = features['home_net_rating'] - features['away_net_rating']
        
        # Betting line features (if available)
        if 'opening_spread' in df.columns:
            features['opening_spread'] = df['opening_spread']
            features['opening_total'] = df['opening_total']
            features['line_movement'] = df['current_spread'] - df['opening_spread']
        
        return features
    
    def train(self, df, test_size=0.2):
        """
        Train ensemble of XGBoost and LightGBM models
        """
        print(f"Training NBA Game Prediction Model v{self.version}")
        
        # Engineer features
        X = self.engineer_features(df)
        self.feature_columns = X.columns.tolist()
        
        # Fill NaN values
        X = X.fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        X_scaled = pd.DataFrame(X_scaled, columns=self.feature_columns)
        
        # Target variables
        y_spread = df['home_score'] - df['away_score']  # Actual margin
        y_total = df['home_score'] + df['away_score']   # Actual total
        y_winner = (df['home_score'] > df['away_score']).astype(int)
        
        # Time series split for validation
        tscv = TimeSeriesSplit(n_splits=5)
        
        # Train spread model (XGBoost)
        print("Training spread model...")
        self.model_spread = xgb.XGBRegressor(
            n_estimators=500,
            max_depth=8,
            learning_rate=0.01,
            subsample=0.8,
            colsample_bytree=0.8,
            objective='reg:squarederror',
            eval_metric='mae',
            early_stopping_rounds=50
        )
        
        X_train_spread, X_test_spread, y_train_spread, y_test_spread = train_test_split(
            X_scaled, y_spread, test_size=test_size, shuffle=False
        )
        
        self.model_spread.fit(
            X_train_spread, y_train_spread,
            eval_set=[(X_test_spread, y_test_spread)],
            verbose=False
        )
        
        spread_mae = mean_absolute_error(y_test_spread, self.model_spread.predict(X_test_spread))
        print(f"Spread Model MAE: {spread_mae:.2f} points")
        
        # Train total model (LightGBM)
        print("Training total model...")
        self.model_total = lgb.LGBMRegressor(
            n_estimators=500,
            max_depth=8,
            learning_rate=0.01,
            subsample=0.8,
            colsample_bytree=0.8,
            objective='regression',
            metric='mae',
            early_stopping_rounds=50
        )
        
        X_train_total, X_test_total, y_train_total, y_test_total = train_test_split(
            X_scaled, y_total, test_size=test_size, shuffle=False
        )
        
        self.model_total.fit(
            X_train_total, y_train_total,
            eval_set=[(X_test_total, y_test_total)],
            eval_metric='mae'
        )
        
        total_mae = mean_absolute_error(y_test_total, self.model_total.predict(X_test_total))
        print(f"Total Model MAE: {total_mae:.2f} points")
        
        # Train winner model (XGBoost Classifier)
        print("Training winner model...")
        self.model_winner = xgb.XGBClassifier(
            n_estimators=500,
            max_depth=6,
            learning_rate=0.01,
            subsample=0.8,
            colsample_bytree=0.8,
            objective='binary:logistic',
            eval_metric='logloss',
            early_stopping_rounds=50
        )
        
        X_train_winner, X_test_winner, y_train_winner, y_test_winner = train_test_split(
            X_scaled, y_winner, test_size=test_size, shuffle=False
        )
        
        self.model_winner.fit(
            X_train_winner, y_train_winner,
            eval_set=[(X_test_winner, y_test_winner)],
            verbose=False
        )
        
        winner_acc = accuracy_score(y_test_winner, self.model_winner.predict(X_test_winner))
        print(f"Winner Model Accuracy: {winner_acc:.1%}")
        
        # Feature importance
        self.analyze_feature_importance()
        
        return {
            'spread_mae': spread_mae,
            'total_mae': total_mae,
            'winner_accuracy': winner_acc
        }
    
    def predict(self, game_features):
        """
        Predict game outcome, spread, and total
        """
        # Engineer features
        X = self.engineer_features(pd.DataFrame([game_features]))
        X = X[self.feature_columns].fillna(0)
        X_scaled = self.scaler.transform(X)
        
        # Get predictions
        predicted_margin = self.model_spread.predict(X_scaled)[0]
        predicted_total = self.model_total.predict(X_scaled)[0]
        win_probability = self.model_winner.predict_proba(X_scaled)[0][1]
        
        # Calculate scores
        home_score = (predicted_total + predicted_margin) / 2
        away_score = (predicted_total - predicted_margin) / 2
        
        # Confidence intervals (based on historical MAE)
        spread_confidence = self.calculate_confidence(predicted_margin, 'spread')
        total_confidence = self.calculate_confidence(predicted_total, 'total')
        
        return {
            'predicted_winner': 'home' if predicted_margin > 0 else 'away',
            'win_probability': float(win_probability * 100),
            'predicted_spread': float(predicted_margin),
            'spread_confidence': float(spread_confidence),
            'predicted_total': float(predicted_total),
            'total_confidence': float(total_confidence),
            'predicted_home_score': float(home_score),
            'predicted_away_score': float(away_score),
            'model_version': self.version
        }
    
    def calculate_confidence(self, prediction, pred_type):
        """
        Calculate confidence score based on historical accuracy
        """
        # This would use actual historical MAE per prediction range
        # Simplified for demonstration
        if pred_type == 'spread':
            base_confidence = 75
            # Higher confidence for larger spreads
            confidence = min(90, base_confidence + abs(prediction) * 0.5)
        else:  # total
            base_confidence = 70
            # Confidence based on deviation from average
            avg_total = 220
            deviation = abs(prediction - avg_total)
            confidence = max(60, base_confidence - deviation * 0.1)
        
        return confidence
    
    def analyze_feature_importance(self):
        """
        Analyze and save feature importance
        """
        importance_spread = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model_spread.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features (Spread):")
        print(importance_spread.head(10))
        
        return importance_spread
    
    def save_model(self, path='./ml_service/models/nba_game_v2.1.0/'):
        """
        Save trained models and metadata
        """
        import os
        os.makedirs(path, exist_ok=True)
        
        # Save models
        joblib.dump(self.model_spread, f'{path}/spread_model.pkl')
        joblib.dump(self.model_total, f'{path}/total_model.pkl')
        joblib.dump(self.model_winner, f'{path}/winner_model.pkl')
        joblib.dump(self.scaler, f'{path}/scaler.pkl')
        
        # Save metadata
        metadata = {
            'version': self.version,
            'feature_columns': self.feature_columns,
            'created_at': datetime.now().isoformat(),
            'framework': 'xgboost+lightgbm'
        }
        
        with open(f'{path}/metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model saved to {path}")
    
    def load_model(self, path='./ml_service/models/nba_game_v2.1.0/'):
        """
        Load trained models
        """
        self.model_spread = joblib.load(f'{path}/spread_model.pkl')
        self.model_total = joblib.load(f'{path}/total_model.pkl')
        self.model_winner = joblib.load(f'{path}/winner_model.pkl')
        self.scaler = joblib.load(f'{path}/scaler.pkl')
        
        with open(f'{path}/metadata.json', 'r') as f:
            metadata = json.load(f)
        
        self.feature_columns = metadata['feature_columns']
        self.version = metadata['version']
        
        print(f"Model v{self.version} loaded from {path}")

# Training script
if __name__ == "__main__":
    # Load training data
    df = pd.read_csv('./ml_service/data/nba_games_historical.csv')
    df['game_date'] = pd.to_datetime(df['game_date'])
    
    # Initialize and train model
    model = NBAGamePredictionModel()
    metrics = model.train(df)
    
    # Save model
    model.save_model()
    
    print(f"\nModel training complete!")
    print(f"Spread MAE: {metrics['spread_mae']:.2f}")
    print(f"Total MAE: {metrics['total_mae']:.2f}")
    print(f"Winner Accuracy: {metrics['winner_accuracy']:.1%}")
