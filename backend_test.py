
import requests
import sys
import json
import uuid
from datetime import datetime

class PhoneFlipAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_listing_id = None
        self.auth_token = None
        self.user_data = None
        self.test_user_email = f"test_user_{uuid.uuid4().hex[:8]}@example.com"
        self.test_user_password = "Test@123456"
        self.test_shop_owner_email = f"shop_owner_{uuid.uuid4().hex[:8]}@example.com"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.auth_token:
            headers['Authorization'] = f"Bearer {self.auth_token}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            
            # Print response status and data for debugging
            print(f"Response Status: {response.status_code}")
            print(f"Response Data: {response.text[:200]}..." if len(response.text) > 200 else f"Response Data: {response.text}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except json.JSONDecodeError:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register_normal_user(self):
        """Test registering a normal user"""
        test_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "password": self.test_user_password,
            "phone": "03001234567",
            "role": "normal_user"
        }
        
        success, response = self.run_test(
            "Register Normal User",
            "POST",
            "api/auth/register",
            200,
            data=test_data
        )
        
        if success and "access_token" in response:
            self.auth_token = response["access_token"]
            self.user_data = response["user"]
            print(f"Registered user with email: {self.test_user_email}")
        
        return success, response
    
    def test_login(self):
        """Test user login"""
        test_data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data=test_data
        )
        
        if success and "access_token" in response:
            self.auth_token = response["access_token"]
            self.user_data = response["user"]
            print(f"Logged in user with email: {self.test_user_email}")
        
        return success, response
    
    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.auth_token:
            print("❌ No auth token available, skipping test")
            return False, {}
        
        return self.run_test(
            "Get Current User Info",
            "GET",
            "api/auth/me",
            200,
            auth=True
        )
    
    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "api",
            200
        )
    
    def test_get_listings(self):
        """Test getting all listings"""
        return self.run_test(
            "Get All Listings",
            "GET",
            "api/listings",
            200
        )
    
    def test_get_featured_listings(self):
        """Test getting featured listings"""
        return self.run_test(
            "Get Featured Listings",
            "GET",
            "api/listings/featured",
            200
        )
    
    def test_get_stats(self):
        """Test getting platform statistics"""
        return self.run_test(
            "Get Platform Stats",
            "GET",
            "api/stats",
            200
        )
    
    def test_register_shop_owner(self):
        """Test registering a shop owner"""
        test_data = {
            "name": "Test Shop Owner",
            "email": self.test_shop_owner_email,
            "password": self.test_user_password,
            "phone": "03009876543",
            "business_details": {
                "business_name": "Test Mobile Shop",
                "business_type": "mobile_shop",
                "business_address": "123 Test Street",
                "city": "Karachi",
                "postal_code": "75000",
                "business_phone": "03009876543",
                "website": "https://testshop.com",
                "description": "This is a test shop for automated testing.",
                "years_in_business": 5
            },
            "kyc_documents": {
                "cnic_front": "dGVzdCBiYXNlNjQgZGF0YQ==",  # test base64 data
                "cnic_back": "dGVzdCBiYXNlNjQgZGF0YQ==",    # test base64 data
                "business_license": "dGVzdCBiYXNlNjQgZGF0YQ==",  # test base64 data
                "trade_license": "dGVzdCBiYXNlNjQgZGF0YQ=="      # test base64 data
            }
        }
        
        return self.run_test(
            "Register Shop Owner",
            "POST",
            "api/auth/register-shop-owner",
            200,
            data=test_data
        )
    
    def test_create_listing(self):
        """Test creating a new listing"""
        test_data = {
            "title": "iPhone 13 Pro Max",
            "description": "Excellent condition, barely used",
            "brand": "Apple",
            "model": "iPhone 13 Pro Max",
            "storage": "256GB",
            "color": "Graphite",
            "condition": "Good",
            "price": 120000,
            "city": "Karachi",
            "images": ["base64encodedimage1", "base64encodedimage2"]
        }
        
        success, response = self.run_test(
            "Create Listing",
            "POST",
            "api/listings",
            201,
            data=test_data,
            auth=True
        )
        
        if success and "id" in response:
            self.test_listing_id = response["id"]
            print(f"Created listing with ID: {self.test_listing_id}")
        
        return success, response
    
    def test_get_listing_by_id(self):
        """Test getting a listing by ID"""
        if not self.test_listing_id:
            print("❌ No listing ID available, skipping test")
            return False, {}
        
        return self.run_test(
            "Get Listing by ID",
            "GET",
            f"api/listings/{self.test_listing_id}",
            200
        )
    
    def test_filtered_listings(self):
        """Test getting filtered listings"""
        return self.run_test(
            "Get Filtered Listings",
            "GET",
            "api/listings",
            200,
            params={"brand": "Apple", "min_price": 50000, "max_price": 150000}
        )

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        # Test with invalid email
        test_data_invalid_email = {
            "email": "nonexistent@example.com",
            "password": self.test_user_password
        }
        
        success_invalid_email, _ = self.run_test(
            "Login with Invalid Email",
            "POST",
            "api/auth/login",
            401,
            data=test_data_invalid_email
        )
        
        # Test with invalid password
        test_data_invalid_password = {
            "email": self.test_user_email,
            "password": "WrongPassword123!"
        }
        
        success_invalid_password, _ = self.run_test(
            "Login with Invalid Password",
            "POST",
            "api/auth/login",
            401,
            data=test_data_invalid_password
        )
        
        return success_invalid_email and success_invalid_password

    def test_duplicate_registration(self):
        """Test registering with an email that already exists"""
        test_data = {
            "name": "Duplicate User",
            "email": self.test_user_email,  # Use the same email as the already registered user
            "password": self.test_user_password,
            "phone": "03001234567",
            "role": "normal_user"
        }
        
        return self.run_test(
            "Register with Duplicate Email",
            "POST",
            "api/auth/register",
            400,  # Expect 400 Bad Request
            data=test_data
        )

    def test_invalid_token_access(self):
        """Test accessing protected endpoint with invalid token"""
        # Create an invalid token
        invalid_token = self.auth_token + "invalid" if self.auth_token else "invalid_token"
        
        # Save the current token
        current_token = self.auth_token
        
        # Set the invalid token
        self.auth_token = invalid_token
        
        # Try to access protected endpoint
        success, _ = self.run_test(
            "Access Protected Endpoint with Invalid Token",
            "GET",
            "api/auth/me",
            401,  # Expect 401 Unauthorized
            auth=True
        )
        
        # Restore the original token
        self.auth_token = current_token
        
        return success

    def test_no_token_access(self):
        """Test accessing protected endpoint without token"""
        # Save the current token
        current_token = self.auth_token
        
        # Set token to None
        self.auth_token = None
        
        # Try to access protected endpoint
        success, _ = self.run_test(
            "Access Protected Endpoint without Token",
            "GET",
            "api/auth/me",
            401,  # Expect 401 Unauthorized
            auth=False
        )
        
        # Restore the original token
        self.auth_token = current_token
        
        return success

    def test_missing_fields_registration(self):
        """Test registration with missing required fields"""
        # Missing password and phone
        test_data_incomplete = {
            "name": "Incomplete User",
            "email": f"incomplete_{uuid.uuid4().hex[:8]}@example.com"
        }
        
        return self.run_test(
            "Register with Missing Fields",
            "POST",
            "api/auth/register",
            422,  # Expect 422 Unprocessable Entity (FastAPI validation error)
            data=test_data_incomplete
        )

