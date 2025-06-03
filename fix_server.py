
import re

def fix_compare_endpoint_code():
    # Read the server.py file
    with open('/app/backend/server.py', 'r') as f:
        server_code = f.read()
    
    # Find the compare endpoint function
    compare_endpoint_pattern = r'@api_router\.get\("/phone-specs/compare"\).*?def get_phone_specs_for_compare\(\):.*?return phone_specs.*?except Exception as e:'
    compare_endpoint_match = re.search(compare_endpoint_pattern, server_code, re.DOTALL)
    
    if not compare_endpoint_match:
        print("Could not find the compare endpoint function in server.py")
        return
    
    # Get the current implementation
    current_impl = compare_endpoint_match.group(0)
    print("Current implementation:")
    print(current_impl)
    
    # Create the fixed implementation
    fixed_impl = '''@api_router.get("/phone-specs/compare")
async def get_phone_specs_for_compare():
    """Get phone specs formatted specifically for the compare function"""
    try:
        phone_specs = []
        async for phone in db.phone_specs.find():
            # Extract brand and model correctly
            brand = phone.get("brand", "Unknown")
            model = phone.get("model", "Unknown")
            
            # Remove brand name from model if it's duplicated
            if model.startswith(brand):
                model = model[len(brand):].strip()
            
            # Transform to compare-friendly format
            compare_phone = {
                "_id": str(phone.get("_id")),
                "brand": brand,
                "model": model,
                "displayName": f"{brand} {model}",
                "price": phone.get("price_range_min", 0),
                "photos": ['/api/placeholder/300/200'],
                "storage": f"{phone.get('storage_gb', 'N/A')}GB" if phone.get('storage_gb') else 'N/A',
                "ram": f"{phone.get('ram_gb', 'N/A')}GB" if phone.get('ram_gb') else 'N/A',
                "battery": f"{phone.get('battery_mah', 'N/A')} mAh" if phone.get('battery_mah') else 'N/A',
                "camera": phone.get('camera_mp', 'N/A'),
                "screen_size": phone.get('display_size', 'N/A'),
                "processor": phone.get('processor', 'N/A'),
                "operating_system": phone.get('operating_system', 'N/A'),
                "network": "5G" if phone.get('network_5g') == 'Yes' else "4G",
                "price_range": f"PKR {phone.get('price_range_min', 0)} - {phone.get('price_range_max', 0)}" if phone.get('price_range_min') else 'Price not available'
            }
            phone_specs.append(compare_phone)
        
        return phone_specs
    except Exception as e:'''
    
    # Replace the current implementation with the fixed one
    fixed_server_code = server_code.replace(current_impl, fixed_impl)
    
    # Write the fixed code back to server.py
    with open('/app/backend/server.py', 'w') as f:
        f.write(fixed_server_code)
    
    print("\nFixed implementation:")
    print(fixed_impl)
    print("\nServer.py has been updated with the fixed compare endpoint implementation.")

if __name__ == '__main__':
    fix_compare_endpoint_code()
