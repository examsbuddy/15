#!/usr/bin/env python3
import requests
import json
import sys
import os
from urllib.parse import urlparse
import time
import random
import string
import base64

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1]
    raise Exception("Could not find REACT_APP_BACKEND_URL in frontend/.env")

BACKEND_URL = get_backend_url()
API_URL = f"{BACKEND_URL}/api"

print(f"Using backend URL: {API_URL}")

# Function to check if an image URL is valid
def is_valid_image_url(url):
    try:
        # Parse the URL to check if it's properly formatted
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            print(f"Invalid URL format: {url}")
            return False
            
        # Check if it's a placeholder or base64 image
        if url.startswith('data:image'):
            print(f"Found placeholder base64 image: {url[:50]}...")
            return False
            
        # Make a HEAD request to check if the image exists
        response = requests.head(url, timeout=5)
        
        # Check if the response is successful and the content type is an image
        if response.status_code == 200 and 'image' in response.headers.get('Content-Type', ''):
            return True
        else:
            print(f"Invalid image URL (status code: {response.status_code}, content-type: {response.headers.get('Content-Type')}): {url}")
            return False
    except Exception as e:
        print(f"Error checking image URL {url}: {str(e)}")
        return False

# Function to test the API health
def test_api_health():
    print("\n=== Testing API Health ===")
    try:
        # Test the phone brands endpoint as a basic health check
        response = requests.get(f"{API_URL}/phone-brands")
        response.raise_for_status()
        
        brands = response.json().get('brands', [])
        print(f"API is healthy. Retrieved {len(brands)} phone brands: {', '.join(brands)}")
        return True
    except Exception as e:
        print(f"Error testing API health: {str(e)}")
        return False

# Function to test user registration and login
def test_auth_endpoints():
    print("\n=== Testing Authentication Endpoints ===")
    
    # Generate random user credentials
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    test_user = {
        "name": f"Test User {random_suffix}",
        "email": f"testuser{random_suffix}@example.com",
        "password": "TestPassword123!",
        "phone": f"030012345{random.randint(10, 99)}",
        "role": "normal_user"
    }
    
    # Test registration
    print("\n--- Testing User Registration ---")
    try:
        response = requests.post(f"{API_URL}/auth/register", json=test_user)
        response.raise_for_status()
        
        result = response.json()
        print(f"Registration successful: {result.get('user', {}).get('name')}")
        
        # Save the token for subsequent tests
        auth_token = result.get('access_token')
        if not auth_token:
            print("ERROR: No access token received after registration")
            return False
            
        print(f"Received access token: {auth_token[:10]}...")
        
        # Test login with the same credentials
        print("\n--- Testing User Login ---")
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=login_data)
        response.raise_for_status()
        
        login_result = response.json()
        print(f"Login successful: {login_result.get('user', {}).get('name')}")
        
        # Test getting current user info
        print("\n--- Testing Get Current User Info ---")
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.get(f"{API_URL}/auth/me", headers=headers)
        response.raise_for_status()
        
        user_info = response.json()
        print(f"Retrieved user info: {user_info.get('name')} ({user_info.get('email')})")
        
        return True
    except Exception as e:
        print(f"Error testing authentication endpoints: {str(e)}")
        return False

# Function to test the recent listings endpoint
def test_recent_listings():
    print("\n=== Testing GET /api/listings/recent ===")
    try:
        response = requests.get(f"{API_URL}/listings/recent")
        response.raise_for_status()
        
        listings = response.json()
        print(f"Retrieved {len(listings)} recent listings")
        
        if not listings:
            print("ERROR: No recent listings found")
            return False
            
        valid_listings = 0
        for i, listing in enumerate(listings[:3]):  # Only check first 3 to save time
            print(f"\nListing {i+1}: {listing.get('brand')} {listing.get('model')}")
            
            # Check if photos array exists and is not empty
            if 'photos' not in listing or not listing['photos']:
                print(f"ERROR: Listing has no photos array or empty photos array")
                continue
                
            print(f"Found {len(listing['photos'])} photos")
            
            # Check if all photos are valid image URLs
            valid_photos = 0
            for photo_url in listing['photos']:
                if is_valid_image_url(photo_url):
                    valid_photos += 1
                    
            print(f"Valid photos: {valid_photos}/{len(listing['photos'])}")
            
            if valid_photos == len(listing['photos']) and valid_photos > 0:
                valid_listings += 1
                
        print(f"\nValid listings with real images: {valid_listings}/{min(3, len(listings))}")
        return valid_listings > 0
        
    except Exception as e:
        print(f"Error testing recent listings: {str(e)}")
        return False

