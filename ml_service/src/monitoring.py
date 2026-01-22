"""
Model performance monitoring and metrics tracking
"""
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class PredictionTracker:
    """Track predictions and actual outcomes for model evaluation"""
    
    def __init__(self, storage_path: str = "ml_service/data/predictions"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.predictions = []
        
    def log_prediction(self, prediction_data: Dict):
        """Log a prediction for later evaluation"""
        prediction_data['timestamp'] = datetime.now().isoformat()
        prediction_data['prediction_id'] = f"{int(time.time() * 1000)}"
        
        # Store in memory
        self.predictions.append(prediction_data)
        
        # Persist to disk
        date_str = datetime.now().strftime('%Y-%m-%d')
        file_path = self.storage_path / f"predictions_{date_str}.jsonl"
        
        try:
            with open(file_path, 'a') as f:
                f.write(json.dumps(prediction_data) + '\n')
            logger.debug(f"Logged prediction {prediction_data['prediction_id']}")
        except Exception as e:
            logger.error(f"Failed to log prediction: {e}")
    
    def log_outcome(self, prediction_id: str, actual_value: float, bet_result: str):
        """Log actual outcome for a prediction"""
        outcome_data = {
            'prediction_id': prediction_id,
            'actual_value': actual_value,
            'bet_result': bet_result,  # 'win', 'loss', 'push'
            'timestamp': datetime.now().isoformat()
        }
        
        date_str = datetime.now().strftime('%Y-%m-%d')
        file_path = self.storage_path / f"outcomes_{date_str}.jsonl"
        
        try:
            with open(file_path, 'a') as f:
                f.write(json.dumps(outcome_data) + '\n')
            logger.debug(f"Logged outcome for prediction {prediction_id}")
        except Exception as e:
            logger.error(f"Failed to log outcome: {e}")
    
    def get_model_metrics(self, model_name: str, days: int = 7) -> Dict:
        """Calculate model performance metrics over specified days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        predictions_data = []
        outcomes_data = []
        
        # Load predictions and outcomes from files
        for i in range(days):
            date = cutoff_date + timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            
            pred_file = self.storage_path / f"predictions_{date_str}.jsonl"
            outcome_file = self.storage_path / f"outcomes_{date_str}.jsonl"
            
            if pred_file.exists():
                with open(pred_file, 'r') as f:
                    predictions_data.extend([json.loads(line) for line in f])
            
            if outcome_file.exists():
                with open(outcome_file, 'r') as f:
                    outcomes_data.extend([json.loads(line) for line in f])
        
        # Filter by model name
        model_predictions = [p for p in predictions_data if p.get('model_name') == model_name]
        
        # Match predictions with outcomes
        outcomes_dict = {o['prediction_id']: o for o in outcomes_data}
        matched_predictions = [
            (p, outcomes_dict[p['prediction_id']]) 
            for p in model_predictions 
            if p['prediction_id'] in outcomes_dict
        ]
        
        if not matched_predictions:
            return {
                'model_name': model_name,
                'total_predictions': len(model_predictions),
                'evaluated_predictions': 0,
                'accuracy': 0.0,
                'mae': 0.0,
                'rmse': 0.0,
                'roi': 0.0
            }
        
        # Calculate metrics
        correct = 0
        total_error = 0
        squared_error = 0
        wins = 0
        losses = 0
        
        for pred, outcome in matched_predictions:
            # Accuracy (correct prediction direction)
            predicted = pred['prediction']
            actual = outcome['actual_value']
            line = pred.get('line', predicted)
            
            if (predicted > line and actual > line) or (predicted < line and actual < line):
                correct += 1
            
            # Error metrics
            error = abs(predicted - actual)
            total_error += error
            squared_error += error ** 2
            
            # Win/loss for ROI
            if outcome['bet_result'] == 'win':
                wins += 1
            elif outcome['bet_result'] == 'loss':
                losses += 1
        
        n = len(matched_predictions)
        accuracy = correct / n if n > 0 else 0
        mae = total_error / n if n > 0 else 0
        rmse = (squared_error / n) ** 0.5 if n > 0 else 0
        roi = ((wins - losses) / n * 100) if n > 0 else 0
        
        return {
            'model_name': model_name,
            'total_predictions': len(model_predictions),
            'evaluated_predictions': n,
            'accuracy': round(accuracy, 4),
            'mae': round(mae, 2),
            'rmse': round(rmse, 2),
            'roi': round(roi, 2),
            'wins': wins,
            'losses': losses,
            'win_rate': round(wins / n * 100, 2) if n > 0 else 0
        }


class PerformanceMonitor:
    """Monitor API performance and system health"""
    
    def __init__(self):
        self.request_times = []
        self.error_count = 0
        self.request_count = 0
        self.endpoint_stats = {}
        
    def log_request(self, endpoint: str, duration: float, success: bool):
        """Log request performance"""
        self.request_count += 1
        if not success:
            self.error_count += 1
        
        self.request_times.append({
            'endpoint': endpoint,
            'duration': duration,
            'timestamp': time.time(),
            'success': success
        })
        
        # Keep only last 1000 requests in memory
        if len(self.request_times) > 1000:
            self.request_times = self.request_times[-1000:]
        
        # Update endpoint stats
        if endpoint not in self.endpoint_stats:
            self.endpoint_stats[endpoint] = {
                'count': 0,
                'total_time': 0,
                'errors': 0
            }
        
        self.endpoint_stats[endpoint]['count'] += 1
        self.endpoint_stats[endpoint]['total_time'] += duration
        if not success:
            self.endpoint_stats[endpoint]['errors'] += 1
    
    def get_stats(self) -> Dict:
        """Get performance statistics"""
        recent_requests = [r for r in self.request_times if time.time() - r['timestamp'] < 3600]
        
        if not recent_requests:
            return {
                'requests_per_hour': 0,
                'avg_response_time': 0,
                'error_rate': 0,
                'endpoints': {}
            }
        
        avg_time = sum(r['duration'] for r in recent_requests) / len(recent_requests)
        errors = sum(1 for r in recent_requests if not r['success'])
        error_rate = errors / len(recent_requests) if recent_requests else 0
        
        endpoint_summary = {}
        for endpoint, stats in self.endpoint_stats.items():
            if stats['count'] > 0:
                endpoint_summary[endpoint] = {
                    'count': stats['count'],
                    'avg_time': round(stats['total_time'] / stats['count'], 3),
                    'error_rate': round(stats['errors'] / stats['count'] * 100, 2)
                }
        
        return {
            'requests_per_hour': len(recent_requests),
            'avg_response_time': round(avg_time, 3),
            'error_rate': round(error_rate * 100, 2),
            'total_requests': self.request_count,
            'total_errors': self.error_count,
            'endpoints': endpoint_summary
        }


# Global instances
prediction_tracker = PredictionTracker()
performance_monitor = PerformanceMonitor()
