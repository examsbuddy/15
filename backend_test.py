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

# Function to test admin stats endpoint
def test_admin_stats():
    print("\n=== Testing GET /api/stats (Admin Statistics) ===")
    try:
        response = requests.get(f"{API_URL}/stats")
        response.raise_for_status()
        
        stats = response.json()
        print(f"Retrieved admin statistics:")
        for key, value in stats.items():
            if isinstance(value, list):
                print(f"  {key}: {len(value)} items")
            else:
                print(f"  {key}: {value}")
        
        # Check if all required fields are present
        required_fields = ['totalListings', 'totalUsers', 'pendingApprovals', 'phoneModels']
        missing_fields = [field for field in required_fields if field not in stats]
        
        if missing_fields:
            print(f"ERROR: Missing required fields in admin stats: {', '.join(missing_fields)}")
            return False
            
        return True
    except Exception as e:
        print(f"Error testing admin stats: {str(e)}")
        return False

# Function to test getting all phone specs
def test_get_all_phone_specs():
    print("\n=== Testing GET /api/phone-specs (Get All Phone Specs) ===")
    try:
        response = requests.get(f"{API_URL}/phone-specs")
        response.raise_for_status()
        
        specs = response.json()
        print(f"Retrieved {len(specs)} phone specifications")
        
        if specs:
            print("Sample phone spec:")
            sample_spec = specs[0]
            for key, value in sample_spec.items():
                print(f"  {key}: {value}")
        
        return True
    except Exception as e:
        print(f"Error testing get all phone specs: {str(e)}")
        return False

# Function to test creating a new phone spec
def test_create_phone_spec():
    print("\n=== Testing POST /api/phone-specs (Create Phone Spec) ===")
    try:
        # Create a sample phone spec
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        sample_spec = {
            "brand": "Test Brand",
            "model": f"Test Model {random_suffix}",
            "display_size": "6.5 inch",
            "camera_mp": "48MP",
            "battery_mah": "4000mAh",
            "storage_gb": "128GB",
            "ram_gb": "8GB",
            "processor": "Test Processor",
            "operating_system": "Test OS",
            "price_range_min": 20000,
            "price_range_max": 40000,
            "release_year": 2023
        }
        
        response = requests.post(f"{API_URL}/phone-specs", json=sample_spec)
        response.raise_for_status()
        
        created_spec = response.json()
        print(f"Successfully created phone spec: {created_spec.get('brand')} {created_spec.get('model')}")
        
        # Save the spec ID for update and delete tests
        spec_id = created_spec.get('_id')
        if not spec_id:
            print("ERROR: Created spec does not have an ID")
            return False, None
            
        print(f"Created spec ID: {spec_id}")
        return True, spec_id
    except Exception as e:
        print(f"Error testing create phone spec: {str(e)}")
        return False, None

# Function to test updating a phone spec
def test_update_phone_spec(spec_id):
    print(f"\n=== Testing PUT /api/phone-specs/{spec_id} (Update Phone Spec) ===")
    try:
        # Update the sample phone spec
        updated_spec = {
            "brand": "Updated Brand",
            "model": "Updated Model",
            "display_size": "6.7 inch",
            "camera_mp": "64MP",
            "battery_mah": "5000mAh",
            "storage_gb": "256GB",
            "ram_gb": "12GB",
            "processor": "Updated Processor",
            "operating_system": "Updated OS",
            "price_range_min": 30000,
            "price_range_max": 50000,
            "release_year": 2024
        }
        
        response = requests.put(f"{API_URL}/phone-specs/{spec_id}", json=updated_spec)
        response.raise_for_status()
        
        result = response.json()
        print(f"Successfully updated phone spec: {result.get('brand')} {result.get('model')}")
        
        # Verify the update was successful
        if result.get('brand') != "Updated Brand" or result.get('model') != "Updated Model":
            print("ERROR: Update was not successful")
            return False
            
        return True
    except Exception as e:
        print(f"Error testing update phone spec: {str(e)}")
        return False

