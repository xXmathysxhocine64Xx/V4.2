#!/usr/bin/env python3
import requests
import time
import json

def test_validation_after_rate_limit_reset():
    """Wait for rate limit reset and test validation"""
    base_url = "http://localhost:3000/api/contact"
    
    print("Waiting for rate limit to reset...")
    time.sleep(600)  # Wait 10 minutes
    
    # Test invalid name with numbers
    test_data = {
        "name": "Test123",  # Should fail validation
        "email": "test@example.com",
        "message": "This is a test message with enough characters"
    }
    
    try:
        response = requests.post(
            base_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'caractères non autorisés' in data['error']:
                print("✅ Validation working correctly - rejected invalid name")
                return True
        
        print("❌ Validation test failed")
        return False
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    test_validation_after_rate_limit_reset()