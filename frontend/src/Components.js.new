export const HeroSection = ({ onCompareClick, onPriceAlertsClick, onSearch }) => {
  return (
    <section className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 py-12 md:py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 md:space-y-12">
          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight lg:leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Find Your Dream Phone
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 font-medium leading-relaxed max-w-3xl mx-auto">
              Buy & Sell phones with confidence. From the latest flagship to budget-friendly options.
            </p>
          </div>
          
          {/* Subtitle */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-center space-x-2 md:space-x-3">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-base md:text-lg lg:text-xl text-blue-100/90 font-medium">
                🇵🇰 Pakistan's #1 Mobile Phone Marketplace
              </p>
            </div>
          </div>

          {/* Simple Search Bar */}
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

              {/* Search Button */}
              <button 
                onClick={() => onSearch && onSearch('dedicated-search')}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
                <span>Find Phones</span>
              </button>
            </div>
          </div>
            
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">50K+</div>
              <div className="text-sm md:text-base text-blue-200">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">15K+</div>
              <div className="text-sm md:text-base text-blue-200">Phones Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">500+</div>
              <div className="text-sm md:text-base text-blue-200">Verified Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">24/7</div>
              <div className="text-sm md:text-base text-blue-200">Support</div>
            </div>
          </div>

          {/* Feature Highlights - New Addition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Compare Prices</h3>
              <p className="text-blue-200 text-sm md:text-base">Find the best deals from verified sellers across Pakistan</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                <Battery className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Quality Assured</h3>
              <p className="text-blue-200 text-sm md:text-base">All phones verified with detailed condition reports</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Quick Delivery</h3>
              <p className="text-blue-200 text-sm md:text-base">Fast and secure delivery to your doorstep</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-6 md:pt-8">
            <button 
              onClick={onCompareClick}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sliders className="w-5 h-5" />
              <span>Compare Phones</span>
            </button>
            <button 
              onClick={onPriceAlertsClick}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Bell className="w-5 h-5" />
              <span>Price Alerts</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};