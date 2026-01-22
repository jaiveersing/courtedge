"""
Automated Model Training Pipeline
- Scheduled retraining on new data
- Data validation and preprocessing
- Model evaluation and comparison
- Automatic deployment of better models
- Performance monitoring
"""

import schedule
import time
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from pathlib import Path
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from nba_game_model import NBAGamePredictionModel
from player_props_model import PlayerPropsPredictor
import model_version_control

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('./ml_service/logs/training_pipeline.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ModelTrainingPipeline:
    def __init__(self):
        self.data_path = Path('./ml_service/data')
        self.models_path = Path('./ml_service/models')
        self.min_new_games = 100  # Minimum new games before retraining
        self.performance_threshold = 0.02  # 2% improvement required for deployment
        
    def fetch_new_data(self, model_type='nba_game'):
        """
        Fetch new game data since last training
        """
        logger.info(f"Fetching new data for {model_type}")
        
        try:
            # Get last training date
            metadata_file = self.models_path / model_type / 'metadata.json'
            if metadata_file.exists():
                import json
                with open(metadata_file) as f:
                    metadata = json.load(f)
                last_training_date = pd.to_datetime(metadata['created_at'])
            else:
                last_training_date = pd.to_datetime('2020-01-01')
            
            # Fetch new games from database
            # This would query your database for games after last_training_date
            # Simplified for demonstration
            query = f"""
            SELECT * FROM games 
            WHERE game_date > '{last_training_date.date()}'
            AND status = 'final'
            """
            
            # Execute query (pseudo-code)
            # df = execute_query(query)
            
            # For now, load from CSV
            df = pd.read_csv(self.data_path / 'nba_games_historical.csv')
            df['game_date'] = pd.to_datetime(df['game_date'])
            df = df[df['game_date'] > last_training_date]
            
            logger.info(f"Fetched {len(df)} new games")
            
            return df
            
        except Exception as e:
            logger.error(f"Error fetching new data: {e}")
            return pd.DataFrame()
    
    def validate_data(self, df):
        """
        Validate data quality and completeness
        """
        logger.info("Validating data quality")
        
        issues = []
        
        # Check for required columns
        required_cols = ['game_date', 'home_team', 'away_team', 'home_score', 'away_score']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            issues.append(f"Missing columns: {missing_cols}")
        
        # Check for missing values
        null_counts = df[required_cols].isnull().sum()
        if null_counts.any():
            issues.append(f"Missing values: {null_counts[null_counts > 0].to_dict()}")
        
        # Check for duplicates
        duplicates = df.duplicated(subset=['game_date', 'home_team', 'away_team']).sum()
        if duplicates > 0:
            issues.append(f"Duplicate games: {duplicates}")
            df = df.drop_duplicates(subset=['game_date', 'home_team', 'away_team'])
        
        # Check for outliers
        if 'home_score' in df.columns:
            score_mean = df['home_score'].mean()
            score_std = df['home_score'].std()
            outliers = df[(df['home_score'] < score_mean - 3*score_std) | 
                         (df['home_score'] > score_mean + 3*score_std)]
            if len(outliers) > 0:
                issues.append(f"Score outliers detected: {len(outliers)} games")
        
        if issues:
            logger.warning(f"Data validation issues: {issues}")
        else:
            logger.info("Data validation passed")
        
        return df, issues
    
    def train_nba_game_model(self):
        """
        Train NBA game prediction model
        """
        logger.info("Starting NBA game model training")
        
        try:
            # Fetch new data
            new_data = self.fetch_new_data('nba_game')
            
            if len(new_data) < self.min_new_games:
                logger.info(f"Insufficient new data ({len(new_data)} games). Skipping training.")
                return None
            
            # Validate data
            new_data, issues = self.validate_data(new_data)
            
            # Load historical data
            historical_data = pd.read_csv(self.data_path / 'nba_games_historical.csv')
            historical_data['game_date'] = pd.to_datetime(historical_data['game_date'])
            
            # Combine data
            full_data = pd.concat([historical_data, new_data], ignore_index=True)
            full_data = full_data.sort_values('game_date')
            
            logger.info(f"Training on {len(full_data)} total games")
            
            # Initialize model with new version
            current_version = self.get_next_version('nba_game')
            model = NBAGamePredictionModel()
            model.version = current_version
            
            # Train model
            metrics = model.train(full_data, test_size=0.15)
            
            # Save model
            model_path = self.models_path / f'nba_game_v{current_version}'
            model.save_model(str(model_path))
            
            # Register with version control
            model_version_control.registerModel(
                'nba_game',
                current_version,
                {
                    'sport': 'basketball_nba',
                    'modelType': 'game_prediction',
                    'framework': 'xgboost+lightgbm',
                    'trainingDataSize': len(full_data),
                    'features': model.feature_columns[:20]  # Top 20 features
                }
            )
            
            # Update performance metrics
            model_version_control.updatePerformanceMetrics(
                'nba_game',
                current_version,
                {
                    'mae_spread': metrics['spread_mae'],
                    'mae_total': metrics['total_mae'],
                    'accuracy_winner': metrics['winner_accuracy']
                }
            )
            
            logger.info(f"Model v{current_version} trained successfully")
            logger.info(f"Metrics: Spread MAE={metrics['spread_mae']:.2f}, "
                       f"Total MAE={metrics['total_mae']:.2f}, "
                       f"Winner Acc={metrics['winner_accuracy']:.1%}")
            
            # Evaluate against current production model
            should_deploy = self.evaluate_model_performance(
                'nba_game',
                current_version,
                metrics
            )
            
            if should_deploy:
                logger.info(f"Deploying v{current_version} to production")
                model_version_control.deployModel('nba_game', current_version, 'production', 100)
            else:
                logger.info(f"v{current_version} does not meet deployment threshold")
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error training NBA game model: {e}", exc_info=True)
            return None
    
    def train_player_props_models(self):
        """
        Train all player props models
        """
        logger.info("Starting player props models training")
        
        prop_types = ['points', 'rebounds', 'assists', 'three_pointers']
        results = {}
        
        for prop_type in prop_types:
            try:
                logger.info(f"Training {prop_type} model")
                
                # Load data
                data_file = self.data_path / f'player_gamelogs_{prop_type}.csv'
                if not data_file.exists():
                    logger.warning(f"Data file not found for {prop_type}")
                    continue
                
                df = pd.read_csv(data_file)
                df['game_date'] = pd.to_datetime(df['game_date'])
                
                # Initialize predictor
                current_version = self.get_next_version(f'player_props_{prop_type}')
                predictor = PlayerPropsPredictor(prop_type=prop_type)
                predictor.version = current_version
                
                # Train
                metrics = predictor.train(df, epochs=30, batch_size=32)
                
                # Save
                predictor.save_model()
                
                # Register
                model_version_control.registerModel(
                    f'player_props_{prop_type}',
                    current_version,
                    {
                        'sport': 'basketball_nba',
                        'modelType': 'player_props',
                        'propType': prop_type,
                        'framework': 'pytorch',
                        'trainingDataSize': len(df)
                    }
                )
                
                model_version_control.updatePerformanceMetrics(
                    f'player_props_{prop_type}',
                    current_version,
                    {
                        'mae': metrics['mae'],
                        'accuracy_within_2': metrics['accuracy_within_2']
                    }
                )
                
                results[prop_type] = metrics
                logger.info(f"{prop_type} model trained: MAE={metrics['mae']:.2f}")
                
            except Exception as e:
                logger.error(f"Error training {prop_type} model: {e}", exc_info=True)
        
        return results
    
    def evaluate_model_performance(self, model_name, new_version, new_metrics):
        """
        Compare new model against current production model
        """
        try:
            # Get current production model
            models = model_version_control.listModels(model_name)
            production_model = None
            
            for version, model in models.items():
                if model.get('deployment', {}).get('environment') == 'production':
                    production_model = model
                    break
            
            if not production_model:
                logger.info("No production model found. Deploying new model.")
                return True
            
            # Compare metrics
            if 'spread_mae' in new_metrics:
                # NBA game model
                current_mae = production_model['performance'].get('mae_spread', float('inf'))
                improvement = (current_mae - new_metrics['spread_mae']) / current_mae
                
                logger.info(f"Spread MAE improvement: {improvement:.1%}")
                
                if improvement >= self.performance_threshold:
                    return True
            
            elif 'mae' in new_metrics:
                # Player props model
                current_mae = production_model['performance'].get('mae', float('inf'))
                improvement = (current_mae - new_metrics['mae']) / current_mae
                
                logger.info(f"MAE improvement: {improvement:.1%}")
                
                if improvement >= self.performance_threshold:
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error evaluating model performance: {e}")
            return False
    
    def get_next_version(self, model_name):
        """
        Calculate next version number
        """
        models = model_version_control.listModels(model_name)
        
        if not models:
            return "1.0.0"
        
        versions = [v for v in models.keys()]
        latest = max(versions, key=lambda x: [int(n) for n in x.split('.')])
        
        major, minor, patch = [int(n) for n in latest.split('.')]
        
        # Increment patch version
        return f"{major}.{minor}.{patch + 1}"
    
    def cleanup_old_models(self, keep_versions=5):
        """
        Remove old model versions to save space
        """
        logger.info("Cleaning up old model versions")
        
        all_models = model_version_control.listModels()
        
        for model_name, versions in all_models.items():
            if len(versions) <= keep_versions:
                continue
            
            # Sort by creation date
            sorted_versions = sorted(
                versions.items(),
                key=lambda x: x[1].get('createdAt', ''),
                reverse=True
            )
            
            # Keep most recent versions and production model
            to_keep = set()
            for version, model in sorted_versions[:keep_versions]:
                to_keep.add(version)
            
            # Always keep production model
            for version, model in versions.items():
                if model.get('deployment', {}).get('environment') == 'production':
                    to_keep.add(version)
            
            # Archive old versions
            for version in versions.keys():
                if version not in to_keep:
                    try:
                        model_version_control.archiveModel(model_name, version)
                        logger.info(f"Archived {model_name} v{version}")
                    except Exception as e:
                        logger.error(f"Error archiving {model_name} v{version}: {e}")
    
    def run_full_pipeline(self):
        """
        Run complete training pipeline
        """
        logger.info("="*60)
        logger.info("Starting full training pipeline")
        logger.info("="*60)
        
        start_time = time.time()
        
        # Train NBA game model
        nba_metrics = self.train_nba_game_model()
        
        # Train player props models
        props_metrics = self.train_player_props_models()
        
        # Cleanup
        self.cleanup_old_models()
        
        duration = time.time() - start_time
        logger.info(f"Pipeline completed in {duration/60:.1f} minutes")
        logger.info("="*60)
    
    def schedule_training(self):
        """
        Schedule automated training runs
        """
        logger.info("Initializing training schedule")
        
        # Daily at 4 AM
        schedule.every().day.at("04:00").do(self.run_full_pipeline)
        
        # Weekly model cleanup on Sunday
        schedule.every().sunday.at("05:00").do(self.cleanup_old_models)
        
        logger.info("Training schedule initialized:")
        logger.info("- Daily training: 4:00 AM")
        logger.info("- Weekly cleanup: Sunday 5:00 AM")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

if __name__ == "__main__":
    pipeline = ModelTrainingPipeline()
    
    # Run immediately for testing
    pipeline.run_full_pipeline()
    
    # Then start scheduler
    # pipeline.schedule_training()
