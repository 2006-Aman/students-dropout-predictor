"""
Data processing and validation module for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional, Any
import logging
from config import (
    REQUIRED_COLUMNS, OPTIONAL_COLUMNS, VALIDATION_RULES,
    FEE_PAYMENT_MAPPING, GENDER_MAPPING
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    """Handles data validation, preprocessing, and feature engineering"""
    
    def __init__(self):
        self.column_mapping = {}
        self.feature_columns = []
        self.target_column = None
        self.preprocessing_params = {}
        
    def validate_and_preprocess(self, df: pd.DataFrame, 
                              column_mapping: Optional[Dict] = None) -> Tuple[pd.DataFrame, Dict]:
        """
        Validate and preprocess the input dataframe
        
        Args:
            df: Input dataframe
            column_mapping: Optional mapping of user columns to expected columns
            
        Returns:
            Tuple of (processed_dataframe, processing_info)
        """
        logger.info("Starting data validation and preprocessing")
        
        # Store original info
        original_shape = df.shape
        processing_info = {
            "original_shape": original_shape,
            "missing_data": {},
            "validation_errors": [],
            "warnings": []
        }
        
        # Step 1: Column mapping and detection
        df_processed = self._map_columns(df, column_mapping)
        
        # Step 2: Data type conversion and cleaning
        df_processed = self._clean_data_types(df_processed)
        
        # Step 3: Handle missing values
        df_processed, missing_info = self._handle_missing_values(df_processed)
        processing_info["missing_data"] = missing_info
        
        # Step 4: Validate data ranges
        validation_errors = self._validate_data_ranges(df_processed)
        processing_info["validation_errors"] = validation_errors
        
        # Step 5: Feature engineering
        df_processed = self._engineer_features(df_processed)
        
        # Step 6: Encode categorical variables
        df_processed = self._encode_categorical_variables(df_processed)
        
        logger.info(f"Data preprocessing completed. Shape: {df_processed.shape}")
        return df_processed, processing_info
    
    def _map_columns(self, df: pd.DataFrame, column_mapping: Optional[Dict]) -> pd.DataFrame:
        """Map user columns to expected column names"""
        df_mapped = df.copy()
        
        if column_mapping:
            self.column_mapping = column_mapping
            df_mapped = df_mapped.rename(columns=column_mapping)
        else:
            # Auto-detect columns (case-insensitive)
            df_mapped.columns = df_mapped.columns.str.lower().str.strip()
            auto_mapping = {}
            
            for expected_col in REQUIRED_COLUMNS + OPTIONAL_COLUMNS:
                for actual_col in df_mapped.columns:
                    if expected_col.lower() in actual_col.lower() or actual_col.lower() in expected_col.lower():
                        auto_mapping[actual_col] = expected_col
                        break
            
            self.column_mapping = auto_mapping
            df_mapped = df_mapped.rename(columns=auto_mapping)
        
        return df_mapped
    
    def _clean_data_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and convert data types"""
        df_clean = df.copy()
        
        # Clean percentage columns
        percentage_cols = ['attendance_percentage', 'assignment_timeliness', 'quiz_test_avg_pct']
        for col in percentage_cols:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].astype(str).str.replace('%', '').str.strip()
                df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
                # Normalize assignment_timeliness if provided as 0-1
                if col == 'assignment_timeliness':
                    try:
                        # If median is <= 1, likely 0-1 scale; convert to 0-100
                        med = df_clean[col].median()
                        if pd.notnull(med) and med <= 1:
                            df_clean[col] = df_clean[col] * 100
                    except Exception:
                        pass
        
        # Clean fee payment status
        if 'fee_payment_status' in df_clean.columns:
            df_clean['fee_payment_status'] = df_clean['fee_payment_status'].astype(str).str.lower().str.strip()
            df_clean['fee_payment_status'] = df_clean['fee_payment_status'].map(FEE_PAYMENT_MAPPING)
        
        # Clean gender
        if 'gender' in df_clean.columns:
            df_clean['gender'] = df_clean['gender'].astype(str).str.lower().str.strip()
            df_clean['gender'] = df_clean['gender'].map(GENDER_MAPPING)
        
        # Convert numeric columns
        numeric_cols = ['lms_login_count_monthly', 'time_spent_online_hours_week', 'age', 'socioeconomic_status']
        for col in numeric_cols:
            if col in df_clean.columns:
                df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
        
        return df_clean
    
    def _handle_missing_values(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict]:
        """Handle missing values with appropriate strategies"""
        df_processed = df.copy()
        missing_info = {}
        
        for col in df_processed.columns:
            missing_count = df_processed[col].isnull().sum()
            missing_pct = (missing_count / len(df_processed)) * 100
            missing_info[col] = {"count": missing_count, "percentage": missing_pct}
            
            if missing_count > 0:
                if missing_pct > 30:
                    logger.warning(f"Column {col} has {missing_pct:.1f}% missing values")
                    # Option to drop column or keep with warning
                elif missing_pct > 0:
                    if df_processed[col].dtype in ['int64', 'float64']:
                        # Impute numeric columns with median
                        df_processed[col].fillna(df_processed[col].median(), inplace=True)
                    else:
                        # Impute categorical columns with mode
                        mode_value = df_processed[col].mode()
                        if len(mode_value) > 0:
                            df_processed[col].fillna(mode_value[0], inplace=True)
        
        return df_processed, missing_info
    
    def _validate_data_ranges(self, df: pd.DataFrame) -> List[str]:
        """Validate data ranges according to business rules"""
        errors = []
        
        for col, rules in VALIDATION_RULES.items():
            if col in df.columns:
                # Work on numeric view only to avoid type issues
                s = pd.to_numeric(df[col], errors='coerce')
                if 'min' in rules:
                    min_violations = (s.dropna() < rules['min']).sum()
                    if min_violations > 0:
                        errors.append(f"Column {col}: {min_violations} values below minimum {rules['min']}")
                
                if 'max' in rules:
                    max_violations = (s.dropna() > rules['max']).sum()
                    if max_violations > 0:
                        errors.append(f"Column {col}: {max_violations} values above maximum {rules['max']}")
        
        return errors
    
    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create additional features for better model performance"""
        df_engineered = df.copy()
        
        # Create engagement score
        if all(col in df_engineered.columns for col in ['attendance_percentage', 'lms_login_count_monthly', 'time_spent_online_hours_week']):
            df_engineered['engagement_score'] = (
                df_engineered['attendance_percentage'] * 0.4 +
                (df_engineered['lms_login_count_monthly'] / df_engineered['lms_login_count_monthly'].max()) * 100 * 0.3 +
                (df_engineered['time_spent_online_hours_week'] / df_engineered['time_spent_online_hours_week'].max()) * 100 * 0.3
            )
        
        # Create academic performance score
        if all(col in df_engineered.columns for col in ['assignment_timeliness', 'quiz_test_avg_pct']):
            df_engineered['academic_performance'] = (
                df_engineered['assignment_timeliness'] * 0.3 +
                df_engineered['quiz_test_avg_pct'] * 0.7
            )
        
        # Create risk indicators
        if 'attendance_percentage' in df_engineered.columns:
            df_engineered['low_attendance'] = (df_engineered['attendance_percentage'] < 70).astype(int)
        
        if 'fee_payment_status' in df_engineered.columns:
            df_engineered['payment_issues'] = (df_engineered['fee_payment_status'] < 1).astype(int)
        
        return df_engineered
    
    def _encode_categorical_variables(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical variables for model training"""
        df_encoded = df.copy()
        
        # One-hot encode categorical variables if needed
        categorical_cols = df_encoded.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if col not in ['student_id', 'student_name']:  # Skip ID columns
                df_encoded = pd.get_dummies(df_encoded, columns=[col], prefix=col)
        
        return df_encoded
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for model training/prediction"""
        # Select only numeric columns for model training
        feature_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Remove ID columns
        feature_cols = [col for col in feature_cols if col not in ['student_id']]
        
        self.feature_columns = feature_cols
        return df[feature_cols]
    
    def get_column_mapping(self) -> Dict:
        """Get the current column mapping"""
        return self.column_mapping
    
    def get_feature_columns(self) -> List[str]:
        """Get the list of feature columns"""
        return self.feature_columns
