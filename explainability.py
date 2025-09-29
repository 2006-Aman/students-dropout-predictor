"""
SHAP explainability module for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
import shap
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from typing import Dict, List, Tuple, Optional, Any
import logging
from model_trainer import DropoutPredictor

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelExplainer:
    """Handles SHAP explainability for the dropout prediction model"""
    
    def __init__(self, model: DropoutPredictor):
        self.model = model
        self.explainer = None
        self.shap_values = None
        self.expected_value = None
        
    def initialize_explainer(self, X_background: pd.DataFrame):
        """
        Initialize SHAP explainer with background data
        
        Args:
            X_background: Background dataset for SHAP explainer
        """
        if not self.model.is_trained:
            raise ValueError("Model must be trained before initializing explainer")
        
        # Use TreeExplainer for XGBoost
        self.explainer = shap.TreeExplainer(self.model.model)
        
        # Calculate expected value
        self.expected_value = self.explainer.expected_value
        
        logger.info("SHAP explainer initialized")
    
    def explain_global(self, X: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate global feature importance explanations
        
        Args:
            X: Feature matrix to explain
            
        Returns:
            Dictionary containing global explanations
        """
        if self.explainer is None:
            raise ValueError("Explainer not initialized. Call initialize_explainer first.")
        
        # Calculate SHAP values
        shap_values = self.explainer.shap_values(X)
        
        # Global feature importance (mean absolute SHAP values)
        feature_importance = pd.DataFrame({
            'feature': self.model.feature_columns,
            'importance': np.abs(shap_values).mean(axis=0)
        }).sort_values('importance', ascending=False)
        
        # Feature impact direction
        feature_impact = pd.DataFrame({
            'feature': self.model.feature_columns,
            'positive_impact': (shap_values > 0).mean(axis=0),
            'negative_impact': (shap_values < 0).mean(axis=0)
        })
        
        return {
            'feature_importance': feature_importance.to_dict('records'),
            'feature_impact': feature_impact.to_dict('records'),
            'shap_values': shap_values.tolist(),
            'expected_value': self.expected_value
        }
    
    def explain_local(self, X: pd.DataFrame, student_indices: Optional[List[int]] = None) -> Dict[str, Any]:
        """
        Generate local explanations for specific students
        
        Args:
            X: Feature matrix
            student_indices: List of student indices to explain (if None, explain all)
            
        Returns:
            Dictionary containing local explanations
        """
        if self.explainer is None:
            raise ValueError("Explainer not initialized. Call initialize_explainer first.")
        
        if student_indices is None:
            student_indices = list(range(len(X)))
        
        # Calculate SHAP values for selected students
        X_selected = X.iloc[student_indices]
        shap_values = self.explainer.shap_values(X_selected)
        
        local_explanations = []
        
        for i, student_idx in enumerate(student_indices):
            # Get top contributing features for this student
            student_shap = shap_values[i]
            feature_contributions = pd.DataFrame({
                'feature': self.model.feature_columns,
                'shap_value': student_shap,
                'abs_shap_value': np.abs(student_shap)
            }).sort_values('abs_shap_value', ascending=False)
            
            # Get top 3 contributing features
            top_features = feature_contributions.head(3)
            
            # Calculate prediction
            prediction = self.model.model.predict(X_selected.iloc[[i]])[0]
            probability = self.model.model.predict_proba(X_selected.iloc[[i]])[0][1]
            
            # Determine risk level
            if probability >= 0.65:
                risk_level = 'High'
            elif probability >= 0.35:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
            
            explanation = {
                'student_index': student_idx,
                'prediction': int(prediction),
                'probability': float(probability),
                'risk_level': risk_level,
                'top_features': top_features.to_dict('records'),
                'shap_values': student_shap.tolist(),
                'feature_values': X_selected.iloc[i].to_dict(),
                'expected_value': self.expected_value   # 👈 yeh line add karo

            }
            
            local_explanations.append(explanation)
        
        return {
            'explanations': local_explanations,
            'expected_value': self.expected_value
        }
    
    def get_feature_importance_plot(self, X: pd.DataFrame) -> go.Figure:
        """Create interactive feature importance plot"""
        global_explanation = self.explain_global(X)
        
        feature_importance = global_explanation['feature_importance']
        
        fig = go.Figure(data=[
            go.Bar(
                x=[item['importance'] for item in feature_importance],
                y=[item['feature'] for item in feature_importance],
                orientation='h',
                marker_color='lightblue',
                text=[f"{item['importance']:.3f}" for item in feature_importance],
                textposition='auto'
            )
        ])
        
        fig.update_layout(
            title="Global Feature Importance (SHAP Values)",
            xaxis_title="Mean |SHAP Value|",
            yaxis_title="Features",
            height=600,
            showlegend=False
        )
        
        return fig
    
    def get_waterfall_plot(self, X: pd.DataFrame, student_index: int) -> go.Figure:
        """Create waterfall plot for individual student explanation"""
        local_explanation = self.explain_local(X, [student_index])
        explanation = local_explanation['explanations'][0]
        
        # Prepare data for waterfall plot
        features = explanation['top_features']
        shap_values = [item['shap_value'] for item in features]
        feature_names = [item['feature'] for item in features]
        
        # Add base value and final prediction
