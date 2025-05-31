#!/usr/bin/env python3
import requests
import json
import sys
import os
from urllib.parse import urlparse
import time

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
        for i, listing in enumerate(listings):
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
                
        print(f"\nValid listings with real images: {valid_listings}/{len(listings)}")
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
        for i, listing in enumerate(listings):
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
                
        print(f"\nValid listings with real images: {valid_listings}/{len(listings)}")
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
    print("Starting phone listings API tests...")
    
    # First, populate sample data to ensure we have listings to test
    if not populate_sample_data():
        print("WARNING: Failed to populate sample data, but continuing with tests")
    
    # Run the tests
    recent_test_result = test_recent_listings()
    featured_test_result = test_featured_listings()
    individual_test_result = test_individual_listings()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"Recent listings test: {'PASSED' if recent_test_result else 'FAILED'}")
    print(f"Featured listings test: {'PASSED' if featured_test_result else 'FAILED'}")
    print(f"Individual listings test: {'PASSED' if individual_test_result else 'FAILED'}")
    
    # Overall result
    if recent_test_result and featured_test_result and individual_test_result:
        print("\nAll tests PASSED! The backend is providing real phone images consistently across all endpoints.")
        return 0
    else:
        print("\nSome tests FAILED. The backend is not providing real phone images consistently across all endpoints.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
