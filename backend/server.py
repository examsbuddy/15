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
import csv
import io

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

# Phone Specification Models
class PhoneSpecCreate(BaseModel):
    # Basic Information
    brand: str
    model: str
    
    # Build Information
    os: Optional[str] = None
    ui: Optional[str] = None
    dimensions: Optional[str] = None  # e.g., "163.3 x 74.4 x 7.3 mm"
    weight: Optional[str] = None  # e.g., "198 g"
    sim: Optional[str] = None  # e.g., "Nano-SIM + Nano-SIM"
    colors: Optional[str] = None  # e.g., "Titanium Grey, Enchanted Purple"
    
    # Network & Frequency
    network_2g: Optional[str] = None
    network_3g: Optional[str] = None
    network_4g: Optional[str] = None
    network_5g: Optional[str] = None
    
    # Processor
    cpu: Optional[str] = None
    chipset: Optional[str] = None
    gpu: Optional[str] = None
    
    # Display
    display_technology: Optional[str] = None
    display_size: Optional[str] = None
    display_resolution: Optional[str] = None
    display_features: Optional[str] = None
    
    # Memory
    storage: Optional[str] = None  # e.g., "256GB Built-in"
    ram: Optional[str] = None  # e.g., "12GB RAM"
    card_slot: Optional[str] = None
    
    # Camera
    main_camera: Optional[str] = None
    camera_features: Optional[str] = None
    front_camera: Optional[str] = None
    
    # Connectivity
    wlan: Optional[str] = None
    bluetooth: Optional[str] = None
    gps: Optional[str] = None
    radio: Optional[str] = None
    usb: Optional[str] = None
    nfc: Optional[str] = None
    infrared: Optional[str] = None
    
    # Features
    sensors: Optional[str] = None
    audio: Optional[str] = None
    browser: Optional[str] = None
    messaging: Optional[str] = None
    games: Optional[str] = None
    torch: Optional[str] = None
    extra_features: Optional[str] = None
    
    # Battery
    battery_capacity: Optional[str] = None
    charging: Optional[str] = None
    
    # Pricing
    price_pkr: Optional[int] = None
    price_usd: Optional[int] = None
    
    # Legacy fields for backward compatibility
    display_size_legacy: Optional[str] = Field(None, alias="display_size_inches")
    camera_mp: Optional[str] = None
    battery_mah: Optional[str] = None
    storage_gb: Optional[str] = None
    ram_gb: Optional[str] = None
    processor: Optional[str] = None
    operating_system: Optional[str] = None
    price_range_min: Optional[int] = None
    price_range_max: Optional[int] = None
    release_year: Optional[int] = None

class PhoneSpec(BaseModel):
    id: Optional[str] = Field(alias="_id")
    
    # Basic Information
    brand: str
    model: str
    
    # Build Information
    os: Optional[str] = None
    ui: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    sim: Optional[str] = None
    colors: Optional[str] = None
    
    # Network & Frequency
    network_2g: Optional[str] = None
    network_3g: Optional[str] = None
    network_4g: Optional[str] = None
    network_5g: Optional[str] = None
    
    # Processor
    cpu: Optional[str] = None
    chipset: Optional[str] = None
    gpu: Optional[str] = None
    
    # Display
    display_technology: Optional[str] = None
    display_size: Optional[str] = None
    display_resolution: Optional[str] = None
    display_features: Optional[str] = None
    
    # Memory
    storage: Optional[str] = None
    ram: Optional[str] = None
    card_slot: Optional[str] = None
    
    # Camera
    main_camera: Optional[str] = None
    camera_features: Optional[str] = None
    front_camera: Optional[str] = None
    
    # Connectivity
    wlan: Optional[str] = None
    bluetooth: Optional[str] = None
    gps: Optional[str] = None
    radio: Optional[str] = None
    usb: Optional[str] = None
    nfc: Optional[str] = None
    infrared: Optional[str] = None
    
    # Features
    sensors: Optional[str] = None
    audio: Optional[str] = None
    browser: Optional[str] = None
    messaging: Optional[str] = None
    games: Optional[str] = None
    torch: Optional[str] = None
    extra_features: Optional[str] = None
    
    # Battery
    battery_capacity: Optional[str] = None
    charging: Optional[str] = None
    
    # Pricing
    price_pkr: Optional[int] = None
    price_usd: Optional[int] = None
    
    # Legacy fields for backward compatibility
    display_size_legacy: Optional[str] = None
    camera_mp: Optional[str] = None
    battery_mah: Optional[str] = None
    storage_gb: Optional[str] = None
    ram_gb: Optional[str] = None
    processor: Optional[str] = None
    operating_system: Optional[str] = None
    price_range_min: Optional[int] = None
    price_range_max: Optional[int] = None
    release_year: Optional[int] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

# CSV Upload Models
class CSVUploadResponse(BaseModel):
    success: bool
    total_rows: int
    successful_imports: int
    failed_imports: int
    errors: List[str] = []
    imported_specs: List[str] = []  # List of "Brand Model" names that were imported

# Admin Stats Response Model
class AdminStats(BaseModel):
    totalListings: int
    totalUsers: int
    pendingApprovals: int
    phoneModels: int

