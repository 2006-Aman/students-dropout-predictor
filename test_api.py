"""
Simple test script for the API
"""
import requests
import json
import time

def test_api():
    """Test the API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Student Dropout Predictor API")
    print("=" * 50)
    
    # Wait a moment for server to start
    time.sleep(3)
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
        
        # Test model status
        print("\n2. Testing model status...")
        response = requests.get(f"{base_url}/model/status")
        if response.status_code == 200:
            print("✅ Model status retrieved")
            print(f"   Model trained: {response.json()['is_trained']}")
        else:
            print(f"❌ Model status failed: {response.status_code}")
        
        # Test single prediction
        print("\n3. Testing single prediction...")
        test_data = {
            "student_data": {
                "student_id": "TEST_001",
                "attendance_percentage": 75.0,
                "assignment_timeliness": 80.0,
                "quiz_test_avg_pct": 70.0,
                "fee_payment_status": "Paid",
                "lms_login_count_monthly": 15,
                "time_spent_online_hours_week": 8.0
            }
        }
        
        response = requests.post(f"{base_url}/predict", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Single prediction successful")
            print(f"   Student ID: {result['student_id']}")
            print(f"   Risk Level: {result['risk_label']}")
            print(f"   Probability: {result['dropout_probability']:.1%}")
        else:
            print(f"❌ Single prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
        
        print("\n🎉 API testing completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure it's running on port 8000")
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    test_api()
