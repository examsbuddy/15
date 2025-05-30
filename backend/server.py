from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Phone Listing Models
class PhoneListingCreate(BaseModel):
    brand: str
    model: str
    condition: str
    price: int
    storage: str
    ram: str
    city: str
    description: str
    seller_name: str
    seller_phone: str
    seller_email: str
    features: List[str] = []

class PhoneListing(BaseModel):
    id: Optional[str] = Field(alias="_id")
    brand: str
    model: str
    condition: str
    price: int
    storage: str
    ram: str
    city: str
    description: str
    seller_name: str
    seller_phone: str
    seller_email: str
    features: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    views: int = 0
    is_featured: bool = False
    is_active: bool = True
    
    class Config:
        populate_by_name = True

# Existing routes
@api_router.get("/")
async def root():
    return {"message": "PhoneFlip.PK API is running"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Phone Listing Routes
@api_router.post("/listings", response_model=dict)
async def create_listing(listing: PhoneListingCreate):
    """Create a new phone listing"""
    try:
        # Convert to dict and add metadata
        listing_dict = listing.dict()
        listing_dict["created_at"] = datetime.utcnow()
        listing_dict["views"] = 0
        listing_dict["is_featured"] = False
        listing_dict["is_active"] = True
        
        # Insert into database
        result = await db.phone_listings.insert_one(listing_dict)
        
        # Return success response with the listing ID
        return {
            "success": True,
            "message": "Listing created successfully!",
            "listing_id": str(result.inserted_id)
        }
    except Exception as e:
        logger.error(f"Error creating listing: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create listing")

@api_router.get("/listings/featured", response_model=List[PhoneListing])
async def get_featured_listings(limit: int = 4):
    """Get featured phone listings"""
    try:
        # Get featured listings first, then recent ones if not enough featured
        featured_cursor = db.phone_listings.find({
            "is_active": True, 
            "is_featured": True
        }).sort("created_at", -1).limit(limit)
        featured_listings = await featured_cursor.to_list(length=limit)
        
        # If we don't have enough featured listings, get recent ones
        if len(featured_listings) < limit:
            remaining = limit - len(featured_listings)
            recent_cursor = db.phone_listings.find({
                "is_active": True,
                "is_featured": False
            }).sort("created_at", -1).limit(remaining)
            recent_listings = await recent_cursor.to_list(length=remaining)
            featured_listings.extend(recent_listings)
        
        # Serialize ObjectIds
        for listing in featured_listings:
            listing = serialize_doc(listing)
        
        return [PhoneListing(**listing) for listing in featured_listings]
    except Exception as e:
        logger.error(f"Error fetching featured listings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured listings")

@api_router.get("/listings", response_model=List[PhoneListing])
async def get_listings(skip: int = 0, limit: int = 50, city: Optional[str] = None, brand: Optional[str] = None, min_price: Optional[int] = None, max_price: Optional[int] = None):
    """Get phone listings with optional filters"""
    try:
        # Build query filter
        query = {"is_active": True}
        
        if city:
            query["city"] = {"$regex": city, "$options": "i"}
        if brand:
            query["brand"] = {"$regex": brand, "$options": "i"}
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = min_price
            if max_price is not None:
                price_filter["$lte"] = max_price
            query["price"] = price_filter
        
        # Get listings sorted by creation date (newest first)
        cursor = db.phone_listings.find(query).sort("created_at", -1).skip(skip).limit(limit)
        listings = await cursor.to_list(length=limit)
        
        # Serialize ObjectIds
        for listing in listings:
            listing = serialize_doc(listing)
        
        return [PhoneListing(**listing) for listing in listings]
    except Exception as e:
        logger.error(f"Error fetching listings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch listings")

@api_router.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    """Get a specific listing by ID"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(listing_id):
            raise HTTPException(status_code=400, detail="Invalid listing ID")
        
        # Find the listing
        listing = await db.phone_listings.find_one({"_id": ObjectId(listing_id), "is_active": True})
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        # Increment view count
        await db.phone_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$inc": {"views": 1}}
        )
        
        listing = serialize_doc(listing)
        return PhoneListing(**listing)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching listing {listing_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch listing")

@api_router.get("/stats")
async def get_stats():
    """Get platform statistics"""
    try:
        total_listings = await db.phone_listings.count_documents({"is_active": True})
        
        # Get brand counts
        pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$brand", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 6}
        ]
        brand_stats = await db.phone_listings.aggregate(pipeline).to_list(length=6)
        
        # Get city counts
        city_pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$city", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        city_stats = await db.phone_listings.aggregate(city_pipeline).to_list(length=10)
        
        return {
            "total_listings": total_listings,
            "brands": [{"name": stat["_id"], "count": stat["count"]} for stat in brand_stats],
            "cities": [{"name": stat["_id"], "count": stat["count"]} for stat in city_stats]
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