# Phone Listing Models
class PhoneListingCreate(BaseModel):
    brand: str
    model: str
    condition: str = Field(..., description="Condition: New, Used, Refurbished, Like New")
    price: int
    storage: str
    ram: str
    city: str
    description: str
    seller_name: str
    seller_phone: str
    seller_email: str
    features: List[str] = []
    # Enhanced specifications
    battery: Optional[str] = None  # e.g., "4000mAh", "5000mAh"
    screen_size: Optional[str] = None  # e.g., "6.1 inch", "6.7 inch"
    camera: Optional[str] = None  # e.g., "48MP", "108MP Triple"
    processor: Optional[str] = None  # e.g., "Snapdragon 8 Gen 2"
    operating_system: Optional[str] = None  # e.g., "Android 13", "iOS 17"
    network: Optional[str] = None  # e.g., "4G", "5G"
    color: Optional[str] = None  # Phone color
    # Mandatory photos (base64 encoded)
    photos: List[str] = Field(min_items=1, description="At least one photo is required")
    # Additional metadata
    purchase_year: Optional[int] = None
    purchase_date: Optional[str] = None  # Full purchase date
    warranty_months: Optional[int] = None
    warranty_status: Optional[str] = None  # "Active", "Expired", "No Warranty"
    box_included: bool = False
    accessories_included: List[str] = []  # charger, earphones, case, etc.
    battery_health: Optional[str] = None  # "Excellent", "Good", "Fair", "Poor"
    seller_type: str = Field(default="Individual", description="Individual, Shop Owner, Verified Seller")

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
    # Enhanced specifications
    battery: Optional[str] = None
    screen_size: Optional[str] = None
    camera: Optional[str] = None
    processor: Optional[str] = None
    operating_system: Optional[str] = None
    network: Optional[str] = None
    color: Optional[str] = None
    # Photos
    photos: List[str] = []
    # Additional metadata
    purchase_year: Optional[int] = None
    purchase_date: Optional[str] = None
    warranty_months: Optional[int] = None
    warranty_status: Optional[str] = None
    box_included: bool = False
    accessories_included: List[str] = []
    battery_health: Optional[str] = None
    seller_type: str = "Individual"
    # System fields
    created_at: datetime = Field(default_factory=datetime.utcnow)
    views: int = 0
    is_featured: bool = False
    is_active: bool = True
    
    class Config:
        populate_by_name = True

# Existing routes
# High-quality phone images with clean white backgrounds
PHONE_IMAGES = [
    "https://images.unsplash.com/photo-1574737331256-16f47895d422?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1546621083-17f1e50980e9?w=400&h=400&fit=crop&auto=format", 
    "https://images.unsplash.com/photo-1464380573004-8ca85a08751a?w=400&h=400&fit=crop&auto=format",
    "https://images.pexels.com/photos/7561206/pexels-photo-7561206.jpeg?w=400&h=400&fit=crop&auto=compress",
    "https://images.pexels.com/photos/8220804/pexels-photo-8220804.jpeg?w=400&h=400&fit=crop&auto=compress",
    "https://images.unsplash.com/photo-1588609460031-22705bc49db0?w=400&h=400&fit=crop&auto=format",
    "https://images.pexels.com/photos/7629856/pexels-photo-7629856.jpeg?w=400&h=400&fit=crop&auto=compress",
    "https://images.pexels.com/photos/2698552/pexels-photo-2698552.jpeg?w=400&h=400&fit=crop&auto=compress",
    "https://images.unsplash.com/photo-1574737331256-16f47895d422?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1546621083-17f1e50980e9?w=400&h=400&fit=crop&auto=format"
]

# Phone Specifications Database
PHONE_SPECS_DATABASE = {
    "Apple": {
        "iPhone 15 Pro Max": {
            "battery": "4441mAh",
            "screen_size": "6.7 inch",
            "camera": "48MP Triple Camera",
            "processor": "A17 Pro",
            "operating_system": "iOS 17",
            "network": "5G",
            "colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
            "storage_options": ["256GB", "512GB", "1TB"],
            "ram": "8GB",
            "launch_year": 2023
        },
        "iPhone 15 Pro": {
            "battery": "3274mAh",
            "screen_size": "6.1 inch", 
            "camera": "48MP Triple Camera",
            "processor": "A17 Pro",
            "operating_system": "iOS 17",
            "network": "5G",
            "colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
            "storage_options": ["128GB", "256GB", "512GB", "1TB"],
            "ram": "8GB",
            "launch_year": 2023
        },
        "iPhone 15": {
            "battery": "3349mAh",
            "screen_size": "6.1 inch",
            "camera": "48MP Dual Camera", 
            "processor": "A16 Bionic",
            "operating_system": "iOS 17",
            "network": "5G",
            "colors": ["Pink", "Yellow", "Green", "Blue", "Black"],
            "storage_options": ["128GB", "256GB", "512GB"],
            "ram": "6GB",
            "launch_year": 2023
        },
        "iPhone 15 Plus": {
            "battery": "4383mAh",
            "screen_size": "6.7 inch",
            "camera": "48MP Dual Camera",
            "processor": "A16 Bionic", 
            "operating_system": "iOS 17",
            "network": "5G",
            "colors": ["Pink", "Yellow", "Green", "Blue", "Black"],
            "storage_options": ["128GB", "256GB", "512GB"],
            "ram": "6GB",
            "launch_year": 2023
        },
        "iPhone 14 Pro Max": {
            "battery": "4323mAh",
            "screen_size": "6.7 inch",
            "camera": "48MP Triple Camera",
            "processor": "A16 Bionic",
            "operating_system": "iOS 16",
            "network": "5G",
            "colors": ["Deep Purple", "Gold", "Silver", "Space Black"],
            "storage_options": ["128GB", "256GB", "512GB", "1TB"],
            "ram": "6GB",
            "launch_year": 2022
        },
        "iPhone 14": {
            "battery": "3279mAh",
            "screen_size": "6.1 inch",
            "camera": "12MP Dual Camera",
            "processor": "A15 Bionic",
            "operating_system": "iOS 16", 
            "network": "5G",
            "colors": ["Blue", "Purple", "Midnight", "Starlight", "Red"],
            "storage_options": ["128GB", "256GB", "512GB"],
            "ram": "6GB",
            "launch_year": 2022
        }
    },
    "Samsung": {
        "Galaxy S24 Ultra": {
            "battery": "5000mAh",
            "screen_size": "6.8 inch",
            "camera": "200MP Quad Camera",
            "processor": "Snapdragon 8 Gen 3",
            "operating_system": "Android 14",
            "network": "5G",
            "colors": ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
            "storage_options": ["256GB", "512GB", "1TB"],
            "ram": "12GB",
            "launch_year": 2024
        },
        "Galaxy S24 Plus": {
            "battery": "4900mAh", 
            "screen_size": "6.7 inch",
            "camera": "50MP Triple Camera",
            "processor": "Snapdragon 8 Gen 3",
            "operating_system": "Android 14",
            "network": "5G",
            "colors": ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
            "storage_options": ["256GB", "512GB"],
            "ram": "12GB",
            "launch_year": 2024
        },
        "Galaxy S24": {
            "battery": "4000mAh",
            "screen_size": "6.2 inch", 
            "camera": "50MP Triple Camera",
            "processor": "Snapdragon 8 Gen 3",
            "operating_system": "Android 14",
            "network": "5G",
            "colors": ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
            "storage_options": ["128GB", "256GB"],
            "ram": "8GB",
            "launch_year": 2024
        },
        "Galaxy A54": {
            "battery": "5000mAh",
            "screen_size": "6.4 inch",
            "camera": "50MP Triple Camera", 
            "processor": "Exynos 1380",
            "operating_system": "Android 13",
            "network": "5G",
            "colors": ["Awesome Graphite", "Awesome Violet", "Awesome White", "Awesome Lime"],
            "storage_options": ["128GB", "256GB"],
            "ram": "6GB",
            "launch_year": 2023
        }
    },
    "Xiaomi": {
        "13 Pro": {
            "battery": "4820mAh",
            "screen_size": "6.73 inch",
            "camera": "50MP Leica Triple Camera", 
            "processor": "Snapdragon 8 Gen 2",
            "operating_system": "MIUI 14",
            "network": "5G",
            "colors": ["Ceramic Black", "Ceramic White", "Flora Green"],
            "storage_options": ["256GB", "512GB"],
            "ram": "8GB",
            "launch_year": 2023
        },
        "Redmi Note 13 Pro": {
            "battery": "5100mAh",
            "screen_size": "6.67 inch",
            "camera": "200MP Triple Camera",
            "processor": "MediaTek Dimensity 7200",
            "operating_system": "MIUI 14", 
            "network": "4G",
            "colors": ["Midnight Black", "Aurora Purple", "Ocean Teal"],
            "storage_options": ["128GB", "256GB"],
            "ram": "8GB",
            "launch_year": 2023
        }
    },
    "OnePlus": {
        "12": {
            "battery": "5400mAh",
            "screen_size": "6.82 inch",
            "camera": "50MP Hasselblad Triple Camera",
            "processor": "Snapdragon 8 Gen 3",
            "operating_system": "OxygenOS 14",
            "network": "5G",
            "colors": ["Silky Black", "Flowy Emerald", "Glacial White"],
            "storage_options": ["256GB", "512GB"],
            "ram": "12GB",
            "launch_year": 2024
        }
    },
    "Google": {
        "Pixel 8 Pro": {
            "battery": "5050mAh",
            "screen_size": "6.7 inch", 
            "camera": "50MP Triple Camera",
            "processor": "Google Tensor G3",
            "operating_system": "Android 14",
            "network": "5G",
            "colors": ["Obsidian", "Porcelain", "Bay"],
            "storage_options": ["128GB", "256GB", "512GB"],
            "ram": "12GB",
            "launch_year": 2023
        }
    }
}

