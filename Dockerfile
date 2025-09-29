# Backend Dockerfile - FastAPI + Uvicorn
FROM python:3.11-bookworm

# System deps (xgboost runtime, build tools for any wheels needing compile)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     build-essential \
     libgomp1 \
  && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies first (leverage layer cache)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app

# Expose API port
EXPOSE 8000

# Run the API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]