# Function to test deleting a phone spec
def test_delete_phone_spec(spec_id):
    print(f"\n=== Testing DELETE /api/phone-specs/{spec_id} (Delete Phone Spec) ===")
    try:
        response = requests.delete(f"{API_URL}/phone-specs/{spec_id}")
        response.raise_for_status()
        
        result = response.json()
        print(f"Delete result: {result}")
        
        if result.get('message') == "Phone specification deleted successfully":
            print("Successfully deleted phone spec")
            
            # Verify the spec was deleted by trying to get it
            verify_response = requests.get(f"{API_URL}/phone-specs")
            verify_response.raise_for_status()
            
            specs = verify_response.json()
            deleted = all(spec.get('_id') != spec_id for spec in specs)
            
            if deleted:
                print("Verified spec was deleted successfully")
                return True
            else:
                print("ERROR: Spec was not deleted")
                return False
        else:
            print("ERROR: Delete operation did not return success message")
            return False
    except Exception as e:
        print(f"Error testing delete phone spec: {str(e)}")
        return False

# Function to test CSV template download
def test_csv_template_download():
    print("\n=== Testing GET /api/phone-specs/csv-template ===")
    try:
        response = requests.get(f"{API_URL}/phone-specs/csv-template")
        response.raise_for_status()
        
        # Check if the response is a CSV file
        content_type = response.headers.get('Content-Type', '')
        content_disposition = response.headers.get('Content-Disposition', '')
        
        print(f"Response Content-Type: {content_type}")
        print(f"Response Content-Disposition: {content_disposition}")
        
        if 'text/csv' not in content_type:
            print(f"ERROR: Expected Content-Type to be 'text/csv', got '{content_type}'")
            return False
            
        if 'attachment; filename=phone_specs_template.csv' not in content_disposition:
            print(f"WARNING: Expected Content-Disposition to include 'attachment; filename=phone_specs_template.csv'")
        
        # Check the CSV content
        csv_content = response.text
        print(f"CSV content length: {len(csv_content)} bytes")
        
        # Parse the CSV to check headers and sample data
        import csv
        from io import StringIO
        
        csv_reader = csv.DictReader(StringIO(csv_content))
        headers = csv_reader.fieldnames
        
        if not headers:
            print("ERROR: CSV has no headers")
            return False
            
        print(f"CSV headers ({len(headers)}): {', '.join(headers[:10])}...")
        
        # Check if required headers are present
        required_headers = ['brand', 'model']
        missing_headers = [h for h in required_headers if h not in headers]
        
        if missing_headers:
            print(f"ERROR: Missing required headers: {', '.join(missing_headers)}")
            return False
            
        # Check if there's sample data
        rows = list(csv_reader)
        if not rows:
            print("ERROR: CSV has no sample data rows")
            return False
            
        print(f"CSV contains {len(rows)} sample data rows")
        
        # Check sample data for first row
        sample_row = rows[0]
        print("Sample data:")
        for key in ['brand', 'model', 'os', 'display_size', 'ram', 'storage']:
            if key in sample_row:
                print(f"  {key}: {sample_row[key]}")
        
        # Save the CSV for bulk import testing
        with open('/tmp/phone_specs_template.csv', 'w') as f:
            f.write(csv_content)
            
        print("Saved CSV template to /tmp/phone_specs_template.csv for bulk import testing")
        return True
    except Exception as e:
        print(f"Error testing CSV template download: {str(e)}")
        return False

