from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from bson import ObjectId
import jwt
import bcrypt
from enum import Enum
import base64

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Enums
class UserRole(str, Enum):
    NORMAL_USER = "normal_user"
    SHOP_OWNER = "shop_owner"
    ADMIN = "admin"

class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    UNDER_REVIEW = "under_review"

class BusinessType(str, Enum):
    MOBILE_SHOP = "mobile_shop"
    ELECTRONICS_STORE = "electronics_store"
    REPAIR_SERVICE = "repair_service"
    DISTRIBUTOR = "distributor"
    ONLINE_RETAILER = "online_retailer"

# Auth Helper Functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return serialize_doc(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Error validating token: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

# User Models
class UserRegistration(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: UserRole = UserRole.NORMAL_USER

class BusinessDetails(BaseModel):
    business_name: str
    business_type: BusinessType
    business_address: str
    city: str
    postal_code: str
    business_phone: str
    website: Optional[str] = None
    description: str
    years_in_business: int
    
class KYCDocuments(BaseModel):
    cnic_front: str  # Base64 encoded image
    cnic_back: str   # Base64 encoded image
    business_license: Optional[str] = None  # Base64 encoded image
    trade_license: Optional[str] = None     # Base64 encoded image

class ShopOwnerRegistration(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    business_details: BusinessDetails
    kyc_documents: KYCDocuments

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    email: EmailStr
    phone: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    verification_status: VerificationStatus = VerificationStatus.PENDING
    business_details: Optional[BusinessDetails] = None
    kyc_documents: Optional[KYCDocuments] = None
    
    class Config:
        populate_by_name = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

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

# Authentication Routes
@api_router.post("/auth/register", response_model=LoginResponse)
async def register_normal_user(user_data: UserRegistration):
    """Register a normal user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user document
        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "phone": user_data.phone,
            "role": user_data.role,
            "created_at": datetime.utcnow(),
            "is_active": True,
            "verification_status": VerificationStatus.APPROVED if user_data.role == UserRole.NORMAL_USER else VerificationStatus.PENDING
        }
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create access token
        access_token = create_access_token(data={"sub": user_id})
        
        # Get user for response
        user_doc["_id"] = user_id
        user = User(**serialize_doc(user_doc))
        
        return LoginResponse(access_token=access_token, user=user)
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 for duplicate email)
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")

@api_router.post("/auth/register-shop-owner", response_model=dict)
async def register_shop_owner(shop_data: ShopOwnerRegistration):
    """Register a shop owner with business details and KYC"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": shop_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(shop_data.password)
        
        # Create user document
        user_doc = {
            "name": shop_data.name,
            "email": shop_data.email,
            "password": hashed_password,
            "phone": shop_data.phone,
            "role": UserRole.SHOP_OWNER,
            "created_at": datetime.utcnow(),
            "is_active": True,
            "verification_status": VerificationStatus.UNDER_REVIEW,
            "business_details": shop_data.business_details.dict(),
            "kyc_documents": shop_data.kyc_documents.dict()
        }
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        
        return {
            "success": True,
            "message": "Shop owner registration submitted successfully! Your account is under review and you will be notified once approved.",
            "user_id": str(result.inserted_id)
        }
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 for duplicate email)
        raise
    except Exception as e:
        logger.error(f"Error registering shop owner: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register shop owner")

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(user_credentials: UserLogin):
    """Login user"""
    try:
        # Find user by email
        user = await db.users.find_one({"email": user_credentials.email})
        if not user or not verify_password(user_credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not user["is_active"]:
            raise HTTPException(status_code=401, detail="Account is disabled")
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user["_id"])})
        
        # Remove password from response
        user.pop("password", None)
        user = serialize_doc(user)
        user_obj = User(**user)
        
        return LoginResponse(access_token=access_token, user=user_obj)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return User(**current_user)

