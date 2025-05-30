
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
            "brand": "Samsung",
            "model": "Galaxy S23",
            "condition": "Good",
            "price": 120000,
            "storage": "256GB",
            "ram": "8GB",
            "city": "Karachi",
            "description": "This is a test listing created by automated testing.",
            "seller_name": "Test User",
            "seller_phone": "03001234567",
            "seller_email": "test@example.com",
            "features": ["5G", "AMOLED Display", "Fast Charging"]
        }
        
        success, response = self.run_test(
            "Create New Listing",
            "POST",
            "api/listings",
            200,
            data=test_data
        )
        
        if success and response.get("success") and "listing_id" in response:
            self.test_listing_id = response["listing_id"]
            print(f"Created test listing with ID: {self.test_listing_id}")
        
        return success, response

    def test_get_listing_by_id(self):
        """Test getting a specific listing by ID"""
        if not self.test_listing_id:
            print("❌ No test listing ID available, skipping test")
            return False, {}
        
        return self.run_test(
            "Get Listing by ID",
            "GET",
            f"api/listings/{self.test_listing_id}",
            200
        )

    def test_filtered_listings(self):
        """Test getting listings with filters"""
        params = {
            "brand": "Samsung",
            "city": "Karachi",
            "min_price": 100000,
            "max_price": 150000
        }
        
        return self.run_test(
            "Get Filtered Listings",
            "GET",
            "api/listings",
            200,
            params=params
        )

def main():
    # Get backend URL from environment or use default
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                backend_url = line.strip().split('=')[1]
                break
    
    print(f"Using backend URL: {backend_url}")
    
    # Setup tester
    tester = PhoneFlipAPITester(backend_url)
    
    # Run basic API tests
    print("\n=== Testing Basic API Endpoints ===")
    tester.test_api_root()
    tester.test_get_listings()
    tester.test_get_featured_listings()
    tester.test_get_stats()
    
    # Run user authentication tests
    print("\n=== Testing User Authentication ===")
    tester.test_register_normal_user()
    tester.test_login()
    tester.test_get_current_user()
    
    # Run shop owner registration test
    print("\n=== Testing Shop Owner Registration ===")
    tester.test_register_shop_owner()
    
    # Run listing tests
    print("\n=== Testing Listing Management ===")
    tester.test_create_listing()
    tester.test_get_listing_by_id()
    tester.test_filtered_listings()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
