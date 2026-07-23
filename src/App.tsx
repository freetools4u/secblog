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

const getBasePath = () => {
  if (typeof window === 'undefined') return '';
  const initialPath = window.location.pathname;
  const segments = initialPath.split('/').filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];
    const isKnownSlug = BLOG_POSTS.some(p => p.slug === firstSegment);
    const isCategory = firstSegment === 'category';
    if (!isKnownSlug && !isCategory) {
      return `/${firstSegment}`;
    }
  }
  return '';
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

  const basePath = getBasePath();

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

      // Check if it's the category overview page (/category or /category/) or category detail
      if (pathName.endsWith('/category') || pathName.endsWith('/category/') || pathName.includes('/category')) {
        const categoryMatch = pathName.match(/\/category\/([^/]+)/);
        if (categoryMatch) {
          const catId = decodeURIComponent(categoryMatch[1]);
          setActiveCategory(catId);
          setSelectedPost(null);
          setIsNotFound(false);
          return;
        } else {
          setActiveCategory('all');
          setSelectedPost(null);
          setIsNotFound(false);
          return;
        }
      }

      // Match a known post slug anywhere in the path, typically at the end
      const matchedPost = BLOG_POSTS.find(p => 
        pathName === `/${p.slug}` || 
        pathName.endsWith(`/${p.slug}`) || 
        pathName.endsWith(`/${p.slug}/`)
      );

      if (matchedPost) {
        const slug = matchedPost.slug;
        setPosts(prev => {
          const matched = prev.find(p => p.slug === slug) || matchedPost;
          const updatedCount = (matched.readCount || 0) + 1;
          setSelectedPost({ ...matched, readCount: updatedCount });
          return prev.map(p => p.slug === slug ? { ...p, readCount: updatedCount } : p);
        });
        return;
      }

      const segments = pathName.split('/').filter(Boolean);
      // On local/custom domain, segments.length is 0. On GitHub Pages, segments.length is 1 (the repo name).
      if (segments.length <= 1) {
        setSelectedPost(null);
        setActiveCategory('all');
        return;
      }

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

    window.history.pushState(null, '', `${basePath}/${post.slug}`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    window.history.pushState(null, '', `${basePath}/`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    if (catId === 'all') {
      window.history.pushState(null, '', `${basePath}/`);
    } else {
      window.history.pushState(null, '', `${basePath}/category/${encodeURIComponent(catId)}`);
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
                      <span className="text-gray-500 font-semibold text-[rgba(11,48,215)]">{activeCategory}</span>
                    </nav>
                  </div>
                )}

                {/* Auto-scrolling Trending Post Ticker */}
                {popularPosts.length > 0 && (
                  <div className="mb-6.5 bg-[#FBFBF9] border border-gray-150 rounded-2xl px-4 py-3 flex items-center gap-3.5 overflow-hidden text-xs shadow-3xs">
                    <div className="flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white font-mono font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md select-none">
                      <Flame className="w-3 h-3 fill-current animate-pulse" />
                      <span>Trending</span>
                    </div>
                    <div className="flex-1 min-w-0 relative h-5 flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.button
                          key={tickerIndex}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          onClick={() => handleSelectPost(popularPosts[tickerIndex])}
                          className="absolute inset-0 text-left w-full truncate font-medium text-gray-800 hover:text-[rgba(11,48,215)] cursor-pointer transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:outline-hidden focus-visible:outline-hidden"
                        >
                          {popularPosts[tickerIndex]?.title}
                        </motion.button>
                      </AnimatePresence>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      {popularPosts.slice(0, 5).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTickerIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-150 cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:outline-hidden focus-visible:outline-hidden ${
                            idx === tickerIndex ? 'bg-[rgba(11,48,215)] scale-125' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          title={`Go to trending post #${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
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
                        <div className="w-12 h-full bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] rounded-full" />
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
                                      ? 'bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white shadow-sm'
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
                          className="mt-2 text-xs font-mono font-bold text-[rgba(11,48,215)] hover:underline cursor-pointer"
                        >
                          Reset active queries
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Trending / Popular Publications Sidebar (No Border/Outline) */}
                  <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2.5 text-[rgba(11,48,215)] rounded-full flex items-center justify-center shrink-0">
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
                                <h4 className="text-sm sm:text-base font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors line-clamp-2 leading-snug tracking-tight mb-0.5">
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-[rgba(11,48,215)]">
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
                          className="mt-1 text-xs sm:text-sm font-sans font-black text-[rgba(11,48,215)] hover:underline cursor-pointer flex items-center gap-1"
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