# Add API endpoint to get phone specifications
@api_router.get("/phone-specs/{brand}/{model}")
async def get_phone_specs(brand: str, model: str):
    """Get phone specifications for a specific brand and model"""
    try:
        brand_data = PHONE_SPECS_DATABASE.get(brand)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        model_data = brand_data.get(model)
        if not model_data:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return model_data
    except Exception as e:
        logger.error(f"Error fetching phone specs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch phone specifications")

# Add API endpoint to get available models for a brand
@api_router.get("/phone-models/{brand}")
async def get_phone_models(brand: str):
    """Get available phone models for a specific brand"""
    try:
        brand_data = PHONE_SPECS_DATABASE.get(brand)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        return {"models": list(brand_data.keys())}
    except Exception as e:
        logger.error(f"Error fetching phone models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch phone models")

# Add API endpoint to get all brands
@api_router.get("/phone-brands")
async def get_phone_brands():
    """Get all available phone brands"""
    try:
        return {"brands": list(PHONE_SPECS_DATABASE.keys())}
    except Exception as e:
        logger.error(f"Error fetching phone brands: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch phone brands")

# Admin Phone Specs Management Endpoints
@api_router.get("/phone-specs", response_model=List[PhoneSpec])
async def get_all_phone_specs():
    """Get all phone specifications for admin management"""
    try:
        phone_specs = []
        async for spec in db.phone_specs.find():
            phone_specs.append(serialize_doc(spec))
        return phone_specs
    except Exception as e:
        logger.error(f"Error fetching phone specs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch phone specifications")