# Function to test the featured listings endpoint
def test_featured_listings():
    print("\n=== Testing GET /api/listings/featured ===")
    try:
        response = requests.get(f"{API_URL}/listings/featured")
        response.raise_for_status()
        
        listings = response.json()
        print(f"Retrieved {len(listings)} featured listings")
        
        if not listings:
            print("ERROR: No featured listings found")
            return False
            
        valid_listings = 0
        for i, listing in enumerate(listings[:3]):  # Only check first 3 to save time
            print(f"\nListing {i+1}: {listing.get('brand')} {listing.get('model')}")
            
            # Check if photos array exists and is not empty
            if 'photos' not in listing or not listing['photos']:
                print(f"ERROR: Listing has no photos array or empty photos array")
                continue
                
            print(f"Found {len(listing['photos'])} photos")
            
            # Check if all photos are valid image URLs
            valid_photos = 0
            for photo_url in listing['photos']:
                if is_valid_image_url(photo_url):
                    valid_photos += 1
                    
            print(f"Valid photos: {valid_photos}/{len(listing['photos'])}")
            
            if valid_photos == len(listing['photos']) and valid_photos > 0:
                valid_listings += 1
                
        print(f"\nValid listings with real images: {valid_listings}/{min(3, len(listings))}")
        return valid_listings > 0
        
    except Exception as e:
        print(f"Error testing featured listings: {str(e)}")
        return False

# Function to test individual listing details
def test_individual_listings():
    print("\n=== Testing GET /api/listings/{listing_id} ===")
    try:
        # First, get some listing IDs from the recent listings
        response = requests.get(f"{API_URL}/listings/recent")
        response.raise_for_status()
        
        recent_listings = response.json()
        if not recent_listings:
            print("ERROR: No listings found to test individual endpoints")
            return False
            
        # Test a few individual listings
        listing_ids = [listing.get('_id') for listing in recent_listings[:3]]
        
        valid_listings = 0
        for listing_id in listing_ids:
            print(f"\nTesting listing ID: {listing_id}")
            
            response = requests.get(f"{API_URL}/listings/{listing_id}")
            if response.status_code != 200:
                print(f"ERROR: Failed to retrieve listing {listing_id}, status code: {response.status_code}")
                continue
                
            listing = response.json()
            print(f"Retrieved listing: {listing.get('brand')} {listing.get('model')}")
            
            # Check if photos array exists and is not empty
            if 'photos' not in listing or not listing['photos']:
                print(f"ERROR: Listing has no photos array or empty photos array")
                continue
                
            print(f"Found {len(listing['photos'])} photos")
            
            # Check if all photos are valid image URLs
            valid_photos = 0
            for photo_url in listing['photos']:
                if is_valid_image_url(photo_url):
                    valid_photos += 1
                    
            print(f"Valid photos: {valid_photos}/{len(listing['photos'])}")
            
            if valid_photos == len(listing['photos']) and valid_photos > 0:
                valid_listings += 1
                
        print(f"\nValid individual listings with real images: {valid_listings}/{len(listing_ids)}")
        return valid_listings > 0
        
    except Exception as e:
        print(f"Error testing individual listings: {str(e)}")
        return False

