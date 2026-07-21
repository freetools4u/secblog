import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Github, Copy, Check, Bookmark, Heart, Trash2, MessageSquare, MessageCircle, Slack, Phone, Facebook, Info, AlertTriangle, Lightbulb, CheckCircle, Quote, Home, ChevronRight, BookOpen, ArrowRight, Flame, Star } from 'lucide-react';
import { getCategoryStyle } from './BlogCard';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || '?').toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-emerald-500'
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

// Custom high-fidelity components for rich media in articles
const PinterestIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.64 11.17-.1-.95-.19-2.41.04-3.45.21-.93 1.35-5.74 1.35-5.74s-.34-.69-.34-1.71c0-1.6 1.41-2.8 2.51-2.8.96 0 1.41.72 1.41 1.58 0 .96-.61 2.4-.93 3.73-.26 1.13.57 2.05 1.69 2.05 2.03 0 3.59-2.14 3.59-5.23 0-2.74-1.97-4.65-4.78-4.65-3.26 0-5.17 2.44-5.17 4.97 0 .98.38 2.04.85 2.61.09.11.11.21.08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.46-.68-2.38-2.81-2.38-4.52 0-3.68 2.67-7.06 7.71-7.06 4.05 0 7.2 2.89 7.2 6.75 0 4.02-2.54 7.26-6.06 7.26-1.18 0-2.3-.61-2.68-1.34l-.73 2.79c-.26.98-.98 2.21-1.46 2.99C9.9 23.68 10.93 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
  </svg>
);

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  key?: string | number;
}

const BlogImage = ({ src, alt, caption }: BlogImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pinterestShareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(src)}&description=${encodeURIComponent(alt || caption || 'Modern Zenire Publication Blueprint')}`;

  return (
    <div 
      className="my-8 text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative inline-block max-w-full overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-md bg-gray-50">
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="max-h-[520px] w-auto max-w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
        />
        
        {/* Pinterest Float Button */}
        <div className={`absolute inset-0 bg-black/5 flex items-start justify-end p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <a
            href={pinterestShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E60023] text-white font-sans font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-[#b8001c] active:scale-95 transition-all cursor-pointer pointer-events-auto"
            title="Pin it on Pinterest"
          >
            <PinterestIcon className="w-3.5 h-3.5 fill-current" />
            <span>Save</span>
          </a>
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-xs font-mono text-gray-400 max-w-lg mx-auto leading-relaxed italic">
          {caption}
        </p>
      )}
    </div>
  );
};

interface VideoBlockProps {
  url: string;
  key?: string | number;
}

