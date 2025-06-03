
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('/app/backend/.env')

async def check_db():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check phone_specs collection
    count = await db.phone_specs.count_documents({})
    print(f'Total phone specs in database: {count}')
    
    # Get first document
    first = await db.phone_specs.find_one()
    if first:
        # Convert ObjectId to string for JSON serialization
        if '_id' in first:
            first['_id'] = str(first['_id'])
        
        # Convert datetime objects to strings
        for key, value in first.items():
            if hasattr(value, 'isoformat'):
                first[key] = value.isoformat()
        
        print('First document:')
        print(json.dumps(first, indent=2))
    else:
        print('No documents found in phone_specs collection')

# Run the async function
if __name__ == '__main__':
    asyncio.run(check_db())
