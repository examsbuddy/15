import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdvancedSearchModal } from './AdvancedSearch';
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
  Camera,
  Heart,
  Share,
  Eye,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  BarChart2,
  AlertCircle,
  Check,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Zap,
  ShoppingBag,
  Video,
  FileText,
  Share2,
  Users,
  Award,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Sliders,
  Battery,
  Play,
  Filter
} from 'lucide-react';

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

export const ProfilePage = ({ user, setCurrentPage, onLogout }) => {
  const [analytics, setAnalytics] = useState({
    profileViews: 247,
    totalSales: 8,
    activeListings: 12,
    revenue: 145000,
    inquiries: 34
  });
  const [savedSearches, setSavedSearches] = useState([
    'iPhone 15 Pro under 200K',
    'Samsung Galaxy S24',
    'OnePlus 12 Karachi'
  ]);
  const [activeListings, setActiveListings] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user's active listings
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listings/recent?limit=6`);
        setActiveListings(response.data);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  // Analytics data for horizontal scroll
  const analyticsData = [
    { icon: Eye, label: 'Profile Views', value: analytics.profileViews, color: 'blue' },
    { icon: BarChart2, label: 'Total Sales', value: analytics.totalSales, color: 'green' },
    { icon: List, label: 'Active Ads', value: analytics.activeListings, color: 'purple' },
    { icon: TrendingDown, label: 'Revenue', value: `₨${(analytics.revenue/1000).toFixed(0)}K`, color: 'orange' },
    { icon: MessageCircle, label: 'Inquiries', value: analytics.inquiries, color: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name || 'John Doe'}</h1>
            <p className="text-blue-100 text-sm">{user?.email || 'john@phoneflip.pk'}</p>
            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-1">
              {user?.role === 'shop_owner' ? 'Verified Seller' : 'Active Member'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Analytics Bar - Horizontal Scroll */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Live Analytics</h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {analyticsData.map((metric, index) => {
            const IconComponent = metric.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
              pink: 'bg-pink-100 text-pink-600'
            };
            
            return (
              <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 min-w-[100px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${colorClasses[metric.color]}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Saved Searches */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Searches</h2>
          <div className="space-y-2">
            {savedSearches.map((search, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </div>
                <button 
                  onClick={() => {
                    // Remove saved search
                    setSavedSearches(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Post New Ad Button */}
        <button 
          onClick={() => setCurrentPage('post-ad')}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
        >
          <Plus className="w-6 h-6" />
          <span>Post New Ad</span>
        </button>

        {/* Active Listings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">My Active Listings</h2>
            <span className="text-sm text-gray-600">{activeListings.length} ads</span>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {activeListings.map((listing, index) => (
                <div 
                  key={listing._id || index}
                  onClick={() => setCurrentPage('listing-details')}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="h-24 relative">
                    <img
                      src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : '/api/placeholder/200/150'}
                      alt={`${listing.brand} ${listing.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      Active
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900 text-xs truncate">{listing.brand} {listing.model}</h3>
                    <p className="text-sm font-bold text-green-600">₨ {listing.price?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{listing.city}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Account Settings</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
          </button>

          {showSettings && (
            <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Update Profile Picture</div>
                    <div className="text-sm text-gray-600">Change your avatar</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Change Password</div>
                    <div className="text-sm text-gray-600">Update security credentials</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Notification Preferences</div>
                    <div className="text-sm text-gray-600">Manage alerts and emails</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Privacy Settings</div>
                    <div className="text-sm text-gray-600">Control who sees your info</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Button - At the very bottom */}
      <div className="px-4 pb-8">
        <button 
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center space-x-3"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Detailed Listing Page Component
export const DetailedListingPage = ({ listingId, setCurrentPage, onBack }) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchListingDetails();
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/listings/${listingId}`);
      const data = await response.json();
      
      if (response.ok) {
        setListing(data);
      } else {
        setError(data.detail || 'Failed to load listing details');
      }
    } catch (error) {
      console.error('Error fetching listing details:', error);
      setError('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${listing.brand} ${listing.model}`,
        text: `Check out this ${listing.brand} ${listing.model} for ₨${listing.price.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleContactSeller = () => {
    const message = `Hi! I'm interested in your ${listing.brand} ${listing.model} listed for ₨${listing.price.toLocaleString()}. Is it still available?`;
    const whatsappUrl = `https://wa.me/${listing.seller_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallSeller = () => {
    window.location.href = `tel:${listing.seller_phone}`;
  };

  const handleEmailSeller = () => {
    const subject = `Inquiry about ${listing.brand} ${listing.model}`;
    const body = `Hi ${listing.seller_name},\n\nI'm interested in your ${listing.brand} ${listing.model} listed for ₨${listing.price.toLocaleString()}. Could you please provide more details?\n\nThanks!`;
    window.location.href = `mailto:${listing.seller_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading listing details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Listing</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h3>
            <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Search</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photos Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Main Photo */}
              <div className="relative aspect-square bg-gray-100">
                {listing.photos && listing.photos.length > 0 ? (
                  <>
                    <img 
                      src={listing.photos[currentPhotoIndex]} 
                      alt={`${listing.brand} ${listing.model}`}
                      className="w-full h-full object-cover"
                    />
                    {listing.photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : listing.photos.length - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                          onClick={() => setCurrentPhotoIndex(prev => prev < listing.photos.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Smartphone className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Photo Thumbnails */}
              {listing.photos && listing.photos.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-6 gap-2">
                    {listing.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          currentPhotoIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={photo} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Price & Basic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {listing.brand} {listing.model}
                </h1>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₨{listing.price.toLocaleString()}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  listing.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                  listing.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                  listing.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {listing.condition}
                </span>
              </div>

              <div className="space-y-4">
                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCallSeller}
                    className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call</span>
                  </button>
                  
                  <button
                    onClick={handleContactSeller}
                    className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
                
                <button
                  onClick={handleEmailSeller}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Seller</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Listing</span>
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">{listing.storage}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">RAM</span>
                  <span className="font-medium">{listing.ram}</span>
                </div>
                {listing.battery && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Battery</span>
                    <span className="font-medium">{listing.battery}</span>
                  </div>
                )}
                {listing.screen_size && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Screen Size</span>
                    <span className="font-medium">{listing.screen_size}</span>
                  </div>
                )}
                {listing.camera && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Camera</span>
                    <span className="font-medium">{listing.camera}</span>
                  </div>
                )}
                {listing.processor && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Processor</span>
                    <span className="font-medium">{listing.processor}</span>
                  </div>
                )}
                {listing.operating_system && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">OS</span>
                    <span className="font-medium">{listing.operating_system}</span>
                  </div>
                )}
                {listing.network && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Network</span>
                    <span className="font-medium">{listing.network}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{listing.seller_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{listing.city}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{listing.seller_phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{listing.seller_email}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                {listing.purchase_year && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Purchase Year</span>
                    <span className="font-medium">{listing.purchase_year}</span>
                  </div>
                )}
                {listing.warranty_months && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">{listing.warranty_months} months</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Box Included</span>
                  <span className="font-medium">{listing.box_included ? 'Yes' : 'No'}</span>
                </div>
                {listing.accessories_included && listing.accessories_included.length > 0 && (
                  <div className="py-2">
                    <span className="text-gray-600 block mb-2">Accessories Included:</span>
                    <div className="flex flex-wrap gap-2">
                      {listing.accessories_included.map((accessory, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {accessory}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{listing.views}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Listed On</span>
                  <span className="font-medium">{formatDate(listing.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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
        // Handle both string and object error responses
        let errorMessage = 'Registration failed';
        if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => err.msg || err).join(', ');
          } else {
            errorMessage = JSON.stringify(data.detail);
          }
        }
        setError(errorMessage);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Robust error handling utility
  const handleApiError = (error, defaultMessage = 'An unexpected error occurred') => {
    console.error('API Error:', error);
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object') {
      // Handle FastAPI validation errors
      if (error.detail) {
        if (typeof error.detail === 'string') {
          return error.detail;
        }
        if (Array.isArray(error.detail)) {
          return error.detail.map(err => {
            if (typeof err === 'string') return err;
            if (err && typeof err === 'object') {
              return err.msg || err.message || JSON.stringify(err);
            }
            return 'Validation error';
          }).join(', ');
        }
        if (typeof error.detail === 'object') {
          return JSON.stringify(error.detail);
        }
      }
      
      // Handle other error formats
      if (error.message) {
        return error.message;
      }
      
      // Last resort - stringify the object
      try {
        return JSON.stringify(error);
      } catch (e) {
        return defaultMessage;
      }
    }
    
    return defaultMessage;
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

  const handleShopOwnerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Input validation
      if (shopOwnerData.password !== shopOwnerData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Required field validation
      const requiredFields = ['name', 'email', 'password', 'phone', 'city', 'businessName', 'businessAddress', 'businessType', 'yearsInBusiness', 'cnicNumber'];
      const missingFields = requiredFields.filter(field => !shopOwnerData[field] || shopOwnerData[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const formData = new FormData();
      
      // Add text fields with validation
      Object.keys(shopOwnerData).forEach(key => {
        if (key !== 'confirmPassword' && shopOwnerData[key] !== null && shopOwnerData[key] !== '') {
          // Handle file fields safely
          if (['businessLicense', 'cnicFront', 'cnicBack'].includes(key)) {
            if (shopOwnerData[key] && shopOwnerData[key] instanceof File) {
              formData.append(key, shopOwnerData[key]);
            }
          } else {
            // Handle text fields
            formData.append(key, shopOwnerData[key].toString().trim());
          }
        }
      });

      // Make API request with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://7fba1fff-480b-41fa-bbbb-d7195a75c4fe.preview.emergentagent.com';
        const response = await fetch(`${backendUrl}/api/auth/register-shop-owner`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          throw new Error('Invalid response from server');
        }

        if (response.ok) {
          // Success handling
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
          }
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            onSignup(data.user);
          }
          onClose();
          resetForms();
        } else {
          // Error response handling
          const errorMessage = handleApiError(data, `Registration failed (${response.status})`);
          throw new Error(errorMessage);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout. Please check your internet connection and try again.');
        }
        
        if (fetchError.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Shop owner registration error:', error);
      const errorMessage = handleApiError(error, 'Registration failed. Please try again.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (fieldName, file) => {
    // Only update if file is defined
    if (file) {
      setShopOwnerData(prev => ({ ...prev, [fieldName]: file }));
    }
    // Reset loading and error states to ensure button remains responsive
    setIsLoading(false);
    setError('');
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
                      onClick={() => {
                        setError(''); // Clear any previous errors
                        setCurrentStep(currentStep + 1);
                      }}
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
  onCompareClick,
  showSignInModal,
  setShowSignInModal,
  showSignUpModal,
  setShowSignUpModal
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
                <div className="text-xl font-bold text-white tracking-tight">
                  PhoneFlip<span className="text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text font-black">.PK</span>
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
              {/* Post an Ad Button - Red Highlighted - Hidden on Mobile */}
              <button
                onClick={handlePostAd}
                className="hidden md:flex bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                      {user?.role === 'shop_owner' && (
                        <button
                          onClick={() => {
                            setCurrentPage('dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <BarChart2 className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      )}
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
                className="md:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800 transition-all duration-200"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-blue-800 bg-blue-900">
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
    </>
  );
};

// Hero Section Component with Auto-suggest
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-suggest data
  const autoSuggestData = {
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'],
    models: [
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14',
      'Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Galaxy A54', 'Galaxy Note',
      'Xiaomi 13 Pro', 'Redmi Note 13 Pro', 'Mi 11', 'Poco X6',
      'OnePlus 12', 'OnePlus 11', 'Nord CE', 'Oppo Reno 11 Pro',
      'Vivo V30 Pro', 'Pixel 8 Pro'
    ],
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
  };

  // Fuzzy matching function
  const fuzzyMatch = (query, items) => {
    const lowerQuery = query.toLowerCase();
    
    // Handle common misspellings
    const correctedQuery = lowerQuery
      .replace(/iphne|ifone|iphon/g, 'iphone')
      .replace(/samung|samsng/g, 'samsung')
      .replace(/xiomi|xaomi/g, 'xiaomi')
      .replace(/huwei|hauwei/g, 'huawei');
    
    return items.filter(item => {
      const lowerItem = item.toLowerCase();
      // Exact match
      if (lowerItem.includes(correctedQuery)) return true;
      
      // Character similarity (allow 1-2 character differences)
      const distance = levenshteinDistance(correctedQuery, lowerItem);
      return distance <= 2 && correctedQuery.length > 2;
    });
  };

  // Simple Levenshtein distance implementation
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Generate suggestions based on query
  const generateSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const allSuggestions = [];
    
    // Brand suggestions
    const brandMatches = fuzzyMatch(query, autoSuggestData.brands);
    brandMatches.forEach(brand => {
      allSuggestions.push({ type: 'brand', value: brand, display: brand });
    });

    // Model suggestions
    const modelMatches = fuzzyMatch(query, autoSuggestData.models);
    modelMatches.forEach(model => {
      allSuggestions.push({ type: 'model', value: model, display: model });
    });

    // City suggestions
    const cityMatches = fuzzyMatch(query, autoSuggestData.cities);
    cityMatches.forEach(city => {
      allSuggestions.push({ type: 'city', value: city, display: `in ${city}` });
    });

    // Limit to top 6 suggestions
    setSuggestions(allSuggestions.slice(0, 6));
  };

  const handleInputChange = (value) => {
    setSearchFilters({ ...searchFilters, query: value });
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'city') {
      setSearchFilters({ ...searchFilters, query: '', city: suggestion.value });
    } else {
      setSearchFilters({ ...searchFilters, query: suggestion.value });
    }
    setShowSuggestions(false);
    // Trigger search immediately
    if (onSearch) {
      onSearch({ 
        ...searchFilters, 
        query: suggestion.type === 'city' ? '' : suggestion.value,
        city: suggestion.type === 'city' ? suggestion.value : searchFilters.city
      });
    }
  };

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
      className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white py-16 md:py-32 lg:py-40 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url('https://images.unsplash.com/photo-1562575214-da9fcf59b907')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-400 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="text-center mb-8 md:mb-16">
          {/* Main Headline - Enhanced and Bigger */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 leading-tight">
              <span className="block text-white">Where Pakistan</span>
              <span className="block text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text">
                Buys, Sells & Talks
              </span>
              <span className="block text-white">Phones</span>
            </h1>
            
            {/* Subtitle - More Impactful */}
            <div className="space-y-2 md:space-y-3">
              <p className="text-lg md:text-2xl lg:text-3xl text-blue-100 font-medium">
                🇵🇰 Pakistan's #1 Mobile Phone Marketplace
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar - Bigger and More Modern */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 max-w-5xl mx-auto border border-white/20">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
              {/* Main Search Input */}
              <div className="flex-1 relative">
                <Smartphone className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search phones, brands, or models... (e.g. iPhone 15, Samsung Galaxy)"
                  onClick={() => onSearch && onSearch('dedicated-search')}
                  readOnly
                  className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-6 rounded-xl md:rounded-2xl text-base md:text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 bg-white hover:bg-blue-50/30 transition-all duration-200 cursor-pointer font-medium shadow-inner"
                />
              </div>

              {/* Enhanced Search Button */}
              <button 
                onClick={() => onSearch && onSearch('dedicated-search')}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
                <span>Find Phones</span>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-600">50,000+</div>
                <div className="text-xs md:text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-green-600">100,000+</div>
                <div className="text-xs md:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-purple-600">1,000+</div>
                <div className="text-xs md:text-sm text-gray-600">Verified Sellers</div>
              </div>
            </div>
          </div>
          
          {/* Recent Searches Section - Hidden */}
          {/* <RecentSearchesHomepage onSearch={onSearch} /> */}
        </div>
      </div>
    </section>
  );
};

// Recent Searches for Homepage
export const RecentSearchesHomepage = ({ onSearch }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'iPhone 13', 'Samsung Galaxy', 'Under ₨80,000', 'Karachi phones', 'Xiaomi latest'
  ]);

  useEffect(() => {
    // Pre-load from cache immediately
    const savedSearches = localStorage.getItem('phoneflip_recent_searches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        setRecentSearches(parsed.slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const handleRecentSearch = (searchTerm) => {
    if (onSearch) {
      onSearch('dedicated-search', { query: searchTerm });
    }
  };

  // Don't render anything if no searches and no popular fallback needed
  if (recentSearches.length === 0 && popularSearches.length === 0) {
    return null;
  }

  const displaySearches = recentSearches.length > 0 ? recentSearches : popularSearches;
  const sectionTitle = recentSearches.length > 0 ? 'Recent Searches' : 'Popular Near You';

  return (
    <div className="max-w-4xl mx-auto mt-1 px-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-2 border border-white/40">
        <h3 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
          <Clock className="w-3 h-3 mr-1 text-gray-400" />
          {sectionTitle}
        </h3>
        <div className="flex gap-1">
          {displaySearches.slice(0, 3).map((search, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearch(search)}
              className="bg-blue-50/80 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium transition-colors border border-blue-100 hover:border-blue-200 flex-1 truncate"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simplified placeholder components
export const MobileBottomNav = ({ currentPage, setCurrentPage, isLoggedIn, compareCount, onCompareClick }) => {
  const handleNavigation = (key) => {
    console.log('Navigation clicked:', key);
    console.log('Current page:', currentPage);
    console.log('setCurrentPage function:', typeof setCurrentPage);
    
    if (key === 'compare') {
      console.log('Compare button clicked, compareCount:', compareCount);
      // Handle compare functionality
      if (compareCount > 0) {
        console.log('Opening compare modal');
        onCompareClick();
      } else {
        console.log('No items to compare');
      }
      return;
    }
    
    // Regular navigation for all other buttons
    console.log('Setting current page to:', key);
    setCurrentPage(key);
  };

  const menuItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'dedicated-search', label: 'Search', icon: Search },
    { key: 'post-ad', label: 'Post Ad', icon: Plus },
    { key: 'compare', label: 'Compare', icon: BarChart2, badge: compareCount },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="grid grid-cols-5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.key === 'compare' ? compareCount > 0 : currentPage === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={`relative flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5 mb-1" />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

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

export const RecentListingsSection = ({ onViewListing }) => {
  const [recentListings, setRecentListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listings/recent?limit=8`);
      setRecentListings(response.data);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <section className="bg-gray-50 py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Recent Listings
            </h2>
            <p className="text-gray-600">
              Latest phones added to our marketplace
            </p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => {
                const container = document.getElementById('recent-listings-scroll');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('recent-listings-scroll');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div 
            id="recent-listings-scroll"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentListings.map((listing, index) => (
              <div 
                key={listing._id || index} 
                onClick={() => onViewListing(listing._id)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0 w-[280px]"
              >
                {/* Image Section */}
                <div className="h-48 relative">
                  <img
                    src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : '/api/placeholder/300/200'}
                    alt={`${listing.brand} ${listing.model}`}
                    className="w-full h-full object-cover"
                  />
                  {/* New Badge */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    🆕 New
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {listing.brand} {listing.model}
                      </h3>
                      <p className="text-lg font-bold text-green-600">
                        ₨ {listing.price?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                      listing.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.condition}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                    <div>Storage: {listing.storage}</div>
                    <div>RAM: {listing.ram}</div>
                    <div>City: {listing.city}</div>
                    <div>Views: {listing.views}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to compare functionality if needed
                      }}
                      className="px-3 py-1 rounded text-xs font-medium transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      Compare
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewListing(listing._id);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* See All Phones card - fixed on the right */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0 w-[280px] h-[340px] flex items-center justify-center text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">See All Listings</h3>
                <p className="text-blue-100 text-sm">Browse all available phones</p>
              </div>
            </div>
          </div>
          
          {/* Mobile swipe indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <span className="ml-2">Swipe to browse</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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

          {/* Sell to PhoneFlip */}
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

export const FeaturedShopsSection = () => {
  const featuredShops = [
    {
      name: 'TechMart Karachi',
      location: 'Saddar, Karachi',
      rating: 4.8,
      reviews: 1250,
      specialties: ['iPhone', 'Samsung', 'Accessories'],
      yearsInBusiness: 8,
      phoneCount: 450
    },
    {
      name: 'Mobile Zone Lahore',
      location: 'Liberty Market, Lahore',
      rating: 4.7,
      reviews: 980,
      specialties: ['All Brands', 'Repair', 'Trade-in'],
      yearsInBusiness: 12,
      phoneCount: 680
    },
    {
      name: 'Galaxy Electronics',
      location: 'Blue Area, Islamabad',
      rating: 4.9,
      reviews: 750,
      specialties: ['Premium Phones', 'Warranty'],
      yearsInBusiness: 6,
      phoneCount: 320
    }
  ];

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Phone Shops
            </h2>
            <p className="text-gray-600">
              Browse phones from verified shops with excellent ratings and genuine products
            </p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => {
                const container = document.getElementById('shops-scroll');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('shops-scroll');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div 
            id="shops-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredShops.map((shop, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex-shrink-0 w-[320px]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {shop.location}
                    </p>
                  </div>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-800 text-sm font-medium">{shop.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reviews:</span>
                    <span className="font-medium">{shop.reviews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Years in Business:</span>
                    <span className="font-medium">{shop.yearsInBusiness} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phones Available:</span>
                    <span className="font-medium">{shop.phoneCount}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.specialties.map((specialty, specialtyIndex) => (
                      <span key={specialtyIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Shop
                </button>
              </div>
            ))}
            
            {/* See All Shops card - fixed on the right */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex-shrink-0 w-[320px] h-[300px] flex items-center justify-center text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">See All Shops</h3>
                <p className="text-purple-100 text-sm">Browse verified sellers</p>
              </div>
            </div>
          </div>
          
          {/* Mobile swipe indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <span className="ml-2">Swipe to browse</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const OurOfferingsSection = ({ onCompareClick, onPriceAlertsClick }) => {
  const offerings = [
    {
      icon: BarChart2,
      title: 'Compare Phones',
      description: 'Compare specifications, prices, and features side by side',
      action: 'Start Comparing',
      onClick: onCompareClick
    },
    {
      icon: Shield,
      title: 'Condition Check',
      description: 'AI-powered condition assessment for accurate pricing',
      action: 'Check Condition',
      onClick: () => {}
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when your desired phone drops in price',
      action: 'Set Alert',
      onClick: onPriceAlertsClick
    },
    {
      icon: Star,
      title: 'Expert Reviews',
      description: 'Read detailed reviews from phone experts and users',
      action: 'Read Reviews',
      onClick: () => {}
    }
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Offerings
            </h2>
            <p className="text-gray-600">
              Everything you need to buy or sell phones with confidence
            </p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => {
                const container = document.getElementById('offerings-scroll');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('offerings-scroll');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div 
            id="offerings-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {offerings.map((offering, index) => {
              const IconComponent = offering.icon;
              return (
                <div key={index} className="text-center group hover:bg-gray-50 p-6 rounded-xl transition-colors flex-shrink-0 w-[250px]">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{offering.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{offering.description}</p>
                  <button 
                    onClick={offering.onClick}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    {offering.action} →
                  </button>
                </div>
              );
            })}
            
            {/* See All Deals card - fixed on the right */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex-shrink-0 w-[250px] h-[240px] flex items-center justify-center text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">See All Deals</h3>
                <p className="text-green-100 text-sm">Explore more offers</p>
              </div>
            </div>
          </div>
          
          {/* Mobile swipe indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <span className="ml-2">Swipe to browse</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BrowseSection = () => {
  const categories = {
    'By Category': ['Used Phones', 'New Phones', 'Accessories', 'Tablets'],
    'By City': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
    'By Brand': ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus'],
    'By Model': ['iPhone 15', 'Galaxy S24', 'Xiaomi 14', 'Find X7'],
    'By Budget': ['Under 50K', '50K-100K', '100K-200K', '200K+'],
    'By Storage': ['64GB', '128GB', '256GB', '512GB', '1TB']
  };

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Browse Phones
          </h2>
          <p className="text-gray-600">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categories).map(([categoryName, items]) => (
            <div key={categoryName} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{categoryName}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AccessoriesSection = () => {
  const accessories = [
    { name: 'Phone Cases', count: 1250, image: '📱' },
    { name: 'Screen Protectors', count: 890, image: '🛡️' },
    { name: 'Chargers', count: 650, image: '🔌' },
    { name: 'Power Banks', count: 420, image: '🔋' },
    { name: 'Headphones', count: 780, image: '🎧' },
    { name: 'Car Accessories', count: 340, image: '🚗' }
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Phone Accessories
          </h2>
          <p className="text-gray-600">
            Complete your phone setup with quality accessories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {accessories.map((accessory, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="bg-gray-100 rounded-xl p-6 mb-3 group-hover:bg-gray-200 transition-colors">
                <div className="text-4xl mb-2">{accessory.image}</div>
                <h3 className="font-medium text-gray-900 text-sm">{accessory.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{accessory.count} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContentCardsSection = () => {
  const contentCards = [
    {
      type: 'Blog',
      title: 'iPhone 15 vs iPhone 14: Complete Comparison Guide',
      excerpt: 'Everything you need to know about the differences between iPhone 15 and iPhone 14...',
      image: '📱',
      readTime: '5 min read',
      date: '2 days ago'
    },
    {
      type: 'Video',
      title: 'How to Check if a Used Phone is Original',
      excerpt: 'Learn the essential tips to verify authenticity when buying used phones...',
      image: '🎥',
      readTime: '8 min watch',
      date: '1 week ago'
    },
    {
      type: 'News',
      title: 'Samsung Galaxy S25 Launch Date Revealed',
      excerpt: 'Latest updates on Samsung\'s upcoming flagship phone and expected features...',
      image: '📰',
      readTime: '3 min read',
      date: '3 days ago'
    }
  ];

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Content
          </h2>
          <p className="text-gray-600">
            Stay updated with the latest phone news, reviews, and buying guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contentCards.map((card, index) => (
            <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {card.type}
                  </span>
                  <span className="text-gray-500 text-xs">{card.date}</span>
                </div>
                
                <div className="text-4xl mb-4">{card.image}</div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {card.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{card.readTime}</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturedPhones = ({ addToCompare, compareList, onViewListing }) => {
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPhones();
  }, []);

  const fetchFeaturedPhones = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      console.log('Fetching featured phones from:', `${backendUrl}/api/listings/featured`);
      
      const response = await fetch(`${backendUrl}/api/listings/featured`);
      console.log('Featured phones response status:', response.status);
      
      const data = await response.json();
      console.log('Featured phones data:', data);
      
      if (response.ok) {
        setFeaturedPhones(data);
      } else {
        console.error('Failed to fetch featured phones:', data);
      }
    } catch (error) {
      console.error('Error fetching featured phones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured phones...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Phones
            </h2>
            <p className="text-gray-600">
              Handpicked phones with the best value for money
            </p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => {
                const container = document.getElementById('featured-phones-scroll');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('featured-phones-scroll');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div 
            id="featured-phones-scroll"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredPhones.map((phone, index) => (
              <div 
                key={phone._id || index} 
                onClick={() => onViewListing(phone._id)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0 w-[280px]"
              >
                {/* Image Section */}
                <div className="h-48 relative">
                  <img
                    src={phone.photos && phone.photos.length > 0 ? phone.photos[0] : '/api/placeholder/300/200'}
                    alt={`${phone.brand} ${phone.model}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Featured Badge */}
                  {phone.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {phone.brand} {phone.model}
                      </h3>
                      <p className="text-lg font-bold text-green-600">
                        ₨ {phone.price?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      phone.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                      phone.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {phone.condition}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                    <div>Storage: {phone.storage}</div>
                    <div>RAM: {phone.ram}</div>
                    <div>City: {phone.city}</div>
                    <div>Views: {phone.views}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCompare(phone);
                      }}
                      disabled={compareList?.includes(phone)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        compareList?.includes(phone)
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {compareList?.includes(phone) ? 'Added' : 'Compare'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewListing(phone._id);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* See All Phones card - fixed on the right */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0 w-[280px] h-[340px] flex items-center justify-center text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">See All Phones</h3>
                <p className="text-blue-100 text-sm">Browse our complete collection</p>
              </div>
            </div>
          </div>
          
          {/* Mobile swipe indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <span className="ml-2">Swipe to browse</span>
            </div>
          </div>
        </div>

        {/* Desktop View All Button */}
        <div className="text-center mt-8 hidden md:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Featured Phones →
          </button>
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

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">PhoneFlip</div>
                <div className="text-xs text-gray-300">.PK</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Pakistan's largest marketplace for buying and selling mobile phones with confidence.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Used Phones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Phones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Videos</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@phoneflip.pk</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 PhoneFlip.PK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const PriceDropAlertsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Price Drop Alerts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <Bell className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Stay Updated on Price Drops</h4>
          <p className="text-gray-600">Get notified when your desired phone drops in price</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Model</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. iPhone 15 Pro, Galaxy S24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Price (PKR)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 125000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Set Price Alert
          </button>
        </form>
      </div>
    </div>
  );
};

export const CompareModal = ({ isOpen, onClose, compareList, clearCompare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Compare Phones</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No phones to compare</h4>
              <p className="text-gray-600">Add phones to compare their specifications and prices</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-2 font-medium text-gray-700">Specification</th>
                    {compareList.map((phone, index) => (
                      <th key={index} className="text-center py-4 px-2 font-medium text-gray-900">
                        {phone.brand} {phone.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-700">Price</td>
                    {compareList.map((phone, index) => (
                      <td key={index} className="py-3 px-2 text-center text-green-600 font-bold">
                        ₨ {phone.price?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-700">Condition</td>
                    {compareList.map((phone, index) => (
                      <td key={index} className="py-3 px-2 text-center">{phone.condition}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-700">Storage</td>
                    {compareList.map((phone, index) => (
                      <td key={index} className="py-3 px-2 text-center">{phone.storage}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-700">RAM</td>
                    {compareList.map((phone, index) => (
                      <td key={index} className="py-3 px-2 text-center">{phone.ram}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-700">City</td>
                    {compareList.map((phone, index) => (
                      <td key={index} className="py-3 px-2 text-center">{phone.city}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {compareList.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={clearCompare}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Post an Ad Component
export const PostAdPage = ({ user, setCurrentPage, onViewListing }) => {
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
    features: [],
    // Enhanced specifications
    battery: '',
    screen_size: '',
    camera: '',
    processor: '',
    operating_system: '',
    network: '',
    color: '',
    // Mandatory photos
    photos: [],
    // Additional metadata
    purchase_year: '',
    purchase_date: '',
    warranty_months: '',
    warranty_status: '',
    box_included: false,
    accessories_included: [],
    battery_health: '',
    seller_type: user?.role === 'shop_owner' ? 'Shop Owner' : 'Individual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedListing, setSubmittedListing] = useState(null);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'];
  const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Used', 'Refurbished'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const batteryOptions = ['3000mAh', '3500mAh', '4000mAh', '4500mAh', '5000mAh', '5500mAh', '6000mAh'];
  const screenSizeOptions = ['5.4 inch', '6.1 inch', '6.4 inch', '6.7 inch', '6.8 inch', '7.0 inch'];
  const networkOptions = ['4G', '5G'];
  const warrantyStatusOptions = ['Active', 'Expired', 'No Warranty'];
  const batteryHealthOptions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const commonFeatures = [
    'Face ID', 'Fingerprint Scanner', 'Wireless Charging', 'Fast Charging', 
    'Dual SIM', 'NFC', 'Water Resistant', 'Headphone Jack', 
    'Expandable Storage', 'Dual Camera', 'Triple Camera', 'Quad Camera'
  ];
  const commonAccessories = ['Charger', 'Cable', 'Earphones', 'Case', 'Screen Protector', 'Documentation'];

  // Fetch available models when brand changes
  useEffect(() => {
    if (formData.brand) {
      fetchAvailableModels(formData.brand);
    }
  }, [formData.brand]);

  // Auto-fetch specifications when model changes
  useEffect(() => {
    if (formData.brand && formData.model) {
      fetchPhoneSpecs(formData.brand, formData.model);
    }
  }, [formData.brand, formData.model]);

  const fetchAvailableModels = async (brand) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/phone-models/${brand}`);
      const data = await response.json();
      if (response.ok) {
        setAvailableModels(data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchPhoneSpecs = async (brand, model) => {
    try {
      setIsLoadingSpecs(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/phone-specs/${brand}/${model}`);
      const data = await response.json();
      
      if (response.ok) {
        // Auto-fill specifications
        setFormData(prev => ({
          ...prev,
          battery: data.battery || prev.battery,
          screen_size: data.screen_size || prev.screen_size,
          camera: data.camera || prev.camera,
          processor: data.processor || prev.processor,
          operating_system: data.operating_system || prev.operating_system,
          network: data.network || prev.network,
          ram: data.ram || prev.ram
        }));
        setAvailableColors(data.colors || []);
      }
    } catch (error) {
      console.error('Error fetching phone specs:', error);
    } finally {
      setIsLoadingSpecs(false);
    }
  };

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

  const handleAccessoryToggle = (accessory) => {
    const currentAccessories = formData.accessories_included;
    if (currentAccessories.includes(accessory)) {
      setFormData({
        ...formData,
        accessories_included: currentAccessories.filter(a => a !== accessory)
      });
    } else {
      setFormData({
        ...formData,
        accessories_included: [...currentAccessories, accessory]
      });
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotoError('');

    if (files.length === 0) return;

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setPhotoError('Please upload only JPEG, PNG, or WebP images');
        return;
      }
      if (file.size > maxSize) {
        setPhotoError('Each image must be less than 5MB');
        return;
      }
    }

    // Check total photos limit
    if (formData.photos.length + files.length > 5) {
      setPhotoError('Maximum 5 photos allowed');
      return;
    }

    // Convert to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    const required = ['brand', 'model', 'condition', 'price', 'storage', 'ram', 'city', 'description'];
    for (const field of required) {
      if (!formData[field]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Validate photos are mandatory
    if (formData.photos.length === 0) {
      setPhotoError('At least one photo is required');
      return false;
    }

    if (isNaN(parseInt(formData.price)) || parseInt(formData.price) <= 0) {
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
        setSubmittedListing({ ...formData, id: data.id });
        setShowPreview(true);
        // Redirect to detailed listing view after successful submission
        if (onViewListing && data.id) {
          setTimeout(() => {
            onViewListing(data.id);
          }, 2000); // Show preview for 2 seconds then redirect
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
                    onChange={(e) => {
                      handleInputChange('brand', e.target.value);
                      // Reset model when brand changes
                      setFormData(prev => ({ ...prev, model: '', color: '' }));
                      setAvailableModels([]);
                      setAvailableColors([]);
                    }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model * 
                    {isLoadingSpecs && <span className="text-blue-500 text-sm ml-2">(Loading specs...)</span>}
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.brand}
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {!formData.brand && (
                    <p className="text-sm text-gray-500 mt-1">Please select a brand first</p>
                  )}
                </div>

                {availableColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <select
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Color</option>
                      {availableColors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                )}

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

            {/* Photos Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Photos *</h3>
              <p className="text-sm text-gray-600 mb-4">Add at least one photo of your phone. High-quality photos get more responses!</p>
              
              {photoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{photoError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Photo Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="photo-upload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Plus className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">Click to upload photos</span>
                    <span className="text-gray-400 text-sm mt-1">JPEG, PNG, WebP (Max 5MB each, up to 5 photos)</span>
                  </label>
                </div>

                {/* Uploaded Photos Preview */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Battery</label>
                  <select
                    value={formData.battery}
                    onChange={(e) => handleInputChange('battery', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Battery</option>
                    {batteryOptions.map(battery => (
                      <option key={battery} value={battery}>{battery}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Screen Size</label>
                  <select
                    value={formData.screen_size}
                    onChange={(e) => handleInputChange('screen_size', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Screen Size</option>
                    {screenSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Camera</label>
                  <input
                    type="text"
                    value={formData.camera}
                    onChange={(e) => handleInputChange('camera', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 48MP Triple Camera"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processor</label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={(e) => handleInputChange('processor', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Snapdragon 8 Gen 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operating System</label>
                  <input
                    type="text"
                    value={formData.operating_system}
                    onChange={(e) => handleInputChange('operating_system', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Android 14, iOS 17"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                  <select
                    value={formData.network}
                    onChange={(e) => handleInputChange('network', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Network</option>
                    {networkOptions.map(network => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase & Warranty Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Year</label>
                  <select
                    value={formData.purchase_year}
                    onChange={(e) => handleInputChange('purchase_year', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Status</label>
                  <select
                    value={formData.warranty_status}
                    onChange={(e) => handleInputChange('warranty_status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {warrantyStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty (Months)</label>
                  <input
                    type="number"
                    value={formData.warranty_months}
                    onChange={(e) => handleInputChange('warranty_months', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="36"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Battery Health (For Used Phones)</label>
                  <select
                    value={formData.battery_health}
                    onChange={(e) => handleInputChange('battery_health', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Battery Health</option>
                    {batteryHealthOptions.map(health => (
                      <option key={health} value={health}>{health}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="box-included"
                    checked={formData.box_included}
                    onChange={(e) => handleInputChange('box_included', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="box-included" className="ml-2 text-sm text-gray-700">
                    Original Box Included
                  </label>
                </div>
              </div>
            </div>

            {/* Accessories Included */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessories Included</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAccessories.map(accessory => (
                  <label key={accessory} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessories_included.includes(accessory)}
                      onChange={() => handleAccessoryToggle(accessory)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{accessory}</span>
                  </label>
                ))}
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

//Shop Owner Dashboard Component
export const ShopOwnerDashboard = ({ user, setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch shop owner stats
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/shop-owner/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
        setRecentListings(data.listings || []);
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% vs last month
            </p>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.businessName || user?.name}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentPage('post-ad')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Listing</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-4">
            {user?.verification_status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Verification Pending</h4>
                    <p className="text-sm text-yellow-700">Your documents are being reviewed. This process usually takes 24-48 hours.</p>
                  </div>
                </div>
              </div>
            )}
            {user?.verification_status === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Verified Shop Owner</h4>
                    <p className="text-sm text-green-700">Your account is verified and you can access all shop owner features.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Listings"
            value={stats.totalListings || 0}
            icon={Smartphone}
            color="#3B82F6"
            change={12}
          />
          <StatCard
            title="Active Listings"
            value={stats.activeListings || 0}
            icon={Eye}
            color="#10B981"
            change={8}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews || 0}
            icon={BarChart2}
            color="#F59E0B"
            change={25}
          />
          <StatCard
            title="Inquiries"
            value={stats.totalInquiries || 0}
            icon={MessageCircle}
            color="#8B5CF6"
            change={-3}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: Home },
                { key: 'listings', label: 'My Listings', icon: Smartphone },
                { key: 'analytics', label: 'Analytics', icon: BarChart2 },
                { key: 'boost', label: 'Boost Ads', icon: Zap },
                { key: 'settings', label: 'Settings', icon: User }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setCurrentPage('post-ad')}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-blue-900">Post New Ad</h4>
                      <p className="text-sm text-blue-700">List a new phone for sale</p>
                    </button>
                    
                    <button className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors">
                      <Zap className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-green-900">Boost Listing</h4>
                      <p className="text-sm text-green-700">Increase visibility of your ads</p>
                    </button>
                    
                    <button className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors">
                      <BarChart2 className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-medium text-purple-900">View Analytics</h4>
                      <p className="text-sm text-purple-700">Track your performance</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New inquiry on iPhone 15 Pro', time: '2 hours ago', type: 'inquiry' },
                      { action: 'Galaxy S24 listing viewed 15 times', time: '4 hours ago', type: 'view' },
                      { action: 'Xiaomi 13 Pro ad expired', time: '1 day ago', type: 'expired' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'inquiry' ? 'bg-blue-500' :
                          activity.type === 'view' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                  <button
                    onClick={() => setCurrentPage('post-ad')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentListings.length > 0 ? recentListings.map((listing, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{listing.brand} {listing.model}</h4>
                            <p className="text-lg font-bold text-green-600">₨ {listing.price?.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{listing.condition} • {listing.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex space-x-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{listing.views || 0} views</p>
                          <div className="flex space-x-2 mt-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">Boost</button>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h4>
                      <p className="text-gray-600 mb-4">Start by posting your first phone listing</p>
                      <button
                        onClick={() => setCurrentPage('post-ad')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Post Your First Ad
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Listing Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Views per Listing</span>
                        <span className="font-semibold text-gray-900">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Rate</span>
                        <span className="font-semibold text-gray-900">68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Days to Sell</span>
                        <span className="font-semibold text-gray-900">12</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Top Performing Models</h4>
                    <div className="space-y-3">
                      {['iPhone 15 Pro', 'Galaxy S24', 'Xiaomi 13'].map((model, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{model}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${80 - index * 20}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{80 - index * 20}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'boost' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Boost Your Ads</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Basic Boost', price: 500, duration: '3 days', features: ['Top of search results', '2x more views'] },
                    { name: 'Premium Boost', price: 1200, duration: '7 days', features: ['Featured listing', '5x more views', 'Priority support'] },
                    { name: 'Ultimate Boost', price: 2000, duration: '14 days', features: ['Homepage featured', '10x more views', 'Dedicated support', 'Social media promotion'] }
                  ].map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-1">₨ {plan.price}</p>
                      <p className="text-sm text-gray-500 mb-4">for {plan.duration}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                        Choose Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                          type="text"
                          value={user?.businessName || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <input
                          type="text"
                          value={user?.businessType || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={user?.phone || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      To update your business information, please contact support.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      {[
                        'Email notifications for new inquiries',
                        'SMS alerts for urgent messages',
                        'Weekly performance reports',
                        'Marketing updates and promotions'
                      ].map((pref, index) => (
                        <label key={index} className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                          <span className="text-sm text-gray-700">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Results Component with Working Filters
export const SearchResultsPage = ({ searchFilters, onBack, onViewListing }) => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    brand: [],
    model: '',
    city: [],
    condition: [],
    color: [],
    priceRange: '',
    storage: [],
    ram: [],
    battery: [],
    battery_health: [],
    network: [],
    seller_type: [],
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 20;

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Used', 'Refurbished'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Gold', 'Silver'];
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
  const batteryOptions = ['3000mAh', '3500mAh', '4000mAh', '4500mAh', '5000mAh', '5500mAh', '6000mAh'];
  const batteryHealthOptions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const networkOptions = ['4G', '5G'];
  const sellerTypeOptions = ['Individual', 'Shop Owner', 'Verified Seller'];
  const sortOptions = [
    { value: 'newest', label: 'Newest Listings' },
    { value: 'oldest', label: 'Oldest Listings' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_viewed', label: 'Most Viewed' }
  ];

  useEffect(() => {
    fetchListings();
  }, [activeFilters]); // Refetch when filters change

  useEffect(() => {
    applyFilters();
  }, [listings, sortBy]); // Apply sorting when listings or sortBy changes

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Check if searching for accessories
      const isAccessories = searchFilters?.category === 'accessories';
      const endpoint = isAccessories ? '/api/accessories' : '/api/listings';
      
      // Build query parameters for advanced filtering
      const params = new URLSearchParams();
      
      // Handle multi-select filters (arrays)
      if (activeFilters.brand.length > 0) {
        activeFilters.brand.forEach(brand => params.append('brand', brand));
      }
      if (activeFilters.city.length > 0) {
        activeFilters.city.forEach(city => params.append('city', city));
      }
      if (activeFilters.condition.length > 0) {
        activeFilters.condition.forEach(condition => params.append('condition', condition));
      }
      if (activeFilters.color.length > 0) {
        activeFilters.color.forEach(color => params.append('color', color));
      }
      if (activeFilters.storage.length > 0) {
        activeFilters.storage.forEach(storage => params.append('storage', storage));
      }
      if (activeFilters.ram.length > 0) {
        activeFilters.ram.forEach(ram => params.append('ram', ram));
      }
      if (activeFilters.battery.length > 0) {
        activeFilters.battery.forEach(battery => params.append('battery', battery));
      }
      if (activeFilters.battery_health.length > 0) {
        activeFilters.battery_health.forEach(health => params.append('battery_health', health));
      }
      if (activeFilters.network.length > 0) {
        activeFilters.network.forEach(network => params.append('network', network));
      }
      if (activeFilters.seller_type.length > 0) {
        activeFilters.seller_type.forEach(type => params.append('seller_type', type));
      }
      
      // Handle single-select filters
      if (activeFilters.model) params.append('model', activeFilters.model);
      if (activeFilters.search) params.append('search', activeFilters.search);
      
      // Handle price range
      if (activeFilters.priceRange) {
        const priceMapping = {
          'Under ₨50,000': { max_price: 50000 },
          '₨50,000 - ₨100,000': { min_price: 50000, max_price: 100000 },
          '₨100,000 - ₨200,000': { min_price: 100000, max_price: 200000 },
          '₨200,000 - ₨300,000': { min_price: 200000, max_price: 300000 },
          '₨300,000 - ₨500,000': { min_price: 300000, max_price: 500000 },
          'Above ₨500,000': { min_price: 500000 }
        };
        
        const priceFilter = priceMapping[activeFilters.priceRange];
        if (priceFilter) {
          if (priceFilter.min_price) params.append('min_price', priceFilter.min_price);
          if (priceFilter.max_price) params.append('max_price', priceFilter.max_price);
        }
      }
      
      // Add sorting
      params.append('sort_by', sortBy);
      
      // Add pagination
      params.append('skip', (currentPage - 1) * itemsPerPage);
      params.append('limit', itemsPerPage);
      
      const queryString = params.toString();
      const url = `${process.env.REACT_APP_BACKEND_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setListings(data);
        setFilteredListings(data);
        setTotalResults(data.length); // In a real app, you'd get total count from API
        
        // Apply initial search filters if any
        if (searchFilters) {
          setActiveFilters(prev => ({
            ...prev,
            ...searchFilters
          }));
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

  // Helper functions for multi-select filters
  const toggleMultiSelectFilter = (filterType, value) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      brand: [],
      model: '',
      city: [],
      condition: [],
      color: [],
      priceRange: '',
      storage: [],
      ram: [],
      battery: [],
      battery_health: [],
      network: [],
      seller_type: [],
      search: ''
    });
    setCurrentPage(1);
  };

  const removeFilterTag = (filterType, value) => {
    if (Array.isArray(activeFilters[filterType])) {
      toggleMultiSelectFilter(filterType, value);
    } else {
      setActiveFilters(prev => ({ ...prev, [filterType]: '' }));
    }
  };

  // Get active filter tags for display
  const getActiveFilterTags = () => {
    const tags = [];
    
    // Multi-select filters
    ['brand', 'city', 'condition', 'color', 'storage', 'ram', 'battery', 'battery_health', 'network', 'seller_type'].forEach(filterType => {
      activeFilters[filterType].forEach(value => {
        tags.push({ type: filterType, value, label: `${filterType}: ${value}` });
      });
    });
    
    // Single-select filters
    if (activeFilters.model) tags.push({ type: 'model', value: activeFilters.model, label: `Model: ${activeFilters.model}` });
    if (activeFilters.priceRange) tags.push({ type: 'priceRange', value: activeFilters.priceRange, label: activeFilters.priceRange });
    if (activeFilters.search) tags.push({ type: 'search', value: activeFilters.search, label: `Search: ${activeFilters.search}` });
    
    return tags;
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
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={activeFilters.search || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, search: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Search by brand, model, or description"
                  />
                </div>

                {/* City Filter (Top Priority) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City/Location
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {cities.map(city => (
                      <label key={city} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={activeFilters.city.includes(city)}
                          onChange={() => toggleMultiSelectFilter('city', city)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={activeFilters.brand.includes(brand)}
                          onChange={() => toggleMultiSelectFilter('brand', brand)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Model Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={activeFilters.model}
                    onChange={(e) => setActiveFilters({ ...activeFilters, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g. iPhone 15 Pro"
                  />
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

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {conditions.map(condition => (
                      <label key={condition} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={activeFilters.condition.includes(condition)}
                          onChange={() => toggleMultiSelectFilter('condition', condition)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-2"
                  >
                    <span>Advanced Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Advanced Filters Section */}
                {showAdvancedFilters && (
                  <>
                    {/* Storage Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                      <div className="grid grid-cols-2 gap-2">
                        {storageOptions.map(storage => (
                          <label key={storage} className="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 p-1 rounded text-xs">
                            <input
                              type="checkbox"
                              checked={activeFilters.storage.includes(storage)}
                              onChange={() => toggleMultiSelectFilter('storage', storage)}
                              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{storage}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* RAM Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RAM</label>
                      <div className="grid grid-cols-2 gap-2">
                        {ramOptions.map(ram => (
                          <label key={ram} className="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 p-1 rounded text-xs">
                            <input
                              type="checkbox"
                              checked={activeFilters.ram.includes(ram)}
                              onChange={() => toggleMultiSelectFilter('ram', ram)}
                              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{ram}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Battery Health Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Battery Health</label>
                      <div className="space-y-2">
                        {batteryHealthOptions.map(health => (
                          <label key={health} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={activeFilters.battery_health.includes(health)}
                              onChange={() => toggleMultiSelectFilter('battery_health', health)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{health}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Seller Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seller Type</label>
                      <div className="space-y-2">
                        {sellerTypeOptions.map(type => (
                          <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={activeFilters.seller_type.includes(type)}
                              onChange={() => toggleMultiSelectFilter('seller_type', type)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Network Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                      <div className="flex space-x-4">
                        {networkOptions.map(network => (
                          <label key={network} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={activeFilters.network.includes(network)}
                              onChange={() => toggleMultiSelectFilter('network', network)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{network}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Active Filter Tags */}
            {getActiveFilterTags().length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilterTags().map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag.label}
                      <button
                        onClick={() => removeFilterTag(tag.type, tag.value)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-gray-900">
                {totalResults > 0 ? `${totalResults} Results` : 'Search Results'}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg text-gray-600">Loading listings...</span>
              </div>
            ) : (
              <>
                {/* Listings Grid */}
                {filteredListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No phones found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                    
                    {/* Suggestions */}
                    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                      <h4 className="font-medium text-gray-900 mb-3">Suggestions:</h4>
                      <ul className="text-sm text-gray-600 space-y-2 text-left">
                        <li>• Try removing some filters</li>
                        <li>• Check your spelling</li>
                        <li>• Use more general terms</li>
                        <li>• Browse by popular brands like Apple, Samsung</li>
                        <li>• Consider nearby cities</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 space-x-4">
                      <button
                        onClick={clearFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear All Filters
                      </button>
                      <button
                        onClick={onBack}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredListings.map((listing, index) => (
                      <div 
                        key={listing.id || index} 
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => onViewListing && onViewListing(listing.id)}
                      >
                        {/* Photo/Thumbnail */}
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          {listing.photos && listing.photos.length > 0 ? (
                            <img 
                              src={listing.photos[0]} 
                              alt={`${listing.brand} ${listing.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Smartphone className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          {/* Photo count indicator */}
                          {listing.photos && listing.photos.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                              +{listing.photos.length - 1} photos
                            </div>
                          )}
                          {/* Featured badge */}
                          {listing.is_featured && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Title and Price */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {listing.brand} {listing.model}
                              </h3>
                              {listing.color && (
                                <p className="text-sm text-gray-500">{listing.color}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">
                                ₨{listing.price.toLocaleString()}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                listing.condition === 'New' ? 'bg-green-100 text-green-800' :
                                listing.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
                                listing.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                                listing.condition === 'Very Good' ? 'bg-cyan-100 text-cyan-800' :
                                listing.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                                listing.condition === 'Fair' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {listing.condition}
                              </span>
                            </div>
                          </div>

                          {/* Quick Specs */}
                          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-600">Storage:</span>
                              <span className="font-medium">{listing.storage}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600">RAM:</span>
                              <span className="font-medium">{listing.ram}</span>
                            </div>
                            {listing.battery && (
                              <div className="flex items-center space-x-2">
                                <Battery className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">Battery:</span>
                                <span className="font-medium">{listing.battery}</span>
                              </div>
                            )}
                            {listing.network && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-600">Network:</span>
                                <span className="font-medium">{listing.network}</span>
                              </div>
                            )}
                          </div>

                          {/* Location and Time */}
                          <div className="flex items-center justify-between text-sm border-t pt-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{listing.city}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span>{listing.views || 0} views</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{getTimeAgo(listing.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Seller Type Badge */}
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              listing.seller_type === 'Shop Owner' ? 'bg-blue-100 text-blue-800' :
                              listing.seller_type === 'Verified Seller' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {listing.seller_type === 'Shop Owner' && <Shield className="w-3 h-3 mr-1" />}
                              {listing.seller_type === 'Verified Seller' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {listing.seller_type}
                            </span>
                            
                            {listing.features && listing.features.length > 0 && (
                              <div className="text-xs text-gray-500">
                                +{listing.features.length} features
                              </div>
                            )}
                          </div>

                          {/* Main Highlights */}
                          {listing.features && listing.features.length > 0 && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {listing.features.slice(0, 3).map((feature, idx) => (
                                  <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {feature}
                                  </span>
                                ))}
                                {listing.features.length > 3 && (
                                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                    +{listing.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {filteredListings.length >= itemsPerPage && (
                  <div className="mt-8 flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-gray-600">
                      Page {currentPage} of {Math.ceil(totalResults / itemsPerPage)}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={filteredListings.length < itemsPerPage}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filteredListings.length < itemsPerPage
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New Comprehensive Dedicated Search Page
export const DedicatedSearchPage = ({ onBack, onViewListing, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  
  // Search data and options
  const phoneModels = [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14',
    'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24+', 'Samsung Galaxy S24', 'Samsung Galaxy A55', 'Samsung Galaxy A35',
    'Xiaomi 14', 'Xiaomi 13T Pro', 'Xiaomi Redmi Note 13 Pro+', 'Xiaomi Redmi Note 13 Pro', 'Xiaomi Redmi Note 13',
    'Oppo Find X7', 'Oppo Reno 11 Pro', 'Oppo A79', 'Vivo V29 Pro', 'Vivo V29', 'Vivo Y100',
    'Realme GT 5 Pro', 'Realme 12 Pro+', 'Realme C67', 'OnePlus 12', 'OnePlus 11T', 'OnePlus Nord CE4',
    'Google Pixel 8 Pro', 'Google Pixel 8', 'Google Pixel 7a', 'Nothing Phone 2a', 'Nothing Phone 2'
  ];

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nothing', 'Google'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
  const priceRanges = [
    { label: 'Under ₨25,000', value: 'under-25k', min: 0, max: 25000 },
    { label: '₨25,000 - ₨50,000', value: '25k-50k', min: 25000, max: 50000 },
    { label: '₨50,000 - ₨100,000', value: '50k-100k', min: 50000, max: 100000 },
    { label: '₨100,000 - ₨200,000', value: '100k-200k', min: 100000, max: 200000 },
    { label: '₨200,000 - ₨300,000', value: '200k-300k', min: 200000, max: 300000 },
    { label: 'Above ₨300,000', value: 'above-300k', min: 300000, max: 999999999 }
  ];
  const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'];

  // Get user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // In a real app, you'd use a geocoding service
                // For now, we'll use a mock location based on common Pakistani cities
                const mockCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
                const randomCity = mockCities[Math.floor(Math.random() * mockCities.length)];
                setUserLocation(randomCity);
              } catch (error) {
                setUserLocation('Pakistan');
              } finally {
                setLocationLoading(false);
              }
            },
            () => {
              setUserLocation('Pakistan');
              setLocationLoading(false);
            }
          );
        } else {
          setUserLocation('Pakistan');
          setLocationLoading(false);
        }
      } catch (error) {
        setUserLocation('Pakistan');
        setLocationLoading(false);
      }
    };

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('phoneflip_recent_searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }

    // Mock trending searches based on location
    const mockTrending = [
      'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'Xiaomi 14', 'Under ₨50,000',
      'New condition', 'Samsung Galaxy A55', 'iPhone 14', 'Oppo Reno 11'
    ];
    setTrendingSearches(mockTrending);

    detectLocation();
    
    // Apply initial filters if provided
    if (initialFilters.brand) {
      setSearchQuery(initialFilters.brand);
      setActiveTab('brand');
    } else if (initialFilters.priceRange) {
      setSearchQuery(initialFilters.priceRange);
      setActiveTab('price');
    } else if (initialFilters.condition) {
      setSearchQuery(initialFilters.condition);
      setActiveTab('condition');
    }
  }, [initialFilters]);

  // Generate search suggestions with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length > 0) {
        generateSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const generateSuggestions = (query) => {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // Brand suggestions
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'brand',
          value: brand,
          display: brand,
          icon: '📱',
          category: 'Brand'
        });
      }
    });

    // Model suggestions
    phoneModels.forEach(model => {
      if (model.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'model',
          value: model,
          display: model,
          icon: '📱',
          category: 'Model'
        });
      }
    });

    setSuggestions(suggestions.slice(0, 8));
    setShowSuggestions(suggestions.length > 0);
  };

  const saveRecentSearch = (searchTerm) => {
    const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('phoneflip_recent_searches', JSON.stringify(updatedSearches));
  };

  const handleSearch = async (searchTerm = searchQuery, type = 'general') => {
    if (!searchTerm.trim() && type === 'general') return;
    
    setLoading(true);
    setHasSearched(true);
    
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
    }

    try {
      // Mock search API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock results based on search term
      const mockResults = [];
      for (let i = 0; i < Math.floor(Math.random() * 20) + 10; i++) {
        mockResults.push({
          id: `listing_${i}`,
          brand: brands[Math.floor(Math.random() * brands.length)],
          model: phoneModels[Math.floor(Math.random() * phoneModels.length)],
          price: Math.floor(Math.random() * 300000) + 25000,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          city: cities[Math.floor(Math.random() * cities.length)],
          images: [`https://picsum.photos/400/300?random=${i}`],
          seller_name: `Seller ${i + 1}`,
          posted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          featured: Math.random() > 0.8,
          verified_seller: Math.random() > 0.7
        });
      }
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.display);
    setShowSuggestions(false);
    handleSearch(suggestion.display, suggestion.type);
  };

  const handleQuickSearch = (searchTerm, type = 'quick') => {
    setSearchQuery(searchTerm);
    handleSearch(searchTerm, type);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const tabs = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'brand', label: 'By Brand', icon: Smartphone },
    { id: 'price', label: 'By Price', icon: DollarSign },
    { id: 'location', label: 'Near Me', icon: MapPin }
  ];

  if (loading && hasSearched) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back</span>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Search</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for phones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {hasSearched ? `${searchResults.length} Results` : 'Find Your Perfect Phone'}
            </h1>
            {hasSearched && (
              <button onClick={clearSearch} className="text-blue-600 hover:text-blue-700 font-medium">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasSearched ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {locationLoading ? 'Detecting location...' : `Searching in ${userLocation}`}
                  </span>
                </div>
                <button className="text-blue-200 hover:text-white transition-colors">
                  <span className="text-sm">Change</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for phones, brands, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Advanced Search Button */}
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="w-full mt-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Advanced Search</span>
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2 max-h-80 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{suggestion.icon}</span>
                        <div>
                          <span className="text-gray-900 font-medium">{suggestion.display}</span>
                          <div className="text-xs text-gray-500">{suggestion.category}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && (
                <button
                  onClick={() => handleSearch()}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              )}
            </div>

            <div className="flex overflow-x-auto pb-1 mb-8 space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {activeTab === 'search' && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-gray-400" />
                        Recent Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickSearch(search)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                          >
                            <span>{search}</span>
                            <X 
                              className="w-3 h-3 opacity-50 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = recentSearches.filter((_, i) => i !== index);
                                setRecentSearches(updated);
                                localStorage.setItem('phoneflip_recent_searches', JSON.stringify(updated));
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                      Trending in {userLocation}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {trendingSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-800 p-3 rounded-lg text-sm font-medium transition-all duration-300 text-center"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'brand' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Brand</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {brands.map((brand, index) => (
                      <button
                        key={brand}
                        onClick={() => handleQuickSearch(brand)}
                        className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 text-center"
                      >
                        <div className="text-3xl mb-2">📱</div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-700">{brand}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor(Math.random() * 200) + 50} listings
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'price' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Price Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {priceRanges.map((range, index) => (
                      <button
                        key={range.value}
                        onClick={() => handleQuickSearch(range.label)}
                        className="group bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl p-4 transition-all duration-300 text-left flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-green-700">
                            {range.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.floor(Math.random() * 150) + 30} listings available
                          </div>
                        </div>
                        <div className="text-2xl">💰</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Phones Near You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cities.map((city, index) => (
                      <button
                        key={city}
                        onClick={() => handleQuickSearch(`${city} phones`)}
                        className={`group border rounded-xl p-4 transition-all duration-300 text-left flex items-center justify-between ${
                          city === userLocation
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div>
                          <div className={`font-medium ${
                            city === userLocation ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-700'
                          }`}>
                            {city}
                            {city === userLocation && ' (Your Location)'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.floor(Math.random() * 300) + 50} listings available
                          </div>
                        </div>
                        <div className="text-2xl">📍</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Found {searchResults.length} phones
                  </h2>
                  <p className="text-gray-600 mt-1">for "{searchQuery}"</p>
                </div>
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((listing, index) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                  onClick={() => onViewListing && onViewListing(listing)}
                >
                  <div className="relative">
                    <img
                      src={listing.images[0]}
                      alt={`${listing.brand} ${listing.model}`}
                      className="w-full h-48 object-cover"
                    />
                    {listing.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {listing.verified_seller && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {listing.brand} {listing.model}
                      </h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          ₨{listing.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">{listing.condition}</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {listing.city}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{listing.seller_name}</span>
                      <span>{Math.floor((Date.now() - new Date(listing.posted_at)) / (1000 * 60 * 60 * 24))} days ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No phones found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or browse by category</p>
                <button
                  onClick={clearSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Start New Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onApplyFilters={(filters) => {
          setAdvancedFilters(filters);
          // Apply filters to search
          let searchTerm = '';
          if (filters.brand) searchTerm += filters.brand + ' ';
          if (filters.model) searchTerm += filters.model + ' ';
          if (filters.city) searchTerm += filters.city + ' ';
          handleSearch(searchTerm.trim() || 'advanced search', 'advanced');
        }}
        currentFilters={advancedFilters}
      />
    </div>
  );
};
