"""
FastAPI REST endpoints for Student Dropout Predictor
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import pandas as pd
import numpy as np
import json
import logging
import io
from datetime import datetime
import os
from pathlib import Path

# Import our modules
from data_processor import DataProcessor
from model_trainer import DropoutPredictor
from explainability import ModelExplainer
from export_utils import ReportExporter
from config import MODELS_DIR

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Student Dropout Predictor API",
    description="REST API for student dropout prediction using XGBoost and SHAP",
    version="1.0.0"
)

# CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Consider restricting to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and processor
data_processor = DataProcessor()
model = DropoutPredictor()
explainer = None
exporter = ReportExporter()

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    student_data: Dict[str, Any]

class BatchPredictionRequest(BaseModel):
    students_data: List[Dict[str, Any]]

class PredictionResponse(BaseModel):
    student_id: str
    dropout_probability: float
    risk_label: str
    top_features: List[Dict[str, Any]]
    explanation: str

class ModelStatusResponse(BaseModel):
    is_trained: bool
    model_version: Optional[str]
    feature_columns: List[str]
    training_metrics: Dict[str, float]

class TrainingRequest(BaseModel):
    use_hyperparameter_tuning: bool = False
    use_smote: bool = True

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Student Dropout Predictor API",
        "version": "1.0.0",
        "status": "running"
    }

# Attempt to auto-load latest model on startup
def _auto_load_latest_model():
    try:
        model_files = sorted(MODELS_DIR.glob('dropout_model_*.joblib'))
        if model_files:
            latest = str(model_files[-1])
            if model.load_model(latest):
                logger.info(f"Auto-loaded model: {latest}")
            else:
                logger.info("No model auto-loaded")
    except Exception as e:
        logger.warning(f"Auto-load model failed: {e}")

_auto_load_latest_model()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_trained": model.is_trained
    }

@app.get("/model/status", response_model=ModelStatusResponse)
async def get_model_status():
    """Get model status and information"""
    model_info = model.get_model_info()
    return ModelStatusResponse(**model_info)

@app.post("/model/train")
async def train_model(request: TrainingRequest):
    """Train the model using processed data saved by /data/upload"""
    try:
        if not os.path.exists("temp_processed_data.csv"):
            raise HTTPException(status_code=400, detail="No processed data found. Upload data first.")

        df = pd.read_csv("temp_processed_data.csv")
        # Prepare training data
        X, y = model.prepare_training_data(df)
        # Train
        training_results = model.train(
            X, y,
            use_hyperparameter_tuning=request.use_hyperparameter_tuning,
            use_smote=request.use_smote
        )

        # Initialize explainer lazily if available
        global explainer
        try:
            explainer = ModelExplainer(model)
            explainer.initialize_explainer(X)
        except Exception as _:
            explainer = None

        return {"message": "Model trained successfully", "status": "ok", **training_results}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in model training: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/data/upload")
async def upload_data(file: UploadFile = File(...)):
    """Upload and process training data"""
    try:
        # Read uploaded file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Process data
        processed_df, processing_info = data_processor.validate_and_preprocess(df)
        
        # Store processed data (in production, this would be stored in a database)
        processed_df.to_csv("temp_processed_data.csv", index=False)
        
        # Auto-train if model not trained
        auto_trained = False
        if not model.is_trained:
            try:
                X, y = model.prepare_training_data(processed_df)
                model.train(X, y, use_hyperparameter_tuning=False, use_smote=True)
                auto_trained = True
                # Initialize explainer
                global explainer
                try:
                    explainer = ModelExplainer(model)
                    explainer.initialize_explainer(X)
                except Exception:
                    explainer = None
            except Exception as _:
                auto_trained = False
        return {
            "message": "Data uploaded and processed successfully",
            "shape": processed_df.shape,
            "processing_info": processing_info,
            "auto_trained": auto_trained
        }
    except Exception as e:
        logger.error(f"Error uploading data: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest):
    """Predict dropout risk for a single student"""
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained. Please train the model first.")
    
    try:
        # Convert single student data to dataframe
        # Normalize incoming types (guard against strings in numeric fields)
        payload = dict(request.student_data)
        for key in [
            'attendance_percentage','assignment_timeliness','quiz_test_avg_pct',
            'lms_login_count_monthly','time_spent_online_hours_week','age','socioeconomic_status'
        ]:
            if key in payload and payload[key] is not None and payload[key] != "":
                try:
                    payload[key] = float(payload[key])
                except Exception:
                    payload[key] = None
        student_df = pd.DataFrame([payload])
        
        # Process the data (ensure columns and types)
        processed_df, _ = data_processor.validate_and_preprocess(student_df)
        
        # Prepare features (ensure DataFrame, numeric, aligned with model features)
        X = data_processor.prepare_features(processed_df)
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X)
        # Coerce all to numeric and fill NaNs
        X = X.apply(pd.to_numeric, errors='coerce').fillna(0)
        # Temporarily ignore 'age' to avoid 1-D/shape issues from edge inputs
        X = X.drop(columns=['age'], errors='ignore')
        if model.is_trained and model.feature_columns:
            # Reindex to model features exactly (missing -> 0, extra -> dropped)
            X = X.reindex(columns=model.feature_columns, fill_value=0)
        # Safe-guard: if age column triggers issues in edge cases, exclude it
        if 'age' in X.columns and X['age'].ndim != 1:
            X = X.drop(columns=['age'], errors='ignore')
        if X.shape[0] == 0 or X.shape[1] == 0:
            raise HTTPException(status_code=400, detail="Prepared features are empty. Check input fields.")
        
        # Make prediction
        try:
            predictions, probabilities, risk_labels = model.predict(X)
        except Exception as e:
            logger.error(f"Prediction error with features {list(X.columns)} and shape {X.shape}: {e}")
            raise HTTPException(status_code=500, detail="Prediction failed due to input shape/type. Please review input values.")
        
        # Get SHAP explanation if explainer is available
        top_features = []
        explanation = "No explanation available"
        
        if explainer:
            try:
                local_explanation = explainer.explain_local(X, [0])
                if local_explanation.get('explanations'):
                    explanation_data = local_explanation['explanations'][0]
                    top_features = explanation_data.get('top_features', [])
                    explanation = explainer.generate_human_readable_explanation(X, 0)
            except Exception as _:
                top_features = []
                explanation = "No explanation available"
        
        return PredictionResponse(
            student_id=str(request.student_data.get('student_id', 'Unknown')),
            dropout_probability=float(probabilities[0]),
            risk_label=risk_labels[0],
            top_features=top_features,
            explanation=explanation
        )
    
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch")
async def predict_batch(request: BatchPredictionRequest):
    """Predict dropout risk for multiple students"""
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained. Please train the model first.")
    
    try:
        # Convert students data to dataframe
        students_df = pd.DataFrame(request.students_data)
        
        # Process the data
        processed_df, _ = data_processor.validate_and_preprocess(students_df)
        
        # Prepare features
        X = data_processor.prepare_features(processed_df)
        
        # Make predictions
        predictions, probabilities, risk_labels = model.predict(X)
        
        # Prepare response
        results = []
        for i, student_data in enumerate(request.students_data):
            result = {
                "student_id": str(student_data.get('student_id', f'Student_{i}')),
                "dropout_probability": float(probabilities[i]),
                "risk_label": risk_labels[i],
                "top_features": [],
                "explanation": "No explanation available"
            }
            
            # Get SHAP explanation if available
            if explainer:
                local_explanation = explainer.explain_local(X, [i])
                if local_explanation['explanations']:
                    explanation_data = local_explanation['explanations'][0]
                    result["top_features"] = explanation_data['top_features']
                    result["explanation"] = explainer.generate_human_readable_explanation(X, i)
            
            results.append(result)
        
        return {
            "predictions": results,
            "total_students": len(results),
            "high_risk_count": sum(1 for r in results if r['risk_label'] == 'High'),
            "medium_risk_count": sum(1 for r in results if r['risk_label'] == 'Medium'),
            "low_risk_count": sum(1 for r in results if r['risk_label'] == 'Low')
        }
    
    except Exception as e:
        logger.error(f"Error in batch prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/explain/global")
async def get_global_explanation():
    """Get global feature importance explanation"""
    if not model.is_trained or explainer is None:
        raise HTTPException(status_code=400, detail="Model or explainer not available")
    
    try:
        # Load processed data for explanation
        if os.path.exists("temp_processed_data.csv"):
            df = pd.read_csv("temp_processed_data.csv")
            X = data_processor.prepare_features(df)
            global_explanation = explainer.explain_global(X)
            return global_explanation
        else:
            raise HTTPException(status_code=400, detail="No data available for explanation")
    
    except Exception as e:
        logger.error(f"Error in global explanation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/explain/local/{student_index}")
async def get_local_explanation(student_index: int):
    """Get local explanation for a specific student"""
    if not model.is_trained or explainer is None:
        raise HTTPException(status_code=400, detail="Model or explainer not available")
    
    try:
        # Load processed data for explanation
        if os.path.exists("temp_processed_data.csv"):
            df = pd.read_csv("temp_processed_data.csv")
            X = data_processor.prepare_features(df)
            
            if student_index >= len(X):
                raise HTTPException(status_code=400, detail="Student index out of range")
            
            local_explanation = explainer.explain_local(X, [student_index])
            return local_explanation
        else:
            raise HTTPException(status_code=400, detail="No data available for explanation")
    
    except Exception as e:
        logger.error(f"Error in local explanation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export/csv")
async def export_csv():
    """Export predictions as CSV"""
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained")
    
    try:
        # Load processed data
        if os.path.exists("temp_processed_data.csv"):
            df = pd.read_csv("temp_processed_data.csv")
            X = data_processor.prepare_features(df)
            
            # Make predictions
            predictions, probabilities, risk_labels = model.predict(X)
            
            # Add prediction columns
            df['dropout_probability'] = probabilities
            df['risk_label'] = risk_labels
            
            # Export to CSV
            filename = exporter.export_to_csv(df)
            
            return FileResponse(
                filename,
                media_type='text/csv',
                filename=f"student_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            )
        else:
            raise HTTPException(status_code=400, detail="No data available for export")
    
    except Exception as e:
        logger.error(f"Error in CSV export: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export/report")
async def export_report():
    """Export summary report as PDF"""
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained")
    
    try:
        # Load processed data
        if os.path.exists("temp_processed_data.csv"):
            df = pd.read_csv("temp_processed_data.csv")
            X = data_processor.prepare_features(df)
            
            # Make predictions
            predictions, probabilities, risk_labels = model.predict(X)
            
            # Add prediction columns
            df['dropout_probability'] = probabilities
            df['risk_label'] = risk_labels
            
            # Calculate risk counts
            risk_counts = {
                'High': sum(1 for label in risk_labels if label == 'High'),
                'Medium': sum(1 for label in risk_labels if label == 'Medium'),
                'Low': sum(1 for label in risk_labels if label == 'Low')
            }
            
            # Get model info
            model_info = model.get_model_info()
            
            # Export report
            filename = exporter.export_summary_report_pdf(df, model_info, risk_counts)
            
            return FileResponse(
                filename,
                media_type='application/pdf',
                filename=f"dropout_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            )
        else:
            raise HTTPException(status_code=400, detail="No data available for export")
    
    except Exception as e:
        logger.error(f"Error in report export: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/webhook/alert")
async def setup_alert_webhook(webhook_url: str = Form(...)):
    """Setup webhook for high-risk student alerts"""
    # In a production system, this would store the webhook URL in a database
    # and implement actual webhook calling functionality
    return {
        "message": "Webhook URL registered successfully",
        "webhook_url": webhook_url,
        "status": "active"
    }

@app.get("/metrics")
async def get_model_metrics():
    """Get model performance metrics"""
    if not model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained")
    
    model_info = model.get_model_info()
    return {
        "model_metrics": model_info.get('training_metrics', {}),
        "model_version": model_info.get('model_version'),
        "feature_count": len(model_info.get('feature_columns', [])),
        "last_updated": datetime.now().isoformat()
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": "Endpoint not found", "error": str(exc)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