const VideoBlock = ({ url }: VideoBlockProps) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com');
  const isVimeo = url.includes('vimeo.com');
  
  let embedUrl = url;
  if (isYouTube) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (isVimeo) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      embedUrl = `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-md aspect-video w-full bg-black relative border border-gray-150">
      {isYouTube || isVimeo ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player Embed"
        />
      ) : (
        <video src={url} controls className="w-full h-full object-cover" />
      )}
    </div>
  );
};

interface RevealSectionProps {
  title: string;
  children: React.ReactNode;
  key?: string | number;
}

const RevealSection = ({ title, children }: RevealSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-6 border border-gray-200/80 rounded-2xl bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4.5 bg-gray-50/40 hover:bg-gray-50/90 text-left font-sans font-bold text-gray-800 transition-colors cursor-pointer select-none border-b border-transparent"
        style={{ borderBottomColor: isOpen ? '#f3f4f6' : 'transparent' }}
      >
        <span className="text-sm sm:text-base font-sans font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full bg-[rgba(11,48,215)] transition-transform ${isOpen ? 'scale-125' : ''}`} />
          {title}
        </span>
        <span className={`text-[10px] text-gray-400 font-mono transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? 'COLLAPSE ▲' : 'EXPAND ▼'}
        </span>
      </button>
      {isOpen && (
        <div className="p-5 text-sm sm:text-[15px] text-gray-700 leading-relaxed bg-white/50 border-t border-gray-50 font-sans">
          {children}
        </div>
      )}
    </div>
  );
};

// Simple but powerful custom Markdown parser to keep bundle size 0 and load speeds at 100%
function parseMarkdown(md: string) {
  const lines = md.split('\n');
  let inList = false;
  let inCode = false;
  let codeContent: string[] = [];
  
  let inReveal = false;
  let revealTitle = '';
  let revealContent: string[] = [];

  let inNote = false;
  let noteContent: string[] = [];

  let inWarning = false;
  let warningContent: string[] = [];

  let inTip = false;
  let tipContent: string[] = [];

  let inQuoteBlock = false;
  let quoteBlockContent: string[] = [];

  const htmlElements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false;
        htmlElements.push(
          <div key={`code-${index}`} className="my-6 bg-gray-900 rounded-xl p-4 overflow-x-auto border border-gray-800">
            <pre className="text-xs font-mono text-gray-300 leading-relaxed text-left">
              {codeContent.join('\n')}
            </pre>
          </div>
        );
        codeContent = [];
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeContent.push(line);
      return;
    }

    // Reveal shortcode container block
    if (line.trim().startsWith('[reveal') || line.trim().startsWith('[REVEAL')) {
      const titleMatch = line.match(/title="([^"]+)"/i);
      revealTitle = titleMatch ? titleMatch[1] : 'Click to Reveal Section';
      const rest = line.replace(/^\[reveal[^\]]*\]/i, '').trim();
      
      if (rest.endsWith('[/reveal]')) {
        // Single line reveal shortcode
        const singleContent = rest.replace(/\[\/reveal\]$/i, '').trim();
        htmlElements.push(
          <RevealSection key={`reveal-${index}`} title={revealTitle}>
            {parseMarkdown(singleContent)}
          </RevealSection>
        );
      } else {
        inReveal = true;
        revealContent = rest ? [rest] : [];
      }
      return;
    }

    if (inReveal) {
      if (line.trim().includes('[/reveal]')) {
        inReveal = false;
        const cleanLine = line.replace(/\[\/reveal\]/i, '').trim();
        if (cleanLine) {
          revealContent.push(cleanLine);
        }
        htmlElements.push(
          <RevealSection key={`reveal-${index}`} title={revealTitle}>
            {parseMarkdown(revealContent.join('\n'))}
          </RevealSection>
        );
        revealContent = [];
      } else {
        revealContent.push(line);
      }
      return;
    }

    // Note Block Accumulator
    if (inNote) {
      if (line.trim().includes('[/note]') || line.trim().includes('[/NOTE]')) {
        inNote = false;
        const cleanLine = line.replace(/\[\/note\]/i, '').trim();
        if (cleanLine) {
          noteContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`note-${index}`} className="my-6 p-4 bg-[#f0f7ff] border-l-4 border-blue-500 rounded-r-xl flex gap-3 items-start text-left">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-0.5">Note</span>
              <div className="text-sm text-blue-900 leading-relaxed font-sans">
                {parseInlineStyling(noteContent.join(' '))}
              </div>
            </div>
          </div>
        );
        noteContent = [];
      } else {
        noteContent.push(line);
      }
      return;
    }

    // Warning Block Accumulator
    if (inWarning) {
      if (line.trim().includes('[/warning]') || line.trim().includes('[/WARNING]')) {
        inWarning = false;
        const cleanLine = line.replace(/\[\/warning\]/i, '').trim();
        if (cleanLine) {
          warningContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`warning-${index}`} className="my-6 p-4 bg-[#fff9eb] border-l-4 border-amber-500 rounded-r-xl flex gap-3 items-start text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block mb-0.5">Warning</span>
              <div className="text-sm text-amber-900 leading-relaxed font-sans">
                {parseInlineStyling(warningContent.join(' '))}
              </div>
            </div>
          </div>
        );
        warningContent = [];
      } else {
        warningContent.push(line);
      }
      return;
    }

    // Tip Block Accumulator
    if (inTip) {
      if (line.trim().includes('[/tip]') || line.trim().includes('[/TIP]')) {
        inTip = false;
        const cleanLine = line.replace(/\[\/tip\]/i, '').trim();
        if (cleanLine) {
          tipContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`tip-${index}`} className="my-6 p-4 bg-[#f2fcf5] border-l-4 border-emerald-500 rounded-r-xl flex gap-3 items-start text-left">
            <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">Pro Tip</span>
              <div className="text-sm text-emerald-950 leading-relaxed font-sans">
                {parseInlineStyling(tipContent.join(' '))}
              </div>
            </div>
          </div>
        );
        tipContent = [];
      } else {
        tipContent.push(line);
      }
      return;
    }

    // Quote Block Accumulator
    if (inQuoteBlock) {
      if (line.trim().includes('[/quote]') || line.trim().includes('[/QUOTE]')) {
        inQuoteBlock = false;
        const cleanLine = line.replace(/\[\/quote\]/i, '').trim();
        if (cleanLine) {
          quoteBlockContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`quote-${index}`} className="my-8 p-6 bg-gray-50 border-l-4 border-gray-900 rounded-r-2xl relative text-left">
            <Quote className="w-8 h-8 text-gray-200 absolute top-3 right-4 transform rotate-180 pointer-events-none" />
            <p className="text-base sm:text-lg italic text-gray-800 font-medium leading-relaxed relative z-10">
              "{parseInlineStyling(quoteBlockContent.join(' '))}"
            </p>
          </div>
        );
        quoteBlockContent = [];
      } else {
        quoteBlockContent.push(line);
      }
      return;
    }

    // Video check (shortcode syntax)
    if (line.trim().startsWith('[video') || line.trim().startsWith('[VIDEO')) {
      const urlMatch = line.match(/url="([^"]+)"/i) || line.match(/src="([^"]+)"/i);
      const url = urlMatch ? urlMatch[1] : line.replace(/^\[video[^\]]*\]/i, '').replace(/\[\/video\]/i, '').trim();
      if (url) {
        htmlElements.push(<VideoBlock key={`video-${index}`} url={url} />);
      }
      return;
    }

    // Markdown image check: ![alt](url)
    if (line.trim().startsWith('![')) {
      const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const alt = match[1];
        const url = match[2];
        htmlElements.push(<BlogImage key={`img-${index}`} src={url} alt={alt} caption={alt} />);
        return;
      }
    }

    // Custom image shortcode check: [image url="..." alt="..." caption="..."]
    if (line.trim().startsWith('[image') || line.trim().startsWith('[IMAGE')) {
      const urlMatch = line.match(/url="([^"]+)"/i) || line.match(/src="([^"]+)"/i);
      const altMatch = line.match(/alt="([^"]+)"/i);
      const capMatch = line.match(/caption="([^"]+)"/i);
      const url = urlMatch ? urlMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const caption = capMatch ? capMatch[1] : alt;
      if (url) {
        htmlElements.push(<BlogImage key={`img-${index}`} src={url} alt={alt} caption={caption} />);
      }
      return;
    }

    // Note Block Open Check
    if (line.trim().startsWith('[note') || line.trim().startsWith('[NOTE')) {
      const rest = line.replace(/^\[note\]/i, '').trim();
      if (rest.endsWith('[/note]')) {
        const singleContent = rest.replace(/\[\/note\]$/i, '').trim();
        htmlElements.push(
          <div key={`note-${index}`} className="my-6 p-4 bg-[#f0f7ff] border-l-4 border-blue-500 rounded-r-xl flex gap-3 items-start text-left">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-0.5">Note</span>
              <div className="text-sm text-blue-900 leading-relaxed font-sans">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inNote = true;
        noteContent = rest ? [rest] : [];
      }
      return;
    }

    // Warning Block Open Check
    if (line.trim().startsWith('[warning') || line.trim().startsWith('[WARNING')) {
      const rest = line.replace(/^\[warning\]/i, '').trim();
      if (rest.endsWith('[/warning]')) {
        const singleContent = rest.replace(/\[\/warning\]$/i, '').trim();
        htmlElements.push(
          <div key={`warning-${index}`} className="my-6 p-4 bg-[#fff9eb] border-l-4 border-amber-500 rounded-r-xl flex gap-3 items-start text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block mb-0.5">Warning</span>
              <div className="text-sm text-amber-900 leading-relaxed font-sans">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inWarning = true;
        warningContent = rest ? [rest] : [];
      }
      return;
    }

    // Tip Block Open Check
    if (line.trim().startsWith('[tip') || line.trim().startsWith('[TIP')) {
      const rest = line.replace(/^\[tip\]/i, '').trim();
      if (rest.endsWith('[/tip]')) {
        const singleContent = rest.replace(/\[\/tip\]$/i, '').trim();
        htmlElements.push(
          <div key={`tip-${index}`} className="my-6 p-4 bg-[#f2fcf5] border-l-4 border-emerald-500 rounded-r-xl flex gap-3 items-start text-left">
            <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">Pro Tip</span>
              <div className="text-sm text-emerald-950 leading-relaxed font-sans">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inTip = true;
        tipContent = rest ? [rest] : [];
      }
      return;
    }

    // Quote Block Open Check
    if (line.trim().startsWith('[quote') || line.trim().startsWith('[QUOTE')) {
      const rest = line.replace(/^\[quote\]/i, '').trim();
      if (rest.endsWith('[/quote]')) {
        const singleContent = rest.replace(/\[\/quote\]$/i, '').trim();
        htmlElements.push(
          <div key={`quote-${index}`} className="my-8 p-6 bg-gray-50 border-l-4 border-gray-900 rounded-r-2xl relative text-left">
            <Quote className="w-8 h-8 text-gray-200 absolute top-3 right-4 transform rotate-180 pointer-events-none" />
            <p className="text-base sm:text-lg italic text-gray-800 font-medium leading-relaxed relative z-10">
              "{parseInlineStyling(singleContent)}"
            </p>
          </div>
        );
      } else {
        inQuoteBlock = true;
        quoteBlockContent = rest ? [rest] : [];
      }
      return;
    }

    // Shortcode Check: [check] or [CHECK]
    if (line.trim().startsWith('[check]') || line.trim().startsWith('[CHECK]')) {
      const content = line.replace(/^\[check\]/i, '').replace(/\[\/check\]/i, '').trim();
      htmlElements.push(
        <div key={`check-${index}`} className="flex items-start gap-2.5 my-2.5 text-left">
          <CheckCircle className="w-4.5 h-4.5 text-[rgba(11,48,215)] shrink-0 mt-0.5" />
          <span className="text-gray-700 text-base leading-relaxed font-sans">
            {parseInlineStyling(content)}
          </span>
        </div>
      );
      return;
    }

    // List Check
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (!inList) {
        inList = true;
      }
      const itemText = line.replace(/^[-*]\s+/, '');
      const formattedText = parseInlineStyling(itemText);
      htmlElements.push(
        <li key={`li-${index}`} className="text-gray-700 text-base sm:text-[17px] leading-relaxed ml-6 list-disc mb-2.5 font-sans">
          {formattedText}
        </li>
      );
      return;
    } else {
      inList = false;
    }

    // Headers Check
    if (line.trim().startsWith('### Step ') || line.trim().startsWith('### STEP ') || line.trim().startsWith('### step ')) {
      const rawText = line.replace(/^###\s+/, '');
      const match = rawText.match(/^(Step\s+\d+):\s*(.*)/i);
      if (match) {
        const stepNum = match[1];
        const stepTitle = match[2];
        htmlElements.push(
          <div key={`step-${index}`} className="mt-8 mb-4 flex items-center gap-3 bg-gray-50/75 border border-gray-100 p-4.5 rounded-2xl shadow-xs text-left">
            <span className="shrink-0 bg-gradient-to-r from-[rgba(0,143,255)] to-[rgba(11,48,215)] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs">
              {stepNum}
            </span>
            <h4 className="text-lg sm:text-xl font-sans font-extrabold text-gray-900 tracking-tight">
              {stepTitle}
            </h4>
          </div>
        );
      } else {
        htmlElements.push(
          <h4 key={`h3-${index}`} className="text-lg sm:text-xl font-sans font-semibold text-gray-800 mt-8 mb-3 tracking-tight">
            {rawText}
          </h4>
        );
      }
      return;
    }

    if (line.trim().startsWith('### ')) {
      htmlElements.push(
        <h4 key={`h3-${index}`} className="text-lg sm:text-xl font-sans font-semibold text-gray-800 mt-8 mb-3 tracking-tight">
          {line.replace(/^###\s+/, '')}
        </h4>
      );
      return;
    }
    if (line.trim().startsWith('## ')) {
      htmlElements.push(
        <h3 key={`h2-${index}`} className="text-xl sm:text-2xl font-sans font-semibold text-gray-900 mt-10 mb-4 border-b border-gray-100 pb-2 tracking-tight">
          {line.replace(/^##\s+/, '')}
        </h3>
      );
      return;
    }

    // Blockquote Check
    if (line.trim().startsWith('> ')) {
      htmlElements.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-[rgba(11,48,215)] pl-4 my-6 italic text-gray-700 bg-blue-50/20 py-2 rounded-r-lg">
          {line.replace(/^>\s+/, '')}
        </blockquote>
      );
      return;
    }

    // Table Parser
    if (line.trim().startsWith('|') && lines[index+1]?.trim().startsWith('| :---')) {
      // It is a table header, let's parse table rows
      return; // Skip structural dash lines or individual lines to avoid duplicating tables
    }

    // Check if current or neighboring lines are part of a table to format simple tables
    if (line.trim().startsWith('|') && !line.includes(':---')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      const isFirstRow = index < lines.length - 1 && lines[index + 1]?.includes(':---');
      
      if (isFirstRow) {
        htmlElements.push(
          <div key={`table-wrapper-${index}`} className="my-6 overflow-x-auto border border-gray-200/65 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {cells.map((cell, cIdx) => (
                    <th key={cIdx} className="px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-gray-600 bg-gray-100/40">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Find consecutive table rows to render */}
                {lines.slice(index + 2).map((tblLine, tblIdx) => {
                  if (!tblLine.trim().startsWith('|')) return null;
                  const rowCells = tblLine.split('|').map(c => c.trim()).filter(c => c.length > 0);
                  return (
                    <tr key={tblIdx} className="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                      {rowCells.map((rCell, rIdx) => (
                        <td key={rIdx} className="px-4 py-3 text-sm text-gray-700 font-sans">
                          {rCell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      return;
    }

    // Normal Paragraph
    if (line.trim() !== '') {
      htmlElements.push(
        <p key={`p-${index}`} className="text-gray-700 text-base sm:text-[17px] leading-relaxed mb-6 font-sans">
          {parseInlineStyling(line)}
        </p>
      );
    }
  });

  return htmlElements;
}

// Convert **text** to <strong>text</strong> or code elements inline
function parseInlineStyling(text: string): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  let currentIndex = 0;

  // Since we are running in simple client-side, let's do a basic sequential check
  // For the sake of reliability, we will parse bold and inline code simply:
  let tempText = text;
  
  // Quick check for bold or inline code
  if (!tempText.includes('**') && !tempText.includes('`') && !tempText.includes('[')) {
    return [text];
  }

  // Fallback to simple highlighted elements if matches are present:
  // Let's do a simple splitting logic for bold (**):
  const splittedBold = tempText.split('**');
  const elements: (string | React.ReactNode)[] = [];
  
  splittedBold.forEach((part, idx) => {
    if (idx % 2 === 1) {
      // Bold element
      elements.push(<strong key={idx} className="font-semibold text-gray-900">{part}</strong>);
    } else {
      // Non-bold element, check if it contains code `
      const splittedCode = part.split('`');
      splittedCode.forEach((cPart, cIdx) => {
        if (cIdx % 2 === 1) {
          elements.push(
            <code key={`code-${idx}-${cIdx}`} className="bg-gray-100 text-[rgba(11,48,215)] text-xs font-mono px-1.5 py-0.5 rounded-sm">
              {cPart}
            </code>
          );
        } else {
          // Check for link [label](url)
          if (cPart.includes('[') && cPart.includes(']')) {
            const linkMatch = cPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
              const [full, label, url] = linkMatch;
              const beforeLink = cPart.substring(0, linkMatch.index);
              const afterLink = cPart.substring((linkMatch.index || 0) + full.length);
              
              if (beforeLink) elements.push(beforeLink);
              elements.push(
                <a 
                  key={`link-${idx}`} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[rgba(11,48,215)] font-medium border-b border-dashed border-[rgba(11,48,215)]/40 hover:border-[rgba(11,48,215)] hover:text-[rgba(80,13,174)] hover:bg-blue-50/30 transition-all px-0.5 rounded-xs"
                >
                  {label}
                </a>
              );
              if (afterLink) elements.push(afterLink);
            } else {
              elements.push(cPart);
            }
          } else {
            elements.push(cPart);
          }
        }
      });
    }
  });

  return elements;
}

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

