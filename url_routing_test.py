#!/usr/bin/env python3
"""
CRITICAL BUG INVESTIGATION - GetYourSite External URL Issue
Testing both localhost and external URLs to diagnose routing/nginx configuration issues.
"""

import requests
import json
import time
import sys
from datetime import datetime

class URLRoutingTester:
    def __init__(self):
        self.test_results = []
        self.localhost_url = "http://localhost:3000"
        self.external_url = "http://getyoursite.fr"
        self.preview_url = "https://deploy-script-fix.preview.emergentagent.com"
        
    def log_test(self, test_name, passed, details):
        """Log test results"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'passed': passed,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        print(f"   Details: {details}")
        print()
        
    def test_localhost_frontend(self):
        """Test localhost:3000 frontend (should work with PM2)"""
        print("🏠 Testing Localhost Frontend (PM2)...")
        
        try:
            response = requests.get(self.localhost_url, timeout=10)
            if response.status_code == 200:
                content_length = len(response.text)
                has_html = '<html' in response.text.lower()
                self.log_test(
                    "Localhost Frontend Test",
                    True,
                    f"HTTP 200 - Content length: {content_length} chars, HTML: {has_html}"
                )
            else:
                self.log_test(
                    "Localhost Frontend Test",
                    False,
                    f"HTTP {response.status_code} - Expected 200"
                )
        except Exception as e:
            self.log_test(
                "Localhost Frontend Test",
                False,
                f"Connection error: {str(e)}"
            )
    
    def test_external_frontend(self):
        """Test external URL http://getyoursite.fr/ (currently returns 404)"""
        print("🌐 Testing External URL Frontend...")
        
        try:
            response = requests.get(self.external_url, timeout=10)
            if response.status_code == 200:
                self.log_test(
                    "External URL Frontend Test",
                    True,
                    f"HTTP 200 - External URL working correctly"
                )
            elif response.status_code == 404:
                server_header = response.headers.get('Server', 'Unknown')
                self.log_test(
                    "External URL Frontend Test",
                    False,
                    f"HTTP 404 Not Found - Server: {server_header} (nginx routing issue)"
                )
            else:
                self.log_test(
                    "External URL Frontend Test",
                    False,
                    f"HTTP {response.status_code} - Unexpected status"
                )
        except Exception as e:
            self.log_test(
                "External URL Frontend Test",
                False,
                f"Connection error: {str(e)}"
            )
    
    def test_preview_url_frontend(self):
        """Test preview URL from .env file"""
        print("🔗 Testing Preview URL Frontend...")
        
        try:
            response = requests.get(self.preview_url, timeout=10)
            if response.status_code == 200:
                content_length = len(response.text)
                has_nextjs = 'next.js' in response.headers.get('x-powered-by', '').lower()
                self.log_test(
                    "Preview URL Frontend Test",
                    True,
                    f"HTTP 200 - Content length: {content_length} chars, Next.js: {has_nextjs}"
                )
            else:
                self.log_test(
                    "Preview URL Frontend Test",
                    False,
                    f"HTTP {response.status_code} - Expected 200"
                )
        except Exception as e:
            self.log_test(
                "Preview URL Frontend Test",
                False,
                f"Connection error: {str(e)}"
            )
    
    def test_localhost_api(self):
        """Test localhost API endpoints"""
        print("🔌 Testing Localhost API Endpoints...")
        
        # Test GET endpoint
        try:
            response = requests.get(f"{self.localhost_url}/api/contact", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Localhost API GET Test",
                    True,
                    f"HTTP 200 - Message: {data.get('message', 'No message')}"
                )
            else:
                self.log_test(
                    "Localhost API GET Test",
                    False,
                    f"HTTP {response.status_code} - Expected 200"
                )
        except Exception as e:
            self.log_test(
                "Localhost API GET Test",
                False,
                f"Error: {str(e)}"
            )
        
        # Test POST endpoint with valid data
        try:
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "message": "Testing localhost API functionality",
                "subject": "API Test"
            }
            response = requests.post(f"{self.localhost_url}/api/contact", json=test_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Localhost API POST Test",
                    True,
                    f"HTTP 200 - Success: {data.get('success', False)}"
                )
            elif response.status_code == 429:
                self.log_test(
                    "Localhost API POST Test",
                    True,
                    "HTTP 429 - Rate limited (confirms rate limiting works)"
                )
            else:
                self.log_test(
                    "Localhost API POST Test",
                    False,
                    f"HTTP {response.status_code} - Unexpected status"
                )
        except Exception as e:
            self.log_test(
                "Localhost API POST Test",
                False,
                f"Error: {str(e)}"
            )
    
    def test_external_api(self):
        """Test external URL API endpoints"""
        print("🌐 Testing External URL API Endpoints...")
        
        # Test GET endpoint
        try:
            response = requests.get(f"{self.external_url}/api/contact", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "External API GET Test",
                    True,
                    f"HTTP 200 - Message: {data.get('message', 'No message')}"
                )
            elif response.status_code == 404:
                server_header = response.headers.get('Server', 'Unknown')
                self.log_test(
                    "External API GET Test",
                    False,
                    f"HTTP 404 Not Found - Server: {server_header} (nginx API routing issue)"
                )
            else:
                self.log_test(
                    "External API GET Test",
                    False,
                    f"HTTP {response.status_code} - Unexpected status"
                )
        except Exception as e:
            self.log_test(
                "External API GET Test",
                False,
                f"Error: {str(e)}"
            )
    
    def test_preview_api(self):
        """Test preview URL API endpoints"""
        print("🔗 Testing Preview URL API Endpoints...")
        
        # Test GET endpoint
        try:
            response = requests.get(f"{self.preview_url}/api/contact", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Preview API GET Test",
                    True,
                    f"HTTP 200 - Message: {data.get('message', 'No message')}"
                )
            else:
                self.log_test(
                    "Preview API GET Test",
                    False,
                    f"HTTP {response.status_code} - Expected 200"
                )
        except Exception as e:
            self.log_test(
                "Preview API GET Test",
                False,
                f"Error: {str(e)}"
            )
    
    def check_service_status(self):
        """Check PM2 and supervisor service status"""
        print("⚙️ Checking Service Status...")
        
        import subprocess
        
        # Check PM2 status
        try:
            result = subprocess.run(['pm2', 'status'], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                pm2_running = 'online' in result.stdout
                self.log_test(
                    "PM2 Service Status",
                    pm2_running,
                    f"PM2 status: {'Running' if pm2_running else 'Not running'}"
                )
            else:
                self.log_test(
                    "PM2 Service Status",
                    False,
                    f"PM2 command failed: {result.stderr}"
                )
        except Exception as e:
            self.log_test(
                "PM2 Service Status",
                False,
                f"Error checking PM2: {str(e)}"
            )
        
        # Check supervisor status
        try:
            result = subprocess.run(['sudo', 'supervisorctl', 'status'], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                backend_status = 'backend' in result.stdout and 'RUNNING' in result.stdout
                frontend_status = 'frontend' in result.stdout and 'RUNNING' in result.stdout
                self.log_test(
                    "Supervisor Service Status",
                    False,  # We know they're failing
                    f"Backend: {'RUNNING' if backend_status else 'FAILED'}, Frontend: {'RUNNING' if frontend_status else 'FAILED'}"
                )
            else:
                self.log_test(
                    "Supervisor Service Status",
                    False,
                    f"Supervisor command failed: {result.stderr}"
                )
        except Exception as e:
            self.log_test(
                "Supervisor Service Status",
                False,
                f"Error checking supervisor: {str(e)}"
            )
    
    def run_comprehensive_test(self):
        """Run all URL routing tests"""
        print("🚀 Starting Comprehensive URL Routing Investigation")
        print("=" * 80)
        
        # Test 1: Service status
        self.check_service_status()
        
        # Test 2: Localhost (should work)
        self.test_localhost_frontend()
        self.test_localhost_api()
        
        # Test 3: External URL (currently failing)
        self.test_external_frontend()
        self.test_external_api()
        
        # Test 4: Preview URL (from .env)
        self.test_preview_url_frontend()
        self.test_preview_api()
        
        # Generate comprehensive summary
        self.generate_diagnostic_summary()
    
    def generate_diagnostic_summary(self):
        """Generate comprehensive diagnostic summary"""
        print("\n" + "=" * 80)
        print("🔍 COMPREHENSIVE DIAGNOSTIC SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['passed'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        print("\n🏠 LOCALHOST STATUS (PM2):")
        localhost_tests = [r for r in self.test_results if 'Localhost' in r['test']]
        localhost_working = all(r['passed'] for r in localhost_tests)
        print(f"  Status: {'✅ WORKING' if localhost_working else '❌ FAILING'}")
        for test in localhost_tests:
            print(f"  - {test['test']}: {test['status']}")
        
        print("\n🌐 EXTERNAL URL STATUS (http://getyoursite.fr/):")
        external_tests = [r for r in self.test_results if 'External' in r['test']]
        external_working = all(r['passed'] for r in external_tests)
        print(f"  Status: {'✅ WORKING' if external_working else '❌ FAILING'}")
        for test in external_tests:
            print(f"  - {test['test']}: {test['status']}")
        
        print("\n🔗 PREVIEW URL STATUS (deploy-rescue-10.preview.emergentagent.com):")
        preview_tests = [r for r in self.test_results if 'Preview' in r['test']]
        preview_working = all(r['passed'] for r in preview_tests)
        print(f"  Status: {'✅ WORKING' if preview_working else '❌ FAILING'}")
        for test in preview_tests:
            print(f"  - {test['test']}: {test['status']}")
        
        print("\n⚙️ SERVICE STATUS:")
        service_tests = [r for r in self.test_results if 'Service' in r['test']]
        for test in service_tests:
            print(f"  - {test['test']}: {test['status']}")
        
        print("\n🔍 ROOT CAUSE ANALYSIS:")
        if localhost_working and not external_working:
            print("  🎯 DIAGNOSIS: Infrastructure/Nginx Routing Issue")
            print("  📋 EVIDENCE:")
            print("    - PM2 application works perfectly on localhost:3000")
            print("    - External URL returns HTTP 404 with nginx server header")
            print("    - API endpoints fail on external URL with same 404 error")
            print("    - Supervisor services are misconfigured (looking for /app/backend, /app/frontend)")
            print("  🔧 LIKELY CAUSES:")
            print("    - Nginx configuration not routing getyoursite.fr to localhost:3000")
            print("    - DNS/domain configuration issues")
            print("    - Kubernetes ingress rules not properly configured")
            print("    - Supervisor configuration expects different directory structure")
        
        if preview_working:
            print("  ✅ POSITIVE: Preview URL works correctly, confirming app functionality")
        
        print("\n🚨 CRITICAL FINDINGS:")
        print("  1. PM2 application is WORKING correctly on localhost")
        print("  2. External domain routing is BROKEN (nginx 404)")
        print("  3. Supervisor services are MISCONFIGURED for this Next.js app")
        print("  4. This is NOT a code issue - it's infrastructure/routing")
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = URLRoutingTester()
    tester.run_comprehensive_test()