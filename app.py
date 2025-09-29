"""
Main Streamlit application for Student Dropout Predictor
"""
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import io
import base64
from typing import Dict, List, Optional, Any
import logging

# Import our modules
from data_processor import DataProcessor
from model_trainer import DropoutPredictor
from explainability import ModelExplainer
from config import REQUIRED_COLUMNS, OPTIONAL_COLUMNS, RISK_THRESHOLDS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Page configuration
st.set_page_config(
    page_title="Student Dropout Predictor",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .risk-high {
        color: #d62728;
        font-weight: bold;
    }
    .risk-medium {
        color: #ff7f0e;
        font-weight: bold;
    }
    .risk-low {
        color: #2ca02c;
        font-weight: bold;
    }
    .stButton > button {
        width: 100%;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'data_processor' not in st.session_state:
    st.session_state.data_processor = DataProcessor()
if 'model' not in st.session_state:
    st.session_state.model = DropoutPredictor()
if 'explainer' not in st.session_state:
    st.session_state.explainer = None
if 'processed_data' not in st.session_state:
    st.session_state.processed_data = None
if 'predictions' not in st.session_state:
    st.session_state.predictions = None

def main():
    """Main application function"""
    
    # Header
    st.markdown('<h1 class="main-header">🎓 Student Dropout Predictor</h1>', unsafe_allow_html=True)
    st.markdown("---")
    
    # Sidebar
    with st.sidebar:
        st.header("📊 Navigation")
        page = st.selectbox(
            "Choose a page:",
            ["📁 Data Upload", "🔍 Data Preview", "🤖 Model Training", "📈 Dashboard", "👤 Student Details", "📤 Export Results"]
        )
        
        st.markdown("---")
        st.header("⚙ Settings")
        
        # Risk threshold settings
        st.subheader("Risk Thresholds")
        high_threshold = st.slider("High Risk Threshold", 0.5, 0.9, 0.65, 0.05)
        medium_threshold = st.slider("Medium Risk Threshold", 0.2, 0.6, 0.35, 0.05)
        
        # Model settings
        st.subheader("Model Settings")
        use_hyperparameter_tuning = st.checkbox("Use Hyperparameter Tuning", value=False)
        use_smote = st.checkbox("Use SMOTE for Class Imbalance", value=True)
        
        st.markdown("---")
        st.markdown("*Privacy Notice:* By uploading data, you confirm you have the right to process this student data. The system will not share data externally.")
    
    # Main content based on selected page
    if page == "📁 Data Upload":
        data_upload_page()
    elif page == "🔍 Data Preview":
        data_preview_page()
    elif page == "🤖 Model Training":
        model_training_page(use_hyperparameter_tuning, use_smote)
    elif page == "📈 Dashboard":
        dashboard_page(high_threshold, medium_threshold)
    elif page == "👤 Student Details":
        student_details_page()
    elif page == "📤 Export Results":
        export_page()

def data_upload_page():
    """Data upload and column mapping page"""
    st.header("📁 Upload Student Data")
    
    # File upload
    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type=['csv'],
        help="Upload a CSV file containing student data"
    )
    
    if uploaded_file is not None:
        try:
            # Read the file
            df = pd.read_csv(uploaded_file)
            st.success(f"File uploaded successfully! Shape: {df.shape}")
            
            # Show column mapping interface
            st.subheader("🔗 Column Mapping")
            st.write("Map your CSV columns to the expected column names:")
            
            # Expected columns
            expected_cols = REQUIRED_COLUMNS + OPTIONAL_COLUMNS
            
            # Create mapping interface
            column_mapping = {}
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("*Your Columns:*")
                user_columns = df.columns.tolist()
                for i, col in enumerate(user_columns):
                    st.write(f"{i+1}. {col}")
            
            with col2:
                st.write("*Expected Columns:*")
                for i, col in enumerate(expected_cols):
                    st.write(f"{i+1}. {col}")
            
            # Auto-mapping
            if st.button("🔍 Auto-detect Column Mapping"):
                auto_mapping = {}
                for expected_col in expected_cols:
                    for user_col in user_columns:
                        if expected_col.lower() in user_col.lower() or user_col.lower() in expected_col.lower():
                            auto_mapping[user_col] = expected_col
                            break
                
                st.session_state.column_mapping = auto_mapping
                st.success("Auto-mapping completed!")
                st.write("Detected mapping:", auto_mapping)
            
            # Manual mapping
            st.subheader("✏ Manual Column Mapping")
            mapping_df = pd.DataFrame({
                'Your Column': user_columns,
                'Expected Column': [st.selectbox(f"Map '{col}'", [''] + expected_cols, key=f"map_{col}") for col in user_columns]
            })
            
            if st.button("💾 Save Column Mapping"):
                manual_mapping = {}
                for _, row in mapping_df.iterrows():
                    if row['Expected Column']:
                        manual_mapping[row['Your Column']] = row['Expected Column']
                
                st.session_state.column_mapping = manual_mapping
                st.success("Column mapping saved!")
            
            # Process data
            if st.button("🔄 Process Data"):
                with st.spinner("Processing data..."):
                    try:
                        processed_df, processing_info = st.session_state.data_processor.validate_and_preprocess(
                            df, st.session_state.get('column_mapping', None)
                        )
                        
                        st.session_state.processed_data = processed_df
                        st.session_state.processing_info = processing_info
                        
                        st.success("Data processed successfully!")
                        st.write("Processing Summary:")
                        st.json(processing_info)
                        
                    except Exception as e:
                        st.error(f"Error processing data: {str(e)}")
        
        except Exception as e:
            st.error(f"Error reading file: {str(e)}")
    
    # Sample data template
    st.subheader("📋 Sample Data Template")
    if st.button("📥 Download Sample Template"):
        sample_data = create_sample_data()
        csv = sample_data.to_csv(index=False)
        b64 = base64.b64encode(csv.encode()).decode()
        href = f'<a href="data:file/csv;base64,{b64}" download="sample_student_data.csv">Download Sample CSV</a>'
        st.markdown(href, unsafe_allow_html=True)

def data_preview_page():
    """Data preview and validation page"""
    st.header("🔍 Data Preview")
    
    if st.session_state.processed_data is None:
        st.warning("Please upload and process data first.")
        return
    
    df = st.session_state.processed_data
    
    # Basic info
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Students", len(df))
    with col2:
        st.metric("Features", len(df.columns))
    with col3:
        st.metric("Missing Values", df.isnull().sum().sum())
    with col4:
        st.metric("Memory Usage", f"{df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
    
    # Data preview
    st.subheader("📊 Data Preview (First 50 rows)")
    st.dataframe(df.head(50))
    
    # Summary statistics
    st.subheader("📈 Summary Statistics")
    st.dataframe(df.describe())
    
    # Missing data analysis
    if df.isnull().sum().sum() > 0:
        st.subheader("⚠ Missing Data Analysis")
        missing_data = df.isnull().sum().sort_values(ascending=False)
        missing_data = missing_data[missing_data > 0]
        
        if len(missing_data) > 0:
            fig = px.bar(
                x=missing_data.values,
                y=missing_data.index,
                orientation='h',
                title="Missing Values by Column"
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No missing values found!")

def model_training_page(use_hyperparameter_tuning, use_smote):
    """Model training page"""
    st.header("🤖 Model Training")
    
    if st.session_state.processed_data is None:
        st.warning("Please upload and process data first.")
        return
    
    df = st.session_state.processed_data
    
    # Check if model is already trained
    if st.session_state.model.is_trained:
        st.info("Model is already trained. You can retrain or use existing model.")
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🔄 Retrain Model"):
                train_model(df, use_hyperparameter_tuning, use_smote)
        with col2:
            if st.button("📊 View Model Info"):
                show_model_info()
    else:
        if st.button("🚀 Train Model"):
            train_model(df, use_hyperparameter_tuning, use_smote)
    
    # Model status
    if st.session_state.model.is_trained:
        st.subheader("📊 Model Performance")
        metrics = st.session_state.model.training_metrics
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Accuracy", f"{metrics['accuracy']:.3f}")
        with col2:
            st.metric("Precision", f"{metrics['precision']:.3f}")
        with col3:
            st.metric("Recall", f"{metrics['recall']:.3f}")
        with col4:
            st.metric("F1-Score", f"{metrics['f1_score']:.3f}")
        
        # ROC-AUC and PR-AUC
        col1, col2 = st.columns(2)
        with col1:
            st.metric("ROC-AUC", f"{metrics['roc_auc']:.3f}")
        with col2:
            st.metric("PR-AUC", f"{metrics['pr_auc']:.3f}")

def train_model(df, use_hyperparameter_tuning, use_smote):
    """Train the model"""
    with st.spinner("Training model..."):
        try:
            # Prepare training data
            X, y = st.session_state.model.prepare_training_data(df)
            
            # Train model
            training_results = st.session_state.model.train(
                X, y, 
                use_hyperparameter_tuning=use_hyperparameter_tuning,
                use_smote=use_smote
            )
            
            # Initialize explainer
            st.session_state.explainer = ModelExplainer(st.session_state.model)
            st.session_state.explainer.initialize_explainer(X)
            
            st.success("Model trained successfully!")
            st.json(training_results)
            
        except Exception as e:
            st.error(f"Error training model: {str(e)}")

def show_model_info():
    """Show model information"""
    model_info = st.session_state.model.get_model_info()
    st.json(model_info)

def dashboard_page(high_threshold, medium_threshold):
    """Main dashboard page"""
    st.header("📈 Risk Dashboard")
    
    # Debug information
    st.subheader(" Debug Information")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.write(f"Model Trained: {st.session_state.model.is_trained}")
    with col2:
        st.write(f"Data Available: {st.session_state.processed_data is not None}")
    with col3:
        st.write(f"Predictions Available: {st.session_state.predictions is not None}")
    
    # Check if we have demo data
    demo_data_available = False
    try:
        demo_df = pd.read_csv("student_dropout_predictions_20250915_060016.csv")
        if len(demo_df) > 0:
            demo_data_available = True
            st.success("✅ Demo data found! Using demo data for dashboard.")
    except:
        st.info("No demo data found. Please upload data and train model.")
    
    # Use demo data if available
    if demo_data_available and (st.session_state.processed_data is None or not st.session_state.model.is_trained):
        st.subheader("📊 Demo Dashboard (Using Sample Data)")
        
        # Calculate metrics from demo data
        total_students = len(demo_df)
        high_risk = len(demo_df[demo_df['risk_label'] == 'High'])
        medium_risk = len(demo_df[demo_df['risk_label'] == 'Medium'])
        low_risk = len(demo_df[demo_df['risk_label'] == 'Low'])
        avg_dropout_risk = demo_df['dropout_probability'].mean()
        
        # Overview metrics
        st.subheader(" Overview")
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            st.metric("Total Students", total_students)
        with col2:
            st.metric("High Risk", high_risk, delta=f"{high_risk/total_students*100:.1f}%")
        with col3:
            st.metric("Medium Risk", medium_risk, delta=f"{medium_risk/total_students*100:.1f}%")
        with col4:
            st.metric("Low Risk", low_risk, delta=f"{low_risk/total_students*100:.1f}%")
        with col5:
            st.metric("Average Dropout Risk", f"{avg_dropout_risk:.1%}", delta=f"{avg_dropout_risk:.1%}")
        
        # Risk distribution chart
        st.subheader(" Risk Distribution")
        risk_counts = {'High': high_risk, 'Medium': medium_risk, 'Low': low_risk}
        risk_df = pd.DataFrame({
            'Risk Level': list(risk_counts.keys()),
            'Count': list(risk_counts.values())
        })
        
        fig = px.pie(risk_df, values='Count', names='Risk Level', 
                     color_discrete_map={'High': '#d62728', 'Medium': '#ff7f0e', 'Low': '#2ca02c'})
        st.plotly_chart(fig, use_container_width=True)
        
        # High-risk students table
        st.subheader("⚠ High-Risk Students (Demo Data)")
        high_risk_demo = demo_df[demo_df['risk_label'] == 'High'].head(10)
        if len(high_risk_demo) > 0:
            display_cols = ['student_id', 'student_name', 'dropout_probability', 'attendance_percentage', 'quiz_test_avg_pct']
            st.dataframe(high_risk_demo[display_cols], use_container_width=True)
        else:
            st.info("No high-risk students found in demo data!")
        
        return
    
    # Original dashboard logic for when model is trained and data is available
    if not st.session_state.model.is_trained:
        st.warning("Please train the model first.")
        return
    
    if st.session_state.processed_data is None:
        st.warning("Please upload and process data first.")
        return
    
    # Make predictions
    if st.session_state.predictions is None:
        with st.spinner("Making predictions..."):
            X = st.session_state.data_processor.prepare_features(st.session_state.processed_data)
            predictions, probabilities, risk_labels = st.session_state.model.predict(X)
            
            st.session_state.predictions = {
                'predictions': predictions,
                'probabilities': probabilities,
                'risk_labels': risk_labels
            }
    
    # Update risk thresholds
    risk_counts = {
        'High': sum(1 for label in st.session_state.predictions['risk_labels'] if label == 'High'),
        'Medium': sum(1 for label in st.session_state.predictions['risk_labels'] if label == 'Medium'),
        'Low': sum(1 for label in st.session_state.predictions['risk_labels'] if label == 'Low')
    }
    
    # Overview metrics
    st.subheader(" Overview")
    
    # Calculate average dropout risk
    # If probabilities is a 2D array, take only dropout class (1)
    probabilities = st.session_state.predictions['probabilities']
    if probabilities.ndim > 1:
        avg_dropout_risk = np.mean(probabilities[:, 1])
    else:
        avg_dropout_risk = np.mean(probabilities)

    
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric("Total Students", len(st.session_state.predictions['risk_labels']))
    with col2:
        st.metric("High Risk", risk_counts['High'], delta=f"{risk_counts['High']/len(st.session_state.predictions['risk_labels'])*100:.1f}%")
    with col3:
        st.metric("Medium Risk", risk_counts['Medium'], delta=f"{risk_counts['Medium']/len(st.session_state.predictions['risk_labels'])*100:.1f}%")
    with col4:
        st.metric("Low Risk", risk_counts['Low'], delta=f"{risk_counts['Low']/len(st.session_state.predictions['risk_labels'])*100:.1f}%")
    with col5:
        st.metric("Average Dropout Risk", f"{avg_dropout_risk:.1%}", delta=f"{avg_dropout_risk:.1%}")
    
    # Risk distribution chart
    st.subheader("📊 Risk Distribution")
    risk_df = pd.DataFrame({
        'Risk Level': list(risk_counts.keys()),
        'Count': list(risk_counts.values())
    })
    
    fig = px.pie(risk_df, values='Count', names='Risk Level', 
                 color_discrete_map={'High': '#d62728', 'Medium': '#ff7f0e', 'Low': '#2ca02c'})
    st.plotly_chart(fig, use_container_width=True)
    
    # Feature importance
    if st.session_state.explainer:
        st.subheader("🔍 Feature Importance")
        X = st.session_state.data_processor.prepare_features(st.session_state.processed_data)
        importance_fig = st.session_state.explainer.get_feature_importance_plot(X)
        st.plotly_chart(importance_fig, use_container_width=True)
    
    # High-risk students table
    st.subheader("⚠ High-Risk Students")
    high_risk_data = []
    df = st.session_state.processed_data
    
    for i, (idx, row) in enumerate(df.iterrows()):
        if st.session_state.predictions['risk_labels'][i] == 'High':
            high_risk_data.append({
                'Student ID': row.get('student_id', f'Student_{i}'),
                'Name': row.get('student_name', 'N/A'),
                'Risk Probability': f"{st.session_state.predictions['probabilities'][i]:.1%}",
                'Attendance': f"{row.get('attendance_percentage', 'N/A')}%",
                'Performance': f"{row.get('quiz_test_avg_pct', 'N/A')}%",
                'Payment Status': 'Paid' if row.get('fee_payment_status', 0) == 1 else 'Issues'
            })
    
    if high_risk_data:
        high_risk_df = pd.DataFrame(high_risk_data)
        st.dataframe(high_risk_df, use_container_width=True)
    else:
        st.info("No high-risk students found!")

def student_details_page():
    """Individual student details page"""
    st.header("👤 Student Details")
    
    if not st.session_state.model.is_trained or st.session_state.predictions is None:
        st.warning("Please train the model and make predictions first.")
        return
    
    # Student selection
    df = st.session_state.processed_data
    student_options = [f"Student {i} (ID: {df.iloc[i].get('student_id', 'N/A')})" for i in range(len(df))]
    
    selected_student = st.selectbox("Select a student:", student_options)
    student_index = student_options.index(selected_student)
    
    # Student information
    st.subheader("📋 Student Information")
    student_data = df.iloc[student_index]
    
    col1, col2 = st.columns(2)
    with col1:
        st.write(f"*Student ID:* {student_data.get('student_id', 'N/A')}")
        st.write(f"*Name:* {student_data.get('student_name', 'N/A')}")
        st.write(f"*Age:* {student_data.get('age', 'N/A')}")
        st.write(f"*Gender:* {student_data.get('gender', 'N/A')}")
    
    with col2:
        st.write(f"*Attendance:* {student_data.get('attendance_percentage', 'N/A')}%")
        st.write(f"*Performance:* {student_data.get('quiz_test_avg_pct', 'N/A')}%")
        st.write(f"*Payment Status:* {'Paid' if student_data.get('fee_payment_status', 0) == 1 else 'Issues'}")
        st.write(f"*LMS Logins:* {student_data.get('lms_login_count_monthly', 'N/A')}")
    
    # Risk assessment
    st.subheader("⚠ Risk Assessment")
    probability = st.session_state.predictions['probabilities'][student_index]
    risk_label = st.session_state.predictions['risk_labels'][student_index]
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Dropout Probability", f"{probability:.1%}")
    with col2:
        risk_color = {'High': 'risk-high', 'Medium': 'risk-medium', 'Low': 'risk-low'}
        st.markdown(f"*Risk Level:* <span class='{risk_color[risk_label]}'>{risk_label}</span>", unsafe_allow_html=True)
    
    # SHAP explanation
    if st.session_state.explainer:
        st.subheader("🔍 Risk Explanation")
        X = st.session_state.data_processor.prepare_features(df)
        
        # Human-readable explanation
        explanation_text = st.session_state.explainer.generate_human_readable_explanation(X, student_index)
        st.text(explanation_text)
        
        # Waterfall plot
        waterfall_fig = st.session_state.explainer.get_waterfall_plot(X, student_index)
        st.plotly_chart(waterfall_fig, use_container_width=True)
        
        # Intervention recommendations
        st.subheader("💡 Intervention Recommendations")
        recommendations = st.session_state.explainer.get_intervention_recommendations(X, student_index)
        
        if recommendations:
            for i, rec in enumerate(recommendations, 1):
                with st.expander(f"{i}. {rec['factor']} (Priority: {rec['priority']})"):
                    st.write(f"*Current Value:* {rec['current_value']}")
                    st.write(f"*Recommendation:* {rec['recommendation']}")
        else:
            st.info("No specific intervention recommendations for this student.")

def export_page():
    """Export results page"""
    st.header("📤 Export Results")
    
    if st.session_state.predictions is None:
        st.warning("Please make predictions first.")
        return
    
    # Prepare export data
    df = st.session_state.processed_data.copy()
    df['dropout_probability'] = st.session_state.predictions['probabilities']
    df['risk_label'] = st.session_state.predictions['risk_labels']
    
    # Add SHAP values if available
    if st.session_state.explainer:
        X = st.session_state.data_processor.prepare_features(st.session_state.processed_data)
        global_explanation = st.session_state.explainer.explain_global(X)
        shap_values = np.array(global_explanation['shap_values'])
        
        # Add top 3 feature contributions
        for i in range(min(3, len(st.session_state.model.feature_columns))):
            df[f'top_feature_{i+1}'] = [st.session_state.model.feature_columns[i] for _ in range(len(df))]
            df[f'shap_value_{i+1}'] = shap_values[:, i]
    
    # Export options
    st.subheader("📊 Export Options")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📥 Download CSV"):
            csv = df.to_csv(index=False)
            b64 = base64.b64encode(csv.encode()).decode()
            href = f'<a href="data:file/csv;base64,{b64}" download="student_dropout_predictions.csv">Download CSV</a>'
            st.markdown(href, unsafe_allow_html=True)
    
    with col2:
        if st.button("📊 Download Summary Report"):
            # Create summary report
            summary_data = {
                'Total Students': len(df),
                'High Risk Count': sum(1 for label in df['risk_label'] if label == 'High'),
                'Medium Risk Count': sum(1 for label in df['risk_label'] if label == 'Medium'),
                'Low Risk Count': sum(1 for label in df['risk_label'] if label == 'Low'),
                'Average Dropout Probability': df['dropout_probability'].mean(),
                'Model Version': st.session_state.model.model_version
            }
            
            summary_df = pd.DataFrame(list(summary_data.items()), columns=['Metric', 'Value'])
            csv = summary_df.to_csv(index=False)
            b64 = base64.b64encode(csv.encode()).decode()
            href = f'<a href="data:file/csv;base64,{b64}" download="summary_report.csv">Download Summary</a>'
            st.markdown(href, unsafe_allow_html=True)
    
    # Preview export data
    st.subheader("👀 Export Preview")
    st.dataframe(df.head(20), use_container_width=True)

def create_sample_data():
    """Create sample data for template"""
    np.random.seed(42)
    n_students = 100
    
    data = {
        'student_id': [f'STU_{i:04d}' for i in range(1, n_students + 1)],
        'student_name': [f'Student {i}' for i in range(1, n_students + 1)],
        'attendance_percentage': np.random.normal(75, 15, n_students).clip(0, 100),
        'assignment_timeliness': np.random.normal(70, 20, n_students).clip(0, 100),
        'quiz_test_avg_pct': np.random.normal(65, 18, n_students).clip(0, 100),
        'fee_payment_status': np.random.choice(['Paid', 'Partial', 'Unpaid'], n_students, p=[0.6, 0.25, 0.15]),
        'lms_login_count_monthly': np.random.poisson(15, n_students),
        'time_spent_online_hours_week': np.random.normal(8, 3, n_students).clip(0, 20),
        'age': np.random.randint(18, 25, n_students),
        'gender': np.random.choice(['Male', 'Female', 'Other'], n_students, p=[0.5, 0.45, 0.05]),
        'socioeconomic_status': np.random.randint(1, 6, n_students)
    }
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    main()