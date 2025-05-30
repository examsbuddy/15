import React, { useState } from 'react';
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

// Login Modal Component
export const LoginModal = ({ isOpen, setIsOpen, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn && setIsLoggedIn(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Post Ad Modal Component
export const PostAdModal = ({ isOpen, setIsOpen }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    condition: '',
    price: '',
    storage: '',
    ram: '',
    city: '',
    description: '',
    features: []
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      brand: '', model: '', condition: '', price: '', storage: '', ram: '', city: '', description: '', features: []
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    alert('Ad posted successfully!');
    handleClose();
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
                    >
                      <option value="">Select Brand</option>
                      <option value="iPhone">iPhone</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Vivo">Vivo</option>
                      <option value="OnePlus">OnePlus</option>
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
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications & Location</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                    placeholder="Describe your phone's condition, accessories included, etc."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Ad</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div><strong>Brand:</strong> {formData.brand}</div>
                  <div><strong>Model:</strong> {formData.model}</div>
                  <div><strong>Condition:</strong> {formData.condition}</div>
                  <div><strong>Price:</strong> PKR {formData.price}</div>
                  <div><strong>Storage:</strong> {formData.storage}</div>
                  <div><strong>RAM:</strong> {formData.ram}</div>
                  <div><strong>City:</strong> {formData.city}</div>
                  <div><strong>Description:</strong> {formData.description}</div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                  >
                    Post Ad
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
    <header className="block lg:hidden bg-blue-900 text-white sticky top-0 z-50 safe-area-top">
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
      <header className="hidden md:block bg-blue-900 text-white sticky top-0 z-50">
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
      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setIsLoggedIn={setIsLoggedIn} />
    </>
  );
};

// Bottom Navigation Component - Enhanced with More menu
export const BottomNavigation = ({ activeTab, setActiveTab, setIsPostAdOpen }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="fixed bottom-16 left-4 right-4 bg-white rounded-t-2xl z-50 lg:hidden max-h-96 overflow-y-auto"
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

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setIsLoggedIn={setIsLoggedIn} />
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
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Find Used Mobile Phones in Pakistan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100"
          >
            Buy & Sell Phones with Confidence
          </motion.p>
        </div>

        {/* Desktop Search */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:block bg-white rounded-lg p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          className="block md:hidden mx-4"
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
  const categories = [
    { name: 'iPhone', icon: '📱', count: '1,200+' },
    { name: 'Samsung', icon: '📱', count: '800+' },
    { name: 'Xiaomi', icon: '📱', count: '600+' },
    { name: 'Oppo', icon: '📱', count: '400+' },
    { name: 'Vivo', icon: '📱', count: '350+' },
    { name: 'OnePlus', icon: '📱', count: '200+' }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Browse by Brand</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
  const featuredPhones = [
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

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Phones</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Phone Reviews</h1>
          <p className="text-lg text-gray-600">Expert reviews and detailed analysis of the latest mobile phones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Phone Videos</h1>
          <p className="text-lg text-gray-600">Watch reviews, unboxings, and tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Forums</h1>
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
    <div className="pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PhoneFlip Blog</h1>
          <p className="text-lg text-gray-600">Insights, tips, and news about the mobile phone market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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