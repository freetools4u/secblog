import React, { useState } from 'react';
import { Search, Menu, X, Layers, Compass, Facebook, Twitter, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const curatedCategories = [
    { name: 'AI Productivity', id: 'AI Productivity' },
    { name: 'Career & Hiring', id: 'Career & Hiring' },
    { name: 'Education', id: 'Education' },
    { name: 'Design & Focus', id: 'Design & Focus' }
  ];

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-15">
            
            {/* Left Section: Menu Toggle + Brand + Social Icons */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 -ml-1 text-white hover:text-white/80 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </button>

              <a
                href="https://blog.zenire.in"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    if (typeof window !== 'undefined' && (window.location.hostname === 'blog.zenire.in' || window.location.hostname === 'localhost' || window.location.hostname.includes('run.app'))) {
                      e.preventDefault();
                      handleCategorySelect('all');
                    }
                  }
                }}
                className="flex items-center gap-1.5 cursor-pointer group text-left"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-white text-[rgba(11,48,215)] rounded-md flex items-center justify-center font-sans font-extrabold text-xs sm:text-sm shadow-xs group-hover:scale-105 transition-transform">
                  Z
                </div>
                <span className="text-white font-sans font-black tracking-tight text-base sm:text-lg">
                  Zenire
                </span>
              </a>

              {/* Primary Top Navigation Bar - 4 Primary Categories for Google Sitelinks */}
              <nav aria-label="Primary Categories" className="hidden md:flex items-center gap-1.5 ml-2 xl:ml-6">
                {curatedCategories.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const catUrl = `/category/${encodeURIComponent(cat.id)}`;
                  return (
                    <a
                      key={cat.id}
                      href={catUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(cat.id);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-sans font-bold transition-all duration-150 whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-[rgba(11,48,215)] shadow-xs'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat.name}
                    </a>
                  );
                })}
              </nav>

              {/* Social Media Links */}
              <div className="hidden lg:flex items-center gap-3.5 text-white/90 ml-2">
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Section: Compact Search */}
            <div className="flex items-center gap-2">
              <div className="relative hidden lg:block mr-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-white/70" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-36 xl:w-44 pl-8 pr-3 py-1 text-xs bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md focus:outline-hidden focus:ring-1 focus:ring-white/40 focus:bg-white/15 transition-all"
                />
              </div>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 text-white hover:text-white/80 rounded-lg hover:bg-white/10 lg:hidden cursor-pointer"
                title="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          {showSearch && (
            <div className="py-2.5 border-t border-white/15 lg:hidden">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-white/60" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Drawer slide-out Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Sidebar Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full border-r border-gray-100"
            >
              {/* Drawer Header */}
              <div className="p-4.5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <div className="h-8 w-8 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white rounded-lg flex items-center justify-center font-sans font-bold text-sm shadow-xs">
                    Z
                  </div>
                  <div>
                    <span className="text-base font-sans font-bold text-gray-900 tracking-tight block leading-none">
                      Zenire
                    </span>
                    <span className="text-[9px] font-mono font-medium tracking-wider text-[rgba(11,48,215)] uppercase block mt-1.5">
                      Knowledge Menu
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4.5 space-y-6">

                {/* Curated Niche Sections */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    Curated Niche Sections
                  </h3>
                  <div className="space-y-1">
                    {curatedCategories.map((cat) => {
                      const isSelected = activeCategory === cat.id;
                      const catUrl = `/category/${encodeURIComponent(cat.id)}`;
                      return (
                        <a
                          key={cat.id}
                          href={catUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategorySelect(cat.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-sans font-medium transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 text-[rgba(11,48,215)] font-semibold'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-[rgba(11,48,215)]" />}
                        </a>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                <div className="text-[10px] text-gray-400 font-sans leading-relaxed">
                  © 2026 Zenire Blog. High performance & elite readability.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
