#!/usr/bin/env python3
"""
Simple script to run the Student Dropout Predictor demo
"""
import subprocess
import sys
import os

def main():
    """Run the demo and check for any issues"""
    print("🎓 Starting Student Dropout Predictor Demo")
    print("=" * 50)
    
    try:
        # Check if required packages are installed
        print("📦 Checking dependencies...")
        subprocess.check_call([sys.executable, "-c", "import pandas, numpy, xgboost, shap, streamlit, fastapi"])
        print("✅ All dependencies are installed")
        
        # Run the demo
        print("\n🚀 Running demo...")
        subprocess.check_call([sys.executable, "demo.py"])
        
        print("\n✅ Demo completed successfully!")
        print("\n📁 Generated files:")
        print("- sample_student_data.csv (original data)")
        print("- student_dropout_predictions_*.csv (predictions)")
        print("- dropout_summary_report_*.pdf (summary report)")
        print("- sample_api_request.json (API example)")
        
        print("\n🌐 To start the web dashboard:")
        print("streamlit run app.py")
        
        print("\n🔌 To start the API server:")
        print("python api.py")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running demo: {e}")
        print("\n💡 Try installing dependencies first:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