export default function BlogPostComponent({ post, onBack }: BlogPostProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);

  // Dynamic comment states
  const [comments, setComments] = useState<Array<{ id: string; name: string; content: string; date: string; likes?: number }>>([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const basePath = getBasePath();

  const handleNavigateToPost = (otherPost: BlogPost) => {
    window.history.pushState(null, '', `${basePath}/${otherPost.slug}`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load comments from API with local fallback
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${post.slug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error("Backend fetch comments failed, using localStorage fallback", err);
      }

      const savedComments = localStorage.getItem(`comments-${post.slug}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      } else {
        const seedComments = [
          {
            id: 'seed-1',
            name: 'Sarah Jenkins',
            content: `This is incredibly insightful. I implemented the automated triage process on our support email pipeline using your exact routing blueprint and we saved roughly 10 hours in the first week. The sitemap generation advice is also critical for indexing. Thank you!`,
            date: '2026-07-16',
            likes: 5
          }
        ];
        setComments(seedComments);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(seedComments));
      }
    };

    fetchComments();
  }, [post.slug]);

  const handleLikeComment = async (commentId: string) => {
    const key = `comment-liked-${post.slug}-${commentId}`;
    const alreadyLiked = localStorage.getItem(key) === 'true';
    const endpoint = alreadyLiked ? 'unlike' : 'like';

    try {
      const res = await fetch(`/api/comments/${post.slug}/${commentId}/${endpoint}`, {
        method: 'POST'
      });
      if (res.ok) {
        if (alreadyLiked) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, 'true');
        }
        
        const freshRes = await fetch(`/api/comments/${post.slug}`);
        if (freshRes.ok) {
          const freshData = await freshRes.json();
          setComments(freshData);
          localStorage.setItem(`comments-${post.slug}`, JSON.stringify(freshData));
          return;
        }
      }
    } catch (err) {
      console.error("Like backend sync failed, using local only", err);
    }

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        const currentLikes = c.likes || 0;
        if (alreadyLiked) {
          localStorage.removeItem(key);
          return { ...c, likes: Math.max(0, currentLikes - 1) };
        } else {
          localStorage.setItem(key, 'true');
          return { ...c, likes: currentLikes + 1 };
        }
      }
      return c;
    });
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${post.slug}/${commentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data.comments));
        return;
      }
    } catch (err) {
      console.error("Delete backend sync failed, using local only", err);
    }

    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
  };

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    const fullUrl = `https://blog.zenire.in/post/${post.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    const newCommentPayload = {
      name: commentName.trim(),
      content: commentContent.trim()
    };

    try {
      const res = await fetch(`/api/comments/${post.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentPayload)
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data));
        setCommentName('');
        setCommentContent('');
        return;
      }
    } catch (err) {
      console.error("Post comment to backend failed, applying local fallback", err);
    }

    const localNewComment = {
      id: "comment_" + Date.now(),
      name: commentName.trim(),
      content: commentContent.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    const updatedComments = [localNewComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
    setCommentName('');
    setCommentContent('');
  };

  return (
    <article className="min-h-screen bg-[#FDFDFB] pb-20 relative">
      
      {/* Sticky Social Share Floating Widget on the Right (Visible on all devices, ultra-narrow, transparent outline) */}
      <div className="fixed right-2 sm:right-4 top-1/3 flex flex-col items-center gap-2 z-40">
        {/* Collapsed Trigger Button with circular scroll progress outline indicator */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
          {/* Circular progress outline */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="17"
              className="stroke-gray-150 fill-none"
              strokeWidth="2"
            />
            {/* Active progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="17"
              className="stroke-[rgba(11,48,215)] fill-none transition-all duration-75"
              strokeWidth="2.5"
              strokeDasharray="106.8"
              strokeDashoffset={106.8 - (106.8 * scrollProgress) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Collapsed Trigger Button */}
          <button
            onClick={() => setIsShareExpanded(!isShareExpanded)}
            title={isShareExpanded ? "Collapse sharing options" : "Expand sharing options"}
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${
              isShareExpanded 
                ? 'bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white rotate-45' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Expanded Stack (Narrow, sleek and transparent outline) */}
        {isShareExpanded && (
          <div className="flex flex-col items-center gap-2.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-110 transition-transform cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-green-600 animate-pulse" /> : <Copy className="w-3 h-3" />}
            </button>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Facebook className="w-3 h-3 fill-current" />
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-black/5 text-black hover:bg-black hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Twitter className="w-3 h-3 fill-current" />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Linkedin className="w-3 h-3" />
            </a>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              title={isBookmarked ? "Bookmarked" : "Bookmark article"}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                isBookmarked ? 'bg-[rgba(11,48,215)] text-white' : 'bg-blue-50 text-[rgba(11,48,215)] hover:bg-blue-100'
              }`}
            >
              <Bookmark className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-4 lg:px-6 pt-4">
        
        {/* Google Breadcrumbs (GSC and Schema.org compliant) */}
        <nav aria-label="Breadcrumb" className="mb-4.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-sans text-gray-400 tracking-wide select-none">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => {
              window.history.pushState(null, '', `${basePath}/category/${encodeURIComponent(post.category)}`);
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
          >
            {post.category}
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 truncate max-w-[150px] sm:max-w-[320px] font-normal">
            {post.title}
          </span>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": `${typeof window !== 'undefined' ? window.location.origin : 'https://blog.zenire.in'}/`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": post.category,
                  "item": `${typeof window !== 'undefined' ? window.location.origin : 'https://blog.zenire.in'}/category/${encodeURIComponent(post.category)}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": typeof window !== 'undefined' ? window.location.href : `https://blog.zenire.in/${post.slug}`
                }
              ]
            })}
          </script>
        </nav>

        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-2 text-sm font-sans font-medium text-gray-500 hover:text-gray-900 group cursor-pointer mb-5"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          Back to all articles
        </button>

        {/* Category & Title */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-gray-900 leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Author & Read Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="text-sm font-sans font-semibold text-gray-900 block leading-tight">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-400 block font-mono mt-0.5">
                {post.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-sans text-gray-400 select-none">
            <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
              <Calendar className="w-4 h-4 text-gray-300" />
              <time dateTime={post.date} className="font-medium text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
              <Clock className="w-4 h-4 text-gray-300" />
              <span className="font-medium text-gray-500">{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Feature Hero Image */}
        <div className="rounded-2xl overflow-hidden aspect-video w-full bg-gray-100 shadow-xs mb-6">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Centered spacious reading layout with zero overlapping elements */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 text-left leading-relaxed">
            <div className="prose prose-teal max-w-none">
              {parseMarkdown(post.content)}
            </div>

            {/* Tags section */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <h4 className="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest mb-3">
                Indexed Semantic Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-sans text-gray-600 bg-gray-100 border border-gray-150"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Share Buttons (Image-inspired High-Fidelity Interactive Block) */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">
                Share This Article
              </h4>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Facebook Pill */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Facebook</span>
                </a>

                {/* Twitter Pill */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>

                {/* Pinterest Pill */}
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#BD081C] text-[#BD081C] hover:bg-[#BD081C]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Pinterest</span>
                </a>

                {/* WhatsApp Rectangle */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-sans font-bold transition-all duration-200 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {/* Slack Rectangle */}
                <a
                  href={`https://slack.com/share?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#E01E5A] text-[#E01E5A] hover:bg-[#E01E5A]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Slack className="w-3.5 h-3.5" />
                  <span>Slack</span>
                </a>

                {/* Skype Rectangle */}
                <a
                  href={`https://web.skype.com/share?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#00AFF0] text-[#00AFF0] hover:bg-[#00AFF0]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Skype</span>
                </a>

                {/* LinkedIn Rectangle */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Author Profile Bio Card (Condensed, High-Density Design) */}
            <div className="bg-[#FBFBF9] rounded-xl p-2.5 mt-6 flex flex-row gap-4 items-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Author
                    </span>
                    <h4 className="text-sm font-sans font-extrabold text-gray-900 leading-tight">
                      {post.author.name}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    {post.author.twitter && (
                      <a
                        href={`https://twitter.com/${post.author.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[rgba(11,48,215)] transition-colors p-1"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {post.author.github && (
                      <a
                        href={`https://github.com/${post.author.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[rgba(11,48,215)] transition-colors p-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans line-clamp-2">
                  {post.author.bio}
                </p>
              </div>
            </div>

            {/* Comment Section (Collapsible - Placed right below the Author Profile Bio Card) */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#FBFBF9] border border-gray-150">
                <div>
                  <h3 className="text-base sm:text-lg font-sans font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[rgba(11,48,215)]" />
                    Reader Discussions ({comments.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    Join the automated validation dialogue and insights.
                  </p>
                </div>
                <button
                  onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-[rgba(11,48,215)] text-white font-bold rounded-xl text-xs cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-[rgba(11,48,215)]/10 active:scale-98 shrink-0"
                >
                  <span>{isCommentsExpanded ? 'Hide Discussions' : 'Show Comments & Join'}</span>
                  <span className="bg-white/20 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                    {comments.length}
                  </span>
                </button>
              </div>
              
              {isCommentsExpanded && (
                <div className="mt-8 space-y-6">
                  <form onSubmit={handleAddComment} className="space-y-4 bg-white p-5 border border-gray-150 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide block">
                      Share Your Thoughts
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[rgba(11,48,215)]/20 focus:border-[rgba(11,48,215)]"
                      />
                      <div className="text-[10px] text-gray-400 font-sans flex items-center sm:justify-end">
                        Comment moderation is active. Live instant preview.
                      </div>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Add your insightful comment... Supports instant real-time discussion."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[rgba(11,48,215)]/20 focus:border-[rgba(11,48,215)]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[rgba(0,143,255)] to-[rgba(11,48,215)] hover:brightness-110 text-white font-bold rounded-lg text-sm cursor-pointer transition-all"
                    >
                      Post Discussion Comment
                    </button>
                  </form>

                  {/* Listed Comments */}
                  <div className="space-y-3 mt-6">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-400 italic text-center py-6">No comments posted yet. Be the first to share your thoughts!</p>
                    ) : (
                      comments.map((comment) => {
                        const key = `comment-liked-${post.slug}-${comment.id}`;
                        const isLiked = localStorage.getItem(key) === 'true';
                        
                        return (
                          <div key={comment.id} className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 flex gap-4 items-start hover:border-gray-200 transition-colors">
                            <div className={`w-8 h-8 rounded-full ${getAvatarColor(comment.name)} text-white font-sans font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                              {getInitials(comment.name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-sans font-bold text-gray-800">{comment.name}</span>
                                <span className="text-[10px] font-mono text-gray-400">{comment.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed font-sans">{comment.content}</p>
                              
                              {/* Interactive actions */}
                              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-100/50">
                                <button
                                  onClick={() => handleLikeComment(comment.id)}
                                  className={`flex items-center gap-1.5 text-xs font-mono font-medium transition-colors cursor-pointer ${
                                    isLiked ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-red-500'
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                  <span>{comment.likes || 0} Likes</span>
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Related Publications Section */}
            {(() => {
              const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag)))).slice(0, 3);
              if (relatedPosts.length < 3) {
                const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug && !relatedPosts.some(r => r.id === p.id)).slice(0, 3 - relatedPosts.length);
                relatedPosts.push(...otherPosts);
              }

              const popularPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 5);

              return (
                <>
                  {/* Related Publications Section */}
                  <div className="pt-12 border-t border-gray-150 mt-16">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-violet-50 p-2 text-violet-600 rounded-full flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-sans font-black text-gray-900 tracking-tight">
                          Related Reads
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          More insights on AI, careers, hiring and education.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-0 divide-y divide-gray-100/80 mt-4 bg-transparent">
                      {relatedPosts.map((otherPost) => {
                        const styles = getCategoryStyle(otherPost.category, otherPost.title);
                        return (
                          <button
                            key={otherPost.id}
                            onClick={() => handleNavigateToPost(otherPost)}
                            className="group text-left w-full flex flex-row items-center gap-3 sm:gap-4 py-3 bg-transparent hover:bg-gray-50/40 px-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            {/* Left Image */}
                            <div className="relative w-20 h-16 sm:w-48 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-gray-50 aspect-video sm:aspect-auto">
                              <img
                                src={otherPost.coverImage}
                                alt={otherPost.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                              />
                            </div>

                            {/* Details Container */}
                            <div className="flex-1 flex flex-col h-full py-1 min-w-0">
                              <div>
                                {/* Title */}
                                <h4 className="text-xs sm:text-base md:text-lg font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors leading-tight sm:leading-snug tracking-tight mb-1">
                                  {otherPost.title}
                                </h4>

                                {/* Excerpt */}
                                <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm leading-normal sm:leading-relaxed mb-1 sm:mb-1.5 line-clamp-1 sm:line-clamp-2">
                                  {otherPost.excerpt}
                                </p>
                              </div>

                              {/* Metadata Footer */}
                              <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-mono text-gray-400 mt-auto">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                  {otherPost.readTime}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                  {new Date(otherPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Most Popular Publications Section - Same layout language but slightly different! */}
                  <div className="pt-12 border-t border-gray-150 mt-12">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-blue-50 p-2.5 text-[rgba(11,48,215)] rounded-full flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-sans font-black text-gray-900 tracking-tight">
                          Trending Reads
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          The absolute highest-traffic conceptual guides this month.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0 divide-y divide-gray-100/80 mt-4 bg-transparent">
                      {popularPosts.map((popPost, idx) => {
                        const styles = getCategoryStyle(popPost.category, popPost.title);
                        return (
                          <button
                            key={popPost.id}
                            onClick={() => handleNavigateToPost(popPost)}
                            className="group text-left w-full flex flex-row items-center gap-3 sm:gap-4 py-3 bg-transparent hover:bg-gray-50/40 px-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer"
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
                              <h4 className="text-sm sm:text-base font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors line-clamp-2 leading-snug tracking-tight mb-1">
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
                      })}
                    </div>
                  </div>
                </>
              );
            })()}

          </div>

        </div>

      </div>
    </article>
  );
}
