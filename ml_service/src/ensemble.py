"""
Enhanced Ensemble modeling with CatBoost and Stacked Meta-Learner
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold
from xgboost import XGBRegressor
import lightgbm as lgb
try:
    from catboost import CatBoostRegressor
    CATBOOST_AVAILABLE = True
except ImportError:
    CATBOOST_AVAILABLE = False
    print("CatBoost not installed. Run: pip install catboost")
import pickle
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class EnsembleModel:
    """Enhanced ensemble model with CatBoost and stacked meta-learner"""
    
    def __init__(self, model_type: str = "regression", use_stacking: bool = True):
        self.model_type = model_type
        self.models = {}
        self.weights = {}
        self.meta_learner = None
        self.use_stacking = use_stacking
        self.fitted = False
        
    def create_models(self, n_features: int) -> Dict:
        """Create ensemble models including CatBoost"""
        models = {
            'xgboost': XGBRegressor(
                n_estimators=300,
                max_depth=6,
                learning_rate=0.03,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                early_stopping_rounds=50
            ),
            'lightgbm': lgb.LGBMRegressor(
                n_estimators=300,
                max_depth=6,
                learning_rate=0.03,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                verbose=-1
            ),
            'random_forest': RandomForestRegressor(
                n_estimators=200,
                max_depth=12,
                min_samples_split=10,
                min_samples_leaf=5,
                random_state=42,
                n_jobs=-1
            )
        }
        
        # Add CatBoost if available
        if CATBOOST_AVAILABLE:
            models['catboost'] = CatBoostRegressor(
                iterations=500,
                depth=6,
                learning_rate=0.03,
                l2_leaf_reg=3,
                random_strength=0.1,
                bagging_temperature=0.5,
                random_state=42,
                verbose=False,
                thread_count=-1
            )
            logger.info("CatBoost added to ensemble")
        
        return models
    
    def fit(self, X: np.ndarray, y: np.ndarray, sample_weight: Optional[np.ndarray] = None, X_val: Optional[np.ndarray] = None, y_val: Optional[np.ndarray] = None):
        """Train ensemble models with optional stacking"""
        logger.info(f"Training ensemble with {X.shape[0]} samples and {X.shape[1]} features")
        
        self.models = self.create_models(X.shape[1])
        errors = {}
        
        # Train each model
        for name, model in self.models.items():
            try:
                logger.info(f"Training {name}...")
                
                # Special handling for different models
                if name == 'xgboost' and X_val is not None:
                    model.fit(X, y, eval_set=[(X_val, y_val)], verbose=False)
                elif name == 'catboost' and X_val is not None:
                    model.fit(X, y, eval_set=(X_val, y_val), verbose=False)
                elif sample_weight is not None and name not in ['lightgbm', 'catboost']:
                    model.fit(X, y, sample_weight=sample_weight)
                else:
                    model.fit(X, y)
                
                # Calculate validation error for weighting
                if X_val is not None:
                    y_pred = model.predict(X_val)
                    mse = np.mean((y_val - y_pred) ** 2)
                else:
                    y_pred = model.predict(X)
                    mse = np.mean((y - y_pred) ** 2)
                    
                errors[name] = mse
                logger.info(f"{name} validation MSE: {mse:.4f}")
            except Exception as e:
                logger.error(f"Error training {name}: {e}")
                errors[name] = float('inf')
        
        # Calculate weights based on inverse errors
        total_inv_error = sum(1/e if e > 0 else 0 for e in errors.values())
        self.weights = {
            name: (1/errors[name])/total_inv_error if errors[name] > 0 else 0
            for name in errors
        }
        
        logger.info(f"Model weights: {self.weights}")
        
        # Train meta-learner if stacking enabled
        if self.use_stacking and X_val is not None:
            logger.info("Training stacked meta-learner...")
            base_predictions = self._get_base_predictions(X_val)
            self.meta_learner = Ridge(alpha=1.0)
            self.meta_learner.fit(base_predictions, y_val)
            logger.info("Meta-learner trained successfully")
        
        self.fitted = True
    
    def _get_base_predictions(self, X: np.ndarray) -> np.ndarray:
        """Get predictions from all base models"""
        predictions = []
        for name, model in self.models.items():
            try:
                pred = model.predict(X)
                predictions.append(pred)
            except Exception as e:
                logger.error(f"Error getting predictions from {name}: {e}")
        return np.column_stack(predictions)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions using stacked ensemble or weighted average"""
        if not self.fitted:
            raise ValueError("Model must be fitted before prediction")
        
        # Use stacked meta-learner if available
        if self.use_stacking and self.meta_learner is not None:
            base_predictions = self._get_base_predictions(X)
            return self.meta_learner.predict(base_predictions)
        
        # Otherwise use weighted average
        predictions = np.zeros(X.shape[0])
        
        for name, model in self.models.items():
            try:
                pred = model.predict(X)
                weight = self.weights.get(name, 0)
                predictions += pred * weight
                logger.debug(f"{name} prediction (weight={weight:.3f})")
            except Exception as e:
                logger.error(f"Error predicting with {name}: {e}")
        
        return predictions
    
    def predict_with_uncertainty(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Predict with uncertainty estimates"""
        if not self.fitted:
            raise ValueError("Model must be fitted before prediction")
        
        all_predictions = []
        
        for name, model in self.models.items():
            try:
                pred = model.predict(X)
                all_predictions.append(pred)
            except Exception as e:
                logger.error(f"Error predicting with {name}: {e}")
        
        if not all_predictions:
            raise ValueError("No models produced predictions")
        
        # Stack predictions
        all_predictions = np.array(all_predictions)
        
        # Weighted mean
        predictions = np.zeros(X.shape[0])
        for i, name in enumerate(self.models.keys()):
            weight = self.weights.get(name, 0)
            predictions += all_predictions[i] * weight
        
        # Uncertainty as weighted standard deviation
        uncertainty = np.std(all_predictions, axis=0)
        
        return predictions, uncertainty
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get aggregated feature importance"""
        if not self.fitted:
            return {}
        
        importance_dict = {}
        
        for name, model in self.models.items():
            try:
                if hasattr(model, 'feature_importances_'):
                    importances = model.feature_importances_
                    weight = self.weights.get(name, 0)
                    
                    for idx, imp in enumerate(importances):
                        if idx not in importance_dict:
                            importance_dict[idx] = 0
                        importance_dict[idx] += imp * weight
            except Exception as e:
                logger.error(f"Error getting feature importance from {name}: {e}")
        
        return importance_dict
    
    def save(self, path: str):
        """Save ensemble model"""
        save_path = Path(path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        model_data = {
            'models': self.models,
            'weights': self.weights,
            'fitted': self.fitted,
            'model_type': self.model_type
        }
        
        with open(save_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Ensemble model saved to {save_path}")
    
    def load(self, path: str):
        """Load ensemble model"""
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        self.models = model_data['models']
        self.weights = model_data['weights']
        self.fitted = model_data['fitted']
        self.model_type = model_data.get('model_type', 'regression')
        
        logger.info(f"Ensemble model loaded from {path}")


class StackedEnsemble:
    """Stacked ensemble with meta-learner"""
    
    def __init__(self):
        self.base_models = []
        self.meta_model = None
        self.fitted = False
    
    def add_base_model(self, model, name: str):
        """Add a base model to the ensemble"""
        self.base_models.append({'model': model, 'name': name})
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        """Train stacked ensemble with cross-validation"""
        from sklearn.model_selection import KFold
        
        logger.info(f"Training stacked ensemble with {len(self.base_models)} base models")
        
        # Cross-validation predictions for meta-learner
        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        meta_features = np.zeros((X.shape[0], len(self.base_models)))
        
        for i, base_model_dict in enumerate(self.base_models):
            model = base_model_dict['model']
            name = base_model_dict['name']
            
            logger.info(f"Training base model: {name}")
            
            for train_idx, val_idx in kf.split(X):
                X_train, X_val = X[train_idx], X[val_idx]
                y_train = y[train_idx]
                
                # Train on fold
                model.fit(X_train, y_train)
                
                # Predict on validation
                meta_features[val_idx, i] = model.predict(X_val)
            
            # Train on full dataset for final model
            model.fit(X, y)
        
        # Train meta-learner
        logger.info("Training meta-learner")
        self.meta_model = XGBRegressor(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.1,
            random_state=42
        )
        self.meta_model.fit(meta_features, y)
        
        self.fitted = True
        logger.info("Stacked ensemble training complete")
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions using stacked ensemble"""
        if not self.fitted:
            raise ValueError("Model must be fitted before prediction")
        
        # Get base model predictions
        meta_features = np.zeros((X.shape[0], len(self.base_models)))
        
        for i, base_model_dict in enumerate(self.base_models):
            model = base_model_dict['model']
            meta_features[:, i] = model.predict(X)
        
        # Meta-learner prediction
        return self.meta_model.predict(meta_features)
    
    def save(self, path: str):
        """Save stacked ensemble"""
        save_path = Path(path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        model_data = {
            'base_models': self.base_models,
            'meta_model': self.meta_model,
            'fitted': self.fitted
        }
        
        with open(save_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Stacked ensemble saved to {save_path}")


def create_ensemble_for_stat(stat_type: str, X: np.ndarray, y: np.ndarray) -> EnsembleModel:
    """Create and train ensemble model for specific stat type"""
    logger.info(f"Creating ensemble for {stat_type}")
    
    ensemble = EnsembleModel(model_type="regression")
    ensemble.fit(X, y)
    
    return ensemble
