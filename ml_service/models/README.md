# CourtEdge ML Models

## 🎯 Trained Models Overview

This directory contains all trained machine learning models for CourtEdge NBA betting predictions.

**Training Date:** January 20, 2026  
**Status:** ✅ All models trained and ready

---

## 📁 Model Structure

### **Player Props Models** (`player_props/`)
Predicts individual player performance metrics (points, rebounds, assists, etc.)

- **`lstm_model.pth`** (PyTorch LSTM Model)
  - Architecture: 2-layer LSTM with 128 hidden units
  - Input: 13 features (season stats, recent performance, matchup data)
  - Performance: MSE=10.31, MAE=2.58
  - Best for: Sequential pattern recognition in player performance
  
- **`xgboost_model.pkl`** (XGBoost Regressor)
  - Trees: 200, Max Depth: 6, Learning Rate: 0.05
  - Performance: MSE=10.69, MAE=2.60
  - Best for: Feature importance and interpretability

- **`scaler.pkl`** (StandardScaler)
  - Normalizes input features (mean=0, std=1)
  - Must be applied to all input data before prediction

### **Game Outcomes Models** (`game_outcomes/`)
Predicts game winners, spreads, and totals

- **`xgboost_classifier.pkl`** (XGBoost Classifier)
  - Accuracy: 60.67%, F1-Score: 0.714
  - Best for: Balanced prediction of game outcomes
  
- **`lightgbm_classifier.pkl`** (LightGBM Classifier)
  - Accuracy: 61.33%, F1-Score: 0.718
  - **HIGHEST ACCURACY** - Recommended primary model
  - Best for: Fast predictions with high accuracy

- **`gradient_boosting_classifier.pkl`** (Scikit-learn GB)
  - Accuracy: 60.50%, F1-Score: 0.711
  - Best for: Ensemble voting with other models

- **`scaler.pkl`** (StandardScaler)
  - Normalizes team ratings, rest days, streaks, etc.

### **Line Movement Models** (`line_movement/`)
Detects sharp money and predicts betting line movements

- **`random_forest_regressor.pkl`** (Random Forest)
  - Trees: 150, Max Depth: 8
  - Performance: MSE=0.0099, MAE=0.073
  - **BEST PERFORMER** - Lowest error
  - Best for: Detecting sharp money signals

- **`xgboost_regressor.pkl`** (XGBoost Regressor)
  - Performance: MSE=0.0106, MAE=0.075
  - Best for: Predicting exact line movement amounts

- **`scaler.pkl`** (StandardScaler)
  - Normalizes betting percentages, ticket counts, etc.

---

## 📊 Training Data

Models were trained on synthetic data simulating real NBA scenarios:

- **Player Props:** 5,000 player performances
  - 12 NBA superstars with realistic stat distributions
  - Factors: Home/Away, opponent defense, rest, health, minutes
  
- **Game Outcomes:** 3,000 games
  - 10 NBA teams with ELO-style ratings
  - Factors: Team ratings, rest, win streaks, spreads, totals
  
- **Line Movement:** 2,000 betting lines
  - Sharp vs public money dynamics
  - Steam moves and reverse line movement detection

---

## 🚀 Model Performance Summary

| Model Type | Primary Model | Accuracy/Error | Recommendation |
|-----------|--------------|----------------|----------------|
| Player Props | LSTM | MAE: 2.58 pts | Use for player prop O/U |
| Game Outcomes | LightGBM | 61.33% Acc | Use for game winners |
| Line Movement | Random Forest | MAE: 0.073 | Use for sharp alerts |

---

## 🔧 Usage in ML Service

Models are automatically loaded by the FastAPI service (`src/api.py`):

```python
# Player Props Prediction
POST /predict/player-prop
{
  "playerName": "LeBron James",
  "stat": "points",
  "line": 25.5,
  "opponent": "GSW",
  "homeAway": "away"
}

# Game Outcome Prediction
POST /predict/game-outcome
{
  "homeTeam": "LAL",
  "awayTeam": "GSW",
  "spread": -3.5,
  "total": 225.5
}

# Sharp Money Alerts
GET /sharp-money/alerts?date=2026-01-20&minThreshold=0.7
```

---

## 📈 Model Retraining

To retrain models with new data:

```bash
# From ml_service directory
python train_all_models.py
```

This will:
1. Generate fresh training data
2. Train all 10 models
3. Save models to respective directories
4. Update `training_summary.json`

**Training Time:** ~50 seconds on modern hardware

---

## 🎯 Model Ensemble Strategy

For best results, the ML service uses ensemble predictions:

### Player Props
- LSTM (70% weight) + XGBoost (30% weight)
- LSTM captures temporal patterns
- XGBoost adds feature-based insights

### Game Outcomes
- LightGBM (Primary) → Best accuracy
- XGBoost (Validation) → Cross-check
- Gradient Boosting (Tiebreaker) → Ensemble voting

### Line Movement
- Random Forest (Primary) → Lowest error
- XGBoost (Secondary) → Trend confirmation

---

## 📝 Feature Importance

### Top Player Props Features
1. **season_ppg** - Season average points
2. **last_5_avg** - Recent 5-game average
3. **opp_def_rating** - Opponent defensive rating
4. **is_home** - Home court advantage
5. **rest_days** - Days of rest

### Top Game Outcome Features
1. **home_rating** - Home team ELO rating
2. **away_rating** - Away team ELO rating
3. **spread** - Vegas spread line
4. **home_win_streak** - Recent momentum

### Top Line Movement Features
1. **sharp_percentage** - Sharp money %
2. **opening_line** - Initial line
3. **money_percentage** - Dollar amount %
4. **time_to_game** - Hours until game

---

## 🔍 Model Validation

All models use 80/20 train-test split with:
- **Random seed:** 42 (reproducible results)
- **Cross-validation:** Used during hyperparameter tuning
- **Regularization:** Dropout, early stopping, tree depth limits

---

## 📦 Model Files Size

- LSTM PyTorch models: ~500 KB
- XGBoost/LightGBM pickle files: ~100-300 KB each
- Scalers: ~5 KB each
- **Total:** ~2 MB (lightweight, fast loading)

---

## 🚨 Important Notes

1. **Scalers are REQUIRED** - Always apply the corresponding scaler before model prediction
2. **Feature Order Matters** - Input features must match training order
3. **Model Versions** - Check `training_summary.json` for timestamp
4. **Backup Models** - Keep previous versions before retraining

---

## 📞 Support

For model issues or questions:
- Check API logs: `ml_service/logs/`
- Review training summary: `models/training_summary.json`
- Test models: `python -m tests.test_models`

---

**Last Updated:** January 20, 2026  
**Model Version:** 1.0  
**Training Status:** ✅ Production Ready
