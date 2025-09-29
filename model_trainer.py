"""
XGBoost model training and prediction module for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    classification_report
)
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib
import optuna
from typing import Dict, List, Tuple, Optional, Any
import logging
from pathlib import Path
from config import MODEL_CONFIG, RISK_THRESHOLDS, MODELS_DIR

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DropoutPredictor:
    """XGBoost-based student dropout prediction model"""
    
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.feature_columns = []
        self.scaler = None
        self.training_metrics = {}
        self.model_version = None
        self.is_trained = False
        
    def prepare_training_data(self, df: pd.DataFrame, target_column: str = 'dropout') -> Tuple[pd.DataFrame, pd.Series]:
        """
        Prepare training data with target variable
        
        Args:
            df: Processed dataframe
            target_column: Name of target column (if exists) or create synthetic target
            
        Returns:
            Tuple of (features, target)
        """
        # If target column doesn't exist, create synthetic target based on risk factors
        if target_column not in df.columns:
            logger.info("Creating synthetic target variable based on risk factors")
            target = self._create_synthetic_target(df)
        else:
            target = df[target_column]
        
        # Prepare features
        feature_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        feature_cols = [col for col in feature_cols if col not in ['student_id', target_column]]
        self.feature_columns = feature_cols
        
        features = df[feature_cols]
        
        # Handle missing values in features
        features = features.fillna(features.median())
        
        return features, target
    
    def _create_synthetic_target(self, df: pd.DataFrame) -> pd.Series:
        """Create synthetic target variable based on risk factors"""
        target = np.zeros(len(df))
        
        # High risk indicators
        if 'attendance_percentage' in df.columns:
            target += (df['attendance_percentage'] < 60).astype(int) * 2
        
        if 'assignment_timeliness' in df.columns:
            target += (df['assignment_timeliness'] < 50).astype(int) * 2
        
        if 'quiz_test_avg_pct' in df.columns:
            target += (df['quiz_test_avg_pct'] < 50).astype(int) * 2
        
        if 'fee_payment_status' in df.columns:
            target += (df['fee_payment_status'] < 0.5).astype(int) * 1
        
        if 'lms_login_count_monthly' in df.columns:
            target += (df['lms_login_count_monthly'] < 5).astype(int) * 1
        
        # Convert to binary (0: no dropout, 1: dropout)
        target = (target >= 3).astype(int)
        
        logger.info(f"Created synthetic target: {target.sum()} dropouts out of {len(target)} students")
        return pd.Series(target, index=df.index)
    
    def train(self, X: pd.DataFrame, y: pd.Series, 
              use_hyperparameter_tuning: bool = False,
              use_smote: bool = True) -> Dict[str, Any]:
        """
        Train the XGBoost model
        
        Args:
            X: Feature matrix
            y: Target variable
            use_hyperparameter_tuning: Whether to use Optuna for hyperparameter tuning
            use_smote: Whether to use SMOTE for class imbalance
            
        Returns:
            Dictionary containing training metrics and model info
        """
        logger.info("Starting model training")
        
        # Split data
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
        
        # Handle class imbalance with SMOTE
        if use_smote and len(np.unique(y_train)) > 1:
            smote = SMOTE(random_state=42)
            X_train, y_train = smote.fit_resample(X_train, y_train)
            logger.info(f"Applied SMOTE. New training set size: {len(X_train)}")
        
        # Hyperparameter tuning
        if use_hyperparameter_tuning:
            best_params = self._tune_hyperparameters(X_train, y_train, X_val, y_val)
            model_params = {**MODEL_CONFIG, **best_params}
        else:
            model_params = MODEL_CONFIG.copy()
        
        # Calculate scale_pos_weight for class imbalance
        if len(np.unique(y_train)) > 1:
            pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
            model_params['scale_pos_weight'] = pos_weight
        
        # Train model
        self.model = xgb.XGBClassifier(**model_params)
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            verbose=False
        )
        
        # Make predictions
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        metrics = self._calculate_metrics(y_test, y_pred, y_pred_proba)
        self.training_metrics = metrics
        
        # Store model info
        self.model_version = f"v{len(list(MODELS_DIR.glob('*.joblib'))) + 1}"
        self.is_trained = True
        
        # Save model
        self.save_model()
        
        logger.info(f"Model training completed. Accuracy: {metrics['accuracy']:.3f}")
        return {
            "metrics": metrics,
            "model_version": self.model_version,
            "feature_importance": self.get_feature_importance(),
            "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
        }
    
    def _tune_hyperparameters(self, X_train: pd.DataFrame, y_train: pd.Series,
                            X_val: pd.DataFrame, y_val: pd.Series) -> Dict:
        """Tune hyperparameters using Optuna"""
        logger.info("Starting hyperparameter tuning with Optuna")
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 500),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'random_state': 42,
                'eval_metric': 'logloss'
            }
            
            model = xgb.XGBClassifier(**params)
            model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
            y_pred = model.predict(X_val)
            return f1_score(y_val, y_pred)
        
        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=50)
        
        logger.info(f"Best hyperparameters: {study.best_params}")
        return study.best_params
    
    def _calculate_metrics(self, y_true: pd.Series, y_pred: np.ndarray, y_pred_proba: np.ndarray) -> Dict:
        """Calculate comprehensive model metrics"""
        metrics = {
            'accuracy': accuracy_score(y_true, y_pred),
            'precision': precision_score(y_true, y_pred, zero_division=0),
            'recall': recall_score(y_true, y_pred, zero_division=0),
            'f1_score': f1_score(y_true, y_pred, zero_division=0),
            'roc_auc': roc_auc_score(y_true, y_pred_proba) if len(np.unique(y_true)) > 1 else 0,
            'pr_auc': average_precision_score(y_true, y_pred_proba) if len(np.unique(y_true)) > 1 else 0
        }
        return metrics
    
    def predict(self, X: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, List[Dict]]:
        """
        Make predictions on new data
        
        Args:
            X: Feature matrix
            
        Returns:
            Tuple of (predictions, probabilities, risk_labels)
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Ensure same features as training
        X_processed = X[self.feature_columns].fillna(X[self.feature_columns].median())
        
        # Make predictions
        predictions = self.model.predict(X_processed)
        probabilities = self.model.predict_proba(X_processed)[:, 1]
        
        # Convert to risk labels
        risk_labels = []
        for prob in probabilities:
            if prob >= RISK_THRESHOLDS['high']:
                risk_labels.append('High')
            elif prob >= RISK_THRESHOLDS['medium']:
                risk_labels.append('Medium')
            else:
                risk_labels.append('Low')
        
        return predictions, probabilities, risk_labels
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the trained model"""
        if not self.is_trained:
            return {}
        
        importance_dict = dict(zip(self.feature_columns, self.model.feature_importances_))
        return dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
    
    def save_model(self, filepath: Optional[str] = None) -> str:
        """Save the trained model"""
        if not self.is_trained:
            raise ValueError("No trained model to save")
        
        if filepath is None:
            filepath = MODELS_DIR / f"dropout_model_{self.model_version}.joblib"
        
        model_data = {
            'model': self.model,
            'feature_columns': self.feature_columns,
            'model_version': self.model_version,
            'training_metrics': self.training_metrics,
            'risk_thresholds': RISK_THRESHOLDS
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
        return str(filepath)
    
    def load_model(self, filepath: str) -> bool:
        """Load a pre-trained model"""
        try:
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.feature_columns = model_data['feature_columns']
            self.model_version = model_data['model_version']
            self.training_metrics = model_data.get('training_metrics', {})
            self.is_trained = True
            
            logger.info(f"Model loaded from {filepath}")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model"""
        return {
            'is_trained': self.is_trained,
            'model_version': self.model_version,
            'feature_columns': self.feature_columns,
            'training_metrics': self.training_metrics,
            'risk_thresholds': RISK_THRESHOLDS
        }
