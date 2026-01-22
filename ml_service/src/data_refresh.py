"""
Automated data refresh and model update pipeline
"""
import schedule
import time
from datetime import datetime, timedelta
import logging
from pathlib import Path
import sys
import subprocess
from typing import Optional
import threading

logger = logging.getLogger(__name__)


class DataRefreshPipeline:
    """Automated pipeline for data collection and model updates"""
    
    def __init__(self, ml_service_path: str = "ml_service"):
        self.ml_service_path = Path(ml_service_path)
        self.last_refresh = None
        self.last_training = None
        self.is_running = False
        
    def collect_daily_data(self):
        """Collect yesterday's NBA data"""
        logger.info("Starting daily data collection...")
        
        try:
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            
            # Import data collection module
            sys.path.insert(0, str(self.ml_service_path / "src"))
            from nba_data import NBADataCollector
            
            collector = NBADataCollector()
            
            # Collect game data from yesterday
            logger.info(f"Collecting games from {yesterday}")
            games_data = collector.get_games_by_date(yesterday)
            
            if games_data:
                logger.info(f"Collected {len(games_data)} games")
                
                # Save to historical data
                data_path = self.ml_service_path / "data" / "historical"
                data_path.mkdir(parents=True, exist_ok=True)
                
                import pandas as pd
                df = pd.DataFrame(games_data)
                file_path = data_path / f"games_{yesterday}.csv"
                df.to_csv(file_path, index=False)
                
                logger.info(f"Saved data to {file_path}")
                self.last_refresh = datetime.now()
                
                return True
            else:
                logger.warning(f"No games found for {yesterday}")
                return False
                
        except Exception as e:
            logger.error(f"Error in daily data collection: {e}")
            return False
    
    def incremental_model_update(self):
        """Update models with new data incrementally"""
        logger.info("Starting incremental model update...")
        
        try:
            # Check if we have new data
            data_path = self.ml_service_path / "data" / "historical"
            
            if not data_path.exists():
                logger.warning("No historical data found")
                return False
            
            # Get all data files from last 7 days
            recent_files = []
            for i in range(7):
                date_str = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
                file_path = data_path / f"games_{date_str}.csv"
                if file_path.exists():
                    recent_files.append(file_path)
            
            if not recent_files:
                logger.warning("No recent data files found")
                return False
            
            logger.info(f"Found {len(recent_files)} recent data files")
            
            # Run training script
            train_script = self.ml_service_path / "src" / "train.py"
            
            if train_script.exists():
                logger.info("Running training script...")
                result = subprocess.run(
                    [sys.executable, str(train_script), "--incremental"],
                    capture_output=True,
                    text=True,
                    cwd=str(self.ml_service_path)
                )
                
                if result.returncode == 0:
                    logger.info("Model training successful")
                    logger.info(result.stdout)
                    self.last_training = datetime.now()
                    return True
                else:
                    logger.error(f"Model training failed: {result.stderr}")
                    return False
            else:
                logger.error(f"Training script not found: {train_script}")
                return False
                
        except Exception as e:
            logger.error(f"Error in model update: {e}")
            return False
    
    def full_retrain(self):
        """Perform full model retraining with all historical data"""
        logger.info("Starting full model retrain...")
        
        try:
            train_script = self.ml_service_path / "src" / "train.py"
            
            if train_script.exists():
                logger.info("Running full training...")
                result = subprocess.run(
                    [sys.executable, str(train_script)],
                    capture_output=True,
                    text=True,
                    cwd=str(self.ml_service_path)
                )
                
                if result.returncode == 0:
                    logger.info("Full retraining successful")
                    logger.info(result.stdout)
                    self.last_training = datetime.now()
                    return True
                else:
                    logger.error(f"Full retraining failed: {result.stderr}")
                    return False
            else:
                logger.error(f"Training script not found: {train_script}")
                return False
                
        except Exception as e:
            logger.error(f"Error in full retrain: {e}")
            return False
    
    def health_check(self):
        """Check system health"""
        logger.info("Running health check...")
        
        checks = {
            'models_exist': False,
            'data_exists': False,
            'recent_refresh': False,
            'recent_training': False
        }
        
        # Check if models exist
        models_path = self.ml_service_path / "models" / "player_props"
        if models_path.exists() and list(models_path.glob("*.pkl")):
            checks['models_exist'] = True
        
        # Check if data exists
        data_path = self.ml_service_path / "data" / "historical"
        if data_path.exists() and list(data_path.glob("*.csv")):
            checks['data_exists'] = True
        
        # Check recent refresh
        if self.last_refresh:
            time_since_refresh = datetime.now() - self.last_refresh
            if time_since_refresh < timedelta(hours=24):
                checks['recent_refresh'] = True
        
        # Check recent training
        if self.last_training:
            time_since_training = datetime.now() - self.last_training
            if time_since_training < timedelta(days=7):
                checks['recent_training'] = True
        
        logger.info(f"Health check results: {checks}")
        return checks
    
    def run_schedule(self):
        """Run scheduled tasks"""
        logger.info("Starting data refresh pipeline scheduler...")
        
        # Schedule tasks
        # Daily at 6 AM: Collect previous day's data
        schedule.every().day.at("06:00").do(self.collect_daily_data)
        
        # Daily at 7 AM: Incremental model update
        schedule.every().day.at("07:00").do(self.incremental_model_update)
        
        # Weekly on Sunday at 3 AM: Full retrain
        schedule.every().sunday.at("03:00").do(self.full_retrain)
        
        # Health check every 6 hours
        schedule.every(6).hours.do(self.health_check)
        
        self.is_running = True
        
        logger.info("Schedule configured:")
        for job in schedule.get_jobs():
            logger.info(f"  - {job}")
        
        # Run scheduler loop
        while self.is_running:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def start_background(self):
        """Start scheduler in background thread"""
        if not self.is_running:
            thread = threading.Thread(target=self.run_schedule, daemon=True)
            thread.start()
            logger.info("Data refresh pipeline started in background")
        else:
            logger.warning("Pipeline already running")
    
    def stop(self):
        """Stop scheduler"""
        self.is_running = False
        logger.info("Data refresh pipeline stopped")


# CLI interface for manual operations
def main():
    """Command-line interface for pipeline operations"""
    import argparse
    
    parser = argparse.ArgumentParser(description="NBA Data Refresh Pipeline")
    parser.add_argument('--collect', action='store_true', help='Collect daily data')
    parser.add_argument('--update', action='store_true', help='Incremental model update')
    parser.add_argument('--retrain', action='store_true', help='Full model retrain')
    parser.add_argument('--health', action='store_true', help='Health check')
    parser.add_argument('--schedule', action='store_true', help='Run scheduler')
    
    args = parser.parse_args()
    
    pipeline = DataRefreshPipeline()
    
    if args.collect:
        success = pipeline.collect_daily_data()
        sys.exit(0 if success else 1)
    
    elif args.update:
        success = pipeline.incremental_model_update()
        sys.exit(0 if success else 1)
    
    elif args.retrain:
        success = pipeline.full_retrain()
        sys.exit(0 if success else 1)
    
    elif args.health:
        checks = pipeline.health_check()
        all_ok = all(checks.values())
        sys.exit(0 if all_ok else 1)
    
    elif args.schedule:
        pipeline.run_schedule()
    
    else:
        parser.print_help()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    main()
