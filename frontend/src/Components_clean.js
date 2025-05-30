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
              Sign up
            </button>
          </p>
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
            /* Shop Owner Registration - Abbreviated for space */
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Shop Owner Registration</h4>
              <p className="text-gray-600 mb-4">Complete KYC process with business documents</p>
              <form onSubmit={handleShopOwnerSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={shopOwnerData.businessName}
                    onChange={(e) => setShopOwnerData({...shopOwnerData, businessName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    value={shopOwnerData.email}
                    onChange={(e) => setShopOwnerData({...shopOwnerData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={shopOwnerData.password}
                    onChange={(e) => setShopOwnerData({...shopOwnerData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Creating account...' : 'Create Shop Owner Account'}
                </button>
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

// Hero Section Component 
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
          </div>
        </div>
      </div>
    </section>
  );
};

// Simplified placeholder components
export const MobileBottomNav = () => <div></div>;
export const CompareSection = () => <div></div>;
export const SellSection = () => <div></div>;
export const FeaturedShopsSection = () => <div></div>;
export const OurOfferingsSection = () => <div></div>;
export const BrowseSection = () => <div></div>;
export const AccessoriesSection = () => <div></div>;
export const ContentCardsSection = () => <div></div>;
export const FeaturedPhones = () => <div></div>;
export const Footer = () => <div></div>;
export const PriceDropAlertsModal = () => <div></div>;
export const CompareModal = () => <div></div>;

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
                {filteredListings.map((listing, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                            {listing.features.slice(0, 3).map((feature, featureIndex) => (
                              <span key={featureIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
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
