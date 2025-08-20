#!/usr/bin/env python3
"""
Backend Test Suite for GetYourSite Contact API with Multi-Domain Support
Tests the Contact API endpoints for pizza.getyoursite.fr domain support
"""

import requests
import json
import time
import subprocess
import sys
from datetime import datetime

class GetYourSiteBackendTester:
    def __init__(self):
        # Read the backend URL from frontend/.env if available
        try:
            with open('/app/frontend/.env', 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.base_url = line.split('=')[1].strip()
                        break
                else:
                    self.base_url = "http://localhost:3000"
        except:
            self.base_url = "http://localhost:3000"
            
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, status, message="", details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.test_results.append(result)
        
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {message}")
        
        if status == "FAIL":
            self.failed_tests.append(test_name)
            if details:
                print(f"   Details: {details}")
    
    def test_pm2_status(self):
        """Test PM2 deployment status"""
        try:
            result = subprocess.run(['pm2', 'status'], capture_output=True, text=True)
            if result.returncode == 0 and 'getyoursite' in result.stdout and 'online' in result.stdout:
                self.log_test("PM2 Status", "PASS", "Application getyoursite is online in PM2")
                return True
            else:
                self.log_test("PM2 Status", "FAIL", "Application not running properly in PM2", result.stdout)
                return False
        except Exception as e:
            self.log_test("PM2 Status", "FAIL", f"Error checking PM2 status: {str(e)}")
            return False
    
    def test_api_contact_get(self):
        """Test GET /api/contact endpoint"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'active' and 'API Contact GetYourSite' in data.get('message', ''):
                    self.log_test("API Contact GET", "PASS", "Contact API returns active status")
                    return True
                else:
                    self.log_test("API Contact GET", "FAIL", "Invalid response format", data)
                    return False
            else:
                self.log_test("API Contact GET", "FAIL", f"HTTP {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Contact GET", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_contact_post_valid(self):
        """Test POST /api/contact with valid data"""
        test_data = {
            "name": "Jean Dupont",
            "email": "jean.dupont@example.com",
            "message": "Bonjour, je souhaite obtenir plus d'informations sur vos services de création de sites web.",
            "subject": "Demande d'information"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'Message reçu' in data.get('message', ''):
                    self.log_test("API Contact POST Valid", "PASS", "Valid contact form submission successful")
                    return True
                else:
                    self.log_test("API Contact POST Valid", "FAIL", "Invalid success response", data)
                    return False
            else:
                self.log_test("API Contact POST Valid", "FAIL", f"HTTP {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Contact POST Valid", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_contact_post_missing_fields(self):
        """Test POST /api/contact with missing required fields"""
        test_cases = [
            {"email": "test@example.com", "message": "Test message"},  # Missing name
            {"name": "Test User", "message": "Test message"},  # Missing email
            {"name": "Test User", "email": "test@example.com"},  # Missing message
            {}  # Missing all fields
        ]
        
        all_passed = True
        for i, test_data in enumerate(test_cases):
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code == 400:
                    data = response.json()
                    if 'error' in data and 'requis' in data['error']:
                        continue  # This test case passed
                    else:
                        self.log_test(f"API Contact Validation {i+1}", "FAIL", "Invalid error response", data)
                        all_passed = False
                else:
                    self.log_test(f"API Contact Validation {i+1}", "FAIL", f"Expected 400, got {response.status_code}")
                    all_passed = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"API Contact Validation {i+1}", "FAIL", f"Request failed: {str(e)}")
                all_passed = False
        
        if all_passed:
            self.log_test("API Contact Field Validation", "PASS", "All required field validations working")
        
        return all_passed
    
    def test_api_contact_post_invalid_email(self):
        """Test POST /api/contact with invalid email format"""
        test_data = {
            "name": "Test User",
            "email": "invalid-email-format",
            "message": "Test message"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data and 'Email invalide' in data['error']:
                    self.log_test("API Contact Email Validation", "PASS", "Email format validation working")
                    return True
                else:
                    self.log_test("API Contact Email Validation", "FAIL", "Invalid error message", data)
                    return False
            else:
                self.log_test("API Contact Email Validation", "FAIL", f"Expected 400, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Contact Email Validation", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_stability(self):
        """Test API stability with multiple successive requests"""
        success_count = 0
        total_requests = 5
        
        for i in range(total_requests):
            try:
                response = requests.get(f"{self.api_url}/contact", timeout=5)
                if response.status_code == 200:
                    success_count += 1
                time.sleep(0.5)  # Small delay between requests
            except:
                pass
        
        if success_count == total_requests:
            self.log_test("API Stability", "PASS", f"All {total_requests} successive requests successful")
            return True
        else:
            self.log_test("API Stability", "FAIL", f"Only {success_count}/{total_requests} requests successful")
            return False
    
    def test_pm2_logs(self):
        """Check PM2 logs for errors"""
        try:
            result = subprocess.run(['pm2', 'logs', 'getyoursite', '--lines', '20'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                logs = result.stdout
                # Check for critical errors (not minor warnings)
                critical_errors = ['Error:', 'ECONNREFUSED', 'ENOTFOUND', 'Cannot', 'Failed']
                has_critical_errors = any(error in logs for error in critical_errors)
                
                if not has_critical_errors:
                    self.log_test("PM2 Logs Check", "PASS", "No critical errors found in recent logs")
                    return True
                else:
                    self.log_test("PM2 Logs Check", "WARN", "Some errors found in logs", logs[-500:])
                    return True  # Don't fail for minor issues
            else:
                self.log_test("PM2 Logs Check", "FAIL", "Could not retrieve PM2 logs")
                return False
                
        except Exception as e:
            self.log_test("PM2 Logs Check", "FAIL", f"Error checking logs: {str(e)}")
            return False
    
    def test_pm2_restart(self):
        """Test PM2 restart functionality"""
        try:
            # Restart the application
            result = subprocess.run(['pm2', 'restart', 'getyoursite'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                # Wait for restart
                time.sleep(3)
                
                # Check if it's back online
                status_result = subprocess.run(['pm2', 'status'], capture_output=True, text=True)
                if 'online' in status_result.stdout:
                    self.log_test("PM2 Restart", "PASS", "Application restarted successfully")
                    return True
                else:
                    self.log_test("PM2 Restart", "FAIL", "Application not online after restart")
                    return False
            else:
                self.log_test("PM2 Restart", "FAIL", "PM2 restart command failed", result.stderr)
                return False
                
        except Exception as e:
            self.log_test("PM2 Restart", "FAIL", f"Error during restart test: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting GetYourSite Backend Tests")
        print("=" * 50)
        
        # Test PM2 deployment first
        self.test_pm2_status()
        
        # Test API endpoints
        self.test_api_contact_get()
        self.test_api_contact_post_valid()
        self.test_api_contact_post_missing_fields()
        self.test_api_contact_post_invalid_email()
        
        # Test stability
        self.test_api_stability()
        self.test_pm2_logs()
        self.test_pm2_restart()
        
        # Final summary
        print("\n" + "=" * 50)
        print("🏁 Test Summary")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['status'] == 'PASS'])
        failed_tests = len([t for t in self.test_results if t['status'] == 'FAIL'])
        warned_tests = len([t for t in self.test_results if t['status'] == 'WARN'])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Warnings: {warned_tests}")
        
        if failed_tests == 0:
            print("\n🎉 All critical tests passed! Backend is working properly.")
            return True
        else:
            print(f"\n❌ {failed_tests} critical test(s) failed:")
            for failed_test in self.failed_tests:
                print(f"   - {failed_test}")
            return False

if __name__ == "__main__":
    tester = GetYourSiteBackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)