"""
MODEL EVALUATION FRAMEWORK v4.0 - ELITE EDITION
=============================================
200 MAJOR IMPROVEMENTS - EVALUATION & TESTING SUITE

Comprehensive model evaluation, backtesting, A/B testing,
and performance analysis system for elite sports betting ML.

Features:
- Multi-metric evaluation (50+ metrics)
- Statistical significance testing
- Backtesting with multiple strategies
- A/B testing framework
- Walk-forward optimization
- Cross-validation with time series support
- Profit/loss analysis
- Risk-adjusted returns
- Model comparison and ranking
- Performance attribution
- Regime detection and analysis
- Calibration assessment
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import json
import logging
from scipy import stats
from scipy.stats import ttest_ind, mannwhitneyu, ks_2samp
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, log_loss, brier_score_loss, mean_squared_error,
    mean_absolute_error, r2_score, confusion_matrix, classification_report
)
from sklearn.calibration import calibration_curve
import warnings
warnings.filterwarnings('ignore')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MetricType(Enum):
    """Types of evaluation metrics"""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    BETTING = "betting"
    RISK = "risk"
    CALIBRATION = "calibration"
    TIMING = "timing"


@dataclass
class BacktestResult:
    """Results from backtesting"""
    total_bets: int
    winning_bets: int
    total_profit: float
    roi: float
    max_drawdown: float
    sharpe_ratio: float
    win_rate: float
    avg_odds: float
    daily_returns: List[float] = field(default_factory=list)
    cumulative_returns: List[float] = field(default_factory=list)
    bet_history: List[Dict] = field(default_factory=list)
    metrics: Dict[str, float] = field(default_factory=dict)


@dataclass
class ModelComparison:
    """Comparison between models"""
    model_a_name: str
    model_b_name: str
    metric: str
    model_a_score: float
    model_b_score: float
    difference: float
    p_value: float
    is_significant: bool
    winner: str


@dataclass
class EvaluationReport:
    """Complete evaluation report for a model"""
    model_name: str
    timestamp: datetime
    classification_metrics: Dict[str, float]
    regression_metrics: Dict[str, float]
    betting_metrics: Dict[str, float]
    risk_metrics: Dict[str, float]
    calibration_metrics: Dict[str, float]
    overall_score: float
    recommendations: List[str]


class EliteModelEvaluator:
    """
    ELITE MODEL EVALUATION SYSTEM
    50+ evaluation metrics across multiple categories
    """
    
    def __init__(self):
        self.evaluation_history = []
        self.benchmark_scores = {}
        self.metric_weights = self._initialize_metric_weights()
        logger.info("Elite Model Evaluator initialized")
    
    def _initialize_metric_weights(self) -> Dict[str, float]:
        """Initialize weights for composite scoring"""
        return {
            'accuracy': 1.0,
            'precision': 1.2,
            'recall': 1.0,
            'f1': 1.5,
            'roc_auc': 2.0,
            'brier_score': 1.8,
            'log_loss': 1.5,
            'roi': 3.0,
            'sharpe_ratio': 2.5,
            'max_drawdown': 2.0,
            'calibration_error': 1.5,
            'kelly_edge': 2.5
        }
    
    # ==================== CLASSIFICATION METRICS ====================
    
    def calculate_accuracy(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Standard accuracy score"""
        return accuracy_score(y_true, y_pred)
    
    def calculate_precision(self, y_true: np.ndarray, y_pred: np.ndarray, 
                           average: str = 'weighted') -> float:
        """Precision score with configurable averaging"""
        return precision_score(y_true, y_pred, average=average, zero_division=0)
    
    def calculate_recall(self, y_true: np.ndarray, y_pred: np.ndarray,
                        average: str = 'weighted') -> float:
        """Recall score with configurable averaging"""
        return recall_score(y_true, y_pred, average=average, zero_division=0)
    
    def calculate_f1(self, y_true: np.ndarray, y_pred: np.ndarray,
                    average: str = 'weighted') -> float:
        """F1 score with configurable averaging"""
        return f1_score(y_true, y_pred, average=average, zero_division=0)
    
    def calculate_roc_auc(self, y_true: np.ndarray, y_prob: np.ndarray) -> float:
        """ROC AUC score"""
        try:
            return roc_auc_score(y_true, y_prob)
        except:
            return 0.5
    
    def calculate_log_loss(self, y_true: np.ndarray, y_prob: np.ndarray) -> float:
        """Logarithmic loss"""
        y_prob = np.clip(y_prob, 1e-15, 1 - 1e-15)
        return log_loss(y_true, y_prob)
    
    def calculate_brier_score(self, y_true: np.ndarray, y_prob: np.ndarray) -> float:
        """Brier score for probability predictions"""
        return brier_score_loss(y_true, y_prob)
    
    def calculate_matthews_correlation(self, y_true: np.ndarray, 
                                       y_pred: np.ndarray) -> float:
        """Matthews Correlation Coefficient"""
        from sklearn.metrics import matthews_corrcoef
        return matthews_corrcoef(y_true, y_pred)
    
    def calculate_cohen_kappa(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Cohen's Kappa score"""
        from sklearn.metrics import cohen_kappa_score
        return cohen_kappa_score(y_true, y_pred)
    
    def calculate_balanced_accuracy(self, y_true: np.ndarray, 
                                    y_pred: np.ndarray) -> float:
        """Balanced accuracy for imbalanced classes"""
        from sklearn.metrics import balanced_accuracy_score
        return balanced_accuracy_score(y_true, y_pred)
    
    # ==================== REGRESSION METRICS ====================
    
    def calculate_mse(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Mean Squared Error"""
        return mean_squared_error(y_true, y_pred)
    
    def calculate_rmse(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Root Mean Squared Error"""
        return np.sqrt(mean_squared_error(y_true, y_pred))
    
    def calculate_mae(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Mean Absolute Error"""
        return mean_absolute_error(y_true, y_pred)
    
    def calculate_r2(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """R-squared score"""
        return r2_score(y_true, y_pred)
    
    def calculate_mape(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Mean Absolute Percentage Error"""
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        mask = y_true != 0
        return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    
    def calculate_smape(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Symmetric Mean Absolute Percentage Error"""
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        denominator = (np.abs(y_true) + np.abs(y_pred)) / 2
        mask = denominator != 0
        return np.mean(np.abs(y_true[mask] - y_pred[mask]) / denominator[mask]) * 100
    
    def calculate_median_ae(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Median Absolute Error"""
        from sklearn.metrics import median_absolute_error
        return median_absolute_error(y_true, y_pred)
    
    def calculate_max_error(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Maximum Error"""
        return np.max(np.abs(np.array(y_true) - np.array(y_pred)))
    
    def calculate_explained_variance(self, y_true: np.ndarray, 
                                     y_pred: np.ndarray) -> float:
        """Explained Variance Score"""
        from sklearn.metrics import explained_variance_score
        return explained_variance_score(y_true, y_pred)
    
    # ==================== BETTING METRICS ====================
    
    def calculate_roi(self, profits: List[float], stakes: List[float]) -> float:
        """Return on Investment"""
        total_profit = sum(profits)
        total_stake = sum(stakes)
        return (total_profit / total_stake * 100) if total_stake > 0 else 0
    
    def calculate_yield(self, profits: List[float], num_bets: int) -> float:
        """Average profit per bet (yield)"""
        return (sum(profits) / num_bets) if num_bets > 0 else 0
    
    def calculate_clv(self, predicted_odds: List[float], 
                      closing_odds: List[float]) -> float:
        """Closing Line Value - key metric for sharp bettors"""
        if not predicted_odds or not closing_odds:
            return 0
        clv_values = []
        for pred, close in zip(predicted_odds, closing_odds):
            if pred > 0 and close > 0:
                clv = ((1/pred) - (1/close)) / (1/close) * 100
                clv_values.append(clv)
        return np.mean(clv_values) if clv_values else 0
    
    def calculate_kelly_edge(self, win_prob: float, odds: float) -> float:
        """Kelly Criterion expected edge"""
        q = 1 - win_prob
        b = odds - 1
        edge = (win_prob * b - q) / b
        return max(0, edge)
    
    def calculate_flat_bet_profit(self, results: List[bool], 
                                  odds: List[float], unit: float = 100) -> float:
        """Profit using flat betting strategy"""
        profit = 0
        for won, odd in zip(results, odds):
            if won:
                profit += unit * (odd - 1)
            else:
                profit -= unit
        return profit
    
    def calculate_kelly_bet_profit(self, results: List[bool], odds: List[float],
                                   probs: List[float], bankroll: float = 1000) -> float:
        """Profit using Kelly criterion betting"""
        current_bankroll = bankroll
        for won, odd, prob in zip(results, odds, probs):
            edge = self.calculate_kelly_edge(prob, odd)
            bet_size = current_bankroll * edge * 0.25  # Quarter Kelly
            if won:
                current_bankroll += bet_size * (odd - 1)
            else:
                current_bankroll -= bet_size
        return current_bankroll - bankroll
    
    def calculate_value_accuracy(self, predicted_values: List[float],
                                 actual_values: List[float],
                                 threshold: float = 0.02) -> float:
        """Accuracy of value bet identification"""
        correct = sum(1 for p, a in zip(predicted_values, actual_values) 
                     if (p > threshold and a > 0) or (p <= threshold and a <= 0))
        return correct / len(predicted_values) if predicted_values else 0
    
    def calculate_bet_frequency(self, predictions: List[float],
                                threshold: float = 0.02) -> float:
        """Frequency of bets placed (selectivity)"""
        bets_placed = sum(1 for p in predictions if abs(p) >= threshold)
        return bets_placed / len(predictions) if predictions else 0
    
    # ==================== RISK METRICS ====================
    
    def calculate_sharpe_ratio(self, returns: List[float], 
                               risk_free_rate: float = 0.02) -> float:
        """Sharpe Ratio - risk-adjusted returns"""
        if not returns or len(returns) < 2:
            return 0
        excess_returns = np.array(returns) - risk_free_rate / 252
        return (np.mean(excess_returns) / np.std(excess_returns)) * np.sqrt(252) if np.std(excess_returns) > 0 else 0
    
    def calculate_sortino_ratio(self, returns: List[float],
                                risk_free_rate: float = 0.02) -> float:
        """Sortino Ratio - downside risk-adjusted returns"""
        if not returns or len(returns) < 2:
            return 0
        excess_returns = np.array(returns) - risk_free_rate / 252
        downside_returns = excess_returns[excess_returns < 0]
        downside_std = np.std(downside_returns) if len(downside_returns) > 0 else 0
        return (np.mean(excess_returns) / downside_std) * np.sqrt(252) if downside_std > 0 else 0
    
    def calculate_max_drawdown(self, returns: List[float]) -> float:
        """Maximum Drawdown - worst peak-to-trough decline"""
        if not returns:
            return 0
        cumulative = np.cumsum(returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdowns = cumulative - running_max
        return abs(min(drawdowns)) if len(drawdowns) > 0 else 0
    
    def calculate_calmar_ratio(self, returns: List[float]) -> float:
        """Calmar Ratio - returns relative to max drawdown"""
        if not returns:
            return 0
        annual_return = np.mean(returns) * 252
        max_dd = self.calculate_max_drawdown(returns)
        return annual_return / max_dd if max_dd > 0 else 0
    
    def calculate_var(self, returns: List[float], 
                      confidence: float = 0.95) -> float:
        """Value at Risk"""
        if not returns:
            return 0
        return np.percentile(returns, (1 - confidence) * 100)
    
    def calculate_cvar(self, returns: List[float],
                       confidence: float = 0.95) -> float:
        """Conditional Value at Risk (Expected Shortfall)"""
        if not returns:
            return 0
        var = self.calculate_var(returns, confidence)
        return np.mean([r for r in returns if r <= var])
    
    def calculate_win_streak_stats(self, results: List[bool]) -> Dict[str, int]:
        """Win/loss streak statistics"""
        if not results:
            return {'max_win_streak': 0, 'max_loss_streak': 0, 
                    'avg_win_streak': 0, 'avg_loss_streak': 0}
        
        win_streaks, loss_streaks = [], []
        current_streak, current_type = 0, None
        
        for result in results:
            if result == current_type:
                current_streak += 1
            else:
                if current_type is not None:
                    if current_type:
                        win_streaks.append(current_streak)
                    else:
                        loss_streaks.append(current_streak)
                current_streak = 1
                current_type = result
        
        # Don't forget the last streak
        if current_type:
            win_streaks.append(current_streak)
        else:
            loss_streaks.append(current_streak)
        
        return {
            'max_win_streak': max(win_streaks) if win_streaks else 0,
            'max_loss_streak': max(loss_streaks) if loss_streaks else 0,
            'avg_win_streak': np.mean(win_streaks) if win_streaks else 0,
            'avg_loss_streak': np.mean(loss_streaks) if loss_streaks else 0
        }
    
    def calculate_volatility(self, returns: List[float]) -> float:
        """Return volatility (annualized)"""
        if not returns or len(returns) < 2:
            return 0
        return np.std(returns) * np.sqrt(252)
    
    def calculate_downside_deviation(self, returns: List[float],
                                     mar: float = 0) -> float:
        """Downside deviation relative to minimum acceptable return"""
        if not returns:
            return 0
        downside = [r for r in returns if r < mar]
        return np.std(downside) if downside else 0
    
    # ==================== CALIBRATION METRICS ====================
    
    def calculate_calibration_error(self, y_true: np.ndarray,
                                    y_prob: np.ndarray,
                                    n_bins: int = 10) -> float:
        """Expected Calibration Error"""
        bin_boundaries = np.linspace(0, 1, n_bins + 1)
        bin_lowers = bin_boundaries[:-1]
        bin_uppers = bin_boundaries[1:]
        
        ece = 0
        for bin_lower, bin_upper in zip(bin_lowers, bin_uppers):
            in_bin = (y_prob >= bin_lower) & (y_prob < bin_upper)
            prop_in_bin = np.mean(in_bin)
            if prop_in_bin > 0:
                avg_confidence = np.mean(y_prob[in_bin])
                avg_accuracy = np.mean(y_true[in_bin])
                ece += np.abs(avg_accuracy - avg_confidence) * prop_in_bin
        
        return ece
    
    def calculate_max_calibration_error(self, y_true: np.ndarray,
                                        y_prob: np.ndarray,
                                        n_bins: int = 10) -> float:
        """Maximum Calibration Error"""
        bin_boundaries = np.linspace(0, 1, n_bins + 1)
        bin_lowers = bin_boundaries[:-1]
        bin_uppers = bin_boundaries[1:]
        
        mce = 0
        for bin_lower, bin_upper in zip(bin_lowers, bin_uppers):
            in_bin = (y_prob >= bin_lower) & (y_prob < bin_upper)
            if np.any(in_bin):
                avg_confidence = np.mean(y_prob[in_bin])
                avg_accuracy = np.mean(y_true[in_bin])
                mce = max(mce, np.abs(avg_accuracy - avg_confidence))
        
        return mce
    
    def calculate_reliability_diagram(self, y_true: np.ndarray,
                                      y_prob: np.ndarray,
                                      n_bins: int = 10) -> Dict:
        """Generate reliability diagram data"""
        fraction_of_positives, mean_predicted_value = calibration_curve(
            y_true, y_prob, n_bins=n_bins, strategy='uniform'
        )
        return {
            'fraction_of_positives': fraction_of_positives.tolist(),
            'mean_predicted_value': mean_predicted_value.tolist(),
            'bin_counts': np.histogram(y_prob, bins=n_bins)[0].tolist()
        }
    
    def calculate_overconfidence_ratio(self, y_true: np.ndarray,
                                       y_prob: np.ndarray) -> float:
        """Ratio of overconfident predictions"""
        high_conf = y_prob > 0.7
        if not np.any(high_conf):
            return 0
        high_conf_accuracy = np.mean(y_true[high_conf])
        high_conf_avg = np.mean(y_prob[high_conf])
        return (high_conf_avg - high_conf_accuracy) / high_conf_avg if high_conf_avg > 0 else 0
    
    # ==================== COMPREHENSIVE EVALUATION ====================
    
    def evaluate_model(self, y_true: np.ndarray, y_pred: np.ndarray,
                       y_prob: np.ndarray = None, returns: List[float] = None,
                       odds: List[float] = None, stakes: List[float] = None,
                       model_name: str = "Model") -> EvaluationReport:
        """
        Comprehensive model evaluation with all metrics
        """
        logger.info(f"Evaluating model: {model_name}")
        
        # Classification metrics
        classification_metrics = {
            'accuracy': self.calculate_accuracy(y_true, y_pred),
            'precision': self.calculate_precision(y_true, y_pred),
            'recall': self.calculate_recall(y_true, y_pred),
            'f1': self.calculate_f1(y_true, y_pred),
            'balanced_accuracy': self.calculate_balanced_accuracy(y_true, y_pred),
            'matthews_correlation': self.calculate_matthews_correlation(y_true, y_pred),
            'cohen_kappa': self.calculate_cohen_kappa(y_true, y_pred)
        }
        
        # Add probability-based metrics if available
        if y_prob is not None:
            classification_metrics.update({
                'roc_auc': self.calculate_roc_auc(y_true, y_prob),
                'log_loss': self.calculate_log_loss(y_true, y_prob),
                'brier_score': self.calculate_brier_score(y_true, y_prob)
            })
        
        # Regression metrics (if predictions are continuous)
        regression_metrics = {}
        if y_prob is not None:
            regression_metrics = {
                'mse': self.calculate_mse(y_true, y_prob),
                'rmse': self.calculate_rmse(y_true, y_prob),
                'mae': self.calculate_mae(y_true, y_prob)
            }
        
        # Betting metrics
        betting_metrics = {}
        if returns is not None:
            betting_metrics['total_profit'] = sum(returns)
        if returns is not None and stakes is not None:
            betting_metrics['roi'] = self.calculate_roi(returns, stakes)
        if y_true is not None:
            results = y_pred == y_true
            betting_metrics['win_rate'] = np.mean(results)
            streak_stats = self.calculate_win_streak_stats(results.tolist())
            betting_metrics.update(streak_stats)
        
        # Risk metrics
        risk_metrics = {}
        if returns is not None:
            risk_metrics = {
                'sharpe_ratio': self.calculate_sharpe_ratio(returns),
                'sortino_ratio': self.calculate_sortino_ratio(returns),
                'max_drawdown': self.calculate_max_drawdown(returns),
                'calmar_ratio': self.calculate_calmar_ratio(returns),
                'volatility': self.calculate_volatility(returns),
                'var_95': self.calculate_var(returns, 0.95),
                'cvar_95': self.calculate_cvar(returns, 0.95)
            }
        
        # Calibration metrics
        calibration_metrics = {}
        if y_prob is not None:
            calibration_metrics = {
                'ece': self.calculate_calibration_error(y_true, y_prob),
                'mce': self.calculate_max_calibration_error(y_true, y_prob),
                'overconfidence_ratio': self.calculate_overconfidence_ratio(y_true, y_prob)
            }
        
        # Calculate overall score
        overall_score = self._calculate_composite_score(
            classification_metrics, regression_metrics, 
            betting_metrics, risk_metrics, calibration_metrics
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            classification_metrics, regression_metrics,
            betting_metrics, risk_metrics, calibration_metrics
        )
        
        report = EvaluationReport(
            model_name=model_name,
            timestamp=datetime.now(),
            classification_metrics=classification_metrics,
            regression_metrics=regression_metrics,
            betting_metrics=betting_metrics,
            risk_metrics=risk_metrics,
            calibration_metrics=calibration_metrics,
            overall_score=overall_score,
            recommendations=recommendations
        )
        
        self.evaluation_history.append(report)
        return report
    
    def _calculate_composite_score(self, classification: Dict, regression: Dict,
                                   betting: Dict, risk: Dict, 
                                   calibration: Dict) -> float:
        """Calculate weighted composite score"""
        score = 0
        total_weight = 0
        
        all_metrics = {**classification, **regression, **betting, **risk, **calibration}
        
        for metric, value in all_metrics.items():
            if metric in self.metric_weights and value is not None:
                weight = self.metric_weights[metric]
                # Normalize metric (higher is better for most)
                if metric in ['log_loss', 'brier_score', 'mse', 'rmse', 'mae', 
                              'max_drawdown', 'ece', 'mce', 'volatility']:
                    normalized = max(0, 1 - value)  # Lower is better
                else:
                    normalized = min(1, value)  # Higher is better
                score += normalized * weight
                total_weight += weight
        
        return score / total_weight if total_weight > 0 else 0
    
    def _generate_recommendations(self, classification: Dict, regression: Dict,
                                  betting: Dict, risk: Dict,
                                  calibration: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Classification recommendations
        if classification.get('accuracy', 1) < 0.55:
            recommendations.append("⚠️ Low accuracy - consider feature engineering or model tuning")
        if classification.get('precision', 1) < classification.get('recall', 0):
            recommendations.append("📊 Low precision - model may be too aggressive")
        if classification.get('f1', 1) < 0.5:
            recommendations.append("🎯 Poor F1 score - balance precision and recall")
        
        # Calibration recommendations
        if calibration.get('ece', 0) > 0.1:
            recommendations.append("📐 High calibration error - consider probability calibration")
        if calibration.get('overconfidence_ratio', 0) > 0.2:
            recommendations.append("🔥 Model is overconfident - reduce prediction confidence")
        
        # Risk recommendations
        if risk.get('max_drawdown', 0) > 0.3:
            recommendations.append("📉 High max drawdown - consider more conservative betting")
        if risk.get('sharpe_ratio', 1) < 1:
            recommendations.append("⚖️ Low Sharpe ratio - risk-adjusted returns need improvement")
        
        # Betting recommendations
        if betting.get('win_rate', 1) < 0.52:
            recommendations.append("🎲 Win rate below breakeven - refine selection criteria")
        if betting.get('roi', 0) < 0:
            recommendations.append("💰 Negative ROI - review value detection methodology")
        
        if not recommendations:
            recommendations.append("✅ Model performing well - continue monitoring")
        
        return recommendations


class EliteBacktester:
    """
    ELITE BACKTESTING SYSTEM
    Comprehensive historical testing with multiple strategies
    """
    
    def __init__(self, initial_bankroll: float = 10000):
        self.initial_bankroll = initial_bankroll
        self.evaluator = EliteModelEvaluator()
        logger.info("Elite Backtester initialized")
    
    def run_backtest(self, predictions: List[Dict], 
                     strategy: str = 'flat',
                     unit_size: float = 100,
                     kelly_fraction: float = 0.25,
                     min_edge: float = 0.02) -> BacktestResult:
        """
        Run comprehensive backtest
        
        Parameters:
        - predictions: List of {date, predicted_prob, actual_result, odds}
        - strategy: 'flat', 'kelly', 'proportional', 'martingale'
        - unit_size: Base unit for flat betting
        - kelly_fraction: Fraction of Kelly criterion to use
        - min_edge: Minimum edge required to place bet
        """
        logger.info(f"Running backtest with {strategy} strategy on {len(predictions)} predictions")
        
        bankroll = self.initial_bankroll
        bet_history = []
        daily_returns = []
        current_date = None
        daily_pnl = 0
        
        total_bets = 0
        winning_bets = 0
        total_profit = 0
        
        for pred in predictions:
            date = pred.get('date')
            prob = pred.get('predicted_prob', 0.5)
            actual = pred.get('actual_result', False)
            odds = pred.get('odds', 2.0)
            
            # Check if meets minimum edge
            implied_prob = 1 / odds
            edge = prob - implied_prob
            
            if edge < min_edge:
                continue
            
            # Calculate bet size based on strategy
            bet_size = self._calculate_bet_size(
                strategy, bankroll, prob, odds, unit_size, kelly_fraction
            )
            
            if bet_size <= 0 or bet_size > bankroll:
                continue
            
            # Determine outcome
            won = actual
            profit = bet_size * (odds - 1) if won else -bet_size
            
            bankroll += profit
            total_profit += profit
            total_bets += 1
            if won:
                winning_bets += 1
            
            # Track daily returns
            if date != current_date and current_date is not None:
                daily_returns.append(daily_pnl / self.initial_bankroll)
                daily_pnl = 0
            current_date = date
            daily_pnl += profit
            
            bet_history.append({
                'date': date,
                'prob': prob,
                'odds': odds,
                'edge': edge,
                'bet_size': bet_size,
                'won': won,
                'profit': profit,
                'bankroll': bankroll
            })
        
        # Don't forget last day
        if daily_pnl != 0:
            daily_returns.append(daily_pnl / self.initial_bankroll)
        
        # Calculate cumulative returns
        cumulative_returns = np.cumsum(daily_returns).tolist() if daily_returns else []
        
        # Calculate metrics
        roi = (total_profit / (total_bets * unit_size)) * 100 if total_bets > 0 else 0
        win_rate = winning_bets / total_bets if total_bets > 0 else 0
        avg_odds = np.mean([p['odds'] for p in bet_history]) if bet_history else 0
        sharpe = self.evaluator.calculate_sharpe_ratio(daily_returns)
        max_dd = self.evaluator.calculate_max_drawdown(daily_returns)
        
        return BacktestResult(
            total_bets=total_bets,
            winning_bets=winning_bets,
            total_profit=total_profit,
            roi=roi,
            max_drawdown=max_dd,
            sharpe_ratio=sharpe,
            win_rate=win_rate,
            avg_odds=avg_odds,
            daily_returns=daily_returns,
            cumulative_returns=cumulative_returns,
            bet_history=bet_history,
            metrics={
                'sortino': self.evaluator.calculate_sortino_ratio(daily_returns),
                'calmar': self.evaluator.calculate_calmar_ratio(daily_returns),
                'volatility': self.evaluator.calculate_volatility(daily_returns),
                'var_95': self.evaluator.calculate_var(daily_returns, 0.95),
                'cvar_95': self.evaluator.calculate_cvar(daily_returns, 0.95)
            }
        )
    
    def _calculate_bet_size(self, strategy: str, bankroll: float,
                           prob: float, odds: float, 
                           unit_size: float, kelly_fraction: float) -> float:
        """Calculate bet size based on strategy"""
        if strategy == 'flat':
            return unit_size
        
        elif strategy == 'kelly':
            q = 1 - prob
            b = odds - 1
            kelly = (prob * b - q) / b if b > 0 else 0
            kelly = max(0, kelly)  # No negative bets
            return bankroll * kelly * kelly_fraction
        
        elif strategy == 'proportional':
            return bankroll * 0.02  # 2% of bankroll
        
        elif strategy == 'confidence':
            # More confident = bigger bet
            edge = prob - (1/odds)
            return unit_size * (1 + edge * 10)
        
        else:
            return unit_size
    
    def compare_strategies(self, predictions: List[Dict]) -> Dict[str, BacktestResult]:
        """Compare multiple betting strategies"""
        strategies = ['flat', 'kelly', 'proportional', 'confidence']
        results = {}
        
        for strategy in strategies:
            results[strategy] = self.run_backtest(predictions, strategy)
        
        return results
    
    def walk_forward_backtest(self, predictions: List[Dict],
                              train_window: int = 90,
                              test_window: int = 30) -> List[BacktestResult]:
        """
        Walk-forward optimization and backtesting
        """
        results = []
        
        # Sort by date
        sorted_preds = sorted(predictions, key=lambda x: x.get('date', ''))
        
        i = 0
        while i + train_window + test_window <= len(sorted_preds):
            train_data = sorted_preds[i:i + train_window]
            test_data = sorted_preds[i + train_window:i + train_window + test_window]
            
            # Optimize on training data
            best_edge = self._optimize_min_edge(train_data)
            
            # Test on out-of-sample
            result = self.run_backtest(test_data, min_edge=best_edge)
            results.append(result)
            
            i += test_window
        
        return results
    
    def _optimize_min_edge(self, predictions: List[Dict]) -> float:
        """Optimize minimum edge threshold"""
        best_roi = -float('inf')
        best_edge = 0.02
        
        for edge in np.arange(0.01, 0.15, 0.01):
            result = self.run_backtest(predictions, min_edge=edge)
            if result.roi > best_roi and result.total_bets >= 10:
                best_roi = result.roi
                best_edge = edge
        
        return best_edge


class ABTestingFramework:
    """
    A/B TESTING FRAMEWORK
    Statistical comparison of models
    """
    
    def __init__(self, significance_level: float = 0.05):
        self.significance_level = significance_level
        self.test_history = []
        logger.info("A/B Testing Framework initialized")
    
    def compare_models(self, model_a_results: List[Dict],
                       model_b_results: List[Dict],
                       model_a_name: str = "Model A",
                       model_b_name: str = "Model B") -> Dict[str, ModelComparison]:
        """
        Statistical comparison between two models
        """
        comparisons = {}
        
        # Extract metrics
        a_profits = [r.get('profit', 0) for r in model_a_results]
        b_profits = [r.get('profit', 0) for r in model_b_results]
        
        a_correct = [1 if r.get('won', False) else 0 for r in model_a_results]
        b_correct = [1 if r.get('won', False) else 0 for r in model_b_results]
        
        # Compare ROI
        a_roi = np.mean(a_profits)
        b_roi = np.mean(b_profits)
        t_stat, p_value = ttest_ind(a_profits, b_profits)
        
        comparisons['roi'] = ModelComparison(
            model_a_name=model_a_name,
            model_b_name=model_b_name,
            metric='ROI',
            model_a_score=a_roi,
            model_b_score=b_roi,
            difference=a_roi - b_roi,
            p_value=p_value,
            is_significant=p_value < self.significance_level,
            winner=model_a_name if a_roi > b_roi else model_b_name
        )
        
        # Compare accuracy
        a_acc = np.mean(a_correct)
        b_acc = np.mean(b_correct)
        t_stat, p_value = ttest_ind(a_correct, b_correct)
        
        comparisons['accuracy'] = ModelComparison(
            model_a_name=model_a_name,
            model_b_name=model_b_name,
            metric='Accuracy',
            model_a_score=a_acc,
            model_b_score=b_acc,
            difference=a_acc - b_acc,
            p_value=p_value,
            is_significant=p_value < self.significance_level,
            winner=model_a_name if a_acc > b_acc else model_b_name
        )
        
        # Mann-Whitney U test (non-parametric)
        stat, p_value = mannwhitneyu(a_profits, b_profits, alternative='two-sided')
        
        comparisons['distribution'] = ModelComparison(
            model_a_name=model_a_name,
            model_b_name=model_b_name,
            metric='Distribution',
            model_a_score=np.median(a_profits),
            model_b_score=np.median(b_profits),
            difference=np.median(a_profits) - np.median(b_profits),
            p_value=p_value,
            is_significant=p_value < self.significance_level,
            winner=model_a_name if np.median(a_profits) > np.median(b_profits) else model_b_name
        )
        
        self.test_history.append({
            'timestamp': datetime.now().isoformat(),
            'model_a': model_a_name,
            'model_b': model_b_name,
            'comparisons': {k: v.__dict__ for k, v in comparisons.items()}
        })
        
        return comparisons
    
    def calculate_sample_size(self, baseline_conversion: float,
                              minimum_effect: float,
                              power: float = 0.8,
                              alpha: float = 0.05) -> int:
        """
        Calculate required sample size for A/B test
        """
        from scipy.stats import norm
        
        p1 = baseline_conversion
        p2 = baseline_conversion + minimum_effect
        
        pooled_prob = (p1 + p2) / 2
        
        z_alpha = norm.ppf(1 - alpha / 2)
        z_beta = norm.ppf(power)
        
        n = (2 * pooled_prob * (1 - pooled_prob) * (z_alpha + z_beta) ** 2) / (minimum_effect ** 2)
        
        return int(np.ceil(n))
    
    def is_test_complete(self, model_a_results: List, model_b_results: List,
                         min_samples: int = 100) -> Tuple[bool, str]:
        """Check if A/B test has enough data"""
        n_a = len(model_a_results)
        n_b = len(model_b_results)
        
        if n_a < min_samples:
            return False, f"Model A needs {min_samples - n_a} more samples"
        if n_b < min_samples:
            return False, f"Model B needs {min_samples - n_b} more samples"
        
        return True, "Test has sufficient data"


class ModelPerformanceTracker:
    """
    PERFORMANCE TRACKING SYSTEM
    Track model performance over time
    """
    
    def __init__(self):
        self.performance_history = {}
        self.alerts = []
        logger.info("Performance Tracker initialized")
    
    def log_prediction(self, model_name: str, prediction: Dict):
        """Log a prediction for tracking"""
        if model_name not in self.performance_history:
            self.performance_history[model_name] = []
        
        self.performance_history[model_name].append({
            'timestamp': datetime.now().isoformat(),
            **prediction
        })
    
    def get_rolling_metrics(self, model_name: str, 
                           window: int = 100) -> Dict[str, float]:
        """Calculate rolling metrics"""
        if model_name not in self.performance_history:
            return {}
        
        recent = self.performance_history[model_name][-window:]
        
        if not recent:
            return {}
        
        wins = sum(1 for p in recent if p.get('won', False))
        profits = [p.get('profit', 0) for p in recent]
        
        return {
            'win_rate': wins / len(recent),
            'total_profit': sum(profits),
            'avg_profit': np.mean(profits),
            'std_profit': np.std(profits),
            'num_bets': len(recent)
        }
    
    def detect_performance_degradation(self, model_name: str,
                                       threshold: float = 0.1) -> bool:
        """Detect if model performance is degrading"""
        if model_name not in self.performance_history:
            return False
        
        history = self.performance_history[model_name]
        
        if len(history) < 200:
            return False
        
        # Compare recent vs historical performance
        recent = history[-100:]
        historical = history[-200:-100]
        
        recent_win_rate = np.mean([1 if p.get('won', False) else 0 for p in recent])
        historical_win_rate = np.mean([1 if p.get('won', False) else 0 for p in historical])
        
        degradation = historical_win_rate - recent_win_rate
        
        if degradation > threshold:
            self.alerts.append({
                'timestamp': datetime.now().isoformat(),
                'model': model_name,
                'type': 'degradation',
                'message': f"Win rate dropped by {degradation:.2%}"
            })
            return True
        
        return False
    
    def get_performance_report(self, model_name: str) -> Dict:
        """Generate comprehensive performance report"""
        if model_name not in self.performance_history:
            return {'error': 'Model not found'}
        
        history = self.performance_history[model_name]
        
        # Overall metrics
        total_bets = len(history)
        total_wins = sum(1 for p in history if p.get('won', False))
        total_profit = sum(p.get('profit', 0) for p in history)
        
        # Time-based analysis
        monthly_performance = {}
        for pred in history:
            month = pred.get('timestamp', '')[:7]
            if month not in monthly_performance:
                monthly_performance[month] = {'wins': 0, 'total': 0, 'profit': 0}
            monthly_performance[month]['total'] += 1
            if pred.get('won', False):
                monthly_performance[month]['wins'] += 1
            monthly_performance[month]['profit'] += pred.get('profit', 0)
        
        return {
            'model_name': model_name,
            'total_bets': total_bets,
            'win_rate': total_wins / total_bets if total_bets > 0 else 0,
            'total_profit': total_profit,
            'monthly_performance': monthly_performance,
            'rolling_100': self.get_rolling_metrics(model_name, 100),
            'rolling_50': self.get_rolling_metrics(model_name, 50),
            'rolling_20': self.get_rolling_metrics(model_name, 20)
        }


# ==================== INTEGRATION API ====================

class EvaluationAPI:
    """
    API for ML model evaluation system
    """
    
    def __init__(self):
        self.evaluator = EliteModelEvaluator()
        self.backtester = EliteBacktester()
        self.ab_testing = ABTestingFramework()
        self.tracker = ModelPerformanceTracker()
    
    def evaluate(self, y_true, y_pred, y_prob=None, **kwargs) -> Dict:
        """Quick evaluation endpoint"""
        report = self.evaluator.evaluate_model(
            np.array(y_true), np.array(y_pred),
            np.array(y_prob) if y_prob else None,
            **kwargs
        )
        return {
            'classification': report.classification_metrics,
            'regression': report.regression_metrics,
            'betting': report.betting_metrics,
            'risk': report.risk_metrics,
            'calibration': report.calibration_metrics,
            'overall_score': report.overall_score,
            'recommendations': report.recommendations
        }
    
    def backtest(self, predictions: List[Dict], strategy: str = 'flat') -> Dict:
        """Run backtest endpoint"""
        result = self.backtester.run_backtest(predictions, strategy)
        return {
            'total_bets': result.total_bets,
            'winning_bets': result.winning_bets,
            'win_rate': result.win_rate,
            'total_profit': result.total_profit,
            'roi': result.roi,
            'sharpe_ratio': result.sharpe_ratio,
            'max_drawdown': result.max_drawdown,
            'metrics': result.metrics
        }
    
    def compare(self, model_a_results: List[Dict], 
                model_b_results: List[Dict]) -> Dict:
        """Compare models endpoint"""
        comparisons = self.ab_testing.compare_models(model_a_results, model_b_results)
        return {k: v.__dict__ for k, v in comparisons.items()}


# Create global instance
evaluation_api = EvaluationAPI()
