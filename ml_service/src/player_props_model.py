"""
Player Props Neural Network Model
Deep learning model for predicting player performance (points, rebounds, assists, etc.)
Uses LSTM for time series patterns and attention mechanism for key features
"""

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import json
from datetime import datetime

class PlayerPropsDataset(Dataset):
    """Custom dataset for player props"""
    def __init__(self, X, y):
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y)
    
    def __len__(self):
        return len(self.X)
    
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

class AttentionLayer(nn.Module):
    """Attention mechanism for focusing on important features"""
    def __init__(self, hidden_size):
        super(AttentionLayer, self).__init__()
        self.attention = nn.Linear(hidden_size, 1)
    
    def forward(self, lstm_output):
        # lstm_output shape: (batch, seq_len, hidden_size)
        attention_weights = torch.softmax(self.attention(lstm_output), dim=1)
        context = torch.sum(attention_weights * lstm_output, dim=1)
        return context, attention_weights

class PlayerPropsModel(nn.Module):
    """
    Neural network for player props prediction
    Architecture: LSTM + Attention + Dense layers
    """
    def __init__(self, input_size, hidden_size=128, num_layers=2, output_size=1, dropout=0.3):
        super(PlayerPropsModel, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layers for sequence modeling
        self.lstm = nn.LSTM(
            input_size, 
            hidden_size, 
            num_layers, 
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        
        # Attention layer
        self.attention = AttentionLayer(hidden_size)
        
        # Dense layers
        self.fc1 = nn.Linear(hidden_size, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, output_size)
        
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout)
        self.batch_norm1 = nn.BatchNorm1d(64)
        self.batch_norm2 = nn.BatchNorm1d(32)
    
    def forward(self, x):
        # LSTM
        lstm_out, _ = self.lstm(x)
        
        # Attention
        context, attn_weights = self.attention(lstm_out)
        
        # Dense layers
        out = self.relu(self.fc1(context))
        out = self.batch_norm1(out)
        out = self.dropout(out)
        
        out = self.relu(self.fc2(out))
        out = self.batch_norm2(out)
        out = self.dropout(out)
        
        out = self.fc3(out)
        
        return out, attn_weights

class PlayerPropsPredictor:
    def __init__(self, prop_type='points', device='cpu'):
        self.prop_type = prop_type
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.version = "1.0.0"
        self.sequence_length = 10  # Last 10 games
        
    def engineer_features(self, df):
        """
        Create features for player props prediction
        """
        features = pd.DataFrame()
        
        # Player stats (rolling windows)
        for window in [3, 5, 10]:
            features[f'{self.prop_type}_l{window}'] = df.groupby('player_id')[self.prop_type].rolling(window).mean().reset_index(0, drop=True)
            features[f'{self.prop_type}_std_l{window}'] = df.groupby('player_id')[self.prop_type].rolling(window).std().reset_index(0, drop=True)
        
        # Season averages
        features['season_avg'] = df.groupby(['player_id', 'season'])[self.prop_type].transform('mean')
        
        # Minutes played
        features['minutes'] = df['minutes_played']
        features['minutes_l5'] = df.groupby('player_id')['minutes_played'].rolling(5).mean().reset_index(0, drop=True)
        
        # Usage rate
        features['usage_rate'] = df['field_goal_attempts'] + 0.44 * df['free_throw_attempts'] + df['turnovers']
        features['usage_rate'] = features['usage_rate'] / df['team_possessions']
        
        # Matchup difficulty
        features['opponent_def_rating'] = df['opponent_defensive_rating']
        features['opponent_rank'] = df['opponent_rank']
        
        # Home/Away
        features['is_home'] = df['is_home'].astype(int)
        
        # Rest days
        features['rest_days'] = (df['game_date'] - df.groupby('player_id')['game_date'].shift(1)).dt.days
        features['is_b2b'] = (features['rest_days'] == 1).astype(int)
        
        # Team pace
        features['team_pace'] = df['team_pace']
        features['opponent_pace'] = df['opponent_pace']
        features['pace_advantage'] = features['team_pace'] - features['opponent_pace']
        
        # Player efficiency
        features['per'] = df['player_efficiency_rating']
        features['per_l10'] = df.groupby('player_id')['player_efficiency_rating'].rolling(10).mean().reset_index(0, drop=True)
        
        # Injury status (0 = healthy, 1 = questionable, 2 = doubtful)
        features['injury_status'] = df.get('injury_status', 0)
        
        # Prop-specific features
        if self.prop_type == 'points':
            features['shot_attempts_l5'] = df.groupby('player_id')['field_goal_attempts'].rolling(5).mean().reset_index(0, drop=True)
            features['fg_pct_l10'] = df.groupby('player_id')['field_goal_pct'].rolling(10).mean().reset_index(0, drop=True)
            features['three_pt_attempts_l5'] = df.groupby('player_id')['three_point_attempts'].rolling(5).mean().reset_index(0, drop=True)
        
        elif self.prop_type == 'rebounds':
            features['rebound_rate'] = (df['offensive_rebounds'] + df['defensive_rebounds']) / df['minutes_played'] * 48
            features['opponent_rebound_rate'] = df['opponent_rebound_rate']
        
        elif self.prop_type == 'assists':
            features['assist_rate'] = df['assists'] / df['team_field_goals']
            features['assist_to_turnover'] = df['assists'] / (df['turnovers'] + 1)
        
        # Time-based features
        features['day_of_week'] = pd.to_datetime(df['game_date']).dt.dayofweek
        features['month'] = pd.to_datetime(df['game_date']).dt.month
        
        # Streak features
        features['games_over_line'] = df.groupby('player_id')['over_line'].rolling(10).sum().reset_index(0, drop=True)
        
        return features
    
    def create_sequences(self, X, y):
        """
        Create sequences for LSTM input
        """
        X_seq, y_seq = [], []
        
        for i in range(len(X) - self.sequence_length):
            X_seq.append(X[i:i + self.sequence_length])
            y_seq.append(y[i + self.sequence_length])
        
        return np.array(X_seq), np.array(y_seq)
    
    def train(self, df, epochs=100, batch_size=32, learning_rate=0.001):
        """
        Train the neural network model
        """
        print(f"Training {self.prop_type} prediction model v{self.version}")
        
        # Engineer features
        X = self.engineer_features(df)
        self.feature_columns = X.columns.tolist()
        X = X.fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Target variable
        y = df[self.prop_type].values
        
        # Create sequences
        X_seq, y_seq = self.create_sequences(X_scaled, y)
        
        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(
            X_seq, y_seq, test_size=0.2, shuffle=False
        )
        
        # Create datasets and dataloaders
        train_dataset = PlayerPropsDataset(X_train, y_train)
        test_dataset = PlayerPropsDataset(X_test, y_test)
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        test_loader = DataLoader(test_dataset, batch_size=batch_size)
        
        # Initialize model
        input_size = X_scaled.shape[1]
        self.model = PlayerPropsModel(input_size).to(self.device)
        
        # Loss and optimizer
        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=10, factor=0.5)
        
        # Training loop
        best_loss = float('inf')
        patience = 20
        patience_counter = 0
        
        for epoch in range(epochs):
            # Training
            self.model.train()
            train_loss = 0
            for X_batch, y_batch in train_loader:
                X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
                
                optimizer.zero_grad()
                output, _ = self.model(X_batch)
                loss = criterion(output.squeeze(), y_batch)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
            
            # Validation
            self.model.eval()
            val_loss = 0
            predictions = []
            actuals = []
            
            with torch.no_grad():
                for X_batch, y_batch in test_loader:
                    X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
                    output, _ = self.model(X_batch)
                    loss = criterion(output.squeeze(), y_batch)
                    val_loss += loss.item()
                    
                    predictions.extend(output.squeeze().cpu().numpy())
                    actuals.extend(y_batch.cpu().numpy())
            
            train_loss /= len(train_loader)
            val_loss /= len(test_loader)
            
            scheduler.step(val_loss)
            
            # Calculate MAE
            mae = np.mean(np.abs(np.array(predictions) - np.array(actuals)))
            
            if (epoch + 1) % 10 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, MAE: {mae:.2f}")
            
            # Early stopping
            if val_loss < best_loss:
                best_loss = val_loss
                patience_counter = 0
                # Save best model
                torch.save(self.model.state_dict(), f'./ml_service/models/player_props_{self.prop_type}_best.pth')
            else:
                patience_counter += 1
                if patience_counter >= patience:
                    print(f"Early stopping at epoch {epoch+1}")
                    break
        
        # Load best model
        self.model.load_state_dict(torch.load(f'./ml_service/models/player_props_{self.prop_type}_best.pth'))
        
        # Final evaluation
        final_mae = np.mean(np.abs(np.array(predictions) - np.array(actuals)))
        accuracy_within_2 = np.mean(np.abs(np.array(predictions) - np.array(actuals)) <= 2) * 100
        
        print(f"\nTraining complete!")
        print(f"Final MAE: {final_mae:.2f} {self.prop_type}")
        print(f"Accuracy within 2: {accuracy_within_2:.1f}%")
        
        return {
            'mae': final_mae,
            'accuracy_within_2': accuracy_within_2
        }
    
    def predict(self, player_recent_games, game_context):
        """
        Predict player prop value
        """
        self.model.eval()
        
        # Prepare features for last N games
        features_df = pd.concat([player_recent_games, pd.DataFrame([game_context])], ignore_index=True)
        X = self.engineer_features(features_df)
        X = X[self.feature_columns].fillna(0)
        X_scaled = self.scaler.transform(X)
        
        # Get last sequence_length games
        if len(X_scaled) < self.sequence_length:
            # Pad with zeros if not enough history
            padding = np.zeros((self.sequence_length - len(X_scaled), X_scaled.shape[1]))
            X_scaled = np.vstack([padding, X_scaled])
        else:
            X_scaled = X_scaled[-self.sequence_length:]
        
        # Reshape for model input
        X_tensor = torch.FloatTensor(X_scaled).unsqueeze(0).to(self.device)
        
        # Get prediction
        with torch.no_grad():
            prediction, attention_weights = self.model(X_tensor)
        
        predicted_value = prediction.item()
        
        # Calculate confidence based on recent consistency
        recent_std = np.std(player_recent_games[self.prop_type].tail(5))
        confidence = max(60, min(90, 85 - recent_std * 5))
        
        return {
            'predicted_value': float(predicted_value),
            'confidence': float(confidence),
            'prop_type': self.prop_type,
            'model_version': self.version,
            'attention_weights': attention_weights.cpu().numpy().tolist()
        }
    
    def save_model(self, path='./ml_service/models/'):
        """
        Save model and metadata
        """
        import os
        model_dir = f'{path}/player_props_{self.prop_type}_v{self.version}/'
        os.makedirs(model_dir, exist_ok=True)
        
        # Save PyTorch model
        torch.save(self.model.state_dict(), f'{model_dir}/model.pth')
        
        # Save scaler
        joblib.dump(self.scaler, f'{model_dir}/scaler.pkl')
        
        # Save metadata
        metadata = {
            'version': self.version,
            'prop_type': self.prop_type,
            'feature_columns': self.feature_columns,
            'sequence_length': self.sequence_length,
            'created_at': datetime.now().isoformat(),
            'framework': 'pytorch'
        }
        
        with open(f'{model_dir}/metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model saved to {model_dir}")
    
    def load_model(self, path='./ml_service/models/'):
        """
        Load trained model
        """
        model_dir = f'{path}/player_props_{self.prop_type}_v{self.version}/'
        
        # Load metadata
        with open(f'{model_dir}/metadata.json', 'r') as f:
            metadata = json.load(f)
        
        self.feature_columns = metadata['feature_columns']
        self.sequence_length = metadata['sequence_length']
        
        # Load scaler
        self.scaler = joblib.load(f'{model_dir}/scaler.pkl')
        
        # Initialize and load model
        input_size = len(self.feature_columns)
        self.model = PlayerPropsModel(input_size).to(self.device)
        self.model.load_state_dict(torch.load(f'{model_dir}/model.pth', map_location=self.device))
        self.model.eval()
        
        print(f"Model loaded from {model_dir}")

# Training script
if __name__ == "__main__":
    # Train models for each prop type
    prop_types = ['points', 'rebounds', 'assists', 'three_pointers', 'steals', 'blocks']
    
    for prop_type in prop_types:
        print(f"\n{'='*50}")
        print(f"Training {prop_type.upper()} model")
        print('='*50)
        
        # Load data
        df = pd.read_csv(f'./ml_service/data/player_gamelogs_{prop_type}.csv')
        df['game_date'] = pd.to_datetime(df['game_date'])
        
        # Initialize and train
        predictor = PlayerPropsPredictor(prop_type=prop_type)
        metrics = predictor.train(df, epochs=50)
        
        # Save model
        predictor.save_model()
        
        print(f"\n{prop_type.capitalize()} model complete!")
        print(f"MAE: {metrics['mae']:.2f}")
        print(f"Accuracy within 2: {metrics['accuracy_within_2']:.1%}")
