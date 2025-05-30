import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Header, 
  MobileBottomNav, 
  HeroSection, 
  CompareSection,
  SellSection, 
  FeaturedShopsSection,
  OurOfferingsSection,
  BrowseSection, 
  AccessoriesSection,
  ContentCardsSection,
  FeaturedPhones, 
  Footer,
  PriceDropAlertsModal,
  CompareModal,
  PostAdPage,
  SearchResultsPage
} from './Components';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPriceAlertsModal, setShowPriceAlertsModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [searchFilters, setSearchFilters] = useState(null);

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

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage('search-results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSearchFilters(null);
  };

  const addToCompare = (phone) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === phone.id)) {
      setCompareList([...compareList, phone]);
    }
  };

  const removeFromCompare = (phoneId) => {
    setCompareList(compareList.filter(p => p.id !== phoneId));
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
      />
      
      <main className="pt-16 pb-20 md:pb-8">
        {currentPage === 'home' && (
          <div className="space-y-0">
            {/* Hero Section with Enhanced Search */}
            <HeroSection 
              onCompareClick={() => setShowCompareModal(true)}
              onPriceAlertsClick={() => setShowPriceAlertsModal(true)}
            />
            
            {/* Compare Section */}
            <CompareSection 
              compareList={compareList}
              onCompareClick={() => setShowCompareModal(true)}
            />
            
            {/* Enhanced Selling Section */}
            <SellSection 
              isLoggedIn={isLoggedIn}
              setCurrentPage={setCurrentPage}
            />
            
            {/* Featured Shops Section */}
            <FeaturedShopsSection />
            
            {/* Our Offerings Section */}
            <OurOfferingsSection 
              onCompareClick={() => setShowCompareModal(true)}
              onPriceAlertsClick={() => setShowPriceAlertsModal(true)}
            />
            
            {/* Featured Phones */}
            <FeaturedPhones 
              addToCompare={addToCompare}
              compareList={compareList}
            />
            
            {/* Accessories Section */}
            <AccessoriesSection />
            
            {/* Content Cards Section */}
            <ContentCardsSection />
            
            {/* Browse Section */}
            <BrowseSection />
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
        />
      )}
    </div>
  );
}

export default App;