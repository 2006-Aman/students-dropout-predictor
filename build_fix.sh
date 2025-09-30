#!/bin/bash
# Build script to fix pandas compilation issues on Render
# Forces Python 3.11 and handles pandas compilation gracefully

set -e

echo "🚀 Starting Render build process with pandas fix..."

# Check Python version
echo "🐍 Python version:"
python --version

# Upgrade pip and build tools first
echo "📦 Upgrading pip and build tools..."
pip install --upgrade pip setuptools wheel

# Install build dependencies
echo "🔧 Installing build dependencies..."
pip install --no-cache-dir cython numpy

# Try to install pandas with specific approach
echo "🐼 Installing pandas with compilation fix..."
pip install --no-cache-dir --no-build-isolation pandas==2.0.3 || {
    echo "⚠️  Pandas compilation failed, trying pre-compiled wheel..."
    pip install --no-cache-dir --only-binary=pandas pandas==2.0.3
}

# Install other dependencies
echo "📚 Installing other dependencies..."
pip install --no-cache-dir -r requirements.txt || {
    echo "⚠️  Full requirements failed, trying no-compile version..."
    pip install --no-cache-dir -r requirements-no-compile.txt
}

echo "✅ Build completed successfully!"
