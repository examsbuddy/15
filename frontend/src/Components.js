import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, Bell, MessageCircle, User, Home, Plus, 
  Filter, ChevronRight, Star, MapPin, Heart, Share2, 
  Phone, Camera, Battery, Smartphone, Cpu, HardDrive,
  Clock, Shield, CheckCircle, ArrowRight, Eye, X, ChevronDown,
  Mail, Lock, UserPlus, Settings, LogOut, Bookmark, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const phoneCategories = [
  { name: 'iPhone', count: '2,340', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', brands: ['iPhone 15', 'iPhone 14', 'iPhone 13'] },
  { name: 'Samsung', count: '1,890', image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a', brands: ['Galaxy S24', 'Galaxy A54', 'Galaxy Note'] },
  { name: 'Xiaomi', count: '1,245', image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0', brands: ['Redmi Note', 'Mi 11', 'Poco F5'] },
  { name: 'OnePlus', count: '567', image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0', brands: ['OnePlus 11', 'OnePlus Nord', 'OnePlus 10'] },
  { name: 'Oppo', count: '789', image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a', brands: ['Reno 8', 'A78', 'Find X5'] },
  { name: 'Vivo', count: '623', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', brands: ['V29', 'Y36', 'X90'] }
];

const featuredPhones = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max',
    price: 'Rs 2,89,000',
    originalPrice: 'Rs 3,20,000',
    location: 'Karachi, Sindh',
    condition: 'Excellent',
    storage: '256GB',
    ram: '6GB',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    verified: true,
    featured: true,
    views: 1240,
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra',
    price: 'Rs 1,95,000',
    originalPrice: 'Rs 2,25,000',
    location: 'Lahore, Punjab',
    condition: 'Good',
    storage: '512GB',
    ram: '12GB',
    image: 'https://images.unsplash.com/photo-1584651432430-7e1ac8303a0a',
    verified: true,
    featured: false,
    views: 890,
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'Xiaomi 13 Pro',
    price: 'Rs 1,25,000',
    originalPrice: 'Rs 1,45,000',
    location: 'Islamabad, ICT',
    condition: 'Excellent',
    storage: '256GB',
    ram: '8GB',
    image: 'https://images.unsplash.com/photo-1575719362347-a70b129740e0',
    verified: false,
    featured: true,
    views: 567,
    posted: '3 days ago'
  }
];

const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
const priceRanges = ['Under Rs 25,000', 'Rs 25,000 - 50,000', 'Rs 50,000 - 1,00,000', 'Rs 1,00,000 - 2,00,000', 'Above Rs 2,00,000'];

// Dropdown menu data
const menuDropdowns = {
  'used-phones': {
    categories: [
      { name: 'By Brand', items: ['iPhone', 'Samsung', 'Xiaomi', 'OnePlus', 'Oppo', 'Vivo', 'Huawei'] },
      { name: 'By Price', items: ['Under 25K', '25K-50K', '50K-100K', '100K-200K', 'Above 200K'] },
      { name: 'By Storage', items: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      { name: 'By Condition', items: ['Excellent', 'Good', 'Fair', 'Poor'] }
    ]
  },
  'new-phones': {
    categories: [
      { name: 'Latest Releases', items: ['iPhone 15 Series', 'Samsung S24', 'Xiaomi 14', 'OnePlus 12'] },
      { name: 'Popular Brands', items: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Oppo'] },
      { name: 'Price Range', items: ['Under 50K', '50K-100K', '100K-200K', 'Above 200K'] }
    ]
  },
  'accessories': {
    categories: [
      { name: 'Protection', items: ['Cases & Covers', 'Screen Protectors', 'Tempered Glass'] },
      { name: 'Audio', items: ['Earphones', 'Wireless Earbuds', 'Speakers', 'Headphones'] },
      { name: 'Charging', items: ['Chargers', 'Power Banks', 'Wireless Chargers', 'Cables'] },
      { name: 'Other', items: ['Phone Stands', 'Car Mounts', 'Selfie Sticks', 'Ring Holders'] }
    ]
  }
};

// Notifications data
const notifications = [
  { id: 1, title: 'New message from buyer', message: 'Someone is interested in your iPhone 14 Pro', time: '2 min ago', type: 'message', unread: true },
  { id: 2, title: 'Price drop alert', message: 'Samsung Galaxy S23 Ultra price dropped by Rs 15,000', time: '1 hour ago', type: 'alert', unread: true },
  { id: 3, title: 'Your ad has been viewed', message: 'Your Xiaomi 13 Pro listing has 25 new views', time: '3 hours ago', type: 'info', unread: false },
  { id: 4, title: 'New phones in your area', message: '5 new phones posted in Karachi today', time: '1 day ago', type: 'info', unread: false }
];

// Login Modal Component
export const LoginModal = ({ isOpen, setIsOpen }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log('Form submitted:', formData);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSignUp ? 'Sign Up' : 'Login'} to PhoneFlip.PK
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="03XX XXXXXXX"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {isSignUp ? 'Create Account' : 'Login'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                  >
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Post Ad Modal Component
export const PostAdModal = ({ isOpen, setIsOpen }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adData, setAdData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    condition: '',
    storage: '',
    ram: '',
    city: '',
    description: '',
    phone: '',
    images: []
  });

  const brands = ['iPhone', 'Samsung', 'Xiaomi', 'OnePlus', 'Oppo', 'Vivo', 'Huawei', 'Nokia', 'Realme'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ad submitted:', adData);
    setIsOpen(false);
    setCurrentStep(1);
    // Reset form
    setAdData({
      title: '', brand: '', model: '', price: '', condition: '',
      storage: '', ram: '', city: '', description: '', phone: '', images: []
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Post Your Phone Ad
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand *
                        </label>
                        <select
                          value={adData.brand}
                          onChange={(e) => setAdData({...adData, brand: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Brand</option>
                          {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model *
                        </label>
                        <input
                          type="text"
                          value={adData.model}
                          onChange={(e) => setAdData({...adData, model: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., iPhone 14 Pro Max"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition *
                        </label>
                        <select
                          value={adData.condition}
                          onChange={(e) => setAdData({...adData, condition: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Condition</option>
                          {conditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (PKR) *
                        </label>
                        <input
                          type="number"
                          value={adData.price}
                          onChange={(e) => setAdData({...adData, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 150000"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Storage
                        </label>
                        <select
                          value={adData.storage}
                          onChange={(e) => setAdData({...adData, storage: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Storage</option>
                          {storageOptions.map(storage => (
                            <option key={storage} value={storage}>{storage}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RAM
                        </label>
                        <select
                          value={adData.ram}
                          onChange={(e) => setAdData({...adData, ram: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select RAM</option>
                          {ramOptions.map(ram => (
                            <option key={ram} value={ram}>{ram}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Description */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Location & Description</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        value={adData.city}
                        onChange={(e) => setAdData({...adData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={adData.phone}
                        onChange={(e) => setAdData({...adData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="03XX XXXXXXX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={adData.description}
                        onChange={(e) => setAdData({...adData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Describe your phone's condition, any accessories included, etc."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Review Your Ad</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {adData.brand} {adData.model}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span><strong>Price:</strong> Rs {adData.price?.toLocaleString()}</span>
                        <span><strong>Condition:</strong> {adData.condition}</span>
                        <span><strong>Storage:</strong> {adData.storage}</span>
                        <span><strong>RAM:</strong> {adData.ram}</span>
                        <span><strong>City:</strong> {adData.city}</span>
                        <span><strong>Phone:</strong> {adData.phone}</span>
                      </div>
                      {adData.description && (
                        <div className="mt-2">
                          <strong>Description:</strong>
                          <p className="text-gray-600 mt-1">{adData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      currentStep === 1 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Post Ad
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Notification Panel Component
export const NotificationPanel = ({ isOpen, setIsOpen }) => {
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length);

  const markAsRead = (notificationId) => {
    // Mark notification as read logic
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Dropdown Menu Component
export const DropdownMenu = ({ isOpen, menuId, onClose }) => {
  const menuData = menuDropdowns[menuId];
  
  if (!menuData || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <div className="p-4">
          {menuData.categories.map((category, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                {category.name}
              </h4>
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      onClick={() => {
                        console.log(`Selected: ${item}`);
                        onClose();
                      }}
                      className="text-gray-600 hover:text-blue-600 text-sm hover:bg-blue-50 w-full text-left px-2 py-1 rounded transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Desktop Header Component
export const DesktopHeader = ({ activeTab, setActiveTab, setIsPostAdOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const menuItems = [
    { id: 'used-phones', label: 'Used Phones', hasDropdown: true },
    { id: 'new-phones', label: 'New Phones', hasDropdown: true },
    { id: 'accessories', label: 'Accessories', hasDropdown: true },
    { id: 'reviews', label: 'Reviews' },
    { id: 'videos', label: 'Videos' },
    { id: 'forums', label: 'Forums' },
    { id: 'blog', label: 'Blog' }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (menuDropdowns[itemId]) {
      setOpenDropdown(openDropdown === itemId ? null : itemId);
    } else {
      setOpenDropdown(null);
      // Navigate to page
      console.log(`Navigating to ${itemId}`);
    }
  };

  const handlePostAd = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      setActiveTab('sell');
      console.log('Opening Post Ad form');
    }
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    console.log('User logged out');
  };

  return (
    <header className="hidden md:block bg-blue-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('home')}
              className="text-2xl font-bold text-white hover:text-green-400 transition-colors"
            >
              PhoneFlip<span className="text-green-400">.PK</span>
            </button>
            <nav className="hidden md:flex space-x-6">
              {menuItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`px-3 py-2 text-sm font-medium hover:text-green-400 transition-colors flex items-center ${
                      activeTab === item.id ? 'text-green-400' : 'text-white'
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                        openDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  {item.hasDropdown && (
                    <DropdownMenu 
                      isOpen={openDropdown === item.id}
                      menuId={item.id}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-white hover:text-green-400 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>
              <NotificationPanel 
                isOpen={isNotificationOpen} 
                setIsOpen={setIsNotificationOpen} 
              />
            </div>

            {/* User Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-green-400"
                >
                  <User className="w-5 h-5" />
                  <span>John Doe</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                      >
                        <div className="py-2">
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </button>
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Saved Phones
                          </button>
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                            <History className="w-4 h-4 mr-2" />
                            My Ads
                          </button>
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Messages
                          </button>
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="text-white hover:text-green-400 font-medium"
              >
                Login
              </button>
            )}

            {/* Post Ad Button */}
            <button 
              onClick={handlePostAd}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium transition-colors"
            >
              Post an Ad
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
    </header>
  );
};

// Mobile Header Component
export const MobileHeader = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="block md:hidden bg-blue-900 text-white sticky top-0 z-50 safe-area-top">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 -ml-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="text-lg font-bold text-white">
            PhoneFlip<span className="text-green-400">.PK</span>
          </div>
          
          <button className="text-white p-2 -mr-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

// Bottom Navigation Component
export const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'sell', icon: Plus, label: 'Sell' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                isActive 
                  ? 'text-blue-900' 
                  : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-blue-900' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-blue-900 rounded-full mt-1" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Hero Section Component
export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  return (
    <section 
      className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12 md:py-20"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.9)), url('https://images.pexels.com/photos/31814919/pexels-photo-31814919.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Find Used Mobile Phones in Pakistan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100"
          >
            Browse thousands of verified phones from trusted sellers
          </motion.p>
        </div>

        {/* Desktop Search */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:block max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search by phone brand or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search Phones
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Filter className="w-5 h-5 mr-2" />
                Advanced Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Search */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="block md:hidden mx-4"
        >
          <div className="bg-white rounded-xl p-4 shadow-xl">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">City</option>
                  {cities.slice(0, 4).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Price</option>
                  {priceRanges.slice(0, 3).map(range => (
                    <option key={range} value={range}>{range.split(' - ')[0]}</option>
                  ))}
                </select>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-medium flex items-center justify-center text-lg">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Quick Categories Component
export const QuickCategories = () => {
  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Browse by Brand</h2>
          <p className="text-gray-600">Find phones from your favorite brands</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {phoneCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} ads</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Phone Card Component
export const PhoneCard = ({ phone }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative">
        <img 
          src={phone.image} 
          alt={phone.title}
          className="w-full h-48 md:h-56 object-cover"
        />
        {phone.featured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {phone.views}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">{phone.title}</h3>
          {phone.verified && (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
          )}
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">{phone.price}</span>
              {phone.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{phone.originalPrice}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {phone.location}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <HardDrive className="w-3 h-3 mr-1" />
              {phone.storage}
            </span>
            <span className="flex items-center">
              <Cpu className="w-3 h-3 mr-1" />
              {phone.ram}
            </span>
            <span className="flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              {phone.condition}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {phone.posted}
          </span>
          <button className="text-blue-600 hover:text-blue-700 flex items-center">
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Featured Phones Section
export const FeaturedPhones = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Phones</h2>
            <p className="text-gray-600">Hand-picked deals you don't want to miss</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredPhones.map((phone, index) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PhoneCard phone={phone} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Selling Section Component
export const SellingSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sell Your Phone on PhoneFlip and Get the Best Price
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of sellers who trust PhoneFlip to sell their phones quickly and safely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Post Your Ad */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg"
          >
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Post your Ad on PhoneFlip</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Post your Phone Ad for Free in 3 Easy Steps</span>
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
              <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Post Your Ad
              </button>
            </div>
          </motion.div>

          {/* Try PhoneFlip Sell It For Me */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg"
          >
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Try PhoneFlip Sell It For Me</h3>
              <ul className="space-y-3 mb-6">
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
              <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Register Your Phone
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
export const Footer = () => {
  const footerSections = [
    {
      title: 'PhoneFlip.PK',
      links: ['About Us', 'Contact Us', 'Career', 'Terms & Conditions', 'Privacy Policy']
    },
    {
      title: 'Buy Phones',
      links: ['Used iPhone', 'Used Samsung', 'Used Xiaomi', 'Used OnePlus', 'Phone Accessories']
    },
    {
      title: 'Sell Phones',
      links: ['Sell Your Phone', 'Phone Valuation', 'Sell It For Me', 'Success Stories', 'Seller Guidelines']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety Tips', 'Payment Guide', 'Inspection Guide', 'FAQs']
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16 pb-20 md:pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-2xl font-bold mb-4 md:mb-0">
              PhoneFlip<span className="text-green-400">.PK</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 PhoneFlip.PK. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Pakistan's largest mobile phone marketplace
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Mobile Menu Component
export const MobileMenu = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'used-phones', label: 'Used Phones', icon: Smartphone },
    { id: 'new-phones', label: 'New Phones', icon: Phone },
    { id: 'accessories', label: 'Accessories', icon: Battery },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'videos', label: 'Videos', icon: Camera },
    { id: 'forums', label: 'Forums', icon: MessageCircle },
    { id: 'blog', label: 'Blog', icon: Eye }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 md:hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <div className="text-xl font-bold text-blue-900">
                  PhoneFlip<span className="text-green-600">.PK</span>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 space-y-3">
                <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium">
                  Login / Sign Up
                </button>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium">
                  Post an Ad
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};