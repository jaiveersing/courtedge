"""
Historical Simulation Engine
Backtest betting strategies on historical data
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging
from typing import List, Dict, Callable

logger = logging.getLogger(__name__)

class HistoricalSimulator:
    def __init__(self, starting_bankroll=10000):
        self.starting_bankroll = starting_bankroll
        self.results = []
        
    def run_simulation(self, strategy, historical_data, start_date=None, end_date=None):
        """
        Run backtest simulation with given strategy
        
        Args:
            strategy: Callable that takes game data and returns bet decision
            historical_data: DataFrame with historical games and odds
            start_date: Start date for simulation
            end_date: End date for simulation
        """
        logger.info(f"Starting simulation from {start_date} to {end_date}")
        
        # Filter data by date range
        if start_date:
            historical_data = historical_data[historical_data['date'] >= start_date]
        if end_date:
            historical_data = historical_data[historical_data['date'] <= end_date]
        
        # Initialize tracking variables
        bankroll = self.starting_bankroll
        bet_history = []
        daily_results = []
        
        # Group by date
        for date, day_games in historical_data.groupby('date'):
            day_bets = []
            day_profit = 0
            
            # Run strategy for each game
            for idx, game in day_games.iterrows():
                bet_decision = strategy(game, bankroll)
                
                if bet_decision and bet_decision['stake'] > 0:
                    # Execute bet
                    bet_result = self._execute_bet(bet_decision, game)
                    
                    # Update bankroll
                    bankroll += bet_result['profit']
                    day_profit += bet_result['profit']
                    
                    # Record bet
                    bet_history.append({
                        'date': date,
                        'game_id': game['game_id'],
                        'matchup': game['matchup'],
                        'bet_type': bet_decision['bet_type'],
                        'pick': bet_decision['pick'],
                        'odds': bet_decision['odds'],
                        'stake': bet_decision['stake'],
                        'result': bet_result['result'],
                        'profit': bet_result['profit'],
                        'bankroll': bankroll
                    })
                    
                    day_bets.append(bet_result)
            
            # Record daily results
            daily_results.append({
                'date': date,
                'bets_placed': len(day_bets),
                'profit': day_profit,
                'bankroll': bankroll,
                'roi': (day_profit / self.starting_bankroll) * 100 if day_bets else 0
            })
        
        # Calculate performance metrics
        performance = self._calculate_performance(bet_history, daily_results)
        
        self.results = {
            'bet_history': bet_history,
            'daily_results': daily_results,
            'performance': performance,
            'final_bankroll': bankroll,
            'total_profit': bankroll - self.starting_bankroll,
            'roi': ((bankroll - self.starting_bankroll) / self.starting_bankroll) * 100
        }
        
        logger.info(f"Simulation complete. Final bankroll: ${bankroll:.2f} ({self.results['roi']:.2f}% ROI)")
        
        return self.results
    
    def _execute_bet(self, bet_decision, game):
        """
        Execute a bet and determine outcome
        """
        bet_type = bet_decision['bet_type']
        pick = bet_decision['pick']
        odds = bet_decision['odds']
        stake = bet_decision['stake']
        
        # Determine if bet won
        won = False
        
        if bet_type == 'moneyline':
            won = game['winner'] == pick
        elif bet_type == 'spread':
            if pick == game['favorite']:
                won = (game['favorite_score'] - game['underdog_score']) > game['spread']
            else:
                won = (game['underdog_score'] - game['favorite_score']) > -game['spread']
        elif bet_type == 'total':
            total = game['favorite_score'] + game['underdog_score']
            if pick == 'over':
                won = total > game['total_line']
            else:
                won = total < game['total_line']
        elif bet_type == 'prop':
            won = game.get(f"prop_{bet_decision['prop_id']}_result") == 'over'
        
        # Calculate profit
        if won:
            if odds > 0:
                profit = stake * (odds / 100)
            else:
                profit = stake * (100 / abs(odds))
        else:
            profit = -stake
        
        return {
            'result': 'win' if won else 'loss',
            'profit': profit
        }
    
    def _calculate_performance(self, bet_history, daily_results):
        """
        Calculate comprehensive performance metrics
        """
        if not bet_history:
            return {}
        
        df = pd.DataFrame(bet_history)
        
        # Win/Loss stats
        total_bets = len(df)
        wins = len(df[df['result'] == 'win'])
        losses = len(df[df['result'] == 'loss'])
        win_rate = (wins / total_bets) * 100
        
        # Profit stats
        total_profit = df['profit'].sum()
        total_staked = df['stake'].sum()
        roi = (total_profit / total_staked) * 100
        
        avg_win = df[df['result'] == 'win']['profit'].mean() if wins > 0 else 0
        avg_loss = df[df['result'] == 'loss']['profit'].mean() if losses > 0 else 0
        
        # Streaks
        df['win_streak'] = (df['result'] == 'win').cumsum()
        df['loss_streak'] = (df['result'] == 'loss').cumsum()
        
        max_win_streak = df.groupby((df['result'] != df['result'].shift()).cumsum())['result'].apply(
            lambda x: (x == 'win').sum()
        ).max()
        
        max_loss_streak = df.groupby((df['result'] != df['result'].shift()).cumsum())['result'].apply(
            lambda x: (x == 'loss').sum()
        ).max()
        
        # Drawdown analysis
        df['cumulative_profit'] = df['profit'].cumsum()
        df['running_max'] = df['cumulative_profit'].cummax()
        df['drawdown'] = df['cumulative_profit'] - df['running_max']
        
        max_drawdown = df['drawdown'].min()
        max_drawdown_pct = (max_drawdown / self.starting_bankroll) * 100
        
        # Sharpe ratio (annualized)
        daily_df = pd.DataFrame(daily_results)
        daily_returns = daily_df['profit'] / self.starting_bankroll
        
        sharpe_ratio = 0
        if len(daily_returns) > 1 and daily_returns.std() > 0:
            sharpe_ratio = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252)  # Annualized
        
        # Performance by bet type
        by_type = df.groupby('bet_type').agg({
            'profit': ['sum', 'count', 'mean'],
            'result': lambda x: (x == 'win').sum() / len(x) * 100
        }).round(2)
        
        return {
            'total_bets': total_bets,
            'wins': wins,
            'losses': losses,
            'win_rate': win_rate,
            'total_profit': total_profit,
            'total_staked': total_staked,
            'roi': roi,
            'avg_win': avg_win,
            'avg_loss': avg_loss,
            'profit_factor': abs(avg_win / avg_loss) if avg_loss != 0 else 0,
            'max_win_streak': max_win_streak,
            'max_loss_streak': max_loss_streak,
            'max_drawdown': max_drawdown,
            'max_drawdown_pct': max_drawdown_pct,
            'sharpe_ratio': sharpe_ratio,
            'by_type': by_type.to_dict() if not by_type.empty else {}
        }
    
    def compare_strategies(self, strategies, historical_data):
        """
        Compare multiple strategies side-by-side
        """
        logger.info(f"Comparing {len(strategies)} strategies")
        
        results = {}
        
        for strategy_name, strategy_func in strategies.items():
            logger.info(f"Testing strategy: {strategy_name}")
            result = self.run_simulation(strategy_func, historical_data.copy())
            results[strategy_name] = result
        
        # Create comparison table
        comparison = pd.DataFrame({
            name: {
                'Final Bankroll': f"${res['final_bankroll']:.2f}",
                'Total Profit': f"${res['total_profit']:.2f}",
                'ROI': f"{res['roi']:.2f}%",
                'Win Rate': f"{res['performance']['win_rate']:.2f}%",
                'Total Bets': res['performance']['total_bets'],
                'Max Drawdown': f"{res['performance']['max_drawdown_pct']:.2f}%",
                'Sharpe Ratio': f"{res['performance']['sharpe_ratio']:.2f}"
            }
            for name, res in results.items()
        }).T
        
        return results, comparison
    
    def optimize_parameters(self, strategy_template, param_grid, historical_data, metric='roi'):
        """
        Grid search for optimal strategy parameters
        """
        logger.info(f"Optimizing parameters. Grid size: {np.prod([len(v) for v in param_grid.values()])}")
        
        from itertools import product
        
        best_params = None
        best_score = -float('inf')
        all_results = []
        
        # Generate all parameter combinations
        param_names = list(param_grid.keys())
        param_values = list(param_grid.values())
        
        for params in product(*param_values):
            param_dict = dict(zip(param_names, params))
            
            # Create strategy with these parameters
            strategy = strategy_template(**param_dict)
            
            # Run simulation
            result = self.run_simulation(strategy, historical_data.copy())
            
            # Get score
            if metric == 'roi':
                score = result['roi']
            elif metric == 'sharpe':
                score = result['performance']['sharpe_ratio']
            elif metric == 'profit':
                score = result['total_profit']
            else:
                score = result['roi']
            
            all_results.append({
                'params': param_dict,
                'score': score,
                'result': result
            })
            
            if score > best_score:
                best_score = score
                best_params = param_dict
        
        logger.info(f"Optimization complete. Best params: {best_params} (score: {best_score:.2f})")
        
        return {
            'best_params': best_params,
            'best_score': best_score,
            'all_results': all_results
        }
    
    def monte_carlo_simulation(self, strategy, historical_data, n_simulations=1000):
        """
        Run Monte Carlo simulation with random sampling
        """
        logger.info(f"Running {n_simulations} Monte Carlo simulations")
        
        results = []
        
        for i in range(n_simulations):
            # Random sample with replacement
            sampled_data = historical_data.sample(frac=1, replace=True).reset_index(drop=True)
            
            # Run simulation
            result = self.run_simulation(strategy, sampled_data)
            
            results.append({
                'simulation': i + 1,
                'final_bankroll': result['final_bankroll'],
                'roi': result['roi'],
                'max_drawdown': result['performance']['max_drawdown_pct']
            })
        
        # Analyze distribution
        df = pd.DataFrame(results)
        
        analysis = {
            'mean_roi': df['roi'].mean(),
            'median_roi': df['roi'].median(),
            'std_roi': df['roi'].std(),
            'min_roi': df['roi'].min(),
            'max_roi': df['roi'].max(),
            'profit_probability': (df['roi'] > 0).sum() / n_simulations * 100,
            'percentile_5': df['roi'].quantile(0.05),
            'percentile_95': df['roi'].quantile(0.95),
            'var_95': df['final_bankroll'].quantile(0.05),  # Value at Risk
            'expected_final_bankroll': df['final_bankroll'].mean()
        }
        
        logger.info(f"Monte Carlo complete. Mean ROI: {analysis['mean_roi']:.2f}%, Profit Prob: {analysis['profit_probability']:.2f}%")
        
        return {
            'simulations': results,
            'analysis': analysis
        }

# Example strategies

def kelly_strategy(game, bankroll, kelly_fraction=0.25):
    """
    Example: Kelly Criterion betting strategy
    """
    # This would use ML model predictions in production
    edge = 0.05  # 5% edge (would come from model)
    odds = -110
    
    if edge <= 0:
        return None
    
    # Kelly formula
    decimal_odds = 1 + (100 / abs(odds))
    kelly = edge / (decimal_odds - 1)
    
    stake = bankroll * kelly * kelly_fraction
    stake = min(stake, bankroll * 0.05)  # Max 5% of bankroll
    
    return {
        'bet_type': 'spread',
        'pick': game['favorite'],
        'odds': odds,
        'stake': stake
    }

def flat_bet_strategy(game, bankroll, unit_size=100):
    """
    Example: Flat betting strategy
    """
    return {
        'bet_type': 'moneyline',
        'pick': game['favorite'],
        'odds': -150,
        'stake': unit_size
    }

def value_bet_strategy(game, bankroll, min_edge=0.03):
    """
    Example: Value betting - only bet when edge exceeds threshold
    """
    # Would use model predictions in production
    model_prob = 0.60
    odds = -110
    
    # Implied probability from odds
    implied_prob = abs(odds) / (abs(odds) + 100)
    
    edge = model_prob - implied_prob
    
    if edge < min_edge:
        return None
    
    stake = bankroll * 0.02  # 2% of bankroll
    
    return {
        'bet_type': 'spread',
        'pick': game['favorite'],
        'odds': odds,
        'stake': stake
    }

# Export
simulator = HistoricalSimulator()