@api_router.post("/phone-specs", response_model=PhoneSpec)
async def create_phone_spec(spec_data: PhoneSpecCreate):
    """Create a new phone specification"""
    try:
        # Check if phone spec already exists
        existing_spec = await db.phone_specs.find_one({
            "brand": spec_data.brand,
            "model": spec_data.model
        })
        
        if existing_spec:
            raise HTTPException(status_code=400, detail="Phone specification already exists")
        
        # Create new phone spec
        new_spec = {
            "_id": str(uuid.uuid4()),
            "brand": spec_data.brand,
            "model": spec_data.model,
            "display_size": spec_data.display_size,
            "camera_mp": spec_data.camera_mp,
            "battery_mah": spec_data.battery_mah,
            "storage_gb": spec_data.storage_gb,
            "ram_gb": spec_data.ram_gb,
            "processor": spec_data.processor,
            "operating_system": spec_data.operating_system,
            "price_range_min": spec_data.price_range_min,
            "price_range_max": spec_data.price_range_max,
            "release_year": spec_data.release_year,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.phone_specs.insert_one(new_spec)
        if result.inserted_id:
            return serialize_doc(new_spec)
        else:
            raise HTTPException(status_code=500, detail="Failed to create phone specification")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating phone spec: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create phone specification")

@api_router.put("/phone-specs/{spec_id}", response_model=PhoneSpec)
async def update_phone_spec(spec_id: str, spec_data: PhoneSpecCreate):
    """Update an existing phone specification"""
    try:
        # Check if spec exists
        existing_spec = await db.phone_specs.find_one({"_id": spec_id})
        if not existing_spec:
            raise HTTPException(status_code=404, detail="Phone specification not found")
        
        # Update spec
        updated_spec = {
            "brand": spec_data.brand,
            "model": spec_data.model,
            "display_size": spec_data.display_size,
            "camera_mp": spec_data.camera_mp,
            "battery_mah": spec_data.battery_mah,
            "storage_gb": spec_data.storage_gb,
            "ram_gb": spec_data.ram_gb,
            "processor": spec_data.processor,
            "operating_system": spec_data.operating_system,
            "price_range_min": spec_data.price_range_min,
            "price_range_max": spec_data.price_range_max,
            "release_year": spec_data.release_year,
            "updated_at": datetime.utcnow()
        }
        
        result = await db.phone_specs.update_one(
            {"_id": spec_id},
            {"$set": updated_spec}
        )
        
        if result.modified_count:
            updated_doc = await db.phone_specs.find_one({"_id": spec_id})
            return serialize_doc(updated_doc)
        else:
            raise HTTPException(status_code=500, detail="Failed to update phone specification")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating phone spec: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update phone specification")

@api_router.delete("/phone-specs/{spec_id}")
async def delete_phone_spec(spec_id: str):
    """Delete a phone specification"""
    try:
        # Check if spec exists
        existing_spec = await db.phone_specs.find_one({"_id": spec_id})
        if not existing_spec:
            raise HTTPException(status_code=404, detail="Phone specification not found")
        
        # Delete spec
        result = await db.phone_specs.delete_one({"_id": spec_id})
        
        if result.deleted_count:
            return {"message": "Phone specification deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete phone specification")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting phone spec: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete phone specification")

# Admin Stats Endpoint
@api_router.get("/stats", response_model=AdminStats)
async def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # Get total listings count
        total_listings = await db.listings.count_documents({})
        
        # Get total users count
        total_users = await db.users.count_documents({})
        
        # Get pending shop owner approvals count
        pending_approvals = await db.users.count_documents({
            "role": "shop_owner",
            "verification_status": "pending"
        })
        
        # Get total phone models count
        phone_models = await db.phone_specs.count_documents({})
        
        return AdminStats(
            totalListings=total_listings,
            totalUsers=total_users,
            pendingApprovals=pending_approvals,
            phoneModels=phone_models
        )
        
    except Exception as e:
        logger.error(f"Error fetching admin stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admin statistics")

# CSV Bulk Import Endpoint
@api_router.post("/phone-specs/bulk-import", response_model=CSVUploadResponse)
async def bulk_import_phone_specs(file: UploadFile = File(...)):
    """Bulk import phone specifications from CSV file"""
    try:
        # Validate file type
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="File must be CSV or Excel format")
        
        # Read file content
        contents = await file.read()
        
        # Parse CSV content
        if file.filename.endswith('.csv'):
            csv_string = contents.decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_string))
        else:
            # For Excel files, we'll need to convert them to CSV format
            # For now, let's focus on CSV support
            raise HTTPException(status_code=400, detail="Excel support coming soon. Please use CSV format.")
        
        total_rows = 0
        successful_imports = 0
        failed_imports = 0
        errors = []
        imported_specs = []
        
        # Process each row
        for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 because row 1 is headers
            total_rows += 1
            
            try:
                # Clean and validate required fields
                brand = row.get('brand', '').strip()
                model = row.get('model', '').strip()
                
                if not brand or not model:
                    errors.append(f"Row {row_num}: Brand and Model are required")
                    failed_imports += 1
                    continue
                
                # Check if phone spec already exists
                existing_spec = await db.phone_specs.find_one({
                    "brand": brand,
                    "model": model
                })
                
                if existing_spec:
                    errors.append(f"Row {row_num}: {brand} {model} already exists")
                    failed_imports += 1
                    continue
                
                # Extract price values
                price_pkr = None
                price_usd = None
                
                try:
                    if row.get('price_pkr'):
                        price_pkr = int(str(row['price_pkr']).replace(',', '').replace('Rs', '').replace('PKR', '').strip())
                except:
                    pass
                    
                try:
                    if row.get('price_usd'):
                        price_usd = int(str(row['price_usd']).replace(',', '').replace('$', '').replace('USD', '').strip())
                except:
                    pass
                
                # Create phone spec document
                new_spec = {
                    "_id": str(uuid.uuid4()),
                    "brand": brand,
                    "model": model,
                    
                    # Build Information
                    "os": row.get('os', '').strip() or None,
                    "ui": row.get('ui', '').strip() or None,
                    "dimensions": row.get('dimensions', '').strip() or None,
                    "weight": row.get('weight', '').strip() or None,
                    "sim": row.get('sim', '').strip() or None,
                    "colors": row.get('colors', '').strip() or None,
                    
                    # Network & Frequency
                    "network_2g": row.get('network_2g', '').strip() or None,
                    "network_3g": row.get('network_3g', '').strip() or None,
                    "network_4g": row.get('network_4g', '').strip() or None,
                    "network_5g": row.get('network_5g', '').strip() or None,
                    
                    # Processor
                    "cpu": row.get('cpu', '').strip() or None,
                    "chipset": row.get('chipset', '').strip() or None,
                    "gpu": row.get('gpu', '').strip() or None,
                    
                    # Display
                    "display_technology": row.get('display_technology', '').strip() or None,
                    "display_size": row.get('display_size', '').strip() or None,
                    "display_resolution": row.get('display_resolution', '').strip() or None,
                    "display_features": row.get('display_features', '').strip() or None,
                    
                    # Memory
                    "storage": row.get('storage', '').strip() or None,
                    "ram": row.get('ram', '').strip() or None,
                    "card_slot": row.get('card_slot', '').strip() or None,
                    
                    # Camera
                    "main_camera": row.get('main_camera', '').strip() or None,
                    "camera_features": row.get('camera_features', '').strip() or None,
                    "front_camera": row.get('front_camera', '').strip() or None,
                    
                    # Connectivity
                    "wlan": row.get('wlan', '').strip() or None,
                    "bluetooth": row.get('bluetooth', '').strip() or None,
                    "gps": row.get('gps', '').strip() or None,
                    "radio": row.get('radio', '').strip() or None,
                    "usb": row.get('usb', '').strip() or None,
                    "nfc": row.get('nfc', '').strip() or None,
                    "infrared": row.get('infrared', '').strip() or None,
                    
                    # Features
                    "sensors": row.get('sensors', '').strip() or None,
                    "audio": row.get('audio', '').strip() or None,
                    "browser": row.get('browser', '').strip() or None,
                    "messaging": row.get('messaging', '').strip() or None,
                    "games": row.get('games', '').strip() or None,
                    "torch": row.get('torch', '').strip() or None,
                    "extra_features": row.get('extra_features', '').strip() or None,
                    
                    # Battery
                    "battery_capacity": row.get('battery_capacity', '').strip() or None,
                    "charging": row.get('charging', '').strip() or None,
                    
                    # Pricing
                    "price_pkr": price_pkr,
                    "price_usd": price_usd,
                    
                    # Legacy fields for backward compatibility
                    "display_size_legacy": row.get('display_size', '').strip() or None,
                    "camera_mp": row.get('camera_mp', '').strip() or None,
                    "battery_mah": row.get('battery_mah', '').strip() or None,
                    "storage_gb": row.get('storage_gb', '').strip() or None,
                    "ram_gb": row.get('ram_gb', '').strip() or None,
                    "processor": row.get('processor', '').strip() or None,
                    "operating_system": row.get('operating_system', '').strip() or None,
                    "price_range_min": price_pkr,
                    "price_range_max": price_pkr,
                    "release_year": int(row.get('release_year', datetime.now().year)) if row.get('release_year') else datetime.now().year,
                    
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                # Insert into database
                result = await db.phone_specs.insert_one(new_spec)
                
                if result.inserted_id:
                    successful_imports += 1
                    imported_specs.append(f"{brand} {model}")
                else:
                    errors.append(f"Row {row_num}: Failed to insert {brand} {model}")
                    failed_imports += 1
                    
            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
                failed_imports += 1
                logger.error(f"Error processing row {row_num}: {str(e)}")
        
        return CSVUploadResponse(
            success=True,
            total_rows=total_rows,
            successful_imports=successful_imports,
            failed_imports=failed_imports,
            errors=errors[:50],  # Limit errors to first 50 to avoid huge responses
            imported_specs=imported_specs
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in bulk import: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")

# Download CSV Template Endpoint
@api_router.get("/phone-specs/csv-template")
async def download_csv_template():
    """Download a CSV template for bulk import"""
    try:
        # Create CSV template with all supported columns
        template_data = [
            {
                # Required fields
                "brand": "Apple",
                "model": "iPhone 15 Pro",
                
                # Build Information
                "os": "iOS 17",
                "ui": "iOS 17",
                "dimensions": "146.6 x 70.6 x 8.25 mm",
                "weight": "187 g",
                "sim": "Nano-SIM + eSIM",
                "colors": "Natural Titanium, Blue Titanium, White Titanium, Black Titanium",
                
                # Network & Frequency
                "network_2g": "GSM 850 / 900 / 1800 / 1900",
                "network_3g": "HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100",
                "network_4g": "LTE band 1,2,3,4,5,7,8,12,13,17,18,19,20,25,26,28,30,32,34,38,39,40,41,42,46,48,53,66",
                "network_5g": "5G SA/NSA",
                
                # Processor
                "cpu": "Hexa-core (2x3.78 GHz Everest + 4x2.11 GHz Sawtooth)",
                "chipset": "Apple A17 Pro (3 nm)",
                "gpu": "Apple GPU (6-core graphics)",
                
                # Display
                "display_technology": "LTPO Super Retina XDR OLED",
                "display_size": "6.1 inches",
                "display_resolution": "1179 x 2556 pixels",
                "display_features": "120Hz, HDR10, Dolby Vision, 1000 nits (typ), 2000 nits (HBM)",
                
                # Memory
                "storage": "128GB",
                "ram": "8GB",
                "card_slot": "No",
                
                # Camera
                "main_camera": "48 MP, f/1.78, 24mm (wide), 1/1.28\", 1.22µm, dual pixel PDAF, sensor-shift OIS + 12 MP, f/2.8, 77mm (telephoto), 1/3.5\", 1.0µm, PDAF, OIS, 3x optical zoom + 12 MP, f/2.2, 13mm, 120˚ (ultrawide), 1/2.55\", 1.4µm, dual pixel PDAF",
                "camera_features": "Dual-LED dual-tone flash, HDR (photo/panorama)",
                "front_camera": "12 MP, f/1.9, 23mm (wide), 1/3.6\", PDAF, OIS",
                
                # Connectivity
                "wlan": "Wi-Fi 802.11 a/b/g/n/ac/6e, dual band, hotspot",
                "bluetooth": "5.3, A2DP, LE",
                "gps": "GPS, GLONASS, GALILEO, BDS, QZSS",
                "radio": "No",
                "usb": "USB Type-C 3.0, DisplayPort",
                "nfc": "Yes",
                "infrared": "No",
                
                # Features
                "sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer, Ultra Wideband 2 (UWB) support",
                "audio": "Stereo speakers",
                "browser": "Safari",
                "messaging": "iMessage, SMS(threaded view), MMS, Email, Push Email",
                "games": "Built-in + Downloadable",
                "torch": "Yes",
                "extra_features": "IP68 dust/water resistant (up to 6m for 30 min), Apple Pay (Visa, MasterCard, AMEX certified), Ultra Wideband 2 (UWB) support",
                
                # Battery
                "battery_capacity": "3274 mAh",
                "charging": "Wired, PD2.0, 50% in 30 min (advertised), 15W wireless (MagSafe), 7.5W wireless (Qi), 4.5W reverse wired",
                
                # Pricing
                "price_pkr": "334999",
                "price_usd": "999",
                
                # Legacy fields (for backward compatibility)
                "camera_mp": "48",
                "battery_mah": "3274",
                "storage_gb": "128",
                "ram_gb": "8",
                "processor": "Apple A17 Pro",
                "operating_system": "iOS 17",
                "release_year": "2023"
            }
        ]
        
        # Create CSV string
        output = io.StringIO()
        if template_data:
            writer = csv.DictWriter(output, fieldnames=template_data[0].keys())
            writer.writeheader()
            writer.writerows(template_data)
        
        csv_content = output.getvalue()
        output.close()
        
        # Return CSV file
        from fastapi.responses import Response
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=phone_specs_template.csv"}
        )
        
    except Exception as e:
        logger.error(f"Error generating CSV template: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate CSV template")

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
        # Sample phone listings with enhanced fields
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
                # Enhanced specifications
                "battery": "3274mAh",
                "screen_size": "6.1 inch",
                "camera": "48MP Triple Camera",
                "processor": "A17 Pro Chip",
                "operating_system": "iOS 17",
                "network": "5G",
                "photos": [PHONE_IMAGES[0], PHONE_IMAGES[1]],
                "purchase_year": 2024,
                "warranty_months": 12,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Documentation"],
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
                # Enhanced specifications
                "battery": "5000mAh",
                "screen_size": "6.8 inch",
                "camera": "200MP Quad Camera",
                "processor": "Snapdragon 8 Gen 3",
                "operating_system": "Android 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[2], PHONE_IMAGES[3], PHONE_IMAGES[4]],
                "purchase_year": 2024,
                "warranty_months": 6,
                "box_included": True,
                "accessories_included": ["S Pen", "Charger", "Cable", "Case"],
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
                # Enhanced specifications
                "battery": "4820mAh",
                "screen_size": "6.73 inch",
                "camera": "50MP Leica Triple Camera",
                "processor": "Snapdragon 8 Gen 2",
                "operating_system": "MIUI 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[5]],
                "purchase_year": 2023,
                "warranty_months": 0,
                "box_included": False,
                "accessories_included": ["Charger"],
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
                # Enhanced specifications
                "battery": "4600mAh",
                "screen_size": "6.7 inch",
                "camera": "50MP Portrait Camera",
                "processor": "Snapdragon 8+ Gen 1",
                "operating_system": "ColorOS 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[6], PHONE_IMAGES[7]],
                "purchase_year": 2023,
                "warranty_months": 3,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Case"],
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
                # Enhanced specifications
                "battery": "5000mAh",
                "screen_size": "6.78 inch",
                "camera": "50MP OIS Camera",
                "processor": "MediaTek Dimensity 8200",
                "operating_system": "Funtouch OS 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[8], PHONE_IMAGES[9]],
                "purchase_year": 2024,
                "warranty_months": 8,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Earphones"],
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
                # Enhanced specifications
                "battery": "5400mAh",
                "screen_size": "6.78 inch",
                "camera": "50MP IMX890 Camera",
                "processor": "Snapdragon 8 Gen 3",
                "operating_system": "Realme UI 5.0",
                "network": "5G",
                "photos": [PHONE_IMAGES[0]],
                "purchase_year": 2024,
                "warranty_months": 4,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Gaming Trigger"],
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
                # Enhanced specifications
                "battery": "3279mAh",
                "screen_size": "6.1 inch",
                "camera": "12MP Dual Camera",
                "processor": "A15 Bionic",
                "operating_system": "iOS 17",
                "network": "5G",
                "photos": [PHONE_IMAGES[1], PHONE_IMAGES[2]],
                "purchase_year": 2022,
                "warranty_months": 0,
                "box_included": True,
                "accessories_included": ["Charger", "Cable"],
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
                # Enhanced specifications
                "battery": "5000mAh",
                "screen_size": "6.4 inch",
                "camera": "50MP Triple Camera",
                "processor": "Exynos 1380",
                "operating_system": "Android 13",
                "network": "5G",
                "photos": [PHONE_IMAGES[3], PHONE_IMAGES[4]],
                "purchase_year": 2023,
                "warranty_months": 6,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Case"],
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
                # Enhanced specifications
                "battery": "5100mAh",
                "screen_size": "6.67 inch",
                "camera": "200MP Main Camera",
                "processor": "MediaTek Dimensity 7200",
                "operating_system": "MIUI 14",
                "network": "4G",
                "photos": [PHONE_IMAGES[5]],
                "purchase_year": 2023,
                "warranty_months": 2,
                "box_included": False,
                "accessories_included": ["Charger"],
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
                # Enhanced specifications
                "battery": "5400mAh",
                "screen_size": "6.82 inch",
                "camera": "50MP Hasselblad Camera",
                "processor": "Snapdragon 8 Gen 3",
                "operating_system": "OxygenOS 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[6], PHONE_IMAGES[7], PHONE_IMAGES[8]],
                "purchase_year": 2024,
                "warranty_months": 10,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Case", "Screen Protector"],
                "created_at": datetime.utcnow() - timedelta(days=9),
                "views": 94,
                "is_featured": True,
                "is_active": True
            },
            {
                "brand": "Google",
                "model": "Pixel 8 Pro",
                "condition": "Like New",
                "price": 275000,
                "storage": "128GB",
                "ram": "12GB",
                "city": "Islamabad",
                "description": "Google Pixel 8 Pro with incredible AI features and camera quality. Pure Android experience with timely updates.",
                "seller_name": "Kamran Ali",
                "seller_phone": "03334455667",
                "seller_email": "kamran@example.com",
                "features": ["AI Camera", "Magic Eraser", "Call Screen", "Titan M Security"],
                # Enhanced specifications
                "battery": "5050mAh",
                "screen_size": "6.7 inch",
                "camera": "50MP AI Camera",
                "processor": "Google Tensor G3",
                "operating_system": "Android 14",
                "network": "5G",
                "photos": [PHONE_IMAGES[9], PHONE_IMAGES[0]],
                "purchase_year": 2023,
                "warranty_months": 4,
                "box_included": True,
                "accessories_included": ["Charger", "Cable"],
                "created_at": datetime.utcnow() - timedelta(days=10),
                "views": 67,
                "is_featured": False,
                "is_active": True
            },
            {
                "brand": "Huawei",
                "model": "P60 Pro",
                "condition": "Very Good",
                "price": 155000,
                "storage": "256GB",
                "ram": "8GB",
                "city": "Lahore",
                "description": "Huawei P60 Pro with amazing camera system. Great build quality and performance. No Google services included.",
                "seller_name": "Ayesha Shah",
                "seller_phone": "03125678901",
                "seller_email": "ayesha@example.com",
                "features": ["Variable Aperture", "Leica Camera", "120Hz Display", "Satellite Communication"],
                # Enhanced specifications
                "battery": "4815mAh",
                "screen_size": "6.67 inch",
                "camera": "48MP Variable Aperture",
                "processor": "Snapdragon 8+ Gen 1",
                "operating_system": "HarmonyOS 3.1",
                "network": "5G",
                "photos": [PHONE_IMAGES[1], PHONE_IMAGES[2]],
                "purchase_year": 2023,
                "warranty_months": 1,
                "box_included": True,
                "accessories_included": ["Charger", "Cable", "Case"],
                "created_at": datetime.utcnow() - timedelta(days=11),
                "views": 43,
                "is_featured": False,
                "is_active": True
            }
        ]

        # Sample accessories
        sample_accessories = [
            {
                "category": "accessories",
                "type": "case",
                "brand": "Apple",
                "model": "iPhone 15 Pro Leather Case",
                "condition": "New",
                "price": 8500,
                "city": "Karachi",
                "description": "Official Apple leather case for iPhone 15 Pro. Premium quality leather with perfect fit and protection.",
                "seller_name": "Tech Store",
                "seller_phone": "03001234567",
                "seller_email": "techstore@example.com",
                "features": ["Genuine Leather", "Perfect Fit", "Drop Protection", "MagSafe Compatible"],
                "created_at": datetime.utcnow(),
                "views": 45,
                "is_featured": True,
                "is_active": True
            },
            {
                "category": "accessories",
                "type": "charger",
                "brand": "Samsung",
                "model": "45W Super Fast Charger",
                "condition": "New",
                "price": 3500,
                "city": "Lahore",
                "description": "Original Samsung 45W super fast charger. Compatible with all Samsung fast charging phones.",
                "seller_name": "Mobile Mart",
                "seller_phone": "03121234567", 
                "seller_email": "mobilemart@example.com",
                "features": ["45W Fast Charging", "USB-C", "Original Samsung", "Compact Design"],
                "created_at": datetime.utcnow() - timedelta(days=1),
                "views": 32,
                "is_featured": False,
                "is_active": True
            },
            {
                "category": "accessories",
                "type": "screen_protector",
                "brand": "Generic",
                "model": "Tempered Glass Screen Protector",
                "condition": "New",
                "price": 500,
                "city": "Islamabad",
                "description": "High quality tempered glass screen protector. 9H hardness, crystal clear, easy installation.",
                "seller_name": "Accessories Hub",
                "seller_phone": "03331234567",
                "seller_email": "accessories@example.com",
                "features": ["9H Hardness", "Crystal Clear", "Bubble Free", "Easy Install"],
                "created_at": datetime.utcnow() - timedelta(days=2),
                "views": 78,
                "is_featured": False,
                "is_active": True
            },
            {
                "category": "accessories",
                "type": "wireless_charger",
                "brand": "Anker",
                "model": "PowerWave 15W Wireless Charger",
                "condition": "Like New",
                "price": 4500,
                "city": "Rawalpindi",
                "description": "Anker PowerWave 15W wireless charger. Fast wireless charging for all Qi-enabled devices.",
                "seller_name": "Gadget Store",
                "seller_phone": "03451234567",
                "seller_email": "gadgets@example.com",
                "features": ["15W Fast Charging", "Qi Compatible", "LED Indicator", "Temperature Control"],
                "created_at": datetime.utcnow() - timedelta(days=3),
                "views": 23,
                "is_featured": False,
                "is_active": True
            },
            {
                "category": "accessories",
                "type": "power_bank",
                "brand": "Xiaomi",
                "model": "Mi Power Bank 20000mAh",
                "condition": "Good",
                "price": 2800,
                "city": "Faisalabad",
                "description": "Xiaomi Mi Power Bank 20000mAh. Reliable portable charging solution with fast charging support.",
                "seller_name": "Electronics Point",
                "seller_phone": "03411234567",
                "seller_email": "electronics@example.com",
                "features": ["20000mAh Capacity", "Dual USB Output", "Fast Charging", "LED Indicator"],
                "created_at": datetime.utcnow() - timedelta(days=4),
                "views": 56,
                "is_featured": True,
                "is_active": True
            }
        ]

        # Clear existing sample data
        await db.phone_listings.delete_many({})
        await db.accessories.delete_many({})
        
        # Insert sample listings
        await db.phone_listings.insert_many(sample_listings)
        await db.accessories.insert_many(sample_accessories)
        
        return {
            "success": True, 
            "message": f"Successfully populated {len(sample_listings)} phone listings and {len(sample_accessories)} accessories"
        }
        
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