@api_router.put("/auth/verify-shop-owner/{user_id}")
async def verify_shop_owner(user_id: str, status: VerificationStatus, current_user: dict = Depends(get_current_user)):
    """Verify or reject shop owner (Admin only)"""
    try:
        # Check if current user is admin
        if current_user["role"] != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Update verification status
        result = await db.users.update_one(
            {"_id": ObjectId(user_id), "role": UserRole.SHOP_OWNER},
            {"$set": {"verification_status": status, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Shop owner not found")
        
        return {"success": True, "message": f"Shop owner verification status updated to {status}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying shop owner: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update verification status")

# Phone Listing Routes
@api_router.post("/sample-data")
async def populate_sample_data():
    """Populate sample data for testing"""
    try:
        # Sample phone listings
        sample_listings = [
            {
                "brand": "Apple",
                "model": "iPhone 15 Pro",
                "condition": "Excellent",
                "price": 450000,
                "storage": "256GB",
                "ram": "8GB",
                "city": "Karachi",
                "description": "Brand new iPhone 15 Pro in excellent condition. Box pack with all accessories. Face ID, wireless charging, triple camera system.",
                "seller_name": "Ahmed Khan",
                "seller_phone": "03001234567",
                "seller_email": "ahmed@example.com",
                "features": ["Face ID", "Wireless Charging", "Triple Camera", "A17 Pro Chip"],
                "created_at": datetime.utcnow(),
                "views": 127,
                "is_featured": True,
                "is_active": True
            },
            {
                "brand": "Samsung",
                "model": "Galaxy S24 Ultra",
                "condition": "Like New",
                "price": 380000,
                "storage": "512GB",
                "ram": "12GB",
                "city": "Lahore",
                "description": "Samsung Galaxy S24 Ultra with S Pen. Perfect condition, barely used. All original accessories included.",
                "seller_name": "Fatima Ali",
                "seller_phone": "03121234567",
                "seller_email": "fatima@example.com",
                "features": ["S Pen", "200MP Camera", "120Hz Display", "5000mAh Battery"],
                "created_at": datetime.utcnow() - timedelta(days=1),
                "views": 89,
                "is_featured": True,
                "is_active": True
            },
            {
                "brand": "Xiaomi",
                "model": "13 Pro",
                "condition": "Good",
                "price": 125000,
                "storage": "256GB",
                "ram": "8GB",
                "city": "Islamabad",
                "description": "Xiaomi 13 Pro in good condition. Minor scratches on back, screen is perfect. Great camera and performance.",
                "seller_name": "Hassan Shah",
                "seller_phone": "03331234567",
                "seller_email": "hassan@example.com",
                "features": ["Leica Camera", "120W Fast Charging", "Snapdragon 8 Gen 2"],
                "created_at": datetime.utcnow() - timedelta(days=2),
                "views": 67,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Oppo",
                "model": "Reno 11 Pro",
                "condition": "Very Good",
                "price": 95000,
                "storage": "256GB",
                "ram": "8GB",
                "city": "Rawalpindi",
                "description": "Oppo Reno 11 Pro with excellent camera quality. Great for photography enthusiasts. All accessories included.",
                "seller_name": "Aisha Malik",
                "seller_phone": "03451234567",
                "seller_email": "aisha@example.com",
                "features": ["50MP Portrait Camera", "80W SuperVOOC", "ColorOS 14"],
                "created_at": datetime.utcnow() - timedelta(days=3),
                "views": 45,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Vivo",
                "model": "V30 Pro",
                "condition": "Excellent",
                "price": 110000,
                "storage": "128GB",
                "ram": "8GB",
                "city": "Faisalabad",
                "description": "Vivo V30 Pro with amazing selfie camera. Perfect for content creators. No issues, all original.",
                "seller_name": "Bilal Ahmed",
                "seller_phone": "03411234567",
                "seller_email": "bilal@example.com",
                "features": ["50MP Selfie Camera", "80W FlashCharge", "Aura Light Portrait"],
                "created_at": datetime.utcnow() - timedelta(days=4),
                "views": 33,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Realme",
                "model": "GT 5 Pro",
                "condition": "Good",
                "price": 85000,
                "storage": "256GB",
                "ram": "12GB",
                "city": "Multan",
                "description": "Realme GT 5 Pro gaming phone. Excellent performance for gaming. Minor wear and tear but works perfectly.",
                "seller_name": "Zain Abbas",
                "seller_phone": "03061234567",
                "seller_email": "zain@example.com",
                "features": ["Snapdragon 8 Gen 3", "144Hz Display", "100W SuperDart", "Gaming Mode"],
                "created_at": datetime.utcnow() - timedelta(days=5),
                "views": 58,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Apple",
                "model": "iPhone 14",
                "condition": "Very Good",
                "price": 320000,
                "storage": "128GB",
                "ram": "6GB",
                "city": "Peshawar",
                "description": "iPhone 14 in very good condition. Single owner, carefully used. Battery health 95%. All accessories.",
                "seller_name": "Sana Gul",
                "seller_phone": "03919234567",
                "seller_email": "sana@example.com",
                "features": ["Face ID", "Dual Camera", "A15 Bionic", "Ceramic Shield"],
                "created_at": datetime.utcnow() - timedelta(days=6),
                "views": 102,
                "is_featured": True,
                "is_active": True
            },
            {
                "brand": "Samsung",
                "model": "Galaxy A54",
                "condition": "Like New",
                "price": 65000,
                "storage": "128GB",
                "ram": "6GB",
                "city": "Quetta",
                "description": "Samsung Galaxy A54 barely used. Excellent mid-range phone with great camera. All original packaging.",
                "seller_name": "Ali Raza",
                "seller_phone": "03811234567",
                "seller_email": "ali@example.com",
                "features": ["50MP Triple Camera", "5000mAh Battery", "25W Fast Charging", "IP67"],
                "created_at": datetime.utcnow() - timedelta(days=7),
                "views": 41,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Xiaomi",
                "model": "Redmi Note 13 Pro",
                "condition": "Good",
                "price": 45000,
                "storage": "128GB",
                "ram": "8GB",
                "city": "Karachi",
                "description": "Redmi Note 13 Pro with excellent value for money. Good camera, fast performance. Minor scratches.",
                "seller_name": "Sara Khan",
                "seller_phone": "03002345678",
                "seller_email": "sara@example.com",
                "features": ["200MP Camera", "67W Turbo Charging", "120Hz AMOLED", "MediaTek Dimensity"],
                "created_at": datetime.utcnow() - timedelta(days=8),
                "views": 76,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "OnePlus",
                "model": "12",
                "condition": "Excellent",
                "price": 195000,
                "storage": "256GB",
                "ram": "12GB",
                "city": "Lahore",
                "description": "OnePlus 12 flagship phone. Amazing performance and camera quality. Hasselblad partnership. Like new condition.",
                "seller_name": "Usman Tariq",
                "seller_phone": "03123456789",
                "seller_email": "usman@example.com",
                "features": ["Hasselblad Camera", "100W SuperVOOC", "120Hz Display", "Snapdragon 8 Gen 3"],
                "created_at": datetime.utcnow() - timedelta(days=9),
                "views": 94,
                "is_featured": True,
                "is_active": True
            }
        ]

        # Clear existing sample data
        await db.phone_listings.delete_many({})
        
        # Insert sample listings
        await db.phone_listings.insert_many(sample_listings)
        
        return {"success": True, "message": f"Successfully populated {len(sample_listings)} sample phone listings"}
        
    except Exception as e:
        logger.error(f"Error populating sample data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to populate sample data")

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