def main():
    # Get backend URL from environment or use default
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                backend_url = line.strip().split('=')[1].strip('"\'')
                break
    
    print(f"Using backend URL: {backend_url}")
    
    # Setup tester
    tester = PhoneFlipAPITester(backend_url)
    
    # Run basic API test to check if server is running
    print("\n=== Testing Server Status ===")
    tester.test_api_root()
    
    # Run authentication tests
    print("\n=== Testing User Authentication ===")
    print("\n--- 1. User Registration Tests ---")
    tester.test_register_normal_user()
    tester.test_duplicate_registration()
    tester.test_missing_fields_registration()
    
    print("\n--- 2. User Login Tests ---")
    tester.test_login()
    tester.test_invalid_login()
    
    print("\n--- 3. Authentication Verification Tests ---")
    tester.test_get_current_user()
    tester.test_invalid_token_access()
    tester.test_no_token_access()
    
    print("\n--- 4. Shop Owner Registration Test ---")
    tester.test_register_shop_owner()
    
    # Print results
    print(f"\n📊 Authentication Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    # Print summary
    print("\n=== Authentication Testing Summary ===")
    print("✅ User Registration: Tested with valid data, duplicate email, and missing fields")
    print("✅ User Login: Tested with valid credentials, invalid email, and invalid password")
    print("✅ Authentication Verification: Tested protected endpoints with valid token, invalid token, and no token")
    print("✅ Shop Owner Registration: Tested registration flow for shop owners")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