@api_router.get("/listings/recent", response_model=List[PhoneListing])
async def get_recent_listings(limit: int = 8):
    """Get recent phone listings"""
    try:
        # Get most recent listings sorted by date_posted or created_at
        recent_cursor = db.phone_listings.find({
            "is_active": True
        }).sort([("date_posted", -1), ("created_at", -1)]).limit(limit)
        
        recent_listings = await recent_cursor.to_list(length=limit)
        
        # Serialize MongoDB documents
        for listing in recent_listings:
            listing = serialize_doc(listing)
        
        return [PhoneListing(**listing) for listing in recent_listings]
    except Exception as e:
        logger.error(f"Error fetching recent listings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch recent listings")

@api_router.get("/listings", response_model=List[PhoneListing])
async def get_listings(
    skip: int = 0, 
    limit: int = 50, 
    # Basic filters
    city: Optional[str] = None, 
    brand: Optional[str] = None, 
    model: Optional[str] = None,
    condition: Optional[str] = None,
    color: Optional[str] = None,
    # Price filters
    min_price: Optional[int] = None, 
    max_price: Optional[int] = None,
    # Specification filters
    storage: Optional[str] = None,
    ram: Optional[str] = None,
    battery: Optional[str] = None,
    battery_health: Optional[str] = None,
    network: Optional[str] = None,
    seller_type: Optional[str] = None,
    # Search query
    search: Optional[str] = None,
    # Sorting
    sort_by: Optional[str] = "newest"  # newest, oldest, price_low, price_high, most_viewed
):
    """Get phone listings with advanced filters and sorting"""
    try:
        # Build query filter
        query = {"is_active": True}
        
        # Basic filters
        if city:
            query["city"] = {"$regex": city, "$options": "i"}
        if brand:
            query["brand"] = {"$regex": brand, "$options": "i"}
        if model:
            query["model"] = {"$regex": model, "$options": "i"}
        if condition:
            query["condition"] = {"$regex": condition, "$options": "i"}
        if color:
            query["color"] = {"$regex": color, "$options": "i"}
            
        # Specification filters
        if storage:
            query["storage"] = {"$regex": storage, "$options": "i"}
        if ram:
            query["ram"] = {"$regex": ram, "$options": "i"}
        if battery:
            query["battery"] = {"$regex": battery, "$options": "i"}
        if battery_health:
            query["battery_health"] = {"$regex": battery_health, "$options": "i"}
        if network:
            query["network"] = {"$regex": network, "$options": "i"}
        if seller_type:
            query["seller_type"] = {"$regex": seller_type, "$options": "i"}
            
        # Price range filter
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = min_price
            if max_price is not None:
                price_filter["$lte"] = max_price
            query["price"] = price_filter
            
        # Search across multiple fields (with fuzzy matching)
        if search:
            search_terms = search.lower().split()
            search_conditions = []
            
            for term in search_terms:
                # Fuzzy matching for common misspellings
                fuzzy_term = term
                if "iphone" in term or "iphne" in term or "ifone" in term:
                    fuzzy_term = "iphone"
                elif "samsung" in term or "samung" in term:
                    fuzzy_term = "samsung"
                elif "xiaomi" in term or "xiomi" in term:
                    fuzzy_term = "xiaomi"
                
                search_regex = {"$regex": fuzzy_term, "$options": "i"}
                search_conditions.append({
                    "$or": [
                        {"brand": search_regex},
                        {"model": search_regex},
                        {"description": search_regex},
                        {"features": {"$elemMatch": {"$regex": fuzzy_term, "$options": "i"}}},
                        {"processor": search_regex},
                        {"operating_system": search_regex}
                    ]
                })
            
            if search_conditions:
                query["$and"] = search_conditions
        
        # Determine sorting
        sort_criteria = []
        if sort_by == "newest":
            sort_criteria = [("created_at", -1)]
        elif sort_by == "oldest":
            sort_criteria = [("created_at", 1)]
        elif sort_by == "price_low":
            sort_criteria = [("price", 1)]
        elif sort_by == "price_high":
            sort_criteria = [("price", -1)]
        elif sort_by == "most_viewed":
            sort_criteria = [("views", -1)]
        else:
            sort_criteria = [("created_at", -1)]  # default to newest
        
        # Get listings with sorting
        cursor = db.phone_listings.find(query).sort(sort_criteria).skip(skip).limit(limit)
        listings = await cursor.to_list(length=limit)
        
        # Serialize ObjectIds
        for listing in listings:
            listing = serialize_doc(listing)
        
        return [PhoneListing(**listing) for listing in listings]
    except Exception as e:
        logger.error(f"Error fetching listings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch listings")

