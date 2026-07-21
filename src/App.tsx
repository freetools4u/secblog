import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from './data/blogPosts';
import { BlogPost } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronRight, Flame, Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogCard, { getCategoryStyle } from './components/BlogCard';
import BlogPostComponent from './components/BlogPost';
import SEOHead from './components/SEOHead';

const CATEGORY_META: Record<string, { title: string; desc: string; accentColor: string; badgeText: string }> = {
  'AI Productivity': {
    title: 'AI Productivity & Tools',
    desc: 'Deep-dives into prompt engineering, automated developer workflows, intelligent agents, and cutting-edge productivity multipliers.',
    accentColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    badgeText: 'Artificial Intelligence'
  },
  'Career & Hiring': {
    title: 'Career & Professional Growth',
    desc: 'Expert blueprints for CV construction, technical interview preparation, salary negotiation, and ascending the professional ladder.',
    accentColor: 'bg-blue-50 text-blue-700 border-blue-100',
    badgeText: 'Professional Dev'
  },
  'Education': {
    title: 'Education & Learning Blueprints',
    desc: 'High-density cognitive frameworks, dynamic study schedules, digital portfolios, and modern educational strategies.',
    accentColor: 'bg-purple-50 text-purple-700 border-purple-100',
    badgeText: 'Pedagogy & Design'
  },
  'Design & Focus': {
    title: 'Design, Aesthetics & Mental Focus',
    desc: 'Visual craftsmanship, typographic balance, minimal user experience patterns, and peak cognitive performance structures.',
    accentColor: 'bg-amber-50 text-amber-700 border-amber-100',
    badgeText: 'UX & Cognitive Flow'
  }
};

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(() => [...BLOG_POSTS]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Sets a standard, visually interactive page size for pagination

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-scroll the trending ticker
  useEffect(() => {
    const popularLength = Math.min(posts.length, 5);
    if (popularLength <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % popularLength);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts.length]);

  // Reset pagination to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Sync page view state with URL pathname to allow direct shareable SEO friendly links
  useEffect(() => {
    const handlePathChange = () => {
      const pathName = window.location.pathname;
      setIsNotFound(false);

      if (pathName.startsWith('/category/')) {
        const catId = decodeURIComponent(pathName.replace('/category/', ''));
        setActiveCategory(catId);
        setSelectedPost(null);
        return;
      } else if (pathName === '/' || pathName === '') {
        setSelectedPost(null);
        setActiveCategory('all');
        return;
      }

      // Try matching slug directly from path name for super SEO-friendly URL
      let slug = pathName.replace(/^\//, '');
      if (slug.startsWith('post/')) {
        slug = slug.replace(/^post\//, '');
      }
      // Strip trailing slash
      slug = slug.replace(/\/+$/, '');

      const foundPost = BLOG_POSTS.find((p) => p.slug === slug);
      if (foundPost) {
        // Increment read count reactively in list
        setPosts(prev => {
          const matched = prev.find(p => p.slug === slug) || foundPost;
          const updatedCount = (matched.readCount || 0) + 1;
          
          // Set selected post immediately
          setSelectedPost({ ...matched, readCount: updatedCount });
          
          return prev.map(p => p.slug === slug ? { ...p, readCount: updatedCount } : p);
        });
        return;
      }
      
      // Default fallback if path doesn't match any route
      setIsNotFound(true);
      setSelectedPost(null);
    };

    // Check pathname on mount and when it changes
    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Dynamically sort popular posts by readCount (descending)
  const popularPosts = [...posts].sort((a, b) => (b.readCount || 0) - (a.readCount || 0));

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Helper to trigger navigation
  const handleSelectPost = (post: BlogPost) => {
    const updatedCount = (post.readCount || 0) + 1;
    setPosts(prev =>
      prev.map(p => p.id === post.id ? { ...p, readCount: updatedCount } : p)
    );
    setSelectedPost({ ...post, readCount: updatedCount });

    window.history.pushState(null, '', `/${post.slug}`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    window.history.pushState(null, '', `/`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    if (catId === 'all') {
      window.history.pushState(null, '', `/`);
    } else {
      window.history.pushState(null, '', `/category/${encodeURIComponent(catId)}`);
    }
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic values for the SEOHead component
  const getSEOConfig = () => {
    if (selectedPost) {
      return {
        title: selectedPost.title,
        description: selectedPost.metaDescription || selectedPost.excerpt,
        keywords: selectedPost.keywords,
        post: selectedPost,
      };
    }
    if (activeCategory !== 'all') {
      return {
        title: `Latest Guides in ${activeCategory}`,
        description: `Explore highly-researched, professional publications covering ${activeCategory}. Built for immediate implementation.`,
        keywords: [activeCategory.toLowerCase(), 'tutorial', 'best practices', 'resources'],
      };
    }
    return {
      title: 'Zenire Knowledge Platform - AI Productivity, Careers & Education',
      description: 'Explore deep-dive technical articles and strategies for AI automation loops, professional resumes, and cognitive learning.',
      keywords: ['ai productivity', 'career strategies', 'modern education portfolio'],
    };
  };

  const seo = getSEOConfig();

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col font-sans selection:bg-blue-100 selection:text-[#2563eb]">
      
      {/* Inject Dynamic Head Elements (Title, Meta, JSON-LD) */}
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        post={seo.post}
      />

      {/* Primary Sticky Nav Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={handleCategorySelect}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (selectedPost) {
            handleBackToFeed();
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: Blog Post Detail */}
          {selectedPost && (
            <motion.div
              key="post-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <BlogPostComponent post={selectedPost} onBack={handleBackToFeed} />
            </motion.div>
          )}

          {/* VIEW 2: 404 Route Fallback Error Page */}
          {isNotFound && !selectedPost && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center max-w-md mx-auto"
            >
              <h2 className="text-2xl font-sans font-extrabold text-gray-900 tracking-tight">
                Publication Not Found
              </h2>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                We couldn't resolve this slug in our static database. It might have been migrated or re-indexed.
              </p>
              <button
                onClick={handleBackToFeed}
                className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#2563eb]/90 transition-all cursor-pointer shadow-xs"
              >
                Return to home archive
              </button>
            </motion.div>
          )}

          {/* VIEW 3: Core Blog List Feed */}
          {!selectedPost && !isNotFound && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Category Page Header or Main Feed */}
              <div className="max-w-7xl mx-auto px-3.5 sm:px-5 lg:px-6 py-4">
                
                {activeCategory !== 'all' && (
                  <div className="mb-4">
                    {/* Breadcrumbs with clean style */}
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-sans text-gray-400 tracking-wide select-none">
                      <button 
                        onClick={handleBackToFeed}
                        className="hover:text-gray-700 transition-colors cursor-pointer font-medium"
                      >
                        Home
                      </button>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-400 font-normal">Category</span>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-500 font-semibold text-[#2563eb]">{activeCategory}</span>
                    </nav>
                  </div>
                )}

                {/* Stylish Category Buttons Filter Row */}
                <div className="mb-6.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none select-none">
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setCurrentPage(1);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold transition-all duration-200 cursor-pointer border shrink-0 ${
                        activeCategory === 'all'
                          ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-3xs'
                      }`}
                    >
                      All Archive
                    </button>
                    {Object.keys(CATEGORY_META).map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setCurrentPage(1);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold transition-all duration-200 cursor-pointer border shrink-0 ${
                            isActive
                              ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-3xs'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Unified Layout with Left: Blog feed, Right: Popular sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  
                  {/* Left Column: Feed header and list of cards */}
                  <div className="lg:col-span-8 space-y-3.5 border-b border-gray-150/60 pb-8 mb-6 lg:mb-0 lg:border-b-0 lg:border-r lg:border-gray-150/60 lg:pr-8">
                    
                    {/* Compact & Stylish Title */}
                    <div className="relative pb-3 mb-5">
                      <h2 className="text-xl sm:text-2xl font-sans font-black text-gray-900 tracking-tight leading-none">
                        {activeCategory === 'all' ? 'Latest Posts' : `Recent ${activeCategory} Publications`}
                      </h2>
                      {/* Stylish accent underline */}
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-100/80">
                        <div className="w-12 h-full bg-[#2563eb] rounded-full" />
                      </div>
                    </div>

                    {/* Feed List */}
                    {filteredPosts.length > 0 ? (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
                          {paginatedPosts.map((post) => {
                            return (
                              <BlogCard
                                key={post.id}
                                post={post}
                                onClick={() => handleSelectPost(post)}
                              />
                            );
                          })}
                        </div>

                        {/* Beautiful Pagination Controls */}
                        {filteredPosts.length > 0 && (
                          <div className="flex items-center justify-between pt-4.5 font-mono text-xs">
                            <button
                              onClick={() => {
                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === 1}
                              className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 disabled:opacity-50 disabled:hover:border-gray-100 text-gray-700 bg-white shadow-xs cursor-pointer disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-1 font-bold"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                            
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center font-bold transition-all duration-150 cursor-pointer ${
                                    currentPage === page
                                      ? 'bg-[#2563eb] text-white shadow-sm'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 disabled:opacity-50 disabled:hover:border-gray-100 text-gray-700 bg-white shadow-xs cursor-pointer disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-1 font-bold"
                            >
                              Next <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 border border-gray-100 border-dashed rounded-xl max-w-md mx-auto">
                        <p className="text-gray-500 font-sans text-xs">
                          No publications found matching your parameters.
                        </p>
                        <button
                          onClick={() => {
                            handleCategorySelect('all');
                            setSearchQuery('');
                          }}
                          className="mt-2 text-xs font-mono font-bold text-[#2563eb] hover:underline cursor-pointer"
                        >
                          Reset active queries
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Trending / Popular Publications Sidebar (No Border/Outline) */}
                  <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2.5 text-[#2563eb] rounded-full flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-xl font-sans font-black text-gray-900 tracking-tight leading-none">
                          Popular Posts
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 leading-none">
                          Top reads from our community this week.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0 divide-y divide-gray-100/80 bg-transparent">
                      {(() => {
                        return popularPosts.slice(0, 10).map((popPost, idx) => {
                          const styles = getCategoryStyle(popPost.category, popPost.title);
                          return (
                            <button
                              key={popPost.id}
                              onClick={() => handleSelectPost(popPost)}
                              className="group text-left w-full flex items-center gap-3 py-3 bg-transparent hover:bg-gray-50/40 px-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer"
                            >
                              {/* Left Side: Number Badge */}
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-mono font-black text-base ${styles.numberBg}`}>
                                {idx + 1}
                              </div>

                              {/* Details Container */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono text-gray-400">
                                    {popPost.readTime}
                                  </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-sans font-extrabold text-gray-900 group-hover:text-[#2563eb] transition-colors line-clamp-2 leading-snug tracking-tight mb-0.5">
                                  {popPost.title}
                                </h4>
                                <p className="text-gray-500 text-xs leading-normal line-clamp-2">
                                  {popPost.excerpt}
                                </p>
                              </div>

                              {/* Arrow Button */}
                              <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ml-auto ${styles.arrowBg}`}>
                                <ArrowRight className={`w-3 h-3 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-0.5 ${styles.arrowIcon}`} />
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Discover Footer Box */}
                    <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-[#2563eb]">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700 font-bold leading-tight">
                          Discover more trending insights and in-depth guides.
                        </p>
                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="mt-1 text-xs sm:text-sm font-sans font-black text-[#2563eb] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          Explore all articles <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </aside>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Primary Footer Element */}
      <Footer onSelectCategory={handleCategorySelect} />

    </div>
  );
}
