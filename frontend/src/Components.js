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
  ShoppingBag,
  Video,
  FileText
} from 'react-feather';

// Enhanced Sign In Modal
export const SignInModal = ({ isOpen, onClose, onLogin, onSwitchToSignUp }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        onClose();
        setLoginData({ email: '', password: '' });
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToSignUp}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
// Search Results Component with Working Filters
export const SearchResultsPage = ({ searchFilters, onBack }) => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    brand: '',
    city: '',
    condition: '',
    priceRange: '',
    storage: '',
    ram: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const priceRanges = [
    'Under ₨50,000',
    '₨50,000 - ₨100,000',
    '₨100,000 - ₨200,000',
    '₨200,000 - ₨300,000',
    '₨300,000 - ₨500,000',
    'Above ₨500,000'
  ];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB'];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, activeFilters, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/listings`);
      const data = await response.json();
      
      if (response.ok) {
        setListings(data);
        // Apply initial search filters if any
        if (searchFilters) {
          setActiveFilters({
            ...activeFilters,
            ...searchFilters
          });
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    // Apply text search
    if (activeFilters.query) {
      filtered = filtered.filter(listing => 
        listing.brand.toLowerCase().includes(activeFilters.query.toLowerCase()) ||
        listing.model.toLowerCase().includes(activeFilters.query.toLowerCase())
      );
    }

    // Apply brand filter
    if (activeFilters.brand) {
      filtered = filtered.filter(listing => listing.brand === activeFilters.brand);
    }

    // Apply city filter
    if (activeFilters.city) {
      filtered = filtered.filter(listing => listing.city === activeFilters.city);
    }

    // Apply condition filter
    if (activeFilters.condition) {
      filtered = filtered.filter(listing => listing.condition === activeFilters.condition);
    }

    // Apply storage filter
    if (activeFilters.storage) {
      filtered = filtered.filter(listing => listing.storage === activeFilters.storage);
    }

    // Apply RAM filter
    if (activeFilters.ram) {
      filtered = filtered.filter(listing => listing.ram === activeFilters.ram);
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      filtered = filtered.filter(listing => {
        const price = listing.price;
        switch (activeFilters.priceRange) {
          case 'Under ₨50,000':
            return price < 50000;
          case '₨50,000 - ₨100,000':
            return price >= 50000 && price <= 100000;
          case '₨100,000 - ₨200,000':
            return price >= 100000 && price <= 200000;
          case '₨200,000 - ₨300,000':
            return price >= 200000 && price <= 300000;
          case '₨300,000 - ₨500,000':
            return price >= 300000 && price <= 500000;
          case 'Above ₨500,000':
            return price > 500000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        break;
    }

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setActiveFilters({
      brand: '',
      city: '',
      condition: '',
      priceRange: '',
      storage: '',
      ram: '',
      query: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== '').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading listings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Back to Home</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            </div>
            <div className="text-gray-600">
              {filteredListings.length} phones found
            </div>
          </div>
          
          {/* Active Search Query */}
          {searchFilters?.query && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-700">
                Searching for: <span className="font-semibold">"{searchFilters.query}"</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clear All ({getActiveFilterCount()})
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={activeFilters.query || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, query: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Search by brand or model"
                  />
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={activeFilters.brand}
                    onChange={(e) => setActiveFilters({ ...activeFilters, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={activeFilters.city}
                    onChange={(e) => setActiveFilters({ ...activeFilters, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={activeFilters.condition}
                    onChange={(e) => setActiveFilters({ ...activeFilters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={activeFilters.priceRange}
                    onChange={(e) => setActiveFilters({ ...activeFilters, priceRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Prices</option>
                    {priceRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Storage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                  <select
                    value={activeFilters.storage}
                    onChange={(e) => setActiveFilters({ ...activeFilters, storage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Storage</option>
                    {storageOptions.map(storage => (
                      <option key={storage} value={storage}>{storage}</option>
                    ))}
                  </select>
                </div>

                {/* RAM Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RAM</label>
                  <select
                    value={activeFilters.ram}
                    onChange={(e) => setActiveFilters({ ...activeFilters, ram: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All RAM</option>
                    {ramOptions.map(ram => (
                      <option key={ram} value={ram}>{ram}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-gray-900">
                {filteredListings.length} Results
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No phones found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {listing.brand} {listing.model}
                          </h3>
                          <p className="text-2xl font-bold text-green-600">
                            ₨ {listing.price.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                          listing.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                          listing.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.condition}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Storage:</span>
                          <p className="font-medium">{listing.storage}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">RAM:</span>
                          <p className="font-medium">{listing.ram}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">City:</span>
                          <p className="font-medium">{listing.city}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Views:</span>
                          <p className="font-medium">{listing.views}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>

                      {listing.features && listing.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {listing.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {feature}
                              </span>
                            ))}
                            {listing.features.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                +{listing.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{listing.seller_name}</p>
                          <p>{listing.seller_phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Call
                          </button>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sign Up Modal with Normal User and Shop Owner options
export const SignUpModal = ({ isOpen, onClose, onSignup, signUpType, setSignUpType, onSwitchToSignIn }) => {
  const [normalUserData, setNormalUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: ''
  });

  const [shopOwnerData, setShopOwnerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    businessName: '',
    businessAddress: '',
    businessType: '',
    yearsInBusiness: '',
    cnicNumber: '',
    businessLicense: null,
    cnicFront: null,
    cnicBack: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const businessTypes = ['Mobile Phone Shop', 'Electronics Store', 'Repair Center', 'Distributor', 'Other'];

  const handleNormalUserSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (normalUserData.password !== normalUserData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: normalUserData.name,
          email: normalUserData.email,
          password: normalUserData.password,
          phone: normalUserData.phone,
          city: normalUserData.city
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onSignup(data.user);
        onClose();
        resetForms();
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopOwnerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (shopOwnerData.password !== shopOwnerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(shopOwnerData).forEach(key => {
        if (key !== 'confirmPassword' && shopOwnerData[key] !== null) {
          formData.append(key, shopOwnerData[key]);
        }
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register-shop-owner`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onSignup(data.user);
        onClose();
        resetForms();
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setNormalUserData({
      name: '', email: '', password: '', confirmPassword: '', phone: '', city: ''
    });
    setShopOwnerData({
      name: '', email: '', password: '', confirmPassword: '', phone: '', city: '',
      businessName: '', businessAddress: '', businessType: '', yearsInBusiness: '',
      cnicNumber: '', businessLicense: null, cnicFront: null, cnicBack: null
    });
    setCurrentStep(1);
    setError('');
  };

  const handleFileChange = (fieldName, file) => {
    setShopOwnerData({ ...shopOwnerData, [fieldName]: file });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Join PhoneFlip.PK</h3>
            <button onClick={() => { onClose(); resetForms(); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sign Up Type Selector */}
          <div className="flex mt-4 space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setSignUpType('normal'); setCurrentStep(1); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                signUpType === 'normal' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Normal User
            </button>
            <button
              onClick={() => { setSignUpType('shop_owner'); setCurrentStep(1); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                signUpType === 'shop_owner' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Shop Owner
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {signUpType === 'normal' ? (
            /* Normal User Registration */
            <form onSubmit={handleNormalUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={normalUserData.name}
                    onChange={(e) => setNormalUserData({...normalUserData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={normalUserData.email}
                    onChange={(e) => setNormalUserData({...normalUserData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={normalUserData.phone}
                    onChange={(e) => setNormalUserData({...normalUserData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="03XX XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    required
                    value={normalUserData.city}
                    onChange={(e) => setNormalUserData({...normalUserData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={normalUserData.password}
                    onChange={(e) => setNormalUserData({...normalUserData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={normalUserData.confirmPassword}
                    onChange={(e) => setNormalUserData({...normalUserData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          ) : (
            /* Shop Owner Registration */
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Step {currentStep} of 3</span>
                  <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleShopOwnerSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={shopOwnerData.name}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={shopOwnerData.email}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={shopOwnerData.phone}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="03XX XXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <select
                          required
                          value={shopOwnerData.city}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select your city</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Number</label>
                        <input
                          type="text"
                          required
                          value={shopOwnerData.cnicNumber}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, cnicNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="XXXXX-XXXXXXX-X"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          required
                          value={shopOwnerData.password}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, password: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Create a password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          required
                          value={shopOwnerData.confirmPassword}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                          type="text"
                          required
                          value={shopOwnerData.businessName}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, businessName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter business name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select
                          required
                          value={shopOwnerData.businessType}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, businessType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select business type</option>
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={shopOwnerData.yearsInBusiness}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, yearsInBusiness: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Years in business"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                        <textarea
                          required
                          value={shopOwnerData.businessAddress}
                          onChange={(e) => setShopOwnerData({...shopOwnerData, businessAddress: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter complete business address"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Document Upload (KYC)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('businessLicense', e.target.files[0])}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload your business license (PDF or Image)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Front Side</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('cnicFront', e.target.files[0])}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload front side of your CNIC</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Back Side</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('cnicBack', e.target.files[0])}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload back side of your CNIC</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-blue-900">Verification Process</h5>
                            <p className="text-sm text-blue-700 mt-1">
                              Your documents will be reviewed within 24-48 hours. You'll receive an email notification once your shop owner account is verified.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="ml-auto bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {isLoading ? 'Creating account...' : 'Create Shop Owner Account'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToSignIn}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Header Component with Deep Blue Design
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
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpType, setSignUpType] = useState('normal'); // 'normal' or 'shop_owner'
  const [showDropdown, setShowDropdown] = useState(null);

  const navigation = [
    { 
      name: 'Used Phones', 
      key: 'used-phones', 
      icon: Smartphone,
      dropdownItems: ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'All Brands']
    },
    { 
      name: 'New Phones', 
      key: 'new-phones', 
      icon: Zap,
      dropdownItems: ['Latest Launches', 'Flagship Phones', 'Mid-Range', 'Budget Phones', 'Pre-Order']
    },
    { 
      name: 'Accessories', 
      key: 'accessories', 
      icon: Headphones,
      dropdownItems: ['Phone Cases', 'Screen Protectors', 'Chargers', 'Headphones', 'Power Banks', 'All Accessories']
    },
    { name: 'Reviews', key: 'reviews', icon: Star },
    { name: 'Videos', key: 'videos', icon: Video },
    { name: 'Blog', key: 'blog', icon: FileText },
  ];

  const handleLogin = (userData) => {
    onLogin(userData);
    setShowSignInModal(false);
    setShowSignUpModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    setShowUserMenu(false);
  };

  const handlePostAd = () => {
    if (!isLoggedIn) {
      setShowSignInModal(true);
      return;
    }
    setCurrentPage('post-ad');
  };

  const handleDropdownToggle = (itemKey) => {
    setShowDropdown(showDropdown === itemKey ? null : itemKey);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900 text-white shadow-2xl border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">PhoneFlip</div>
                  <div className="text-xs text-blue-300 font-semibold -mt-1">.PK</div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;
                
                return (
                  <div key={item.key} className="relative">
                    <button
                      onClick={() => hasDropdown ? handleDropdownToggle(item.key) : setCurrentPage(item.key)}
                      onMouseEnter={() => hasDropdown && setShowDropdown(item.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        currentPage === item.key 
                          ? 'bg-blue-800 text-white shadow-lg' 
                          : 'text-blue-100 hover:text-white hover:bg-blue-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.name}</span>
                      {hasDropdown && <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Dropdown Menu */}
                    {hasDropdown && showDropdown === item.key && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                        onMouseLeave={() => setShowDropdown(null)}
                      >
                        {item.dropdownItems.map((dropdownItem, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentPage(`${item.key}-${dropdownItem.toLowerCase().replace(' ', '-')}`);
                              setShowDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                          >
                            {dropdownItem}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Post an Ad Button - Red Highlighted */}
              <button
                onClick={handlePostAd}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Post an Ad</span>
                <span className="sm:hidden">Post</span>
              </button>

              {/* Auth Buttons / User Menu */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-blue-100 hover:text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:inline font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('my-ads');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <List className="w-4 h-4" />
                        <span>My Ads</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800 transition-all duration-200"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-blue-800 bg-blue-900">
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCurrentPage(item.key);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      currentPage === item.key 
                        ? 'bg-blue-800 text-white' 
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}

              {/* Mobile Auth */}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-blue-800 space-y-2">
                  <button
                    onClick={() => {
                      setShowSignInModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile User Menu */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-blue-800 space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-blue-800 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{user?.name || 'User'}</div>
                      <div className="text-sm text-blue-300">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('my-ads');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg"
                  >
                    <List className="w-5 h-5" />
                    <span>My Ads</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        onLogin={handleLogin}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setSignUpType('normal');
          setShowSignUpModal(true);
        }}
      />
      
      {/* Enhanced Sign Up Modal */}
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)}
        onSignup={handleLogin}
        signUpType={signUpType}
        setSignUpType={setSignUpType}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
    </>
  );
};

// Enhanced Hero Section with Advanced Search
export const HeroSection = ({ onCompareClick, onPriceAlertsClick, onSearch }) => {
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

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Realme'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const priceRanges = [
    'Under ₨50,000',
    '₨50,000 - ₨100,000',
    '₨100,000 - ₨200,000',
    '₨200,000 - ₨300,000',
    '₨300,000 - ₨500,000',
    'Above ₨500,000'
  ];
  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB'];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchFilters);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchFilters);
    }
  };

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white py-16 md:py-24 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url('https://images.unsplash.com/photo-1562575214-da9fcf59b907')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">
              Mobile Phone
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Pakistan's largest marketplace for new and used mobile phones. 
            Compare prices, read reviews, and find the best deals in your city.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={onCompareClick}
              className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <BarChart2 className="w-6 h-6" />
              <span>Compare Phones</span>
            </button>
            <button
              onClick={onPriceAlertsClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Bell className="w-6 h-6" />
              <span>Price Alerts</span>
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Phone Search */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Phone Make or Model"
                    value={searchFilters.query}
                    onChange={(e) => setSearchFilters({...searchFilters, query: e.target.value})}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* City Dropdown */}
              <div className="relative">
                <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                  className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none shadow-sm"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="relative">
                <span className="absolute left-3 top-4 text-gray-400 text-lg font-bold">₨</span>
                <select
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters({...searchFilters, priceRange: e.target.value})}
                  className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none shadow-sm"
                >
                  <option value="">Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-6 h-6" />
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 mx-auto transition-colors"
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
            <BarChart2 className="w-5 h-5 text-blue-600" />
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
      icon: <BarChart2 className="w-8 h-8" />,
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
            <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                      <BarChart2 className="w-4 h-4" />
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

// Post an Ad Component
export const PostAdPage = ({ onSubmitSuccess, user }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    condition: '',
    price: '',
    storage: '',
    ram: '',
    city: '',
    description: '',
    seller_name: user?.name || '',
    seller_phone: user?.phone || '',
    seller_email: user?.email || '',
    features: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedListing, setSubmittedListing] = useState(null);
  const [error, setError] = useState('');

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'];
  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const commonFeatures = [
    'Face ID', 'Fingerprint Scanner', 'Wireless Charging', 'Fast Charging', 
    'Dual SIM', 'NFC', 'Water Resistant', 'Headphone Jack', 
    'Expandable Storage', 'Dual Camera', 'Triple Camera', 'Quad Camera'
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = formData.features;
    if (currentFeatures.includes(feature)) {
      setFormData({
        ...formData,
        features: currentFeatures.filter(f => f !== feature)
      });
    } else {
      setFormData({
        ...formData,
        features: [...currentFeatures, feature]
      });
    }
  };

  const validateForm = () => {
    const required = ['brand', 'model', 'condition', 'price', 'storage', 'ram', 'city', 'description'];
    for (const field of required) {
      if (!formData[field]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmittedListing({ ...formData, id: data.listing_id });
        setShowPreview(true);
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }
      } else {
        setError(data.detail || 'Failed to submit listing');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
    setSubmittedListing(null);
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      condition: '',
      price: '',
      storage: '',
      ram: '',
      city: '',
      description: '',
      seller_name: user?.name || '',
      seller_phone: user?.phone || '',
      seller_email: user?.email || '',
      features: []
    });
    setShowPreview(false);
    setSubmittedListing(null);
    setError('');
  };

  if (showPreview && submittedListing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ad Posted Successfully!</h2>
              <p className="text-gray-600">Your phone listing is now live and visible to potential buyers.</p>
            </div>

            {/* Listing Preview */}
            <div className="border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Listing Preview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-blue-900">
                      {submittedListing.brand} {submittedListing.model}
                    </h4>
                    <p className="text-3xl font-bold text-green-600">₨ {parseInt(submittedListing.price).toLocaleString()}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Condition:</span>
                      <p className="text-gray-900">{submittedListing.condition}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Storage:</span>
                      <p className="text-gray-900">{submittedListing.storage}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">RAM:</span>
                      <p className="text-gray-900">{submittedListing.ram}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">City:</span>
                      <p className="text-gray-900">{submittedListing.city}</p>
                    </div>
                  </div>

                  {submittedListing.features.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Features:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {submittedListing.features.map((feature, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Description:</h5>
                  <p className="text-gray-900 mb-4">{submittedListing.description}</p>
                  
                  <h5 className="font-medium text-gray-700 mb-2">Seller Contact:</h5>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {submittedListing.seller_name}</p>
                    <p><span className="font-medium">Phone:</span> {submittedListing.seller_phone}</p>
                    <p><span className="font-medium">Email:</span> {submittedListing.seller_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Edit Listing</span>
              </button>
              
              <button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Post Another Ad</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Post Your Phone Ad</h2>
            <p className="text-gray-600">Fill in the details to create your phone listing</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Phone Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phone Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. iPhone 15 Pro, Galaxy S24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 125000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage *</label>
                  <select
                    value={formData.storage}
                    onChange={(e) => handleInputChange('storage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Storage</option>
                    {storageOptions.map(storage => (
                      <option key={storage} value={storage}>{storage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RAM *</label>
                  <select
                    value={formData.ram}
                    onChange={(e) => handleInputChange('ram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select RAM</option>
                    {ramOptions.map(ram => (
                      <option key={ram} value={ram}>{ram}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seller Name</label>
                  <input
                    type="text"
                    value={formData.seller_name}
                    onChange={(e) => handleInputChange('seller_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.seller_phone}
                    onChange={(e) => handleInputChange('seller_phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="03XX XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.seller_email}
                    onChange={(e) => handleInputChange('seller_email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Describe your phone's condition, any accessories included, reason for selling, etc."
                required
              />
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Features (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Posting Ad...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Post My Ad</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};