@api_router.get("/listings/{listing_id}", response_model=PhoneListing)
async def get_listing_details(listing_id: str):
    """Get detailed information for a specific listing"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(listing_id):
            raise HTTPException(status_code=400, detail="Invalid listing ID format")
            
        # Find the listing
        listing = await db.phone_listings.find_one({"_id": ObjectId(listing_id), "is_active": True})
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        # Increment view count
        await db.phone_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$inc": {"views": 1}}
        )
        
        # Serialize and return
        listing = serialize_doc(listing)
        return PhoneListing(**listing)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching listing details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch listing details")

@api_router.get("/stats")
async def get_stats():
    """Get platform statistics"""
    try:
        total_listings = await db.phone_listings.count_documents({"is_active": True})
        total_accessories = await db.accessories.count_documents({"is_active": True})
        total_users = await db.users.count_documents({"is_active": True})
        
        # Get brand counts
        pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$brand", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 6}
        ]
        brand_stats = await db.phone_listings.aggregate(pipeline).to_list(length=6)
        brands = [{"name": stat["_id"], "count": stat["count"]} for stat in brand_stats]
        
        # Get city counts
        city_pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$city", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        city_stats = await db.phone_listings.aggregate(city_pipeline).to_list(length=10)
        cities = [{"name": stat["_id"], "count": stat["count"]} for stat in city_stats]
        
        return {
            "total_listings": total_listings,
            "total_accessories": total_accessories,
            "accessories_count": total_accessories,  # Alias for compatibility
            "total_users": total_users,
            "brands_count": len(brands),
            "cities_count": len(cities),
            "brands": brands,
            "cities": cities
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")

# Accessories Routes
@api_router.get("/accessories")
async def get_accessories(skip: int = 0, limit: int = 50, type: Optional[str] = None, brand: Optional[str] = None, city: Optional[str] = None, min_price: Optional[int] = None, max_price: Optional[int] = None):
    """Get accessories with optional filters"""
    try:
        # Build query filter
        query = {"is_active": True, "category": "accessories"}
        
        if type:
            query["type"] = {"$regex": type, "$options": "i"}
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
        
        # Get accessories sorted by creation date (newest first)
        cursor = db.accessories.find(query).sort("created_at", -1).skip(skip).limit(limit)
        accessories = await cursor.to_list(length=limit)
        
        # Serialize ObjectIds
        for accessory in accessories:
            accessory = serialize_doc(accessory)
        
        return accessories
    except Exception as e:
        logger.error(f"Error fetching accessories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch accessories")

@api_router.get("/accessories/featured")
async def get_featured_accessories(limit: int = 4):
    """Get featured accessories"""
    try:
        # Get featured accessories first, then recent ones if not enough featured
        featured_cursor = db.accessories.find({
            "is_active": True, 
            "is_featured": True,
            "category": "accessories"
        }).sort("created_at", -1).limit(limit)
        
        featured_accessories = await featured_cursor.to_list(length=limit)
        
        # If not enough featured, get recent ones
        if len(featured_accessories) < limit:
            remaining = limit - len(featured_accessories)
            recent_cursor = db.accessories.find({
                "is_active": True,
                "category": "accessories",
                "is_featured": {"$ne": True}
            }).sort("created_at", -1).limit(remaining)
            
            recent_accessories = await recent_cursor.to_list(length=remaining)
            featured_accessories.extend(recent_accessories)
        
        # Serialize ObjectIds
        for accessory in featured_accessories:
            accessory = serialize_doc(accessory)
        
        return featured_accessories
    except Exception as e:
        logger.error(f"Error fetching featured accessories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured accessories")

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