# Function to create a test CSV file for bulk import
def create_test_csv_for_import():
    print("\n=== Creating test CSV file for bulk import ===")
    try:
        # Create a simple CSV with 2-3 phone specifications
        import csv
        
        # Generate random suffix to avoid duplicate entries
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        
        csv_data = [
            {
                "brand": "Test Brand",
                "model": f"Test Model {random_suffix}-1",
                "os": "Test OS 1",
                "ui": "Test UI 1",
                "dimensions": "150 x 70 x 8 mm",
                "weight": "180 g",
                "sim": "Nano-SIM + eSIM",
                "colors": "Black, White, Blue",
                "network_2g": "GSM 850 / 900 / 1800 / 1900",
                "network_3g": "HSDPA 850 / 900 / 1700 / 1900 / 2100",
                "network_4g": "LTE band 1,2,3,4,5,7,8,12,13,17,18,19,20,25,26",
                "network_5g": "5G band 1,3,5,7,8,20,28,38,40,41,77,78",
                "cpu": "Octa-core (4x2.8 GHz + 4x2.0 GHz)",
                "chipset": "Test Chipset 1",
                "gpu": "Test GPU 1",
                "display_technology": "AMOLED",
                "display_size": "6.5 inches",
                "display_resolution": "1080 x 2400 pixels",
                "display_features": "120Hz, HDR10+",
                "storage": "128GB",
                "ram": "8GB",
                "card_slot": "No",
                "main_camera": "48 MP, f/1.8, 26mm (wide)",
                "camera_features": "LED flash, HDR, panorama",
                "front_camera": "16 MP, f/2.0, 26mm (wide)",
                "wlan": "Wi-Fi 802.11 a/b/g/n/ac/6",
                "bluetooth": "5.2, A2DP, LE",
                "gps": "GPS, GLONASS, BDS, GALILEO",
                "radio": "No",
                "usb": "USB Type-C 3.1",
                "nfc": "Yes",
                "infrared": "No",
                "sensors": "Fingerprint, accelerometer, gyro, proximity, compass",
                "battery_capacity": "4500 mAh",
                "charging": "Fast charging 65W",
                "price_pkr": "75000",
                "price_usd": "270",
                "release_year": "2023"
            },
            {
                "brand": "Test Brand",
                "model": f"Test Model {random_suffix}-2",
                "os": "Test OS 2",
                "ui": "Test UI 2",
                "dimensions": "160 x 75 x 8.5 mm",
                "weight": "200 g",
                "sim": "Dual SIM (Nano-SIM)",
                "colors": "Red, Green, Yellow",
                "network_2g": "GSM 850 / 900 / 1800 / 1900",
                "network_3g": "HSDPA 850 / 900 / 1700 / 1900 / 2100",
                "network_4g": "LTE band 1,2,3,4,5,7,8,12,13,17,18,19,20,25,26",
                "network_5g": "5G band 1,3,5,7,8,20,28,38,40,41,77,78",
                "cpu": "Octa-core (1x3.0 GHz + 3x2.6 GHz + 4x1.8 GHz)",
                "chipset": "Test Chipset 2",
                "gpu": "Test GPU 2",
                "display_technology": "Super AMOLED",
                "display_size": "6.7 inches",
                "display_resolution": "1440 x 3200 pixels",
                "display_features": "120Hz, HDR10+, 1300 nits",
                "storage": "256GB",
                "ram": "12GB",
                "card_slot": "No",
                "main_camera": "108 MP, f/1.8, 24mm (wide)",
                "camera_features": "LED flash, HDR, panorama, 8K video",
                "front_camera": "32 MP, f/2.2, 26mm (wide)",
                "wlan": "Wi-Fi 802.11 a/b/g/n/ac/6e",
                "bluetooth": "5.3, A2DP, LE",
                "gps": "GPS, GLONASS, BDS, GALILEO, QZSS",
                "radio": "No",
                "usb": "USB Type-C 3.2",
                "nfc": "Yes",
                "infrared": "Yes",
                "sensors": "Fingerprint, accelerometer, gyro, proximity, compass, barometer",
                "battery_capacity": "5000 mAh",
                "charging": "Fast charging 120W, 50% in 10 min",
                "price_pkr": "120000",
                "price_usd": "430",
                "release_year": "2023"
            },
            {
                "brand": "Test Brand",
                "model": f"Test Model {random_suffix}-3",
                "os": "Test OS 3",
                "ui": "Test UI 3",
                "dimensions": "145 x 68 x 7.5 mm",
                "weight": "160 g",
                "sim": "Nano-SIM",
                "colors": "Purple, Orange, Pink",
                "network_2g": "GSM 850 / 900 / 1800 / 1900",
                "network_3g": "HSDPA 850 / 900 / 1700 / 1900 / 2100",
                "network_4g": "LTE band 1,2,3,4,5,7,8,12,13,17,18,19,20,25,26",
                "network_5g": "No",
                "cpu": "Hexa-core (2x2.5 GHz + 4x1.8 GHz)",
                "chipset": "Test Chipset 3",
                "gpu": "Test GPU 3",
                "display_technology": "IPS LCD",
                "display_size": "6.1 inches",
                "display_resolution": "828 x 1792 pixels",
                "display_features": "60Hz, 625 nits",
                "storage": "64GB",
                "ram": "4GB",
                "card_slot": "Yes, microSDXC",
                "main_camera": "12 MP, f/1.8, 26mm (wide)",
                "camera_features": "LED flash, HDR",
                "front_camera": "8 MP, f/2.0",
                "wlan": "Wi-Fi 802.11 a/b/g/n/ac",
                "bluetooth": "5.0, A2DP, LE",
                "gps": "GPS, GLONASS, GALILEO",
                "radio": "FM radio",
                "usb": "USB Type-C 2.0",
                "nfc": "No",
                "infrared": "No",
                "sensors": "Fingerprint, accelerometer, proximity",
                "battery_capacity": "3500 mAh",
                "charging": "Fast charging 18W",
                "price_pkr": "45000",
                "price_usd": "160",
                "release_year": "2022"
            }
        ]
        
        # Write to CSV file
        csv_file_path = '/tmp/test_phone_specs.csv'
        with open(csv_file_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=csv_data[0].keys())
            writer.writeheader()
            writer.writerows(csv_data)
            
        print(f"Created test CSV file at {csv_file_path} with {len(csv_data)} phone specifications")
        return csv_file_path, csv_data
    except Exception as e:
        print(f"Error creating test CSV file: {str(e)}")
        return None, None

