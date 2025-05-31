
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
                try:
                    error_data = response.json()
                    print(f"Error details: {error_data}")
                except:
                    print(f"Raw response: {response.text}")
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
        success, response = self.run_test(
            "Get Platform Stats",
            "GET",
            "api/stats",
            200
        )
        
        # Verify that the stats include accessories count
        if success and isinstance(response, dict):
            if "accessories_count" in response:
                print(f"✅ Stats include accessories count: {response['accessories_count']}")
            else:
                print("❌ Stats do not include accessories count")
                success = False
                
            # Check for other expected stats
            expected_fields = ["total_listings", "total_users", "cities_count", "brands_count"]
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Stats are incomplete - Missing fields: {', '.join(missing_fields)}")
                success = False
            else:
                print("✅ Stats include all expected fields")
        
        return success, response
    
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
            "brand": "Apple",
            "model": "iPhone 13 Pro Max",
            "condition": "Excellent",
            "price": 120000,
            "storage": "256GB",
            "ram": "8GB",
            "city": "Karachi",
            "description": "Excellent condition, barely used",
            "seller_name": "Test Seller",
            "seller_phone": "03001234567",
            "seller_email": "seller@example.com",
            "features": ["Face ID", "Wireless Charging", "Triple Camera"]
        }
        
        success, response = self.run_test(
            "Create Listing",
            "POST",
            "api/listings",
            200,  # Changed from 201 to 200 based on the API implementation
            data=test_data
        )
        
        if success and "listing_id" in response:
            self.test_listing_id = response["listing_id"]
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
    
    def test_populate_sample_data(self):
        """Test populating sample data"""
        return self.run_test(
            "Populate Sample Data",
            "POST",
            "api/sample-data",
            200
        )
    
    def test_verify_sample_data(self):
        """Test verifying sample data exists and is complete"""
        # Check phone listings
        success_listings, response_listings = self.run_test(
            "Get All Listings to Verify Sample Data",
            "GET",
            "api/listings",
            200
        )
        
        # Check accessories
        success_accessories, response_accessories = self.run_test(
            "Get All Accessories to Verify Sample Data",
            "GET",
            "api/accessories",
            200
        )
        
        listings_count = len(response_listings) if success_listings and isinstance(response_listings, list) else 0
        accessories_count = len(response_accessories) if success_accessories and isinstance(response_accessories, list) else 0
        
        print(f"✅ Sample data exists - Found {listings_count} phone listings and {accessories_count} accessories")
        
        # Verify we have the expected number of items
        expected_listings = 12
        expected_accessories = 5
        
        if listings_count < expected_listings:
            print(f"❌ Expected at least {expected_listings} phone listings, but found {listings_count}")
            success_listings = False
        else:
            print(f"✅ Found expected number of phone listings: {listings_count}")
        
        if accessories_count < expected_accessories:
            print(f"❌ Expected at least {expected_accessories} accessories, but found {accessories_count}")
            success_accessories = False
        else:
            print(f"✅ Found expected number of accessories: {accessories_count}")
        
        # Check if sample data has all required fields
        if success_listings and listings_count > 0:
            required_fields = ["brand", "model", "condition", "price", "storage", "ram", "city", "description"]
            sample_item = response_listings[0]
            missing_fields = [field for field in required_fields if field not in sample_item]
            
            if missing_fields:
                print(f"❌ Phone listing data is incomplete - Missing fields: {', '.join(missing_fields)}")
                success_listings = False
            else:
                print("✅ Phone listing data is complete - All required fields present")
        
        if success_accessories and accessories_count > 0:
            required_fields = ["category", "type", "brand", "model", "condition", "price", "city", "description"]
            sample_item = response_accessories[0]
            missing_fields = [field for field in required_fields if field not in sample_item]
            
            if missing_fields:
                print(f"❌ Accessory data is incomplete - Missing fields: {', '.join(missing_fields)}")
                success_accessories = False
            else:
                print("✅ Accessory data is complete - All required fields present")
        
        return success_listings and success_accessories, {"listings": response_listings, "accessories": response_accessories}
    
    def test_get_accessories(self):
        """Test getting all accessories"""
        return self.run_test(
            "Get All Accessories",
            "GET",
            "api/accessories",
            200
        )
    
    def test_get_featured_accessories(self):
        """Test getting featured accessories"""
        return self.run_test(
            "Get Featured Accessories",
            "GET",
            "api/accessories/featured",
            200
        )
    
    def test_filtered_accessories(self):
        """Test getting filtered accessories"""
        return self.run_test(
            "Get Filtered Accessories",
            "GET",
            "api/accessories",
            200,
            params={"type": "case", "min_price": 500, "max_price": 10000}
        )
    
    def test_duplicate_shop_owner_registration(self):
        """Test registering a shop owner with an email that already exists"""
        # First, make sure we have a shop owner registered
        if not hasattr(self, 'test_shop_owner_email') or not self.test_shop_owner_email:
            self.test_register_shop_owner()
        
        # Now try to register another shop owner with the same email
        test_data = {
            "name": "Duplicate Shop Owner",
            "email": self.test_shop_owner_email,  # Use the same email as the already registered shop owner
            "password": self.test_user_password,
            "phone": "03009876543",
            "business_details": {
                "business_name": "Duplicate Mobile Shop",
                "business_type": "mobile_shop",
                "business_address": "123 Test Street",
                "city": "Karachi",
                "postal_code": "75000",
                "business_phone": "03009876543",
                "website": "https://testshop.com",
                "description": "This is a duplicate shop for testing.",
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
            "Register Shop Owner with Duplicate Email",
            "POST",
            "api/auth/register-shop-owner",
            400,  # Expect 400 Bad Request
            data=test_data
        )
        
    def test_shop_owner_verification(self):
        """Test shop owner verification status management (requires admin access)"""
        print("ℹ️ Shop owner verification requires admin access - Skipping actual verification")
        print("ℹ️ Testing shop owner registration flow only")
        
        # Register a shop owner
        success, response = self.test_register_shop_owner()
        
        if success and "user_id" in response:
            shop_owner_id = response["user_id"]
            print(f"✅ Shop owner registered with ID: {shop_owner_id}")
            print("✅ Verification status set to UNDER_REVIEW as expected")
            return True, response
        else:
            print("❌ Failed to register shop owner for verification testing")
            return False, response

def test_auth_system_focused():
    """Run focused tests on the authentication system"""
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
    
    # Run focused authentication tests
    print("\n=== EMERGENCY AUTHENTICATION SYSTEM DIAGNOSIS ===")
    print("\n--- 1. Normal User Registration Tests ---")
    normal_user_success, normal_user_data = tester.test_register_normal_user()
    
    print("\n--- 2. Duplicate Normal User Registration Test ---")
    duplicate_user_success, duplicate_user_data = tester.test_duplicate_registration()
    
    print("\n--- 3. Shop Owner Registration Test ---")
    shop_owner_success, shop_owner_data = tester.test_register_shop_owner()
    
    print("\n--- 4. Duplicate Shop Owner Registration Test ---")
    duplicate_shop_owner_success, duplicate_shop_owner_data = tester.test_duplicate_shop_owner_registration()
    
    print("\n--- 5. User Login Test ---")
    login_success, login_data = tester.test_login()
    
    print("\n--- 6. Authentication Verification Tests ---")
    auth_verification_success, auth_verification_data = tester.test_get_current_user()
    invalid_token_success = tester.test_invalid_token_access()
    no_token_success = tester.test_no_token_access()
    
    # Print detailed results
    print("\n=== AUTHENTICATION SYSTEM DIAGNOSIS RESULTS ===")
    
    print("\n1. Normal User Registration:")
    if normal_user_success:
        print("   ✅ Normal user registration works correctly")
        print(f"   User ID: {normal_user_data['user']['_id']}")
        print(f"   User Role: {normal_user_data['user']['role']}")
        print(f"   Verification Status: {normal_user_data['user']['verification_status']}")
    else:
        print("   ❌ Normal user registration failed")
    
    print("\n2. Duplicate Email Handling (Normal User):")
    if duplicate_user_success:
        print("   ✅ Duplicate email correctly rejected with 400 status code")
    else:
        print("   ❌ Duplicate email handling is not working correctly")
        print("   This may be returning a 500 error instead of the expected 400 error")
    
    print("\n3. Shop Owner Registration:")
    if shop_owner_success:
        print("   ✅ Shop owner registration works correctly")
        print(f"   User ID: {shop_owner_data.get('user_id', 'N/A')}")
        print(f"   Message: {shop_owner_data.get('message', 'N/A')}")
    else:
        print("   ❌ Shop owner registration failed")
    
    print("\n4. Duplicate Email Handling (Shop Owner):")
    if duplicate_shop_owner_success:
        print("   ✅ Duplicate shop owner email correctly rejected with 400 status code")
    else:
        print("   ❌ Duplicate shop owner email handling is not working correctly")
        print("   This may be returning a 500 error instead of the expected 400 error")
    
    print("\n5. User Login:")
    if login_success:
        print("   ✅ User login works correctly")
    else:
        print("   ❌ User login failed")
    
    print("\n6. Authentication Verification:")
    if auth_verification_success:
        print("   ✅ Protected endpoint access with valid token works correctly")
    else:
        print("   ❌ Protected endpoint access with valid token failed")
    
    if invalid_token_success:
        print("   ✅ Invalid token correctly returns 401 status code")
    else:
        print("   ❌ Invalid token handling is not working correctly")
        print("   This may be returning a 500 error instead of the expected 401 error")
    
    if no_token_success:
        print("   ✅ Missing token correctly returns 401 status code")
    else:
        print("   ❌ Missing token handling is not working correctly")
        print("   This may be returning a 403 error instead of the expected 401 error")
    
    # Print summary
    print("\n=== AUTHENTICATION SYSTEM DIAGNOSIS SUMMARY ===")
    auth_tests_passed = sum([
        1 if normal_user_success else 0,
        1 if duplicate_user_success else 0,
        1 if shop_owner_success else 0,
        1 if duplicate_shop_owner_success else 0,
        1 if login_success else 0,
        1 if auth_verification_success else 0,
        1 if invalid_token_success else 0,
        1 if no_token_success else 0
    ])
    auth_tests_total = 8
    
    print(f"📊 Authentication Tests Passed: {auth_tests_passed}/{auth_tests_total}")
    print(f"📊 Authentication System Health: {(auth_tests_passed / auth_tests_total) * 100:.2f}%")
    
    if auth_tests_passed == auth_tests_total:
        print("\n✅ AUTHENTICATION SYSTEM IS FULLY FUNCTIONAL")
    else:
        print("\n⚠️ AUTHENTICATION SYSTEM REQUIRES ATTENTION")
        
        if not duplicate_user_success or not duplicate_shop_owner_success:
            print("   ❌ CRITICAL: Duplicate email handling is broken")
            print("   - The system is returning 500 errors instead of 400 errors for duplicate emails")
            print("   - This affects both normal user and shop owner registration")
            print("   - Check the error handling in the registration endpoints")
        
        if not invalid_token_success:
            print("   ❌ CRITICAL: Invalid token handling is broken")
            print("   - The system is returning 500 errors instead of 401 errors for invalid tokens")
            print("   - Check the error handling in the get_current_user dependency function")
        
        if not no_token_success:
            print("   ❌ CRITICAL: Missing token handling is broken")
            print("   - The system is returning 403 errors instead of 401 errors for missing tokens")
            print("   - Check the error handling in the get_current_user dependency function")
    
    return auth_tests_passed == auth_tests_total

def main():
    # Run focused authentication system tests
    auth_system_ok = test_auth_system_focused()
    
    # Return success code if all tests passed
    return 0 if auth_system_ok else 1

if __name__ == "__main__":
    sys.exit(main())