# Function to test creating a new listing
def test_create_listing():
    print("\n=== Testing POST /api/listings (Create Listing) ===")
    try:
        # Create a sample listing
        sample_listing = {
            "brand": "Test Brand",
            "model": f"Test Model {random.randint(1000, 9999)}",
            "condition": "Excellent",
            "price": random.randint(10000, 50000),
            "storage": "128GB",
            "ram": "8GB",
            "city": "Test City",
            "description": "This is a test listing created by the automated test script.",
            "seller_name": "Test Seller",
            "seller_phone": f"030012345{random.randint(10, 99)}",
            "seller_email": f"testseller{random.randint(1000, 9999)}@example.com",
            "features": ["Test Feature 1", "Test Feature 2"],
            "battery": "4000mAh",
            "screen_size": "6.5 inch",
            "camera": "48MP",
            "processor": "Test Processor",
            "operating_system": "Test OS",
            "network": "5G",
            "color": "Test Color",
            "photos": [
                # Simple 1x1 pixel base64 encoded image
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
            ],
            "purchase_year": 2023,
            "warranty_months": 6,
            "box_included": True,
            "accessories_included": ["Charger", "Cable"],
            "battery_health": "Excellent",
            "seller_type": "Individual"
        }
        
        response = requests.post(f"{API_URL}/listings", json=sample_listing)
        response.raise_for_status()
        
        result = response.json()
        print(f"Listing creation result: {result}")
        
        if result.get('success') and result.get('listing_id'):
            print(f"Successfully created listing with ID: {result.get('listing_id')}")
            
            # Verify the listing was created by retrieving it
            listing_id = result.get('listing_id')
            verify_response = requests.get(f"{API_URL}/listings/{listing_id}")
            
            if verify_response.status_code == 200:
                print("Successfully verified the created listing exists")
                return True
            else:
                print(f"ERROR: Could not verify the created listing. Status code: {verify_response.status_code}")
                return False
        else:
            print("ERROR: Listing creation failed or did not return a listing ID")
            return False
            
    except Exception as e:
        print(f"Error testing listing creation: {str(e)}")
        return False

# Function to test the search functionality
def test_search_functionality():
    print("\n=== Testing Search Functionality ===")
    try:
        # Test basic search
        search_term = "iPhone"  # Common term that should return results
        print(f"\n--- Testing basic search for '{search_term}' ---")
        
        response = requests.get(f"{API_URL}/listings", params={"search": search_term})
        response.raise_for_status()
        
        results = response.json()
        print(f"Search returned {len(results)} results")
        
        if not results:
            print(f"WARNING: No results found for '{search_term}'")
        else:
            first_results = [f"{r.get('brand')} {r.get('model')}" for r in results[:3]]
            print(f"First few results: {', '.join(first_results)}")
        
        # Test filtered search
        print("\n--- Testing filtered search ---")
        filter_params = {
            "brand": "Samsung",
            "min_price": 50000,
            "max_price": 200000
        }
        
        response = requests.get(f"{API_URL}/listings", params=filter_params)
        response.raise_for_status()
        
        filtered_results = response.json()
        print(f"Filtered search returned {len(filtered_results)} results")
        
        if not filtered_results:
            print(f"WARNING: No results found for filtered search")
        else:
            first_filtered = [f"{r.get('brand')} {r.get('model')} (₨{r.get('price')})" for r in filtered_results[:3]]
            print(f"First few filtered results: {', '.join(first_filtered)}")
            
            # Verify filter was applied
            all_match_brand = all(r.get('brand') == "Samsung" for r in filtered_results)
            all_in_price_range = all(50000 <= r.get('price', 0) <= 200000 for r in filtered_results)
            
            if all_match_brand and all_in_price_range:
                print("Filters were correctly applied")
            else:
                print(f"WARNING: Some results don't match the filters. Brand match: {all_match_brand}, Price range match: {all_in_price_range}")
        
        # Test sorting
        print("\n--- Testing sorting functionality ---")
        sort_params = {"sort_by": "price_low"}
        
        response = requests.get(f"{API_URL}/listings", params=sort_params)
        response.raise_for_status()
        
        sorted_results = response.json()
        
        if len(sorted_results) >= 2:
            is_sorted = all(sorted_results[i].get('price', 0) <= sorted_results[i+1].get('price', 0) 
                           for i in range(len(sorted_results)-1))
            
            print(f"Sorting test {'PASSED' if is_sorted else 'FAILED'}")
            print(f"First few prices: {[r.get('price') for r in sorted_results[:5]]}")
        else:
            print("Not enough results to verify sorting")
        
        return True
    except Exception as e:
        print(f"Error testing search functionality: {str(e)}")
        return False

