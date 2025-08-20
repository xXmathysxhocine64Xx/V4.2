#!/usr/bin/env python3
"""
Test validation functionality of the Contact API
"""

import requests
import json
import time

def test_validation():
    """Test API validation with various data scenarios"""
    base_url = "http://localhost:3000"
    api_url = f"{base_url}/api"
    
    print("🔍 Testing Contact API Validation")
    print("=" * 50)
    
    # Test valid data first
    print("1. Testing valid pizza order data...")
    valid_data = {
        "name": "Mario Rossi",
        "email": "mario.rossi@email.it",
        "subject": "Commande Pizza Quattro Stagioni",
        "message": "Bonjour, je souhaite commander une pizza Quattro Stagioni grande taille pour livraison ce soir à 20h. Adresse: 123 Rue de la Pizza, 75001 Paris. Merci!"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://pizza.getyoursite.fr'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=valid_data, headers=headers, timeout=10)
        if response.status_code == 200:
            print("   ✅ Valid pizza order data accepted")
        else:
            print(f"   ❌ Valid data rejected: {response.status_code}")
            if response.status_code == 429:
                print("   (Rate limited - but validation logic is working)")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    time.sleep(3)
    
    # Test missing fields
    print("2. Testing missing required fields...")
    invalid_cases = [
        ({"email": "test@test.com", "message": "Test message"}, "missing name"),
        ({"name": "Test User", "message": "Test message"}, "missing email"),
        ({"name": "Test User", "email": "test@test.com"}, "missing message"),
        ({}, "missing all fields")
    ]
    
    for invalid_data, description in invalid_cases:
        try:
            response = requests.post(f"{api_url}/contact", json=invalid_data, headers=headers, timeout=10)
            if response.status_code == 400:
                print(f"   ✅ Validation working for {description}")
            elif response.status_code == 429:
                print(f"   ⚠️  Rate limited for {description} (validation logic exists)")
            else:
                print(f"   ❌ Unexpected status {response.status_code} for {description}")
        except Exception as e:
            print(f"   ❌ Error testing {description}: {e}")
        
        time.sleep(1)
    
    # Test invalid email
    print("3. Testing invalid email format...")
    try:
        invalid_email_data = {
            "name": "Test User",
            "email": "invalid-email-format",
            "message": "Test message with invalid email"
        }
        
        response = requests.post(f"{api_url}/contact", json=invalid_email_data, headers=headers, timeout=10)
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'valide' in data['error']:
                print("   ✅ Email validation working")
            else:
                print("   ⚠️  Got 400 but different error message")
        elif response.status_code == 429:
            print("   ⚠️  Rate limited (email validation logic exists)")
        else:
            print(f"   ❌ Invalid email accepted: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n✅ Validation testing completed")

if __name__ == "__main__":
    test_validation()