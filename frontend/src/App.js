import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Header, 
  MobileBottomNav, 
  HeroSection, 
  CompareSection,
  RecentListingsSection,
  SellSection, 
  FeaturedShopsSection,
  OurOfferingsSection,
  BrowseSection, 
  AccessoriesSection,
  ContentCardsSection,
  FeaturedPhones, 
  Footer,
  PriceDropAlertsModal,
  ComparisonPage,
  SignInModal,
  SignUpModal,
  ProfilePage,
  PostAdPage,
  SearchResultsPage,
  ShopOwnerDashboard,
  DetailedListingPage,
  DedicatedSearchPage
} from './Components';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [searchFilters, setSearchFilters] = useState(null);
  const [viewingListing, setViewingListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPriceDropModal, setShowPriceDropModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const handleSearch = (type, filters = {}) => {
    if (type === 'dedicated-search') {
      setSearchFilters(filters);
      setCurrentPage('dedicated-search');
    } else {
      setSearchFilters(type);
      setCurrentPage('search-results');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSearchFilters(null);
    setCurrentListingId(null);
  };

  const handleViewListing = (listingId) => {
    setCurrentListingId(listingId);
    setCurrentPage('listing-details');
  };

  const addToCompare = (phone) => {
    if (compareList.length < 3 && !compareList.find(p => p._id === phone._id)) {
      setCompareList([...compareList, phone]);
    }
  };

  const removeFromCompare = (phoneId) => {
    setCompareList(compareList.filter(p => p._id !== phoneId));
  };

  // Mobile view detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        compareCount={compareList.length}
        onCompareClick={() => setShowCompareModal(true)}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
      />
      
      <main className="pt-16 pb-20 md:pb-8">
        {currentPage === 'home' && (
          <div className="space-y-0">
            {/* 1. Hero Section with Centered Logo and Search */}
            <HeroSection 
              onCompareClick={() => setShowCompareModal(true)}
              onPriceAlertsClick={() => setShowPriceAlertsModal(true)}
              onSearch={handleSearch}
            />
            
            {/* 2. Recent Listings Section - Mobile and Desktop */}
            <RecentListingsSection onViewListing={handleViewListing} />
            
            {/* 3. Featured Phone Shops */}
            <FeaturedShopsSection />
            
            {/* 4. Featured Phones */}
            <FeaturedPhones 
              addToCompare={addToCompare}
              compareList={compareList}
              onViewListing={handleViewListing}
            />
            
            {/* 5. Our Special Offers (Offerings Section) */}
            <OurOfferingsSection 
              onCompareClick={() => setShowCompareModal(true)}
              onPriceAlertsClick={() => setShowPriceAlertsModal(true)}
            />
            
            {/* 6. Phone Accessories */}
            <AccessoriesSection />
            
            {/* 7. Sell to PhoneFlip Section */}
            <SellSection 
              isLoggedIn={isLoggedIn}
              setCurrentPage={setCurrentPage}
            />
            
            {/* 8. Videos & Blog Posts (Content Cards) */}
            <ContentCardsSection />
            
            {/* 9. Browse Phones Section */}
            <BrowseSection />
            
            {/* Compare Section - Keep for functionality */}
            <CompareSection 
              compareList={compareList}
              onCompareClick={() => setShowCompareModal(true)}
            />
          </div>
        )}
        
        {/* Post an Ad Page */}
        {currentPage === 'post-ad' && (
          <PostAdPage 
            user={user}
            setCurrentPage={setCurrentPage}
            onViewListing={handleViewListing}
          />
        )}
        
        {/* Dedicated Search Page */}
        {currentPage === 'dedicated-search' && (
          <DedicatedSearchPage 
            onBack={handleBackToHome}
            onViewListing={handleViewListing}
            initialFilters={searchFilters || {}}
          />
        )}
        
        {/* Search Results Page */}
        {currentPage === 'search-results' && (
          <SearchResultsPage 
            searchFilters={searchFilters}
            onBack={handleBackToHome}
            onViewListing={handleViewListing}
          />
        )}
        
        {/* Detailed Listing Page */}
        {currentPage === 'profile' && (
          <ProfilePage 
            user={user}
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'listing-details' && currentListingId && (
          <DetailedListingPage 
            listingId={currentListingId}
            setCurrentPage={setCurrentPage}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {/* Shop Owner Dashboard */}
        {currentPage === 'dashboard' && user?.role === 'shop_owner' && (
          <ShopOwnerDashboard 
            user={user}
            setCurrentPage={setCurrentPage}
          />
        )}
        
        {/* Used Phones Page */}
        {currentPage === 'used-phones' && (
          <SearchResultsPage 
            searchFilters={{}}
            onBack={handleBackToHome}
          />
        )}
        
        {/* Accessories Page */}
        {currentPage === 'accessories' && (
          <SearchResultsPage 
            searchFilters={{ category: 'accessories' }}
            onBack={handleBackToHome}
          />
        )}
        
        {/* Reviews Page */}
        {currentPage === 'reviews' && (
          <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Phone Reviews</h1>
                <p className="text-gray-600 mb-8">Expert reviews and user ratings for the latest mobile phones.</p>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Reviews Coming Soon</h3>
                  <p className="text-gray-500">We're working on bringing you comprehensive phone reviews.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Videos Page */}
        {currentPage === 'videos' && (
          <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Phone Videos</h1>
                <p className="text-gray-600 mb-8">Watch video reviews, unboxings, and comparisons.</p>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Videos Coming Soon</h3>
                  <p className="text-gray-500">We're creating video content for phone enthusiasts.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Blog Page */}
        {currentPage === 'blog' && (
          <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">PhoneFlip Blog</h1>
                <p className="text-gray-600 mb-8">Latest news, tips, and insights from the mobile world.</p>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Blog Posts Coming Soon</h3>
                  <p className="text-gray-500">Stay tuned for mobile industry insights and tips.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other pages would render here based on currentPage */}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          compareCount={compareList.length}
          onCompareClick={() => setShowCompareModal(true)}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {showPriceAlertsModal && (
        <PriceDropAlertsModal 
          isOpen={showPriceAlertsModal}
          onClose={() => setShowPriceAlertsModal(false)}
        />
      )}

      {showCompareModal && (
        <CompareModal 
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          compareList={compareList}
          onRemove={removeFromCompare}
          clearCompare={() => setCompareList([])}
        />
      )}

      {showSignInModal && (
        <SignInModal 
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onLogin={handleLogin}
          onSwitchToSignUp={() => {
            setShowSignInModal(false);
            setShowSignUpModal(true);
          }}
        />
      )}

      {showSignUpModal && (
        <SignUpModal 
          isOpen={showSignUpModal}
          onClose={() => {
            setShowSignUpModal(false);
            setSignUpType('normal'); // Reset to normal user selection
          }}
          onSignup={handleLogin}
          signUpType={signUpType}
          setSignUpType={setSignUpType}
          onSwitchToSignIn={() => {
            setShowSignUpModal(false);
            setShowSignInModal(true);
            setSignUpType('normal'); // Reset to normal user selection
          }}
        />
      )}
    </div>
  );
}

export default App;