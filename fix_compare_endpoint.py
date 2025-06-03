
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('/app/backend/.env')

async def fix_compare_endpoint():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check phone_specs collection
    count = await db.phone_specs.count_documents({})
    print(f'Total phone specs in database: {count}')
    
    # Test the compare endpoint logic
    phone_specs = []
    async for phone in db.phone_specs.find():
        # Transform to compare-friendly format
        compare_phone = {
            "_id": str(phone.get("_id")),
            "brand": phone.get("brand", "Unknown"),
            "model": phone.get("model", "Unknown"),
            "displayName": f"{phone.get('brand', 'Unknown')} {phone.get('model', 'Unknown')}",
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
    
    print(f'Transformed {len(phone_specs)} phones for comparison')
    
    # Print the first few phones
    for i, phone in enumerate(phone_specs[:5]):
        print(f"\nPhone {i+1}: {phone['displayName']}")
        print(f"  Brand: {phone['brand']}")
        print(f"  Model: {phone['model']}")
        print(f"  Storage: {phone['storage']}")
        print(f"  RAM: {phone['ram']}")
        print(f"  Battery: {phone['battery']}")
        print(f"  Camera: {phone['camera']}")
        print(f"  Screen Size: {phone['screen_size']}")
        print(f"  Processor: {phone['processor']}")
        print(f"  OS: {phone['operating_system']}")

# Run the async function
if __name__ == '__main__':
    asyncio.run(fix_compare_endpoint())
