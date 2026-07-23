import React from 'react';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  key?: string | number;
  post: BlogPost;
  onClick: () => void;
}

export const getCategoryStyle = (category: string, title?: string) => {
  const normalizedTitle = title?.toLowerCase() || '';
  if (normalizedTitle.includes('resume')) {
    return {
      text: 'HIRING',
      badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      arrowBg: 'bg-emerald-50 group-hover:bg-emerald-600',
      arrowIcon: 'text-emerald-600 group-hover:text-white',
      numberBg: 'bg-emerald-50/70 text-emerald-600',
    };
  }
  if (normalizedTitle.includes('recruitment') || normalizedTitle.includes('hiring')) {
    return {
      text: 'HIRING',
      badge: 'bg-pink-50 text-pink-600 border-pink-100',
      arrowBg: 'bg-pink-50 group-hover:bg-pink-600',
      arrowIcon: 'text-pink-600 group-hover:text-white',
      numberBg: 'bg-pink-50/70 text-pink-600',
    };
  }
  
  switch (category) {
    case 'AI Productivity':
      return {
        text: 'AI TOOLS',
        badge: 'bg-violet-50 text-violet-600 border-violet-100',
        arrowBg: 'bg-violet-50 group-hover:bg-violet-600',
        arrowIcon: 'text-violet-600 group-hover:text-white',
        numberBg: 'bg-violet-50/70 text-violet-600',
      };
    case 'Career & Hiring':
      return {
        text: 'CAREER',
        badge: 'bg-orange-50 text-orange-600 border-orange-100',
        arrowBg: 'bg-orange-50 group-hover:bg-orange-600',
        arrowIcon: 'text-orange-600 group-hover:text-white',
        numberBg: 'bg-orange-50/70 text-orange-600',
      };
    case 'Education':
      return {
        text: 'EDUCATION',
        badge: 'bg-blue-50 text-blue-600 border-blue-100',
        arrowBg: 'bg-blue-50 group-hover:bg-blue-600',
        arrowIcon: 'text-blue-600 group-hover:text-white',
        numberBg: 'bg-blue-50/70 text-blue-600',
      };
    case 'Design & Focus':
      return {
        text: 'DESIGN & FOCUS',
        badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        arrowBg: 'bg-emerald-50 group-hover:bg-emerald-600',
        arrowIcon: 'text-emerald-600 group-hover:text-white',
        numberBg: 'bg-emerald-50/70 text-emerald-600',
      };
    default:
      return {
        text: 'RESOURCES',
        badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        arrowBg: 'bg-emerald-50 group-hover:bg-emerald-600',
        arrowIcon: 'text-emerald-600 group-hover:text-white',
        numberBg: 'bg-emerald-50/70 text-emerald-600',
      };
  }
};

export default function BlogCard({ post, onClick }: BlogCardProps) {
  const styles = getCategoryStyle(post.category, post.title);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article 
      onClick={onClick}
      className="group bg-white border border-gray-100 hover:border-gray-200/85 rounded-2xl overflow-hidden hover:bg-gray-50/20 cursor-pointer transition-all duration-300 flex flex-col w-full h-full"
    >
      {/* Cover Image Wrapper with clean ratio */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50 shrink-0">
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge overlayed on top-right */}
        <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase border rounded-md shadow-sm ${styles.badge} backdrop-blur-xs bg-white/90`}>
          {styles.text}
        </span>
      </div>

      {/* Post Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5 justify-between">
        <div className="mb-2">
          {/* Title */}
          <h3 className="text-sm sm:text-base md:text-lg font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors line-clamp-2 leading-snug tracking-tight mb-1">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 text-[11px] sm:text-xs leading-normal sm:leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Metadata Footer with Arrow */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100/80">
          <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
              {post.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
              {formattedDate}
            </span>
          </div>
          <div className={`w-6.5 h-6.5 sm:w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${styles.arrowBg}`}>
            <ArrowRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 ${styles.arrowIcon}`} />
          </div>
        </div>
      </div>
    </article>
  );
}

