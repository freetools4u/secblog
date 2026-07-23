import React from 'react';
import { ArrowLeft, Home, Compass, Search, BookOpen, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { BlogPost } from '../types';
import BlogCard from './BlogCard';

interface NotFoundPageProps {
  onBackToHome: () => void;
  onSelectCategory: (category: string) => void;
  onSelectPost: (post: BlogPost) => void;
  popularPosts: BlogPost[];
}

export default function NotFoundPage({
  onBackToHome,
  onSelectCategory,
  onSelectPost,
  popularPosts
}: NotFoundPageProps) {
  const categories = [
    { name: 'AI Productivity', id: 'AI Productivity' },
    { name: 'Career & Hiring', id: 'Career & Hiring' },
    { name: 'Education', id: 'Education' },
    { name: 'Design & Focus', id: 'Design & Focus' }
  ];

  return (
    <div className="min-h-[75vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-mono font-bold text-[rgba(11,48,215)] mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[rgba(11,48,215)] animate-pulse" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Big 404 Graphic */}
        <h1 className="text-6xl sm:text-8xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] mb-3">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight mb-3">
          Lost in the Knowledge Archive?
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto font-sans">
          The publication or slug you requested doesn't exist or may have been updated. Explore our curated topics below or head back to the main library.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white text-xs sm:text-sm font-sans font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Archive</span>
          </button>
        </div>

        {/* Category Shortcuts */}
        <div className="pt-6 border-t border-slate-200/60 mb-12">
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Explore Primary Knowledge Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-sans font-semibold text-slate-700 hover:text-[rgba(11,48,215)] shadow-xs transition-all cursor-pointer hover:bg-slate-50"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recommended Articles Section */}
      {popularPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full pt-8 border-t border-slate-200/60"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[rgba(11,48,215)]" />
              <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">
                Recommended Publications
              </h3>
            </div>
            <button
              onClick={onBackToHome}
              className="text-xs font-sans font-semibold text-[rgba(11,48,215)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all articles</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={() => onSelectPost(post)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
