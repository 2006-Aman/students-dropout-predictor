"""
Export utilities for Student Dropout Predictor
"""
import pandas as pd
import numpy as np
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime
import os


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ReportExporter:
    """Handles export functionality for reports and data"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom styles for PDF reports"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1,  # Center alignment
            textColor=colors.darkblue
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.darkblue
        ))
        
        # Risk style
        self.styles.add(ParagraphStyle(
            name='RiskHigh',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.red,
            fontName='Helvetica-Bold'
        ))
        
        self.styles.add(ParagraphStyle(
            name='RiskMedium',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.orange,
            fontName='Helvetica-Bold'
        ))
        
        self.styles.add(ParagraphStyle(
            name='RiskLow',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.green,
            fontName='Helvetica-Bold'
        ))
    
    def export_to_csv(self, df: pd.DataFrame, filename: str = None) -> str:
        """
        Export dataframe to CSV
        
        Args:
            df: Dataframe to export
            filename: Optional filename
            
        Returns:
            Path to exported file
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"student_dropout_predictions_{timestamp}.csv"
        
        # Ensure filename has .csv extension
        if not filename.endswith('.csv'):
            filename += '.csv'
        
        # Export to CSV
        df.to_csv(filename, index=False)
        logger.info(f"Data exported to CSV: {filename}")
        
        return filename
    
    def export_summary_report_pdf(self, 
                                df: pd.DataFrame, 
                                model_info: Dict,
                                risk_counts: Dict,
                                filename: str = None) -> str:
        """
        Export summary report to PDF
        
        Args:
            df: Dataframe with predictions
            model_info: Model information
            risk_counts: Risk level counts
            filename: Optional filename
            
        Returns:
            Path to exported PDF
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"dropout_summary_report_{timestamp}.pdf"
        
        # Ensure filename has .pdf extension
        if not filename.endswith('.pdf'):
            filename += '.pdf'
        
        # Create PDF document
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        
        # Title
        title = Paragraph("Student Dropout Prediction Report", self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Report metadata
        report_date = datetime.now().strftime("%B %d, %Y")
        metadata = f"Generated on: {report_date}<br/>Model Version: {model_info.get('model_version', 'N/A')}"
        story.append(Paragraph(metadata, self.styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.styles['CustomSubtitle']))
        
        total_students = len(df)
        high_risk_pct = (risk_counts['High'] / total_students) * 100
        avg_probability = df['dropout_probability'].mean()
        
        summary_text = f"""
        This report analyzes {total_students} students for dropout risk using machine learning.
        <br/><br/>
        <b>Key Findings:</b><br/>
        • {risk_counts['High']} students ({high_risk_pct:.1f}%) are at HIGH risk of dropping out<br/>
        • {risk_counts['Medium']} students ({(risk_counts['Medium']/total_students)*100:.1f}%) are at MEDIUM risk<br/>
        • {risk_counts['Low']} students ({(risk_counts['Low']/total_students)*100:.1f}%) are at LOW risk<br/>
        • Average dropout probability: {avg_probability:.1%}<br/>
        """
        
        story.append(Paragraph(summary_text, self.styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Risk Distribution Table
        story.append(Paragraph("Risk Distribution", self.styles['CustomSubtitle']))
        
        risk_data = [
            ['Risk Level', 'Count', 'Percentage'],
            ['High Risk', str(risk_counts['High']), f"{(risk_counts['High']/total_students)*100:.1f}%"],
            ['Medium Risk', str(risk_counts['Medium']), f"{(risk_counts['Medium']/total_students)*100:.1f}%"],
            ['Low Risk', str(risk_counts['Low']), f"{(risk_counts['Low']/total_students)*100:.1f}%"],
            ['Total', str(total_students), '100.0%']
        ]
        
        risk_table = Table(risk_data)
        risk_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(risk_table)
        story.append(Spacer(1, 20))
        
        # Model Performance
        if 'training_metrics' in model_info:
            story.append(Paragraph("Model Performance", self.styles['CustomSubtitle']))
            
            metrics = model_info['training_metrics']
            metrics_data = [
                ['Metric', 'Value'],
                ['Accuracy', f"{metrics.get('accuracy', 0):.3f}"],
                ['Precision', f"{metrics.get('precision', 0):.3f}"],
                ['Recall', f"{metrics.get('recall', 0):.3f}"],
                ['F1-Score', f"{metrics.get('f1_score', 0):.3f}"],
                ['ROC-AUC', f"{metrics.get('roc_auc', 0):.3f}"]
            ]
            
            metrics_table = Table(metrics_data)
            metrics_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(metrics_table)
            story.append(Spacer(1, 20))
        
        # High-Risk Students List
        story.append(Paragraph("High-Risk Students", self.styles['CustomSubtitle']))
        
        high_risk_students = df[df['risk_label'] == 'High'].head(20)  # Limit to top 20
        
        if len(high_risk_students) > 0:
            high_risk_data = [['Student ID', 'Name', 'Probability', 'Attendance %', 'Performance %']]
            
            for _, student in high_risk_students.iterrows():
                high_risk_data.append([
                    str(student.get('student_id', 'N/A')),
                    str(student.get('student_name', 'N/A')),
                    f"{student['dropout_probability']:.1%}",
                    f"{student.get('attendance_percentage', 'N/A')}%",
                    f"{student.get('quiz_test_avg_pct', 'N/A')}%"
                ])
            
            high_risk_table = Table(high_risk_data)
            high_risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.red),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 8)
            ]))
            
            story.append(high_risk_table)
        else:
            story.append(Paragraph("No high-risk students found.", self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        logger.info(f"Summary report exported to PDF: {filename}")
        
        return filename
    
    def export_student_report_pdf(self, 
                                student_data: Dict,
                                predictions: Dict,
                                explanations: Dict,
                                filename: str = None) -> str:
        """
        Export individual student report to PDF
        
        Args:
            student_data: Student information
            predictions: Prediction results
            explanations: SHAP explanations
            filename: Optional filename
            
        Returns:
            Path to exported PDF
        """
        if filename is None:
            student_id = student_data.get('student_id', 'Unknown')
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"student_report_{student_id}_{timestamp}.pdf"
        
        # Ensure filename has .pdf extension
        if not filename.endswith('.pdf'):
            filename += '.pdf'
        
        # Create PDF document
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        
        # Title
        student_name = student_data.get('student_name', 'Unknown Student')
        title = Paragraph(f"Student Report: {student_name}", self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Student Information
        story.append(Paragraph("Student Information", self.styles['CustomSubtitle']))
        
        info_data = [
            ['Field', 'Value'],
            ['Student ID', str(student_data.get('student_id', 'N/A'))],
            ['Name', str(student_data.get('student_name', 'N/A'))],
            ['Age', str(student_data.get('age', 'N/A'))],
            ['Gender', str(student_data.get('gender', 'N/A'))],
            ['Attendance %', f"{student_data.get('attendance_percentage', 'N/A')}%"],
            ['Performance %', f"{student_data.get('quiz_test_avg_pct', 'N/A')}%"],
            ['Payment Status', 'Paid' if student_data.get('fee_payment_status', 0) == 1 else 'Issues'],
            ['LMS Logins', str(student_data.get('lms_login_count_monthly', 'N/A'))]
        ]
        
        info_table = Table(info_data)
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(info_table)
        story.append(Spacer(1, 20))
        
        # Risk Assessment
        story.append(Paragraph("Risk Assessment", self.styles['CustomSubtitle']))
        
        probability = predictions.get('probability', 0)
        risk_label = predictions.get('risk_label', 'Unknown')
        
        risk_text = f"""
        <b>Dropout Probability:</b> {probability:.1%}<br/>
        <b>Risk Level:</b> {risk_label}<br/>
        """
        
        story.append(Paragraph(risk_text, self.styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Risk Factors
        if 'top_features' in explanations:
            story.append(Paragraph("Key Risk Factors", self.styles['CustomSubtitle']))
            
            factors_data = [['Factor', 'Impact', 'Value']]
            for feature in explanations['top_features']:
                impact = "Increases Risk" if feature['shap_value'] > 0 else "Decreases Risk"
                factors_data.append([
                    feature['feature'].replace('_', ' ').title(),
                    impact,
                    f"{abs(feature['shap_value']):.3f}"
                ])
            
            factors_table = Table(factors_data)
            factors_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(factors_table)
            story.append(Spacer(1, 20))
        
        # Recommendations
        if 'recommendations' in explanations:
            story.append(Paragraph("Intervention Recommendations", self.styles['CustomSubtitle']))
            
            for i, rec in enumerate(explanations['recommendations'], 1):
                rec_text = f"""
                <b>{i}. {rec['factor']} (Priority: {rec['priority']})</b><br/>
                Current Value: {rec['current_value']}<br/>
                Recommendation: {rec['recommendation']}<br/><br/>
                """
                story.append(Paragraph(rec_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        logger.info(f"Student report exported to PDF: {filename}")
        
        return filename
    
    def export_batch_reports(self, 
                           df: pd.DataFrame,
                           model_info: Dict,
                           output_dir: str = "reports") -> List[str]:
        """
        Export batch of individual student reports
        
        Args:
            df: Dataframe with student data and predictions
            model_info: Model information
            output_dir: Output directory for reports
            
        Returns:
            List of exported file paths
        """
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        exported_files = []
        
        # Export individual reports for high-risk students
        high_risk_students = df[df['risk_label'] == 'High']
        
        for idx, student in high_risk_students.iterrows():
            try:
                # Prepare student data
                student_data = student.to_dict()
                
                # Prepare predictions
                predictions = {
                    'probability': student['dropout_probability'],
                    'risk_label': student['risk_label']
                }
                
                # Prepare explanations (simplified for batch export)
                explanations = {
                    'top_features': [
                        {'feature': 'attendance_percentage', 'shap_value': 0.1},
                        {'feature': 'quiz_test_avg_pct', 'shap_value': 0.05},
                        {'feature': 'fee_payment_status', 'shap_value': 0.03}
                    ],
                    'recommendations': [
                        {
                            'factor': 'Academic Performance',
                            'priority': 'High',
                            'current_value': f"{student.get('quiz_test_avg_pct', 'N/A')}%",
                            'recommendation': 'Arrange tutoring and study groups'
                        }
                    ]
                }
                
                # Generate filename
                student_id = student.get('student_id', f'Student_{idx}')
                filename = os.path.join(output_dir, f"student_report_{student_id}.pdf")
                
                # Export report
                exported_file = self.export_student_report_pdf(
                    student_data, predictions, explanations, filename
                )
                exported_files.append(exported_file)
                
            except Exception as e:
                logger.error(f"Error exporting report for student {idx}: {e}")
                continue
        
        logger.info(f"Exported {len(exported_files)} individual reports to {output_dir}")
        return exported_files
