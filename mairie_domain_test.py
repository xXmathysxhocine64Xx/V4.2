#!/usr/bin/env python3
"""
Focused test for mairie.getyoursite.fr domain support
"""

import requests
import json
import time

def test_mairie_domain():
    """Test the new mairie.getyoursite.fr domain support"""
    base_url = "http://localhost:3000"
    api_url = f"{base_url}/api"
    
    print("🏛️ Testing mairie.getyoursite.fr domain support...")
    
    # Test 1: GET /api/contact
    print("\n1. Testing GET /api/contact...")
    try:
        response = requests.get(f"{api_url}/contact", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/contact: {data.get('status')} - {data.get('message')}")
        else:
            print(f"❌ GET /api/contact failed: {response.status_code}")
    except Exception as e:
        print(f"❌ GET /api/contact error: {e}")
    
    # Test 2: POST with mairie.getyoursite.fr origin
    print("\n2. Testing POST with mairie.getyoursite.fr origin...")
    test_data = {
        "name": "Marie Citoyenne",
        "email": "marie.citoyenne@email.fr",
        "subject": "Demande d'acte de naissance",
        "message": "Bonjour, je souhaite obtenir un acte de naissance pour ma fille née en 2020. Merci de me faire savoir les documents nécessaires."
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://mairie.getyoursite.fr',
        'Referer': 'https://mairie.getyoursite.fr/'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=test_data, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST mairie domain: {data.get('success')} - {data.get('message')}")
        elif response.status_code == 429:
            print("⚠️ POST mairie domain: Rate limited (expected behavior)")
        else:
            print(f"❌ POST mairie domain failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ POST mairie domain error: {e}")
    
    time.sleep(2)
    
    # Test 3: POST with pizza.getyoursite.fr origin (existing)
    print("\n3. Testing POST with pizza.getyoursite.fr origin...")
    pizza_data = {
        "name": "Mario Pizza",
        "email": "mario@pizza.fr",
        "subject": "Commande Pizza",
        "message": "Je souhaite commander une pizza Margherita."
    }
    
    pizza_headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://pizza.getyoursite.fr',
        'Referer': 'https://pizza.getyoursite.fr/'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=pizza_data, headers=pizza_headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST pizza domain: {data.get('success')} - {data.get('message')}")
        elif response.status_code == 429:
            print("⚠️ POST pizza domain: Rate limited (expected behavior)")
        else:
            print(f"❌ POST pizza domain failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ POST pizza domain error: {e}")
    
    time.sleep(2)
    
    # Test 4: POST with getyoursite.fr origin
    print("\n4. Testing POST with getyoursite.fr origin...")
    main_data = {
        "name": "Client Principal",
        "email": "client@getyoursite.fr",
        "subject": "Demande d'information",
        "message": "Je souhaite obtenir plus d'informations sur vos services."
    }
    
    main_headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://getyoursite.fr',
        'Referer': 'https://getyoursite.fr/'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=main_data, headers=main_headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST main domain: {data.get('success')} - {data.get('message')}")
        elif response.status_code == 429:
            print("⚠️ POST main domain: Rate limited (expected behavior)")
        else:
            print(f"❌ POST main domain failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ POST main domain error: {e}")
    
    time.sleep(2)
    
    # Test 5: Unauthorized origin
    print("\n5. Testing unauthorized origin rejection...")
    unauthorized_headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious-site.com'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=test_data, headers=unauthorized_headers, timeout=10)
        if response.status_code == 403:
            print("✅ Unauthorized origin properly rejected")
        elif response.status_code == 429:
            print("⚠️ Unauthorized origin: Rate limited (can't test properly)")
        else:
            print(f"❌ Unauthorized origin not rejected: {response.status_code}")
    except Exception as e:
        print(f"❌ Unauthorized origin test error: {e}")
    
    # Test 6: Security headers
    print("\n6. Testing security headers...")
    try:
        response = requests.get(f"{api_url}/contact", timeout=10)
        required_headers = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection']
        missing = [h for h in required_headers if h not in response.headers]
        if not missing:
            print("✅ All required security headers present")
        else:
            print(f"❌ Missing security headers: {missing}")
    except Exception as e:
        print(f"❌ Security headers test error: {e}")
    
    print("\n🏁 Mairie domain testing completed!")

if __name__ == "__main__":
    test_mairie_domain()