# Function to test CSV bulk import
def test_csv_bulk_import():
    print("\n=== Testing POST /api/phone-specs/bulk-import ===")
    try:
        # Always create a fresh CSV file with unique model names
        print("Creating a fresh CSV file with unique model names...")
        csv_file_path, csv_data = create_test_csv_for_import()
        if not csv_file_path or not csv_data:
            print("ERROR: Failed to create test CSV file")
            return False
            
        print(f"Created test CSV file at {csv_file_path}")
        print(f"Test phones:")
        for row in csv_data:
            print(f"- {row.get('brand')} {row.get('model')}")
            
        # Upload the CSV file
        with open(csv_file_path, 'rb') as f:
            files = {'file': ('test_phone_specs.csv', f, 'text/csv')}
            response = requests.post(f"{API_URL}/phone-specs/bulk-import", files=files)
            
        # Check response
        if response.status_code != 200:
            print(f"ERROR: Bulk import failed with status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        result = response.json()
        print(f"Bulk import result: {result}")
        
        # Check if the import was successful
        if not result.get('success'):
            print("ERROR: Bulk import was not successful")
            return False
            
        # Check import statistics
        total_rows = result.get('total_rows', 0)
        successful_imports = result.get('successful_imports', 0)
        failed_imports = result.get('failed_imports', 0)
        
        print(f"Total rows: {total_rows}")
        print(f"Successful imports: {successful_imports}")
        print(f"Failed imports: {failed_imports}")
        
        if total_rows != len(csv_data):
            print(f"WARNING: Total rows ({total_rows}) doesn't match CSV data length ({len(csv_data)})")
            
        if successful_imports == 0:
            print("ERROR: No specifications were successfully imported")
            return False
            
        # Check if imported specs are in the database
        print("\n--- Verifying imported specifications in database ---")
        response = requests.get(f"{API_URL}/phone-specs")
        response.raise_for_status()
        
        all_specs = response.json()
        print(f"Total phone specs in database: {len(all_specs)}")
        
        # Check for the test phones we just imported
        expected_brand = "Test Brand"
        found_phones = []
        
        # Extract model names from the CSV data for verification
        expected_models = [row.get('model') for row in csv_data]
        
        for spec in all_specs:
            if spec.get('brand') == expected_brand and spec.get('model') in expected_models:
                found_phones.append(f"{spec.get('brand')} {spec.get('model')}")
                
                # Print detailed information for verification
                print(f"\nDetailed information for {spec.get('brand')} {spec.get('model')}:")
                print(f"- OS: {spec.get('os', 'N/A')}")
                print(f"- Chipset: {spec.get('chipset', 'N/A')}")
                print(f"- Display: {spec.get('display_size', 'N/A')} - {spec.get('display_technology', 'N/A')}")
                print(f"- Camera: {spec.get('main_camera', 'N/A')}")
                print(f"- Battery: {spec.get('battery_capacity', 'N/A')}")
                print(f"- Price: PKR {spec.get('price_pkr', 'N/A')} / USD {spec.get('price_usd', 'N/A')}")
        
        print(f"Found {len(found_phones)}/{len(expected_models)} expected phones in database")
        
        if len(found_phones) < len(expected_models):
            print("WARNING: Not all expected phones were found in the database")
            # Don't fail the test if at least one phone was imported successfully
            if not found_phones:
                print("ERROR: No test phones were found in the database")
                return False
            
        return True
    except Exception as e:
        print(f"Error testing CSV bulk import: {str(e)}")
        return False

# Function to test admin user management endpoints
def test_admin_user_management():
    print("\n=== Testing Admin User Management Endpoints ===")
    
    # Test 1: GET /api/admin/users
    print("\n--- Test 1: GET /api/admin/users ---")
    try:
        # Test with no filters
        response = requests.get(f"{API_URL}/admin/users")
        response.raise_for_status()
        
        result = response.json()
        print(f"Retrieved {result.get('total', 0)} users")
        
        # Check if the response has the expected structure
        if 'users' not in result or 'total' not in result or 'offset' not in result or 'limit' not in result:
            print("ERROR: Response missing required fields")
            return False
            
        # Check if users have expected fields
        if result.get('users'):
            sample_user = result['users'][0]
            print("Sample user fields:")
            for key in ['_id', 'name', 'email', 'role', 'verification_status', 'created_at']:
                if key in sample_user:
                    print(f"  {key}: {sample_user[key]}")
                else:
                    print(f"  {key}: MISSING")
            
            # Check if password is NOT included (security check)
            if 'password' in sample_user:
                print("ERROR: User password is exposed in the response")
                return False
        
        # Test with role filter
        print("\n--- Testing role filter ---")
        response = requests.get(f"{API_URL}/admin/users", params={"role": "shop_owner"})
        response.raise_for_status()
        
        role_filtered = response.json()
        print(f"Retrieved {role_filtered.get('total', 0)} shop owners")
        
        # Verify all users have the correct role
        if role_filtered.get('users'):
            all_correct_role = all(user.get('role') == 'shop_owner' for user in role_filtered['users'])
            print(f"All users have correct role: {all_correct_role}")
            
            if not all_correct_role:
                print("ERROR: Role filter not working correctly")
        
        # Test with verification status filter
        print("\n--- Testing verification status filter ---")
        response = requests.get(f"{API_URL}/admin/users", params={"verification_status": "pending"})
        response.raise_for_status()
        
        status_filtered = response.json()
        print(f"Retrieved {status_filtered.get('total', 0)} pending users")
        
        # Verify all users have the correct verification status
        if status_filtered.get('users'):
            all_correct_status = all(user.get('verification_status') == 'pending' for user in status_filtered['users'])
            print(f"All users have correct verification status: {all_correct_status}")
            
            if not all_correct_status:
                print("ERROR: Verification status filter not working correctly")
        
        # Test with pagination
        print("\n--- Testing pagination ---")
        response = requests.get(f"{API_URL}/admin/users", params={"limit": 2, "offset": 0})
        response.raise_for_status()
        
        page1 = response.json()
        print(f"Page 1: Retrieved {len(page1.get('users', []))} users")
        
        if page1.get('total', 0) > 2:
            response = requests.get(f"{API_URL}/admin/users", params={"limit": 2, "offset": 2})
            response.raise_for_status()
            
            page2 = response.json()
            print(f"Page 2: Retrieved {len(page2.get('users', []))} users")
            
            # Check if pages have different users
            if page1.get('users') and page2.get('users'):
                page1_ids = [user.get('_id') for user in page1['users']]
                page2_ids = [user.get('_id') for user in page2['users']]
                
                different_pages = all(id1 != id2 for id1 in page1_ids for id2 in page2_ids)
                print(f"Pages contain different users: {different_pages}")
                
                if not different_pages:
                    print("ERROR: Pagination not working correctly")
        
        return True
    except Exception as e:
        print(f"Error testing GET /api/admin/users: {str(e)}")
        return False

# Function to test pending approvals endpoint
def test_pending_approvals():
    print("\n=== Testing GET /api/admin/pending-approvals ===")
    try:
        response = requests.get(f"{API_URL}/admin/pending-approvals")
        response.raise_for_status()
        
        result = response.json()
        print(f"Retrieved {result.get('count', 0)} pending approvals")
        
        # Check if the response has the expected structure
        if 'pending_approvals' not in result or 'count' not in result:
            print("ERROR: Response missing required fields")
            return False
            
        # Check if pending approvals have expected fields and correct status
        if result.get('pending_approvals'):
            sample_approval = result['pending_approvals'][0]
            print("Sample pending approval fields:")
            for key in ['_id', 'name', 'email', 'role', 'verification_status', 'created_at', 'business_details']:
                if key in sample_approval:
                    print(f"  {key}: {sample_approval[key] if key != 'business_details' else 'Present'}")
                else:
                    print(f"  {key}: MISSING")
            
            # Verify all pending approvals have role=shop_owner and verification_status=pending
            all_shop_owners = all(approval.get('role') == 'shop_owner' for approval in result['pending_approvals'])
            all_pending = all(approval.get('verification_status') == 'pending' for approval in result['pending_approvals'])
            
            print(f"All are shop owners: {all_shop_owners}")
            print(f"All are pending: {all_pending}")
            
            if not all_shop_owners or not all_pending:
                print("ERROR: Pending approvals endpoint returning incorrect data")
                return False
        
        return True
    except Exception as e:
        print(f"Error testing GET /api/admin/pending-approvals: {str(e)}")
        return False

# Function to test featured shops endpoint
def test_featured_shops():
    print("\n=== Testing GET /api/shops/featured ===")
    try:
        response = requests.get(f"{API_URL}/shops/featured")
        response.raise_for_status()
        
        result = response.json()
        print(f"Retrieved {result.get('count', 0)} featured shops")
        
        # Check if the response has the expected structure
        if 'featured_shops' not in result or 'count' not in result:
            print("ERROR: Response missing required fields")
            return False
            
        # Check if featured shops have expected fields
        if result.get('featured_shops'):
            sample_shop = result['featured_shops'][0]
            print("Sample featured shop fields:")
            for key in ['id', 'name', 'description', 'location', 'phone', 'email', 'businessType', 'rating', 'reviewCount', 'verificationStatus']:
                if key in sample_shop:
                    print(f"  {key}: {sample_shop[key]}")
                else:
                    print(f"  {key}: MISSING")
            
            # Verify all featured shops have verificationStatus=approved
            all_approved = all(shop.get('verificationStatus') == 'approved' for shop in result['featured_shops'])
            print(f"All shops are approved: {all_approved}")
            
            if not all_approved:
                print("ERROR: Featured shops endpoint returning non-approved shops")
                return False
        
        return True
    except Exception as e:
        print(f"Error testing GET /api/shops/featured: {str(e)}")
        return False

# Function to test error handling in CSV bulk import
def test_csv_bulk_import_errors():
    print("\n=== Testing Error Handling in CSV Bulk Import ===")
    
    # Test 1: Invalid file format
    print("\n--- Test 1: Invalid file format ---")
    try:
        # Create a text file with invalid content
        invalid_file_path = '/tmp/invalid_file.txt'
        with open(invalid_file_path, 'w') as f:
            f.write("This is not a CSV file")
            
        with open(invalid_file_path, 'rb') as f:
            files = {'file': ('invalid_file.txt', f, 'text/plain')}
            response = requests.post(f"{API_URL}/phone-specs/bulk-import", files=files)
            
        print(f"Response status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            print("PASSED: Server correctly rejected invalid file format")
        else:
            print(f"FAILED: Server accepted invalid file format with status code {response.status_code}")
    except Exception as e:
        print(f"Error testing invalid file format: {str(e)}")
    
    # Test 2: Missing required fields
    print("\n--- Test 2: Missing required fields ---")
    try:
        # Create a CSV with missing required fields
        import csv
        missing_fields_path = '/tmp/missing_fields.csv'
        with open(missing_fields_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['model', 'os', 'ram'])  # Missing 'brand'
            writer.writeheader()
            writer.writerow({
                'model': 'Test Model Missing Brand',
                'os': 'Test OS',
                'ram': '8GB'
            })
            
        with open(missing_fields_path, 'rb') as f:
            files = {'file': ('missing_fields.csv', f, 'text/csv')}
            response = requests.post(f"{API_URL}/phone-specs/bulk-import", files=files)
            
        print(f"Response status code: {response.status_code}")
        result = response.json()
        print(f"Response: {result}")
        
        if response.status_code == 200 and result.get('failed_imports', 0) > 0:
            print("PASSED: Server correctly handled missing required fields")
        else:
            print("FAILED: Server did not properly handle missing required fields")
    except Exception as e:
        print(f"Error testing missing required fields: {str(e)}")
    
    # Test 3: Duplicate phone specs
    print("\n--- Test 3: Duplicate phone specs ---")
    try:
        # First, get existing specs
        response = requests.get(f"{API_URL}/phone-specs")
        response.raise_for_status()
        
        existing_specs = response.json()
        if not existing_specs:
            print("No existing specs found, skipping duplicate test")
            return True
            
        # Create a CSV with a duplicate entry
        import csv
        duplicate_spec = existing_specs[0]
        duplicate_path = '/tmp/duplicate_spec.csv'
        
        with open(duplicate_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['brand', 'model', 'os', 'ram'])
            writer.writeheader()
            writer.writerow({
                'brand': duplicate_spec.get('brand'),
                'model': duplicate_spec.get('model'),
                'os': duplicate_spec.get('os', 'Test OS'),
                'ram': duplicate_spec.get('ram', '8GB')
            })
            
        with open(duplicate_path, 'rb') as f:
            files = {'file': ('duplicate_spec.csv', f, 'text/csv')}
            response = requests.post(f"{API_URL}/phone-specs/bulk-import", files=files)
            
        print(f"Response status code: {response.status_code}")
        result = response.json()
        print(f"Response: {result}")
        
        if response.status_code == 200 and result.get('failed_imports', 0) > 0:
            print("PASSED: Server correctly handled duplicate phone specs")
        else:
            print("FAILED: Server did not properly handle duplicate phone specs")
    except Exception as e:
        print(f"Error testing duplicate phone specs: {str(e)}")
    
    return True

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
    
    # Run admin-related tests
    admin_stats_result = test_admin_stats()
    get_all_phone_specs_result = test_get_all_phone_specs()
    create_phone_spec_result, spec_id = test_create_phone_spec()
    
    # Only run update and delete tests if create was successful
    update_phone_spec_result = False
    delete_phone_spec_result = False
    if create_phone_spec_result and spec_id:
        update_phone_spec_result = test_update_phone_spec(spec_id)
        delete_phone_spec_result = test_delete_phone_spec(spec_id)
    
    # Run CSV bulk import tests
    csv_template_result = test_csv_template_download()
    csv_bulk_import_result = test_csv_bulk_import()
    csv_error_handling_result = test_csv_bulk_import_errors()
    
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
    print(f"Admin Stats: {'PASSED' if admin_stats_result else 'FAILED'}")
    print(f"Get All Phone Specs: {'PASSED' if get_all_phone_specs_result else 'FAILED'}")
    print(f"Create Phone Spec: {'PASSED' if create_phone_spec_result else 'FAILED'}")
    print(f"Update Phone Spec: {'PASSED' if update_phone_spec_result else 'FAILED'}")
    print(f"Delete Phone Spec: {'PASSED' if delete_phone_spec_result else 'FAILED'}")
    print(f"CSV Template Download: {'PASSED' if csv_template_result else 'FAILED'}")
    print(f"CSV Bulk Import: {'PASSED' if csv_bulk_import_result else 'FAILED'}")
    print(f"CSV Error Handling: {'PASSED' if csv_error_handling_result else 'FAILED'}")
    
    # Overall result
    all_passed = (
        api_health_result and 
        auth_result and 
        recent_listings_result and 
        featured_listings_result and 
        individual_listings_result and 
        create_listing_result and 
        search_result and 
        compare_result and
        admin_stats_result and
        get_all_phone_specs_result and
        create_phone_spec_result and
        update_phone_spec_result and
        delete_phone_spec_result and
        csv_template_result and
        csv_bulk_import_result and
        csv_error_handling_result
    )
    
    if all_passed:
        print("\nAll tests PASSED! The PhoneFlip backend API is working correctly.")
        return 0
    else:
        print("\nSome tests FAILED. The PhoneFlip backend API has issues that need to be addressed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())