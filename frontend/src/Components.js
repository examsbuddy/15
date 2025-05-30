import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Plus, 
  MessageCircle, 
  Menu, 
  X, 
  User, 
  Smartphone, 
  HardDrive, 
  Star, 
  Camera,
  ChevronRight,
  Bell,
  Search,
  MapPin,
  DollarSign,
  Eye,
  Heart,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  Filter,
  Grid,
  List,
  Clock,
  TrendingUp
} from 'react-feather';

// Profile Dashboard Component
export const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUserListings();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (!userData.email) return;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/listings?seller_email=${userData.email}`);

      if (response.ok) {
        const listings = await response.json();
        setUserListings(listings);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to login to access your profile</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Login
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'shop_owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'shop_owner' ? '🏪 Shop Owner' : '👤 Normal User'}
                  </span>
                </div>
                {user.role === 'shop_owner' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      user.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                      user.verification_status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                      user.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.verification_status === 'approved' && '✅ Verified'}
                      {user.verification_status === 'under_review' && '⏳ Under Review'}
                      {user.verification_status === 'rejected' && '❌ Rejected'}
                      {user.verification_status === 'pending' && '📋 Pending'}
                    </span>
                  </div>
                )}
              </div>

              {user.business_details && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <p className="text-gray-900">{user.business_details.business_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      <p className="text-gray-900">{user.business_details.business_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-gray-900">{user.business_details.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
                      <p className="text-gray-900">{user.business_details.years_in_business} years</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{userListings.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Date(user.created_at).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
              <p className="text-gray-600">Manage your posted advertisements</p>
            </div>
            
            {userListings.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {userListings.map((listing) => (
                  <div key={listing.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {listing.brand} {listing.model}
                        </h4>
                        <p className="text-gray-600">{listing.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-blue-600">
                            PKR {listing.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {listing.city}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {listing.views || 0} views
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          listing.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <User className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h4>
                <p className="text-gray-600">Start selling by posting your first phone listing</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Post Your First Ad
                </button>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your listings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Get text messages for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="pt-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mr-4">
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">Manage your account and listings</p>
            </div>
            {user.role === 'shop_owner' && user.verification_status === 'approved' && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                ✅ Verified Shop Owner
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Home },
              { id: 'listings', name: 'My Listings', icon: Smartphone },
              { id: 'settings', name: 'Settings', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

// Enhanced MyAds Component
export const MyAdsPage = () => {
  const [userListings, setUserListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchUserListings();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchUserListings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (!userData.email) return;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/listings`);

      if (response.ok) {
        const allListings = await response.json();
        // Filter listings by user email
        const myListings = allListings.filter(listing => 
          listing.seller_email === userData.email
        );
        setUserListings(myListings);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to login to view your ads</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-300 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Ads</h1>
          <p className="text-gray-600">Manage your posted advertisements</p>
        </div>

        {userListings.length > 0 ? (
          <div className="space-y-4">
            {userListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {listing.brand} {listing.model}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        listing.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                        listing.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                        listing.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.condition}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{listing.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="text-2xl font-bold text-blue-600">
                        PKR {listing.price.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.city}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {listing.views || 0} views
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {listing.storage && listing.ram && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2">{listing.storage}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{listing.ram}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      listing.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded">
                        <User className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 p-2 hover:bg-gray-50 rounded">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ads posted yet</h3>
            <p className="text-gray-600 mb-8">Start selling by posting your first phone listing</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              Post Your First Ad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Login/Signup Modal Component with Role Selection
export const LoginModal = ({ isOpen, setIsOpen, setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'signup', 'role-select', 'shop-details', 'kyc-upload'
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'normal_user'
  });

  const [businessData, setBusinessData] = useState({
    business_name: '',
    business_type: 'mobile_shop',
    business_address: '',
    city: '',
    postal_code: '',
    business_phone: '',
    website: '',
    description: '',
    years_in_business: 1
  });

  const [kycData, setKycData] = useState({
    cnic_front: '',
    cnic_back: '',
    business_license: '',
    trade_license: ''
  });

  const resetForm = () => {
    setCurrentStep('login');
    setUserRole('');
    setIsLoading(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', phone: '', role: 'normal_user' });
    setBusinessData({
      business_name: '', business_type: 'mobile_shop', business_address: '', city: '', 
      postal_code: '', business_phone: '', website: '', description: '', years_in_business: 1
    });
    setKycData({ cnic_front: '', cnic_back: '', business_license: '', trade_license: '' });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        setIsLoggedIn && setIsLoggedIn(true);
        alert(`Welcome back, ${result.user.name}!`);
        handleClose();
      } else {
        const error = await response.json();
        alert('Login failed: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      if (signupData.role === 'normal_user') {
        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData)
        });

        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('auth_token', result.access_token);
          localStorage.setItem('user_data', JSON.stringify(result.user));
          setIsLoggedIn && setIsLoggedIn(true);
          alert('Account created successfully!');
          handleClose();
        } else {
          const error = await response.json();
          alert('Signup failed: ' + (error.detail || 'Unknown error'));
        }
      } else {
        // Shop owner registration
        const shopOwnerData = {
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone,
          business_details: businessData,
          kyc_documents: kycData
        };

        const response = await fetch(`${backendUrl}/api/auth/register-shop-owner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shopOwnerData)
        });

        if (response.ok) {
          const result = await response.json();
          alert('Shop owner registration submitted! Your account is under review and you will be notified once approved.');
          handleClose();
        } else {
          const error = await response.json();
          alert('Registration failed: ' + (error.detail || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setKycData({...kycData, [field]: e.target.result.split(',')[1]}); // Remove data:image/jpeg;base64, part
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">
              {currentStep === 'login' && 'Login'}
              {currentStep === 'signup' && 'Sign Up'}
              {currentStep === 'role-select' && 'Select Account Type'}
              {currentStep === 'shop-details' && 'Business Details'}
              {currentStep === 'kyc-upload' && 'KYC Documents'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Login Form */}
            {currentStep === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('role-select')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            )}

            {/* Role Selection */}
            {currentStep === 'role-select' && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">Choose your account type to get started:</p>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setUserRole('normal_user');
                      setSignupData({...signupData, role: 'normal_user'});
                      setCurrentStep('signup');
                    }}
                    className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">👤</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Normal User</h3>
                        <p className="text-sm text-gray-600">Buy and sell phones as an individual</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setUserRole('shop_owner');
                      setSignupData({...signupData, role: 'shop_owner'});
                      setCurrentStep('signup');
                    }}
                    className="w-full p-4 border-2 border-gray-200 hover:border-green-500 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">🏪</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Shop Owner</h3>
                        <p className="text-sm text-gray-600">Manage your business with advanced dashboard</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentStep('login')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </div>
            )}

            {/* Basic Signup Form */}
            {currentStep === 'signup' && (
              <form onSubmit={userRole === 'shop_owner' ? (e) => { e.preventDefault(); setCurrentStep('shop-details'); } : handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="03xx-xxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                >
                  {isLoading ? 'Creating Account...' : userRole === 'shop_owner' ? 'Continue' : 'Create Account'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('role-select')}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    ← Back to account types
                  </button>
                </div>
              </form>
            )}

            {/* Business Details Form */}
            {currentStep === 'shop-details' && (
              <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('kyc-upload'); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessData.business_name}
                    onChange={(e) => setBusinessData({...businessData, business_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select
                    value={businessData.business_type}
                    onChange={(e) => setBusinessData({...businessData, business_type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="mobile_shop">Mobile Shop</option>
                    <option value="electronics_store">Electronics Store</option>
                    <option value="repair_service">Repair Service</option>
                    <option value="distributor">Distributor</option>
                    <option value="online_retailer">Online Retailer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea
                    value={businessData.business_address}
                    onChange={(e) => setBusinessData({...businessData, business_address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg h-20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={businessData.city}
                      onChange={(e) => setBusinessData({...businessData, city: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select City</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={businessData.postal_code}
                      onChange={(e) => setBusinessData({...businessData, postal_code: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                  <input
                    type="tel"
                    value={businessData.business_phone}
                    onChange={(e) => setBusinessData({...businessData, business_phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    value={businessData.website}
                    onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                  <input
                    type="number"
                    min="1"
                    value={businessData.years_in_business}
                    onChange={(e) => setBusinessData({...businessData, years_in_business: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                  <textarea
                    value={businessData.description}
                    onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg h-20"
                    placeholder="Describe your business..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('signup')}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* KYC Documents Upload */}
            {currentStep === 'kyc-upload' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Please upload clear images of your documents for verification:</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Front *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cnic_front', e)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Back *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cnic_back', e)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business License (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('business_license', e)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trade License (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('trade_license', e)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Your account will be under review after submission. You'll be notified once approved.
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shop-details')}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !kycData.cnic_front || !kycData.cnic_back}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Post Ad Modal Component
export const PostAdModal = ({ isOpen, setIsOpen }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    condition: '',
    price: '',
    storage: '',
    ram: '',
    city: '',
    description: '',
    seller_name: '',
    seller_phone: '',
    seller_email: '',
    features: []
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      brand: '', model: '', condition: '', price: '', storage: '', ram: '', city: '', description: '', 
      seller_name: '', seller_phone: '', seller_email: '', features: []
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const submitListing = async () => {
    setIsSubmitting(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price)
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('🎉 Your listing has been posted successfully! It will appear on the website instantly.');
        handleClose();
        // Trigger a page refresh to show the new listing
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Failed to post listing: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting listing:', error);
      alert('Failed to post listing. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-lg max-h-96 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Post Your Phone Ad</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select Brand</option>
                      <option value="iPhone">iPhone</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Vivo">Vivo</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Huawei">Huawei</option>
                      <option value="Google">Google</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g., iPhone 15 Pro"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select Condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="150000"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.brand || !formData.model || !formData.condition || !formData.price}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications & Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                    <select
                      value={formData.storage}
                      onChange={(e) => setFormData({...formData, storage: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Storage</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RAM</label>
                    <select
                      value={formData.ram}
                      onChange={(e) => setFormData({...formData, ram: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select RAM</option>
                      <option value="4GB">4GB</option>
                      <option value="6GB">6GB</option>
                      <option value="8GB">8GB</option>
                      <option value="12GB">12GB</option>
                      <option value="16GB">16GB</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                    placeholder="Describe your phone's condition, accessories included, etc."
                    required
                  />
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.city || !formData.description}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.seller_name}
                    onChange={(e) => setFormData({...formData, seller_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.seller_phone}
                    onChange={(e) => setFormData({...formData, seller_phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="03xx-xxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.seller_email}
                    onChange={(e) => setFormData({...formData, seller_email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={submitListing}
                    disabled={isSubmitting || !formData.seller_name || !formData.seller_phone || !formData.seller_email}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Ad'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Mobile Header Component - Simplified to only show logo
export const MobileHeader = () => {
  return (
    <header className="block sm:hidden bg-blue-900 text-white sticky top-0 z-50 safe-area-top">
      <div className="px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="text-xl font-bold">
            PhoneFlip<span className="text-green-400">.PK</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Desktop Header Component
export const DesktopHeader = ({ activeTab, setActiveTab, setIsPostAdOpen }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { id: 'used-phones', label: 'Used Phones' },
    { id: 'new-phones', label: 'New Phones' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'videos', label: 'Videos' },
    { id: 'forums', label: 'Forums' },
    { id: 'blog', label: 'Blog' }
  ];

  return (
    <>
      <header className="hidden sm:block bg-blue-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div 
              className="text-2xl font-bold cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              PhoneFlip<span className="text-green-400">.PK</span>
            </div>
            
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`hover:text-green-400 transition-colors ${
                    activeTab === item.id ? 'text-green-400' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <button className="hover:text-green-400 transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="hover:text-green-400 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setIsPostAdOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Post an Ad
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Login Modal - Now handled in App.js */}
    </>
  );
};

// Bottom Navigation Component - Enhanced with More menu
export const BottomNavigation = ({ activeTab, setActiveTab, setIsPostAdOpen, isLoggedIn, setIsLoginOpen }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSell = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      setIsPostAdOpen && setIsPostAdOpen(true);
    }
  };

  const handleMyAds = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      setActiveTab('my-ads');
    }
  };

  const handleChat = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      setActiveTab('chat');
    }
  };

  const moreMenuItems = [
    { 
      section: 'Account',
      items: [
        { 
          id: 'login', 
          label: isLoggedIn ? 'Profile' : 'Login/Signup', 
          icon: User, 
          action: () => {
            if (isLoggedIn) {
              setActiveTab('profile');
            } else {
              setIsLoginOpen(true);
            }
            setIsMoreOpen(false);
          }
        }
      ]
    },
    {
      section: 'Browse Phones',
      items: [
        { id: 'used-phones', label: 'Used Phones', icon: Smartphone, action: () => { setActiveTab('used-phones'); setIsMoreOpen(false); }},
        { id: 'new-phones', label: 'New Phones', icon: Smartphone, action: () => { setActiveTab('new-phones'); setIsMoreOpen(false); }},
        { id: 'accessories', label: 'Accessories', icon: HardDrive, action: () => { setActiveTab('accessories'); setIsMoreOpen(false); }}
      ]
    },
    {
      section: 'Community',
      items: [
        { id: 'reviews', label: 'Reviews', icon: Star, action: () => { setActiveTab('reviews'); setIsMoreOpen(false); }},
        { id: 'videos', label: 'Videos', icon: Camera, action: () => { setActiveTab('videos'); setIsMoreOpen(false); }},
        { id: 'forums', label: 'Forums', icon: MessageCircle, action: () => { setActiveTab('forums'); setIsMoreOpen(false); }},
        { id: 'blog', label: 'Blog', icon: FileText, action: () => { setActiveTab('blog'); setIsMoreOpen(false); }}
      ]
    }
  ];

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home', 
      action: () => setActiveTab('home') 
    },
    { 
      id: 'my-ads', 
      icon: FileText, 
      label: 'My Ads', 
      action: handleMyAds 
    },
    { 
      id: 'sell', 
      icon: Plus, 
      label: 'Sell', 
      action: handleSell,
      highlighted: true 
    },
    { 
      id: 'chat', 
      icon: MessageCircle, 
      label: 'Chat', 
      action: handleChat 
    },
    { 
      id: 'more', 
      icon: Menu, 
      label: 'More', 
      action: () => setIsMoreOpen(!isMoreOpen) 
    }
  ];

  return (
    <>
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHighlighted = item.highlighted;

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 ${
                  isHighlighted 
                    ? 'bg-red-600 text-white rounded-full mx-2 shadow-lg transform scale-110' 
                    : isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                } transition-all duration-200`}
              >
                <Icon className={`${isHighlighted ? 'w-6 h-6' : 'w-5 h-5'} mb-1`} />
                <span className={`text-xs ${isHighlighted ? 'font-semibold' : 'font-medium'} leading-none`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="fixed bottom-16 left-4 right-4 bg-white rounded-t-2xl z-50 sm:hidden max-h-96 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">More Options</h3>
                  <button
                    onClick={() => setIsMoreOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {moreMenuItems.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        {section.section}
                      </h4>
                      <div className="space-y-2">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={item.action}
                              className="flex items-center w-full px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Icon className="w-5 h-5 text-gray-400 mr-3" />
                              <span className="text-gray-900">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal - Now handled in App.js */}
    </>
  );
};

// Hero Section Component
export const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    brand: '',
    city: '',
    budget: ''
  });

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold mb-6"
          >
            Find Used Mobile Phones in Pakistan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-blue-100"
          >
            Buy & Sell Phones with Confidence
          </motion.p>
        </div>

        {/* Desktop Search */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden sm:block bg-white rounded-lg p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Brand/Model</label>
              <input
                type="text"
                value={searchData.brand}
                onChange={(e) => setSearchData({...searchData, brand: e.target.value})}
                placeholder="e.g., iPhone 15, Samsung Galaxy"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={searchData.city}
                onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All Cities</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={searchData.budget}
                onChange={(e) => setSearchData({...searchData, budget: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any Price</option>
                <option value="0-25000">Under 25,000</option>
                <option value="25000-50000">25,000 - 50,000</option>
                <option value="50000-100000">50,000 - 100,000</option>
                <option value="100000-200000">100,000 - 200,000</option>
                <option value="200000+">Above 200,000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors">
                <Search className="w-5 h-5 inline mr-2" />
                Search Phones
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Advanced Search
            </button>
          </div>
        </motion.div>

        {/* Mobile Search */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="block sm:hidden mx-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="space-y-4">
              <input
                type="text"
                value={searchData.brand}
                onChange={(e) => setSearchData({...searchData, brand: e.target.value})}
                placeholder="Search phones..."
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={searchData.city}
                  onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">All Cities</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
                <select
                  value={searchData.budget}
                  onChange={(e) => setSearchData({...searchData, budget: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">Any Price</option>
                  <option value="0-25000">Under 25K</option>
                  <option value="25000-50000">25K - 50K</option>
                  <option value="50000-100000">50K - 100K</option>
                  <option value="100000+">Above 100K</option>
                </select>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium">
                Search Phones
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Quick Categories Component
export const QuickCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/stats`);
      if (response.ok) {
        const stats = await response.json();
        // Transform backend data to category format
        const transformedCategories = stats.brands.map(brand => ({
          name: brand.name,
          icon: '📱',
          count: `${brand.count}+`
        }));
        
        // Ensure we have at least 6 categories
        while (transformedCategories.length < 6) {
          const staticCategories = getStaticCategories();
          const existingNames = transformedCategories.map(c => c.name);
          const remaining = staticCategories.filter(c => !existingNames.includes(c.name));
          if (remaining.length > 0) {
            transformedCategories.push(remaining[0]);
          } else {
            break;
          }
        }
        
        setCategories(transformedCategories.slice(0, 6));
      } else {
        console.error('Failed to fetch stats');
        setCategories(getStaticCategories());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setCategories(getStaticCategories());
    } finally {
      setLoading(false);
    }
  };

  const getStaticCategories = () => [
    { name: 'iPhone', icon: '📱', count: '1,200+' },
    { name: 'Samsung', icon: '📱', count: '800+' },
    { name: 'Xiaomi', icon: '📱', count: '600+' },
    { name: 'Oppo', icon: '📱', count: '400+' },
    { name: 'Vivo', icon: '📱', count: '350+' },
    { name: 'OnePlus', icon: '📱', count: '200+' }
  ];

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Browse by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg text-center animate-pulse">
                <div className="text-3xl mb-2">📱</div>
                <div className="h-4 bg-gray-300 rounded mb-2 mx-auto w-16"></div>
                <div className="h-3 bg-gray-300 rounded mx-auto w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Browse by Brand</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg text-center cursor-pointer transition-colors"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Featured Phones Component
