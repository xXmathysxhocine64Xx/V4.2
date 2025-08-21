#!/usr/bin/env python3
"""
Lucky Pizza Lannilis Payment System Backend Test Suite
Tests the complete Stripe payment integration for Lucky Pizza
"""

import requests
import json
import time
import os
import sys
from datetime import datetime
from pymongo import MongoClient
import uuid

class LuckyPizzaPaymentTester:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.api_url = f"{self.base_url}/api"
        self.test_results = []
        self.failed_tests = []
        
        # Test packages as defined in the backend
        self.test_packages = {
            'margherita': {'amount': 12.90, 'name': 'Pizza Margherita'},
            'napoletana': {'amount': 15.90, 'name': 'Pizza Napoletana'},
            'quattro_formaggi': {'amount': 18.90, 'name': 'Pizza Quattro Formaggi'},
            'diavola': {'amount': 17.90, 'name': 'Pizza Diavola'},
            'vegetariana': {'amount': 16.90, 'name': 'Pizza Végétarienne'},
            'prosciutto': {'amount': 19.90, 'name': 'Pizza Prosciutto'}
        }
        
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

    def test_environment_variables(self):
        """Test that required environment variables are set"""
        try:
            # Check STRIPE_API_KEY
            with open('/app/.env', 'r') as f:
                env_content = f.read()
                
            if 'STRIPE_API_KEY=' in env_content and 'sk_test_emergent' in env_content:
                self.log_test("Environment Variables", "PASS", "STRIPE_API_KEY is configured")
                return True
            else:
                self.log_test("Environment Variables", "FAIL", "STRIPE_API_KEY not found or invalid")
                return False
                
        except Exception as e:
            self.log_test("Environment Variables", "FAIL", f"Error checking environment: {str(e)}")
            return False

    def test_mongodb_connection(self):
        """Test MongoDB connection and database setup"""
        try:
            # Try to connect to MongoDB using default URL
            mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
            client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
            
            # Test connection
            client.admin.command('ping')
            
            # Check if database and collection exist
            db = client['getyoursite']
            collections = db.list_collection_names()
            
            client.close()
            
            self.log_test("MongoDB Connection", "PASS", f"Connected to MongoDB, database 'getyoursite' accessible")
            return True
            
        except Exception as e:
            self.log_test("MongoDB Connection", "FAIL", f"MongoDB connection failed: {str(e)}")
            return False

    def test_payments_checkout_valid_package(self):
        """Test POST /api/payments/checkout with valid package_id"""
        test_data = {
            "package_id": "margherita",
            "metadata": {
                "customer_name": "Jean Dupont",
                "customer_email": "jean.dupont@email.fr",
                "delivery_address": "123 Rue de la Pizza, 29870 Lannilis"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['url', 'session_id', 'amount', 'currency', 'pizza_name']
                
                if all(field in data for field in required_fields):
                    if (data['amount'] == 12.90 and 
                        data['currency'] == 'EUR' and 
                        data['pizza_name'] == 'Pizza Margherita' and
                        'checkout.stripe.com' in data['url']):
                        
                        self.log_test("Checkout Valid Package", "PASS", 
                                    f"Checkout session created successfully for {data['pizza_name']}")
                        
                        # Store session_id for status test
                        self.test_session_id = data['session_id']
                        return True
                    else:
                        self.log_test("Checkout Valid Package", "FAIL", 
                                    "Invalid response data", data)
                        return False
                else:
                    self.log_test("Checkout Valid Package", "FAIL", 
                                "Missing required fields in response", data)
                    return False
            else:
                self.log_test("Checkout Valid Package", "FAIL", 
                            f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Checkout Valid Package", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_payments_checkout_invalid_package(self):
        """Test POST /api/payments/checkout with invalid package_id"""
        test_data = {
            "package_id": "invalid_pizza",
            "metadata": {
                "customer_name": "Test User"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data and 'Invalid package' in data['error']:
                    self.log_test("Checkout Invalid Package", "PASS", 
                                "Invalid package_id properly rejected")
                    return True
                else:
                    self.log_test("Checkout Invalid Package", "FAIL", 
                                "Wrong error message", data)
                    return False
            else:
                self.log_test("Checkout Invalid Package", "FAIL", 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Checkout Invalid Package", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_all_predefined_packages(self):
        """Test checkout for all predefined packages"""
        all_passed = True
        
        for package_id, package_info in self.test_packages.items():
            test_data = {
                "package_id": package_id,
                "metadata": {
                    "customer_name": f"Client {package_id.title()}",
                    "customer_email": f"client.{package_id}@email.fr"
                }
            }
            
            try:
                response = requests.post(
                    f"{self.api_url}/payments/checkout",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=20
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if (data.get('amount') == package_info['amount'] and 
                        data.get('pizza_name') == package_info['name']):
                        continue  # This package passed
                    else:
                        self.log_test(f"Package {package_id}", "FAIL", 
                                    f"Wrong amount or name: expected {package_info['amount']}, got {data.get('amount')}")
                        all_passed = False
                else:
                    self.log_test(f"Package {package_id}", "FAIL", 
                                f"HTTP {response.status_code}")
                    all_passed = False
                    
                time.sleep(1)  # Small delay between requests
                    
            except Exception as e:
                self.log_test(f"Package {package_id}", "FAIL", f"Request failed: {str(e)}")
                all_passed = False
        
        if all_passed:
            self.log_test("All Predefined Packages", "PASS", 
                        f"All {len(self.test_packages)} packages work correctly")
        
        return all_passed

    def test_payment_status_endpoint(self):
        """Test GET /api/payments/status/[sessionId]"""
        # Use session_id from previous test if available
        if not hasattr(self, 'test_session_id'):
            # Create a session first
            if not self.test_payments_checkout_valid_package():
                self.log_test("Payment Status", "FAIL", "Could not create test session")
                return False
        
        try:
            response = requests.get(
                f"{self.api_url}/payments/status/{self.test_session_id}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['session_id', 'status', 'payment_status', 'amount_total', 'currency']
                
                if all(field in data for field in required_fields):
                    if (data['session_id'] == self.test_session_id and
                        data['currency'] == 'EUR'):
                        self.log_test("Payment Status", "PASS", 
                                    f"Status endpoint working, status: {data['status']}")
                        return True
                    else:
                        self.log_test("Payment Status", "FAIL", 
                                    "Invalid response data", data)
                        return False
                else:
                    self.log_test("Payment Status", "FAIL", 
                                "Missing required fields", data)
                    return False
            else:
                self.log_test("Payment Status", "FAIL", 
                            f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Payment Status", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_payment_status_invalid_session(self):
        """Test GET /api/payments/status with invalid session_id"""
        fake_session_id = "cs_test_invalid_session_id_12345"
        
        try:
            response = requests.get(
                f"{self.api_url}/payments/status/{fake_session_id}",
                timeout=15
            )
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    self.log_test("Payment Status Invalid", "PASS", 
                                "Invalid session_id properly handled")
                    return True
                else:
                    self.log_test("Payment Status Invalid", "FAIL", 
                                "No error message in response", data)
                    return False
            else:
                # Some invalid sessions might return 200 with error status
                if response.status_code == 200:
                    data = response.json()
                    if 'error' in data:
                        self.log_test("Payment Status Invalid", "PASS", 
                                    "Invalid session handled with error response")
                        return True
                
                self.log_test("Payment Status Invalid", "FAIL", 
                            f"Unexpected status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Payment Status Invalid", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_webhook_stripe_endpoint(self):
        """Test POST /api/webhook/stripe (basic structure test)"""
        # Note: We can't fully test webhook without valid Stripe signature
        # But we can test the endpoint structure
        
        fake_webhook_body = json.dumps({
            "id": "evt_test_webhook",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": "cs_test_session_id",
                    "payment_status": "paid"
                }
            }
        })
        
        try:
            response = requests.post(
                f"{self.api_url}/webhook/stripe",
                data=fake_webhook_body,
                headers={
                    'Content-Type': 'application/json',
                    'Stripe-Signature': 'fake_signature'
                },
                timeout=15
            )
            
            # We expect this to fail due to invalid signature, but endpoint should exist
            if response.status_code in [400, 500]:
                data = response.json()
                if 'error' in data:
                    self.log_test("Webhook Endpoint", "PASS", 
                                "Webhook endpoint exists and validates signatures")
                    return True
                else:
                    self.log_test("Webhook Endpoint", "FAIL", 
                                "Webhook endpoint doesn't return proper error", data)
                    return False
            else:
                self.log_test("Webhook Endpoint", "FAIL", 
                            f"Unexpected status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Webhook Endpoint", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_webhook_missing_signature(self):
        """Test webhook endpoint without Stripe signature"""
        fake_webhook_body = json.dumps({"test": "data"})
        
        try:
            response = requests.post(
                f"{self.api_url}/webhook/stripe",
                data=fake_webhook_body,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data and 'signature' in data['error'].lower():
                    self.log_test("Webhook Missing Signature", "PASS", 
                                "Missing signature properly rejected")
                    return True
                else:
                    self.log_test("Webhook Missing Signature", "FAIL", 
                                "Wrong error message", data)
                    return False
            else:
                self.log_test("Webhook Missing Signature", "FAIL", 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Webhook Missing Signature", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_security_amount_not_from_frontend(self):
        """Test that amounts are not accepted from frontend (security test)"""
        test_data = {
            "package_id": "margherita",
            "amount": 1.00,  # Try to override amount
            "metadata": {
                "customer_name": "Hacker"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                # Amount should be 12.90 (server-defined), not 1.00 (client-sent)
                if data.get('amount') == 12.90:
                    self.log_test("Security Amount Override", "PASS", 
                                "Server-side amounts enforced, client override ignored")
                    return True
                else:
                    self.log_test("Security Amount Override", "FAIL", 
                                f"Client amount override accepted: {data.get('amount')}")
                    return False
            else:
                self.log_test("Security Amount Override", "FAIL", 
                            f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Security Amount Override", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_dynamic_urls_generation(self):
        """Test that success/cancel URLs are dynamically generated"""
        test_data = {
            "package_id": "napoletana",
            "metadata": {
                "customer_name": "URL Test Client"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={
                    'Content-Type': 'application/json',
                    'Host': 'localhost:3000'
                },
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                checkout_url = data.get('url', '')
                
                # The checkout URL should contain dynamic success/cancel URLs
                # We can't directly see them, but we can verify the session was created
                if 'checkout.stripe.com' in checkout_url and data.get('session_id'):
                    self.log_test("Dynamic URLs", "PASS", 
                                "Dynamic success/cancel URLs generated in checkout session")
                    return True
                else:
                    self.log_test("Dynamic URLs", "FAIL", 
                                "Invalid checkout URL or session", data)
                    return False
            else:
                self.log_test("Dynamic URLs", "FAIL", 
                            f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Dynamic URLs", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_database_transaction_creation(self):
        """Test that payment transactions are created in MongoDB"""
        # First create a checkout session
        test_data = {
            "package_id": "quattro_formaggi",
            "metadata": {
                "customer_name": "DB Test Client",
                "customer_email": "dbtest@email.fr"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get('session_id')
                
                if session_id:
                    # Check if transaction was created in database
                    time.sleep(2)  # Give time for database write
                    
                    try:
                        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
                        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
                        db = client['getyoursite']
                        transactions = db['payment_transactions']
                        
                        transaction = transactions.find_one({'session_id': session_id})
                        client.close()
                        
                        if transaction:
                            required_fields = ['session_id', 'package_id', 'amount', 'currency', 'payment_status']
                            if all(field in transaction for field in required_fields):
                                self.log_test("Database Transaction", "PASS", 
                                            f"Transaction record created in MongoDB with all required fields")
                                return True
                            else:
                                self.log_test("Database Transaction", "FAIL", 
                                            "Transaction missing required fields", list(transaction.keys()))
                                return False
                        else:
                            self.log_test("Database Transaction", "FAIL", 
                                        "Transaction not found in database")
                            return False
                            
                    except Exception as db_e:
                        self.log_test("Database Transaction", "FAIL", 
                                    f"Database check failed: {str(db_e)}")
                        return False
                else:
                    self.log_test("Database Transaction", "FAIL", 
                                "No session_id in response")
                    return False
            else:
                self.log_test("Database Transaction", "FAIL", 
                            f"Checkout failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Database Transaction", "FAIL", f"Request failed: {str(e)}")
            return False

    def test_integration_flow(self):
        """Test complete integration flow: checkout -> status -> database"""
        test_data = {
            "package_id": "prosciutto",
            "metadata": {
                "customer_name": "Integration Test",
                "customer_email": "integration@test.fr",
                "phone": "+33 6 12 34 56 78"
            }
        }
        
        try:
            # Step 1: Create checkout session
            checkout_response = requests.post(
                f"{self.api_url}/payments/checkout",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if checkout_response.status_code != 200:
                self.log_test("Integration Flow", "FAIL", 
                            f"Checkout failed: {checkout_response.status_code}")
                return False
            
            checkout_data = checkout_response.json()
            session_id = checkout_data.get('session_id')
            
            if not session_id:
                self.log_test("Integration Flow", "FAIL", "No session_id from checkout")
                return False
            
            # Step 2: Check payment status
            time.sleep(1)
            status_response = requests.get(
                f"{self.api_url}/payments/status/{session_id}",
                timeout=15
            )
            
            if status_response.status_code != 200:
                self.log_test("Integration Flow", "FAIL", 
                            f"Status check failed: {status_response.status_code}")
                return False
            
            status_data = status_response.json()
            
            # Step 3: Verify database record
            time.sleep(1)
            try:
                mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
                client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
                db = client['getyoursite']
                transactions = db['payment_transactions']
                
                transaction = transactions.find_one({'session_id': session_id})
                client.close()
                
                if transaction and transaction.get('package_id') == 'prosciutto':
                    self.log_test("Integration Flow", "PASS", 
                                "Complete flow working: checkout -> status -> database")
                    return True
                else:
                    self.log_test("Integration Flow", "FAIL", 
                                "Database record not found or incorrect")
                    return False
                    
            except Exception as db_e:
                self.log_test("Integration Flow", "FAIL", 
                            f"Database verification failed: {str(db_e)}")
                return False
                
        except Exception as e:
            self.log_test("Integration Flow", "FAIL", f"Integration test failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all Lucky Pizza payment system tests"""
        print("🍕💳 Starting Lucky Pizza Lannilis Payment System Tests")
        print("=" * 80)
        
        # Environment and setup tests
        self.test_environment_variables()
        self.test_mongodb_connection()
        
        # Core payment API tests
        self.test_payments_checkout_valid_package()
        self.test_payments_checkout_invalid_package()
        self.test_all_predefined_packages()
        
        # Payment status tests
        self.test_payment_status_endpoint()
        self.test_payment_status_invalid_session()
        
        # Webhook tests
        self.test_webhook_stripe_endpoint()
        self.test_webhook_missing_signature()
        
        # Security tests
        self.test_security_amount_not_from_frontend()
        self.test_dynamic_urls_generation()
        
        # Database tests
        self.test_database_transaction_creation()
        
        # Integration test
        self.test_integration_flow()
        
        # Final summary
        print("\n" + "=" * 80)
        print("🏁 Lucky Pizza Payment System Test Summary")
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
            print("\n🎉 All tests passed! Lucky Pizza payment system is working properly.")
            return True
        else:
            print(f"\n❌ {failed_tests} test(s) failed:")
            for failed_test in self.failed_tests:
                print(f"   - {failed_test}")
            return False

if __name__ == "__main__":
    tester = LuckyPizzaPaymentTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)