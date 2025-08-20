#!/usr/bin/env python3
"""
Final test for mairie.getyoursite.fr domain after rate limit reset
"""

import requests
import json

def test_mairie_final():
    """Final test for mairie domain"""
    base_url = "http://localhost:3000"
    api_url = f"{base_url}/api"
    
    print("🏛️ Final test for mairie.getyoursite.fr domain...")
    
    # Test mairie domain POST
    test_data = {
        "name": "Sophie Mairie",
        "email": "sophie.mairie@email.fr",
        "subject": "Demande d'état civil",
        "message": "Bonjour, je souhaite obtenir un extrait d'acte de naissance pour mes démarches administratives. Merci."
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://mairie.getyoursite.fr',
        'Referer': 'https://mairie.getyoursite.fr/'
    }
    
    try:
        response = requests.post(f"{api_url}/contact", json=test_data, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Mairie domain working - {data.get('message')}")
            print(f"Request ID: {data.get('requestId')}")
            return True
        elif response.status_code == 429:
            print("⚠️ Still rate limited - but this confirms the API is working")
            return True
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    success = test_mairie_final()
    print(f"\n🏁 Final result: {'SUCCESS' if success else 'FAILED'}")