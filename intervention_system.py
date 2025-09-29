"""
Intervention recommendation system for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
import logging
from datetime import datetime, timedelta
from config import INTERVENTION_TEMPLATES

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InterventionRecommender:
    """Handles intervention recommendations based on student risk factors"""
    
    def __init__(self):
        self.intervention_templates = INTERVENTION_TEMPLATES
        self.custom_interventions = {}
        self.intervention_history = []
        
    def analyze_student_risk_factors(self, student_data: Dict, shap_values: List[float], 
                                   feature_names: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze student risk factors and generate intervention recommendations
        
        Args:
            student_data: Student information dictionary
            shap_values: SHAP values for feature contributions
            feature_names: List of feature names
            
        Returns:
            List of intervention recommendations
        """
        recommendations = []
        
        # Create feature impact mapping
        feature_impacts = dict(zip(feature_names, shap_values))
        
        # Analyze each risk factor
        recommendations.extend(self._analyze_attendance_risk(student_data, feature_impacts))
        recommendations.extend(self._analyze_academic_performance_risk(student_data, feature_impacts))
        recommendations.extend(self._analyze_financial_risk(student_data, feature_impacts))
        recommendations.extend(self._analyze_engagement_risk(student_data, feature_impacts))
        recommendations.extend(self._analyze_behavioral_risk(student_data, feature_impacts))
        
        # Sort by priority and impact
        recommendations.sort(key=lambda x: (x['priority_score'], x['impact_score']), reverse=True)
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _analyze_attendance_risk(self, student_data: Dict, feature_impacts: Dict) -> List[Dict]:
        """Analyze attendance-related risk factors"""
        recommendations = []
        
        attendance = student_data.get('attendance_percentage', 100)
        attendance_impact = feature_impacts.get('attendance_percentage', 0)
        
        if attendance < 70 or attendance_impact < -0.1:
            recommendations.append({
                'factor': 'Low Attendance',
                'current_value': f"{attendance:.1f}%",
                'target_value': ">80%",
                'recommendation': 'Schedule counseling session and implement attendance tracking',
                'priority': 'High',
                'priority_score': 9,
                'impact_score': abs(attendance_impact),
                'intervention_type': 'academic_support',
                'timeline': '1-2 weeks',
                'resources_needed': ['Counselor', 'Attendance tracking system'],
                'success_metrics': ['Attendance improvement', 'Engagement increase']
            })
        
        return recommendations
    
    def _analyze_academic_performance_risk(self, student_data: Dict, feature_impacts: Dict) -> List[Dict]:
        """Analyze academic performance risk factors"""
        recommendations = []
        
        # Quiz/test performance
        quiz_performance = student_data.get('quiz_test_avg_pct', 100)
        quiz_impact = feature_impacts.get('quiz_test_avg_pct', 0)
        
        if quiz_performance < 60 or quiz_impact < -0.1:
            recommendations.append({
                'factor': 'Poor Academic Performance',
                'current_value': f"{quiz_performance:.1f}%",
                'target_value': ">70%",
                'recommendation': 'Arrange tutoring and study groups',
                'priority': 'High',
                'priority_score': 8,
                'impact_score': abs(quiz_impact),
                'intervention_type': 'academic_support',
                'timeline': '2-4 weeks',
                'resources_needed': ['Tutor', 'Study materials', 'Study group facilitator'],
                'success_metrics': ['Grade improvement', 'Assignment completion']
            })
        
        # Assignment timeliness
        assignment_timeliness = student_data.get('assignment_timeliness', 100)
        assignment_impact = feature_impacts.get('assignment_timeliness', 0)
        
        if assignment_timeliness < 50 or assignment_impact < -0.1:
            recommendations.append({
                'factor': 'Assignment Delays',
                'current_value': f"{assignment_timeliness:.1f}%",
                'target_value': ">80%",
                'recommendation': 'Implement time management training and deadline reminders',
                'priority': 'Medium',
                'priority_score': 6,
                'impact_score': abs(assignment_impact),
                'intervention_type': 'time_management',
                'timeline': '1-3 weeks',
                'resources_needed': ['Time management coach', 'Reminder system'],
                'success_metrics': ['On-time submission rate', 'Stress reduction']
            })
        
        return recommendations
    
    def _analyze_financial_risk(self, student_data: Dict, feature_impacts: Dict) -> List[Dict]:
        """Analyze financial risk factors"""
        recommendations = []
        
        payment_status = student_data.get('fee_payment_status', 1)
        payment_impact = feature_impacts.get('fee_payment_status', 0)
        
        if payment_status < 1 or payment_impact < -0.1:
            recommendations.append({
                'factor': 'Financial Issues',
                'current_value': 'Unpaid/Partial' if payment_status < 1 else 'Paid',
                'target_value': 'Fully Paid',
                'recommendation': 'Connect with financial aid office and explore payment plans',
                'priority': 'High',
                'priority_score': 9,
                'impact_score': abs(payment_impact),
                'intervention_type': 'financial_support',
                'timeline': '1-2 weeks',
                'resources_needed': ['Financial aid counselor', 'Payment plan options'],
                'success_metrics': ['Payment completion', 'Financial stress reduction']
            })
        
        return recommendations
    
    def _analyze_engagement_risk(self, student_data: Dict, feature_impacts: Dict) -> List[Dict]:
        """Analyze engagement risk factors"""
        recommendations = []
        
        # LMS login frequency
        lms_logins = student_data.get('lms_login_count_monthly', 0)
        lms_impact = feature_impacts.get('lms_login_count_monthly', 0)
        
        if lms_logins < 5 or lms_impact < -0.05:
            recommendations.append({
                'factor': 'Low Online Engagement',
                'current_value': f"{lms_logins} logins/month",
                'target_value': ">15 logins/month",
                'recommendation': 'Provide additional learning resources and one-on-one support',
                'priority': 'Medium',
                'priority_score': 5,
                'impact_score': abs(lms_impact),
                'intervention_type': 'engagement_support',
                'timeline': '2-3 weeks',
                'resources_needed': ['Online learning specialist', 'Engaging content'],
                'success_metrics': ['Login frequency', 'Content interaction']
            })
        
        # Time spent online
        online_time = student_data.get('time_spent_online_hours_week', 0)
        online_impact = feature_impacts.get('time_spent_online_hours_week', 0)
        
        if online_time < 3 or online_impact < -0.05:
            recommendations.append({
                'factor': 'Low Online Activity',
                'current_value': f"{online_time:.1f} hours/week",
                'target_value': ">8 hours/week",
                'recommendation': 'Provide internet access support and digital literacy training',
                'priority': 'Medium',
                'priority_score': 4,
                'impact_score': abs(online_impact),
                'intervention_type': 'technology_support',
                'timeline': '1-2 weeks',
                'resources_needed': ['Internet access', 'Digital literacy trainer'],
                'success_metrics': ['Online activity time', 'Digital skills improvement']
            })
        
        return recommendations
    
    def _analyze_behavioral_risk(self, student_data: Dict, feature_impacts: Dict) -> List[Dict]:
        """Analyze behavioral risk factors"""
        recommendations = []
        
        # Socioeconomic status
        socioeconomic_status = student_data.get('socioeconomic_status', 3)
        ses_impact = feature_impacts.get('socioeconomic_status', 0)
        
        if socioeconomic_status < 2 or ses_impact < -0.05:
            recommendations.append({
                'factor': 'Socioeconomic Challenges',
                'current_value': f"Level {socioeconomic_status}",
                'target_value': 'Improved support',
                'recommendation': 'Provide comprehensive support services and mentorship',
                'priority': 'High',
                'priority_score': 7,
                'impact_score': abs(ses_impact),
                'intervention_type': 'comprehensive_support',
                'timeline': '4-6 weeks',
                'resources_needed': ['Mentor', 'Support services coordinator', 'Community resources'],
                'success_metrics': ['Overall well-being', 'Academic persistence']
            })
        
        return recommendations
    
    def generate_intervention_plan(self, student_id: str, recommendations: List[Dict]) -> Dict[str, Any]:
        """
        Generate a comprehensive intervention plan for a student
        
        Args:
            student_id: Student identifier
            recommendations: List of intervention recommendations
            
        Returns:
            Comprehensive intervention plan
        """
        plan = {
            'student_id': student_id,
            'created_date': datetime.now().isoformat(),
            'total_recommendations': len(recommendations),
            'high_priority_count': sum(1 for r in recommendations if r['priority'] == 'High'),
            'medium_priority_count': sum(1 for r in recommendations if r['priority'] == 'Medium'),
            'low_priority_count': sum(1 for r in recommendations if r['priority'] == 'Low'),
            'recommendations': recommendations,
            'timeline': self._calculate_plan_timeline(recommendations),
            'resource_requirements': self._calculate_resource_requirements(recommendations),
            'success_metrics': self._define_success_metrics(recommendations)
        }
        
        return plan
    
    def _calculate_plan_timeline(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Calculate overall timeline for intervention plan"""
        if not recommendations:
            return {'total_duration': '0 weeks', 'phases': []}
        
        # Group by timeline
        timeline_groups = {}
        for rec in recommendations:
            timeline = rec.get('timeline', '1-2 weeks')
            if timeline not in timeline_groups:
                timeline_groups[timeline] = []
            timeline_groups[timeline].append(rec['factor'])
        
        phases = []
        for timeline, factors in timeline_groups.items():
            phases.append({
                'timeline': timeline,
                'factors': factors,
                'count': len(factors)
            })
        
        # Calculate total duration (use maximum timeline)
        max_weeks = 0
        for timeline in timeline_groups.keys():
            if '-' in timeline:
                weeks = int(timeline.split('-')[1].split()[0])
                max_weeks = max(max_weeks, weeks)
            else:
                weeks = int(timeline.split()[0])
                max_weeks = max(max_weeks, weeks)
        
        return {
            'total_duration': f"{max_weeks} weeks",
            'phases': phases
        }
    
    def _calculate_resource_requirements(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Calculate resource requirements for intervention plan"""
        all_resources = []
        for rec in recommendations:
            all_resources.extend(rec.get('resources_needed', []))
        
        # Count resource frequency
        resource_counts = {}
        for resource in all_resources:
            resource_counts[resource] = resource_counts.get(resource, 0) + 1
        
        # Categorize resources
        human_resources = [r for r in resource_counts.keys() if any(word in r.lower() for word in ['counselor', 'tutor', 'coach', 'specialist', 'mentor'])]
        system_resources = [r for r in resource_counts.keys() if any(word in r.lower() for word in ['system', 'access', 'materials', 'content'])]
        other_resources = [r for r in resource_counts.keys() if r not in human_resources and r not in system_resources]
        
        return {
            'human_resources': {r: resource_counts[r] for r in human_resources},
            'system_resources': {r: resource_counts[r] for r in system_resources},
            'other_resources': {r: resource_counts[r] for r in other_resources},
            'total_unique_resources': len(resource_counts)
        }
    
    def _define_success_metrics(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Define success metrics for intervention plan"""
        all_metrics = []
        for rec in recommendations:
            all_metrics.extend(rec.get('success_metrics', []))
        
        # Count metric frequency
        metric_counts = {}
        for metric in all_metrics:
            metric_counts[metric] = metric_counts.get(metric, 0) + 1
        
        return {
            'primary_metrics': [m for m, c in metric_counts.items() if c >= 2],
            'secondary_metrics': [m for m, c in metric_counts.items() if c == 1],
            'total_metrics': len(metric_counts)
        }
    
    def add_custom_intervention(self, student_id: str, intervention: Dict[str, Any]):
        """Add custom intervention for a specific student"""
        if student_id not in self.custom_interventions:
            self.custom_interventions[student_id] = []
        
        intervention['created_date'] = datetime.now().isoformat()
        intervention['type'] = 'custom'
        self.custom_interventions[student_id].append(intervention)
        
        logger.info(f"Added custom intervention for student {student_id}")
    
    def get_intervention_history(self, student_id: str) -> List[Dict[str, Any]]:
        """Get intervention history for a student"""
        return self.custom_interventions.get(student_id, [])
    
    def track_intervention_outcome(self, student_id: str, intervention_id: str, 
                                 outcome: Dict[str, Any]):
        """Track the outcome of an intervention"""
        outcome_record = {
            'student_id': student_id,
            'intervention_id': intervention_id,
            'outcome': outcome,
            'tracked_date': datetime.now().isoformat()
        }
        
        self.intervention_history.append(outcome_record)
        logger.info(f"Tracked intervention outcome for student {student_id}")
    
    def generate_intervention_report(self, student_id: str) -> Dict[str, Any]:
        """Generate a comprehensive intervention report for a student"""
        custom_interventions = self.get_intervention_history(student_id)
        tracked_outcomes = [h for h in self.intervention_history if h['student_id'] == student_id]
        
        return {
            'student_id': student_id,
            'report_date': datetime.now().isoformat(),
            'custom_interventions': custom_interventions,
            'tracked_outcomes': tracked_outcomes,
            'total_interventions': len(custom_interventions),
            'total_outcomes': len(tracked_outcomes),
            'success_rate': self._calculate_success_rate(tracked_outcomes)
        }
    
    def _calculate_success_rate(self, outcomes: List[Dict]) -> float:
        """Calculate success rate from tracked outcomes"""
        if not outcomes:
            return 0.0
        
        successful_outcomes = sum(1 for outcome in outcomes 
                                if outcome['outcome'].get('success', False))
        return successful_outcomes / len(outcomes)
    
    def get_intervention_statistics(self) -> Dict[str, Any]:
        """Get overall intervention statistics"""
        total_interventions = sum(len(interventions) for interventions in self.custom_interventions.values())
        total_outcomes = len(self.intervention_history)
        
        # Calculate success rate
        successful_outcomes = sum(1 for outcome in self.intervention_history 
                                if outcome['outcome'].get('success', False))
        success_rate = successful_outcomes / total_outcomes if total_outcomes > 0 else 0.0
        
        # Calculate intervention types
        intervention_types = {}
        for interventions in self.custom_interventions.values():
            for intervention in interventions:
                intervention_type = intervention.get('intervention_type', 'unknown')
                intervention_types[intervention_type] = intervention_types.get(intervention_type, 0) + 1
        
        return {
            'total_interventions': total_interventions,
            'total_outcomes': total_outcomes,
            'success_rate': success_rate,
            'intervention_types': intervention_types,
            'students_with_interventions': len(self.custom_interventions)
        }
