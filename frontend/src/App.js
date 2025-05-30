import React, { useState } from 'react';
import './App.css';
import {
  DesktopHeader,
  MobileHeader,
  BottomNavigation,
  HeroSection,
  QuickCategories,
  FeaturedPhones,
  SellingSection,
  Footer,
  MobileMenu,
  PostAdModal
} from './Components';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection />
            <QuickCategories />
            <FeaturedPhones />
            <SellingSection />
          </>
        );
      case 'search':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Search</h2>
                <p className="text-gray-600">Search functionality coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'sell':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sell Your Phone</h2>
                <p className="text-gray-600 mb-6">Post your ad and reach thousands of buyers</p>
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Post an Ad
                </button>
              </div>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
                <p className="text-gray-600">Chat functionality coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                <p className="text-gray-600">Profile section coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <HeroSection />
            <QuickCategories />
            <FeaturedPhones />
            <SellingSection />
          </>
        );
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} setIsPostAdOpen={setIsPostAdOpen} />
      </div>
      
      {/* Mobile Header - visible only on mobile */}
      <div className="block lg:hidden">
        <MobileHeader 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          setIsPostAdOpen={setIsPostAdOpen}
          setActiveTab={setActiveTab}
        />
      </div>
      
      {/* Mobile Side Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        setIsOpen={setIsMenuOpen} 
        setActiveTab={setActiveTab}
        setIsPostAdOpen={setIsPostAdOpen}
      />
      
      {/* Main Content */}
      <main className="min-h-screen pb-20 lg:pb-0">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Bottom Navigation - Mobile Only */}
      <div className="block lg:hidden">
        <BottomNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setIsPostAdOpen={setIsPostAdOpen}
        />
      </div>

      {/* Post Ad Modal */}
      <PostAdModal isOpen={isPostAdOpen} setIsOpen={setIsPostAdOpen} />
    </div>
  );
}

export default App;