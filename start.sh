#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-8000}

# Start the application
echo "Starting Student Dropout Predictor API on port $PORT"
uvicorn api:app --host 0.0.0.0 --port $PORT --workers 1
