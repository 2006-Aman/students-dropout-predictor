#!/usr/bin/env python3
"""
Startup script for Render deployment
This script handles the startup process for the Student Dropout Predictor on Render
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    """Main startup function for Render deployment"""
    print("🎓 Student Dropout Predictor - Render Deployment")
    print("=" * 50)
    
    # Set environment variables for production
    os.environ.setdefault("PYTHONPATH", ".")
    
    # Check if we're running the API or Streamlit app
    if len(sys.argv) > 1 and sys.argv[1] == "streamlit":
        print("🚀 Starting Streamlit application...")
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py",
            "--server.port", os.environ.get("PORT", "8000"),
            "--server.address", "0.0.0.0",
            "--server.headless", "true"
        ])
    else:
        print("🚀 Starting FastAPI application...")
        subprocess.run([
            sys.executable, "-m", "uvicorn", "api:app",
            "--host", "0.0.0.0",
            "--port", os.environ.get("PORT", "8000"),
            "--workers", "1"
        ])

if __name__ == "__main__":
    main()
