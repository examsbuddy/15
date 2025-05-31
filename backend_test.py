
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
    
    def test_register_shop_owner(self):
        """Test registering a shop owner with all required fields"""
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
        
    def test_register_shop_owner_missing_fields(self):
        """Test registering a shop owner with missing required fields"""
        # Missing business_details.business_name and kyc_documents.cnic_front
        test_data = {
            "name": "Test Shop Owner Missing Fields",
            "email": f"shop_owner_missing_{uuid.uuid4().hex[:8]}@example.com",
            "password": self.test_user_password,
            "phone": "03009876543",
            "business_details": {
                # Missing business_name
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
                # Missing cnic_front
                "cnic_back": "dGVzdCBiYXNlNjQgZGF0YQ==",
                "business_license": "dGVzdCBiYXNlNjQgZGF0YQ==",
                "trade_license": "dGVzdCBiYXNlNjQgZGF0YQ=="
            }
        }
        
        # We expect a 422 Unprocessable Entity response for validation errors
        return self.run_test(
            "Register Shop Owner with Missing Fields",
            "POST",
            "api/auth/register-shop-owner",
            422,
            data=test_data
        )
        
    def test_register_shop_owner_duplicate_email(self):
        """Test registering a shop owner with a duplicate email"""
        # First, register a shop owner successfully
        test_data_1 = {
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
        
        # Register the first shop owner
        success_1, _ = self.run_test(
            "Register First Shop Owner",
            "POST",
            "api/auth/register-shop-owner",
            200,
            data=test_data_1
        )
        
        if not success_1:
            print("❌ Failed to register initial shop owner, skipping duplicate email test")
            return False, {}
            
        # Now try to register another shop owner with the same email
        test_data_2 = {
            "name": "Duplicate Shop Owner",
            "email": self.test_shop_owner_email,  # Same email as the first shop owner
            "password": self.test_user_password,
            "phone": "03009876543",
            "business_details": {
                "business_name": "Duplicate Shop",
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
                "cnic_front": "dGVzdCBiYXNlNjQgZGF0YQ==",
                "cnic_back": "dGVzdCBiYXNlNjQgZGF0YQ==",
                "business_license": "dGVzdCBiYXNlNjQgZGF0YQ==",
                "trade_license": "dGVzdCBiYXNlNjQgZGF0YQ=="
            }
        }
        
        # We expect a 400 Bad Request response for duplicate email
        return self.run_test(
            "Register Shop Owner with Duplicate Email",
            "POST",
            "api/auth/register-shop-owner",
            400,
            data=test_data_2
        )

def test_shop_owner_registration():
    """Run focused tests on shop owner registration API endpoint"""
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
    
    # Run shop owner registration tests
    print("\n=== SHOP OWNER REGISTRATION API TESTING ===")
    
    print("\n--- 1. Shop Owner Registration with Valid Data ---")
    success, response = tester.test_register_shop_owner()
    
    print("\n--- 2. Shop Owner Registration with Missing Fields ---")
    missing_fields_success, missing_fields_response = tester.test_register_shop_owner_missing_fields()
    
    print("\n--- 3. Shop Owner Registration with Duplicate Email ---")
    duplicate_email_success, duplicate_email_response = tester.test_register_shop_owner_duplicate_email()
    
    # Print detailed results
    print("\n=== SHOP OWNER REGISTRATION API TEST RESULTS ===")
    
    print("\n1. Shop Owner Registration with Valid Data:")
    if success:
        print("   ✅ Shop owner registration with valid data works correctly")
        print(f"   User ID: {response.get('user_id', 'N/A')}")
        print(f"   Message: {response.get('message', 'N/A')}")
        
        # Verify the success message indicates proper user type
        if "shop owner" in response.get('message', '').lower():
            print("   ✅ Response correctly identifies as shop owner registration")
        else:
            print("   ⚠️ Response message doesn't explicitly mention 'shop owner'")
            
        # Check if KYC data was properly handled
        if "under review" in response.get('message', '').lower():
            print("   ✅ KYC verification status correctly set to 'under review'")
        else:
            print("   ⚠️ KYC verification status not mentioned in response")
    else:
        print("   ❌ Shop owner registration with valid data failed")
    
    print("\n2. Shop Owner Registration with Missing Fields:")
    if missing_fields_success:
        print("   ✅ API correctly validates required fields")
        print("   ✅ Returned 422 status code for missing required fields")
        
        # Check if validation error details are provided
        if "detail" in missing_fields_response:
            print("   ✅ Validation error details provided in response")
            print(f"   Error details: {missing_fields_response.get('detail', 'N/A')}")
        else:
            print("   ⚠️ No detailed validation error information in response")
    else:
        print("   ❌ API validation for missing fields failed")
        print("   ❌ Did not return expected 422 status code")
    
    print("\n3. Shop Owner Registration with Duplicate Email:")
    if duplicate_email_success:
        print("   ✅ API correctly handles duplicate email")
        print("   ✅ Returned 400 status code for duplicate email")
        
        # Check if error details are provided
        if "detail" in duplicate_email_response:
            print("   ✅ Error details provided in response")
            print(f"   Error message: {duplicate_email_response.get('detail', 'N/A')}")
            
            # Verify the error message mentions duplicate email
            if "email" in duplicate_email_response.get('detail', '').lower() and "registered" in duplicate_email_response.get('detail', '').lower():
                print("   ✅ Error message correctly identifies duplicate email issue")
            else:
                print("   ⚠️ Error message doesn't clearly indicate duplicate email issue")
        else:
            print("   ⚠️ No detailed error information in response")
    else:
        print("   ❌ API handling for duplicate email failed")
        print("   ❌ Did not return expected 400 status code")
    
    # Print summary
    print("\n=== SHOP OWNER REGISTRATION API TEST SUMMARY ===")
    tests_passed = sum([
        1 if success else 0,
        1 if missing_fields_success else 0,
        1 if duplicate_email_success else 0
    ])
    tests_total = 3
    
    print(f"📊 Shop Owner Registration API Tests Passed: {tests_passed}/{tests_total}")
    print(f"📊 Shop Owner Registration API Health: {(tests_passed / tests_total) * 100:.2f}%")
    
    if tests_passed == tests_total:
        print("\n✅ SHOP OWNER REGISTRATION API IS FULLY FUNCTIONAL")
        print("   ✅ Successfully registers shop owners with valid data")
        print("   ✅ Properly validates required fields")
        print("   ✅ Correctly handles duplicate email registration")
    else:
        print("\n⚠️ SHOP OWNER REGISTRATION API REQUIRES ATTENTION")
        
        if not success:
            print("   ❌ Registration with valid data is not working correctly")
            print("   - Check the /api/auth/register-shop-owner endpoint implementation")
        
        if not missing_fields_success:
            print("   ❌ Validation for required fields is not working correctly")
            print("   - Check the validation logic in the ShopOwnerRegistration model")
        
        if not duplicate_email_success:
            print("   ❌ Handling of duplicate email registration is not working correctly")
            print("   - Check the error handling in the register_shop_owner function")
    
    return tests_passed == tests_total

def test_signup_flows():
    """Run focused tests on both signup flows (Normal User and Shop Owner)"""
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
    
    # Run focused signup flow tests
    print("\n=== SIGNUP FLOWS VERIFICATION ===")
    
    print("\n--- 1. Normal User Registration Flow ---")
    normal_user_success, normal_user_data = tester.test_register_normal_user()
    
    print("\n--- 2. Shop Owner Registration Flow ---")
    shop_owner_success, shop_owner_data = tester.test_register_shop_owner()
    
    # Verify login still works with the registered normal user
    print("\n--- 3. Verifying Login After Registration ---")
    login_success, login_data = tester.test_login()
    
    # Print detailed results
    print("\n=== SIGNUP FLOWS VERIFICATION RESULTS ===")
    
    print("\n1. Normal User Registration Flow:")
    if normal_user_success:
        print("   ✅ Normal user registration works correctly")
        print(f"   User ID: {normal_user_data['user']['_id']}")
        print(f"   User Type: {normal_user_data['user']['role']}")
        print(f"   Verification Status: {normal_user_data['user']['verification_status']}")
        
        # Verify user_type is set correctly
        if normal_user_data['user']['role'] == 'normal_user':
            print("   ✅ User type is correctly set to 'normal_user'")
        else:
            print(f"   ❌ User type is incorrectly set to '{normal_user_data['user']['role']}' instead of 'normal_user'")
            normal_user_success = False
    else:
        print("   ❌ Normal user registration failed")
    
    print("\n2. Shop Owner Registration Flow:")
    if shop_owner_success:
        print("   ✅ Shop owner registration works correctly")
        print(f"   User ID: {shop_owner_data.get('user_id', 'N/A')}")
        print(f"   Message: {shop_owner_data.get('message', 'N/A')}")
        
        # Verify the success message indicates proper user type
        if "shop owner" in shop_owner_data.get('message', '').lower():
            print("   ✅ Response correctly identifies as shop owner registration")
        else:
            print("   ⚠️ Response message doesn't explicitly mention 'shop owner'")
            
        # Check if KYC data was properly handled
        if "under review" in shop_owner_data.get('message', '').lower():
            print("   ✅ KYC verification status correctly set to 'under review'")
        else:
            print("   ⚠️ KYC verification status not mentioned in response")
    else:
        print("   ❌ Shop owner registration failed")
    
    print("\n3. Login After Registration:")
    if login_success:
        print("   ✅ Login works correctly after registration")
        print(f"   User Type: {login_data['user']['role']}")
        print(f"   Verification Status: {login_data['user']['verification_status']}")
    else:
        print("   ❌ Login failed after registration")
    
    # Print summary
    print("\n=== SIGNUP FLOWS VERIFICATION SUMMARY ===")
    signup_tests_passed = sum([
        1 if normal_user_success else 0,
        1 if shop_owner_success else 0,
        1 if login_success else 0
    ])
    signup_tests_total = 3
    
    print(f"📊 Signup Flow Tests Passed: {signup_tests_passed}/{signup_tests_total}")
    print(f"📊 Signup Flows Health: {(signup_tests_passed / signup_tests_total) * 100:.2f}%")
    
    if signup_tests_passed == signup_tests_total:
        print("\n✅ BOTH SIGNUP FLOWS ARE FULLY FUNCTIONAL")
        print("   ✅ Normal User signup works correctly with proper user_type assignment")
        print("   ✅ Shop Owner signup works correctly with proper KYC handling")
        print("   ✅ Login functionality works correctly after registration")
        print("   ✅ No API changes were needed as per requirements")
    else:
        print("\n⚠️ SIGNUP FLOWS REQUIRE ATTENTION")
        
        if not normal_user_success:
            print("   ❌ Normal User signup flow is not working correctly")
            print("   - Check the /api/auth/register endpoint")
        
        if not shop_owner_success:
            print("   ❌ Shop Owner signup flow is not working correctly")
            print("   - Check the /api/auth/register-shop-owner endpoint")
        
        if not login_success:
            print("   ❌ Login functionality is not working correctly after registration")
            print("   - Check the /api/auth/login endpoint")
    
    return signup_tests_passed == signup_tests_total

def main():
    # Run focused shop owner registration API tests
    shop_owner_registration_ok = test_shop_owner_registration()
    
    # Return success code if all tests passed
    return 0 if shop_owner_registration_ok else 1

if __name__ == "__main__":
    sys.exit(main())
