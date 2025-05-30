import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Home, 
  List, 
  Plus, 
  MessageCircle, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  TrendingDown,
  Smartphone,
  Headphones,
  Battery,
  Filter,
  ArrowRight,
  Play,
  Eye,
  Heart,
  BarChart2,
  Users,
  Award,
  Zap,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronDown,
  Sliders,
  Bell,
  ShoppingBag
} from 'react-feather';

// Header Component
export const Header = ({ 
  currentPage, 
  setCurrentPage, 
  user, 
  isLoggedIn, 
  onLogin, 
  onLogout,
  compareCount,
  onCompareClick 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Used Phones', key: 'used-phones', color: 'text-white hover:text-gray-200' },
    { name: 'New Phones', key: 'new-phones', color: 'text-white hover:text-gray-200' },
    { name: 'Accessories', key: 'accessories', color: 'text-white hover:text-gray-200' },
    { name: 'Phone Store', key: 'phone-store', color: 'text-white hover:text-gray-200' },
    { name: 'Reviews', key: 'reviews', color: 'text-white hover:text-gray-200' },
    { name: 'Videos', key: 'videos', color: 'text-white hover:text-gray-200' },
    { name: 'Forums', key: 'forums', color: 'text-white hover:text-gray-200' },
    { name: 'Blog', key: 'blog', color: 'text-white hover:text-gray-200' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-slate-900 px-4 py-1 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              Download App via SMS
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-orange-400">اردو</span>
            <button className="hover:text-white transition-colors">Sign Up</button>
            <button className="hover:text-white transition-colors">Sign In</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">PhoneFlip</div>
                <div className="text-xs text-gray-300 -mt-1">.PK</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.key 
                    ? 'bg-blue-600 text-white' 
                    : item.color
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Compare Button */}
            <button
              onClick={onCompareClick}
              className="relative hidden md:flex items-center space-x-1 text-white hover:text-blue-300 transition-colors"
            >
              <GitCompare className="w-5 h-5" />
              <span className="text-sm">Compare</span>
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Post Ad Button */}
            <button
              onClick={() => setCurrentPage('post-ad')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post an Ad</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-slate-700 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-700">
            <div className="space-y-2 mt-4">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentPage(item.key);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.key 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white hover:bg-slate-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Enhanced Hero Section with Advanced Search
export const HeroSection = ({ onCompareClick, onPriceAlertsClick }) => {
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    brand: '',
    city: '',
    priceRange: '',
    condition: '',
    storage: '',
    ram: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const brands = ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Realme'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const priceRanges = ['Under 20K', '20K - 50K', '50K - 100K', '100K - 150K', '150K+'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];

  return (
    <section className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find Used Mobile Phones in Pakistan
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            With thousands of phones, we have just the right one for you
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={onCompareClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <GitCompare className="w-5 h-5" />
              <span>Compare Phones</span>
            </button>
            <button
              onClick={onPriceAlertsClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Bell className="w-5 h-5" />
              <span>Price Alerts</span>
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Phone Search */}
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Phone Make or Model"
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters({...searchFilters, query: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City Dropdown */}
              <div className="relative">
                <select
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="relative">
                <select
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters({...searchFilters, priceRange: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 mx-auto"
            >
              <Sliders className="w-4 h-4" />
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Brand Filter */}
                  <div className="relative">
                    <select
                      value={searchFilters.brand}
                      onChange={(e) => setSearchFilters({...searchFilters, brand: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All Brands</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Condition Filter */}
                  <div className="relative">
                    <select
                      value={searchFilters.condition}
                      onChange={(e) => setSearchFilters({...searchFilters, condition: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All Conditions</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Storage Filter */}
                  <div className="relative">
                    <select
                      value={searchFilters.storage}
                      onChange={(e) => setSearchFilters({...searchFilters, storage: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All Storage</option>
                      {storageOptions.map(storage => (
                        <option key={storage} value={storage}>{storage}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* RAM Filter */}
                  <div className="relative">
                    <select
                      value={searchFilters.ram}
                      onChange={(e) => setSearchFilters({...searchFilters, ram: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All RAM</option>
                      {ramOptions.map(ram => (
                        <option key={ram} value={ram}>{ram}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Compare Section
export const CompareSection = ({ compareList, onCompareClick }) => {
  if (compareList.length === 0) return null;

  return (
    <div className="bg-blue-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900 font-medium">
              {compareList.length} phone{compareList.length > 1 ? 's' : ''} selected for comparison
            </span>
          </div>
          <button
            onClick={onCompareClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sell Section
export const SellSection = ({ isLoggedIn, setCurrentPage }) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Sell Your Phone on PhoneFlip and Get the Best Price
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Post Your Ad */}
          <div className="bg-gray-50 rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Post your Ad on PhoneFlip</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Post your Ad for Free in 3 Easy Steps</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Get Genuine offers from Verified Buyers</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Sell your Phone Fast at the Best Price</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('post-ad')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors w-full md:w-auto"
            >
              Post Your Ad
            </button>
          </div>

          {/* Sell to PhoneFlip (Updated) */}
          <div className="bg-gray-50 rounded-xl p-6 md:p-8 relative">
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Quick Sale
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sell to PhoneFlip</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Get Instant Price Quote for your Phone</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Free Home Pickup & Instant Payment</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">No Hassle, No Waiting, No Commission</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors w-full md:w-auto">
              Get Quote Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Featured Shops Section
export const FeaturedShopsSection = () => {
  const [userCity, setUserCity] = useState('Karachi'); // Default or detected city

  const featuredShops = [
    {
      id: 1,
      name: 'Mobile World Karachi',
      rating: 4.8,
      reviews: 245,
      image: 'https://images.pexels.com/photos/5475811/pexels-photo-5475811.jpeg',
      verified: true,
      location: 'Saddar, Karachi',
      specialties: ['iPhone', 'Samsung', 'Accessories'],
      yearsInBusiness: 8,
      phoneCount: 150
    },
    {
      id: 2,
      name: 'Tech Hub Lahore',
      rating: 4.9,
      reviews: 189,
      image: 'https://images.pexels.com/photos/9169180/pexels-photo-9169180.jpeg',
      verified: true,
      location: 'Liberty Market, Lahore',
      specialties: ['Xiaomi', 'OnePlus', 'Gaming Phones'],
      yearsInBusiness: 5,
      phoneCount: 200
    },
    {
      id: 3,
      name: 'Smart Phones Islamabad',
      rating: 4.7,
      reviews: 312,
      image: 'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg',
      verified: true,
      location: 'Blue Area, Islamabad',
      specialties: ['Premium Phones', 'Repairs', 'Trade-in'],
      yearsInBusiness: 12,
      phoneCount: 180
    },
    {
      id: 4,
      name: 'Digital Mart Faisalabad',
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1596207498818-edb80522f50b',
      verified: true,
      location: 'Clock Tower, Faisalabad',
      specialties: ['Budget Phones', 'Accessories', 'Warranty'],
      yearsInBusiness: 6,
      phoneCount: 120
    }
  ];

  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Top Shops in {userCity}
          </h2>
          <p className="text-gray-600 mb-6">
            Verified sellers with excellent ratings and genuine products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Shop Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <img 
                  src={shop.image} 
                  alt={shop.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-4 left-4">
                  {shop.verified && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                  {shop.phoneCount}+ Phones
                </div>
              </div>

              {/* Shop Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{shop.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(shop.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{shop.rating}</span>
                  <span className="text-sm text-gray-500">({shop.reviews} reviews)</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 mb-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{shop.location}</span>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {shop.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {specialty}
                      </span>
                    ))}
                    {shop.specialties.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{shop.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{shop.yearsInBusiness} years</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    View Shop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
            <span>View All Verified Shops</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Our Offerings Section
export const OurOfferingsSection = ({ onCompareClick, onPriceAlertsClick }) => {
  const offerings = [
    {
      id: 1,
      icon: <GitCompare className="w-8 h-8" />,
      title: 'Phone Comparison Tool',
      description: 'Compare specs, prices, and features side-by-side to make the best choice',
      color: 'from-blue-500 to-blue-600',
      action: onCompareClick,
      buttonText: 'Compare Phones'
    },
    {
      id: 2,
      icon: <Shield className="w-8 h-8" />,
      title: 'Phone Condition Check',
      description: 'Complete guide to verify phone authenticity and condition before buying',
      color: 'from-green-500 to-green-600',
      action: () => {},
      buttonText: 'Check Guide'
    },
    {
      id: 3,
      icon: <TrendingDown className="w-8 h-8" />,
      title: 'Price Drop Alerts',
      description: 'Get notified when prices drop on your favorite phone models',
      color: 'from-orange-500 to-red-500',
      action: onPriceAlertsClick,
      buttonText: 'Set Alert'
    },
    {
      id: 4,
      icon: <Star className="w-8 h-8" />,
      title: 'Shop Reviews & Ratings',
      description: 'Read genuine reviews and ratings from verified buyers and sellers',
      color: 'from-purple-500 to-pink-500',
      action: () => {},
      buttonText: 'Read Reviews'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Offerings
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and services to help you buy and sell phones with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((offering) => (
            <div key={offering.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Icon Header */}
              <div className={`bg-gradient-to-r ${offering.color} p-6 text-white`}>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {offering.icon}
                </div>
                <h3 className="text-lg font-bold text-center">{offering.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {offering.description}
                </p>
                <button
                  onClick={offering.action}
                  className={`w-full bg-gradient-to-r ${offering.color} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                >
                  {offering.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Accessories Section
export const AccessoriesSection = () => {
  const accessories = [
    {
      id: 1,
      name: 'Phone Cases',
      image: 'https://images.unsplash.com/photo-1596207891316-23851be3cc20',
      priceRange: 'PKR 500 - 5,000',
      itemCount: 1250,
      category: 'Protection'
    },
    {
      id: 2,
      name: 'Chargers & Cables',
      image: 'https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg',
      priceRange: 'PKR 300 - 3,000',
      itemCount: 890,
      category: 'Power'
    },
    {
      id: 3,
      name: 'Screen Protectors',
      image: 'https://images.unsplash.com/photo-1590459963567-1bf6b8595be1',
      priceRange: 'PKR 200 - 2,000',
      itemCount: 650,
      category: 'Protection'
    },
    {
      id: 4,
      name: 'Headphones & Earbuds',
      image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc',
      priceRange: 'PKR 800 - 15,000',
      itemCount: 920,
      category: 'Audio'
    },
    {
      id: 5,
      name: 'Power Banks',
      image: 'https://images.pexels.com/photos/8728560/pexels-photo-8728560.jpeg',
      priceRange: 'PKR 1,000 - 8,000',
      itemCount: 380,
      category: 'Power'
    },
    {
      id: 6,
      name: 'Phone Stands',
      image: 'https://images.pexels.com/photos/16053029/pexels-photo-16053029.jpeg',
      priceRange: 'PKR 300 - 2,500',
      itemCount: 240,
      category: 'Utility'
    }
  ];

  const categories = ['All', 'Protection', 'Power', 'Audio', 'Utility'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAccessories = selectedCategory === 'All' 
    ? accessories 
    : accessories.filter(item => item.category === selectedCategory);

  return (
    <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Phone Accessories
          </h2>
          <p className="text-gray-600 mb-6">
            Complete your phone experience with genuine accessories
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filteredAccessories.map((accessory) => (
            <div key={accessory.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-orange-400 to-yellow-500 relative overflow-hidden">
                <img 
                  src={accessory.image} 
                  alt={accessory.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                  {accessory.itemCount}+ items
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-2">{accessory.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{accessory.priceRange}</p>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Browse
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Browse All Accessories</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// Content Cards Section
export const ContentCardsSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Best Phones Under 30K in Pakistan 2024',
      excerpt: 'Discover the top budget-friendly smartphones that offer excellent value for money',
      image: 'https://images.unsplash.com/photo-1596207498818-edb80522f50b',
      category: 'Buying Guide',
      readTime: '5 min read',
      publishDate: '2 days ago',
      views: 1250
    },
    {
      id: 2,
      title: 'How to Check Phone Condition Before Buying',
      excerpt: 'Complete checklist to verify phone authenticity and avoid scams',
      image: 'https://images.pexels.com/photos/5475811/pexels-photo-5475811.jpeg',
      category: 'Tips & Tricks',
      readTime: '8 min read',
      publishDate: '1 week ago',
      views: 2100
    },
    {
      id: 3,
      title: 'iPhone vs Samsung: Which is Better?',
      excerpt: 'Detailed comparison of features, performance, and value',
      image: 'https://images.unsplash.com/photo-1596207891316-23851be3cc20',
      category: 'Comparison',
      readTime: '12 min read',
      publishDate: '3 days ago',
      views: 3400
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max Review - Pakistan',
      thumbnail: 'https://images.pexels.com/photos/9169180/pexels-photo-9169180.jpeg',
      duration: '15:30',
      views: 45000,
      channel: 'PhoneFlip Reviews',
      uploadDate: '1 week ago'
    },
    {
      id: 2,
      title: 'Best Gaming Phones Under 100K',
      thumbnail: 'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg',
      duration: '22:15',
      views: 28000,
      channel: 'Tech Pakistan',
      uploadDate: '4 days ago'
    }
  ];

  const news = [
    {
      id: 1,
      title: 'Samsung Galaxy S24 Ultra Price Drop in Pakistan',
      excerpt: 'Latest flagship now available at reduced prices across major retailers',
      publishDate: '6 hours ago',
      category: 'Price Update'
    },
    {
      id: 2,
      title: 'New Trade-in Program Launched',
      excerpt: 'Exchange your old phone for instant discount on new purchases',
      publishDate: '2 days ago',
      category: 'Announcement'
    }
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Content
          </h2>
          <p className="text-gray-600">
            Stay updated with reviews, guides, and market news
          </p>
        </div>

        {/* Blog Posts */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Featured Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span>{post.readTime}</span>
                      <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Videos and News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Videos */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-red-600 mr-3"></div>
              Latest Videos
            </h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex space-x-4">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white bg-red-600 rounded-full p-1" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{video.channel}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>{video.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-green-600 mr-3"></div>
              Market News
            </h3>
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.publishDate}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{item.excerpt}</p>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">PhoneFlip</div>
                <div className="text-xs text-gray-300 -mt-1">.PK</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Pakistan's leading marketplace for buying and selling used mobile phones with verified sellers and genuine products.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>

          {/* Mobile Apps */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Download App</h3>
            <div className="space-y-3">
              <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full">
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full">
                <div className="text-left">
                  <div className="text-xs text-gray-300">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="mt-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@phoneflip.pk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} PhoneFlip.PK. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Made with ❤️ in Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Price Drop Alerts Modal
export const PriceDropAlertsModal = ({ isOpen, onClose }) => {
  const [alertData, setAlertData] = useState({
    phone: '',
    brand: '',
    maxPrice: '',
    email: '',
    city: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Set Price Alert</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Model</label>
            <input
              type="text"
              placeholder="e.g., iPhone 15 Pro Max"
              value={alertData.phone}
              onChange={(e) => setAlertData({...alertData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={alertData.brand}
              onChange={(e) => setAlertData({...alertData, brand: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Brand</option>
              <option value="iPhone">iPhone</option>
              <option value="Samsung">Samsung</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Oppo">Oppo</option>
              <option value="Vivo">Vivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert When Price Drops Below</label>
            <input
              type="text"
              placeholder="PKR 100,000"
              value={alertData.maxPrice}
              onChange={(e) => setAlertData({...alertData, maxPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={alertData.email}
              onChange={(e) => setAlertData({...alertData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City (Optional)</label>
            <select
              value={alertData.city}
              onChange={(e) => setAlertData({...alertData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Set Price Alert
          </button>
        </form>
      </div>
    </div>
  );
};

// Compare Modal
export const CompareModal = ({ isOpen, onClose, compareList, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Compare Phones</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-12">
            <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No phones to compare</h4>
            <p className="text-gray-600">Add phones to your comparison list to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareList.map((phone) => (
              <div key={phone.id} className="border rounded-lg p-4 relative">
                <button
                  onClick={() => onRemove(phone.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <img 
                  src={phone.image} 
                  alt={phone.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-bold text-lg mb-2">{phone.title}</h4>
                <p className="text-blue-600 font-bold text-xl mb-4">{phone.price}</p>
                {/* Add more comparison specs here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Keep existing components (MobileBottomNav, BrowseSection, FeaturedPhones) unchanged
export const MobileBottomNav = ({ currentPage, setCurrentPage, isLoggedIn, compareCount }) => {
  const tabs = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'my-ads', icon: List, label: 'My Ads', requiresAuth: true },
    { key: 'sell', icon: Plus, label: 'Sell', isSpecial: true, requiresAuth: true },
    { key: 'chat', icon: MessageCircle, label: 'Chat', requiresAuth: true },
    { key: 'more', icon: MoreHorizontal, label: 'More' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentPage === tab.key;
          const isSpecial = tab.isSpecial;
          
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.requiresAuth && !isLoggedIn) {
                  alert('Please login to access this feature');
                  return;
                }
                setCurrentPage(tab.key);
              }}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 relative ${
                isSpecial 
                  ? 'transform -translate-y-2' 
                  : ''
              }`}
            >
              <div className={`flex items-center justify-center relative ${
                isSpecial 
                  ? 'w-14 h-14 bg-red-600 rounded-full shadow-lg' 
                  : 'w-6 h-6'
              }`}>
                <IconComponent 
                  className={`${
                    isSpecial 
                      ? 'w-7 h-7 text-white' 
                      : isActive 
                        ? 'w-6 h-6 text-blue-600' 
                        : 'w-6 h-6 text-gray-400'
                  }`} 
                />
                {tab.key === 'chat' && compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 truncate ${
                isSpecial 
                  ? 'text-red-600 font-medium' 
                  : isActive 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const BrowseSection = () => {
  const [activeTab, setActiveTab] = useState('Category');
  
  const tabs = ['Category', 'City', 'Brand', 'Model', 'Budget', 'Storage'];
  
  const categoryData = {
    'Category': [
      { name: 'iPhone', count: 1234, color: 'bg-blue-500' },
      { name: 'Samsung', count: 2156, color: 'bg-purple-500' },
      { name: 'Xiaomi', count: 1876, color: 'bg-orange-500' },
      { name: 'Oppo', count: 945, color: 'bg-green-500' },
      { name: 'Vivo', count: 823, color: 'bg-pink-500' },
      { name: 'OnePlus', count: 567, color: 'bg-red-500' }
    ],
    'City': [
      { name: 'Karachi', count: 3456, color: 'bg-blue-600' },
      { name: 'Lahore', count: 2890, color: 'bg-green-600' },
      { name: 'Islamabad', count: 1567, color: 'bg-purple-600' },
      { name: 'Rawalpindi', count: 1234, color: 'bg-orange-600' },
      { name: 'Faisalabad', count: 891, color: 'bg-red-600' },
      { name: 'Multan', count: 654, color: 'bg-indigo-600' }
    ],
    'Brand': [
      { name: 'Apple iPhone', count: 1234, color: 'bg-gray-600' },
      { name: 'Samsung Galaxy', count: 2156, color: 'bg-blue-600' },
      { name: 'Xiaomi Mi/Redmi', count: 1876, color: 'bg-orange-600' },
      { name: 'Oppo', count: 945, color: 'bg-green-600' },
      { name: 'Vivo', count: 823, color: 'bg-purple-600' },
      { name: 'OnePlus', count: 567, color: 'bg-red-600' }
    ],
    'Model': [
      { name: 'iPhone 15 Pro Max', count: 234, color: 'bg-blue-500' },
      { name: 'Galaxy S24 Ultra', count: 445, color: 'bg-purple-500' },
      { name: 'Xiaomi 14 Ultra', count: 167, color: 'bg-orange-500' },
      { name: 'iPhone 14 Pro', count: 298, color: 'bg-blue-600' },
      { name: 'Galaxy S23', count: 356, color: 'bg-purple-600' },
      { name: 'OnePlus 12', count: 123, color: 'bg-red-500' }
    ],
    'Budget': [
      { name: 'Under 25K', count: 1456, color: 'bg-green-500' },
      { name: '25K - 50K', count: 2234, color: 'bg-blue-500' },
      { name: '50K - 100K', count: 1789, color: 'bg-purple-500' },
      { name: '100K - 150K', count: 967, color: 'bg-orange-500' },
      { name: '150K - 200K', count: 445, color: 'bg-red-500' },
      { name: 'Above 200K', count: 234, color: 'bg-gray-600' }
    ],
    'Storage': [
      { name: '64GB', count: 1234, color: 'bg-blue-400' },
      { name: '128GB', count: 2456, color: 'bg-green-500' },
      { name: '256GB', count: 1789, color: 'bg-purple-500' },
      { name: '512GB', count: 678, color: 'bg-orange-500' },
      { name: '1TB', count: 234, color: 'bg-red-500' },
      { name: '2TB', count: 45, color: 'bg-gray-600' }
    ]
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Browse Used Phones
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryData[activeTab].map((item, index) => (
            <button
              key={index}
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg mb-3 mx-auto group-hover:scale-110 transition-transform flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {item.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500">
                {item.count.toLocaleString()} phones
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturedPhones = ({ addToCompare, compareList }) => {
  const featuredPhones = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      price: 'PKR 180,000',
      originalPrice: 'PKR 195,000',
      image: 'https://images.unsplash.com/photo-1596207498818-edb80522f50b',
      condition: 'Like New',
      storage: '256GB',
      ram: '8GB',
      city: 'Karachi',
      views: 1250,
      featured: true,
      seller: 'Mobile World',
      verified: true,
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra',
      price: 'PKR 150,000',
      originalPrice: 'PKR 165,000',
      image: 'https://images.pexels.com/photos/5475811/pexels-photo-5475811.jpeg',
      condition: 'Excellent',
      storage: '512GB',
      ram: '12GB',
      city: 'Lahore',
      views: 890,
      featured: true,
      seller: 'Tech Hub',
      verified: true,
      postedDate: '1 day ago'
    },
    {
      id: 3,
      title: 'Xiaomi 14 Ultra',
      price: 'PKR 95,000',
      originalPrice: 'PKR 105,000',
      image: 'https://images.unsplash.com/photo-1596207891316-23851be3cc20',
      condition: 'Good',
      storage: '256GB',
      ram: '12GB',
      city: 'Islamabad',
      views: 567,
      featured: true,
      seller: 'Smart Phones',
      verified: false,
      postedDate: '3 hours ago'
    },
    {
      id: 4,
      title: 'OnePlus 12',
      price: 'PKR 85,000',
      originalPrice: 'PKR 95,000',
      image: 'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg',
      condition: 'Like New',
      storage: '256GB',
      ram: '16GB',
      city: 'Rawalpindi',
      views: 423,
      featured: false,
      seller: 'Digital Mart',
      verified: true,
      postedDate: '5 hours ago'
    }
  ];

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Phones
            </h2>
            <p className="text-gray-600">
              Handpicked deals from verified sellers
            </p>
          </div>
          <button className="hidden md:block text-blue-600 hover:text-blue-700 font-medium">
            View All Featured →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPhones.map((phone) => {
            const isInCompare = compareList.some(p => p.id === phone.id);
            
            return (
              <div key={phone.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Image Container */}
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  <img 
                    src={phone.image} 
                    alt={phone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    {phone.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-2 block w-fit">
                        Featured
                      </span>
                    )}
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {phone.condition}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all group">
                      <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
                    </button>
                    <button
                      onClick={() => addToCompare(phone)}
                      disabled={isInCompare}
                      className={`p-2 rounded-full transition-all ${
                        isInCompare 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>

                  {/* View Count */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{phone.views}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {phone.title}
                    </h3>
                    {phone.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">{phone.price}</span>
                      {phone.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{phone.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <span className="font-medium">Storage:</span>
                      <span>{phone.storage}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <span className="font-medium">RAM:</span>
                      <span>{phone.ram}</span>
                    </div>
                  </div>

                  {/* Location & Seller */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{phone.city}</span>
                    </div>
                    <span>{phone.postedDate}</span>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{phone.seller}</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Featured Phones →
          </button>
        </div>
      </div>
    </section>
  );
};