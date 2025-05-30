// Mobile Header Component - Simplified to only show logo
export const MobileHeader = () => {
  return (
    <header className="block md:hidden bg-blue-900 text-white sticky top-0 z-50 safe-area-top">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
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
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="fixed bottom-16 left-4 right-4 bg-white rounded-t-2xl z-50 md:hidden max-h-96 overflow-y-auto"
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