# Function to test the compare functionality
def test_compare_functionality():
    print("\n=== Testing Compare Functionality ===")
    try:
        # Test getting all phone brands
        print("\n--- Testing GET /api/phone-brands ---")
        response = requests.get(f"{API_URL}/phone-brands")
        response.raise_for_status()
        
        brands = response.json().get('brands', [])
        print(f"Retrieved {len(brands)} phone brands: {', '.join(brands)}")
        
        if not brands:
            print("ERROR: No phone brands found")
            return False
        
        # Test getting models for a brand
        test_brand = brands[0]
        print(f"\n--- Testing GET /api/phone-models/{test_brand} ---")
        
        response = requests.get(f"{API_URL}/phone-models/{test_brand}")
        response.raise_for_status()
        
        models = response.json().get('models', [])
        print(f"Retrieved {len(models)} models for {test_brand}: {', '.join(models[:5])}...")
        
        if not models:
            print(f"ERROR: No models found for {test_brand}")
            return False
        
        # Test getting specs for a specific model
        test_model = models[0]
        print(f"\n--- Testing GET /api/phone-specs/{test_brand}/{test_model} ---")
        
        response = requests.get(f"{API_URL}/phone-specs/{test_brand}/{test_model}")
        response.raise_for_status()
        
        specs = response.json()
        print(f"Retrieved specs for {test_brand} {test_model}:")
        for key, value in specs.items():
            if isinstance(value, list):
                print(f"  {key}: {', '.join(str(v) for v in value[:3])}...")
            else:
                print(f"  {key}: {value}")
        
        return True
    except Exception as e:
        print(f"Error testing compare functionality: {str(e)}")
        return False

# Function to populate sample data if needed
def populate_sample_data():
    print("\n=== Populating sample data ===")
    try:
        response = requests.post(f"{API_URL}/sample-data")
        response.raise_for_status()
        
        result = response.json()
        print(f"Sample data population result: {result}")
        
        # Wait a moment for the data to be properly stored
        time.sleep(2)
        
        return True
    except Exception as e:
        print(f"Error populating sample data: {str(e)}")
        return False

def main():
    print("Starting PhoneFlip backend API tests...")
    
    # First, populate sample data to ensure we have listings to test
    if not populate_sample_data():
        print("WARNING: Failed to populate sample data, but continuing with tests")
    
    # Run the tests
    api_health_result = test_api_health()
    auth_result = test_auth_endpoints()
    recent_listings_result = test_recent_listings()
    featured_listings_result = test_featured_listings()
    individual_listings_result = test_individual_listings()
    create_listing_result = test_create_listing()
    search_result = test_search_functionality()
    compare_result = test_compare_functionality()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"API Health Check: {'PASSED' if api_health_result else 'FAILED'}")
    print(f"Authentication Endpoints: {'PASSED' if auth_result else 'FAILED'}")
    print(f"Recent Listings: {'PASSED' if recent_listings_result else 'FAILED'}")
    print(f"Featured Listings: {'PASSED' if featured_listings_result else 'FAILED'}")
    print(f"Individual Listings: {'PASSED' if individual_listings_result else 'FAILED'}")
    print(f"Create Listing: {'PASSED' if create_listing_result else 'FAILED'}")
    print(f"Search Functionality: {'PASSED' if search_result else 'FAILED'}")
    print(f"Compare Functionality: {'PASSED' if compare_result else 'FAILED'}")
    
    # Overall result
    all_passed = (
        api_health_result and 
        auth_result and 
        recent_listings_result and 
        featured_listings_result and 
        individual_listings_result and 
        create_listing_result and 
        search_result and 
        compare_result
    )
    
    if all_passed:
        print("\nAll tests PASSED! The PhoneFlip backend API is working correctly.")
        return 0
    else:
        print("\nSome tests FAILED. The PhoneFlip backend API has issues that need to be addressed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())