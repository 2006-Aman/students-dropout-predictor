#!/usr/bin/env python3
"""
Startup script for the complete Student Dropout Predictor system
Runs both the backend API and frontend development server
"""
import subprocess
import sys
import os
import time
import threading
import webbrowser
from pathlib import Path

def run_backend():
    """Run the FastAPI backend server"""
    print("🚀 Starting backend API server...")
    try:
        # Start uvicorn explicitly on 127.0.0.1:8000 to avoid binding issues
        subprocess.run([sys.executable, "-m", "uvicorn", "api:app", "--host", "127.0.0.1", "--port", "8000", "--reload"], shell=True, check=True)
    except KeyboardInterrupt:
        print("\n⏹️ Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

def run_frontend():
    """Run the React frontend development server"""
    print("🎨 Starting frontend development server...")
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found. Please run this from the project root.")
        return
    
    try:
        # Ensure the frontend knows where the API is
        env = os.environ.copy()
        env.setdefault("VITE_API_BASE_URL", "http://127.0.0.1:8000")
        # Use shell=True on Windows for npm commands
        subprocess.run(["npm", "run", "dev"], cwd=frontend_dir, shell=True, check=True, env=env)
    except KeyboardInterrupt:
        print("\n⏹️ Frontend server stopped")
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")

def open_browser():
    """Open browser after a delay"""
    time.sleep(5)  # Wait for servers to start
    print("🌐 Opening browser...")
    webbrowser.open("http://localhost:5173")

def main():
    """Main function to start both servers"""
    print("🎓 Student Dropout Predictor - Full Stack Startup")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path("api.py").exists():
        print("❌ Please run this script from the project root directory")
        print("   (where api.py and frontend/ folder are located)")
        sys.exit(1)
    
    # Check if frontend dependencies are installed
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        sys.exit(1)
    
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("📦 Installing frontend dependencies...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, shell=True, check=True)
            print("✅ Frontend dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies")
            sys.exit(1)
    
    print("\n🚀 Starting servers...")
    print("   Backend API: http://127.0.0.1:8000")
    print("   Frontend UI: http://localhost:5173")
    print("   API Docs: http://localhost:8000/docs")
    print("\n💡 Press Ctrl+C to stop both servers")
    print("-" * 60)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Wait a moment for backend to start
        time.sleep(2)
        
        # Start browser opening in a separate thread
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
        
        # Start frontend (this will block)
        run_frontend()
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Shutting down servers...")
        print("✅ All servers stopped")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
