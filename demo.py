"""
Demo script for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
import logging
from datetime import datetime
import os

# Import our modules
from data_processor import DataProcessor
from model_trainer import DropoutPredictor
from explainability import ModelExplainer
from intervention_system import InterventionRecommender
from export_utils import ReportExporter

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_sample_data(n_students: int = 1000) -> pd.DataFrame:
    """Create realistic sample data for testing"""
    np.random.seed(42)
    
    # Create base data
    data = {
        'student_id': [f'STU_{i:04d}' for i in range(1, n_students + 1)],
        'student_name': [f'Student {i}' for i in range(1, n_students + 1)],
        'age': np.random.randint(18, 25, n_students),
        'gender': np.random.choice(['Male', 'Female', 'Other'], n_students, p=[0.5, 0.45, 0.05]),
        'socioeconomic_status': np.random.randint(1, 6, n_students)
    }
    
    # Create correlated academic performance data
    # Students with lower socioeconomic status tend to have lower performance
    academic_base = np.random.normal(70, 15, n_students)
    ses_effect = (data['socioeconomic_status'] - 3) * 5  # SES effect
    academic_performance = (academic_base + ses_effect).clip(0, 100)
    
    # Attendance (correlated with academic performance)
    attendance_base = academic_performance + np.random.normal(0, 10, n_students)
    attendance = attendance_base.clip(0, 100)
    
    # Assignment timeliness (correlated with attendance)
    assignment_base = attendance + np.random.normal(0, 15, n_students)
    assignment_timeliness = assignment_base.clip(0, 100)
    
    # Quiz/test performance (correlated with assignment timeliness)
    quiz_base = assignment_timeliness + np.random.normal(0, 12, n_students)
    quiz_test_avg_pct = quiz_base.clip(0, 100)
    
    # Fee payment status (correlated with socioeconomic status)
    payment_prob = np.where(data['socioeconomic_status'] >= 3, 0.8, 0.4)
    fee_payment_status = np.random.choice(['Paid', 'Partial', 'Unpaid'], n_students, 
                                        p=[0.6, 0.25, 0.15])
    
    # LMS engagement (correlated with academic performance)
    lms_base = academic_performance / 10 + np.random.poisson(5, n_students)
    lms_login_count_monthly = lms_base.clip(0, 50)
    
    # Online time (correlated with LMS engagement)
    online_base = lms_login_count_monthly * 0.5 + np.random.normal(5, 2, n_students)
    time_spent_online_hours_week = online_base.clip(0, 20)
    
    # Add the academic data
    data.update({
        'attendance_percentage': attendance,
        'assignment_timeliness': assignment_timeliness,
        'quiz_test_avg_pct': quiz_test_avg_pct,
        'fee_payment_status': fee_payment_status,
        'lms_login_count_monthly': lms_login_count_monthly,
        'time_spent_online_hours_week': time_spent_online_hours_week
    })
    
    # Create DataFrame first, then introduce missing values
    df = pd.DataFrame(data)
    
    # Introduce some missing values (realistic scenario)
    missing_indices = np.random.choice(n_students, size=int(n_students * 0.05), replace=False)
    df.loc[missing_indices, 'age'] = np.nan
    
    missing_indices = np.random.choice(n_students, size=int(n_students * 0.03), replace=False)
    df.loc[missing_indices, 'socioeconomic_status'] = np.nan
    
    return df

def run_demo():
    """Run the complete demo"""
    logger.info("Starting Student Dropout Predictor Demo")
    
    # Step 1: Create sample data
    logger.info("Creating sample data...")
    df = create_sample_data(1000)
    logger.info(f"Created sample data with {len(df)} students")
    
    # Save sample data
    df.to_csv("sample_student_data.csv", index=False)
    logger.info("Sample data saved to sample_student_data.csv")
    
    # Step 2: Process data
    logger.info("Processing data...")
    data_processor = DataProcessor()
    processed_df, processing_info = data_processor.validate_and_preprocess(df)
    logger.info(f"Data processed. Shape: {processed_df.shape}")
    logger.info(f"Processing info: {processing_info}")
    
    # Step 3: Train model
    logger.info("Training model...")
    model = DropoutPredictor()
    X, y = model.prepare_training_data(processed_df)
    
    training_results = model.train(X, y, use_hyperparameter_tuning=False, use_smote=True)
    logger.info(f"Model trained. Accuracy: {training_results['metrics']['accuracy']:.3f}")
    
    # Step 4: Make predictions
    logger.info("Making predictions...")
    X_features = data_processor.prepare_features(processed_df)
    predictions, probabilities, risk_labels = model.predict(X_features)
    
    # Add predictions to dataframe
    processed_df['dropout_probability'] = probabilities
    processed_df['risk_label'] = risk_labels
    
    # Calculate risk distribution
    risk_counts = {
        'High': sum(1 for label in risk_labels if label == 'High'),
        'Medium': sum(1 for label in risk_labels if label == 'Medium'),
        'Low': sum(1 for label in risk_labels if label == 'Low')
    }
    
    logger.info(f"Risk distribution: {risk_counts}")
    
    # Step 5: Initialize explainer
    logger.info("Initializing SHAP explainer...")
    explainer = ModelExplainer(model)
    explainer.initialize_explainer(X_features)
    
    # Step 6: Generate explanations for high-risk students
    logger.info("Generating explanations for high-risk students...")
    high_risk_indices = [i for i, label in enumerate(risk_labels) if label == 'High']
    
    if high_risk_indices:
        # Get explanations for first 5 high-risk students
        sample_indices = high_risk_indices[:5]
        local_explanations = explainer.explain_local(X_features, sample_indices)
        
        for i, explanation in enumerate(local_explanations['explanations']):
            student_idx = sample_indices[i]
            student_id = processed_df.iloc[student_idx]['student_id']
            logger.info(f"Student {student_id}: {explanation['risk_level']} risk ({explanation['probability']:.1%})")
            logger.info(f"Top features: {[f['feature'] for f in explanation['top_features'][:3]]}")
    
    # Step 7: Generate intervention recommendations
    logger.info("Generating intervention recommendations...")
    intervention_recommender = InterventionRecommender()
    
    # Get recommendations for high-risk students
    for i in sample_indices[:3]:  # First 3 high-risk students
        student_data = processed_df.iloc[i].to_dict()
        student_shap = local_explanations['explanations'][sample_indices.index(i)]['shap_values']
        feature_names = model.feature_columns
        
        recommendations = intervention_recommender.analyze_student_risk_factors(
            student_data, student_shap, feature_names
        )
        
        student_id = student_data['student_id']
        logger.info(f"Intervention recommendations for {student_id}:")
        for j, rec in enumerate(recommendations[:3], 1):
            logger.info(f"  {j}. {rec['factor']} - {rec['recommendation']}")
    
    # Step 8: Export results
    logger.info("Exporting results...")
    exporter = ReportExporter()
    
    # Export CSV
    csv_filename = exporter.export_to_csv(processed_df)
    logger.info(f"Results exported to CSV: {csv_filename}")
    
    # Export PDF report
    model_info = model.get_model_info()
    pdf_filename = exporter.export_summary_report_pdf(processed_df, model_info, risk_counts)
    logger.info(f"Summary report exported to PDF: {pdf_filename}")
    
    # Step 9: Generate sample API requests
    logger.info("Generating sample API requests...")
    sample_student = processed_df.iloc[0].to_dict()
    api_request = {
        "student_data": {
            "student_id": sample_student['student_id'],
            "attendance_percentage": sample_student['attendance_percentage'],
            "assignment_timeliness": sample_student['assignment_timeliness'],
            "quiz_test_avg_pct": sample_student['quiz_test_avg_pct'],
            "fee_payment_status": sample_student['fee_payment_status'],
            "lms_login_count_monthly": sample_student['lms_login_count_monthly'],
            "time_spent_online_hours_week": sample_student['time_spent_online_hours_week']
        }
    }
    
    # Save API request example
    import json
    with open("sample_api_request.json", "w") as f:
        json.dump(api_request, f, indent=2)
    logger.info("Sample API request saved to sample_api_request.json")
    
    # Step 10: Display summary
    logger.info("=== DEMO SUMMARY ===")
    logger.info(f"Total students analyzed: {len(processed_df)}")
    logger.info(f"High risk students: {risk_counts['High']} ({risk_counts['High']/len(processed_df)*100:.1f}%)")
    logger.info(f"Medium risk students: {risk_counts['Medium']} ({risk_counts['Medium']/len(processed_df)*100:.1f}%)")
    logger.info(f"Low risk students: {risk_counts['Low']} ({risk_counts['Low']/len(processed_df)*100:.1f}%)")
    logger.info(f"Average dropout probability: {probabilities.mean():.1%}")
    logger.info(f"Model accuracy: {training_results['metrics']['accuracy']:.3f}")
    logger.info(f"Model F1-score: {training_results['metrics']['f1_score']:.3f}")
    
    logger.info("Demo completed successfully!")
    logger.info("Files generated:")
    logger.info("- sample_student_data.csv (original data)")
    logger.info(f"- {csv_filename} (predictions)")
    logger.info(f"- {pdf_filename} (summary report)")
    logger.info("- sample_api_request.json (API example)")

if __name__ == "__main__":
    run_demo()
