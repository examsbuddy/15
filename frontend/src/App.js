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
  PostAdModal,
  ReviewsPage,
  VideosPage,
  ForumsPage,
  BlogPage,
  ProfileDashboard,
  MyAdsPage,
  LoginModal
} from './Components';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));

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
      case 'my-ads':
        return <MyAdsPage />;
      case 'used-phones':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Used Phones</h2>
                <p className="text-gray-600">Browse thousands of used mobile phones</p>
              </div>
            </div>
          </div>
        );
      case 'new-phones':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">New Phones</h2>
                <p className="text-gray-600">Discover the latest mobile phones</p>
              </div>
            </div>
          </div>
        );
      case 'accessories':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessories</h2>
                <p className="text-gray-600">Find phone cases, chargers, and more</p>
              </div>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="pt-20 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Search</h2>
                <p className="text-gray-600">Advanced search functionality</p>
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
                <p className="text-gray-600">Your chat conversations with buyers and sellers</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileDashboard />;
      case 'reviews':
        return <ReviewsPage />;
      case 'videos':
        return <VideosPage />;
      case 'forums':
        return <ForumsPage />;
      case 'blog':
        return <BlogPage />;
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
      {/* Desktop Header - hidden on mobile/tablet */}
      <div className="hidden sm:block">
        <DesktopHeader activeTab={activeTab} setActiveTab={setActiveTab} setIsPostAdOpen={setIsPostAdOpen} />
      </div>
      
      {/* Mobile Header - visible on mobile/tablet */}
      <div className="block sm:hidden">
        <MobileHeader />
      </div>
      
      {/* Main Content */}
      <main className="min-h-screen pb-20 sm:pb-0">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Bottom Navigation - Mobile/Tablet Only */}
      <div className="block sm:hidden">
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