export const FeaturedPhones = () => {
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPhones();
  }, []);

  const fetchFeaturedPhones = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/listings/featured?limit=4`);
      if (response.ok) {
        const listings = await response.json();
        // Transform backend data to component format
        const transformedPhones = listings.map(listing => ({
          id: listing.id,
          title: `${listing.brand} ${listing.model}`,
          price: `PKR ${listing.price.toLocaleString()}`,
          condition: listing.condition,
          location: listing.city,
          image: getPhoneImage(listing.brand),
          specs: `${listing.storage || 'N/A'}, ${listing.ram || 'N/A'}`,
          timeAgo: getTimeAgo(listing.created_at)
        }));
        setFeaturedPhones(transformedPhones);
      } else {
        console.error('Failed to fetch featured phones');
        // Fallback to static data if API fails
        setFeaturedPhones(getStaticPhones());
      }
    } catch (error) {
      console.error('Error fetching featured phones:', error);
      // Fallback to static data if API fails
      setFeaturedPhones(getStaticPhones());
    } finally {
      setLoading(false);
    }
  };

  const getPhoneImage = (brand) => {
    const imageMap = {
      'iPhone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      'Samsung': 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a?w=300',
      'Xiaomi': 'https://images.unsplash.com/photo-1575719362347-a70b129740e0?w=300',
      'OnePlus': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      'Oppo': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      'Vivo': 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a?w=300',
      'Huawei': 'https://images.unsplash.com/photo-1575719362347-a70b129740e0?w=300',
      'Google': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300'
    };
    return imageMap[brand] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getStaticPhones = () => [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      price: 'PKR 185,000',
      condition: 'Excellent',
      location: 'Karachi',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      specs: '256GB, Natural Titanium',
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra',
      price: 'PKR 150,000',
      condition: 'Good',
      location: 'Lahore',
      image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a?w=300',
      specs: '512GB, Titanium Gray',
      timeAgo: '5 hours ago'
    },
    {
      id: 3,
      title: 'OnePlus 12',
      price: 'PKR 75,000',
      condition: 'Excellent',
      location: 'Islamabad',
      image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0?w=300',
      specs: '256GB, Flowy Emerald',
      timeAgo: '1 day ago'
    },
    {
      id: 4,
      title: 'Xiaomi 14 Ultra',
      price: 'PKR 95,000',
      condition: 'Good',
      location: 'Rawalpindi',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      specs: '512GB, White',
      timeAgo: '2 days ago'
    }
  ];

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Phones</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Phones</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPhones.map((phone, index) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={phone.image} 
                  alt={phone.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {phone.condition}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{phone.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{phone.specs}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-blue-600">{phone.price}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {phone.location}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{phone.timeAgo}</span>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>125</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {featuredPhones.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured phones available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to post a listing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Selling Section Component
export const SellingSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sell Your Phone on PhoneFlip and Get the Best Price
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Your Ad */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blue-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Post your Ad</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Post your Ad for Free in 3 Easy Steps</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Get Genuine offers from Verified Buyers</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Sell your phone Fast and Safe</span>
              </li>
            </ul>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium w-full">
              Post Your Ad
            </button>
          </motion.div>

          {/* Try PhoneFlip Sell It For Me */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Try PhoneFlip Sell It For Me</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Dedicated Sales Expert to Sell your Phone</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>We Bargain for you and share the Best Offer</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>We ensure Safe & Secure Transaction</span>
              </li>
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium w-full">
              Book Phone Inspection
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              PhoneFlip<span className="text-green-400">.PK</span>
            </div>
            <p className="text-gray-400 mb-4">
              Pakistan's largest mobile phone marketplace. Buy and sell phones with confidence.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                <Phone className="w-4 h-4" />
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition-colors">Used Phones</button></li>
              <li><button className="hover:text-white transition-colors">New Phones</button></li>
              <li><button className="hover:text-white transition-colors">Accessories</button></li>
              <li><button className="hover:text-white transition-colors">Sell Your Phone</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition-colors">Help Center</button></li>
              <li><button className="hover:text-white transition-colors">Safety Tips</button></li>
              <li><button className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button className="hover:text-white transition-colors">Report Issue</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Download App</h3>
            <p className="text-gray-400 mb-4">Get the best experience on mobile</p>
            <div className="space-y-2">
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded w-full text-left">
                📱 Download for iOS
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded w-full text-left">
                🤖 Download for Android
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PhoneFlip.PK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Mobile Menu Component (keeping original for compatibility)
export const MobileMenu = ({ isOpen, setIsOpen, setActiveTab, setIsPostAdOpen }) => {
  return null; // Not needed anymore with new bottom navigation
};

// Reviews Page Component
export const ReviewsPage = () => {
  const phoneReviews = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max Review',
      author: 'Tech Expert',
      rating: 4.5,
      publishDate: '2 days ago',
      excerpt: 'The iPhone 15 Pro Max delivers exceptional performance with its A17 Pro chip and impressive camera system.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra Review',
      author: 'Mobile Reviewer',
      rating: 4.7,
      publishDate: '1 week ago',
      excerpt: 'Samsung continues to push boundaries with the S24 Ultra, featuring enhanced AI capabilities and superior S Pen functionality.',
      image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'OnePlus 12 Review',
      author: 'PhoneFlip Team',
      rating: 4.3,
      publishDate: '2 weeks ago',
      excerpt: 'OnePlus returns to its flagship roots with improved build quality and camera performance.',
      image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="pt-20 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Phone Reviews</h1>
          <p className="text-lg text-gray-600">Expert reviews and detailed analysis of the latest mobile phones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {phoneReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img 
                src={review.image} 
                alt={review.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{review.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{review.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {review.author}</span>
                  <span>{review.publishDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Videos Page Component
export const VideosPage = () => {
  const phoneVideos = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max Unboxing & First Impressions',
      channel: 'PhoneFlip TV',
      views: '125K views',
      publishDate: '3 days ago',
      duration: '12:45',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra Camera Test',
      channel: 'Tech Reviews PK',
      views: '89K views',
      publishDate: '1 week ago',
      duration: '15:30',
      thumbnail: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Best Budget Phones in Pakistan 2024',
      channel: 'PhoneFlip Guide',
      views: '200K views',
      publishDate: '2 weeks ago',
      duration: '18:22',
      thumbnail: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="pt-20 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Phone Videos</h1>
          <p className="text-lg text-gray-600">Watch reviews, unboxings, and tutorials</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {phoneVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{video.channel}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{video.views}</span>
                  <span className="mx-2">•</span>
                  <span>{video.publishDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedVideo(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg w-full max-w-4xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-b-lg"
                    ></iframe>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Forums Page Component
export const ForumsPage = () => {
  const forumTopics = [
    {
      id: 1,
      title: 'iPhone vs Samsung: Which is better in 2024?',
      author: 'TechLover123',
      replies: 45,
      lastActivity: '2 hours ago',
      category: 'General Discussion',
      isHot: true
    },
    {
      id: 2,
      title: 'Best budget phones under 50,000 PKR',
      author: 'BudgetHunter',
      replies: 23,
      lastActivity: '5 hours ago',
      category: 'Buying Guide'
    },
    {
      id: 3,
      title: 'How to check if a used phone is original?',
      author: 'SafeBuyer',
      replies: 67,
      lastActivity: '1 day ago',
      category: 'Safety Tips',
      isPinned: true
    },
    {
      id: 4,
      title: 'Gaming performance comparison: Snapdragon vs MediaTek',
      author: 'MobileGamer',
      replies: 34,
      lastActivity: '2 days ago',
      category: 'Performance'
    }
  ];

  return (
    <div className="pt-20 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Community Forums</h1>
          <p className="text-lg text-gray-600">Join discussions with fellow phone enthusiasts</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Recent Discussions</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Start New Topic
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {forumTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {topic.isPinned && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Pinned</span>
                      )}
                      {topic.isHot && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Hot</span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{topic.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {topic.author}</span>
                      <span>•</span>
                      <span>{topic.replies} replies</span>
                      <span>•</span>
                      <span>Last activity {topic.lastActivity}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Page Component
export const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Sell Your Phone Quickly: 10 Expert Tips',
      excerpt: 'Learn the secrets to selling your phone fast and getting the best price in the Pakistani market.',
      author: 'PhoneFlip Editorial',
      publishDate: 'March 15, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      category: 'Selling Guide'
    },
    {
      id: 2,
      title: 'Phone Market Trends in Pakistan 2024',
      excerpt: 'Discover the latest trends shaping the Pakistani mobile phone market and what to expect.',
      author: 'Market Analyst',
      publishDate: 'March 12, 2024',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a',
      category: 'Market News'
    },
    {
      id: 3,
      title: 'Avoiding Scams When Buying Used Phones',
      excerpt: 'Essential safety tips to protect yourself from fraud when purchasing second-hand mobile phones.',
      author: 'Security Expert',
      publishDate: 'March 10, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0',
      category: 'Safety Tips'
    }
  ];

  return (
    <div className="pt-20 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">PhoneFlip Blog</h1>
          <p className="text-lg text-gray-600">Insights, tips, and news about the mobile phone market</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span>{post.publishDate}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};