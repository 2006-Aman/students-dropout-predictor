"""
Configuration settings for the Student Dropout Predictor
"""
import os
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"
REPORTS_DIR = PROJECT_ROOT / "reports"
LOGS_DIR = PROJECT_ROOT / "logs"

# Create directories if they don't exist
for directory in [DATA_DIR, MODELS_DIR, REPORTS_DIR, LOGS_DIR]:
    directory.mkdir(exist_ok=True)

# Model configuration
MODEL_CONFIG = {
    "n_estimators": 300,
    "max_depth": 6,
    "learning_rate": 0.05,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": 42,
    "eval_metric": "logloss"
}

# Risk thresholds
RISK_THRESHOLDS = {
    "high": 0.65,
    "medium": 0.35,
    "low": 0.0
}

# Expected columns (case-insensitive)
REQUIRED_COLUMNS = [
    "student_id",
    "attendance_percentage",
    "assignment_timeliness", 
    "quiz_test_avg_pct",
    "fee_payment_status",
    "lms_login_count_monthly",
    "time_spent_online_hours_week"
]

OPTIONAL_COLUMNS = [
    "student_name",
    "age",
    "gender",
    "socioeconomic_status"
]

# Data validation rules
VALIDATION_RULES = {
    "attendance_percentage": {"min": 0, "max": 100},
    "assignment_timeliness": {"min": 0, "max": 100},
    "quiz_test_avg_pct": {"min": 0, "max": 100},
    "lms_login_count_monthly": {"min": 0},
    "time_spent_online_hours_week": {"min": 0},
    "age": {"min": 16, "max": 100},
    "socioeconomic_status": {"min": 1, "max": 5}
}

# Fee payment status mapping
FEE_PAYMENT_MAPPING = {
    "paid": 1,
    "partial": 0.5,
    "unpaid": 0,
    "1": 1,
    "0": 0,
    "2": 0.5
}

# Gender mapping
GENDER_MAPPING = {
    "male": 1,
    "female": 0,
    "other": 2,
    "m": 1,
    "f": 0,
    "o": 2
}

# Intervention templates
INTERVENTION_TEMPLATES = {
    "low_attendance": {
        "title": "Attendance Improvement",
        "description": "Schedule counseling session and implement attendance tracking",
        "priority": "high"
    },
    "unpaid_fees": {
        "title": "Financial Aid Support",
        "description": "Connect with financial aid office and explore payment plans",
        "priority": "high"
    },
    "low_engagement": {
        "title": "Academic Engagement",
        "description": "Provide additional learning resources and one-on-one support",
        "priority": "medium"
    },
    "poor_performance": {
        "title": "Academic Support",
        "description": "Arrange tutoring and study groups",
        "priority": "medium"
    }
}

# Privacy settings
PRIVACY_SETTINGS = {
    "data_retention_days": 30,
    "auto_delete": True,
    "log_predictions": True
}
