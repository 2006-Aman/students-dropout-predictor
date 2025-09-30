#!/bin/bash
# Build script for Render deployment
# Handles pandas compilation issues

set -e

echo "🚀 Starting build process..."

# Upgrade pip and build tools
echo "📦 Upgrading pip and build tools..."
pip install --upgrade pip setuptools wheel

# Install build dependencies first
echo "🔧 Installing build dependencies..."
pip install --no-cache-dir cython numpy

# Try to install pandas with specific flags
echo "🐼 Installing pandas with compilation flags..."
pip install --no-cache-dir --no-build-isolation pandas==2.0.3 || {
    echo "⚠️  Pandas compilation failed, trying pre-compiled wheel..."
    pip install --no-cache-dir --only-binary=pandas pandas==2.0.3
}

# Install other dependencies
echo "📚 Installing other dependencies..."
pip install --no-cache-dir -r requirements-render.txt

echo "✅ Build completed successfully!"
