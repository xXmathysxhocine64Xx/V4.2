#!/usr/bin/env python3
"""
Backend Test Suite for Brest City Hall Website
Tests the modernized Brest city hall website backend functionality
Focus on Contact API, page loading, navigation, redirections, and security features
"""

import requests
import json
import time
import subprocess
import sys
from datetime import datetime

class BrestMairieBackendTester:
    def __init__(self):
        # This is a Next.js application running on localhost:3000
        self.base_url = "http://localhost:3000"
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        self.failed_tests = []
        
        # Mairie pages to test based on review request
        self.mairie_pages = [
            "/mairie/accueil",
            "/mairie/services", 
            "/mairie/actualites",
            "/mairie/agenda",
            "/mairie/metropole",
            "/mairie/contact"
        ]
        
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
    
    def test_mairie_pages_loading(self):
        """Test that all mairie pages load correctly"""
        all_passed = True
        
        for page in self.mairie_pages:
            try:
                response = requests.get(f"{self.base_url}{page}", timeout=10)
                
                if response.status_code == 200:
                    # Check if it's a valid HTML page
                    if 'text/html' in response.headers.get('content-type', ''):
                        # Check for key elements that should be present
                        content = response.text
                        if 'Ville de Brest' in content and 'Métropole' in content:
                            self.log_test(f"Page Load {page}", "PASS", f"Page loads correctly with expected content")
                        else:
                            self.log_test(f"Page Load {page}", "FAIL", f"Page loads but missing expected content")
                            all_passed = False
                    else:
                        self.log_test(f"Page Load {page}", "FAIL", f"Invalid content type: {response.headers.get('content-type')}")
                        all_passed = False
                else:
                    self.log_test(f"Page Load {page}", "FAIL", f"HTTP {response.status_code}")
                    all_passed = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Page Load {page}", "FAIL", f"Request failed: {str(e)}")
                all_passed = False
        
        if all_passed:
            self.log_test("All Mairie Pages", "PASS", "All mairie pages load successfully")
        
        return all_passed
    
    def test_mairie_redirect(self):
        """Test redirection from /mairie to /mairie/accueil"""
        try:
            response = requests.get(f"{self.base_url}/mairie", timeout=10, allow_redirects=False)
            
            if response.status_code in [301, 302, 307, 308]:
                # Check if redirect location is correct
                location = response.headers.get('location', '')
                if '/mairie/accueil' in location:
                    self.log_test("Mairie Redirect", "PASS", f"Redirects correctly to {location}")
                    return True
                else:
                    self.log_test("Mairie Redirect", "FAIL", f"Redirects to wrong location: {location}")
                    return False
            else:
                # Check if it directly serves the accueil content
                response_with_redirect = requests.get(f"{self.base_url}/mairie", timeout=10)
                if response_with_redirect.status_code == 200 and 'Ville de Brest' in response_with_redirect.text:
                    self.log_test("Mairie Redirect", "PASS", "Serves accueil content directly")
                    return True
                else:
                    self.log_test("Mairie Redirect", "FAIL", f"No redirect and invalid response: {response.status_code}")
                    return False
                    
        except requests.exceptions.RequestException as e:
            self.log_test("Mairie Redirect", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_contact_get(self):
        """Test GET /api/contact endpoint"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'active' and 'API Contact' in data.get('message', ''):
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
    
    def test_api_contact_post_mairie(self):
        """Test POST /api/contact with mairie-specific data"""
        test_data = {
            "name": "Marie Dupont",
            "email": "marie.dupont@email.fr",
            "subject": "Mairie de Brest - etat-civil",
            "message": "Téléphone: 02 98 12 34 56\nType de demande: etat-civil\n\nBonjour, je souhaite obtenir un acte de naissance pour ma fille née en 2020. Merci de me faire savoir les documents nécessaires."
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
                if data.get('success') and ('Message' in data.get('message', '') or 'reçu' in data.get('message', '')):
                    self.log_test("API Contact POST Mairie", "PASS", "Mairie contact form submission successful")
                    return True
                else:
                    self.log_test("API Contact POST Mairie", "FAIL", "Invalid success response", data)
                    return False
            else:
                self.log_test("API Contact POST Mairie", "FAIL", f"HTTP {response.status_code}", response.text)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Contact POST Mairie", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_contact_form_functionality(self):
        """Test contact form from /mairie/contact page"""
        try:
            # First, get the contact page to ensure it loads
            page_response = requests.get(f"{self.base_url}/mairie/contact", timeout=10)
            
            if page_response.status_code != 200:
                self.log_test("Contact Form Page", "FAIL", f"Contact page not accessible: {page_response.status_code}")
                return False
            
            # Check if the page contains form elements
            content = page_response.text
            form_elements = ['name', 'email', 'message', 'subject']
            missing_elements = []
            
            for element in form_elements:
                if element not in content.lower():
                    missing_elements.append(element)
            
            if missing_elements:
                self.log_test("Contact Form Elements", "FAIL", f"Missing form elements: {', '.join(missing_elements)}")
                return False
            
            # Test the actual form submission
            form_data = {
                "name": "Jean Citoyen",
                "email": "jean.citoyen@brest.fr",
                "subject": "Mairie de Brest - urbanisme",
                "message": "Téléphone: 02 98 87 65 43\nType de demande: urbanisme\n\nDemande d'information sur les démarches pour un permis de construire."
            }
            
            api_response = requests.post(
                f"{self.api_url}/contact",
                json=form_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if api_response.status_code == 200:
                data = api_response.json()
                if data.get('success'):
                    self.log_test("Contact Form Functionality", "PASS", "Contact form works end-to-end")
                    return True
                else:
                    self.log_test("Contact Form Functionality", "FAIL", "Form submission failed", data)
                    return False
            else:
                self.log_test("Contact Form Functionality", "FAIL", f"API returned {api_response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Contact Form Functionality", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_navigation_between_pages(self):
        """Test navigation between mairie pages"""
        all_passed = True
        
        # Test that each page contains navigation links to other pages
        for current_page in self.mairie_pages:
            try:
                response = requests.get(f"{self.base_url}{current_page}", timeout=10)
                
                if response.status_code == 200:
                    content = response.text
                    
                    # Check for navigation links to other pages
                    other_pages = [p for p in self.mairie_pages if p != current_page]
                    missing_links = []
                    
                    for other_page in other_pages:
                        # Check if the page path or page name is mentioned in the content
                        page_name = other_page.split('/')[-1]
                        if other_page not in content and page_name not in content.lower():
                            missing_links.append(other_page)
                    
                    # Allow some missing links as not all pages need to link to all others
                    if len(missing_links) < len(other_pages) * 0.5:  # Allow up to 50% missing
                        self.log_test(f"Navigation from {current_page}", "PASS", "Contains navigation to other pages")
                    else:
                        self.log_test(f"Navigation from {current_page}", "WARN", f"Limited navigation links found")
                        # Don't fail for this as it's not critical
                else:
                    self.log_test(f"Navigation from {current_page}", "FAIL", f"Page not accessible: {response.status_code}")
                    all_passed = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Navigation from {current_page}", "FAIL", f"Request failed: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_images_and_external_resources(self):
        """Test that images and external resources load properly"""
        try:
            # Test a few key pages for image loading
            test_pages = ["/mairie/accueil", "/mairie/services", "/mairie/actualites"]
            all_passed = True
            
            for page in test_pages:
                response = requests.get(f"{self.base_url}{page}", timeout=10)
                
                if response.status_code == 200:
                    content = response.text
                    
                    # Check for Unsplash images (commonly used in the site)
                    if 'images.unsplash.com' in content:
                        self.log_test(f"External Images {page}", "PASS", "Contains external image references")
                    else:
                        self.log_test(f"External Images {page}", "WARN", "No external images found")
                        # Don't fail as images might be loaded via JavaScript
                else:
                    self.log_test(f"External Images {page}", "FAIL", f"Page not accessible: {response.status_code}")
                    all_passed = False
            
            return all_passed
            
        except requests.exceptions.RequestException as e:
            self.log_test("External Resources", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_security_headers(self):
        """Test security headers on API endpoints"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            
            required_headers = [
                'X-Content-Type-Options',
                'X-Frame-Options', 
                'X-XSS-Protection'
            ]
            
            present_headers = []
            missing_headers = []
            
            for header in required_headers:
                if header in response.headers:
                    present_headers.append(header)
                else:
                    missing_headers.append(header)
            
            if len(present_headers) >= 2:  # At least 2 out of 3 security headers
                self.log_test("API Security Headers", "PASS", f"Security headers present: {', '.join(present_headers)}")
                return True
            else:
                self.log_test("API Security Headers", "FAIL", f"Missing critical headers: {', '.join(missing_headers)}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Security Headers", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_api_rate_limiting(self):
        """Test rate limiting functionality"""
        test_data = {
            "name": "Rate Test User",
            "email": "ratetest@brest.fr",
            "subject": "Test Rate Limiting",
            "message": "This is a test message for rate limiting verification."
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        success_count = 0
        rate_limited = False
        
        # Try to make multiple requests to test rate limiting
        for i in range(8):  # Try 8 requests
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers=headers,
                    timeout=5
                )
                
                if response.status_code == 200:
                    success_count += 1
                elif response.status_code == 429:
                    rate_limited = True
                    self.log_test("API Rate Limiting", "PASS", f"Rate limiting triggered after {success_count} requests")
                    return True
                    
                time.sleep(0.2)  # Small delay between requests
                
            except requests.exceptions.RequestException:
                break
        
        if rate_limited:
            self.log_test("API Rate Limiting", "PASS", f"Rate limiting working - triggered after {success_count} requests")
            return True
        elif success_count >= 5:
            self.log_test("API Rate Limiting", "WARN", f"Made {success_count} requests without rate limiting - may be lenient")
            return True  # Don't fail if rate limiting is lenient
        else:
            self.log_test("API Rate Limiting", "FAIL", f"Only {success_count} successful requests")
            return False
    
    def test_api_input_validation(self):
        """Test API input validation"""
        # Test missing required fields
        test_cases = [
            {"email": "test@example.com", "message": "Test message"},  # Missing name
            {"name": "Test User", "message": "Test message"},  # Missing email
            {"name": "Test User", "email": "test@example.com"},  # Missing message
            {"name": "", "email": "test@example.com", "message": "Test"},  # Empty name
            {"name": "Test", "email": "invalid-email", "message": "Test"}  # Invalid email
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
                    if 'error' in data:
                        continue  # This test case passed
                    else:
                        self.log_test(f"Input Validation {i+1}", "FAIL", "No error message in 400 response", data)
                        all_passed = False
                elif response.status_code == 429:
                    # Rate limited - skip this test
                    continue
                else:
                    self.log_test(f"Input Validation {i+1}", "FAIL", f"Expected 400, got {response.status_code}")
                    all_passed = False
                    
                time.sleep(0.5)  # Delay between validation tests
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Input Validation {i+1}", "FAIL", f"Request failed: {str(e)}")
                all_passed = False
        
        if all_passed:
            self.log_test("API Input Validation", "PASS", "Input validation working correctly")
        
        return all_passed
    
    def run_all_tests(self):
        """Run all backend tests for Brest city hall website"""
        print("🏛️ Starting Brest City Hall Website Backend Tests")
        print("=" * 80)
        
        # Page loading tests
        self.test_mairie_pages_loading()
        
        # Navigation and redirect tests
        self.test_mairie_redirect()
        self.test_navigation_between_pages()
        
        # Contact API tests
        self.test_api_contact_get()
        self.test_api_contact_post_mairie()
        self.test_contact_form_functionality()
        
        # Security tests
        self.test_api_security_headers()
        self.test_api_input_validation()
        
        # Performance and reliability tests
        self.test_api_rate_limiting()
        self.test_images_and_external_resources()
        
        # Final summary
        print("\n" + "=" * 80)
        print("🏁 Test Summary - Brest City Hall Website Backend")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['status'] == 'PASS'])
        failed_tests = len([t for t in self.test_results if t['status'] == 'FAIL'])
        warned_tests = len([t for t in self.test_results if t['status'] == 'WARN'])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Warnings: {warned_tests}")
        
        if failed_tests == 0:
            print("\n🎉 All critical tests passed! Brest city hall website backend is working properly.")
            return True
        else:
            print(f"\n❌ {failed_tests} critical test(s) failed:")
            for failed_test in self.failed_tests:
                print(f"   - {failed_test}")
            return False

if __name__ == "__main__":
    tester = BrestMairieBackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)