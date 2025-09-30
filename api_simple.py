"""
Simple FastAPI application for Student Dropout Predictor
Minimal version without pandas dependencies for initial deployment
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Student Dropout Predictor API",
    description="REST API for student dropout prediction",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class StudentData(BaseModel):
    student_id: str
    attendance_percentage: float
    quiz_test_avg_pct: float
    fee_payment_status: str
    lms_login_count_monthly: int

class PredictionResponse(BaseModel):
    student_id: str
    dropout_probability: float
    risk_level: str
    recommendations: List[str]

# In-memory storage for demo
students_data = {}
predictions_data = {}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Student Dropout Predictor API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/students", response_model=Dict[str, str])
async def add_student(student: StudentData):
    """Add a new student"""
    try:
        students_data[student.student_id] = student.dict()
        return {"message": f"Student {student.student_id} added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students/{student_id}")
async def get_student(student_id: str):
    """Get student data"""
    if student_id not in students_data:
        raise HTTPException(status_code=404, detail="Student not found")
    return students_data[student_id]

@app.get("/api/students")
async def get_all_students():
    """Get all students"""
    return {"students": list(students_data.values())}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_dropout(student: StudentData):
    """Predict dropout risk for a student"""
    try:
        # Simple risk calculation based on attendance and performance
        attendance_score = student.attendance_percentage / 100
        performance_score = student.quiz_test_avg_pct / 100
        payment_score = 1.0 if student.fee_payment_status == "Paid" else 0.5
        engagement_score = min(student.lms_login_count_monthly / 20, 1.0)
        
        # Calculate risk probability
        risk_factors = [
            (1 - attendance_score) * 0.4,  # Low attendance
            (1 - performance_score) * 0.3,  # Low performance
            (1 - payment_score) * 0.2,       # Payment issues
            (1 - engagement_score) * 0.1    # Low engagement
        ]
        
        dropout_probability = sum(risk_factors)
        dropout_probability = max(0.0, min(1.0, dropout_probability))  # Clamp between 0 and 1
        
        # Determine risk level
        if dropout_probability >= 0.7:
            risk_level = "High"
            recommendations = [
                "Schedule immediate intervention meeting",
                "Assign academic mentor",
                "Review attendance policies",
                "Check financial aid status"
            ]
        elif dropout_probability >= 0.4:
            risk_level = "Medium"
            recommendations = [
                "Monitor attendance closely",
                "Provide additional academic support",
                "Check engagement levels"
            ]
        else:
            risk_level = "Low"
            recommendations = [
                "Continue current support",
                "Regular check-ins"
            ]
        
        # Store prediction
        prediction = PredictionResponse(
            student_id=student.student_id,
            dropout_probability=dropout_probability,
            risk_level=risk_level,
            recommendations=recommendations
        )
        
        predictions_data[student.student_id] = prediction.dict()
        
        return prediction
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/api/predictions")
async def get_all_predictions():
    """Get all predictions"""
    return {"predictions": list(predictions_data.values())}

@app.get("/api/predictions/{student_id}")
async def get_prediction(student_id: str):
    """Get prediction for a specific student"""
    if student_id not in predictions_data:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return predictions_data[student_id]

@app.delete("/api/students/{student_id}")
async def delete_student(student_id: str):
    """Delete a student"""
    if student_id not in students_data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    del students_data[student_id]
    if student_id in predictions_data:
        del predictions_data[student_id]
    
    return {"message": f"Student {student_id} deleted successfully"}

@app.get("/api/stats")
async def get_stats():
    """Get basic statistics"""
    total_students = len(students_data)
    total_predictions = len(predictions_data)
    
    if total_predictions > 0:
        high_risk = sum(1 for p in predictions_data.values() if p["risk_level"] == "High")
        medium_risk = sum(1 for p in predictions_data.values() if p["risk_level"] == "Medium")
        low_risk = sum(1 for p in predictions_data.values() if p["risk_level"] == "Low")
    else:
        high_risk = medium_risk = low_risk = 0
    
    return {
        "total_students": total_students,
        "total_predictions": total_predictions,
        "risk_distribution": {
            "high_risk": high_risk,
            "medium_risk": medium_risk,
            "low_risk": low_risk
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