# Safe access
        base_value = explanation.get('expected_value', self.expected_value)
        final_value = base_value + sum(shap_values)
        
        # Create waterfall data
        x_data = ['Base'] + feature_names + ['Prediction']
        y_data = [base_value] + shap_values + [final_value - base_value - sum(shap_values)]
        
        fig = go.Figure(go.Waterfall(
            name="SHAP Values",
            orientation="v",
            measure=["absolute"] + ["relative"] * len(features) + ["total"],
            x=x_data,
            y=y_data,
            connector={"line": {"color": "rgb(63, 63, 63)"}},
        ))
        
        fig.update_layout(
            title=f"Student {student_index} - Dropout Risk Explanation",
            yaxis_title="SHAP Value",
            height=500
        )
        
        return fig
    
    def get_summary_plot_data(self, X: pd.DataFrame) -> Dict[str, Any]:
        """Get data for SHAP summary plot"""
        if self.explainer is None:
            raise ValueError("Explainer not initialized")
        
        shap_values = self.explainer.shap_values(X)
        
        return {
            'shap_values': shap_values.tolist(),
            'feature_values': X.values.tolist(),
            'feature_names': self.model.feature_columns,
            'expected_value': self.expected_value
        }
    
    def generate_human_readable_explanation(self, X: pd.DataFrame, student_index: int) -> str:
        """Generate human-readable explanation for a student"""
        local_explanation = self.explain_local(X, [student_index])
        explanation = local_explanation['explanations'][0]
        
        student_data = explanation['feature_values']
        top_features = explanation['top_features']
        probability = explanation['probability']
        risk_level = explanation['risk_level']
        
        # Create human-readable explanation
        explanation_text = f"Student Risk Assessment:\n"
        explanation_text += f"Risk Level: {risk_level} (Probability: {probability:.1%})\n\n"
        explanation_text += f"Key Risk Factors:\n"
        
        for i, feature in enumerate(top_features, 1):
            feature_name = feature['feature']
            shap_value = feature['shap_value']
            feature_value = student_data.get(feature_name, 'N/A')
            
            # Determine impact direction
            if shap_value > 0:
                impact = "increases"
                direction = "higher"
            else:
                impact = "decreases"
                direction = "lower"
            
            # Format feature value for display
            if isinstance(feature_value, (int, float)):
                if 'percentage' in feature_name.lower() or 'pct' in feature_name.lower():
                    feature_value = f"{feature_value:.1f}%"
                else:
                    feature_value = f"{feature_value:.1f}"
            
            explanation_text += f"{i}. {feature_name.replace('_', ' ').title()}: {feature_value} "
            explanation_text += f"({impact} dropout risk by {abs(shap_value):.1%})\n"
        
        return explanation_text
    
    def get_intervention_recommendations(self, X: pd.DataFrame, student_index: int) -> List[Dict[str, str]]:
        """Generate intervention recommendations based on SHAP values"""
        local_explanation = self.explain_local(X, [student_index])
        explanation = local_explanation['explanations'][0]
        
        recommendations = []
        student_data = explanation['feature_values']
        
        # Check specific risk factors and recommend interventions
        if 'attendance_percentage' in student_data and student_data['attendance_percentage'] < 70:
            recommendations.append({
                'factor': 'Low Attendance',
                'current_value': f"{student_data['attendance_percentage']:.1f}%",
                'recommendation': 'Schedule counseling session and implement attendance tracking',
                'priority': 'High'
            })
        
        if 'fee_payment_status' in student_data and student_data['fee_payment_status'] < 1:
            recommendations.append({
                'factor': 'Payment Issues',
                'current_value': 'Unpaid/Partial',
                'recommendation': 'Connect with financial aid office and explore payment plans',
                'priority': 'High'
            })
        
        if 'quiz_test_avg_pct' in student_data and student_data['quiz_test_avg_pct'] < 60:
            recommendations.append({
                'factor': 'Poor Academic Performance',
                'current_value': f"{student_data['quiz_test_avg_pct']:.1f}%",
                'recommendation': 'Arrange tutoring and study groups',
                'priority': 'Medium'
            })
        
        if 'lms_login_count_monthly' in student_data and student_data['lms_login_count_monthly'] < 5:
            recommendations.append({
                'factor': 'Low Online Engagement',
                'current_value': f"{student_data['lms_login_count_monthly']} logins",
                'recommendation': 'Provide additional learning resources and one-on-one support',
                'priority': 'Medium'
            })
        
        return recommendations
